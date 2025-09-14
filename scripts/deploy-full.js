#!/usr/bin/env node
// Complete deployment pipeline with version management - max 75 lines
import { execSync } from 'child_process';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  purple: '\x1b[35m'
};

const log = {
  info: (msg) => console.log(`${colors.blue}ℹ️  ${msg}${colors.reset}`),
  success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  warning: (msg) => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  section: (msg) => console.log(`\n${colors.purple}🚀 ${msg}${colors.reset}\n`)
};

function exec(cmd, silent = false) {
  try {
    return execSync(cmd, {
      cwd: rootDir,
      stdio: silent ? 'pipe' : 'inherit',
      encoding: 'utf8'
    });
  } catch (e) {
    if (!silent) log.error(`Failed: ${cmd}`);
    throw e;
  }
}

async function deploy() {
  log.section('COMPLETE DEPLOYMENT PIPELINE v2.0');

  try {
    // 1. Version bump
    log.info('Bumping version...');
    exec('npm version patch --no-git-tag-version');
    const pkg = JSON.parse(fs.readFileSync(join(rootDir, 'package.json'), 'utf8'));
    log.success(`Version: ${pkg.version}`);

    // 2. Generate version.json
    exec('node scripts/build-version.js');

    // 3. Run tests
    log.section('Running Quality Checks');
    exec('npm run test:unit');
    log.warning('Skipping lint for now - needs refactoring');
    exec('npm run typecheck');

    // 4. Build
    log.info('Building production...');
    exec('npm run build');

    // 5. Deploy to Cloudflare
    log.section('Deploying to roguelike.franzai.com');
    exec('wrangler deploy');

    // 6. Git commit & push
    log.info('Committing to Git...');
    exec('git add -A');
    exec(`git commit -m "Release v${pkg.version} - Auto deployment" || true`);
    exec('git tag -a v' + pkg.version + ' -m "Release v' + pkg.version + '"');
    exec('git push origin master --tags');

    // 7. Post-deploy tests - MANDATORY!
    log.info('Waiting for propagation...');
    await new Promise(r => setTimeout(r, 5000));
    log.section('TESTING LIVE SITE WITH PLAYWRIGHT!');

    // Run Playwright E2E tests on live site
    try {
      exec('npx playwright test e2e/live-site.spec.ts --reporter=list');
      log.success('Live site tests passed!');
    } catch (e) {
      log.error('LIVE SITE TESTS FAILED!');
      log.error('The game is BROKEN on production!');

      // Run debug script to understand why
      exec('node scripts/debug-live-site.js --headless', true);

      throw new Error('DEPLOYMENT FAILED - GAME DOES NOT WORK!');
    }

    log.section(`🎉 DEPLOYED v${pkg.version} to https://roguelike.franzai.com`);
  } catch (e) {
    log.error('Deployment failed!');
    process.exit(1);
  }
}

deploy();