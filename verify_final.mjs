import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

async function verify() {
    console.log('Verifying connection using .env values...');
    console.log(`Host: ${process.env.MYSQL_HOST}`);
    console.log(`Database: ${process.env.MYSQL_DATABASE}`);

    try {
        const conn = await mysql.createConnection({
            host: process.env.MYSQL_HOST,
            port: parseInt(process.env.MYSQL_PORT) || 3306,
            user: process.env.MYSQL_USER,
            password: process.env.MYSQL_PASSWORD,
            database: process.env.MYSQL_DATABASE
        });

        console.log('SUCCESS: Application can connect to the new database!');

        const [tables] = await conn.execute('SHOW TABLES');
        console.log(`Total tables in new DB: ${tables.length}`);

        await conn.end();
    } catch (e) {
        console.error('VERIFICATION FAILED:', e.message);
    }
}

verify();
