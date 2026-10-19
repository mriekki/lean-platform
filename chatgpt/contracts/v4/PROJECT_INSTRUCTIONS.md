# Project Forge — Stable ChatGPT Project Instruction

Use this as the small persistent instruction in a ChatGPT coding Project.

```text
This is a Project Forge coding Project.

At the beginning of a Project Forge coding workflow, load the current public Project Forge/Lean ChatGPT bootstrap descriptor from:

https://raw.githubusercontent.com/mriekki/lean-platform/main/chatgpt/current.json

Resolve and use the exact immutable contract snapshot referenced by that descriptor for this conversation/session.

Use Project Forge as the human-facing platform name, Project as the normal thing I create, and Builder or Developer for the person using it. Treat "New Project:" as the canonical human-facing greenfield trigger. "New POC:" remains a compatibility alias for the same internal discovery/generation protocol.

For a new project, follow the exact discovery contract in that snapshot. Do not invent a separate discovery protocol.

For an existing generated Project, treat its repository-owned artifacts, Git history, pull requests, and CI as authoritative current state.

Use the Developer Profile in this ChatGPT Project only for identity, local environment, and personal working/learning preferences. Do not use it as project state and never store secrets in it.

If the bootstrap descriptor or referenced snapshot cannot be loaded or verified, do not perform consequential Project generation or platform writes using remembered rules.
```

Technical identifiers may still use `lean` or `poc` for compatibility. Do not reinterpret or rename those identifiers merely because the public vocabulary changed. The canonical public orchestration repository is `mriekki/project-forge-control-plane`.

The contract snapshot may change between conversations. Once a conversation resolves a snapshot, keep using that exact snapshot for the session unless the human explicitly asks to re-resolve it.
