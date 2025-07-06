// Configuração do Firebase (copie do seu projeto, se for diferente)
const firebaseConfig = {
 
  apiKey: "AIzaSyBbcXKzor-xgsQzip6c7gZbn4iRVFr2Tfo",
  authDomain: "premoldaco-webapp.firebaseapp.com",
  projectId: "premoldaco-webapp",
  storageBucket: "premoldaco-webapp.firebasestorage.app",
  messagingSenderId: "918710823829",
  appId: "1:918710823829:web:b41e60568d4b0d30c9a49c",
  measurementId: "G-VJ4ETSMZT7"

};

// Inicializa o Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Elementos da UI
const loginContainer = document.getElementById('login-container');
const adminPanel = document.getElementById('admin-panel');
const loginError = document.getElementById('login-error');
const btnAdminLogin = document.getElementById('btn-admin-login');
const btnAdminLogout = document.getElementById('btn-admin-logout');
const adminUserEmail = document.getElementById('admin-user-email');
const quotesListContainer = document.getElementById('quotes-list');
const loader = document.getElementById('loader');


// --- LÓGICA DE AUTENTICAÇÃO ---

// Observador do estado de autenticação
auth.onAuthStateChanged(user => {
    if (user) {
        // Usuário está logado
        console.log('Admin logado:', user.email);
        adminUserEmail.textContent = user.email;
        loginContainer.style.display = 'none';
        adminPanel.style.display = 'block';
        // fetchQuotes(); // <<-- Vamos implementar isso no próximo passo
    } else {
        // Usuário está deslogado
        console.log('Nenhum admin logado.');
        loginContainer.style.display = 'block';
        adminPanel.style.display = 'none';
    }
});

// Listener do botão de Login
btnAdminLogin.addEventListener('click', () => {
    const email = document.getElementById('admin-email').value;
    const password = document.getElementById('admin-password').value;
    loginError.textContent = '';

    auth.signInWithEmailAndPassword(email, password)
        .catch(error => {
            console.error('Erro de login:', error);
            loginError.textContent = 'E-mail ou senha inválidos.';
        });
});

// Listener do botão de Logout
btnAdminLogout.addEventListener('click', () => {
    auth.signOut();
});