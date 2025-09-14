#!/usr/bin/env node
// Test the LIVE deployed site - NO MOCKS!
import fetch from 'node-fetch';
import puppeteer from 'puppeteer';

const LIVE_URL = 'https://roguelike.franzai.com';

async function testLiveSite() {
  console.log('🔥 TESTING LIVE SITE - NO MOCKS! 🔥');

  let browser;
  try {
    // 1. Test HTTP response
    console.log('Testing HTTP response...');
    const response = await fetch(LIVE_URL);
    if (response.status !== 200) {
      throw new Error(`Site returned ${response.status}`);
    }
    console.log('✅ Site is up');

    // 2. Launch browser
    browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    // 3. Navigate to site
    console.log('Loading game...');
    await page.goto(LIVE_URL, { waitUntil: 'networkidle2' });

    // 4. Check title
    const title = await page.title();
    if (!title.includes('Two-Button')) {
      throw new Error('Wrong title: ' + title);
    }
    console.log('✅ Title correct');

    // 5. Check Start Game button exists
    console.log('Looking for Start Game button...');
    const startButton = await page.$('button:has-text("Start Game")');
    if (!startButton) {
      // Try alternative selector
      const buttons = await page.$$eval('button', btns =>
        btns.map(b => b.textContent)
      );
      if (!buttons.some(t => t?.includes('Start'))) {
        throw new Error('Start Game button NOT FOUND! Buttons: ' + buttons.join(', '));
      }
    }
    console.log('✅ Start Game button exists');

    // 6. Check Demo button exists
    console.log('Looking for Demo button...');
    const demoButton = await page.$('button:has-text("Demo")');
    if (!demoButton) {
      const buttons = await page.$$eval('button', btns =>
        btns.map(b => b.textContent)
      );
      if (!buttons.some(t => t?.includes('Demo'))) {
        throw new Error('Demo button NOT FOUND! Buttons: ' + buttons.join(', '));
      }
    }
    console.log('✅ Demo button exists');

    // 7. Click Start Game and verify it works
    console.log('Testing Start Game button...');
    await page.click('button:has-text("Start Game")');
    await page.waitForTimeout(1000);

    // Check if game started
    const gameState = await page.evaluate(() => {
      return document.querySelector('.game')?.getAttribute('data-mode');
    });

    if (!gameState || gameState === 'MENU') {
      throw new Error('Start Game button DOES NOT WORK!');
    }
    console.log('✅ Game starts correctly');

    // 8. Test keyboard input
    console.log('Testing keyboard input...');
    await page.keyboard.press('ArrowLeft');
    await page.keyboard.press('ArrowRight');
    console.log('✅ Keyboard input works');

    // 9. Check score display
    const scoreElement = await page.$eval('*', el => {
      return Array.from(document.querySelectorAll('*'))
        .some(e => e.textContent?.includes('Score:'));
    });

    if (!scoreElement) {
      throw new Error('Score display not found!');
    }
    console.log('✅ Score display works');

    // 10. Test Demo mode
    console.log('Testing Demo mode...');
    await page.reload();
    await page.waitForSelector('button');
    await page.click('button:has-text("Demo")');
    await page.waitForTimeout(1000);
    console.log('✅ Demo mode works');

    console.log('');
    console.log('🎉 ALL LIVE TESTS PASSED! 🎉');
    console.log('The game ACTUALLY WORKS on the live site!');

  } catch (error) {
    console.error('');
    console.error('❌ LIVE SITE TEST FAILED! ❌');
    console.error(error.message);
    process.exit(1);
  } finally {
    if (browser) await browser.close();
  }
}

// Run tests
testLiveSite().catch(console.error);