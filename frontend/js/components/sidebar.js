export function renderSidebar(target, active = "overview") {
  const mount = typeof target === "string" ? document.querySelector(target) : target;
  if (!mount) {
    return;
  }

  mount.innerHTML = `
    <aside class="sidebar" id="sidebar">
      <div class="sidebar__brand">
        <div style="display:flex;align-items:center;justify-content:space-between;gap:12px">
          <a class="navbar__brand" href="index.html">
            <span class="navbar__mark">
              <img src="../assets/icons/logo-mark.svg" alt="UniLance" width="22" height="22">
            </span>
            <span class="nav-text"><span class="logo-uni">Uni</span><span class="logo-lance">Lance</span></span>
          </a>
          <button class="btn-icon" type="button" id="sidebarToggle">←</button>
        </div>
      </div>
      <nav class="sidebar__nav">
        <div class="nav-section">
          <div class="nav-label">Main</div>
          <a class="nav-item ${active === "overview" ? "active" : ""}" href="dashboard.html?tab=overview"><span>🏠</span><span class="nav-text">Overview</span></a>
          <a class="nav-item ${active === "gigs" ? "active" : ""}" href="dashboard.html?tab=gigs"><span>💼</span><span class="nav-text">My Gigs</span></a>
          <a class="nav-item ${active === "orders" ? "active" : ""}" href="dashboard.html?tab=orders"><span>📦</span><span class="nav-text">Orders</span></a>
          <a class="nav-item ${active === "messages" ? "active" : ""}" href="dashboard.html?tab=messages"><span>💬</span><span class="nav-text">Messages</span><span class="nav-badge">5</span></a>
        </div>
        <div class="nav-section">
          <div class="nav-label">Manage</div>
          <button class="nav-item" type="button" data-modal-open="aiDescriptionModal"><span>✨</span><span class="nav-text">AI Generator</span></button>
          <a class="nav-item" href="marketplace.html"><span>📈</span><span class="nav-text">Marketplace</span></a>
          <a class="nav-item" href="profile.html"><span>👤</span><span class="nav-text">Public Profile</span></a>
        </div>
        <div class="nav-section">
          <div class="nav-label">Account</div>
          <a class="nav-item" href="chat.html"><span>🗨️</span><span class="nav-text">Support</span></a>
          <a class="nav-item" href="login.html"><span>↩</span><span class="nav-text">Switch Account</span></a>
        </div>
      </nav>
      <div class="sidebar__footer">
        <div class="sidebar__user">
          <span class="avatar avatar-fallback" style="width:42px;height:42px">AS</span>
          <div class="sidebar__user-info">
            <strong>Arjun Singh</strong>
            <div class="muted" style="font-size:0.82rem">Seller</div>
          </div>
        </div>
      </div>
    </aside>
  `;
}

export function initSidebarToggle() {
  const toggle = document.getElementById("sidebarToggle");
  const sidebar = document.getElementById("sidebar");
  if (!toggle || !sidebar) {
    return;
  }

  toggle.addEventListener("click", () => {
    sidebar.classList.toggle("collapsed");
    toggle.textContent = sidebar.classList.contains("collapsed") ? "→" : "←";
    localStorage.setItem("sidebarCollapsed", sidebar.classList.contains("collapsed"));
  });

  if (localStorage.getItem("sidebarCollapsed") === "true") {
    sidebar.classList.add("collapsed");
    toggle.textContent = "→";
  }
}

export function renderBottomNav(target, active = "home") {
  const mount = typeof target === "string" ? document.querySelector(target) : target;
  if (!mount) {
    return;
  }

  mount.innerHTML = `
    <nav class="bottom-nav">
      <a class="${active === "home" ? "is-active" : ""}" href="index.html">🏠<span>Home</span></a>
      <a class="${active === "gigs" ? "is-active" : ""}" href="marketplace.html">💼<span>Gigs</span></a>
      <a class="${active === "orders" ? "is-active" : ""}" href="dashboard.html?tab=orders">📦<span>Orders</span></a>
      <a class="${active === "chat" ? "is-active" : ""}" href="chat.html">💬<span>Chat</span></a>
      <a class="${active === "profile" ? "is-active" : ""}" href="profile.html">👤<span>Profile</span></a>
    </nav>
  `;
}
