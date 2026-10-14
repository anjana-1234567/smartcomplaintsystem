import { Link, useNavigate, useLocation } from "react-router-dom";

export default function DashboardLayout({ children }) {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  const location = useLocation();

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  const initials = user?.username
    ? user.username.slice(0, 2).toUpperCase()
    : "U";

  const isActive = (path) => location.pathname === path;

  const studentLinks = [
    { to: "/student", label: "Home" },
    { to: "/add", label: "Add Complaint" },
    { to: "/my", label: "My Complaints" },
    { to: "/complaint-status", label: "Complaint Status" },
    { to: "/student-profile", label: "Profile" },
  ];

  const teacherLinks = [
    { to: "/teacher", label: "Dashboard" },
    { to: "/all-complaints", label: "All Complaints" },
    { to: "/teacher-profile", label: "Profile" },
  ];

  const links = user?.role === "student" ? studentLinks : teacherLinks;

  return (
    <div style={styles.wrapper}>
      {/* SIDEBAR */}
      <div style={styles.sidebar}>
        <div style={styles.glowSidebar}></div>

        <div style={styles.brand}>
          <div style={styles.brandIcon}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 3L2 8l10 5 8-4.09V17h2V8L12 3z"
                fill="#D4AF6A"
              />
              <path
                d="M6 10.72v4.53c0 .35.16.68.44.9C7.9 17.32 9.85 18 12 18s4.1-.68 5.56-1.85c.28-.22.44-.55.44-.9v-4.53l-6 3.06-6-3.06z"
                fill="#D4AF6A"
                opacity="0.7"
              />
            </svg>
          </div>
          <span style={styles.brandText}>Smart Complaint System</span>
        </div>

        <div style={styles.userCard}>
          <div style={styles.avatar}>{initials}</div>
          <div style={{ overflow: "hidden" }}>
            <p style={styles.userName}>{user?.username}</p>
            <span style={styles.userRole}>
              {user?.role} {user?.userId ? `• ${user.userId}` : ""}
            </span>
          </div>
        </div>

        <div style={styles.navSection}>
          <span style={styles.navLabel}>Menu</span>

          {links.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              style={{
                ...styles.link,
                ...(isActive(item.to) ? styles.linkActive : {}),
              }}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <button
          onClick={logout}
          style={styles.logout}
          onMouseEnter={(e) => (e.target.style.background = "rgba(239,68,68,0.22)")}
          onMouseLeave={(e) => (e.target.style.background = "rgba(239,68,68,0.12)")}
        >
          Logout
        </button>
      </div>

      {/* MAIN CONTENT */}
      <div style={styles.main}>{children}</div>
    </div>
  );
}

/* ================= STYLES ================= */

const styles = {
  wrapper: {
    display: "flex",
    minHeight: "100vh",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    alignItems: "stretch",
  },

  sidebar: {
    position: "relative",
    width: "270px",
    background: "#0B0C14",
    borderRight: "1px solid rgba(255,255,255,0.06)",
    color: "#F2F2F5",
    padding: "24px 18px",
    minHeight: "100%",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },

  glowSidebar: {
    position: "absolute",
    top: "-120px",
    left: "-80px",
    width: "260px",
    height: "260px",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(212,175,106,0.1) 0%, transparent 70%)",
    filter: "blur(30px)",
    pointerEvents: "none",
  },

  brand: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "26px",
    padding: "0 6px",
  },

  brandIcon: {
    width: "34px",
    height: "34px",
    borderRadius: "9px",
    background: "rgba(212,175,106,0.1)",
    border: "1px solid rgba(212,175,106,0.25)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  brandText: {
    fontSize: "14px",
    fontWeight: "600",
    lineHeight: "1.25",
    color: "#FAFAFA",
    fontFamily: "'Georgia', serif",
  },

  userCard: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "14px",
    borderRadius: "14px",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.07)",
    marginBottom: "22px",
  },

  avatar: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #D4AF6A 0%, #B8924F 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "14px",
    fontWeight: "700",
    color: "#14161F",
    flexShrink: 0,
  },

  userName: {
    margin: 0,
    fontSize: "14px",
    fontWeight: "600",
    color: "#FAFAFA",
  },

  userRole: {
    fontSize: "11.5px",
    color: "#9C9CA8",
    textTransform: "capitalize",
  },

  navSection: {
    position: "relative",
    flex: 1,
  },

  navLabel: {
    display: "block",
    fontSize: "11px",
    fontWeight: "600",
    letterSpacing: "0.6px",
    textTransform: "uppercase",
    color: "#6B6B75",
    padding: "0 10px",
    marginBottom: "8px",
  },

  link: {
    display: "block",
    color: "#B8B8C0",
    textDecoration: "none",
    margin: "4px 0",
    padding: "10px 12px",
    borderRadius: "9px",
    fontSize: "14px",
    fontWeight: "500",
    transition: "background 0.15s ease, color 0.15s ease",
  },

  linkActive: {
    background: "rgba(212,175,106,0.12)",
    color: "#D4AF6A",
    fontWeight: "600",
    border: "1px solid rgba(212,175,106,0.2)",
  },

  logout: {
    position: "relative",
    marginTop: "16px",
    width: "100%",
    padding: "11px",
    background: "rgba(239,68,68,0.12)",
    color: "#F87171",
    border: "1px solid rgba(239,68,68,0.25)",
    borderRadius: "9px",
    cursor: "pointer",
    fontSize: "13.5px",
    fontWeight: "600",
    transition: "background 0.15s ease",
  },

  main: {
    flex: 1,
    minHeight: "100vh",
    overflow: "auto",
  },
};