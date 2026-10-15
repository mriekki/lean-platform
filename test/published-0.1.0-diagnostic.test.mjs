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

function managedPaths(baseline) {
  return (baseline.managedPaths ?? []).map((item) => item.path);
}

function installPublishedPackage(temp) {
  fs.writeFileSync(path.join(temp, 'package.json'), JSON.stringify({ private: true }) + '\n');
  runNpm(['install', '--ignore-scripts', '--no-audit', '--no-fund', '@mriekki/lean@0.1.0'], temp);
  return path.join(temp, 'node_modules', '@mriekki', 'lean');
}

test('published 0.1.0 artifact exposes the expected disjoint component ownership', () => {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'lean-published-diagnostic-'));
  try {
    const packageRoot = installPublishedPackage(temp);
    const core = JSON.parse(fs.readFileSync(path.join(packageRoot, 'assets', 'core', 'distribution.json'), 'utf8'));
    const deployment = JSON.parse(fs.readFileSync(path.join(packageRoot, 'assets', 'deployment', 'distribution.json'), 'utf8'));
    const coreDestinations = destinations(core);
    const deploymentDestinations = destinations(deployment);

    console.log('published core destinations:', JSON.stringify(coreDestinations));
    console.log('published deployment destinations:', JSON.stringify(deploymentDestinations));

    const deploymentSet = new Set(deploymentDestinations);
    const overlap = coreDestinations.filter((item) => deploymentSet.has(item));
    console.log('published cross-component overlap:', JSON.stringify(overlap));

    assert.equal(coreDestinations.includes('.gitattributes'), false, 'published Core descriptor unexpectedly owns .gitattributes');
    assert.equal(deploymentDestinations.includes('.gitattributes'), false, 'published Deployment descriptor unexpectedly owns .gitattributes');
    assert.deepEqual(overlap, [], 'published component descriptors must have disjoint destinations');
  } finally {
    fs.rmSync(temp, { recursive: true, force: true });
  }
});

test('published 0.1.0 install preserves Bootstrap-owned .gitattributes outside component baselines', () => {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'lean-published-bootstrap-target-'));
  try {
    const packageRoot = installPublishedPackage(temp);
    const consumer = path.join(temp, 'consumer');
    fs.mkdirSync(consumer);
    const attributes = '# Bootstrap-owned repository attributes\n* text=auto eol=lf\n';
    fs.writeFileSync(path.join(consumer, '.gitattributes'), attributes);
    fs.writeFileSync(path.join(consumer, 'README.md'), '# Bootstrap target\n');

    const cli = path.join(packageRoot, 'bin', 'lean.mjs');
    const output = execFileSync(process.execPath, [
      cli,
      'install',
      '--root', consumer,
      '--profile', 'greenfield-poc',
      '--apply',
      '--consumer', 'diagnostic-consumer',
      '--consumer-baseline', 'published-0.1.0-diagnostic'
    ], { cwd: temp, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
    console.log('published install plan/output:\n' + output);

    const coreBaseline = JSON.parse(fs.readFileSync(path.join(consumer, 'CORE_BASELINE.json'), 'utf8'));
    const deploymentBaseline = JSON.parse(fs.readFileSync(path.join(consumer, 'DEPLOYMENT_BASELINE.json'), 'utf8'));
    const corePaths = managedPaths(coreBaseline);
    const deploymentPaths = managedPaths(deploymentBaseline);
    const deploymentSet = new Set(deploymentPaths);
    const overlap = corePaths.filter((item) => deploymentSet.has(item));

    console.log('published Core baseline paths:', JSON.stringify(corePaths));
    console.log('published Deployment baseline paths:', JSON.stringify(deploymentPaths));
    console.log('published baseline overlap:', JSON.stringify(overlap));

    assert.equal(fs.readFileSync(path.join(consumer, '.gitattributes'), 'utf8'), attributes);
    assert.equal(corePaths.includes('.gitattributes'), false, 'Core baseline unexpectedly owns Bootstrap .gitattributes');
    assert.equal(deploymentPaths.includes('.gitattributes'), false, 'Deployment baseline unexpectedly owns Bootstrap .gitattributes');
    assert.deepEqual(overlap, [], 'component baseline ownership must remain disjoint');
  } finally {
    fs.rmSync(temp, { recursive: true, force: true });
  }
});
