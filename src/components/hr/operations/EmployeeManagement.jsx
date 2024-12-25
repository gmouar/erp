import React, { useState } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { auditLogger } from '../../../services/auditLogger';

const EmployeeManagement = () => {
  const { user } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [newEmployee, setNewEmployee] = useState({
    firstName: '',
    lastName: '',
    email: '',
    department: '',
    position: '',
    startDate: '',
    employmentType: 'full-time',
    status: 'active',
    reportingTo: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Add API integration here
      const employeeWithId = { ...newEmployee, id: Date.now() };
      setEmployees([...employees, employeeWithId]);
      auditLogger.logHRAction('employee_added', {
        employeeId: employeeWithId.id,
        addedBy: user.id
      });
      
      setNewEmployee({
        firstName: '',
        lastName: '',
        email: '',
        department: '',
        position: '',
        startDate: '',
        employmentType: 'full-time',
        status: 'active',
        reportingTo: ''
      });
    } catch (error) {
      console.error('Failed to add employee:', error);
    }
  };

  return (
    <div className="employee-management">
      <div className="section-header">
        <h3>Employee Management</h3>
        <button className="add-button" onClick={() => document.getElementById('employeeForm').scrollIntoView()}>
          Add New Employee
        </button>
      </div>

      <div className="employees-grid"></div>
        {employees.map(emp => (
          <div key={emp.id} className="employee-card">
            <div className="card-header">
              <h4>{emp.firstName} {emp.lastName}</h4>
              <span className={`status-badge ${emp.status}`}>{emp.status}</span>
            </div>
            <div className="card-body">
              <p><strong>Position:</strong> {emp.position}</p>
              <p><strong>Department:</strong> {emp.department}</p>
              <p><strong>Email:</strong> {emp.email}</p>
              <p><strong>Type:</strong> {emp.employmentType}</p>
            </div>
            <div className="card-actions">
              <button onClick={() => console.log('Edit', emp.id)}>Edit</button>
              <button onClick={() => console.log('View Details', emp.id)}>View Details</button>
            </div>
          </div>
        ))}
      </div>

      <form id="employeeForm" onSubmit={handleSubmit} className="employee-form">
        <h4>Add New Employee</h4>
        <div className="form-row">
          <div className="form-group">
            <label>First Name</label>
            <input
              type="text"
              value={newEmployee.firstName}
              onChange={e => setNewEmployee({...newEmployee, firstName: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label>Last Name</label>
            <input
              type="text"
              value={newEmployee.lastName}
              onChange={e => setNewEmployee({...newEmployee, lastName: e.target.value})}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={newEmployee.email}
              onChange={e => setNewEmployee({...newEmployee, email: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label>Department</label>
            <input
              type="text"
              value={newEmployee.department}
              onChange={e => setNewEmployee({...newEmployee, department: e.target.value})}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Position</label>
            <input
              type="text"
              value={newEmployee.position}
              onChange={e => setNewEmployee({...newEmployee, position: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label>Start Date</label>
            <input
              type="date"
              value={newEmployee.startDate}
              onChange={e => setNewEmployee({...newEmployee, startDate: e.target.value})}
              required
            />
          </div>
        </div>

        <div className="form-row"></div>
          <div className="form-group">
            <label>Employment Type</label>
            <select
              value={newEmployee.employmentType}
              onChange={e => setNewEmployee({...newEmployee, employmentType: e.target.value})}
            >
              <option value="full-time">Full Time</option>
              <option value="part-time">Part Time</option>
              <option value="contract">Contract</option>
              <option value="temporary">Temporary</option>
            </select>
          </div>
          <div className="form-group">
            <label>Reporting To</label>
            <input
              type="text"
              value={newEmployee.reportingTo}
              onChange={e => setNewEmployee({...newEmployee, reportingTo: e.target.value})}
            />
          </div>
        </div>

        <button type="submit" className="submit-button">Add Employee</button>
      </form>
    </div>
  );
};

export default EmployeeManagement;
