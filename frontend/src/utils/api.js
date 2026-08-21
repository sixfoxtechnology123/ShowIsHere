const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5005/api';

const request = async (endpoint, options = {}) => {
  const tenantKey = localStorage.getItem('tenantKey') || 'showishere-default';
  const token = localStorage.getItem('token');

  const headers = {
    'Content-Type': 'application/json',
    'x-tenant-key': tenantKey,
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'API request failed');
  }

  return response.json();
};

export const API = {
  get: (endpoint) => request(endpoint, { method: 'GET' }),
  post: (endpoint, body) => request(endpoint, { method: 'POST', body: JSON.stringify(body) }),
  put: (endpoint, body) => request(endpoint, { method: 'PUT', body: JSON.stringify(body) }),
  delete: (endpoint) => request(endpoint, { method: 'DELETE' }),
};

export default API;