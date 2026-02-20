const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
    host: 'mysql.us.stackcp.com',
    port: 41737,
    user: 'enloja_hotelcardenal',
    password: 'cB(hy62g=q£5',
    database: 'enloja_hotelcardenal',
};

async function cleanup() {
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        console.log('Connected to MySQL');

        // 1. Delete Test Reservations
        const [resRes] = await connection.execute(
            `DELETE FROM reservas 
             WHERE nombre_cliente LIKE '%PRUEBA PAYPHONE%' 
                OR nombre_cliente LIKE '%Cesar Reyes%' 
                OR nombre_cliente LIKE '%Prueba%'`
        );
        console.log(`Deleted ${resRes.affectedRows} test reservations.`);

        // 2. Delete Test Clients
        const [cliRes] = await connection.execute(
            `DELETE FROM clientes 
             WHERE nombre LIKE '%Cesar Reyes%' 
                OR apellidos LIKE '%Cesar Reyes%' 
                OR nombre LIKE '%Prueba%' 
                OR apellidos LIKE '%Prueba%'`
        );
        console.log(`Deleted ${cliRes.affectedRows} test clients.`);

    } catch (error) {
        console.error('Error during cleanup:', error);
    } finally {
        if (connection) await connection.end();
    }
}

cleanup();
