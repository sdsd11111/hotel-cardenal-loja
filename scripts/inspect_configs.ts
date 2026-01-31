import 'dotenv/config';
import { query } from '../src/lib/mysql';

async function checkConfigs() {
    try {
        const configs = await query('SELECT identifier, display_title, price_options_json FROM room_type_configs');
        console.log('--- Room Type Configs ---');
        console.log(JSON.stringify(configs, null, 2));
    } catch (e) {
        console.error(e);
    } finally {
        process.exit();
    }
}

checkConfigs();
