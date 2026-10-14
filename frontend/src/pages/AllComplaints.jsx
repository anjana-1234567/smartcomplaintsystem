import { useEffect, useState } from "react";
import axios from "axios";
import DashboardLayout from "../layouts/DashboardLayout";
import API_BASE_URL from "../apiConfig";

export default function AllComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [search, setSearch] = useState("");
  const [responses, setResponses] = useState({});

  const fetchData = () => {
    axios
      .get(`${API_BASE_URL}/api`)
      .then((res) => {
        setComplaints(res.data);

        const temp = {};
        res.data.forEach((c) => {
          temp[c._id] = c.response || "";
        });

        setResponses(temp);
      })
      .catch(() => setComplaints([]));
  };

  useEffect(() => {
    fetchData();
  }, []);

  // SAVE RESPONSE ONLY
  const saveResponse = async (id) => {
    const user = JSON.parse(localStorage.getItem("user"));
    await axios.put(
      `${API_BASE_URL}/api/response/${id}`,
      {
        response: responses[id],
        respondedBy: user?.username || "Teacher",
      }
    );

    fetchData();
  };

  // UPDATE STATUS ONLY
  const updateStatus = async (id, status) => {
    await axios.put(
      `${API_BASE_URL}/api/status/${id}`,
      {
        status,
      }
    );

    fetchData();
  };

  const filteredComplaints = complaints.filter(
    (c) =>
      c.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.userId?.toLowerCase().includes(search.toLowerCase()) ||
      c.studentId?.toLowerCase().includes(search.toLowerCase()) ||
      c.complaint?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div style={styles.page}>
        <div style={styles.glowTop}></div>
        <div style={styles.glowBottom}></div>

        <div style={styles.header}>
          <h2 style={styles.title}>All Complaints</h2>
          <p style={styles.subtitle}>
            {filteredComplaints.length} complaint{filteredComplaints.length !== 1 ? "s" : ""} found
          </p>
        </div>

        <div style={styles.searchWrap}>
          <span style={styles.searchIcon}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="7" stroke="#9C9CA8" strokeWidth="2" />
              <path d="M21 21l-4.3-4.3" stroke="#9C9CA8" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Search student name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={styles.searchInput}
            onFocus={(e) => (e.target.style.borderColor = "#D4AF6A")}
            onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.12)")}
          />
        </div>

        <div style={styles.container}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={{ ...styles.th, borderRadius: "12px 0 0 12px" }}>Name</th>
                <th style={styles.th}>Complaint</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Response</th>
                <th style={styles.th}>Save</th>
                <th style={{ ...styles.th, borderRadius: "0 12px 12px 0" }}>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredComplaints.length > 0 ? (
                filteredComplaints.map((c) => (
                  <tr key={c._id}>
                    <td style={{ ...styles.td, borderRadius: "12px 0 0 12px", fontWeight: 600 }}>
                      <div>{c.name}</div>
                      {(c.userId || c.studentId) && (
                        <div style={{ fontSize: "11px", color: "#D4AF6A", marginTop: "3px" }}>
                          Roll: {c.userId || c.studentId}
                        </div>
                      )}
                    </td>

                    <td style={styles.td}>{c.complaint}</td>

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

                    <td style={styles.td}>
                      <input
                        type="text"
                        value={responses[c._id]}
                        onChange={(e) =>
                          setResponses({
                            ...responses,
                            [c._id]: e.target.value,
                          })
                        }
                        placeholder="Enter response..."
                        style={styles.responseInput}
                        onFocus={(e) => (e.target.style.borderColor = "#D4AF6A")}
                        onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.12)")}
                      />
                    </td>

                    <td style={styles.td}>
                      <button
                        style={styles.saveBtn}
                        onClick={() => saveResponse(c._id)}
                        onMouseEnter={(e) => (e.target.style.transform = "translateY(-1px)")}
                        onMouseLeave={(e) => (e.target.style.transform = "translateY(0)")}
                      >
                        Save Response
                      </button>
                    </td>

                    <td style={{ ...styles.td, borderRadius: "0 12px 12px 0" }}>
                      <div style={styles.actionRow}>
                        <button
                          style={styles.solveBtn}
                          onClick={() => updateStatus(c._id, "Solved")}
                        >
                          Solve
                        </button>

                        <button
                          style={styles.pendingBtn}
                          onClick={() => updateStatus(c._id, "Pending")}
                        >
                          Pending
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={styles.emptyCell}>
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

/* ================= STYLES ================= */

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
    marginBottom: "20px",
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

  searchWrap: {
    position: "relative",
    display: "inline-flex",
    alignItems: "center",
    marginBottom: "20px",
  },

  searchIcon: {
    position: "absolute",
    left: "14px",
    display: "flex",
    pointerEvents: "none",
  },

  searchInput: {
    padding: "11px 16px 11px 40px",
    width: "300px",
    borderRadius: "10px",
    border: "1px solid rgba(255,255,255,0.12)",
    outline: "none",
    fontSize: "14px",
    background: "rgba(255,255,255,0.04)",
    color: "#F2F2F5",
    boxSizing: "border-box",
    transition: "border-color 0.2s ease",
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
    minWidth: "880px",
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
    whiteSpace: "nowrap",
  },

  td: {
    padding: "14px 16px",
    background: "rgba(255,255,255,0.03)",
    fontSize: "13.5px",
    color: "#E4E4E9",
    verticalAlign: "middle",
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

  responseInput: {
    width: "220px",
    padding: "9px 12px",
    borderRadius: "8px",
    border: "1px solid rgba(255,255,255,0.12)",
    outline: "none",
    fontSize: "13px",
    background: "rgba(255,255,255,0.04)",
    color: "#F2F2F5",
    boxSizing: "border-box",
    transition: "border-color 0.2s ease",
  },

  saveBtn: {
    padding: "8px 14px",
    background: "linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "12.5px",
    fontWeight: "600",
    whiteSpace: "nowrap",
    transition: "transform 0.15s ease",
  },

  actionRow: {
    display: "flex",
    gap: "8px",
  },

  solveBtn: {
    padding: "7px 12px",
    background: "rgba(74,222,128,0.15)",
    color: "#4ADE80",
    border: "1px solid rgba(74,222,128,0.35)",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "12.5px",
    fontWeight: "600",
  },

  pendingBtn: {
    padding: "7px 12px",
    background: "rgba(240,168,78,0.15)",
    color: "#F0A84E",
    border: "1px solid rgba(240,168,78,0.35)",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "12.5px",
    fontWeight: "600",
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