<?php
/**
 * API de Upload de Imágenes - Hotel Puente Roto
 * Maneja la subida de imágenes de platos
 * 
 * RUTA: POST /upload-imagen.php
 */


require_once 'config.php';

// Verificar autenticación
verificarAutenticacion();

// Solo permitir POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    send_error('Método no permitido. Use POST', 405);
}

// Configuración de upload
define('UPLOAD_DIR', __DIR__ . '/uploads/platos/');
define('MAX_FILE_SIZE', 1 * 1024 * 1024); // 1MB
define('ALLOWED_TYPES', ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']);
define('ALLOWED_EXTENSIONS', ['jpg', 'jpeg', 'png', 'webp']);

// Crear directorio si no existe
if (!file_exists(UPLOAD_DIR)) {
    if (!mkdir(UPLOAD_DIR, 0755, true)) {
        send_error('Error al crear directorio de uploads', 500);
    }
}


// Verificar que se envió un archivo
if (!isset($_FILES['imagen']) || $_FILES['imagen']['error'] === UPLOAD_ERR_NO_FILE) {
    send_error('No se envió ningún archivo', 400);
}

$file = $_FILES['imagen'];

// Verificar errores de upload
if ($file['error'] !== UPLOAD_ERR_OK) {
    $error_messages = [
        UPLOAD_ERR_INI_SIZE => 'El archivo excede el tamaño máximo permitido',
        UPLOAD_ERR_FORM_SIZE => 'El archivo excede el tamaño del formulario',
        UPLOAD_ERR_PARTIAL => 'El archivo se subió parcialmente',
        UPLOAD_ERR_NO_TMP_DIR => 'Falta la carpeta temporal',
        UPLOAD_ERR_CANT_WRITE => 'Error al escribir el archivo en disco',
        UPLOAD_ERR_EXTENSION => 'Una extensión PHP detuvo la subida'
    ];
    
    $message = $error_messages[$file['error']] ?? 'Error desconocido al subir archivo';
    send_error($message, 500);
}

// Verificar tamaño del archivo
if ($file['size'] > MAX_FILE_SIZE) {
    send_error('El archivo excede el tamaño máximo de 1MB', 400);
}

// Verificar tipo MIME
$finfo = finfo_open(FILEINFO_MIME_TYPE);
$mime_type = finfo_file($finfo, $file['tmp_name']);
finfo_close($finfo);

if (!in_array($mime_type, ALLOWED_TYPES)) {
    send_error('Tipo de archivo no permitido. Solo se permiten: JPG, PNG, WebP', 400);
}

// Verificar extensión
$extension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
if (!in_array($extension, ALLOWED_EXTENSIONS)) {
    send_error('Extensión de archivo no permitida', 400);
}

// Generar nombre único para el archivo
$new_filename = generate_uuid() . '.' . $extension;
$upload_path = UPLOAD_DIR . $new_filename;

// Mover archivo a directorio de uploads
if (!move_uploaded_file($file['tmp_name'], $upload_path)) {
    send_error('Error al guardar el archivo', 500);
}

// Optimizar/redimensionar imagen (opcional pero recomendado)
try {
    optimizeImage($upload_path, $mime_type);
} catch (Exception $e) {
    // Si falla la optimización, continuar con el archivo original
    error_log('Error optimizando imagen: ' . $e->getMessage());
}

// URL absoluta de la imagen
$image_url = 'http://216.246.46.43/~enloja/api.enloja.net/uploads/platos/' . $new_filename;

// Respuesta exitosa
send_json_response([
    'success' => true,
    'message' => 'Imagen subida exitosamente',
    'data' => [
        'url' => $image_url,
        'filename' => $new_filename,
        'size' => filesize($upload_path),
        'type' => $mime_type
    ]
], 201);

/**
 * Función para optimizar/redimensionar imagen
 */
function optimizeImage($filepath, $mime_type) {
    // Dimensiones máximas
    $max_width = 1920;
    $max_height = 1080;
    
    // Cargar imagen según tipo
    switch ($mime_type) {
        case 'image/jpeg':
        case 'image/jpg':
            $image = imagecreatefromjpeg($filepath);
            break;
        case 'image/png':
            $image = imagecreatefrompng($filepath);
            break;
        case 'image/webp':
            $image = imagecreatefromwebp($filepath);
            break;
        default:
            return; // No optimizar formatos no soportados
    }
    
    if (!$image) {
        throw new Exception('No se pudo cargar la imagen');
    }
    
    // Obtener dimensiones originales
    $width = imagesx($image);
    $height = imagesy($image);
    
    // Calcular nuevas dimensiones manteniendo aspecto
    if ($width > $max_width || $height > $max_height) {
        $ratio = min($max_width / $width, $max_height / $height);
        $new_width = (int)($width * $ratio);
        $new_height = (int)($height * $ratio);
        
        // Crear imagen redimensionada
        $new_image = imagecreatetruecolor($new_width, $new_height);
        
        // Preservar transparencia para PNG
        if ($mime_type === 'image/png') {
            imagealphablending($new_image, false);
            imagesavealpha($new_image, true);
        }
        
        // Redimensionar
        imagecopyresampled(
            $new_image, $image,
            0, 0, 0, 0,
            $new_width, $new_height,
            $width, $height
        );
        
        // Guardar imagen optimizada
        switch ($mime_type) {
            case 'image/jpeg':
            case 'image/jpg':
                imagejpeg($new_image, $filepath, 85); // Calidad 85%
                break;
            case 'image/png':
                imagepng($new_image, $filepath, 6); // Compresión nivel 6
                break;
            case 'image/webp':
                imagewebp($new_image, $filepath, 85);
                break;
        }
        
        imagedestroy($new_image);
    }
    
    imagedestroy($image);
}
?>
