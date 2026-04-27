import { api } from "./api.js";
import { Auth } from "./auth.js";
import { Toast } from "../components/toast.js";

const scriptCache = new Map();

export function timeAgo(date) {
  const seconds = Math.floor((Date.now() - new Date(date)) / 1000);
  if (Number.isNaN(seconds)) {
    return "Just now";
  }
  if (seconds < 60) {
    return "Just now";
  }
  if (seconds < 3600) {
    return `${Math.floor(seconds / 60)}m ago`;
  }
  if (seconds < 86400) {
    return `${Math.floor(seconds / 3600)}h ago`;
  }
  return `${Math.floor(seconds / 86400)}d ago`;
}

export function debounce(fn, delay) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
}

export function formatCurrency(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value || 0);
}

export function formatNumber(value) {
  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 1,
  }).format(value || 0);
}

export function formatDate(date, config = { month: "short", day: "numeric", year: "numeric" }) {
  try {
    return new Intl.DateTimeFormat("en-IN", config).format(new Date(date));
  } catch {
    return "";
  }
}

export function getQueryParam(key) {
  return new URLSearchParams(window.location.search).get(key);
}

export function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export function getInitials(name = "UL") {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export function avatarMarkup(user = {}, size = 44) {
  if (user.avatar) {
    return `<img class="avatar" src="${escapeHtml(user.avatar)}" alt="${escapeHtml(user.name || "User")}" style="width:${size}px;height:${size}px">`;
  }

  return `<span class="avatar avatar-fallback" style="width:${size}px;height:${size}px">${escapeHtml(getInitials(user.name || "Uni Lance"))}</span>`;
}

export function buildConversationId(firstId, secondId) {
  return [String(firstId), String(secondId)].sort().join("_");
}

export function loadScript(src) {
  if (scriptCache.has(src)) {
    return scriptCache.get(src);
  }

  const promise = new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[data-src="${src}"]`);
    if (existing) {
      existing.addEventListener("load", () => resolve(existing));
      existing.addEventListener("error", reject);
      return;
    }

    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.dataset.src = src;
    script.onload = () => resolve(script);
    script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
    document.head.appendChild(script);
  });

  scriptCache.set(src, promise);
  return promise;
}

export function renderStars(rating = 0) {
  const rounded = Math.max(1, Math.round(rating || 0));
  return `<span class="rating-stars">${"★".repeat(rounded)}</span>`;
}

export function categoryIcon(category = "") {
  const map = {
    "web-development": "💻",
    design: "🎨",
    writing: "✍️",
    "video-editing": "🎬",
    "mobile-development": "📱",
    "data-science": "📊",
    marketing: "📣",
    other: "🚀",
  };
  return map[category] || "✨";
}

export function normalizeGig(gig = {}) {
  const basic = gig.pricing?.basic || {};
  const seller = gig.seller || {};
  const reviews = gig.reviewCount ?? gig.reviews ?? 0;
  const rating = Number(gig.rating || 0);

  return {
    ...gig,
    seller,
    rating,
    reviews,
    price: gig.price ?? basic.price ?? 0,
    tags: Array.isArray(gig.tags) ? gig.tags.slice(0, 4) : [],
    title: gig.title || "Student Freelance Gig",
    university: seller.university || "Verified Student",
    icon: categoryIcon(gig.category),
    trending: gig.trending || rating >= 4.8 || (gig.orderCount || 0) >= 12,
  };
}

export function renderGigCard(gigInput) {
  const gig = normalizeGig(gigInput);
  return `
    <a class="gig-card" href="gig-detail.html?id=${escapeHtml(gig._id || gig.id || "")}" data-tilt data-animate data-user="${escapeHtml(gig.seller?._id || "")}">
      <div class="gig-card__media">
        <span>${gig.icon}</span>
      </div>
      <div class="gig-card__body">
        <div class="gig-card__head">
          <div class="gig-card__seller">
            <div style="position:relative">
              ${avatarMarkup(gig.seller, 44)}
              <span class="online-dot ${gig.seller?.isOnline ? "online" : ""}"></span>
            </div>
            <div style="min-width:0">
              <div class="gig-card__seller-name">
                <span class="truncate">${escapeHtml(gig.seller?.name || "Student Seller")}</span>
                ${gig.seller?.isVerified ? '<span class="badge badge-success">Verified</span>' : ""}
              </div>
              <div class="gig-card__seller-meta truncate">${escapeHtml(gig.university)}</div>
            </div>
          </div>
          ${gig.trending ? '<span class="badge badge-trending">Trending</span>' : ""}
        </div>
        <div>
          <h3 class="gig-card__title">${escapeHtml(gig.title)}</h3>
        </div>
        <div class="gig-card__tags">
          ${gig.tags.map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join("")}
        </div>
        <div class="gig-card__footer">
          <div class="rating-row">
            ${renderStars(gig.rating)}
            <span>${gig.rating.toFixed(1)} (${formatNumber(gig.reviews)})</span>
          </div>
          <span class="price-copy">From ${formatCurrency(gig.price)}</span>
        </div>
      </div>
    </a>
  `;
}

export function renderSearchSuggestions(target, gigs = []) {
  if (!target) {
    return;
  }

  if (!gigs.length) {
    target.classList.remove("show");
    target.innerHTML = "";
    return;
  }

  target.innerHTML = gigs
    .slice(0, 5)
    .map((gig) => {
      const normalized = normalizeGig(gig);
      return `
        <a class="suggestion-item" href="gig-detail.html?id=${escapeHtml(normalized._id || normalized.id || "")}">
          <div>
            <strong>${escapeHtml(normalized.title)}</strong>
            <div class="muted">${escapeHtml(normalized.seller?.name || "Student Seller")} · ${escapeHtml(normalized.university)}</div>
          </div>
          <span class="price-copy">${formatCurrency(normalized.price)}</span>
        </a>
      `;
    })
    .join("");
  target.classList.add("show");
}

export function initIntersectionAnimations(root = document) {
  const elements = root.querySelectorAll("[data-animate]");
  if (!elements.length) {
    return null;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.animation = entry.target.dataset.anim || "fade-up 0.6s ease forwards";
          entry.target.style.opacity = 1;
        }
      });
    },
    { threshold: 0.1 }
  );

  elements.forEach((element) => {
    element.style.opacity = 0;
    observer.observe(element);
  });

  return observer;
}

export function initScrollReveal(root = document) {
  const elements = root.querySelectorAll("[data-animate]");
  if (!elements.length) {
    return null;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.style.opacity = 1;
            entry.target.style.transform = "translateY(0)";
          }, index * 80);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
  );

  elements.forEach((element) => {
    element.style.opacity = 0;
    element.style.transform = "translateY(28px)";
    element.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    observer.observe(element);
  });

  return observer;
}

export function initTilt(root = document) {
  root.querySelectorAll("[data-tilt]").forEach((card) => {
    card.addEventListener("mousemove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(1000px) rotateY(${x * 14}deg) rotateX(${-y * 14}deg) translateZ(8px) scale(1.02)`;
      card.style.boxShadow = `${-x * 20}px ${y * 20}px 40px rgba(99,102,241,0.2)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "perspective(1000px) rotateY(0) rotateX(0) translateZ(0) scale(1)";
      card.style.boxShadow = "";
    });
  });
}

export function staggerChildren(parent, delay = 80) {
  if (!parent) {
    return;
  }

  const children = parent.querySelectorAll(".gig-card,.cat-card,.stat-card");
  children.forEach((element, index) => {
    element.style.opacity = 0;
    element.style.transform = "translateY(24px)";
    element.style.transition = `opacity 0.5s ease ${index * delay}ms, transform 0.5s ease ${index * delay}ms`;
    setTimeout(() => {
      element.style.opacity = 1;
      element.style.transform = "translateY(0)";
    }, 100 + index * delay);
  });
}

export function cloneMarquee(target) {
  const element = typeof target === "string" ? document.querySelector(target) : target;
  if (!element || element.dataset.cloned) {
    return;
  }

  [...element.children].forEach((child) => {
    element.appendChild(child.cloneNode(true));
  });
  element.dataset.cloned = "true";
}

export function countUp(element) {
  const target = Number.parseFloat(element.dataset.count || "0");
  const decimals = target % 1 !== 0 ? 1 : 0;
  const duration = 2000;
  const step = 20;
  const increment = target / (duration / step);
  let current = 0;

  const timer = setInterval(() => {
    current = Math.min(current + increment, target);
    element.textContent = decimals ? current.toFixed(decimals) : Math.floor(current).toLocaleString("en-IN");
    if (current >= target) {
      clearInterval(timer);
    }
  }, step);
}

export function initCountUp(root = document) {
  const elements = root.querySelectorAll("[data-count]");
  if (!elements.length) {
    return null;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          countUp(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  elements.forEach((element) => observer.observe(element));
  return observer;
}

export async function launchConfetti() {
  try {
    await loadScript("https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.3/dist/confetti.browser.min.js");
    if (typeof window.confetti !== "function") {
      return;
    }

    window.confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 },
      colors: ["#6366F1", "#22D3EE", "#8B5CF6"],
    });
    setTimeout(() => {
      window.confetti({
        particleCount: 60,
        spread: 120,
        origin: { y: 0.4 },
      });
    }, 400);
  } catch {
    Toast.info("Order placed successfully.");
  }
}

function normalizeNotificationType(type = "") {
  if (type.includes("message")) {
    return "message";
  }
  if (type.includes("review")) {
    return "review";
  }
  return "order";
}

function normalizeNotification(notification = {}) {
  return {
    id: notification.id || notification._id || Date.now(),
    type: normalizeNotificationType(notification.type),
    title: notification.title || "Notification",
    body: notification.body || notification.message || "",
    icon: notification.icon || (notification.type?.includes("review") ? "⭐" : notification.type?.includes("message") ? "💬" : "📦"),
    read: Boolean(notification.read),
    time: notification.time || notification.createdAt || new Date().toISOString(),
    rawType: notification.type || "order",
  };
}

export const NotificationManager = {
  notifications: [],
  bound: false,

  async init() {
    const saved = JSON.parse(localStorage.getItem("ul-notifs") || "[]");
    this.notifications = saved.map(normalizeNotification);
    this.updateBadge();
    this.renderDropdown();

    if (Auth.isAuthenticated()) {
      try {
        const data = await api.get("/notifications", { limit: 20 });
        const remote = (data.notifications || []).map(normalizeNotification);
        this.notifications = [...remote, ...this.notifications]
          .filter((notification, index, all) => all.findIndex((entry) => String(entry.id) === String(notification.id)) === index)
          .slice(0, 50);
        this.save();
        this.updateBadge();
        this.renderDropdown();
      } catch {
        this.save();
      }
    }
  },

  push(notification) {
    const item = normalizeNotification({ ...notification, read: false });
    this.notifications.unshift(item);
    this.notifications = this.notifications.slice(0, 50);
    this.save();
    this.updateBadge();
    this.renderDropdown();
    Toast.info(`${item.title}: ${item.body}`);
    const badge = document.getElementById("notifCount");
    if (badge) {
      badge.style.transform = "scale(1.4)";
      setTimeout(() => {
        badge.style.transform = "";
      }, 300);
    }
  },

  updateBadge() {
    const unread = this.notifications.filter((notification) => !notification.read).length;
    const badge = document.getElementById("notifCount");
    if (badge) {
      badge.textContent = unread || "";
      badge.style.display = unread ? "flex" : "none";
    }
  },

  async markAllRead() {
    this.notifications = this.notifications.map((notification) => ({ ...notification, read: true }));
    this.save();
    this.updateBadge();
    this.renderDropdown();
    if (Auth.isAuthenticated()) {
      try {
        await api.put("/notifications/read-all");
      } catch {
        return;
      }
    }
  },

  save() {
    localStorage.setItem("ul-notifs", JSON.stringify(this.notifications.slice(0, 50)));
  },

  renderDropdown() {
    const element = document.getElementById("notifDropdown");
    if (!element) {
      return;
    }

    if (!this.notifications.length) {
      element.innerHTML = '<div class="dropdown-item">No notifications yet.</div>';
      return;
    }

    const groups = { order: [], message: [], review: [] };
    this.notifications.forEach((notification) => {
      groups[notification.type]?.push(notification);
    });

    element.innerHTML = `
      ${Object.entries(groups)
        .filter(([, items]) => items.length)
        .map(
          ([key, items]) => `
            <section style="padding:6px 0">
              <div class="muted" style="padding:6px 10px;font-size:0.76rem;text-transform:uppercase;letter-spacing:0.08em">${escapeHtml(key)}s</div>
              ${items
                .slice(0, 3)
                .map(
                  (notification) => `
                    <div class="dropdown-item" style="align-items:flex-start;${notification.read ? "" : "background:rgba(99,102,241,0.06)"}">
                      <span style="font-size:1.1rem">${notification.icon}</span>
                      <div>
                        <div style="font-weight:600;color:var(--text-primary)">${escapeHtml(notification.title)}</div>
                        <div style="font-size:0.84rem">${escapeHtml(notification.body)}</div>
                        <div class="muted" style="font-size:0.76rem">${timeAgo(notification.time)}</div>
                      </div>
                    </div>
                  `
                )
                .join("")}
            </section>
          `
        )
        .join("")}
      <button class="btn btn-ghost btn-block btn-sm" id="notifMarkAll" type="button">Mark all read</button>
    `;

    const action = element.querySelector("#notifMarkAll");
    if (action) {
      action.onclick = () => {
        this.markAllRead();
      };
    }
  },
};

export async function trackSearch(term) {
  if (!Auth.isAuthenticated() || !term) {
    return;
  }

  try {
    await api.post("/ai/track-search", { term });
  } catch {
    return;
  }
}
