import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      src: '/src'
    }
  },
  base: '/savings/',
  server: {
    open: true
  },
  build: {
    outDir: 'build',
    sourcemap: false
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: 'src/setupTests',
    mockReset: true
  }
});
