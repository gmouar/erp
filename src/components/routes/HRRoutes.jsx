import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HRDashboard from '../dashboards/HRDashboard';
import RecruitmentModule from '../hr/recruitment/RecruitmentModule';
import OnboardingModule from '../hr/onboarding/OnboardingModule';
import EmployeeManagement from '../hr/employees/EmployeeManagement';
import AttendanceModule from '../hr/attendance/AttendanceModule';
import LeaveModule from '../hr/leave/LeaveModule';
import PayrollModule from '../hr/payroll/PayrollModule';
import PerformanceModule from '../hr/performance/PerformanceModule';
import TrainingModule from '../hr/training/TrainingModule';
import EngagementModule from '../hr/engagement/EngagementModule';

const HRRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HRDashboard />} />
      <Route path="/recruitment/*" element={<RecruitmentModule />} />
      <Route path="/onboarding/*" element={<OnboardingModule />} />
      <Route path="/employees/*" element={<EmployeeManagement />} />
      <Route path="/attendance/*" element={<AttendanceModule />} />
      <Route path="/leave/*" element={<LeaveModule />} />
      <Route path="/payroll/*" element={<PayrollModule />} />
      <Route path="/performance/*" element={<PerformanceModule />} />
      <Route path="/training/*" element={<TrainingModule />} />
      <Route path="/engagement/*" element={<EngagementModule />} />
    </Routes>
  );
};

export default HRRoutes;
