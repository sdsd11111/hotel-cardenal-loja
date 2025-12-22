import mysql from 'mysql2/promise';

async function testData() {
    const dbConfig = {
        host: '45.177.125.167',
        user: 'platos',
        password: 'yR6Ur8SWGOl5Z[Np',
        database: 'platos'
    };

    try {
        const connection = await mysql.createConnection(dbConfig);
        console.log('✅ Conexión exitosa');

        const [rows] = await connection.execute('SELECT COUNT(*) as count FROM habitaciones');
        console.log('Registros en "habitaciones":', (rows as any)[0].count);

        if ((rows as any)[0].count > 0) {
            const [data] = await connection.execute('SELECT id, nombre FROM habitaciones LIMIT 5');
            console.log('Primeros registros:', data);
        }

        await connection.end();
    } catch (err) {
        console.error('❌ Error:', err);
    }
}

testData();
