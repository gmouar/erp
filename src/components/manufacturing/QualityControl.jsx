import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { checkPermission } from '../../utils/roleUtils';
import './Manufacturing.css';

const QualityControl = () => {
  const { user } = useAuth();
  const [inspections, setInspections] = useState([]);
  const [newInspection, setNewInspection] = useState({
    productId: '',
    batchNumber: '',
    inspectionType: 'routine',
    parameters: [],
    result: 'pending'
  });

  const handleInspectionSubmit = async (e) => {
    e.preventDefault();
    if (!checkPermission(user.role, 'quality.approve')) {
      alert('Insufficient permissions');
      return;
    }

    try {
      const response = await fetch('/api/manufacturing/quality-inspections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newInspection)
      });
      const data = await response.json();
      setInspections([...inspections, data]);
    } catch (error) {
      console.error('Error creating inspection:', error);
    }
  };

  const handleInspectionComplete = async (id, status) => {
    try {
      await fetch(`/api/manufacturing/quality-inspections/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });
      
      setInspections(inspections.map(inspection =>
        inspection.id === id ? { ...inspection, status } : inspection
      ));
    } catch (error) {
      console.error('Error updating inspection:', error);
    }
  };

  return (
    <div className="quality-control">
      <h2>Quality Control</h2>

      <form onSubmit={handleInspectionSubmit} className="inspection-form">
        <div className="form-row">
          <div className="form-group"></div>
            <label>Product ID</label>
            <input
              type="text"
              value={newInspection.productId}
              onChange={(e) => setNewInspection({
                ...newInspection,
                productId: e.target.value
              })}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Batch Number</label>
            <input
              type="text"
              value={newInspection.batchNumber}
              onChange={(e) => setNewInspection({
                ...newInspection,
                batchNumber: e.target.value
              })}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label>Inspection Type</label>
          <select
            value={newInspection.inspectionType}
            onChange={(e) => setNewInspection({
              ...newInspection,
              inspectionType: e.target.value
            })}
          >
            <option value="routine">Routine</option>
            <option value="detailed">Detailed</option>
            <option value="final">Final</option>
          </select>
        </div>

        <div className="form-group">
          <label>Notes</label>
          <textarea
            value={newInspection.notes}
            onChange={(e) => setNewInspection({
              ...newInspection,
              notes: e.target.value
            })}
            rows={4}
          />
        </div>

        <button type="submit" className="submit-button">
          Create Inspection
        </button>
      </form>

      <div className="inspections-list">
        <h3>Recent Inspections</h3>
        {inspections.map(inspection => (
          <div key={inspection.id} className={`inspection-card status-${inspection.status}`}>
            <div className="inspection-header">
              <h4>Batch: {inspection.batchNumber}</h4>
              <span className="type-badge">{inspection.inspectionType}</span>
            </div>
            <div className="inspection-details">
              <p><strong>Product ID:</strong> {inspection.productId}</p>
              <p><strong>Status:</strong> {inspection.status}</p>
              <p>{inspection.notes}</p>
            </div>
            {inspection.status === 'pending' && (
              <div className="inspection-actions">
                <button
                  onClick={() => handleInspectionComplete(inspection.id, 'passed')}
                  className="action-button success"
                >
                  Pass
                </button>
                <button
                  onClick={() => handleInspectionComplete(inspection.id, 'failed')}
                  className="action-button danger"
                >
                  Fail
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default QualityControl;
