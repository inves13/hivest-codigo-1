<?php
header("Content-Type: application/json");
$conn = new mysqli("localhost", "usuario", "senha", "banco");

if ($conn->connect_error) {
    die(json_encode(["mensagem" => "Erro na conexão com o banco"]));
}

$codigoPatrocinador = $_GET["codigo"]; // código do patrocinador enviado via GET

$stmt = $conn->prepare("
    SELECT u.nome, u.telefone
    FROM indicacoes i
    JOIN usuarios u ON u.telefone = i.telefone_indicado
    WHERE i.codigo_patrocinador = ?
");
$stmt->bind_param("s", $codigoPatrocinador);
$stmt->execute();
$result = $stmt->get_result();

$membros = [];
while ($row = $result->fetch_assoc()) {
    $membros[] = $row;
}

echo json_encode([
    "quantidade" => count($membros),
    "membros" => $membros
]);

$conn->close();
?>

