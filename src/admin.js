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
 * Busca e exibe os orçamentos do Firestore.
 * @param {string} role - A função do usuário logado (ex: 'superadmin')
 */
function fetchQuotes(role) {
    console.log(`Buscando orçamentos com a função: ${role}`);
    loader.style.display = 'block';
    quotesListContainer.innerHTML = '';

     let query = db.collection("orcamentos").orderBy("dataCriacao", "desc");

    query.get().then(querySnapshot => {
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
            const statusAtual = quote.status || 'NOVO';
            const statusClass = statusAtual.toLowerCase().replace(/\s+/g, '-');

              // --- LÓGICA DE PERMISSÃO PARA O BOTÃO CANCELAR ---
            // 1. Criamos uma variável para o HTML do botão.
            let cancelButtonHTML = '';
            
            // 2. Verificamos se a função do usuário é 'superadmin'.
            if (role === 'superadmin') {
                cancelButtonHTML = `<button class="cancel-button" data-id="${quoteId}">Cancelar</button>`;
            }

                // 3. Inserimos a variável no HTML do card. Se não for superadmin, ela estará vazia.
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
                            <option value="NOVO" ${statusAtual === 'NOVO' ? 'selected' : ''}>Novo</option>
                            <option value="EM ANÁLISE" ${statusAtual === 'EM ANÁLISE' ? 'selected' : ''}>Em Análise</option>
                            <option value="APROVADO" ${statusAtual === 'APROVADO' ? 'selected' : ''}>Aprovado</option>
                            <option value="EM PRODUÇÃO" ${statusAtual === 'EM PRODUÇÃO' ? 'selected' : ''}>Em Produção</option>
                            <option value="PRONTO P/ ENTREGA" ${statusAtual === 'PRONTO P/ ENTREGA' ? 'selected' : ''}>Pronto p/ Entrega</option>
                            <option value="FINALIZADO" ${statusAtual === 'FINALIZADO' ? 'selected' : ''}>Finalizado</option>
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
        quotesListContainer.innerHTML = '<p style="color: red;">Erro ao carregar orçamentos. Verifique as regras e o índice do Firestore.</p>';
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
    })
    .catch(error => {
        console.error("Erro ao atualizar status: ", error);
        alert("Não foi possível atualizar o status.");
    });
}


// --- EVENT LISTENERS (OS "OUVINTES") ---

// O "maestro" da autenticação.
auth.onAuthStateChanged(user => {
    if (user) {
        const userRef = db.collection("equipe").doc(user.uid);
        userRef.get().then((doc) => {
            if (doc.exists) {
                const userRole = doc.data().funcao;
                console.log(`Acesso concedido: ${user.email}, Função: ${userRole}`);
                adminUserEmail.textContent = `${user.email} (${userRole})`;
                loginContainer.style.display = 'none';
                adminPanel.style.display = 'block';
                fetchQuotes(userRole);
            } else {
                console.error("ACESSO NEGADO! Usuário não faz parte da equipe.");
                alert("Você não tem permissão para acessar este painel.");
                auth.signOut();
            }
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