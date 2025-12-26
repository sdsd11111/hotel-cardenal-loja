
import { createPool } from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: '.env.local' });

async function checkSchema() {
    const pool = createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    });

    try {
        console.log('Checking columns in habitaciones table...');
        const [rows] = await pool.query(`SHOW COLUMNS FROM habitaciones`);
        console.log(rows.map(r => r.Field).join(', '));

        console.log('\nChecking a specific room (id=302) data...');
        const [room] = await pool.query('SELECT * FROM habitaciones LIMIT 1');
        console.log(room[0]);

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await pool.end();
    }
}

checkSchema();
