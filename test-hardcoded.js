const mysql = require('mysql2/promise');

async function testConnection() {
    const config = {
        host: '45.177.125.167',
        user: 'HotelCardenal',
        password: 'RVx_v#yD;XxKsDus',
        database: 'hotelcardenall',
        connectTimeout: 10000
    };

    console.log('--- Hardcoded Test ---');
    try {
        const connection = await mysql.createConnection(config);
        console.log('SUCCESS: Hardcoded connection worked!');
        await connection.end();
    } catch (error) {
        console.error('FAILED: Hardcoded connection failed:');
        console.error(error.message);
    }
}

testConnection();
