import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    name: '@ocmi-timesheets/api',
    environment: 'node',
    include: ['src/**/*.{test,spec}.ts'],
    // Load DATABASE_URL from the workspace-root .env
    envFile: '../.env',
  },
});
