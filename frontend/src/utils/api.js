const API_BASE_URL = window.location.hostname === 'localhost'
  ? 'http://localhost:5005'
  : (process.env.REACT_APP_API_BASE_URL || '/api');

const request = async (endpoint, options = {}) => {
  // 🔍 Fix: Check 'orgToken' first (since your app saves it there), fallback to 'token'
  const token = localStorage.getItem('orgToken') || localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
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