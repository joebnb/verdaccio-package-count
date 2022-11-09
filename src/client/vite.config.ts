import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    build: {
        outDir: '../../lib/client',
        manifest: true,
        rollupOptions: {
            output: {
                chunkFileNames: 'assets/[name].js',
                entryFileNames: 'assets/[name].js',
                assetFileNames: 'assets/[name].[ext]',
                manualChunks: {},
            },
        },
    },

    server: {
        host: '0.0.0.0',
        port: 3000,
        cors: {
            origin: '*',
        },
    },
});
