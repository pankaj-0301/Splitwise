import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // 👈 exposes Vite to 0.0.0.0 so Docker can reach it
    port: 5173, // optional, but keep it fixed
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
