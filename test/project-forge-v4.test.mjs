import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const snapshot = 'chatgpt/contracts/v4';
const documents = [
  'ADMIN.md',
  'EXISTING_POC.md',
  'NEW_POC.md',
  'ONBOARDING.md',
  'PROJECT_INSTRUCTIONS.md',
  'PROJECT_RULES.md',
  'USER_PROFILE.schema.json',
];

async function text(relative) {
  return readFile(path.join(root, relative), 'utf8');
}

test('Project Forge v4 uses the canonical public App and Control Plane identity', async () => {
  const admin = await text(`${snapshot}/ADMIN.md`);
  const onboarding = await text(`${snapshot}/ONBOARDING.md`);
  const rules = await text(`${snapshot}/PROJECT_RULES.md`);
  const instructions = await text(`${snapshot}/PROJECT_INSTRUCTIONS.md`);

  for (const value of [admin, onboarding, rules, instructions]) {
    assert.match(value, /mriekki\/project-forge-control-plane/);
  }
  assert.match(admin, /GitHub App: Project Forge/);
  assert.match(onboarding, /GitHub App: Project Forge/);
  assert.doesNotMatch(onboarding, /Lean POC Generator/);
  assert.match(admin, /\[invite-lean\]/);
  assert.match(admin, /\/accept-lean/);
  assert.match(admin, /\[test-invite-forge\]/);
  assert.match(rules, /\[generate-poc\]/);
});

test('Project Forge v4 preserves legacy command/schema compatibility while migrating repository identity', async () => {
  const rules = await text(`${snapshot}/PROJECT_RULES.md`);
  const discovery = await text(`${snapshot}/NEW_POC.md`);
  assert.match(rules, /POC_BOOTSTRAP\.json/);
  assert.match(rules, /@mriekki\/lean/);
  assert.match(discovery, /New Project: <idea>/);
  assert.match(discovery, /New POC: <idea>/);
});

test('Project Forge v4 contract document hashes are available for descriptor publication', async () => {
  for (const name of documents) {
    const relative = `${snapshot}/${name}`;
    const data = await readFile(path.join(root, relative));
    const digest = createHash('sha256').update(data).digest('hex');
    assert.match(digest, /^[0-9a-f]{64}$/);
    console.log(`PROJECT_FORGE_V4_SHA256 ${relative} ${digest}`);
  }
});
