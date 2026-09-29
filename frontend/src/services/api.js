import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 20000,
});

// Attach appropriate JWT token: user token for normal requests, admin token for admin requests
api.interceptors.request.use((config) => {
  const isAdminRequest = config.url?.startsWith('/admin');
  const adminToken = localStorage.getItem('colorido_admin_token');
  const userToken = localStorage.getItem('colorido_user_token') || localStorage.getItem('colorido_token');

  const token = isAdminRequest ? (adminToken || userToken) : (userToken || adminToken);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

// -------------------------------------------------------------
// Public Endpoints
// -------------------------------------------------------------
export const fetchEvents = (params) => api.get('/events', { params });
export const fetchEventById = (id) => api.get(`/events/${id}`);

export const fetchSchedule = (params) => api.get('/schedule', { params });
export const fetchResults = (params) => api.get('/results', { params });
export const fetchLeaderboard = () => api.get('/results/leaderboard');

export const submitContactMessage = (data) => api.post('/contact', data);

// -------------------------------------------------------------
// Unified Auth Endpoints (Section: AUTHENTICATION — FINAL DESIGN)
// -------------------------------------------------------------
export const login = (email, password) => api.post('/auth/login', { email, password });
export const register = (data) => api.post('/auth/register', data);
export const forgotPassword = (email) => api.post('/auth/forgot-password', { email });
export const verifyResetToken = (token) => api.get('/auth/verify-reset-token', { params: { token } });
export const resetPassword = (data) => api.post('/auth/reset-password', data);
export const changePassword = (data) => api.post('/auth/change-password', data);
export const logoutUserApi = () => api.post('/auth/logout');

export const fetchCurrentUser = () => api.get('/auth/me');
export const fetchAdminMe = () => api.get('/auth/admin/me');

export const registerForEvent = (data) => api.post('/registrations', data);
export const fetchMyRegistrations = () => api.get('/registrations');
export const fetchPassById = (id) => api.get(`/registrations/pass/${id}`);

// Backward compatibility aliases
export const loginAdmin = (email, password) => api.post('/auth/login', { email, password });
export const loginWithEmail = (data) => api.post('/auth/login', data);
export const loginWithGoogle = (credential) => api.post('/auth/login', { credential });
export const fetchAdminDashboard = () => api.get('/admin/dashboard');

// Admin Events
export const adminFetchEvents = (params) => api.get('/admin/events', { params });
export const adminCreateEvent = (data) => api.post('/admin/events', data);
export const adminUpdateEvent = (id, data) => api.put(`/admin/events/${id}`, data);
export const adminDeleteEvent = (id) => api.delete(`/admin/events/${id}`);
export const adminTogglePublishEvent = (id) => api.patch(`/admin/events/${id}/publish`);
export const adminToggleFeaturedEvent = (id) => api.patch(`/admin/events/${id}/feature`);

// Admin Registrations
export const adminFetchRegistrations = (params) => api.get('/admin/registrations', { params });
export const adminUpdateRegistrationStatus = (id, status) => api.patch(`/admin/registrations/${id}/status`, { status });

// Admin Schedule
export const adminFetchSchedule = (params) => api.get('/admin/schedule', { params });
export const adminCreateSchedule = (data) => api.post('/admin/schedule', data);
export const adminUpdateSchedule = (id, data) => api.put(`/admin/schedule/${id}`, data);
export const adminDeleteSchedule = (id) => api.delete(`/admin/schedule/${id}`);
export const adminTogglePublishSchedule = (id) => api.patch(`/admin/schedule/${id}/publish`);

// Admin Results
export const adminFetchResults = (params) => api.get('/admin/results', { params });
export const adminCreateResult = (data) => api.post('/admin/results', data);
export const adminUpdateResult = (id, data) => api.put(`/admin/results/${id}`, data);
export const adminDeleteResult = (id) => api.delete(`/admin/results/${id}`);
export const adminTogglePublishResult = (id) => api.patch(`/admin/results/${id}/publish`);

// Admin Messages
export const adminFetchMessages = (params) => api.get('/admin/messages', { params });
export const adminUpdateMessageStatus = (id, status) => api.patch(`/admin/messages/${id}/status`, { status });
export const adminDeleteMessage = (id) => api.delete(`/admin/messages/${id}`);

// Convenience Aliases for Admin
export const fetchRegistrations = adminFetchRegistrations;
export const updateRegistrationStatus = adminUpdateRegistrationStatus;
export const fetchContactMessages = adminFetchMessages;
export const updateContactStatus = adminUpdateMessageStatus;
export const createEvent = adminCreateEvent;
export const updateEvent = adminUpdateEvent;
export const deleteEvent = adminDeleteEvent;
export const togglePublishEvent = adminTogglePublishEvent;
export const toggleFeaturedEvent = adminToggleFeaturedEvent;

export default api;
