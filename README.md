# Project Forge

**Build real software. Learn the engineering behind it.**

Project Forge is an AI-guided software development and learning platform for building your own projects from idea through definition, implementation, testing, deployment, and structured learning.

The Builder brings the idea and makes the material decisions. Project Forge supplies a repeatable engineering path, deterministic project generation, AI-assisted implementation and review, environment setup and deployment guidance, and optional learning and coaching.

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

## What Project Forge is for

Project Forge supports personal software projects, learning projects, technology explorations, automation, APIs, web/mobile/desktop applications, embedded projects, AI/LLM projects, testing projects, and other supported software shapes.

Projects can grow beyond an initial experiment. They can have persistent data, CI, multiple workstations, named environments such as Demo, Staging, and Production, deployment, and ongoing work items.

## Human control stays meaningful

Project Forge automates routine mechanics but keeps important decisions with the Builder:

- material requirements and scope;
- substantive implementation plans when warranted;
- meaningful code and diff acceptance;
- pull-request merge and finalization;
- release publication;
- Production deployment or destructive Production actions.

Learning is optional and never blocks delivery.

## Your projects are yours

Each Builder owns their own project repositories and development credentials.

Project Forge authorization does not grant access to another developer's private projects. Builders do not need access to Project Forge's private platform implementation repositories.

Private platform components provide the engineering workflow, project-generation, deployment, and orchestration capabilities behind the public Project Forge experience. Builders interact with Project Forge through the public onboarding flow, their own generated project repositories, the public ChatGPT contract, and the published `@mriekki/project-forge` package.

## New Builder onboarding

Read the product overview and onboarding journey in [`WELCOME.md`](WELCOME.md).

An invited Builder normally does only this:

```text
open personal invitation
→ install/approve Project Forge Builder
→ accept invitation
→ automatic readiness verification
→ configure one ChatGPT coding Project
→ New Project: <idea>
```

**Project Forge Builder** is the GitHub App used for Project Forge authorization and project orchestration.

One-time ChatGPT setup is documented in [`chatgpt/SETUP.md`](chatgpt/SETUP.md).

## Working in a generated project

A generated project is self-contained for normal development. The normal workstation flow is:

```text
clone repository
→ open generated VS Code workspace
→ /setup
→ /progress or /next-step
→ /start-work <ID>
```

Project Forge supports independent workspace instances on multiple developer computers. Git/GitHub is the shared source boundary; local databases, credentials, SSH keys/trust, Docker state, and readiness stay workstation-local.

## Public ChatGPT contract

Project Forge's public ChatGPT bootstrap entrypoint is [`chatgpt/START_HERE.md`](chatgpt/START_HERE.md).

The stable descriptor at `chatgpt/current.json` resolves an immutable Project Forge contract snapshot for each conversation/session. New contract versions are published as new snapshot directories so an already-resolved session keeps a stable contract.

## Public engineering distribution

`@mriekki/project-forge` is the public distribution for Project Forge engineering assets used by generated projects.

Project Forge assembles that package from approved private platform components using exact pinned source commits and deterministic distribution descriptors. Published packages are self-contained; Builders do not need access to the private implementation repositories to install or update managed assets.

Install:

```powershell
npx @mriekki/project-forge install
```

Update to the newest published package:

```powershell
npx @mriekki/project-forge@latest update
```

Inspect and verify:

```powershell
npx @mriekki/project-forge@latest status
npx @mriekki/project-forge@latest check
```

Managed updates verify baselines and refuse unsafe drift or conflicts before modifying Project Forge-managed files.

## Maintainer release process

Project Forge maintainers use a gated release workflow that resolves accepted component commits, verifies the assembled package, creates the package pull request, verifies CI, and stops at the explicit publication gate.

Publication uses npm Trusted Publishing (OIDC), reconstructs the exact package from pinned sources, verifies registry identity and integrity, and smoke-tests the public package from a neutral directory.

See [`docs/RELEASE_PROCESS.md`](docs/RELEASE_PROCESS.md) for the technical release contract.
