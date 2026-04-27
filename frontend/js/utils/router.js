export const Router = {
  routes: {},

  init() {
    window.addEventListener("popstate", () => this.render(location.pathname));
    document.addEventListener("click", (event) => {
      const link = event.target.closest("[data-link]");
      if (!link) {
        return;
      }

      event.preventDefault();
      history.pushState(null, "", link.href);
      this.render(location.pathname);
    });
    this.render(location.pathname);
  },

  on(path, handler) {
    this.routes[path] = handler;
  },

  render(path) {
    const handler = this.routes[path] || this.routes["/404"];
    if (handler) {
      const main = document.getElementById("app");
      if (!main) {
        handler();
        return;
      }

      main.style.opacity = 0;
      setTimeout(() => {
        handler();
        main.style.opacity = 1;
      }, 200);
    }
  },
};

export function transitionPage(callback) {
  const app = document.getElementById("app") || document.querySelector("main");
  if (!app) {
    callback();
    return;
  }

  app.style.transition = "opacity 0.2s ease, transform 0.2s ease";
  app.style.opacity = 0;
  app.style.transform = "translateY(12px)";
  setTimeout(() => {
    callback();
    app.style.opacity = 1;
    app.style.transform = "translateY(0)";
  }, 200);
}
