import mysql from 'mysql2/promise';

async function test(name, config) {
    try {
        console.log(`Testing ${name}...`);
        const conn = await mysql.createConnection({ ...config, connectTimeout: 20000 });
        console.log(`${name}: SUCCESS`);
        await conn.end();
    } catch (err) {
        console.log(`${name}: ERROR - ${err.message}`);
    }
}

const oldConfig = {
    host: '45.177.125.167',
    user: 'HotelCardenal',
    password: 'RVx_v#yD;XxKsDus',
    database: 'hotelcardenall'
};

const newConfig = {
    host: 'mysql.us.stackcp.com',
    port: 42286,
    user: 'hotelcardenal-353130305930',
    password: 'd6ynj07zf3',
    database: 'hotelcardenal-353130305930'
};

async function run() {
    await test('OLD', oldConfig);
    await test('NEW', newConfig);
}
run();
