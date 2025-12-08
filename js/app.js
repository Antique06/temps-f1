import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, query, where, orderBy, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

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
const db = getFirestore(app);

// Ajouter un temps
export async function addTimeToTrack(name, track, time) {
  await addDoc(collection(db, "times"), { name, track, time: parseTime(time), timestamp: Date.now() });
}

// Convertir "1:32.450" en secondes pour tri
function parseTime(str) {
  const [m, s] = str.split(":");
  return parseInt(m)*60 + parseFloat(s);
}

// Charger les temps d’un circuit
export async function loadTimesForTrack(track) {
  const q = query(collection(db, "times"), where("track", "==", track), orderBy("time"));
  const snapshot = await getDocs(q);
  const resultsDiv = document.getElementById("results");
  const top3List = document.getElementById("top3");
  const chartData = [];

  if (!snapshot.empty) {
    resultsDiv.innerHTML = "";
    top3List.innerHTML = "";
    let rank = 0;
    const medals = ["🥇", "🥈", "🥉"];
    snapshot.forEach(doc => {
      rank++;
      const data = doc.data();
      const line = document.createElement("div");
      line.innerText = `${rank}. ${data.name} - ${formatTime(data.time)}`;
      resultsDiv.appendChild(line);
      if (rank <= 3) {
        const li = document.createElement("li");
        li.innerText = `${medals[rank - 1]} ${data.name} - ${formatTime(data.time)}`;
        // Ajouter une classe de couleur selon le rang
        if (rank === 1) li.className = "gold";
        else if (rank === 2) li.className = "silver";
        else if (rank === 3) li.className = "bronze";
        top3List.appendChild(li);
      }
      chartData.push({ name: data.name, time: data.time });
    });
    // Trigger chart update
    const event = new CustomEvent("chartDataReady", { detail: chartData });
    document.dispatchEvent(event);
  } else {
    resultsDiv.innerText = "Aucun temps enregistré pour ce circuit.";
    top3List.innerHTML = "";
  }
}

export function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = (seconds % 60).toFixed(3);
  return `${m}:${s.padStart(6,"0")}`;
}

// Charger l'historique d'un utilisateur
export async function getUserTimes(userName) {
  const q = query(collection(db, "times"), where("name", "==", userName), orderBy("timestamp", "desc"));
  const snapshot = await getDocs(q);
  const historyDiv = document.getElementById("history");
  if (!snapshot.empty) {
    historyDiv.innerHTML = "";
    snapshot.forEach(doc => {
      const data = doc.data();
      const line = document.createElement("div");
      line.innerText = `${data.track} - ${formatTime(data.time)}`;
      historyDiv.appendChild(line);
    });
  } else {
    historyDiv.innerHTML = "<p>Aucun temps enregistré.</p>";
  }
}

// Obtenir le meilleur temps de l'utilisateur pour chaque circuit et vérifier si c'est dans le top 3
export async function getUserBestTimesByCircuit(userName) {
  const q = query(collection(db, "times"), where("name", "==", userName));
  const snapshot = await getDocs(q);
  const bestTimesByCircuit = {};
  
  // Récupérer le meilleur temps pour chaque circuit
  snapshot.forEach(doc => {
    const data = doc.data();
    if (!bestTimesByCircuit[data.track] || data.time < bestTimesByCircuit[data.track].time) {
      bestTimesByCircuit[data.track] = { time: data.time };
    }
  });
  
  // Vérifier si chaque temps est dans le top 3
  for (const track of Object.keys(bestTimesByCircuit)) {
    const topQ = query(collection(db, "times"), where("track", "==", track), orderBy("time"));
    const topSnapshot = await getDocs(topQ);
    let rank = 0;
    let isInTop3 = false;
    
    topSnapshot.forEach(doc => {
      rank++;
      const data = doc.data();
      if (data.name === userName && data.time === bestTimesByCircuit[track].time && rank <= 3) {
        isInTop3 = true;
      }
    });
    
    bestTimesByCircuit[track].isInTop3 = isInTop3;
  }
  
  return bestTimesByCircuit;
}
