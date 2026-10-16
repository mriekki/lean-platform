# npm Release Process

`@mriekki/lean` is the public npm distribution assembled from exact accepted commits of the private canonical Lean repositories.

Release preparation and npm publication are intentionally automated, but publication remains an explicit decision for one exact package/version/source tuple.

## Normal operator workflow

Use the repository-local VS Code skill:

```text
/release-lean [version | patch | minor | major]
```

The skill is resume-aware and owns the normal package-release orchestration:

```text
accepted Core / Deployment Kit main commits
→ choose package version
→ deterministic package metadata + descriptor update
→ local tests / asset verification
→ release PR + PR CI
→ ONE PACKAGE PR MERGE GATE
→ post-merge main CI
→ ONE EXACT NPM PUBLISH GATE
→ GitHub OIDC direct publish
→ registry + neutral npx verification
→ package release complete
```

Publishing the package does not update consumers. Existing package-managed POCs adopt it separately through `/lean-update`.

## Release invariants

Before npm publication, the exact release candidate must satisfy all of these:

- Lean Platform publication source is an exact clean `main` commit;
- `assets/components.json` pins exact accepted component commits;
- the canonical Core and Deployment Kit commits are clean exact accepted `main` states when a release PR is prepared locally;
- the packaged distribution descriptors exactly match their pinned canonical descriptors;
- all package tests pass;
- generated assets verify against the assembly ledger;
- two independent `npm pack` runs produce the same SHA-256;
- a clean temporary install of the packed tarball can run `lean version` through both direct Node and npm executable resolution, then run `lean install` and `lean check` successfully;
- the npm version does not already exist;
- the exact Lean Platform source commit and package version are passed to the publication workflow and revalidated there.

`scripts/prepare-release.mjs` enforces the release-candidate checks and writes only ignored artifacts under `dist/release/` plus ignored generated package assets under `assets/generated/`.

## Deterministic package-update preparation

The release skill uses:

```powershell
Set-Location D:\Projects\lean-platform
node .\scripts\prepare-package-update.mjs `
  --version <version> `
  --core-root D:\Projects\lean-agentic-core `
  --deployment-root D:\Projects\lean-poc-deployment-kit
```

The script refuses to modify `main`, requires a clean Lean Platform release branch, resolves clean exact `origin/main` component checkouts, and updates only:

- `package.json` version;
- `package-lock.json` version metadata;
- `assets/components.json` package version and exact component pins/versions;
- packaged component distribution descriptors copied from those exact canonical checkouts.

Afterward the skill runs package tests, asset assembly/verification, `git diff --check`, and meaningful diff review before routine PR delivery.

## Package version policy while pre-1.0

Unless a repository decision supersedes it:

- patch: compatible corrections/content/tooling updates;
- minor: consumer-visible breaking changes such as managed-path rename/removal or command removal;
- major: explicit exceptional decision only.

The exact version is still reviewed as part of the release PR.

## Trusted Publishing: direct publish

Normal releases use npm Trusted Publishing (OIDC) from:

```text
GitHub owner: mriekki
Repository: lean-platform
Workflow: npm-publish.yml
Allowed action: npm publish
```

No long-lived npm publish token is required. GitHub Actions receives a short-lived OIDC credential for the configured workflow.

The package can retain npm's `Require two-factor authentication and disallow tokens` package setting; that restriction applies to traditional tokens, not the configured OIDC trusted publisher.

### Operator authentication and one-time setup

Complete the local npm identity and publisher check before merging the package release PR, so missing access does not become a post-merge surprise:

```powershell
npm whoami --registry=https://registry.npmjs.org/
npm trust list @mriekki/lean --json
```

If `npm whoami` returns `E401`, sign in interactively and verify the account:

```powershell
npm login --auth-type=web --registry=https://registry.npmjs.org/
npm whoami --registry=https://registry.npmjs.org/
```

The account must be allowed to manage `@mriekki/lean`. `npm trust list` can require a separate browser authorization (`EOTP`); open the URL printed in the local terminal, finish npm's prompt, and rerun the command. Never paste or save that one-time URL or an OTP in chat, repository files, or CI.

The trusted publisher can be inspected or configured in npmjs.com under **Packages → `@mriekki/lean` → Settings → Trusted Publisher**. Configure GitHub Actions with owner `mriekki`, repository `lean-platform`, workflow file `npm-publish.yml`, no environment, and direct publish permission. The same relationship can be created through `npm trust github` after the release skill's `[NPM TRUST WRITE]` gate.

No long-lived npm token is needed or appropriate for this flow. The local npm login is only for maintainer operations and trust inspection; GitHub Actions publishes with OIDC. The workflow uses the repository's `LEAN_SOURCE_TOKEN` only to read the private canonical component repositories.

### One-time migration from the old staged workflow

If the npm trusted publisher still points at `npm-stage.yml` or only permits staged publication, replace it once. Inspect the current relationship:

```powershell
npm trust list @mriekki/lean --json
```

After explicit `[NPM TRUST WRITE]` approval in `/release-lean`, revoke the observed old relationship and create the direct-publish relationship:

```powershell
npm trust revoke @mriekki/lean --id <observed-id>
npm trust github @mriekki/lean --file npm-publish.yml --repo mriekki/lean-platform --allow-publish --yes
npm trust list @mriekki/lean --json
```

npm may require interactive 2FA for this one-time trust configuration change. Do not store an OTP anywhere in the repository, skill, workflow, CI secret, or documentation.

Once this relationship exists, normal package releases require no npm staging or npm 2FA promotion step.

## Exact publication gate

A merged package PR does not itself publish npm.

After the release PR is merged and exact post-merge `main` CI is green, `/release-lean` shows the exact package version, Lean Platform main SHA, Core pin/version, Deployment Kit pin, and trusted publisher evidence.

The single publication decision is:

```text
[NPM PUBLISH]
Publish this exact @mriekki/lean version from this exact Lean Platform main commit and component pin set?
```

If approved, the skill triggers:

```powershell
gh workflow run npm-publish.yml --ref main `
  -f version=<version> `
  -f source_commit=<exact-main-sha>
```

The workflow refuses changed/stale evidence.

## Publication workflow behavior

`.github/workflows/npm-publish.yml`:

1. checks out Lean Platform `main`;
2. requires `HEAD == source_commit` from the human-approved invocation;
3. requires `package.json` version to equal the approved version;
4. refuses an already-published version;
5. resolves exact component pins from `assets/components.json`;
6. checks out those exact private Core and Deployment Kit commits using read-only `LEAN_SOURCE_TOKEN` Contents access;
7. runs `scripts/prepare-release.mjs` to reproduce/test the package;
8. verifies the release manifest matches the authorized Lean Platform commit/version;
9. publishes the exact tarball with `npm publish --access public` using OIDC;
10. waits up to 10 minutes, with exponential backoff, for registry visibility and verifies npm integrity/shasum against the release manifest;
11. runs `npx --yes @mriekki/lean@<version> version` from a neutral temporary directory.

If any pre-publication step fails, npm is not published. If publication succeeds but a post-publish verification fails, report the published state accurately and diagnose the verification failure; do not attempt to republish the same version.

## Manual release-candidate diagnostics

The underlying deterministic preparation remains directly available for troubleshooting:

```powershell
Set-Location D:\Projects\lean-platform
node .\scripts\prepare-release.mjs `
  --core-root D:\Projects\lean-agentic-core `
  --deployment-root D:\Projects\lean-poc-deployment-kit
```

Expected output includes the package/version, tarball path, SHA-256, and exact Lean Platform source commit.

Review artifacts when diagnosing a release issue:

```text
dist/release/RELEASE_MANIFEST.json
dist/release/mriekki-lean-<version>.tgz
```

These are implementation evidence, not a separate mandatory manual-review ceremony in the normal `/release-lean` flow.

## What release does not imply

Publishing `@mriekki/lean` does not regenerate existing POCs, update Bootstrap provenance, deploy an application, publish Core/Deployment Kit GitHub releases/tags, or update Family Meal Planner. Those remain separately owned actions.
