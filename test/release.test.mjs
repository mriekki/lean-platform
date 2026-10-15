import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { npmPackArgs, parseArgs, resolveNpmInvocation } from '../scripts/prepare-release.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function runNpm(args, cwd) {
  const invocation = resolveNpmInvocation(args);
  return execFileSync(invocation.command, invocation.args, {
    cwd,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe']
  });
}

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

test('release preparation runs npm through Node on Windows', () => {
  const invocation = resolveNpmInvocation(['pack', '--json'], {
    platform: 'win32',
    execPath: 'C:\\Program Files\\nodejs\\node.exe',
    existsSync: () => true
  });
  assert.equal(invocation.command, 'C:\\Program Files\\nodejs\\node.exe');
  assert.deepEqual(invocation.args, [
    'C:\\Program Files\\nodejs\\node_modules\\npm\\bin\\npm-cli.js',
    'pack',
    '--json'
  ]);
});

test('release npm pack disables lifecycle scripts after explicit asset verification', () => {
  assert.deepEqual(npmPackArgs('dist/pack'), [
    'pack',
    '--json',
    '--ignore-scripts',
    '--pack-destination',
    'dist/pack'
  ]);
});

test('packed CLI resolves through npm exec from a neutral directory', () => {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'lean-npm-bin-test-'));
  try {
    const packDir = path.join(temp, 'pack');
    fs.mkdirSync(packDir);
    const packed = JSON.parse(runNpm(npmPackArgs(packDir), ROOT));
    assert.equal(packed.length, 1);
    const tarball = path.join(packDir, packed[0].filename);

    const consumer = path.join(temp, 'consumer');
    fs.mkdirSync(consumer);
    fs.writeFileSync(path.join(consumer, 'package.json'), JSON.stringify({ private: true }) + '\n');
    runNpm(['install', '--ignore-scripts', '--no-audit', '--no-fund', tarball], consumer);

    const actual = runNpm(['exec', '--', 'lean', 'version'], consumer).trim();
    const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'));
    assert.equal(actual, `${pkg.name} ${pkg.version}`);
  } finally {
    fs.rmSync(temp, { recursive: true, force: true });
  }
});

test('release preparation uses npm directly outside Windows', () => {
  assert.deepEqual(resolveNpmInvocation(['test'], { platform: 'linux' }), {
    command: 'npm',
    args: ['test']
  });
});

test('release preparation fails closed when the Windows npm CLI cannot be resolved', () => {
  assert.throws(
    () => resolveNpmInvocation(['test'], {
      platform: 'win32',
      execPath: 'C:\\Node\\node.exe',
      existsSync: () => false
    }),
    /Unable to locate npm CLI next to the Node executable/
  );
});
