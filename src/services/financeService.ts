import { Expense, Budget, Invoice } from '../types/finance';

class FinanceService {
  private baseUrl = '/api/finance';

  async getPayrollData(month: number, year: number) {
    const response = await fetch(`${this.baseUrl}/payroll?month=${month}&year=${year}`);
    return response.json();
  }

  async processPayroll(month: number, year: number) {
    const response = await fetch(`${this.baseUrl}/payroll/process`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ month, year })
    });
    return response.json();
  }

  // Expense Management
  async submitExpense(expense: Omit<Expense, 'id'>) {
    const response = await fetch(`${this.baseUrl}/expenses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(expense)
    });
    return response.json();
  }

  async approveExpense(expenseId: number, approverId: number) {
    const response = await fetch(`${this.baseUrl}/expenses/${expenseId}/approve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ approverId })
    });
    return response.json();
  }

  // Budget Management
  async createBudget(budget: Omit<Budget, 'id'>) {
    const response = await fetch(`${this.baseUrl}/budgets`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(budget)
    });
    return response.json();
  }

  async updateBudget(budgetId: number, updates: Partial<Budget>) {
    const response = await fetch(`${this.baseUrl}/budgets/${budgetId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    return response.json();
  }

  // Dashboard & Reports
  async generateReport(type: string, period: string) {
    const response = await fetch(
      `${this.baseUrl}/reports/${type}?period=${period}`
    );
    return response.json();
  }

  // Invoice Management
  async createInvoice(invoice: Omit<Invoice, 'id'>) {
    const response = await fetch(`${this.baseUrl}/invoices`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(invoice)
    });
    return response.json();
  }

  async updateInvoiceStatus(invoiceId: number, status: Invoice['status']) {
    const response = await fetch(`${this.baseUrl}/invoices/${invoiceId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    return response.json();
  }
}

export const financeService = new FinanceService();
