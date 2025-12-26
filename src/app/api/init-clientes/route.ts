import { NextResponse } from 'next/server';
import { query } from '@/lib/mysql';

export async function GET() {
    try {
        // Crear tabla de clientes
        await query(`
            CREATE TABLE IF NOT EXISTS clientes (
                id INT AUTO_INCREMENT PRIMARY KEY,
                
                -- Datos Básicos del Formulario
                nombre VARCHAR(255) NOT NULL,
                apellidos VARCHAR(255),
                email VARCHAR(255) NOT NULL,
                telefono VARCHAR(50),
                hora_evento VARCHAR(50),
                
                -- Datos de Reserva
                motivo VARCHAR(100),
                fecha_entrada DATE,
                fecha_salida DATE,
                adultos INT DEFAULT 2,
                ninos INT DEFAULT 0,
                habitacion_preferida VARCHAR(255),
                
                -- Servicios de Alimentación
                desayuno BOOLEAN DEFAULT FALSE,
                almuerzo BOOLEAN DEFAULT FALSE,
                cena BOOLEAN DEFAULT FALSE,
                
                -- Facturación
                desea_facturacion BOOLEAN DEFAULT FALSE,
                tipo_documento VARCHAR(50),
                identificacion VARCHAR(50),
                razon_social VARCHAR(255),
                direccion_facturacion TEXT,
                
                -- Requerimientos Especiales
                trae_mascota BOOLEAN DEFAULT FALSE,
                comentarios TEXT,
                mensaje TEXT,
                
                -- Datos Personales Adicionales (CRM)
                fecha_nacimiento DATE,
                ciudad_residencia VARCHAR(100),
                pais VARCHAR(100) DEFAULT 'Ecuador',
                profesion VARCHAR(100),
                empresa VARCHAR(255),
                como_nos_conocio VARCHAR(100),
                
                -- Redes Sociales
                instagram VARCHAR(100),
                facebook VARCHAR(100),
                
                -- Preferencias
                preferencias_habitacion TEXT,
                alergias_alimentarias TEXT,
                
                -- Historial y Métricas
                total_estadias INT DEFAULT 1,
                ultima_estadia DATE,
                notas_internas TEXT,
                calificacion INT,
                es_vip BOOLEAN DEFAULT FALSE,
                
                -- Metadatos
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                activo BOOLEAN DEFAULT TRUE,
                
                -- Índices
                INDEX idx_email (email),
                INDEX idx_nombre (nombre),
                INDEX idx_created_at (created_at)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);

        // Alter table to add new columns if they don't exist
        // Using a try-catch without IF NOT EXISTS for better compatibility with older MySQL
        try {
            await query(`ALTER TABLE clientes ADD COLUMN apellidos VARCHAR(255) AFTER nombre`);
        } catch (e: any) {
            if (!e.message.includes('Duplicate column name')) {
                console.error('Error adding apellidos:', e.message);
            }
        }

        try {
            await query(`ALTER TABLE clientes ADD COLUMN hora_evento VARCHAR(50) AFTER telefono`);
        } catch (e: any) {
            if (!e.message.includes('Duplicate column name')) {
                console.error('Error adding hora_evento:', e.message);
            }
        }

        // Versión 2: Agregar campos para eventos si no existen
        try {
            await query("ALTER TABLE clientes ADD COLUMN IF NOT EXISTS apellidos VARCHAR(255) AFTER nombre");
        } catch (e) {
            console.log("Columna 'apellidos' ya existe o el motor no soporta IF NOT EXISTS en ALTER");
        }

        try {
            await query("ALTER TABLE clientes ADD COLUMN IF NOT EXISTS hora_evento VARCHAR(50) AFTER fecha_salida");
        } catch (e) {
            console.log("Columna 'hora_evento' ya existe o el motor no soporta IF NOT EXISTS en ALTER");
        }

        return NextResponse.json({
            success: true,
            message: 'Tabla de clientes creada correctamente'
        });
    } catch (error: any) {
        console.error('Error creating clientes table:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
