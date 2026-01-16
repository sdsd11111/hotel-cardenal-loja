import { NextRequest, NextResponse } from 'next/server';
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
        console.log('Client Transaction ID:', clientTransactionId);
        console.log('Update Existing ID:', updateExisting);
        console.log('Reservation Data:', reservationData);

        // === CASO 1: ACTUALIZACIÓN (REAGENDAR) ===
        if (updateExisting) {
            console.log('=== MODO ACTUALIZACIÓN/REAGENDAR ===');
            const newMeta = JSON.stringify({
                payphone_id: id,
                updated_at: new Date().toISOString(),
                peticiones: reservationData?.peticiones || '',
                pais: reservationData?.pais || '',
                reserva_para: reservationData?.reserva_para || 'mi',
                habitacion_nombre: reservationData?.habitacion_nombre || ''
            });

            const updated: any = await query(
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
                    reservationData?.fecha_entrada || new Date().toISOString().split('T')[0],
                    reservationData?.fecha_salida || new Date().toISOString().split('T')[0],
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

            console.log('Reserva actualizada:', updated);
            return NextResponse.json({ success: true, message: 'Reserva reagendada exitosamente' });
        }

        // === CASO 2: TRANSFERENCIA (CREAR PENDIENTE) ===
        if (id === 'TRANSFERENCIA') {
            console.log('=== MODO TRANSFERENCIA BANCARIA ===');
            try {
                await insertNewReserva(
                    reservationData?.precio || 0,
                    clientTransactionId,
                    id,
                    clientTransactionId,
                    reservationData
                );
                // syncWithClientes ya es llamado dentro de insertNewReserva, no duplicar.

                // Enviar correos de "Reserva Pendiente de Confirmación" (opcional, pero buena práctica)
                // Usamos la misma función pero el template debería indicar que falta pago. 
                // Por ahora enviamos el confirmación estándar o podríamos evitarlo hasta que el admin confirme.
                // Decisión: Enviamos correo para que el cliente tenga su respaldo de "Solicitud Recibida".
                await sendBookingEmails(reservationData, clientTransactionId);

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
            await insertNewReserva(
                reservationData?.precio || 0,
                clientTransactionId,
                id,
                clientTransactionId,
                reservationData
            );
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

                // Si el parámetro 'reserva' es un ID numérico (de la tabla reservas), actualizamos.
                // Si contiene 'PRUEBA' o no es numérico, insertamos una nueva.
                const isNumericId = /^\d+$/.test(reservaParam);

                if (isNumericId) {
                    // 1. ACTUALIZAR reserva existente (flujo real de checkout)
                    // Obtenemos los meta actuales para no perder información si es necesario, 
                    // o simplemente construimos el nuevo meta con lo que viene del checkout real.
                    const newMeta = JSON.stringify({
                        payphone_id: id,
                        verified_at: new Date().toISOString(),
                        peticiones: reservationData?.peticiones || '',
                        pais: reservationData?.pais || '',
                        reserva_para: reservationData?.reserva_para || 'mi',
                        habitacion_nombre: reservationData?.habitacion_nombre || ''
                    });

                    const updated: any = await query(
                        `UPDATE reservas 
                         SET estado = 'OK', 
                             numero_reserva = ?, 
                             precio = ?,
                             meta = ?
                         WHERE id = ?`,
                        [
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
    // Si viene vacío o no existe, usamos hoy. Pero si viene del checkout REAL, debería estar.
    const fechaEntrada = (reservationData?.fecha_entrada && reservationData.fecha_entrada !== '')
        ? reservationData.fecha_entrada
        : new Date().toISOString().split('T')[0];

    const fechaSalida = (reservationData?.fecha_salida && reservationData.fecha_salida !== '')
        ? reservationData.fecha_salida
        : new Date().toISOString().split('T')[0];

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
        // Separar nombre y apellidos si es posible
        const fullNombre = data?.nombre_cliente || 'Cliente Web';
        const parts = fullNombre.split(' ');
        const nombre = parts[0];
        const apellidos = parts.slice(1).join(' ') || '';

        await query(
            `INSERT INTO clientes (
                nombre, apellidos, email, telefono, fecha_entrada, fecha_salida,
                adultos, ninos, habitacion_preferida, motivo, pais, comentarios,
                activo, created_at, como_nos_conocio
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE 
                ultima_estadia = VALUES(fecha_entrada),
                total_estadias = total_estadias + 1,
                comentarios = VALUES(comentarios),
                pais = VALUES(pais)`,
            [
                nombre,
                apellidos,
                data?.email_cliente || null,
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
        console.log("Cliente sincronizado en 'Lista de Clientes'");
    } catch (err) {
        console.error("Error syncing with clientes table:", err);
    }
}

async function sendBookingEmails(data: any, reservationNumber: string) {
    const ownerEmail = "cristhopheryeah113@gmail.com";
    const guestEmail = data?.email_cliente;
    const guestName = data?.nombre_cliente || 'Huésped';
    const habitacion = data?.habitacion_nombre || data?.habitacion_id || 'No especificada';
    const checkIn = data?.fecha_entrada || 'No especificada';
    const checkOut = data?.fecha_salida || 'No especificada';

    try {
        // 1. Correo al Huésped
        if (guestEmail) {
            await transporter.sendMail({
                from: process.env.EMAIL_FROM,
                to: guestEmail,
                subject: '🏨 Confirmación de Reserva - Hotel El Cardenal',
                html: `
                    <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px;">
                        <h2 style="color: #2d5a3d; text-align: center;">¡Gracias por su reserva!</h2>
                        <p>Estimado/a <strong>${guestName}</strong>,</p>
                        <p>Su reserva ha sido confirmada exitosamente. Aquí están los detalles:</p>
                        <div style="background: #f9f9f9; padding: 15px; border-radius: 8px;">
                            <p><strong>Nro. Reserva:</strong> ${reservationNumber}</p>
                            <p><strong>Habitación:</strong> ${habitacion}</p>
                            <p><strong>Check-in:</strong> ${checkIn}</p>
                            <p><strong>Check-out:</strong> ${checkOut}</p>
                        </div>
                        <p>Le esperamos pronto en el Hotel El Cardenal.</p>
                        <hr style="border: none; border-top: 1px solid #eee;">
                        <p style="font-size: 12px; color: #666; text-align: center;">Loja, Ecuador | www.hotelelcardenalloja.com</p>
                    </div>
                `
            });
            console.log("Email de confirmación enviado al huésped:", guestEmail);
        }

        // 2. Correo al Dueño
        await transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to: ownerEmail,
            subject: `🔔 Nueva Reserva: ${guestName} - Hab. ${habitacion}`,
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px;">
                    <h2 style="color: #0071c2;">Notificación de Nueva Reserva</h2>
                    <p>Hola <strong>Hotel Cardenal</strong>,</p>
                    <p>Se ha registrado una nueva reserva pagada a través de la web:</p>
                    <div style="background: #f0f7ff; padding: 15px; border-radius: 8px; border-left: 4px solid #0071c2;">
                        <p><strong>Huésped:</strong> ${guestName}</p>
                        <p><strong>Habitación:</strong> ${habitacion}</p>
                        <p><strong>Check-in:</strong> ${checkIn}</p>
                        <p><strong>Check-out:</strong> ${checkOut}</p>
                        <p><strong>Nro. Transacción:</strong> ${reservationNumber}</p>
                    </div>
                    <p><a href="https://hotelelcardenalloja.com/admin/clientes" style="color: #0071c2; font-weight: bold;">Ver en el Panel Administrativo</a></p>
                </div>
            `
        });
        console.log("Email de notificación enviado al dueño:", ownerEmail);

    } catch (error) {
        console.error("Error al enviar correos de reserva:", error);
    }
}
