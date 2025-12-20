import { NextResponse } from 'next/server';
import { query } from '@/lib/mysql';
import * as XLSX from 'xlsx';

export async function GET() {
    try {
        // Fetch all active clients
        const clientes = await query(`
            SELECT 
                id,
                nombre,
                email,
                telefono,
                motivo,
                DATE_FORMAT(fecha_entrada, '%Y-%m-%d') as fecha_entrada,
                DATE_FORMAT(fecha_salida, '%Y-%m-%d') as fecha_salida,
                adultos,
                ninos,
                habitacion_preferida,
                CASE WHEN desayuno = 1 THEN 'Sí' ELSE 'No' END as desayuno,
                CASE WHEN almuerzo = 1 THEN 'Sí' ELSE 'No' END as almuerzo,
                CASE WHEN cena = 1 THEN 'Sí' ELSE 'No' END as cena,
                CASE WHEN desea_facturacion = 1 THEN 'Sí' ELSE 'No' END as desea_facturacion,
                tipo_documento,
                identificacion,
                razon_social,
                direccion_facturacion,
                CASE WHEN trae_mascota = 1 THEN 'Sí' ELSE 'No' END as trae_mascota,
                comentarios,
                mensaje,
                DATE_FORMAT(fecha_nacimiento, '%Y-%m-%d') as fecha_nacimiento,
                ciudad_residencia,
                pais,
                profesion,
                empresa,
                como_nos_conocio,
                instagram,
                facebook,
                total_estadias,
                DATE_FORMAT(ultima_estadia, '%Y-%m-%d') as ultima_estadia,
                calificacion,
                CASE WHEN es_vip = 1 THEN 'Sí' ELSE 'No' END as es_vip,
                DATE_FORMAT(created_at, '%Y-%m-%d %H:%i:%s') as fecha_registro
            FROM clientes 
            WHERE activo = 1
            ORDER BY created_at DESC
        `) as any[];

        // Create workbook
        const workbook = XLSX.utils.book_new();

        // Format data for Excel
        const excelData = clientes.map(c => ({
            'ID': c.id,
            'Nombre': c.nombre,
            'Email': c.email,
            'Teléfono': c.telefono,
            'Motivo': c.motivo,
            'Entrada': c.fecha_entrada,
            'Salida': c.fecha_salida,
            'Adultos': c.adultos,
            'Niños': c.ninos,
            'Habitación': c.habitacion_preferida,
            'Desayuno': c.desayuno,
            'Almuerzo': c.almuerzo,
            'Cena': c.cena,
            'Facturación': c.desea_facturacion,
            'Tipo Doc': c.tipo_documento,
            'Identificación': c.identificacion,
            'Razón Social': c.razon_social,
            'Dir. Facturación': c.direccion_facturacion,
            'Mascota': c.trae_mascota,
            'Comentarios': c.comentarios,
            'Mensaje': c.mensaje,
            'Cumpleaños': c.fecha_nacimiento,
            'Ciudad': c.ciudad_residencia,
            'País': c.pais,
            'Profesión': c.profesion,
            'Empresa': c.empresa,
            'Cómo nos conoció': c.como_nos_conocio,
            'Instagram': c.instagram,
            'Facebook': c.facebook,
            'Total Estadías': c.total_estadias,
            'Última Estadía': c.ultima_estadia,
            'Calificación': c.calificacion,
            'VIP': c.es_vip,
            'Fecha Registro': c.fecha_registro
        }));

        // Create worksheet
        const worksheet = XLSX.utils.json_to_sheet(excelData);

        // Set column widths
        worksheet['!cols'] = [
            { wch: 5 },   // ID
            { wch: 25 },  // Nombre
            { wch: 30 },  // Email
            { wch: 15 },  // Teléfono
            { wch: 20 },  // Motivo
            { wch: 12 },  // Entrada
            { wch: 12 },  // Salida
            { wch: 8 },   // Adultos
            { wch: 8 },   // Niños
            { wch: 20 },  // Habitación
            { wch: 10 },  // Desayuno
            { wch: 10 },  // Almuerzo
            { wch: 10 },  // Cena
            { wch: 12 },  // Facturación
            { wch: 12 },  // Tipo Doc
            { wch: 15 },  // Identificación
            { wch: 25 },  // Razón Social
            { wch: 30 },  // Dir. Facturación
            { wch: 10 },  // Mascota
            { wch: 40 },  // Comentarios
            { wch: 40 },  // Mensaje
            { wch: 12 },  // Cumpleaños
            { wch: 15 },  // Ciudad
            { wch: 12 },  // País
            { wch: 15 },  // Profesión
            { wch: 20 },  // Empresa
            { wch: 20 },  // Cómo nos conoció
            { wch: 20 },  // Instagram
            { wch: 20 },  // Facebook
            { wch: 12 },  // Total Estadías
            { wch: 12 },  // Última Estadía
            { wch: 12 },  // Calificación
            { wch: 8 },   // VIP
            { wch: 20 },  // Fecha Registro
        ];

        // Add worksheet to workbook
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Clientes');

        // Generate buffer
        const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

        // Return Excel file
        return new NextResponse(buffer, {
            status: 200,
            headers: {
                'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'Content-Disposition': `attachment; filename="clientes_hotel_cardenal_${new Date().toISOString().split('T')[0]}.xlsx"`
            }
        });
    } catch (error: any) {
        console.error('Error exporting clientes:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
