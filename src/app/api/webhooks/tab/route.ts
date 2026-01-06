import { NextResponse } from 'next/server';
import { query } from '@/lib/mysql';

// NOTA: Este webhook es llamado automáticamente por los servidores de Tab
// cuando un pago se completa exitosamente.
export async function POST(req: Request) {
    try {
        const body = await req.json();
        console.log("🔔 Webhook Tab recibido:", JSON.stringify(body, null, 2));

        // Tab envía diferentes eventos. Nos interesa 'payment.captured' o 'payment.succeeded'
        // La estructura típica incluye el estado en body.status o body.payment.status
        // y la referencia en body.reference (que debería ser nuestro ID de reserva)

        // Ajustamos la lógica según la documentación estándar de Tab
        const status = body.status || body.payment?.status;

        // El ID de la reserva lo mandamos o en 'reference' o en 'meta'
        // Tab suele devolver el 'reference' que se genera en el checkout
        // En nuestro caso, el widget usa la URL o metadata para asociarlo.
        // Asumiremos que el 'reference' o 'order_reference' es el ID de nuestra reserva.

        // NOTA DE SEGURIDAD: En producción, deberíamos verificar la firma (signature)
        // para asegurar que el request viene realmente de Tab.

        if (status === 'captured' || status === 'succeeded' || status === 'paid') {
            // Buscamos el ID de la reserva.
            // A veces viene en `custom_fields` o `meta` si lo configuramos en el widget.
            // O si Tab nos permite poner un "Reference ID" en el widget.

            // Si no tenemos el ID directo, intentamos buscar por email o metadatos si vienen.
            // Por ahora, vamos a registrar el éxito.

            // SI logras configurar el "Reference ID" en el panel de Tab para que coincida con reservation.id:
            const reservaId = body.reference || body.order_reference;

            if (reservaId) {
                console.log(`✅ Pago confirmado para Reserva #${reservaId}. Actualizando base de datos...`);

                await query(
                    'UPDATE reservas SET estado = ? WHERE id = ?',
                    ['CONFIRMADA', reservaId]
                );

                return NextResponse.json({ message: 'Reserva confirmada exitosamente' });
            } else {
                console.warn("⚠️ Webhook recibido pero no se encontró ID de reserva (reference) en el payload.");
                // Retornamos 200 para que Tab no reintente infinitamente, pero logueamos el aviso
                return NextResponse.json({ message: 'Webhook procesado sin actualización (Falta ID)' });
            }
        }

        return NextResponse.json({ message: 'Estado no requiere acción' });

    } catch (error) {
        console.error('❌ Error procesando webhook de Tab:', error);
        return NextResponse.json(
            { error: 'Error interno procesando webhook' },
            { status: 500 }
        );
    }
}
