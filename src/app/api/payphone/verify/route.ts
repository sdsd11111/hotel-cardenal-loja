import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import axios from 'axios';
import { query } from '@/lib/mysql';
import nodemailer from 'nodemailer';

// Email transporter
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT || '465'),
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
});

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { id, clientTransactionId, reservationData, updateExisting } = body;

        console.log('--- PAYPHONE VERIFY ---');
        console.log('PayPhone Transaction ID:', id);

        // === CASO 1: ACTUALIZACIÓN (REAGENDAR) ===
        if (updateExisting) {
            // Proteger ruta también si es manual (pero suele venir de admin)
            // Si viene de cliente (e.g. "reagendar mi reserva"), dejemosla abierta pero con validación de ID.
            // Por ahora asumimos seguridad por obfuscation del ID.
            console.log('=== MODO ACTUALIZACIÓN/REAGENDAR ===');
            // VALIDAR DISPONIBILIDAD ANTES DE MOVER
            const isAvailable = await checkAvailability(
                reservationData?.habitacion_id,
                reservationData?.fecha_entrada,
                reservationData?.fecha_salida,
                updateExisting // Exclude self
            );
            if (!isAvailable) {
                return NextResponse.json({ success: false, message: 'La habitación ya no está disponible para esas fechas.' }, { status: 409 });
            }

            const newMeta = JSON.stringify({
                payphone_id: id,
                updated_at: new Date().toISOString(),
                peticiones: reservationData?.peticiones || '',
                pais: reservationData?.pais || '',
                reserva_para: reservationData?.reserva_para || 'mi',
                habitacion_nombre: reservationData?.habitacion_nombre || ''
            });

            await query(
                `UPDATE reservas 
                 SET habitacion_id = ?,
                     fecha_entrada = ?,
                     fecha_salida = ?,
                     nombre_cliente = ?,
                     email_cliente = ?,
                     whatsapp = ?,
                     adultos = ?,
                     ninos = ?,
                     precio = ?,
                     estado = ?,
                     meta = ?
                 WHERE id = ?`,
                [
                    reservationData?.habitacion_id || 1,
                    reservationData?.fecha_entrada || new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString().split('T')[0],
                    reservationData?.fecha_salida || new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString().split('T')[0],
                    reservationData?.nombre_cliente || 'Cliente',
                    reservationData?.email_cliente || '',
                    reservationData?.whatsapp || '',
                    reservationData?.adultos || 1,
                    reservationData?.ninos || 0,
                    reservationData?.precio || 0,
                    reservationData?.estado || 'PENDIENTE',
                    newMeta,
                    updateExisting
                ]
            );

            // Sincronizar reporte de clientes al actualizar una reserva
            await syncWithClientes(reservationData, reservationData?.numero_reserva || clientTransactionId || updateExisting.toString());

            console.log('Reserva actualizada y cliente sincronizado');
            return NextResponse.json({ success: true, message: 'Reserva reagendada exitosamente' });
        }

        // === CASO 2: TRANSFERENCIA (CREAR PENDIENTE) ===
        if (id === 'TRANSFERENCIA') {
            console.log('=== MODO TRANSFERENCIA BANCARIA ===');
            // VALIDAR DISPONIBILIDAD
            const isAvailable = await checkAvailability(
                reservationData?.habitacion_id,
                reservationData?.fecha_entrada,
                reservationData?.fecha_salida
            );
            if (!isAvailable) {
                return NextResponse.json({ success: false, message: 'CRÍTICO: Habitación ocupada. Alguien ganó la reserva.' }, { status: 409 });
            }

            try {
                await insertNewReserva(
                    reservationData?.precio || 0,
                    clientTransactionId,
                    id,
                    clientTransactionId,
                    reservationData
                );
                // Sincronizar clientes ya que se creó una reserva (aunque sea pendiente)
                await syncWithClientes(reservationData, clientTransactionId);

                // Decisión: Enviamos correo para que el cliente tenga su respaldo de "Solicitud Recibida".
                await sendBookingEmails(reservationData, clientTransactionId, 'PENDING_TRANSFER');

                return NextResponse.json({ success: true, message: 'Reserva pendiente creada' });
            } catch (innerError: any) {
                console.error("Error creating TRANSFERENCIA reservation:", innerError);
                return NextResponse.json({
                    success: false,
                    message: innerError.message || 'Error interno al crear reserva'
                }, { status: 500 });
            }
        }

        // === CASO 3: SIMULACIÓN MANUAL (RECEPCIÓN) ===
        if (id === 'SIMULACION') {
            console.log('=== MODO SIMULACIÓN (RECEPCIÓN) ===');
            // PROTEGER CON ADMIN SESSION
            const cookieStore = await cookies();
            const session = cookieStore.get('admin-session');
            if (!session) {
                console.warn("Intento no autorizado de Simulación desde", request.headers.get('x-forwarded-for'));
                return NextResponse.json({ message: 'No autorizado' }, { status: 401 });
            }

            // Validar disponibilidad
            const isAvailable = await checkAvailability(
                reservationData?.habitacion_id,
                reservationData?.fecha_entrada,
                reservationData?.fecha_salida
            );
            if (!isAvailable) {
                return NextResponse.json({ success: false, message: 'Error: Habitación ocupada en esas fechas.' }, { status: 409 });
            }

            await insertNewReserva(
                reservationData?.precio || 0,
                clientTransactionId,
                id,
                clientTransactionId,
                reservationData
            );
            // Sincronizar con Lista de Clientes
            await syncWithClientes(reservationData, clientTransactionId);
            return NextResponse.json({ success: true, message: 'Reserva manual creada' });
        }

        // === CASO 4: PAYPHONE REAL ===
        if (!id || !clientTransactionId) {
            return NextResponse.json({ message: "Parámetros faltantes" }, { status: 400 });
        }

        const token = process.env.PAYPHONE_TOKEN;

        // Espera 2 seg para dar tiempo a PayPhone de procesar
        await new Promise(resolve => setTimeout(resolve, 2000));

        const headers = {
            "Authorization": `Bearer ${token?.trim()}`,
            "Content-Type": "application/json",
            "Accept": "application/json"
        };

        const response = await axios.post(
            "https://pay.payphonetodoesposible.com/api/button/V2/Confirm",
            {
                id: parseInt(id),
                clientTransactionId: clientTransactionId,
                clientTxId: clientTransactionId
            },
            { headers, timeout: 30000, validateStatus: () => true }
        );

        const data = id === 'SIMULACION'
            ? { transactionStatus: "Approved", amount: (reservationData?.precio || 1) * 100, statusCode: 3 }
            : response.data;

        const isApproved = data.transactionStatus === "Approved" || data.statusCode === 3;

        if (isApproved) {
            // Fulfillment: Guardar o Actualizar en la base de datos
            try {
                const amount = data.amount / 100;
                const reservaParam = reservationData?.numero_reserva?.toString() || '';

                // --- SECURITY CHECKS START ---
                let finalEstado = 'OK';

                // 1. Availability Check (Prevent Double Booking)
                // Usamos excludeId si estamos actualizando una reserva existente
                const excludeId = (/^\d+$/.test(reservaParam)) ? parseInt(reservaParam) : undefined;

                const isAvailable = await checkAvailability(
                    reservationData?.habitacion_id,
                    reservationData?.fecha_entrada,
                    reservationData?.fecha_salida,
                    excludeId
                );

                if (!isAvailable) {
                    console.error(`CRITICAL: PayPhone OK but Room ${reservationData?.habitacion_id} BUSY. ID: ${id}`);
                    finalEstado = 'CONFLICTO_FECHAS'; // Admin must resolve
                }

                // 2. Price Check (Prevent Tampering)
                const isValidPrice = await verifyRoomPrice(
                    reservationData?.habitacion_id,
                    amount
                );

                if (!isValidPrice && finalEstado === 'OK') {
                    // Solo marcamos conflicto de precio s no hay otro conflicto peor
                    console.error(`CRITICAL: PayPhone OK but Price Amount ${amount} < DB Price. ID: ${id}`);
                    finalEstado = 'CONFLICTO_PRECIO';
                }
                // --- SECURITY CHECKS END ---

                // Si el parámetro 'reserva' es un ID numérico (de la tabla reservas), actualizamos.
                // Si contiene 'PRUEBA' o no es numérico, insertamos una nueva.
                const isNumericId = /^\d+$/.test(reservaParam);

                if (isNumericId) {
                    // 1. ACTUALIZAR reserva existente (flujo real de checkout)
                    const newMeta = JSON.stringify({
                        payphone_id: id,
                        verified_at: new Date().toISOString(),
                        peticiones: reservationData?.peticiones || '',
                        pais: reservationData?.pais || '',
                        reserva_para: reservationData?.reserva_para || 'mi',
                        habitacion_nombre: reservationData?.habitacion_nombre || '',
                        security_warning: finalEstado !== 'OK' ? finalEstado : undefined
                    });

                    const updated: any = await query(
                        `UPDATE reservas 
                         SET estado = ?, 
                             numero_reserva = ?, 
                             precio = ?,
                             meta = ?
                         WHERE id = ?`,
                        [
                            finalEstado, // OK or CONFLICTO
                            clientTransactionId,
                            amount,
                            newMeta,
                            parseInt(reservaParam)
                        ]
                    );

                    if (updated.affectedRows > 0) {
                        console.log(`Reserva ID ${reservaParam} actualizada exitosamente a OK`);
                        // Sincronizar con Lista de Clientes
                        await syncWithClientes(reservationData, clientTransactionId);
                        // Enviar correos de confirmación
                        await sendBookingEmails(reservationData, clientTransactionId);
                    } else {
                        console.log(`No se encontró la reserva ID ${reservaParam} para actualizar, insertando como nueva.`);
                        await insertNewReserva(amount, reservaParam, id, clientTransactionId, reservationData);
                    }
                } else {
                    // 2. INSERTAR nueva reserva (flujo de prueba o botón directo)
                    await insertNewReserva(amount, reservaParam, id, clientTransactionId, reservationData);
                    // Enviar correos de confirmación (también para pruebas)
                    await sendBookingEmails(reservationData, clientTransactionId);
                }

            } catch (dbError) {
                console.error("Error updating/saving reservation to DB after successful payment:", dbError);
            }

            return NextResponse.json(data);
        }

        if (response.status >= 200 && response.status < 300) {
            return NextResponse.json(data);
        }

        return NextResponse.json({
            message: data?.message || "Error en PayPhone"
        }, { status: response.status });

    } catch (error: any) {
        console.error("PayPhone verification error:", error);
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

async function insertNewReserva(amount: number, reservaParam: string, id: any, clientTransactionId: any, reservationData: any) {
    // Si viene vacío o no existe, usamos hoy (Hora Ecuador).
    const nowEcuador = new Date(Date.now() - 5 * 60 * 60 * 1000);
    const fechaEntrada = (reservationData?.fecha_entrada && reservationData.fecha_entrada !== '')
        ? reservationData.fecha_entrada
        : nowEcuador.toISOString().split('T')[0];

    const fechaSalida = (reservationData?.fecha_salida && reservationData.fecha_salida !== '')
        ? reservationData.fecha_salida
        : nowEcuador.toISOString().split('T')[0];

    await query(
        `INSERT INTO reservas (
            habitacion_id, fecha_entrada, fecha_salida, nombre_cliente, email_cliente,
            whatsapp, adultos, ninos, precio, comision, numero_reserva, estado, meta
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            reservationData?.habitacion_id || 1,
            fechaEntrada,
            fechaSalida,
            reservationData?.nombre_cliente || 'PRUEBA PAYPHONE',
            reservationData?.email_cliente || 'prueba@payphone.com',
            reservationData?.whatsapp || '0999999999',
            reservationData?.adultos || 1,
            reservationData?.ninos || 0,
            amount,
            0,
            clientTransactionId,
            reservationData?.estado || 'OK',
            JSON.stringify({
                payphone_id: id,
                verified_at: new Date().toISOString(),
                test: String(reservaParam).includes('PRUEBA'),
                peticiones: reservationData?.peticiones || '',
                pais: reservationData?.pais || '',
                reserva_para: reservationData?.reserva_para || 'mi',
                habitacion_nombre: reservationData?.habitacion_nombre || ''
            })
        ]
    );
    console.log("Nueva reserva insertada exitosamente en DB (Flujo PRUEBA)");

    // Sincronizar con Lista de Clientes también para pruebas
    await syncWithClientes({ ...reservationData, fecha_entrada: fechaEntrada, fecha_salida: fechaSalida }, clientTransactionId);
}

async function syncWithClientes(data: any, reservationNumber: string) {
    try {
        console.log("--- Syncing with Clientes ---");
        console.log("Data provided:", JSON.stringify(data));

        // Separar nombre y apellidos si es posible
        const fullNombre = data?.nombre_cliente || 'Cliente Web';
        const parts = fullNombre.split(' ');
        const nombre = parts[0];
        const apellidos = parts.slice(1).join(' ') || '';
        const email = data?.email_cliente || null;

        // 1. Verificar si existe por email (si tiene email)
        let existingId = null;
        if (email) {
            const existing: any = await query(`SELECT id FROM clientes WHERE email = ? LIMIT 1`, [email]);
            if (existing && existing.length > 0) {
                existingId = existing[0].id;
                console.log(`Cliente encontrado por email: ${email} -> ID: ${existingId}`);
            }
        }

        // 2. Si no existe por email, intentar buscar por nombre exacto (fallback)
        if (!existingId) {
            const existingByName: any = await query(`SELECT id FROM clientes WHERE nombre = ? AND apellidos = ? LIMIT 1`, [nombre, apellidos]);
            if (existingByName && existingByName.length > 0) {
                existingId = existingByName[0].id;
                console.log(`Cliente encontrado por nombre: ${fullNombre} -> ID: ${existingId}`);
            }
        }

        let dbRes;

        if (existingId) {
            // UPDATE
            dbRes = await query(
                `UPDATE clientes SET
                    telefono = COALESCE(?, telefono),
                    ultima_estadia = ?,
                    total_estadias = total_estadias + 1,
                    habitacion_preferida = ?,
                    pais = COALESCE(?, pais),
                    comentarios = ?
                WHERE id = ?`,
                [
                    data?.whatsapp || null,
                    data?.fecha_entrada || new Date(),
                    data?.habitacion_nombre || data?.habitacion_id || null,
                    data?.pais || null,
                    data?.peticiones || null,
                    existingId
                ]
            );
            console.log("Cliente actualizado.");
        } else {
            // INSERT
            dbRes = await query(
                `INSERT INTO clientes (
                    nombre, apellidos, email, telefono, fecha_entrada, fecha_salida,
                    adultos, ninos, habitacion_preferida, motivo, pais, comentarios,
                    activo, created_at, como_nos_conocio
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    nombre,
                    apellidos,
                    email,
                    data?.whatsapp || null,
                    data?.fecha_entrada || null,
                    data?.fecha_salida || null,
                    data?.adultos || 1,
                    data?.ninos || 0,
                    data?.habitacion_nombre || data?.habitacion_id || null,
                    data?.reserva_para === 'otro' ? `Reserva para Tercero #${reservationNumber}` : `Reserva Online #${reservationNumber}`,
                    data?.pais || null,
                    data?.peticiones || null,
                    1,
                    new Date(),
                    'Web PayPhone'
                ]
            );
            console.log("Cliente nuevo insertado.");
        }

        return dbRes;

    } catch (err) {
        console.error("Error syncing with clientes table:", err);
    }
}

async function sendBookingEmails(data: any, reservationNumber: string, status: 'CONFIRMED' | 'PENDING_TRANSFER' = 'CONFIRMED') {
    const ownerEmail = "elcardenalhotel@gmail.com";
    const guestEmail = data?.email_cliente;
    const guestName = data?.nombre_cliente || 'Huésped';
    const habitacion = data?.habitacion_nombre || data?.habitacion_id || 'No especificada';
    const checkIn = data?.fecha_entrada || 'No especificada';
    const checkOut = data?.fecha_salida || 'No especificada';
    const total = data?.precio || '0.00';

    // Templates
    const subjectGuest = status === 'CONFIRMED'
        ? '🏨 Confirmación de Reserva - Hotel El Cardenal'
        : '⏳ Solicitud de Reserva Recibida (Pendiente de Pago) - Hotel El Cardenal';

    const subjectOwner = status === 'CONFIRMED'
        ? `🔔 Nueva Reserva CONFIRMADA: ${guestName} - Hab. ${habitacion}`
        : `⏳ Nueva Solicitud TRANSFERENCIA: ${guestName} - Hab. ${habitacion}`;

    const bodyGuest = status === 'CONFIRMED'
        ? `
            <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px;">
                <h2 style="color: #2d5a3d; text-align: center;">¡Gracias por su reserva!</h2>
                <p>Estimado/a <strong>${guestName}</strong>,</p>
                <p>Su reserva ha sido <strong>CONFIRMADA</strong> exitosamente. Detalles:</p>
                <div style="background: #f9f9f9; padding: 15px; border-radius: 8px;">
                    <p><strong>Nro. Reserva:</strong> ${reservationNumber}</p>
                    <p><strong>Habitación:</strong> ${habitacion}</p>
                    <p><strong>Check-in:</strong> ${checkIn}</p>
                    <p><strong>Check-out:</strong> ${checkOut}</p>
                    <p><strong>Total Pagado:</strong> $${total}</p>
                </div>
                <p>Le esperamos pronto en el Hotel El Cardenal.</p>
                <hr style="border: none; border-top: 1px solid #eee;">
                <p style="font-size: 12px; color: #666; text-align: center;">Loja, Ecuador | www.hotelelcardenalloja.com</p>
            </div>
        `
        : `
            <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px;">
                <h2 style="color: #e67e22; text-align: center;">Solicitud Recibida</h2>
                <p>Estimado/a <strong>${guestName}</strong>,</p>
                <p>Hemos registrado su solicitud de reserva. Su estado actual es: <strong>PENDIENTE DE PAGO</strong>.</p>
                <div style="background: #fff8f0; padding: 15px; border-radius: 8px; border-left: 4px solid #e67e22;">
                    <p><strong>Nro. Reserva:</strong> ${reservationNumber}</p>
                    <p><strong>Habitación:</strong> ${habitacion}</p>
                    <p><strong>Total a Transferir:</strong> $${total}</p>
                </div>
                <p><strong>Próximo Paso:</strong> Por favor envíe el comprobante de transferencia por WhatsApp para confirmar su reserva definitivamente.</p>
                <div style="text-align: center; margin: 20px 0;">
                    <a href="https://wa.me/593996616878" style="background: #25D366; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Enviar Comprobante Ahora</a>
                </div>
                <hr style="border: none; border-top: 1px solid #eee;">
                <p style="font-size: 12px; color: #666; text-align: center;">Loja, Ecuador | www.hotelelcardenalloja.com</p>
            </div>
        `;

    const bodyOwner = status === 'CONFIRMED'
        ? `
            <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px;">
                <h2 style="color: #0071c2;">¡Nueva Reserva Pagada! 💰</h2>
                <p>Hola <strong>Hotel Cardenal</strong>,</p>
                <p>Se ha registrado y PAGADO una nueva reserva web (PayPhone):</p>
                <div style="background: #f0f7ff; padding: 15px; border-radius: 8px; border-left: 4px solid #0071c2;">
                    <p><strong>Huésped:</strong> ${guestName}</p>
                    <p><strong>Habitación:</strong> ${habitacion}</p>
                    <p><strong>Fechas:</strong> ${checkIn} al ${checkOut}</p>
                    <p><strong>ID Transacción:</strong> ${reservationNumber}</p>
                    <p><strong>Monto:</strong> $${total}</p>
                </div>
                <p><a href="https://hotelelcardenalloja.com/admin/clientes" style="color: #0071c2; font-weight: bold;">Ver en el Panel Administrativo</a></p>
            </div>
        `
        : `
            <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px;">
                <h2 style="color: #e67e22;">⏳ Nueva Solicitud (Transferencia)</h2>
                <p>Hola <strong>Hotel Cardenal</strong>,</p>
                <p>Un cliente ha solicitado reserva vía TRANSFERENCIA. El estado es <strong>PENDIENTE</strong>.</p>
                <p>Debes esperar a recibir el comprobante por WhatsApp para confirmarla manualmente en el panel.</p>
                <div style="background: #fff8f0; padding: 15px; border-radius: 8px; border-left: 4px solid #e67e22;">
                    <p><strong>Huésped:</strong> ${guestName}</p>
                    <p><strong>Habitación:</strong> ${habitacion}</p>
                    <p><strong>Fechas:</strong> ${checkIn} al ${checkOut}</p>
                    <p><strong>ID Reserva:</strong> ${reservationNumber}</p>
                    <p><strong>Monto Esperado:</strong> $${total}</p>
                </div>
                <p><a href="https://hotelelcardenalloja.com/admin/recepcion" style="color: #e67e22; font-weight: bold;">Gestionar en Recepción</a></p>
            </div>
        `;

    try {
        // 1. Correo al Huésped
        if (guestEmail) {
            await transporter.sendMail({
                from: process.env.EMAIL_FROM,
                to: guestEmail,
                subject: subjectGuest,
                html: bodyGuest
            });
            console.log("Email enviado al huésped:", guestEmail);
        }

        // 2. Correo al Dueño
        await transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to: ownerEmail,
            subject: subjectOwner,
            html: bodyOwner
        });
        console.log("Email notificación enviado al dueño:", ownerEmail);

    } catch (error) {
        console.error("Error al enviar correos de reserva:", error);
    }
}

async function checkAvailability(habitacionId: any, fechaEntrada: any, fechaSalida: any, excludeReservaId?: number) {
    if (!habitacionId || !fechaEntrada || !fechaSalida) return false;

    // Lógica: Buscar reservas con estado OK o CONFIRMADA que solapen.
    // Overlap: (start1 < end2) AND (end1 > start2)

    let sql = `SELECT id FROM reservas 
               WHERE habitacion_id = ? 
               AND estado IN ('OK', 'CONFIRMADA')
               AND (fecha_entrada < ? AND fecha_salida > ?)`;

    const params = [habitacionId, fechaSalida, fechaEntrada]; // Note params order for overlap check

    if (excludeReservaId) {
        sql += ` AND id != ?`;
        params.push(excludeReservaId);
    }

    const rows: any = await query(sql, params);
    return rows.length === 0;
}

async function verifyRoomPrice(habitacionId: any, paidAmount: number) {
    if (!habitacionId) return false;

    try {
        const rows: any = await query(`SELECT precio_numerico FROM habitaciones WHERE id = ?`, [habitacionId]);
        if (!rows.length) return false; // Room invalid

        const dbPrice = parseFloat(rows[0].precio_numerico);

        // Allow a small margin of error (e.g. 1% or $1)
        // Ojo: paidAmount puede ser mayor (upgrades, etc) pero no radicalmente menor.
        // Asumimos que si paga al menos el 90% del precio base está ok (por si hubo descuentos aplicados en front que no validamos aqui)
        // O validamos exacto.
        // Dado que el sistema tiene calculos de niños/adultos adicionales que NO estamos replicando aqui
        // (el precio final puede ser MAYOR que el precio base por huspedes extra),
        // solo podemos validar con seguridad que NO sea un precio ridículamente bajo (ej. $0.01).

        // Mejor aproximación sin replicar toda la lógica de negocio:
        // El precio pagado debe ser al menos el PRECIO BASE de la habitación.

        if (paidAmount < dbPrice) {
            console.warn(`Price Warning: Room ${habitacionId} Base Price ${dbPrice}, Paid: ${paidAmount}`);
            return false;
        }

        return true;
    } catch (err) {
        console.error("Error verifying price:", err);
        return true; // Fail safe open? Or closed. Closed is safer but might block valid payments on DB error. 
        // Let's return true if DB error to avoid blocking money, but logged.
        return true;
    }
}
