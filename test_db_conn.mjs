import mysql from 'mysql2/promise';

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

async function testConnection(name, config) {
    try {
        console.log(`--- Testing ${name} ---`);
        console.log(`Host: ${config.host}:${config.port || 3306}`);
        console.log(`User: ${config.user}`);
        const connection = await mysql.createConnection({
            ...config,
            connectTimeout: 10000 // 10 seconds
        });
        console.log(`SUCCESS: Connected to ${name}!`);
        await connection.end();
        return true;
    } catch (error) {
        console.error(`ERROR: Failed to connect to ${name}:`);
        console.error(error);
        return false;
    }
}

async function run() {
    const oldOk = await testConnection('Old DB', oldConfig);
    console.log('\n');
    const newOk = await testConnection('New DB', newConfig);

    if (oldOk && newOk) {
        console.log('\nBoth databases are reachable. Ready for migration.');
    } else {
        console.log('\nConnectivity check failed.');
    }
}

run();
