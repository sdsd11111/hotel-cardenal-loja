import { NextResponse } from 'next/server';
import { query } from '@/lib/mysql';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        console.log('Starting Debug Check V3...');

        // Check for IDs from the screenshot
        const ids = [41, 38, 24, 23, 21, 20, 18, 17, 16, 14, 15, 13, 11];

        // Use a simple query first to see if they exist
        const checkSql = `SELECT id, nombre_cliente, email_cliente, estado FROM reservas WHERE id IN (${ids.join(',')})`;
        const existing: any = await query(checkSql);

        if (existing.length > 0) {
            // Force delete by ID
            const deleteByIds = `DELETE FROM reservas WHERE id IN (${ids.join(',')})`;
            const result: any = await query(deleteByIds);

            // Also delete by email just in case there are others not in this ID list
            const deleteByEmail = `DELETE FROM reservas WHERE email_cliente = 'cristopheryeah113@gmail.com'`;
            const resultEmail: any = await query(deleteByEmail);

            return NextResponse.json({
                success: true,
                message: 'Records found and deleted',
                found: existing,
                deletedByIds: result.affectedRows,
                deletedByEmail: resultEmail.affectedRows
            });
        }

        // Double check by email if IDs didn't match
        const checkEmail = `SELECT id, nombre_cliente FROM reservas WHERE email_cliente = 'cristopheryeah113@gmail.com'`;
        const existingEmail: any = await query(checkEmail);

        if (existingEmail.length > 0) {
            const deleteByEmail = `DELETE FROM reservas WHERE email_cliente = 'cristopheryeah113@gmail.com'`;
            const resultEmail: any = await query(deleteByEmail);
            return NextResponse.json({
                success: true,
                message: 'Records found by email and deleted',
                found: existingEmail,
                deleted: resultEmail.affectedRows
            });
        }

        return NextResponse.json({
            success: true,
            message: 'No records found with those IDs or Email. They are definitely gone.',
            foundIDs: existing,
            foundEmail: existingEmail
        });

    } catch (error: any) {
        console.error('Debug Error V3:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
