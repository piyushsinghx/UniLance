import axios from 'axios';
import toast from 'react-hot-toast';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
});

// Attach token to every request
API.interceptors.request.use((config) => {
  try {
    const user = JSON.parse(localStorage.getItem('unilance_user') || 'null');
    if (user?.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
  } catch {
    // If localStorage data is corrupted, skip token attachment
  }
  return config;
});

// Global response interceptor — handle 401 (token expired/invalid)
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      const currentPath = window.location.pathname;
      // Don't auto-logout on login/register pages (expected 401 for bad credentials)
      if (currentPath !== '/login' && currentPath !== '/register') {
        localStorage.removeItem('unilance_user');
        toast.error('Session expired. Please log in again.');
        // Small delay so toast is visible before redirect
        setTimeout(() => {
          window.location.href = '/login';
        }, 500);
      }
    }
    return Promise.reject(error);
  }
);

// Auth
export const loginUser = (data) => API.post('/auth/login', data);
export const registerUser = (data) => API.post('/auth/register', data);
export const getMe = () => API.get('/auth/me');

export default API;
