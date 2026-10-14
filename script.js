
const menuToggle = document.getElementById("menu-toggle");
const nav = document.getElementById("nav");
const currentYear = document.getElementById("current-year");

// Abrir y cerrar el menú en celulares
if (menuToggle && nav) {
    menuToggle.addEventListener("click", () => {
        const isOpen = nav.classList.toggle("open");

        menuToggle.setAttribute("aria-expanded", String(isOpen));
        menuToggle.setAttribute(
            "aria-label",
            isOpen ? "Cerrar menú" : "Abrir menú"
        );

        menuToggle.textContent = isOpen ? "✕" : "☰";
    });

    // Cerrar el menú después de elegir una sección
    nav.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            nav.classList.remove("open");
            menuToggle.setAttribute("aria-expanded", "false");
            menuToggle.setAttribute("aria-label", "Abrir menú");
            menuToggle.textContent = "☰";
        });
    });
}

// Mostrar automáticamente el año actual
if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
}
const contactForm = document.getElementById("contact-form");

if (contactForm) {
    contactForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const nombre = document.getElementById("nombre").value.trim();
        const modalidad = document.getElementById("modalidad").value;
        const objetivo = document.getElementById("objetivo").value.trim();

        const telefono = "5491112345678"; // Reemplazar por el número real

        let mensaje = `Hola, soy ${nombre}. Me interesa consultar por: ${modalidad}.`;

        if (objetivo) {
            mensaje += ` Mi objetivo es: ${objetivo}.`;
        }

        const url = `https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`;

        window.open(url, "_blank", "noopener,noreferrer");
    });
}
