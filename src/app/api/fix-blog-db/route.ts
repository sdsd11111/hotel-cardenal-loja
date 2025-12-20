
import { NextResponse } from 'next/server';
import { query } from '@/lib/mysql';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        // Check if column exists
        const check = await query(`
            SELECT COUNT(*) as count 
            FROM information_schema.COLUMNS 
            WHERE TABLE_SCHEMA = DATABASE() 
            AND TABLE_NAME = 'blog_articles' 
            AND COLUMN_NAME = 'tags'
        `) as any[];

        if (check[0].count === 0) {
            await query("ALTER TABLE blog_articles ADD COLUMN tags TEXT AFTER categoria");
            return NextResponse.json({ success: true, message: 'Column tags added' });
        } else {
            return NextResponse.json({ success: true, message: 'Column tags already exists' });
        }
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message, stack: error.stack }, { status: 500 });
    }
}
