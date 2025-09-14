#!/usr/bin/env node
// Test local dev server with chromium headless
import puppeteer from 'puppeteer';

const URL = 'http://localhost:3000';

async function testLocal() {
  console.log('🔥 TESTING LOCAL DEV SERVER WITH CHROMIUM 🔥\n');

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();

    // Enable console logging
    page.on('console', msg => {
      const type = msg.type();
      const text = msg.text();
      if (type === 'error') {
        console.log('❌ JS Error:', text);
      } else if (text.includes('DEMO')) {
        console.log('🎮', text);
      }
    });

    console.log('Loading game...');
    await page.goto(URL, { waitUntil: 'networkidle0' });

    // Get initial state
    const initialState = await page.evaluate(() => {
      const startBtn = document.querySelector('button.btn-start');
      const demoBtn = document.querySelector('button.btn-demo');
      return {
        startButton: startBtn?.textContent,
        demoButton: demoBtn?.textContent,
        overlayVisible: !!document.querySelector('.overlay')
      };
    });

    console.log('Initial state:', initialState);

    // Test Start Game button
    console.log('\n🖱️ Clicking Start Game...');
    await page.click('button.btn-start');
    await new Promise(r => setTimeout(r, 1000));

    const afterStart = await page.evaluate(() => {
      const overlay = document.querySelector('.overlay');
      return {
        overlayStillVisible: !!overlay && window.getComputedStyle(overlay).display !== 'none'
      };
    });

    if (afterStart.overlayStillVisible) {
      console.log('❌ START BUTTON DOES NOT WORK! Menu still visible!');
    } else {
      console.log('✅ Start button works - game started');
    }

    // Reload and test Demo button
    await page.reload();
    await new Promise(r => setTimeout(r, 1000));

    console.log('\n🎮 Clicking Demo button...');
    await page.click('button.btn-demo');
    await new Promise(r => setTimeout(r, 2000));

    const demoState = await page.evaluate(() => {
      const demoBtn = document.querySelector('button.btn-demo');
      return {
        demoButtonText: demoBtn?.textContent,
        hasStopText: demoBtn?.textContent?.includes('Stop')
      };
    });

    if (!demoState.hasStopText) {
      console.log('❌ DEMO BUTTON DOES NOT WORK!');
      console.log('Button text:', demoState.demoButtonText);
    } else {
      console.log('✅ Demo mode started');
    }

    // Take screenshots
    await page.screenshot({ path: '/tmp/local-test.png' });
    console.log('\n📸 Screenshot saved: /tmp/local-test.png');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await browser.close();
  }
}

// Check if puppeteer is installed
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function main() {
  try {
    await testLocal();
  } catch (error) {
    if (error.code === 'MODULE_NOT_FOUND') {
      console.log('Installing puppeteer...');
      await execAsync('npm install puppeteer');
      await testLocal();
    } else {
      throw error;
    }
  }
}

main().catch(console.error);