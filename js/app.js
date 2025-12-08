import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs } 
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

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

// Convertit "1:32.450" → ms
function timeToMs(t) {
  const [min, sec] = t.split(':');
  return parseInt(min) * 60000 + parseFloat(sec.replace(",", ".")) * 1000;
}

// 🔹 Ajouter un temps sur un circuit
export async function addTimeToTrack(name, track, time) {
  if (!name || !track || !time) {
    alert("Remplis tous les champs !");
    return;
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
  const q = query(collection(db, "times"), where("track", "==", track));
  const snapshot = await getDocs(q);

  let results = [];
  snapshot.forEach(doc => results.push(doc.data()));

  results.sort((a, b) => a.ms - b.ms);

  let html = "<ol>";
  results.forEach(r => {
    html += `<li>${r.name} : ${r.time}</li>`;
  });
  html += "</ol>";

  document.getElementById("results").innerHTML = html;
}