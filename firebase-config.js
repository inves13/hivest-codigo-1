// firebase-config.js

// Importa os módulos necessários do Firebase
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getDatabase, ref, get, set } from "firebase/database";

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "sua-api-key",            // Substitua com a sua chave da API
  authDomain: "seu-auth-domain",     // Substitua com o seu domínio de autenticação
  databaseURL: "sua-database-url",   // URL do seu banco de dados
  projectId: "seu-project-id",       // ID do seu projeto
  storageBucket: "seu-storage-bucket", // Bucket de armazenamento (se necessário)
  messagingSenderId: "seu-sender-id", // ID do remetente de mensagens
  appId: "seu-app-id"               // ID do seu aplicativo
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Referência para o banco de dados e autenticação
const database = getDatabase(app);
const auth = getAuth(app);

// Exporta a referência para o uso em outros arquivos
export { auth, database, ref, get, set, onAuthStateChanged };
