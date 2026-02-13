import mysql from 'mysql2/promise';

const config = {
    host: 'mysql.us.stackcp.com',
    port: 42286,
    user: 'hotelcardenal-353130305930',
    password: 'd6ynj07zf3',
    database: 'hotelcardenal-353130305930',
    connectTimeout: 5000
};

async function run() {
    try {
        console.log('Connecting to NEW DB...');
        const connection = await mysql.createConnection(config);
        console.log('SUCCESS');
        await connection.end();
    } catch (err) {
        console.log('ERROR: ' + err.code + ' - ' + err.message);
    }
}
run();
