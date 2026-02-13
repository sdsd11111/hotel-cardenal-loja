import mysql from 'mysql2/promise';

const oldConfig = {
    host: '45.177.125.167',
    user: 'HotelCardenal',
    password: 'RVx_v#yD;XxKsDus',
    database: 'hotelcardenall'
};

async function inspect() {
    try {
        const conn = await mysql.createConnection(oldConfig);
        const [rows] = await conn.execute('SELECT * FROM anuncios');
        console.log(`Found ${rows.length} rows in anuncios.`);
        console.log(JSON.stringify(rows, null, 2));
        await conn.end();
    } catch (e) {
        console.error(e);
    }
}
inspect();
