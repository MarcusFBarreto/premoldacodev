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

auth.onAuthStateChanged(user => {
    if (user) {
        // Usuário está logado
        console.log('Admin logado:', user.email);
        adminUserEmail.textContent = user.email;
        loginContainer.style.display = 'none';
        adminPanel.style.display = 'block';
        fetchQuotes(); // <<-- **AQUI ESTÁ A MÁGICA!**
    } else {
        // Usuário está deslogado
        console.log('Nenhum admin logado.');
        loginContainer.style.display = 'block';
        adminPanel.style.display = 'none';
    }
});

btnAdminLogin.addEventListener('click', () => { /* ...código sem alteração... */ });
btnAdminLogout.addEventListener('click', () => { /* ...código sem alteração... */ });


// --- LÓGICA DE BUSCA E EXIBIÇÃO DOS ORÇAMENTOS ---

function fetchQuotes() {
    loader.style.display = 'block'; // Mostra o loader
    quotesListContainer.innerHTML = ''; // Limpa a lista antiga

    db.collection("orcamentos")
      .orderBy("dataCriacao", "desc") // Ordena pelos mais novos primeiro
      .get()
      .then(querySnapshot => {
          loader.style.display = 'none'; // Esconde o loader

          if (querySnapshot.empty) {
              quotesListContainer.innerHTML = '<p>Nenhum orçamento encontrado.</p>';
              return;
          }

          querySnapshot.forEach(doc => {
              const quote = doc.data();
              const quoteId = doc.id;
              
              // Cria o card para o orçamento
              const card = document.createElement('div');
              card.className = 'quote-card';
              
              // Converte o timestamp do Firebase para uma data legível
              const data = quote.dataCriacao ? quote.dataCriacao.toDate().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Data indisponível';

              // Preenche o HTML do card com os dados do orçamento
              card.innerHTML = `
                  <h3>${quote.obraName || 'Orçamento sem nome'}</h3>
                  <p><strong>ID do Orçamento:</strong> ${quoteId}</p>
                  <p><strong>Data:</strong> ${data}</p>
                  <p><strong>Cliente:</strong> ${quote.clienteNome || 'Não informado'}</p>
                  <p><strong>Telefone:</strong> ${quote.clienteTelefone || 'Não informado'}</p>
                  <p><strong>E-mail:</strong> ${quote.clienteEmail || 'Não informado'}</p>
                  <p><strong>Status:</strong> ${quote.status || 'Não informado'}</p>
                  <p><strong>Área Total:</strong> ${quote.totalArea || 'N/A'} m²</p>
                  <p><strong>Observações:</strong> ${quote.clienteObservacoes || 'Nenhuma'}</p>
                  <hr>
                  <h4>Cômodos:</h4>
                  <div>
                      ${quote.comodos.map(comodo => `
                          <p style="margin-left: 20px;">
                              - <strong>${comodo.name}:</strong> ${comodo.comprimento}m x ${comodo.largura}m | Laje: ${comodo.tipoLaje} | Blocos: ${comodo.quantidadeBlocos} | Vigotas: ${comodo.quantidadeVigotas}
                          </p>
                      `).join('')}
                  </div>
              `;

              // Adiciona o card criado à lista na tela
              quotesListContainer.appendChild(card);
          });
      })
      .catch(error => {
          loader.style.display = 'none';
          console.error("Erro ao buscar orçamentos: ", error);
          quotesListContainer.innerHTML = '<p style="color: red;">Ocorreu um erro ao carregar os orçamentos.</p>';
      });
}