export interface Expense {
  id: number;
  description: string;
  amount: number;
  category: string;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedBy: number;
  submittedDate: string;
  approvedBy?: number;
  approvedDate?: string;
  attachments?: Array<{
    id: string;
    url: string;
    type: string;
  }>;
  history: Array<{
    status: Expense['status'];
    timestamp: string;
    userId: number;
    notes?: string;
  }>;
}

export interface Budget {
  id: number;
  department: string;
  amount: number;
  fiscalYear: number;
  category: string;
  spent: number;
  remaining: number;
  status: 'active' | 'exceeded' | 'closed';
  history: Array<{
    amount: number;
    timestamp: string;
    userId: number;
    action: 'created' | 'updated' | 'closed';
  }>;
  notifications: Array<{
    type: 'warning' | 'alert';
    message: string;
    timestamp: string;
  }>;
}

export interface Invoice {
  id: number;
  invoiceNumber: string;
  customerName: string;
  amount: number;
  dueDate: string;
  items: Array<{
    description: string;
    quantity: number;
    price: number;
  }>;
  notes: string;
  status: 'pending' | 'paid' | 'cancelled';
  createdDate: string;
  paymentHistory: Array<{
    amount: number;
    date: string;
    method: string;
    reference?: string;
  }>;
  reminders: Array<{
    sentDate: string;
    dueDate: string;
    status: 'sent' | 'viewed' | 'responded';
  }>;
}
