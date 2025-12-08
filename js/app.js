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

window.addTime = async function () {
  const name = document.getElementById("name").value;
  const track = document.getElementById("track").value;
  const time = document.getElementById("time").value;

  if (!name || !track || !time) {
    alert("Merci de remplir tous les champs !");
    return;
  }

  await addDoc(collection(db, "times"), {
    name,
    track,
    time,
    ms: timeToMs(time)
  });

  loadTimes();
};

async function loadTimes() {
  const querySnapshot = await getDocs(collection(db, "times"));
  let results = [];

  querySnapshot.forEach(doc => results.push(doc.data()));

  // Tri du plus rapide au plus lent
  results.sort((a, b) => a.ms - b.ms);

  let html = "<ol>";
  results.forEach(r => {
    html += `<li><b>${r.track}</b> — ${r.name} : ${r.time}</li>`;
  });
  html += "</ol>";

  document.getElementById("results").innerHTML = html;
}

loadTimes();