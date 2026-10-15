import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const PACKAGE_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

export function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

export function loadPackageData(root = PACKAGE_ROOT) {
  const pkg = readJson(path.join(root, 'package.json'));
  const assets = readJson(path.join(root, 'assets', 'components.json'));
  if (pkg.name !== assets.package || pkg.version !== assets.version) {
    throw new Error('package.json and assets/components.json version metadata do not match');
  }
  return { root, pkg, assets };
}
