
import { NextResponse } from 'next/server';
import { query } from '@/lib/mysql';

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();

        const {
            display_title,
            room_size,
            description,
            has_balcony,
            price_options_json,
            amenities_json,
            images_json
        } = body;

        await query(`
            UPDATE room_type_configs 
            SET display_title = ?, 
                room_size = ?, 
                description = ?, 
                has_balcony = ?, 
                price_options_json = ?, 
                amenities_json = ?, 
                images_json = ?
            WHERE id = ?
        `, [
            display_title,
            room_size,
            description,
            has_balcony,
            typeof price_options_json === 'string' ? price_options_json : JSON.stringify(price_options_json),
            typeof amenities_json === 'string' ? amenities_json : JSON.stringify(amenities_json),
            typeof images_json === 'string' ? images_json : JSON.stringify(images_json),
            id
        ]);

        return NextResponse.json({ success: true, message: 'Configuration updated' });
    } catch (error: any) {
        console.error('API Error updating room config:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
