// A configuração do Firebase vem primeiro.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Inicializa o Firebase e os serviços
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// --- FUNÇÕES DE LÓGICA ---

let quotesListener = null;

function attachQuotesListener(role) {
    const loader = document.getElementById('loader');
    const quotesListContainer = document.getElementById('quotes-list');
    
    loader.style.display = 'block';
    if (quotesListener) quotesListener();

    
    let query = db.collection("orcamentos");

    // LÓGICA DAS PRANCHETAS: Filtra o que cada um vê
    if (role === 'vendas') {
        query = query.where('status', 'in', ['NOVO', 'EM ANÁLISE']);
    } else if (role === 'producao') {
        query = query.where('status', 'in', ['APROVADO', 'AGUARDANDO PRODUÇÃO', 'EM PRODUÇÃO', 'PRONTO P/ ENTREGA']);
    } else if (role === 'transporte') {
        query = query.where('status', 'in', ['PRONTO P/ ENTREGA', 'AGUARDANDO CARGA', 'CARREGANDO', 'EM ROTA', 'ENTREGUE']);
    }
    
    query = query.orderBy("dataCriacao", "desc");

    quotesListener = query.onSnapshot((querySnapshot) => {
        loader.style.display = 'none';
        quotesListContainer.innerHTML = '';
        
        if (querySnapshot.empty) {
            quotesListContainer.innerHTML = '<p>Nenhum orçamento encontrado para esta prancheta.</p>';
            return;
        }

        querySnapshot.forEach(doc => {
            const quote = doc.data();
            const quoteId = doc.id;
            const card = document.createElement('div');
            card.className = 'quote-card';
            
            const data = quote.dataCriacao ? quote.dataCriacao.toDate().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Data indisponível';
            const statusAtual = quote.status || 'NOVO';
            const statusClass = statusAtual.toLowerCase().replace(/\s+/g, '-');

            const getStatusOptions = (userRole, currentStatus) => {
                const allStatuses = ['NOVO', 'EM ANÁLISE', 'APROVADO', 'AGUARDANDO PRODUÇÃO', 'EM PRODUÇÃO', 'PRONTO P/ ENTREGA', 'AGUARDANDO CARGA', 'CARREGANDO', 'EM ROTA', 'ENTREGUE', 'FINALIZADO'];
                let allowedTransitions = [];

                if (userRole === 'vendas') {
                    if (currentStatus === 'NOVO') allowedTransitions = ['EM ANÁLISE', 'APROVADO'];
                    else if (currentStatus === 'EM ANÁLISE') allowedTransitions = ['APROVADO'];
                } else if (userRole === 'producao') {
                    if (currentStatus === 'APROVADO') allowedTransitions = ['AGUARDANDO PRODUÇÃO'];
                    else if (currentStatus === 'AGUARDANDO PRODUÇÃO') allowedTransitions = ['EM PRODUÇÃO'];
                    else if (currentStatus === 'EM PRODUÇÃO') allowedTransitions = ['PRONTO P/ ENTREGA'];
                } else if (userRole === 'transporte') {
                    if (currentStatus === 'PRONTO P/ ENTREGA') allowedTransitions = ['AGUARDANDO CARGA'];
                    else if (currentStatus === 'AGUARDANDO CARGA') allowedTransitions = ['CARREGANDO'];
                    else if (currentStatus === 'CARREGANDO') allowedTransitions = ['EM ROTA'];
                    else if (currentStatus === 'EM ROTA') allowedTransitions = ['ENTREGUE'];
                } else if (userRole === 'superadmin' || userRole === 'gerencia') {
                    allowedTransitions = allStatuses;
                }

                let optionsHTML = `<option value="${currentStatus}" selected>${currentStatus.replace(/-/g, ' ')}</option>`;
                allowedTransitions.forEach(status => {
                    if (status !== currentStatus) {
                        optionsHTML += `<option value="${status}">${status.replace(/-/g, ' ')}</option>`;
                    }
                });
                return optionsHTML;
            };

            const statusOptionsHTML = getStatusOptions(role, statusAtual);
            let cancelButtonHTML = '';
            if (role === 'superadmin') {
                cancelButtonHTML = `<button class="cancel-button" data-id="${quoteId}">Cancelar</button>`;
            }

             // --- LÓGICA PARA MONTAR O HTML DA PLACA ---
            let deliveryInfoHTML = '';
            if (quote.placaVeiculo) {
                deliveryInfoHTML = `
                <div class="delivery-info">
                    <p><strong>Veículo de Entrega:</strong> ${quote.placaVeiculo}</p>
                </div>`;
            }

            // --- HTML DO CARD CORRIGIDO ---
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
              ${deliveryInfoHTML}  <div class="quote-actions">
                <div class="status-changer">
                  <label for="status-select-${quoteId}">Alterar Status:</label>
                  <select class="status-select" data-id="${quoteId}">
                    ${statusOptionsHTML}
                  </select>
                </div>
                ${cancelButtonHTML}
              </div>
            `;
            quotesListContainer.appendChild(card);
        });
    }, (error) => {
        loader.style.display = 'none';
        console.error("Erro no listener de orçamentos: ", error);
        quotesListContainer.innerHTML = `<p style="color: red;">Ocorreu um erro. Verifique o console (F12).</p>`;
    });
}

function updateQuoteStatus(quoteId, newStatus, cardElement) {
    const quoteRef = db.collection("orcamentos").doc(quoteId);
    let dataToUpdate = { status: newStatus };

    // --- LÓGICA CORRIGIDA: PEDE A PLACA NA FASE "CARREGANDO" ---
    if (newStatus === 'CARREGANDO') {
        const placa = prompt("Por favor, digite a placa do veículo de entrega:");
        if (placa && placa.trim() !== '') {
            dataToUpdate.placaVeiculo = placa.trim().toUpperCase();
        } else {
            alert("A mudança de status foi cancelada pois a placa não foi informada.");
            // Recarrega a página para resetar o menu dropdown para o estado anterior.
            window.location.reload(); 
            return; 
        }
    }

     quoteRef.update(dataToUpdate)
    .then(() => {
        console.log(`Dados do orçamento ${quoteId} atualizados.`);
    })
    
    
    .catch(error => {
        console.error("Erro ao atualizar status: ", error);
        alert("Não foi possível atualizar o status.");
    });
}

// --- LÓGICA EXECUTADA QUANDO A PÁGINA CARREGA ---
// Substitua o bloco existente por este em seu admin.js

document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM carregado, iniciando script...");

    const loginContainer = document.getElementById('login-container');
    const adminPanel = document.getElementById('admin-panel');
    const loginError = document.getElementById('login-error');
    const btnAdminLogin = document.getElementById('btn-admin-login');
    const btnAdminLogout = document.getElementById('btn-admin-logout');
    const adminUserEmail = document.getElementById('admin-user-email');
    const quotesListContainer = document.getElementById('quotes-list');

    console.log("1. Entrando na verificação de autenticação (onAuthStateChanged)...");
    auth.onAuthStateChanged(user => {
        if (user) {
            console.log("2. Usuário detectado:", user.email, "UID:", user.uid);
            console.log("3. Buscando perfil na coleção 'equipe' para verificar permissões...");

            const userRef = db.collection("equipe").doc(user.uid);
            userRef.get().then((doc) => {
                if (doc.exists) {
                    const userRole = doc.data().funcao;
                    console.log("4. SUCESSO! Perfil encontrado. Função:", userRole);
                    user.role = userRole; 
                    adminUserEmail.textContent = `${user.email} (${userRole})`;
                    loginContainer.style.display = 'none';
                    adminPanel.style.display = 'block';
                    console.log("5. Anexando o listener para buscar os orçamentos...");
                    attachQuotesListener(userRole);
                } else {
                    console.error("ERRO GRAVE: O documento na coleção 'equipe' não existe para este usuário. Verifique se o UID do usuário no Authentication corresponde a um documento na coleção 'equipe'.");
                    alert("Acesso negado. Você não faz parte da equipe autorizada.");
                    auth.signOut();
                }
            }).catch(error => {
                console.error("ERRO GRAVE ao tentar ler o perfil na coleção 'equipe':", error);
                alert("Ocorreu um erro ao verificar suas permissões. Verifique as regras de segurança do Firestore.");
                auth.signOut();
            });
        } else {
            console.log("2. Nenhum usuário logado. Exibindo formulário de login.");
            if (quotesListener) quotesListener();
            loginContainer.style.display = 'block';
            adminPanel.style.display = 'none';
        }
    });

    btnAdminLogin.addEventListener('click', () => {
        const email = document.getElementById('admin-email').value;
        const password = document.getElementById('admin-password').value;
        if (!email || !password) {
            loginError.textContent = "Preencha e-mail e senha.";
            return;
        }
        auth.signInWithEmailAndPassword(email, password)
            .catch(error => {
                loginError.textContent = `Falha no login. Código: ${error.code}`;
            });
    });

    btnAdminLogout.addEventListener('click', () => {
        auth.signOut();
    });

    quotesListContainer.addEventListener('change', (e) => {
        if (e.target.classList.contains('status-select')) {
            const quoteId = e.target.dataset.id;
            const newStatus = e.target.value;
            const cardElement = e.target.closest('.quote-card');
            updateQuoteStatus(quoteId, newStatus, cardElement);
        }
    });
    
    quotesListContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('cancel-button')) {
            const quoteId = e.target.dataset.id;
            const cardElement = e.target.closest('.quote-card');
            const obraName = cardElement.querySelector('h3').textContent;
            if (confirm(`Tem certeza que deseja CANCELAR o orçamento para a obra "${obraName}"?`)) {
                updateQuoteStatus(quoteId, 'CANCELADO', cardElement);
            }
        }
    });
});