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
      // Função que executa quando o usuário está logado
      loadInviteInfo(user.uid);
    } else {
      console.log("Usuário não autenticado");
      // Redirecionar ou pedir para o usuário se logar
    }
  });
};

// Função para carregar as informações de convite
const loadInviteInfo = (userId) => {
  // Referência ao banco de dados para pegar as informações de usuários
  const userRef = firebase.database().ref('usuarios/' + userId);
  
  userRef.once('value', (snapshot) => {
    if (snapshot.exists()) {
      const userData = snapshot.val();
      console.log("Dados do Usuário", userData);
      
      // Exibindo o código do usuário e o código do indicado
      const codigoIndicacao = userData.codigoIndicacao;
      console.log(`Código do Usuário: ${userData.codigo}`);
      console.log(`Código de Indicação: ${codigoIndicacao}`);
      
      // Agora, vamos buscar todos os usuários que têm esse código de indicação
      searchUsersByCodigoIndicacao(codigoIndicacao);
    } else {
      console.log("Usuário não encontrado");
    }
  });
};

// Função para buscar todos os usuários com o código de indicação
const searchUsersByCodigoIndicacao = (codigoIndicacao) => {
  const usuariosRef = firebase.database().ref('usuarios');
  
  usuariosRef.orderByChild('codigoIndicacao').equalTo(codigoIndicacao).once('value', (snapshot) => {
    if (snapshot.exists()) {
      const indicadosData = snapshot.val();
      console.log(`Usuários indicados com o código ${codigoIndicacao}:`, indicadosData);
      
      // Exibindo os dados dos indicados
      for (let userId in indicadosData) {
        const user = indicadosData[userId];
        console.log(`Nome: ${user.nome}, Saldo: ${user.saldo}, Código de Indicação: ${user.codigoIndicacao}`);

        // Aqui, adicione os usuários à interface da página
        const invitedList = document.getElementById('invited-users');
        const li = document.createElement('li');
        li.textContent = `${user.nome} - Código: ${user.codigoIndicacao} - Saldo: R$ ${user.saldo}`;
        invitedList.appendChild(li);
      }
    } else {
      console.log("Nenhum usuário encontrado com este código de indicação");
    }
  });
};

// Função para registrar um novo usuário (como parte do fluxo de cadastro)
const registerUser = (nome, telefone, senha) => {
  firebase.auth().createUserWithEmailAndPassword(telefone + '@domain.com', senha)
    .then((userCredential) => {
      const user = userCredential.user;
      
      // Armazenar dados do usuário no banco de dados
      firebase.database().ref('usuarios/' + user.uid).set({
        nome: nome,
        telefone: telefone,
        codigo: user.uid,  // Usando o UID como código do usuário
        saldo: 20,
        saldoConta: 10,
        codigoIndicacao: "",  // Inicialmente vazio, pode ser atribuído posteriormente
        timestamp: Date.now(),
        ultimoCheckin: "",
      }).then(() => {
        console.log("Usuário registrado com sucesso!");
      }).catch((error) => {
        console.error("Erro ao registrar usuário", error);
      });
    })
    .catch((error) => {
      console.error("Erro ao criar usuário", error);
    });
};

// Função para adicionar saldo ao usuário (recarga)
const addSaldo = (userId, amount) => {
  const userRef = firebase.database().ref('usuarios/' + userId);
  
  userRef.once('value', (snapshot) => {
    if (snapshot.exists()) {
      const userData = snapshot.val();
      const newSaldo = userData.saldo + amount;
      
      // Atualizando o saldo
      userRef.update({ saldo: newSaldo })
        .then(() => {
          console.log(`Saldo atualizado para: ${newSaldo}`);
        })
        .catch((error) => {
          console.error("Erro ao atualizar saldo", error);
        });
    }
  });
};

// Exemplo de uso
checkAuth(); // Verifica se o usuário está logado

// Simulando uma recarga de saldo
// addSaldo('7582713751', 100);  // Adicionando 100 ao saldo do usuário com ID 7582713751
