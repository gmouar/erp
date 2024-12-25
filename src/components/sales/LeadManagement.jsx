import React, { useState, useEffect } from 'react';
import { salesService } from '../../services/salesService';
import { useAuth } from '../../hooks/useAuth';

const LeadManagement = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    loadLeads();
  }, []);

  const loadLeads = async () => {
    try {
      const data = await salesService.getLeads();
      setLeads(data);
    } catch (error) {
      console.error('Error loading leads:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateLead = async (leadData) => {
    try {
      await salesService.createLead(leadData);
      loadLeads();
    } catch (error) {
      console.error('Error creating lead:', error);
    }
  };

  return (
    <div className="lead-management">
      <h2>Lead Management</h2>
      
      {loading ? (
        <div>Loading leads...</div>
      ) : (
        <div className="leads-table">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Company</th>
                <th>Status</th>
                <th>Score</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {leads.map(lead => (
                <tr key={lead.id}>
                  <td>{lead.name}</td>
                  <td>{lead.company}</td>
                  <td>
                    <span className={`status-badge ${lead.status}`}>
                      {lead.status}
                    </span>
                  </td>
                  <td>{lead.score}</td>
                  <td>
                    <div className="action-buttons">
                      <button onClick={() => handleEdit(lead.id)}>Edit</button>
                      <button onClick={() => handleConvert(lead.id)}>Convert</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default LeadManagement;
