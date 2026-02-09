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

  // Validate email format
  if (!isValidEmail(email)) {
    alert("Invalid email address");
    return;
  }

  const actionCodeSettings = {
    url: window.location.origin + "/finish.html", // The page the user lands after clicking the link
    handleCodeInApp: true // Firebase should handle the link in the app
  };

  // Log the email before attempting to send the link
  console.log("Sending sign-in link to email:", email);

  // Check if the user is online
  if (!navigator.onLine) {
    alert("No internet connection. Please check your connection and try again.");
    return;
  }

  try {
    // Attempt to send the sign-in link to the email
    await sendSignInLinkToEmail(auth, email, actionCodeSettings);

    // Log success and store the email in localStorage
    console.log("Link sent successfully");
    localStorage.setItem("emailForSignIn", email);

    // Inform the user to check their email
    alert("Check your email to complete registration");

    // Track analytics event for sign-up
    logEvent(analytics, "sign_up", { method: "email_link" });

  } catch (err) {
    // Log error details to the console
    console.error("Error sending sign-in link:", err);

    // Specific error handling for network request failure
    if (err.code === 'auth/network-request-failed') {
      alert("Network error: Please check your internet connection and try again.");
    } else {
      alert(`Registration failed: ${err.message || "Unknown error"}`);
    }
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
    // Attempt to log in with email and password
    await signInWithEmailAndPassword(auth, email, password);

    // Redirect to the homepage upon success
    window.location.href = "homepage.html";

  } catch (err) {
    // Log login failure and show alert
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
    // Attempt to sign in using the magic link
    const result = await signInWithEmailLink(auth, email, window.location.href);

    // Remove email from localStorage
    localStorage.removeItem("emailForSignIn");

    // Setup password input and button
    const passwordInput = document.getElementById("passwordInput");
    const setPasswordBtn = document.getElementById("setPasswordBtn");

    if (!passwordInput || !setPasswordBtn) return;

    setPasswordBtn.addEventListener("click", async () => {
      const password = passwordInput.value;

      // Validate password length
      if (password.length < 6) {
        alert("Password must be at least 6 characters");
        return;
      }

      // Update the password for the signed-in user
      await updatePassword(result.user, password);

      // Inform the user that the password was set successfully
      alert("Password set successfully");

      // Redirect to the homepage
      window.location.href = "index.html";
    });

  } catch (err) {
    // Handle invalid or expired link
    alert("Invalid or expired link");
    console.error(err);
  }
}

// ================= EVENT BINDING =================
document.addEventListener("DOMContentLoaded", () => {

  // Register button click event handler
  document
    .getElementById("registerBtn")
    ?.addEventListener("click", registerWithEmail);

  // Login button click event handler
  document
    .getElementById("loginBtn")
    ?.addEventListener("click", loginWithPassword);

  // Handle magic link if on the "finish.html" page
  if (window.location.pathname.includes("finish.html")) {
    handleMagicLink();
  }
});
