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

// Ajouter un temps
window.addTime = async function () {
    const name = document.getElementById("name").value;
    const track = document.getElementById("track").value;
    const time = document.getElementById("time").value;

    await addDoc(collection(db, "times"), {
        name, track, time
    });

    loadTimes();
};

// Charger les temps
async function loadTimes() {
    const querySnapshot = await getDocs(collection(db, "times"));
    let html = "<ul>";

    querySnapshot.forEach((doc) => {
        const data = doc.data();
        html += `<li>${data.track} - ${data.name} : ${data.time}</li>`;
    });

    html += "</ul>";
    document.getElementById("results").innerHTML = html;
}

loadTimes();