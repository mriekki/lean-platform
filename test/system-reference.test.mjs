import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

async function text(relative) {
  return readFile(path.join(root, relative), 'utf8');
}

const DESIGN = 'docs/system/PROJECT_FORGE_SYSTEM_DESIGN.md';
const REQUIREMENTS = 'docs/system/PROJECT_FORGE_SYSTEM_REQUIREMENTS.md';

const foundationalRepos = [
  'project-forge-core',
  'project-forge-bootstrap',
  'project-forge-deployment-kit',
  'project-forge-adoption-kit',
  'project-forge-platform',
  'project-forge-control-plane',
];

test('canonical Project Forge system reference covers every foundational repository', async () => {
  const design = await text(DESIGN);
  const requirements = await text(REQUIREMENTS);

  for (const repo of foundationalRepos) {
    assert.match(design, new RegExp(repo), `${DESIGN} should cover ${repo}`);
    assert.match(requirements, new RegExp(repo), `${REQUIREMENTS} should cover ${repo}`);
  }

  assert.match(design, /consumer/i);
  assert.match(requirements, /consumer/i);
  assert.match(design, /Generated or adopted software repositories are \*\*consumers\*\*/);
});

test('system requirements use stable unique PF-SYS identifiers', async () => {
  const requirements = await text(REQUIREMENTS);
  const ids = requirements.match(/PF-SYS-\d{3}/g) ?? [];
  const unique = new Set(ids);

  assert.ok(ids.length >= 50, `expected a substantial system contract, found ${ids.length} requirement IDs`);
  assert.equal(ids.length, unique.size, 'PF-SYS requirement IDs must be unique');
});

test('system reference distinguishes normative requirements from live implementation evidence', async () => {
  const design = await text(DESIGN);
  const requirements = await text(REQUIREMENTS);

  assert.match(design, /normative/i);
  assert.match(design, /current implementation evidence/i);
  assert.match(requirements, /If implementation and a requirement disagree, the discrepancy MUST be surfaced/);
  assert.match(requirements, /MUST NOT be silently reconciled/);
});

test('system design points mutable facts to machine-readable owning sources', async () => {
  const design = await text(DESIGN);

  for (const required of [
    'assets/components.json',
    'chatgpt/current.json',
    'catalog/CATALOG.json',
    'PROJECT_BOOTSTRAP.json',
    'PROJECT_FORGE_BASELINE.json',
    'CORE_BASELINE.json',
    'DEPLOYMENT_BASELINE.json',
  ]) {
    assert.match(design, new RegExp(required.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')), required);
  }
});

test('system reference does not become a duplicate volatile version ledger', async () => {
  const combined = `${await text(DESIGN)}\n${await text(REQUIREMENTS)}`;

  assert.doesNotMatch(combined, /\b[0-9a-f]{40}\b/, 'system docs must not pin current commit SHAs');
  assert.doesNotMatch(combined, /@mriekki\/project-forge@\d+\.\d+\.\d+/, 'system docs must not pin a current package version');
  assert.match(combined, /MUST NOT maintain duplicate current commit-SHA, package-version, catalog-version, issue-status, or support-status ledgers/);
});

test('Platform README exposes the canonical maintainer system reference', async () => {
  const readme = await text('README.md');

  assert.match(readme, /Maintainer system reference/);
  assert.match(readme, /docs\/system\/PROJECT_FORGE_SYSTEM_REQUIREMENTS\.md/);
  assert.match(readme, /docs\/system\/PROJECT_FORGE_SYSTEM_DESIGN\.md/);
});
