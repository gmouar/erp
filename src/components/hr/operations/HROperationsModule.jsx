import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import EmployeeManagement from './EmployeeManagement';
import LeaveManagement from './LeaveManagement';
import AttendanceTracking from './AttendanceTracking';
import PolicyManagement from './PolicyManagement';
import { auditLogger } from '../../../services/auditLogger';

const HROperationsModule = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('employees');

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    navigate(`/hr/operations/${tab}`);
    auditLogger.log('hr_operations', `Accessed ${tab} section`);
  };

  return (
    <div className="hr-operations-module">
      <div className="module-header">
        <h2>HR Operations</h2>
        <nav className="module-nav">
          <button 
            className={`tab-button ${activeTab === 'employees' ? 'active' : ''}`}
            onClick={() => handleTabChange('employees')}
          >
            Employee Management
          </button>
          <button 
            className={`tab-button ${activeTab === 'leave' ? 'active' : ''}`}
            onClick={() => handleTabChange('leave')}
          >
            Leave Management
          </button>
          <button 
            className={`tab-button ${activeTab === 'attendance' ? 'active' : ''}`}
            onClick={() => handleTabChange('attendance')}
          >
            Attendance Tracking
          </button>
          <button 
            className={`tab-button ${activeTab === 'policies' ? 'active' : ''}`}
            onClick={() => handleTabChange('policies')}
          >
            Company Policies
          </button>
        </nav>
      </div>

      <Routes>
        <Route path="/" element={<EmployeeManagement />} />
        <Route path="/employees" element={<EmployeeManagement />} />
        <Route path="/leave" element={<LeaveManagement />} />
        <Route path="/attendance" element={<AttendanceTracking />} />
        <Route path="/policies" element={<PolicyManagement />} />
      </Routes>
    </div>
  );
};

export default HROperationsModule;
