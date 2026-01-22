/* eslint-disable */
/* prettier-ignore */
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function ReportsLineChart({ title, description, chart }) {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" },
      tooltip: {
        enabled: true,
        callbacks: {
          label: function(context) {
            // Affiche la phrase complète + valeur
            const value = context.raw;
            const label = context.label || '';
            return `${label}: ${value}`;
          },
        },
      },
    },
    scales: {
      x: {
        ticks: {
          display: false, // on cache les labels X pour éviter qu’elles se chevauchent
        },
        grid: { display: false },
      },
      y: {
        beginAtZero: true,
        ticks: { color: "#333" },
      },
    },
  };

  return (
    <div style={{ background: "#fff", padding: "20px", borderRadius: "8px", height: "400px" }}>
      <h6>{title}</h6>
      <p>{description}</p>
      <Line data={chart} options={options} />
    </div>
  );
}

export default ReportsLineChart;




