import mysql from 'mysql2/promise';

const config = {
    host: '45.177.125.167',
    user: 'HotelCardenal',
    password: 'RVx_v#yD;XxKsDus',
    database: 'hotelcardenall'
};

async function run() {
    try {
        const conn = await mysql.createConnection(config);
        const [rows] = await conn.execute('SHOW TABLES');
        console.log('Tables in hotelcardenall:');
        rows.forEach(row => console.log('- ' + Object.values(row)[0]));
        await conn.end();
    } catch (err) {
        console.error(err);
    }
}
run();
