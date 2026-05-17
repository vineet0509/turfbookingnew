import { defineConfig, loadEnv } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');
    
    let basePath = '/';
    if (env.APP_URL) {
        try {
            const url = new URL(env.APP_URL);
            const pathname = url.pathname.replace(/\/$/, '');
            if (pathname && pathname !== '/') {
                basePath = `${pathname}/`;
            }
        } catch (e) {}
    }

    return {
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
            outDir: 'public/build',
        },
        base: basePath,
    };
});
