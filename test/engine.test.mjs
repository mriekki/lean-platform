import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { applyProfile, checkProfile, planProfile, sha256File } from '../src/engine.mjs';

function fixture() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'project-forge-package-'));
  const packageRoot = path.join(root, 'package');
  const consumerRoot = path.join(root, 'consumer');
  fs.mkdirSync(path.join(packageRoot, 'assets/core/source/core'), { recursive: true });
  fs.mkdirSync(path.join(packageRoot, 'assets/deployment/source/src'), { recursive: true });
  fs.mkdirSync(consumerRoot, { recursive: true });
  fs.writeFileSync(path.join(packageRoot, 'assets/core/source/core/a.txt'), 'core-v1\n');
  fs.writeFileSync(path.join(packageRoot, 'assets/deployment/source/src/b.txt'), 'kit-v1\n');
  fs.writeFileSync(path.join(packageRoot, 'assets/core/distribution.json'), JSON.stringify({ name: 'greenfield-workspace', mappings: [{ source: 'core/a.txt', destination: '.github/a.txt' }] }));
  fs.writeFileSync(path.join(packageRoot, 'assets/deployment/distribution.json'), JSON.stringify({ name: 'greenfield-project', schemaVersion: 1, mappings: [{ source: 'src/b.txt', destination: 'tools/b.txt' }] }));
  const packageData = {
    root: packageRoot,
    pkg: { name: '@mriekki/project-forge', version: '0.1.0' },
    assets: {
      defaultProfile: 'greenfield-project',
      profiles: { 'greenfield-project': { components: ['core', 'deployment'] } },
      components: {
        core: { repository: 'mriekki/project-forge-core', commit: 'a'.repeat(40), version: '1.10.0', distribution: 'greenfield-workspace', descriptor: 'assets/core/distribution.json', sourceRoot: 'assets/core/source' },
        deployment: { repository: 'mriekki/project-forge-deployment-kit', commit: 'b'.repeat(40), distribution: 'greenfield-project', descriptor: 'assets/deployment/distribution.json', sourceRoot: 'assets/deployment/source' }
      }
    }
  };
  return { root, packageRoot, consumerRoot, packageData };
}

test('first install writes both component baselines and umbrella provenance', () => {
  const { consumerRoot, packageData } = fixture();
  const plan = planProfile(packageData, 'greenfield-project', consumerRoot);
  assert.equal(plan.unsafe.length, 0);
  applyProfile(packageData, plan, consumerRoot, 'demo-poc', '@mriekki/project-forge@0.1.0');
  assert.equal(fs.readFileSync(path.join(consumerRoot, '.github/a.txt'), 'utf8'), 'core-v1\n');
  assert.equal(fs.readFileSync(path.join(consumerRoot, 'tools/b.txt'), 'utf8'), 'kit-v1\n');
  assert.equal(JSON.parse(fs.readFileSync(path.join(consumerRoot, 'CORE_BASELINE.json'))).coreVersion, '1.10.0');
  assert.equal(JSON.parse(fs.readFileSync(path.join(consumerRoot, 'DEPLOYMENT_BASELINE.json'))).deploymentKitCommit, 'b'.repeat(40));
  assert.equal(JSON.parse(fs.readFileSync(path.join(consumerRoot, 'PROJECT_FORGE_BASELINE.json'))).version, '0.1.0');
  assert.equal(checkProfile(packageData, 'greenfield-project', consumerRoot).clean, true);
});

test('local drift blocks the whole apply', () => {
  const { consumerRoot, packageData } = fixture();
  applyProfile(packageData, planProfile(packageData, 'greenfield-project', consumerRoot), consumerRoot, 'demo', 'base');
  fs.writeFileSync(path.join(consumerRoot, '.github/a.txt'), 'local edit\n');
  const plan = planProfile(packageData, 'greenfield-project', consumerRoot);
  assert.deepEqual(plan.unsafe.map((x) => x.state), ['LOCAL_DRIFT']);
  assert.throws(() => applyProfile(packageData, plan, consumerRoot, 'demo', 'base'), /unsafe/);
  assert.equal(fs.readFileSync(path.join(consumerRoot, 'tools/b.txt'), 'utf8'), 'kit-v1\n');
});

test('unchanged retired Core path is removed automatically', () => {
  const { consumerRoot, packageData } = fixture();
  applyProfile(packageData, planProfile(packageData, 'greenfield-project', consumerRoot), consumerRoot, 'demo', 'base');
  const descriptor = path.join(packageData.root, 'assets/core/distribution.json');
  fs.writeFileSync(descriptor, JSON.stringify({ name: 'greenfield-workspace', mappings: [{ source: 'core/a.txt', destination: '.github/replacement.txt' }] }));
  fs.writeFileSync(path.join(packageData.root, 'assets/core/source/core/a.txt'), 'core-v2\n');
  const plan = planProfile(packageData, 'greenfield-project', consumerRoot);
  const core = plan.plans.find((item) => item.componentId === 'core');
  assert.deepEqual(core.retired.map((item) => [item.path, item.state]), [['.github/a.txt', 'REMOVE']]);
  assert.equal(plan.unsafe.length, 0);
  applyProfile(packageData, plan, consumerRoot, 'demo', 'base2');
  assert.equal(fs.existsSync(path.join(consumerRoot, '.github/a.txt')), false);
  assert.equal(fs.readFileSync(path.join(consumerRoot, '.github/replacement.txt'), 'utf8'), 'core-v2\n');
});

test('modified retired Core path requires explicit ownership transfer and is preserved', () => {
  const { consumerRoot, packageData } = fixture();
  applyProfile(packageData, planProfile(packageData, 'greenfield-project', consumerRoot), consumerRoot, 'demo', 'base');
  const descriptor = path.join(packageData.root, 'assets/core/distribution.json');
  fs.writeFileSync(descriptor, JSON.stringify({ name: 'greenfield-workspace', mappings: [{ source: 'core/a.txt', destination: '.github/replacement.txt' }] }));
  fs.writeFileSync(path.join(packageData.root, 'assets/core/source/core/a.txt'), 'core-v2\n');
  fs.writeFileSync(path.join(consumerRoot, '.github/a.txt'), 'consumer override\n');
  let plan = planProfile(packageData, 'greenfield-project', consumerRoot);
  assert(plan.unsafe.some((x) => x.state === 'RETIRED_DRIFT'));
  plan = planProfile(packageData, 'greenfield-project', consumerRoot, new Map([['core', new Set(['.github/a.txt'])]]));
  assert.equal(plan.unsafe.length, 0);
  applyProfile(packageData, plan, consumerRoot, 'demo', 'base2');
  assert.equal(fs.readFileSync(path.join(consumerRoot, '.github/a.txt'), 'utf8'), 'consumer override\n');
  assert.equal(fs.readFileSync(path.join(consumerRoot, '.github/replacement.txt'), 'utf8'), 'core-v2\n');
});

test('readiness rename removes old Core-managed paths and installs replacement paths', () => {
  const { consumerRoot, packageRoot, packageData } = fixture();
  const oldSkill = '.github/skills/production-readiness/SKILL.md';
  const oldProcess = 'docs/process/PRODUCTION_ENABLEMENT.md';
  const newSkill = '.github/skills/deployment-readiness/SKILL.md';
  const newProcess = 'docs/process/DEPLOYMENT_ENABLEMENT.md';
  fs.mkdirSync(path.join(packageRoot, 'assets/core/source/core/skills'), { recursive: true });
  fs.mkdirSync(path.join(packageRoot, 'assets/core/source/core/process'), { recursive: true });
  fs.writeFileSync(path.join(packageRoot, 'assets/core/source/core/skills/deployment-readiness.md'), 'deployment readiness\n');
  fs.writeFileSync(path.join(packageRoot, 'assets/core/source/core/process/deployment-enablement.md'), 'deployment enablement\n');
  fs.writeFileSync(path.join(packageRoot, 'assets/core/distribution.json'), JSON.stringify({
    name: 'greenfield-workspace',
    mappings: [
      { source: 'core/skills/deployment-readiness.md', destination: newSkill },
      { source: 'core/process/deployment-enablement.md', destination: newProcess }
    ]
  }));
  for (const [relative, content] of [[oldSkill, 'old readiness\n'], [oldProcess, 'old enablement\n']]) {
    const file = path.join(consumerRoot, relative);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, content);
  }
  const oldSkillFile = path.join(consumerRoot, oldSkill);
  const oldProcessFile = path.join(consumerRoot, oldProcess);
  fs.writeFileSync(path.join(consumerRoot, 'CORE_BASELINE.json'), JSON.stringify({
    schemaVersion: 1,
    consumer: 'demo',
    consumerBaseline: '@mriekki/project-forge@0.2.1',
    coreRepository: 'mriekki/project-forge-core',
    coreVersion: '1.11.1',
    coreCommit: 'c'.repeat(40),
    distribution: 'greenfield-workspace',
    managedPaths: [
      { source: 'core/skills/production-readiness/SKILL.md', path: oldSkill, sha256: sha256File(oldSkillFile) },
      { source: 'core/process/PRODUCTION_ENABLEMENT.md', path: oldProcess, sha256: sha256File(oldProcessFile) }
    ]
  }, null, 2) + '\n');
  const plan = planProfile(packageData, 'greenfield-project', consumerRoot);
  const core = plan.plans.find((item) => item.componentId === 'core');
  assert.deepEqual(core.retired.map((item) => [item.path, item.state]), [[oldSkill, 'REMOVE'], [oldProcess, 'REMOVE']]);
  assert.equal(plan.unsafe.length, 0);
  applyProfile(packageData, plan, consumerRoot, 'demo', '@mriekki/project-forge@0.3.x');
  assert.equal(fs.existsSync(oldSkillFile), false);
  assert.equal(fs.existsSync(oldProcessFile), false);
  assert.equal(fs.readFileSync(path.join(consumerRoot, newSkill), 'utf8'), 'deployment readiness\n');
  assert.equal(fs.readFileSync(path.join(consumerRoot, newProcess), 'utf8'), 'deployment enablement\n');
});

test('Deployment retires only unchanged Kit-owned paths', () => {
  const { consumerRoot, packageData } = fixture();
  applyProfile(packageData, planProfile(packageData, 'greenfield-project', consumerRoot), consumerRoot, 'demo', 'base');
  fs.writeFileSync(path.join(packageData.root, 'assets/deployment/distribution.json'), JSON.stringify({ name: 'greenfield-project', schemaVersion: 1, mappings: [{ source: 'src/c.txt', destination: 'tools/c.txt' }] }));
  fs.writeFileSync(path.join(packageData.root, 'assets/deployment/source/src/c.txt'), 'kit-v2\n');
  const plan = planProfile(packageData, 'greenfield-project', consumerRoot);
  assert.equal(plan.unsafe.length, 0);
  applyProfile(packageData, plan, consumerRoot, 'demo', 'base2');
  assert.equal(fs.existsSync(path.join(consumerRoot, 'tools/b.txt')), false);
  assert.equal(fs.readFileSync(path.join(consumerRoot, 'tools/c.txt'), 'utf8'), 'kit-v2\n');
});

test('existing component baselines can be adopted without changing managed files', () => {
  const { consumerRoot, packageData } = fixture();
  const original = planProfile(packageData, 'greenfield-project', consumerRoot);
  applyProfile(packageData, original, consumerRoot, 'existing-poc', 'Generated by Bootstrap');
  fs.unlinkSync(path.join(consumerRoot, 'PROJECT_FORGE_BASELINE.json'));
  const adoption = planProfile(packageData, 'greenfield-project', consumerRoot);
  assert.equal(adoption.unsafe.length, 0);
  assert(adoption.plans.every((component) => component.rows.every((row) => row.state === 'SAME')));
});
