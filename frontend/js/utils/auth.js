import { api } from "./api.js";

const TOKEN_KEY = "ul-token";
const USER_KEY = "ul-user";
const USER_ID_KEY = "ul-userId";

function storeUser(user) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  localStorage.setItem(USER_ID_KEY, user?._id || "");
}

export const Auth = {
  setSession(payload) {
    if (payload?.token) {
      localStorage.setItem(TOKEN_KEY, payload.token);
    }

    storeUser(payload);
    return payload;
  },

  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  },

  getUser() {
    try {
      return JSON.parse(localStorage.getItem(USER_KEY) || "null");
    } catch {
      return null;
    }
  },

  getUserId() {
    return localStorage.getItem(USER_ID_KEY) || this.getUser()?._id || "";
  },

  getRole() {
    return this.getUser()?.role || "buyer";
  },

  isAuthenticated() {
    return Boolean(this.getToken());
  },

  async hydrate() {
    if (!this.getToken()) {
      return null;
    }

    try {
      const me = await api.get("/auth/me");
      storeUser(me);
      return me;
    } catch {
      this.clear();
      return null;
    }
  },

  clear() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(USER_ID_KEY);
  },

  logout(redirectTo = "login.html") {
    this.clear();
    if (redirectTo) {
      window.location.href = redirectTo;
    }
  },

  requireAuth(redirect = true) {
    if (this.isAuthenticated()) {
      return true;
    }

    if (redirect) {
      const current = `${window.location.pathname.split("/").pop() || "index.html"}${window.location.search || ""}`;
      window.location.href = `login.html?redirect=${encodeURIComponent(current)}`;
    }

    return false;
  },
};

export function resolveRedirect(defaultPage = "dashboard.html") {
  const params = new URLSearchParams(window.location.search);
  return params.get("redirect") || defaultPage;
}
