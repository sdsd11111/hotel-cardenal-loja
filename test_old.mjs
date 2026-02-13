import mysql from 'mysql2/promise';

const config = {
    host: '45.177.125.167',
    user: 'HotelCardenal',
    password: 'RVx_v#yD;XxKsDus',
    database: 'hotelcardenall',
    connectTimeout: 5000
};

async function run() {
    try {
        console.log('Connecting to OLD DB...');
        const connection = await mysql.createConnection(config);
        console.log('SUCCESS');
        await connection.end();
    } catch (err) {
        console.log('ERROR: ' + err.code + ' - ' + err.message);
    }
}
run();
