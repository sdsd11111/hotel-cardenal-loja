import mysql from 'mysql2/promise';

const dbConfig = {
    host: 'mysql.us.stackcp.com',
    port: 41737,
    user: 'enloja_hotelcardenal',
    password: 'cB(hy62g=q£5',
    database: 'enloja_hotelcardenal'
};

async function describeTables() {
    const conn = await mysql.createConnection(dbConfig);

    console.log('\n--- DESCRIBE habitaciones ---');
    const [cols] = await conn.execute('DESCRIBE habitaciones');
    console.log(JSON.stringify(cols, null, 2));

    await conn.end();
}

describeTables().catch(console.error);
