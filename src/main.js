document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM carregado, iniciando script...');

  // Forçar escala inicial em dispositivos móveis
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
  window.addEventListener('resize', setViewportScale);
  console.log('Viewport configurado.');

  // Carrossel
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

    items.forEach((_, index) => {
      const dot = document.createElement('span');
      dot.classList.add('carousel-dot');
      if (index === 0) dot.classList.add('active');
      dot.setAttribute('aria-label', `Ir para imagem ${index + 1}`);
      dot.addEventListener('click', () => {
        currentIndex = index;
        showItem(currentIndex);
        resetInterval();
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

    if (items.length > 0 && prevButton && nextButton) {
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

  // Calculadora em 4 Passos
  const calcStep0 = document.getElementById('calc-step0');
  const calcStep1 = document.getElementById('calc-step1');
  const calcStep2 = document.getElementById('calc-step2');
  const calcStep3 = document.getElementById('calc-step3');
  const whatsappLink = document.getElementById('whatsapp-link');
  const progressCircles = document.querySelectorAll('.progress-circle');
  const backButtons = document.querySelectorAll('.back-button');
  const nextButtons = document.querySelectorAll('.next-button');
  const addComodo = document.getElementById('add-comodo');
  const comodosContainer = document.getElementById('comodos-container');
  const calculateButton = document.getElementById('calculate-button');

  let calcData = {};
  let comodoCount = 1;

  if (calcStep0 && calcStep1 && calcStep2 && calcStep3 && whatsappLink && progressCircles.length === 4 && backButtons.length === 3 && nextButtons.length === 3 && addComodo && comodosContainer && calculateButton) {
    console.log('Todos os elementos da calculadora encontrados.');
    const showStep = (step) => {
      console.log(`Mostrando passo ${step}`);
      const footerMenu = document.querySelector('.footer-menu');
      [calcStep0, calcStep1, calcStep2, calcStep3].forEach(s => {
        s.style.display = 'none';
        s.classList.remove('active');
      });
      progressCircles.forEach(c => c.classList.remove('active'));
      backButtons.forEach(b => b.style.display = 'none');

      if (step === 0) {
        calcStep0.style.display = 'flex';
        calcStep0.classList.add('active');
        progressCircles[0].classList.add('active');
        document.getElementById('obra-name').focus();
        if (footerMenu) footerMenu.style.display = 'flex';
      } else if (step === 1) {
        calcStep1.style.display = 'flex';
        calcStep1.classList.add('active');
        progressCircles[1].classList.add('active');
        backButtons[0].style.display = 'block';
        document.getElementById('tipo-laje').focus();
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
        document.getElementById('nome').focus();
        if (footerMenu) footerMenu.style.display = 'none';
        if (whatsappLink) {
          whatsappLink.style.display = 'inline-block';
          setTimeout(() => {
            whatsappLink.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }, 200);
        }
      }
    };

    // Passo 0: Nome da Obra
    nextButtons[0].addEventListener('click', () => {
      console.log('Passo 0: Validando nome da obra.');
      const obraInput = document.getElementById('obra-name');
      if (!obraInput.value.trim()) {
        alert('Por favor, insira um nome para a obra.');
        return;
      }
      calcData.obraName = obraInput.value.trim();
      showStep(1);
    });

    // Passo 1: Tipo de Laje
    nextButtons[1].addEventListener('click', () => {
      console.log('Passo 1: Salvando tipo de laje.');
      const tipoLaje = document.getElementById('tipo-laje').value;
      calcData.tipoLaje = tipoLaje;
      showStep(2);
    });

    // Adicionar Cômodo
    addComodo.addEventListener('click', () => {
      console.log('Adicionando cômodo. Contagem atual:', comodoCount);
      try {
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
          <button type="button" class="remove-comodo" style="display: ${comodoCount > 1 ? 'block' : 'none'};">Remover</button>
        `;
        comodosContainer.appendChild(comodoDiv);

        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = 'Cômodo adicionado!';
        document.body.appendChild(toast);
        toast.hidden = false;
        setTimeout(() => {
          toast.hidden = true;
          toast.remove();
        }, 3000);

      } catch (error) {
        console.error('Erro ao adicionar cômodo:', error);
      }
    });

    // Remover Cômodo
    comodosContainer.addEventListener('click', (e) => {
      if (e.target.classList.contains('remove-comodo')) {
        console.log('Removendo cômodo.');
        e.target.parentElement.remove();
        comodoCount--;
        if (comodoCount === 1) {
          const removeButton = document.querySelector('.comodo-item .remove-comodo');
          if (removeButton) removeButton.style.display = 'none';
        }
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = 'Cômodo removido!';
        document.body.appendChild(toast);
        toast.hidden = false;
        setTimeout(() => {
          toast.hidden = true;
          toast.remove();
        }, 3000);
      }
    });
/* Backup de caĺculos já testados  
  
// Passo 2: Inserção de Cômodos
calculateButton.addEventListener('click', () => {
  console.log('Passo 2: Calculando resultado.');
  let totalArea = 0;
  const comodos = [];
  const comodoItems = comodosContainer.getElementsByClassName('comodo-item');
  const tipoLaje = calcData.tipoLaje;
  let espacamento = (tipoLaje === 'trelicada-eps') ? 0.50 : 0.42;

  for (let i = 1; i <= comodoItems.length; i++) {
    const name = document.getElementById(`comodo-name-${i}`)?.value.trim() || `Cômodo ${i}`;
    const largura = parseFloat(document.getElementById(`largura-${i}`).value);
    const comprimento = parseFloat(document.getElementById(`comprimento-${i}`).value);
    if (comprimento && largura && !isNaN(comprimento) && !isNaN(largura)) {
      const area = comprimento * largura;
      totalArea += area;
      const quantidadeVigotas = Math.ceil(comprimento / espacamento);
      let quantidadeBlocos = null;
      let comodoTipoBloco = null;

      if (tipoLaje === 'resolver-vendedor' || tipoLaje === 'solicitar-medicao') {
        quantidadeBlocos = null;
        comodoTipoBloco = null;
      } else {
        const areaComodo = largura * comprimento;
        if (tipoLaje.includes('eps-h733')) {
          quantidadeBlocos = Math.ceil(areaComodo * 2.3);
          comodoTipoBloco = 'EPS H733';
        } else if (tipoLaje.includes('eps-h740')) {
          quantidadeBlocos = Math.ceil(areaComodo * 2);
          comodoTipoBloco = 'EPS H740';
        } else {
          quantidadeBlocos = Math.ceil(areaComodo * 12 * 1.01);
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
      alert(`Por favor, preencha corretamente as dimensões do ${name}.`);
      return;
    }
  }
  calcData.totalArea = totalArea;
  calcData.comodos = comodos;
  showStep(3);
});

*/


// Passo 2: Inserção de Cômodos
calculateButton.addEventListener('click', () => {
  console.log('Passo 2: Calculando resultado com nova lógica.');
  let totalArea = 0;
  const comodos = [];
  const comodoItems = comodosContainer.getElementsByClassName('comodo-item');
  const tipoLaje = calcData.tipoLaje;
  
  // 1. Define o espaçamento correto para cada tipo de laje
  let espacamento;
  if (tipoLaje === 'eps-h740') {
    espacamento = 0.50;
  } else {
    // Para H733 e Tijolo H8, o espaçamento é 0.42
    espacamento = 0.42;
  }

  for (let i = 0; i < comodoItems.length; i++) {
    // Usamos um seletor mais robusto para encontrar os inputs dentro de cada cômodo
    const comodoItem = comodoItems[i];
    const nameInput = comodoItem.querySelector('input[id^="comodo-name-"]');
    const larguraInput = comodoItem.querySelector('input[id^="largura-"]');
    const comprimentoInput = comodoItem.querySelector('input[id^="comprimento-"]');
    
    const name = nameInput.value.trim() || `Cômodo ${i + 1}`;
    const largura = parseFloat(larguraInput.value);
    const comprimento = parseFloat(comprimentoInput.value);

    if (comprimento && largura && !isNaN(comprimento) && !isNaN(largura)) {
      const area = comprimento * largura;
      totalArea += area;

      // 2. Nova lógica de arredondamento para a quantidade de vigotas (trilhos)
      const resultadoVigotas = comprimento / espacamento;
      
      // Opção A: A nova regra que você solicitou (arredondamento padrão)
      const quantidadeVigotas = Math.round(resultadoVigotas);
      
      // Opção B: A regra mais segura (sempre arredonda para cima). Recomendo discutir esta opção.
      // const quantidadeVigotas = Math.ceil(resultadoVigotas);

      let quantidadeBlocos = null;
      let comodoTipoBloco = null;

      if (tipoLaje === 'resolver-vendedor' || tipoLaje === 'solicitar-medicao') {
        quantidadeBlocos = null;
        comodoTipoBloco = null;
      } else {
        const areaComodo = largura * comprimento;
        if (tipoLaje.includes('eps-h733')) {
          quantidadeBlocos = Math.ceil(areaComodo * 2.2);
          comodoTipoBloco = 'EPS H733';
        } else if (tipoLaje.includes('eps-h740')) {
          quantidadeBlocos = Math.ceil(areaComodo * 2);
          comodoTipoBloco = 'EPS H740';
        } else { // tijolo-h8
          quantidadeBlocos = Math.ceil(areaComodo * 12 * 1.01);
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
      alert(`Por favor, preencha corretamente as dimensões do ${name}.`);
      return;
    }
  }
  calcData.totalArea = totalArea;
  calcData.comodos = comodos;
  showStep(3);
});




// Passo 3: Revisão e Orçamento
whatsappLink.addEventListener('click', (e) => {
  console.log('Passo 3: Gerando orçamento. Evento disparado:', e.type);
  e.preventDefault();
  const nome = document.getElementById('nome').value.trim();
  const telefone = document.getElementById('telefone').value;
  const email = document.getElementById('email').value.trim();
  const observacoes = document.getElementById('observacoes').value.trim();

  if (!nome || !/^[0-9]{10,11}$/.test(telefone) || !email.includes('@')) {
    alert('Por favor, preencha todos os campos de contato corretamente.');
    return;
  }

  calcData.nome = nome;
  calcData.telefone = telefone;
  calcData.email = email;
  calcData.observacoes = observacoes;

  const tipoLaje = calcData.tipoLaje;
  let comodosListDisplay;
  let comodosListWhatsapp;

  if (tipoLaje === 'solicitar-medicao') {
    comodosListDisplay = ['Gostaria de solicitar uma visita para medição.'];
    comodosListWhatsapp = ['Gostaria de solicitar uma visita para medição.'];
  } else {
    comodosListDisplay = calcData.comodos.map(comodo =>
      `${comodo.name}: Largura ${comodo.largura}m x Comp. ${comodo.comprimento}m (Área: ${comodo.area}m²)` +
      `<br>Vigotas: ${comodo.quantidadeVigotas} (${comodo.tamanhoTrilho}m)`
    );

    comodosListWhatsapp = calcData.comodos.map(comodo =>
      `*${comodo.name}:*\n` +
      `Largura ${comodo.largura}m x Comp. ${comodo.comprimento}m (Área: ${comodo.area}m²)\n` +
      `Vigotas: ${comodo.quantidadeVigotas} (${comodo.tamanhoTrilho}m)`
    );
  }

  const modal = document.getElementById('budget-modal');
  const modalObraName = document.getElementById('modal-obra-name');
  const modalComodosList = document.getElementById('modal-comodos-list');
  const modalTotalArea = document.getElementById('modal-total-area');
  const modalContact = document.getElementById('modal-contact');
  const modalObservacoes = document.getElementById('modal-observacoes');

  modalContact.innerHTML = `Contato:<br>${nome}<br>Telefone: ${telefone}<br>E-mail: ${email}`;
  modalObraName.innerHTML = `Solicita ${tipoLaje === 'solicitar-medicao' ? 'medição para' : 'orçamento para'}:<br>${calcData.obraName}`;
  modalComodosList.innerHTML = comodosListDisplay.map(item => `<li>${item}</li>`).join('');

  let totalBlocos = 0;
  let blocosInfo = '';
  if (tipoLaje === 'resolver-vendedor' || tipoLaje === 'solicitar-medicao') {
    blocosInfo = 'Blocos: Não inclusos';
  } else {
    totalBlocos = calcData.comodos.reduce((sum, comodo) => sum + (comodo.quantidadeBlocos || 0), 0);
    let tipoBlocoResumo = '';
    if (tipoLaje.includes('eps-h733')) tipoBlocoResumo = 'EPS H733';
    else if (tipoLaje.includes('eps-h740')) tipoBlocoResumo = 'EPS H740';
    else if (tipoLaje === 'tijolo-h8') tipoBlocoResumo = 'Cerâmico';
    blocosInfo = `Total de Blocos: ${totalBlocos || 'N/A'} ${tipoBlocoResumo ? `(${tipoBlocoResumo})` : ''}`;
  }

  modalTotalArea.innerHTML = tipoLaje === 'solicitar-medicao' ? '' : 
    `Área Total: ${calcData.totalArea.toFixed(2)}m²`;
  if (blocosInfo) {
    modalTotalArea.innerHTML += `<br>${blocosInfo}`;
  }

  modalObservacoes.innerHTML = observacoes ? `Observações:<br>${observacoes}` : '';

  modal.style.display = 'flex';
  console.log('Modal exibido');

  const confirmBudget = document.getElementById('confirm-budget');
  confirmBudget.onclick = () => {
    console.log('Confirmando orçamento');
    const mensagem = [
      `${nome}`,
      `Telefone: ${telefone}\nE-mail: ${email}`,
      '- - -',
      `Solicitação: ${tipoLaje === 'solicitar-medicao' ? 'Medição para' : 'Orçamento para'} ${calcData.obraName}`,
      '- - -',
      comodosListWhatsapp.join('\n\n'), // Duas quebras de linha para separação
      '- - -',
      tipoLaje === 'solicitar-medicao' ? '' : `Área Total: ${calcData.totalArea.toFixed(2)}m²`,
      blocosInfo,
      observacoes ? '- - -' : '',
      observacoes ? `Observações: ${observacoes}` : ''
    ].filter(line => line.trim()).join('\n');
    whatsappLink.href = `https://wa.me/5585992947431?text=${encodeURIComponent(mensagem)}`;
    window.open(whatsappLink.href, '_blank');
    modal.style.display = 'none';
  };

   // --- NOVO CÓDIGO: Chamando a função do app Android ---
    // Verificamos se a nossa "ponte" (o objeto 'Android') existe antes de chamá-la.
    // Isso garante que o site não quebre se for aberto em um navegador normal.
    if (window.Android && typeof window.Android.playSound === 'function') {
        console.log('Chamando a função playSound() do Android.');
        window.Android.playSound();
    }

  const closeModal = document.querySelector('.close-modal');
  closeModal.onclick = () => {
    modal.style.display = 'none';
  };

  window.onclick = (event) => {
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  };
});

// Navegação com botões Voltar
backButtons.forEach((button, index) => {
  button.addEventListener('click', () => {
    console.log('Botão Voltar clicado:', index);
    if (index === 0 && calcStep1.classList.contains('active')) showStep(0);
    else if (index === 1 && calcStep2.classList.contains('active')) showStep(1);
    else if (index === 2 && calcStep3.classList.contains('active')) showStep(2);
  });
});

// Navegação com círculos
progressCircles.forEach(circle => {
  circle.addEventListener('click', () => {
    console.log('Círculo clicado:', circle.getAttribute('data-step'));
    const step = parseInt(circle.getAttribute('data-step'));
    if (step === 0) {
      showStep(step);
    } else if (step === 1 && calcData.obraName) {
      showStep(step);
    } else if (step === 2 && calcData.tipoLaje) {
      showStep(step);
    } else if (step === 3 && calcData.comodos && calcData.comodos.length > 0 && calcData.totalArea) {
      showStep(step);
    }
  });
});

showStep(0); // Inicia no Passo 0
} else {
  console.error('Erro: Elementos da calculadora não encontrados:', {
    calcStep0, calcStep1, calcStep2, calcStep3, whatsappLink, progressCircles, backButtons, nextButtons, addComodo, comodosContainer, calculateButton
  });
}

// Formulário de Contato
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const nome = e.target.nome.value;
    const email = e.target.email.value;
    const mensagem = e.target.mensagem.value;
    alert(`Mensagem enviada!\nNome: ${nome}\nE-mail: ${email}\nMensagem: ${mensagem}`);
    e.target.reset();
  });
}
});