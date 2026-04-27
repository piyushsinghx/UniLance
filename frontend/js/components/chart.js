import { loadScript } from "../utils/helpers.js";

let currentChart = null;

export async function ensureChartJs() {
  if (window.Chart) {
    return window.Chart;
  }

  await loadScript("https://cdn.jsdelivr.net/npm/chart.js");
  return window.Chart;
}

export async function renderEarningsChart(ctx, data) {
  const Chart = await ensureChartJs();

  if (currentChart) {
    currentChart.destroy();
  }

  currentChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: data.labels,
      datasets: [
        {
          label: "Earnings",
          data: data.earnings,
          borderColor: "#6366F1",
          backgroundColor(chartContext) {
            const gradient = chartContext.chart.ctx.createLinearGradient(0, 0, 0, 300);
            gradient.addColorStop(0, "rgba(99,102,241,0.3)");
            gradient.addColorStop(1, "rgba(99,102,241,0)");
            return gradient;
          },
          fill: true,
          tension: 0.4,
          pointBackgroundColor: "#6366F1",
          pointRadius: 4,
          pointHoverRadius: 7,
        },
        {
          label: "Orders",
          data: data.orders,
          borderColor: "#22D3EE",
          backgroundColor: "rgba(34,211,238,0)",
          fill: false,
          tension: 0.4,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: "rgba(30,41,59,0.95)",
          borderColor: "rgba(255,255,255,0.1)",
          borderWidth: 1,
          cornerRadius: 12,
          padding: 12,
        },
      },
      scales: {
        x: {
          grid: { color: "rgba(255,255,255,0.05)" },
          ticks: { color: "#64748B" },
        },
        y: {
          grid: { color: "rgba(255,255,255,0.05)" },
          ticks: { color: "#64748B" },
        },
      },
    },
  });

  return currentChart;
}
