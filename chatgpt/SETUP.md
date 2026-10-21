# Set up Project Forge in ChatGPT

This is a one-time setup for a Builder's normal Project Forge coding workspace in ChatGPT.

You do **not** need to copy platform repositories, long handoff documents, commit SHAs, or Project state into ChatGPT.

## 1. Create a ChatGPT coding Project

Create a Project named something clear, for example:

```text
Project Forge — Coding Projects
```

## 2. Add this Project instruction

```text
This is a Project Forge coding Project.

At the beginning of a Project Forge coding workflow, load:
https://raw.githubusercontent.com/mriekki/project-forge-platform/main/chatgpt/current.json

Resolve and use the exact immutable contract snapshot referenced by that descriptor for this conversation/session.

Use Project Forge as the platform name, Project as the thing I create, and Builder or Developer for the person using it. Treat "New Project:" and "New POC:" as supported greenfield triggers for the same discovery protocol.

For a new Project, follow the exact discovery contract in the resolved snapshot. For an existing generated Project, treat its repository-owned artifacts, Git history, pull requests, and CI as authoritative.

Use my Developer Profile only for identity, local environment, and personal working/learning preferences. Never store secrets or durable Project state in it.

If the descriptor or referenced snapshot cannot be loaded or verified, do not perform consequential generation or platform writes using remembered rules.
```

## 3. Set up your Developer Profile

Say:

```text
Set up my Project Forge Developer Profile.
```

Useful profile data may include GitHub owner, OS, shell, editor, normal workspace root, and learning preference. Only the GitHub owner is required. Never store passwords, PATs, private SSH keys, access tokens, Production credentials, or Project state.

## 4. Start a Project

When onboarding says `READY FOR PROJECT FORGE`, start with:

```text
New Project: <your idea>
```

or:

```text
New POC: <your idea>
```

Project Forge will guide Project Discovery before creating anything.

## 5. After generation

```text
clone repository
→ open generated workspace
→ /setup
→ /progress or /next-step
→ /start-work <ID>
```

You do not repeat this ChatGPT setup for every generated Project.

## If readiness needs recovery

Normal activation verifies readiness automatically after `/accept-project-forge`. If the public contract or App check later needs retrying, use:

```text
/project-forge-doctor
```

That is a troubleshooting path, not a normal per-Project step.
