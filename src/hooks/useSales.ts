import { useState, useEffect } from 'react';
import { Lead, SalesOpportunity, Quote, SalesOrder } from '../types/sales';
import { salesService } from '../services/salesService';
import { salesAnalytics } from '../services/salesAnalytics';

export const useSales = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [opportunities, setOpportunities] = useState<SalesOpportunity[]>([]);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [orders, setOrders] = useState<SalesOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Lead Management
  const createLead = async (leadData: Omit<Lead, 'id' | 'createdAt' | 'lastContact'>) => {
    try {
      const newLead = await salesService.createLead(leadData);
      setLeads(prev => [...prev, newLead]);
      return newLead;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error creating lead');
      throw err;
    }
  };

  // Opportunity Management
  const createOpportunity = async (data: Omit<SalesOpportunity, 'id'>) => {
    try {
      const newOpportunity = await salesService.createOpportunity(data);
      setOpportunities(prev => [...prev, newOpportunity]);
      return newOpportunity;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error creating opportunity');
      throw err;
    }
  };

  // Analytics
  const getAnalytics = async () => {
    try {
      setLoading(true);
      const [conversionRate, pipelineValue] = await Promise.all([
        salesAnalytics.getConversionRate(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), new Date()),
        salesAnalytics.getPipelineValue()
      ]);
      return { conversionRate, pipelineValue };
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching analytics');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    leads,
    opportunities,
    quotes,
    orders,
    loading,
    error,
    createLead,
    createOpportunity,
    getAnalytics
  };
};
