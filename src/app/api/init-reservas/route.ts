
import { NextResponse } from 'next/server';
import { query } from '@/lib/mysql';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        // Create reservas table if not exists
        await query(`
            CREATE TABLE IF NOT EXISTS reservas (
                id INT AUTO_INCREMENT PRIMARY KEY,
                habitacion_id VARCHAR(255) NOT NULL, -- IDs separados por comas
                fecha_entrada DATE NOT NULL,
                fecha_salida DATE NOT NULL,
                nombre_cliente VARCHAR(255),
                email_cliente VARCHAR(255),
                whatsapp VARCHAR(50),
                adultos INT DEFAULT 2,
                ninos INT DEFAULT 0,
                precio DECIMAL(10,2) DEFAULT 0.00,
                comision DECIMAL(10,2) DEFAULT 0.00,
                numero_reserva VARCHAR(50) UNIQUE, -- El order_id de TAB
                estado VARCHAR(50) DEFAULT 'PENDIENTE', -- PENDIENTE, OK, CANCELADA, NO PRESENTADO
                meta JSON,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                INDEX (fecha_entrada),
                INDEX (fecha_salida),
                INDEX (numero_reserva)
            )
        `);

        // Insert mock data for demonstration if table is empty
        const existing: any = await query("SELECT COUNT(*) as count FROM reservas");
        if (existing[0].count === 0) {
            const today = new Date();
            const year = today.getFullYear();
            const month = String(today.getMonth() + 1).padStart(2, '0');

            await query(`
                INSERT INTO reservas (nombre_cliente, fecha_entrada, fecha_salida, habitacion_id, adultos, ninos, precio, comision, numero_reserva, estado)
                VALUES 
                ('Mario Padron', '2025-11-30', '2025-12-04', '301', 1, 0, 82.80, 12.42, '5043508407', 'OK'),
                ('EJEMPLO EDITABLE', '${year}-${month}-01', '${year}-${month}-05', '302', 2, 0, 150.00, 22.50, 'TEST-999', 'PENDIENTE')
            `);
        }

        // Column updates with a more compatible check
        const checkColumn = async (table: string, col: string, type: string) => {
            const cols: any = await query(`SHOW COLUMNS FROM ${table} LIKE ?`, [col]);
            if (cols.length === 0) {
                await query(`ALTER TABLE ${table} ADD COLUMN ${col} ${type}`);
            }
        };

        try {
            await checkColumn('habitaciones', 'disponible', 'TINYINT(1) DEFAULT 1');
            await checkColumn('habitaciones', 'fecha_entrada', 'DATE NULL');
            await checkColumn('habitaciones', 'fecha_salida', 'DATE NULL');
            await checkColumn('habitaciones', 'imagen_blob', 'LONGBLOB NULL');
            await checkColumn('habitaciones', 'imagen_mime', 'VARCHAR(50) NULL');
        } catch (alterError) {
            console.log("Column verification error:", alterError);
        }

        return NextResponse.json({ success: true, message: 'Database schema verified and test record added' });
    } catch (error: any) {
        console.error('Database init error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
