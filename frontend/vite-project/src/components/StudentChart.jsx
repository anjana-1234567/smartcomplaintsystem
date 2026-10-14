import DashboardLayout from "../layouts/DashboardLayout";
import StudentChart from "../components/StudentChart";
import { useEffect, useState } from "react";
import axios from "axios";

export default function StudentChartPage() {
  const [complaints, setComplaints] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    axios.get("http://localhost:5000/api").then((res) => {
      setComplaints(res.data);
    });
  }, []);

  const myComplaints = complaints.filter(
    (c) => c.name === user?.username
  );

  return (
    <DashboardLayout>
      <h2>My Complaint Analytics</h2>

      <StudentChart complaints={myComplaints} />
    </DashboardLayout>
  );
}