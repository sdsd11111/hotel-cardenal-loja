import mysql from 'mysql2/promise';

const dbConfig = {
    host: 'mysql.us.stackcp.com',
    port: 41737,
    user: 'enloja_hotelcardenal',
    password: 'cB(hy62g=q£5',
    database: 'enloja_hotelcardenal'
};

async function getRoomConfigs() {
    const conn = await mysql.createConnection(dbConfig);

    console.log('\n--- DATA from room_type_configs ---');
    const [rows] = await conn.execute("SELECT * FROM room_type_configs WHERE identifier LIKE '301%' OR identifier = 'matrimonial'");
    console.log(JSON.stringify(rows, null, 2));

    await conn.end();
}

getRoomConfigs().catch(console.error);
