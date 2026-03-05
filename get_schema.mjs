
import mysql from 'mysql2/promise';

const dbConfig = {
    host: 'mysql.us.stackcp.com',
    port: 41737,
    user: 'enloja_hotelcardenal',
    password: 'cB(hy62g=q£5',
    database: 'enloja_hotelcardenal'
};

async function getSchema() {
    try {
        const conn = await mysql.createConnection(dbConfig);
        const [cols] = await conn.execute('DESCRIBE habitaciones');
        const blobCol = cols.find(c => c.Field === 'imagen_blob');
        const imgCol = cols.find(c => c.Field === 'imagen');
        console.log('imagen_blob type:', blobCol ? blobCol.Type : 'NOT FOUND');
        console.log('imagen type:', imgCol ? imgCol.Type : 'NOT FOUND');
        await conn.end();
    } catch (e) {
        console.error(e);
    }
}
getSchema();
