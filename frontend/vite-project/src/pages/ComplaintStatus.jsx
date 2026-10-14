import { useEffect, useState } from "react";
import axios from "axios";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import DashboardLayout from "../layouts/DashboardLayout";
import API_BASE_URL from "../apiConfig";

export default function ComplaintStatus() {
  const [complaints, setComplaints] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    axios.get(`${API_BASE_URL}/api`)
      .then((res) => setComplaints(res.data));
  }, []);

  const my = complaints.filter(
    (c) =>
      c.name === user?.username ||
      (c.userId && c.userId === user?.userId) ||
      (c.studentId && c.studentId === user?.userId)
  );

  const pending = my.filter(c => c.status === "Pending").length;
  const solved = my.filter(
    c => c.status === "Solved" || c.status === "Resolved"
  ).length;

  const data = [
    { name: "Pending", value: pending },
    { name: "Solved", value: solved },
  ];

  const COLORS = ["#F0A84E", "#4ADE80"];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div style={styles.tooltip}>
          <span style={{ color: payload[0].payload.fill, fontWeight: 700 }}>
            {payload[0].name}
          </span>
          <span style={{ marginLeft: 8, color: "#F2F2F5" }}>
            {payload[0].value}
          </span>
        </div>
      );
    }
    return null;
  };

  const CustomLegend = ({ payload }) => (
    <div style={styles.legendRow}>
      {payload.map((entry, i) => (
        <div key={i} style={styles.legendItem}>
          <span
            style={{
              ...styles.legendDot,
              background: entry.color,
            }}
          />
          <span style={styles.legendText}>{entry.value}</span>
        </div>
      ))}
    </div>
  );

  return (
    <DashboardLayout>
      <div style={styles.page}>
        <div style={styles.glowTop}></div>
        <div style={styles.glowBottom}></div>

        <div style={styles.header}>
          <h2 style={styles.title}>Complaint Status</h2>
          <p style={styles.subtitle}>Visual breakdown of your complaints</p>
        </div>

        <div style={styles.card}>
          {my.length > 0 ? (
            <>
              <PieChart width={420} height={420}>
                <Pie
                  data={data}
                  dataKey="value"
                  cx="50%"
                  cy="50%"
                  innerRadius={90}
                  outerRadius={150}
                  paddingAngle={3}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  labelLine={false}
                >
                  {data.map((_, i) => (
                    <Cell
                      key={i}
                      fill={COLORS[i]}
                      stroke="#14161F"
                      strokeWidth={3}
                    />
                  ))}
                </Pie>

                <Tooltip content={<CustomTooltip />} />
                <Legend content={<CustomLegend />} />
              </PieChart>

              <div style={styles.centerLabel}>
                <span style={styles.centerValue}>{my.length}</span>
                <span style={styles.centerCaption}>Total</span>
              </div>
            </>
          ) : (
            <p style={styles.emptyText}>No complaints to display yet.</p>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

const styles = {
  page: {
    position: "relative",
    padding: "32px",
    minHeight: "100vh",
    background: "linear-gradient(160deg, #0B0C14 0%, #14161F 50%, #0B0C14 100%)",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    color: "#F2F2F5",
    overflow: "hidden",
  },

  glowTop: {
    position: "absolute",
    top: "-150px",
    right: "-100px",
    width: "400px",
    height: "400px",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(212,175,106,0.12) 0%, transparent 70%)",
    filter: "blur(40px)",
    pointerEvents: "none",
  },

  glowBottom: {
    position: "absolute",
    bottom: "-150px",
    left: "-100px",
    width: "450px",
    height: "450px",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)",
    filter: "blur(40px)",
    pointerEvents: "none",
  },

  header: {
    position: "relative",
    textAlign: "center",
    marginBottom: "24px",
  },

  title: {
    margin: 0,
    fontSize: "24px",
    fontWeight: "600",
    fontFamily: "'Georgia', serif",
    color: "#FAFAFA",
  },

  subtitle: {
    color: "#9C9CA8",
    marginTop: "6px",
    fontSize: "14px",
  },

  card: {
    position: "relative",
    maxWidth: "500px",
    margin: "0 auto",
    padding: "30px",
    borderRadius: "20px",
    background: "rgba(255,255,255,0.045)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(255,255,255,0.08)",
    boxShadow: "0 20px 50px rgba(0,0,0,0.4)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },

  centerLabel: {
    marginTop: "-260px",
    marginBottom: "260px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    pointerEvents: "none",
  },

  centerValue: {
    fontSize: "36px",
    fontWeight: "700",
    color: "#FAFAFA",
  },

  centerCaption: {
    fontSize: "12px",
    color: "#9C9CA8",
    letterSpacing: "0.5px",
    textTransform: "uppercase",
    marginTop: "2px",
  },

  tooltip: {
    background: "#14161F",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: "8px",
    padding: "8px 12px",
    fontSize: "13px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.4)",
  },

  legendRow: {
    display: "flex",
    justifyContent: "center",
    gap: "20px",
    marginTop: "12px",
  },

  legendItem: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },

  legendDot: {
    width: "10px",
    height: "10px",
    borderRadius: "50%",
  },

  legendText: {
    fontSize: "13px",
    color: "#B8B8C0",
  },

  emptyText: {
    color: "#7A7A85",
    fontStyle: "italic",
    padding: "80px 0",
  },
};