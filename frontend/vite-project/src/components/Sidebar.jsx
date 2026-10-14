import {
  FaHome,
  FaPlusCircle,
  FaClipboardList,
  FaUser,
  FaSignOutAlt,
} from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="sidebar">
      <div className="logo">
        <h3>SMART</h3>
        <p>COMPLAINT SYSTEM</p>
      </div>

      <Link to="/student" className="menu">
        <FaHome /> Home
      </Link>

      <Link to="/add-complaint" className="menu">
        <FaPlusCircle /> Add Complaint
      </Link>

      <Link to="/my-complaints" className="menu">
        <FaClipboardList /> My Complaints
      </Link>

      <Link to="/profile" className="menu">
        <FaUser /> Profile
      </Link>

      <Link to="/" className="menu">
        <FaSignOutAlt /> Logout
      </Link>
    </div>
  );
}