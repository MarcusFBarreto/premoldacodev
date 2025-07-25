// A configuração do Firebase vem primeiro.
const firebaseConfig = {
  apiKey: "AIzaSyBbcXKzor-xgsQzip6c7gZbn4iRVFr2Tfo",
  authDomain: "premoldaco-webapp.firebaseapp.com",
  projectId: "premoldaco-webapp",
  storageBucket: "premoldaco-webapp.appspot.com",
  messagingSenderId: "918710823829",
  appId: "1:918710823829:web:b41e60568d4b0d30c9a49c",
  measurementId: "G-VJ4ETSMZT7"
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
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM carregado, iniciando script...");

    const loginContainer = document.getElementById('login-container');
    const adminPanel = document.getElementById('admin-panel');
    const loginError = document.getElementById('login-error');
    const btnAdminLogin = document.getElementById('btn-admin-login');
    const btnAdminLogout = document.getElementById('btn-admin-logout');
    const adminUserEmail = document.getElementById('admin-user-email');
    const quotesListContainer = document.getElementById('quotes-list');

    auth.onAuthStateChanged(user => {
        if (user) {
            const userRef = db.collection("equipe").doc(user.uid);
            userRef.get().then((doc) => {
                if (doc.exists) {
                    const userRole = doc.data().funcao;
                    user.role = userRole; 
                    adminUserEmail.textContent = `${user.email} (${userRole})`;
                    loginContainer.style.display = 'none';
                    adminPanel.style.display = 'block';
                    attachQuotesListener(userRole);
                } else {
                    alert("Você não tem permissão para acessar este painel.");
                    auth.signOut();
                }
            }).catch(error => {
                console.error("Erro ao buscar função do usuário:", error);
                alert("Ocorreu um erro ao verificar suas permissões.");
                auth.signOut();
            });
        } else {
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