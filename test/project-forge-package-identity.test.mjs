import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';

const root = path.resolve(import.meta.dirname, '..');
const exactSha = /^[0-9a-f]{40}$/;
const semver = /^(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)(?:-[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?(?:\+[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?$/;

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
  assert.match(pkg.version, semver);

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
  assert.deepEqual(
    components.profiles[components.defaultProfile].components,
    ['core', 'deployment'],
  );

  assert.equal(
    components.components.core.repository,
    'mriekki/project-forge-core',
  );
  assert.match(components.components.core.commit, exactSha);
  assert.match(components.components.core.version, semver);
  assert.equal(
    components.components.core.distribution,
    'greenfield-workspace',
  );
  assert.equal(
    components.components.core.descriptor,
    'assets/core/distribution.json',
  );
  assert.equal(
    components.components.core.canonicalDescriptor,
    'distributions/greenfield-workspace.json',
  );

  assert.equal(
    components.components.deployment.repository,
    'mriekki/project-forge-deployment-kit',
  );
  assert.match(components.components.deployment.commit, exactSha);
  assert.equal(
    components.components.deployment.distribution,
    'greenfield-project',
  );
  assert.equal(
    components.components.deployment.descriptor,
    'assets/deployment/distribution.json',
  );
  assert.equal(
    components.components.deployment.canonicalDescriptor,
    'distributions/greenfield-project.json',
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

test('package and release surfaces contain no retired identity or predecessor project terminology', () => {
  const lower = 'le' + 'an';
  const title = lower[0].toUpperCase() + lower.slice(1);
  const upper = lower.toUpperCase();
  const predecessor = 'po' + 'c';

  const retiredIdentityPattern = new RegExp(
    `(?<![A-Za-z0-9])(?:${lower}|${title}|${upper})` +
      `(?:(?=[^A-Za-z0-9]|$)|(?=[A-Z]))|` +
      `${title}(?=[A-Z])`,
  );
  const predecessorProjectPattern = new RegExp(
    `(?:\\b${predecessor}s?\\b|${predecessor}[-_])`,
    'i',
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
    if (
      retiredIdentityPattern.test(relative) ||
      predecessorProjectPattern.test(relative)
    ) {
      hits.push(`PATH ${relative}`);
    }

    const absolute = path.join(root, relative);
    const text = fs.readFileSync(absolute, 'utf8');

    text.split(/\r?\n/).forEach((line, index) => {
      if (
        retiredIdentityPattern.test(line) ||
        predecessorProjectPattern.test(line)
      ) {
        hits.push(
          `${relative}:${index + 1}:${line.trim()}`,
        );
      }
    });
  }

  assert.deepEqual(hits, []);
});
