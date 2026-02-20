import mysql from 'mysql2/promise';

const dbConfig = {
    host: 'mysql.us.stackcp.com',
    port: 41737,
    user: 'enloja_hotelcardenal',
    password: 'cB(hy62g=q£5',
    database: 'enloja_hotelcardenal'
};

async function listRooms() {
    const conn = await mysql.createConnection(dbConfig);

    console.log('\n--- HABITACIONES ---');
    const [rooms] = await conn.execute('SELECT id, nombre FROM habitaciones ORDER BY id');
    console.log(JSON.stringify(rooms, null, 2));

    await conn.end();
}

listRooms().catch(console.error);
