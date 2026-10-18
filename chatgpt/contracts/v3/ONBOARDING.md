# Project Forge ChatGPT Contract — Onboarding

Project Forge onboarding separates identity/authorization from operating rules and project state.

```text
Invitation / Builder authorization
        ↓
public Project Forge ChatGPT contract
        ↓
New Project discovery
        ↓
generated Project repository becomes the durable project handoff
```

## Invitation

The public Control Plane invitation issue is the onboarding portal.

The invitation should first explain what Project Forge is and what the invited Builder receives:

- the ability to create/generate their own Project Forge projects under their own GitHub account;
- no access to another developer's private Projects;
- no direct access to private Core/Bootstrap source repositories;
- no requirement to share passwords, PATs, private SSH keys, or other credentials.

Expected happy path:

```text
PENDING
→ install/approve Project Forge GitHub App
→ invited GitHub owner comments /accept-lean
→ identity + GitHub App installation verified
→ ACTIVE
→ public Project Forge contract verified automatically
→ READY FOR PROJECT FORGE
→ configure ChatGPT Project once
```

The GitHub App may still be registered under the compatibility display name `Lean POC Generator` during the naming transition.

The invited owner may comment `/decline-lean` to decline without changing developer authorization. Unclaimed invitations expire according to the public Control Plane invitation policy; expiration also makes no authorization change.

Knowing the URL alone does not grant access: claim identity must match the GitHub owner named by the invitation, the invitation must still be valid, and the required GitHub App installation must be verifiable.

## Automatic readiness and doctor retry

Successful `/accept-lean` activation performs normal onboarding readiness verification automatically. A new Builder should not have to run a second ceremonial doctor command on the happy path.

The automatic readiness check verifies that:

- the developer is ACTIVE;
- the GitHub App installation is available;
- the public `lean-platform/chatgpt/current.json` descriptor is reachable;
- every referenced public contract document matches its SHA-256 digest.

The successful state is:

```text
READY FOR PROJECT FORGE
```

If activation succeeds but the public contract cannot be verified, the developer remains ACTIVE and the invitation issue stays available for recovery. After the underlying problem is corrected, the developer or an admin may comment:

```text
/lean-doctor
```

For an already-ACTIVE developer without an invitation issue, use the standalone Control Plane doctor path:

```text
[lean-doctor] <github-owner>
```

Opening that public issue runs the readiness check immediately. After fixing a failed prerequisite, the developer or an admin can comment exactly `/lean-doctor` on the same issue to retry.

Doctor/readiness is onboarding evidence, not a mandatory prerequisite for every `New Project:`. Once a developer is ACTIVE, generation independently revalidates exact target GitHub App access at the fail-closed Control Plane boundary.

## ChatGPT setup

Once READY FOR PROJECT FORGE, configure a ChatGPT coding Project once.

Use the small persistent Project Forge instruction from the current public contract (or the simplified public setup page at `chatgpt/SETUP.md`).

Add only a small Developer Profile conforming to `USER_PROFILE.schema.json`. Gather it conversationally rather than requiring the human to hand-author JSON.

The profile may contain identity, OS/shell/editor/workspace-root, learning preference, and stable contract channel. Do not copy platform state, Project state, commit SHAs, PR numbers, long-form operating rules, or secrets into the profile.

The normal next action is:

```text
New Project: <idea>
```

`New POC:` remains a compatibility alias for the same internal discovery/generation protocol.

## Existing users

Already-ACTIVE developers such as Mark/Kyle do not need a synthetic invitation for each Project. Older handoff files may remain temporarily as fallback compatibility context while the public bootstrap-contract path is proven.

Routine operating-model changes should update the public descriptor/snapshot rather than require file redistribution.

## Revocation

Revocation removes future Control Plane authorization. It must not delete, transfer, disable, or mutate repositories the developer already owns.
