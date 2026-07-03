import { onReady } from './utils.js';

const initBeforeAfter = () => {
  const container = document.querySelector('.result-comparison');
  if (!container) return;

  const image = container.querySelector('img');
  if (!image) return;

  image.addEventListener('load', () => {
    container.classList.add('is-ready');
  });
};

onReady(initBeforeAfter);
