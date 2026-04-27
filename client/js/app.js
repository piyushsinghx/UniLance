/* ===== UniLance — Main App Entry ===== */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize states
  Auth.init();
  Theme.init();

  // Render static shell
  renderNavbar();
  renderFooter();

  // Listen to auth changes to update navbar
  Auth.onChange(() => {
    renderNavbar();
  });

  // Register Routes
  Router.add('/', Pages.renderHome);
  Router.add('/login', Pages.renderLogin);
  Router.add('/register', Pages.renderRegister);
  Router.add('/gigs', Pages.renderGigs);
  Router.add('/dashboard', Pages.renderDashboard);
  
  Router.add('/gigs/:id', Pages.renderGigDetails);
  Router.add('/how-it-works', Pages.renderHowItWorks);
  Router.add('/pricing', Pages.renderPricing);
  Router.add('/categories', Pages.renderCategories);
  Router.add('/about', Pages.renderAbout);
  Router.add('/profile', Pages.renderProfile);
  Router.add('/messages', Pages.renderMessages);
  
  // Other routes can be added here or mapped to placeholders
  const placeholder = (title) => (app) => app.innerHTML = `<div class="container py-20 text-center"><h1>${title}</h1><p>This page is under construction.</p></div>`;
  
  Router.add('/help-center', placeholder('Help Center'));
  Router.add('/terms', placeholder('Terms of Service'));
  Router.add('/privacy', placeholder('Privacy Policy'));

  // Start Router
  Router.init();
});
