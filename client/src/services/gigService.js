import API from './authService';

export const getGigs = (params) => API.get('/gigs', { params });
export const getGigById = (id) => API.get(`/gigs/${id}`);
export const createGig = (data) => API.post('/gigs', data);
export const updateGig = (id, data) => API.put(`/gigs/${id}`, data);
export const deleteGig = (id) => API.delete(`/gigs/${id}`);
export const getGigsBySeller = (sellerId) => API.get(`/gigs/seller/${sellerId}`);
