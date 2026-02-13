import mysql from 'mysql2/promise';

const oldConfig = {
    host: '45.177.125.167',
    user: 'HotelCardenal',
    password: 'RVx_v#yD;XxKsDus',
    database: 'hotelcardenall'
};

async function getStructure() {
    try {
        const conn = await mysql.createConnection(oldConfig);
        const [fields] = await conn.execute('DESCRIBE anuncios');
        console.log(JSON.stringify(fields, null, 2));
        await conn.end();
    } catch (e) {
        console.error(e);
    }
}
getStructure();
