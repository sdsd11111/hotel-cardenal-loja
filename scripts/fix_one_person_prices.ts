import 'dotenv/config';
import { query } from '../src/lib/mysql';

async function updateConfigs() {
    try {
        const configs: any = await query('SELECT id, identifier, price_options_json FROM room_type_configs');

        for (const config of configs) {
            let options = JSON.parse(config.price_options_json);
            let hasOnePerson = options.some((opt: any) => opt.personas === 1);

            if (hasOnePerson) {
                options = options.map((opt: any) => {
                    if (opt.personas === 1 && opt.precioBase <= 1) {
                        return { ...opt, precioBase: 20 }; // Fix $1 or lower
                    }
                    return opt;
                });
            } else {
                // Add default 1 person option
                options.push({
                    personas: 1,
                    personasIconos: 1,
                    precioBase: 20,
                    impuestos: 3,
                    incluye: ["Desayuno incluido", "WiFi alta velocidad"]
                });
                // Sort by personas
                options.sort((a: any, b: any) => a.personas - b.personas);
            }

            await query('UPDATE room_type_configs SET price_options_json = ? WHERE id = ?', [JSON.stringify(options), config.id]);
            console.log(`Updated config for ${config.identifier}`);
        }
    } catch (e) {
        console.error(e);
    } finally {
        process.exit();
    }
}

updateConfigs();
