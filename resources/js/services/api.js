import axios from 'axios';

const api = axios.create({
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/json',
    },
});

// Add CSRF token to every request
api.interceptors.request.use(config => {
    const token = window.__INITIAL_DATA__?.csrfToken ||
        document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
    if (token) {
        config.headers['X-CSRF-TOKEN'] = token;
    }
    return config;
});

export default api;
