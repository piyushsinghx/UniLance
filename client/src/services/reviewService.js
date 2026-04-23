import API from './authService';

export const createReview = (data) => API.post('/reviews', data);
export const getReviewsByGig = (gigId, params) => API.get(`/reviews/gig/${gigId}`, { params });
