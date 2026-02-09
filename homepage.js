// ===== Firebase Imports =====
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// ===== Firebase Config =====
const firebaseConfig = {
  apiKey: "AIzaSyCh0fWsCCIM8F4iMz7tz1gbDl15vsV6bRg",
  authDomain: "moriomgame-fa3c7.firebaseapp.com",
  databaseURL: "https://moriomgame-fa3c7-default-rtdb.firebaseio.com",
  projectId: "moriomgame-fa3c7",
  storageBucket: "moriomgame-fa3c7.firebasestorage.app",
  messagingSenderId: "613189870143",
  appId: "1:613189870143:web:de74d7ea5b46e635684e8a"
};

// ===== Initialize Firebase =====
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// ===== Hide content until auth is verified =====
document.body.style.display = "none"; // initially hide body

// ===== Session Timeout Settings =====
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
let lastActivity = Date.now();

// Update last activity on user interaction
document.addEventListener("mousemove", () => lastActivity = Date.now());
document.addEventListener("keydown", () => lastActivity = Date.now());

// Auto-logout after inactivity
setInterval(() => {
  if (Date.now() - lastActivity > SESSION_TIMEOUT) {
    logout();
  }
}, 60 * 1000);

// ===== Protect Page & Display User Info =====
onAuthStateChanged(auth, (user) => {
  if (!user) {
    // Redirect immediately if not logged in
    window.location.replace("index.html");
    return;
  }

  // Show page content now that user is verified
  document.body.style.display = "block";

  // Safely display user email
  const emailEl = document.getElementById("studentEmail");
  if (emailEl) emailEl.innerText = user.email || "Unknown Email";
});

// ===== Logout Function =====
window.logout = async () => {
  try {
    await signOut(auth);
    localStorage.clear(); // clear any cached info
    alert("Logged out successfully");
    window.location.replace("index.html"); // prevent back navigation
  } catch (err) {
    console.error("Logout failed:", err);
    alert("Logout failed, please try again");
  }
};
