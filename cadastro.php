<?php
header("Content-Type: application/json");
$data = json_decode(file_get_contents("php://input"), true);
$conn = new mysqli("localhost", "usuario", "senha", "banco");

if ($conn->connect_error) {
    die(json_encode(["mensagem" => "Erro na conexão com o banco"]));
}

$nome = $data["nome"];
$telefone = $data["telefone"];
$senha = password_hash($data["senha"], PASSWORD_BCRYPT);
$codigo = $data["codigo"];
$indicacao = $data["indicacao"];

// Validação do telefone
$stmt_check = $conn->prepare("SELECT * FROM usuarios WHERE telefone = ?");
$stmt_check->bind_param("s", $telefone);
$stmt_check->execute();
$result = $stmt_check->get_result();
if ($result->num_rows > 0) {
    echo json_encode(["mensagem" => "Telefone já cadastrado."]);
    exit();
}

// Registrar o usuário
$stmt = $conn->prepare("INSERT INTO usuarios (nome, telefone, senha, codigo_indicacao) VALUES (?, ?, ?, ?)");
$stmt->bind_param("ssss", $nome, $telefone, $senha, $codigo);
if ($stmt->execute()) {
    // Se houver indicação, adicionar à equipe do patrocinador
    if (!empty($indicacao)) {
        $stmt2 = $conn->prepare("INSERT INTO indicacoes (codigo_patrocinador, indicado) VALUES (?, ?)");
        $stmt2->bind_param("ss", $indicacao, $telefone);
        $stmt2->execute();
    }

    echo json_encode(["mensagem" => "Cadastro realizado com sucesso! Seu código de indicação é $codigo."]);
} else {
    echo json_encode(["mensagem" => "Erro ao registrar o usuário."]);
}

$conn->close();
?>