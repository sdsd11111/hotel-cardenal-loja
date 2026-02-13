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

function formatDate(date) {
    const pad = (n) => n.toString().padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

async function migrate() {
    let oldConn, newConn;
    try {
        console.log('Connecting to databases...');
        oldConn = await mysql.createConnection(oldConfig);
        newConn = await mysql.createConnection(newConfig);
        console.log('Connected!');

        const [tables] = await oldConn.execute('SHOW TABLES');
        const allTableNames = tables.map(t => Object.values(t)[0]);
        const tableNames = allTableNames.filter(t => t !== 'anuncios');
        console.log(`Found ${allTableNames.length} tables. Migrating ${tableNames.length} tables (skipping anuncios)...`);
        console.log(`Tables to migrate: ${tableNames.join(', ')}`);

        await newConn.execute('SET FOREIGN_KEY_CHECKS = 0');

        for (const tableName of tableNames) {
            console.log(`\nMigrating table: ${tableName}...`);

            const [createRows] = await oldConn.execute(`SHOW CREATE TABLE \`${tableName}\``);
            let createSql = createRows[0]['Create Table'];
            createSql = createSql.replace(/utf8mb4_0900_ai_ci/g, 'utf8mb4_unicode_ci');

            await newConn.execute(`DROP TABLE IF EXISTS \`${tableName}\``);
            try {
                await newConn.execute(createSql);
            } catch (e) {
                const genericSql = createSql.replace(/COLLATE=\w+/g, '');
                await newConn.execute(genericSql);
            }

            const [data] = await oldConn.execute(`SELECT * FROM \`${tableName}\``);

            if (data.length > 0) {
                const columns = Object.keys(data[0]);
                console.log(`  Columns (${columns.length}): ${columns.join(', ')}`);
                console.log(`  Inserting ${data.length} rows...`);
                const columnsSql = columns.map(c => `\`${c}\``).join(', ');
                const placeholders = columns.map(() => '?').join(', ');
                const insertSql = `INSERT INTO \`${tableName}\` (${columnsSql}) VALUES (${placeholders})`;

                const [fields] = await newConn.execute(`DESCRIBE \`${tableName}\``);
                const isNumeric = {};
                fields.forEach(f => {
                    const type = f.Type.toLowerCase();
                    isNumeric[f.Field] = type.includes('int') || type.includes('decimal') || type.includes('float') || type.includes('double');
                });

                for (const row of data) {
                    const values = columns.map(c => {
                        let val = row[c];
                        if (isNumeric[c] && (val === '' || val === undefined)) return null;
                        if (val instanceof Date) return formatDate(val);
                        return val;
                    });

                    try {
                        // Use query with parameters - mysql2 will escape them properly
                        // but since we pre-format Dates as strings, it won't add milliseconds.
                        await newConn.query(insertSql, values);
                    } catch (insErr) {
                        console.error(`    Error in ${tableName}:`, insErr.message);
                        throw insErr;
                    }
                }
                console.log(`  Done.`);
            }
        }

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
