import axios from 'axios';

const API_BASE =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.DEV ? 'http://localhost:5001/api' : '');

if (!API_BASE) {
  throw new Error('VITE_API_BASE_URL must be configured for production.');
}

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('cms_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 — token expired or invalid
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('cms_token');
      localStorage.removeItem('cms_admin');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

export default api;
