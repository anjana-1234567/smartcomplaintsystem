import { useEffect, useState } from "react";
import axios from "axios";
import DashboardLayout from "../layouts/DashboardLayout";
import ComplaintChart from "../components/ComplaintChart";

export default function TeacherComplaints() {
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const res = await axios.get("http://localhost:5000/api");
    setComplaints(res.data);
  };

  const updateStatus = async (id, status) => {
    await axios.put(`http://localhost:5000/api/${id}`, {
      status,
    });

    fetchData();
  };

  // ================= STATS =================
  const total = complaints.length;

  const pending = complaints.filter(
    (c) => c.status === "Pending"
  ).length;

  const solved = complaints.filter(
    (c) =>
      c.status === "Solved" ||
      c.status === "Resolved"
  ).length;

  return (
    <DashboardLayout>
      <div style={styles.container}>

        <h2 style={styles.title}>Teacher Dashboard</h2>
        <p style={styles.subtitle}>
          Manage and track all student complaints
        </p>

        {/* ================= CARDS ================= */}
        <div style={styles.cardRow}>

          <div style={styles.card}>
            <h3>Total Complaints</h3>
            <h2>{total}</h2>
          </div>

          <div style={styles.card}>
            <h3>Pending</h3>
            <h2 style={{ color: "orange" }}>{pending}</h2>
          </div>

          <div style={styles.card}>
            <h3>Solved</h3>
            <h2 style={{ color: "green" }}>{solved}</h2>
          </div>

        </div>

        {/* ================= CHART ================= */}
        <div style={{ marginTop: "20px" }}>
          <ComplaintChart complaints={complaints} />
        </div>

        {/* ================= TABLE ================= */}
        <div style={{ marginTop: "30px", overflowX: "auto" }}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.head}>
                <th style={styles.th}>Student</th>
                <th style={styles.th}>Complaint</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>

            <tbody>
              {complaints.map((c) => (
                <tr key={c._id} style={styles.row}>
                  <td style={styles.td}>{c.name}</td>

                  <td style={styles.td}>{c.complaint}</td>

                  <td style={styles.td}>
                    <span
                      style={{
                        padding: "5px 10px",
                        borderRadius: "20px",
                        color: "white",
                        background:
                          c.status === "Solved"
                            ? "green"
                            : "orange",
                      }}
                    >
                      {c.status}
                    </span>
                  </td>

                  <td style={styles.td}>
                    <button
                      onClick={() =>
                        updateStatus(c._id, "Pending")
                      }
                      style={styles.pending}
                    >
                      Pending
                    </button>

                    <button
                      onClick={() =>
                        updateStatus(c._id, "Solved")
                      }
                      style={styles.solved}
                    >
                      Solved
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </DashboardLayout>
  );
}

/* ================= STYLES ================= */
const styles = {
  container: {
    padding: "20px",
    background: "#f4f6f9",
    minHeight: "100vh",
  },

  title: {
    marginBottom: "5px",
  },

  subtitle: {
    color: "#666",
    marginBottom: "20px",
  },

  cardRow: {
    display: "flex",
    gap: "15px",
    flexWrap: "wrap",
  },

  card: {
    flex: 1,
    minWidth: "180px",
    background: "white",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    textAlign: "center",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    background: "white",
    borderRadius: "10px",
    overflow: "hidden",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  },

  head: {
    background: "#111827",
    color: "white",
  },

  th: {
    padding: "12px",
    textAlign: "left",
  },

  row: {
    borderBottom: "1px solid #eee",
  },

  td: {
    padding: "12px",
  },

  pending: {
    marginRight: "8px",
    padding: "6px 10px",
    border: "none",
    borderRadius: "6px",
    background: "orange",
    color: "white",
    cursor: "pointer",
  },

  solved: {
    padding: "6px 10px",
    border: "none",
    borderRadius: "6px",
    background: "green",
    color: "white",
    cursor: "pointer",
  },
};