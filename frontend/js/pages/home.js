import { api } from "../utils/api.js";
import { Auth } from "../utils/auth.js";
import { demoGigs } from "../utils/demo-data.js";
import {
  cloneMarquee,
  debounce,
  initCountUp,
  initScrollReveal,
  initTilt,
  loadScript,
  renderGigCard,
  renderSearchSuggestions,
  staggerChildren,
  trackSearch,
} from "../utils/helpers.js";
import { ThemeManager } from "../utils/theme.js";
import { SocketManager } from "../utils/socket.js";
import { renderNavbar } from "../components/navbar.js";
import { renderBottomNav } from "../components/sidebar.js";
import { renderFooter } from "../components/footer.js";
import { Toast } from "../components/toast.js";

const categories = [
  { icon: "💻", label: "Web Development", count: "1.2k gigs", color: "#6366F1", slug: "web-development" },
  { icon: "🎨", label: "UI/UX Design", count: "840 gigs", color: "#8B5CF6", slug: "design" },
  { icon: "✍️", label: "Content Writing", count: "620 gigs", color: "#22D3EE", slug: "writing" },
  { icon: "🎬", label: "Video Editing", count: "430 gigs", color: "#10B981", slug: "video-editing" },
  { icon: "📱", label: "App Development", count: "380 gigs", color: "#F59E0B", slug: "mobile-development" },
  { icon: "📊", label: "Data Analysis", count: "290 gigs", color: "#EF4444", slug: "data-science" },
  { icon: "🎵", label: "Music & Audio", count: "200 gigs", color: "#EC4899", slug: "other" },
  { icon: "📷", label: "Photography", count: "180 gigs", color: "#06B6D4", slug: "other" },
];

const strings = ["Build Real Projects.", "Earn Real Money.", "Gain Real Experience.", "Join 10,000+ Students."];

function renderCategories() {
  const grid = document.getElementById("categoriesGrid");
  if (!grid) {
    return;
  }

  grid.innerHTML = categories
    .map(
      (category) => `
        <a class="cat-card" href="marketplace.html?category=${category.slug}" style="--cat-color:${category.color}" data-animate>
          <div class="cat-card__icon">${category.icon}</div>
          <h3>${category.label}</h3>
          <div class="cat-card__meta">${category.count}</div>
        </a>
      `
    )
    .join("");
}

async function renderFeaturedGigs() {
  const grid = document.getElementById("featuredGigs");
  if (!grid) {
    return;
  }

  grid.innerHTML = new Array(4)
    .fill("")
    .map(() => '<div class="card skeleton" style="height:320px"></div>')
    .join("");

  let gigs = [];

  try {
    const response = await api.get("/gigs/featured");
    gigs = Array.isArray(response) ? response : response.gigs || [];
  } catch {
    gigs = demoGigs;
  }

  if (!gigs.length) {
    gigs = demoGigs;
  }

  grid.innerHTML = gigs.slice(0, 8).map(renderGigCard).join("");
  staggerChildren(grid);
  initTilt(grid);
}

function initTypewriter() {
  const element = document.getElementById("typewriter");
  if (!element) {
    return;
  }

  let stringIndex = 0;
  let charIndex = 0;
  let deleting = false;

  function type() {
    const current = strings[stringIndex];
    if (deleting) {
      element.textContent = current.slice(0, --charIndex);
    } else {
      element.textContent = current.slice(0, ++charIndex);
    }

    if (!deleting && charIndex === current.length) {
      setTimeout(() => {
        deleting = true;
        type();
      }, 2100);
      return;
    }

    if (deleting && charIndex === 0) {
      deleting = false;
      stringIndex = (stringIndex + 1) % strings.length;
      setTimeout(type, 400);
      return;
    }

    setTimeout(type, deleting ? 50 : 100);
  }

  setTimeout(type, 800);
}

function bindHeroSearch() {
  const form = document.getElementById("heroSearchForm");
  const input = document.getElementById("heroSearch");
  const suggestions = document.getElementById("heroSuggestions");

  if (!form || !input || !suggestions) {
    return;
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const search = input.value.trim();
    window.location.href = `marketplace.html${search ? `?search=${encodeURIComponent(search)}` : ""}`;
  });

  input.addEventListener(
    "input",
    debounce(async (event) => {
      const term = event.target.value.trim();
      if (term.length < 2) {
        renderSearchSuggestions(suggestions, []);
        return;
      }

      try {
        const response = await api.get("/gigs", { search: term, limit: 5 });
        renderSearchSuggestions(suggestions, response.gigs || []);
        trackSearch(term);
      } catch {
        const localMatches = demoGigs.filter((gig) =>
          `${gig.title} ${gig.description} ${gig.tags.join(" ")}`.toLowerCase().includes(term.toLowerCase())
        );
        renderSearchSuggestions(suggestions, localMatches);
      }
    }, 300)
  );

  document.addEventListener("click", (event) => {
    if (!event.target.closest(".search-wrap")) {
      suggestions.classList.remove("show");
    }
  });
}

async function initHeroCanvas() {
  const canvas = document.getElementById("heroCanvas");
  if (!canvas) {
    return;
  }

  try {
    await loadScript("https://cdn.jsdelivr.net/npm/three@0.128.0/build/three.min.js");
  } catch {
    return;
  }

  if (!window.THREE) {
    return;
  }

  const { THREE } = window;
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
  camera.position.set(0, 0, 5);

  const light1 = new THREE.PointLight("#6366F1", 3, 10);
  light1.position.set(-2, 3, 2);
  scene.add(light1);

  const light2 = new THREE.PointLight("#22D3EE", 2, 10);
  light2.position.set(3, -2, 1);
  scene.add(light2);
  scene.add(new THREE.AmbientLight("#ffffff", 0.3));

  const geo = new THREE.IcosahedronGeometry(1.5, 1);
  const mesh = new THREE.Mesh(
    geo,
    new THREE.MeshStandardMaterial({
      color: "#6366F1",
      roughness: 0.3,
      metalness: 0.8,
    })
  );
  scene.add(mesh);

  const wireMesh = new THREE.Mesh(
    geo,
    new THREE.MeshBasicMaterial({
      color: "#8B5CF6",
      wireframe: true,
      transparent: true,
      opacity: 0.2,
    })
  );
  scene.add(wireMesh);

  const particleGeometry = new THREE.BufferGeometry();
  const count = 200;
  const positions = new Float32Array(count * 3);
  for (let index = 0; index < count * 3; index += 3) {
    positions[index] = (Math.random() - 0.5) * 8;
    positions[index + 1] = (Math.random() - 0.5) * 6;
    positions[index + 2] = (Math.random() - 0.5) * 6;
  }
  particleGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  const particles = new THREE.Points(
    particleGeometry,
    new THREE.PointsMaterial({
      color: "#22D3EE",
      size: 0.04,
      transparent: true,
      opacity: 0.8,
    })
  );
  scene.add(particles);

  let mouseX = 0;
  let mouseY = 0;
  let targetX = 0;
  let targetY = 0;

  function resize() {
    const width = canvas.clientWidth || window.innerWidth;
    const height = canvas.clientHeight || window.innerHeight;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }

  window.addEventListener("resize", resize);
  window.addEventListener("mousemove", (event) => {
    mouseX = (event.clientX / window.innerWidth - 0.5) * 2;
    mouseY = -(event.clientY / window.innerHeight - 0.5) * 2;
  });

  const lerp = (a, b, t) => a + (b - a) * t;

  function animate() {
    requestAnimationFrame(animate);
    targetX = lerp(targetX, mouseX, 0.05);
    targetY = lerp(targetY, mouseY, 0.05);
    mesh.rotation.y += 0.004 + targetX * 0.005;
    mesh.rotation.x += 0.002 + targetY * 0.003;
    wireMesh.rotation.copy(mesh.rotation);
    particles.rotation.y -= 0.001;
    particles.rotation.x += 0.0005;
    renderer.render(scene, camera);
  }

  resize();
  animate();
}

async function init() {
  ThemeManager.init();
  Toast.init();
  renderNavbar("#navbarMount", { page: "index.html" });
  renderBottomNav("#bottomNavMount", "home");
  renderFooter("#footerMount");
  renderCategories();
  await renderFeaturedGigs();
  initTypewriter();
  initCountUp();
  initScrollReveal();
  bindHeroSearch();
  cloneMarquee("#testimonialMarquee");
  initHeroCanvas();

  if (Auth.isAuthenticated()) {
    SocketManager.init();
  }
}

init().catch((error) => {
  console.error(error);
  Toast.error("Something went wrong while loading the homepage.");
});
