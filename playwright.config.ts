import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests',
  use: {
    baseURL: 'http://localhost:3000',
  },
  projects: [
    {
      name: 'a11y',
      testMatch: 'tests/a11y/**/*.spec.ts',
      use: { browserName: 'chromium' },
    },
  ],
})
