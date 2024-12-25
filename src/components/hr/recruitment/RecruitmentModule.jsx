import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import JobPostings from './JobPostings';
import CandidateList from './CandidateList';
import InterviewScheduler from './InterviewScheduler';
import { auditLogger } from '../../../services/auditLogger';

const RecruitmentModule = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('postings');

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    navigate(`/hr/recruitment/${tab}`);
  };

  return (
    <div className="recruitment-module">
      <div className="module-header">
        <h2>Recruitment Management</h2>
        <nav className="module-nav">
          <button 
            className={`tab-button ${activeTab === 'postings' ? 'active' : ''}`}
            onClick={() => handleTabChange('postings')}
          >
            Job Postings
          </button>
          <button 
            className={`tab-button ${activeTab === 'candidates' ? 'active' : ''}`}
            onClick={() => handleTabChange('candidates')}
          >
            Candidates
          </button>
          <button 
            className={`tab-button ${activeTab === 'interviews' ? 'active' : ''}`}
            onClick={() => handleTabChange('interviews')}
          >
            Interviews
          </button>
        </nav>
      </div>

      <Routes>
        <Route path="/" element={<JobPostings />} />
        <Route path="/postings" element={<JobPostings />} />
        <Route path="/candidates" element={<CandidateList />} />
        <Route path="/interviews" element={<InterviewScheduler />} />
      </Routes>
    </div>
  );
};

export default RecruitmentModule;
