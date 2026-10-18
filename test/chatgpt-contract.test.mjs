import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

async function text(relative) {
  return readFile(path.join(root, relative), 'utf8');
}

function canonicalGitBlob(relative) {
  const result = spawnSync('git', ['show', `HEAD:${relative}`], {
    cwd: root,
    encoding: null,
    maxBuffer: 1024 * 1024,
  });
  assert.equal(
    result.status,
    0,
    `Unable to read canonical Git blob ${relative}: ${result.stderr?.toString() ?? ''}`,
  );
  return result.stdout;
}

async function descriptor() {
  return JSON.parse(await text('chatgpt/current.json'));
}

function contractPath(value, name) {
  return `${value.snapshotPath}/${name}`;
}

test('public ChatGPT descriptor resolves one immutable Project Forge contract snapshot', async () => {
  const value = await descriptor();
  assert.equal(value.schemaVersion, 1);
  assert.equal(value.channel, 'stable');
  assert.equal(value.contractVersion, 3);
  assert.equal(value.snapshotPath, 'chatgpt/contracts/v3');
  assert.ok(value.documents.length >= 7);

  for (const document of value.documents) {
    assert.ok(document.path.startsWith(`${value.snapshotPath}/`));
    const digest = createHash('sha256').update(canonicalGitBlob(document.path)).digest('hex');
    assert.equal(digest, document.sha256, document.path);
  }
});

test('descriptor records exact canonical source provenance for Project Forge projection', async () => {
  const value = await descriptor();
  for (const key of ['core', 'bootstrap', 'controlPlane']) {
    assert.match(value.sourceProvenance[key].commit, /^[0-9a-f]{40}$/);
    assert.ok(value.sourceProvenance[key].sources.every((item) => /^[0-9a-f]{40}$/.test(item.blobSha)));
  }
  assert.equal(value.sourceProvenance.core.repository, 'mriekki/lean-agentic-core');
  assert.equal(value.sourceProvenance.bootstrap.repository, 'mriekki/lean-poc-bootstrap');
  assert.equal(value.sourceProvenance.controlPlane.repository, 'mriekki/lean-poc-control-plane');

  const bootstrapSources = new Set(value.sourceProvenance.bootstrap.sources.map((item) => item.path));
  assert.ok(bootstrapSources.has('docs/discovery/QUESTION_MODEL.md'));
  assert.ok(bootstrapSources.has('docs/PROJECT_FORGE_TERMINOLOGY.md'));
  assert.ok(bootstrapSources.has('CHATGPT_START.md'));

  const controlPlaneSources = new Set(value.sourceProvenance.controlPlane.sources.map((item) => item.path));
  assert.ok(controlPlaneSources.has('.github/workflows/generate-poc.yml'));
  assert.ok(controlPlaneSources.has('.github/workflows/invite-developer.yml'));
  assert.ok(controlPlaneSources.has('.github/workflows/claim-invitation.yml'));
  assert.ok(controlPlaneSources.has('.github/workflows/onboarding-doctor.yml'));
  assert.ok(controlPlaneSources.has('docs/INVITATIONS.md'));
  assert.ok(controlPlaneSources.has('tools/onboarding_doctor.py'));
});

test('Project Forge contract preserves canonical ownership, safety, and compatibility behavior', async () => {
  const value = await descriptor();
  const projectRules = await text(contractPath(value, 'PROJECT_RULES.md'));
  const projectInstructions = await text(contractPath(value, 'PROJECT_INSTRUCTIONS.md'));
  const newProject = await text(contractPath(value, 'NEW_POC.md'));
  const onboarding = await text(contractPath(value, 'ONBOARDING.md'));

  assert.match(projectRules, /Project Forge.*platform/i);
  assert.match(projectRules, /Project.*normal thing a Builder creates/i);
  assert.match(projectRules, /Bootstrap.*discovery/i);
  assert.match(projectRules, /generated Projects.*their own product scope/i);
  assert.match(projectRules, /New Project:.*canonical/i);
  assert.match(projectRules, /New POC:.*compatibility alias/s);
  assert.match(projectRules, /POC_BOOTSTRAP\.json/);

  assert.match(projectInstructions, /current\.json/);
  assert.match(projectInstructions, /New Project:/);
  assert.match(projectInstructions, /New POC:.*compatibility alias/s);
  assert.match(projectInstructions, /do not perform consequential Project generation or platform writes/i);

  assert.match(newProject, /Ask one material question at a time/);
  assert.match(newProject, /CATALOG GAP/);
  assert.match(newProject, /Only the final approved `POC_BOOTSTRAP\.json`/);
  assert.match(newProject, /Deployment discovery — outcome first/);
  assert.match(newProject, /second computer, a home LAN, SSH, Staging, or Production/);
  assert.match(newProject, /placement: workstation/);
  assert.match(newProject, /placement: deferred/);
  assert.match(newProject, /provider-adapter boundary/);
  assert.match(newProject, /host-level Production isolation is not demonstrated/);
  assert.match(newProject, /integrity.*registry/i);
  assert.match(newProject, /Do not ask the human to look up, paste, or approve npm `dist\.integrity`/);
  assert.match(newProject, /Do not require `\/lean-doctor` as a per-Project discovery or approval gate/);

  assert.match(onboarding, /Knowing the URL alone does not grant access/);
  assert.match(onboarding, /readiness verification automatically/i);
  assert.match(onboarding, /READY FOR PROJECT FORGE/);
  assert.match(onboarding, /stays available for recovery/i);
  assert.match(onboarding, /\/lean-doctor/);
  assert.match(onboarding, /not a mandatory prerequisite for every `New Project:`/);
  assert.match(onboarding, /\[lean-doctor\] <github-owner>/);
  assert.match(onboarding, /Opening that public issue runs the readiness check immediately/);
  assert.match(onboarding, /Revocation removes future Control Plane authorization/);

  assert.equal(value.controlPlane.inviteIssuePrefix, '[invite-lean]');
  assert.equal(value.controlPlane.acceptCommand, '/accept-lean');
  assert.equal(value.controlPlane.doctorIssuePrefix, '[lean-doctor]');
  assert.equal(value.controlPlane.doctorCommand, '/lean-doctor');
});

test('developer profile is small, secret-free, and not project state', async () => {
  const value = await descriptor();
  const schema = JSON.parse(await text(contractPath(value, 'USER_PROFILE.schema.json')));
  assert.equal(schema.title, 'Project Forge Developer Profile');
  assert.equal(schema.additionalProperties, false);
  assert.deepEqual(schema.required, ['schemaVersion', 'githubOwner']);
  for (const forbidden of ['password', 'token', 'secret', 'pocState', 'projectState', 'workItem', 'commitSha']) {
    assert.equal(Object.hasOwn(schema.properties, forbidden), false);
  }
});

test('public welcome and setup pages expose the streamlined Builder journey', async () => {
  const welcome = await text('WELCOME.md');
  const setup = await text('chatgpt/SETUP.md');

  assert.match(welcome, /Build real software\. Learn the engineering behind it\./);
  assert.match(welcome, /New Project: <your idea>/);
  assert.match(welcome, /READY FOR PROJECT FORGE/);
  assert.match(welcome, /manual `\/lean-doctor` command remains available/i);

  assert.match(setup, /Project Forge — Coding Projects/);
  assert.match(setup, /Set up my Project Forge Developer Profile/);
  assert.match(setup, /You should not need to hand-author JSON/);
  assert.match(setup, /New Project: <your idea>/);
});
