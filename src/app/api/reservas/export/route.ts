import { NextResponse } from 'next/server';
import { query } from '@/lib/mysql';
import * as XLSX from 'xlsx';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const desde = searchParams.get('desde');
        const hasta = searchParams.get('hasta');
        const tipoFecha = searchParams.get('tipoFecha') || 'entrada';

        let dateColumn = tipoFecha === 'entrada' ? 'fecha_entrada' : 'created_at';

        let sql = `
            SELECT 
                id,
                nombre_cliente,
                email_cliente,
                whatsapp,
                DATE_FORMAT(fecha_entrada, '%Y-%m-%d') as fecha_entrada,
                DATE_FORMAT(fecha_salida, '%Y-%m-%d') as fecha_salida,
                habitacion_id,
                adultos,
                ninos,
                precio,
                comision,
                numero_reserva,
                estado,
                DATE_FORMAT(created_at, '%Y-%m-%d %H:%i:%s') as fecha_reserva
            FROM reservas 
        `;
        const params: any[] = [];

        if (desde && hasta) {
            sql += ` WHERE ${dateColumn} BETWEEN ? AND ?`;
            params.push(desde, hasta);
        }

        sql += ` ORDER BY created_at DESC`;

        const reservas = await query(sql, params) as any[];

        // Create workbook
        const workbook = XLSX.utils.book_new();

        // Format data for Excel
        const excelData = reservas.map(r => ({
            'ID': r.id,
            'Cliente': r.nombre_cliente,
            'Email': r.email_cliente || 'N/A',
            'Teléfono': r.whatsapp || 'N/A',
            'Entrada': r.fecha_entrada,
            'Salida': r.fecha_salida,
            'Habitación': r.habitacion_id,
            'Adultos': r.adultos,
            'Niños': r.ninos,
            'Precio': r.precio,
            'Comisión': r.comision,
            'Nro Reserva': r.numero_reserva,
            'Estado': r.estado,
            'Fecha de Reserva': r.fecha_reserva
        }));

        // Create worksheet
        const worksheet = XLSX.utils.json_to_sheet(excelData);

        // Set column widths
        worksheet['!cols'] = [
            { wch: 8 },   // ID
            { wch: 30 },  // Cliente
            { wch: 30 },  // Email
            { wch: 15 },  // Teléfono
            { wch: 15 },  // Entrada
            { wch: 15 },  // Salida
            { wch: 20 },  // Habitación
            { wch: 10 },  // Adultos
            { wch: 10 },  // Niños
            { wch: 12 },  // Precio
            { wch: 12 },  // Comisión
            { wch: 20 },  // Nro Reserva
            { wch: 15 },  // Estado
            { wch: 20 },  // Fecha de Reserva
        ];

        // Add worksheet to workbook
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Reservas');

        // Generate buffer
        const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

        // Return Excel file
        return new NextResponse(buffer, {
            status: 200,
            headers: {
                'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'Content-Disposition': `attachment; filename="reservas_hotel_cardenal_${new Date().toISOString().split('T')[0]}.xlsx"`
            }
        });
    } catch (error: any) {
        console.error('Error exporting reservas:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
