
import mysql from 'mysql2/promise';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const config = {
    host: '45.177.125.167',
    user: 'platos',
    password: 'pL{f_#tS}8o!',
    database: 'platos',
    connectTimeout: 20000
};

async function backup() {
    let connection;
    try {
        connection = await mysql.createConnection(config);
        const [tables] = await connection.query('SHOW TABLES');
        const backupData = {};

        for (const tableRow of tables) {
            const tableName = Object.values(tableRow)[0];
            console.log(`Backing up ${tableName}...`);

            const [[schemaRow]] = await connection.query(`SHOW CREATE TABLE ${tableName}`);
            const schema = schemaRow['Create Table'];

            const [rows] = await connection.query(`SELECT * FROM ${tableName}`);

            // Convert buffers to hex strings
            const processedRows = rows.map(row => {
                const newRow = { ...row };
                for (const key in newRow) {
                    if (Buffer.isBuffer(newRow[key])) {
                        newRow[key] = '0x' + newRow[key].toString('hex');
                    }
                }
                return newRow;
            });

            backupData[tableName] = { schema, rows: processedRows };
        }

        const fileName = `db_backup_final.json`;
        fs.writeFileSync(fileName, JSON.stringify(backupData, null, 2));
        console.log(`Backup saved to ${fileName}`);
    } catch (error) {
        console.error('Backup failed:', error);
    } finally {
        if (connection) await connection.end();
    }
}

backup();
