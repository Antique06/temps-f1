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
export function parseTime(str) {
  const [m, s] = str.split(":");
  return parseInt(m) * 60 + parseFloat(s);
}

// Formatter le temps en "m:ss.sss"
export function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = (seconds % 60).toFixed(3);
  return `${m}:${s.padStart(6, "0")}`;
}

// Charger les temps d’un circuit
export async function loadTimesForTrack(track) {
  const q = query(collection(db, "times"), where("track", "==", track), orderBy("time"));
  const snapshot = await getDocs(q);
  const resultsDiv = document.getElementById("results");
  const top3List = document.getElementById("top3");

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
        if (rank === 1) li.className = "gold";
        else if (rank === 2) li.className = "silver";
        else if (rank === 3) li.className = "bronze";
        top3List.appendChild(li);
      }
    });
  } else {
    resultsDiv.innerText = "Aucun temps enregistré pour ce circuit.";
    top3List.innerHTML = "";
  }
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

// Obtenir le meilleur temps de l'utilisateur pour chaque circuit et si c'est dans le top 3
export async function getUserBestTimesByCircuit(userName) {
  const q = query(collection(db, "times"), where("name", "==", userName));
  const snapshot = await getDocs(q);
  const bestTimesByCircuit = {};
  
  snapshot.forEach(doc => {
    const data = doc.data();
    if (!bestTimesByCircuit[data.track] || data.time < bestTimesByCircuit[data.track].time) {
      bestTimesByCircuit[data.track] = { time: data.time };
    }
  });

  // Vérifier le rang pour chaque circuit
  for (const track of Object.keys(bestTimesByCircuit)) {
    const topQ = query(collection(db, "times"), where("track", "==", track), orderBy("time"));
    const topSnapshot = await getDocs(topQ);
    let rank = 0;
    let userRank = null;
    
    topSnapshot.forEach(doc => {
      rank++;
      const data = doc.data();
      if (data.name === userName && data.time === bestTimesByCircuit[track].time && !userRank) {
        userRank = rank;  // ✅ Capturer le rang
      }
    });
    
    bestTimesByCircuit[track].rank = userRank;  // ✅ Stocker le rang
  }
  
  return bestTimesByCircuit;
}

// Récupérer le top 3 des temps pour un circuit
export async function getTopTimesForTrack(track) {
  const q = query(collection(db, "times"), where("track", "==", track), orderBy("time"));
  const snapshot = await getDocs(q);
  const topTimes = [];
  snapshot.forEach(doc => topTimes.push(doc.data()));
  return topTimes;
}
