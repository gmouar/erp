import React, { useState } from 'react';
import { useAuth } from '../../../hooks/useAuth';

const DevelopmentPlans = () => {
  const { user } = useAuth();
  const [plans, setPlans] = useState([]);
  const [newPlan, setNewPlan] = useState({
    employeeId: '',
    skillGaps: '',
    developmentActions: [],
    timeline: '',
    resources: '',
    mentorId: '',
    status: 'planned'
  });
  const [newAction, setNewAction] = useState({
    activity: '',
    deadline: '',
    type: 'training'
  });

  const handleAddAction = () => {
    if (newAction.activity && newAction.deadline) {
      setNewPlan({
        ...newPlan,
        developmentActions: [...newPlan.developmentActions, { ...newAction, id: Date.now() }]
      });
      setNewAction({ activity: '', deadline: '', type: 'training' });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setPlans([...plans, { ...newPlan, id: Date.now() }]);
    setNewPlan({
      employeeId: '',
      skillGaps: '',
      developmentActions: [],
      timeline: '',
      resources: '',
      mentorId: '',
      status: 'planned'
    });
  };

  return (
    <div className="development-plans">
      <h3>Development Plans</h3>
      
      <form onSubmit={handleSubmit} className="plan-form">
        <div className="form-group">
          <label>Employee ID:</label>
          <input
            type="text"
            value={newPlan.employeeId}
            onChange={(e) => setNewPlan({...newPlan, employeeId: e.target.value})}
            required
          />
        </div>

        <div className="form-group">
          <label>Skill Gaps/Areas for Development:</label>
          <textarea
            value={newPlan.skillGaps}
            onChange={(e) => setNewPlan({...newPlan, skillGaps: e.target.value})}
            required
          />
        </div>

        <div className="development-actions">
          <h4>Development Actions</h4>
          <div className="action-input">
            <input
              type="text"
              placeholder="Development Activity"
              value={newAction.activity}
              onChange={(e) => setNewAction({...newAction, activity: e.target.value})}
            />
            <input
              type="date"
              value={newAction.deadline}
              onChange={(e) => setNewAction({...newAction, deadline: e.target.value})}
            />
            <select
              value={newAction.type}
              onChange={(e) => setNewAction({...newAction, type: e.target.value})}
            >
              <option value="training">Training</option>
              <option value="mentoring">Mentoring</option>
              <option value="project">Project Assignment</option>
              <option value="certification">Certification</option>
            </select>
            <button type="button" onClick={handleAddAction}>Add Action</button>
          </div>
          
          <div className="actions-list">
            {newPlan.developmentActions.map(action => (
              <div key={action.id} className="action-item">
                <span>{action.activity}</span>
                <span>{action.type}</span>
                <span>Due: {action.deadline}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label>Resources Required:</label>
          <textarea
            value={newPlan.resources}
            onChange={(e) => setNewPlan({...newPlan, resources: e.target.value})}
          />
        </div>

        <div className="form-group">
          <label>Mentor ID:</label>
          <input
            type="text"
            value={newPlan.mentorId}
            onChange={(e) => setNewPlan({...newPlan, mentorId: e.target.value})}
          />
        </div>

        <button type="submit" className="submit-button">Create Development Plan</button>
      </form>

      <div className="plans-list">
        <h4>Active Development Plans</h4>
        {plans.map(plan => (
          <div key={plan.id} className="plan-item">
            <h5>Employee ID: {plan.employeeId}</h5>
            <p>Status: {plan.status}</p>
            <p>Actions: {plan.developmentActions.length}</p>
            <button 
              onClick={() => console.log('View details:', plan.id)}
              className="view-details"
            >
              View Details
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DevelopmentPlans;
