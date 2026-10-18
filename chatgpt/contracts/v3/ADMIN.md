# Project Forge ChatGPT Contract — Platform Administration

These behaviors apply only when the current authenticated developer is an ACTIVE Project Forge admin according to the public Control Plane developer registry.

Project Forge is the human-facing product name. Existing technical compatibility identifiers such as `[invite-lean]`, `/accept-lean`, `poc-author`, and repository names remain unchanged unless a separate migration is explicitly approved.

Project Forge must not make membership in a shared or admin-owned GitHub organization a normal prerequisite for Builder onboarding, Project creation, local development, or supported deployment paths. Builders normally use their own GitHub identities and own their own Project repositories. If a specific Project or external target genuinely requires organization-owned resources, treat that as an explicit project/environment-specific prerequisite rather than a platform default.

## Invite a Builder

When an admin asks to invite someone to Project Forge:

1. resolve the exact GitHub owner; do not infer a login from a person's display name;
2. inspect the current public developer registry and Control Plane invitation contract;
3. if the owner is already ACTIVE, report that instead of creating another invitation;
4. present one meaningful authorization gate:

```text
PROJECT FORGE INVITATION

GitHub owner: <owner>
Role: Project Builder
Capabilities:
- create/generate Project Forge projects owned by that developer
- normal supported consumer update/sync paths

The Builder owns their repositories and receives no direct access to another
Builder's private projects or to private Core/Bootstrap source repositories.

Create invitation?
```

5. after explicit approval, create one empty-body public issue in `mriekki/lean-poc-control-plane` titled exactly:

```text
[invite-lean] <github-owner>
```

6. return that issue URL as the one invitation/onboarding link.

Do not directly edit the developer registry merely because an invitation was requested. Activation is owned by the claim workflow after the invited GitHub identity accepts and the GitHub App installation is verified.

The normal invitation UX should explain Project Forge before activation and should require only the GitHub App installation plus `/accept-lean`. Readiness verification is automatic after successful activation; `/lean-doctor` is a retry/diagnostic path rather than a normal extra onboarding step.

## Revoke a Builder

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
- automatic post-accept readiness evidence on a newly activated invitation;
- `/lean-doctor` on an invitation issue only when readiness needs to be retried;
- for an already-ACTIVE developer without an invitation issue, one empty-body public issue titled `[lean-doctor] <github-owner>`; opening it runs the doctor immediately and `/lean-doctor` may retry it.

Doctor/readiness results are onboarding evidence, not a per-Project discovery or generation prerequisite. Generation independently fails closed if the required GitHub App target access is unavailable.

Never treat a person's ChatGPT Developer Profile, a copied handoff file, or a generated Project repository as the authorization registry.
