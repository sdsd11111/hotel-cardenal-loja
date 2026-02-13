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
        const tableNames = tables.map(t => Object.values(t)[0]);
        console.log(`Found ${tableNames.length} tables.`);

        await newConn.execute('SET FOREIGN_KEY_CHECKS = 0');

        for (const tableName of tableNames) {
            console.log(`\n--- Migrating: ${tableName} ---`);

            const [createRows] = await oldConn.execute(`SHOW CREATE TABLE \`${tableName}\``);
            let createSql = createRows[0]['Create Table'];
            // Clean up collation for target
            createSql = createSql.replace(/utf8mb4_0900_ai_ci/g, 'utf8mb4_unicode_ci');

            await newConn.execute(`DROP TABLE IF EXISTS \`${tableName}\``);
            try {
                await newConn.execute(createSql);
                console.log(`  Table recreated.`);
            } catch (e) {
                console.log(`  Creation failed, retrying without collation...`);
                const genericSql = createSql.replace(/COLLATE=\w+/g, '');
                await newConn.execute(genericSql);
                console.log(`  Table recreated (generic).`);
            }

            const [data] = await oldConn.execute(`SELECT * FROM \`${tableName}\``);
            if (data.length === 0) {
                console.log(`  No data to migrate.`);
                continue;
            }

            // Get columns from the NEW table to see what's actually there
            const [fields] = await newConn.execute(`DESCRIBE \`${tableName}\``);
            const validColumns = fields
                .filter(f => !f.Extra.toLowerCase().includes('generated'))
                .map(f => f.Field);

            const isNumeric = {};
            fields.forEach(f => {
                const type = f.Type.toLowerCase();
                isNumeric[f.Field] = type.includes('int') || type.includes('decimal') || type.includes('float') || type.includes('double');
            });

            console.log(`  Inserting ${data.length} rows into ${validColumns.length} columns...`);

            const columnsSql = validColumns.map(c => `\`${c}\``).join(', ');
            const placeholders = validColumns.map(() => '?').join(', ');
            const insertSql = `INSERT INTO \`${tableName}\` (${columnsSql}) VALUES (${placeholders})`;

            for (let i = 0; i < data.length; i++) {
                const row = data[i];
                const values = validColumns.map(c => {
                    let val = row[c];
                    if (isNumeric[c] && (val === '' || val === undefined)) return null;
                    if (val instanceof Date) return formatDate(val);
                    return val;
                });

                try {
                    const formattedSql = mysql.format(insertSql, values);
                    await newConn.query(formattedSql);
                } catch (insErr) {
                    console.error(`  ERROR on row ${i} of ${tableName}:`, insErr.message);
                    const formattedSql = mysql.format(insertSql, values);
                    console.log(`  SQL causing error:`, formattedSql);
                    throw insErr;
                }
            }
            console.log(`  Success.`);
        }

        await newConn.execute('SET FOREIGN_KEY_CHECKS = 1');
        console.log('\nMigration SUCCESSFUL!');

    } catch (error) {
        console.error('\nGLOBAL FAILURE:', error.message);
    } finally {
        if (oldConn) await oldConn.end();
        if (newConn) await newConn.end();
    }
}

migrate();
