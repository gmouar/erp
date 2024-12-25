import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { auditLogger } from '../../../services/auditLogger';

const AttendanceTracking = () => {
  const { user } = useAuth();
  const [attendance, setAttendance] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [filter, setFilter] = useState({
    department: '',
    status: 'all'
  });
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [currentStatus, setCurrentStatus] = useState(null);

  const markAttendance = async (employeeId, status) => {
    const newEntry = {
      id: Date.now(),
      employeeId,
      date: selectedDate,
      status,
      timestamp: new Date().toISOString(),
      markedBy: user.id
    };

    try {
      // TODO: API integration
      setAttendance(prev => [...prev, newEntry]);
      auditLogger.log('attendance_marked', newEntry);
    } catch (error) {
      console.error('Failed to mark attendance:', error);
    }
  };

  const generateReport = () => {
    // TODO: Implement report generation
    console.log('Generating attendance report...');
  };

  const handleCheckInOut = () => {
    const timestamp = new Date().toISOString();
    const newRecord = {
      id: Date.now(),
      employeeId: user.id,
      timestamp,
      type: currentStatus === 'checked-in' ? 'check-out' : 'check-in'
    };

    setAttendanceRecords(prev => [...prev, newRecord]);
    setCurrentStatus(currentStatus === 'checked-in' ? 'checked-out' : 'checked-in');
  };

  return (
    <div className="attendance-tracking">
      <div className="controls-section">
        <h3>Attendance Tracking</h3>
        
        <div className="filter-controls">
          <div className="date-picker">
            <label>Select Date:</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>

          <div className="filters">
            <select
              value={filter.department}
              onChange={(e) => setFilter({...filter, department: e.target.value})}
            >
              <option value="">All Departments</option>
              <option value="IT">IT</option>
              <option value="HR">HR</option>
              <option value="Finance">Finance</option>
            </select>

            <select
              value={filter.status}
              onChange={(e) => setFilter({...filter, status: e.target.value})}
            >
              <option value="all">All Status</option>
              <option value="present">Present</option>
              <option value="absent">Absent</option>
              <option value="late">Late</option>
            </select>
          </div>

          <button onClick={generateReport} className="report-button">
            Generate Report
          </button>
        </div>
      </div>

      <div className="attendance-actions">
        <button 
          onClick={handleCheckInOut}
          className={`check-button ${currentStatus || ''}`}
        >
          {currentStatus === 'checked-in' ? 'Check Out' : 'Check In'}
        </button>
      </div>

      <div className="attendance-history">
        <h4>Recent Activity</h4>
        <div className="records-list">
          {attendanceRecords.map(record => (
            <div key={record.id} className="record-item">
              <span>{record.type === 'check-in' ? '→' : '←'}</span>
              <span>{new Date(record.timestamp).toLocaleString()}</span>
              <span className="record-type">{record.type}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="attendance-grid">
        <table>
          <thead>
            <tr>
              <th>Employee ID</th>
              <th>Name</th>
              <th>Department</th>
              <th>Time In</th>
              <th>Time Out</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {attendance.filter(entry => {
              if (filter.department && entry.department !== filter.department) return false;
              if (filter.status !== 'all' && entry.status !== filter.status) return false;
              return true;
            }).map(entry => (
              <tr key={entry.id} className={entry.status}>
                <td>{entry.employeeId}</td>
                <td>{entry.employeeName}</td>
                <td>{entry.department}</td>
                <td>{entry.timeIn || '-'}</td>
                <td>{entry.timeOut || '-'}</td>
                <td>
                  <span className={`status-badge ${entry.status}`}>
                    {entry.status}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button onClick={() => markAttendance(entry.employeeId, 'present')}>
                      Mark Present
                    </button>
                    <button onClick={() => markAttendance(entry.employeeId, 'absent')}>
                      Mark Absent
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AttendanceTracking;
