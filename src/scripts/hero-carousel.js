import { onReady } from './utils.js';

const initHeroCarousel = () => {
  const hero = document.querySelector('.hero');
  const toggle = hero?.querySelector('.hero-carousel-toggle');
  const slides = hero ? [...hero.querySelectorAll('.hero-slide')] : [];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const duration = 5500;
  let activeIndex = 0;
  let timer;
  let manuallyPaused = false;

  if (!hero || !toggle || slides.length < 2 || reducedMotion.matches) return;
  if (hero.dataset.carouselReady === 'true') return;
  hero.dataset.carouselReady = 'true';

  const setProgress = (isRunning) => {
    hero.classList.remove('is-progressing');
    if (isRunning) {
      void hero.offsetWidth;
      hero.classList.add('is-progressing');
    }
  };

  const stop = () => {
    window.clearTimeout(timer);
    timer = undefined;
    hero.classList.remove('is-progressing');
  };

  const next = () => {
    slides[activeIndex].classList.remove('is-active');
    activeIndex = (activeIndex + 1) % slides.length;
    slides[activeIndex].classList.add('is-active');
    schedule();
  };

  const schedule = () => {
    stop();
    if (manuallyPaused || document.visibilityState !== 'visible') return;
    setProgress(true);
    timer = window.setTimeout(next, duration);
  };

  const setManualPause = (paused) => {
    manuallyPaused = paused;
    hero.classList.toggle('is-paused', paused);
    toggle.setAttribute('aria-label', paused ? 'Reanudar carrusel' : 'Pausar carrusel');
    schedule();
  };

  toggle.addEventListener('click', () => setManualPause(!manuallyPaused));
  document.addEventListener('visibilitychange', schedule, { passive: true });
  reducedMotion.addEventListener('change', (event) => {
    if (event.matches) stop();
  });
  schedule();
};

onReady(initHeroCarousel);
