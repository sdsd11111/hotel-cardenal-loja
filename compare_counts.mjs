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

async function compare() {
    let oldConn, newConn;
    try {
        oldConn = await mysql.createConnection(oldConfig);
        newConn = await mysql.createConnection(newConfig);

        const [tables] = await oldConn.execute('SHOW TABLES');
        const tableNames = tables.map(t => Object.values(t)[0]);

        console.log(`| Table Name | Old Count | New Count | Status |`);
        console.log(`| :--- | :--- | :--- | :--- |`);

        for (const name of tableNames) {
            const [[{ count: oldCount }]] = await oldConn.execute(`SELECT COUNT(*) as count FROM \`${name}\``);

            let newCount = 'N/A';
            let status = 'MISSING';
            try {
                const [[{ count: nc }]] = await newConn.execute(`SELECT COUNT(*) as count FROM \`${name}\``);
                newCount = nc;
                status = (oldCount === newCount) ? 'OK' : 'MISMATCH';
            } catch (e) { }

            console.log(`| ${name} | ${oldCount} | ${newCount} | ${status} |`);
        }

    } catch (e) {
        console.error(e);
    } finally {
        if (oldConn) await oldConn.end();
        if (newConn) await newConn.end();
    }
}
compare();
