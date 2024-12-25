import React, { useState } from 'react';
import { useOpportunities } from '../../hooks/useOpportunities';

const OpportunityManagement = () => {
  const { opportunities, loading, createOpportunity, updateStage } = useOpportunities();
  const [showCreateForm, setShowCreateForm] = useState(false);

  const stages = [
    'inquiry',
    'proposal',
    'negotiation',
    'closed-won',
    'closed-lost'
  ];

  if (loading) return <div>Loading opportunities...</div>;

  return (
    <div className="opportunity-management">
      <h2>Sales Opportunities</h2>
      
      <button 
        className="create-button"
        onClick={() => setShowCreateForm(true)}
      >
        New Opportunity
      </button>

      <div className="opportunities-board">
        {stages.map(stage => (
          <div key={stage} className="stage-column">
            <h3>{stage}</h3>
            {opportunities
              .filter(opp => opp.stage === stage)
              .map(opportunity => (
                <div key={opportunity.id} className="opportunity-card">
                  <h4>{opportunity.leadId}</h4>
                  <p>Value: ${opportunity.value.toLocaleString()}</p>
                  <p>Probability: {opportunity.probability}%</p>
                  <select
                    value={opportunity.stage}
                    onChange={(e) => updateStage(opportunity.id, e.target.value)}
                  >
                    {stages.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default OpportunityManagement;
