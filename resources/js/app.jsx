import './bootstrap';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './components/App';

const container = document.getElementById('app');

if (container) {
    const root = createRoot(container);
    const initialData = window.__INITIAL_DATA__ || {};

    root.render(
        <BrowserRouter>
            <App auth={initialData.auth} user={initialData.user} />
        </BrowserRouter>
    );
}
