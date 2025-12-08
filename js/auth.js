import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
  getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, setPersistence, browserSessionPersistence
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// 🔥 Remplace par ta config Firebase
const firebaseConfig = {
    apiKey: "AIzaSyB2_9RohB6IEzJhnrV0B-BN6a3OHha7QfY",
    authDomain: "tempsf1.firebaseapp.com",
    projectId: "tempsf1",
    storageBucket: "tempsf1.firebasestorage.app",
    messagingSenderId: "505873804284",
    appId: "1:505873804284:web:b0c99b6ec3ee514af5e079",
    measurementId: "G-QZZTWGTYWL"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const provider = new GoogleAuthProvider();

// Persistance session (jusqu'à fermeture du navigateur)
setPersistence(auth, browserSessionPersistence);

export function setupAuthButtons(loginBtnId, logoutBtnId, userNameId, nameInputId) {
  const loginBtn = document.getElementById(loginBtnId);
  const logoutBtn = document.getElementById(logoutBtnId);
  const userNameDiv = document.getElementById(userNameId);
  const nameInput = nameInputId ? document.getElementById(nameInputId) : null;

  if (loginBtn) {
    loginBtn.addEventListener("click", () => {
      signInWithPopup(auth, provider)
        .then(result => updateUI(result.user))
        .catch(err => alert("Erreur login : " + err.message));
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => signOut(auth).then(() => updateUI(null)));
  }

  onAuthStateChanged(auth, user => updateUI(user));

  function updateUI(user) {
    if (user) {
      if (loginBtn) loginBtn.style.display = "none";
      if (logoutBtn) logoutBtn.style.display = "block";
      if (userNameDiv) userNameDiv.innerText = "Connecté : " + user.displayName;
      if (nameInput) nameInput.value = user.displayName || "";
    } else {
      if (loginBtn) loginBtn.style.display = "block";
      if (logoutBtn) logoutBtn.style.display = "none";
      if (userNameDiv) userNameDiv.innerText = "Non connecté";
      if (nameInput) nameInput.value = "";
    }
  }
}

export function getCurrentUser(callback) {
  onAuthStateChanged(auth, user => callback(user));
}
