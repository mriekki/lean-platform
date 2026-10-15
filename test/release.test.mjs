import assert from 'node:assert/strict';
import test from 'node:test';
import { npmPackArgs, parseArgs, resolveNpmInvocation } from '../scripts/prepare-release.mjs';

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
