import assert from 'node:assert/strict';
import test from 'node:test';
import { parseArgs } from '../scripts/prepare-release.mjs';

test('release preparation requires both canonical source roots', () => {
  assert.deepEqual(parseArgs(['--core-root', 'core', '--deployment-root', 'deployment']), {
    core: 'core',
    deployment: 'deployment'
  });
  assert.throws(() => parseArgs(['--core-root', 'core']), /--core-root and --deployment-root are required/);
  assert.throws(() => parseArgs(['--deployment-root', 'deployment']), /--core-root and --deployment-root are required/);
});

test('release preparation accepts an explicit artifact output root', () => {
  assert.deepEqual(parseArgs(['--core-root', 'core', '--deployment-root', 'deployment', '--output', 'dist/custom']), {
    core: 'core',
    deployment: 'deployment',
    output: 'dist/custom'
  });
});
