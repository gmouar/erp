export const createAuditLog = async (logData) => {
  try {
    const response = await fetch('/api/audit-logs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...logData,
        timestamp: new Date().toISOString(),
      }),
    });
    return await response.json();
  } catch (error) {
    console.error('Audit log creation failed:', error);
    throw error;
  }
};
