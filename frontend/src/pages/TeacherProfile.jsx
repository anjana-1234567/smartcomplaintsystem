import { useState, useEffect } from "react";
import axios from "axios";
import DashboardLayout from "../layouts/DashboardLayout";

export default function TeacherProfile() {
  const localUser = JSON.parse(localStorage.getItem("user")) || {};
  const [profile, setProfile] = useState(localUser);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const [editForm, setEditForm] = useState({
    email: localUser.email || "",
    userId: localUser.userId || "",
    college: localUser.college || "ANURAG UNIVERSITY",
    department: localUser.department || "Computer Science & Engineering",
    phone: localUser.phone || "",
  });

  // Fetch permanent profile from MongoDB
  const fetchProfile = async () => {
    if (!localUser._id) return;
    try {
      const res = await axios.get(`http://localhost:5000/api/user/${localUser._id}`);
      setProfile(res.data);
      setEditForm({
        email: res.data.email || "",
        userId: res.data.userId || "",
        college: res.data.college || "ANURAG UNIVERSITY",
        department: res.data.department || "Computer Science & Engineering",
        phone: res.data.phone || "",
      });
      localStorage.setItem("user", JSON.stringify({ ...localUser, ...res.data }));
    } catch (err) {
      console.log("Could not fetch remote profile, using local:", err.message);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    try {
      const res = await axios.put(
        `http://localhost:5000/api/user/${profile._id}`,
        editForm
      );
      setProfile(res.data);
      localStorage.setItem("user", JSON.stringify({ ...localUser, ...res.data }));
      setMsg("Teacher profile permanently updated in database!");
      setIsEditing(false);
    } catch (err) {
      setMsg("Failed to update profile: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const initials = profile?.username
    ? profile.username.slice(0, 2).toUpperCase()
    : "TC";

  return (
    <DashboardLayout>
      <div style={styles.page}>
        <div style={styles.glowTop}></div>
        <div style={styles.glowBottom}></div>

        <div style={styles.header}>
          <h2 style={styles.title}>Teacher Profile</h2>
          <p style={styles.subtitle}>Your verified faculty account details</p>
        </div>

        {msg && <div style={styles.alertBox}>{msg}</div>}

        <div style={styles.container}>
          <div style={styles.card}>
            <div style={styles.avatar}>{initials}</div>

            <h3 style={styles.name}>{profile?.username || "Faculty Member"}</h3>
            <span style={styles.roleTag}>Verified Faculty</span>

            <div style={styles.divider}></div>

            <div style={styles.detailRow}>
              <span style={styles.detailLabel}>Teacher ID</span>
              <span style={styles.detailValue}>{profile?.userId || "Not Assigned"}</span>
            </div>

            <div style={styles.detailRow}>
              <span style={styles.detailLabel}>Email</span>
              <span style={styles.detailValue}>{profile?.email || "Not Provided"}</span>
            </div>

            <div style={styles.detailRow}>
              <span style={styles.detailLabel}>Department</span>
              <span style={styles.detailValue}>{profile?.department || "Computer Science"}</span>
            </div>

            <div style={styles.detailRow}>
              <span style={styles.detailLabel}>College / Institution</span>
              <span style={styles.detailValue}>{profile?.college || "ANURAG UNIVERSITY"}</span>
            </div>

            {profile?.phone && (
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>Phone</span>
                <span style={styles.detailValue}>{profile.phone}</span>
              </div>
            )}

            <div style={styles.detailRow}>
              <span style={styles.detailLabel}>Status</span>
              <span style={styles.statusBadge}>
                <span style={styles.statusDot}></span>
                {profile?.status || "Active"}
              </span>
            </div>

            <button
              onClick={() => setIsEditing(!isEditing)}
              style={styles.editBtn}
              onMouseEnter={(e) => (e.currentTarget.style.filter = "brightness(1.1)")}
              onMouseLeave={(e) => (e.currentTarget.style.filter = "brightness(1)")}
            >
              {isEditing ? "Cancel Editing" : "Edit Profile Info"}
            </button>

            {isEditing && (
              <form onSubmit={handleUpdate} style={styles.editForm}>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Teacher ID</label>
                  <input
                    type="text"
                    value={editForm.userId}
                    onChange={(e) => setEditForm({ ...editForm, userId: e.target.value })}
                    style={styles.formInput}
                    required
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Email Address</label>
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    style={styles.formInput}
                    required
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Department</label>
                  <input
                    type="text"
                    value={editForm.department}
                    onChange={(e) => setEditForm({ ...editForm, department: e.target.value })}
                    style={styles.formInput}
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>College / Institution</label>
                  <input
                    type="text"
                    value={editForm.college}
                    onChange={(e) => setEditForm({ ...editForm, college: e.target.value })}
                    style={styles.formInput}
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Phone Number</label>
                  <input
                    type="text"
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    style={styles.formInput}
                    placeholder="Optional"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  style={styles.saveBtn}
                >
                  {loading ? "Saving to Database..." : "Save Permanently"}
                </button>
              </form>
            )}
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
    textAlign: "center",
    marginBottom: "28px",
  },

  title: {
    margin: 0,
    fontSize: "26px",
    fontWeight: "700",
    fontFamily: "'Playfair Display', Georgia, serif",
    color: "#FAFAFA",
  },

  subtitle: {
    color: "#9C9CA8",
    marginTop: "6px",
    fontSize: "14px",
  },

  alertBox: {
    maxWidth: "420px",
    margin: "0 auto 20px",
    padding: "10px 16px",
    background: "rgba(74, 222, 128, 0.15)",
    border: "1px solid rgba(74, 222, 128, 0.35)",
    color: "#4ADE80",
    borderRadius: "10px",
    textAlign: "center",
    fontSize: "13.5px",
  },

  container: {
    position: "relative",
    display: "flex",
    justifyContent: "center",
  },

  card: {
    padding: "36px 32px",
    background: "rgba(255,255,255,0.045)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "20px",
    width: "400px",
    maxWidth: "95%",
    boxShadow: "0 20px 50px rgba(0,0,0,0.45)",
    textAlign: "center",
    boxSizing: "border-box",
  },

  avatar: {
    width: "76px",
    height: "76px",
    margin: "0 auto 16px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #D4AF6A 0%, #B8924F 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "26px",
    fontWeight: "700",
    color: "#14161F",
    boxShadow: "0 8px 24px rgba(212,175,106,0.3)",
  },

  name: {
    margin: 0,
    fontSize: "21px",
    fontWeight: "600",
    color: "#FAFAFA",
  },

  roleTag: {
    display: "inline-block",
    marginTop: "8px",
    padding: "4px 14px",
    fontSize: "12px",
    fontWeight: "600",
    letterSpacing: "0.4px",
    textTransform: "uppercase",
    color: "#D4AF6A",
    background: "rgba(212,175,106,0.12)",
    border: "1px solid rgba(212,175,106,0.3)",
    borderRadius: "20px",
  },

  divider: {
    height: "1px",
    background: "rgba(255,255,255,0.08)",
    margin: "24px 0 20px",
  },

  detailRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "11px 0",
    borderBottom: "1px solid rgba(255,255,255,0.05)",
  },

  detailLabel: {
    fontSize: "13px",
    color: "#9C9CA8",
    letterSpacing: "0.3px",
  },

  detailValue: {
    fontSize: "14px",
    color: "#E4E4E9",
    fontWeight: "500",
  },

  statusBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "13px",
    color: "#4ADE80",
    fontWeight: "600",
  },

  statusDot: {
    width: "7px",
    height: "7px",
    borderRadius: "50%",
    background: "#4ADE80",
    boxShadow: "0 0 8px rgba(74,222,128,0.6)",
  },

  editBtn: {
    marginTop: "24px",
    width: "100%",
    padding: "11px",
    background: "rgba(212, 175, 106, 0.15)",
    border: "1px solid rgba(212, 175, 106, 0.35)",
    color: "#D4AF6A",
    borderRadius: "10px",
    fontWeight: "600",
    fontSize: "13.5px",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },

  editForm: {
    marginTop: "20px",
    textAlign: "left",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    background: "rgba(0,0,0,0.25)",
    padding: "18px",
    borderRadius: "12px",
    border: "1px solid rgba(255,255,255,0.06)",
  },

  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "5px",
  },

  formLabel: {
    fontSize: "12px",
    color: "#9C9CA8",
    fontWeight: "500",
  },

  formInput: {
    padding: "10px 12px",
    borderRadius: "8px",
    border: "1px solid #333",
    background: "#12141C",
    color: "#FFF",
    fontSize: "13px",
    outline: "none",
  },

  saveBtn: {
    marginTop: "8px",
    padding: "11px",
    background: "#C59B51",
    color: "#14161F",
    border: "none",
    borderRadius: "8px",
    fontWeight: "700",
    fontSize: "13.5px",
    cursor: "pointer",
  },
};