# npm Release Process

`@mriekki/lean` is a public npm distribution assembled from exact accepted commits of the private canonical Lean repositories.

A release is not authorized by a merge, green CI, package assembly, or a prepared tarball. Publishing remains a separate explicit human decision.

## Release invariants

A release candidate must satisfy all of these before it can be staged:

- Lean Platform is a clean checkout at exact `origin/main`.
- `assets/components.json` pins exact accepted component commits.
- the Core and Deployment Kit source checkouts are at those exact commits and have no tracked working-tree changes;
- the packaged distribution descriptors exactly match the pinned canonical descriptors;
- all package tests pass;
- generated assets verify against the assembly ledger;
- two independent `npm pack` runs produce the same SHA-256;
- a clean temporary install of the packed tarball can run `lean version`, `lean install`, and `lean check` successfully.

`scripts/prepare-release.mjs` enforces these checks and writes only ignored release artifacts under `dist/release/` plus ignored generated package assets under `assets/generated/`.

## Prepare a release candidate

From the Lean Platform checkout on Windows:

```powershell
Set-Location D:\Projects\lean-platform
node .\scripts\prepare-release.mjs `
  --core-root D:\Projects\lean-agentic-core `
  --deployment-root D:\Projects\lean-poc-deployment-kit
```

Expected output ends with the package/version, tarball path, SHA-256, and exact Lean Platform source commit.

Review:

```text
dist/release/RELEASE_MANIFEST.json
dist/release/mriekki-lean-<version>.tgz
```

The manifest records the exact Lean Platform commit, exact canonical component commits, component file/hash ledgers, npm integrity metadata, and tarball SHA-256.

## First publication (`0.1.0`)

The first version must be established before npm Trusted Publishing can be configured for the package.

Prerequisites:

- npm CLI 11.15.0 or later and Node 22.14.0 or later for staged publishing;
- an npm account with 2FA enabled and write access to the `@mriekki` scope;
- the reviewed release candidate from the exact accepted Lean Platform `main` commit.

Do not use the package's normal provenance setting for this local bootstrap publication; npm provenance requires a supported cloud CI build. Stage the already-reviewed tarball explicitly with provenance disabled for this one bootstrap release:

```powershell
Set-Location D:\Projects\lean-platform
npm whoami
npm stage publish .\dist\release\mriekki-lean-0.1.0.tgz --access public --provenance=false
```

Staging is not the final publication decision. Inspect the staged package on npmjs.com or with `npm stage view` / `npm stage download`. The explicit release gate is approval of that exact staged version with 2FA.

After explicit approval, verify the registry version and run the public package:

```powershell
npm view @mriekki/lean@0.1.0 version dist.integrity
npx --yes @mriekki/lean@0.1.0 version
```

## Trusted publishing after the bootstrap release

After `@mriekki/lean` exists on npm, configure a GitHub Actions trusted publisher for:

```text
GitHub owner: mriekki
Repository: lean-platform
Workflow: npm-stage.yml
Allowed action: npm stage publish
```

The trusted publisher should be stage-only. A maintainer still reviews and approves the staged package with 2FA before it becomes public.

The GitHub workflow uses OIDC for npm authentication. It still needs read-only access to the private canonical Core and Deployment Kit repositories so it can reconstruct the package from exact pins. Configure repository secret `LEAN_SOURCE_TOKEN` as a fine-grained GitHub token with read-only Contents access limited to those two source repositories. It is not an npm publish token.

Once trusted publishing has been proven, keep traditional npm publish tokens disabled for this package.

## What release does not imply

Publishing `@mriekki/lean` does not regenerate existing POCs, update Bootstrap, deploy an application, or update FMP. Those remain separately owned changes.
