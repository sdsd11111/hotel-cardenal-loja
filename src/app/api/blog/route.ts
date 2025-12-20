import { NextResponse } from 'next/server';
import { query } from '@/lib/mysql';

export const dynamic = 'force-dynamic';

/**
 * GET /api/blog
 * Obtiene artículos del blog directamente de MySQL
 */
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const slug = searchParams.get('slug');
        const active = searchParams.get('active');

        let sql = 'SELECT id, slug, titulo, contenido, extracto, imagen_url, autor, categoria, tags, meta_description, palabra_clave, activo, fecha_publicacion, fecha_creacion FROM blog_articles';
        const params: any[] = [];
        const conditions: string[] = [];

        if (slug) {
            conditions.push('slug = ?');
            params.push(slug);
        }

        if (active !== null) {
            conditions.push('activo = ?');
            params.push(active === 'true' ? 1 : 0);
        }

        if (conditions.length > 0) {
            sql += ' WHERE ' + conditions.join(' AND ');
        }

        sql += ' ORDER BY fecha_publicacion DESC';

        const results = await query(sql, params);

        if (slug && Array.isArray(results) && results.length > 0) {
            return NextResponse.json({ success: true, data: results[0] });
        }

        return NextResponse.json({ success: true, data: results });
    } catch (error) {
        console.error('Error en GET /api/blog (MySQL):', error);
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
    }
}

/**
 * POST /api/blog
 * Crea un artículo en MySQL
 */
export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const titulo = formData.get('titulo')?.toString() || '';
        const slug = formData.get('slug')?.toString() || '';
        const contenido = formData.get('contenido')?.toString() || '';
        const extracto = formData.get('extracto')?.toString() || '';
        const autor = formData.get('autor')?.toString() || 'Admin';
        const categoria = formData.get('categoria')?.toString() || 'General';
        const tags = formData.get('tags')?.toString() || '';
        const meta_description = formData.get('meta_description')?.toString() || '';
        const palabra_clave = formData.get('palabra_clave')?.toString() || '';
        const activo = formData.get('activo') === 'true' ? 1 : 0;

        let imagen_url = formData.get('imagen_url')?.toString() || '';

        // Manejo de imagen
        const imagenFile = formData.get('imagen') as File | null;
        let imagen_blob: Buffer | null = null;
        let imagen_mime: string | null = null;

        if (imagenFile && imagenFile.size > 0) {
            const arrayBuffer = await imagenFile.arrayBuffer();
            imagen_blob = Buffer.from(arrayBuffer);
            imagen_mime = imagenFile.type;
        }

        if (!titulo || !slug || !contenido) {
            return NextResponse.json({ success: false, error: 'Campos requeridos faltantes' }, { status: 400 });
        }

        const sql = `INSERT INTO blog_articles 
            (titulo, slug, contenido, extracto, imagen_url, imagen_blob, imagen_mime, autor, categoria, tags, meta_description, palabra_clave, activo) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        const result = await query(sql, [
            titulo, slug, contenido, extracto, imagen_url, imagen_blob, imagen_mime,
            autor, categoria, tags, meta_description, palabra_clave, activo
        ]) as any;

        const insertId = result.insertId;

        // Si subimos imagen, actualizamos la imagen_url con el ID asignado
        if (imagen_blob && insertId) {
            const newUrl = `/api/images/blog/${insertId}`;
            await query('UPDATE blog_articles SET imagen_url = ? WHERE id = ?', [newUrl, insertId]);
        }

        return NextResponse.json({ success: true, message: 'Artículo creado correctamente' });
    } catch (error: any) {
        console.error('Error POST /api/blog (MySQL):', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

/**
 * PUT /api/blog
 * Actualiza un artículo en MySQL. Soporta FormData y JSON.
 */
export async function PUT(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        if (!id) return NextResponse.json({ error: 'ID requerido' }, { status: 400 });

        const contentType = request.headers.get('content-type') || '';
        let titulo, slug, contenido, extracto, autor, categoria, tags, meta_description, palabra_clave, activo, imagen_url;
        let imagen_blob: Buffer | null = null;
        let imagen_mime: string | null = null;

        if (contentType.includes('application/json')) {
            const body = await request.json();
            // Soporte para actualizaciones parciales (solo activo)
            if (Object.keys(body).length === 1 && body.activo !== undefined) {
                await query('UPDATE blog_articles SET activo = ? WHERE id = ?', [body.activo ? 1 : 0, id]);
                return NextResponse.json({ success: true, message: 'Estado actualizado' });
            }

            ({ titulo, slug, contenido, extracto, imagen_url, autor, categoria, tags, meta_description, palabra_clave, activo } = body);
            activo = activo ? 1 : 0;
        } else {
            const formData = await request.formData();
            titulo = formData.get('titulo')?.toString() || '';
            slug = formData.get('slug')?.toString() || '';
            contenido = formData.get('contenido')?.toString() || '';
            extracto = formData.get('extracto')?.toString() || '';
            autor = formData.get('autor')?.toString() || 'Admin';
            categoria = formData.get('categoria')?.toString() || 'General';
            tags = formData.get('tags')?.toString() || '';
            meta_description = formData.get('meta_description')?.toString() || '';
            palabra_clave = formData.get('palabra_clave')?.toString() || '';
            activo = formData.get('activo') === 'true' ? 1 : 0;
            imagen_url = formData.get('imagen_url')?.toString() || '';

            // Manejo de imagen
            const imagenFile = formData.get('imagen') as File | null;
            if (imagenFile && imagenFile.size > 0) {
                const arrayBuffer = await imagenFile.arrayBuffer();
                imagen_blob = Buffer.from(arrayBuffer);
                imagen_mime = imagenFile.type;
                imagen_url = `/api/images/blog/${id}`;
            }
        }

        let sql = '';
        let params: any[] = [];

        if (imagen_blob) {
            sql = `UPDATE blog_articles SET 
                titulo = ?, slug = ?, contenido = ?, extracto = ?, imagen_url = ?, 
                imagen_blob = ?, imagen_mime = ?, autor = ?, categoria = ?, 
                tags = ?, meta_description = ?, palabra_clave = ?, activo = ?
                WHERE id = ?`;
            params = [titulo, slug, contenido, extracto, imagen_url, imagen_blob, imagen_mime, autor, categoria, tags, meta_description, palabra_clave, activo, id];
        } else {
            // Si no hay nuevo blob pero la URL cambió (o se mantiene externa), 
            // limpiamos el blob anterior si la URL ya no apunta a la API interna
            const isInternalUrl = imagen_url?.includes(`/api/images/blog/${id}`);

            sql = `UPDATE blog_articles SET 
                titulo = ?, slug = ?, contenido = ?, extracto = ?, imagen_url = ?, 
                imagen_blob = ${isInternalUrl ? 'imagen_blob' : 'NULL'}, 
                imagen_mime = ${isInternalUrl ? 'imagen_mime' : 'NULL'},
                autor = ?, categoria = ?, tags = ?, meta_description = ?, 
                palabra_clave = ?, activo = ?
                WHERE id = ?`;
            params = [titulo, slug, contenido, extracto, imagen_url, autor, categoria, tags, meta_description, palabra_clave, activo, id];
        }

        await query(sql, params);

        return NextResponse.json({ success: true, message: 'Artículo actualizado correctamente' });
    } catch (error: any) {
        console.error('Error PUT /api/blog (MySQL):', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

/**
 * DELETE /api/blog
 * Elimina un artículo de MySQL
 */
export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        if (!id) return NextResponse.json({ error: 'ID requerido' }, { status: 400 });

        await query('DELETE FROM blog_articles WHERE id = ?', [id]);

        return NextResponse.json({ success: true, message: 'Artículo eliminado correctamente' });
    } catch (error: any) {
        console.error('Error DELETE /api/blog (MySQL):', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
