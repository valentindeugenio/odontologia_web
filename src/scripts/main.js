import './modal.js';

(() => {
  "use strict";

  const onReady = (callback) => {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback, { once: true });
      return;
    }
    callback();
  };

  onReady(() => {
    const setupAccordion = ({ containerSelector, triggerSelector, panelSelector, itemSelector }) => {
      const container = document.querySelector(containerSelector);
      if (!container) return;

      const items = [...container.querySelectorAll(itemSelector)];
      const closeItem = (item) => {
        const trigger = item.querySelector(triggerSelector);
        const panel = item.querySelector(panelSelector);
        if (!trigger || !panel) return;
        trigger.setAttribute("aria-expanded", "false");
        panel.classList.remove("is-open");
        panel.style.maxHeight = "0px";
        item.classList.remove("is-expanded");
      };
      const openItem = (item) => {
        const trigger = item.querySelector(triggerSelector);
        const panel = item.querySelector(panelSelector);
        if (!trigger || !panel) return;
        trigger.setAttribute("aria-expanded", "true");
        panel.classList.add("is-open");
        panel.style.maxHeight = `${panel.scrollHeight}px`;
        item.classList.add("is-expanded");
      };

      items.forEach((item, index) => {
        const trigger = item.querySelector(triggerSelector);
        const panel = item.querySelector(panelSelector);
        if (!trigger || !panel) return;
        if (!panel.id) panel.id = `acordeon-panel-${index + 1}`;
        trigger.setAttribute("aria-controls", panel.id);
        panel.setAttribute("role", "region");
        panel.style.maxHeight = "0px";
        trigger.addEventListener("click", () => {
          const willOpen = trigger.getAttribute("aria-expanded") !== "true";
          items.forEach((otherItem) => {
            if (otherItem !== item) closeItem(otherItem);
          });
          if (willOpen) openItem(item); else closeItem(item);
        });
      });

      const resizeObserver = new ResizeObserver(() => {
        items.forEach((item) => {
          const trigger = item.querySelector(triggerSelector);
          const panel = item.querySelector(panelSelector);
          if (trigger?.getAttribute("aria-expanded") === "true" && panel) {
            panel.style.maxHeight = `${panel.scrollHeight}px`;
          }
        });
      });
      resizeObserver.observe(container);
    };

    setupAccordion({ containerSelector: ".services-grid", itemSelector: ".service-card", triggerSelector: ".service-toggle", panelSelector: ".service-details" });
    setupAccordion({ containerSelector: ".faq-container", itemSelector: ".faq-item", triggerSelector: ".faq-question", panelSelector: ".faq-answer" });

    const menuButton = document.querySelector(".mobile-menu-toggle");
    const mainNav = document.querySelector("#mainNav");
    const setMenuOpen = (isOpen) => {
      if (!menuButton || !mainNav) return;
      menuButton.setAttribute("aria-expanded", String(isOpen));
      menuButton.setAttribute("aria-label", isOpen ? "Cerrar menú" : "Abrir menú");
      mainNav.classList.toggle("is-open", isOpen);
    };
    menuButton?.addEventListener("click", () => {
      const isOpen = menuButton.getAttribute("aria-expanded") !== "true";
      setMenuOpen(isOpen);
    });
    mainNav?.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => setMenuOpen(false)));
    document.addEventListener("click", (event) => {
      if (mainNav?.classList.contains("is-open") && !event.target.closest(".navbar")) {
        setMenuOpen(false);
      }
    });

    const profileData = {
      cavagna: { name: "Dr. Cavagna", specialty: "Implantología Oral y Rehabilitación", years: "15+ años", image: "/images/dr-cavagna-ai.webp", alt: "Retrato ilustrativo del Dr. Cavagna", bio: "Su práctica se orienta a recuperar función, comodidad y estética mediante planes de tratamiento personalizados y explicados con claridad.", highlights: ["Planificación de implantes dentales", "Rehabilitación oral", "Seguimiento clínico personalizado"] },
      musacchio: { name: "Dra. Musacchio", specialty: "Odontología Integral", years: "12+ años", image: "/images/dra-musacchio-ai.webp", alt: "Retrato ilustrativo de la Dra. Musacchio", bio: "Su enfoque integra prevención, diagnóstico y tratamiento, acompañando a cada paciente con una mirada cercana y de largo plazo.", highlights: ["Odontología preventiva", "Diagnóstico integral", "Planes de cuidado a largo plazo"] },
      profesional3: { name: "Profesional a confirmar", specialty: "Endodoncia", years: "10+ años", image: "/images/profesional-3-ai.webp", alt: "Retrato ilustrativo de un profesional del equipo", bio: "Perfil demostrativo para presentar al profesional responsable del diagnóstico pulpar y la conservación de piezas dentarias.", highlights: ["Tratamientos de conducto", "Manejo del dolor dental", "Conservación de piezas"] },
      profesional4: { name: "Profesional a confirmar", specialty: "Estética Dental", years: "8+ años", image: "/images/profesional-4-ai.webp", alt: "Retrato ilustrativo de una profesional del equipo", bio: "Perfil demostrativo para presentar a la profesional enfocada en tratamientos estéticos naturales y respetuosos de la salud bucal.", highlights: ["Diseño de sonrisa", "Blanqueamiento dental", "Restauraciones estéticas"] }
    };

    const profileDialog = document.querySelector("#professionalProfile");
    const profileElements = {
      image: document.querySelector("#profileImage"),
      name: document.querySelector("#profileName"),
      specialty: document.querySelector("#profileSpecialty"),
      years: document.querySelector("#profileYears"),
      bio: document.querySelector("#profileBio"),
      highlights: document.querySelector("#profileHighlights")
    };
    const openProfile = (profileId) => {
      const profile = profileData[profileId];
      if (!profile || !profileDialog) return;
      profileElements.image.src = profile.image;
      profileElements.image.alt = profile.alt;
      profileElements.name.textContent = profile.name;
      profileElements.specialty.textContent = profile.specialty;
      profileElements.years.textContent = profile.years;
      profileElements.bio.textContent = profile.bio;
      profileElements.highlights.replaceChildren(...profile.highlights.map((highlight) => {
        const item = document.createElement("li");
        item.textContent = highlight;
        return item;
      }));
      profileDialog.showModal();
    };

    document.querySelectorAll(".doctor-card").forEach((card) => {
      card.addEventListener("click", () => openProfile(card.dataset.profile));
      card.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openProfile(card.dataset.profile);
        }
      });
    });

    profileDialog?.querySelector(".profile-close")?.addEventListener("click", () => profileDialog.close());
    profileDialog?.querySelector(".profile-booking")?.addEventListener("click", () => profileDialog.close());
    profileDialog?.addEventListener("click", (event) => {
      const bounds = profileDialog.getBoundingClientRect();
      const clickedOutside = event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom;
      if (clickedOutside) profileDialog.close();
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") setMenuOpen(false);
    });
  });
})();
