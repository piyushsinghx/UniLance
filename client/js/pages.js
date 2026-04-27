/* ===== UniLance — Pages ===== */

const Pages = {
  async renderHome(app) {
    app.innerHTML = `
      <section class="hero-section">
        <div class="perspective-grid"></div>
        <div class="hero-content container animate-fade-in">
          <div class="trust-badge">
            ${Icons.zap} Trusted by 10,000+ University Students ${Icons.checkCircle}
          </div>
          <h1>Hire Student Talent.<br/><span class="gradient-text-animated">Build Real Projects.</span></h1>
          <p class="hero-sub">Students who <span class="gradient-text">build stunning websites, design beautiful brands, write compelling content.</span></p>
          
          <form class="search-form" id="home-search">
            <div class="search-input-wrapper">
              <span class="search-icon">${Icons.search}</span>
              <input type="text" id="home-search-input" placeholder='Try "React website", "logo design"...' />
              <button type="submit" class="btn-primary">Search</button>
            </div>
          </form>

          <div class="popular-tags">
            <span>Popular:</span>
            <a href="#/gigs?search=React Developer">React Developer</a>
            <a href="#/gigs?search=Logo Design">Logo Design</a>
            <a href="#/gigs?search=Video Editing">Video Editing</a>
          </div>
        </div>
      </section>

      <section class="stats-section py-20 border-y">
        <div class="container grid-4">
          <div class="stat-card">
            <div class="stat-icon">${Icons.users}</div>
            <div class="stat-value">10,000+</div>
            <div class="stat-label">Student Freelancers</div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">${Icons.trendingUp}</div>
            <div class="stat-value">50,000+</div>
            <div class="stat-label">Projects Completed</div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">${Icons.shield}</div>
            <div class="stat-value">500+</div>
            <div class="stat-label">Universities</div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">${Icons.star}</div>
            <div class="stat-value">4.9</div>
            <div class="stat-label">Average Rating</div>
          </div>
        </div>
      </section>

      <section class="featured-gigs-section py-20 bg-secondary">
        <div class="container">
          <div class="section-header">
            <h2>Featured <span class="gradient-text">Gigs</span></h2>
            <a href="#/gigs" class="btn-text">View All ${Icons.arrowRight}</a>
          </div>
          <div class="grid-4" id="featured-gigs-container">
            ${renderSkeletonCards(4)}
          </div>
        </div>
      </section>
    `;

    // Event Listeners
    const form = document.getElementById('home-search');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const val = document.getElementById('home-search-input').value.trim();
        if (val) Router.navigate('/gigs?search=' + encodeURIComponent(val));
      });
    }

    // Fetch featured gigs
    try {
      const res = await Api.getFeaturedGigs();
      const container = document.getElementById('featured-gigs-container');
      if (container) {
        if (res.data && res.data.length > 0) {
          container.innerHTML = res.data.slice(0, 4).map(gig => renderGigCard(gig)).join('');
        } else {
          container.innerHTML = `<p class="empty-state">No featured gigs found.</p>`;
        }
      }
    } catch(e) {
      const container = document.getElementById('featured-gigs-container');
      if(container) container.innerHTML = `<p class="error-state">Failed to load featured gigs.</p>`;
    }
  },

  renderLogin(app) {
    if (Auth.user) return Router.navigate('/dashboard');

    app.innerHTML = `
      <div class="auth-page animate-fade-in">
        <div class="auth-left desktop-only">
          <div class="auth-left-content">
            <div class="logo-wrapper">
              <div class="logo-icon">${Icons.zap}</div>
              <h2>UniLance</h2>
            </div>
            <h1>Welcome back to the<br/>Student Economy</h1>
            <p>Thousands of students are already building careers and earning real money on UniLance.</p>
          </div>
        </div>
        <div class="auth-right">
          <div class="auth-form-container">
            <h2>Sign in</h2>
            <p class="auth-subtitle">Don't have an account? <a href="#/register">Get started free</a></p>
            
            <form id="login-form">
              <div class="form-group">
                <label>Email address</label>
                <div class="input-wrapper">
                  <span class="input-icon">${Icons.mail}</span>
                  <input type="email" id="login-email" required />
                </div>
              </div>
              <div class="form-group">
                <label>Password</label>
                <div class="input-wrapper">
                  <span class="input-icon">${Icons.lock}</span>
                  <input type="password" id="login-pwd" required />
                  <button type="button" class="pwd-toggle" id="toggle-pwd">${Icons.eye}</button>
                </div>
              </div>
              <div class="form-actions text-right">
                <a href="#/forgot-password" class="link-sm">Forgot password?</a>
              </div>
              <button type="submit" class="btn-primary btn-full mt-4" id="login-btn">Sign In ${Icons.arrowRight}</button>
            </form>
          </div>
        </div>
      </div>
    `;

    const form = document.getElementById('login-form');
    const pwdInput = document.getElementById('login-pwd');
    const pwdToggle = document.getElementById('toggle-pwd');
    const btn = document.getElementById('login-btn');

    pwdToggle.addEventListener('click', () => {
      const type = pwdInput.getAttribute('type') === 'password' ? 'text' : 'password';
      pwdInput.setAttribute('type', type);
      pwdToggle.innerHTML = type === 'password' ? Icons.eye : Icons.eyeOff;
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('login-email').value;
      const pwd = pwdInput.value;
      btn.disabled = true;
      btn.innerHTML = 'Signing in...';
      try {
        const res = await Api.login({ email, password: pwd });
        Auth.login(res.data);
        Toast.success('Welcome back! 🎉');
        Router.navigate('/dashboard');
      } catch(err) {
        Toast.error(err.response?.data?.message || 'Invalid credentials');
        btn.disabled = false;
        btn.innerHTML = `Sign In ${Icons.arrowRight}`;
      }
    });
  },

  renderRegister(app) {
    if (Auth.user) return Router.navigate('/dashboard');

    app.innerHTML = `
      <div class="auth-page animate-fade-in">
        <div class="auth-right" style="flex:1; max-width:600px; margin:0 auto; padding: 40px 20px;">
          <div class="auth-form-container glass" style="width:100%; border-radius:24px;">
            <div class="text-center mb-6">
              <div class="logo-icon mx-auto mb-4" style="width:48px;height:48px;font-size:24px;">U</div>
              <h2>Create your account</h2>
              <p class="auth-subtitle text-center">Join the student freelance revolution</p>
            </div>
            
            <form id="register-form">
              <div class="form-group">
                <label>I want to</label>
                <div class="role-selector grid-2">
                  <button type="button" class="role-btn active" data-role="buyer">Hire Talent</button>
                  <button type="button" class="role-btn" data-role="seller">Sell Services</button>
                </div>
                <input type="hidden" id="reg-role" value="buyer" />
              </div>

              <div class="form-group">
                <label>Full Name</label>
                <div class="input-wrapper">
                  <span class="input-icon">${Icons.user}</span>
                  <input type="text" id="reg-name" required />
                </div>
              </div>

              <div class="form-group">
                <label>College Email</label>
                <div class="input-wrapper">
                  <span class="input-icon">${Icons.mail}</span>
                  <input type="email" id="reg-email" placeholder="you@university.edu" required />
                </div>
              </div>

              <div class="form-group">
                <label>Password</label>
                <div class="input-wrapper">
                  <span class="input-icon">${Icons.lock}</span>
                  <input type="password" id="reg-pwd" minlength="6" required />
                </div>
              </div>

              <button type="submit" class="btn-primary btn-full mt-6" id="reg-btn">Create Account</button>
            </form>
            <p class="text-center mt-6 text-sm">Already have an account? <a href="#/login">Sign in</a></p>
          </div>
        </div>
      </div>
    `;

    const form = document.getElementById('register-form');
    const roleBtns = document.querySelectorAll('.role-btn');
    const roleInput = document.getElementById('reg-role');
    const btn = document.getElementById('reg-btn');

    roleBtns.forEach(b => {
      b.addEventListener('click', () => {
        roleBtns.forEach(btn => btn.classList.remove('active'));
        b.classList.add('active');
        roleInput.value = b.dataset.role;
      });
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('reg-name').value;
      const email = document.getElementById('reg-email').value;
      const password = document.getElementById('reg-pwd').value;
      const role = roleInput.value;

      btn.disabled = true;
      btn.innerHTML = 'Creating...';
      try {
        const res = await Api.register({ name, email, password, role, university: 'UniLance University' });
        Auth.login(res.data);
        Toast.success('Account created!');
        Router.navigate('/dashboard');
      } catch(err) {
        Toast.error(err.response?.data?.message || 'Registration failed');
        btn.disabled = false;
        btn.innerHTML = 'Create Account';
      }
    });
  },

  async renderGigs(app, params) {
    app.innerHTML = `
      <div class="container py-8 animate-fade-in">
        <div class="page-header mb-8">
          <h1>${params.search ? 'Results for "' + escapeHtml(params.search) + '"' : (params.category ? 'Category: ' + escapeHtml(params.category) : 'Explore Gigs')}</h1>
          <p class="text-secondary">Find the perfect service for your project</p>
        </div>

        <div class="filter-bar flex gap-4 mb-8">
          <form id="gigs-search-form" class="flex-1 relative input-wrapper">
            <span class="input-icon" style="top:50%;transform:translateY(-50%)">${Icons.search}</span>
            <input type="text" id="gigs-search-input" value="${escapeHtml(params.search || '')}" placeholder="Search gigs..." />
          </form>
          <button class="btn-secondary" id="toggle-filters">${Icons.slidersH} Filters</button>
        </div>

        <div class="grid-4" id="gigs-container">
          ${renderSkeletonCards(8)}
        </div>
      </div>
    `;

    const searchForm = document.getElementById('gigs-search-form');
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const val = document.getElementById('gigs-search-input').value.trim();
      Router.navigate(val ? '/gigs?search=' + encodeURIComponent(val) : '/gigs');
    });

    try {
      const res = await Api.getGigs(params);
      const container = document.getElementById('gigs-container');
      if (res.data.gigs && res.data.gigs.length > 0) {
        container.innerHTML = res.data.gigs.map(g => renderGigCard(g)).join('');
      } else {
        container.innerHTML = `<div class="empty-state"><h3>No gigs found</h3><p>Try adjusting your search criteria</p></div>`;
        container.classList.remove('grid-4');
      }
    } catch(e) {
      document.getElementById('gigs-container').innerHTML = `<p class="error-state">Failed to load gigs.</p>`;
    }
  },

  renderDashboard(app) {
    if (!Auth.user) return Router.navigate('/login');
    const user = Auth.user;

    app.innerHTML = `
      <div class="container py-8 animate-fade-in">
        <div class="page-header mb-8">
          <h1>Dashboard</h1>
          <p class="text-secondary">Welcome back, ${escapeHtml(user.name)}!</p>
        </div>
        <div class="grid-3" id="dash-stats">
          <div class="stat-card glass"><div class="skeleton" style="height:60px"></div></div>
          <div class="stat-card glass"><div class="skeleton" style="height:60px"></div></div>
          <div class="stat-card glass"><div class="skeleton" style="height:60px"></div></div>
        </div>
        
        <div class="mt-8 glass p-6 border-radius">
          <h2>Recent Orders</h2>
          <div id="dash-orders" class="mt-4"><p>Loading...</p></div>
        </div>
      </div>
    `;

    // Fetch dashboard data
    (async () => {
      try {
        const res = await Api.getOrders({ limit: 5 });
        const orders = res.data.orders || [];
        const oContainer = document.getElementById('dash-orders');
        
        document.getElementById('dash-stats').innerHTML = `
          <div class="stat-card glass border">
            <div class="stat-label">Total Orders</div>
            <div class="stat-value">${res.data.totalOrders || orders.length}</div>
          </div>
          <div class="stat-card glass border">
            <div class="stat-label">Role</div>
            <div class="stat-value capitalize">${user.role}</div>
          </div>
          <div class="stat-card glass border">
            <div class="stat-label">Status</div>
            <div class="stat-value text-success">Active</div>
          </div>
        `;

        if (orders.length > 0) {
          oContainer.innerHTML = orders.map(o => `
            <div class="flex justify-between items-center p-4 border-b">
              <div>
                <p class="font-bold">${escapeHtml(o.gig?.title || 'Gig')}</p>
                <p class="text-sm text-secondary">Ordered on ${formatDate(o.createdAt)}</p>
              </div>
              <span class="badge ${o.status === 'completed' ? 'badge-success' : 'badge-warning'}">${o.status}</span>
            </div>
          `).join('');
        } else {
          oContainer.innerHTML = `<p class="text-secondary">No recent orders found.</p>`;
        }

      } catch(e) {
        document.getElementById('dash-orders').innerHTML = `<p class="error-state">Failed to load data</p>`;
      }
    })();
  }
};
