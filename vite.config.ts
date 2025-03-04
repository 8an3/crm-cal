import reactRefresh from '@vitejs/plugin-react-refresh'
import Checker from 'vite-plugin-checker'
import { resolve } from 'path'
import checker from 'vite-plugin-checker';
import react from "@vitejs/plugin-react";
import path from 'path';

// https://vitejs.dev/config/
const config = () => ({
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    alias: {
      '~': path.resolve(__dirname, 'src'),
    },
  },
  plugins: [react()],
  build: {
    outDir: "dist",
  },
  server: {
    port: 3004,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})

export default config
