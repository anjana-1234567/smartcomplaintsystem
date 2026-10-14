import { useEffect, useState } from "react";
import axios from "axios";
import DashboardLayout from "../layouts/DashboardLayout";
import API_BASE_URL from "../apiConfig";

export default function MyComplaints() {
  const [complaints, setComplaints] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));

  const fetchData = () => {
    axios
      .get(`${API_BASE_URL}/api`)
      .then((res) => setComplaints(res.data))
      .catch(() => setComplaints([]));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const myComplaints = complaints.filter(
    (c) =>
      c.name === user?.username ||
      (c.userId && c.userId === user?.userId) ||
      (c.studentId && c.studentId === user?.userId)
  );

  return (
    <DashboardLayout>
      <div style={styles.page}>
        <div style={styles.glowTop}></div>
        <div style={styles.glowBottom}></div>

        <div style={styles.header}>
          <h2 style={styles.title}>My Complaints</h2>
          <p style={styles.subtitle}>
            {myComplaints.length} complaint{myComplaints.length !== 1 ? "s" : ""} on record
          </p>
        </div>

        <div style={styles.container}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={{ ...styles.th, borderRadius: "12px 0 0 12px" }}>
                  Complaint
                </th>
                <th style={styles.th}>Status</th>
                <th style={{ ...styles.th, borderRadius: "0 12px 12px 0" }}>
                  Teacher Response
                </th>
              </tr>
            </thead>

            <tbody>
              {myComplaints.length > 0 ? (
                myComplaints.map((c) => (
                  <tr key={c._id}>
                    <td style={{ ...styles.td, borderRadius: "12px 0 0 12px" }}>
                      {c.complaint}
                    </td>

                    <td style={styles.td}>
                      <span
                        style={{
                          ...styles.badge,
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
                    </td>

                    <td
                      style={{
                        ...styles.td,
                        borderRadius: "0 12px 12px 0",
                        color:
                          c.response && c.response.trim() !== ""
                            ? "#E4E4E9"
                            : "#7A7A85",
                        fontStyle:
                          c.response && c.response.trim() !== ""
                            ? "normal"
                            : "italic",
                      }}
                    >
                      {c.response && c.response.trim() !== ""
                        ? c.response
                        : "No response yet"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" style={styles.emptyCell}>
                    No complaints found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
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

  container: {
    position: "relative",
    background: "rgba(255,255,255,0.045)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(255,255,255,0.08)",
    padding: "20px",
    borderRadius: "18px",
    boxShadow: "0 20px 50px rgba(0,0,0,0.4)",
    overflowX: "auto",
  },

  table: {
    width: "100%",
    borderCollapse: "separate",
    borderSpacing: "0 10px",
    minWidth: "560px",
  },

  th: {
    textAlign: "left",
    padding: "14px 16px",
    background: "rgba(255,255,255,0.03)",
    color: "#9C9CA8",
    fontSize: "12px",
    fontWeight: "600",
    letterSpacing: "0.5px",
    textTransform: "uppercase",
  },

  td: {
    padding: "16px",
    background: "rgba(255,255,255,0.03)",
    fontSize: "14px",
    color: "#E4E4E9",
    border: "1px solid rgba(255,255,255,0.05)",
    borderLeft: "none",
    borderRight: "none",
  },

  badge: {
    padding: "6px 14px",
    borderRadius: "20px",
    fontSize: "11.5px",
    fontWeight: "600",
    whiteSpace: "nowrap",
  },

  emptyCell: {
    textAlign: "center",
    padding: "40px",
    color: "#7A7A85",
    fontStyle: "italic",
    background: "rgba(255,255,255,0.03)",
    borderRadius: "12px",
  },
};