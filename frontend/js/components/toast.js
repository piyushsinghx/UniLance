export const Toast = {
  container: null,

  init() {
    if (this.container) {
      return;
    }

    this.container = document.createElement("div");
    this.container.className = "toast-container";
    document.body.appendChild(this.container);
  },

  show(message, type = "info", duration = 3500) {
    this.init();
    const toast = document.createElement("div");
    toast.className = `toast toast--${type}`;
    toast.innerHTML = `
      <div class="toast__body">${message}</div>
      <button class="toast__close" type="button" aria-label="Dismiss notification">✕</button>
    `;
    toast.querySelector(".toast__close").onclick = () => this.dismiss(toast);
    this.container.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add("toast--show"));
    setTimeout(() => this.dismiss(toast), duration);
  },

  dismiss(toast) {
    if (!toast || !toast.isConnected) {
      return;
    }

    toast.classList.remove("toast--show");
    toast.addEventListener(
      "transitionend",
      () => {
        toast.remove();
      },
      { once: true }
    );
  },

  success(message) {
    this.show(message, "success");
  },

  error(message) {
    this.show(message, "error");
  },

  info(message) {
    this.show(message, "info");
  },
};

window.Toast = Toast;
