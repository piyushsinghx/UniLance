import { api } from "../utils/api.js";
import { Auth } from "../utils/auth.js";
import { demoGigs, demoReviews } from "../utils/demo-data.js";
import {
  avatarMarkup,
  categoryIcon,
  escapeHtml,
  formatCurrency,
  formatDate,
  formatNumber,
  initScrollReveal,
  launchConfetti,
  renderGigCard,
  renderStars,
  timeAgo,
} from "../utils/helpers.js";
import { ThemeManager } from "../utils/theme.js";
import { SocketManager } from "../utils/socket.js";
import { renderNavbar } from "../components/navbar.js";
import { renderBottomNav } from "../components/sidebar.js";
import { renderFooter } from "../components/footer.js";
import { Toast } from "../components/toast.js";
import { initCarousel } from "../components/carousel.js";

let currentGig = null;

function gigId() {
  return new URLSearchParams(window.location.search).get("id");
}

function fallbackGig() {
  return demoGigs.find((gig) => gig._id === gigId()) || demoGigs[0];
}

function galleryItems(gig) {
  const images = Array.isArray(gig.images) ? gig.images : [];
  if (images.length) {
    return images.map((image, index) => ({ type: "image", value: image, label: `Preview ${index + 1}` }));
  }

  return [
    { type: "emoji", value: categoryIcon(gig.category), label: "Cover" },
    { type: "text", value: gig.pricing?.basic?.title || "Package", label: "Package" },
    { type: "text", value: gig.tags?.[0] || "Student Built", label: "Skill" },
  ];
}

function renderGallery(gig) {
  const root = document.getElementById("gigGallery");
  const thumbs = document.getElementById("galleryThumbs");
  if (!root || !thumbs) {
    return;
  }

  const items = galleryItems(gig);
  thumbs.innerHTML = items
    .map(
      (item, index) => `
        <button class="gallery__thumb ${index === 0 ? "is-active" : ""}" data-carousel-thumb type="button">
          ${item.type === "image" ? `<img src="${escapeHtml(item.value)}" alt="${escapeHtml(item.label)}">` : escapeHtml(item.label)}
        </button>
      `
    )
    .join("");

  initCarousel(root, items, (item, index, stage) => {
    if (!stage) {
      return;
    }

    stage.innerHTML =
      item.type === "image"
        ? `<img src="${escapeHtml(item.value)}" alt="${escapeHtml(item.label)}" style="width:100%;height:100%;object-fit:cover">`
        : `<span>${escapeHtml(item.value)}</span>`;

    thumbs.querySelectorAll("[data-carousel-thumb]").forEach((thumb, thumbIndex) => {
      thumb.classList.toggle("is-active", thumbIndex === index);
    });
  });
}

function renderMeta(gig) {
  const meta = document.getElementById("gigMeta");
  if (!meta) {
    return;
  }

  meta.innerHTML = `
    <span class="badge badge-primary">${renderStars(gig.rating)} ${gig.rating.toFixed(1)}</span>
    <span class="badge badge-success">${formatNumber(gig.reviewCount || 0)} reviews</span>
    <span class="badge badge-warning">${formatNumber(gig.orderCount || 0)} orders</span>
    <span class="badge badge-primary">From ${formatCurrency(gig.pricing?.basic?.price || 0)}</span>
  `;
}

function renderSellerCard(gig) {
  const seller = gig.seller || {};
  const card = document.getElementById("sellerCard");
  if (!card) {
    return;
  }

  card.innerHTML = `
    <div class="seller-card__head" data-user="${escapeHtml(seller._id || "")}">
      <div style="position:relative">
        ${avatarMarkup(seller, 72)}
        <span class="online-dot ${seller.isOnline ? "online" : ""}"></span>
      </div>
      <div>
        <h3>${escapeHtml(seller.name || "Student Seller")}</h3>
        <p>${escapeHtml(seller.university || "Verified student")}</p>
        ${seller.isVerified ? '<span class="badge badge-success">Verified Student</span>' : ""}
      </div>
    </div>
    <p style="margin-top:16px">${escapeHtml(seller.bio || "Experienced student freelancer with a focus on quality delivery and smooth communication.")}</p>
    <div class="seller-card__stats">
      <div>
        <strong>${formatNumber(gig.reviewCount || 0)}</strong>
        <div class="muted" style="font-size:0.8rem">Reviews</div>
      </div>
      <div>
        <strong>${gig.rating.toFixed(1)}</strong>
        <div class="muted" style="font-size:0.8rem">Rating</div>
      </div>
      <div>
        <strong>${formatNumber(gig.orderCount || 0)}</strong>
        <div class="muted" style="font-size:0.8rem">Orders</div>
      </div>
    </div>
  `;
}

function renderPricing(gig) {
  const container = document.getElementById("pricingPackages");
  if (!container) {
    return;
  }

  const tiers = ["basic", "standard", "premium"].filter((tier) => gig.pricing?.[tier]?.price > 0);

  container.innerHTML = tiers
    .map((tier, index) => {
      const pack = gig.pricing[tier];
      return `
        <article class="pricing-tier ${index === 0 ? "is-active" : ""}" data-tier-card="${tier}">
          <div class="pricing-tier__head">
            <div>
              <div class="badge badge-primary">${escapeHtml(pack.title || tier)}</div>
              <h3 style="margin-top:10px">${escapeHtml(pack.description || "Student-built delivery package")}</h3>
            </div>
            <div class="pricing-tier__price">${formatCurrency(pack.price)}</div>
          </div>
          <p class="muted">${pack.deliveryDays} day delivery</p>
          <ul class="check-list" style="margin:14px 0 18px">
            ${(pack.features || []).map((feature) => `<li><span>✓</span><span>${escapeHtml(feature)}</span></li>`).join("")}
          </ul>
          <button class="btn btn-primary btn-block" data-order-tier="${tier}" type="button">Order ${escapeHtml(pack.title || tier)}</button>
        </article>
      `;
    })
    .join("");

  container.querySelectorAll("[data-order-tier]").forEach((button) => {
    button.addEventListener("click", () => handleOrder(button.dataset.orderTier, button));
  });

  container.querySelectorAll("[data-tier-card]").forEach((card) => {
    card.addEventListener("click", () => {
      container.querySelectorAll("[data-tier-card]").forEach((item) => item.classList.remove("is-active"));
      card.classList.add("is-active");
    });
  });
}

function renderGig(gig) {
  currentGig = gig;
  document.title = `${gig.title} | UniLance`;
  document.getElementById("gigCategory").textContent = gig.category.replaceAll("-", " ");
  document.getElementById("gigTitle").textContent = gig.title;
  document.getElementById("gigDescription").textContent = gig.description;
  document.getElementById("gigScope").textContent = `${gig.description} This package structure is tuned for student-friendly delivery, transparent scope, and fast async collaboration.`;
  document.getElementById("gigTags").innerHTML = (gig.tags || []).map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join("");
  document.getElementById("gigDeliverables").innerHTML = (gig.pricing?.basic?.features || [])
    .map((feature) => `<li><span>✓</span><span>${escapeHtml(feature)}</span></li>`)
    .join("");

  renderMeta(gig);
  renderGallery(gig);
  renderSellerCard(gig);
  renderPricing(gig);
}

function renderReviews(reviews = demoReviews) {
  const list = document.getElementById("reviewList");
  if (!list) {
    return;
  }

  list.innerHTML = reviews
    .map(
      (review) => `
        <article class="review-card">
          <div style="display:flex;align-items:center;justify-content:space-between;gap:14px">
            <div>
              <strong>${escapeHtml(review.reviewer)}</strong>
              <div class="muted" style="font-size:0.84rem">${formatDate(review.createdAt)} · ${timeAgo(review.createdAt)}</div>
            </div>
            <div class="rating-row">${renderStars(review.rating)} <span>${review.rating.toFixed(1)}</span></div>
          </div>
          <p style="margin-top:14px">${escapeHtml(review.text)}</p>
        </article>
      `
    )
    .join("");

  // Add write review form if authenticated
  if (Auth.isAuthenticated()) {
    list.insertAdjacentHTML("beforeend", `
      <article class="review-card" style="border-color:rgba(99,102,241,0.2)">
        <h3 style="margin-bottom:14px">Write a Review</h3>
        <form id="reviewForm" style="display:grid;gap:14px">
          <div style="display:flex;gap:8px" id="reviewStars">
            ${[1, 2, 3, 4, 5].map((star) => `<button type="button" class="btn-icon" data-star="${star}" style="font-size:1.4rem;color:var(--text-muted)">★</button>`).join("")}
          </div>
          <label class="form-group" style="margin-bottom:0">
            <textarea class="form-input" id="reviewComment" placeholder=" " required></textarea>
            <span class="form-label">Your review</span>
          </label>
          <button class="btn btn-primary" type="submit">Submit Review</button>
        </form>
      </article>
    `);
    bindReviewForm();
  }
}

async function renderRelated(gig) {
  const grid = document.getElementById("relatedGigs");
  if (!grid) {
    return;
  }

  let gigs = [];
  try {
    gigs = await api.get(`/gigs/seller/${gig.seller?._id || ""}`);
  } catch {
    gigs = demoGigs.filter((item) => item.seller?._id === gig.seller?._id);
  }

  const filtered = (Array.isArray(gigs) ? gigs : []).filter((item) => item._id !== gig._id);
  const fallback = demoGigs.filter((item) => item._id !== gig._id && item.category === gig.category);
  const items = (filtered.length ? filtered : fallback).slice(0, 4);

  grid.innerHTML = items.map(renderGigCard).join("");
}

async function loadRazorpay() {
  if (window.Razorpay) {
    return true;
  }

  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.head.appendChild(script);
  });
}

async function handleOrder(tier, button) {
  if (!currentGig) {
    return;
  }

  if (!Auth.requireAuth()) {
    return;
  }

  if (Auth.getUserId() && Auth.getUserId() === currentGig.seller?._id) {
    Toast.error("You cannot order your own gig.");
    return;
  }

  const requirements = document.getElementById("orderRequirements")?.value.trim() || "";
  button.disabled = true;
  button.textContent = "Creating order...";

  try {
    const order = await api.post("/orders", {
      gigId: currentGig._id,
      tier,
      requirements,
    });

    const loaded = await loadRazorpay();
    if (!loaded || !window.Razorpay) {
      Toast.info("Order created, but Razorpay could not be loaded in this environment.");
      button.disabled = false;
      button.textContent = `Order ${currentGig.pricing?.[tier]?.title || tier}`;
      return;
    }

    const paymentOrder = await api.post("/payments/create-order", { orderId: order._id });
    const options = {
      key: paymentOrder.key || "rzp_test_demo_key",
      amount: paymentOrder.amount,
      currency: paymentOrder.currency || "INR",
      name: "UniLance",
      description: "Gig Order",
      order_id: paymentOrder.razorpayOrderId,
      handler: async (response) => {
        await api.post("/payments/verify", {
          ...response,
          orderId: order._id,
        });
        Toast.success("Payment successful! Order placed.");
        launchConfetti();
        setTimeout(() => {
          window.location.href = "dashboard.html?tab=orders";
        }, 700);
      },
      theme: { color: "#6366F1" },
    };

    new window.Razorpay(options).open();
  } catch (error) {
    Toast.error(error.message || "Could not start the order flow.");
  } finally {
    button.disabled = false;
    button.textContent = `Order ${currentGig.pricing?.[tier]?.title || tier}`;
  }
}

function bindReviewForm() {
  let selectedRating = 0;
  const starContainer = document.getElementById("reviewStars");
  const form = document.getElementById("reviewForm");

  if (starContainer) {
    starContainer.querySelectorAll("[data-star]").forEach((btn) => {
      btn.addEventListener("click", () => {
        selectedRating = Number(btn.dataset.star);
        starContainer.querySelectorAll("[data-star]").forEach((b) => {
          b.style.color = Number(b.dataset.star) <= selectedRating ? "#facc15" : "var(--text-muted)";
        });
      });

      btn.addEventListener("mouseenter", () => {
        const hoverVal = Number(btn.dataset.star);
        starContainer.querySelectorAll("[data-star]").forEach((b) => {
          b.style.color = Number(b.dataset.star) <= hoverVal ? "#facc15" : "var(--text-muted)";
        });
      });

      btn.addEventListener("mouseleave", () => {
        starContainer.querySelectorAll("[data-star]").forEach((b) => {
          b.style.color = Number(b.dataset.star) <= selectedRating ? "#facc15" : "var(--text-muted)";
        });
      });
    });
  }

  if (form) {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (!selectedRating) {
        Toast.error("Please select a star rating.");
        return;
      }

      const comment = document.getElementById("reviewComment")?.value.trim();
      if (!comment) {
        Toast.error("Please write a comment.");
        return;
      }

      try {
        await api.post("/reviews", {
          gig: currentGig?._id,
          rating: selectedRating,
          comment,
        });
        Toast.success("Review submitted successfully!");
        form.reset();
        selectedRating = 0;
        if (starContainer) {
          starContainer.querySelectorAll("[data-star]").forEach((b) => {
            b.style.color = "var(--text-muted)";
          });
        }
      } catch (error) {
        Toast.error(error.message || "Failed to submit review.");
      }
    });
  }
}

async function loadGig() {
  let gig = null;
  try {
    gig = await api.get(`/gigs/${gigId()}`);
  } catch {
    gig = fallbackGig();
  }

  if (!gig) {
    Toast.error("Gig not found.");
    return;
  }

  renderGig(gig);
  renderReviews();
  renderRelated(gig);

  document.getElementById("messageSellerBtn")?.addEventListener("click", () => {
    window.location.href = `chat.html?to=${encodeURIComponent(gig.seller?._id || "")}`;
  });
}

async function init() {
  ThemeManager.init();
  Toast.init();
  renderNavbar("#navbarMount", { page: "marketplace.html" });
  renderBottomNav("#bottomNavMount", "gigs");
  renderFooter("#footerMount");
  await loadGig();
  initScrollReveal();

  if (Auth.isAuthenticated()) {
    SocketManager.init();
  }
}

init().catch((error) => {
  console.error(error);
  Toast.error("Gig details failed to load.");
});
