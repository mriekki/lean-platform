# Lean Platform

`@mriekki/lean` is the public consumer-facing distribution for Lean engineering assets.

Canonical engineering remains in the private platform repositories. Before publication, a deterministic assembly step verifies exact pinned source commits and distribution descriptors, then copies only those approved consumer mappings into the npm payload. Each published npm release is therefore self-contained; consumers do not need access to the canonical repositories to install or update Lean assets.

## V0.1 profile

The initial `greenfield-poc` profile bundles:

- Lean Agentic Core `1.10.0` from commit `e2d64b10f1a30507471755339c20e8b58e62be16`, distribution `greenfield-workspace`;
- Lean POC Deployment Kit commit `4c23140576b39608a3ef285cad4abe53dccb9c47`, distribution `greenfield-poc`.

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

V0.1 intentionally starts with the greenfield POC consumer profile. Existing-repository Adoption Kit packaging can be added as another profile without changing the one-package developer experience.

## Package assembly

The public source repository intentionally does not commit generated private-source snapshots. Before packaging, run the deterministic assembler against exact local checkouts:

```powershell
node scripts/assemble-assets.mjs --core-root D:\Projects\lean-agentic-core --deployment-root D:\Projects\lean-poc-deployment-kit
npm pack
```

`prepack` refuses to package when generated assets are absent, stale, or do not match the pinned source provenance. Publication remains a separate explicit release gate.
