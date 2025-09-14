#!/usr/bin/env node
// Test with Playwright - REAL browser testing!
import { chromium } from '@playwright/test';

const LIVE_URL = 'https://roguelike.franzai.com';

async function testWithPlaywright() {
  console.log('🔥 TESTING WITH PLAYWRIGHT - REAL BROWSER! 🔥');

  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const context = await browser.newContext();
    const page = await context.newPage();

    // Add console logging
    page.on('console', msg => {
      if (msg.type() === 'error') {
        console.log('❌ Browser Error:', msg.text());
      }
    });

    console.log('Loading game...');
    await page.goto(LIVE_URL, { waitUntil: 'networkidle' });

    // Take screenshot of initial state
    await page.screenshot({ path: '/tmp/game-initial.png' });
    console.log('📸 Screenshot saved: /tmp/game-initial.png');

    // Check title
    const title = await page.title();
    console.log(`Title: ${title}`);

    // Look for Start Game button
    console.log('\nLooking for Start Game button...');
    const startButton = await page.locator('button:has-text("Start Game")').first();
    const startButtonExists = await startButton.count() > 0;

    if (!startButtonExists) {
      console.log('❌ Start Game button NOT FOUND!');

      // Get all button texts
      const buttons = await page.locator('button').allTextContents();
      console.log('Found buttons:', buttons);

      // Get all text on page
      const bodyText = await page.locator('body').textContent();
      console.log('\nPage text:', bodyText?.substring(0, 500));
    } else {
      console.log('✅ Start Game button found');

      // Try to click it
      console.log('Clicking Start Game...');
      await startButton.click();
      await page.waitForTimeout(1000);

      // Take screenshot after click
      await page.screenshot({ path: '/tmp/game-after-click.png' });
      console.log('📸 Screenshot after click: /tmp/game-after-click.png');
    }

    // Look for Demo button
    console.log('\nLooking for Demo button...');
    const demoButton = await page.locator('button:has-text("Demo")').first();
    const demoButtonExists = await demoButton.count() > 0;

    if (!demoButtonExists) {
      console.log('❌ Demo button NOT FOUND!');
    } else {
      console.log('✅ Demo button found');
    }

    // Check for JavaScript errors
    const errors = await page.evaluate(() => {
      return window.errors || [];
    });

    if (errors.length > 0) {
      console.log('\n❌ JavaScript errors:', errors);
    }

    // Get the actual HTML structure
    console.log('\n📝 HTML Structure:');
    const html = await page.locator('.app').innerHTML().catch(() => null);
    if (html) {
      console.log(html.substring(0, 1000));
    } else {
      const bodyHtml = await page.locator('body').innerHTML();
      console.log(bodyHtml.substring(0, 1000));
    }

  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await browser.close();
  }
}

testWithPlaywright().catch(console.error);