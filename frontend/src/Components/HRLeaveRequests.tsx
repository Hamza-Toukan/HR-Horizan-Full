// HRLeaveRequests.tsx
import React, { useEffect, useState } from "react";

interface LeaveRequest {
  id: number;
  reason: string;
  startDate: string;
  endDate: string;
  status: string;
  employee: {
    name: string;
  } | null;
}

const HRLeaveRequests: React.FC = () => {
  const [requests, setRequests] = useState<LeaveRequest[]>([]);

  const fetchRequests = async () => {
    try {
      const response = await fetch("http://localhost:5122/api/LeaveRequest/all", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setRequests(data);
      } else {
        console.error("Failed to fetch leave requests");
      }
    } catch (error) {
      console.error("Error fetching leave requests", error);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const updateStatus = async (id: number, newStatus: "Approved" | "Rejected") => {
    try {
      const response = await fetch(`http://localhost:5122/api/LeaveRequest/update-status/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(newStatus),
      });

      if (response.ok) {
        alert(`Leave request ${newStatus.toLowerCase()}`);
        fetchRequests(); // refresh
      } else {
        console.error("Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status", error);
    }
  };

  return (
    <div className="container">
      <h1>Leave Requests</h1>
      <table>
        <thead>
          <tr>
            <th>Employee</th>
            <th>Reason</th>
            <th>From</th>
            <th>To</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((req) => (
            <tr key={req.id}>
            <td>{req.employee?.name ?? "Unknown"}</td>
            <td>{req.reason}</td>
            <td>{req.startDate}</td>
            <td>{req.endDate}</td>
            <td>{req.status}</td>
            <td>
                {req.status === "Pending" && (
                  <>
                    <button onClick={() => updateStatus(req.id, "Approved")}>Approve</button>
                    <button onClick={() => updateStatus(req.id, "Rejected")}>Reject</button>
                  </>
                )}
                {req.status !== "Pending" && <span>—</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default HRLeaveRequests;
