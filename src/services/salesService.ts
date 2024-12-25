import { Lead, SalesOpportunity, Quote, SalesOrder, QuoteItem } from '../types/sales';

class SalesService {
  private baseUrl = '/api/sales';

  // Lead Management
  async getLeads() {
    const response = await fetch(`${this.baseUrl}/leads`);
    return response.json();
  }

  async createLead(leadData: Omit<Lead, 'id' | 'createdAt' | 'lastContact'>): Promise<Lead> {
    const lead: Lead = {
      ...leadData,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      lastContact: new Date(),
      score: 0
    };
    
    const response = await fetch(`${this.baseUrl}/leads`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(lead)
    });
    return response.json();
  }

  async updateLeadStatus(leadId: string, status: Lead['status']): Promise<void> {
    // TODO: API integration
  }

  async scoreLead(leadId: string): Promise<number> {
    // Implement lead scoring algorithm
    return 0;
  }

  // Opportunity Management
  async getOpportunities() {
    const response = await fetch(`${this.baseUrl}/opportunities`);
    return response.json();
  }

  async createOpportunity(data: Omit<SalesOpportunity, 'id'>): Promise<SalesOpportunity> {
    const opportunity: SalesOpportunity = {
      ...data,
      id: crypto.randomUUID()
    };
    
    // TODO: API integration
    return opportunity;
  }

  async updateOpportunityStage(
    opportunityId: string, 
    stage: SalesOpportunity['stage']
  ): Promise<void> {
    const response = await fetch(`${this.baseUrl}/opportunities/${opportunityId}/stage`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stage })
    });
    return response.json();
  }

  // Quote Management
  async createQuote(
    opportunityId: string,
    customerId: string,
    items: QuoteItem[]
  ): Promise<Quote> {
    const subtotal = this.calculateSubtotal(items);
    const tax = this.calculateTax(subtotal);
    
    const quote: Quote = {
      id: crypto.randomUUID(),
      opportunityId,
      customerId,
      items,
      subtotal,
      tax,
      total: subtotal + tax,
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days validity
      status: 'draft'
    };
    
    const response = await fetch(`${this.baseUrl}/quotes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(quote)
    });
    return response.json();
  }

  async updateQuoteStatus(quoteId: string, status: Quote['status']): Promise<void> {
    // TODO: API integration
  }

  // Sales Order Management
  async createSalesOrder(quoteId: string, customerId: string): Promise<SalesOrder> {
    const order: SalesOrder = {
      id: crypto.randomUUID(),
      quoteId,
      customerId,
      status: 'pending',
      items: [], // TODO: Copy items from quote
      total: 0, // TODO: Calculate from items
      paymentStatus: 'pending',
      createdAt: new Date()
    };
    
    const response = await fetch(`${this.baseUrl}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order)
    });
    return response.json();
  }

  async updateOrderStatus(
    orderId: string, 
    status: SalesOrder['status']
  ): Promise<void> {
    // TODO: API integration
  }

  async updatePaymentStatus(
    orderId: string, 
    status: SalesOrder['paymentStatus']
  ): Promise<void> {
    // TODO: API integration
  }

  // Analytics
  async getSalesAnalytics() {
    const response = await fetch(`${this.baseUrl}/analytics`);
    return response.json();
  }

  // Helper Methods
  private calculateSubtotal(items: QuoteItem[]): number {
    return items.reduce((sum, item) => {
      const itemTotal = (item.unitPrice * item.quantity) * (1 - item.discount);
      return sum + itemTotal;
    }, 0);
  }

  private calculateTax(subtotal: number): number {
    const TAX_RATE = 0.20; // 20% tax rate - should be configurable
    return subtotal * TAX_RATE;
  }
}

export const salesService = new SalesService();
