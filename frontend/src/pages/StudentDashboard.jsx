import { useEffect, useState } from "react";
import axios from "axios";
import DashboardLayout from "../layouts/DashboardLayout";

export default function StudentDashboard() {
  const [complaints, setComplaints] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const res = await axios.get("http://localhost:5000/api");
    setComplaints(res.data);
  };

  const my = complaints.filter(
    (c) =>
      c.name === user?.username ||
      (c.userId && c.userId === user?.userId) ||
      (c.studentId && c.studentId === user?.userId)
  );

  // ✅ FIXED STATUS LOGIC
  const pending = my.filter(
    (c) => c.status === "Pending"
  ).length;

  const solved = my.filter(
    (c) =>
      c.status === "Solved" ||
      c.status === "Resolved"
  ).length;

  return (
    <DashboardLayout>
      <div style={styles.container}>
        <div style={styles.glowTop}></div>
        <div style={styles.glowBottom}></div>

        {/* HEADER */}
        <div style={styles.header}>
          <h2 style={styles.title}>Student Dashboard</h2>
          <p style={styles.subtitle}>Track your complaints status</p>
        </div>

        {/* CARDS */}
        <div style={styles.cardRow}>
          <div style={styles.card}>
            <span style={styles.cardLabel}>Pending</span>
            <h2 style={{ ...styles.cardValue, color: "#F0A84E" }}>
              {pending}
            </h2>
            <div style={{ ...styles.cardAccent, background: "#F0A84E" }} />
          </div>

          <div style={styles.card}>
            <span style={styles.cardLabel}>Solved</span>
            <h2 style={{ ...styles.cardValue, color: "#4ADE80" }}>
              {solved}
            </h2>
            <div style={{ ...styles.cardAccent, background: "#4ADE80" }} />
          </div>

          <div style={styles.card}>
            <span style={styles.cardLabel}>Total</span>
            <h2 style={{ ...styles.cardValue, color: "#D4AF6A" }}>
              {my.length}
            </h2>
            <div style={{ ...styles.cardAccent, background: "#D4AF6A" }} />
          </div>
        </div>

        {/* BUTTON */}
        <div style={{ marginTop: "28px" }}>
          <a href="/add" style={{ textDecoration: "none" }}>
            <button
              style={styles.button}
              onMouseEnter={(e) => (e.target.style.transform = "translateY(-2px)")}
              onMouseLeave={(e) => (e.target.style.transform = "translateY(0)")}
            >
              + Raise Complaint
            </button>
          </a>
        </div>

        {/* RECENT COMPLAINTS */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Recent Complaints</h3>

          {my.length === 0 && (
            <p style={styles.emptyText}>No complaints raised yet.</p>
          )}

          {my.slice(-5).reverse().map((c) => (
            <div key={c._id} style={styles.complaintCard}>
              <p style={styles.complaintText}>{c.complaint}</p>

              <span
                style={{
                  ...styles.status,
                  background:
                    c.status === "Solved" || c.status === "Resolved"
                      ? "rgba(74,222,128,0.15)"
                      : "rgba(240,168,78,0.15)",
                  color:
                    c.status === "Solved" || c.status === "Resolved"
                      ? "#4ADE80"
                      : "#F0A84E",
                  border:
                    c.status === "Solved" || c.status === "Resolved"
                      ? "1px solid rgba(74,222,128,0.35)"
                      : "1px solid rgba(240,168,78,0.35)",
                }}
              >
                {c.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}

/* ========== STYLES ========== */
const styles = {
  container: {
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
    left: "-100px",
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
    right: "-100px",
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

  cardRow: {
    position: "relative",
    display: "flex",
    gap: "16px",
    flexWrap: "wrap",
  },

  card: {
    position: "relative",
    flex: 1,
    minWidth: "150px",
    padding: "22px 20px",
    borderRadius: "16px",
    background: "rgba(255,255,255,0.045)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(255,255,255,0.08)",
    boxShadow: "0 12px 30px rgba(0,0,0,0.35)",
    textAlign: "left",
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

  button: {
    padding: "13px 24px",
    background: "linear-gradient(135deg, #D4AF6A 0%, #B8924F 100%)",
    color: "#14161F",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: "14.5px",
    letterSpacing: "0.3px",
    boxShadow: "0 8px 20px rgba(212,175,106,0.25)",
    transition: "transform 0.2s ease",
  },

  section: {
    position: "relative",
    marginTop: "34px",
  },

  sectionTitle: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#FAFAFA",
    marginBottom: "14px",
  },

  emptyText: {
    color: "#7A7A85",
    fontSize: "13.5px",
    fontStyle: "italic",
  },

  complaintCard: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "14px 16px",
    marginTop: "10px",
    background: "rgba(255,255,255,0.04)",
    borderRadius: "12px",
    border: "1px solid rgba(255,255,255,0.07)",
  },

  complaintText: {
    margin: 0,
    fontSize: "14px",
    color: "#E4E4E9",
  },

  status: {
    padding: "5px 12px",
    borderRadius: "20px",
    fontSize: "11.5px",
    fontWeight: "600",
    whiteSpace: "nowrap",
    marginLeft: "12px",
  },
};