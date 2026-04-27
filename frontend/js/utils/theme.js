export const ThemeManager = {
  init() {
    const saved = localStorage.getItem("ul-theme");
    const system = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    this.apply(saved || system);
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (event) => {
      if (!localStorage.getItem("ul-theme")) {
        this.apply(event.matches ? "dark" : "light");
      }
    });
  },

  apply(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("ul-theme", theme);
    document.querySelectorAll("[data-theme-icon]").forEach((element) => {
      element.textContent = theme === "dark" ? "☀" : "☾";
    });
  },

  toggle() {
    const current = document.documentElement.getAttribute("data-theme");
    this.apply(current === "dark" ? "light" : "dark");
  },
};

window.ThemeManager = ThemeManager;
