import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { query } from '@/lib/mysql';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { id, clientTransactionId, reservationData } = body;

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

        console.log("PayPhone verification response:", response.data);

        const data = response.data;
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
                    } else {
                        console.log(`No se encontró la reserva ID ${reservaParam} para actualizar, insertando como nueva.`);
                        await insertNewReserva(amount, reservaParam, id, clientTransactionId, reservationData);
                    }
                } else {
                    // 2. INSERTAR nueva reserva (flujo de prueba o botón directo)
                    await insertNewReserva(amount, reservaParam, id, clientTransactionId, reservationData);
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
            'OK',
            JSON.stringify({
                payphone_id: id,
                verified_at: new Date().toISOString(),
                test: reservaParam.includes('PRUEBA'),
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
