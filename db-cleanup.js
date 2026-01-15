const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function cleanup() {
    try {
        console.log("Starting cleanup...");

        // Manual .env parsing
        const envPath = path.join(__dirname, '.env');
        const envContent = fs.readFileSync(envPath, 'utf8');
        const env = {};
        envContent.split('\n').forEach(line => {
            const [key, value] = line.split('=');
            if (key && value) env[key.trim()] = value.trim();
        });

        const connection = await mysql.createConnection({
            host: env.MYSQL_HOST,
            user: env.MYSQL_USER,
            password: env.MYSQL_PASSWORD,
            database: env.MYSQL_DATABASE
        });

        const [result] = await connection.execute(
            "DELETE FROM reservas WHERE (numero_reserva != 'hotel-8486480788' OR numero_reserva IS NULL) AND id > 0"
        );

        console.log("Reservations deleted:", result.affectedRows);
        await connection.end();
        process.exit(0);
    } catch (err) {
        console.error("Error during cleanup:", err);
        process.exit(1);
    }
}

cleanup();
