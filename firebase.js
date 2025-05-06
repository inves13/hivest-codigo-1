import { auth, database, ref, get, query, orderByChild, equalTo, onAuthStateChanged } from "./firebase-config.js";

function exibirEquipe(usuario) {
  const uid = usuario.uid;
  const db = database;

  // Recupera o código do usuário logado
  get(ref(db, "usuarios/" + uid)).then(snap => {
    const meuCodigo = uid; // usa o próprio UID como código

    // Consulta para pegar todos os usuários com o código de convite igual ao UID do usuário logado
    const consulta = query(ref(db, "usuarios"), orderByChild("codigoConvite"), equalTo(meuCodigo));

    get(consulta).then(snapshot => {
      let totalMembros = 0;
      let totalComissao = 0;
      let lv1 = { qtd: 0, bonus: 0 };
      let lv2 = { qtd: 0, bonus: 0 };
      let lv3 = { qtd: 0, bonus: 0 };

      // Limpa a lista de membros antes de preencher novamente
      const lista = document.getElementById("invited-users");
      lista.innerHTML = "";

      if (snapshot.exists()) {
        snapshot.forEach(child => {
          const dados = child.val();
          totalMembros++;

          // Calcula o valor do investimento e comissão
          const investimento = parseFloat(dados?.investimentos?.valor) || 0;
          const comissao = investimento * 0.35;

          // Determina o nível do usuário
          const nivel = parseInt(dados?.nivel) || 1;

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

          // Criação do item de lista para cada usuário
          const li = document.createElement("li");
          li.textContent = `${dados.nome || "Sem nome"} - Investiu R$ ${investimento.toLocaleString("pt-BR", {minimumFractionDigits: 2})} - Você ganhou R$ ${comissao.toLocaleString("pt-BR", {minimumFractionDigits: 2})}`;
          lista.appendChild(li);

          // Soma a comissão total
          totalComissao += comissao;
        });
      } else {
        // Caso o usuário não tenha convidados
        const li = document.createElement("li");
        li.textContent = "Você ainda não convidou ninguém.";
        lista.appendChild(li);
      }

      // Atualiza os totais de cada nível na interface
      document.getElementById("lv1-qtd").textContent = `${lv1.qtd} efetivos`;
      document.getElementById("lv1-bonus").textContent = `R$ ${lv1.bonus.toFixed(2)}`;
      document.getElementById("lv2-qtd").textContent = `${lv2.qtd} efetivos`;
      document.getElementById("lv2-bonus").textContent = `R$ ${lv2.bonus.toFixed(2)}`;
      document.getElementById("lv3-qtd").textContent = `${lv3.qtd} efetivos`;
      document.getElementById("lv3-bonus").textContent = `R$ ${lv3.bonus.toFixed(2)}`;

      // Exibe o número total de membros e o bônus total
      document.getElementById("total-users").textContent = `${totalMembros} usuários`;
      document.getElementById("total-bonus").textContent = `R$ ${totalComissao.toFixed(2)} ganhos`;
    }).catch(error => {
      console.error("Erro ao buscar equipe:", error);
    });
  }).catch(error => {
    console.error("Erro ao buscar código:", error);
  });
}

function copyText(id) {
  const text = document.getElementById(id).textContent;
  navigator.clipboard.writeText(text).then(() => {
    alert("Copiado!");
  });
}

// Observa o estado de autenticação do usuário
onAuthStateChanged(auth, user => {
  if (user) {
    // Se o usuário estiver autenticado, exibe os dados da equipe
    exibirEquipe(user);

    const meuCodigo = user.uid;
    const meuLink = `https://seusite.com/registro?codigo=${meuCodigo}`;

    // Exibe o código de convite e o link para compartilhamento
    document.getElementById("invite-code").textContent = meuCodigo;
    document.getElementById("invite-link").textContent = meuLink;

    // Função para copiar o código ou link para a área de transferência
    document.getElementById("copy-code-btn").onclick = () => copyText("invite-code");
    document.getElementById("copy-link-btn").onclick = () => copyText("invite-link");
  } else {
    // Se não houver usuário autenticado, redireciona para a página de login
    window.location.href = "index.html";
  }
});
