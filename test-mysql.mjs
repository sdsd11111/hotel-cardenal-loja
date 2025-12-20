import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });

async function testConnection() {
    console.log('--- Probando Conexión MySQL ---');
    console.log('Host:', process.env.MYSQL_HOST);
    console.log('User:', process.env.MYSQL_USER);
    console.log('Database:', process.env.MYSQL_DATABASE);
    console.log('-------------------------------');

    try {
        const connection = await mysql.createConnection({
            host: process.env.MYSQL_HOST,
            user: process.env.MYSQL_USER,
            password: process.env.MYSQL_PASSWORD,
            database: process.env.MYSQL_DATABASE,
            connectTimeout: 10000
        });

        console.log('✅ ¡Conexión exitosa!');
        await connection.end();
    } catch (err) {
        console.error('❌ Error de conexión:');
        console.error('Código:', err.code);
        console.error('Mensaje:', err.message);

        if (err.code === 'ER_ACCESS_DENIED_ERROR') {
            console.log('\n--- SUGERENCIAS PARA "ACCESS DENIED" ---');
            console.log('1. Revisa el PREFIJO: En cPanel, el usuario suele ser algo como "usuarioCpanel_platos".');
            console.log('2. Revisa la CONTRASEÑA: Asegúrate de que coincida exactamente en el .env.');
            console.log('3. Revisa los PRIVILEGIOS: En cPanel -> MySQL Databases, asegúrate de que el usuario esté ASIGNADO a la base de datos con todos los privilegios.');
        }
    }
}

testConnection();
