
import { NextResponse } from 'next/server';
import { query } from '@/lib/mysql';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        console.log('Adding date columns to anuncios table...');

        // Add fecha_inicio
        try {
            await query(`
                ALTER TABLE anuncios 
                ADD COLUMN fecha_inicio DATE NULL AFTER temporada;
            `);
        } catch (e: any) {
            if (e.errno !== 1060) throw e;
        }

        // Add fecha_fin
        try {
            await query(`
                ALTER TABLE anuncios 
                ADD COLUMN fecha_fin DATE NULL AFTER fecha_inicio;
            `);
        } catch (e: any) {
            if (e.errno !== 1060) throw e;
        }

        return NextResponse.json({ success: true, message: 'Date columns added successfully' });
    } catch (error: any) {
        console.error('Error adding columns:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
