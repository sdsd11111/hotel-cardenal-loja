<?php
/**
 * API REST de Platos - Hotel Puente Roto
 * Endpoints para gestionar los platos del restaurante
 * 
 * RUTAS:
 * GET    /api-platos.php              - Obtener todos los platos
 * GET    /api-platos.php?activos      - Obtener solo platos activos
 * GET    /api-platos.php?id=xxx       - Obtener un plato específico
 * POST   /api-platos.php              - Crear nuevo plato
 * PUT    /api-platos.php?id=xxx       - Actualizar plato
 * DELETE /api-platos.php?id=xxx       - Eliminar plato
 */

require_once 'config.php';

// Obtener método HTTP
$method = $_SERVER['REQUEST_METHOD'];

// ============================================
// SEGURIDAD - Verificar autenticación para operaciones de escritura
// ============================================
if (in_array($method, ['POST', 'PUT', 'DELETE'])) {
    verificarAutenticacion();
}

// Routing según el método
switch($method) {
    case 'GET':
        handleGet($conn);
        break;
    case 'POST':
        handlePost($conn);
        break;
    case 'PUT':
        handlePut($conn);
        break;
    case 'DELETE':
        handleDelete($conn);
        break;
    default:
        send_error('Método no permitido', 405);
}

// ============================================
// HANDLERS
// ============================================

/**
 * GET - Obtener platos
 */
function handleGet($conn) {
    // Si se solicita un plato específico
    if (isset($_GET['id'])) {
        getPlato($conn, $_GET['id']);
        return;
    }
    
    // Si se solicitan solo platos activos
    if (isset($_GET['activos']) || isset($_GET['active'])) {
        getPlatosActivos($conn);
        return;
    }
    
    // Obtener todos los platos
    getTodosPlatos($conn);
}

/**
 * POST - Crear nuevo plato
 */
function handlePost($conn) {
    // Obtener datos del body
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input) {
        send_error('Datos inválidos o vacíos', 400);
    }
    
    // Validar campos requeridos
    $required_fields = ['titulo', 'descripcion', 'precio', 'imagen_url'];
    foreach ($required_fields as $field) {
        if (!isset($input[$field]) || empty(trim($input[$field]))) {
            send_error("El campo '$field' es requerido", 400);
        }
    }
    
    // Validar precio
    if (!is_numeric($input['precio']) || $input['precio'] < 0) {
        send_error('El precio debe ser un número positivo', 400);
    }
    
    crearPlato($conn, $input);
}

/**
 * PUT - Actualizar plato existente
 */
function handlePut($conn) {
    if (!isset($_GET['id'])) {
        send_error('ID del plato es requerido', 400);
    }
    
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input) {
        send_error('Datos inválidos o vacíos', 400);
    }
    
    actualizarPlato($conn, $_GET['id'], $input);
}

/**
 * DELETE - Eliminar plato
 */
function handleDelete($conn) {
    if (!isset($_GET['id'])) {
        send_error('ID del plato es requerido', 400);
    }
    
    eliminarPlato($conn, $_GET['id']);
}

// ============================================
// FUNCIONES DE BASE DE DATOS
// ============================================

/**
 * Obtener todos los platos
 */
function getTodosPlatos($conn) {
    $sql = "SELECT * FROM platos ORDER BY created_at DESC";
    $result = $conn->query($sql);
    
    if (!$result) {
        send_error('Error al consultar platos', 500, $conn->error);
    }
    
    $platos = [];
    while ($row = $result->fetch_assoc()) {
        $row['activo'] = (bool) $row['activo']; // Convertir a boolean
        $row['precio'] = (float) $row['precio']; // Convertir a float
        $platos[] = $row;
    }
    
    send_json_response([
        'success' => true,
        'data' => $platos,
        'count' => count($platos)
    ]);
}

/**
 * Obtener solo platos activos
 */
function getPlatosActivos($conn) {
    $sql = "SELECT * FROM platos WHERE activo = 1 ORDER BY created_at DESC";
    $result = $conn->query($sql);
    
    if (!$result) {
        send_error('Error al consultar platos activos', 500, $conn->error);
    }
    
    $platos = [];
    while ($row = $result->fetch_assoc()) {
        $row['activo'] = (bool) $row['activo'];
        $row['precio'] = (float) $row['precio'];
        $platos[] = $row;
    }
    
    send_json_response([
        'success' => true,
        'data' => $platos,
        'count' => count($platos)
    ]);
}

/**
 * Obtener un plato específico por ID
 */
function getPlato($conn, $id) {
    $id = sanitize_input($id);
    
    $stmt = $conn->prepare("SELECT * FROM platos WHERE id = ?");
    $stmt->bind_param("s", $id);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 0) {
        send_error('Plato no encontrado', 404);
    }
    
    $plato = $result->fetch_assoc();
    $plato['activo'] = (bool) $plato['activo'];
    $plato['precio'] = (float) $plato['precio'];
    
    send_json_response([
        'success' => true,
        'data' => $plato
    ]);
}

/**
 * Crear nuevo plato
 */
function crearPlato($conn, $data) {
    $id = generate_uuid();
    $titulo = sanitize_input($data['titulo']);
    $descripcion = sanitize_input($data['descripcion']);
    $precio = (float) $data['precio'];
    $imagen_url = sanitize_input($data['imagen_url']);
    $activo = isset($data['activo']) ? (int) $data['activo'] : 1;
    
    $stmt = $conn->prepare(
        "INSERT INTO platos (id, titulo, descripcion, precio, imagen_url, activo) 
         VALUES (?, ?, ?, ?, ?, ?)"
    );
    
    $stmt->bind_param("sssdsi", $id, $titulo, $descripcion, $precio, $imagen_url, $activo);
    
    if (!$stmt->execute()) {
        send_error('Error al crear el plato', 500, $stmt->error);
    }
    
    // Obtener el plato creado
    $stmt_select = $conn->prepare("SELECT * FROM platos WHERE id = ?");
    $stmt_select->bind_param("s", $id);
    $stmt_select->execute();
    $result = $stmt_select->get_result();
    $plato = $result->fetch_assoc();
    
    $plato['activo'] = (bool) $plato['activo'];
    $plato['precio'] = (float) $plato['precio'];
    
    send_json_response([
        'success' => true,
        'message' => 'Plato creado exitosamente',
        'data' => $plato
    ], 201);
}

/**
 * Actualizar plato existente
 */
function actualizarPlato($conn, $id, $data) {
    $id = sanitize_input($id);
    
    // Verificar que el plato existe
    $stmt_check = $conn->prepare("SELECT id FROM platos WHERE id = ?");
    $stmt_check->bind_param("s", $id);
    $stmt_check->execute();
    
    if ($stmt_check->get_result()->num_rows === 0) {
        send_error('Plato no encontrado', 404);
    }
    
    // Construir query dinámicamente solo con campos presentes
    $updates = [];
    $types = "";
    $values = [];
    
    if (isset($data['titulo'])) {
        $updates[] = "titulo = ?";
        $types .= "s";
        $values[] = sanitize_input($data['titulo']);
    }
    
    if (isset($data['descripcion'])) {
        $updates[] = "descripcion = ?";
        $types .= "s";
        $values[] = sanitize_input($data['descripcion']);
    }
    
    if (isset($data['precio'])) {
        $updates[] = "precio = ?";
        $types .= "d";
        $values[] = (float) $data['precio'];
    }
    
    if (isset($data['imagen_url'])) {
        $updates[] = "imagen_url = ?";
        $types .= "s";
        $values[] = sanitize_input($data['imagen_url']);
    }
    
    if (isset($data['activo'])) {
        $updates[] = "activo = ?";
        $types .= "i";
        $values[] = (int) $data['activo'];
    }
    
    if (empty($updates)) {
        send_error('No hay campos para actualizar', 400);
    }
    
    $sql = "UPDATE platos SET " . implode(", ", $updates) . " WHERE id = ?";
    $types .= "s";
    $values[] = $id;
    
    $stmt = $conn->prepare($sql);
    $stmt->bind_param($types, ...$values);
    
    if (!$stmt->execute()) {
        send_error('Error al actualizar el plato', 500, $stmt->error);
    }
    
    // Obtener el plato actualizado
    $stmt_select = $conn->prepare("SELECT * FROM platos WHERE id = ?");
    $stmt_select->bind_param("s", $id);
    $stmt_select->execute();
    $result = $stmt_select->get_result();
    $plato = $result->fetch_assoc();
    
    $plato['activo'] = (bool) $plato['activo'];
    $plato['precio'] = (float) $plato['precio'];
    
    send_json_response([
        'success' => true,
        'message' => 'Plato actualizado exitosamente',
        'data' => $plato
    ]);
}

/**
 * Eliminar plato y su imagen asociada
 */
function eliminarPlato($conn, $id) {
    $id = sanitize_input($id);
    
    // Primero obtener la URL de la imagen antes de eliminar
    $stmt_get = $conn->prepare("SELECT imagen_url FROM platos WHERE id = ?");
    $stmt_get->bind_param("s", $id);
    $stmt_get->execute();
    $result = $stmt_get->get_result();
    
    if ($result->num_rows === 0) {
        send_error('Plato no encontrado', 404);
    }
    
    $plato = $result->fetch_assoc();
    $imagen_url = $plato['imagen_url'];
    
    // Si hay una imagen, intentar eliminarla del servidor
    if (!empty($imagen_url)) {
        // Extraer el nombre del archivo de la URL
        // Ejemplo: http://216.246.46.43/~enloja/api.enloja.net/uploads/platos/nombre.webp
        $filename = basename($imagen_url);
        $filepath = __DIR__ . '/uploads/platos/' . $filename;
        
        // Intentar eliminar el archivo físico
        if (file_exists($filepath)) {
            if (!@unlink($filepath)) {
                error_log("No se pudo eliminar la imagen: $filepath");
                // Continuar aunque falle la eliminación de la imagen
            }
        }
    }
    
    // Opción 1: Hard delete (eliminar completamente)
    $stmt = $conn->prepare("DELETE FROM platos WHERE id = ?");
    $stmt->bind_param("s", $id);
    
    // Opción 2: Soft delete (solo desactivar - comenta la línea anterior y descomenta estas)
    // $stmt = $conn->prepare("UPDATE platos SET activo = 0 WHERE id = ?");
    // $stmt->bind_param("s", $id);
    
    if (!$stmt->execute()) {
        send_error('Error al eliminar el plato', 500, $stmt->error);
    }
    
    if ($stmt->affected_rows === 0) {
        send_error('Plato no encontrado', 404);
    }
    
    send_json_response([
        'success' => true,
        'message' => 'Plato e imagen eliminados exitosamente'
    ]);
}

// Cerrar conexión al final
$conn->close();
?>
