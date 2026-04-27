/* ===== UniLance — API Service Layer ===== */
/* Replaces all axios-based React service files with vanilla fetch */

const API_BASE = '/api';

const Api = {
  _getToken() {
    const u = JSON.parse(localStorage.getItem('unilance_user') || 'null');
    return u?.token || '';
  },

  async _req(method, path, body, isForm) {
    const headers = {};
    const token = this._getToken();
    if (token) headers['Authorization'] = 'Bearer ' + token;
    if (body && !isForm) headers['Content-Type'] = 'application/json';

    const opts = { method, headers };
    if (body) opts.body = isForm ? body : JSON.stringify(body);

    const res = await fetch(API_BASE + path, opts);
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw { response: { data, status: res.status } };
    return { data };
  },

  get(path, params) {
    let url = path;
    if (params) {
      const qs = new URLSearchParams();
      Object.entries(params).forEach(([k, v]) => { if (v !== '' && v != null) qs.set(k, v); });
      const s = qs.toString();
      if (s) url += '?' + s;
    }
    return this._req('GET', url);
  },
  post(path, body, isForm) { return this._req('POST', path, body, isForm); },
  put(path, body) { return this._req('PUT', path, body); },
  delete(path) { return this._req('DELETE', path); },

  // Auth
  login(data) { return this.post('/auth/login', data); },
  register(data) { return this.post('/auth/register', data); },
  getMe() { return this.get('/auth/me'); },

  // Gigs
  getGigs(params) { return this.get('/gigs', params); },
  getGigById(id) { return this.get('/gigs/' + id); },
  createGig(data) { return this.post('/gigs', data); },
  updateGig(id, data) { return this.put('/gigs/' + id, data); },
  deleteGig(id) { return this.delete('/gigs/' + id); },
  getGigsBySeller(sid) { return this.get('/gigs/seller/' + sid); },
  getFeaturedGigs() { return this.get('/gigs/featured'); },

  // Orders
  createOrder(data) { return this.post('/orders', data); },
  getOrders(params) { return this.get('/orders', params); },
  getOrderById(id) { return this.get('/orders/' + id); },
  updateOrderStatus(id, data) { return this.put('/orders/' + id + '/status', data); },
  deliverOrder(id, data) { return this.put('/orders/' + id + '/deliver', data); },
  acceptDelivery(id) { return this.put('/orders/' + id + '/accept'); },

  // Messages
  sendMessage(data) { return this.post('/messages', data); },
  getMessages(cid) { return this.get('/messages/' + cid); },
  getConversations() { return this.get('/messages/conversations'); },

  // Reviews
  createReview(data) { return this.post('/reviews', data); },
  getReviewsByGig(gid) { return this.get('/reviews/gig/' + gid); },

  // Payments
  createPaymentOrder(data) { return this.post('/payments/create-order', data); },
  verifyPayment(data) { return this.post('/payments/verify', data); },

  // AI
  getRecommendedGigs() { return this.get('/ai/recommendations'); },
  suggestPricing(data) { return this.post('/ai/suggest-pricing', data); },
  trackSearch(term) { return this.post('/ai/track-search', { term }); },

  // Notifications
  getNotifications(params) { return this.get('/notifications', params); },
  getUnreadCount() { return this.get('/notifications/unread-count'); },
  markAsRead(id) { return this.put('/notifications/' + id + '/read'); },
  markAllAsRead() { return this.put('/notifications/read-all'); },

  // Users
  getUserProfile(id) { return this.get('/users/' + id); },
  updateUserProfile(id, data) { return this.put('/users/' + id, data); },

  // Upload
  uploadImage(formData) { return this.post('/upload/image', formData, true); },

  // Analytics
  getDashboardStats() { return this.get('/analytics/dashboard'); },
  getEarningsData(params) { return this.get('/analytics/earnings', params); },
};
