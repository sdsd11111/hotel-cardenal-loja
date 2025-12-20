import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

import { query } from '@/lib/mysql';

export async function GET() {
  console.log('=== Iniciando solicitud de platos activos via MySQL ===');

  try {
    const platos = await query(
      'SELECT id, titulo, descripcion, precio, imagen_url, activo FROM platos WHERE activo = 1 ORDER BY created_at DESC'
    );

    console.log(`Se encontraron ${Array.isArray(platos) ? platos.length : 0} platos activos`);

    return NextResponse.json(platos);
  } catch (error) {
    console.error('Error inesperado consultando MySQL:', error);
    return NextResponse.json(
      {
        error: 'Error interno del servidor',
        message: error instanceof Error ? error.message : 'Error desconocido',
      },
      { status: 500 }
    );
  } finally {
    console.log('=== Finalizada solicitud de platos activos ===');
  }
}
