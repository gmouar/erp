import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@mui/x-date-pickers',
      '@mui/x-date-pickers/AdapterDateFns',
      'axios',
      'firebase/analytics'  // Add this line
    ]
  },
  resolve: {
    alias: {
      '@': '/src'
    }
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  },
  build: {
    outDir: 'build', // Set output directory to 'build'
    sourcemap: true,
    commonjsOptions: {
      transformMixedEsModules: true
    }
  }
});
