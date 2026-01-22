
import { NextResponse } from 'next/server';
import { query } from '@/lib/mysql';

export const dynamic = 'force-dynamic';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { start_date, end_date, price_options_json } = body;

        await query(
            `UPDATE room_seasonal_prices 
             SET start_date = ?, end_date = ?, price_options_json = ? 
             WHERE id = ?`,
            [start_date, end_date, JSON.stringify(price_options_json), id]
        );

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        await query('DELETE FROM room_seasonal_prices WHERE id = ?', [id]);
        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
