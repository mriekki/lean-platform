# Lean ChatGPT Contract — Platform Administration

These behaviors apply only when the current authenticated developer is an ACTIVE Lean admin according to the public Control Plane developer registry.

## Invite a developer

When an admin asks to invite someone to Lean:

1. resolve the exact GitHub owner; do not infer a login from a person's display name;
2. inspect the current public developer registry and Control Plane invitation contract;
3. if the owner is already ACTIVE, report that instead of creating another invitation;
4. present one meaningful authorization gate:

```text
LEAN INVITATION

GitHub owner: <owner>
Role: POC author
Capabilities:
- generate Lean POCs
- normal supported consumer update/sync paths

The developer will own their repositories and receives no direct access to private
Core/Bootstrap source repositories.

Create invitation?
```

5. after explicit approval, create one empty-body public issue in `mriekki/lean-poc-control-plane` titled exactly:

```text
[invite-lean] <github-owner>
```

6. return that issue URL as the one invitation/onboarding link.

Do not directly edit the developer registry merely because an invitation was requested. Activation is owned by the claim workflow after the invited GitHub identity accepts and the GitHub App installation is verified.

## Revoke a developer

Revocation removes future Control Plane authorization and is a meaningful administrative action.

After confirming the exact ACTIVE GitHub owner, present one explicit gate, then create one empty-body public Control Plane issue:

```text
[revoke-lean] <github-owner>
```

Do not imply revocation deletes, transfers, disables, or mutates repositories the developer already owns.

## Status and readiness

For onboarding/authorization status, use current Control Plane evidence:

- `config/developers.json` for ACTIVE/REVOKED authorization;
- the developer's invitation issue for PENDING/DECLINED/EXPIRED/ACTIVE onboarding history;
- `/lean-doctor` on an invitation issue for readiness evidence after invitation activation;
- for an already-ACTIVE developer without an invitation issue, one empty-body public issue titled `[lean-doctor] <github-owner>`; opening it runs the doctor immediately and `/lean-doctor` may retry it.

Doctor results are onboarding/readiness evidence, not a per-POC discovery or generation prerequisite. Generation independently fails closed if the required GitHub App target access is unavailable.

Never treat a person's ChatGPT profile, a copied handoff file, or a POC repository as the authorization registry.
