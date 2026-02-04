const mysql = require('mysql2/promise');

async function diagnose() {
    const config = {
        host: '45.177.125.167',
        user: 'HotelCardenal',
        password: 'RVx_v#yD;XxKsDus',
        database: 'hotelcardenall'
    };

    try {
        const connection = await mysql.createConnection(config);

        console.log('--- HABITACIONES EN DB ---');
        const [rooms] = await connection.execute('SELECT id, nombre FROM habitaciones ORDER BY id ASC');
        rooms.forEach(r => console.log(`ID: ${r.id} | Name: ${r.nombre}`));

        console.log('\n--- DISTRIBUCIÓN POR HABITACIÓN ---');
        const [dist] = await connection.execute(`
            SELECT habitacion_id, COUNT(*) as count 
            FROM reservas 
            GROUP BY habitacion_id
            ORDER BY habitacion_id ASC
        `);
        dist.forEach(d => console.log(`RoomID: ${d.habitacion_id} | Cantidad: ${d.count}`));

        await connection.end();
    } catch (e) {
        console.error('Diagnosis failed:', e.message);
    }
}

diagnose();
