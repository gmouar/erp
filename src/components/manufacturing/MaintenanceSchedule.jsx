import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { checkPermission } from '../../utils/roleUtils';

const MaintenanceSchedule = () => {
  const { user } = useAuth();
  const [schedules, setSchedules] = useState([]);
  const [machines, setMachines] = useState([]);

  const scheduleMaintenance = async (machineId, date) => {
    if (!checkPermission(user.role, 'maintenance.schedule')) {
      alert('Insufficient permissions');
      return;
    }

    try {
      const response = await fetch('/api/manufacturing/maintenance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          machineId,
          scheduledDate: date,
          type: 'preventive',
          status: 'scheduled'
        })
      });
      const newSchedule = await response.json();
      setSchedules([...schedules, newSchedule]);
    } catch (error) {
      console.error('Error scheduling maintenance:', error);
    }
  };

  return (
    <div className="maintenance-schedule">
      <h2>Maintenance Schedule</h2>
      <div className="schedule-calendar">
        {/* Add calendar and scheduling interface */}
      </div>
      <div className="maintenance-list">
        {schedules.map(schedule => (
          <div key={schedule.id} className="maintenance-card">
            <h4>{schedule.machineName}</h4>
            <span>Date: {new Date(schedule.scheduledDate).toLocaleDateString()}</span>
            <span>Type: {schedule.type}</span>
            <span>Status: {schedule.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MaintenanceSchedule;
