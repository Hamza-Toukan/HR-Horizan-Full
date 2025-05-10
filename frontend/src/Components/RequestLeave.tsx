import React, { useState, useEffect } from "react";
import "../style/RequestLeave.css";

interface LeaveRequest {
  id: number;
  reason: string;
  startDate: string;
  endDate: string;
  employeeId: string;
}

const RequestLeave: React.FC = () => {
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [reason, setReason] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [error, setError] = useState("");
  const [userId, setUserId] = useState<string | null>(null); // إضافة حالة لتخزين userId

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const response = await fetch("http://localhost:5122/api/auth/verify-token", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          setUserId(data.userId)
        } else {
          console.error("❌ Failed to verify token:", response.status);
        }
      } catch (error) {
        console.error("❌ Error fetching user ID:", error);
      }
    };

    fetchUserId();
  }, []);

  useEffect(() => {
    const fetchLeaveRequests = async () => {
      try {
        const response = await fetch("http://localhost:5122/api/LeaveRequest/my-requests", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          setLeaveRequests(data);
        } else {
          console.error("❌ Failed to fetch leave requests:", response.status);
        }
      } catch (error) {
        console.error("❌ Error fetching leave requests:", error);
      }
    };

    fetchLeaveRequests();
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!userId) {
      setError("User is not authenticated.");
      return;
    }

    const requestData = {
      reason,
      startDate,
      endDate,
      employeeId: userId,
    };

    try {
      const response = await fetch("http://localhost:5122/api/LeaveRequest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(requestData),
      });

      if (response.ok) {
        alert("✅ Leave request submitted successfully");

        const updatedRequestsResponse = await fetch("http://localhost:5122/api/LeaveRequest/my-requests", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (updatedRequestsResponse.ok) {
          const data = await updatedRequestsResponse.json();
          setLeaveRequests(data);
        }

    
        setReason("");
        setStartDate("");
        setEndDate("");
        setError("");
      } else {
        const errText = await response.text();
        console.error("❌ Failed to submit leave request:", response.status, errText);
        setError("Failed to submit leave request. Please try again.");
      }
    } catch (error) {
      console.error("❌ Exception while submitting leave request:", error);
      setError("Something went wrong. Please try again.");
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
          <br />
          <span>Employee ID: {request.employeeId}</span> 
        </li>
      ))}
    </ul>

      </div>
    </div>
  );
};

export default RequestLeave;
