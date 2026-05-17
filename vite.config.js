import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/js/app.jsx'],
            refresh: true,
        }),
        react(),
    ],
    resolve: {
        alias: {
            '@': '/resources/js',
            '@inertiajs/react': '/resources/js/utils/inertia-compat.jsx',
        },
    },
    build: {
        outDir: 'public/build', // keep this same
    },
    base: '/', // ✅ ADD THIS LINE
});
