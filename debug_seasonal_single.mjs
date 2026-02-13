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

async function debugSingle() {
    let oc, nc;
    try {
        oc = await mysql.createConnection(oldConfig);
        nc = await mysql.createConnection(newConfig);

        const [rows] = await oc.execute('SELECT * FROM room_seasonal_prices LIMIT 1');
        const row = rows[0];

        const [fields] = await nc.execute('DESCRIBE room_seasonal_prices');
        const validCols = fields.map(f => f.Field);

        console.log('Valid Cols in New DB:', validCols);
        console.log('Values in Row from Old DB:', Object.keys(row));

        const values = validCols.map(c => row[c]);
        const placeholders = validCols.map(() => '?').join(', ');
        const sql = `INSERT INTO room_seasonal_prices (${validCols.map(c => `\`${c}\``).join(', ')}) VALUES (${placeholders})`;

        console.log('SQL:', sql);
        console.log('Values Count:', values.length);

        try {
            await nc.query(sql, values);
            console.log('Row inserted successfully!');
        } catch (e) {
            console.error('ERROR:', e.message);
            // Check if mysql2.query is doing something weird with arrays
            const formatted = mysql.format(sql, values);
            console.log('Formatted SQL via mysql.format:', formatted);
        }

    } catch (e) {
        console.error(e);
    } finally {
        if (oc) await oc.end();
        if (nc) await nc.end();
    }
}
debugSingle();
