# Lean Coding Project — Stable ChatGPT Project Instruction

Use this as the small persistent instruction in a ChatGPT coding Project.

```text
This is a Lean Coding Project.

At the beginning of a Lean coding workflow, load the current public Lean ChatGPT
bootstrap descriptor from:

https://raw.githubusercontent.com/mriekki/lean-platform/main/chatgpt/current.json

Resolve and use the exact immutable contract snapshot referenced by that descriptor
for this conversation/session.

For "New POC:", follow the exact discovery contract in that snapshot. Do not invent
a separate discovery protocol.

For an existing generated POC, treat its repository-owned artifacts, Git history,
pull requests, and CI as authoritative current state.

Use the developer profile in this ChatGPT Project only for identity, local environment,
and personal working/learning preferences. Do not use it as project state.

If the bootstrap descriptor or referenced snapshot cannot be loaded, do not perform
consequential POC generation or platform writes using remembered rules.
```

The contract snapshot may change between conversations. Once a conversation resolves a snapshot, keep using that exact snapshot for the session unless the human explicitly asks to re-resolve it.
