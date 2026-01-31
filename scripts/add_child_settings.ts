
import { query } from '../src/lib/mysql.js';
import dotenv from 'dotenv';
dotenv.config();

async function migrate() {
    try {
        // Check if settings already exist
        const settings: any = await query('SELECT setting_key FROM hotel_settings WHERE setting_key IN ("child_pricing_policy", "child_fixed_price")');
        const keys = settings.map((s: any) => s.setting_key);

        if (!keys.includes('child_pricing_policy')) {
            console.log('Adding child_pricing_policy...');
            await query(`
                INSERT INTO hotel_settings (setting_key, setting_value, display_name, description, category)
                VALUES (
                    'child_pricing_policy',
                    'free',
                    'Política de Precios para Niños',
                    'Seleccione cómo se cobra a los niños: gratis, valor fijo o igual que adulto.',
                    'precios'
                )
            `);
        }

        if (!keys.includes('child_fixed_price')) {
            console.log('Adding child_fixed_price...');
            await query(`
                INSERT INTO hotel_settings (setting_key, setting_value, display_name, description, category)
                VALUES (
                    'child_fixed_price',
                    '0',
                    'Valor Fijo por Niño',
                    'Monto a cobrar por cada niño si la política es "Valor Fijo".',
                    'precios'
                )
            `);
        }

        console.log('Migration completed successfully');
    } catch (err) {
        console.error('Migration failed:', err);
    } finally {
        process.exit();
    }
}

migrate();
