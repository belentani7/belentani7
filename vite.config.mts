import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// Component playground configuration.
//
// The public product is the build-free static site in `docs/` (`vercel.json`
// sets an empty install and build command). This Vite project only builds the
// React playground used to prototype UI pieces and to run the component test
// suite, so its root is `src/` — never the repository root, which ships the
// real `index.html` page and must not be bundled.
const srcDir = fileURLToPath(new URL('./src', import.meta.url));

export default defineConfig({
  root: srcDir,
  plugins: [react()],
  resolve: {
    alias: {
      '@': srcDir,
    },
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
  },
  build: {
    outDir: fileURLToPath(new URL('./dist', import.meta.url)),
    emptyOutDir: true,
    sourcemap: false,
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './test/setup.ts',
    include: ['**/*.test.{ts,tsx}'],
    restoreMocks: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json-summary'],
      include: ['**/*.{ts,tsx}'],
      exclude: ['test/**', 'main.tsx', '**/*.d.ts'],
    },
  },
});
