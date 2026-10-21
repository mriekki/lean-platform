import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const snapshot = 'chatgpt/contracts/v5';
const documents = [
  'ADMIN.md',
  'EXISTING_POC.md',
  'NEW_POC.md',
  'ONBOARDING.md',
  'PROJECT_INSTRUCTIONS.md',
  'PROJECT_RULES.md',
  'USER_PROFILE.schema.json',
];

test('Project Forge v5 is the clean-slate PROJECT_BOOTSTRAP contract', async () => {
  const values = await Promise.all(documents.map((name) => readFile(path.join(root, snapshot, name), 'utf8')));
  const joined = values.join('\n');

  assert.match(joined, /PROJECT_BOOTSTRAP\.json/);
  assert.match(joined, /@mriekki\/project-forge/);
  assert.match(joined, /\[generate-project\]/);
  assert.match(joined, /\/accept-project-forge/);
  assert.doesNotMatch(joined, /POC_BOOTSTRAP\.json/);
  assert.doesNotMatch(joined, /@mriekki\/lean/);
  assert.doesNotMatch(joined, /LEAN_BASELINE\.json/);
});

test('Project Forge v5 contract document hashes are available for descriptor publication', async () => {
  for (const name of documents) {
    const relative = `${snapshot}/${name}`;
    const data = await readFile(path.join(root, relative));
    const digest = createHash('sha256').update(data).digest('hex');
    assert.match(digest, /^[0-9a-f]{64}$/);
    console.log(`PROJECT_FORGE_V5_SHA256 ${relative} ${digest}`);
  }
});
