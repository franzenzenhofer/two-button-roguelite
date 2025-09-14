#!/usr/bin/env node
// Simple live site test without puppeteer
import https from 'https';

const LIVE_URL = 'https://roguelike.franzai.com';

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, data }));
    }).on('error', reject);
  });
}

async function testLiveSite() {
  console.log('🔥 TESTING LIVE SITE - SIMPLE CHECK 🔥');

  try {
    // 1. Test main page loads
    console.log('Testing main page...');
    const main = await fetchUrl(LIVE_URL);
    if (main.status !== 200) {
      throw new Error(`Site returned ${main.status}`);
    }
    console.log('✅ Site is up (200 OK)');

    // 2. Check HTML content
    if (!main.data.includes('Two-Button Roguelite')) {
      throw new Error('Title not found in HTML');
    }
    console.log('✅ Title found');

    // 3. Check JS bundle loads
    console.log('Testing JS bundle...');
    const js = await fetchUrl(LIVE_URL + '/assets/index-DRrNtciM.js');
    if (js.status !== 200) {
      throw new Error(`JS bundle returned ${js.status}`);
    }
    console.log('✅ JS bundle loads');

    // 4. Check CSS loads
    console.log('Testing CSS...');
    const css = await fetchUrl(LIVE_URL + '/assets/index-DrrKZe6v.css');
    if (css.status !== 200) {
      throw new Error(`CSS returned ${css.status}`);
    }
    console.log('✅ CSS loads');

    // 5. Check version.json
    console.log('Testing version.json...');
    const version = await fetchUrl(LIVE_URL + '/version.json');
    if (version.status !== 200) {
      throw new Error(`Version.json returned ${version.status}`);
    }
    const versionData = JSON.parse(version.data);
    console.log(`✅ Version: ${versionData.version}`);

    // 6. Check JS contains game components
    if (!js.data.includes('Start Game')) {
      console.log('⚠️  Warning: "Start Game" text not found in JS bundle');
    }
    if (!js.data.includes('Demo')) {
      console.log('⚠️  Warning: "Demo" text not found in JS bundle');
    }

    console.log('');
    console.log('🎉 LIVE SITE BASIC TESTS PASSED! 🎉');
    console.log('The game assets are loading correctly.');
    console.log('');
    console.log('To fully test gameplay, open in browser:');
    console.log(`  ${LIVE_URL}`);
    console.log('');
    console.log('Check that:');
    console.log('  1. Start Game button is visible and clickable');
    console.log('  2. Demo Mode button is visible and works');
    console.log('  3. Game actually starts when clicked');

  } catch (error) {
    console.error('');
    console.error('❌ LIVE SITE TEST FAILED! ❌');
    console.error(error.message);
    process.exit(1);
  }
}

// Run tests
testLiveSite().catch(console.error);