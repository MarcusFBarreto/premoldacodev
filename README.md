Descrição

O Premoldaço Web Dev é o repositório para o desenvolvimento do site oficial da Premoldaço, uma empresa especializada em materiais pré-moldados como lajes treliçadas, blocos de EPS e cerâmicos. O site serve como landing page para promover produtos, diferenciais e depoimentos, com uma calculadora interativa de orçamentos integrada ao Firebase para envio e gerenciamento em tempo real. Ele complementa o app mobile Premoldaço v3, permitindo carregamento via WebView e notificações push.

O foco é em simplicidade, responsividade e integração com ferramentas modernas como Firebase para backend dinâmico (autenticação, banco de dados e notificações).
Funcionalidades Principais

    Landing Page Principal: Hero section com slogan, carrossel de passos para orçamentos, destaques (agilidade, qualidade), avaliações de clientes, grid de produtos e seção sobre/contato.
    Calculadora de Orçamentos: Interface passo a passo para calcular áreas, vigotas e blocos (EPS/cerâmicos), com envio de JSON ao Firebase via interface JS-Android.
    Painel Admin: Login Firebase com roles (vendas, produção, transporte, superadmin) para listar e atualizar status de orçamentos no Firestore, incluindo placa de veículo em entregas.
    Notificações e Integração: Suporte a pushes via FCM (configurado em functions separadas), toasts de sucesso/erro e modal de confirmação.
    SEO e Erros: Sitemap.xml para crawling, robots.txt permitindo tudo, e página 404 customizada.
    Contato Integrado: Formulário simples e botões WhatsApp..
    Páginas Adicionais: Promoções (pushin.html) e erro 404.

Tecnologias Utilizadas

    Frontend: HTML5, CSS3 (variáveis, flex/grid, animações keyframes), JavaScript vanilla (sem frameworks para leveza).
    Estilos: CSS customizado com temas escuros (preto #1d1d1d, laranja #ff8c57, verde WhatsApp #25D366), responsivo via media queries.
    Scripts:
        main.js: Gerencia carrossel, calculadora multi-passo, envio de orçamentos e integração Android (ex.: window.Android.submitQuote).
        admin.js: Listener Firestore para orçamentos, atualização de status por role e prompts para placa de veículo.
    Backend: Firebase (Auth, Firestore, Cloud Messaging) — config apiKey "AIzaSyBbcXKzor-xgsQzip6c7gZbn4iRVFr2Tfo", projectId "premoldaco-webapp".
    Outras: Gson (para JSON), acessibilidade (aria-label, keydown) e viewport escalável.

Pré-requisitos

    Navegador moderno (Chrome, Firefox) para desenvolvimento/testes.
    Conta Firebase configurada (para auth, Firestore e functions).
    Git para clonar o repositório.
    Node.js (opcional, para deploy de functions ou minificação futura).

Instalação e Configuração

    Clone o Repositório:
    text

    git clone https://github.com/MarcusFBarreto/premoldacodev.git
    cd premoldacodev
    Abra os Arquivos:
        Use um editor como VS Code para editar HTML/CSS/JS.
        Abra index.html ou calculadora.html no navegador para testar localmente.
    Configure Firebase:
        No Firebase Console, adicione um web app ao projeto "premoldaco-webapp".
        Atualize a config em admin.js e main.js se necessário (mas evite expor apiKey em produção — use env vars).
        Para o painel admin, crie documentos em /equipe com roles (ex.: {funcao: 'vendas'}).
    Deploy do Site:
        Hospede em plataformas como GitHub Pages, Vercel ou Netlify (arraste os arquivos para deploy estático).
        Para functions (notificações), use pasta separada e firebase deploy --only functions.
    Teste Local:
        Abra no navegador: file:///caminho/para/index.html.
        Para Firebase, use emuladores: firebase emulators:start.

Uso

    Página Principal: Acesse home para ver promoções, produtos e contato.
    Calculadora: Vá para calculadora.html — insira dados da obra, cômodos e envie orçamento (integra com app mobile para push).
    Admin: Acesse admin.html — logue com credenciais Firebase; liste/atualize orçamentos por role.
    Teste de Envio: Envie um orçamento e verifique no Firestore (/orcamentos); mude status para trigger push.

Exemplo de Fluxo:

    Abra calculadora.html.
    Preencha passos (obra, laje, cômodos, contato).
    Envie — dados salvos no Firestore com status "NOVO".
    No admin, atualize para "EM ANÁLISE" — notificação push enviada.

Contribuição

Contribuições são bem-vindas! Siga estes passos:

    Fork o repositório.
    Crie um branch: git checkout -b feature/nova-funcionalidade.
    Commit suas mudanças: git commit -m "Adiciona nova feature".
    Push para o branch: git push origin feature/nova-funcionalidade.
    Abra um Pull Request.

Relate issues no GitHub Issues.
Licença

Este projeto está licenciado sob a MIT License — veja o arquivo LICENSE para detalhes (adicione um se não existir).
Contato

    Desenvolvedor: Marcus F. Barreto
    WhatsApp: +55 85 99271-2043
    E-mail: marcus1fialho@gmail.com
    Site: premoldaco.com.br

Agradeço por contribuir com o Premoldaço Web Dev! Se precisar de ajuda, abra uma issue.
