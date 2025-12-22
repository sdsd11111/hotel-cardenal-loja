import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/**
 * GET /api/platos
 * Obtiene todos los platos (para el panel de administración)
 */
import { query } from '@/lib/mysql';
import crypto from 'crypto';

/**
 * GET /api/platos
 * Obtiene todos los platos (para el panel de administración)
 */
export async function GET() {
  try {
    const results = await query('SELECT id, titulo, descripcion, precio, imagen_url, activo, created_at FROM platos ORDER BY created_at DESC');
    return NextResponse.json(results);
  } catch (error) {
    console.error('Error fetching platos from MySQL:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/platos
 * Crea un nuevo plato directamente en MySQL
 */
export async function POST(request: Request) {
  try {
    console.log('Iniciando solicitud POST para crear plato en MySQL...');

    const formData = await request.formData();

    const titulo = formData.get('titulo')?.toString()?.trim() || '';
    const descripcion = formData.get('descripcion')?.toString()?.trim() || '';
    const precioStr = formData.get('precio')?.toString() || '';
    const precio = parseFloat(precioStr);
    const activo = formData.get('activo') === 'true' ? 1 : 0;

    // Manejo de imagen
    const imagenFile = formData.get('imagen') as File | null;
    let imagen_blob: Buffer | null = null;
    let imagen_mime: string | null = null;
    let imagen_url = formData.get('imagen_url')?.toString()?.trim() || '';

    if (imagenFile && imagenFile.size > 0) {
      const arrayBuffer = await imagenFile.arrayBuffer();
      imagen_blob = Buffer.from(arrayBuffer);
      imagen_mime = imagenFile.type;
    }

    // Validaciones
    if (!titulo || !descripcion || isNaN(precio)) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos' },
        { status: 400 }
      );
    }

    const id = crypto.randomUUID();

    // Si subimos una imagen nueva, generamos la URL interna
    if (imagen_blob) {
      imagen_url = `/api/images/platos/${id}?v=${Date.now()}`;
    }

    await query(
      'INSERT INTO platos (id, titulo, descripcion, precio, imagen_url, imagen_blob, imagen_mime, activo) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [id, titulo, descripcion, precio, imagen_url, imagen_blob, imagen_mime, activo]
    );

    const [newPlato] = await query('SELECT id, titulo, descripcion, precio, imagen_url, activo FROM platos WHERE id = ?', [id]) as any[];

    console.log('Plato creado exitosamente en MySQL:', newPlato);
    return NextResponse.json(newPlato, { status: 201 });

  } catch (error) {
    console.error('Error en POST /api/platos (MySQL):', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
