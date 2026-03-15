import api from './api';

export const supportService = {
    dashboard: () => api.get('/support/dashboard'),
    ticketList: (params = {}) => api.get('/support/tickets', { params }),
    ticketShow: (id) => api.get(`/support/tickets/${id}`),
    ticketCreate: (data) => api.post('/support/tickets', data),
    ticketUpdate: (id, data) => api.patch(`/support/tickets/${id}`, data),
    sendMessage: (ticketId, data) => api.post(`/support/tickets/${ticketId}/messages`, data),
};

export default supportService;
