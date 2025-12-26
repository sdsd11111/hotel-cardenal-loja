import { NextResponse } from 'next/server';
import { query } from '@/lib/mysql';

export const dynamic = 'force-dynamic';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ type: string; id: string }> }
) {
    try {
        const { type, id } = await params;

        let sql = '';
        if (type === 'platos') {
            sql = 'SELECT imagen_blob, imagen_mime FROM platos WHERE id = ?';
        } else if (type === 'blog') {
            sql = 'SELECT imagen_blob, imagen_mime FROM blog_articles WHERE id = ?';
        } else if (type === 'habitaciones') {
            sql = 'SELECT imagen_blob, imagen_mime FROM habitaciones WHERE id = ?';
        } else if (type === 'anuncios') {
            sql = 'SELECT imagen_blob, imagen_mime FROM anuncios WHERE id = ?';
        } else {
            return new NextResponse('Tipo no válido', { status: 400 });
        }

        const results = await query(sql, [id]) as any[];

        if (!results || results.length === 0 || !results[0].imagen_blob) {
            return new NextResponse('Imagen no encontrada', { status: 404 });
        }

        const image = results[0].imagen_blob;
        const mime = results[0].imagen_mime || 'image/jpeg';

        return new NextResponse(image, {
            headers: {
                'Content-Type': mime,
                'Cache-Control': 'no-store, max-age=0',
            },
        });
    } catch (error) {
        console.error('Error sirviendo imagen:', error);
        return new NextResponse('Error interno', { status: 500 });
    }
}
