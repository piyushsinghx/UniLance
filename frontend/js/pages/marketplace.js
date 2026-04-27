import { api } from "../utils/api.js";
import { demoGigs } from "../utils/demo-data.js";
import { renderGigCard, formatNumber, initScrollReveal, initTilt, trackSearch } from "../utils/helpers.js";
import { ThemeManager } from "../utils/theme.js";
import { renderNavbar } from "../components/navbar.js";
import { renderBottomNav } from "../components/sidebar.js";
import { renderFooter } from "../components/footer.js";
import { Toast } from "../components/toast.js";

const categories = [
  { value: "", label: "All" },
  { value: "web-development", label: "Web Development" },
  { value: "design", label: "UI / UX Design" },
  { value: "writing", label: "Content Writing" },
  { value: "video-editing", label: "Video Editing" },
  { value: "mobile-development", label: "App Development" },
  { value: "data-science", label: "Data Analysis" },
  { value: "marketing", label: "Marketing" },
];

const state = {
  category: new URLSearchParams(window.location.search).get("category") || "",
  search: new URLSearchParams(window.location.search).get("search") || "",
  sort: new URLSearchParams(window.location.search).get("sort") || "",
  rating: new URLSearchParams(window.location.search).get("rating") || "",
  minPrice: new URLSearchParams(window.location.search).get("minPrice") || "",
  maxPrice: new URLSearchParams(window.location.search).get("maxPrice") || "",
  page: Number(new URLSearchParams(window.location.search).get("page") || 1),
  limit: 8,
};

let currentPages = 1;
let currentData = [];

function updateUrl() {
  const params = new URLSearchParams();
  Object.entries(state).forEach(([key, value]) => {
    if (value !== "" && value !== null && value !== undefined && !(key === "page" && Number(value) === 1) && key !== "limit") {
      params.set(key, value);
    }
  });

  const query = params.toString();
  window.history.replaceState(null, "", `marketplace.html${query ? `?${query}` : ""}`);
}

function syncControls() {
  const search = document.getElementById("marketSearch");
  const minPrice = document.getElementById("minPrice");
  const maxPrice = document.getElementById("maxPrice");
  const sort = document.getElementById("sortSelect");

  if (search) {
    search.value = state.search;
  }
  if (minPrice) {
    minPrice.value = state.minPrice;
  }
  if (maxPrice) {
    maxPrice.value = state.maxPrice;
  }
  if (sort) {
    sort.value = state.sort;
  }

  document.querySelectorAll("[data-rating]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.rating === String(state.rating));
  });

  document.querySelectorAll("[data-category]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.category === String(state.category));
  });
}

function renderCategoryFilters() {
  const container = document.getElementById("categoryFilters");
  if (!container) {
    return;
  }

  container.innerHTML = categories
    .map(
      (category) => `
        <button class="chip-button ${state.category === category.value ? "is-active" : ""}" data-category="${category.value}" type="button">
          ${category.label}
        </button>
      `
    )
    .join("");
}

function applyLocalFilters(gigs) {
  let items = [...gigs];
  if (state.category) {
    items = items.filter((gig) => gig.category === state.category);
  }
  if (state.search) {
    const term = state.search.toLowerCase();
    items = items.filter((gig) =>
      `${gig.title} ${gig.description} ${gig.tags.join(" ")}`.toLowerCase().includes(term)
    );
  }
  if (state.rating) {
    items = items.filter((gig) => Number(gig.rating || 0) >= Number(state.rating));
  }
  if (state.minPrice) {
    items = items.filter((gig) => Number(gig.pricing?.basic?.price || 0) >= Number(state.minPrice));
  }
  if (state.maxPrice) {
    items = items.filter((gig) => Number(gig.pricing?.basic?.price || 0) <= Number(state.maxPrice));
  }

  if (state.sort === "price-low") {
    items.sort((a, b) => (a.pricing?.basic?.price || 0) - (b.pricing?.basic?.price || 0));
  } else if (state.sort === "price-high") {
    items.sort((a, b) => (b.pricing?.basic?.price || 0) - (a.pricing?.basic?.price || 0));
  } else if (state.sort === "rating") {
    items.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  } else if (state.sort === "popular") {
    items.sort((a, b) => (b.orderCount || 0) - (a.orderCount || 0));
  }

  return items;
}

function renderPagination() {
  const container = document.getElementById("pagination");
  if (!container) {
    return;
  }

  if (currentPages <= 1) {
    container.innerHTML = "";
    return;
  }

  container.innerHTML = Array.from({ length: currentPages }, (_, index) => index + 1)
    .map(
      (pageNumber) => `
        <button class="btn ${pageNumber === state.page ? "btn-primary" : "btn-secondary"} btn-sm" data-page="${pageNumber}" type="button">
          ${pageNumber}
        </button>
      `
    )
    .join("");

  container.querySelectorAll("[data-page]").forEach((button) => {
    button.addEventListener("click", () => {
      state.page = Number(button.dataset.page);
      loadGigs();
    });
  });
}

function renderGigs(gigs, total) {
  const grid = document.getElementById("marketplaceGrid");
  const meta = document.getElementById("resultsMeta");
  if (!grid || !meta) {
    return;
  }

  currentData = gigs;
  meta.textContent = `${formatNumber(total)} results matched your filters.`;

  if (!gigs.length) {
    grid.innerHTML = `
      <div class="card empty-panel" style="grid-column:1/-1">
        <h3>No gigs matched</h3>
        <p>Try broadening your filters or changing the search term.</p>
      </div>
    `;
    document.getElementById("pagination").innerHTML = "";
    return;
  }

  grid.innerHTML = gigs.map(renderGigCard).join("");
  initTilt(grid);
  initScrollReveal(grid);
  renderPagination();
}

async function loadGigs() {
  const grid = document.getElementById("marketplaceGrid");
  if (grid) {
    grid.innerHTML = new Array(6).fill("").map(() => '<div class="card skeleton" style="height:320px"></div>').join("");
  }

  updateUrl();

  try {
    const response = await api.get("/gigs", {
      category: state.category,
      search: state.search,
      sort: state.sort,
      rating: state.rating,
      minPrice: state.minPrice,
      maxPrice: state.maxPrice,
      page: state.page,
      limit: state.limit,
    });

    currentPages = Number(response.pages || 1);
    renderGigs(response.gigs || [], response.total || 0);
  } catch {
    const filtered = applyLocalFilters(demoGigs);
    currentPages = Math.max(1, Math.ceil(filtered.length / state.limit));
    const offset = (state.page - 1) * state.limit;
    renderGigs(filtered.slice(offset, offset + state.limit), filtered.length);
  }

  if (state.search) {
    trackSearch(state.search);
  }
}

function bindEvents() {
  document.getElementById("marketSearchForm")?.addEventListener("submit", (event) => {
    event.preventDefault();
    state.search = document.getElementById("marketSearch").value.trim();
    state.page = 1;
    loadGigs();
  });

  document.getElementById("sortSelect")?.addEventListener("change", (event) => {
    state.sort = event.target.value;
    state.page = 1;
    loadGigs();
  });

  document.getElementById("minPrice")?.addEventListener("change", (event) => {
    state.minPrice = event.target.value;
    state.page = 1;
    loadGigs();
  });

  document.getElementById("maxPrice")?.addEventListener("change", (event) => {
    state.maxPrice = event.target.value;
    state.page = 1;
    loadGigs();
  });

  document.getElementById("clearFilters")?.addEventListener("click", () => {
    state.category = "";
    state.search = "";
    state.sort = "";
    state.rating = "";
    state.minPrice = "";
    state.maxPrice = "";
    state.page = 1;
    renderCategoryFilters();
    syncControls();
    loadGigs();
  });

  document.getElementById("categoryFilters")?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-category]");
    if (!button) {
      return;
    }
    state.category = button.dataset.category;
    state.page = 1;
    renderCategoryFilters();
    syncControls();
    loadGigs();
  });

  document.getElementById("ratingFilters")?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-rating]");
    if (!button) {
      return;
    }
    state.rating = button.dataset.rating;
    state.page = 1;
    syncControls();
    loadGigs();
  });

  document.getElementById("quickFilters")?.addEventListener("click", (event) => {
    const categoryButton = event.target.closest("[data-quick-category]");
    const ratingButton = event.target.closest("[data-quick-rating]");
    const sortButton = event.target.closest("[data-quick-sort]");

    if (categoryButton) {
      state.category = categoryButton.dataset.quickCategory;
    }
    if (ratingButton) {
      state.rating = ratingButton.dataset.quickRating;
    }
    if (sortButton) {
      state.sort = sortButton.dataset.quickSort;
    }
    state.page = 1;
    renderCategoryFilters();
    syncControls();
    loadGigs();
  });
}

async function init() {
  ThemeManager.init();
  Toast.init();
  renderNavbar("#navbarMount", { page: "marketplace.html" });
  renderBottomNav("#bottomNavMount", "gigs");
  renderFooter("#footerMount");
  renderCategoryFilters();
  syncControls();
  bindEvents();
  await loadGigs();
  initScrollReveal();
}

init().catch((error) => {
  console.error(error);
  Toast.error("Marketplace failed to load.");
});
