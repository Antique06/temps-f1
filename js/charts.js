import { Chart } from "https://cdn.jsdelivr.net/npm/chart.js";

let chart;

document.addEventListener("chartDataReady", e => {
  const data = e.detail;
  const ctx = document.getElementById("chartTimes");
  if (!ctx) return;
  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: data.map(d => d.name),
      datasets: [{
        label: 'Temps (s)',
        data: data.map(d => d.time),
        backgroundColor: 'rgba(255, 0, 0, 0.7)'
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: false
        }
      }
    }
  });
});
