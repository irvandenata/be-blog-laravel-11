import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
    define: {
        global: 'globalThis',
    },
    plugins: [
        react(),
        laravel({
            input: ['resources/js/main.tsx'],
            refresh: true,
        }),
    ],
    resolve: {
        alias: {
            '@': '/resources/js',
            '@@': '/resources/js/components',
            '@pages': '/resources/js/pages',
        },
    },
});
