import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/mysql';

export const dynamic = 'force-dynamic';

/**
 * GET /api/platos/[id]
 * Obtiene un plato específico por ID desde MySQL
 */
export async function GET(
  request: NextRequest,
  context: { params: { id: string } } | { params: Promise<{ id: string }> }
) {
  const params = await (typeof context.params === 'object' && 'then' in context.params
    ? context.params
    : Promise.resolve(context.params));
  const id = params.id;

  try {
    const results = await query('SELECT * FROM platos WHERE id = ?', [id]);
    const platos = results as any[];

    if (platos.length === 0) {
      return NextResponse.json(
        { error: 'Plato no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(platos[0]);
  } catch (error) {
    console.error('Error fetching plato from MySQL:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/platos/[id]
 * Actualiza un plato existente en MySQL
 */
export async function PUT(
  request: NextRequest,
  context: { params: { id: string } } | { params: Promise<{ id: string }> }
) {
  const params = await (typeof context.params === 'object' && 'then' in context.params
    ? context.params
    : Promise.resolve(context.params));
  let id = params.id;

  if (!id || id === '[id]') {
    const url = new URL(request.url);
    const pathSegments = url.pathname.split('/');
    id = pathSegments[pathSegments.length - 1];
  }

  try {
    const formData = await request.formData();

    const titulo = formData.get('titulo') as string;
    const descripcion = formData.get('descripcion') as string;
    const precio = parseFloat(formData.get('precio') as string);
    const activo = formData.get('activo') === 'true' ? 1 : 0;
    let imagen_url = formData.get('imagen_url') as string | null;

    // Manejo de imagen
    const imagenFile = formData.get('imagen') as File | null;
    let imagen_blob: Buffer | null = null;
    let imagen_mime: string | null = null;

    if (imagenFile && imagenFile.size > 0) {
      const arrayBuffer = await imagenFile.arrayBuffer();
      imagen_blob = Buffer.from(arrayBuffer);
      imagen_mime = imagenFile.type;
      imagen_url = `/api/images/platos/${id}`;
    }

    if (!titulo || !descripcion || isNaN(precio)) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos' },
        { status: 400 }
      );
    }

    if (imagen_blob) {
      await query(
        'UPDATE platos SET titulo = ?, descripcion = ?, precio = ?, activo = ?, imagen_url = ?, imagen_blob = ?, imagen_mime = ? WHERE id = ?',
        [titulo, descripcion, precio, activo, imagen_url, imagen_blob, imagen_mime, id]
      );
    } else {
      // Si no hay nuevo blob pero la URL cambió (o se mantiene externa), 
      // limpiamos el blob anterior si la URL ya no apunta a la API interna
      const isInternalUrl = imagen_url?.includes(`/api/images/platos/${id}`);

      await query(
        `UPDATE platos SET titulo = ?, descripcion = ?, precio = ?, activo = ?, imagen_url = ?,
         imagen_blob = ${isInternalUrl ? 'imagen_blob' : 'NULL'}, 
         imagen_mime = ${isInternalUrl ? 'imagen_mime' : 'NULL'}
         WHERE id = ?`,
        [titulo, descripcion, precio, activo, imagen_url || '', id]
      );
    }

    const [updatedPlato] = await query('SELECT id, titulo, descripcion, precio, imagen_url, activo FROM platos WHERE id = ?', [id]) as any[];

    if (!updatedPlato) {
      return NextResponse.json(
        { error: 'Plato no encontrado para actualizar' },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedPlato);
  } catch (error) {
    console.error('Error updating plato in MySQL:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/platos/[id]
 * Elimina un plato (Marca como inactivo)
 */
export async function DELETE(
  request: NextRequest,
  context: { params: { id: string } } | { params: Promise<{ id: string }> }
) {
  const params = await (typeof context.params === 'object' && 'then' in context.params
    ? context.params
    : Promise.resolve(context.params));
  let id = params.id;

  if (!id || id === '[id]') {
    const url = new URL(request.url);
    const pathSegments = url.pathname.split('/');
    id = pathSegments[pathSegments.length - 1];
  }

  try {
    // Hard delete: Eliminar el registro completamente
    await query('DELETE FROM platos WHERE id = ?', [id]);

    return NextResponse.json({
      success: true,
      message: 'Plato eliminado definitivamente',
      id
    });
  } catch (error) {
    console.error('Error deleting plato from MySQL:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
