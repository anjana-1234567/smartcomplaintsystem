import { useEffect, useState } from "react";
import axios from "axios";
import DashboardLayout from "../layouts/DashboardLayout";
import API_BASE_URL from "../apiConfig";

import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, Cell } from "recharts";

export default function TeacherDashboard() {
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    axios.get(`${API_BASE_URL}/api`)
      .then((res) => setComplaints(res.data))
      .catch(() => setComplaints([]));
  }, []);

  const total = complaints.length;

  const pending = complaints.filter(c => c.status === "Pending").length;

  const solved = complaints.filter(
    c => c.status === "Solved" || c.status === "Resolved"
  ).length;

  const data = [
    { name: "Total", value: total },
    { name: "Pending", value: pending },
    { name: "Solved", value: solved },
  ];

  const BAR_COLORS = ["#D4AF6A", "#F0A84E", "#4ADE80"];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={styles.tooltip}>
          <span style={{ color: "#9C9CA8", fontSize: "12px" }}>{label}</span>
          <div style={{ color: "#FAFAFA", fontWeight: 700, fontSize: "16px" }}>
            {payload[0].value}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <DashboardLayout>
      <div style={styles.page}>
        <div style={styles.glowTop}></div>
        <div style={styles.glowBottom}></div>

        <div style={styles.header}>
          <h2 style={styles.title}>Teacher Dashboard</h2>
          <p style={styles.subtitle}>Overview of all student complaints</p>
        </div>

        {/* CARDS */}
        <div style={styles.row}>
          <div style={styles.card}>
            <span style={styles.cardLabel}>Total</span>
            <p style={{ ...styles.cardValue, color: "#D4AF6A" }}>{total}</p>
            <div style={{ ...styles.cardAccent, background: "#D4AF6A" }} />
          </div>

          <div style={styles.card}>
            <span style={styles.cardLabel}>Pending</span>
            <p style={{ ...styles.cardValue, color: "#F0A84E" }}>{pending}</p>
            <div style={{ ...styles.cardAccent, background: "#F0A84E" }} />
          </div>

          <div style={styles.card}>
            <span style={styles.cardLabel}>Solved</span>
            <p style={{ ...styles.cardValue, color: "#4ADE80" }}>{solved}</p>
            <div style={{ ...styles.cardAccent, background: "#4ADE80" }} />
          </div>
        </div>

        {/* BAR GRAPH */}
        <div style={styles.chartCard}>
          <h3 style={styles.chartTitle}>Complaints Overview</h3>

          <div style={styles.chart}>
            <BarChart width={560} height={300} data={data}>
              <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.06)" />
              <XAxis
                dataKey="name"
                tick={{ fill: "#9C9CA8", fontSize: 13 }}
                axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "#9C9CA8", fontSize: 13 }}
                axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
              <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                {data.map((_, i) => (
                  <Cell key={i} fill={BAR_COLORS[i]} />
                ))}
              </Bar>
            </BarChart>
          </div>
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

  row: {
    position: "relative",
    display: "flex",
    gap: "16px",
    flexWrap: "wrap",
  },

  card: {
    position: "relative",
    flex: 1,
    minWidth: "160px",
    background: "rgba(255,255,255,0.045)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(255,255,255,0.08)",
    padding: "22px 20px",
    borderRadius: "16px",
    boxShadow: "0 12px 30px rgba(0,0,0,0.35)",
    overflow: "hidden",
  },

  cardLabel: {
    fontSize: "12.5px",
    color: "#9C9CA8",
    letterSpacing: "0.4px",
    textTransform: "uppercase",
  },

  cardValue: {
    margin: "8px 0 0",
    fontSize: "32px",
    fontWeight: "700",
  },

  cardAccent: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "3px",
    opacity: 0.7,
  },

  chartCard: {
    position: "relative",
    marginTop: "24px",
    background: "rgba(255,255,255,0.045)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "18px",
    padding: "24px",
    boxShadow: "0 20px 50px rgba(0,0,0,0.4)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },

  chartTitle: {
    alignSelf: "flex-start",
    margin: "0 0 12px",
    fontSize: "15px",
    fontWeight: "600",
    color: "#FAFAFA",
  },

  chart: {
    display: "flex",
    justifyContent: "center",
  },

  tooltip: {
    background: "#14161F",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: "8px",
    padding: "8px 12px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.4)",
  },
};