
import { NextResponse } from 'next/server';
import { query } from '@/lib/mysql';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const configs = await query('SELECT * FROM room_type_configs ORDER BY identifier ASC') as any[];
        const seasonalPrices = await query('SELECT * FROM room_seasonal_prices ORDER BY start_date ASC') as any[];

        const configsWithSeasons = configs.map(config => ({
            ...config,
            seasonal_prices: seasonalPrices.filter(sp => sp.room_config_id === config.id)
        }));

        return NextResponse.json(configsWithSeasons);
    } catch (error: any) {
        console.error('API Error fetching room configs:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
