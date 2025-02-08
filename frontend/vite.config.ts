import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import laravel from 'laravel-vite-plugin';

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
  ],
  server: {
    host: '0.0.0.0',
    hmr: {
      host: '127.0.0.1',
    },
    allowedHosts: true
  },
  build: {
    manifest: true,
    outDir: `${backendPath}/public/build`,
    rollupOptions: {
      input: 'src/main.tsx',
    },
  },
})
