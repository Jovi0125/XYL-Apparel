import api from './api';

export const cartService = {
    list: () => api.get('/customer/cart'),
    add: (data) => api.post('/customer/cart', data),
    update: (id, data) => api.patch(`/customer/cart/${id}`, data),
    remove: (id) => api.delete(`/customer/cart/${id}`),
    clear: () => api.delete('/customer/cart'),
};

export default cartService;
