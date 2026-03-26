import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({
    base: '/contract-to-rate-plan/',
    plugins: [react()],
    server: {
        host: '127.0.0.1',
        port: 5177,
        proxy: {
            '/api': {
                target: 'http://localhost:8000',
                changeOrigin: true,
            },
        },
    },
});
