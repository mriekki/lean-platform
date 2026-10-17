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

async function descriptor() {
  return JSON.parse(await text('chatgpt/current.json'));
}

function contractPath(value, name) {
  return `${value.snapshotPath}/${name}`;
}

test('public ChatGPT descriptor resolves one immutable contract snapshot', async () => {
  const value = await descriptor();
  assert.equal(value.schemaVersion, 1);
  assert.equal(value.channel, 'stable');
  assert.ok(Number.isInteger(value.contractVersion) && value.contractVersion >= 1);
  assert.equal(value.snapshotPath, `chatgpt/contracts/v${value.contractVersion}`);
  assert.ok(value.documents.length >= 6);

  for (const document of value.documents) {
    assert.ok(document.path.startsWith(`${value.snapshotPath}/`));
    const digest = createHash('sha256').update(canonicalGitBlob(document.path)).digest('hex');
    assert.equal(digest, document.sha256, document.path);
  }
});

test('descriptor records exact canonical source provenance', async () => {
  const value = await descriptor();
  for (const key of ['core', 'bootstrap', 'controlPlane']) {
    assert.match(value.sourceProvenance[key].commit, /^[0-9a-f]{40}$/);
    assert.ok(value.sourceProvenance[key].sources.every((item) => /^[0-9a-f]{40}$/.test(item.blobSha)));
  }
  assert.equal(value.sourceProvenance.core.repository, 'mriekki/lean-agentic-core');
  assert.equal(value.sourceProvenance.bootstrap.repository, 'mriekki/lean-poc-bootstrap');
  assert.equal(value.sourceProvenance.controlPlane.repository, 'mriekki/lean-poc-control-plane');
});

test('contract preserves canonical ownership and safe fallback behavior', async () => {
  const value = await descriptor();
  const projectRules = await text(contractPath(value, 'PROJECT_RULES.md'));
  const projectInstructions = await text(contractPath(value, 'PROJECT_INSTRUCTIONS.md'));
  const newPoc = await text(contractPath(value, 'NEW_POC.md'));
  const onboarding = await text(contractPath(value, 'ONBOARDING.md'));

  assert.match(projectRules, /Bootstrap.*discovery/i);
  assert.match(projectRules, /generated POCs.*their own product scope/i);
  assert.match(projectInstructions, /current\.json/);
  assert.match(projectInstructions, /do not perform\s+consequential POC generation or platform writes/i);
  assert.match(newPoc, /Ask one material question at a time/);
  assert.match(newPoc, /CATALOG GAP/);
  assert.match(newPoc, /Only the final approved `POC_BOOTSTRAP\.json`/);
  assert.match(newPoc, /Deployment discovery — outcome first/);
  assert.match(newPoc, /second computer, a home LAN, SSH, Staging, or Production/);
  assert.match(newPoc, /placement: workstation/);
  assert.match(newPoc, /placement: deferred/);
  assert.match(newPoc, /provider-adapter boundary/);
  assert.match(newPoc, /host-level Production isolation is not demonstrated/);
  assert.match(newPoc, /integrity.*registry/i);
  assert.match(newPoc, /Do not ask the human to look up, paste, or approve npm `dist\.integrity`/);
  assert.match(newPoc, /Do not require `\/lean-doctor` as a per-POC discovery or approval gate/);
  assert.match(onboarding, /Knowing the URL alone does not grant access/);
  assert.match(onboarding, /onboarding\/readiness evidence, not a mandatory prerequisite for every `New POC:`/);
  assert.match(onboarding, /Revocation removes future Control Plane authorization/);
});

test('developer profile is small, secret-free, and not project state', async () => {
  const value = await descriptor();
  const schema = JSON.parse(await text(contractPath(value, 'USER_PROFILE.schema.json')));
  assert.equal(schema.additionalProperties, false);
  assert.deepEqual(schema.required, ['schemaVersion', 'githubOwner']);
  for (const forbidden of ['password', 'token', 'secret', 'pocState', 'workItem', 'commitSha']) {
    assert.equal(Object.hasOwn(schema.properties, forbidden), false);
  }
});
