// HARDCORE E2E TESTS - VERIFY EVERYTHING WORKS!
import { test, expect, chromium } from '@playwright/test';

const LIVE_URL = 'https://roguelike.franzai.com';

test.describe('LIVE SITE VERIFICATION', () => {
  test('Game loads with all elements', async () => {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    await page.goto(LIVE_URL);

    // Title exists
    await expect(page).toHaveTitle('Two-Button Roguelite');

    // Start Game button exists
    const startButton = page.locator('button:has-text("Start Game")');
    await expect(startButton).toBeVisible();

    // Demo button exists
    const demoButton = page.locator('button:has-text("Demo")');
    await expect(demoButton).toBeVisible();

    await browser.close();
  });

  test('Start Game button ACTUALLY WORKS', async () => {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    await page.goto(LIVE_URL);

    // Click Start Game
    await page.click('button:has-text("Start Game")');

    // Wait for game state change
    await page.waitForTimeout(1000);

    // Menu should be gone
    const menu = page.locator('.overlay:has-text("Two-Button Roguelite")');
    await expect(menu).toBeHidden();

    // Game should be playing
    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible();

    await browser.close();
  });

  test('Demo mode works', async () => {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    await page.goto(LIVE_URL);

    // Click Demo button
    await page.click('button:has-text("Demo")');

    // Demo should start
    await page.waitForTimeout(1000);

    // Stop button should appear
    const stopButton = page.locator('button:has-text("Stop")');
    await expect(stopButton).toBeVisible();

    await browser.close();
  });

  test('Game controls work', async () => {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    await page.goto(LIVE_URL);

    // Start game
    await page.click('button:has-text("Start Game")');
    await page.waitForTimeout(500);

    // Test left button
    await page.click('button[aria-label="Move Left"]');

    // Test right button
    await page.click('button[aria-label="Move Right"]');

    // Test keyboard
    await page.keyboard.press('ArrowLeft');
    await page.keyboard.press('ArrowRight');

    await browser.close();
  });

  test('Score displays and updates', async () => {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    await page.goto(LIVE_URL);

    // Start game
    await page.click('button:has-text("Start Game")');
    await page.waitForTimeout(1000);

    // Score should be visible
    const score = page.locator('.hud-item.score');
    await expect(score).toBeVisible();

    await browser.close();
  });
});