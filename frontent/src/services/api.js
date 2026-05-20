import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000
});

// Request interceptor - attach token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status, data } = error.response;
      if (status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
          toast.error('Session expired. Please login again.');
        }
      } else if (status === 403) {
        toast.error('Access denied. Insufficient permissions.');
      } else if (status === 429) {
        toast.error('Too many requests. Please try again later.');
      }
      return Promise.reject(data);
    }
    if (error.code === 'ECONNABORTED') {
      toast.error('Request timed out. Please try again.');
    }
    return Promise.reject(error);
  }
);

export default api;
