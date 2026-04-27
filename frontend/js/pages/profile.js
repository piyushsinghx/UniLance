import { api } from "../utils/api.js";
import { Auth } from "../utils/auth.js";
import { demoGigs, demoProfile } from "../utils/demo-data.js";
import {
  avatarMarkup,
  escapeHtml,
  formatDate,
  formatNumber,
  renderGigCard,
} from "../utils/helpers.js";
import { ThemeManager } from "../utils/theme.js";
import { SocketManager } from "../utils/socket.js";
import { renderNavbar } from "../components/navbar.js";
import { renderBottomNav } from "../components/sidebar.js";
import { renderFooter } from "../components/footer.js";
import { Toast } from "../components/toast.js";

let currentProfile = null;
let currentGigs = [];

function profileId() {
  return new URLSearchParams(window.location.search).get("id") || Auth.getUserId() || demoProfile._id;
}

function isOwnProfile() {
  return Auth.isAuthenticated() && profileId() === Auth.getUserId();
}

function renderIdentity(profile) {
  const container = document.getElementById("profileIdentity");
  if (!container) {
    return;
  }

  container.innerHTML = `
    <div data-user="${escapeHtml(profile._id || "")}" style="position:relative">
      ${avatarMarkup(profile, 104)}
      <span class="online-dot ${profile.isOnline ? "online" : ""}"></span>
    </div>
    <div>
      <div class="inline-actions" style="margin-bottom:8px">
        ${profile.isVerified ? '<span class="badge badge-success">Verified Student</span>' : '<span class="badge badge-warning">Verification Pending</span>'}
        <span class="badge badge-primary">${escapeHtml(profile.role || "seller")}</span>
      </div>
      <h1 style="font-size:clamp(2rem,4vw,3rem)">${escapeHtml(profile.name || "Student")}</h1>
      <p>${escapeHtml(profile.university || "University profile")}</p>
      <p class="muted" style="margin-top:8px">Member since ${formatDate(profile.createdAt)}</p>
    </div>
  `;
}

function renderStats(profile) {
  const container = document.getElementById("profileStats");
  if (!container) {
    return;
  }

  const avgRating = currentGigs.length
    ? currentGigs.reduce((sum, gig) => sum + Number(gig.rating || 0), 0) / currentGigs.length
    : Number(profile.rating || 0);
  const totalOrders = currentGigs.reduce((sum, gig) => sum + Number(gig.orderCount || 0), 0);
  const totalReviews = currentGigs.reduce((sum, gig) => sum + Number(gig.reviewCount || 0), 0);

  container.innerHTML = `
    <div><strong>${formatNumber(currentGigs.length)}</strong><div class="muted" style="font-size:0.8rem">Active gigs</div></div>
    <div><strong>${avgRating.toFixed(1)}</strong><div class="muted" style="font-size:0.8rem">Average rating</div></div>
    <div><strong>${formatNumber(totalOrders)}</strong><div class="muted" style="font-size:0.8rem">Orders delivered</div></div>
    <div><strong>${formatNumber(totalReviews || profile.reviewCount || 0)}</strong><div class="muted" style="font-size:0.8rem">Reviews earned</div></div>
  `;
}

function renderSkills(profile) {
  const container = document.getElementById("profileSkills");
  if (!container) {
    return;
  }

  container.innerHTML = (profile.skills || []).map((skill) => `<span class="tag">${escapeHtml(skill)}</span>`).join("");
}

function renderFacts(profile) {
  const container = document.getElementById("profileFacts");
  if (!container) {
    return;
  }

  const facts = [
    `Verification: ${profile.verificationStatus || (profile.isVerified ? "verified" : "pending")}`,
    `Role: ${profile.role || "seller"}`,
    `University: ${profile.university || "Student profile"}`,
    `Joined: ${formatDate(profile.createdAt)}`,
  ];

  container.innerHTML = facts.map((fact) => `<div class="quick-list__item">${escapeHtml(fact)}</div>`).join("");
}

function renderBio(profile) {
  document.getElementById("profileBio").textContent =
    profile.bio || "This student has not added a bio yet. Update the profile form to make the page more compelling.";
}

function renderGigs(gigs) {
  const grid = document.getElementById("profileGigGrid");
  if (!grid) {
    return;
  }

  if (!gigs.length) {
    grid.innerHTML = '<div class="card empty-panel" style="grid-column:1/-1">No public gigs yet.</div>';
    return;
  }

  grid.innerHTML = gigs.map(renderGigCard).join("");
}

function populateForm(profile) {
  document.getElementById("editName").value = profile.name || "";
  document.getElementById("editUniversity").value = profile.university || "";
  document.getElementById("editSkills").value = (profile.skills || []).join(", ");
  document.getElementById("editBio").value = profile.bio || "";

  const button = document.getElementById("editProfileBtn");
  const form = document.getElementById("editProfileForm");
  if (!isOwnProfile()) {
    button.textContent = "Open Chat";
    button.onclick = () => {
      window.location.href = `chat.html?to=${encodeURIComponent(profile._id || "")}`;
    };
    form.querySelectorAll("input, textarea, button").forEach((element) => {
      element.disabled = true;
    });
    form.querySelector("button").textContent = "Only your own profile is editable";
  } else {
    button.onclick = () => {
      form.scrollIntoView({ behavior: "smooth", block: "start" });
    };
  }
}

async function loadProfile() {
  let profile;
  try {
    profile = isOwnProfile() ? await api.get("/auth/me") : await api.get(`/users/${profileId()}`);
  } catch {
    profile = profileId() === demoProfile._id ? demoProfile : demoGigs.find((gig) => gig.seller?._id === profileId())?.seller || demoProfile;
  }

  currentProfile = profile;

  try {
    currentGigs = await api.get(`/gigs/seller/${profile._id}`);
  } catch {
    currentGigs = demoGigs.filter((gig) => gig.seller?._id === profile._id);
  }

  renderIdentity(profile);
  renderStats(profile);
  renderSkills(profile);
  renderFacts(profile);
  renderBio(profile);
  renderGigs(currentGigs);
  populateForm(profile);
}

function bindEvents() {
  document.getElementById("editProfileForm")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!isOwnProfile() || !currentProfile) {
      return;
    }

    const payload = {
      name: document.getElementById("editName").value.trim(),
      university: document.getElementById("editUniversity").value.trim(),
      skills: document
        .getElementById("editSkills")
        .value.split(",")
        .map((skill) => skill.trim())
        .filter(Boolean),
      bio: document.getElementById("editBio").value.trim(),
    };

    try {
      currentProfile = await api.put(`/users/${currentProfile._id}`, payload);
      Toast.success("Profile updated.");
      renderIdentity(currentProfile);
      renderSkills(currentProfile);
      renderFacts(currentProfile);
      renderBio(currentProfile);
      populateForm(currentProfile);
    } catch (error) {
      Toast.error(error.message || "Could not save profile changes.");
    }
  });
}

async function init() {
  ThemeManager.init();
  Toast.init();
  await Auth.hydrate();
  renderNavbar("#navbarMount", { page: "profile.html" });
  renderBottomNav("#bottomNavMount", "profile");
  renderFooter("#footerMount");
  await loadProfile();
  bindEvents();

  if (Auth.isAuthenticated()) {
    await SocketManager.init();
  }
}

init().catch((error) => {
  console.error(error);
  Toast.error("Profile failed to load.");
});
