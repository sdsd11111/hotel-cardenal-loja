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

        const tableName = 'room_seasonal_prices';
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
        console.log('Table recreated.');

        const [data] = await oldConn.execute(`SELECT * FROM \`${tableName}\``);
        if (data.length > 0) {
            const [fields] = await newConn.execute(`DESCRIBE \`${tableName}\``);
            const validCols = fields
                .filter(f => !['id', 'created_at', 'updated_at'].includes(f.Field) && !f.Extra.toLowerCase().includes('generated') && !f.Extra.toLowerCase().includes('virtual'))
                .map(f => f.Field);

            console.log(`Valid columns for migration: ${validCols.join(', ')}`);

            for (const row of data) {
                const values = validCols.map(c => {
                    let val = row[c];
                    if (val instanceof Date) return formatDate(val);
                    if (typeof val === 'object' && val !== null) return JSON.stringify(val);
                    return val;
                });
                const placeholders = validCols.map(() => '?').join(', ');
                const insertSql = `INSERT INTO \`${tableName}\` (${validCols.map(c => `\`${c}\``).join(', ')}) VALUES (${placeholders})`;

                try {
                    await newConn.query(insertSql, values);
                } catch (insErr) {
                    console.error(`  ERROR on row: ${insErr.message}`);
                    console.error(`  Columns (${validCols.length}): ${validCols.join(', ')}`);
                    console.error(`  Values (${values.length}): ${JSON.stringify(values).substring(0, 500)}`);
                    throw insErr;
                }
            }
            console.log(`Inserted ${data.length} rows.`);
        } else {
            console.log('Table is empty.');
        }
        console.log('SUCCESS for room_seasonal_prices!');
    } catch (e) {
        console.error('FAIL:', e.message);
    } finally {
        if (oldConn) await oldConn.end();
        if (newConn) await newConn.end();
    }
}
run();
