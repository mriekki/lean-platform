import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { applyProfile, checkProfile, planProfile } from '../src/engine.mjs';

function fixture() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'lean-package-'));
  const packageRoot = path.join(root, 'package');
  const consumerRoot = path.join(root, 'consumer');
  fs.mkdirSync(path.join(packageRoot, 'assets/core/source/core'), { recursive: true });
  fs.mkdirSync(path.join(packageRoot, 'assets/deployment/source/src'), { recursive: true });
  fs.mkdirSync(consumerRoot, { recursive: true });
  fs.writeFileSync(path.join(packageRoot, 'assets/core/source/core/a.txt'), 'core-v1\n');
  fs.writeFileSync(path.join(packageRoot, 'assets/deployment/source/src/b.txt'), 'kit-v1\n');
  fs.writeFileSync(path.join(packageRoot, 'assets/core/distribution.json'), JSON.stringify({ name: 'greenfield-workspace', mappings: [{ source: 'core/a.txt', destination: '.github/a.txt' }] }));
  fs.writeFileSync(path.join(packageRoot, 'assets/deployment/distribution.json'), JSON.stringify({ name: 'greenfield-poc', schemaVersion: 1, mappings: [{ source: 'src/b.txt', destination: 'tools/b.txt' }] }));
  const packageData = {
    root: packageRoot,
    pkg: { name: '@mriekki/lean', version: '0.1.0' },
    assets: {
      defaultProfile: 'greenfield-poc',
      profiles: { 'greenfield-poc': { components: ['core', 'deployment'] } },
      components: {
        core: { repository: 'mriekki/lean-agentic-core', commit: 'a'.repeat(40), version: '1.10.0', distribution: 'greenfield-workspace', descriptor: 'assets/core/distribution.json', sourceRoot: 'assets/core/source' },
        deployment: { repository: 'mriekki/lean-poc-deployment-kit', commit: 'b'.repeat(40), distribution: 'greenfield-poc', descriptor: 'assets/deployment/distribution.json', sourceRoot: 'assets/deployment/source' }
      }
    }
  };
  return { root, packageRoot, consumerRoot, packageData };
}

test('first install writes both component baselines and umbrella provenance', () => {
  const { consumerRoot, packageData } = fixture();
  const plan = planProfile(packageData, 'greenfield-poc', consumerRoot);
  assert.equal(plan.unsafe.length, 0);
  applyProfile(packageData, plan, consumerRoot, 'demo-poc', '@mriekki/lean@0.1.0');
  assert.equal(fs.readFileSync(path.join(consumerRoot, '.github/a.txt'), 'utf8'), 'core-v1\n');
  assert.equal(fs.readFileSync(path.join(consumerRoot, 'tools/b.txt'), 'utf8'), 'kit-v1\n');
  assert.equal(JSON.parse(fs.readFileSync(path.join(consumerRoot, 'CORE_BASELINE.json'))).coreVersion, '1.10.0');
  assert.equal(JSON.parse(fs.readFileSync(path.join(consumerRoot, 'DEPLOYMENT_BASELINE.json'))).deploymentKitCommit, 'b'.repeat(40));
  assert.equal(JSON.parse(fs.readFileSync(path.join(consumerRoot, 'LEAN_BASELINE.json'))).version, '0.1.0');
  assert.equal(checkProfile(packageData, 'greenfield-poc', consumerRoot).clean, true);
});

test('local drift blocks the whole apply', () => {
  const { consumerRoot, packageData } = fixture();
  applyProfile(packageData, planProfile(packageData, 'greenfield-poc', consumerRoot), consumerRoot, 'demo', 'base');
  fs.writeFileSync(path.join(consumerRoot, '.github/a.txt'), 'local edit\n');
  const plan = planProfile(packageData, 'greenfield-poc', consumerRoot);
  assert.deepEqual(plan.unsafe.map((x) => x.state), ['LOCAL_DRIFT']);
  assert.throws(() => applyProfile(packageData, plan, consumerRoot, 'demo', 'base'), /unsafe/);
  assert.equal(fs.readFileSync(path.join(consumerRoot, 'tools/b.txt'), 'utf8'), 'kit-v1\n');
});

test('Core retirement requires explicit transfer and preserves the consumer file', () => {
  const { consumerRoot, packageData } = fixture();
  applyProfile(packageData, planProfile(packageData, 'greenfield-poc', consumerRoot), consumerRoot, 'demo', 'base');
  const descriptor = path.join(packageData.root, 'assets/core/distribution.json');
  fs.writeFileSync(descriptor, JSON.stringify({ name: 'greenfield-workspace', mappings: [{ source: 'core/a.txt', destination: '.github/replacement.txt' }] }));
  fs.writeFileSync(path.join(packageData.root, 'assets/core/source/core/a.txt'), 'core-v2\n');
  let plan = planProfile(packageData, 'greenfield-poc', consumerRoot);
  assert(plan.unsafe.some((x) => x.state === 'RETIRED_PATH'));
  plan = planProfile(packageData, 'greenfield-poc', consumerRoot, new Map([['core', new Set(['.github/a.txt'])]]));
  assert.equal(plan.unsafe.length, 0);
  applyProfile(packageData, plan, consumerRoot, 'demo', 'base2');
  assert.equal(fs.readFileSync(path.join(consumerRoot, '.github/a.txt'), 'utf8'), 'core-v1\n');
  assert.equal(fs.readFileSync(path.join(consumerRoot, '.github/replacement.txt'), 'utf8'), 'core-v2\n');
});

test('Deployment retires only unchanged Kit-owned paths', () => {
  const { consumerRoot, packageData } = fixture();
  applyProfile(packageData, planProfile(packageData, 'greenfield-poc', consumerRoot), consumerRoot, 'demo', 'base');
  fs.writeFileSync(path.join(packageData.root, 'assets/deployment/distribution.json'), JSON.stringify({ name: 'greenfield-poc', schemaVersion: 1, mappings: [{ source: 'src/c.txt', destination: 'tools/c.txt' }] }));
  fs.writeFileSync(path.join(packageData.root, 'assets/deployment/source/src/c.txt'), 'kit-v2\n');
  const plan = planProfile(packageData, 'greenfield-poc', consumerRoot);
  assert.equal(plan.unsafe.length, 0);
  applyProfile(packageData, plan, consumerRoot, 'demo', 'base2');
  assert.equal(fs.existsSync(path.join(consumerRoot, 'tools/b.txt')), false);
  assert.equal(fs.readFileSync(path.join(consumerRoot, 'tools/c.txt'), 'utf8'), 'kit-v2\n');
});

test('existing component baselines can be adopted without changing managed files', () => {
  const { consumerRoot, packageData } = fixture();
  const original = planProfile(packageData, 'greenfield-poc', consumerRoot);
  applyProfile(packageData, original, consumerRoot, 'existing-poc', 'Generated by Bootstrap');
  fs.unlinkSync(path.join(consumerRoot, 'LEAN_BASELINE.json'));
  const adoption = planProfile(packageData, 'greenfield-poc', consumerRoot);
  assert.equal(adoption.unsafe.length, 0);
  assert(adoption.plans.every((component) => component.rows.every((row) => row.state === 'SAME')));
});
