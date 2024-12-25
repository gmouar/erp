import React, { useState } from 'react';
import { useAuth } from '../../../hooks/useAuth';

const PerformanceReviews = () => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({
    employeeId: '',
    reviewPeriod: '',
    reviewType: 'annual',
    objectives: '',
    achievements: '',
    areasForImprovement: '',
    rating: '3'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add API call to save review
    setReviews([...reviews, { ...newReview, id: Date.now() }]);
    setNewReview({
      employeeId: '',
      reviewPeriod: '',
      reviewType: 'annual',
      objectives: '',
      achievements: '',
      areasForImprovement: '',
      rating: '3'
    });
  };

  return (
    <div className="performance-reviews">
      <h3>Performance Reviews</h3>
      
      <form onSubmit={handleSubmit} className="review-form">
        <div className="form-group">
          <label>Employee ID:</label>
          <input
            type="text"
            value={newReview.employeeId}
            onChange={(e) => setNewReview({...newReview, employeeId: e.target.value})}
            required
          />
        </div>

        <div className="form-group">
          <label>Review Period:</label>
          <input
            type="month"
            value={newReview.reviewPeriod}
            onChange={(e) => setNewReview({...newReview, reviewPeriod: e.target.value})}
            required
          />
        </div>

        <div className="form-group">
          <label>Review Type:</label>
          <select
            value={newReview.reviewType}
            onChange={(e) => setNewReview({...newReview, reviewType: e.target.value})}
          >
            <option value="annual">Annual</option>
            <option value="quarterly">Quarterly</option>
            <option value="probation">Probation</option>
          </select>
        </div>

        <div className="form-group">
          <label>Objectives:</label>
          <textarea
            value={newReview.objectives}
            onChange={(e) => setNewReview({...newReview, objectives: e.target.value})}
            required
          />
        </div>

        <div className="form-group">
          <label>Achievements:</label>
          <textarea
            value={newReview.achievements}
            onChange={(e) => setNewReview({...newReview, achievements: e.target.value})}
            required
          />
        </div>

        <div className="form-group">
          <label>Areas for Improvement:</label>
          <textarea
            value={newReview.areasForImprovement}
            onChange={(e) => setNewReview({...newReview, areasForImprovement: e.target.value})}
            required
          />
        </div>

        <div className="form-group">
          <label>Rating (1-5):</label>
          <input
            type="number"
            min="1"
            max="5"
            value={newReview.rating}
            onChange={(e) => setNewReview({...newReview, rating: e.target.value})}
            required
          />
        </div>

        <button type="submit" className="submit-button">Submit Review</button>
      </form>

      <div className="reviews-list">
        <h4>Recent Reviews</h4>
        {reviews.map(review => (
          <div key={review.id} className="review-item">
            <h5>Employee ID: {review.employeeId}</h5>
            <p>Period: {review.reviewPeriod}</p>
            <p>Type: {review.reviewType}</p>
            <p>Rating: {review.rating}/5</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PerformanceReviews;
