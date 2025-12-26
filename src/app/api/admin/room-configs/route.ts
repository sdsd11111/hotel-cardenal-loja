
import { NextResponse } from 'next/server';
import { query } from '@/lib/mysql';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const configs = await query('SELECT * FROM room_type_configs ORDER BY identifier ASC');
        return NextResponse.json(configs);
    } catch (error: any) {
        console.error('API Error fetching room configs:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
