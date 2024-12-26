import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import HRDashboard from '../components/hr/HRDashboard';
import EmployeeManagement from '../components/hr/employees/EmployeeManagement';
import RecruitmentManagement from '../components/hr/recruitment/RecruitmentManagement';
import AttendanceManagement from '../components/hr/attendance/AttendanceManagement';
import LeaveManagement from '../components/hr/leave/LeaveManagement';
import PayrollManagement from '../components/hr/payroll/PayrollManagement';
import PerformanceManagement from '../components/hr/performance/PerformanceManagement';
import PolicyManagement from '../components/hr/policies/PolicyManagement';

const HRRoutes = () => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || user?.role !== 'HR') {
    return <Navigate to="/login" replace />;
  }

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/hr/dashboard" replace />} />
      <Route path="dashboard" element={<HRDashboard />} />
      
      {/* Employee Management Routes */}
      <Route path="employees" element={<EmployeeManagement />} />
      <Route path="employees/new" element={<EmployeeManagement mode="create" />} />
      <Route path="employees/:id" element={<EmployeeManagement mode="view" />} />
      <Route path="employees/:id/edit" element={<EmployeeManagement mode="edit" />} />
      
      {/* Recruitment Routes */}
      <Route path="recruitment/*" element={<RecruitmentManagement />} />
      <Route path="recruitment/jobs/*" element={<RecruitmentManagement type="jobs" />} />
      <Route path="recruitment/candidates/*" element={<RecruitmentManagement type="candidates" />} />
      
      {/* Leave & Attendance Routes */}
      <Route path="leave/*" element={<LeaveManagement />} />
      <Route path="attendance/*" element={<AttendanceManagement />} />
      
      {/* Payroll Routes */}
      <Route path="payroll/*" element={<PayrollManagement />} />
      
      {/* Performance Routes */}
      <Route path="performance/*" element={<PerformanceManagement />} />
      
      {/* Policy Routes */}
      <Route path="policies/*" element={<PolicyManagement />} />
    </Routes>
  );
};

export default HRRoutes;
