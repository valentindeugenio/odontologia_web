import { onReady } from './utils.js';

const PHONE = '5491133932597';
const URGENCY_MESSAGE = 'Hola. Tengo una urgencia odontológica y necesito atención lo antes posible.';
const descriptions = {
  'Implantes Dentales': 'Contanos brevemente tu situación para recibir una orientación personalizada.',
  'Estética Dental': 'Comentanos qué cambio querés lograr en tu sonrisa.',
  Endodoncia: 'Contanos qué molestias presents para que podamos orientarte mejor.',
  'Limpieza y Control': 'Solicitá un control o una limpieza preventiva.',
  'Otra consulta': 'Contanos qué necesitás y te responderemos enseguida.'
};

const initModal = () => {
  const modal = document.querySelector('#consultaModal');
  if (!modal) return;

  const get = (selector) => modal.querySelector(selector);
  const ui = {
    box: get('.modal-box'),
    close: get('#cerrarModal'),
    progress: get('#modalProgress'),
    step1: get('#step1'),
    step2: get('#step2'),
    back: get('#volverStep'),
    title: get('#tituloTratamiento'),
    description: get('#descripcionTratamiento'),
    name: get('#nombrePaciente'),
    phone: get('#telefonoPaciente'),
    details: get('#mensajePaciente'),
    submit: get('#enviarFormulario'),
    nameError: get('#errorNombre'),
    phoneError: get('#errorTelefono'),
    commentError: get('#errorInformacion')
  };

  if (Object.values(ui).some((element) => !element)) return;

  const cards = [...modal.querySelectorAll('.tratamiento-card')];
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let selectedTreatment = '';
  let previousFocus = null;
  let previousOverflow = '';
  let closing = false;

  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.setAttribute('aria-hidden', 'true');
  const firstTitle = ui.step1.querySelector('h2');
  if (firstTitle) firstTitle.id = 'modalStep1Title';
  modal.setAttribute('aria-labelledby', 'modalStep1Title');
  ui.close.setAttribute('aria-label', 'Cerrar ventana');

  const fields = {
    name: {
      input: ui.name,
      error: ui.nameError,
      validate: (value) => (!value ? 'Ingresá tu nombre.' : value.length < 2 ? 'El nombre debe tener al menos 2 caracteres.' : '')
    },
    phone: {
      input: ui.phone,
      error: ui.phoneError,
      validate: (value) => (!value ? 'Ingresá un teléfono de contacto.' : !/^[+\d\s().-]+$/.test(value) ? 'Ingresá un teléfono válido.' : (value.match(/\d/g) ?? []).length < 8 ? 'El teléfono debe tener al menos 8 números.' : '')
    }
  };

  const setError = (field, message = '') => {
    field.error.textContent = message;
    field.input.classList.toggle('input-error', Boolean(message));
    field.input.setAttribute('aria-invalid', String(Boolean(message)));
    field.input.setAttribute('aria-describedby', field.error.id);
    field.error.setAttribute('aria-live', 'polite');
  };

  const validate = (name) => {
    const field = fields[name];
    const message = field.validate(field.input.value.trim());
    setError(field, message);
    return !message;
  };

  const clearForm = () => {
    ui.name.value = '';
    ui.phone.value = '';
    ui.details.value = '';
    ui.commentError.textContent = '';
    Object.values(fields).forEach((field) => setError(field));
  };

  const animate = (element, keyframes, options) => (reduceMotion.matches ? Promise.resolve() : element.animate(keyframes, options).finished.catch(() => undefined));

  const openWhatsApp = (message) => {
    const link = document.createElement('a');
    link.href = `https://wa.me/${PHONE}?text=${encodeURIComponent(message)}`;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.append(link);
    link.click();
    link.remove();
  };

  const showStep = async (next, direction = 1) => {
    const current = next === ui.step1 ? ui.step2 : ui.step1;
    await animate(current, [{ opacity: 1, transform: 'translateX(0)' }, { opacity: 0, transform: `translateX(${-16 * direction}px)` }], { duration: 150, easing: 'ease-out' });
    current.style.display = 'none';
    next.style.display = 'block';
    await animate(next, [{ opacity: 0, transform: `translateX(${16 * direction}px)` }, { opacity: 1, transform: 'translateX(0)' }], { duration: 260, easing: 'cubic-bezier(.22,1,.36,1)' });
  };

  const openModal = () => {
    if (modal.style.display === 'flex') return;
    previousFocus = document.activeElement;
    selectedTreatment = '';
    clearForm();
    ui.step1.style.display = 'block';
    ui.step2.style.display = 'none';
    ui.progress.style.width = '50%';
    modal.style.display = 'flex';
    modal.setAttribute('aria-hidden', 'false');
    previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    animate(modal, [{ opacity: 0 }, { opacity: 1 }], { duration: 180, easing: 'ease-out' });
    animate(ui.box, [{ opacity: 0, transform: 'translateY(24px) scale(.97)' }, { opacity: 1, transform: 'translateY(0) scale(1)' }], { duration: 300, easing: 'cubic-bezier(.22,1,.36,1)' });
    window.setTimeout(() => ui.close.focus(), 40);
  };

  const closeModal = async () => {
    if (modal.style.display !== 'flex' || closing) return;
    closing = true;
    await Promise.all([
      animate(modal, [{ opacity: 1 }, { opacity: 0 }], { duration: 170, easing: 'ease-out' }),
      animate(ui.box, [{ opacity: 1, transform: 'translateY(0) scale(1)' }, { opacity: 0, transform: 'translateY(12px) scale(.98)' }], { duration: 170, easing: 'ease-out' })
    ]);
    modal.style.display = 'none';
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = previousOverflow;
    closing = false;
    if (previousFocus instanceof HTMLElement) previousFocus.focus();
  };

  const selectTreatment = async (card) => {
    const treatment = card.dataset.tratamiento;
    if (treatment === 'Urgencias') {
      openWhatsApp(URGENCY_MESSAGE);
      closeModal();
      return;
    }

    selectedTreatment = treatment;
    ui.title.textContent = treatment;
    ui.description.textContent = descriptions[treatment] ?? descriptions['Otra consulta'];
    ui.progress.style.width = '100%';
    modal.setAttribute('aria-labelledby', 'tituloTratamiento');
    await showStep(ui.step2);
    ui.name.focus();
  };

  cards.forEach((card) => {
    const treatment = card.dataset.tratamiento;
    const urgent = treatment === 'Urgencias';
    card.classList.toggle('urgente', urgent);
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-label', `${treatment}. Seleccionar tratamiento`);
    card.addEventListener('click', () => selectTreatment(card));
    card.addEventListener('keydown', (event) => {
      if (['Enter', ' '].includes(event.key)) {
        event.preventDefault();
        selectTreatment(card);
      }
    });
  });

  document.querySelectorAll('.btn-nav, .hero .btn-primary, .abrir-modal').forEach((button) => {
    button.addEventListener('click', (event) => {
      event.preventDefault();
      openModal();
    });
  });

  Object.entries(fields).forEach(([name, field]) => {
    field.input.addEventListener('blur', () => validate(name));
    field.input.addEventListener('input', () => {
      if (field.input.getAttribute('aria-invalid') === 'true') validate(name);
    });
  });

  ui.submit.addEventListener('click', () => {
    const isNameValid = validate('name');
    const isPhoneValid = validate('phone');
    if (!isNameValid || !isPhoneValid) {
      const invalidField = [fields.name, fields.phone].find((field) => field.input.getAttribute('aria-invalid') === 'true');
      invalidField?.input.focus();
      return;
    }

    const comment = ui.details.value.trim();
    const message = [
      'Hola. Quisiera hablar con un especialista.',
      '',
      `Tratamiento: ${selectedTreatment}`,
      `Nombre: ${ui.name.value.trim()}`,
      `Teléfono: ${ui.phone.value.trim()}`,
      `Comentario: ${comment || 'Sin comentarios adicionales.'}`
    ].join('\n');
    openWhatsApp(message);
    closeModal();
  });

  ui.close.addEventListener('click', () => closeModal());
  ui.back.addEventListener('click', async () => {
    ui.progress.style.width = '50%';
    modal.setAttribute('aria-labelledby', 'modalStep1Title');
    await showStep(ui.step1, -1);
    cards[0]?.focus();
  });

  modal.addEventListener('click', (event) => {
    if (event.target === modal) closeModal();
  });

  document.addEventListener('keydown', (event) => {
    if (modal.style.display !== 'flex') return;
    if (event.key === 'Escape') return void closeModal();
    if (event.key !== 'Tab') return;

    const focusable = [...modal.querySelectorAll('button:not([disabled]),input:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])')]
      .filter((element) => element.offsetParent !== null);
    const first = focusable[0];
    const last = focusable.at(-1);

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });
};

onReady(initModal);
