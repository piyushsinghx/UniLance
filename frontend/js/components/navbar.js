import { Auth } from "../utils/auth.js";
import { ThemeManager } from "../utils/theme.js";
import { NotificationManager, avatarMarkup, escapeHtml } from "../utils/helpers.js";

let dropdownBound = false;
let scrollBound = false;

function navLink(href, label, activePage) {
  const page = href.split("?")[0];
  return `<a class="navbar__link ${activePage === page ? "is-active" : ""}" href="${href}">${label}</a>`;
}

function bindDropdowns() {
  if (dropdownBound) {
    return;
  }

  dropdownBound = true;
  document.addEventListener("click", (event) => {
    const trigger = event.target.closest("[data-dropdown-trigger]");
    const allMenus = document.querySelectorAll(".dropdown-menu");

    if (!trigger) {
      allMenus.forEach((menu) => menu.classList.remove("show"));
      return;
    }

    const targetId = trigger.dataset.dropdownTrigger;
    const menu = document.getElementById(targetId);
    if (!menu) {
      return;
    }

    allMenus.forEach((item) => {
      if (item !== menu) {
        item.classList.remove("show");
      }
    });
    menu.classList.toggle("show");
  });
}

function bindScrollHide() {
  if (scrollBound) {
    return;
  }

  scrollBound = true;
  let lastY = 0;
  window.addEventListener(
    "scroll",
    () => {
      const nav = document.getElementById("navbar");
      if (!nav) {
        return;
      }
      const y = window.scrollY;
      if (y > lastY && y > 80) {
        nav.classList.add("hidden");
      } else {
        nav.classList.remove("hidden");
      }
      lastY = y;
    },
    { passive: true }
  );
}

export function renderNavbar(target, options = {}) {
  const mount = typeof target === "string" ? document.querySelector(target) : target;
  if (!mount) {
    return;
  }

  const activePage = options.page || window.location.pathname.split("/").pop() || "index.html";
  const user = Auth.getUser();
  const authActions = user
    ? `
      <div class="dropdown">
        <button class="profile-chip" type="button" data-dropdown-trigger="profileDropdown">
          ${avatarMarkup(user, 34)}
          <span class="profile-chip__meta">
            <span>${escapeHtml(user.name || "Student")}</span>
            <span>${escapeHtml(user.role || "buyer")}</span>
          </span>
        </button>
        <div class="dropdown-menu" id="profileDropdown">
          <a class="dropdown-item" href="profile.html">Profile</a>
          <a class="dropdown-item" href="chat.html">Messages</a>
          <a class="dropdown-item" href="dashboard.html">Dashboard</a>
          <button class="dropdown-item" type="button" id="logoutAction">Log out</button>
        </div>
      </div>
    `
    : `
      <a class="btn btn-secondary btn-sm" href="login.html">Log In</a>
      <a class="btn btn-primary btn-sm" href="signup.html">Join Free</a>
    `;

  mount.innerHTML = `
    <header class="navbar" id="navbar">
      <div class="navbar__inner">
        <a class="navbar__brand" href="index.html">
          <span class="navbar__mark">
            <img src="../assets/icons/logo-mark.svg" alt="UniLance" width="22" height="22">
          </span>
          <span><span class="logo-uni">Uni</span><span class="logo-lance">Lance</span></span>
        </a>
        <nav class="navbar__links" aria-label="Primary">
          ${navLink("index.html", "Home", activePage)}
          ${navLink("marketplace.html", "Explore", activePage)}
          ${navLink("dashboard.html", "Dashboard", activePage)}
          ${navLink("chat.html", "Chat", activePage)}
        </nav>
        <div class="navbar__actions">
          <button class="btn-icon" type="button" aria-label="Toggle theme" data-theme-toggle>
            <span data-theme-icon>☀</span>
          </button>
          <div class="dropdown">
            <button class="btn-icon notif-button" type="button" aria-label="Notifications" data-dropdown-trigger="notifDropdown">
              🔔
              <span class="notif-badge" id="notifCount">3</span>
            </button>
            <div class="dropdown-menu" id="notifDropdown"></div>
          </div>
          ${authActions}
        </div>
      </div>
    </header>
  `;

  mount.querySelector("[data-theme-toggle]")?.addEventListener("click", () => ThemeManager.toggle());
  mount.querySelector("#logoutAction")?.addEventListener("click", () => Auth.logout("login.html"));
  NotificationManager.init();
  bindDropdowns();
  bindScrollHide();
}
