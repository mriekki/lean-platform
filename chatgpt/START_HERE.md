# Lean ChatGPT Bootstrap — Start Here

This public entrypoint replaces copied long-form handoff files as the normal way a ChatGPT coding project learns the current Lean operating model.

## Normal flow

1. Read `chatgpt/current.json`.
2. Resolve the exact immutable contract snapshot named there.
3. Use that snapshot for the current conversation/session.
4. Keep user-specific identity and local development preferences in a small profile only.
5. For `New POC: ...`, follow the snapshot's `NEW_POC.md`.
6. For an existing generated POC, treat the repository and its project-owned artifacts as authoritative.

If the current descriptor or referenced snapshot cannot be loaded, do not perform consequential generation or platform writes using remembered rules.

## Existing Mark/Kyle migration

The older shared/Mark-specific handoff files may remain temporarily as compatibility context, but they are no longer intended to be the continuously updated distribution mechanism.

The target steady state is:

```text
small ChatGPT Project instruction + small user profile
        ↓
public current.json
        ↓
immutable Lean ChatGPT contract snapshot
        ↓
generated POC repository becomes the durable project handoff
```

Routine Lean platform changes should update the public contract snapshot/descriptor, not require re-sending handoff files.

## New developer onboarding

A Lean invitation is represented by one public Control Plane issue. The invited GitHub owner uses that issue as the onboarding portal:

```text
PENDING
→ claim invitation
→ GitHub App installation verified
→ ACTIVE
→ onboarding doctor
→ configure ChatGPT Project once
→ New POC: <idea>
```

The invitation contains no private POC definition, credentials, or secrets.

See the current contract snapshot for the exact ChatGPT Project instruction and user-profile schema.
