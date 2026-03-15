import api from './api';

export const orderService = {
    // Customer
    customerList: (params = {}) => api.get('/customer/orders', { params }),
    customerShow: (id) => api.get(`/customer/orders/${id}`),
    customerCancel: (id) => api.patch(`/customer/orders/${id}/cancel`),
    checkout: (data) => api.post('/customer/checkout', data),

    // Admin
    adminList: (params = {}) => api.get('/admin/orders', { params }),
    adminShow: (id) => api.get(`/admin/orders/${id}`),
};

export default orderService;
