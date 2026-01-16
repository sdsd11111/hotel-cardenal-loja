const mysql = require('mysql2/promise');
const fs = require('fs');
require('dotenv').config();

async function debug() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.MYSQL_HOST,
            user: process.env.MYSQL_USER,
            password: process.env.MYSQL_PASSWORD,
            database: process.env.MYSQL_DATABASE,
        });

        const [results] = await connection.execute('DESCRIBE reservas');
        const [lastRes] = await connection.execute('SELECT id, nombre_cliente, estado, created_at FROM reservas ORDER BY id DESC LIMIT 10');

        const data = {
            schema: results,
            reservations: lastRes
        };

        fs.writeFileSync('debug_db.json', JSON.stringify(data, null, 2));
        console.log('Debug data written to debug_db.json');

        await connection.end();
    } catch (e) {
        fs.writeFileSync('debug_db_error.txt', e.stack);
        console.error('Debug failed:', e.message);
    }
}

debug();
