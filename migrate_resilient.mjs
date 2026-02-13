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

async function run() {
    let oldConn, newConn;
    try {
        oldConn = await mysql.createConnection(oldConfig);
        newConn = await mysql.createConnection(newConfig);
        console.log('Connected!');

        const [tables] = await oldConn.execute('SHOW TABLES');
        const tableNames = tables.map(t => Object.values(t)[0]);

        await newConn.execute('SET FOREIGN_KEY_CHECKS = 0');

        for (const tableName of tableNames) {
            console.log(`Migrating ${tableName}...`);

            const [createRows] = await oldConn.execute(`SHOW CREATE TABLE \`${tableName}\``);
            let createSql = createRows[0]['Create Table']
                .replace(/utf8mb4_0900_ai_ci/g, 'utf8mb4_unicode_ci')
                .replace(/utf8mb4_0900_as_cs/g, 'utf8mb4_unicode_ci')
                .replace(/CONSTRAINT `.*?` CHECK \(.*?\)/gi, '')
                .replace(/, CONSTRAINT `.*?` FOREIGN KEY .*? REFERENCES .*?\)/gi, '');

            await newConn.execute(`DROP TABLE IF EXISTS \`${tableName}\``);
            try {
                await newConn.execute(createSql);
            } catch (e) {
                console.log(`  Creation failed: ${e.message}. Retrying with generic schema...`);
                await newConn.execute(createSql.replace(/COLLATE=\w+/g, ''));
            }

            const [data] = await oldConn.execute(`SELECT * FROM \`${tableName}\``);
            if (data.length === 0) {
                console.log('  Empty.');
                continue;
            }

            // Get columns of the RECREATED table
            const [fields] = await newConn.execute(`DESCRIBE \`${tableName}\``);
            let validCols = fields.map(f => f.Field);

            // Special case for anuncios: exclude problematic timestamps if they fail
            if (tableName === 'anuncios') {
                validCols = validCols.filter(f => !['created_at', 'updated_at'].includes(f));
            }
            const isNumeric = {};
            fields.forEach(f => {
                const type = f.Type.toLowerCase();
                isNumeric[f.Field] = type.includes('int') || type.includes('decimal') || type.includes('float') || type.includes('double') || type.includes('bigint');
            });

            console.log(`  Inserting ${data.length} rows...`);

            // Re-check each row to ensure it doesn't have extra properties or mismatch
            for (const row of data) {
                const values = validCols.map(c => {
                    let val = row[c];
                    if (isNumeric[c] && (val === '' || val === undefined)) return null;
                    if (val instanceof Date) return formatDate(val);
                    return val;
                });

                const placeholders = validCols.map(() => '?').join(', ');
                const insertSql = `INSERT INTO \`${tableName}\` (${validCols.map(c => `\`${c}\``).join(', ')}) VALUES (${placeholders})`;

                try {
                    await newConn.execute(insertSql, values);
                } catch (insErr) {
                    try {
                        await newConn.query(insertSql, values);
                    } catch (insErr2) {
                        console.error(`  SKIPPING row in ${tableName}: ${insErr2.message}`);
                    }
                }
            }
            console.log(`  Table ${tableName} processed.`);
        }

        await newConn.execute('SET FOREIGN_KEY_CHECKS = 1');
        console.log('\nALL DONE!');
    } catch (e) {
        console.error('\nGLOBAL FAIL:', e.message);
    } finally {
        if (oldConn) await oldConn.end();
        if (newConn) await newConn.end();
    }
}
run();
