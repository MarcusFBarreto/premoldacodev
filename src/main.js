import './styles.css'; // Corrigido para o caminho correto

// --- FUNÇÕES GLOBAIS PARA INTEGRAÇÃO COM ANDROID ---
window.preencherDadosUsuario = function(email, nome, telefone) {
    console.log(`Recebendo dados para pré-preenchimento: ${email}, ${nome}, ${telefone}`);
    const campoEmail = document.getElementById('email');
    const campoNome = document.getElementById('nome');
    const campoTelefone = document.getElementById('telefone');

    if (campoEmail && email) campoEmail.value = email;
    if (campoNome && nome) campoNome.value = nome;
    if (campoTelefone && telefone) campoTelefone.value = telefone;
};

window.updateSubmitButton = function(state, message = '') {
    // CORREÇÃO: Usando o ID correto do HTML
    const submitQuoteBtn = document.getElementById('submit-quote-btn');
    if (!submitQuoteBtn) return;
    let errorMsgEl = document.getElementById('submit-error-msg');
    if (!errorMsgEl) {
        errorMsgEl = document.createElement('p');
        errorMsgEl.id = 'submit-error-msg';
        errorMsgEl.style.color = 'red';
        errorMsgEl.style.marginTop = '10px';
        submitQuoteBtn.after(errorMsgEl);
    }
    errorMsgEl.textContent = '';

    switch (state) {
        case 'sending':
            submitQuoteBtn.textContent = 'Aguardando envio...';
            submitQuoteBtn.disabled = true;
            break;
        case 'success':
            submitQuoteBtn.textContent = 'Enviado! ✅';
            submitQuoteBtn.disabled = true;
            break;
        case 'error':
            submitQuoteBtn.textContent = 'Tente Novamente';
            submitQuoteBtn.disabled = false;
            errorMsgEl.textContent = message || 'Falha no envio. Verifique sua conexão e tente novamente.';
            break;
        case 'idle':
        default:
            submitQuoteBtn.textContent = 'Enviar Orçamento';
            submitQuoteBtn.disabled = false;
            break;
    }
};

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM carregado, iniciando script...');

    // 3.1. INICIALIZAÇÃO DO FIREBASE (DENTRO DO DOMContentLoaded, MAS NO INÍCIO DELE)
    const firebaseConfig = {
       apiKey: "AIzaSyBbcXKzor-xgsQzip6c7gZbn4iRVFr2Tfo",
       authDomain: "premoldaco-webapp.firebaseapp.com",
       projectId: "premoldaco-webapp",
       storageBucket: "premoldaco-webapp.appspot.com",
       messagingSenderId: "918710823829",
       appId: "1:918710823829:web:b41e60568d4b0d30c9a49c",
       measurementId: "G-VJ4ETSMZT7"
    };
    // Certifique-se de que o SDK do Firebase (firebase-app-compat.js e firebase-firestore-compat.js)
    // está incluído no SEU HTML ANTES do main.js, como discutimos.
    firebase.initializeApp(firebaseConfig);
    const db = firebase.firestore(); // Agora `db` estará disponível para o resto do código.


    // --- CONFIGURAÇÃO DO VIEWPORT ---
    const setViewportScale = () => {
        const viewport = document.querySelector('meta[name="viewport"]');
        if (viewport) {
            viewport.setAttribute(
                'content',
                'width=device-width, initial-scale=1.0, maximum-scale=2.0, minimum-scale=1.0, user-scalable=yes'
            );
        }
    };

    setViewportScale();
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(setViewportScale, 200);
    });
    console.log('Viewport configurado.');

    // --- CARROSSEL ---
    const carousel = document.querySelector('.carousel');
    if (carousel) {
        console.log('Carrossel encontrado.');
        const items = carousel.querySelectorAll('.carousel-item');
        const prevButton = carousel.querySelector('.carousel-prev');
        const nextButton = carousel.querySelector('.carousel-next');
        const dotsContainer = document.createElement('div');
        dotsContainer.classList.add('carousel-dots');
        carousel.appendChild(dotsContainer);

        let currentIndex = 0;
        let intervalId = null;
        const autoSlideTime = 4000;

        if (items.length > 0 && prevButton && nextButton) {
            items.forEach((_, index) => {
                const dot = document.createElement('span');
                dot.classList.add('carousel-dot');
                if (index === 0) dot.classList.add('active');
                dot.setAttribute('aria-label', `Ir para imagem ${index + 1}`);
                dot.setAttribute('role', 'button');
                dot.setAttribute('tabindex', '0');
                dot.addEventListener('click', () => {
                    currentIndex = index;
                    showItem(currentIndex);
                    resetInterval();
                });
                dot.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        currentIndex = index;
                        showItem(currentIndex);
                        resetInterval();
                    }
                });
                dotsContainer.appendChild(dot);
            });

            const showItem = (index) => {
                items.forEach((item, i) => {
                    item.classList.toggle('active', i === index);
                    const img = item.querySelector('img');
                    if (img) {
                        img.style.width = '100%';
                        img.style.height = 'auto';
                    }
                });
                const dots = dotsContainer.querySelectorAll('.carousel-dot');
                dots.forEach((dot, i) => {
                    dot.classList.toggle('active', i === index);
                });
                carousel.setAttribute('aria-live', 'polite');
            };

            const nextItem = () => {
                currentIndex = (currentIndex + 1) % items.length;
                showItem(currentIndex);
            };

            const prevItem = () => {
                currentIndex = (currentIndex - 1 + items.length) % items.length;
                showItem(currentIndex);
            };

            const startInterval = () => {
                intervalId = setInterval(nextItem, autoSlideTime);
            };

            const resetInterval = () => {
                clearInterval(intervalId);
                startInterval();
            };

            prevButton.addEventListener('click', () => {
                prevItem();
                resetInterval();
            });

            nextButton.addEventListener('click', () => {
                nextItem();
                resetInterval();
            });

            carousel.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowLeft') {
                    prevItem();
                    resetInterval();
                } else if (e.key === 'ArrowRight') {
                    nextItem();
                    resetInterval();
                }
            });

            carousel.addEventListener('mouseenter', () => clearInterval(intervalId));
            carousel.addEventListener('mouseleave', startInterval);

            startInterval();
        } else {
            console.warn('Carrossel: itens ou botões não encontrados.');
        }
    } else {
        console.log('Nenhum carrossel encontrado.');
    }

    // --- LÓGICA DA CALCULADORA ---
    const calculatorPanel = document.getElementById('calculator');
    if (calculatorPanel) {
        const calcStep0 = document.getElementById('calc-step0');
        const calcStep1 = document.getElementById('calc-step1');
        const calcStep2 = document.getElementById('calc-step2');
        const calcStep3 = document.getElementById('calc-step3');
        const progressCircles = document.querySelectorAll('.progress-circle');
        const backButtons = document.querySelectorAll('.back-button');
        const nextButtons = document.querySelectorAll('.next-button');
        const addComodo = document.getElementById('add-comodo');
        const comodosContainer = document.getElementById('comodos-container');
        const calculateButton = document.getElementById('calculate-button');
        const submitQuoteBtn = document.getElementById('submit-quote-btn');

        let calcData = {};
        let comodoCount = 1;

        const showStep = (step) => {
            console.log(`Mostrando passo ${step}`);
            const footerMenu = document.querySelector('.footer-menu');
            [calcStep0, calcStep1, calcStep2, calcStep3].forEach(s => {
                if (s) {
                    s.style.display = 'none';
                    s.classList.remove('active');
                }
            });
            progressCircles.forEach(c => c.classList.remove('active'));
            backButtons.forEach(b => b.style.display = 'none');

            if (step === 0) {
                calcStep0.style.display = 'flex';
                calcStep0.classList.add('active');
                progressCircles[0].classList.add('active');
                document.getElementById('obra-name')?.focus();
                if (footerMenu) footerMenu.style.display = 'flex';
            } else if (step === 1) {
                calcStep1.style.display = 'flex';
                calcStep1.classList.add('active');
                progressCircles[1].classList.add('active');
                backButtons[0].style.display = 'block';
                document.getElementById('tipo-laje')?.focus();
                if (footerMenu) footerMenu.style.display = 'flex';
            } else if (step === 2) {
                if (calcData.tipoLaje !== 'solicitar-medicao') {
                    calcStep2.style.display = 'flex';
                    calcStep2.classList.add('active');
                    progressCircles[2].classList.add('active');
                    backButtons[1].style.display = 'block';
                    if (footerMenu) footerMenu.style.display = 'none';
                } else {
                    showStep(3);
                }
            } else if (step === 3) {
                calcStep3.style.display = 'flex';
                calcStep3.classList.add('active');
                progressCircles[3].classList.add('active');
                backButtons[2].style.display = 'block';
                document.getElementById('nome')?.focus();
                if (footerMenu) footerMenu.style.display = 'none';
                if (submitQuoteBtn) {
                    submitQuoteBtn.style.display = 'inline-block';
                    setTimeout(() => {
                        submitQuoteBtn.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }, 200);
                }
            }
        };

        nextButtons[0].addEventListener('click', () => {
            const obraInput = document.getElementById('obra-name');
            if (!obraInput?.value.trim()) {
                alert('Por favor, insira um nome para a obra.');
                return;
            }
            calcData.obraName = obraInput.value.trim();
            showStep(1);
        });

        nextButtons[1].addEventListener('click', () => {
            const tipoLaje = document.getElementById('tipo-laje')?.value;
            if (!tipoLaje) {
                alert('Por favor, selecione um tipo de laje.');
                return;
            }
            calcData.tipoLaje = tipoLaje;
            showStep(2);
        });

        addComodo.addEventListener('click', () => {
            comodoCount++;
            const comodoDiv = document.createElement('div');
            comodoDiv.classList.add('comodo-item');
            comodoDiv.innerHTML = `
                <label for="comodo-name-${comodoCount}">Nome do Cômodo (opcional):</label>
                <input type="text" id="comodo-name-${comodoCount}" placeholder="Ex.: Sala">
                <label for="largura-${comodoCount}">Largura (m):</label>
                <input type="number" id="largura-${comodoCount}" min="0.1" max="20" step="0.01" required aria-required="true" placeholder="Ex.: 4.00">
                <label for="comprimento-${comodoCount}">Comprimento (m):</label>
                <input type="number" id="comprimento-${comodoCount}" min="0.1" max="20" step="0.01" required aria-required="true" placeholder="Ex.: 5.00">
                <button type="button" class="remove-comodo">Remover</button>
            `;
            comodosContainer.appendChild(comodoDiv);
        });

        comodosContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('remove-comodo') && comodosContainer.children.length > 1) {
                e.target.parentElement.remove();
            }
        });

        calculateButton.addEventListener('click', () => {
            let totalArea = 0;
            const comodos = [];
            const comodoItems = comodosContainer.getElementsByClassName('comodo-item');
            const tipoLaje = calcData.tipoLaje;
            let espacamento = tipoLaje === 'eps-h740' ? 0.50 : 0.42;

            for (let i = 0; i < comodoItems.length; i++) {
                const comodoItem = comodoItems[i];
                const nameInput = comodoItem.querySelector('input[id^="comodo-name-"]');
                const larguraInput = comodoItem.querySelector('input[id^="largura-"]');
                const comprimentoInput = comodoItem.querySelector('input[id^="comprimento-"]');
                const name = nameInput.value.trim() || `Cômodo ${i + 1}`;
                const largura = parseFloat(larguraInput.value);
                const comprimento = parseFloat(comprimentoInput.value);

                if (!isNaN(largura) && !isNaN(comprimento) && largura >= 0.1 && largura <= 20 && comprimento >= 0.1 && comprimento <= 20) {
                    const area = comprimento * largura;
                    totalArea += area;
                    const quantidadeVigotas = Math.round(comprimento / espacamento);
                    let quantidadeBlocos = null;
                    let comodoTipoBloco = null;

                    if (!['resolver-vendedor', 'solicitar-medicao'].includes(tipoLaje)) {
                        if (tipoLaje.includes('eps-h733')) {
                            quantidadeBlocos = Math.ceil(area * 2.2);
                            comodoTipoBloco = 'EPS H733';
                        } else if (tipoLaje.includes('eps-h740')) {
                            quantidadeBlocos = Math.ceil(area * 2);
                            comodoTipoBloco = 'EPS H740';
                        } else {
                            quantidadeBlocos = Math.ceil(area * 12 * 1.01);
                            comodoTipoBloco = 'Cerâmico';
                        }
                    }

                    comodos.push({
                        name,
                        comprimento: comprimento.toFixed(2),
                        largura: largura.toFixed(2),
                        area: area.toFixed(2),
                        tamanhoTrilho: largura.toFixed(2),
                        quantidadeVigotas,
                        quantidadeBlocos,
                        tipoBloco: comodoTipoBloco
                    });
                } else {
                    alert(`Por favor, preencha corretamente as dimensões do ${name}. Valores devem ser entre 0.1 e 20 metros.`);
                    return;
                }
            }

            calcData.totalArea = totalArea;
            calcData.comodos = comodos;
            showStep(3);
        });

       if (submitQuoteBtn) {
            submitQuoteBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Botão "Enviar Orçamento" clicado.');

                // 1. Coleta e Valida os Dados do Formulário (Nome, Telefone, Email, Observações)
                const nome = document.getElementById('nome')?.value.trim();
                const telefone = document.getElementById('telefone')?.value;
                const email = document.getElementById('email')?.value.trim();
                const observacoes = document.getElementById('observacoes')?.value.trim();

                const telefoneRaw = telefone ? telefone.replace(/\D/g, '') : '';
                if (!nome || !/^[0-9]{10,11}$/.test(telefoneRaw) || !email?.includes('@')) {
                    alert('Por favor, preencha todos os campos de contato corretamente. O telefone deve ter 10 ou 11 dígitos.');
                    return;
                }

                // 2. Prepara o Objeto de Dados para Envio (Lead Data)
                // Usando 'calcData' que deve ter sido populado pelo botão 'Calcular'
                const orcamentoData = { // Renomeado para orcamentoData para corresponder ao seu código
                    clienteNome: nome,
                    clienteTelefone: telefoneRaw,
                    clienteEmail: email,
                    clienteObservacoes: observacoes,
                    obraName: calcData.obraName || 'Não Informado', // Adiciona fallback para caso calcData não tenha sido totalmente populado
                    tipoLaje: calcData.tipoLaje || 'Não Informado',
                    totalArea: calcData.totalArea ? calcData.totalArea.toFixed(2) : '0.00',
                    comodos: calcData.comodos || [],
                    status: 'NOVO'
                };

                // 3. Lógica Condicional para Ambiente Android vs. Web
                if (window.Android && typeof window.Android.submitQuote === 'function') {
                    // Ambiente Android detectado
                    console.log('Ambiente Android detectado. Enviando para o aplicativo...');
                    try {
                        updateSubmitButton('sending');
                        window.Android.submitQuote(JSON.stringify(orcamentoData));
                        setTimeout(() => {
                            if (submitQuoteBtn.textContent === 'Aguardando envio...') {
                                updateSubmitButton('idle');
                                console.warn('Timeout: Nenhuma resposta do Android após 10 segundos.');
                            }
                        }, 10000);
                    } catch (error) {
                        console.error('Erro ao enviar orçamento para o Android:', error);
                        updateSubmitButton('error', 'Erro interno no app. Tente novamente.');
                    }
                    // MUITO IMPORTANTE: Retornar aqui para não executar a lógica web SE FOR o app Android.
                    return; 
                }
                
                // 4. Lógica de Envio para a WEB (Firebase/WhatsApp)
                // Esta parte será executada APENAS se o ambiente Android NÃO for detectado
                console.log('Ambiente Web detectado. Salvando no Firebase e mostrando modal de resumo...');
                updateSubmitButton('sending'); // Atualiza o botão para "Enviando..."

                // ATENÇÃO: Adicione a inicialização do Firebase aqui, se ela ainda não estiver.
                // No código que você me enviou da versão estável, a inicialização do Firebase
                // parece ter sido removida do DOMContentLoaded. Vamos recolocá-la.

                // INICIALIZAÇÃO DO FIREBASE (COLOCAR AQUI OU NO INÍCIO DO DOMContentLoaded)
                // Se a seção INICIALIZAÇÃO DO FIREBASE NÃO ESTIVER NO SEU CÓDIGO, ADICIONE-A!
                // const firebaseConfig = { ... }; // Use suas credenciais
                // firebase.initializeApp(firebaseConfig);
                // const db = firebase.firestore();
                // ^^^ Certifique-se de que `db` está acessível aqui ^^^

                // Se db não estiver definido aqui, mova a inicialização do Firebase
                // para o início do document.addEventListener('DOMContentLoaded', () => { ... });
                // como estava nas versões anteriores que eu te enviei.

                // Simulação de envio para Firebase (se db não estiver inicializado)
                // Remova este bloco se o Firebase estiver realmente configurado e você quer usá-lo.
                /*
                console.log('Simulando envio para Firebase...');
                setTimeout(() => {
                    console.log('Lead simulado salvo:', orcamentoData);
                    updateSubmitButton('success');
                    showSummaryModal(orcamentoData); // Chama o modal para WhatsApp
                }, 1500);
                */

                // Lógica de envio REAL para Firebase:
                db.collection("webleads").add(orcamentoData) // Usando orcamentoData
                    .then(() => {
                        updateSubmitButton('success');
                        showSummaryModal(orcamentoData); // Mostra o modal de resumo com link para WhatsApp
                    })
                    .catch((error) => {
                        console.error("Erro ao salvar lead no Firebase: ", error);
                        updateSubmitButton('error', 'Falha no envio. Verifique sua conexão e tente novamente.');
                    });
            });
        }

        backButtons.forEach((button, index) => {
            button.addEventListener('click', () => {
                showStep(index);
            });
        });

        progressCircles.forEach(circle => {
            circle.setAttribute('role', 'button');
            circle.setAttribute('tabindex', '0');
            circle.addEventListener('click', () => {
                const step = parseInt(circle.getAttribute('data-step'));
                if (step === 0 || (step === 1 && calcData.obraName) || (step === 2 && calcData.tipoLaje) || (step === 3 && calcData.comodos)) {
                    showStep(step);
                } else {
                    alert('Por favor, complete os passos anteriores antes de prosseguir.');
                }
            });
            circle.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    const step = parseInt(circle.getAttribute('data-step'));
                    if (step === 0 || (step === 1 && calcData.obraName) || (step === 2 && calcData.tipoLaje) || (step === 3 && calcData.comodos)) {
                        showStep(step);
                    } else {
                        alert('Por favor, complete os passos anteriores antes de prosseguir.');
                    }
                }
            });
        });

        showStep(0);
    } else {
        console.log('Calculadora não encontrada nesta página.');
    }

    // --- FORMULÁRIO DE CONTATO ---
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const nome = e.target.nome.value?.trim();
            const email = e.target.email.value?.trim();
            const mensagem = e.target.mensagem.value?.trim();
            if (!nome || !email?.includes('@') || !mensagem) {
                alert('Por favor, preencha todos os campos do formulário de contato corretamente.');
                return;
            }
            alert(`Mensagem enviada!\nNome: ${nome}\nE-mail: ${email}\nMensagem: ${mensagem}`);
            e.target.reset();
        });
    }

    // --- NOTIFICAÇÃO DE CARREGAMENTO COMPLETO ---
    if (window.Android && typeof window.Android.pageLoaded === 'function') {
        console.log('Página e scripts prontos. Avisando o App Android...');
        try {
            window.Android.pageLoaded();
        } catch (error) {
            console.error('Erro ao notificar pageLoaded:', error);
        }
    }
});