const mysql = require('mysql2/promise');
require('dotenv').config();

async function test() {
    console.log('Connecting to:', process.env.MYSQL_HOST);
    try {
        const connection = await mysql.createConnection({
            host: process.env.MYSQL_HOST,
            user: process.env.MYSQL_USER,
            password: process.env.MYSQL_PASSWORD,
            database: process.env.MYSQL_DATABASE,
        });

        const [rows] = await connection.execute('SELECT id, nombre_cliente, estado FROM reservas ORDER BY id DESC LIMIT 5');
        console.log('Reservations (Last 5):');
        console.table(rows);

        const [db] = await connection.execute('SELECT DATABASE() as db');
        console.log('Schema:', db[0].db);

        await connection.end();
    } catch (e) {
        console.error('Connection failed:', e.message);
    }
}

test();
