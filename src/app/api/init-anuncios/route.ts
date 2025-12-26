
import { NextResponse } from 'next/server';
import { query } from '@/lib/mysql';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        // Create table for announcements
        await query(`
            CREATE TABLE IF NOT EXISTS anuncios (
                id INT AUTO_INCREMENT PRIMARY KEY,
                titulo VARCHAR(255) NOT NULL,
                descripcion TEXT,
                llamativo VARCHAR(100),
                imagen_url VARCHAR(255),
                imagen_blob LONGBLOB,
                imagen_mime VARCHAR(100),
                boton_texto VARCHAR(100),
                boton_link VARCHAR(255),
                activo BOOLEAN DEFAULT TRUE,
                posicion VARCHAR(50) DEFAULT 'bottom-right',
                estilo JSON,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);

        // Add columns if they don't exist
        try {
            await query(`ALTER TABLE anuncios ADD COLUMN imagen_blob LONGBLOB`);
        } catch (e) { /* Column may already exist */ }
        try {
            await query(`ALTER TABLE anuncios ADD COLUMN imagen_mime VARCHAR(100)`);
        } catch (e) { /* Column may already exist */ }

        // Check if there's any data
        const check = await query("SELECT COUNT(*) as count FROM anuncios") as any[];

        if (check[0].count === 0) {
            // Seed initial data
            await query(`
                INSERT INTO anuncios (titulo, descripcion, llamativo, boton_texto, boton_link, activo)
                VALUES 
                (
                    '¡Oferta de Temporada!', 
                    'Desayuno buffet gratis en todas tus reservas este fin de año.', 
                    'OFERTA ESPECIAL', 
                    'Ver Habitaciones', 
                    '/habitaciones', 
                    1
                )
            `);

            return NextResponse.json({ success: true, message: 'Table anuncios created and seeded' });
        }

        return NextResponse.json({ success: true, message: 'Table anuncios already exists and has data' });
    } catch (error: any) {
        console.error('Error initializing anuncios:', error);
        return NextResponse.json({ success: false, error: error.message, stack: error.stack }, { status: 500 });
    }
}
