import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default ({ mode }) => {
  // Load .env based on current mode
  const env = loadEnv(mode, process.cwd(), '');
  
  return defineConfig({
    plugins: [react()],
    server: {
      host: '0.0.0.0',
      port: 5173,
      strictPort: true,
      hmr: {
        host: env.VITE_API_BASE.includes('37.27.82.6') ? '37.27.82.6' : 'localhost',
      },
      proxy: {
        '/api': {
          target: 'http://37.27.82.6:5000',  // <-- backend on port 5000
          changeOrigin: true,
          secure: false,
          // Only use this if your backend routes do NOT start with /api
          // rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
  });
};
