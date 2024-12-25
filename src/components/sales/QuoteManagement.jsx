import React, { useState, useEffect } from 'react';
import { useQuotes } from '../../hooks/useQuotes';

const QuoteManagement = () => {
  const { quotes, loading, createQuote, updateQuoteStatus } = useQuotes();
  const [newQuote, setNewQuote] = useState({
    customerId: '',
    items: [],
    notes: ''
  });

  if (loading) return <div>Loading quotes...</div>;

  return (
    <div className="quote-management">
      <h2>Quote Management</h2>
      
      <div className="quotes-table">
        <table>
          <thead>
            <tr>
              <th>Quote #</th>
              <th>Customer</th>
              <th>Total Value</th>
              <th>Status</th>
              <th>Valid Until</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {quotes.map(quote => (
              <tr key={quote.id}>
                <td>{quote.id}</td>
                <td>{quote.customerId}</td>
                <td>${quote.totalValue.toLocaleString()}</td>
                <td>
                  <span className={`status-badge ${quote.status}`}>
                    {quote.status}
                  </span>
                </td>
                <td>{new Date(quote.validUntil).toLocaleDateString()}</td>
                <td>
                  <div className="action-buttons">
                    <button onClick={() => updateQuoteStatus(quote.id, 'sent')}>
                      Send
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

export default QuoteManagement;
