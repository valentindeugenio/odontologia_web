import { onReady } from './utils.js';

const initFaq = () => {
  const container = document.querySelector('.faq-container');
  if (!container) return;

  const items = [...container.querySelectorAll('.faq-item')];

  items.forEach((item, index) => {
    const trigger = item.querySelector('.faq-question');
    const panel = item.querySelector('.faq-answer');
    if (!trigger || !panel) return;

    if (!panel.id) panel.id = `faq-panel-${index + 1}`;
    trigger.setAttribute('aria-controls', panel.id);
    panel.setAttribute('role', 'region');
    panel.style.maxHeight = '0px';

    trigger.addEventListener('click', () => {
      const willOpen = trigger.getAttribute('aria-expanded') !== 'true';
      items.forEach((otherItem) => {
        if (otherItem !== item) {
          const otherTrigger = otherItem.querySelector('.faq-question');
          const otherPanel = otherItem.querySelector('.faq-answer');
          if (!otherTrigger || !otherPanel) return;
          otherTrigger.setAttribute('aria-expanded', 'false');
          otherPanel.classList.remove('is-open');
          otherPanel.style.maxHeight = '0px';
          otherItem.classList.remove('is-expanded');
        }
      });

      if (willOpen) {
        trigger.setAttribute('aria-expanded', 'true');
        panel.classList.add('is-open');
        panel.style.maxHeight = `${panel.scrollHeight}px`;
        item.classList.add('is-expanded');
      } else {
        trigger.setAttribute('aria-expanded', 'false');
        panel.classList.remove('is-open');
        panel.style.maxHeight = '0px';
        item.classList.remove('is-expanded');
      }
    });
  });
};

onReady(initFaq);
