import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { execFileSync } from 'node:child_process';

function npmCommand() {
  if (process.platform !== 'win32') return { command: 'npm', prefix: [] };
  const node = process.execPath;
  const npmCli = path.join(path.dirname(node), 'node_modules', 'npm', 'bin', 'npm-cli.js');
  return { command: node, prefix: [npmCli] };
}

function runNpm(args, cwd) {
  const invocation = npmCommand();
  return execFileSync(invocation.command, [...invocation.prefix, ...args], {
    cwd,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe']
  });
}

function destinations(descriptor) {
  const values = [];
  if (descriptor.profileDestination) values.push(descriptor.profileDestination);
  for (const mapping of descriptor.mappings ?? []) values.push(mapping.destination);
  return values;
}

test('published 0.1.0 artifact exposes the expected disjoint component ownership', () => {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'lean-published-diagnostic-'));
  try {
    fs.writeFileSync(path.join(temp, 'package.json'), JSON.stringify({ private: true }) + '\n');
    runNpm(['install', '--ignore-scripts', '--no-audit', '--no-fund', '@mriekki/lean@0.1.0'], temp);

    const packageRoot = path.join(temp, 'node_modules', '@mriekki', 'lean');
    const core = JSON.parse(fs.readFileSync(path.join(packageRoot, 'assets', 'core', 'distribution.json'), 'utf8'));
    const deployment = JSON.parse(fs.readFileSync(path.join(packageRoot, 'assets', 'deployment', 'distribution.json'), 'utf8'));
    const coreDestinations = destinations(core);
    const deploymentDestinations = destinations(deployment);

    console.log('published core destinations:', JSON.stringify(coreDestinations));
    console.log('published deployment destinations:', JSON.stringify(deploymentDestinations));

    const overlap = coreDestinations.filter((item) => new Set(deploymentDestinations).has(item));
    console.log('published cross-component overlap:', JSON.stringify(overlap));

    assert.equal(coreDestinations.includes('.gitattributes'), false, 'published Core descriptor unexpectedly owns .gitattributes');
    assert.equal(deploymentDestinations.includes('.gitattributes'), false, 'published Deployment descriptor unexpectedly owns .gitattributes');
    assert.deepEqual(overlap, [], 'published component descriptors must have disjoint destinations');
  } finally {
    fs.rmSync(temp, { recursive: true, force: true });
  }
});
