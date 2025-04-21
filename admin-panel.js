// Exemplo de dados de saque (isso viria de uma API ou banco de dados)
const withdrawals = [
    { name: 'João Silva', pixKey: 'joao@email.com', amount: 'R$200,00' },
    { name: 'Maria Oliveira', pixKey: 'maria@cpf.com', amount: 'R$350,00' },
    { name: 'Pedro Souza', pixKey: 'pedro@telefone.com', amount: 'R$150,00' },
];

// Função para renderizar os saques na tabela
function renderWithdrawals() {
    const withdrawalsList = document.getElementById('withdrawals-list');
    withdrawalsList.innerHTML = ''; // Limpar a tabela antes de renderizar

    withdrawals.forEach(withdrawal => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${withdrawal.name}</td>
            <td>${withdrawal.pixKey}</td>
            <td>${withdrawal.amount}</td>
            <td>
                <button onclick="approveWithdrawal('${withdrawal.name}')">Aprovar</button>
                <button onclick="rejectWithdrawal('${withdrawal.name}')">Rejeitar</button>
            </td>
        `;
        withdrawalsList.appendChild(row);
    });
}

// Funções de ação para aprovar ou rejeitar o saque
function approveWithdrawal(name) {
    alert(`Saque de ${name} aprovado!`);
}

function rejectWithdrawal(name) {
    alert(`Saque de ${name} rejeitado!`);
}

// Carregar os saques na página ao iniciar
window.onload = renderWithdrawals;
