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

async function checkSchemas() {
    let oldConn, newConn;
    try {
        oldConn = await mysql.createConnection(oldConfig);
        newConn = await mysql.createConnection(newConfig);

        const [tables] = await oldConn.execute('SHOW TABLES');
        const tableNames = tables.map(t => Object.values(t)[0]);

        for (const name of tableNames) {
            console.log(`Table: ${name}`);
            const [oldFields] = await oldConn.execute(`DESCRIBE \`${name}\``);

            oldFields.forEach(f => {
                if (f.Extra) console.log(`  ${f.Field}: Extra=${f.Extra}`);
            });
            const [newExists] = await newConn.execute(`SHOW TABLES LIKE '${name}'`);

            if (newExists.length === 0) {
                console.log(`  MISSING in new DB`);
                continue;
            }

            const [newFields] = await newConn.execute(`DESCRIBE \`${name}\``);

            const oldCols = oldFields.map(f => f.Field);
            const newCols = newFields.map(f => f.Field);

            if (oldCols.length !== newCols.length) {
                console.log(`  !!! COLUMN COUNT MISMATCH: Old=${oldCols.length}, New=${newCols.length}`);
                console.log(`  Old: ${oldCols.join(', ')}`);
                console.log(`  New: ${newCols.join(', ')}`);
            } else {
                console.log(`  Match (${oldCols.length} columns)`);
            }
        }

    } catch (e) {
        console.error(e);
    } finally {
        if (oldConn) await oldConn.end();
        if (newConn) await newConn.end();
    }
}

checkSchemas();
