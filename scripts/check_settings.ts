
import { query } from '../src/lib/mysql.js';
import dotenv from 'dotenv';
dotenv.config();

async function check() {
    try {
        const settings = await query('SELECT * FROM hotel_settings');
        console.log(JSON.stringify(settings, null, 2));
    } catch (err) {
        console.error(err);
    } finally {
        process.exit();
    }
}

check();
