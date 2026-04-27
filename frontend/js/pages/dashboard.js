import { api } from "../utils/api.js";
import { Auth } from "../utils/auth.js";
import { demoAnalytics, demoOrders } from "../utils/demo-data.js";
import {
  NotificationManager,
  escapeHtml,
  formatCurrency,
  formatDate,
  formatNumber,
  timeAgo,
} from "../utils/helpers.js";
import { ThemeManager } from "../utils/theme.js";
import { SocketManager } from "../utils/socket.js";
import { renderEarningsChart } from "../components/chart.js";
import { Modal } from "../components/modal.js";
import { renderBottomNav, renderSidebar, initSidebarToggle } from "../components/sidebar.js";
import { Toast } from "../components/toast.js";

if (!Auth.requireAuth()) {
  throw new Error("Authentication required");
}

let performanceData = [];
let tableView = "all";
let sortKey = "orderCount";
let sortDirection = -1;
let chartPeriod = "monthly";

function currentTab() {
  return new URLSearchParams(window.location.search).get("tab") || "overview";
}

function setDashboardLabel() {
  const label = document.getElementById("dashboardTabLabel");
  if (!label) {
    return;
  }
  const tab = currentTab();
  label.textContent = tab.charAt(0).toUpperCase() + tab.slice(1);
}

function statMarkup(stats) {
  return stats
    .map(
      (stat) => `
        <article class="stat-card" data-animate>
          <div class="stat-card__top">
            <div class="stat-card__icon" style="background:${stat.bg}">${stat.icon}</div>
            <span class="stat-card__trend ${stat.trend >= 0 ? "up" : "down"}">${stat.trend >= 0 ? "↑" : "↓"} ${Math.abs(stat.trend)}%</span>
          </div>
          <div class="stat-card__value">${stat.value}</div>
          <div class="muted">${stat.label}</div>
        </article>
      `
    )
    .join("");
}

function renderStats(data) {
  const stats = [
    {
      icon: "₹",
      label: "Total Earnings",
      value: formatCurrency(data.totalEarnings || 0),
      trend: 12,
      bg: "rgba(99,102,241,0.15)",
    },
    {
      icon: "📦",
      label: "Active Orders",
      value: formatNumber(data.activeOrders || 0),
      trend: 5,
      bg: "rgba(16,185,129,0.15)",
    },
    {
      icon: "⭐",
      label: "Avg Rating",
      value: Number(data.avgRating || 0).toFixed(1),
      trend: 2,
      bg: "rgba(245,158,11,0.15)",
    },
    {
      icon: "👁",
      label: "Profile Views",
      value: formatNumber(data.totalViews || 0),
      trend: -3,
      bg: "rgba(139,92,246,0.15)",
    },
  ];

  document.getElementById("statsGrid").innerHTML = statMarkup(stats);
}

function renderInsights(data) {
  const container = document.getElementById("quickInsights");
  if (!container) {
    return;
  }

  container.innerHTML = `
    <div class="quick-list__item">
      <strong>${formatNumber(data.totalOrders || 0)} orders managed</strong>
      <span class="muted">Across active, pending, delivered, and completed work.</span>
    </div>
    <div class="quick-list__item">
      <strong>${data.conversionRate || 0}% conversion rate</strong>
      <span class="muted">Views converting into paid work on your public gig pages.</span>
    </div>
    <div class="quick-list__item">
      <strong>${formatNumber(data.pendingOrders || 0)} pending actions</strong>
      <span class="muted">Keep this low by replying fast and tightening delivery expectations.</span>
    </div>
    <div class="quick-list__item">
      <strong>${formatNumber(data.completedOrders || 0)} completed orders</strong>
      <span class="muted">Strong proof of reliability for future clients.</span>
    </div>
  `;
}

async function loadDashboardStats() {
  let data;
  try {
    data = await api.get("/analytics/dashboard");
  } catch {
    data = demoAnalytics.dashboard;
  }

  renderStats(data);
  renderInsights(data);
}

async function loadChartData() {
  let rows;
  try {
    rows = await api.get("/analytics/earnings", { period: chartPeriod });
  } catch {
    rows = demoAnalytics[chartPeriod];
  }

  const prepared = {
    labels: rows.map((item) => item.label),
    earnings: rows.map((item) => item.earnings),
    orders: rows.map((item) => item.orders),
  };

  await renderEarningsChart(document.getElementById("earningsChart"), prepared);
}

function sortPerformanceRows(items) {
  return [...items].sort((first, second) => {
    const a = first[sortKey];
    const b = second[sortKey];
    if (typeof a === "string") {
      return a.localeCompare(b) * sortDirection;
    }
    return ((a || 0) - (b || 0)) * sortDirection;
  });
}

function filteredPerformanceRows() {
  const base = tableView === "top" ? [...performanceData].sort((a, b) => (b.orderCount || 0) - (a.orderCount || 0)).slice(0, 5) : performanceData;
  return sortPerformanceRows(base);
}

function renderPerformanceTable() {
  const body = document.getElementById("performanceRows");
  if (!body) {
    return;
  }

  const rows = filteredPerformanceRows();
  body.innerHTML = rows
    .map(
      (gig) => `
        <tr>
          <td>
            <div style="display:grid;gap:4px">
              <strong>${escapeHtml(gig.title)}</strong>
              <span class="muted" style="font-size:0.82rem">${gig.rating?.toFixed(1) || "0.0"} ★ · ${formatNumber(gig.reviewCount || 0)} reviews</span>
            </div>
          </td>
          <td>${formatNumber(gig.viewCount || 0)}</td>
          <td>${formatNumber(gig.orderCount || 0)}</td>
          <td>
            <div class="progress-bar">
              <div class="progress-bar__fill" style="width:${Math.min(Number(gig.conversionRate || 0) * 12, 100)}%"></div>
            </div>
            <div class="muted" style="font-size:0.8rem;margin-top:8px">${gig.conversionRate || 0}%</div>
          </td>
          <td>${formatCurrency(gig.price || 0)}</td>
          <td><span class="badge ${gig.isActive ? "badge-success" : "badge-warning"}">${gig.isActive ? "Active" : "Paused"}</span></td>
          <td>
            <div class="action-menu">
              <button class="btn-icon" type="button">⋯</button>
              <div class="action-menu__dropdown">
                <a class="dropdown-item" href="gig-detail.html?id=${gig._id}">Open</a>
                <a class="dropdown-item" href="profile.html">Edit profile</a>
              </div>
            </div>
          </td>
        </tr>
      `
    )
    .join("");
}

async function loadPerformance() {
  try {
    performanceData = await api.get("/analytics/gig-performance");
  } catch {
    performanceData = demoAnalytics.performance;
  }
  renderPerformanceTable();
}

function renderOrders(orders) {
  const container = document.getElementById("recentOrders");
  if (!container) {
    return;
  }

  container.innerHTML = orders
    .map(
      (order) => `
        <div class="quick-list__item">
          <div style="display:flex;align-items:center;justify-content:space-between;gap:12px">
            <strong>${escapeHtml(order.gig?.title || "Order")}</strong>
            <span class="badge ${order.status === "completed" ? "badge-success" : order.status === "delivered" ? "badge-warning" : "badge-primary"}">${escapeHtml(order.status)}</span>
          </div>
          <span class="muted">${escapeHtml(order.buyer?.name || "Buyer")} · ${formatCurrency(order.price || 0)}</span>
          <span class="muted" style="font-size:0.8rem">Placed ${timeAgo(order.createdAt)} · Delivery ${formatDate(order.deliveryDate)}</span>
        </div>
      `
    )
    .join("");
}

async function loadOrders() {
  let orders;
  try {
    orders = await api.get("/orders", { role: Auth.getRole(), limit: 5 });
  } catch {
    orders = demoOrders;
  }
  renderOrders(orders);
}

async function generateDescription() {
  const button = document.getElementById("generateBtn");
  const title = document.getElementById("aiTitle").value.trim();
  const category = document.getElementById("aiSkills").value;
  if (!title || !category) {
    Toast.error("Fill in a title and category first.");
    return;
  }

  button.disabled = true;
  button.textContent = "Generating...";

  try {
    const response = await api.post("/ai/generate-description", { title, category });
    const output = document.getElementById("aiOutput");
    const result = document.getElementById("aiResult");
    result.style.display = "block";
    output.value = "";

    const text = response.description || "";
    let index = 0;
    const interval = setInterval(() => {
      output.value += text[index++] || "";
      output.scrollTop = output.scrollHeight;
      if (index >= text.length) {
        clearInterval(interval);
      }
    }, 18);
  } catch {
    Toast.error("AI generation failed.");
  } finally {
    button.disabled = false;
    button.textContent = "Generate with AI ✨";
  }
}

async function suggestPrice() {
  const category = document.getElementById("gigCategory").value;
  const title = document.getElementById("pricingTitle").value.trim();
  const badge = document.getElementById("priceSuggest");
  badge.textContent = "Analyzing...";

  try {
    const response = await api.post("/ai/suggest-pricing", { category, title });
    const recommended = response.recommended || {};
    badge.textContent = `Suggested: Basic ${formatCurrency(recommended.basic || 0)} · Standard ${formatCurrency(
      recommended.standard || 0
    )} · Premium ${formatCurrency(recommended.premium || 0)}. ${response.message || ""}`;
  } catch {
    badge.textContent = "Could not fetch AI pricing right now.";
  }
}

function bindEvents() {
  document.querySelectorAll("#chartPeriodTabs [data-period]").forEach((button) => {
    button.addEventListener("click", async () => {
      chartPeriod = button.dataset.period;
      document.querySelectorAll("#chartPeriodTabs .tab").forEach((tab) => tab.classList.remove("active"));
      button.classList.add("active");
      await loadChartData();
    });
  });

  document.querySelectorAll("#tableTabs [data-view]").forEach((button) => {
    button.addEventListener("click", () => {
      tableView = button.dataset.view;
      document.querySelectorAll("#tableTabs .tab").forEach((tab) => tab.classList.remove("active"));
      button.classList.add("active");
      renderPerformanceTable();
    });
  });

  document.querySelectorAll("#performanceTable th[data-sort]").forEach((header) => {
    header.addEventListener("click", () => {
      const nextKey = header.dataset.sort;
      if (sortKey === nextKey) {
        sortDirection *= -1;
      } else {
        sortKey = nextKey;
        sortDirection = nextKey === "title" ? 1 : -1;
      }
      renderPerformanceTable();
    });
  });

  document.getElementById("generateBtn")?.addEventListener("click", generateDescription);
  document.getElementById("priceSuggestBtn")?.addEventListener("click", suggestPrice);
  document.getElementById("themeToggleTop")?.addEventListener("click", () => ThemeManager.toggle());
  document.getElementById("useDescriptionBtn")?.addEventListener("click", async () => {
    const value = document.getElementById("aiOutput").value.trim();
    if (!value) {
      Toast.error("Generate a description first.");
      return;
    }

    try {
      await navigator.clipboard.writeText(value);
      Toast.success("Description copied to your clipboard.");
    } catch {
      Toast.info("Description is ready in the text area.");
    }
  });

  document.getElementById("createGigForm")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const btn = event.target.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.textContent = "Publishing...";

    const tags = Array.from(document.getElementById("tagInputWrap").querySelectorAll(".tag")).map(tag => tag.textContent.replace('✕', '').trim());
    
    const payload = {
      title: document.getElementById("newGigTitle").value.trim(),
      category: document.getElementById("newGigCategory").value,
      description: document.getElementById("newGigDescription").value.trim(),
      tags: tags,
      pricing: {
        basic: {
          title: "Basic",
          description: document.getElementById("basicDesc").value.trim() || "Basic package",
          price: Number(document.getElementById("basicPrice").value),
          deliveryDays: Number(document.getElementById("basicDays").value),
        }
      }
    };

    if (document.getElementById("standardPrice").value) {
      payload.pricing.standard = {
        title: "Standard",
        description: document.getElementById("standardDesc").value.trim() || "Standard package",
        price: Number(document.getElementById("standardPrice").value),
        deliveryDays: Number(document.getElementById("standardDays").value),
      };
    }

    if (document.getElementById("premiumPrice").value) {
      payload.pricing.premium = {
        title: "Premium",
        description: document.getElementById("premiumDesc").value.trim() || "Premium package",
        price: Number(document.getElementById("premiumPrice").value),
        deliveryDays: Number(document.getElementById("premiumDays").value),
      };
    }

    try {
      await api.post("/gigs", payload);
      Toast.success("Gig published successfully!");
      event.target.reset();
      document.querySelectorAll("#tagInputWrap .tag").forEach(tag => tag.remove());
      Modal.close("createGigModal");
      await loadPerformance();
    } catch (error) {
      Toast.error(error.message || "Failed to publish gig.");
    } finally {
      btn.disabled = false;
      btn.textContent = "Publish Gig 🚀";
    }
  });

  const tagInput = document.getElementById("tagInput");
  const tagWrap = document.getElementById("tagInputWrap");
  if (tagInput && tagWrap) {
    tagInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        const value = tagInput.value.trim();
        if (value) {
          const tag = document.createElement("span");
          tag.className = "tag";
          tag.innerHTML = `${escapeHtml(value)} <button type="button">✕</button>`;
          tag.querySelector("button").onclick = () => tag.remove();
          tagWrap.insertBefore(tag, tagInput);
          tagInput.value = "";
        }
      }
    });
  }

  document.getElementById("mobileSidebarToggle")?.addEventListener("click", () => {
    const sidebar = document.getElementById("sidebar");
    if (!sidebar) {
      return;
    }
    sidebar.style.display = sidebar.style.display === "flex" ? "" : "flex";
  });
}

async function init() {
  ThemeManager.init();
  Toast.init();
  await Auth.hydrate();
  renderSidebar("#sidebarMount", currentTab());
  initSidebarToggle();
  const mobileActive =
    currentTab() === "messages" ? "chat" : currentTab() === "orders" ? "orders" : currentTab() === "gigs" ? "gigs" : "home";
  renderBottomNav("#bottomNavMount", mobileActive);
  NotificationManager.init();
  Modal.init();
  setDashboardLabel();

  const user = Auth.getUser();
  const initials = (user?.name || "AS")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const avatar = document.querySelector(".sidebar__user .avatar-fallback");
  const name = document.querySelector(".sidebar__user-info strong");
  const role = document.querySelector(".sidebar__user-info .muted");
  if (avatar) {
    avatar.textContent = initials;
  }
  if (name) {
    name.textContent = user?.name || "Student";
  }
  if (role) {
    role.textContent = user?.role || "seller";
  }

  bindEvents();
  await Promise.all([loadDashboardStats(), loadChartData(), loadPerformance(), loadOrders()]);

  await SocketManager.init();
  SocketManager.on("orderUpdate", async () => {
    await Promise.all([loadDashboardStats(), loadOrders()]);
  });
}

init().catch((error) => {
  console.error(error);
  Toast.error("Dashboard failed to load.");
});
