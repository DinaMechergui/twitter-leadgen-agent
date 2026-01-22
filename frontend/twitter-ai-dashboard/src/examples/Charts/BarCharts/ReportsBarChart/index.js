/* eslint-disable */
/* prettier-ignore */
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function ReportsBarChart({ title, description, chart }) {
  return (
    <div style={{ background: "#fff", padding: "20px", borderRadius: "8px" }}>
      <h6>{title}</h6>
      <p>{description}</p>
      <Bar
        data={chart}
        options={{ responsive: true, plugins: { legend: { display: false } } }}
      />
    </div>
  );
}

export default ReportsBarChart;
