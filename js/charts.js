import Chart from "https://cdn.jsdelivr.net/npm/chart.js";

export function renderChart(results, canvas) {
  const labels = results.map(r => r.name);
  const data = results.map(r => r.ms);

  new Chart(canvas, {
    type: "bar",
    data: {
      labels,
      datasets: [{
        label: "Temps (ms)",
        data,
        backgroundColor: "rgba(255,0,0,0.5)"
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      plugins: {
        legend: { display: false }
      }
    }
  });
}
