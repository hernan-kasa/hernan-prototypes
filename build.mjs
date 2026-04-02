import { execSync } from 'child_process';
import { cpSync, mkdirSync, readdirSync, existsSync, writeFileSync } from 'fs';
import { join } from 'path';

const prototypesDir = join(import.meta.dirname, 'prototypes');
const distDir = join(import.meta.dirname, 'dist');

// Clean and create dist
mkdirSync(distDir, { recursive: true });

// Copy root landing page
cpSync(join(import.meta.dirname, 'public'), distDir, { recursive: true });

// Build each prototype and copy output to dist/<name>/
const prototypes = readdirSync(prototypesDir, { withFileTypes: true })
  .filter(d => d.isDirectory() && existsSync(join(prototypesDir, d.name, 'package.json')));

for (const proto of prototypes) {
  const dir = join(prototypesDir, proto.name);
  console.log(`\n--- Building ${proto.name} ---`);
  execSync('npm install && npm run build', { cwd: dir, stdio: 'inherit' });
  cpSync(join(dir, 'dist'), join(distDir, proto.name), { recursive: true });
}

// Write _redirects file for Netlify (proxy + SPA rules)
const redirects = [
  '/promo-codes/api/*  https://promo-codes-api-production.up.railway.app/api/:splat  200!',
  '/contract-to-rate-plan/api/*  https://contract-to-rate-plan-api-production.up.railway.app/api/:splat  200!',
  '/payment-assigner/*  /payment-assigner/index.html  200',
  '/promo-codes/*  /promo-codes/index.html  200',
  '/konnect/*  /konnect/index.html  200',
  '/contract-to-rate-plan/*  /contract-to-rate-plan/index.html  200',
  '/kontrol-finance/*  /kontrol-finance/index.html  200',
].join('\n');
writeFileSync(join(distDir, '_redirects'), redirects + '\n');

console.log(`\nBuilt ${prototypes.length} prototypes into dist/`);
