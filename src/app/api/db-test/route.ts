import { NextResponse } from 'next/server';
import { query } from '@/lib/mysql';

export const dynamic = 'force-dynamic';

export async function GET() {
    const diagnostics: any = {
        timestamp: new Date().toISOString(),
        env_check: {
            MYSQL_HOST: process.env.MYSQL_HOST || 'NOT SET',
            MYSQL_USER: process.env.MYSQL_USER || 'NOT SET',
            MYSQL_DATABASE: process.env.MYSQL_DATABASE || 'NOT SET',
            MYSQL_PASSWORD: process.env.MYSQL_PASSWORD ? '***SET***' : 'NOT SET'
        },
        connection_test: null,
        tables_check: null,
        data_counts: {}
    };

    try {
        // Test 1: Check if we can connect
        await query('SELECT 1 as test');
        diagnostics.connection_test = '✅ SUCCESS';

        // Test 2: List tables
        const tables = await query('SHOW TABLES') as any[];
        diagnostics.tables_check = {
            status: '✅ SUCCESS',
            count: tables.length,
            tables: tables.map(t => Object.values(t)[0])
        };

        // Test 3: Count rows in each table
        for (const table of tables) {
            const tableName = Object.values(table)[0] as string;
            try {
                const [result] = await query(`SELECT COUNT(*) as count FROM ${tableName}`) as any[];
                diagnostics.data_counts[tableName] = result.count;
            } catch (err) {
                diagnostics.data_counts[tableName] = `ERROR: ${(err as Error).message}`;
            }
        }

        // Test 4: Sample data from key tables
        const sampleData: any = {};
        for (const tableName of ['habitaciones', 'platos', 'blog', 'clientes']) {
            try {
                const rows = await query(`SELECT * FROM ${tableName} LIMIT 1`) as any[];
                sampleData[tableName] = rows.length > 0 ? '✅ HAS DATA' : '❌ EMPTY';
            } catch (err) {
                sampleData[tableName] = `ERROR: ${(err as Error).message}`;
            }
        }
        diagnostics.sample_data = sampleData;

    } catch (error: any) {
        diagnostics.connection_test = `❌ FAILED: ${error.message}`;
        diagnostics.error_details = {
            code: error.code,
            errno: error.errno,
            sqlState: error.sqlState,
            sqlMessage: error.sqlMessage,
            stack: error.stack
        };
    }

    return NextResponse.json(diagnostics, {
        headers: {
            'Cache-Control': 'no-store, no-cache, must-revalidate'
        }
    });
}
