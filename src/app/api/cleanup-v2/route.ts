import { NextResponse } from 'next/server';
import { query } from '@/lib/mysql';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        console.log('Starting Debug Check...');

        // Check for IDs from the screenshot
        const ids = [41, 38, 24, 23, 21, 20, 18, 17, 16, 14, 15, 13, 11];
        const checkSql = `SELECT id, nombre_cliente, email_cliente, estado FROM reservas WHERE id IN (${ids.join(',')})`;

        const existing: any = await query(checkSql);

        console.log('Found IDs:', existing);

        if (existing.length > 0) {
            // Force delete by ID
            const deleteByIds = `DELETE FROM reservas WHERE id IN (${ids.join(',')})`;
            const result: any = await query(deleteByIds);
            return NextResponse.json({
                success: true,
                message: 'Found and deleted specific IDs',
                found: existing,
                deleted: result.affectedRows
            });
        }

        return NextResponse.json({
            success: true,
            message: 'No records found with those IDs. They might have been deleted already.',
            found: existing
        });

    } catch (error: any) {
        console.error('Debug Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
