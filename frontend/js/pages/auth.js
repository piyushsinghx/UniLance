import { api } from "../utils/api.js";
import { Auth, resolveRedirect } from "../utils/auth.js";
import { ThemeManager } from "../utils/theme.js";
import { Toast } from "../components/toast.js";

function checkPwStrength(password) {
  let score = 0;
  if (password.length >= 8) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  const labels = ["", "Weak", "Fair", "Good", "Strong"];
  const colors = ["", "#EF4444", "#F59E0B", "#6366F1", "#10B981"];
  return { score, label: labels[score], color: colors[score] };
}

function bindEmailValidation() {
  const input = document.getElementById("email");
  const hint = document.getElementById("emailHint");
  if (!input || !hint) {
    return;
  }

  input.addEventListener("input", function validateEmail() {
    const value = this.value.trim();
    const isEdu = /\.(edu|ac\.in|ac\.uk)$/i.test(value);
    if (value.length > 5) {
      hint.textContent = isEdu ? "Valid college email" : "Please use your college email (.edu or .ac.in)";
      hint.style.color = isEdu ? "var(--color-success)" : "var(--color-error)";
      this.style.borderColor = isEdu ? "var(--color-success)" : "var(--color-error)";
    } else {
      hint.style.color = "";
      this.style.borderColor = "";
    }
  });
}

function bindPasswordToggle() {
  document.querySelectorAll("[data-password-toggle]").forEach((button) => {
    button.addEventListener("click", () => {
      const input = document.querySelector(button.dataset.passwordToggle);
      if (!input) {
        return;
      }
      input.type = input.type === "password" ? "text" : "password";
      button.textContent = input.type === "password" ? "👁" : "🙈";
    });
  });
}

function bindPasswordStrength() {
  const input = document.getElementById("password");
  const hint = document.getElementById("passwordStrength");
  if (!input || !hint || document.body.dataset.authPage !== "signup") {
    return;
  }

  input.addEventListener("input", () => {
    const result = checkPwStrength(input.value);
    if (!result.score) {
      hint.textContent = "Use at least 8 characters with mixed case, numbers, and symbols.";
      hint.style.color = "";
      return;
    }

    hint.textContent = `Password strength: ${result.label}`;
    hint.style.color = result.color;
  });
}

function bindOtpInputs() {
  const inputs = [...document.querySelectorAll(".otp-input")];
  if (!inputs.length) {
    return;
  }

  inputs.forEach((input, index) => {
    input.addEventListener("input", () => {
      input.value = input.value.replace(/\D/g, "").slice(0, 1);
      if (input.value && inputs[index + 1]) {
        inputs[index + 1].focus();
      }
    });

    input.addEventListener("keydown", (event) => {
      if (event.key === "Backspace" && !input.value && inputs[index - 1]) {
        inputs[index - 1].focus();
      }
    });
  });
}

function bindSocialButtons() {
  document.querySelectorAll("[data-social]").forEach((button) => {
    button.addEventListener("click", () => {
      Toast.info(`${button.dataset.social} sign-in can be connected to your backend next.`);
    });
  });
}

async function handleLogin(event) {
  event.preventDefault();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  try {
    const payload = await api.post("/auth/login", { email, password });
    Auth.setSession(payload);
    Toast.success("Signed in successfully.");
    setTimeout(() => {
      window.location.href = resolveRedirect("dashboard.html");
    }, 400);
  } catch (error) {
    Toast.error(error.message || "Login failed.");
  }
}

async function handleSignup(event) {
  event.preventDefault();
  const payload = {
    name: document.getElementById("name").value.trim(),
    email: document.getElementById("email").value.trim(),
    password: document.getElementById("password").value,
    role: document.getElementById("role").value,
    university: document.getElementById("university").value.trim(),
    collegeIdImage: document.getElementById("collegeIdImage").value.trim(),
  };

  try {
    const response = await api.post("/auth/register", payload);
    Auth.setSession(response);
    Toast.success("Account created. Welcome to UniLance.");
    setTimeout(() => {
      window.location.href = resolveRedirect("dashboard.html");
    }, 400);
  } catch (error) {
    Toast.error(error.message || "Signup failed.");
  }
}

function init() {
  ThemeManager.init();
  Toast.init();
  bindEmailValidation();
  bindPasswordToggle();
  bindPasswordStrength();
  bindOtpInputs();
  bindSocialButtons();

  document.getElementById("loginForm")?.addEventListener("submit", handleLogin);
  document.getElementById("signupForm")?.addEventListener("submit", handleSignup);
}

init();
