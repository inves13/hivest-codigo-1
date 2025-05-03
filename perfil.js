// Importando os módulos necessários do Firebase
import { getAuth, onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js';
import { getDatabase, ref, get } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js';

// Obtendo a instância do Firebase Auth
const auth = getAuth();

// Função para carregar o ID ou telefone do usuário após login
function carregarUsuario() {
    const user = auth.currentUser;  // Pega o usuário autenticado
    if (user) {
        // A partir do Firebase, você pode pegar o telefone ou o ID do usuário
        const usuarioId = user.uid;  // UID único do usuário no Firebase
        document.getElementById("usuarioId").textContent = "ID: " + usuarioId;

        // Referência ao usuário no Firebase para pegar dados adicionais
        const userRef = ref(getDatabase(), 'usuarios/' + usuarioId);
        get(userRef).then((snapshot) => {
            const userData = snapshot.val();
            if (userData) {
                // Carregar o nome completo e outros dados do usuário
                const nomeCompleto = userData.nome_completo ? userData.nome_completo : "Nome não disponível";
                document.getElementById("nome_completo").value = nomeCompleto;

                // Carregar sobrenome e separar do nome completo
                const sobrenome = nomeCompleto.split(' ').slice(-1).join(' ');
                document.getElementById("sobrenome").value = sobrenome;

                // Carregar telefone
                const telefone = userData.telefone ? userData.telefone : "Telefone não encontrado";
                document.getElementById("telefone").textContent = "Telefone: " + telefone;

                // Carregar saldo
                let saldo = userData.saldo ? userData.saldo : 0;
                document.getElementById("saldo").textContent = "R$ " + parseFloat(saldo).toFixed(2);

            } else {
                console.log("Dados do usuário não encontrados.");
            }
        }).catch((error) => {
            console.error("Erro ao carregar dados do usuário:", error);
        });
    } else {
        document.getElementById("usuarioId").textContent = "Usuário não logado";
        document.getElementById("telefone").textContent = "Telefone não disponível";
        document.getElementById("saldo").textContent = "R$ 0.00"; // Caso o usuário não esteja logado
    }
}

// Função de logout (remove o usuário autenticado)
function logout() {
    signOut(auth).then(() => {
        alert("Você foi deslogado!");
        // Redirecionar para a página de login
        window.location.href = 'login.html';
    }).catch((error) => {
        alert("Erro ao deslogar: " + error.message);
    });
}

// Função para redirecionar para outra página
function irPara(pagina) {
    window.location.href = pagina;
}

// Verifica se o usuário está logado e chama as funções de carregar dados
onAuthStateChanged(auth, (user) => {
    if (user) {
        // Usuário logado, carrega as informações
        carregarUsuario();
    } else {
        // Usuário não logado, redireciona para a página de login
        window.location.href = 'login.html';
    }
});
