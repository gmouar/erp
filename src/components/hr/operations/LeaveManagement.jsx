import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { auditLogger } from '../../../services/auditLogger';

const LeaveManagement = () => {
  const { user } = useAuth();
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [newRequest, setNewRequest] = useState({
    employeeId: '',
    leaveType: 'annual',
    startDate: '',
    endDate: '',
    reason: '',
    status: 'pending',
    documents: []
  });

  const calculateDays = (start, end) => {
    const diff = new Date(end) - new Date(start);
    return Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const requestWithDetails = {
      ...newRequest,
      id: Date.now(),
      requestDate: new Date().toISOString(),
      numberOfDays: calculateDays(newRequest.startDate, newRequest.endDate),
      requestedBy: user.id
    };

    try {
      // TODO: API integration
      setLeaveRequests([...leaveRequests, requestWithDetails]);
      auditLogger.log('leave_request_created', requestWithDetails);
      
      setNewRequest({
        employeeId: '',
        leaveType: 'annual',
        startDate: '',
        endDate: '',
        reason: '',
        status: 'pending',
        documents: []
      });
    } catch (error) {
      console.error('Failed to submit leave request:', error);
    }
  };

  const handleStatusChange = (requestId, newStatus) => {
    setLeaveRequests(prevRequests =>
      prevRequests.map(request =>
        request.id === requestId
          ? { ...request, status: newStatus }
          : request
      )
    );
    auditLogger.log('leave_request_updated', { requestId, status: newStatus, updatedBy: user.id });
  };

  return (
    <div className="leave-management">
      <div className="leave-dashboard">
        <h3>Leave Management</h3>
        
        <div className="status-summary">
          <div className="status-card pending">
            <h4>Pending</h4>
            <span>{leaveRequests.filter(r => r.status === 'pending').length}</span>
          </div>
          <div className="status-card approved">
            <h4>Approved</h4>
            <span>{leaveRequests.filter(r => r.status === 'approved').length}</span>
          </div>
          <div className="status-card rejected">
            <h4>Rejected</h4>
            <span>{leaveRequests.filter(r => r.status === 'rejected').length}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="leave-form">
          <div className="form-row">
            <div className="form-group">
              <label>Employee ID</label>
              <input
                type="text"
                value={newRequest.employeeId}
                onChange={e => setNewRequest({...newRequest, employeeId: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>Leave Type</label>
              <select
                value={newRequest.leaveType}
                onChange={e => setNewRequest({...newRequest, leaveType: e.target.value})}
                required
              >
                <option value="annual">Annual Leave</option>
                <option value="sick">Sick Leave</option>
                <option value="parental">Parental Leave</option>
                <option value="unpaid">Unpaid Leave</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Start Date</label>
              <input
                type="date"
                value={newRequest.startDate}
                onChange={e => setNewRequest({...newRequest, startDate: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>End Date</label>
              <input
                type="date"
                value={newRequest.endDate}
                onChange={e => setNewRequest({...newRequest, endDate: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Reason</label>
            <textarea
              value={newRequest.reason}
              onChange={e => setNewRequest({...newRequest, reason: e.target.value})}
              required
            />
          </div>

          <button type="submit" className="submit-button">Submit Request</button>
        </form>

        <div className="leave-requests">
          <h4>Leave Requests</h4>
          <div className="requests-list">
            {leaveRequests.map(request => (
              <div key={request.id} className={`request-card ${request.status}`}>
                <div className="request-header">
                  <span>ID: {request.employeeId}</span>
                  <span className={`status-badge ${request.status}`}>
                    {request.status}
                  </span>
                </div>
                <div className="request-details">
                  <p><strong>Type:</strong> {request.leaveType}</p>
                  <p><strong>Duration:</strong> {request.numberOfDays} days</p>
                  <p><strong>From:</strong> {request.startDate}</p>
                  <p><strong>To:</strong> {request.endDate}</p>
                </div>
                {user.role === 'HR' && request.status === 'pending' && (
                  <div className="action-buttons">
                    <button 
                      onClick={() => handleStatusChange(request.id, 'approved')}
                      className="approve"
                    >
                      Approve
                    </button>
                    <button 
                      onClick={() => handleStatusChange(request.id, 'rejected')}
                      className="reject"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaveManagement;
