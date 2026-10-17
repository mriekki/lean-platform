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

## Doctor/readiness

`/lean-doctor` is onboarding/readiness evidence, not a mandatory prerequisite for every `New POC:`. Once a developer is ACTIVE, generation itself revalidates the exact target GitHub App access at the fail-closed Control Plane boundary.

For a newly invited developer, the invitation issue remains the natural doctor surface after activation.

For an already-ACTIVE developer without an invitation issue, use the standalone Control Plane doctor path:

```text
[lean-doctor] <github-owner>
```

Open that public issue with an empty body. Opening it runs the readiness check immediately. After fixing a failed prerequisite, comment exactly `/lean-doctor` on the same issue to retry. Self-service is limited to the matching ACTIVE developer; an authorized Lean admin may run the doctor for another ACTIVE developer.

The standalone doctor issue contains only the GitHub owner identity. It does not authorize generation, change developer status, or become POC state.

## ChatGPT setup

Once ACTIVE, create a ChatGPT coding Project and use `PROJECT_INSTRUCTIONS.md` as its persistent Lean instruction.

Add only a small developer profile conforming to `USER_PROFILE.schema.json`.

Do not copy platform state, POC state, commit SHAs, PR numbers, or long-form Lean operating rules into the profile.

## Existing users

Already-ACTIVE developers such as Mark/Kyle do not need a synthetic invitation or invitation-issue doctor run for each POC. They may keep older handoff files temporarily as fallback compatibility context while the bootstrap-contract path is proven. Routine operating-model changes should update the public descriptor/snapshot rather than require file redistribution.

## Revocation

Revocation removes future Control Plane authorization. It must not delete, transfer, disable, or mutate repositories the developer already owns.
