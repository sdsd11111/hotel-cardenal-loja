
-- Estructura de tabla para platos
DROP TABLE IF EXISTS platos;
CREATE TABLE platos (
  id varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'UUID del plato',
  titulo varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Nombre del plato',
  descripcion text COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Descripción detallada',
  precio decimal(10,2) NOT NULL COMMENT 'Precio en USD',
  imagen_url varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'URL de la imagen',
  activo tinyint(1) DEFAULT '1' COMMENT '1=activo, 0=inactivo',
  created_at timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  imagen_blob longblob,
  imagen_mime varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Volcado de datos para platos
INSERT INTO platos (id, titulo, descripcion, precio, imagen_url, activo) VALUES ('uuid-se7mbocbp', 'Sopa de Arveja con Guineo Tradicional', 'La esencia de la gastronomía de Loja en un plato. Reconfortante sopa cremosa de arvejas tiernas, guineo verde y el toque secreto de la Sierra Sur.', 5.5, '/images/platos/arveja-guineo.webp', 1);
INSERT INTO platos (id, titulo, descripcion, precio, imagen_url, activo) VALUES ('uuid-jr8u1msfe', 'Trucha Frita Crujiente del Río Malacatos', 'Trucha entera, ligeramente frita hasta un punto crujiente, que mantiene su jugosidad. Servida con nuestra salsa tártara de hierbas locales.', 12.95, '/images/platos/trucha-frita.webp', 1);
INSERT INTO platos (id, titulo, descripcion, precio, imagen_url, activo) VALUES ('uuid-nzcck5ix2', 'Hornado de Cerdo Ecuatoriano', 'La especialidad más icónica de la región sur. Pierna de cerdo seleccionada, adobada y horneada durante horas para lograr una carne jugosa.', 16.95, '/images/platos/hornado.webp', 1);
INSERT INTO platos (id, titulo, descripcion, precio, imagen_url, activo) VALUES ('uuid-4bwvqw1v4', 'Tamal Lojano Auténtico', 'Un clásico del sur andino con historia. Masa de maíz envuelta y cocida al vapor en hoja de achira, rellena de carne de cerdo/pollo.', 6.25, '/images/platos/tamal-lojano.webp', 1);
