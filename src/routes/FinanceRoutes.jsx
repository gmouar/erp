import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import FinanceDashboard from '../components/finance/FinanceDashboard';
import BudgetManagement from '../components/finance/budget/BudgetManagement';
import ExpenseManagement from '../components/finance/expenses/ExpenseManagement';
import InvoiceManagement from '../components/finance/invoicing/InvoiceManagement';
import PayrollManagement from '../components/hr/payroll/PayrollManagement';

const FinanceRoutes = () => {
  const { user, isAuthenticated } = useAuth();

  // Check if user has Finance access
  const hasAccess = () => {
    if (!isAuthenticated || !user) return false;
    return ['Finance', 'Superuser'].includes(user.role);
  };

  if (!hasAccess()) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <Routes>
      {/* Finance Dashboard */}
      <Route path="/" element={<FinanceDashboard />} />

      {/* Budget Management */}
      <Route path="/budget" element={<BudgetManagement />} />

      {/* Expense Management */}
      <Route path="/expenses" element={<ExpenseManagement />} />

      {/* Invoice Management */}
      <Route path="/invoicing" element={<InvoiceManagement />} />

      {/* Payroll Management */}
      <Route path="/payroll" element={<PayrollManagement />} />

      {/* Redirect any unmatched routes to Finance Dashboard */}
      <Route path="*" element={<Navigate to="/finance" replace />} />
    </Routes>
  );
};

export default FinanceRoutes;
