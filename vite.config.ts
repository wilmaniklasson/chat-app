import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 2412,
    proxy: {
      '/api': {
        target: 'http://localhost:2412',
        changeOrigin: true,
      },
    },
  },
});
