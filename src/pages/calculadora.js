import { CalculatorController } from '../components/CalculatorController.js';
import { CarouselController } from '../components/CarouselController.js';
import { ContactFormController } from '../components/ContactFormController.js';

document.addEventListener('DOMContentLoaded', () => {
  const calc = document.getElementById('calculator');
  const carousel = document.querySelector('.carousel');
  const contact = document.getElementById('contact-form');

  if (calc) new CalculatorController(calc);
  if (carousel) new CarouselController(carousel);
  if (contact) new ContactFormController(contact);

  if (window.Android?.pageLoaded) {
    try {
      window.Android.pageLoaded();
    } catch (e) {
      console.error('Erro ao notificar pageLoaded:', e);
    }
  }
});
