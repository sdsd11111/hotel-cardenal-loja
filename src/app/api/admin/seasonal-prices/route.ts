
import { NextResponse } from 'next/server';
import { query } from '@/lib/mysql';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const roomId = searchParams.get('roomId');

        let sql = 'SELECT * FROM room_seasonal_prices';
        const params = [];

        if (roomId) {
            sql += ' WHERE room_config_id = ?';
            params.push(roomId);
        }

        sql += ' ORDER BY start_date ASC';

        const prices = await query(sql, params);
        return NextResponse.json(prices);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { room_config_id, start_date, end_date, price_options_json } = body;

        // Validations
        if (!room_config_id || !start_date || !end_date || !price_options_json) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Check for overlaps (optional but recommended)
        // For now, allow overlaps, last one wins logic in frontend? Or strict? 
        // Strict is better but more complex. Let's just insert for now.

        const result: any = await query(
            `INSERT INTO room_seasonal_prices (room_config_id, start_date, end_date, price_options_json)
             VALUES (?, ?, ?, ?)`,
            [room_config_id, start_date, end_date, JSON.stringify(price_options_json)]
        );

        return NextResponse.json({ id: result.insertId, message: 'Seasonal price created' });
    } catch (error: any) {
        console.error('Error creating seasonal price:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
