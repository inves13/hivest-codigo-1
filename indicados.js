// Configuração Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCKSKnVC8dNWmiMrNr1j4rMLfQTlOrqzVM",
  authDomain: "hinvest-f4354.firebaseapp.com",
  databaseURL: "https://hinvest-f4354-default-rtdb.firebaseio.com",
  projectId: "hinvest-f4354",
  storageBucket: "hinvest-f4354.appspot.com",
  messagingSenderId: "646397677016",
  appId: "1:646397677016:web:f05ca27a38439568bff6ad"
};
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Função para obter o código de convite da URL
function getCodigoFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('codigo');
}

// Função para registrar um novo usuário
function cadastrarUsuario(nome, telefone, codigoIndicado) {
  const novoUsuario = {
    nome: nome,
    telefone: telefone,
    codigo: gerarCodigoUnico(),
    codigoIndicado: codigoIndicado || null, // Código indicado pode ser nulo se não houver
    investimento: 0, // Investimento inicial pode ser 0 ou ajustado conforme necessário
    usuarioConvidado: codigoIndicado ? "Usuário Indicado" : "Não aplicável"
  };
  
  // Adicionar usuário ao banco de dados
  database.ref("usuarios/" + telefone).set(novoUsuario)
    .then(() => {
      alert("Cadastro realizado com sucesso!");
      window.location.href = "/pagina-principal"; // Redirecionar para a página principal após o cadastro
    })
    .catch((error) => {
      console.error("Erro ao cadastrar usuário: ", error.message);
      alert("Erro ao cadastrar, tente novamente.");
    });
}

// Função para gerar um código único para o usuário
function gerarCodigoUnico() {
  return Math.random().toString(36).substr(2, 9); // Gera um código aleatório de 9 caracteres
}

// Função para registrar um novo usuário com código de convite
function registrarComCodigo() {
  const nome = document.getElementById("nome").value;
  const telefone = document.getElementById("telefone").value;
  const codigoIndicado = getCodigoFromURL();
  
  if (!nome || !telefone) {
    alert("Por favor, preencha todos os campos!");
    return;
  }
  
  cadastrarUsuario(nome, telefone, codigoIndicado);
}

// Exibir o código de indicação na página de convite
function exibirCodigoDeConvite() {
  const telefoneLogado = localStorage.getItem("telefoneLogado");
  
  if (telefoneLogado) {
    database.ref("usuarios/" + telefoneLogado).once("value")
      .then(snapshot => {
        if (snapshot.exists()) {
          const usuario = snapshot.val();
          const codigoDeConvite = usuario.codigo;
          document.getElementById("codigo-de-convite").textContent = codigoDeConvite;
        }
      })
      .catch(error => {
        console.error("Erro ao obter o código de convite: ", error.message);
      });
  } else {
    alert("Usuário não está logado.");
  }
}

// Inicializa a exibição do código de convite
window.onload = function() {
  exibirCodigoDeConvite();
}
