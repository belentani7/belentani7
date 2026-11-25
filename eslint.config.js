'use strict';

/**
 * ESLint flat config (ESLint 10).
 *
 * Scope: the TypeScript/React layer that this repository actually builds
 * (`src/`, `e2e/`, `vite.config.ts`, `playwright.config.ts`). The shipped static
 * site under `docs/`, `assets/` and the Python tooling have their own guards
 * (`node --test`, `node --check`, `unittest`, `scripts/audit_site.py`), so
 * linting them here would only duplicate those checks.
 *
 * `eslint-plugin-react` cannot be used yet: 7.37.5 declares
 * `peerDependencies.eslint: "^3 || ^4 || ^5 || ^6 || ^7 || ^8 || ^9.7"` and has
 * no release supporting ESLint 10. `eslint-plugin-react-hooks` 7.1.1 does
 * support ESLint 10 and covers the correctness rules that matter here
 * (`rules-of-hooks`, `exhaustive-deps` and the React Compiler rule set).
 */

const tseslint = require('typescript-eslint');
const reactHooks = require('eslint-plugin-react-hooks');
const globals = require('globals');

const reactHooksRules = reactHooks.configs['recommended-latest'].rules;

module.exports = tseslint.config(
  {
    ignores: [
      'node_modules/**',
      'dist/**',
      'coverage/**',
      'playwright-report/**',
      'test-results/**',
      'docs/**',
      'assets/**',
      'engine/**',
      'client/**',
      'site/**',
      'magic/**',
    ],
  },
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    plugins: { 'react-hooks': reactHooks },
    rules: {
      ...reactHooksRules,
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/consistent-type-imports': 'warn',
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      eqeqeq: ['error', 'smart'],
      'prefer-const': 'error',
    },
  },
  {
    files: ['**/*.test.{ts,tsx}', 'src/test/**/*.ts', 'e2e/**/*.ts'],
    rules: { 'no-console': 'off' },
  },
);
