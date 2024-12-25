const permissionMatrix = {
  'Manufacturing Manager': {
    'inventory.view': true,
    'inventory.edit': true,
    'production.create': true,
    'production.edit': true,
    'quality.approve': true
  },
  'Production Supervisor': {
    'inventory.view': true,
    'inventory.edit': false,
    'production.create': true,
    'production.edit': true,
    'quality.approve': false
  },
  'Quality Inspector': {
    'inventory.view': true,
    'inventory.edit': false,
    'production.create': false,
    'production.edit': false,
    'quality.approve': true
  },
  'HR': {
    'employees.view': true,
    'employees.edit': true,
    'recruitment.manage': true,
    'attendance.manage': true,
    'leave.approve': true,
    'payroll.manage': true,
    'reports.view': true
  },
  'Finance': {
    'finance.view': true,
    'finance.edit': true,
    'budget.manage': true,
    'expenses.approve': true,
    'invoices.manage': true,
    'payroll.view': true,
    'reports.finance': true
  },
  'Superuser': {
    'employees.view': true,
    'employees.edit': true,
    'recruitment.manage': true,
    'attendance.manage': true,
    'leave.approve': true,
    'payroll.manage': true,
    'reports.view': true,
    'finance.view': true,
    'finance.edit': true,
    'budget.manage': true,
    'expenses.approve': true,
    'invoices.manage': true,
    'payroll.view': true,
    'reports.finance': true
  }
};

export const checkPermission = (role, permission) => {
  return permissionMatrix[role]?.[permission] || false;
};
