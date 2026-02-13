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

async function debugAnuncios() {
    let oldConn, newConn;
    try {
        oldConn = await mysql.createConnection(oldConfig);
        newConn = await mysql.createConnection(newConfig);
        console.log('Connected!');

        const tableName = 'anuncios';
        const [createRows] = await oldConn.execute(`SHOW CREATE TABLE \`${tableName}\``);
        let createSql = createRows[0]['Create Table']
            .replace(/utf8mb4_0900_ai_ci/g, 'utf8mb4_unicode_ci')
            .replace(/utf8mb4_0900_as_cs/g, 'utf8mb4_unicode_ci')
            .replace(/CONSTRAINT `.*?` CHECK \(.*?\)/gi, '')
            .replace(/, CONSTRAINT `.*?` FOREIGN KEY .*? REFERENCES .*?\)/gi, '');

        await newConn.execute(`DROP TABLE IF EXISTS \`${tableName}\``);
        await newConn.execute(createSql);
        console.log('Table recreated.');

        const [fields] = await newConn.execute(`DESCRIBE \`${tableName}\``);
        const validCols = fields.map(f => f.Field);
        console.log('Columns:', validCols);

        const [data] = await oldConn.execute(`SELECT * FROM \`${tableName}\``);
        console.log(`Found ${data.length} rows.`);

        for (const row of data) {
            const values = validCols.map(c => {
                let val = row[c];
                if (val instanceof Date) return formatDate(val);
                if (typeof val === 'object' && val !== null) return JSON.stringify(val);
                return val;
            });

            const placeholders = validCols.map(() => '?').join(', ');
            const insertSql = `INSERT INTO \`${tableName}\` (${validCols.map(c => `\`${c}\``).join(', ')}) VALUES (${placeholders})`;

            console.log('Executing SQL:', insertSql.substring(0, 100) + '...');
            console.log('Values:', JSON.stringify(values).substring(0, 100) + '...');

            try {
                await newConn.execute(insertSql, values);
                console.log('Row inserted successfully!');
            } catch (err) {
                console.error('ERROR inserting row:', err.message);
                // Try manual formatting to see the final SQL
                const formatted = mysql.format(insertSql, values);
                console.log('Final SQL:', formatted);
            }
        }

    } catch (e) {
        console.error('Global Error:', e);
    } finally {
        if (oldConn) await oldConn.end();
        if (newConn) await newConn.end();
    }
}

debugAnuncios();
