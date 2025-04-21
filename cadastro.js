// Importando os módulos necessários do Firebase
import { getDatabase, ref, set } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js';
import { getAuth, createUserWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js';

// Obtendo as instâncias do Firebase
const db = getDatabase();
const auth = getAuth();

// Adicionando o evento de cadastro
document.getElementById("botao-cadastro").addEventListener("click", function() {
  let nome = document.getElementById("nome").value;
  let telefone = document.getElementById("telefone").value;
  let senha = document.getElementById("senha").value;
  let confirmarSenha = document.getElementById("confirmarSenha").value;
  let codigoIndicacao = document.getElementById("codigoIndicacao").value || null; // Aqui pega o código de indicação

  // Verificação dos campos obrigatórios
  if (nome === "" || telefone === "" || senha === "" || confirmarSenha === "") {
    alert("Preencha todos os campos!");
    return;
  }
  
  // Verificando se a senha e a confirmação da senha são iguais
  if (senha !== confirmarSenha) {
    alert("As senhas não coincidem!");
    return;
  }

  // Criando o usuário no Firebase Auth (usando o telefone como email temporário)
  createUserWithEmailAndPassword(auth, telefone + "@example.com", senha)
    .then((userCredential) => {
      // Usuário criado com sucesso
      const user = userCredential.user;
      
      // Agora salva os dados do usuário no Realtime Database
      set(ref(db, "usuarios/" + user.uid), {
        nome: nome,
        telefone: telefone,
        senha: senha,
        saldo: 0,
        codigoIndicacao: codigoIndicacao, // Salva o código de indicação
        codigoGerado: Math.floor(Math.random() * 10000), // Gerar código único para o usuário
      }).then(() => {
        alert("Cadastro realizado com sucesso!");
        window.location.href = "login.html"; // Redireciona para a página de login
      }).catch((error) => {
        console.error("Erro ao salvar dados no Firebase:", error);
        alert("Erro ao salvar dados no Firebase. Tente novamente.");
      });
    })
    .catch((error) => {
      console.error("Erro ao cadastrar usuário:", error);
      alert("Erro ao criar conta. Tente novamente.");
    });
});
