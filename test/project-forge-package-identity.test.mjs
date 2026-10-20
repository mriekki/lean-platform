import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';

const root = path.resolve(import.meta.dirname, '..');

function readJson(relative) {
  return JSON.parse(
    fs.readFileSync(path.join(root, relative), 'utf8'),
  );
}

function walk(relative) {
  const absolute = path.join(root, relative);

  if (!fs.existsSync(absolute)) return [];

  if (fs.statSync(absolute).isFile()) {
    return [relative];
  }

  const result = [];

  for (
    const entry of fs.readdirSync(
      absolute,
      { withFileTypes: true },
    )
  ) {
    const child = path.join(relative, entry.name);

    if (entry.isDirectory()) {
      result.push(...walk(child));
    } else if (entry.isFile()) {
      result.push(child);
    }
  }

  return result;
}

test('canonical Project Forge npm package identity', () => {
  const pkg = readJson('package.json');
  const lock = readJson('package-lock.json');
  const components = readJson('assets/components.json');

  assert.equal(pkg.name, '@mriekki/project-forge');
  assert.equal(pkg.version, '1.0.0');

  assert.deepEqual(pkg.bin, {
    'project-forge': 'bin/project-forge.mjs',
  });

  assert.equal(lock.name, pkg.name);
  assert.equal(lock.version, pkg.version);
  assert.equal(lock.packages[''].name, pkg.name);
  assert.equal(lock.packages[''].version, pkg.version);
  assert.deepEqual(lock.packages[''].bin, pkg.bin);

  assert.equal(components.package, pkg.name);
  assert.equal(components.version, pkg.version);
  assert.equal(
    components.defaultProfile,
    'greenfield-project',
  );

  assert.equal(
    components.components.core.repository,
    'mriekki/project-forge-core',
  );

  assert.equal(
    components.components.core.commit,
    '78065f0ab59506e8cc703f6bf7dfd31fc71f313f',
  );

  assert.equal(
    components.components.core.version,
    '2.0.0',
  );

  assert.equal(
    components.components.deployment.repository,
    'mriekki/project-forge-deployment-kit',
  );

  assert.equal(
    components.components.deployment.commit,
    '54fcc256c525ea8762568043c3900f4d2d36c816',
  );

  assert.equal(
    components.components.deployment.distribution,
    'greenfield-project',
  );
});

test('CLI apply success line uses canonical Project Forge identity', () => {
  const cli = fs.readFileSync(
    path.join(root, 'src', 'cli.mjs'),
    'utf8',
  );

  assert.match(
    cli,
    /console\.log\(`\\nProject Forge \$\{command\}: PASS \(\$\{packageData\.pkg\.name\}@\$\{packageData\.pkg\.version\}\)`\);/,
  );
});

test('package and release surfaces contain no retired identity', () => {
  const lower = 'le' + 'an';
  const title = lower[0].toUpperCase() + lower.slice(1);
  const upper = lower.toUpperCase();

  const pattern = new RegExp(
    `(?<![A-Za-z0-9])(?:${lower}|${title}|${upper})` +
      `(?:(?=[^A-Za-z0-9]|$)|(?=[A-Z]))|` +
      `${title}(?=[A-Z])`,
  );

  const roots = [
    'package.json',
    'package-lock.json',
    'README.md',
    'bin',
    'src',
    'scripts',
    'assets',
    'docs/RELEASE_PROCESS.md',
    '.github/skills',
    '.github/workflows',
    'test/assembly.test.mjs',
    'test/cli.test.mjs',
    'test/engine.test.mjs',
    'test/release.test.mjs',
    'test/project-forge-package-identity.test.mjs',
  ];

  const hits = [];

  for (const relative of roots.flatMap(walk)) {
    if (pattern.test(relative)) {
      hits.push(`PATH ${relative}`);
    }

    const absolute = path.join(root, relative);
    const text = fs.readFileSync(absolute, 'utf8');

    text.split(/\r?\n/).forEach((line, index) => {
      if (pattern.test(line)) {
        hits.push(
          `${relative}:${index + 1}:${line.trim()}`,
        );
      }
    });
  }

  assert.deepEqual(hits, []);
});
