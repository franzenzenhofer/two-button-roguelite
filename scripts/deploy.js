#!/usr/bin/env node
// Deployment script with pre/post checks - max 50 lines
import { execSync } from 'child_process';
import fs from 'fs';

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
};

const log = {
  info: (msg) => console.log(`${colors.blue}ℹ️  ${msg}${colors.reset}`),
  success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
};

function exec(cmd) {
  try {
    execSync(cmd, { stdio: 'inherit' });
    return true;
  } catch (e) {
    return false;
  }
}

async function deploy() {
  log.info('Starting deployment to roguelike.franzai.com...');

  // Build project
  if (!exec('npm run build')) {
    log.error('Build failed. Aborting deployment.');
    process.exit(1);
  }

  // Deploy to Cloudflare Workers
  log.info('Deploying to Cloudflare Workers...');
  if (!exec('wrangler deploy')) {
    log.error('Deployment failed.');
    process.exit(1);
  }

  log.success('Deployment successful!');
  log.info('Running post-deployment tests...');

  // Run post-deployment tests
  setTimeout(() => {
    exec('node scripts/post-deploy-tests.js');
  }, 5000); // Wait 5s for deployment to propagate
}

deploy();