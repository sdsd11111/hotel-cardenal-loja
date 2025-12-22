-- Verificación de la tabla habitaciones
SELECT 'CONTEO HABITACIONES' as info, COUNT(*) as total FROM habitaciones;
SELECT * FROM habitaciones LIMIT 5;

-- Verificación de la tabla platos
SELECT 'CONTEO PLATOS' as info, COUNT(*) as total FROM platos;
SELECT * FROM platos LIMIT 5;

-- Verificar estructura (opcional)
-- DESCRIBE habitaciones;
-- DESCRIBE platos;
