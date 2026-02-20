
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
            `INSERT INTO hotel_settings (setting_key, setting_value, display_name, description, category)
             VALUES (?, ?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)`,
            [setting_key, setting_value, setting_key, '', 'precios']
        );

        return NextResponse.json({ success: true, message: 'Configuración actualizada' });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
