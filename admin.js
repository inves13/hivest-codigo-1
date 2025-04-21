function carregarUsuarios() {
    const tabelaUsuarios = document.getElementById('tabela-usuarios');
    tabelaUsuarios.innerHTML = ''; // Limpar a tabela antes de adicionar novos dados

    // Obtém os dados dos usuários do Firebase
    db.ref('usuarios').once('value', function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
            const usuario = childSnapshot.val();
            const telefone = childSnapshot.key;

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${usuario.nome}</td>
                <td>${telefone}</td>
                <td>R$ ${usuario.saldo ? usuario.saldo.toFixed(2) : 0}</td>
                <td><button onclick="mostrarFormulario('${telefone}')">Adicionar Saldo</button></td>
            `;
            tabelaUsuarios.appendChild(tr);
        });
    });
}
