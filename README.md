# Project Forge

**Build real software. Learn the engineering behind it.**

Project Forge is an AI-guided software development and learning platform for building your own projects from idea through definition, implementation, testing, deployment, and structured learning.

The developer brings the idea and makes the material decisions. Project Forge supplies a repeatable engineering path, deterministic project generation, AI-assisted implementation/review, environment setup/deployment guidance, and optional learning/coaching.

> **Compatibility note:** the public product is now **Project Forge**. Existing technical repositories, package names, schemas, commands, and provenance identifiers such as `lean-platform`, `@mriekki/lean`, `POC_BOOTSTRAP.json`, `[generate-poc]`, and `/lean-update` remain stable for compatibility.

## What it feels like

Start with an idea:

```text
New Project: I want to build a hiking trail tracker.
```

Project Forge guides the Builder through:

```text
idea
→ project discovery
→ V1 scope and non-goals
→ technology and testing choices
→ project definition
→ private GitHub project creation
→ deterministic workspace generation
→ local setup
→ small work items
→ implementation + tests
→ meaningful review
→ delivery / pull request / CI
→ optional deployment
→ optional code walkthrough, learning review, and coaching
```

The legacy `New POC:` wording remains a compatibility alias; **Project** is the normal human-facing term.

## What Project Forge is for

Project Forge is intended for personal software projects, experiments that may grow into real applications, learning projects, technology explorations, automation, APIs, web/mobile/desktop work, embedded projects, AI/LLM projects, testing projects, and other supported software shapes.

A project does not have to stay a disposable proof of concept. It can have persistent data, CI, multiple workstations, named environments such as Demo/Staging/Production, deployment, and ongoing work items.

## Human control stays meaningful

Project Forge automates routine mechanics but keeps important decisions with the Builder:

- material requirements/scope;
- substantive implementation plans when warranted;
- meaningful code/diff acceptance;
- pull-request merge/finalization;
- release publication;
- Production deployment or destructive Production actions.

Learning is optional and never blocks delivery.

## Your projects are yours

Each Builder owns their own project repositories and development credentials.

Project Forge authorization does not grant access to another developer's private projects. New Builders also do not need direct access to private Core/Bootstrap implementation repositories.

The normal public reusable-asset delivery boundary is the published npm package `@mriekki/lean`.

## New Builder onboarding

Read the product overview and onboarding journey in [`WELCOME.md`](WELCOME.md).

An invited Builder normally does only this:

```text
open personal invitation
→ install/approve the Project Forge GitHub App
→ /accept-lean
→ automatic readiness verification
→ configure one ChatGPT coding Project
→ New Project: <idea>
```

One-time ChatGPT setup is documented in [`chatgpt/SETUP.md`](chatgpt/SETUP.md).

## Existing generated projects

A generated project is self-contained for normal development. The normal workstation flow is:

```text
clone repository
→ open generated VS Code workspace
→ /setup
→ /progress or /next-step
→ /start-work <ID>
```

Project Forge supports independent workspace instances on multiple developer computers. Git/GitHub is the shared source boundary; local databases, credentials, SSH keys/trust, Docker state, and readiness remain workstation-local.

## Public ChatGPT contract

Project Forge's public ChatGPT bootstrap entrypoint is [`chatgpt/START_HERE.md`](chatgpt/START_HERE.md).

The stable descriptor at `chatgpt/current.json` resolves one immutable contract snapshot for a conversation/session. New contract versions are published as new snapshot directories rather than rewriting an already-resolved snapshot.

## Technical distribution (`@mriekki/lean`)

`@mriekki/lean` remains the public consumer-facing distribution for Project Forge engineering assets.

Canonical engineering remains in the component repositories. Before publication, deterministic assembly verifies exact pinned source commits and distribution descriptors, then copies only approved consumer mappings into the npm payload. Published releases are self-contained; consumers do not need access to canonical private repositories to install or update managed assets.

Current consumer profile:

```text
greenfield-poc
```

Technical identifiers keep their historical names until a separate compatibility migration is worth the cost.

Preview/install:

```powershell
npx @mriekki/lean install
```

Update using the newest published package:

```powershell
npx @mriekki/lean@latest update
```

Inspect/verify:

```powershell
npx @mriekki/lean@latest status
npx @mriekki/lean@latest check
```

The umbrella package writes `LEAN_BASELINE.json` while preserving component-native `CORE_BASELINE.json` and `DEPLOYMENT_BASELINE.json` ledgers. Updates refuse unsafe managed drift/conflicts before modifying components.

## Maintainer release workflow

For normal releases in the Lean Platform workspace, use:

```text
/release-lean
```

The release workflow resolves accepted component commits, selects/prepares the package version, runs verification, creates the package PR, waits for the merge gate, verifies post-merge `main` CI, and stops at the explicit npm publication gate.

Publication uses npm Trusted Publishing (OIDC), reconstructs the exact package from pinned sources, verifies registry identity/integrity, and smoke-tests the public package from a neutral directory.

See [`docs/RELEASE_PROCESS.md`](docs/RELEASE_PROCESS.md) for the technical release contract.
