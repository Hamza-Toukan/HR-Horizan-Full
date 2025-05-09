import React, { useState } from "react";
import "../Style/AddEmployee.css"; // Updated CSS file name
import axios from "axios";


interface Employee {
  id: string;
  fullName: string;
  position: string;
  email: string;
  phone: string;
  password: string;
  companyId?: number;
}

const AddModifyEmployee: React.FC = () => {
  const [isAdding, setIsAdding] = useState<boolean>(true); // Toggle between add and modify
  const [employeeData, setEmployeeData] = useState<Employee>({
    id: "",
    fullName: "",
    position: "",
    email: "",
    phone: "",
    password: "",
  });
  const [message, setMessage] = useState<string>("");

  const generateId = (): string => `EMP-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
  const generatePassword = (): string => Math.random().toString(36).substring(2, 10);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setEmployeeData({ ...employeeData, [name]: value });
  };


  const handleAddEmployee = async (): Promise<void> => {
    if (
      employeeData.fullName &&
      employeeData.position &&
      employeeData.email &&
      employeeData.phone
    ) {
      const newId = generateId();
      const newPassword = generatePassword(); 
      const companyId = localStorage.getItem("companyId");
      const newEmployee = {
        name: employeeData.fullName,
        email: employeeData.email,
        role: employeeData.position,
        employeeIdentifier: newId,
        password: newPassword,
        companyId: companyId ? parseInt(companyId) : undefined,
      };
  
      try {
        const response = await axios.post("http://localhost:5122/api/employee", newEmployee);
  
        if (response.status === 200 || response.status === 201) {
          setMessage(
            `Employee added successfully! ID: ${newId}, Password: ${newPassword}`
          );
        }
  
        setEmployeeData({
          id: "",
          fullName: "",
          position: "",
          email: "",
          phone: "",
          password: "",
        });
      } catch (error: any) {
        if (error.response) {
          console.error("Server Error:", error.response.data);
          setMessage(`Server error: ${JSON.stringify(error.response.data)}`);
        } else if (error.request) {
          console.error("No response from server:", error.request);
          setMessage("No response from the server. Please check if the API is running.");
        } else {
          console.error("Error", error.message);
          setMessage(`Error: ${error.message}`);
        }
      }
      
    } else {
      setMessage("Please fill in all fields.");
    }
  };

  
  
  
  const handleDeleteEmployee = async (): Promise<void> => {
    if (!employeeData.id) {
      setMessage("Please enter a valid employee ID.");
      return;
    }
  
    const confirmDelete = window.confirm("Are you sure you want to delete this employee?");
    if (!confirmDelete) return;
  
    try {
      const response = await axios.delete(`http://localhost:5122/api/employee/${employeeData.id}`);
      if (response.status === 200 || response.status === 204) {
        setMessage(`Employee with ID: ${employeeData.id} deleted successfully!`);
      } else {
        setMessage("Failed to delete employee. Please check the ID.");
      }
    } catch (error: any) {
      console.error("Error during deletion:", error);
      setMessage("Error deleting employee. Please try again.");
    }
  
    setEmployeeData({ id: "", fullName: "", position: "", email: "", phone: "", password: "" });
  };
  

  const toggleMode = (): void => {
    setIsAdding(!isAdding);
    setEmployeeData({ id: "", fullName: "", position: "", email: "", phone: "", password: "" });
    setMessage("");
  };

  return (
    <div className="employee-form-container">
      {/* <h2 className="employee-form-header">{isAdding ? "Add Employee" : "Modify Employee"}</h2>
      <button className="employee-form-toggle" onClick={toggleMode}>
        Switch to {isAdding ? "Modify" : "Add"} Employee
      </button> */}
      <h2 className="employee-form-header">{isAdding ? "Add Employee" : "Delete Employee"}</h2>
      <button className="employee-form-toggle" onClick={toggleMode}>
      Switch to {isAdding ? "Delete" : "Add"} Employee
      </button>
      <div className="employee-form">
        {!isAdding && (
          <div className="employee-form-group">
            <label htmlFor="id">Employee ID</label>
            <input
              type="text"
              id="id"
              name="id"
              placeholder="Enter Employee ID"
              value={employeeData.id}
              onChange={handleInputChange}
            />
          </div>
        )}
        {isAdding && (
          <>
            <div className="employee-form-group">
              <label htmlFor="fullName">Full Name</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                placeholder="Enter Full Name"
                value={employeeData.fullName}
                onChange={handleInputChange}
              />
            </div>

            <div className="employee-form-group">
              <label htmlFor="position">Position</label>
              <input
                type="text"
                id="position"
                name="position"
                placeholder="Enter Position"
                value={employeeData.position}
                onChange={handleInputChange}
              />
            </div>

            <div className="employee-form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter Email"
                value={employeeData.email}
                onChange={handleInputChange}
              />
            </div>

            <div className="employee-form-group">
              <label htmlFor="phone">Phone Number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                placeholder="Enter Phone Number"
                value={employeeData.phone}
                onChange={handleInputChange}
              />
            </div>
          </>
        )}

        <button
            className="employee-form-submit"
            onClick={isAdding ? handleAddEmployee : handleDeleteEmployee}
        >
  {isAdding ? "Add Employee" : "Delete Employee"}
</button>

      </div>

      {message && <div className="employee-form-message">{message}</div>}
    </div>
  );
};

export default AddModifyEmployee;

