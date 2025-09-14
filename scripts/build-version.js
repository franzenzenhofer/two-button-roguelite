#!/usr/bin/env node
// Generate version.json with current version and deploy time
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

// Read package.json
const packageJson = JSON.parse(fs.readFileSync(join(rootDir, 'package.json'), 'utf8'));

// Create version.json
const versionData = {
  version: packageJson.version,
  deployTime: new Date().toISOString(),
  commit: process.env.GITHUB_SHA || 'local',
  environment: process.env.NODE_ENV || 'production',
};

// Write to public directory for static serving
fs.writeFileSync(
  join(rootDir, 'public', 'version.json'),
  JSON.stringify(versionData, null, 2)
);

console.log(`✅ Version ${versionData.version} generated at ${versionData.deployTime}`);