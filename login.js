// Importando os módulos necessários do Firebase
import { getAuth, signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js';
import { getDatabase, ref, get } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js';

// Obtendo as instâncias do Firebase
const auth = getAuth();
const db = getDatabase();

// Adicionando o evento de login
document.getElementById("botao-login").addEventListener("click", function () {
    let telefone = document.getElementById("telefone").value;
    let senha = document.getElementById("senha").value;

    // Tentando fazer login no Firebase Authentication com o telefone (como email)
    signInWithEmailAndPassword(auth, telefone + "@example.com", senha)
        .then((userCredential) => {
            // Login bem-sucedido
            const user = userCredential.user;
            
            // Armazenando o telefone do usuário localmente
            localStorage.setItem("telefoneUsuario", telefone);

            // Redirecionando para a página principal
            window.location.href = "index.html";
        })
        .catch((error) => {
            // Caso ocorra erro no login
            const errorCode = error.code;
            const errorMessage = error.message;

            console.error("Erro no login:", errorCode, errorMessage);
            alert("Erro ao fazer login. Verifique seus dados.");
        });
});