// Referência ao banco de dados
const db = firebase.database();

// Declaração das variáveis para armazenar saques e usuários
let saques = [];
let usuarios = [];

// Função para carregar os usuários do Firebase
function carregarUsuarios() {
    db.ref('usuarios').once('value').then(snapshot => {
        usuarios = [];
        snapshot.forEach(childSnapshot => {
            const usuario = childSnapshot.val();
            usuarios.push(usuario);
        });
        carregarRecargas(); // Carregar a tabela de recargas
        carregarSaques();   // Carregar a tabela de saques
    });
}

// Função para cadastrar um novo saque
function cadastrarSaque() {
    let telefoneSaque = prompt("Digite o número de telefone do saque:");
    let nomeTitular = prompt("Digite o nome do titular:");
    let chavePIX = prompt("Digite a chave PIX do titular:");
    let valorSaque = parseFloat(prompt("Digite o valor do saque:"));

    // Verifica se o valor do saque é válido
    if (isNaN(valorSaque) || valorSaque <= 0) {
        alert("Valor do saque inválido.");
        return;
    }

    // Verificar se o usuário tem saldo suficiente
    let usuario = usuarios.find(u => u.telefone === telefoneSaque);
    if (!usuario) {
        alert("Usuário não encontrado.");
        return;
    }

    if (usuario.saldo < valorSaque) {
        alert("Saldo insuficiente para realizar o saque.");
        return;
    }

    // Adicionar o novo saque ao Firebase
    db.ref('saques').push({
        telefone: telefoneSaque,
        nome: nomeTitular,
        chavePIX: chavePIX,
        valor: valorSaque,
        aprovado: false
    }).then(() => {
        carregarSaques(); // Atualiza a tabela de saques
    }).catch(error => {
        alert("Erro ao cadastrar saque: " + error.message);
    });
}

// Atualiza a tabela de saques na interface
function carregarSaques() {
    let saquesTabela = document.getElementById("saques");
    saquesTabela.innerHTML = ""; // Limpa os saques anteriores

    db.ref('saques').once('value', snapshot => {
        snapshot.forEach(childSnapshot => {
            let saque = childSnapshot.val();
            let tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${saque.telefone}</td>
                <td>${saque.nome}</td>
                <td>${saque.chavePIX}</td>
                <td>R$ ${saque.valor.toFixed(2)}</td>
                <td>
                    <button class="botao" onclick="aprovarSaque('${childSnapshot.key}')">Aprovar</button>
                    <button class="botao" onclick="negarSaque('${childSnapshot.key}')">Negar</button>
                </td>
            `;
            saquesTabela.appendChild(tr);
        });
    });
}

// Função para aprovar saque
function aprovarSaque(saqueId) {
    db.ref('saques/' + saqueId).once('value').then(snapshot => {
        let saque = snapshot.val();
        if (saque) {
            // Atualiza o status do saque para aprovado
            db.ref('saques/' + saqueId).update({ aprovado: true }).then(() => {
                let usuario = usuarios.find(u => u.telefone === saque.telefone);
                if (usuario) {
                    usuario.saldo -= saque.valor; // Deduz o valor do saque do saldo do usuário
                    db.ref('usuarios/' + usuario.idUsuario).update({ saldo: usuario.saldo });
                    alert(`Saque aprovado para o telefone: ${saque.telefone}`);
                    carregarSaques(); // Atualiza a tabela de saques
                }
            }).catch(error => {
                alert("Erro ao aprovar saque: " + error.message);
            });
        }
    });
}

// Função para negar saque
function negarSaque(saqueId) {
    db.ref('saques/' + saqueId).once('value').then(snapshot => {
        let saque = snapshot.val();
        if (saque) {
            db.ref('saques/' + saqueId).update({ aprovado: false }).then(() => {
                alert(`Saque negado para o telefone: ${saque.telefone}`);
                carregarSaques(); // Atualiza a tabela de saques
            }).catch(error => {
                alert("Erro ao negar saque: " + error.message);
            });
        }
    });
}

// Função para cadastrar um novo usuário
function cadastrarUsuario() {
    let telefoneCadastro = document.getElementById("telefoneCadastro").value;
    if (!telefoneCadastro) {
        alert("Digite um número de telefone válido");
        return;
    }

    // Gerar um novo ID e adicionar o novo usuário ao Firebase
    let novoId = db.ref('usuarios').push().key; // Gera um ID único
    db.ref('usuarios/' + novoId).set({
        telefone: telefoneCadastro,
        idUsuario: novoId,
        saldo: 0,
        recarga: 0
    }).then(() => {
        document.getElementById("telefoneCadastro").value = "";
        alert(`Usuário cadastrado com sucesso! Telefone: ${telefoneCadastro}`);
        
        // Atualizar as tabelas de recargas e saques
        carregarRecargas();
        carregarSaques();
    }).catch(error => {
        alert("Erro ao cadastrar usuário: " + error.message);
    });
}

// Função para carregar a tabela de recargas
function carregarRecargas() {
    let recargasTabela = document.getElementById("recargas");
    recargasTabela.innerHTML = ""; // Limpa as recargas anteriores

    usuarios.forEach(usuario => {
        let tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${usuario.telefone}</td>
            <td>R$ ${usuario.saldo.toFixed(2)}</td>
            <td>R$ ${usuario.recarga.toFixed(2)}</td>
        `;
        recargasTabela.appendChild(tr);
    });
}

// Inicializar as tabelas
carregarUsuarios();
