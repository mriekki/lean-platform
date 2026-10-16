# Lean Platform

`@mriekki/lean` is the public consumer-facing distribution for Lean engineering assets.

Canonical engineering remains in the private platform repositories. Before publication, a deterministic assembly step verifies exact pinned source commits and distribution descriptors, then copies only those approved consumer mappings into the npm payload. Each published npm release is therefore self-contained; consumers do not need access to the canonical repositories to install or update Lean assets.

## Current `greenfield-poc` profile

The current profile bundles:

- Lean Agentic Core `1.11.1` from commit `e3a8a994d1e95923d629af7640d3b3a0a4f098d4`, distribution `greenfield-workspace`;
- Lean POC Deployment Kit commit `4c23140576b39608a3ef285cad4abe53dccb9c47`, distribution `greenfield-poc`.

Core `1.11.1` tightens `/lean-update` for Bootstrap-generated package-managed consumers: it keeps `POC_BOOTSTRAP.json`, umbrella/component baselines, exact registry integrity, and generated package-verification surfaces coherent while retaining `/core-sync` as the compatibility/router path for component-only Core consumers.

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
- package publication is separate from merging a release PR and requires one explicit exact-version publication action.

## Current scope

The package currently starts with the `greenfield-poc` consumer profile. Existing-repository Adoption Kit packaging can be added as another profile without changing the one-package developer experience.

## Package assembly and release

For normal releases in the Lean Platform VS Code workspace, use:

```text
/release-lean [version | patch | minor | major]
```

The repo-local skill resolves accepted component commits, prepares the version/pin/descriptor update, runs local verification, creates the release PR, waits for the package-PR merge gate, verifies post-merge `main` CI, then stops once at the exact npm publication gate.

After publication approval it triggers `.github/workflows/npm-publish.yml`. The workflow reconstructs the package from the exact private component pins, runs the deterministic release preparation, publishes the exact tarball directly with npm Trusted Publishing (OIDC), and automatically verifies the registry identity plus a neutral-directory `npx` smoke check.

The normal flow does not use staged npm publication or a long-lived npm publish token. An existing stage-only trusted publisher must be migrated once to allow direct `npm publish` from `npm-publish.yml`; `/release-lean` guides that bounded one-time setup.

The underlying release-candidate command remains available for diagnostics:

```powershell
Set-Location D:\Projects\lean-platform
node .\scripts\prepare-release.mjs `
  --core-root D:\Projects\lean-agentic-core `
  --deployment-root D:\Projects\lean-poc-deployment-kit
```

Release preparation verifies exact `origin/main`, runs the complete test suite, refuses dirty canonical source checkouts, assembles and verifies the pinned assets, compares two independent `npm pack` SHA-256 values, and smoke-tests the packed CLI from a clean temporary install. The resulting tarball and `RELEASE_MANIFEST.json` are written under `dist/release/`.

See `docs/RELEASE_PROCESS.md` for the full release contract.
