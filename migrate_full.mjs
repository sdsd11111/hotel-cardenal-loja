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

async function migrate() {
    let oldConn, newConn;
    try {
        console.log('Connecting to databases...');
        oldConn = await mysql.createConnection(oldConfig);
        newConn = await mysql.createConnection(newConfig);
        console.log('Connected!');

        // Get all tables
        const [tables] = await oldConn.execute('SHOW TABLES');
        const tableNames = tables.map(t => Object.values(t)[0]);
        console.log(`Found ${tableNames.length} tables: ${tableNames.join(', ')}`);

        // Disable foreign key checks for the duration of the migration
        await newConn.execute('SET FOREIGN_KEY_CHECKS = 0');

        for (const tableName of tableNames) {
            console.log(`\n>>> STARTING MIGRATION FOR TABLE: ${tableName} <<<`);
            // 1. Get CREATE TABLE statement
            const [createRows] = await oldConn.execute(`SHOW CREATE TABLE \`${tableName}\``);
            let createSql = createRows[0]['Create Table'];

            // Fix collation issues (MySQL 8.0 -> older or incompatible versions)
            createSql = createSql.replace(/utf8mb4_0900_ai_ci/g, 'utf8mb4_unicode_ci');

            // 2. Drop table if exists in new DB and recreate
            await newConn.execute(`DROP TABLE IF EXISTS \`${tableName}\``);
            try {
                await newConn.execute(createSql);
                console.log(`  Schema created.`);
            } catch (schemaErr) {
                console.error(`  Error creating schema for ${tableName}:`, schemaErr.message);
                // Try one more time removing explicit collation
                const genericSql = createSql.replace(/COLLATE=\w+/g, '');
                console.log(`  Retrying with generic schema...`);
                await newConn.execute(genericSql);
                console.log(`  Schema created (generic).`);
            }

            // 3. Copy data
            console.log(`  Fetching data from ${tableName}...`);
            const [data] = await oldConn.execute(`SELECT * FROM \`${tableName}\``);

            if (data.length > 0) {
                console.log(`  Inserting ${data.length} rows...`);
                const columns = Object.keys(data[0]);
                const columnsSql = columns.map(c => `\`${c}\``).join(', ');
                const placeholders = columns.map(() => '?').join(', ');
                const insertSql = `INSERT INTO \`${tableName}\` (${columnsSql}) VALUES (${placeholders})`;

                // Get column types to handle empty strings for numbers
                const [fields] = await newConn.execute(`DESCRIBE \`${tableName}\``);
                const isNumeric = {};
                fields.forEach(f => {
                    const type = f.Type.toLowerCase();
                    isNumeric[f.Field] = type.includes('int') || type.includes('decimal') || type.includes('float') || type.includes('double');
                });

                for (const row of data) {
                    const escapedValues = columns.map(c => {
                        let val = row[c];
                        // If numeric column and value is empty string or undefined, make it null
                        if (isNumeric[c] && (val === '' || val === undefined)) {
                            return 'NULL';
                        }
                        // Format dates to YYYY-MM-DD HH:mm:ss manually to avoid millisecond issues on old MySQL/MariaDB
                        if (val instanceof Date) {
                            const pad = (n) => n.toString().padStart(2, '0');
                            const formatted = `${val.getUTCFullYear()}-${pad(val.getUTCMonth() + 1)}-${pad(val.getUTCDate())} ${pad(val.getUTCHours())}:${pad(val.getUTCMinutes())}:${pad(val.getUTCSeconds())}`;
                            return `'${formatted}'`;
                        }
                        // Use the connection's escape method for safety
                        return newConn.escape(val);
                    });

                    const rawSql = `INSERT INTO \`${tableName}\` (${columnsSql}) VALUES (${escapedValues.join(', ')})`;

                    try {
                        await newConn.query(rawSql);
                    } catch (insErr) {
                        console.error(`    Error inserting row in ${tableName}:`, insErr.message);
                        console.error(`    FULL SQL: ${rawSql}`);
                        throw insErr;
                    }
                }
                console.log(`  Data inserted.`);
            } else {
                console.log(`  Table is empty.`);
            }
        }

        // Re-enable foreign key checks
        await newConn.execute('SET FOREIGN_KEY_CHECKS = 1');

        console.log('\nMigration completed successfully!');

    } catch (error) {
        console.error('\nMigration FAILED:', error);
    } finally {
        if (oldConn) await oldConn.end();
        if (newConn) await newConn.end();
    }
}

migrate();
