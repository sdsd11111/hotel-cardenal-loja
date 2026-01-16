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

        const [columnData] = await connection.execute(
            'SELECT COLUMN_NAME, COLUMN_TYPE, COLUMN_DEFAULT, IS_NULLABLE FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = "reservas" AND COLUMN_NAME = "estado" AND TABLE_SCHEMA = ?',
            [process.env.MYSQL_DATABASE]
        );
        console.log('Column Type:', columnData);

        console.log('Testing manual update for ID 17...');
        const [updateRes] = await connection.execute('UPDATE reservas SET estado = ? WHERE id = ?', ['OK', 17]);
        const [warnings] = await connection.execute('SHOW WARNINGS');

        console.log('Update result:', updateRes);
        console.log('Warnings:', warnings);

        const [lastRes] = await connection.execute('SELECT id, nombre_cliente, estado FROM reservas WHERE id = 17');

        const data = {
            columnInfo: columnData,
            updateResult: updateRes,
            warnings: warnings,
            reservationAfterUpdate: lastRes
        };

        fs.writeFileSync('debug_full.json', JSON.stringify(data, null, 2));
        await connection.end();
    } catch (e) {
        fs.writeFileSync('debug_full_error.txt', e.stack);
        console.error('Debug failed:', e.message);
    }
}

debug();
