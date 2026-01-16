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

        console.log('Testing manual update for ID 17...');
        const [updateRes] = await connection.execute('UPDATE reservas SET estado = ? WHERE id = ?', ['OK', 17]);
        console.log('Update result:', updateRes);

        const [lastRes] = await connection.execute('SELECT id, nombre_cliente, estado, created_at FROM reservas WHERE id = 17');

        const data = {
            updateResult: updateRes,
            reservationAfterUpdate: lastRes
        };

        fs.writeFileSync('debug_update_res.json', JSON.stringify(data, null, 2));
        console.log('Debug data written to debug_update_res.json');

        await connection.end();
    } catch (e) {
        fs.writeFileSync('debug_update_error.txt', e.stack);
        console.error('Debug failed:', e.message);
    }
}

debug();
