
import { NextResponse } from 'next/server';
import { query } from '@/lib/mysql';

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const formData = await request.formData();

        const nombre = formData.get('nombre')?.toString() || '';
        const slug = formData.get('slug')?.toString() || '';
        const descripcion = formData.get('descripcion')?.toString() || '';
        const amenidades = formData.get('amenidades')?.toString() || '[]';
        const precio_texto = formData.get('precio_texto')?.toString() || '';
        const precio_numerico = parseFloat(formData.get('precio_numerico')?.toString() || '0');
        const max_adultos = parseInt(formData.get('max_adultos')?.toString() || '2');
        const max_ninos = parseInt(formData.get('max_ninos')?.toString() || '0');
        const camas = parseInt(formData.get('camas')?.toString() || '1');
        const activo = formData.get('activo') === 'true' ? 1 : 0;
        const disponible = formData.get('disponible') === 'false' ? 0 : 1;
        const fecha_entrada = formData.get('fecha_entrada')?.toString() || null;
        const fecha_salida = formData.get('fecha_salida')?.toString() || null;

        // Manejo de imagen
        const imagenFile = formData.get('imagen') as File | null;
        let imagen_blob: Buffer | null = null;
        let imagen_mime: string | null = null;
        let imagen_url = formData.get('imagen_url')?.toString() || '';

        if (imagenFile && imagenFile.size > 0) {
            const arrayBuffer = await imagenFile.arrayBuffer();
            imagen_blob = Buffer.from(arrayBuffer);
            imagen_mime = imagenFile.type;
            // Generar URL interna si hay blob con cache-busting
            imagen_url = `/api/images/habitaciones/${id}?v=${Date.now()}`;
        }

        let sql = '';
        let params_sql = [];

        if (imagen_blob) {
            sql = `UPDATE habitaciones 
                   SET nombre = ?, slug = ?, descripcion = ?, amenidades = ?, precio_texto = ?, precio_numerico = ?, imagen = ?, imagen_blob = ?, imagen_mime = ?, max_adultos = ?, max_ninos = ?, camas = ?, activo = ?, disponible = ?, fecha_entrada = ?, fecha_salida = ?
                   WHERE id = ?`;
            params_sql = [nombre, slug, descripcion, amenidades, precio_texto, precio_numerico, imagen_url, imagen_blob, imagen_mime, max_adultos, max_ninos, camas, activo, disponible, fecha_entrada, fecha_salida, id];
        } else {
            // Si no hay nuevo blob pero la URL cambió (o se mantiene externa), 
            // nos aseguramos de limpiar el blob anterior si la URL ya no apunta a la API interna
            const isInternalUrl = imagen_url.includes(`/api/images/habitaciones/${id}`);

            sql = `UPDATE habitaciones 
                   SET nombre = ?, slug = ?, descripcion = ?, amenidades = ?, precio_texto = ?, precio_numerico = ?, imagen = ?, 
                       imagen_blob = ${isInternalUrl ? 'imagen_blob' : 'NULL'}, 
                       imagen_mime = ${isInternalUrl ? 'imagen_mime' : 'NULL'},
                       max_adultos = ?, max_ninos = ?, camas = ?, activo = ?, disponible = ?, fecha_entrada = ?, fecha_salida = ?
                   WHERE id = ?`;
            params_sql = [nombre, slug, descripcion, amenidades, precio_texto, precio_numerico, imagen_url, max_adultos, max_ninos, camas, activo, disponible, fecha_entrada, fecha_salida, id];
        }

        await query(sql, params_sql);

        return NextResponse.json({ message: 'Habitación actualizada correctamente' });
    } catch (error: any) {
        console.error('Error in PUT /api/habitaciones/[id]:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        await query("DELETE FROM habitaciones WHERE id = ?", [id]);
        return NextResponse.json({ message: 'Habitación eliminada correctamente' });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
