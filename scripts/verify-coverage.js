#!/usr/bin/env node
// Verify 100% test coverage - NO COMPROMISE!
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const coverageFile = join(__dirname, '../coverage/coverage-final.json');

const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  reset: '\x1b[0m',
};

try {
  const coverage = JSON.parse(fs.readFileSync(coverageFile, 'utf8'));
  let failed = false;

  for (const [file, data] of Object.entries(coverage)) {
    const statements = data.s;
    const branches = data.b;
    const functions = data.f;

    // Check statements
    for (const [key, count] of Object.entries(statements)) {
      if (count === 0) {
        console.error(`${colors.red}❌ Uncovered statement in ${file}${colors.reset}`);
        failed = true;
      }
    }

    // Check branches
    for (const [key, counts] of Object.entries(branches)) {
      if (counts.some(c => c === 0)) {
        console.error(`${colors.red}❌ Uncovered branch in ${file}${colors.reset}`);
        failed = true;
      }
    }

    // Check functions
    for (const [key, count] of Object.entries(functions)) {
      if (count === 0) {
        console.error(`${colors.red}❌ Uncovered function in ${file}${colors.reset}`);
        failed = true;
      }
    }
  }

  if (failed) {
    console.error(`\n${colors.red}🚨 COVERAGE IS NOT 100%! BUILD FAILED!${colors.reset}`);
    process.exit(1);
  }

  console.log(`${colors.green}✅ Coverage is 100%! All tests passing!${colors.reset}`);
} catch (e) {
  console.error(`${colors.red}❌ Could not read coverage file${colors.reset}`);
  process.exit(1);
}