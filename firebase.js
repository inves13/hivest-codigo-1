import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js';
import { getDatabase, ref, get, set } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js';

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

export { obterDadosUsuario, salvarCodigoConvite };