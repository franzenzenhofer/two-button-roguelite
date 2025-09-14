#!/usr/bin/env node
// Post-deployment validation tests - max 50 lines
import https from 'https';

const SITE_URL = 'https://roguelike.franzai.com';
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  reset: '\x1b[0m',
};

const tests = [
  { name: 'Site accessible', url: '/', expect: 200 },
  { name: 'Game loads', url: '/', contains: 'Two-Button' },
  { name: 'CSS loads', url: '/', contains: '.css' },
  { name: 'JS loads', url: '/', contains: '.js' },
  { name: 'Security headers', url: '/', header: 'X-Content-Type-Options' },
  { name: 'Cache headers', url: '/', header: 'Cache-Control' },
];

async function testUrl(url, contains, header) {
  return new Promise((resolve) => {
    https.get(SITE_URL + url, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        const result = { status: res.statusCode, headers: res.headers };
        if (contains) result.contains = data.includes(contains);
        if (header) result.hasHeader = !!res.headers[header.toLowerCase()];
        resolve(result);
      });
    }).on('error', () => resolve({ status: 0 }));
  });
}

async function runTests() {
  console.log(`\n🧪 Testing ${SITE_URL}...\n`);
  let failed = 0;

  for (const test of tests) {
    const result = await testUrl(test.url, test.contains, test.header);
    const passed = (test.expect && result.status === test.expect) ||
                   (test.contains && result.contains) ||
                   (test.header && result.hasHeader);

    console.log(`${passed ? colors.green + '✅' : colors.red + '❌'} ${test.name}${colors.reset}`);
    if (!passed) failed++;
  }

  console.log(`\n${failed === 0 ? colors.green + '🎉 All tests passed!' : colors.red + `❌ ${failed} tests failed`}${colors.reset}`);
  process.exit(failed === 0 ? 0 : 1);
}

runTests();