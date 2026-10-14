import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

export default function ComplaintChart({ complaints }) {
  const pending = complaints.filter(
    (c) => c.status === "Pending"
  ).length;

  const resolved = complaints.filter(
    (c) => c.status === "Solved" || c.status === "Resolved"
  ).length;

  const data = {
    labels: ["Pending", "Resolved"],
    datasets: [
      {
        label: "Complaints",
        data: [pending, resolved],
        backgroundColor: ["orange", "green"],
      },
    ],
  };

  return (
    <div style={{ width: "400px", marginTop: "20px" }}>
      <Bar data={data} />
    </div>
  );
}