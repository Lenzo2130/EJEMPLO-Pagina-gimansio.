
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
