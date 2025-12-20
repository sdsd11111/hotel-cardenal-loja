
import { NextResponse } from 'next/server';
import { query } from '@/lib/mysql';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        // Create table if not exists
        await query(`
            CREATE TABLE IF NOT EXISTS habitaciones (
                id INT AUTO_INCREMENT PRIMARY KEY,
                nombre VARCHAR(255) NOT NULL,
                slug VARCHAR(255) NOT NULL UNIQUE,
                descripcion TEXT,
                amenidades JSON,
                precio_texto VARCHAR(255),
                precio_numerico DECIMAL(10, 2),
                imagen VARCHAR(255),
                max_adultos INT DEFAULT 2,
                max_ninos INT DEFAULT 0,
                camas INT DEFAULT 1,
                activo BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);

        // Check if there's any data
        const check = await query("SELECT COUNT(*) as count FROM habitaciones") as any[];

        if (check[0].count === 0) {
            // Seed initial data
            await query(`
                INSERT INTO habitaciones (nombre, slug, descripcion, amenidades, precio_texto, precio_numerico, imagen, max_adultos, max_ninos, camas)
                VALUES 
                (
                    'Familiar Loft', 
                    'familiar-loft', 
                    'El refugio ideal para la familia en Loja. Distribución en dos niveles para máxima privacidad.', 
                    ?, 
                    'Desde $26.78 USD / Noche', 
                    26.78, 
                    '/images/habitaciones/familiar-loft-main.webp', 
                    4, 
                    2, 
                    2
                ),
                (
                    'Triple', 
                    'triple', 
                    'Versatilidad y comodidad compartida. Tres camas individuales con lencería de alta calidad.', 
                    ?, 
                    'Desde $26.78 USD / Noche', 
                    26.78, 
                    '/images/habitaciones/triple-main.webp', 
                    3, 
                    1, 
                    3
                ),
                (
                    'Doble Twin', 
                    'doble-twin', 
                    'Descanso independiente y profesional. Espacio funcional con escritorio y WiFi de alta velocidad.', 
                    ?, 
                    'Desde $26.78 USD / Noche', 
                    26.78, 
                    '/images/habitaciones/doble-twin-main.webp', 
                    2, 
                    0, 
                    2
                ),
                (
                    'Matrimonial', 
                    'matrimonial', 
                    'Intimidad y elegancia para dos. Cama matrimonial de lujo con detalles neoclásicos.', 
                    ?, 
                    'Desde $26.78 USD / Noche', 
                    26.78, 
                    '/images/habitaciones/matrimonial-main.webp', 
                    2, 
                    1, 
                    1
                )
            `, [
                JSON.stringify(['2 Camas', 'TV Grande', 'Vistas', 'WiFi', 'Parqueo']),
                JSON.stringify(['Tres Camas', 'WiFi', 'Climatización', 'Amenities']),
                JSON.stringify(['2 Camas', 'Escritorio', 'WiFi', 'Climatización']),
                JSON.stringify(['Cama King', 'Vistas', 'Climatización', 'Amenities'])
            ]);

            return NextResponse.json({ success: true, message: 'Table created and seeded' });
        }

        return NextResponse.json({ success: true, message: 'Table already exists and has data' });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message, stack: error.stack }, { status: 500 });
    }
}
