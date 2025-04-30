import { auth, database, ref, get, onAuthStateChanged } from "./firebase-config.js";

// Função para exibir os dados da equipe
function exibirEquipe(usuario) {
  const uid = usuario.uid;
  const db = database;

  // Busca o código de indicação do usuário logado
  get(ref(db, "usuarios/" + uid + "/codigoIndicacao"))
    .then(snap => {
      const meuCodigo = snap.val();
      if (!meuCodigo) {
        alert("Código de indicação não encontrado.");
        return;
      }

      console.log("Código de indicação encontrado:", meuCodigo);

      // Busca todos os usuários que se cadastraram com esse código de convite
      get(ref(db, "usuarios").orderByChild("codigoIndicacao").equalTo(meuCodigo))
        .then(snapshot => {
          let totalMembros = 0;
          let totalComissao = 0;
          let lv1 = { qtd: 0, bonus: 0 };
          let lv2 = { qtd: 0, bonus: 0 };
          let lv3 = { qtd: 0, bonus: 0 };

          const lista = document.getElementById("invited-users");
          lista.innerHTML = ""; // Limpa a lista anterior

          snapshot.forEach(child => {
            const dados = child.val();
            totalMembros++;

            // Pega o valor de investimento do usuário
            const investimento = parseFloat(dados.investimentos?.valor || 0);

            // A comissão é calculada como 35% do investimento
            const comissao = investimento * 0.35;
            totalComissao += comissao;

            // Determina o nível do usuário
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

            // Criação do item na lista de membros
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

          document.getElementById("total-users").textContent = `${totalMembros} usuários convidados`;
          document.getElementById("total-bonus").textContent = `R$ ${totalComissao.toFixed(2).replace('.', ',')} ganhos totais`;
        })
        .catch(error => {
          console.error("Erro ao recuperar dados da equipe:", error);
          alert("Erro ao recuperar dados da equipe: " + error.message);
        });
    })
    .catch(error => {
      console.error("Erro ao buscar seu código de indicação:", error);
      alert("Erro ao buscar seu código de indicação: " + error.message);
    });
}

// Função para copiar texto
function copyText(id) {
  const text = document.getElementById(id).textContent;
  navigator.clipboard.writeText(text).then(() => {
    alert("Copiado!");
  });
}

// Verifica se o usuário está logado
onAuthStateChanged(auth, user => {
  if (user) {
    // Se estiver logado, exibe a equipe
    exibirEquipe(user);

    // Configuração do código e link de convite
    const meuCodigo = user.uid; // O código de indicação pode ser o UID do usuário logado
    const meuLink = `https://seusite.com/registro?codigo=${meuCodigo}`;

    document.getElementById("invite-code").textContent = meuCodigo;
    document.getElementById("invite-link").textContent = meuLink;

  } else {
    // Se não estiver logado, manda para tela de login
    window.location.href = "index.html";
  }
});
