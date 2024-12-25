import React, { useState } from 'react';

const KPITracker = () => {
  const [kpis, setKpis] = useState([]);
  const [newKPI, setNewKPI] = useState({
    metric: '',
    target: '',
    current: '',
    unit: '',
    period: '',
    department: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setKpis([...kpis, { ...newKPI, id: Date.now(), progress: (newKPI.current / newKPI.target) * 100 }]);
    setNewKPI({
      metric: '',
      target: '',
      current: '',
      unit: '',
      period: '',
      department: ''
    });
  };

  return (
    <div className="kpi-tracker">
      <h3>KPI Tracking</h3>

      <form onSubmit={handleSubmit} className="kpi-form">
        <div className="form-group">
          <label>Metric Name:</label>
          <input
            type="text"
            value={newKPI.metric}
            onChange={(e) => setNewKPI({...newKPI, metric: e.target.value})}
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Target Value:</label>
            <input
              type="number"
              value={newKPI.target}
              onChange={(e) => setNewKPI({...newKPI, target: e.target.value})}
              required
            />
          </div>

          <div className="form-group">
            <label>Current Value:</label>
            <input
              type="number"
              value={newKPI.current}
              onChange={(e) => setNewKPI({...newKPI, current: e.target.value})}
              required
            />
          </div>

          <div className="form-group">
            <label>Unit:</label>
            <input
              type="text"
              value={newKPI.unit}
              onChange={(e) => setNewKPI({...newKPI, unit: e.target.value})}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label>Period:</label>
          <select
            value={newKPI.period}
            onChange={(e) => setNewKPI({...newKPI, period: e.target.value})}
            required
          >
            <option value="">Select Period</option>
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
            <option value="annual">Annual</option>
          </select>
        </div>

        <div className="form-group">
          <label>Department:</label>
          <input
            type="text"
            value={newKPI.department}
            onChange={(e) => setNewKPI({...newKPI, department: e.target.value})}
            required
          />
        </div>

        <button type="submit" className="submit-button">Add KPI</button>
      </form>

      <div className="kpi-list">
        <h4>Current KPIs</h4>
        {kpis.map(kpi => (
          <div key={kpi.id} className="kpi-item">
            <h5>{kpi.metric}</h5>
            <div className="progress-bar">
              <div 
                className="progress" 
                style={{ width: `${kpi.progress}%` }}
              />
            </div>
            <p>
              Progress: {kpi.current}/{kpi.target} {kpi.unit}
              ({kpi.progress.toFixed(1)}%)
            </p>
            <p>Period: {kpi.period}</p>
            <p>Department: {kpi.department}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KPITracker;
