import assert from 'node:assert/strict';
import path from 'node:path';
import test from 'node:test';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CLI = path.join(ROOT, 'bin', 'project-forge.mjs');

function runCli(args) {
  return spawnSync(process.execPath, [CLI, ...args], {
    cwd: ROOT,
    encoding: 'utf8'
  });
}

test('CLI accepts global help flags', () => {
  for (const args of [['--help'], ['-h']]) {
    const result = runCli(args);
    assert.equal(result.status, 0, result.stderr);
    assert.equal(result.stderr, '');
    assert.match(result.stdout, /Commands:/);
    assert.match(result.stdout, /-h, --help/);
  }
});

test('CLI accepts command help flags without requiring repository state', () => {
  for (const command of ['install', 'update', 'status', 'check', 'version']) {
    for (const flag of ['--help', '-h']) {
      const result = runCli([command, flag]);
      assert.equal(result.status, 0, `${command} ${flag}: ${result.stderr}`);
      assert.equal(result.stderr, '');
      assert.match(result.stdout, new RegExp(`Usage:\\s+project-forge ${command}`));
    }
  }
});

test('CLI still rejects unknown options', () => {
  const result = runCli(['update', '--definitely-not-an-option']);
  assert.equal(result.status, 2);
  assert.match(result.stderr, /Project Forge error: Unknown option: --definitely-not-an-option/);
});
