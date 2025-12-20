import { NextResponse } from 'next/server';
import { query } from '@/lib/mysql';

// GET - Get single client
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    try {
        const clientes = await query(
            `SELECT * FROM clientes WHERE id = ?`,
            [id]
        ) as any[];

        if (clientes.length === 0) {
            return NextResponse.json({ error: 'Cliente no encontrado' }, { status: 404 });
        }

        return NextResponse.json(clientes[0]);
    } catch (error: any) {
        console.error('Error fetching cliente:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// PUT - Update client
export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    try {
        const data = await request.json();

        await query(
            `UPDATE clientes SET
                nombre = ?,
                email = ?,
                telefono = ?,
                fecha_nacimiento = ?,
                ciudad_residencia = ?,
                pais = ?,
                profesion = ?,
                empresa = ?,
                como_nos_conocio = ?,
                instagram = ?,
                facebook = ?,
                preferencias_habitacion = ?,
                alergias_alimentarias = ?,
                notas_internas = ?,
                calificacion = ?,
                es_vip = ?,
                total_estadias = ?,
                ultima_estadia = ?
            WHERE id = ?`,
            [
                data.nombre,
                data.email,
                data.telefono || null,
                data.fecha_nacimiento || null,
                data.ciudad_residencia || null,
                data.pais || 'Ecuador',
                data.profesion || null,
                data.empresa || null,
                data.como_nos_conocio || null,
                data.instagram || null,
                data.facebook || null,
                data.preferencias_habitacion || null,
                data.alergias_alimentarias || null,
                data.notas_internas || null,
                data.calificacion || null,
                data.es_vip ? 1 : 0,
                data.total_estadias || 1,
                data.ultima_estadia || null,
                id
            ]
        );

        return NextResponse.json({
            success: true,
            message: 'Cliente actualizado correctamente'
        });
    } catch (error: any) {
        console.error('Error updating cliente:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// DELETE - Permanently delete client
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    try {
        // Permanent deletion - cannot be undone
        await query(
            `DELETE FROM clientes WHERE id = ?`,
            [id]
        );

        return NextResponse.json({
            success: true,
            message: 'Cliente eliminado permanentemente'
        });
    } catch (error: any) {
        console.error('Error deleting cliente:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
