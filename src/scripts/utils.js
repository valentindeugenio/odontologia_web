export const onReady = (callback) => {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', callback, { once: true });
    return;
  }

  callback();
};

export const createElement = (tagName, className) => {
  const element = document.createElement(tagName);
  if (className) element.className = className;
  return element;
};

export const closeAccordionItems = (items, { triggerSelector, panelSelector }) => {
  items.forEach((item) => {
    const trigger = item.querySelector(triggerSelector);
    const panel = item.querySelector(panelSelector);
    if (!trigger || !panel) return;

    trigger.setAttribute('aria-expanded', 'false');
    panel.classList.remove('is-open');
    panel.style.maxHeight = '0px';
    item.classList.remove('is-expanded');
  });
};

export const openAccordionItem = (item, { triggerSelector, panelSelector }) => {
  const trigger = item.querySelector(triggerSelector);
  const panel = item.querySelector(panelSelector);
  if (!trigger || !panel) return;

  trigger.setAttribute('aria-expanded', 'true');
  panel.classList.add('is-open');
  panel.style.maxHeight = `${panel.scrollHeight}px`;
  item.classList.add('is-expanded');
};
