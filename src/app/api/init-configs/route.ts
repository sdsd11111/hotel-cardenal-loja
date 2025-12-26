
import { NextResponse } from 'next/server';
import { query } from '@/lib/mysql';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        // Create table
        await query(`
            CREATE TABLE IF NOT EXISTS room_type_configs (
                id INT AUTO_INCREMENT PRIMARY KEY,
                identifier VARCHAR(50) UNIQUE NOT NULL,
                display_title VARCHAR(255),
                room_size INT,
                description TEXT,
                has_balcony TINYINT(1) DEFAULT 0,
                price_options_json LONGTEXT,
                amenities_json LONGTEXT,
                images_json LONGTEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);

        // Seed data for 301 (Matrimonial)
        const matrimonialPriceOptions = [
            { personas: 2, personasIconos: 2, precioBase: 30, impuestos: 5, incluye: ['Desayuno incluido (Fantástico)', 'Cancelación gratis antes del 24 de diciembre 2025'] },
            { personas: 1, personasIconos: 1, precioBase: 20, impuestos: 3, incluye: ['Desayuno incluido (Fantástico)', 'Cancelación gratis antes del 24 de diciembre 2025'] }
        ];
        const matrimonialAmenities = [
            'Vistas a la montaña', 'Vistas a un lugar de interés', 'Vistas a la ciudad', 'Baño en la habitación', 'TV de pantalla plana', 'WiFi gratis', 'Artículos de aseo gratis', 'WC', 'Bañera o ducha', 'Suelo de madera o parquet', 'Toallas', 'Enchufe cerca de la cama', 'Productos de limpieza', 'Escritorio', 'Zona de estar', 'Vídeo', 'TV', 'Toallas / sábanas (por un suplemento)', 'Canales por cable', 'Armario', 'Acceso a pisos superiores solo mediante escaleras', 'Perchero', 'Papel higiénico', 'Detector de monóxido de carbono', 'Desinfectante de manos'
        ];
        const matrimonialImages = [
            '/images/habitaciones/matrimonial/matrimonial-main.webp',
            '/images/habitaciones/matrimonial/matrimonial-thumb.webp',
            '/images/habitaciones/matrimonial/doble-twin-main.webp',
            '/images/habitaciones/matrimonial/familiar-loft-main.webp',
            '/images/habitaciones/matrimonial/triple-main.webp'
        ];

        // Seed data for 302 (Doble Twin)
        const twinPriceOptions = [
            { personas: 3, personasIconos: 3, precioBase: 40, impuestos: 6, incluye: ['Desayuno incluido (Fantástico)', 'Cancelación gratis antes del 24 de diciembre 2025'] },
            { personas: 2, personasIconos: 2, precioBase: 30, impuestos: 5, incluye: ['Desayuno incluido (Fantástico)', 'Cancelación gratis antes del 24 de diciembre 2025'] },
            { personas: 1, personasIconos: 1, precioBase: 20, impuestos: 3, incluye: ['Desayuno incluido (Fantástico)', 'Cancelación gratis antes del 24 de diciembre 2025'] }
        ];
        const twinAmenities = [
            'Vistas a un lugar de interés', 'Vistas a la ciudad', 'Baño en la habitación', 'TV de pantalla plana', 'WiFi gratis', 'Artículos de aseo gratis', 'WC', 'Bañera o ducha', 'Suelo de madera o parquet', 'Toallas', 'Enchufe cerca de la cama', 'Productos de limpieza', 'Escritorio', 'Zona de estar', 'Vídeo', 'TV', 'Toallas / sábanas (por un suplemento)', 'Canales por cable', 'Armario', 'Acceso a pisos superiores solo mediante escaleras', 'Perchero', 'Papel higiénico', 'Detector de monóxido de carbono', 'Desinfectante de manos'
        ];
        const twinImages = [
            '/images/habitaciones/doble/doble-twin-main.webp',
            '/images/habitaciones/doble/doble-twin-thumb.webp',
            '/images/habitaciones/doble/familiar-loft-main.webp',
            '/images/habitaciones/doble/matrimonial-main.webp',
            '/images/habitaciones/doble/triple-main.webp'
        ];

        // Seed data for 303 (Triple)
        const triplePriceOptions = [
            { personas: 4, personasIconos: 4, precioBase: 48, impuestos: 7, incluye: ['Desayuno incluido (Fantástico)', 'Cancelación gratis antes del 24 de diciembre 2025'] },
            { personas: 3, personasIconos: 3, precioBase: 40, impuestos: 6, incluye: ['Desayuno incluido (Fantástico)', 'Cancelación gratis antes del 24 de diciembre 2025'] },
            { personas: 2, personasIconos: 2, precioBase: 30, impuestos: 5, incluye: ['Desayuno incluido (Fantástico)', 'Cancelación gratis antes del 24 de diciembre 2025'] },
            { personas: 1, personasIconos: 1, precioBase: 20, impuestos: 3, incluye: ['Desayuno incluido (Fantástico)', 'Cancelación gratis antes del 24 de diciembre 2025'] }
        ];
        const tripleAmenities = [
            'Vistas al lago', 'Vistas a la montaña', 'Vistas a un lugar de interés', 'Vistas a la ciudad', 'Vistas al río', 'Baño en la habitación', 'TV de pantalla plana', 'WiFi gratis', 'Artículos de aseo gratis', 'WC', 'Bañera o ducha', 'Suelo de madera o parquet', 'Toallas', 'Enchufe cerca de la cama', 'Productos de limpieza', 'Escritorio', 'Zona de estar', 'Vídeo', 'TV', 'Toallas / sábanas (por un suplemento)', 'Canales por cable', 'Armario', 'Acceso a pisos superiores solo mediante escaleras', 'Perchero', 'Papel higiénico', 'Desinfectante de manos', 'Detector de monóxido de carbono'
        ];
        const tripleImages = [
            '/images/habitaciones/triple/triple-main.webp',
            '/images/habitaciones/triple/triple-thumb.webp',
            '/images/habitaciones/triple/doble-twin-main.webp',
            '/images/habitaciones/triple/familiar-loft-main.webp',
            '/images/habitaciones/triple/matrimonial-main.webp'
        ];

        // Helper to insert or ignore
        const upsert = async (id: string, title: string, size: number, desc: string, balcony: number, prices: any, amenities: any, images: any) => {
            await query(`
                INSERT INTO room_type_configs 
                (identifier, display_title, room_size, description, has_balcony, price_options_json, amenities_json, images_json)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE 
                display_title = VALUES(display_title), 
                room_size = VALUES(room_size), 
                description = VALUES(description), 
                has_balcony = VALUES(has_balcony),
                price_options_json = VALUES(price_options_json),
                amenities_json = VALUES(amenities_json),
                images_json = VALUES(images_json)
            `, [id, title, size, desc, balcony, JSON.stringify(prices), JSON.stringify(amenities), JSON.stringify(images)]);
        };

        await upsert('301', 'Habitacion-Matrimonial', 24, 'Esta habitación doble dispone de zona de estar con TV de pantalla plana, escritorio y baño privado. La unidad dispone de 1 cama.', 0, matrimonialPriceOptions, matrimonialAmenities, matrimonialImages);
        await upsert('302', 'Habitacion-2 camas', 28, 'A seating area with a flat-screen TV, a desk and a private bathroom are offered in this twin room. The unit has 2 beds.', 0, twinPriceOptions, twinAmenities, twinImages);
        await upsert('303', 'Habitacion-Triple', 30, 'Esta habitación triple cuenta con TV de pantalla plana con canales por cable, baño privado y balcón con vistas al lago. La unidad dispone de 3 camas.', 1, triplePriceOptions, tripleAmenities, tripleImages);

        return NextResponse.json({ success: true, message: 'Room configs initialized/updated' });
    } catch (error: any) {
        console.error('Room config init error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
