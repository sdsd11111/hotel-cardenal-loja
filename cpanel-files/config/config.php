<?php
/**
 * Configuración de Conexión a Base de Datos MySQL
 * Hotel Puente Roto - cPanel
 */

// ============================================
// SEGURIDAD - API KEY
// ============================================
define('API_KEY', 'enloja_secure_api_key_2024_restaurant_admin_xyz789');

// ============================================
// SEGURIDAD - CORS RESTRICTIVO
// ============================================
$allowed_origins = [
    'https://www.enloja.net',
    'https://enloja.net',
    'http://localhost:3000', // Para desarrollo
];

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origin, $allowed_origins)) {
    header("Access-Control-Allow-Origin: $origin");
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization, X-API-Key');
    header('Access-Control-Allow-Credentials: true');
} else if (!empty($origin)) {
    // Si hay origin pero no está permitido, rechazar
    http_response_code(403);
    echo json_encode(['success' => false, 'error' => 'Origin not allowed']);
    exit();
}

header('Content-Type: application/json; charset=UTF-8');

// Responder a preflight requests (OPTIONS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// ============================================
// CONFIGURACIÓN DE BASE DE DATOS
// ============================================

define('DB_HOST', 'localhost');
define('DB_NAME', 'enloja_platos');
define('DB_USER', 'enloja_platos');
define('DB_PASS', ';4yX8nGtXK[*');
define('DB_CHARSET', 'utf8mb4');

// ============================================
// ESTABLECER CONEXIÓN
// ============================================

try {
    $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
    
    // Verificar errores de conexión
    if ($conn->connect_error) {
        throw new Exception('Error de conexión a la base de datos: ' . $conn->connect_error);
    }
    
    // Establecer charset
    if (!$conn->set_charset(DB_CHARSET)) {
        throw new Exception('Error al establecer charset: ' . $conn->error);
    }
    
} catch (Exception $e) {
    // Log del error (en producción, considera usar error_log())
    error_log('Database connection error: ' . $e->getMessage());
    
    // Respuesta JSON de error
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Error de conexión al servidor',
        'message' => 'No se pudo conectar a la base de datos'
    ]);
    exit();
}

// ============================================
// FUNCIONES DE UTILIDAD
// ============================================

/**
 * Función para sanitizar input
 */
function sanitize_input($data) {
    global $conn;
    return $conn->real_escape_string(trim(strip_tags($data)));
}

/**
 * Función para generar UUID v4
 */
function generate_uuid() {
    return sprintf(
        '%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
        mt_rand(0, 0xffff), mt_rand(0, 0xffff),
        mt_rand(0, 0xffff),
        mt_rand(0, 0x0fff) | 0x4000,
        mt_rand(0, 0x3fff) | 0x8000,
        mt_rand(0, 0xffff), mt_rand(0, 0xffff), mt_rand(0, 0xffff)
    );
}

/**
 * Función para enviar respuesta JSON
 */
function send_json_response($data, $status_code = 200) {
    http_response_code($status_code);
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit();
}

/**
 * Función para enviar error JSON
 */
function send_error($message, $status_code = 400, $details = null) {
    $response = [
        'success' => false,
        'error' => $message
    ];
    
    if ($details !== null) {
        $response['details'] = $details;
    }
    
    send_json_response($response, $status_code);
}

/**
 * Función para verificar autenticación con API Key
 */
function verificarAutenticacion() {
    // Obtener API Key desde headers (compatible con todos los servidores)
    $apiKey = '';
    
    // Método 1: getallheaders() (Apache)
    if (function_exists('getallheaders')) {
        $headers = getallheaders();
        $apiKey = $headers['X-API-Key'] ?? $headers['x-api-key'] ?? '';
    }
    
    // Método 2: $_SERVER (funciona en todos los servidores)
    if (empty($apiKey)) {
        $apiKey = $_SERVER['HTTP_X_API_KEY'] ?? '';
    }
    
    // Verificar que coincida con la configurada
    if ($apiKey !== API_KEY) {
        send_error('No autorizado. API Key inválida o faltante.', 401);
    }
    
    return true;
}

?>
