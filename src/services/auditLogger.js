const logAuditEvent = async (eventType, details) => {
  try {
    const response = await fetch('/api/audit-log', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        eventType,
        details,
        timestamp: new Date().toISOString()
      })
    });
    return response.ok;
  } catch (error) {
    console.error('Audit logging failed:', error);
    return false;
  }
};

export const auditLogger = {
  roleChange: (userId, oldRole, newRole) => 
    logAuditEvent('ROLE_CHANGE', { userId, oldRole, newRole }),
  
  loginAttempt: (username, success) =>
    logAuditEvent('LOGIN_ATTEMPT', { username, success }),
  
  logPerformanceReview: (userId, reviewDetails) =>
    logAuditEvent('PERFORMANCE_REVIEW', { userId, reviewDetails }),
  
  logPayrollProcessing: (userId, payrollDetails) =>
    logAuditEvent('PAYROLL_PROCESSING', { userId, payrollDetails }),
  
  logRecruitmentAction: (userId, actionDetails) =>
    logAuditEvent('RECRUITMENT_ACTION', { userId, actionDetails }),
  
  unauthorized: (userId, attemptedAction) =>
    logAuditEvent('UNAUTHORIZED_ACCESS', { userId, attemptedAction })
};
