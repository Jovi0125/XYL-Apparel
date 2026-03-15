import api from './api';

export const fulfillmentService = {
    dashboard: () => api.get('/fulfillment/dashboard'),
    orderList: (params = {}) => api.get('/fulfillment/orders', { params }),
    orderShow: (id) => api.get(`/fulfillment/orders/${id}`),
    updateStatus: (id, data) => api.patch(`/fulfillment/orders/${id}/status`, data),
    assign: (id, data) => api.patch(`/fulfillment/orders/${id}/assign`, data),

    // Shipments
    shipmentList: (params = {}) => api.get('/fulfillment/shipments', { params }),
    shipmentShow: (id) => api.get(`/fulfillment/shipments/${id}`),
    shipmentStatus: (id, data) => api.patch(`/fulfillment/shipments/${id}/status`, data),

    // Tracking
    addTracking: (shipmentId, data) => api.post(`/fulfillment/shipments/${shipmentId}/tracking`, data),

    // Proof of Delivery
    addPod: (shipmentId, data) => api.post(`/fulfillment/shipments/${shipmentId}/pod`, data),
};

export default fulfillmentService;
