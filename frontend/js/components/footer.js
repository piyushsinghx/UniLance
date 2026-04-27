export function renderFooter(target) {
  const mount = typeof target === "string" ? document.querySelector(target) : target;
  if (!mount) {
    return;
  }

  const year = new Date().getFullYear();
  mount.innerHTML = `
    <footer class="site-footer">
      <div class="container">
        <div class="footer__grid">
          <div class="footer__brand">
            <a class="navbar__brand" href="index.html" style="margin-bottom:14px;display:inline-flex">
              <span class="navbar__mark">
                <img src="../assets/icons/logo-mark.svg" alt="UniLance" width="22" height="22">
              </span>
              <span><span class="logo-uni">Uni</span><span class="logo-lance">Lance</span></span>
            </a>
            <p class="muted" style="max-width:300px;font-size:0.88rem">
              A trusted freelance marketplace built exclusively for verified university students. Earn, build, and grow.
            </p>
            <div class="footer__socials">
              <a href="#" aria-label="Twitter" class="btn-icon">𝕏</a>
              <a href="#" aria-label="LinkedIn" class="btn-icon">in</a>
              <a href="#" aria-label="GitHub" class="btn-icon">⌂</a>
              <a href="#" aria-label="Instagram" class="btn-icon">◻</a>
            </div>
          </div>

          <nav class="footer__col">
            <h4>Platform</h4>
            <a href="marketplace.html">Browse Gigs</a>
            <a href="signup.html">Become a Seller</a>
            <a href="dashboard.html">Dashboard</a>
            <a href="chat.html">Messages</a>
          </nav>

          <nav class="footer__col">
            <h4>Resources</h4>
            <a href="#">Student Guide</a>
            <a href="#">Pricing Tips</a>
            <a href="#">Help Center</a>
            <a href="#">Blog</a>
          </nav>

          <nav class="footer__col">
            <h4>Company</h4>
            <a href="#">About UniLance</a>
            <a href="#">Careers</a>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </nav>
        </div>

        <div class="footer__bottom">
          <p class="muted">© ${year} UniLance. All rights reserved. Built for students, by students.</p>
          <div class="footer__badges">
            <span class="badge badge-success">🔒 SSL Secured</span>
            <span class="badge badge-primary">🎓 Student Verified</span>
          </div>
        </div>
      </div>
    </footer>
  `;
}
