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

// ===== Protect page =====
onAuthStateChanged(auth, (user) => {
  if (!user) {
    alert("Please login first!");
    window.location.href = "index.html";
  } else {
    const emailEl = document.getElementById("studentEmail");
    if (emailEl) emailEl.innerText = user.email;
  }
});

// ===== Logout function =====
window.logout = async () => {
  await signOut(auth);
  window.location.href = "index.html";
};
