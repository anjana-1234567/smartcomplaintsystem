import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [focusedField, setFocusedField] = useState("password"); // Default focus on password matching user screenshot
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

    if (!form.username.trim() || !form.password) {
      setError("Please enter both username and password");
      return;
    }

    setLoading(true);

    try {
      // Backend supports username, email, or identifier
      const res = await axios.post("http://localhost:5000/api/login", {
        username: form.username.trim(),
        email: form.username.trim(),
        identifier: form.username.trim(),
        password: form.password,
      });

      const user = {
        _id: res.data._id,
        username: res.data.username,
        email: res.data.email || "",
        userId: res.data.userId || "",
        role: res.data.role || "student",
        department: res.data.department || "Computer Science & Engineering",
        college: res.data.college || "ANURAG UNIVERSITY",
        section: res.data.section || "CSE-T",
        phone: res.data.phone || "",
        status: res.data.status || "Active",
      };

      localStorage.setItem("user", JSON.stringify(user));

      if (user.role === "teacher") {
        navigate("/teacher");
      } else {
        navigate("/student");
      }
    } catch (err) {
      console.error("LOGIN ERROR:", err.response?.data || err.message);
      setError(
        err.response?.data?.message ||
          "Invalid Username or Password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      {/* Dark tint overlay */}
      <div style={styles.overlay}></div>

      {/* Centered Glassmorphism Card */}
      <div style={styles.card}>
        {/* Top Graduation Cap Icon Badge */}
        <div style={styles.iconBadge}>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 3L2 8.5L12 14L22 8.5L12 3Z"
              fill="#C59B51"
            />
            <path
              d="M6 11.2V15.5C6 17.5 8.7 19 12 19C15.3 19 18 17.5 18 15.5V11.2L12 14.5L6 11.2Z"
              fill="#C59B51"
              opacity="0.85"
            />
            <path
              d="M21 9.5V15H22V9.5L21 9.5Z"
              fill="#C59B51"
            />
          </svg>
        </div>

        {/* Title */}
        <h1 style={styles.title}>Smart Classroom</h1>

        {/* Golden Accent Line */}
        <div style={styles.accentLine}></div>

        {/* Subtitle */}
        <p style={styles.subtitle}>Sign in to continue your learning journey</p>

        {/* Error message */}
        {error && <div style={styles.errorBox}>{error}</div>}

        {/* Form */}
        <form onSubmit={handleSubmit} style={styles.form}>
          {/* Username Input */}
          <div style={styles.inputGroup}>
            <span style={styles.inputIcon}>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke={focusedField === "username" ? "#C59B51" : "#7A8296"}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </span>
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={form.username}
              onChange={handleChange}
              onFocus={() => setFocusedField("username")}
              onBlur={() => setFocusedField("")}
              required
              style={{
                ...styles.input,
                borderColor:
                  focusedField === "username" ? "#C59B51" : "#2E3444",
                boxShadow:
                  focusedField === "username"
                    ? "0 0 0 1px #C59B51"
                    : "none",
              }}
            />
          </div>

          {/* Password Input */}
          <div style={styles.inputGroup}>
            <span style={styles.inputIcon}>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke={focusedField === "password" ? "#C59B51" : "#7A8296"}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </span>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              onFocus={() => setFocusedField("password")}
              onBlur={() => setFocusedField("")}
              required
              style={{
                ...styles.input,
                borderColor:
                  focusedField === "password" ? "#C59B51" : "#2E3444",
                boxShadow:
                  focusedField === "password"
                    ? "0 0 0 1px #C59B51"
                    : "none",
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
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

        {/* Footer Link */}
        <p style={styles.bottomText}>
          New here?{" "}
          <Link to="/register" style={styles.link}>
            Create Account
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
    overflow: "hidden",
  },

  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0, 0, 0, 0.45)",
    backdropFilter: "blur(2px)",
  },

  card: {
    position: "relative",
    zIndex: 10,
    width: "380px",
    maxWidth: "90%",
    padding: "38px 34px 34px",
    borderRadius: "24px",
    background: "rgba(32, 36, 47, 0.88)",
    backdropFilter: "blur(18px)",
    WebkitBackdropFilter: "blur(18px)",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    boxShadow:
      "0 25px 60px rgba(0, 0, 0, 0.65), 0 0 1px rgba(255, 255, 255, 0.15)",
    textAlign: "center",
    boxSizing: "border-box",
  },

  iconBadge: {
    width: "48px",
    height: "48px",
    margin: "0 auto 16px",
    borderRadius: "12px",
    background: "rgba(197, 155, 81, 0.14)",
    border: "1px solid rgba(197, 155, 81, 0.28)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  title: {
    margin: "0 0 8px",
    fontSize: "27px",
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
    margin: "0 auto 14px",
  },

  subtitle: {
    fontSize: "13.5px",
    color: "#9CA3AF",
    margin: "0 0 26px",
    fontWeight: "400",
    lineHeight: "1.4",
  },

  errorBox: {
    background: "rgba(239, 68, 68, 0.15)",
    border: "1px solid rgba(239, 68, 68, 0.35)",
    color: "#FCA5A5",
    padding: "10px 14px",
    borderRadius: "8px",
    fontSize: "13px",
    marginBottom: "18px",
    textAlign: "center",
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "14px",
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
    padding: "13px 14px 13px 42px",
    borderRadius: "10px",
    border: "1px solid #2E3444",
    background: "#1E222D",
    color: "#FFFFFF",
    fontSize: "14px",
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
    fontSize: "15px",
    cursor: "pointer",
    marginTop: "6px",
    boxShadow: "0 4px 18px rgba(197, 155, 81, 0.35)",
    transition: "all 0.2s ease",
  },

  bottomText: {
    marginTop: "22px",
    fontSize: "13px",
    color: "#9CA3AF",
  },

  link: {
    color: "#C59B51",
    textDecoration: "none",
    fontWeight: "600",
    marginLeft: "4px",
    cursor: "pointer",
  },
};