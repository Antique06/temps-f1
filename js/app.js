import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, query, where } 
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// 🔥 CONFIGURATION FIREBASE — REMPLACE TES VALEURS
const firebaseConfig = {
    apiKey: "AIzaSyB2_9RohB6IEzJhnrV0B-BN6a3OHha7QfY",
    authDomain: "tempsf1.firebaseapp.com",
    projectId: "tempsf1",
    storageBucket: "tempsf1.firebasestorage.app",
    messagingSenderId: "505873804284",
    appId: "1:505873804284:web:b0c99b6ec3ee514af5e079",
    measurementId: "G-QZZTWGTYWL"
};

// Initialisation Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Convertit un temps "1:32.450" en millisecondes
function timeToMs(timeStr) {
  const [min, sec] = timeStr.split(":");
  return parseInt(min) * 60000 + parseFloat(sec.replace(",", ".")) * 1000;
}

// 🔹 Ajouter un temps sur un circuit
export async function addTimeToTrack(name, track, time) {
  if (!name || !track || !time) {
    throw new Error("Nom, circuit et temps requis.");
  }

  await addDoc(collection(db, "times"), {
    name,
    track,
    time,
    ms: timeToMs(time)
  });
}

// 🔹 Charger le classement pour un circuit
export async function loadTimesForTrack(track) {
  if (!track) return;

  // Filtrer uniquement les temps pour le circuit sélectionné
  const q = query(collection(db, "times"), where("track", "==", track));
  const snapshot = await getDocs(q);

  let results = [];
  snapshot.forEach(doc => results.push(doc.data()));

  // Tri du plus rapide au plus lent
  results.sort((a, b) => a.ms - b.ms);

  // Générer le HTML du classement
  let html = "<ol>";
  results.forEach(r => {
    html += `<li>${r.name} : ${r.time}</li>`;
  });
  html += "</ol>";

  // Afficher le classement
  const resultsDiv = document.getElementById("results");
  if (resultsDiv) {
    resultsDiv.innerHTML = html;
  }
}