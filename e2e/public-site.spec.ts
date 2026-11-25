import { test, expect, type Page } from '@playwright/test';

/**
 * End-to-end coverage of the shipped static site.
 *
 * These tests run against `docs/` exactly as it is published: no bundler, no
 * server-side rendering, no install step. Selectors are the same hooks the
 * repository's own Python contract tests use (`tests/test_portal_links.py`,
 * `tests/test_served_site.py`).
 */

const EXPECTED_PROJECTS = [
  'https://github.com/belentani7/belentani.es',
  'https://github.com/belentani7/secure-t',
  'https://github.com/belentani7/ManosAbiertas',
];

function collectConsoleErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  page.on('pageerror', (error) => errors.push(error.message));
  return errors;
}

test.describe('public portal', () => {
  test('landing page renders one heading, the verified links and no console errors', async ({
    page,
  }) => {
    const errors = collectConsoleErrors(page);
    const response = await page.goto('/index.html');
    expect(response?.status()).toBe(200);

    await expect(page).toHaveTitle(/Belentani/i);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('main')).toHaveCount(1);

    const links = page.locator('a.project-link');
    await expect(links).toHaveCount(EXPECTED_PROJECTS.length);
    await expect(links).toHaveAttribute('rel', /noopener/);

    const hrefs = await links.evaluateAll((nodes) =>
      nodes.map((node) => node.getAttribute('href')),
    );
    expect(hrefs.sort()).toEqual([...EXPECTED_PROJECTS].sort());
    expect(errors).toEqual([]);
  });

  test('landing page never scrolls horizontally', async ({ page }) => {
    await page.goto('/index.html');
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(1);
  });
});

test.describe('living machine desktop', () => {
  test('opens the read-only terminal and answers a documented command', async ({ page }) => {
    const errors = collectConsoleErrors(page);
    await page.goto('/living-machine/index.html');

    await expect(page.locator('h1#main-title')).toBeVisible();
    await page.locator('button[data-open="terminal"]').first().click();

    const input = page.locator('#terminalInput');
    await expect(input).toBeVisible();
    await input.fill('whoami');
    await input.press('Enter');

    await expect(page.locator('#console')).toContainText(/Pedro Belentani/);
    expect(errors).toEqual([]);
  });

  test('language switch keeps the document language declared', async ({ page }) => {
    await page.goto('/living-machine/index.html');
    const before = await page.locator('html').getAttribute('lang');
    await page.locator('#langBtn').click();
    const after = await page.locator('html').getAttribute('lang');
    expect(after).toBe(before);
  });
});

test.describe('production studio', () => {
  test('boots its tabs with a single accessible heading', async ({ page }) => {
    const errors = collectConsoleErrors(page);
    const response = await page.goto('/living-machine/studio.html');
    expect(response?.status()).toBe(200);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('[role="tab"]').first()).toBeVisible();
    expect(errors).toEqual([]);
  });
});
