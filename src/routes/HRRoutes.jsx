import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import HRDashboard from '../components/dashboards/HRDashboard';
import EmployeeManagement from '../components/hr/employees/EmployeeManagement';
import RecruitmentModule from '../components/hr/recruitment/RecruitmentModule';
import AttendanceManagement from '../components/hr/attendance/AttendanceManagement';
import LeaveManagement from '../components/hr/leave/LeaveManagement';
import PayrollManagement from '../components/hr/payroll/PayrollManagement';
import PerformanceReviews from '../components/hr/performance/PerformanceReviews';

const HRRoutes = () => {
  const { user, isAuthenticated } = useAuth();

  // Check if user has HR access
  const hasAccess = () => {
    if (!isAuthenticated || !user) return false;
    return ['HR', 'Superuser'].includes(user.role);
  };

  if (!hasAccess()) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <Routes>
      {/* HR Dashboard */}
      <Route path="/" element={<HRDashboard />} />

      {/* Employee Management */}
      <Route path="/employees/*" element={<EmployeeManagement />} />

      {/* Recruitment */}
      <Route path="/recruitment/*" element={<RecruitmentModule />} />

      {/* Attendance */}
      <Route path="/attendance/*" element={<AttendanceManagement />} />

      {/* Leave Management */}
      <Route path="/leave/*" element={<LeaveManagement />} />

      {/* Payroll */}
      <Route path="/payroll/*" element={<PayrollManagement />} />

      {/* Performance Reviews */}
      <Route path="/performance/*" element={<PerformanceReviews />} />

      {/* Redirect any unmatched routes to HR Dashboard */}
      <Route path="*" element={<Navigate to="/hr" replace />} />
    </Routes>
  );
};

export default HRRoutes;
