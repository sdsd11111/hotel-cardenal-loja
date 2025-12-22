import mysql from 'mysql2/promise';

async function testConnection() {
    const dbConfig = {
        host: '45.177.125.167',
        user: 'platos',
        password: 'yR6Ur8SWGOl5Z[Np',
        database: 'platos',
        connectTimeout: 10000
    };

    console.log('--- Probando Conexión MySQL con Credenciales de Vercel ---');
    console.log('Host:', dbConfig.host);
    console.log('User:', dbConfig.user);
    console.log('Database:', dbConfig.database);
    console.log('---------------------------------------------------------');

    try {
        const connection = await mysql.createConnection(dbConfig);
        console.log('✅ ¡Conexión exitosa!');

        const [tables] = await connection.execute('SHOW TABLES');
        console.log('Tablas encontradas:');
        for (const table of tables as any[]) {
            const tableName = Object.values(table)[0] as string;
            const [rows] = await connection.execute(`SELECT COUNT(*) as count FROM ${tableName}`);
            console.log(`- ${tableName}: ${(rows as any)[0].count} registros`);
        }

        await connection.end();
    } catch (err) {
        console.error('❌ Error de conexión:');
        console.error('Código:', err.code);
        console.error('Mensaje:', err.message);
    }
}

testConnection();
