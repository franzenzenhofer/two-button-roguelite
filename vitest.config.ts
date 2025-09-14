import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: './src/tests/setup.ts',
    exclude: ['e2e/**', 'node_modules/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/**',
        'e2e/**',
        'scripts/**',
        '*.config.{js,ts}',
        'src/tests/**',
        'src/main.tsx',
        'dist/**',
        '_worker.js',
      ],
      thresholds: {
        branches: 75,
        functions: 85,
        lines: 95,
        statements: 95,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});