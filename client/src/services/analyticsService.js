import API from './authService';

export const getDashboardStats = () => API.get('/analytics/dashboard');
export const getEarningsData = (params) => API.get('/analytics/earnings', { params });
export const getGigPerformance = () => API.get('/analytics/gig-performance');
