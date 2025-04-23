// Inicializando Firebase
import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';

// Configuração do Firebase (substitua pela sua configuração do Firebase)
const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "SEU_AUTH_DOMAIN",
  databaseURL: "https://hinvest-f4354-default-rtdb.firebaseio.com/",
  projectId: "SEU_PROJECT_ID",
  storageBucket: "SEU_STORAGE_BUCKET",
  messagingSenderId: "SEU_MESSAGING_SENDER_ID",
  appId: "SEU_APP_ID"
};

// Inicialize o Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app(); // Se já tiver uma instância inicializada
}

// Função para verificar se o usuário está autenticado
const checkAuth = () => {
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      console.log("Usuário autenticado", user.uid);
      // Carregar informações do usuário e exibir código de indicação
      loadInviteInfo(user.uid);
    } else {
      console.log("Usuário não autenticado");
      // Redirecionar ou pedir para o usuário se logar
    }
  });
};

// Função para carregar informações do usuário autenticado
const loadInviteInfo = (userId) => {
  // Referência ao banco de dados para pegar as informações de usuários
  const userRef = firebase.database().ref('usuarios/' + userId);
  
  userRef.once('value', (snapshot) => {
    if (snapshot.exists()) {
      const userData = snapshot.val();
      console.log("Dados do Usuário", userData);
      
      // Exibindo o código de convite
      const userCode = userData.codigo;
      document.getElementById('user-code').textContent = userCode;
      const inviteLink = `https://inves13.github.io/hivest-codigo-${userCode}/?codigo=${userCode}`;
      document.getElementById('invite-link').textContent = inviteLink;

      // Agora, vamos buscar todos os usuários que têm esse código de indicação
      searchUsersByCodigoIndicacao(userData.codigoIndicacao);
    } else {
      console.log("Usuário não encontrado");
    }
  });
};

// Função para buscar todos os usuários com o código de indicação
const searchUsersByCodigoIndicacao = (codigoIndicacao) => {
  const usuariosRef = firebase.database().ref('usuarios');
  
  usuariosRef.orderByChild('codigoIndicacao').equalTo(codigoIndicacao).once('value', (snapshot) => {
    const invitedList = document.getElementById('invited-users');
    invitedList.innerHTML = ""; // Limpa a lista antes de adicionar os novos itens

    if (snapshot.exists()) {
      const indicadosData = snapshot.val();
      console.log(`Usuários indicados com o código ${codigoIndicacao}:`, indicadosData);
      
      // Exibindo os dados dos indicados
      for (let userId in indicadosData) {
        const user = indicadosData[userId];
        const li = document.createElement('li');
        li.textContent = `Nome: ${user.nome} - Código: ${user.codigoIndicacao} - Saldo: R$ ${user.saldo}`;
        invitedList.appendChild(li);
      }
    } else {
      // Exibe a mensagem "Nenhum usuário convidado" caso não tenha indicado ninguém
      const li = document.createElement('li');
      li.textContent = "Nenhum usuário convidado ainda.";
      invitedList.appendChild(li);
    }
  });
};

// Função para copiar o link de convite
const copyLink = () => {
  const inviteLink = document.getElementById('invite-link').textContent;
  navigator.clipboard.writeText(inviteLink).then(() => {
    alert('Link copiado para a área de transferência!');
  });
};

// Exemplo de uso
checkAuth(); // Verifica se o usuário está logado
