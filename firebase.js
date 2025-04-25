import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js';
import { getDatabase, ref, get, set, child, update } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js';

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "SEU_AUTH_DOMAIN",
  databaseURL: "SEU_DATABASE_URL",
  projectId: "SEU_PROJECT_ID",
  storageBucket: "SEU_STORAGE_BUCKET",
  messagingSenderId: "SEU_MESSAGING_SENDER_ID",
  appId: "SEU_APP_ID"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Obtém uma referência ao banco de dados
const database = getDatabase(app);
const auth = getAuth();

// Função para obter dados do usuário
function obterDadosUsuario(telefoneUsuario, callback) {
  const usuarioRef = ref(database, "usuarios/" + telefoneUsuario);
  
  get(usuarioRef).then((snapshot) => {
    if (snapshot.exists()) {
      callback(snapshot.val());
    } else {
      console.warn("Usuário não encontrado no banco de dados!");
    }
  }).catch((error) => {
    console.error("Erro ao buscar dados do usuário:", error);
  });
}

// Função para salvar o código de convite
function salvarCodigoConvite(telefone, codigo) {
  const userRef = ref(database, 'usuarios/' + telefone);
  set(userRef, { codigo_convite: codigo })
    .then(() => {
      console.log("Código de convite salvo com sucesso!");
    })
    .catch((error) => {
      console.error("Erro ao salvar código:", error);
    });
}

// Função para criar um novo usuário
function cadastrarUsuario(telefone, senha, codigoConvite) {
  createUserWithEmailAndPassword(auth, telefone + "@email.com", senha)
    .then((userCredential) => {
      const user = userCredential.user;
      
      // Agora salva os dados do usuário no banco de dados
      const usuarioRef = ref(database, "usuarios/" + telefone);
      set(usuarioRef, {
        nome: telefone, // Adapte conforme necessário
        codigo_convite: codigoConvite,
        saldo: 0
      })
      .then(() => {
        console.log("Usuário cadastrado com sucesso!");
      })
      .catch((error) => {
        console.error("Erro ao salvar dados do usuário:", error);
      });
    })
    .catch((error) => {
      console.error("Erro ao criar usuário:", error);
    });
}

// Função para atualizar dados de um usuário (exemplo: adicionar saldo)
function atualizarDadosUsuario(telefone, novosDados) {
  const usuarioRef = ref(database, "usuarios/" + telefone);
  update(usuarioRef, novosDados)
    .then(() => {
      console.log("Dados do usuário atualizados com sucesso!");
    })
    .catch((error) => {
      console.error("Erro ao atualizar dados:", error);
    });
}

export { obterDadosUsuario, salvarCodigoConvite, cadastrarUsuario, atualizarDadosUsuario };
