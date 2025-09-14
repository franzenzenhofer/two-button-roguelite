#!/usr/bin/env node
// Test demo mode functionality
import puppeteer from 'puppeteer';

const URL = 'http://localhost:3000';

async function testDemoMode() {
  console.log('🎮 TESTING DEMO MODE FUNCTIONALITY 🎮\n');

  const browser = await puppeteer.launch({
    headless: false,  // Show browser to see what's happening
    args: ['--no-sandbox']
  });

  try {
    const page = await browser.newPage();

    // Enable console logging
    page.on('console', msg => {
      const text = msg.text();
      if (text.includes('DEMO')) {
        console.log('📝 Console:', text);
      }
    });

    console.log('Loading game...');
    await page.goto(URL);
    await new Promise(r => setTimeout(r, 1000));

    // First start the game
    console.log('Starting game...');
    await page.click('button.btn-start');
    await new Promise(r => setTimeout(r, 1000));

    // Now try demo mode
    console.log('Clicking Demo button...');
    const demoBtn = await page.$('button.btn-demo');

    if (!demoBtn) {
      console.log('❌ Demo button not found!');
      return;
    }

    await demoBtn.click();
    await new Promise(r => setTimeout(r, 2000));

    // Check if demo is running
    const demoState = await page.evaluate(() => {
      const btn = document.querySelector('button.btn-demo');
      const logs = document.querySelector('.demo-logs');
      return {
        buttonText: btn?.textContent,
        hasStopText: btn?.textContent?.includes('Stop'),
        logsVisible: !!logs,
        logsContent: logs?.textContent
      };
    });

    console.log('\nDemo state:', demoState);

    if (demoState.hasStopText) {
      console.log('✅ Demo mode is running!');
    } else {
      console.log('❌ Demo mode NOT working!');
    }

    // Keep browser open for 5 seconds to observe
    console.log('\nObserving for 5 seconds...');
    await new Promise(r => setTimeout(r, 5000));

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await browser.close();
  }
}

testDemoMode().catch(console.error);