
import { NextResponse } from 'next/server';
import { query } from '@/lib/mysql';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        console.log('Adding temporada column to anuncios table...');
        await query(`
            ALTER TABLE anuncios 
            ADD COLUMN temporada VARCHAR(100) DEFAULT 'General' AFTER titulo;
        `);
        return NextResponse.json({ success: true, message: 'Column temporada added successfully' });
    } catch (error: any) {
        console.error('Error adding column:', error);
        // If error code is duplicate column, that's fine
        if (error.errno === 1060) {
            return NextResponse.json({ success: true, message: 'Column already exists' });
        }
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
