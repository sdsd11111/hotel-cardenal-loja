import { NextResponse } from 'next/server';
import { query } from '@/lib/mysql';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { habitacion_id, fecha_entrada, fecha_salida, nombre_cliente, whatsapp, meta } = body;

        if (!habitacion_id || !fecha_entrada || !fecha_salida) {
            return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 });
        }

        const result: any = await query(
            `INSERT INTO reservas (habitacion_id, fecha_entrada, fecha_salida, nombre_cliente, whatsapp, estado, meta) 
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [habitacion_id, fecha_entrada, fecha_salida, nombre_cliente || 'Cliente Web', whatsapp || '', 'PENDIENTE', JSON.stringify(meta || {})]
        );

        return NextResponse.json({
            id: result.insertId,
            message: 'Reserva registrada correctamente (PENDIENTE)'
        });
    } catch (error: any) {
        console.error('Error saving reserva:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
