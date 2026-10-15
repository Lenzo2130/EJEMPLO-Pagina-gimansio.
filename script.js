
"use strict";

document.addEventListener("DOMContentLoaded", () => {
    const $ = (selector, parent = document) => parent.querySelector(selector);
    const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];

    // Menú móvil
    const menuToggle = $("#menu-toggle");
    const nav = $("#nav");

    function closeMenu() {
        if (!menuToggle || !nav) return;
        nav.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Abrir menú");
        menuToggle.textContent = "☰";
    }

    if (menuToggle && nav) {
        menuToggle.addEventListener("click", () => {
            const isOpen = nav.classList.toggle("open");
            menuToggle.setAttribute("aria-expanded", String(isOpen));
            menuToggle.setAttribute("aria-label", isOpen ? "Cerrar menú" : "Abrir menú");
            menuToggle.textContent = isOpen ? "✕" : "☰";
        });

        $$("a", nav).forEach(link => link.addEventListener("click", closeMenu));

        document.addEventListener("keydown", event => {
            if (event.key === "Escape") {
                closeMenu();
                menuToggle.focus();
            }
        });

        window.addEventListener("resize", () => {
            if (window.innerWidth > 700) closeMenu();
        });
    }

    // Año automático
    const currentYear = $("#current-year");
    if (currentYear) currentYear.textContent = new Date().getFullYear();

    if (typeof CONFIG === "undefined") {
        console.error("No se encontró config.js o no se pudo cargar.");
        return;
    }

    // Funciones auxiliares para textos
    const setText = (selector, value) => {
        const element = $(selector);
        if (element && typeof value === "string") element.textContent = value;
    };

    // Colores configurables
    if (CONFIG.colores) {
        const root = document.documentElement;
        if (CONFIG.colores.principal) root.style.setProperty("--color-primary", CONFIG.colores.principal);
        if (CONFIG.colores.fondo) root.style.setProperty("--color-background", CONFIG.colores.fondo);
        if (CONFIG.colores.tarjetas) root.style.setProperty("--color-card", CONFIG.colores.tarjetas);
    }

    // Nombre, rubro y título del navegador
    $$(".business-name").forEach(element => {
        element.textContent = CONFIG.nombre || "Mi negocio";
    });

    document.title = `${CONFIG.nombre || "Mi negocio"} | ${CONFIG.rubro || "Servicios"}`;

    // Portada
    if (CONFIG.portada) {
        setText("#hero-title", CONFIG.portada.titulo);
        setText("#hero-description", CONFIG.portada.descripcion);
    }

    // Servicios
    if (CONFIG.servicios) {
        setText("#services-title", CONFIG.servicios.titulo);
        setText("#services-description", CONFIG.servicios.descripcion);

        ["servicio1", "servicio2", "servicio3"].forEach(key => {
            const service = CONFIG.servicios[key];
            if (!service) return;
            setText(`#${key}-titulo`, service.titulo);
            setText(`#${key}-descripcion`, service.descripcion);
        });
    }

    // Precios
    if (CONFIG.planes) {
        setText("#precio-inicial", CONFIG.planes.inicial);
        setText("#precio-personalizado", CONFIG.planes.personalizado);
        setText("#precio-online", CONFIG.planes.online);
    }

    // Sección "Sobre mí"
    if (CONFIG.sobreMi) {
        setText("#about-eyebrow", CONFIG.sobreMi.etiqueta);
        setText("#about-title", CONFIG.sobreMi.titulo);
        setText("#about-description", CONFIG.sobreMi.descripcion);
        setText("#about-extra", CONFIG.sobreMi.extra);
    }

    // Contacto
    if (CONFIG.contacto) {
        setText("#contact-title", CONFIG.contacto.titulo);
        setText("#contact-description", CONFIG.contacto.descripcion);
        setText("#contact-note", CONFIG.contacto.nota);
    }

    // Validación básica del número para no generar enlaces incorrectos.
    const phone = String(CONFIG.whatsapp || "").replace(/\D/g, "");
    const validPhone = phone.length >= 10 && phone.length <= 15;

    // Enlaces de WhatsApp para los planes
    $$(".whatsapp-link").forEach(link => {
        const plan = link.dataset.plan || "un plan de entrenamiento";
        const message = `Hola, quiero consultar por el ${plan}.`;

        if (validPhone) {
            link.href = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
            link.setAttribute("target", "_blank");
            link.setAttribute("rel", "noopener noreferrer");
        } else {
            link.href = "#contacto";
            link.removeAttribute("target");
            link.removeAttribute("rel");
            link.addEventListener("click", event => {
                event.preventDefault();
                alert("Configurá un número de WhatsApp válido en config.js.");
            });
        }
    });

    // Copiar email al portapapeles
    const copyEmail = $("#copy-email");
    const emailFeedback = $("#email-feedback");

    if (copyEmail && CONFIG.email) {
        copyEmail.textContent = CONFIG.email;

        copyEmail.addEventListener("click", async () => {
            try {
                if (!navigator.clipboard || !window.isSecureContext) {
                    throw new Error("Portapapeles no disponible en este contexto");
                }

                await navigator.clipboard.writeText(CONFIG.email);
                if (emailFeedback) emailFeedback.textContent = "Email copiado al portapapeles.";
            } catch {
                // Alternativa manual para navegadores sin Clipboard API.
                const temporaryInput = document.createElement("textarea");
                temporaryInput.value = CONFIG.email;
                temporaryInput.setAttribute("readonly", "");
                temporaryInput.style.position = "absolute";
                temporaryInput.style.left = "-9999px";
                document.body.appendChild(temporaryInput);
                temporaryInput.select();

                let copied = false;
                try {
                    copied = document.execCommand("copy");
                } catch {
                    copied = false;
                }

                temporaryInput.remove();

                if (emailFeedback) {
                    emailFeedback.textContent = copied
                        ? "Email copiado al portapapeles."
                        : `No se pudo copiar automáticamente. Email: ${CONFIG.email}`;
                }
            }
        });
    }

    // Formulario: genera un mensaje y abre WhatsApp.
    const contactForm = $("#contact-form");
    const formFeedback = $("#form-feedback");

    if (contactForm) {
        contactForm.addEventListener("submit", event => {
            event.preventDefault();

            if (!validPhone) {
                if (formFeedback) formFeedback.textContent =
                    "Configurá un número de WhatsApp válido en config.js antes de enviar.";
                return;
            }

            const nameInput = $("#nombre");
            const modalityInput = $("#modalidad");
            const objectiveInput = $("#objetivo");

            if (!nameInput || !modalityInput || !objectiveInput) return;

            const name = nameInput.value.trim();
            const modality = modalityInput.value;
            const objective = objectiveInput.value.trim();

            if (!name || !modality) {
                if (formFeedback) formFeedback.textContent =
                    "Completá tu nombre y elegí una modalidad.";
                return;
            }

            let message = `Hola, soy ${name}. Me interesa consultar por: ${modality}.`;
            if (objective) message += ` Mi objetivo es: ${objective}.`;

            const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

            if (formFeedback) formFeedback.textContent = "Abriendo WhatsApp...";
            const openedWindow = window.open(url, "_blank", "noopener,noreferrer");

            if (!openedWindow && formFeedback) {
                formFeedback.textContent =
                    "El navegador bloqueó la ventana emergente. Permití las ventanas emergentes o abrí WhatsApp manualmente.";
            }
        });
    }

    // Botón flotante para volver arriba
    const backToTop = $("#back-to-top-floating");

    if (backToTop) {
        const updateBackToTop = () => {
            backToTop.classList.toggle("visible", window.scrollY > 450);
        };

        window.addEventListener("scroll", updateBackToTop, { passive: true });
        updateBackToTop();

        backToTop.addEventListener("click", () => {
            window.scrollTo({
                top: 0,
                behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
                    ? "auto"
                    : "smooth"
            });
        });
    }
});
