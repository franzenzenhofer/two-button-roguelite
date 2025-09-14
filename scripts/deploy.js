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
  log.info('Starting deployment...');

  // Pre-deployment checks
  if (!exec('npm run test:coverage')) {
    log.error('Tests failed. Aborting deployment.');
    process.exit(1);
  }

  if (!exec('npm run lint')) {
    log.error('Linting failed. Aborting deployment.');
    process.exit(1);
  }

  if (!exec('npm run typecheck')) {
    log.error('TypeScript check failed. Aborting deployment.');
    process.exit(1);
  }

  log.info('Deploying to Cloudflare Pages...');
  if (!exec('wrangler pages deploy dist --project-name=two-button-roguelite')) {
    log.error('Deployment failed.');
    process.exit(1);
  }

  log.success('Deployment successful!');
}

deploy();