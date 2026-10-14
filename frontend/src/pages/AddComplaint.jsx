import { useState } from "react";
import axios from "axios";
import DashboardLayout from "../layouts/DashboardLayout";
import API_BASE_URL from "../apiConfig";

export default function AddComplaint() {
  const [complaint, setComplaint] = useState("");
  const [loading, setLoading] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!complaint) return alert("Write a complaint");

    setLoading(true);

    try {
      await axios.post(`${API_BASE_URL}/api/add`, {
        name: user?.username || "Student",
        studentId: user?.userId || "",
        userId: user?.userId || "",
        email: user?.email || "",
        complaint: complaint,
      });

      alert("Complaint submitted successfully");
      setComplaint("");
    } catch (err) {
      alert("Error submitting complaint");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div style={styles.container}>
        <div style={styles.glowTop}></div>
        <div style={styles.glowBottom}></div>

        <div style={styles.header}>
          <h2 style={styles.title}>Add Complaint</h2>
          <p style={styles.subtitle}>
            Describe the issue clearly so it can be resolved faster
          </p>
        </div>

        <form onSubmit={handleSubmit} style={styles.card}>
          <label style={styles.label}>Complaint details</label>

          <textarea
            placeholder="Write your complaint here..."
            value={complaint}
            onChange={(e) => setComplaint(e.target.value)}
            style={styles.textarea}
            onFocus={(e) => (e.target.style.borderColor = "#D4AF6A")}
            onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.12)")}
          />

          <div style={styles.footer}>
            <span style={styles.charCount}>
              {complaint.length} characters
            </span>

            <button
              type="submit"
              disabled={loading}
              style={{
                ...styles.button,
                opacity: loading ? 0.7 : 1,
                cursor: loading ? "not-allowed" : "pointer",
              }}
              onMouseEnter={(e) => {
                if (!loading) e.target.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "translateY(0)";
              }}
            >
              {loading ? "Submitting..." : "Submit Complaint"}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}

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

  card: {
    position: "relative",
    maxWidth: "640px",
    padding: "28px",
    borderRadius: "18px",
    background: "rgba(255,255,255,0.045)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(255,255,255,0.08)",
    boxShadow: "0 20px 50px rgba(0,0,0,0.4)",
  },

  label: {
    display: "block",
    fontSize: "12.5px",
    color: "#9C9CA8",
    letterSpacing: "0.4px",
    textTransform: "uppercase",
    marginBottom: "10px",
  },

  textarea: {
    width: "100%",
    height: "160px",
    padding: "14px 16px",
    borderRadius: "12px",
    border: "1px solid rgba(255,255,255,0.12)",
    outline: "none",
    fontSize: "14px",
    fontFamily: "inherit",
    background: "rgba(255,255,255,0.04)",
    color: "#F2F2F5",
    resize: "vertical",
    boxSizing: "border-box",
    transition: "border-color 0.2s ease",
    lineHeight: "1.6",
  },

  footer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "18px",
  },

  charCount: {
    fontSize: "12.5px",
    color: "#7A7A85",
  },

  button: {
    padding: "12px 26px",
    background: "linear-gradient(135deg, #D4AF6A 0%, #B8924F 100%)",
    color: "#14161F",
    border: "none",
    borderRadius: "10px",
    fontWeight: "700",
    fontSize: "14px",
    letterSpacing: "0.3px",
    boxShadow: "0 8px 20px rgba(212,175,106,0.25)",
    transition: "transform 0.2s ease",
  },
};