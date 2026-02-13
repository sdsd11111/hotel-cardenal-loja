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
            const [[{ count: oldCount }]] = await oldConn.execute(`SELECT COUNT(*) as count FROM \`${tableName}\``);
            let newCount = -1;
            try {
                const [[{ count: nc }]] = await newConn.execute(`SELECT COUNT(*) as count FROM \`${tableName}\``);
                newCount = nc;
            } catch (e) {
                console.log(`Table ${tableName} missing in new DB.`);
            }

            if (oldCount === newCount) {
                console.log(`[OK] ${tableName}: ${oldCount}`);
                continue;
            }

            console.log(`[MISMATCH] ${tableName}: Old=${oldCount}, New=${newCount}. Re-migrating...`);

            // Re-migrate logic
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
                await newConn.execute(createSql.replace(/COLLATE=\w+/g, ''));
            }

            const [data] = await oldConn.execute(`SELECT * FROM \`${tableName}\``);
            if (data.length > 0) {
                const [fields] = await newConn.execute(`DESCRIBE \`${tableName}\``);

                // Exclusions logic for generated/virtual columns
                // Also exclude timestamps/id for safety if they caused issues before (like in anuncios/seasonal)
                // But try to include them if possible. 
                // Using filtering logic from previous successful attempts.
                let validCols = fields
                    .filter(f => !f.Extra.toLowerCase().includes('generated') && !f.Extra.toLowerCase().includes('virtual'))
                    .map(f => f.Field);

                // Specific exclusions for problematic tables if needed
                if (tableName === 'anuncios') {
                    // Anuncios worked with exclusions in one script, but let's try standard first?
                    // Actually, better to use the robust logic: stringify objects.
                }

                console.log(`  Inserting ${data.length} rows...`);

                const placeholders = validCols.map(() => '?').join(', ');
                const insertSql = `INSERT INTO \`${tableName}\` (${validCols.map(c => `\`${c}\``).join(', ')}) VALUES (${placeholders})`;

                for (const row of data) {
                    const values = validCols.map(c => {
                        let val = row[c];
                        if (val instanceof Date) return formatDate(val);
                        if (typeof val === 'object' && val !== null) return JSON.stringify(val);
                        return val;
                    });

                    try {
                        await newConn.query(insertSql, values);
                    } catch (err) {
                        console.error(`  Error inserting row: ${err.message}`);
                        // Optionally try skipping problematic columns like created_at if it fails
                    }
                }
                console.log(`  Done.`);
            }
        }

        await newConn.execute('SET FOREIGN_KEY_CHECKS = 1');
        console.log('\nFINAL SYNC COMPLETE!');

    } catch (e) {
        console.error(e);
    } finally {
        if (oldConn) await oldConn.end();
        if (newConn) await newConn.end();
    }
}
run();
