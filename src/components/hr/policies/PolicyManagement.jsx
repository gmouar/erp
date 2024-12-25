import React, { useState } from 'react';
import { useAuth } from '../../../hooks/useAuth';

const PolicyManagement = () => {
  const { user } = useAuth();
  const [policies, setPolicies] = useState([]);
  const [newPolicy, setNewPolicy] = useState({
    title: '',
    category: 'general',
    content: '',
    effectiveDate: '',
    version: '1.0'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const policyWithMetadata = {
      ...newPolicy,
      id: Date.now(),
      createdBy: user.id,
      createdAt: new Date().toISOString(),
      status: 'active'
    };

    setPolicies(prev => [...prev, policyWithMetadata]);
    setNewPolicy({
      title: '',
      category: 'general',
      content: '',
      effectiveDate: '',
      version: '1.0'
    });
  };

  return (
    <div className="policy-management"></div>
      <h3>Policy Management</h3>

      <form onSubmit={handleSubmit} className="policy-form"></form>
        <div className="form-group">
          <label>Policy Title</label>
          <input
            type="text"
            value={newPolicy.title}
            onChange={(e) => setNewPolicy({...newPolicy, title: e.target.value})}
            required
          />
        </div>

        <div className="form-group">
          <label>Category</label>
          <select
            value={newPolicy.category}
            onChange={(e) => setNewPolicy({...newPolicy, category: e.target.value})}
          >
            <option value="general">General</option>
            <option value="leave">Leave</option>
            <option value="conduct">Code of Conduct</option>
            <option value="benefits">Benefits</option>
            <option value="safety">Safety</option>
          </select>
        </div>

        <div className="form-group"></div>
          <label>Policy Content</label>
          <textarea
            value={newPolicy.content}
            onChange={(e) => setNewPolicy({...newPolicy, content: e.target.value})}
            required
            rows={10}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Effective Date</label>
            <input
              type="date"
              value={newPolicy.effectiveDate}
              onChange={(e) => setNewPolicy({...newPolicy, effectiveDate: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label>Version</label>
            <input
              type="text"
              value={newPolicy.version}
              onChange={(e) => setNewPolicy({...newPolicy, version: e.target.value})}
              required
            />
          </div>
        </div>

        <button type="submit" className="submit-button">Publish Policy</button>
      </form>

      <div className="policies-list"></div>
        <h4>Active Policies</h4>
        {policies.map(policy => (
          <div key={policy.id} className="policy-card">
            <h5>{policy.title}</h5>
            <div className="policy-meta">
              <span>Category: {policy.category}</span>
              <span>Version: {policy.version}</span>
              <span>Effective: {policy.effectiveDate}</span>
            </div>
            <p className="policy-preview">{policy.content.substring(0, 200)}...</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PolicyManagement;
