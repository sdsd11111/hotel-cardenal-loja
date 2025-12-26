
import { NextResponse } from 'next/server';
import { query } from '@/lib/mysql';

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
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
        let imagen_url = formData.get('imagen_url')?.toString() || '';

        let sql = `UPDATE anuncios SET 
                    titulo = ?, 
                    descripcion = ?, 
                    llamativo = ?, 
                    boton_texto = ?, 
                    boton_link = ?, 
                    activo = ?, 
                    posicion = ?, 
                    estilo = ?`;
        const queryParams: any[] = [titulo, descripcion, llamativo, boton_texto, boton_link, activo, posicion, estilo];

        if (imagenFile && imagenFile.size > 0) {
            const arrayBuffer = await imagenFile.arrayBuffer();
            const imagen_blob = Buffer.from(arrayBuffer);
            const imagen_mime = imagenFile.type || 'image/jpeg';

            const finalImageUrl = `/api/images/anuncios/${id}?v=${Date.now()}`;
            sql += `, imagen_url = ?, imagen_blob = ?, imagen_mime = ?`;
            queryParams.push(finalImageUrl, imagen_blob, imagen_mime);
        } else if (imagen_url) {
            sql += `, imagen_url = ?`;
            queryParams.push(imagen_url);
        }

        sql += ` WHERE id = ?`;
        queryParams.push(id);

        await query(sql, queryParams);

        return NextResponse.json({ message: 'Anuncio actualizado correctamente' });
    } catch (error: any) {
        console.error('Error updating anuncio:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        await query(`DELETE FROM anuncios WHERE id = ?`, [id]);
        return NextResponse.json({ message: 'Anuncio eliminado correctamente' });
    } catch (error: any) {
        console.error('Error deleting anuncio:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
