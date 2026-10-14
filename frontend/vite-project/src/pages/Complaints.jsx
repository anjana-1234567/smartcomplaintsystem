import { useEffect, useState } from "react";

export default function Complaints() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const complaints =
      JSON.parse(localStorage.getItem("complaints")) || [];
    setData(complaints);
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>All Complaints</h2>

      {data.length === 0 ? (
        <p>No complaints yet.</p>
      ) : (
        data.map((c) => (
          <div
            key={c.id}
            style={{
              border: "1px solid #ccc",
              padding: "15px",
              marginBottom: "15px",
              borderRadius: "10px",
            }}
          >
            <h3>{c.name}</h3>
            <p>{c.complaint}</p>
            <p>Status: {c.status}</p>
          </div>
        ))
      )}
    </div>
  );
}