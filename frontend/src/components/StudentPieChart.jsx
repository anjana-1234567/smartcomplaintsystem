import { PieChart, Pie, Cell } from "recharts";

export default function StudentPieChart({ complaints = [] }) {
  const pending = complaints.filter(c => c.status === "Pending").length;

  const solved = complaints.filter(c =>
    c.status === "Solved" || c.status === "Resolved"
  ).length;

  const data = [
    { name: "Pending", value: pending },
    { name: "Solved", value: solved },
  ];

  const COLORS = ["#f59e0b", "#22c55e"];

  return (
    <div style={{ background: "white", padding: 10, borderRadius: 10 }}>
      <h4 style={{ color: "black", textAlign: "center" }}>
        Status
      </h4>

      <PieChart width={220} height={220}>
        <Pie
          data={data}
          dataKey="value"
          cx="50%"
          cy="50%"
          outerRadius={70}
        >
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i]} />
          ))}
        </Pie>
      </PieChart>

      <p style={{ color: "black", textAlign: "center" }}>
        Pending: {pending} | Solved: {solved}
      </p>
    </div>
  );
}