require('dotenv').config();

const mysql = require('mysql2/promise');

async function testEnv() {
    const fs = require('fs');
    let output = '--- Checking .env values ---\n';
    const vars = ['MYSQL_HOST', 'MYSQL_USER', 'MYSQL_DATABASE', 'MYSQL_PASSWORD'];
    for (const v of vars) {
        const val = process.env[v];
        if (val) {
            output += `${v} [${val.length}]: "${val}" | Hex: ${Buffer.from(val).toString('hex')}\n`;
        } else {
            output += `${v}: NOT SET\n`;
        }
    }

    const config = {
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE,
        connectTimeout: 10000
    };

    try {
        const connection = await mysql.createConnection(config);
        output += '\nSUCCESS: Connected!\n';
        await connection.end();
    } catch (e) {
        output += `\nERROR: ${e.message}\n`;
    }

    fs.writeFileSync('debug-env.txt', output, 'utf8');
    console.log('Log written to debug-env.txt');
}

testEnv();
