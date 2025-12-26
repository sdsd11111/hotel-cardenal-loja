
import { NextResponse } from 'next/server';
import { query } from '@/lib/mysql';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const onlyActive = searchParams.get('active') === 'true';

        let sql = `SELECT * FROM anuncios`;
        if (onlyActive) {
            sql += ` WHERE activo = 1`;
        }
        sql += ` ORDER BY created_at DESC`;

        const anuncios = await query(sql);
        return NextResponse.json(anuncios);
    } catch (error: any) {
        console.error('Error fetching anuncios:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const formData = await request.formData();

        const titulo = formData.get('titulo')?.toString() || '';
        const descripcion = formData.get('descripcion')?.toString() || '';
        const llamativo = formData.get('llamativo')?.toString() || '';
        const boton_texto = formData.get('boton_texto')?.toString() || '';
        const boton_link = formData.get('boton_link')?.toString() || '';
        const activo = formData.get('activo') === 'true' ? 1 : 0;
        const posicion = formData.get('posicion')?.toString() || 'bottom-right';
        const estilo = formData.get('estilo')?.toString() || '{}';

        // Image Handling
        const imagenFile = formData.get('imagen') as File | null;
        let imagen_blob: Buffer | null = null;
        let imagen_mime: string | null = null;
        let imagen_url = formData.get('imagen_url')?.toString() || '';

        if (imagenFile && imagenFile.size > 0) {
            const arrayBuffer = await imagenFile.arrayBuffer();
            imagen_blob = Buffer.from(arrayBuffer);
            imagen_mime = imagenFile.type;
        }

        const result = await query(
            `INSERT INTO anuncios (titulo, descripcion, llamativo, imagen_url, imagen_blob, imagen_mime, boton_texto, boton_link, activo, posicion, estilo) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [titulo, descripcion, llamativo, imagen_url, imagen_blob, imagen_mime, boton_texto, boton_link, activo, posicion, estilo]
        ) as any;

        const insertedId = result.insertId;

        // If we uploaded an image, generate internal URL
        if (imagen_blob) {
            const finalImageUrl = `/api/images/anuncios/${insertedId}?v=${Date.now()}`;
            await query("UPDATE anuncios SET imagen_url = ? WHERE id = ?", [finalImageUrl, insertedId]);
        }

        return NextResponse.json({ id: insertedId, message: 'Anuncio creado correctamente' });
    } catch (error: any) {
        console.error('Error in POST /api/anuncios:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
