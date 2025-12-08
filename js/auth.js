import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } 
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, collection, addDoc, query, where, getDocs } 
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// 🔥 Même config que app.js
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
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

// Connexion
export function login() {
  signInWithPopup(auth, provider)
    .then(result => alert(`Connecté : ${result.user.displayName}`))
    .catch(err => alert("Erreur login : " + err.message));
}

// Déconnexion
export function logout() {
  signOut(auth).then(() => window.location.href = "index.html");
}

// Récupérer les temps de l’utilisateur
export async function getUserTimes() {
  onAuthStateChanged(auth, async user => {
    if (!user) {
      alert("Connecte-toi pour voir ton profil !");
      window.location.href = "index.html";
      return;
    }

    const q = query(collection(db, "times"), where("name", "==", user.displayName));
    const snapshot = await getDocs(q);
    let results = [];
    snapshot.forEach(doc => results.push(doc.data()));

    results.sort((a, b) => a.ms - b.ms);

    const div = document.getElementById("history");
    if (div) {
      if (results.length === 0) div.innerHTML = "<p>Aucun temps enregistré.</p>";
      else {
        let html = "<ol>";
        results.forEach(r => html += `<li>${r.track} : ${r.time}</li>`);
        html += "</ol>";
        div.innerHTML = html;
      }
    }
  });
}
