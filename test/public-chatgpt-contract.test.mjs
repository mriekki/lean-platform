import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';

const root = path.resolve(import.meta.dirname, '..');

function read(relative) {
  return fs.readFileSync(path.join(root, relative), 'utf8');
}

test('active ChatGPT setup distinguishes greenfield and imported discovery triggers', () => {
  for (const relative of ['chatgpt/START_HERE.md', 'chatgpt/SETUP.md']) {
    const text = read(relative);
    assert.match(text, /New Project:/);
    assert.match(text, /New Project from:/);
    assert.doesNotMatch(text, /`New Project: \.\.\.` and `New Project: \.\.\.`/);
  }
});

test('package release workflow requires explicit public ChatGPT alignment follow-up', () => {
  const skill = read('.github/skills/release-project-forge/SKILL.md');
  assert.match(skill, /PUBLIC CHATGPT CONTRACT ADVANCEMENT REQUIRED/);
  assert.match(skill, /never edit an already-published immutable `chatgpt\/contracts\/vN\/` snapshot in place/i);
  assert.match(skill, /never point stable `current\.json` at an npm version that is not verifiably published/i);
  assert.match(skill, /Public ChatGPT contract: ALIGNED \| FOLLOW-UP PR REQUIRED/);
});
