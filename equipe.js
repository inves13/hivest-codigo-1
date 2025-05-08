// Importa os módulos do Firebase (certifique-se de que está usando os scripts corretos no HTML)
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import { getDatabase, ref, query, orderByChild, equalTo, get } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-database.js";

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
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Função para carregar os dados da equipe
function carregarEquipe() {
  const meuCodigo = localStorage.getItem("codigoUsuario");

  if (!meuCodigo) {
    window.location.href = "index.html";
    return;
  }

  const dbRef = ref(db, 'usuarios');
  const conviteQuery = query(dbRef, orderByChild('codigoIndicacao'), equalTo(meuCodigo));

  get(conviteQuery)
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

      const lista = document.getElementById("invited-users");
      lista.innerHTML = "";

      snapshot.forEach(child => {
        const dados = child.val();
        totalMembros++;

        const investimento = parseFloat(dados.investimentos?.valor || 0);
        const comissao = investimento * 0.35;
        totalComissao += comissao;

        const nivel = dados.nivel || 1;
        if (nivel === 1) {
          lv1.qtd++;
          lv1.bonus += comissao;
        } else if (nivel === 2) {
          lv2.qtd++;
          lv2.bonus += comissao;
        } else if (nivel === 3) {
          lv3.qtd++;
          lv3.bonus += comissao;
        }

        const li = document.createElement("li");
        li.textContent = `${dados.nome || "Sem nome"} - Investiu R$ ${investimento.toFixed(2)} - Você ganhou R$ ${comissao.toFixed(2)}`;
        lista.appendChild(li);
      });

      document.getElementById("lv1-qtd").textContent = `${lv1.qtd} Quantidade efetiva`;
      document.getElementById("lv1-bonus").textContent = `R$ ${lv1.bonus.toFixed(2).replace('.', ',')} Bônus`;
      document.getElementById("lv2-qtd").textContent = `${lv2.qtd} Quantidade efetiva`;
      document.getElementById("lv2-bonus").textContent = `R$ ${lv2.bonus.toFixed(2).replace('.', ',')} Bônus`;
      document.getElementById("lv3-qtd").textContent = `${lv3.qtd} Quantidade efetiva`;
      document.getElementById("lv3-bonus").textContent = `R$ ${lv3.bonus.toFixed(2).replace('.', ',')} Bônus`;

      document.getElementById("total-users").textContent = `${totalMembros} usuários convidados`;
      document.getElementById("total-bonus").textContent = `R$ ${totalComissao.toFixed(2).replace('.', ',')} ganhos totais`;
    })
    .catch(error => {
      console.error("Erro ao recuperar dados da equipe:", error);
      alert("Erro ao recuperar dados da equipe: " + error.message);
    });
}

carregarEquipe();
