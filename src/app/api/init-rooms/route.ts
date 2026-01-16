
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
                price_options_json JSON,
                max_adultos INT DEFAULT 2,
                max_ninos INT DEFAULT 0,
                ninos_gratis INT DEFAULT 1,
                precio_nino_extra DECIMAL(10, 2) DEFAULT 0.00,
                incluye_desayuno BOOLEAN DEFAULT FALSE,
                incluye_almuerzo BOOLEAN DEFAULT FALSE,
                incluye_cena BOOLEAN DEFAULT FALSE,
                camas INT DEFAULT 1,
                activo BOOLEAN DEFAULT TRUE,

                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);

        // Add new columns for existing tables (will silently fail if they already exist)
        try {
            await query(`ALTER TABLE habitaciones ADD COLUMN ninos_gratis INT DEFAULT 1`);
        } catch (e) { /* Column may already exist */ }
        try {
            await query(`ALTER TABLE habitaciones ADD COLUMN precio_nino_extra DECIMAL(10,2) DEFAULT 0.00`);
        } catch (e) { /* Column may already exist */ }
        try {
            await query(`ALTER TABLE habitaciones ADD COLUMN incluye_desayuno BOOLEAN DEFAULT FALSE`);
        } catch (e) { /* Column may already exist */ }
        try {
            await query(`ALTER TABLE habitaciones ADD COLUMN incluye_almuerzo BOOLEAN DEFAULT FALSE`);
        } catch (e) { /* Column may already exist */ }
        try {
            await query(`ALTER TABLE habitaciones ADD COLUMN incluye_cena BOOLEAN DEFAULT FALSE`);
        } catch (e) { /* Column may already exist */ }
        try {
            await query(`ALTER TABLE habitaciones ADD COLUMN price_options_json JSON`);
        } catch (e) { /* Column may already exist */ }

        // Backfill price_options_json if it's null (for existing data)
        await query(`UPDATE habitaciones SET price_options_json = ? WHERE slug = 'familiar-loft' AND price_options_json IS NULL`, [
            JSON.stringify([
                { personas: 2, precioBase: 65, impuestos: 0 },
                { personas: 3, precioBase: 75, impuestos: 0 },
                { personas: 4, precioBase: 85, impuestos: 0 }
            ])
        ]);
        await query(`UPDATE habitaciones SET price_options_json = ? WHERE slug = 'triple' AND price_options_json IS NULL`, [
            JSON.stringify([
                { personas: 3, precioBase: 55, impuestos: 0 },
                { personas: 4, precioBase: 65, impuestos: 0 }
            ])
        ]);
        await query(`UPDATE habitaciones SET price_options_json = ? WHERE slug = 'doble-twin' AND price_options_json IS NULL`, [
            JSON.stringify([
                { personas: 1, precioBase: 35, impuestos: 0 },
                { personas: 2, precioBase: 45, impuestos: 0 },
                { personas: 3, precioBase: 55, impuestos: 0 }
            ])
        ]);
        await query(`UPDATE habitaciones SET price_options_json = ? WHERE slug = 'matrimonial' AND price_options_json IS NULL`, [
            JSON.stringify([
                { personas: 1, precioBase: 35, impuestos: 0 },
                { personas: 2, precioBase: 45, impuestos: 0 }
            ])
        ]);


        // Check if there's any data
        const check = await query("SELECT COUNT(*) as count FROM habitaciones") as any[];


        if (check[0].count === 0) {
            // Seed initial data
            await query(`
                INSERT INTO habitaciones (nombre, slug, descripcion, amenidades, precio_texto, precio_numerico, imagen, max_adultos, max_ninos, camas, price_options_json)
                VALUES 
                (
                    'Familiar Loft', 
                    'familiar-loft', 
                    'El refugio ideal para la familia en Loja. Distribución en dos niveles para máxima privacidad.', 
                    ?, 
                    'Desde $65.00 USD / Noche', 
                    65.00, 
                    '/images/habitaciones/familiar-loft-main.webp', 
                    4, 
                    2, 
                    2,
                    ?
                ),
                (
                    'Triple', 
                    'triple', 
                    'Versatilidad y comodidad compartida. Tres camas individuales con lencería de alta calidad.', 
                    ?, 
                    'Desde $55.00 USD / Noche', 
                    55.00, 
                    '/images/habitaciones/triple-main.webp', 
                    3, 
                    1, 
                    3,
                    ?
                ),
                (
                    'Doble Twin', 
                    'doble-twin', 
                    'Descanso independiente y profesional. Espacio funcional con escritorio y WiFi de alta velocidad.', 
                    ?, 
                    'Desde $45.00 USD / Noche', 
                    45.00, 
                    '/images/habitaciones/doble-twin-main.webp', 
                    2, 
                    1, 
                    2,
                    ?
                ),
                (
                    'Matrimonial', 
                    'matrimonial', 
                    'Intimidad y elegancia para dos. Cama matrimonial de lujo con detalles neoclásicos.', 
                    ?, 
                    'Desde $35.00 USD / Noche', 
                    35.00, 
                    '/images/habitaciones/matrimonial-main.webp', 
                    2, 
                    1, 
                    1,
                    ?
                )
            `, [
                JSON.stringify(['2 Camas', 'TV Grande', 'Vistas', 'WiFi', 'Parqueo']),
                JSON.stringify([
                    { personas: 2, precioBase: 65, impuestos: 0 },
                    { personas: 3, precioBase: 75, impuestos: 0 },
                    { personas: 4, precioBase: 85, impuestos: 0 }
                ]),
                JSON.stringify(['Tres Camas', 'WiFi', 'Climatización', 'Amenities']),
                JSON.stringify([
                    { personas: 3, precioBase: 55, impuestos: 0 },
                    { personas: 4, precioBase: 65, impuestos: 0 }
                ]),
                JSON.stringify(['2 Camas', 'Escritorio', 'WiFi', 'Climatización']),
                JSON.stringify([
                    { personas: 1, precioBase: 35, impuestos: 0 },
                    { personas: 2, precioBase: 45, impuestos: 0 },
                    { personas: 3, precioBase: 55, impuestos: 0 }
                ]),
                JSON.stringify(['Cama King', 'Vistas', 'Climatización', 'Amenities']),
                JSON.stringify([
                    { personas: 1, precioBase: 35, impuestos: 0 },
                    { personas: 2, precioBase: 45, impuestos: 0 }
                ])
            ]);

            return NextResponse.json({ success: true, message: 'Table created and seeded' });
        }

        return NextResponse.json({ success: true, message: 'Table already exists and has data' });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message, stack: error.stack }, { status: 500 });
    }
}
