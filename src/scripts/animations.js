import { onReady } from './utils.js';

const initAnimations = () => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (reduceMotion.matches) return;

  const revealItems = document.querySelectorAll('.team, .services, .before-after, .reviews, .faq, .appointment-options, .office, .cta-final');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealItems.forEach((item) => observer.observe(item));
};

onReady(initAnimations);
