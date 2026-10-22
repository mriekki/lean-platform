import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';

const root = path.resolve(import.meta.dirname, '..');

function read(relative) {
  return fs.readFileSync(path.join(root, relative), 'utf8');
}

test('package release requires explicit stable ChatGPT contract follow-up', () => {
  const skill = read('.github/skills/release-project-forge/SKILL.md');

  assert.match(skill, /inspect `chatgpt\/current\.json` before declaring the overall Project Forge release follow-up complete/i);
  assert.match(skill, /PUBLIC CHATGPT CONTRACT ADVANCEMENT REQUIRED/);
  assert.match(skill, /never edit an already-published immutable `chatgpt\/contracts\/vN\/` snapshot in place/i);
  assert.match(skill, /never point stable `current\.json` at an npm version that is not verifiably published/i);
  assert.match(skill, /public-contract follow-up PR has its normal human merge\/finalize gate/i);
  assert.match(skill, /Public ChatGPT contract: ALIGNED \| FOLLOW-UP PR REQUIRED/);
});
