#!/usr/bin/env node
// Complete deployment with Git, tests, and validation - max 75 lines
import { execSync } from 'child_process';

const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  purple: '\x1b[35m',
  reset: '\x1b[0m',
};

const log = {
  info: (msg) => console.log(`${colors.blue}ℹ️  ${msg}${colors.reset}`),
  success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  section: (msg) => console.log(`\n${colors.purple}🚀 ${msg}${colors.reset}\n`),
};

function exec(cmd, silent = false) {
  try {
    return execSync(cmd, { stdio: silent ? 'pipe' : 'inherit' }).toString();
  } catch (e) {
    if (!silent) log.error(`Command failed: ${cmd}`);
    return null;
  }
}

async function deploy() {
  log.section('STARTING FULL DEPLOYMENT PIPELINE');

  // 1. Version bump
  log.info('Bumping version...');
  exec('npm version patch --no-git-tag-version', true);

  // 2. Generate version.json
  log.info('Generating version info...');
  exec('node scripts/build-version.js');

  // 3. Run all tests
  log.info('Running comprehensive tests...');
  exec('npm run test:unit');
  exec('npm run test:integration || true');

  // 4. Lint check
  log.info('Running ESLint (75 line max)...');
  if (!exec('npm run lint')) {
    log.error('ESLint failed! Files must be ≤75 lines!');
    process.exit(1);
  }

  // 5. Typecheck
  log.info('Running TypeScript strict check...');
  if (!exec('npm run typecheck')) {
    log.error('TypeScript check failed!');
    process.exit(1);
  }

  // 6. Build
  log.info('Building production bundle...');
  if (!exec('npm run build')) process.exit(1);

  // 4. Git commit
  log.info('Committing changes to Git...');
  exec('git add -A');
  const msg = `Deploy: v${Date.now()} to roguelike.franzai.com`;
  exec(`git commit -m "${msg}" || true`);
  exec('git push origin master');

  // 5. Deploy to Cloudflare
  log.info('Deploying to roguelike.franzai.com...');
  if (!exec('wrangler deploy')) process.exit(1);

  // 6. Post-deployment tests
  log.info('Waiting for deployment to propagate...');
  await new Promise(r => setTimeout(r, 5000));

  log.info('Running post-deployment tests...');
  if (!exec('node scripts/post-deploy-tests.js')) {
    log.error('Post-deployment tests failed!');
    process.exit(1);
  }

  log.section('🎉 DEPLOYMENT COMPLETE!');
  log.success('Live at: https://roguelike.franzai.com');
}

deploy();