/* ===== UniLance — Reusable Components ===== */

/* ── Auth State ── */
const Auth = {
  _user: null,
  _listeners: [],
  init() {
    const s = localStorage.getItem('unilance_user');
    if (s) { try { this._user = JSON.parse(s); } catch(e){} }
  },
  get user() { return this._user; },
  login(userData) { this._user = userData; localStorage.setItem('unilance_user', JSON.stringify(userData)); this._notify(); },
  logout() { this._user = null; localStorage.removeItem('unilance_user'); this._notify(); },
  update(u) { this._user = { ...this._user, ...u }; localStorage.setItem('unilance_user', JSON.stringify(this._user)); this._notify(); },
  onChange(fn) { this._listeners.push(fn); },
  _notify() { this._listeners.forEach(fn => fn(this._user)); }
};

/* ── Theme ── */
const Theme = {
  init() {
    const saved = localStorage.getItem('unilance_theme');
    if (saved === 'light') document.documentElement.classList.add('light');
  },
  toggle() {
    document.documentElement.classList.toggle('light');
    localStorage.setItem('unilance_theme', document.documentElement.classList.contains('light') ? 'light' : 'dark');
  },
  get isDark() { return !document.documentElement.classList.contains('light'); }
};

/* ── Navbar ── */
function renderNavbar() {
  const nav = document.getElementById('navbar');
  if (!nav) return;
  const user = Auth.user;

  nav.className = 'navbar glass';
  nav.innerHTML = `
    <div class="nav-inner container">
      <a href="#/" class="nav-logo" data-link>
        <div class="logo-icon">${Icons.zap}</div>
        <span class="logo-text"><span class="gradient-text">Uni</span>Lance</span>
      </a>

      <div class="nav-links desktop-only">
        <a href="#/gigs" class="nav-link" data-link>Explore Gigs</a>
        <a href="#/how-it-works" class="nav-link" data-link>How It Works</a>
        <a href="#/pricing" class="nav-link" data-link>Pricing</a>
        ${user?.role === 'seller' ? '<a href="#/dashboard" class="nav-link" data-link>Dashboard</a>' : ''}
      </div>

      <div class="nav-actions">
        <button class="theme-toggle-btn" id="theme-toggle" aria-label="Toggle theme">
          <span class="theme-icon">${Theme.isDark ? Icons.sun : Icons.moon}</span>
        </button>

        ${user ? `
          <a href="#/messages" class="nav-icon-btn desktop-only" data-link title="Messages">${Icons.messageSquare}</a>
          <div class="nav-dropdown" id="user-dropdown">
            <button class="nav-avatar-btn" id="avatar-toggle">
              <div class="avatar-circle">${user.name?.charAt(0).toUpperCase() || 'U'}</div>
              <span class="avatar-name desktop-only">${escapeHtml(user.name)}</span>
              ${Icons.chevronDown}
            </button>
            <div class="dropdown-menu" id="dropdown-menu">
              <div class="dropdown-header">
                <p class="dropdown-name">${escapeHtml(user.name)}</p>
                <p class="dropdown-email">${escapeHtml(user.email)}</p>
                <span class="dropdown-role">${user.role}</span>
              </div>
              <div class="dropdown-links">
                <a href="#/profile" class="dropdown-link" data-link>${Icons.user} My Profile</a>
                <a href="#/dashboard" class="dropdown-link" data-link>${Icons.layout} Dashboard</a>
                <a href="#/messages" class="dropdown-link" data-link>${Icons.messageSquare} Messages</a>
                <div class="dropdown-sep"></div>
                <button class="dropdown-link dropdown-logout" id="nav-logout">${Icons.logOut} Sign Out</button>
              </div>
            </div>
          </div>
        ` : `
          <div class="nav-auth desktop-only">
            <a href="#/login" class="nav-signin" data-link>Sign In</a>
            <a href="#/register" class="btn-primary nav-cta" data-link>Get Started</a>
          </div>
        `}

        <button class="nav-hamburger mobile-only" id="mobile-toggle">${Icons.menu}</button>
      </div>
    </div>

    <div class="mobile-menu" id="mobile-menu">
      <div class="mobile-menu-inner">
        <a href="#/gigs" class="mobile-link" data-link>Explore Gigs</a>
        <a href="#/how-it-works" class="mobile-link" data-link>How It Works</a>
        <a href="#/pricing" class="mobile-link" data-link>Pricing</a>
        ${user ? `
          <div class="mobile-sep"></div>
          <a href="#/dashboard" class="mobile-link" data-link>${Icons.layout} Dashboard</a>
          <a href="#/messages" class="mobile-link" data-link>${Icons.messageSquare} Messages</a>
          <a href="#/profile" class="mobile-link" data-link>${Icons.user} Profile</a>
          <button class="mobile-link mobile-logout" id="mobile-logout">${Icons.logOut} Sign Out</button>
        ` : `
          <div class="mobile-sep"></div>
          <a href="#/login" class="mobile-link-btn mobile-signin" data-link>Sign In</a>
          <a href="#/register" class="mobile-link-btn mobile-cta btn-primary" data-link>Get Started Free</a>
        `}
      </div>
    </div>
  `;

  // Event listeners
  const toggle = nav.querySelector('#mobile-toggle');
  const mobileMenu = nav.querySelector('#mobile-menu');
  if (toggle) toggle.addEventListener('click', () => {
    const open = mobileMenu.classList.toggle('open');
    toggle.innerHTML = open ? Icons.x : Icons.menu;
  });

  const avatarToggle = nav.querySelector('#avatar-toggle');
  const dropdownMenu = nav.querySelector('#dropdown-menu');
  if (avatarToggle) {
    avatarToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdownMenu.classList.toggle('open');
    });
    document.addEventListener('click', () => dropdownMenu?.classList.remove('open'));
  }

  const themeBtn = nav.querySelector('#theme-toggle');
  if (themeBtn) themeBtn.addEventListener('click', () => {
    Theme.toggle();
    themeBtn.querySelector('.theme-icon').innerHTML = Theme.isDark ? Icons.sun : Icons.moon;
  });

  const logoutBtn = nav.querySelector('#nav-logout');
  const mobileLogout = nav.querySelector('#mobile-logout');
  const doLogout = () => { Auth.logout(); window.location.hash = '#/'; renderNavbar(); renderFooter(); };
  if (logoutBtn) logoutBtn.addEventListener('click', doLogout);
  if (mobileLogout) mobileLogout.addEventListener('click', doLogout);
}

/* ── Footer ── */
function renderFooter() {
  const el = document.getElementById('footer-root');
  if (!el) return;
  el.innerHTML = `
    <div class="footer-inner container">
      <div class="footer-grid">
        <div class="footer-brand">
          <a href="#/" class="footer-logo" data-link>
            <div class="logo-icon">U</div>
            <span class="logo-text">Uni<span style="color:var(--color-primary)">Lance</span></span>
          </a>
          <p class="footer-desc">The premier freelance marketplace built exclusively for university students. Hire talent, build projects, grow skills.</p>
          <div class="footer-socials">
            <a href="#" class="social-btn">${Icons.gitBranch}</a>
            <a href="#" class="social-btn">${Icons.messageCircle}</a>
            <a href="#" class="social-btn">${Icons.link}</a>
            <a href="#" class="social-btn">${Icons.mail}</a>
          </div>
        </div>
        <div class="footer-col">
          <h4>Platform</h4>
          <ul>
            <li><a href="#/gigs" data-link>Explore Gigs</a></li>
            <li><a href="#/how-it-works" data-link>How It Works</a></li>
            <li><a href="#/pricing" data-link>Pricing</a></li>
            <li><a href="#/categories" data-link>Categories</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4>Resources</h4>
          <ul>
            <li><a href="#/help-center" data-link>Help Center</a></li>
            <li><a href="#/blog" data-link>Blog</a></li>
            <li><a href="#/community" data-link>Community</a></li>
            <li><a href="#/student-guide" data-link>Student Guide</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4>Legal &amp; Company</h4>
          <ul>
            <li><a href="#/terms" data-link>Terms of Service</a></li>
            <li><a href="#/privacy" data-link>Privacy Policy</a></li>
            <li><a href="#/cookies" data-link>Cookie Policy</a></li>
            <li><a href="#/trust-safety" data-link>Trust &amp; Safety</a></li>
            <li><a href="#/about" data-link>About Us</a></li>
            <li><a href="#/contact" data-link>Contact</a></li>
            <li><a href="#/careers" data-link>Careers</a></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; ${new Date().getFullYear()} UniLance. All rights reserved.</p>
        <p>Made with ❤️ by students, for students.</p>
      </div>
    </div>
  `;
}

/* ── Gig Card ── */
const CATEGORY_COLORS = {
  'web-development': '#4f46e5', 'design': '#e11d48', 'writing': '#059669',
  'video-editing': '#7c3aed', 'mobile-development': '#ea580c',
  'data-science': '#0891b2', 'marketing': '#d97706', 'other': '#64748b'
};
const CATEGORY_LABELS = {
  'web-development': 'Web Dev', 'design': 'Design', 'writing': 'Writing',
  'video-editing': 'Video', 'mobile-development': 'Mobile',
  'data-science': 'Data Science', 'marketing': 'Marketing', 'other': 'Other'
};

function renderGigCard(gig) {
  const { _id, title, images, pricing, rating, reviewCount, seller, category, orderCount } = gig;
  const color = CATEGORY_COLORS[category] || '#6366f1';
  const label = CATEGORY_LABELS[category] || category;
  const price = pricing?.basic?.price || 0;
  const delivery = pricing?.basic?.deliveryTime;
  const img = images?.length > 0
    ? `<img src="${images[0]}" alt="${escapeHtml(title)}" loading="lazy" class="gig-card-img">`
    : `<div class="gig-card-placeholder" style="background:linear-gradient(135deg,${color},${color}cc)"><span>${title?.charAt(0) || 'G'}</span></div>`;

  return `
    <div class="gig-card card-hover">
      <a href="#/gigs/${_id}" class="gig-card-link" data-link>
        <div class="gig-card-image">
          ${img}
          <div class="gig-card-overlay">
            <div class="gig-card-seller">
              <div class="avatar-sm">${seller?.name?.charAt(0) || 'U'}</div>
              <div class="gig-card-seller-info">
                <span class="seller-name">${escapeHtml(seller?.name || 'Unknown')}</span>
                ${seller?.university ? `<span class="seller-uni">${escapeHtml(seller.university)}</span>` : ''}
              </div>
            </div>
          </div>
          <span class="gig-card-badge">${escapeHtml(label)}</span>
        </div>
        <div class="gig-card-body">
          <h3 class="gig-card-title">${escapeHtml(truncate(title, 65))}</h3>
          <div class="gig-card-rating">
            ${renderStars(rating)}
            <span class="rating-value">${(rating || 0).toFixed(1)}</span>
            <span class="rating-count">(${reviewCount || 0})</span>
          </div>
          <div class="gig-card-footer">
            <div class="gig-card-meta">
              ${delivery ? `<span>${Icons.clock} ${delivery}d</span>` : ''}
              ${orderCount > 0 ? `<span>${Icons.shoppingBag} ${orderCount}</span>` : ''}
            </div>
            <div class="gig-card-price">
              <span class="price-label">Starting at</span>
              <span class="price-value">${formatPrice(price)}</span>
            </div>
          </div>
        </div>
      </a>
    </div>
  `;
}

/* ── Skeleton Loader ── */
function renderSkeletonCards(count) {
  let html = '';
  for (let i = 0; i < count; i++) {
    html += `<div class="skeleton-card"><div class="skeleton skeleton-img"></div><div class="skeleton-body"><div class="skeleton skeleton-title"></div><div class="skeleton skeleton-text"></div><div class="skeleton skeleton-text short"></div></div></div>`;
  }
  return html;
}

function showPageLoader() { const l = document.getElementById('page-loader'); if (l) l.classList.remove('hidden'); }
function hidePageLoader() { const l = document.getElementById('page-loader'); if (l) l.classList.add('hidden'); }
