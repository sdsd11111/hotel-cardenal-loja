
-- Estructura de tabla para habitaciones
DROP TABLE IF EXISTS habitaciones;
CREATE TABLE habitaciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    descripcion TEXT,
    amenidades JSON,
    precio_texto VARCHAR(255),
    precio_numerico DECIMAL(10, 2),
    imagen VARCHAR(255),
    imagen_blob LONGBLOB,
    imagen_mime VARCHAR(100),
    max_adultos INT DEFAULT 2,
    max_ninos INT DEFAULT 0,
    camas INT DEFAULT 1,
    activo BOOLEAN DEFAULT TRUE,
    disponible BOOLEAN DEFAULT TRUE,
    fecha_entrada DATETIME,
    fecha_salida DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Volcado de datos para habitaciones
-- Para las imágenes, se usan las rutas estáticas por ahora. 
-- El admin panel permite subir imágenes binarias (imagen_blob) posteriormente.
INSERT INTO habitaciones (id, nombre, slug, descripcion, amenidades, precio_texto, precio_numerico, imagen, max_adultos, max_ninos, camas, activo, disponible)
VALUES 
(
    1,
    'Familiar Loft', 
    'familiar-loft', 
    'El refugio ideal para la familia en Loja. Distribución en dos niveles para máxima privacidad.', 
    '["2 Camas","TV Grande","Vistas","WiFi","Parqueo"]', 
    'Desde $30 USD / Noche', 
    30.00, 
    '/images/habitaciones/familiar-loft-main.webp', 
    4, 
    2, 
    2,
    1,
    1
),
(
    2,
    'Triple', 
    'triple', 
    'Versatilidad y comodidad compartida. Tres camas individuales con lencería de alta calidad.', 
    '["Tres Camas","WiFi","Climatización","Amenities"]', 
    'Desde $30 USD / Noche', 
    30.00, 
    '/images/habitaciones/triple-main.webp', 
    3, 
    1, 
    3,
    1,
    1
),
(
    3,
    'Doble Twin', 
    'doble-twin', 
    'Descanso independiente y profesional. Espacio funcional con escritorio y WiFi de alta velocidad.', 
    '["2 Camas","Escritorio","WiFi","Climatización"]', 
    'Desde $30 USD / Noche', 
    30.00, 
    '/images/habitaciones/doble-twin-main.webp', 
    2, 
    0, 
    2,
    1,
    1
),
(
    4,
    'Matrimonial', 
    'matrimonial', 
    'Intimidad y elegancia para dos. Cama matrimonial de lujo con detalles neoclásicos.', 
    '["Cama King","Vistas","Climatización","Amenities"]', 
    'Desde $30 USD / Noche', 
    30.00, 
    '/images/habitaciones/matrimonial-main.webp', 
    2, 
    1, 
    1,
    1,
    1
);
