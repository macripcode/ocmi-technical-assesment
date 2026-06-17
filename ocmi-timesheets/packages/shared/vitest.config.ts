import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    name: '@ocmi-timesheets/shared',
    environment: 'node',
    include: ['src/**/*.{test,spec}.ts'],
  },
});
