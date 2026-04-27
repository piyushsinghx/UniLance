export const Modal = {
  init(root = document) {
    root.querySelectorAll("[data-modal-open]").forEach((trigger) => {
      trigger.addEventListener("click", () => {
        this.open(trigger.dataset.modalOpen);
      });
    });

    root.querySelectorAll("[data-modal-close]").forEach((trigger) => {
      trigger.addEventListener("click", () => {
        const modalId = trigger.dataset.modalClose || trigger.closest(".modal-overlay")?.id;
        this.close(modalId);
      });
    });

    root.querySelectorAll(".modal-overlay").forEach((overlay) => {
      overlay.addEventListener("click", (event) => {
        if (event.target === overlay) {
          this.close(overlay.id);
        }
      });
    });
  },

  open(id) {
    const modal = document.getElementById(id);
    if (!modal) {
      return;
    }

    modal.classList.add("show");
    document.body.style.overflow = "hidden";
  },

  close(id) {
    const modal = document.getElementById(id);
    if (!modal) {
      return;
    }

    modal.classList.remove("show");
    document.body.style.overflow = "";
  },
};
