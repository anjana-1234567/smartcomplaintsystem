import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";

import StudentDashboard from "./pages/StudentDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";

import AddComplaint from "./pages/AddComplaint";
import MyComplaints from "./pages/MyComplaints";
import ComplaintStatus from "./pages/ComplaintStatus";

import AllComplaints from "./pages/AllComplaints";

import StudentProfile from "./pages/StudentProfile";
import TeacherProfile from "./pages/TeacherProfile";

export default function App() {
  return (
    <Routes>

      {/* AUTH */}
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* STUDENT */}
      <Route path="/student" element={<StudentDashboard />} />
      <Route path="/add" element={<AddComplaint />} />
      <Route path="/my" element={<MyComplaints />} />
      <Route path="/complaint-status" element={<ComplaintStatus />} />
      <Route path="/student-profile" element={<StudentProfile />} />

      {/* TEACHER */}
      <Route path="/teacher" element={<TeacherDashboard />} />
      <Route path="/all-complaints" element={<AllComplaints />} />
      <Route path="/teacher-profile" element={<TeacherProfile />} />

    </Routes>
  );
}