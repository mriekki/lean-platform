import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const predecessorUpper = ['P', 'OC'].join('');
const predecessorLower = predecessorUpper.toLowerCase();

async function text(relative) {
  return readFile(path.join(root, relative), 'utf8');
}

function canonicalGitBlob(relative) {
  const result = spawnSync('git', ['show', `HEAD:${relative}`], {
    cwd: root,
    encoding: null,
    maxBuffer: 1024 * 1024,
  });
  assert.equal(result.status, 0, `Unable to read canonical Git blob ${relative}: ${result.stderr?.toString() ?? ''}`);
  return result.stdout;
}

async function descriptor() {
  return JSON.parse(await text('chatgpt/current.json'));
}

function contractPath(value, name) {
  return `${value.snapshotPath}/${name}`;
}

test('public ChatGPT descriptor resolves immutable Project Forge contract v6', async () => {
  const value = await descriptor();
  assert.equal(value.schemaVersion, 1);
  assert.equal(value.channel, 'stable');
  assert.equal(value.contractVersion, 6);
  assert.equal(value.snapshotPath, 'chatgpt/contracts/v6');
  assert.equal(value.documents.length, 7);

  for (const document of value.documents) {
    assert.ok(document.path.startsWith(`${value.snapshotPath}/`));
    const digest = createHash('sha256').update(canonicalGitBlob(document.path)).digest('hex');
    assert.equal(digest, document.sha256, document.path);
  }
});

test('descriptor records exact canonical Project Forge provenance', async () => {
  const value = await descriptor();
  assert.equal(value.sourceProvenance.core.repository, 'mriekki/project-forge-core');
  assert.equal(value.sourceProvenance.bootstrap.repository, 'mriekki/project-forge-bootstrap');
  assert.equal(value.sourceProvenance.controlPlane.repository, 'mriekki/project-forge-control-plane');

  for (const key of ['core', 'bootstrap', 'controlPlane']) {
    assert.match(value.sourceProvenance[key].commit, /^[0-9a-f]{40}$/);
    assert.ok(value.sourceProvenance[key].sources.every((item) => /^[0-9a-f]{40}$/.test(item.blobSha)));
  }

  assert.equal(value.generation.manifestFilename, 'PROJECT_BOOTSTRAP.json');
  assert.equal(value.generation.package, '@mriekki/project-forge');
  assert.equal(value.generation.packageVersion, '2.1.0');
  assert.equal(value.generation.profile, 'greenfield-project');
  assert.equal(value.generation.bootstrapProtocolVersion, 12);
  assert.equal(value.bootstrapUrl, 'https://raw.githubusercontent.com/mriekki/project-forge-platform/main/chatgpt/current.json');
});

test('active Project Forge contract uses only current generation and onboarding identifiers', async () => {
  const value = await descriptor();
  const active = await Promise.all([
    'ADMIN.md',
    'EXISTING_PROJECT.md',
    'NEW_PROJECT.md',
    'ONBOARDING.md',
    'PROJECT_INSTRUCTIONS.md',
    'PROJECT_RULES.md',
  ].map((name) => text(contractPath(value, name))));
  const joined = active.join('\n');

  for (const required of [
    'PROJECT_BOOTSTRAP.json',
    '@mriekki/project-forge',
    '[generate-project]',
    '[invite-project-forge]',
    '/accept-project-forge',
    '/project-forge-doctor',
    'mriekki/project-forge-core',
    'mriekki/project-forge-bootstrap',
    'mriekki/project-forge-platform',
    'mriekki/project-forge-control-plane',
  ]) {
    assert.match(joined, new RegExp(required.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }

  for (const retired of [
    `${predecessorUpper}_BOOTSTRAP.json`,
    '@mriekki/lean',
    'lean-agentic-core',
    `lean-${predecessorLower}-bootstrap`,
    'lean-platform',
    `[generate-${predecessorLower}]`,
    '[invite-lean]',
    '/accept-lean',
    '/lean-doctor',
    'LEAN_BASELINE.json',
  ]) {
    assert.doesNotMatch(joined, new RegExp(retired.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }

  assert.match(joined, /New Project:/);
});

test('control-plane command descriptor matches the current public contract', async () => {
  const value = await descriptor();
  assert.equal(value.controlPlane.repository, 'mriekki/project-forge-control-plane');
  assert.equal(value.controlPlane.inviteIssuePrefix, '[invite-project-forge]');
  assert.equal(value.controlPlane.revokeIssuePrefix, '[revoke-project-forge]');
  assert.equal(value.controlPlane.doctorIssuePrefix, '[project-forge-doctor]');
  assert.equal(value.controlPlane.generateIssuePrefix, '[generate-project]');
  assert.equal(value.controlPlane.acceptCommand, '/accept-project-forge');
  assert.equal(value.controlPlane.declineCommand, '/decline-project-forge');
  assert.equal(value.controlPlane.doctorCommand, '/project-forge-doctor');
});

test('developer profile remains small, secret-free, and not Project state', async () => {
  const value = await descriptor();
  const schema = JSON.parse(await text(contractPath(value, 'USER_PROFILE.schema.json')));
  assert.equal(schema.title, 'Project Forge Developer Profile');
  assert.equal(schema.additionalProperties, false);
  assert.deepEqual(schema.required, ['schemaVersion', 'githubOwner']);
  assert.match(schema.$id, /mriekki\/project-forge-platform\/main\/chatgpt\/contracts\/v6/);

  for (const forbidden of ['password', 'token', 'secret', `${predecessorLower}State`, 'projectState', 'workItem', 'commitSha']) {
    assert.equal(Object.hasOwn(schema.properties, forbidden), false);
  }
});

test('active public Builder pages use current Project Forge onboarding vocabulary', async () => {
  const welcome = await text('WELCOME.md');
  const setup = await text('chatgpt/SETUP.md');
  const startHere = await text('chatgpt/START_HERE.md');
  const joined = [welcome, setup, startHere].join('\n');

  assert.match(welcome, /Build real software\. Learn the engineering behind it\./);
  assert.match(joined, /Project Forge Builder/);
  assert.match(joined, /\/accept-project-forge/);
  assert.match(joined, /\/project-forge-doctor/);
  assert.match(joined, /New Project:/);
  assert.doesNotMatch(joined, new RegExp(predecessorUpper));

  for (const retired of ['accept-lean', 'lean-doctor', 'lean-platform']) {
    assert.doesNotMatch(joined, new RegExp(retired));
  }
});
