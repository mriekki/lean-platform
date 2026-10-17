# Lean ChatGPT Contract — Onboarding

Lean onboarding separates identity/authorization from operating rules and project state.

```text
Invitation / developer authorization
        ↓
public ChatGPT bootstrap contract
        ↓
New POC discovery
        ↓
generated POC repository becomes the durable project handoff
```

## Invitation

The public Control Plane invitation issue is the onboarding portal.

Expected lifecycle:

```text
PENDING
→ invited GitHub owner comments /accept-lean
→ GitHub App installation verified
→ ACTIVE
→ /lean-doctor
→ configure ChatGPT Project once
```

The invitation URL may be shared with the invited developer. Knowing the URL alone does not grant access: claim identity must match the GitHub owner named by the invitation, and the required GitHub App installation must be verifiable.

## ChatGPT setup

Once ACTIVE, create a ChatGPT coding Project and use `PROJECT_INSTRUCTIONS.md` as its persistent Lean instruction.

Add only a small developer profile conforming to `USER_PROFILE.schema.json`.

Do not copy platform state, POC state, commit SHAs, PR numbers, or long-form Lean operating rules into the profile.

## Existing users

Mark/Kyle may keep older handoff files temporarily as fallback compatibility context while the bootstrap-contract path is proven. Routine operating-model changes should update the public descriptor/snapshot rather than require file redistribution.

## Revocation

Revocation removes future Control Plane authorization. It must not delete, transfer, disable, or mutate repositories the developer already owns.
