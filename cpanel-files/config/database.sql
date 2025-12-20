-- ============================================
-- Script de Creación de Base de Datos MySQL
-- Para cPanel - Hotel Puente Roto
-- ============================================

-- Paso 1: Crear la base de datos (esto lo harás desde cPanel)
-- En cPanel > MySQL Databases > Create New Database
-- Nombre sugerido: hotel_platos

-- Paso 2: Ejecutar este script en phpMyAdmin

-- Crear tabla de platos
CREATE TABLE IF NOT EXISTS platos (
  id VARCHAR(36) PRIMARY KEY COMMENT 'UUID del plato',
  titulo VARCHAR(255) NOT NULL COMMENT 'Nombre del plato',
  descripcion TEXT NOT NULL COMMENT 'Descripción detallada',
  precio DECIMAL(10, 2) NOT NULL COMMENT 'Precio en USD',
  imagen_url VARCHAR(500) NOT NULL COMMENT 'URL de la imagen',
  activo TINYINT(1) DEFAULT 1 COMMENT '1=activo, 0=inactivo',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  -- Índices para optimizar consultas
  INDEX idx_activo (activo),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Tabla de platos del restaurante';

-- Verificar que la tabla se creó correctamente
-- SELECT * FROM platos;

-- Datos de ejemplo (opcional, puedes comentar/descomentar)
-- INSERT INTO platos (id, titulo, descripcion, precio, imagen_url, activo) VALUES
-- ('550e8400-e29b-41d4-a716-446655440000', 'Ceviche de Camarón', 'Delicioso ceviche ecuatoriano con camarones frescos, limón y especias', 12.50, '/uploads/platos/ceviche.jpg', 1),
-- ('550e8400-e29b-41d4-a716-446655440001', 'Lomo Saltado', 'Exquisito lomo saltado con papas fritas y arroz', 15.00, '/uploads/platos/lomo.jpg', 1);
