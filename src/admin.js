document.addEventListener('DOMContentLoaded', () => {
    console.log("admin.js: Script iniciado.");

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
        firebase.initializeApp(firebaseConfig);
        console.log("admin.js: Firebase inicializado com sucesso.");
        
        const auth = firebase.auth();
        const db = firebase.firestore();

        const loginContainer = document.getElementById('login-container');
        const adminPanel = document.getElementById('admin-panel');
        const loginError = document.getElementById('login-error');
        const btnAdminLogin = document.getElementById('btn-admin-login');
        const btnAdminLogout = document.getElementById('btn-admin-logout');
        const adminUserEmail = document.getElementById('admin-user-email');
        const quotesListContainer = document.getElementById('quotes-list');
        const loader = document.getElementById('loader');

        auth.onAuthStateChanged(user => {
            if (user) {
                adminUserEmail.textContent = user.email;
                loginContainer.style.display = 'none';
                adminPanel.style.display = 'block';
                fetchQuotes();
            } else {
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
        .then((userCredential) => {
            // Este bloco é executado em caso de SUCESSO.
            // Apenas registramos no console, pois o 'onAuthStateChanged' já cuidará de mudar a tela.
            console.log("admin.js: SUCESSO! Login bem-sucedido. Usuário:", userCredential.user);
        })
        .catch(error => {
            // Este bloco é executado em caso de FALHA.
            console.error("admin.js: FALHA no login:", error);
            loginError.textContent = `Falha no login. Código: ${error.code}`;
        });
});
        btnAdminLogout.addEventListener('click', () => auth.signOut());

        function updateQuoteStatus(quoteId, newStatus, cardElement) {
            const quoteRef = db.collection("orcamentos").doc(quoteId);

            quoteRef.update({ status: newStatus })
            .then(() => {
                console.log(`Status do orçamento ${quoteId} atualizado para ${newStatus}`);
                // Atualiza a UI imediatamente sem precisar recarregar
                const statusBadge = cardElement.querySelector('.status-badge');
                if (statusBadge) {
                    const statusClass = newStatus.toLowerCase().replace(/\s+/g, '-');
                    statusBadge.className = `status-badge status-${statusClass}`;
                    statusBadge.textContent = newStatus;
                }
            })
            .catch(error => {
                console.error("Erro ao atualizar status: ", error);
                alert("Não foi possível atualizar o status.");
            });
        }

        quotesListContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('cancel-button')) {
                const quoteId = e.target.dataset.id;
                const cardElement = e.target.closest('.quote-card');
                const obraName = cardElement.querySelector('h3').textContent;

                if (confirm(`Tem certeza que deseja CANCELAR o orçamento para a obra "${obraName}"?\n\nEsta ação não pode ser desfeita.`)) {
                    updateQuoteStatus(quoteId, 'CANCELADO', cardElement);
                }
            }
        });

        quotesListContainer.addEventListener('change', (e) => {
            if (e.target.classList.contains('status-select')) {
                const quoteId = e.target.dataset.id;
                const newStatus = e.target.value;
                const cardElement = e.target.closest('.quote-card');
                updateQuoteStatus(quoteId, newStatus, cardElement);
            }
        });

        function fetchQuotes() {
            loader.style.display = 'block';
            quotesListContainer.innerHTML = '';

            db.collection("orcamentos").orderBy("dataCriacao", "desc").get()
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
                      const statusAtual = quote.status || 'ENVIADO';
                      const statusClass = statusAtual.toLowerCase().replace(/\s+/g, '-');

                      card.innerHTML = `
                          <div class="quote-header">
                              <h3>${quote.obraName || 'Orçamento sem nome'}</h3>
                              <span class="status-badge status-${statusClass}">${statusAtual}</span>
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
                          
                          <div class="quote-actions">
                              <div class="status-changer">
                                  <label for="status-select-${quoteId}">Alterar Status:</label>
                                  <select class="status-select" data-id="${quoteId}">
                                      <option value="ENVIADO" ${statusAtual === 'ENVIADO' ? 'selected' : ''}>ENVIADO</option>
                                      <option value="EM ANÁLISE" ${statusAtual === 'EM ANÁLISE' ? 'selected' : ''}>Em Análise</option>
                                      <option value="APROVADO" ${statusAtual === 'APROVADO' ? 'selected' : ''}>Aprovado</option>
                                      <option value="EM PRODUÇÃO" ${statusAtual === 'EM PRODUÇÃO' ? 'selected' : ''}>Em Produção</option>
                                      <option value="PRONTO P/ ENTREGA" ${statusAtual === 'PRONTO P/ ENTREGA' ? 'selected' : ''}>Pronto p/ Entrega</option>
                                      <option value="FINALIZADO" ${statusAtual === 'FINALIZADO' ? 'selected' : ''}>Finalizado</option>
                                  </select>
                              </div>
                              <button class="cancel-button" data-id="${quoteId}">Cancelar</button>
                          </div>
                      `;
                      quotesListContainer.appendChild(card);
                  });
              })
              .catch(error => { /* ...código de erro sem alteração... */ });
        }
    } catch (e) {
        console.error("admin.js: ERRO CRÍTICO...", e);
    }
});