import axios from 'axios';

// Vite exposes env vars via `import.meta.env`. Use `VITE_API_URL` in .env
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
console.log('API_BASE Configured as:', API_BASE);

const api = axios.create({ baseURL: API_BASE });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
