import React, { useState } from 'react';
import { useAuth } from '../../../hooks/useAuth';

const FeedbackSystem = () => {
  const { user } = useAuth();
  const [feedback, setFeedback] = useState({
    employeeId: '',
    category: 'peer',
    competencies: {
      leadership: '',
      teamwork: '',
      communication: '',
      technical: '',
      initiative: ''
    },
    strengthsComment: '',
    improvementComment: '',
    rating: 3
  });

  const competencyLabels = {
    leadership: 'Leadership Skills',
    teamwork: 'Teamwork & Collaboration',
    communication: 'Communication',
    technical: 'Technical Skills',
    initiative: 'Initiative & Innovation'
  };

  const handleCompetencyChange = (competency, value) => {
    setFeedback(prev => ({
      ...prev,
      competencies: {
        ...prev.competencies,
        [competency]: value
      }
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: API integration
    console.log('Submitting feedback:', feedback);
  };

  return (
    <div className="feedback-system">
      <h3>360° Feedback</h3>
      <form onSubmit={handleSubmit} className="feedback-form">
        <div className="form-group">
          <label>Employee ID:</label>
          <input
            type="text"
            value={feedback.employeeId}
            onChange={(e) => setFeedback({...feedback, employeeId: e.target.value})}
            required
          />
        </div>

        <div className="form-group">
          <label>Feedback Category:</label>
          <select
            value={feedback.category}
            onChange={(e) => setFeedback({...feedback, category: e.target.value})}
          >
            <option value="peer">Peer Review</option>
            <option value="subordinate">Subordinate Review</option>
            <option value="superior">Superior Review</option>
          </select>
        </div>

        <div className="competencies-section">
          <h4>Competency Assessment</h4>
          {Object.entries(competencyLabels).map(([key, label]) => (
            <div key={key} className="competency-group">
              <label>{label}:</label>
              <div className="rating-buttons">
                {[1, 2, 3, 4, 5].map(rating => (
                  <button
                    key={rating}
                    type="button"
                    className={feedback.competencies[key] === rating ? 'active' : ''}
                    onClick={() => handleCompetencyChange(key, rating)}
                  >
                    {rating}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="form-group">
          <label>Key Strengths:</label>
          <textarea
            value={feedback.strengthsComment}
            onChange={(e) => setFeedback({...feedback, strengthsComment: e.target.value})}
            required
          />
        </div>

        <div className="form-group">
          <label>Areas for Improvement:</label>
          <textarea
            value={feedback.improvementComment}
            onChange={(e) => setFeedback({...feedback, improvementComment: e.target.value})}
            required
          />
        </div>

        <button type="submit" className="submit-button">Submit Feedback</button>
      </form>
    </div>
  );
};

export default FeedbackSystem;
