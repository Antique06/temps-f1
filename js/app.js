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

// Convertit "1:32.450" en millisecondes
function timeToMs(timeStr) {
  const [min, sec] = timeStr.split(":");
  return parseInt(min) * 60000 + parseFloat(sec.replace(",", ".")) * 1000;
}

// Ajouter un temps
export async function addTimeToTrack(name, track, time) {
  if (!name || !track || !time) throw new Error("Nom, circuit et temps requis.");
  await addDoc(collection(db, "times"), {
    name,
    track,
    time,
    ms: timeToMs(time)
  });
}

// Charger classement d’un circuit et top 3
export async function loadTimesForTrack(track) {
  const q = query(collection(db, "times"), where("track", "==", track));
  const snapshot = await getDocs(q);

  let results = [];
  snapshot.forEach(doc => results.push(doc.data()));

  // Tri croissant
  results.sort((a, b) => a.ms - b.ms);

  // Affichage classement complet
  const resultsDiv = document.getElementById("results");
  if (resultsDiv) {
    let html = "<ol>";
    results.forEach(r => html += `<li>${r.name} : ${r.time}</li>`);
    html += "</ol>";
    resultsDiv.innerHTML = html;
  }

  // Top 3
  const top3Div = document.getElementById("top3");
  if (top3Div) {
    top3Div.innerHTML = "";
    results.slice(0, 3).forEach((r, i) => {
      let color = i === 0 ? "gold" : i === 1 ? "silver" : "peru";
      top3Div.innerHTML += `<li style="color:${color}; font-weight:bold">${r.name} : ${r.time}</li>`;
    });
  }

  // Graphique si canvas présent
  const chartCanvas = document.getElementById("chartTimes");
  if (chartCanvas) {
    import("./charts.js").then(mod => mod.renderChart(results, chartCanvas));
  }
}
