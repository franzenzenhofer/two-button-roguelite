#!/usr/bin/env node
// Debug why the game doesn't work
import { chromium } from '@playwright/test';

const LIVE_URL = 'https://roguelike.franzai.com';

async function debugSite() {
  console.log('🔍 DEBUGGING LIVE SITE...\n');

  const browser = await chromium.launch({
    headless: false,  // Show browser
    devtools: true    // Open DevTools
  });

  const page = await browser.newPage();

  // Capture console messages
  page.on('console', msg => {
    console.log(`[${msg.type()}] ${msg.text()}`);
  });

  // Capture errors
  page.on('pageerror', err => {
    console.log('❌ PAGE ERROR:', err.message);
  });

  await page.goto(LIVE_URL);

  console.log('\n📋 Initial state:');

  // Get game state
  const gameState = await page.evaluate(() => {
    const gameContainer = document.querySelector('.game-container');
    const overlay = document.querySelector('.overlay');
    const startButton = document.querySelector('button.btn-start');

    return {
      gameContainerExists: !!gameContainer,
      overlayVisible: overlay ? window.getComputedStyle(overlay).display !== 'none' : false,
      startButtonExists: !!startButton,
      startButtonText: startButton?.textContent,
      startButtonDisabled: startButton?.disabled
    };
  });

  console.log('Game state:', gameState);

  console.log('\n🖱️ Clicking Start Game button...');

  // Try to click Start Game
  await page.click('button:has-text("Start Game")');

  await page.waitForTimeout(2000);

  // Check state after click
  const afterClick = await page.evaluate(() => {
    const overlay = document.querySelector('.overlay');
    const gameMode = document.querySelector('[data-mode]')?.getAttribute('data-mode');

    // Check React state
    const reactState = window.__REACT_DEVTOOLS_GLOBAL_HOOK__?.renderers?.values()?.next()?.value;

    return {
      overlayStillVisible: overlay ? window.getComputedStyle(overlay).display !== 'none' : false,
      gameMode: gameMode,
      reactAvailable: !!reactState
    };
  });

  console.log('\n📋 After clicking:');
  console.log('State:', afterClick);

  // Check for JavaScript errors
  const errors = await page.evaluate(() => {
    return window.__errors || [];
  });

  if (errors.length > 0) {
    console.log('\n❌ JavaScript errors found:', errors);
  }

  // Get dispatch function
  const dispatchExists = await page.evaluate(() => {
    // Try to find the dispatch function
    const buttons = document.querySelectorAll('button');
    for (const button of buttons) {
      const props = button._reactProps || button.__reactProps;
      if (props?.onClick) {
        return true;
      }
    }
    return false;
  });

  console.log('\n🔧 Debug info:');
  console.log('Dispatch/onClick exists:', dispatchExists);

  console.log('\n💡 Press Ctrl+C to exit...');

  // Keep browser open
  await new Promise(() => {});
}

debugSite().catch(console.error);