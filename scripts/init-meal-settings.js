
const { query } = require('./src/lib/mysql');

async function initMealSettings() {
    const settings = [
        { key: 'breakfast_price', value: '0', name: 'Precio Desayuno', desc: 'Precio por persona por noche', cat: 'precios' },
        { key: 'lunch_price', value: '0', name: 'Precio Almuerzo', desc: 'Precio por persona por noche', cat: 'precios' },
        { key: 'dinner_price', value: '0', name: 'Precio Cena', desc: 'Precio por persona por noche', cat: 'precios' }
    ];

    for (const s of settings) {
        const existing = await query('SELECT * FROM hotel_settings WHERE setting_key = ?', [s.key]);
        if (existing.length === 0) {
            console.log(`Inserting ${s.key}...`);
            await query(
                'INSERT INTO hotel_settings (setting_key, setting_value, display_name, description, category) VALUES (?, ?, ?, ?, ?)',
                [s.key, s.value, s.name, s.desc, s.cat]
            );
        } else {
            console.log(`${s.key} already exists.`);
        }
    }
    process.exit(0);
}

initMealSettings().catch(err => {
    console.error(err);
    process.exit(1);
});
