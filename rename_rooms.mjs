import mysql from 'mysql2/promise';

const dbConfig = {
    host: 'mysql.us.stackcp.com',
    port: 41737,
    user: 'enloja_hotelcardenal',
    password: 'cB(hy62g=q£5',
    database: 'enloja_hotelcardenal'
};

async function renameRooms() {
    const conn = await mysql.createConnection(dbConfig);

    const updates = [
        { id: 4, nombre: 'Matrimonial-301' },
        { id: 1, nombre: 'Matrimonial-201' },
        { id: 5, nombre: 'Doble-302' },
        { id: 3, nombre: 'Doble-202' },
        { id: 6, nombre: 'Triple-303' },
        { id: 2, nombre: 'Triple-304' },
    ];

    for (const u of updates) {
        await conn.execute('UPDATE habitaciones SET nombre = ? WHERE id = ?', [u.nombre, u.id]);
        console.log(`Updated id=${u.id} -> "${u.nombre}"`);
    }

    console.log('\nDone! Verifying...');
    const [rows] = await conn.execute('SELECT id, nombre FROM habitaciones ORDER BY id');
    console.log(JSON.stringify(rows, null, 2));

    await conn.end();
}

renameRooms().catch(console.error);
