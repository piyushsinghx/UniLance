import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
});

// Attach token to every request
API.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('unilance_user') || 'null');
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

// Auth
export const loginUser = (data) => API.post('/auth/login', data);
export const registerUser = (data) => API.post('/auth/register', data);
export const getMe = () => API.get('/auth/me');

export default API;
