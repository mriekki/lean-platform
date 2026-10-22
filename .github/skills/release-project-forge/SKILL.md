---
name: release-project-forge
description: Prepare, deliver, publish, and verify an exact @mriekki/project-forge package release from accepted Project Forge component commits.
user-invocable: true
disable-model-invocation: true
---

# Release Project Forge

`/release-project-forge` is the Project Forge Platform-specific release workflow for `@mriekki/project-forge`.

It owns package transport mechanics. Canonical Core and Deployment Kit repositories still own their reusable source behavior.

## 1. Resume from observed state

Start by inspecting the current Project Forge Platform checkout, Git/GitHub state, package metadata, component pins, open release PRs, CI, registry state, public `chatgpt/current.json` state, and local canonical component checkouts.

Default local roots on Mark's workstation are:

```text
D:\Projects\project-forge-platform
D:\Projects\project-forge-core
D:\Projects\project-forge-deployment-kit
```

Use repository facts rather than memory. Do not invent accepted commits, CI status, registry state, public-contract state, or npm trusted-publisher state.

The skill is resume-aware. If preparation, PR creation, merge, publication, verification, or public-contract follow-up already happened, continue from the furthest safe observed state rather than repeating it.

Routine releases do not require a local npm login. GitHub Actions uses OIDC for publication. Inspect or change npm trusted-publisher settings only during initial setup, migration, after a workflow/repository identity change, or when an OIDC publish attempt reports a trust error. A successful publish by the exact workflow is evidence that the relationship works; do not query `npm trust list` on every routine release.

## 2. Resolve accepted component commits

For each canonical component included by `assets/components.json`:

- fetch its default branch;
- require a clean tracked working tree;
- require the local checkout to be at exact `origin/main`;
- verify the selected commit is the accepted merged commit intended for the package;
- verify configured post-merge CI for that exact commit completed successfully;
- read canonical version metadata when the component defines one.

Do not pin an unmerged branch, dirty checkout, guessed SHA, or commit whose configured default-branch CI is failing/pending.

A component that has not changed since the installed package stays on its existing exact pin.

## 3. Select the package version automatically

Default invocation is `/release-project-forge` with no version argument.

Inspect the consumer-visible change between the currently packaged component pins and the accepted component commits selected in step 2. Choose the next package version automatically from that evidence. Do not require the user to choose `patch`, `minor`, or `major` when the classification is clear.

Before modifying package metadata, report the decision concisely, for example:

```text
Version decision: 0.2.1 -> 0.3.0
Classification: minor
Reason: consumer-visible breaking managed-path/command rename while @mriekki/project-forge is pre-1.0
```

For pre-1.0 `@mriekki/project-forge` releases, use this default policy unless a repository decision supersedes it:

- `patch` — compatible corrections, additive behavior, documentation, or tooling changes that do not break existing consumers;
- `minor` — consumer-visible breaking changes such as managed-path removal/rename, command removal/rename, or an incompatible consumer contract change;
- `major` — never infer `1.0.0` automatically; moving from `0.x` to `1.0.0` is an explicit product/stability decision.

For `1.0.0` and later, use conventional semantic-versioning behavior:

- `patch` — backward-compatible fixes;
- `minor` — backward-compatible features;
- `major` — breaking consumer changes.

When multiple changes are present, use the highest applicable classification. If the evidence is materially ambiguous, ask one bounded question explaining the competing classifications. Otherwise proceed without a version-choice prompt.

Explicit bump or exact-version arguments are optional overrides for unusual cases. Validate an override against the observed change: do not silently accept a lower version class than the change requires, and never reuse a version already present on npm.

After choosing the version, use the exact computed version internally for release preparation.

## 4. Prepare the release PR automatically

Invoking `/release-project-forge` authorizes safe release-preparation mechanics but does **not** authorize npm publication.

When preparation has not happened yet:

1. require Project Forge Platform tracked state to be clean;
2. refresh `main` using fast-forward-only behavior;
3. create/switch to `release/project-forge-<version>` unless the matching release branch already exists safely;
4. run:

```powershell
Set-Location D:\Projects\project-forge-platform
node .\scripts\prepare-package-update.mjs `
  --version <version> `
  --core-root D:\Projects\project-forge-core `
  --deployment-root D:\Projects\project-forge-deployment-kit
```

The deterministic preparation script updates only package version metadata, exact component pins/versions, and packaged distribution descriptors copied from those exact canonical commits.

Then run:

```powershell
npm test
npm run assemble:assets -- --core-root D:\Projects\project-forge-core --deployment-root D:\Projects\project-forge-deployment-kit
npm run verify:assets
git diff --check
git --no-pager diff
```

Generated assets remain ignored release-build products; do not commit them unless repository policy changes.

If the diff contains anything outside the expected release-preparation scope, stop.

After successful verification, routine branch/stage/commit/push/PR creation and PR-CI observation are authorized by this invocation. Use a concise release commit/PR such as `Prepare @mriekki/project-forge <version>`.

Do not publish npm from a release branch or PR.

## 5. Package PR merge gate

If trusted-publisher setup or migration is needed, complete section 6 before presenting the merge gate. Do not make routine package PR merging depend on local npm authentication or a fresh `npm trust list` authorization.

When PR CI is green and the PR diff still matches the verified release preparation, stop once at:

```text
PACKAGE RELEASE PR READY

Version: <version>
Core: <exact commit/version>
Deployment Kit: <exact commit>
PR CI: GREEN
Diff: expected release-preparation files only

1. Merge and finalize package release PR [GITHUB WRITE]
2. Review PR diff [READ ONLY]
3. Leave open [NO ACTION]
```

Merge authorization does not authorize npm publication.

After merge, verify exact Project Forge Platform `main` and its configured post-merge CI before publication.

## 6. One-time npm trusted-publisher setup

Normal publication uses `.github/workflows/npm-publish.yml` with npm Trusted Publishing (OIDC) and **direct `npm publish`**. No long-lived npm publish token is used.

When inspecting or changing trust settings, the npm website is the simplest route. The CLI may require a separate browser authorization even when `npm whoami` succeeds.

```powershell
npm trust list @mriekki/project-forge --json
```

If the CLI returns `EOTP`, have the operator open the URL printed in their local terminal, finish npm's browser authorization, then rerun the command. If `npm whoami` returns `E401`, use `npm login --auth-type=web --registry=https://registry.npmjs.org/` before retrying CLI trust management. Never request or copy the one-time URL or OTP.

The required relationship is:

```text
provider: GitHub Actions
repository: mriekki/project-forge-platform
workflow file: npm-publish.yml
allowed action: npm publish
```

It can be managed on npmjs.com under **Packages → `@mriekki/project-forge` → Settings → Trusted Publisher**. Select GitHub Actions, owner `mriekki`, repository `project-forge-platform`, workflow file `npm-publish.yml`, no environment, and direct publish permission. The CLI equivalent for creating a missing relationship is documented below; both routes require maintainer authorization, and npm may prompt for 2FA.

If that exact relationship already exists, do not touch it.

If the existing relationship is stage-only or points at the retired `npm-stage.yml`, explain that this is a one-time migration. Show the exact existing trust ID and require one bounded gate:

```text
[NPM TRUST WRITE]
Replace the existing @mriekki/project-forge trusted publisher with direct-publish permission for mriekki/project-forge-platform/.github/workflows/npm-publish.yml?
```

Only after approval, use the observed trust ID:

```powershell
npm trust revoke @mriekki/project-forge --id <observed-id>
npm trust github @mriekki/project-forge --file npm-publish.yml --repo mriekki/project-forge-platform --allow-publish --yes
npm trust list @mriekki/project-forge --json
```

npm may require interactive 2FA for this one-time trust-configuration change. Do not store or request an OTP in repository files, chat transcripts, scripts, or CI secrets.

If no trust relationship exists, skip revoke and create the required relationship after the same `[NPM TRUST WRITE]` gate.

## 7. Exact npm publication gate

Once all of these are true:

- release PR merged;
- Project Forge Platform local checkout is exact clean `origin/main`;
- configured post-merge CI for that exact `main` commit is green;
- package version and component pins are internally consistent;
- target npm version does not already exist;
- trusted publisher is known to permit `npm publish` from `npm-publish.yml` (use a successful exact-workflow OIDC publish as evidence; inspect the relationship only for initial setup, migration, identity changes, or a trust error);

present exactly one publication gate:

```text
NPM PUBLISH READY

Package: @mriekki/project-forge@<version>
Project Forge Platform source: <exact main SHA>
Core: <exact commit/version>
Deployment Kit: <exact commit>
Post-merge CI: GREEN
Publisher: GitHub OIDC / npm-publish.yml

1. Publish this exact package [NPM PUBLISH]
2. Stop [NO ACTION]
```

Selecting option 1 authorizes only the exact package/version/source/pins shown.

Trigger:

```powershell
gh workflow run npm-publish.yml --ref main `
  -f version=<version> `
  -f source_commit=<exact-main-sha>
```

Then monitor the exact workflow run without another permission prompt.

If `main`, version, pins, or workflow evidence changes before publication, stop for renewed review.

## 8. Publication workflow contract

`npm-publish.yml` must fail closed before `npm publish` unless:

- the checked-out Project Forge Platform commit equals the authorized `source_commit` input;
- `package.json` equals the authorized version input;
- the exact pinned Core and Deployment Kit commits can be checked out;
- `scripts/prepare-release.mjs` passes its reproducibility, assembly, test, and clean-install checks;
- the target npm version is not already published.

The workflow publishes the exact prepared tarball with OIDC, then automatically verifies registry version/integrity and runs a neutral-directory `npx` smoke check.

Do not use `npm stage publish`, `npm stage approve`, a long-lived npm publish token, or a second manual package-inspection ceremony in the normal flow.

Registry propagation is asynchronous. The workflow polls with exponential backoff for up to 10 minutes and prints the last registry-query error if it times out. If publishing succeeded but verification still fails, inspect the exact run and registry tarball; never retry publication for an already-existing version.

## 9. Public ChatGPT contract alignment

After successful registry and neutral-`npx` verification, inspect `chatgpt/current.json` before declaring the overall Project Forge release follow-up complete.

At minimum compare:

- `generation.package` with `@mriekki/project-forge`;
- `generation.packageVersion` with the exact package version just published;
- the immutable snapshot referenced by `contractVersion`/`snapshotPath`;
- `sourceProvenance` for the repository-owned ChatGPT contract sources listed in the descriptor.

If the stable descriptor still points at an older package version, report:

```text
PUBLIC CHATGPT CONTRACT ADVANCEMENT REQUIRED
```

Do not silently leave that as an invisible release-side effect.

Determine whether the referenced immutable snapshot still represents the accepted operating contract:

- if the operating/discovery contract sources listed in `sourceProvenance` have not materially changed and only the exact published package pointer is stale, prepare a small public-contract follow-up PR that advances the mutable descriptor package version while preserving the immutable snapshot;
- if relevant Core/Bootstrap/Control Plane contract sources changed materially, create a **new immutable contract snapshot version**, compute its document hashes and exact source provenance, and point `chatgpt/current.json` at that new snapshot in the follow-up PR;
- never edit an already-published immutable `chatgpt/contracts/vN/` snapshot in place;
- never point stable `current.json` at an npm version that is not verifiably published;
- never invent Bootstrap/Core/Control Plane SHAs or source blobs.

Routine branch/commit/push/PR mechanics for this public-contract follow-up are authorized after npm publication, but the follow-up PR has its normal human merge/finalize gate. npm publication does not authorize merging that PR.

If no alignment change is needed, record `Public ChatGPT contract: ALIGNED` in the release completion evidence.

## 10. Completion

On successful package publication report only evidence-backed state:

```text
PROJECT_FORGE PACKAGE RELEASE COMPLETE

Package: @mriekki/project-forge@<version>
Project Forge Platform source: <sha>
Core: <sha/version>
Deployment Kit: <sha>
Publish workflow: GREEN
Registry verification: GREEN
Neutral npx smoke: GREEN
Public ChatGPT contract: ALIGNED | FOLLOW-UP PR REQUIRED
```

Publishing the package does not update existing package-managed consumers. They adopt it separately through `/project-forge-update`.

Do not regenerate a Project, modify Bootstrap provenance outside the reviewed public-contract follow-up, deploy an application, publish Core/Deployment-Kit tags/releases, or update consumers as an implicit side effect of `/release-project-forge`.
