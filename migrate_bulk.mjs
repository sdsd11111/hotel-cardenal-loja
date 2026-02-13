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
        console.log('Connecting...');
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
                .replace(/utf8mb4_0900_bin/g, 'utf8mb4_bin')
                .replace(/CONSTRAINT `.*?` CHECK \(.*?\)/gi, '')
                .replace(/, CONSTRAINT `.*?` FOREIGN KEY .*? REFERENCES .*?\)/gi, '');

            await newConn.execute(`DROP TABLE IF EXISTS \`${tableName}\``);
            try {
                await newConn.execute(createSql);
            } catch (e) {
                await newConn.execute(createSql.replace(/COLLATE=\w+/g, ''));
            }

            const [data] = await oldConn.execute(`SELECT * FROM \`${tableName}\``);
            if (data.length === 0) {
                console.log('  Empty.');
                continue;
            }

            const [fields] = await newConn.execute(`DESCRIBE \`${tableName}\``);
            const validCols = fields.map(f => f.Field);
            const isNumeric = {};
            fields.forEach(f => {
                const type = f.Type.toLowerCase();
                isNumeric[f.Field] = type.includes('int') || type.includes('decimal') || type.includes('float') || type.includes('double');
            });

            const bulkValues = data.map(row => validCols.map(c => {
                let val = row[c];
                if (isNumeric[c] && (val === '' || val === undefined)) return null;
                if (val instanceof Date) return formatDate(val);
                return val;
            }));

            const insertSql = `INSERT INTO \`${tableName}\` (${validCols.map(c => `\`${c}\``).join(', ')}) VALUES ?`;
            await newConn.query(insertSql, [bulkValues]);
            console.log(`  Done (${data.length} rows).`);
        }

        await newConn.execute('SET FOREIGN_KEY_CHECKS = 1');
        console.log('\nSUCCESS!');
    } catch (e) {
        console.error('\nFAIL:', e.message);
    } finally {
        if (oldConn) await oldConn.end();
        if (newConn) await newConn.end();
    }
}
run();
