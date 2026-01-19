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

        // --- AVAILABILITY CHECK ---
        const isAvailable = await checkAvailability(habitacion_id, fecha_entrada, fecha_salida);
        if (!isAvailable) {
            return NextResponse.json({
                error: 'La habitación no está disponible para las fechas seleccionadas.',
                code: 'ROOM_UNAVAILABLE'
            }, { status: 409 });
        }
        // --------------------------

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

// Helper: Check Availability
async function checkAvailability(habitacionId: any, fechaEntrada: any, fechaSalida: any) {
    if (!habitacionId || !fechaEntrada || !fechaSalida) return false;

    // Lógica: Buscar reservas con estado OK o CONFIRMADA que solapen.
    let sql = `SELECT id FROM reservas 
               WHERE habitacion_id = ? 
               AND estado IN ('OK', 'CONFIRMADA')
               AND (fecha_entrada < ? AND fecha_salida > ?)`;

    // Overlap: (start1 < end2) AND (end1 > start2)
    // Params order: [habitacionId, fechaSalida, fechaEntrada]
    const params = [habitacionId, fechaSalida, fechaEntrada];

    const rows: any = await query(sql, params);
    return rows.length === 0;
}

// PUT - Update reservation (Manual status change)
export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const { id, estado } = body;

        console.log('--- [API RESERVAS PUT] ---');
        console.log('RECIBIDO -> ID:', id, '| Estado:', estado);

        if (!id || !estado) {
            console.error('Error: Faltan campos (id, estado)');
            return NextResponse.json({ error: 'Faltan campos (id, estado)' }, { status: 400 });
        }

        const uppercaseEstado = String(estado).toUpperCase().trim();
        const numericId = parseInt(String(id));

        if (isNaN(numericId)) {
            console.error('Error: ID no es un número válido:', id);
            return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
        }

        console.log(`Ejecutando UPDATE reservas SET estado = '${uppercaseEstado}' WHERE id = ${numericId}`);

        const result: any = await query(
            `UPDATE reservas SET estado = ? WHERE id = ?`,
            [uppercaseEstado, numericId]
        );

        console.log('Resultado DB:', {
            affectedRows: result.affectedRows,
            changedRows: result.changedRows
        });

        if (result.affectedRows === 0) {
            console.warn(`Aviso: No se encontró ninguna reserva con ID ${numericId}`);
        }

        return NextResponse.json({
            success: true,
            message: result.affectedRows > 0 ? 'Estado actualizado' : 'No se encontró la reserva',
            affectedRows: result.affectedRows,
            nuevoEstado: uppercaseEstado
        }, {
            headers: { 'Cache-Control': 'no-store' }
        });
    } catch (error: any) {
        console.error('CRITICAL ERROR updating reserva:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
