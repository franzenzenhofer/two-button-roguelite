#!/usr/bin/env node
// Post-deployment validation - max 50 lines
import https from 'https';

const DEPLOY_URL = 'https://two-button.franzai.com';
const CHECKS = [
  { name: 'HTTP 200', path: '/' },
  { name: 'Game loads', path: '/', contains: 'Two-Button' },
];

async function checkUrl(url, contains) {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        if (res.statusCode !== 200) {
          resolve(false);
        } else if (contains) {
          resolve(data.includes(contains));
        } else {
          resolve(true);
        }
      });
    }).on('error', () => resolve(false));
  });
}

async function validate() {
  console.log('🔍 Validating deployment...\n');

  for (const check of CHECKS) {
    const url = `${DEPLOY_URL}${check.path}`;
    const passed = await checkUrl(url, check.contains);

    if (passed) {
      console.log(`✅ ${check.name}`);
    } else {
      console.log(`❌ ${check.name} failed`);
      process.exit(1);
    }
  }

  console.log('\n🎉 All post-deployment checks passed!');
  console.log(`🌐 Live at: ${DEPLOY_URL}`);
}

validate();