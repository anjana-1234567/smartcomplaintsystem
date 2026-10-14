import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import API_BASE_URL from "../apiConfig";

export default function Register() {
  const navigate = useNavigate();

  const [role, setRole] = useState("student");
  const [form, setForm] = useState({
    username: "",
    email: "",
    userId: "",
    password: "",
    department: "Computer Science & Engineering",
    college: "ANURAG UNIVERSITY",
    section: "CSE-T",
    phone: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [focusedField, setFocusedField] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!form.username.trim()) {
      setError("Please enter a username or full name");
      return;
    }
    if (!form.email.trim()) {
      setError("Please enter your email address");
      return;
    }
    if (!form.userId.trim()) {
      setError(
        role === "student"
          ? "Please enter your Roll Number"
          : "Please enter your Teacher ID"
      );
      return;
    }
    if (!form.password) {
      setError("Please enter a password");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        username: form.username.trim(),
        email: form.email.trim().toLowerCase(),
        userId: form.userId.trim(),
        password: form.password,
        role: role,
        department: form.department?.trim() || "Computer Science & Engineering",
        college: form.college?.trim() || "ANURAG UNIVERSITY",
        section: form.section?.trim() || "CSE-T",
        phone: form.phone?.trim() || "",
      };

      const res = await axios.post(
        `${API_BASE_URL}/api/register`,
        payload
      );

      setSuccess("Account Registered Successfully! Redirecting to login...");

      // Automatically redirect to login after brief confirmation
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (err) {
      console.error("REGISTRATION ERROR:", err.response?.data || err.message);
      setError(
        err.response?.data?.message ||
          "Registration failed. Please verify your details."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.overlay}></div>

      <div style={styles.card}>
        {/* Top Graduation Badge */}
        <div style={styles.iconBadge}>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12 3L2 8.5L12 14L22 8.5L12 3Z" fill="#C59B51" />
            <path
              d="M6 11.2V15.5C6 17.5 8.7 19 12 19C15.3 19 18 17.5 18 15.5V11.2L12 14.5L6 11.2Z"
              fill="#C59B51"
              opacity="0.85"
            />
            <path d="M21 9.5V15H22V9.5L21 9.5Z" fill="#C59B51" />
          </svg>
        </div>

        <h1 style={styles.title}>Create Account</h1>
        <div style={styles.accentLine}></div>
        <p style={styles.subtitle}>
          Sign up to access Smart Complaint System
        </p>

        {/* Role Toggle Switch */}
        <div style={styles.roleTabs}>
          <button
            type="button"
            onClick={() => setRole("student")}
            style={{
              ...styles.roleTab,
              ...(role === "student" ? styles.roleTabActive : {}),
            }}
          >
            Student
          </button>
          <button
            type="button"
            onClick={() => setRole("teacher")}
            style={{
              ...styles.roleTab,
              ...(role === "teacher" ? styles.roleTabActive : {}),
            }}
          >
            Teacher
          </button>
        </div>

        {/* Status Alerts */}
        {error && <div style={styles.errorBox}>{error}</div>}
        {success && <div style={styles.successBox}>{success}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          {/* Username */}
          <div style={styles.inputGroup}>
            <span style={styles.inputIcon}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#7A8296" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </span>
            <input
              type="text"
              name="username"
              placeholder="Username / Full Name"
              value={form.username}
              onChange={handleChange}
              onFocus={() => setFocusedField("username")}
              onBlur={() => setFocusedField("")}
              required
              style={{
                ...styles.input,
                borderColor: focusedField === "username" ? "#C59B51" : "#2E3444",
                boxShadow: focusedField === "username" ? "0 0 0 1px #C59B51" : "none",
              }}
            />
          </div>

          {/* Email */}
          <div style={styles.inputGroup}>
            <span style={styles.inputIcon}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#7A8296" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            </span>
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={form.email}
              onChange={handleChange}
              onFocus={() => setFocusedField("email")}
              onBlur={() => setFocusedField("")}
              required
              style={{
                ...styles.input,
                borderColor: focusedField === "email" ? "#C59B51" : "#2E3444",
                boxShadow: focusedField === "email" ? "0 0 0 1px #C59B51" : "none",
              }}
            />
          </div>

          {/* Roll Number or Teacher ID */}
          <div style={styles.inputGroup}>
            <span style={styles.inputIcon}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#7A8296" strokeWidth="2">
                <rect x="3" y="4" width="18" height="16" rx="2" />
                <line x1="7" y1="8" x2="17" y2="8" />
                <line x1="7" y1="12" x2="13" y2="12" />
              </svg>
            </span>
            <input
              type="text"
              name="userId"
              placeholder={role === "student" ? "Roll Number (e.g. 24EG105T04)" : "Teacher ID (e.g. TCH102)"}
              value={form.userId}
              onChange={handleChange}
              onFocus={() => setFocusedField("userId")}
              onBlur={() => setFocusedField("")}
              required
              style={{
                ...styles.input,
                borderColor: focusedField === "userId" ? "#C59B51" : "#2E3444",
                boxShadow: focusedField === "userId" ? "0 0 0 1px #C59B51" : "none",
              }}
            />
          </div>

          {/* Department / Section */}
          <div style={styles.inputGroup}>
            <span style={styles.inputIcon}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#7A8296" strokeWidth="2">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                <path d="M6 12v5c3 3 9 3 12 0v-5" />
              </svg>
            </span>
            <input
              type="text"
              name="section"
              placeholder={role === "student" ? "Class / Section (e.g. CSE-T)" : "Department (e.g. Computer Science)"}
              value={form.section}
              onChange={handleChange}
              onFocus={() => setFocusedField("section")}
              onBlur={() => setFocusedField("")}
              style={{
                ...styles.input,
                borderColor: focusedField === "section" ? "#C59B51" : "#2E3444",
                boxShadow: focusedField === "section" ? "0 0 0 1px #C59B51" : "none",
              }}
            />
          </div>

          {/* Password */}
          <div style={styles.inputGroup}>
            <span style={styles.inputIcon}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#7A8296" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </span>
            <input
              type="password"
              name="password"
              placeholder="Create Password"
              value={form.password}
              onChange={handleChange}
              onFocus={() => setFocusedField("password")}
              onBlur={() => setFocusedField("")}
              required
              style={{
                ...styles.input,
                borderColor: focusedField === "password" ? "#C59B51" : "#2E3444",
                boxShadow: focusedField === "password" ? "0 0 0 1px #C59B51" : "none",
              }}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.button,
              opacity: loading ? 0.8 : 1,
              cursor: loading ? "not-allowed" : "pointer",
            }}
            onMouseEnter={(e) => {
              if (!loading) e.currentTarget.style.filter = "brightness(1.08)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.filter = "brightness(1)";
            }}
          >
            {loading ? "Registering..." : `Register as ${role === "student" ? "Student" : "Teacher"}`}
          </button>
        </form>

        <p style={styles.bottomText}>
          Already have an account?{" "}
          <Link to="/" style={styles.link}>
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    width: "100vw",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundImage: "url('/smart_classroom_bg.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    position: "relative",
    fontFamily:
      "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    padding: "20px",
    boxSizing: "border-box",
  },

  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0, 0, 0, 0.48)",
    backdropFilter: "blur(2px)",
  },

  card: {
    position: "relative",
    zIndex: 10,
    width: "410px",
    maxWidth: "92%",
    padding: "36px 32px 30px",
    borderRadius: "24px",
    background: "rgba(32, 36, 47, 0.90)",
    backdropFilter: "blur(18px)",
    WebkitBackdropFilter: "blur(18px)",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    boxShadow:
      "0 25px 60px rgba(0, 0, 0, 0.65), 0 0 1px rgba(255, 255, 255, 0.15)",
    textAlign: "center",
    boxSizing: "border-box",
  },

  iconBadge: {
    width: "46px",
    height: "46px",
    margin: "0 auto 12px",
    borderRadius: "12px",
    background: "rgba(197, 155, 81, 0.14)",
    border: "1px solid rgba(197, 155, 81, 0.28)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  title: {
    margin: "0 0 6px",
    fontSize: "26px",
    fontWeight: "700",
    color: "#FFFFFF",
    fontFamily:
      "'Playfair Display', Georgia, Cambria, 'Times New Roman', serif",
    letterSpacing: "0.2px",
  },

  accentLine: {
    width: "36px",
    height: "2.5px",
    background: "#C59B51",
    borderRadius: "2px",
    margin: "0 auto 12px",
  },

  subtitle: {
    fontSize: "13px",
    color: "#9CA3AF",
    margin: "0 0 20px",
    fontWeight: "400",
  },

  roleTabs: {
    display: "flex",
    background: "#1E222D",
    borderRadius: "10px",
    padding: "4px",
    marginBottom: "18px",
    border: "1px solid #2E3444",
  },

  roleTab: {
    flex: 1,
    padding: "9px 0",
    background: "transparent",
    border: "none",
    borderRadius: "8px",
    color: "#9CA3AF",
    fontSize: "13.5px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },

  roleTabActive: {
    background: "#C59B51",
    color: "#18150E",
    boxShadow: "0 2px 8px rgba(197, 155, 81, 0.3)",
  },

  errorBox: {
    background: "rgba(239, 68, 68, 0.15)",
    border: "1px solid rgba(239, 68, 68, 0.35)",
    color: "#FCA5A5",
    padding: "10px 14px",
    borderRadius: "8px",
    fontSize: "13px",
    marginBottom: "16px",
    textAlign: "center",
  },

  successBox: {
    background: "rgba(74, 222, 128, 0.15)",
    border: "1px solid rgba(74, 222, 128, 0.35)",
    color: "#4ADE80",
    padding: "10px 14px",
    borderRadius: "8px",
    fontSize: "13px",
    marginBottom: "16px",
    textAlign: "center",
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },

  inputGroup: {
    position: "relative",
    width: "100%",
    display: "flex",
    alignItems: "center",
  },

  inputIcon: {
    position: "absolute",
    left: "14px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    pointerEvents: "none",
    zIndex: 2,
  },

  input: {
    width: "100%",
    padding: "12px 14px 12px 42px",
    borderRadius: "10px",
    border: "1px solid #2E3444",
    background: "#1E222D",
    color: "#FFFFFF",
    fontSize: "13.5px",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.2s ease, box-shadow 0.2s ease",
  },

  button: {
    width: "100%",
    padding: "13px",
    background: "#C59B51",
    border: "none",
    borderRadius: "10px",
    color: "#18150E",
    fontWeight: "700",
    fontSize: "14.5px",
    cursor: "pointer",
    marginTop: "6px",
    boxShadow: "0 4px 18px rgba(197, 155, 81, 0.35)",
    transition: "all 0.2s ease",
  },

  bottomText: {
    marginTop: "18px",
    fontSize: "13px",
    color: "#9CA3AF",
  },

  link: {
    color: "#C59B51",
    textDecoration: "none",
    fontWeight: "600",
    marginLeft: "4px",
  },
};