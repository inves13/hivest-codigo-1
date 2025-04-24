import { auth, database, ref, get, child } from "./firebase-config";

// Função para carregar os dados do usuário logado e sua equipe
function carregarEquipe() {
  const usuarioLogado = auth.currentUser;

  if (usuarioLogado) {
    const telefoneLogado = usuarioLogado.phoneNumber;

    // Buscar os dados do usuário logado
    get(ref(database, "usuarios/" + telefoneLogado)).then((snapshot) => {
      if (snapshot.exists()) {
        const usuario = snapshot.val();

        // Exibir dados do usuário logado
        document.getElementById("nome-usuario").textContent = usuario.nome;
        document.getElementById("codigo-usuario").textContent = usuario.codigo;

        // Buscar usuários da equipe (indicação)
        buscarEquipe(usuario.codigo);
        buscarComissoes(usuario.codigo);
      } else {
        console.log("Usuário não encontrado.");
      }
    }).catch((error) => {
      console.error("Erro ao buscar dados do usuário logado: ", error.message);
    });
  } else {
    alert("Usuário não logado.");
  }
}

// Função para buscar os usuários indicados
function buscarEquipe(codigoIndicado) {
  get(ref(database, "usuarios")).then((snapshot) => {
    const equipeList = document.getElementById("equipe-list");
    equipeList.innerHTML = ""; // Limpa a lista de membros

    let count = 0;

    snapshot.forEach((childSnapshot) => {
      const user = childSnapshot.val();

      if (user.codigoIndicado === codigoIndicado) {
        count++;
        const nome = user.nome;
        const telefone = user.telefone;
        const investimento = user.investimento || 0;
        const li = document.createElement("li");
        li.textContent = `${nome} - Investiu R$ ${investimento.toFixed(2)}`;
        equipeList.appendChild(li);
      }
    });

    document.getElementById("total-indicados").textContent = `Total de indicados: ${count}`;
  }).catch((error) => {
    console.error("Erro ao buscar equipe: ", error.message);
  });
}

// Função para calcular e exibir as comissões ganhas
function buscarComissoes(codigoIndicado) {
  get(ref(database, "usuarios")).then((snapshot) => {
    let comissaoTotal = 0;

    snapshot.forEach((childSnapshot) => {
      const user = childSnapshot.val();

      if (user.codigoIndicado === codigoIndicado) {
        const investimento = user.investimento || 0;
        comissaoTotal += investimento * 0.35; // Comissão de 35%
      }
    });

    // Exibe o total de comissões
    document.getElementById("comissao-total").textContent = `Comissões ganhas: R$ ${comissaoTotal.toFixed(2)}`;
  }).catch((error) => {
    console.error("Erro ao buscar comissões: ", error.message);
  });
}

// Função de login (para garantir que o usuário está logado antes de carregar os dados)
onAuthStateChanged(auth, (user) => {
  if (user) {
    carregarEquipe();
  } else {
    alert("Usuário não está logado.");
  }
});
