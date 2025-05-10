import React, { useState } from "react";
import "../Style/RequestDocuments.css"; // Import CSS for styling

const RequestDocuments = () => {
  const [employeeId, setEmployeeId] = useState("");
  const [requestedDocuments, setRequestedDocuments] = useState("");
  const [message, setMessage] = useState("");

  const handleSearch = async () => {
    if (employeeId) {
      try {
        const response = await fetch(`http://localhost:5122/api/employee/search?employeeId=${employeeId}`);
        if (response.ok) {
          const employee = await response.json();
          if (employee) {
            setMessage(`Employee with ID ${employeeId} found!`);
          } else {
            setMessage("Employee not found.");
          }
        } else {
          setMessage("Error searching for employee.");
        }
      } catch (error) {
        setMessage("Error searching for employee.");
      }
    } else {
      setMessage("Please enter an Employee ID.");
    }
  };
  const handleSendRequest = async () => {
    if (employeeId && requestedDocuments) {
      try {
        //  const token = localStorage.getItem("token");
        // if (!token) {
        //   setMessage("HR not logged in. Please log in again.");
        //   return; 
        // }
        
        const response = await fetch(`http://localhost:5122/api/employee/search?employeeId=${employeeId}`);
        
        if (response.ok) {
          const employee = await response.json();
          if (employee) {
            const hrId = localStorage.getItem("hrId");
            if (!hrId) {
              setMessage("HR not logged in. Please log in again.");
              return;
            }
  
            const documentResponse = await fetch("http://localhost:5122/api/hr/request-document", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              credentials: "include", 
              body: JSON.stringify({
                employeeId,
                hrId,
                requestText: requestedDocuments,
              }),
            });
            
  
            if (documentResponse.ok) {
              setMessage(`Request sent for ${requestedDocuments} to Employee ID: ${employeeId}`);
              setRequestedDocuments(""); // Reset the document input field
            } else {
              setMessage("Error sending document request.");
            }
          } else {
            setMessage("Employee not found.");
          }
        } else {
          setMessage("Error searching for employee.");
        }
      } catch (error) {
        setMessage("Error sending request.");
      }
    } else {
      setMessage("Please fill all required fields.");
    }
  };
  

  return (
    <div className="request-documents-container">
      <h2 className="request-documents-header">Request Documents</h2>

      {/* Search Section */}
      <input
        type="text"
        className="request-documents-input"
        placeholder="Employee ID"
        value={employeeId}
        onChange={(e) => setEmployeeId(e.target.value)}
      />
      <button className="request-documents-button" onClick={handleSearch}>
        Search
      </button>

      {/* Requested Documents Section */}
      <textarea
        className="request-documents-textarea"
        placeholder="Enter requested documents here"
        value={requestedDocuments}
        onChange={(e) => setRequestedDocuments(e.target.value)}
        rows={4}
      />

      {/* Send Button */}
      <button className="request-documents-button" onClick={handleSendRequest}>
        Send Request
      </button>

      {/* Message */}
      {message && <p className="request-documents-message">{message}</p>}
    </div>
  );
};

export default RequestDocuments;
