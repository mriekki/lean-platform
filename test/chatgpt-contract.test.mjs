import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

async function text(relative) {
  return readFile(path.join(root, relative), 'utf8');
}

function canonicalGitBlob(relative) {
  const result = spawnSync('git', ['show', `HEAD:${relative}`], {
    cwd: root,
    encoding: null,
    maxBuffer: 1024 * 1024,
  });
  assert.equal(
    result.status,
    0,
    `Unable to read canonical Git blob ${relative}: ${result.stderr?.toString() ?? ''}`,
  );
  return result.stdout;
}

test('public ChatGPT descriptor resolves one immutable contract snapshot', async () => {
  const descriptor = JSON.parse(await text('chatgpt/current.json'));
  assert.equal(descriptor.schemaVersion, 1);
  assert.equal(descriptor.channel, 'stable');
  assert.equal(descriptor.contractVersion, 1);
  assert.equal(descriptor.snapshotPath, 'chatgpt/contracts/v1');
  assert.ok(descriptor.documents.length >= 6);

  for (const document of descriptor.documents) {
    assert.ok(document.path.startsWith(`${descriptor.snapshotPath}/`));
    const digest = createHash('sha256').update(canonicalGitBlob(document.path)).digest('hex');
    assert.equal(digest, document.sha256, document.path);
  }
});

test('descriptor records exact canonical source provenance', async () => {
  const descriptor = JSON.parse(await text('chatgpt/current.json'));
  assert.match(descriptor.sourceProvenance.core.commit, /^[0-9a-f]{40}$/);
  assert.match(descriptor.sourceProvenance.bootstrap.commit, /^[0-9a-f]{40}$/);
  assert.equal(descriptor.sourceProvenance.core.repository, 'mriekki/lean-agentic-core');
  assert.equal(descriptor.sourceProvenance.bootstrap.repository, 'mriekki/lean-poc-bootstrap');
  assert.ok(descriptor.sourceProvenance.core.sources.every((item) => /^[0-9a-f]{40}$/.test(item.blobSha)));
  assert.ok(descriptor.sourceProvenance.bootstrap.sources.every((item) => /^[0-9a-f]{40}$/.test(item.blobSha)));
});

test('contract preserves canonical ownership and safe fallback behavior', async () => {
  const projectRules = await text('chatgpt/contracts/v1/PROJECT_RULES.md');
  const projectInstructions = await text('chatgpt/contracts/v1/PROJECT_INSTRUCTIONS.md');
  const newPoc = await text('chatgpt/contracts/v1/NEW_POC.md');
  const onboarding = await text('chatgpt/contracts/v1/ONBOARDING.md');

  assert.match(projectRules, /Bootstrap.*discovery/i);
  assert.match(projectRules, /generated POCs.*their own product scope/i);
  assert.match(projectInstructions, /current\.json/);
  assert.match(projectInstructions, /do not perform\s+consequential POC generation or platform writes/i);
  assert.match(newPoc, /Ask one material question at a time/);
  assert.match(newPoc, /CATALOG GAP/);
  assert.match(newPoc, /Only the final approved `POC_BOOTSTRAP\.json`/);
  assert.match(onboarding, /Knowing the URL alone does not grant access/);
  assert.match(onboarding, /Revocation removes future Control Plane authorization/);
});

test('developer profile is small, secret-free, and not project state', async () => {
  const schema = JSON.parse(await text('chatgpt/contracts/v1/USER_PROFILE.schema.json'));
  assert.equal(schema.additionalProperties, false);
  assert.deepEqual(schema.required, ['schemaVersion', 'githubOwner']);
  for (const forbidden of ['password', 'token', 'secret', 'pocState', 'workItem', 'commitSha']) {
    assert.equal(Object.hasOwn(schema.properties, forbidden), false);
  }
});
