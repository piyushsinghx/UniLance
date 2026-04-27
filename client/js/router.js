/* ===== UniLance — Hash-based SPA Router ===== */

const Router = {
  routes: {},
  currentPath: '',

  add(path, handler) { this.routes[path] = handler; },

  init() {
    window.addEventListener('hashchange', () => this._resolve());
    document.addEventListener('click', (e) => {
      const a = e.target.closest('[data-link]');
      if (a) {
        // Close mobile menu
        const mm = document.getElementById('mobile-menu');
        if (mm) mm.classList.remove('open');
        const toggle = document.getElementById('mobile-toggle');
        if (toggle) toggle.innerHTML = Icons.menu;
        // Close dropdown
        const dm = document.getElementById('dropdown-menu');
        if (dm) dm.classList.remove('open');
      }
    });
    this._resolve();
  },

  _resolve() {
    let hash = window.location.hash.slice(1) || '/';
    const app = document.getElementById('app');

    // Scroll to top
    window.scrollTo(0, 0);

    // Try exact match
    if (this.routes[hash]) {
      this.currentPath = hash;
      this.routes[hash](app, {});
      return;
    }

    // Try parameterized routes like /gigs/:id
    for (const pattern in this.routes) {
      const regex = this._toRegex(pattern);
      const match = hash.match(regex);
      if (match) {
        const keys = (pattern.match(/:([^/]+)/g) || []).map(k => k.slice(1));
        const params = {};
        keys.forEach((k, i) => params[k] = match[i + 1]);
        // Parse query string
        const qIdx = hash.indexOf('?');
        if (qIdx > -1) {
          const sp = new URLSearchParams(hash.slice(qIdx));
          sp.forEach((v, k) => params[k] = v);
        }
        this.currentPath = pattern;
        this.routes[pattern](app, params);
        return;
      }
    }

    // 404
    app.innerHTML = `<div class="page-404 container"><h1>404</h1><p>Page not found.</p><a href="#/" class="btn-primary" data-link>Go Home</a></div>`;
  },

  _toRegex(pattern) {
    // Remove query part for matching
    const base = pattern.split('?')[0];
    const r = base.replace(/:([^/]+)/g, '([^/]+)');
    return new RegExp('^' + r + '(\\?.*)?$');
  },

  navigate(path) {
    window.location.hash = '#' + path;
  }
};
