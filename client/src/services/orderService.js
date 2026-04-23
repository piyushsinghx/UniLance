import API from './authService';

export const createOrder = (data) => API.post('/orders', data);
export const getOrders = (params) => API.get('/orders', { params });
export const getOrderById = (id) => API.get(`/orders/${id}`);
export const updateOrderStatus = (id, data) => API.put(`/orders/${id}/status`, data);
export const deliverOrder = (id, data) => API.put(`/orders/${id}/deliver`, data);
export const requestRevision = (id, data) => API.put(`/orders/${id}/revision`, data);
export const acceptDelivery = (id) => API.put(`/orders/${id}/accept`);
