
import { query } from '../src/lib/mysql';

async function migrate() {
    try {
        console.log('Checking table structure...');
        // Check if column exists
        const check = await query(`
            SELECT COUNT(*) as count 
            FROM information_schema.COLUMNS 
            WHERE TABLE_SCHEMA = DATABASE() 
            AND TABLE_NAME = 'blog_articles' 
            AND COLUMN_NAME = 'tags'
        `) as any[];

        if (check[0].count === 0) {
            console.log('Adding tags column...');
            await query("ALTER TABLE blog_articles ADD COLUMN tags TEXT AFTER categoria");
            console.log('Column tags added successfully.');
        } else {
            console.log('Column tags already exists.');
        }

        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
}

migrate();
