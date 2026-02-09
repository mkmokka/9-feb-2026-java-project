// ================= FIREBASE IMPORTS =================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getAuth,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
  updatePassword,
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

import { getDatabase } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";
import { getAnalytics, logEvent } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-analytics.js";

// ================= FIREBASE CONFIG =================
const firebaseConfig = {
  apiKey: "AIzaSyCh0fWsCCIM8F4iMz7tz1gbDl15vsV6bRg",
  authDomain: "moriomgame-fa3c7.firebaseapp.com",
  databaseURL: "https://moriomgame-fa3c7-default-rtdb.firebaseio.com",
  projectId: "moriomgame-fa3c7",
  storageBucket: "moriomgame-fa3c7.firebasestorage.app",
  messagingSenderId: "613189870143",
  appId: "1:613189870143:web:de74d7ea5b46e635684e8a",
  measurementId: "G-H1CNT2YKDH"
};

// ================= INIT =================
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
getDatabase(app);
const analytics = getAnalytics(app);

// ================= HELPERS =================
function isValidEmail(email) {
  return typeof email === "string" && email.includes("@");
}

// ================= REGISTER =================
async function registerWithEmail() {
  const email = document.getElementById("regEmail")?.value.trim();

  if (!isValidEmail(email)) {
    alert("Invalid email address");
    return;
  }

  const actionCodeSettings = {
    url: window.location.origin + "/finish.html",
    handleCodeInApp: true
  };

  try {
    await sendSignInLinkToEmail(auth, email, actionCodeSettings);
    localStorage.setItem("emailForSignIn", email);
    alert("Check your email to complete registration");
    logEvent(analytics, "sign_up", { method: "email_link" });
  } catch (err) {
    alert("Registration failed");
    console.error(err);
  }
}

// ================= LOGIN =================
async function loginWithPassword() {
  const email = document.getElementById("logEmail")?.value.trim();
  const password = document.getElementById("logPass")?.value;

  if (!email || !password) {
    alert("Email and password required");
    return;
  }

  try {
    await signInWithEmailAndPassword(auth, email, password);
    window.location.href = "homepage.html";
  } catch (err) {
    alert("Login failed");
    console.error(err);
  }
}

// ================= MAGIC LINK HANDLER =================
async function handleMagicLink() {
  if (!isSignInWithEmailLink(auth, window.location.href)) return;

  let email = localStorage.getItem("emailForSignIn");
  if (!email) email = prompt("Confirm your email");

  if (!email) return;

  try {
    const result = await signInWithEmailLink(auth, email, window.location.href);
    localStorage.removeItem("emailForSignIn");

    const passwordInput = document.getElementById("passwordInput");
    const setPasswordBtn = document.getElementById("setPasswordBtn");

    if (!passwordInput || !setPasswordBtn) return;

    setPasswordBtn.addEventListener("click", async () => {
      const password = passwordInput.value;

      if (password.length < 6) {
        alert("Password must be at least 6 characters");
        return;
      }

      await updatePassword(result.user, password);
      alert("Password set successfully");
      window.location.href = "index.html";
    });

  } catch (err) {
    alert("Invalid or expired link");
    console.error(err);
  }
}

// ================= EVENT BINDING =================
document.addEventListener("DOMContentLoaded", () => {

  document
    .getElementById("registerBtn")
    ?.addEventListener("click", registerWithEmail);

  document
    .getElementById("loginBtn")
    ?.addEventListener("click", loginWithPassword);

  if (window.location.pathname.includes("finish.html")) {
    handleMagicLink();
  }
});
