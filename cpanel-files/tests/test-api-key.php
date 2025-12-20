<?php
/**
 * Test de API Key y Headers
 */

error_reporting(E_ALL);
ini_set('display_errors', 1);

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, X-API-Key');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

echo json_encode([
    'success' => true,
    'test' => 'Headers disponibles',
    'method' => $_SERVER['REQUEST_METHOD'],
    'headers_function_exists' => function_exists('getallheaders'),
    'headers_apache' => function_exists('apache_request_headers'),
    'all_headers' => function_exists('getallheaders') ? getallheaders() : 'N/A',
    'server_vars' => [
        'HTTP_X_API_KEY' => $_SERVER['HTTP_X_API_KEY'] ?? 'NOT SET',
        'HTTP_ORIGIN' => $_SERVER['HTTP_ORIGIN'] ?? 'NOT SET',
    ],
], JSON_PRETTY_PRINT);
?>
