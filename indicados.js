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

// Função para obter código da URL
function getCodigoFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('codigo');
}

// Gerar código único
function gerarCodigoUnico() {
  return Math.random().toString(36).substr(2, 9);
}

// Função para cadastrar usuário
function cadastrarUsuario(nome, telefone, codigoIndicacao) {
  const novoCodigo = gerarCodigoUnico();
  const usuario = {
    nome: nome,
    telefone: telefone,
    codigoIndicacao: novoCodigo,  // código próprio do usuário
    codigoIndicado: codigoIndicacao || "",  // código de quem indicou (se houver)
    comissao1nivel: 0,
    saldodaConta: 0,
    investimento: 0
  };

  // Cadastrar no Firebase Auth
  firebase.auth().createUserWithEmailAndPassword(`${telefone}@email.com`, "senhaPadrao123")
    .then(cred => {
      const uid = cred.user.uid;
      database.ref("usuarios/" + uid).set(usuario).then(() => {
        localStorage.setItem("telefoneLogado", uid);

        if (codigoIndicacao) {
          // Adicionar o novo usuário na equipe de quem indicou
          database.ref("Minhaequipe/" + codigoIndicacao + "/" + uid).set({
            nome: nome,
            nivel: 1,
            dataCadastro: new Date().toLocaleDateString()
          });

          // Incrementar número de indicados
          const numIndicadosRef = database.ref("Númerodepessoas0/" + codigoIndicacao + "/quantidade");
          numIndicadosRef.transaction(qtd => (qtd || 0) + 1);
        }

        alert("Cadastro realizado com sucesso!");
        window.location.href = "H.html";
      });
    })
    .catch(error => {
      console.error("Erro ao cadastrar: ", error.message);
      alert("Erro: " + error.message);
    });
}

// Enviar cadastro ao clicar no botão
function registrarComCodigo() {
  const nome = document.getElementById("nome").value;
  const telefone = document.getElementById("telefone").value;
  const codigoIndicacao = getCodigoFromURL();

  if (!nome || !telefone) {
    alert("Preencha todos os campos!");
    return;
  }

  cadastrarUsuario(nome, telefone, codigoIndicacao);
}

// Mostrar código de convite na tela
function exibirCodigoDeConvite() {
  const telefoneLogado = localStorage.getItem("telefoneLogado");
  if (telefoneLogado) {
    database.ref("usuarios/" + telefoneLogado).once("value").then(snapshot => {
      if (snapshot.exists()) {
        const usuario = snapshot.val();
        document.getElementById("codigo-de-convite").textContent = usuario.codigoIndicacao || "Sem código";
      }
    }).catch(error => {
      console.error("Erro ao carregar código: ", error.message);
    });
  }
}

// Inicia exibição do código ao carregar página
window.onload = function () {
  exibirCodigoDeConvite();
}
