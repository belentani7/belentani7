import { defineConfig, devices } from '@playwright/test';

// End-to-end tests run against the real deliverable: the build-free static site
// in `docs/`, served by `scripts/serve_docs.py`. No bundler and no install step
// are involved, so the browser sees exactly what Vercel/GitHub Pages publish.
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env['CI'],
  retries: process.env['CI'] ? 2 : 0,
  workers: process.env['CI'] ? 1 : undefined,
  reporter: process.env['CI'] ? [['github'], ['html', { open: 'never' }]] : 'list',
  timeout: 30_000,
  expect: { timeout: 5_000 },
  use: {
    baseURL: 'http://127.0.0.1:4173',
    trace: 'on-first-retry',
    video: 'off',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'mobile-chromium',
      use: { ...devices['Pixel 7'] },
    },
  ],
  webServer: {
    command: 'python3 scripts/serve_docs.py --root docs --port 4173 --bind 127.0.0.1 --quiet',
    url: 'http://127.0.0.1:4173/index.html',
    reuseExistingServer: !process.env['CI'],
    timeout: 30_000,
  },
});
