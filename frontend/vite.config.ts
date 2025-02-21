import { defineConfig, normalizePath } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import laravel from 'laravel-vite-plugin';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import * as path from "node:path";


const backendPath = process.env.BACKEND_PATH || '../backend/';

export default defineConfig({
  plugins: [
    laravel({
      input: [`${backendPath}resources/css/app.css`, `${backendPath}resources/js/app.js`],
      buildDirectory: `${backendPath}public/build`,
      publicDirectory: `${backendPath}public`,
      refresh: true,
    }),
    react(),
    tailwindcss(),
    viteStaticCopy({
      targets: [
        {
          src: normalizePath(path.resolve(__dirname, 'src/i18n/locales')),
          dest: normalizePath(path.resolve(__dirname, '../backend/public')),
        },
      ],
    }),
  ],
  server: {
    host: '0.0.0.0',
    hmr: {
      host: '127.0.0.1',
    },
    allowedHosts: true,
    proxy: {
      '/locales': {
        target: 'http://localhost:8000', // Laravel server
        changeOrigin: true,
      },
    },
  },
  build: {
    manifest: true,
    outDir: `${backendPath}/public/build`,
    rollupOptions: {
      input: 'src/main.tsx',
    },
  },
})
