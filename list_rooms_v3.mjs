import mysql from 'mysql2/promise';
import fs from 'fs';

const dbConfig = {
    host: 'mysql.us.stackcp.com',
    port: 41737,
    user: 'enloja_hotelcardenal',
    password: 'cB(hy62g=q£5',
    database: 'enloja_hotelcardenal'
};

async function listRooms() {
    const conn = await mysql.createConnection(dbConfig);

    const [rooms] = await conn.execute('SELECT id, nombre FROM habitaciones ORDER BY id');

    fs.writeFileSync('rooms_data.json', JSON.stringify(rooms, null, 2), 'utf-8');
    console.log('Done:', rooms.length, 'rooms');

    await conn.end();
}

listRooms().catch(console.error);
