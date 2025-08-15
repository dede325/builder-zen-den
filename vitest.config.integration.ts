import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  test: {
    name: 'integration',
    environment: 'node',
    testTimeout: 30000,
    hookTimeout: 30000,
    globals: true,
    setupFiles: ['./tests/setup/integration.ts'],
    include: [
      'tests/integration/**/*.test.ts',
      'server/**/*.integration.test.ts'
    ],
    exclude: [
      'node_modules',
      'dist',
      'build'
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'tests/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/coverage/**'
      ]
    },
    pool: 'threads',
    poolOptions: {
      threads: {
        singleThread: true
      }
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './client'),
      '@shared': resolve(__dirname, './shared'),
      '@server': resolve(__dirname, './server'),
    }
  },
  esbuild: {
    target: 'node18'
  }
});
