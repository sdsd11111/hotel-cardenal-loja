import { NextResponse } from 'next/server';
import { query } from '@/lib/mysql';
import nodemailer from 'nodemailer';

// Email transporter
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT || '465'),
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
});

// GET - List all clients with search and pagination
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const search = searchParams.get('search') || '';
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '50');
        const offset = (page - 1) * limit;

        let sql = `
            SELECT id, nombre, email, telefono, motivo, fecha_entrada, fecha_salida, 
                   adultos, ninos, habitacion_preferida, desayuno, almuerzo, cena,
                   desea_facturacion, trae_mascota, ciudad_residencia, pais,
                   total_estadias, ultima_estadia, es_vip, calificacion,
                   created_at, activo
            FROM clientes 
            WHERE activo = 1
        `;
        const params: any[] = [];

        if (search) {
            sql += ` AND (nombre LIKE ? OR email LIKE ? OR telefono LIKE ?)`;
            const searchPattern = `%${search}%`;
            params.push(searchPattern, searchPattern, searchPattern);
        }

        // LIMIT and OFFSET don't work well with prepared statements in some MySQL versions
        // So we add them directly to the SQL string after sanitizing
        sql += ` ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}`;

        const clientes = await query(sql, params);

        // Get total count for pagination
        let countSql = `SELECT COUNT(*) as total FROM clientes WHERE activo = 1`;
        const countParams: any[] = [];
        if (search) {
            countSql += ` AND (nombre LIKE ? OR email LIKE ? OR telefono LIKE ?)`;
            const searchPattern = `%${search}%`;
            countParams.push(searchPattern, searchPattern, searchPattern);
        }
        const countResult = await query(countSql, countParams) as any[];
        const total = countResult[0]?.total || 0;

        return NextResponse.json({
            clientes,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error: any) {
        console.error('Error fetching clientes:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// POST - Create new client from contact form
export async function POST(request: Request) {
    try {
        const data = await request.json();

        // Format dates properly
        const fechaEntrada = data.fechaEntrada || null;
        const fechaSalida = data.fechaSalida || null;

        const result = await query(
            `INSERT INTO clientes (
                nombre, email, telefono, motivo, fecha_entrada, fecha_salida,
                adultos, ninos, habitacion_preferida, desayuno, almuerzo, cena,
                desea_facturacion, tipo_documento, identificacion, razon_social, direccion_facturacion,
                trae_mascota, comentarios, mensaje, ultima_estadia
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                data.nombre,
                data.email,
                data.telefono || null,
                data.motivo || null,
                fechaEntrada,
                fechaSalida,
                data.adultos || 2,
                data.ninos || 0,
                data.habitacion || null,
                data.desayuno ? 1 : 0,
                data.almuerzo ? 1 : 0,
                data.cena ? 1 : 0,
                data.deseaFacturacion ? 1 : 0,
                data.tipoDocumento || null,
                data.identificacion || null,
                data.razonSocial || null,
                data.direccionFacturacion || null,
                data.traeMascota ? 1 : 0,
                data.comentarios || null,
                data.mensaje || null,
                fechaEntrada // Set as last stay date
            ]
        ) as any;

        const clienteId = result.insertId;

        // Send confirmation email to client
        try {
            const comidas = [
                data.desayuno ? 'Desayuno' : '',
                data.almuerzo ? 'Almuerzo' : '',
                data.cena ? 'Cena' : ''
            ].filter(Boolean).join(', ') || 'No seleccionadas';

            await transporter.sendMail({
                from: process.env.EMAIL_FROM,
                to: data.email,
                subject: '✅ Confirmación de Solicitud - Hotel El Cardenal Loja',
                html: `
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <meta charset="utf-8">
                        <style>
                            body { font-family: 'Georgia', serif; margin: 0; padding: 0; background-color: #f5f5dc; }
                            .container { max-width: 600px; margin: 0 auto; background: white; }
                            .header { background: linear-gradient(135deg, #2d5a3d 0%, #1a3a25 100%); color: white; padding: 30px; text-align: center; }
                            .header h1 { margin: 0; font-size: 28px; }
                            .header p { margin: 10px 0 0; color: #c9a86a; font-style: italic; }
                            .content { padding: 30px; }
                            .greeting { font-size: 18px; color: #2d5a3d; margin-bottom: 20px; }
                            .section { background: #faf8f5; border-left: 4px solid #c9a86a; padding: 15px; margin: 20px 0; }
                            .section h3 { color: #2d5a3d; margin: 0 0 10px; font-size: 16px; }
                            .section p { margin: 5px 0; color: #666; }
                            .cta { text-align: center; margin: 30px 0; }
                            .cta a { background: #25D366; color: white; padding: 15px 30px; text-decoration: none; font-weight: bold; display: inline-block; }
                            .footer { background: #2d5a3d; color: white; padding: 20px; text-align: center; font-size: 12px; }
                            .footer a { color: #c9a86a; }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <div class="header">
                                <h1>🏨 Hotel El Cardenal</h1>
                                <p>Loja, Ecuador - Hospitalidad con Tradición</p>
                            </div>
                            <div class="content">
                                <p class="greeting">Estimado/a <strong>${data.nombre}</strong>,</p>
                                <p>¡Gracias por contactarnos! Hemos recibido su solicitud y nuestro equipo la está procesando.</p>
                                
                                <div class="section">
                                    <h3>📋 Resumen de su Solicitud</h3>
                                    <p><strong>Motivo:</strong> ${data.motivo || 'Consulta General'}</p>
                                    ${fechaEntrada ? `<p><strong>Fecha de Entrada:</strong> ${fechaEntrada}</p>` : ''}
                                    ${fechaSalida ? `<p><strong>Fecha de Salida:</strong> ${fechaSalida}</p>` : ''}
                                    ${data.habitacion ? `<p><strong>Habitación:</strong> ${data.habitacion}</p>` : ''}
                                    <p><strong>Huéspedes:</strong> ${data.adultos || 2} adultos, ${data.ninos || 0} niños</p>
                                    <p><strong>Comidas:</strong> ${comidas}</p>
                                </div>

                                <div class="section">
                                    <h3>📞 ¿Qué sigue?</h3>
                                    <p>Nuestro equipo de recepción se pondrá en contacto con usted en las próximas horas para:</p>
                                    <p>• Confirmar disponibilidad</p>
                                    <p>• Enviarle el link de pago seguro</p>
                                    <p>• Resolver cualquier consulta adicional</p>
                                </div>

                                <div class="cta">
                                    <p>¿Necesita una respuesta inmediata?</p>
                                    <a href="https://wa.me/593996616878">💬 Contáctenos por WhatsApp</a>
                                </div>
                            </div>
                            <div class="footer">
                                <p><strong>Hotel El Cardenal</strong></p>
                                <p>Urbanización Los Rosales, Loja, Ecuador</p>
                                <p>📞 +593 96 341 0409 | 📧 email@hotelelcardenalloja.com</p>
                                <p><a href="https://hotelelcardenalloja.com">www.hotelelcardenalloja.com</a></p>
                            </div>
                        </div>
                    </body>
                    </html>
                `
            });
        } catch (emailError) {
            console.error('Error sending confirmation email:', emailError);
            // Don't fail the request if email fails
        }

        // Also send notification to hotel
        try {
            await transporter.sendMail({
                from: process.env.EMAIL_FROM,
                to: process.env.EMAIL_USER,
                subject: `🔔 Nueva Solicitud: ${data.nombre} - ${data.motivo || 'Consulta'}`,
                html: `
                    <h2>Nueva solicitud recibida</h2>
                    <p><strong>Cliente:</strong> ${data.nombre}</p>
                    <p><strong>Email:</strong> ${data.email}</p>
                    <p><strong>Teléfono:</strong> ${data.telefono || 'No proporcionado'}</p>
                    <p><strong>Motivo:</strong> ${data.motivo || 'Consulta General'}</p>
                    <p><strong>Fechas:</strong> ${fechaEntrada || 'N/A'} - ${fechaSalida || 'N/A'}</p>
                    <p><strong>Habitación:</strong> ${data.habitacion || 'Sin preferencia'}</p>
                    <p><strong>Mensaje:</strong> ${data.mensaje || data.comentarios || 'Ninguno'}</p>
                    <hr>
                    <p><a href="https://wa.me/${data.telefono?.replace(/\D/g, '')}">Contactar por WhatsApp</a></p>
                `
            });
        } catch (notifyError) {
            console.error('Error sending notification email:', notifyError);
        }

        return NextResponse.json({
            success: true,
            id: clienteId,
            message: 'Cliente registrado correctamente'
        });
    } catch (error: any) {
        console.error('Error creating cliente:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
