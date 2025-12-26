import { NextResponse } from 'next/server';
import { query } from '@/lib/mysql';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// GET - List all reservations
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const desde = searchParams.get('desde');
        const hasta = searchParams.get('hasta');
        const tipoFecha = searchParams.get('tipoFecha') || 'entrada'; // entrada or reserva

        let sql = `SELECT * FROM reservas`;
        const params: any[] = [];

        if (desde && hasta) {
            const column = tipoFecha === 'entrada' ? 'fecha_entrada' : 'created_at';
            sql += ` WHERE ${column} BETWEEN ? AND ?`;
            params.push(desde, hasta);
        }

        sql += ` ORDER BY created_at DESC`;

        const queryResult = await query(sql, params);
        const reservas = Array.isArray(queryResult) ? (queryResult as any[]) : [];

        console.log(`GET /api/reservas - Encontradas ${reservas.length} reservas`);
        if (reservas.length > 0) {
            console.log('Primera reserva (vía API):', {
                id: reservas[0].id,
                nombre: reservas[0].nombre_cliente,
                estado: reservas[0].estado
            });
        }

        const response = NextResponse.json(reservas);
        response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        response.headers.set('Pragma', 'no-cache');
        response.headers.set('Expires', '0');
        return response;
    } catch (error: any) {
        console.error('Error fetching reservas:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// POST - Create new reservation (Pending)
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const {
            habitacion_id,
            fecha_entrada,
            fecha_salida,
            nombre_cliente,
            email_cliente,
            whatsapp,
            adultos,
            ninos,
            precio,
            comision,
            numero_reserva,
            meta
        } = body;

        if (!habitacion_id || !fecha_entrada || !fecha_salida) {
            return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 });
        }

        const result: any = await query(
            `INSERT INTO reservas (
                habitacion_id, fecha_entrada, fecha_salida, nombre_cliente, email_cliente,
                whatsapp, adultos, ninos, precio, comision, numero_reserva, estado, meta
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                habitacion_id,
                fecha_entrada,
                fecha_salida,
                nombre_cliente || 'Cliente Web',
                email_cliente || null,
                whatsapp || '',
                adultos || 2,
                ninos || 0,
                precio || 0,
                comision || 0,
                numero_reserva || null,
                'PENDIENTE',
                JSON.stringify(meta || {})
            ]
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

// PUT - Update reservation (Manual status change)
export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const { id, estado } = body;

        console.log('--- API RESERVAS PUT ---');
        console.log('ID:', id);
        console.log('Estado recibido:', estado);

        if (!id || !estado) {
            return NextResponse.json({ error: 'Faltan campos (id, estado)' }, { status: 400 });
        }

        const uppercaseEstado = estado.toUpperCase();
        console.log('Estado a guardar:', uppercaseEstado);

        // Simplificamos omitiendo updated_at manual ya que MySQL lo maneja
        const result: any = await query(
            `UPDATE reservas SET estado = ? WHERE id = ?`,
            [uppercaseEstado, id]
        );

        const warnings: any = await query('SHOW WARNINGS');
        console.log('Warnings DB:', warnings);
        console.log('Resultado DB:', result);

        return NextResponse.json({
            success: true,
            message: 'Estado actualizado',
            affectedRows: result.affectedRows,
            changedRows: result.changedRows,
            nuevoEstado: uppercaseEstado
        }, {
            headers: { 'Cache-Control': 'no-store' }
        });
    } catch (error: any) {
        console.error('Error updating reserva:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
