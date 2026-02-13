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
    return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())} ${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())}:${pad(date.getUTCSeconds())}`;
}

async function run() {
    let oc, nc;
    try {
        oc = await mysql.createConnection(oldConfig);
        nc = await mysql.createConnection(newConfig);
        console.log('Connected!');

        const tableName = 'room_seasonal_prices';
        const [rows] = await oc.execute(`SELECT * FROM \`${tableName}\``);

        const [fields] = await nc.execute(`DESCRIBE \`${tableName}\``);
        const writableCols = fields
            .filter(f => !['id', 'created_at', 'updated_at'].includes(f.Field))
            .map(f => f.Field);

        console.log(`Table has ${rows.length} rows. Writing to ${writableCols.length} columns.`);

        await nc.execute('SET FOREIGN_KEY_CHECKS = 0');
        await nc.execute(`DELETE FROM \`${tableName}\``);

        for (const row of rows) {
            const escapedValues = writableCols.map(c => {
                let val = row[c];
                if (val === null || val === undefined) return 'NULL';
                if (val instanceof Date) return `'${formatDate(val)}'`;
                return nc.escape(val);
            });

            const sql = `INSERT INTO \`${tableName}\` (\`${writableCols.join('`, `')}\`) VALUES (${escapedValues.join(', ')})`;
            console.log(`Executing: ${sql.substring(0, 100)}...`);
            await nc.query(sql);
        }

        await nc.execute('SET FOREIGN_KEY_CHECKS = 1');
        console.log('DONE!');
    } catch (e) {
        console.error('FAIL:', e.message);
        if (e.sql) console.log('SQL:', e.sql);
    } finally {
        if (oc) await oc.end();
        if (nc) await nc.end();
    }
}
run();
