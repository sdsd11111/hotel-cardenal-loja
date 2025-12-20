/**
 * Script de Migración de Datos: Supabase → cPanel MySQL
 * 
 * INSTRUCCIONES:
 * 1. Instala las dependencias necesarias: npm install @supabase/supabase-js dotenv
 * 2. Asegúrate de tener tus credenciales de Supabase en .env
 * 3. Ejecuta: node migrate-data.js
 * 4. El script generará un archivo SQL con los INSERTs para MySQL
 * 5. Ejecuta el SQL generado en phpMyAdmin de cPanel
 */

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Configuración de Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Error: Faltan credenciales de Supabase en .env');
    console.log('Asegúrate de tener:');
    console.log('  NEXT_PUBLIC_SUPABASE_URL=...');
    console.log('  SUPABASE_SERVICE_ROLE_KEY=...');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function migratePlatos() {
    console.log('🚀 Iniciando migración de datos de Supabase...\n');

    try {
        // 1. Obtener todos los platos de Supabase
        console.log('📥 Obteniendo platos de Supabase...');
        const { data: platos, error } = await supabase
            .from('platos')
            .select('*')
            .order('created_at', { ascending: true });

        if (error) {
            throw new Error(`Error al obtener platos: ${error.message}`);
        }

        if (!platos || platos.length === 0) {
            console.log('⚠️  No se encontraron platos en Supabase');
            return;
        }

        console.log(`✅ Se encontraron ${platos.length} platos\n`);

        // 2. Generar SQL para MySQL
        const sqlStatements = [];
        const imagesList = [];

        console.log('🔄 Generando SQL para MySQL...\n');

        platos.forEach((plato, index) => {
            // Escapar comillas y caracteres especiales
            const escapeSql = (str) => {
                if (!str) return '';
                return str.replace(/'/g, "''").replace(/\\/g, '\\\\');
            };

            const id = plato.id;
            const titulo = escapeSql(plato.titulo);
            const descripcion = escapeSql(plato.descripcion);
            const precio = plato.precio;
            const imagen_url = escapeSql(plato.imagen_url);
            const activo = plato.activo ? 1 : 0;
            const created_at = plato.created_at;
            const updated_at = plato.updated_at || plato.created_at;

            // Generar INSERT statement
            const sql = `INSERT INTO platos (id, titulo, descripcion, precio, imagen_url, activo, created_at, updated_at) 
VALUES ('${id}', '${titulo}', '${descripcion}', ${precio}, '${imagen_url}', ${activo}, '${created_at}', '${updated_at}');`;

            sqlStatements.push(sql);

            // Guardar información de imagen
            if (plato.imagen_url) {
                imagesList.push({
                    plato_id: id,
                    plato_titulo: plato.titulo,
                    imagen_url_supabase: plato.imagen_url,
                    imagen_url_nueva: `/uploads/platos/${id}.jpg` // Sugerencia para nueva URL
                });
            }

            console.log(`  ✓ Plato ${index + 1}/${platos.length}: ${plato.titulo}`);
        });

        // 3. Guardar SQL en archivo
        const sqlOutputPath = path.join(__dirname, 'migration_inserts.sql');
        const sqlContent = `-- ============================================
-- Migración de Platos: Supabase → MySQL
-- Generado: ${new Date().toISOString()}
-- Total de platos: ${platos.length}
-- ============================================

${sqlStatements.join('\n\n')}

-- Fin de la migración
`;

        fs.writeFileSync(sqlOutputPath, sqlContent, 'utf8');
        console.log(`\n✅ SQL generado: ${sqlOutputPath}`);

        // 4. Guardar lista de imágenes
        if (imagesList.length > 0) {
            const imagesOutputPath = path.join(__dirname, 'migration_images.json');
            fs.writeFileSync(imagesOutputPath, JSON.stringify(imagesList, null, 2), 'utf8');
            console.log(`✅ Lista de imágenes: ${imagesOutputPath}`);
        }

        // 5. Generar reporte
        console.log('\n' + '='.repeat(60));
        console.log('📊 RESUMEN DE MIGRACIÓN');
        console.log('='.repeat(60));
        console.log(`Total de platos: ${platos.length}`);
        console.log(`Platos activos: ${platos.filter(p => p.activo).length}`);
        console.log(`Platos inactivos: ${platos.filter(p => !p.activo).length}`);
        console.log(`Platos con imagen: ${imagesList.length}`);
        console.log('='.repeat(60));

        console.log('\n📋 PRÓXIMOS PASOS:');
        console.log('1. Revisa el archivo: migration_inserts.sql');
        console.log('2. Accede a phpMyAdmin en cPanel');
        console.log('3. Selecciona tu base de datos');
        console.log('4. Copia y pega el contenido de migration_inserts.sql');
        console.log('5. Ejecuta el SQL');
        console.log('\n📸 MIGRACIÓN DE IMÁGENES:');
        console.log('1. Las imágenes actualmente están en Supabase Storage');
        console.log('2. Revisa migration_images.json para la lista completa');
        console.log('3. Opciones:');
        console.log('   a) Descargar imágenes de Supabase y subirlas a cPanel');
        console.log('   b) Mantener las URLs de Supabase temporalmente');
        console.log('   c) Re-subir las imágenes usando el nuevo panel admin');

    } catch (error) {
        console.error('\n❌ Error durante la migración:', error.message);
        process.exit(1);
    }
}

// Ejecutar migración
migratePlatos();
