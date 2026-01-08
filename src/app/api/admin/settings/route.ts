
import { NextResponse } from 'next/server';
import { query } from '@/lib/mysql';

export async function GET() {
    try {
        const settings = await query('SELECT * FROM hotel_settings ORDER BY category, display_name');
        return NextResponse.json(settings);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const { setting_key, setting_value } = body;

        if (!setting_key) {
            return NextResponse.json({ error: 'Falta la clave de configuración' }, { status: 400 });
        }

        await query(
            'UPDATE hotel_settings SET setting_value = ? WHERE setting_key = ?',
            [setting_value, setting_key]
        );

        return NextResponse.json({ success: true, message: 'Configuración actualizada' });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
