# Project Forge ChatGPT Contract — Onboarding

Project Forge onboarding separates identity/authorization from operating rules and Project state.

Canonical public surfaces:

```text
GitHub App: Project Forge Builder
Control Plane: mriekki/project-forge-control-plane
Public contract: https://raw.githubusercontent.com/mriekki/project-forge-platform/main/chatgpt/current.json
```

## Invitation

A Project Forge Control Plane invitation issue is the onboarding portal. It grants no access merely by being opened or forwarded.

Happy path:

```text
PENDING
→ open invitation issue
→ install/approve Project Forge Builder
→ invited GitHub owner comments /accept-project-forge
→ identity + App installation verified
→ ACTIVE
→ public Project Forge contract verified automatically
→ READY FOR PROJECT FORGE
→ configure ChatGPT Project once
```

The invited owner may comment `/decline-project-forge`; unclaimed invitations expire under the public invitation policy. Neither decline nor expiration grants authorization.

## Automatic readiness and doctor retry

Successful `/accept-project-forge` activation performs normal readiness verification automatically. The check verifies ACTIVE authorization, Project Forge Builder availability, and the public `project-forge-platform/chatgpt/current.json` descriptor plus its SHA-256-pinned documents.

If readiness later needs retrying, use:

```text
/project-forge-doctor
```

For an already-ACTIVE developer without an invitation issue, open:

```text
[project-forge-doctor] <github-owner>
```

Doctor/readiness is onboarding evidence, not a mandatory prerequisite for every `New Project:` or `New POC:` request. Generation separately revalidates exact target access.

## Admin self-test

An ACTIVE admin may rehearse onboarding with `[test-invite-forge]`. Test mode is self-only and non-authorizing: no registry mutation, role/capability change, Project generation, deployment, or tear-down.

## ChatGPT setup

Once READY FOR PROJECT FORGE, configure a ChatGPT coding Project once using the current public contract and a small Developer Profile conforming to `USER_PROFILE.schema.json`.

The profile may contain identity, OS/shell/editor/workspace root, learning preference, and contract channel. It must not contain secrets or durable Project state.

Normal next action:

```text
New Project: <idea>
```

`New POC: <idea>` is also a supported trigger for the same discovery protocol.

## Revocation

Revocation removes future Control Plane authorization. It must not delete, transfer, disable, or mutate repositories the developer already owns.
