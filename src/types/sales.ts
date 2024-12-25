export interface Lead {
  id: string;
  company: string;
  contactName: string;
  title: string;
  email: string;
  phone: string;
  source: string;
  status: 'new' | 'contacted' | 'qualified' | 'lost';
  score: number;
  assignedTo: string;
  createdAt: Date;
  lastContact?: Date;
  notes: string;
  activities: LeadActivity[];
}

export interface LeadActivity {
  id: string;
  type: 'email' | 'call' | 'meeting' | 'note';
  date: Date;
  description: string;
  outcome?: string;
  nextAction?: string;
}

export interface SalesOpportunity {
  id: string;
  leadId: string;
  title: string;
  value: number;
  probability: number;
  stage: 'prospect' | 'qualification' | 'proposal' | 'negotiation' | 'closed-won' | 'closed-lost';
  expectedCloseDate: Date;
  products: OpportunityProduct[];
  notes: string;
  assignedTo: string;
}

export interface OpportunityProduct {
  productId: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  total: number;
}

export interface Quote {
  id: string;
  opportunityId?: string;
  customer: {
    id: string;
    name: string;
    email: string;
    address: string;
  };
  items: QuoteItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired';
  validUntil: Date;
  createdBy: string;
  createdAt: Date;
  modifiedAt: Date;
  terms: string;
  notes: string;
}

export interface QuoteItem {
  productId: string;
  description: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  tax: number;
  total: number;
}

export interface Order {
  id: string;
  quoteId: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'overdue';
  deliveryDate?: Date;
}
