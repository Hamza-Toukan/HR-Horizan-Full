import React, { useEffect, useState } from "react";

const Dashboard: React.FC = () => {
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/auth/verify-token", {
      method: "GET",
      credentials: "include",
    })
      .then(async (res) => {
        const data = await res.json();
        if (res.ok) {
          setMessage(data.message);
        } else {
          setMessage(data.message || "Unauthorized");
        }
      })
      .catch((err) => {
        console.error("Error verifying token", err);
        setMessage("Something went wrong");
      });
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>
      <p>{message}</p>
    </div>
  );
};

export default Dashboard;
