import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import PerformanceReviews from './PerformanceReviews';
import KPITracker from './KPITracker';
import FeedbackSystem from './FeedbackSystem';
import GoalManagement from './GoalManagement';
import DevelopmentPlans from './DevelopmentPlans';
import { auditLogger } from '../../../services/auditLogger';

const PerformanceModule = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('reviews');

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    navigate(`/hr/performance/${tab}`);
    auditLogger.log('performance_module', `Accessed ${tab} section`);
  };

  return (
    <div className="performance-module">
      <div className="module-header">
        <h2>Performance Management</h2>
        <nav className="module-nav">
          <button 
            className={`tab-button ${activeTab === 'reviews' ? 'active' : ''}`}
            onClick={() => handleTabChange('reviews')}
          >
            Performance Reviews
          </button>
          <button 
            className={`tab-button ${activeTab === 'kpi' ? 'active' : ''}`}
            onClick={() => handleTabChange('kpi')}
          >
            KPI Tracking
          </button>
          <button 
            className={`tab-button ${activeTab === 'feedback' ? 'active' : ''}`}
            onClick={() => handleTabChange('feedback')}
          >
            360° Feedback
          </button>
          <button 
            className={`tab-button ${activeTab === 'goals' ? 'active' : ''}`}
            onClick={() => handleTabChange('goals')}
          >
            Goals
          </button>
          <button 
            className={`tab-button ${activeTab === 'development' ? 'active' : ''}`}
            onClick={() => handleTabChange('development')}
          >
            Development Plans
          </button>
        </nav>
      </div>

      <Routes>
        <Route path="/" element={<PerformanceReviews />} />
        <Route path="/reviews" element={<PerformanceReviews />} />
        <Route path="/kpi" element={<KPITracker />} />
        <Route path="/feedback" element={<FeedbackSystem />} />
        <Route path="/goals" element={<GoalManagement />} />
        <Route path="/development" element={<DevelopmentPlans />} />
      </Routes>
    </div>
  );
};

export default PerformanceModule;
