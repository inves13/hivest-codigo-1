// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCKSKnVC8dNWmiMrNr1j4rMLfQTlOrqzVM",
  authDomain: "hinvest-f4354.firebaseapp.com",
  databaseURL: "https://hinvest-f4354-default-rtdb.firebaseio.com",
  projectId: "hinvest-f4354",
  storageBucket: "hinvest-f4354.appspot.com",
  messagingSenderId: "646397677016",
  appId: "1:646397677016:web:f05ca27a38439568bff6ad"
};

// Inicializa o Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.database(app);
const dbRef = db.ref('usuarios');

// Função para carregar os dados da equipe
function carregarEquipe() {
  // Recupera o código do usuário logado
  const meuCodigo = localStorage.getItem("codigoUsuario");

  if (!meuCodigo) {
    window.location.href = "index.html"; // Redireciona se não houver código de convite
  }

  // Consulta para pegar os dados dos usuários que têm o código de convite igual ao do usuário logado
  const conviteQuery = dbRef.orderByChild('codigoIndicacao').equalTo(meuCodigo);

  conviteQuery
    .get()  // Recupera os dados da consulta
    .then(snapshot => {
      if (!snapshot.exists()) {
        console.log("Nenhum dado encontrado para este código de convite.");
        return;
      }

      let totalMembros = 0;
      let totalComissao = 0;
      let lv1 = { qtd: 0, bonus: 0 };
      let lv2 = { qtd: 0, bonus: 0 };
      let lv3 = { qtd: 0, bonus: 0 };

      // Limpa a lista de membros antes de preencher novamente
      const lista = document.getElementById("invited-users");
      lista.innerHTML = "";

      snapshot.forEach(child => {
        const dados = child.val();  // Recupera os dados do usuário
        console.log("Dados do usuário:", dados);  // Verificando o retorno de cada usuário

        totalMembros++;  // Incrementa o total de membros

        // Pega o valor do investimento do usuário, caso tenha
        const investimento = parseFloat(dados.investimentos?.valor || 0);
        const comissao = investimento * 0.35;  // Calcula a comissão (35% do valor investido)
        totalComissao += comissao;  // Incrementa o total de comissão

        // Determina o nível do usuário
        const nivel = dados.nivel || 1;
        if (nivel === 1) {
          lv1.qtd++;  // Incrementa a quantidade de membros no nível 1
          lv1.bonus += comissao;  // Incrementa o bônus do nível 1
        } else if (nivel === 2) {
          lv2.qtd++;  // Incrementa a quantidade de membros no nível 2
          lv2.bonus += comissao;  // Incrementa o bônus do nível 2
        } else if (nivel === 3) {
          lv3.qtd++;  // Incrementa a quantidade de membros no nível 3
          lv3.bonus += comissao;  // Incrementa o bônus do nível 3
        }

        // Criação do item de lista para cada usuário
        const li = document.createElement("li");
        li.textContent = `${dados.nome || "Sem nome"} - Investiu R$ ${investimento.toFixed(2)} - Você ganhou R$ ${comissao.toFixed(2)}`;
        lista.appendChild(li);
      });

      // Atualiza os totais na interface
      document.getElementById("lv1-qtd").textContent = `${lv1.qtd} Quantidade efetiva`;
      document.getElementById("lv1-bonus").textContent = `R$ ${lv1.bonus.toFixed(2).replace('.', ',')} Bônus`;
      document.getElementById("lv2-qtd").textContent = `${lv2.qtd} Quantidade efetiva`;
      document.getElementById("lv2-bonus").textContent = `R$ ${lv2.bonus.toFixed(2).replace('.', ',')} Bônus`;
      document.getElementById("lv3-qtd").textContent = `${lv3.qtd} Quantidade efetiva`;
      document.getElementById("lv3-bonus").textContent = `R$ ${lv3.bonus.toFixed(2).replace('.', ',')} Bônus`;

      // Exibe o número total de membros e o bônus total
      document.getElementById("total-users").textContent = `${totalMembros} usuários convidados`;
      document.getElementById("total-bonus").textContent = `R$ ${totalComissao.toFixed(2).replace('.', ',')} ganhos totais`;
    })
    .catch(error => {
      console.error("Erro ao recuperar dados da equipe:", error);
      alert("Erro ao recuperar dados da equipe: " + error.message);
    });
}

// Chama a função para carregar os dados da equipe
carregarEquipe();
