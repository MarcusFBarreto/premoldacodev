
 /*
  apiKey: "AIzaSyBbcXKzor-xgsQzip6c7gZbn4iRVFr2Tfo",
  authDomain: "premoldaco-webapp.firebaseapp.com",
  projectId: "premoldaco-webapp",
  storageBucket: "premoldaco-webapp.firebasestorage.app",
  messagingSenderId: "918710823829",
  appId: "1:918710823829:web:b41e60568d4b0d30c9a49c",
  measurementId: "G-VJ4ETSMZT7"
*/

document.addEventListener('DOMContentLoaded', () => {
    console.log("admin.js: Script iniciado.");

    // 1. Configuração do Firebase
    // Lembre-se de substituir pelas suas chaves reais do Console do Firebase
    const firebaseConfig = {
   apiKey: "AIzaSyBbcXKzor-xgsQzip6c7gZbn4iRVFr2Tfo",
  authDomain: "premoldaco-webapp.firebaseapp.com",
  projectId: "premoldaco-webapp",
  storageBucket: "premoldaco-webapp.firebasestorage.app",
  messagingSenderId: "918710823829",
  appId: "1:918710823829:web:b41e60568d4b0d30c9a49c",
  measurementId: "G-VJ4ETSMZT7"
    };

    try {
        // 2. Inicializa o Firebase
        firebase.initializeApp(firebaseConfig);
        console.log("admin.js: Firebase inicializado com sucesso.");
        
        const auth = firebase.auth();
        const db = firebase.firestore();

        // 3. Elementos da UI
        const loginContainer = document.getElementById('login-container');
        const adminPanel = document.getElementById('admin-panel');
        const loginError = document.getElementById('login-error');
        const btnAdminLogin = document.getElementById('btn-admin-login');
        const btnAdminLogout = document.getElementById('btn-admin-logout');
        const adminUserEmail = document.getElementById('admin-user-email');
        const quotesListContainer = document.getElementById('quotes-list');
        const loader = document.getElementById('loader');

        // 4. Observador de Autenticação (Verifica o estado do login)
        auth.onAuthStateChanged(user => {
            if (user) {
                console.log('admin.js: onAuthStateChanged - Usuário detectado:', user.email);
                adminUserEmail.textContent = user.email;
                loginContainer.style.display = 'none';
                adminPanel.style.display = 'block';
                fetchQuotes();
            } else {
                console.log('admin.js: onAuthStateChanged - Nenhum usuário detectado.');
                loginContainer.style.display = 'block';
                adminPanel.style.display = 'none';
            }
        });

        // 5. Listener do Botão de Login
        btnAdminLogin.addEventListener('click', () => {
            console.log("admin.js: Botão de login CLICADO.");
            const email = document.getElementById('admin-email').value;
            const password = document.getElementById('admin-password').value;
            loginError.textContent = '';

            if (!email || !password) {
                loginError.textContent = "Por favor, preencha ambos os campos.";
                return;
            }

            console.log(`admin.js: Tentando login com E-mail: ${email}`);
            auth.signInWithEmailAndPassword(email, password)
                .catch(error => {
                    console.error("admin.js: FALHA no login:", error);
                    loginError.textContent = `Falha no login. Código: ${error.code}`;
                });
        });

        // 6. Listener do Botão de Logout
        btnAdminLogout.addEventListener('click', () => {
            console.log("admin.js: Botão de logout clicado.");
            auth.signOut();
        });

        // 7. Função para Buscar e Exibir os Orçamentos
        function fetchQuotes() {
            loader.style.display = 'block';
            quotesListContainer.innerHTML = '';

            db.collection("orcamentos")
              .orderBy("dataCriacao", "desc")
              .get()
              .then(querySnapshot => {
                  loader.style.display = 'none';
                  if (querySnapshot.empty) {
                      quotesListContainer.innerHTML = '<p>Nenhum orçamento encontrado.</p>';
                      return;
                  }
                  querySnapshot.forEach(doc => {
                      const quote = doc.data();
                      const quoteId = doc.id;
                      
                      const card = document.createElement('div');
                      card.className = 'quote-card';
                      
                      const data = quote.dataCriacao ? quote.dataCriacao.toDate().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Data indisponível';
                      const statusClass = (quote.status || 'enviado').toLowerCase().replace(/\s+/g, '-');

                      card.innerHTML = `
                          <div class="quote-header">
                              <h3>${quote.obraName || 'Orçamento sem nome'}</h3>
                              <span class="status-badge status-${statusClass}">${quote.status || 'ENVIADO'}</span>
                          </div>
                          <p style="font-size: 0.8em; color: #888; margin-top: -0.5rem; margin-bottom: 1rem;">ID: ${quoteId}</p>
                          <div class="quote-details">
                              <div>
                                  <p><strong>Cliente:</strong> ${quote.clienteNome || 'Não informado'}</p>
                                  <p><strong>Telefone:</strong> ${quote.clienteTelefone || 'Não informado'}</p>
                                  <p><strong>E-mail:</strong> ${quote.clienteEmail || 'Não informado'}</p>
                              </div>
                              <div>
                                  <p><strong>Data:</strong> ${data}</p>
                                  <p><strong>Tipo de Laje:</strong> ${quote.tipoLaje || 'N/A'}</p>
                                  <p><strong>Área Total:</strong> ${quote.totalArea || 'N/A'} m²</p>
                              </div>
                          </div>
                          <p style="margin-top: 1rem;"><strong>Observações:</strong> ${quote.clienteObservacoes || 'Nenhuma'}</p>
                          `;
                      quotesListContainer.appendChild(card);
                  });
              })
              .catch(error => {
                  loader.style.display = 'none';
                  console.error("Erro ao buscar orçamentos: ", error);
                  quotesListContainer.innerHTML = '<p style="color: red;">Ocorreu um erro ao carregar os orçamentos. Verifique as regras do Firestore e o índice.</p>';
              });
        }

    } catch (e) {
        console.error("admin.js: ERRO CRÍTICO AO INICIALIZAR O FIREBASE! Verifique suas chaves em firebaseConfig.", e);
    }
});