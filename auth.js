import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDhAc3cpeV_6s29JqGjDpx00b7N1MwDE-0",
  authDomain: "senten-ai.firebaseapp.com",
  projectId: "senten-ai",
  appId: "1:691827681786:web:4153d974d7ee3a743b5c43"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Email Signup
document.getElementById("signupBtn").onclick = () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  createUserWithEmailAndPassword(auth, email, password)
    .then(() => window.location.href = "index.html")
    .catch(err => alert(err.message));
};

// Email Login
document.getElementById("loginBtn").onclick = () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  signInWithEmailAndPassword(auth, email, password)
    .then(() => window.location.href = "index.html")
    .catch(err => alert(err.message));
};

// Google Login
document.getElementById("googleBtn").onclick = () => {
  signInWithPopup(auth, provider)
    .then(() => window.location.href = "index.html")
    .catch(err => alert(err.message));
};
