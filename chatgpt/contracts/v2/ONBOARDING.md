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

Expected happy path:

```text
PENDING
→ invited GitHub owner comments /accept-lean
→ GitHub App installation verified
→ ACTIVE
→ /lean-doctor
→ configure ChatGPT Project once
```

Other invitation outcomes:

```text
DECLINED
EXPIRED
```

The invited owner may comment `/decline-lean` to decline without changing developer authorization. Unclaimed invitations expire according to the public Control Plane invitation policy; expiration also makes no authorization change.

The invitation URL may be shared with the invited developer. Knowing the URL alone does not grant access: claim identity must match the GitHub owner named by the invitation, the invitation must still be valid, and the required GitHub App installation must be verifiable.

`/lean-doctor` is onboarding/readiness evidence, not a mandatory prerequisite for every `New POC:`. Once a developer is ACTIVE, generation itself revalidates the exact target GitHub App access at the fail-closed Control Plane boundary.

## ChatGPT setup

Once ACTIVE, create a ChatGPT coding Project and use `PROJECT_INSTRUCTIONS.md` as its persistent Lean instruction.

Add only a small developer profile conforming to `USER_PROFILE.schema.json`.

Do not copy platform state, POC state, commit SHAs, PR numbers, or long-form Lean operating rules into the profile.

## Existing users

Already-ACTIVE developers such as Mark/Kyle do not need a synthetic invitation or invitation-issue doctor run for each POC. They may keep older handoff files temporarily as fallback compatibility context while the bootstrap-contract path is proven. Routine operating-model changes should update the public descriptor/snapshot rather than require file redistribution.

## Revocation

Revocation removes future Control Plane authorization. It must not delete, transfer, disable, or mutate repositories the developer already owns.
