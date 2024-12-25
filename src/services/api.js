const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const fetchWithConfig = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'An error occurred');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export const registerUser = async (userData) => {
  return fetchWithConfig('/api/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
};

export const loginUser = async (credentials) => {
  return fetchWithConfig('/api/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
};

export const verifyTwoFactor = async (data) => {
  return fetchWithConfig('/api/verify-2fa', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const setup2FA = async () => {
  return fetchWithConfig('/api/setup-2fa', {
    method: 'POST',
  });
};
