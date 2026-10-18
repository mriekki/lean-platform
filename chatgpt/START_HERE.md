# Project Forge ChatGPT Bootstrap — Start Here

Project Forge is the human-facing product. Existing `lean-*`, `poc-*`, package, schema, and command identifiers remain stable compatibility surfaces.

For a product overview, start with [`../WELCOME.md`](../WELCOME.md).

For one-time ChatGPT setup, use [`SETUP.md`](SETUP.md).

This bootstrap entrypoint replaces copied long-form handoff files as the normal way a Project Forge coding Project learns the current operating model.

## Normal flow

1. Read `chatgpt/current.json`.
2. Resolve the exact immutable contract snapshot named there.
3. Use that snapshot for the current conversation/session.
4. Keep user-specific identity and local development/learning preferences in a small Developer Profile only.
5. Treat `New Project: ...` as the canonical human-facing greenfield trigger and map it to the snapshot's repository-owned new-project discovery contract.
6. Keep `New POC: ...` as a compatibility alias for the same behavior.
7. For an existing generated Project, treat the repository and its project-owned artifacts as authoritative.

If the current descriptor or referenced snapshot cannot be loaded and verified, do not perform consequential generation or platform writes using remembered rules.

## Terminology boundary

Human-facing vocabulary:

```text
Project Forge .... platform
Project .......... thing the Builder creates
Builder/Developer  person using the platform
Project Discovery  idea-to-definition process
Project Workflow . implementation/delivery lifecycle
Learning Track .... optional structured learning/coaching
Developer Profile . small personal identity/environment/preferences profile
```

Stable technical compatibility identifiers may still contain `Lean` or `POC`, including repository names, `@mriekki/lean`, `POC_BOOTSTRAP.json`, `[generate-poc]`, `/accept-lean`, and `/lean-update`.

Do not rename or reinterpret those technical identifiers merely because the public vocabulary changed.

## Existing Mark/Kyle migration

Older shared/user-specific handoff files may remain temporarily as compatibility context, but they are no longer intended to be the continuously updated distribution mechanism.

The target steady state is:

```text
small Project Forge ChatGPT instruction + small Developer Profile
        ↓
public current.json
        ↓
immutable ChatGPT contract snapshot
        ↓
generated Project repository becomes the durable project handoff
```

Routine platform changes should update the public contract snapshot/descriptor rather than require re-sending handoff files.

## New Builder onboarding

A Project Forge invitation is represented by one public Control Plane issue. The invited GitHub owner uses that issue as the activation portal:

```text
PENDING
→ install/approve GitHub App
→ /accept-lean
→ identity + App verified
→ ACTIVE
→ readiness verified automatically
→ READY FOR PROJECT FORGE
→ configure ChatGPT Project once
→ New Project: <idea>
```

`/lean-doctor` remains available as a readiness retry/diagnostic path if the automatic post-activation check fails or later needs to be re-run; it is not a normal happy-path step.

The invitation contains no private Project definition, credentials, or secrets.

See the current immutable contract snapshot for the exact operating rules and Developer Profile schema.
