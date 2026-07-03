import { onReady } from './utils.js';

const initNavbar = () => {
  const menuButton = document.querySelector('.mobile-menu-toggle');
  const mainNav = document.querySelector('#mainNav');

  if (!menuButton || !mainNav) return;

  const setMenuOpen = (isOpen) => {
    menuButton.setAttribute('aria-expanded', String(isOpen));
    menuButton.setAttribute('aria-label', isOpen ? 'Cerrar menú' : 'Abrir menú');
    mainNav.classList.toggle('is-open', isOpen);
  };

  menuButton.addEventListener('click', () => {
    const isOpen = menuButton.getAttribute('aria-expanded') !== 'true';
    setMenuOpen(isOpen);
  });

  mainNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => setMenuOpen(false));
  });

  document.addEventListener('click', (event) => {
    if (mainNav.classList.contains('is-open') && !event.target.closest('.navbar')) {
      setMenuOpen(false);
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') setMenuOpen(false);
  });
};

onReady(initNavbar);
