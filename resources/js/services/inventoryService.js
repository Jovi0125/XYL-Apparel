import api from './api';

export const inventoryService = {
    dashboard: () => api.get('/inventory/dashboard'),
    stockList: (params = {}) => api.get('/inventory/stock', { params }),
    stockShow: (id) => api.get(`/inventory/stock/${id}`),
    stockUpdate: (id, data) => api.patch(`/inventory/stock/${id}`, data),
    adjust: (data) => api.post('/inventory/stock-adjustment', data),
    receivingList: () => api.get('/inventory/receiving'),
    receive: (data) => api.post('/inventory/receiving', data),

    // Warehouses
    warehouses: () => api.get('/inventory/warehouses'),
    warehouseShow: (id) => api.get(`/inventory/warehouses/${id}`),
    warehouseCreate: (data) => api.post('/inventory/warehouses', data),
    warehouseUpdate: (id, data) => api.put(`/inventory/warehouses/${id}`, data),
    warehouseDelete: (id) => api.delete(`/inventory/warehouses/${id}`),
};

export default inventoryService;
