import API from './authService';

export const getRecommendedGigs = () => API.get('/ai/recommendations');
export const generateDescription = (data) => API.post('/ai/generate-description', data);
export const suggestPricing = (data) => API.post('/ai/suggest-pricing', data);
export const trackSearch = (term) => API.post('/ai/track-search', { term });
