import { useState, useEffect } from 'react';
import { salesService } from '../services/salesService';
import { Quote, QuoteItem } from '../types/sales';

export const useQuotes = () => {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadQuotes();
  }, []);

  const loadQuotes = async () => {
    try {
      const response = await fetch('/api/sales/quotes');
      const data = await response.json();
      setQuotes(data);
    } catch (err) {
      setError('Failed to load quotes');
    } finally {
      setLoading(false);
    }
  };

  const createQuote = async (
    opportunityId: string,
    customerId: string,
    items: QuoteItem[]
  ) => {
    try {
      const newQuote = await salesService.createQuote(opportunityId, customerId, items);
      setQuotes([...quotes, newQuote]);
      return newQuote;
    } catch (err) {
      setError('Failed to create quote');
      throw err;
    }
  };

  const updateQuoteStatus = async (quoteId: string, status: Quote['status']) => {
    try {
      await salesService.updateQuoteStatus(quoteId, status);
      setQuotes(quotes.map(quote => 
        quote.id === quoteId ? { ...quote, status } : quote
      ));
    } catch (err) {
      setError('Failed to update quote status');
      throw err;
    }
  };

  return {
    quotes,
    loading,
    error,
    createQuote,
    updateQuoteStatus,
    refreshQuotes: loadQuotes
  };
};
