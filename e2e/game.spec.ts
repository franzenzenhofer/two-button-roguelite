// E2E tests - max 50 lines
import { test, expect } from '@playwright/test';

test.describe('Two-Button Roguelite', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load game', async ({ page }) => {
    await expect(page).toHaveTitle(/Two-Button Roguelite/);
    await expect(page.locator('.overlay')).toBeVisible();
  });

  test('should start game', async ({ page }) => {
    await page.click('.btn-start');
    await expect(page.locator('.perk-row')).toBeVisible();
  });

  test('should choose perk and play', async ({ page }) => {
    await page.click('.btn-start');
    await page.click('.btn-left');
    await expect(page.locator('.game-canvas')).toBeVisible();
    await expect(page.locator('.hud')).toBeVisible();
  });

  test('should move left and right', async ({ page }) => {
    await page.click('.btn-start');
    await page.click('.btn-left');

    // Test left movement
    await page.click('.btn-left');
    await page.waitForTimeout(100);

    // Test right movement
    await page.click('.btn-right');
    await page.waitForTimeout(100);
  });

  test('should show game over screen', async ({ page }) => {
    await page.click('.btn-start');
    await page.click('.btn-left');

    // Simulate game over by waiting
    await page.waitForTimeout(5000);

    const overlay = page.locator('.overlay');
    await expect(overlay).toBeVisible();
    await expect(overlay).toContainText('Game Over');
  });
});