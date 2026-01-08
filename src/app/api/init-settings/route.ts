
import { NextResponse } from 'next/server';
import { query } from '@/lib/mysql';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        // Create hotel_settings table
        await query(`
            CREATE TABLE IF NOT EXISTS hotel_settings (
                id INT AUTO_INCREMENT PRIMARY KEY,
                setting_key VARCHAR(50) UNIQUE NOT NULL,
                setting_value TEXT,
                display_name VARCHAR(100),
                description TEXT,
                category VARCHAR(50) DEFAULT 'general',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);

        // Seed initial data
        const settings = [
            {
                key: 'child_age_threshold',
                value: '8', // Default: desde los 8 años se cobra como adulto
                name: 'Edad límite para niños gratis/descuento',
                desc: 'A partir de esta edad, el niño será contabilizado como un adulto para el cálculo de costos.',
                category: 'precios'
            }
        ];

        for (const s of settings) {
            await query(`
                INSERT INTO hotel_settings (setting_key, setting_value, display_name, description, category)
                VALUES (?, ?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE 
                display_name = VALUES(display_name),
                description = VALUES(description),
                category = VALUES(category)
            `, [s.key, s.value, s.name, s.desc, s.category]);
        }

        return NextResponse.json({ success: true, message: 'Hotel settings initialized' });
    } catch (error: any) {
        console.error('Hotel settings init error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
