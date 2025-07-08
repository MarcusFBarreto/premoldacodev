export class CalculatorController {
  constructor(rootElement) {
    this.root = rootElement;
    this.steps = this.root.querySelectorAll('.calc-step');
    this.circles = this.root.querySelectorAll('.progress-circle');
    this.buttons = {
      next: this.root.querySelectorAll('.next-button'),
      back: this.root.querySelectorAll('.back-button'),
      calculate: this.root.querySelector('#calculate-button'),
      submit: this.root.querySelector('#submit-quote-btn'),
      addComodo: this.root.querySelector('#add-comodo')
    };
    this.containerComodos = this.root.querySelector('#comodos-container');
    this.calcData = { comodos: [] };
    this.comodoCount = 1;
    this.bindEvents();
    this.showStep(0);
  }

  bindEvents() {
    this.buttons.next[0].addEventListener('click', () => {
      const obra = this.root.querySelector('#obra-name')?.value.trim();
      if (!obra) return alert('Insira o nome da obra');
      this.calcData.obraName = obra;
      this.showStep(1);
    });

    this.buttons.next[1].addEventListener('click', () => {
      const tipo = this.root.querySelector('#tipo-laje')?.value;
      if (!tipo) return alert('Selecione o tipo de laje');
      this.calcData.tipoLaje = tipo;
      this.showStep(2);
    });

    this.buttons.calculate.addEventListener('click', () => this.processComodos());

    this.buttons.submit?.addEventListener('click', (e) => this.submitQuote(e));

    this.buttons.back.forEach((btn, i) => {
      btn.addEventListener('click', () => this.showStep(i));
    });

    this.circles.forEach((circle) => {
      const step = parseInt(circle.dataset.step);
      circle.setAttribute('role', 'button');
      circle.setAttribute('tabindex', '0');
      circle.addEventListener('click', () => this.canNavigateTo(step) && this.showStep(step));
      circle.addEventListener('keydown', (e) => ['Enter', ' '].includes(e.key) && this.canNavigateTo(step) && this.showStep(step));
    });

    this.buttons.addComodo.addEventListener('click', () => this.addComodo());
    this.containerComodos.addEventListener('click', (e) => {
      if (e.target.classList.contains('remove-comodo')) {
        e.target.closest('.comodo-item')?.remove();
      }
    });
  }

  showStep(index) {
    this.steps.forEach((step, i) => {
      step.classList.toggle('active', i === index);
    });
    this.circles.forEach((c, i) => c.classList.toggle('active', i === index));

    if (index === 3 && this.buttons.submit) {
      this.buttons.submit.style.display = 'inline-block';
      setTimeout(() => this.buttons.submit.scrollIntoView({ behavior: 'smooth' }), 200);
    }
  }

  addComodo() {
    this.comodoCount++;
    const id = this.comodoCount;
    const div = document.createElement('div');
    div.className = 'comodo-item';
    div.innerHTML = `
      <label for="largura-${id}">Largura (m):</label>
      <input type="number" id="largura-${id}" min="0.1" max="20" step="0.01" required>
      <label for="comprimento-${id}">Comprimento (m):</label>
      <input type="number" id="comprimento-${id}" min="0.1" max="20" step="0.01" required>
      <button type="button" class="remove-comodo">Remover</button>
    `;
    this.containerComodos.appendChild(div);
  }

  processComodos() {
    const tipo = this.calcData.tipoLaje;
    const espacamento = tipo === 'eps-h740' ? 0.5 : 0.42;
    const comodos = [];
    let totalArea = 0;
    const items = this.containerComodos.querySelectorAll('.comodo-item');

    for (let i = 0; i < items.length; i++) {
      const largura = parseFloat(items[i].querySelector(`#largura-${i + 1}`)?.value);
      const comprimento = parseFloat(items[i].querySelector(`#comprimento-${i + 1}`)?.value);

      if (isNaN(largura) || isNaN(comprimento)) {
        alert('Preencha as dimensões corretamente.');
        return;
      }

      const area = largura * comprimento;
      totalArea += area;
      const vigotas = Math.round(comprimento / espacamento);
      const blocos = Math.ceil(area * (tipo.includes('eps') ? 2 : 12));
      comodos.push({ largura, comprimento, area, vigotas, blocos });
    }

    this.calcData.comodos = comodos;
    this.calcData.totalArea = totalArea;
    this.showStep(3);
  }

  submitQuote(e) {
    e.preventDefault();
    const nome = this.root.querySelector('#nome')?.value.trim();
    const telefone = this.root.querySelector('#telefone')?.value.replace(/\D/g, '');
    const email = this.root.querySelector('#email')?.value.trim();
    if (!nome || telefone.length < 10 || !email.includes('@')) {
      alert('Preencha corretamente os campos de contato.');
      return;
    }

    const payload = {
      ...this.calcData,
      nome,
      telefone,
      email,
      status: 'NOVO'
    };

    if (window.Android?.submitQuote) {
      try {
        window.Android.submitQuote(JSON.stringify(payload));
      } catch (err) {
        console.error('Erro ao enviar:', err);
      }
    } else {
      alert('Função disponível apenas no app Android.');
    }
  }

  canNavigateTo(step) {
    const rules = [
      () => true,
      () => !!this.calcData.obraName,
      () => !!this.calcData.tipoLaje,
      () => Array.isArray(this.calcData.comodos) && this.calcData.comodos.length > 0
    ];
    return rules[step]?.();
  }
}
