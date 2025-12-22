
import { NextResponse } from 'next/server';
import { query } from '@/lib/mysql';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const showAll = searchParams.get('all') === 'true';

        const entrada = searchParams.get('entrada');
        const salida = searchParams.get('salida');

        let sql = `SELECT h.id, h.nombre, h.slug, h.descripcion, h.amenidades, h.precio_texto, h.precio_numerico, h.imagen, h.max_adultos, h.max_ninos, h.camas, h.activo, h.disponible, h.fecha_entrada, h.fecha_salida 
                   FROM habitaciones h`;

        const conditions = [];
        if (!showAll) conditions.push(`h.activo = 1`);

        if (conditions.length > 0) sql += ` WHERE ` + conditions.join(' AND ');
        sql += ` ORDER BY h.id DESC`;

        const habitaciones: any = await query(sql);

        // Marcar disponibilidad basada en reservas Y bloqueos manuales
        if (entrada && salida) {
            const entradaDate = new Date(entrada);
            const salidaDate = new Date(salida);

            const reservasSql = `SELECT habitacion_id FROM reservas 
                                WHERE estado != 'CANCELADA' 
                                AND ((fecha_entrada < ?) AND (fecha_salida > ?))`;
            const ocupadasRaw: any = await query(reservasSql, [salida, entrada]);
            const idsReservados = new Set(ocupadasRaw.map((r: any) => r.habitacion_id));

            habitaciones.forEach((hab: any) => {
                // 1. Verificar Reservas
                const reservada = idsReservados.has(hab.id);

                // 2. Verificar Bloqueo Manual con fechas
                let bloqueadaManual = false;
                if (hab.fecha_entrada && hab.fecha_salida) {
                    const blockEntrada = new Date(hab.fecha_entrada);
                    const blockSalida = new Date(hab.fecha_salida);
                    const solapaBlock = (entradaDate < blockSalida) && (salidaDate > blockEntrada);
                    if (solapaBlock) bloqueadaManual = true;
                }

                // Si hay fechas de búsqueda, 'disponible' debe reflejar LA DISPONIBILIDAD PARA ESAS FECHAS.
                // Si está reservada o bloqueada manualmente en ese rango, NO está disponible.
                if (reservada || bloqueadaManual) {
                    hab.disponible = 0;
                    hab.reservada = reservada;
                    hab.bloqueadaManual = bloqueadaManual;
                } else {
                    // Si no hay conflicto en ese rango, forzamos disponible = 1 
                    // (cumpliendo el requerimiento: "si busco del 28 al 31 debe salir libre")
                    hab.disponible = 1;
                }
            });
        }

        // Return fresh data every time
        return NextResponse.json(habitaciones);
    } catch (error: any) {
        console.error('Error fetching habitaciones:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}


export async function POST(request: Request) {
    try {
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
        }

        const result = await query(
            `INSERT INTO habitaciones (nombre, slug, descripcion, amenidades, precio_texto, precio_numerico, imagen, imagen_blob, imagen_mime, max_adultos, max_ninos, camas, activo, disponible, fecha_entrada, fecha_salida) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [nombre, slug, descripcion, amenidades, precio_texto, precio_numerico, imagen_url, imagen_blob, imagen_mime, max_adultos, max_ninos, camas, activo, disponible, fecha_entrada, fecha_salida]
        ) as any;

        const insertedId = result.insertId;

        // Si subimos una imagen, generamos la URL interna con cache-busting
        if (imagen_blob) {
            const finalImageUrl = `/api/images/habitaciones/${insertedId}?v=${Date.now()}`;
            await query("UPDATE habitaciones SET imagen = ? WHERE id = ?", [finalImageUrl, insertedId]);
        }

        return NextResponse.json({ id: insertedId, message: 'Habitación creada correctamente' });
    } catch (error: any) {
        console.error('Error in POST /api/habitaciones:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
