# Lean Platform

`@mriekki/lean` is the public consumer-facing distribution for Lean engineering assets.

Canonical engineering remains in the private platform repositories. Before publication, a deterministic assembly step verifies exact pinned source commits and distribution descriptors, then copies only those approved consumer mappings into the npm payload. Each published npm release is therefore self-contained; consumers do not need access to the canonical repositories to install or update Lean assets.

## Current `greenfield-poc` profile

The current profile bundles:

- Lean Agentic Core `1.11.0` from commit `5b2f13bb188f74fa0d7b6b8d7985fe3abfc543f9`, distribution `greenfield-workspace`;
- Lean POC Deployment Kit commit `4c23140576b39608a3ef285cad4abe53dccb9c47`, distribution `greenfield-poc`.

Core `1.11.0` adds the package-aware `/lean-update` workflow for `LEAN_BASELINE.json` consumers, keeps `/core-sync` as a compatibility/router path for component-only Core consumers, and aligns `/upstream-fix` and `/deploy` with the package and generated Deployment Kit boundaries.

## Developer experience

Preview/install:

```powershell
npx @mriekki/lean install
```

When run interactively, the command previews all managed changes and asks once before applying a safe plan. Automation can use `--apply` after reviewing the preview contract.

Update using the newest published package:

```powershell
npx @mriekki/lean@latest update
```

For reviewed maintenance operations, prefer resolving and using one exact package version for preview, apply, and final check rather than allowing a moving `@latest` reference to change between those steps.

Inspect or verify:

```powershell
npx @mriekki/lean@latest status
npx @mriekki/lean@latest check
```

The umbrella package writes `LEAN_BASELINE.json` while preserving component-native `CORE_BASELINE.json` and `DEPLOYMENT_BASELINE.json` ledgers. Updates refuse managed drift/conflicts before modifying any component. Core retired paths require explicit ownership transfer with `--accept-retired core:<path>`; unchanged Deployment Kit retirements may be removed under its existing ownership contract.

## Safety and ownership

- npm is the distribution transport, not the canonical source of reusable behavior.
- package releases pin exact accepted source commits.
- install/update never require private GitHub access.
- no install/update lifecycle hook mutates a consumer repository; changes occur only when the user invokes the Lean CLI.
- one preflight plan covers all selected components; an unsafe component blocks the entire apply.
- package publication is separate from merging this repository and requires an explicit release action.

## Current scope

The package currently starts with the `greenfield-poc` consumer profile. Existing-repository Adoption Kit packaging can be added as another profile without changing the one-package developer experience.

## Package assembly and release

The public source repository intentionally does not commit generated private-source snapshots. Prepare an auditable release candidate from clean exact canonical checkouts:

```powershell
Set-Location D:\Projects\lean-platform
node .\scripts\prepare-release.mjs `
  --core-root D:\Projects\lean-agentic-core `
  --deployment-root D:\Projects\lean-poc-deployment-kit
```

Release preparation verifies exact `origin/main`, runs the complete test suite, refuses dirty canonical source checkouts, assembles and verifies the pinned assets, compares two independent `npm pack` SHA-256 values, and smoke-tests the packed CLI from a clean temporary install. The resulting tarball and `RELEASE_MANIFEST.json` are written under `dist/release/`.

The first npm version was staged manually and required explicit 2FA approval before becoming public. Current releases use `.github/workflows/npm-stage.yml` with npm Trusted Publishing (OIDC) to stage future versions without a long-lived npm publish token; human 2FA approval remains the final publication gate.

See `docs/RELEASE_PROCESS.md` for the full release contract.
