
import { NextResponse } from 'next/server';
import { query } from '@/lib/mysql';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        await query(`
            CREATE TABLE IF NOT EXISTS room_seasonal_prices (
                id INT AUTO_INCREMENT PRIMARY KEY,
                room_config_id INT NOT NULL,
                start_date DATE NOT NULL,
                end_date DATE NOT NULL,
                price_options_json JSON NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (room_config_id) REFERENCES room_type_configs(id) ON DELETE CASCADE
            )
        `);

        return NextResponse.json({ success: true, message: 'Table room_seasonal_prices created' });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
