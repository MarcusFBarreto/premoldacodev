// src/pages/calculadora.js

import { CalculatorController } from '../components/CalculatorController.js';
import { CarouselController } from '../components/CarouselController.js';
import { ContactFormController } from '../components/ContactFormController.js';
import { logDev } from '../components/utils.js';

document.addEventListener('DOMContentLoaded', () => {
  logDev('DOM carregado. Inicializando controladores...');

  const calculatorPanel = document.getElementById('calculator');
  const carousel = document.querySelector('.carousel');
  const contactForm = document.getElementById('contact-form');

  if (calculatorPanel) {
    logDev('Iniciando CalculatorController');
    new CalculatorController(calculatorPanel);
  }

  if (carousel) {
    logDev('Iniciando CarouselController');
    new CarouselController(carousel);
  }

  if (contactForm) {
    logDev('Iniciando ContactFormController');
    new ContactFormController(contactForm);
  }

  // Integração com Android
  if (window.Android?.pageLoaded) {
    try {
      window.Android.pageLoaded();
      logDev('Android.pageLoaded() chamado com sucesso.');
    } catch (e) {
      console.error('Erro ao notificar Android:', e);
    }
  }
});
