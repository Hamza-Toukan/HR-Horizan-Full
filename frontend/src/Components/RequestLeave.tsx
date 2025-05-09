import React, { useState, useEffect } from "react";
import "../style/RequestLeave.css";

interface LeaveRequest {
  id: number;
  reason: string;
  startDate: string;
  endDate: string;
}

const RequestLeave: React.FC = () => {
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [reason, setReason] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [error, setError] = useState("");
  useEffect(() => {
    const fetchLeaveRequests = async () => {
      try {
        const response = await fetch("https://localhost:5122/api/LeaveRequest/my-requests", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setLeaveRequests(data);
        } else {
          console.error("Failed to fetch leave requests");
        }
      } catch (error) {
        console.error("Error fetching leave requests:", error);
      }
    };

    fetchLeaveRequests();
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
  
    const requestData = {
      reason,
      startDate,
      endDate,
    };
  
    try {
      const response = await fetch("https://localhost:5122/api/LeaveRequest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(requestData),
      });
  
      if (response.ok) {
        alert("Leave request submitted successfully");
        const updatedRequestsResponse = await fetch("https://localhost:5122/api/LeaveRequest/my-requests", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (updatedRequestsResponse.ok) {
          const data = await updatedRequestsResponse.json();
          setLeaveRequests(data);
        }
        setReason("");
        setStartDate("");
        setEndDate("");
      } else {
        alert("Failed to submit leave request");
      }
    } catch (error) {
      console.error("Error submitting request:", error);
      alert("Something went wrong.");
    }
  };
  

  return (
    <div className="container">
      <div className="card">
        <h1 className="title">Request Leave/Vacation</h1>
        <form className="form" onSubmit={handleSubmit}>
          <label className="label">Reason</label>
          <textarea
            className="input"
            placeholder="Enter reason for leave"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          ></textarea>

          <label className="label">Start Date</label>
          <input
            type="date"
            className="input"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />

          <label className="label">End Date</label>
          <input
            type="date"
            className="input"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />

          {error && <p className="error">{error}</p>}

          <button type="submit" className="button">
            Submit Request
          </button>
        </form>

        <h2 className="subtitle">Previous Leave Requests</h2>
        <ul className="request-list">
          {leaveRequests.map((request) => (
            <li key={request.id} className="request-item">
              <strong>{request.reason}</strong> — {request.startDate} to {request.endDate}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default RequestLeave;

