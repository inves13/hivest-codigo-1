import { getDatabase, ref, set, get, update } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js';
import { getAuth, createUserWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js';

const db = getDatabase();
const auth = getAuth();

document.getElementById("botao-cadastro").addEventListener("click", function() {
  let nome = document.getElementById("nome").value;
  let telefone = document.getElementById("telefone").value;
  let senha = document.getElementById("senha").value;
  let confirmarSenha = document.getElementById("confirmarSenha").value;
  let codigoConvite = document.getElementById("codigoConvite").value; // Recebe o código de indicação

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
      const user = userCredential.user;

      // Pegar o último código gerado
      const codigoRef = ref(db, 'ultimo_codigo');
      get(codigoRef).then((snapshot) => {
        let novoCodigo = 1;
        if (snapshot.exists()) {
          novoCodigo = snapshot.val() + 1; // Incrementa o último código
        }

        // Salva os dados do usuário com o código gerado
        set(ref(db, "usuarios/" + user.uid), {
          nome: nome,
          telefone: telefone,
          senha: senha,
          saldo: 0,
          codigoIndicacao: novoCodigo, // Atribui o código de indicação gerado
          codigoConvite: codigoConvite || null, // Associa o código de convite (caso exista)
          nivel: 1 // Atribui nível inicial ao usuário
        }).then(() => {
          // Atualiza o último código no banco de dados
          update(ref(db), { ultimo_codigo: novoCodigo });

          alert("Cadastro realizado com sucesso!");
          window.location.href = "login.html"; // Redireciona para a página de login
        }).catch((error) => {
          console.error("Erro ao salvar dados no Firebase:", error);
          alert("Erro ao salvar dados no Firebase. Tente novamente.");
        });
      });
    })
    .catch((error) => {
      console.error("Erro ao cadastrar usuário:", error);
      alert("Erro ao criar conta. Tente novamente.");
    });
});
