const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
    host: 'mysql.us.stackcp.com',
    port: 41737,
    user: 'enloja_hotelcardenal',
    password: 'cB(hy62g=q£5',
    database: 'enloja_hotelcardenal',
};

async function verify() {
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        console.log('Connected to MySQL');

        const NAMES = ['%Cesar Reyes%', '%PRUEBA PAYPHONE%', '%Prueba%'];

        for (const name of NAMES) {
            const [rows] = await connection.execute(
                `SELECT id, nombre_cliente FROM reservas WHERE nombre_cliente LIKE ?`, [name]
            );
            console.log(`Reservas with "${name}": ${rows.length}`);

            const [cRows] = await connection.execute(
                `SELECT id, nombre FROM clientes WHERE nombre LIKE ?`, [name]
            );
            console.log(`Clientes with "${name}": ${cRows.length}`);
        }

    } catch (error) {
        console.error('Error during verification:', error);
    } finally {
        if (connection) await connection.end();
    }
}

verify();
