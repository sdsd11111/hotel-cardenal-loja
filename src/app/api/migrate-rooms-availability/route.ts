
import { NextResponse } from 'next/server';
import { query } from '@/lib/mysql';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const columns = await query(`
            SELECT COLUMN_NAME 
            FROM information_schema.COLUMNS 
            WHERE TABLE_SCHEMA = DATABASE() 
            AND TABLE_NAME = 'habitaciones'
        `) as any[];

        const columnNames = columns.map(c => c.COLUMN_NAME.toLowerCase());

        if (!columnNames.includes('disponible')) {
            await query("ALTER TABLE habitaciones ADD COLUMN disponible BOOLEAN DEFAULT TRUE AFTER activo");
            console.log("Column disponible added to habitaciones");
        }

        if (!columnNames.includes('fecha_entrada')) {
            await query("ALTER TABLE habitaciones ADD COLUMN fecha_entrada DATETIME NULL AFTER disponible");
            console.log("Column fecha_entrada added to habitaciones");
        }

        if (!columnNames.includes('fecha_salida')) {
            await query("ALTER TABLE habitaciones ADD COLUMN fecha_salida DATETIME NULL AFTER fecha_entrada");
            console.log("Column fecha_salida added to habitaciones");
        }

        return NextResponse.json({ success: true, message: 'Habitaciones schema updated for availability' });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
