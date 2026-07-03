import { onReady } from './utils.js';

const initWhatsApp = () => {
  const links = document.querySelectorAll('a[href*="wa.me"], .whatsapp-float');
  links.forEach((link) => {
    link.setAttribute('rel', 'noopener noreferrer');
    link.setAttribute('target', '_blank');
  });
};

onReady(initWhatsApp);
