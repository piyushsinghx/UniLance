import API from './authService';

export const sendMessage = (data) => API.post('/messages', data);
export const getMessages = (conversationId) => API.get(`/messages/${conversationId}`);
export const getConversations = () => API.get('/messages/conversations');
