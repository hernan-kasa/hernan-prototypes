import { execSync } from 'child_process';
import { cpSync, mkdirSync, readdirSync, existsSync } from 'fs';
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

console.log(`\nBuilt ${prototypes.length} prototypes into dist/`);
