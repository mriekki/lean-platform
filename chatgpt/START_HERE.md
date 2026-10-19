# Project Forge ChatGPT Bootstrap — Start Here

Project Forge uses a small public bootstrap descriptor so a ChatGPT coding Project can load the current operating contract without copied handoff files.

For a product overview, start with [`../WELCOME.md`](../WELCOME.md).

For one-time ChatGPT setup, use [`SETUP.md`](SETUP.md).

## Normal flow

1. Read `chatgpt/current.json`.
2. Resolve the exact immutable contract snapshot named there.
3. Use that snapshot for the current conversation/session.
4. Keep user-specific identity and local development/learning preferences in a small Developer Profile only.
5. Treat `New Project: ...` as the greenfield project trigger and follow the snapshot's repository-owned Project Discovery contract.
6. For an existing generated Project, treat the repository and its project-owned artifacts as authoritative.

If the current descriptor or referenced snapshot cannot be loaded and verified, do not perform consequential generation or platform writes using remembered rules.

## Project Forge vocabulary

Use these terms in Builder-facing conversation:

```text
Project Forge .... platform
Project .......... thing the Builder creates
Builder/Developer  person using the platform
Project Discovery  idea-to-definition process
Project Workflow . implementation/delivery lifecycle
Learning Track .... optional structured learning/coaching
Developer Profile . small personal identity/environment/preferences profile
```

Technical files and commands should be used when the workflow requires them, but implementation naming should not be surfaced unnecessarily to Builders.

## Project state

The Project Forge contract supplies reusable workflow behavior. Once a software Project has been generated, its GitHub repository becomes the durable source of truth for that Project's scope, work items, architecture, setup, code, tests, delivery state, and accepted baselines.

The steady-state model is:

```text
small Project Forge ChatGPT instruction + small Developer Profile
        ↓
public current.json
        ↓
immutable ChatGPT contract snapshot
        ↓
generated Project Repository becomes the durable project handoff
```

Routine platform changes update the public contract snapshot/descriptor rather than require Builders to copy new handoff documents into ChatGPT.

## New Builder onboarding

A Project Forge invitation uses one public Control Plane issue as the activation portal:

```text
PENDING
→ install/approve Project Forge Builder
→ /accept-lean
→ identity + App verified
→ ACTIVE
→ readiness verified automatically
→ READY FOR PROJECT FORGE
→ configure ChatGPT Project once
→ New Project: <idea>
```

`/lean-doctor` is available as a readiness retry/diagnostic path if the automatic post-activation check fails or later needs to be re-run; it is not a normal happy-path step.

The invitation contains no private Project definition, credentials, or secrets.

See the current immutable contract snapshot for the exact operating rules and Developer Profile schema.
