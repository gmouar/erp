import React, { useState } from 'react';
import { useAuth } from '../../../hooks/useAuth';

const GoalManagement = () => {
  const { user } = useAuth();
  const [goals, setGoals] = useState([]);
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    category: 'professional',
    startDate: '',
    endDate: '',
    status: 'pending',
    milestones: [],
    alignedWith: ''
  });
  const [newMilestone, setNewMilestone] = useState('');

  const handleAddMilestone = () => {
    if (newMilestone.trim()) {
      setNewGoal({
        ...newGoal,
        milestones: [...newGoal.milestones, { text: newMilestone, completed: false }]
      });
      setNewMilestone('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setGoals([...goals, { ...newGoal, id: Date.now() }]);
    setNewGoal({
      title: '',
      description: '',
      category: 'professional',
      startDate: '',
      endDate: '',
      status: 'pending',
      milestones: [],
      alignedWith: ''
    });
  };

  return (
    <div className="goal-management">
      <h3>Goal Management</h3>
      
      <form onSubmit={handleSubmit} className="goal-form">
        <div className="form-group">
          <label>Goal Title:</label>
          <input
            type="text"
            value={newGoal.title}
            onChange={(e) => setNewGoal({...newGoal, title: e.target.value})}
            required
          />
        </div>

        <div className="form-group">
          <label>Description:</label>
          <textarea
            value={newGoal.description}
            onChange={(e) => setNewGoal({...newGoal, description: e.target.value})}
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Start Date:</label>
            <input
              type="date"
              value={newGoal.startDate}
              onChange={(e) => setNewGoal({...newGoal, startDate: e.target.value})}
              required
            />
          </div>

          <div className="form-group">
            <label>End Date:</label>
            <input
              type="date"
              value={newGoal.endDate}
              onChange={(e) => setNewGoal({...newGoal, endDate: e.target.value})}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label>Category:</label>
          <select
            value={newGoal.category}
            onChange={(e) => setNewGoal({...newGoal, category: e.target.value})}
          >
            <option value="professional">Professional Development</option>
            <option value="performance">Performance</option>
            <option value="project">Project-based</option>
            <option value="behavioral">Behavioral</option>
          </select>
        </div>

        <div className="milestone-section">
          <label>Milestones:</label>
          <div className="milestone-input">
            <input
              type="text"
              value={newMilestone}
              onChange={(e) => setNewMilestone(e.target.value)}
              placeholder="Add a milestone"
            />
            <button type="button" onClick={handleAddMilestone}>Add</button>
          </div>
          <ul className="milestone-list">
            {newGoal.milestones.map((milestone, index) => (
              <li key={index}>{milestone.text}</li>
            ))}
          </ul>
        </div>

        <button type="submit" className="submit-button">Create Goal</button>
      </form>

      <div className="goals-list">
        <h4>Current Goals</h4>
        {goals.map(goal => (
          <div key={goal.id} className="goal-item">
            <h5>{goal.title}</h5>
            <p>{goal.description}</p>
            <div className="goal-details">
              <span>Status: {goal.status}</span>
              <span>Category: {goal.category}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GoalManagement;
