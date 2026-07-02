(() => {
  "use strict";

  const PHONE = "5491133932597";
  const URGENCY_MESSAGE = "Hola. Tengo una urgencia odontológica.";
  const descriptions = {
    "Implantes Dentales": "Un especialista en implantes revisará tu consulta antes de comunicarse con vos.",
    "Estética Dental": "Contanos qué cambio estético buscás para poder asesorarte mejor.",
    Endodoncia: "Explicanos qué molestias tenés para poder orientarte antes de la consulta.",
    "Limpieza / Control": "Solicitá asesoramiento para un control, una limpieza o una revisión odontológica.",
    "Otra consulta": "Contanos qué necesitás y nuestro equipo se pondrá en contacto con vos."
  };

  const initialize = () => {
    const previousModal = document.querySelector("#consultaModal");
    if (!previousModal) return;

    // Quita listeners heredados de implementaciones anteriores.
    const modal = previousModal.cloneNode(true);
    previousModal.replaceWith(modal);

    const get = selector => modal.querySelector(selector);
    const ui = {
      box: get(".modal-box"), close: get("#cerrarModal"), progress: get("#modalProgress"),
      step1: get("#step1"), step2: get("#step2"), back: get("#volverStep"),
      title: get("#tituloTratamiento"), description: get("#descripcionTratamiento"),
      name: get("#nombrePaciente"), phone: get("#telefonoPaciente"),
      details: get("#mensajePaciente"), submit: get("#enviarFormulario")
    };
    if (Object.values(ui).some(element => !element)) return;

    const cards = [...modal.querySelectorAll(".tratamiento-card")];
    const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)");
    let selectedTreatment = "";
    let previousFocus = null;
    let previousOverflow = "";
    let closing = false;

    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.setAttribute("aria-hidden", "true");
    const firstTitle = ui.step1.querySelector("h2");
    firstTitle.id = "modalStep1Title";
    modal.setAttribute("aria-labelledby", firstTitle.id);
    ui.close.type = ui.back.type = ui.submit.type = "button";
    ui.close.setAttribute("aria-label", "Cerrar ventana");

    Object.assign(ui.name, { type: "text", name: "nombre", placeholder: "Nombre", autocomplete: "name", maxLength: 80 });
    Object.assign(ui.phone, { type: "tel", name: "telefono", placeholder: "Teléfono", autocomplete: "tel", inputMode: "tel", maxLength: 30 });
    Object.assign(ui.details, { name: "informacion", placeholder: "Información adicional", maxLength: 800, value: "" });
    const detailsLabel = ui.details.previousElementSibling;
    if (detailsLabel?.matches(".campo-label")) {
      detailsLabel.textContent = "Información adicional";
      detailsLabel.htmlFor = ui.details.id;
    }

    const detailsError = document.createElement("p");
    detailsError.className = "error";
    detailsError.id = "errorInformacion";
    ui.details.after(detailsError);

    const fields = {
      name: {
        input: ui.name,
        error: get("#errorNombre"),
        validate: value => !value ? "Ingresá tu nombre." : value.length < 2 ? "El nombre debe tener al menos 2 caracteres." : ""
      },
      phone: {
        input: ui.phone,
        error: get("#errorTelefono"),
        validate: value => !value ? "Ingresá un teléfono de contacto." : !/^[+\d\s().-]+$/.test(value) ? "Ingresá un teléfono válido." : (value.match(/\d/g) ?? []).length < 8 ? "El teléfono debe tener al menos 8 números." : ""
      },
      details: {
        input: ui.details,
        error: detailsError,
        validate: value => !value ? "Agregá información sobre tu consulta." : value.length < 5 ? "Contanos un poco más para poder ayudarte." : ""
      }
    };

    const setError = (field, message = "") => {
      field.error.textContent = message;
      field.input.classList.toggle("input-error", Boolean(message));
      field.input.setAttribute("aria-invalid", String(Boolean(message)));
      field.input.setAttribute("aria-describedby", field.error.id);
      field.error.setAttribute("aria-live", "polite");
    };
    const validate = name => {
      const field = fields[name];
      const message = field.validate(field.input.value.trim());
      setError(field, message);
      return !message;
    };
    const clearForm = () => Object.values(fields).forEach(field => {
      field.input.value = "";
      setError(field);
    });
    const animate = (element, keyframes, options) => reduceMotion.matches
      ? Promise.resolve()
      : element.animate(keyframes, options).finished.catch(() => undefined);

    const openWhatsApp = message => {
      const link = document.createElement("a");
      link.href = `https://wa.me/${PHONE}?text=${encodeURIComponent(message)}`;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      document.body.append(link);
      link.click();
      link.remove();
    };

    const showStep = async (next, direction = 1) => {
      const current = next === ui.step1 ? ui.step2 : ui.step1;
      await animate(current, [
        { opacity: 1, transform: "translateX(0)" },
        { opacity: 0, transform: `translateX(${-16 * direction}px)` }
      ], { duration: 150, easing: "ease-out" });
      current.style.display = "none";
      next.style.display = "block";
      await animate(next, [
        { opacity: 0, transform: `translateX(${16 * direction}px)` },
        { opacity: 1, transform: "translateX(0)" }
      ], { duration: 260, easing: "cubic-bezier(.22,1,.36,1)" });
    };

    const openModal = () => {
      if (modal.style.display === "flex") return;
      previousFocus = document.activeElement;
      selectedTreatment = "";
      clearForm();
      ui.step1.style.display = "block";
      ui.step2.style.display = "none";
      ui.progress.style.width = "50%";
      modal.style.display = "flex";
      modal.setAttribute("aria-hidden", "false");
      previousOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      animate(modal, [{ opacity: 0 }, { opacity: 1 }], { duration: 180, easing: "ease-out" });
      animate(ui.box, [
        { opacity: 0, transform: "translateY(24px) scale(.97)" },
        { opacity: 1, transform: "translateY(0) scale(1)" }
      ], { duration: 300, easing: "cubic-bezier(.22,1,.36,1)" });
      setTimeout(() => ui.close.focus(), 40);
    };

    const closeModal = async () => {
      if (modal.style.display !== "flex" || closing) return;
      closing = true;
      await Promise.all([
        animate(modal, [{ opacity: 1 }, { opacity: 0 }], { duration: 170, easing: "ease-out" }),
        animate(ui.box, [
          { opacity: 1, transform: "translateY(0) scale(1)" },
          { opacity: 0, transform: "translateY(12px) scale(.98)" }
        ], { duration: 170, easing: "ease-out" })
      ]);
      modal.style.display = "none";
      modal.setAttribute("aria-hidden", "true");
      document.body.style.overflow = previousOverflow;
      closing = false;
      if (previousFocus instanceof HTMLElement) previousFocus.focus();
    };

    const selectTreatment = async card => {
      const treatment = card.dataset.tratamiento;
      if (["Urgencia", "Urgencias"].includes(treatment)) {
        openWhatsApp(URGENCY_MESSAGE);
        closeModal();
        return;
      }
      selectedTreatment = treatment;
      ui.title.textContent = treatment;
      ui.description.textContent = descriptions[treatment] ?? descriptions["Otra consulta"];
      ui.progress.style.width = "100%";
      modal.setAttribute("aria-labelledby", ui.title.id);
      await showStep(ui.step2);
      ui.name.focus();
    };

    cards.forEach(card => {
      const urgent = ["Urgencia", "Urgencias"].includes(card.dataset.tratamiento);
      card.classList.toggle("urgente", urgent);
      card.setAttribute("role", "button");
      card.setAttribute("tabindex", "0");
      card.setAttribute("aria-label", `${card.dataset.tratamiento}. Seleccionar tratamiento`);
      card.addEventListener("click", () => selectTreatment(card));
      card.addEventListener("keydown", event => {
        if (["Enter", " "].includes(event.key)) {
          event.preventDefault();
          selectTreatment(card);
        }
      });
    });

    document.querySelectorAll(".btn-nav, .hero .btn-primary, .abrir-modal").forEach(button => {
      button.addEventListener("click", event => {
        event.preventDefault();
        openModal();
      });
    });
    Object.entries(fields).forEach(([name, field]) => {
      field.input.addEventListener("blur", () => validate(name));
      field.input.addEventListener("input", () => {
        if (field.input.getAttribute("aria-invalid") === "true") validate(name);
      });
    });

    ui.submit.addEventListener("click", () => {
      if (Object.keys(fields).map(validate).some(valid => !valid)) {
        Object.values(fields).find(field => field.input.getAttribute("aria-invalid") === "true")?.input.focus();
        return;
      }
      const message = [
        "Hola. Quisiera hablar con un especialista.", "",
        `Motivo de la consulta: ${selectedTreatment}`,
        `Nombre: ${ui.name.value.trim()}`,
        `Teléfono: ${ui.phone.value.trim()}`,
        `Información adicional: ${ui.details.value.trim()}`
      ].join("\n");
      openWhatsApp(message);
      closeModal();
    });
    ui.close.addEventListener("click", closeModal);
    ui.back.addEventListener("click", async () => {
      ui.progress.style.width = "50%";
      modal.setAttribute("aria-labelledby", "modalStep1Title");
      await showStep(ui.step1, -1);
      cards[0]?.focus();
    });
    modal.addEventListener("click", event => {
      if (event.target === modal) closeModal();
    });
    document.addEventListener("keydown", event => {
      if (modal.style.display !== "flex") return;
      if (event.key === "Escape") return void closeModal();
      if (event.key !== "Tab") return;
      const focusable = [...modal.querySelectorAll('button:not([disabled]),input:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])')]
        .filter(element => element.offsetParent !== null);
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

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialize, { once: true });
  } else {
    initialize();
  }
})();
