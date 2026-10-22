# Project Forge ChatGPT Bootstrap — Start Here

Project Forge uses a small public descriptor so a ChatGPT coding Project can load the current operating contract without copied handoff files.

For a product overview, start with [`../WELCOME.md`](../WELCOME.md). For one-time setup, use [`SETUP.md`](SETUP.md).

## Normal flow

1. Read `chatgpt/current.json`.
2. Resolve the exact immutable contract snapshot named there.
3. Use that snapshot for the current conversation/session.
4. Keep identity and local working/learning preferences in a small Developer Profile only.
5. Treat `New Project: ...` and `New Project: ...` as supported greenfield triggers for the same Project Discovery contract.
6. For an existing generated Project, treat its repository and Project-owned artifacts as authoritative.

If the descriptor or referenced snapshot cannot be loaded and verified, do not perform consequential generation or platform writes using remembered rules.

## Durable state

```text
small Project Forge ChatGPT instruction + small Developer Profile
        ↓
public current.json
        ↓
immutable ChatGPT contract snapshot
        ↓
generated Project repository is the durable Project handoff
```

## New Builder onboarding

```text
PENDING
→ install/approve Project Forge Builder
→ /accept-project-forge
→ identity + App verified
→ ACTIVE
→ readiness verified automatically
→ READY FOR PROJECT FORGE
→ configure ChatGPT Project once
→ New Project: <idea>
```

`/project-forge-doctor` is the readiness retry/diagnostic path when needed; it is not a normal happy-path step.

The invitation contains no private Project definition, credentials, or secrets.
