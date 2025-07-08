/*
const firebaseConfig = {
  apiKey: "AIzaSyBbcXKzor-xgsQzip6c7gZbn4iRVFr2Tfo",
  authDomain: "premoldaco-webapp.firebaseapp.com",
  projectId: "premoldaco-webapp",
  storageBucket: "premoldaco-webapp.appspot.com",
  messagingSenderId: "918710823829",
  appId: "1:918710823829:web:b41e60568d4b0d30c9a49c",
  measurementId: "G-VJ4ETSMZT7"
};
*/

// A configuração do Firebase vem primeiro.
// Use as chaves reais do seu projeto aqui.
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

// Seleciona os elementos da página
const loginContainer = document.getElementById('login-container');
const adminPanel = document.getElementById('admin-panel');
const loginError = document.getElementById('login-error');
const btnAdminLogin = document.getElementById('btn-admin-login');
const btnAdminLogout = document.getElementById('btn-admin-logout');
const adminUserEmail = document.getElementById('admin-user-email');
const quotesListContainer = document.getElementById('quotes-list');
const loader = document.getElementById('loader');

// --- FUNÇÕES DE LÓGICA ---

/**
 * Busca e exibe os orçamentos do Firestore, aplicando filtros baseados na função do usuário.
 * @param {string} role - A função do usuário logado (ex: 'superadmin', 'vendas')
 */
function fetchQuotes(role) {
    console.log(`Buscando orçamentos com base na função: ${role}`);
    loader.style.display = 'block';
    quotesListContainer.innerHTML = '';

    let query = db.collection("orcamentos");

    // LÓGICA DAS PRANCHETAS: Filtra os orçamentos que cada função pode ver.
    if (role === 'vendas') {
        query = query.where('status', 'in', ['NOVO', 'EM ANÁLISE']);
    } else if (role === 'producao') {
        query = query.where('status', 'in', ['APROVADO', 'EM PRODUÇÃO']);
    } else if (role === 'transporte') {
        query = query.where('status', 'in', ['PRONTO P/ ENTREGA']);
    }

    query = query.orderBy("dataCriacao", "desc");

    query.get().then(querySnapshot => {
        loader.style.display = 'none';
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
                let allowedTransitions = [];
                if (userRole === 'vendas') {
                    if (currentStatus === 'NOVO') allowedTransitions = ['EM ANÁLISE', 'APROVADO'];
                    else if (currentStatus === 'EM ANÁLISE') allowedTransitions = ['APROVADO'];
                } else if (userRole === 'producao') {
                    if (currentStatus === 'APROVADO') allowedTransitions = ['EM PRODUÇÃO'];
                    else if (currentStatus === 'EM PRODUÇÃO') allowedTransitions = ['PRONTO P/ ENTREGA'];
                } else if (userRole === 'transporte') {
                    if (currentStatus === 'PRONTO P/ ENTREGA') allowedTransitions = ['FINALIZADO'];
                } else if (userRole === 'superadmin' || userRole === 'gerencia') {
                    allowedTransitions = ['NOVO', 'EM ANÁLISE', 'APROVADO', 'EM PRODUÇÃO', 'PRONTO P/ ENTREGA', 'FINALIZADO'];
                }

                let optionsHTML = `<option value="${currentStatus}" selected>${currentStatus}</option>`;
                allowedTransitions.forEach(status => {
                    if (status !== currentStatus) {
                        optionsHTML += `<option value="${status}">${status}</option>`;
                    }
                });
                return optionsHTML;
            };

            const statusOptionsHTML = getStatusOptions(role, statusAtual);
            let cancelButtonHTML = '';
            if (role === 'superadmin') {
                cancelButtonHTML = `<button class="cancel-button" data-id="${quoteId}">Cancelar</button>`;
            }

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
                            ${statusOptionsHTML}
                        </select>
                    </div>
                    ${cancelButtonHTML}
                </div>
            `;
            quotesListContainer.appendChild(card);
        });
    })
    .catch(error => {
        loader.style.display = 'none';
        console.error("Erro ao buscar orçamentos: ", error);
        quotesListContainer.innerHTML = `<p style="color: red;">Ocorreu um erro ao carregar os orçamentos. Verifique o console (F12) para um link de criação de índice.</p>`;
    });
}

/**
 * Atualiza o status de um orçamento no banco de dados.
 * @param {string} quoteId - O ID do documento.
 * @param {string} newStatus - O novo status.
 * @param {HTMLElement} cardElement - O elemento do card na tela para atualização visual.
 */
function updateQuoteStatus(quoteId, newStatus, cardElement) {
    const quoteRef = db.collection("orcamentos").doc(quoteId);
    quoteRef.update({ status: newStatus })
    .then(() => {
        console.log(`Status do orçamento ${quoteId} atualizado para ${newStatus}`);
        const statusBadge = cardElement.querySelector('.status-badge');
        if (statusBadge) {
            const statusClass = newStatus.toLowerCase().replace(/\s+/g, '-');
            statusBadge.className = `status-badge status-${statusClass}`;
            statusBadge.textContent = newStatus;
        }
        // Para atualizar a lista de acordo com o filtro da prancheta, podemos simplesmente recarregar.
        setTimeout(() => fetchQuotes(auth.currentUser.role), 1000); // Recarrega após 1s
    })
    .catch(error => {
        console.error("Erro ao atualizar status: ", error);
        alert("Não foi possível atualizar o status.");
    });
}


// --- EVENT LISTENERS ---

// O "maestro" da autenticação.
auth.onAuthStateChanged(user => {
    if (user) {
        const userRef = db.collection("equipe").doc(user.uid);
        userRef.get().then((doc) => {
            if (doc.exists) {
                const userData = doc.data();
                user.role = userData.funcao; // Anexamos a função ao objeto do usuário
                
                console.log(`Acesso concedido. Usuário: ${user.email}, Função: ${user.role}`);
                adminUserEmail.textContent = `${user.email} (${user.role})`;
                loginContainer.style.display = 'none';
                adminPanel.style.display = 'block';
                fetchQuotes(user.role);
            } else {
                console.error("ACESSO NEGADO! Usuário não está na coleção 'equipe'.");
                alert("Você não tem permissão para acessar este painel.");
                auth.signOut();
            }
        }).catch(error => {
            console.error("Erro ao buscar função do usuário:", error);
            alert("Ocorreu um erro ao verificar suas permissões.");
            auth.signOut();
        });
    } else {
        console.log("Nenhum usuário logado. Exibindo tela de login.");
        loginContainer.style.display = 'block';
        adminPanel.style.display = 'none';
    }
});

// Listener para o botão de Login
btnAdminLogin.addEventListener('click', () => {
    const email = document.getElementById('admin-email').value;
    const password = document.getElementById('admin-password').value;
    if (!email || !password) {
        loginError.textContent = "Preencha e-mail e senha.";
        return;
    }
    auth.signInWithEmailAndPassword(email, password)
        .catch(error => {
            console.error("FALHA no login:", error);
            loginError.textContent = `Falha no login. Código: ${error.code}`;
        });
});

// Listener para o botão de Logout
btnAdminLogout.addEventListener('click', () => {
    auth.signOut();
});

// Listener para as ações na lista de orçamentos (Mudar status ou Cancelar)
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