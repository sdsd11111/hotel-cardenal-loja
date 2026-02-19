import mysql from 'mysql2/promise';

const dbConfig = {
    host: 'mysql.us.stackcp.com',
    port: 41737,
    user: 'enloja_hotelcardenal',
    password: 'cB(hy62g=q£5',
    database: 'enloja_hotelcardenal'
};

async function clearOverrides() {
    const conn = await mysql.createConnection(dbConfig);

    // Clear price_options_json for rooms to ensure they use the global config from room_type_configs
    // We target matrimonial rooms specifically first as reported by the user
    console.log('Clearing price_options_json overrides for all rooms...');
    const [result] = await conn.execute("UPDATE habitaciones SET price_options_json = NULL WHERE price_options_json IS NOT NULL AND price_options_json != '' AND price_options_json != '[]'");

    // @ts-ignore
    console.log(`Updated ${result.affectedRows} rooms.`);

    await conn.end();
}

clearOverrides().catch(console.error);
