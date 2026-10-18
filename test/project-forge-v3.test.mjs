import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const snapshot = 'chatgpt/contracts/v3';
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

test('Project Forge v3 uses Project publicly while preserving compatibility identifiers', async () => {
  const admin = await text(`${snapshot}/ADMIN.md`);
  const instructions = await text(`${snapshot}/PROJECT_INSTRUCTIONS.md`);
  const rules = await text(`${snapshot}/PROJECT_RULES.md`);
  const discovery = await text(`${snapshot}/NEW_POC.md`);
  const onboarding = await text(`${snapshot}/ONBOARDING.md`);

  assert.match(admin, /must not make membership in a shared or admin-owned GitHub organization a normal prerequisite/);
  assert.match(admin, /Builders normally use their own GitHub identities and own their own Project repositories/);
  assert.match(instructions, /This is a Project Forge coding Project/);
  assert.match(instructions, /New Project:/);
  assert.match(rules, /New POC:.*compatibility alias/s);
  assert.match(rules, /POC_BOOTSTRAP\.json/);
  assert.match(discovery, /New Project: <idea>/);
  assert.match(discovery, /New POC: <idea>/);
  assert.match(onboarding, /READY FOR PROJECT FORGE/);
  assert.match(onboarding, /readiness verification automatically/i);
  assert.match(onboarding, /\/lean-doctor/);
});

test('Project Forge v3 contract document hashes are available for descriptor publication', async () => {
  for (const name of documents) {
    const relative = `${snapshot}/${name}`;
    const data = await readFile(path.join(root, relative));
    const digest = createHash('sha256').update(data).digest('hex');
    assert.match(digest, /^[0-9a-f]{64}$/);
    console.log(`PROJECT_FORGE_V3_SHA256 ${relative} ${digest}`);
  }
});
