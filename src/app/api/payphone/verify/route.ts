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
            // Fulfillment: Guardar en la base de datos
            try {
                // Si vienen datos de reserva desde el frontend (del localStorage o params), los usamos.
                // Si no, usamos valores por defecto para la "Prueba de $1"
                const amount = data.amount / 100;

                await query(
                    `INSERT INTO reservas (
                        habitacion_id, fecha_entrada, fecha_salida, nombre_cliente, email_cliente,
                        whatsapp, adultos, ninos, precio, comision, numero_reserva, estado, meta
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    [
                        reservationData?.habitacion_id || 'HAB-TEST',
                        reservationData?.fecha_entrada || new Date().toISOString().split('T')[0],
                        reservationData?.fecha_salida || new Date().toISOString().split('T')[0],
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
                            test: clientTransactionId.includes('PRUEBA')
                        })
                    ]
                );
                console.log("Reserva guardada exitosamente en DB tras pago OK");
            } catch (dbError) {
                console.error("Error saving reservation to DB after successful payment:", dbError);
                // No bloqueamos la respuesta al cliente, ya que el pago fue exitoso
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
