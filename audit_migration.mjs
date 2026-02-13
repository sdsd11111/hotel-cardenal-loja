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

async function audit() {
    let oldConn, newConn;
    try {
        oldConn = await mysql.createConnection(oldConfig);
        newConn = await mysql.createConnection(newConfig);

        const [tables] = await oldConn.execute('SHOW TABLES');
        const tableNames = tables.map(t => Object.values(t)[0]);

        console.log('--- DATABASE MIGRATION AUDIT ---');
        let allOk = true;

        for (const name of tableNames) {
            const [[{ count: oldCount }]] = await oldConn.execute(`SELECT COUNT(*) as count FROM \`${name}\``);

            let newCount = -1;
            try {
                const [[{ count: nc }]] = await newConn.execute(`SELECT COUNT(*) as count FROM \`${name}\``);
                newCount = nc;
            } catch (e) { }

            if (oldCount === newCount) {
                console.log(`[OK] ${name}: ${oldCount} rows`);
            } else {
                console.log(`[MISMATCH] ${name}: Old=${oldCount}, New=${newCount}`);
                allOk = false;
            }
        }

        if (allOk) {
            console.log('\nAudit SUCCESSFUL: All tables match perfectly.');
        } else {
            console.log('\nAudit FAILED: Some tables have missing data.');
        }

    } catch (e) {
        console.error(e);
    } finally {
        if (oldConn) await oldConn.end();
        if (newConn) await newConn.end();
    }
}
audit();
