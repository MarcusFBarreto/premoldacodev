export class CarouselController {
  constructor(carouselEl) {
    this.carousel = carouselEl;
    this.items = this.carousel.querySelectorAll('.carousel-item');
    this.prev = this.carousel.querySelector('.carousel-prev');
    this.next = this.carousel.querySelector('.carousel-next');
    this.dotsContainer = document.createElement('div');
    this.dotsContainer.classList.add('carousel-dots');
    this.carousel.appendChild(this.dotsContainer);
    this.currentIndex = 0;
    this.intervalId = null;
    this.intervalDelay = 4000;
    this.init();
  }

  init() {
    this.createDots();
    this.bindEvents();
    this.showItem(this.currentIndex);
    this.startAutoSlide();
  }

  createDots() {
    this.items.forEach((_, i) => {
      const dot = document.createElement('span');
      dot.classList.add('carousel-dot');
      dot.setAttribute('tabindex', '0');
      dot.setAttribute('aria-label', `Ir para slide ${i + 1}`);
      dot.setAttribute('role', 'button');
      dot.addEventListener('click', () => this.goTo(i));
      dot.addEventListener('keydown', (e) => {
        if (['Enter', ' '].includes(e.key)) this.goTo(i);
      });
      this.dotsContainer.appendChild(dot);
    });
  }

  bindEvents() {
    this.prev?.addEventListener('click', () => this.prevItem());
    this.next?.addEventListener('click', () => this.nextItem());
    this.carousel.addEventListener('mouseenter', () => this.pause());
    this.carousel.addEventListener('mouseleave', () => this.startAutoSlide());
  }

  showItem(i) {
    this.items.forEach((item, idx) => {
      item.classList.toggle('active', idx === i);
      const img = item.querySelector('img');
      if (img) {
        img.style.width = '100%';
        img.style.height = 'auto';
      }
    });
    const dots = this.dotsContainer.querySelectorAll('.carousel-dot');
    dots.forEach((dot, idx) => dot.classList.toggle('active', idx === i));
  }

  nextItem() {
    this.currentIndex = (this.currentIndex + 1) % this.items.length;
    this.showItem(this.currentIndex);
  }

  prevItem() {
    this.currentIndex = (this.currentIndex - 1 + this.items.length) % this.items.length;
    this.showItem(this.currentIndex);
  }

  goTo(i) {
    this.currentIndex = i;
    this.showItem(i);
    this.resetAutoSlide();
  }

  startAutoSlide() {
    this.intervalId = setInterval(() => this.nextItem(), this.intervalDelay);
  }

  pause() {
    clearInterval(this.intervalId);
  }

  resetAutoSlide() {
    this.pause();
    this.startAutoSlide();
  }
}
