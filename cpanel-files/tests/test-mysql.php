<?php
// Test de conexión MySQL
error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "<h2>Test de Conexión MySQL</h2>";

$host = 'localhost';
$user = 'enloja_platos';
$pass = 'Olakasetk1.';
$db = 'enloja_platos';

echo "<p>Intentando conectar con:</p>";
echo "Host: $host<br>";
echo "User: $user<br>";
echo "Database: $db<br>";

try {
    $conn = new mysqli($host, $user, $pass, $db);
    
    if ($conn->connect_error) {
        echo "<p style='color:red'><strong>ERROR de conexión:</strong><br>";
        echo "Código: " . $conn->connect_errno . "<br>";
        echo "Mensaje: " . $conn->connect_error . "</p>";
        die();
    }
    
    echo "<p style='color:green'><strong>✅ CONEXIÓN EXITOSA!</strong></p>";
    echo "Character set: " . $conn->character_set_name() . "<br>";
    
    // Probar una query simple
    $result = $conn->query("SELECT COUNT(*) as total FROM platos");
    if ($result) {
        $row = $result->fetch_assoc();
        echo "Total de platos en la tabla: " . $row['total'];
    }
    
    $conn->close();
    
} catch (Exception $e) {
    echo "<p style='color:red'><strong>EXCEPCIÓN:</strong><br>";
    echo $e->getMessage() . "</p>";
}
?>
