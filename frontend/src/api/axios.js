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

export default api;
