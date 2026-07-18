import path from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname),
    },
  },
  test: {
    setupFiles: ['./app/__tests__/setup/vitest.setup.ts'],
    environment: 'node',
    hookTimeout: 60000,
  },
});