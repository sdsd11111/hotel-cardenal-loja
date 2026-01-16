const mysql = require('mysql2/promise');
const fs = require('fs');
require('dotenv').config();

async function migrate() {
    let connection;
    try {
        connection = await mysql.createConnection({
            host: process.env.MYSQL_HOST,
            user: process.env.MYSQL_USER,
            password: process.env.MYSQL_PASSWORD,
            database: process.env.MYSQL_DATABASE,
        });

        console.log('Connected to database:', process.env.MYSQL_DATABASE);

        // Step 1: Alter the column from ENUM to VARCHAR
        console.log('\n[STEP 1] Converting estado column from ENUM to VARCHAR(50)...');
        await connection.execute('ALTER TABLE reservas MODIFY COLUMN estado VARCHAR(50) DEFAULT "PENDIENTE"');
        console.log('✓ Column altered successfully.');

        // Step 2: Clean up empty/null statuses
        console.log('\n[STEP 2] Cleaning up empty statuses...');
        const [cleanupResult] = await connection.execute(
            'UPDATE reservas SET estado = "PENDIENTE" WHERE estado = "" OR estado IS NULL'
        );
        console.log(`✓ Fixed ${cleanupResult.affectedRows} records with empty status.`);

        // Step 3: Test update to OK
        console.log('\n[STEP 3] Testing update to OK for ID 17...');
        await connection.execute('UPDATE reservas SET estado = ? WHERE id = ?', ['OK', 17]);

        const [verifyResult] = await connection.execute('SELECT id, nombre_cliente, estado FROM reservas WHERE id = 17');
        console.log('✓ Verification:', verifyResult[0]);

        if (verifyResult[0].estado === 'OK') {
            console.log('\n✅ SUCCESS! Status updates are now working correctly.');
        } else {
            console.log('\n❌ FAILED! Status is still:', verifyResult[0].estado);
        }

        const result = {
            success: true,
            cleanupCount: cleanupResult.affectedRows,
            testRecord: verifyResult[0]
        };

        fs.writeFileSync('migration_result.json', JSON.stringify(result, null, 2));

        await connection.end();
    } catch (e) {
        console.error('\n❌ Migration failed:', e.message);
        fs.writeFileSync('migration_error.txt', e.stack);
        if (connection) await connection.end();
        process.exit(1);
    }
}

migrate();
