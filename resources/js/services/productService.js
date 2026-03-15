import api from './api';

export const productService = {
    list: (params = {}) => api.get('/inventory/products', { params }),
    show: (id) => api.get(`/inventory/products/${id}`),
    create: (data) => api.post('/inventory/products', data),
    update: (id, data) => api.put(`/inventory/products/${id}`, data),
    destroy: (id) => api.delete(`/inventory/products/${id}`),

    // Customer browsing
    browse: (params = {}) => api.get('/customer/browse', { params }),
    browseShow: (id) => api.get(`/customer/products/${id}`),
};

export default productService;
