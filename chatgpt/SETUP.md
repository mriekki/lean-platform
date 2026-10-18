# Set up Project Forge in ChatGPT

This is a one-time setup for a Builder's normal Project Forge coding workspace in ChatGPT.

You do **not** need to copy platform repositories, long handoff documents, commit SHAs, or project state into ChatGPT.

## 1. Create a ChatGPT coding Project

Create a new ChatGPT Project named something clear, for example:

```text
Project Forge — Coding Projects
```

Use that Project for Project Forge discovery and project work.

## 2. Add this Project instruction

Copy the following into the ChatGPT Project's persistent instructions:

```text
This is a Project Forge coding Project.

At the beginning of a Project Forge coding workflow, load the current public Project Forge/Lean ChatGPT bootstrap descriptor from:

https://raw.githubusercontent.com/mriekki/lean-platform/main/chatgpt/current.json

Resolve and use the exact immutable contract snapshot referenced by that descriptor for this conversation/session.

Use Project Forge as the human-facing platform name, Project as the normal thing I create, and Builder or Developer for the person using it. Treat "New Project:" as the canonical human-facing greenfield trigger. "New POC:" remains a compatibility alias for the same internal discovery/generation protocol.

For a new project, follow the exact discovery contract in the resolved snapshot. Do not invent a separate discovery protocol.

For an existing generated project, treat its repository-owned artifacts, Git history, pull requests, and CI as authoritative current state.

Use my Developer Profile in this ChatGPT Project only for identity, local environment, and personal working/learning preferences. Do not use it as project state and never store secrets in it.

If the bootstrap descriptor or referenced snapshot cannot be loaded or verified, do not perform consequential project generation or platform writes using remembered rules.
```

Technical URLs and identifiers still use `lean`/`poc` in places for compatibility; that does not change the public Project Forge vocabulary.

## 3. Set up your Developer Profile conversationally

In the Project, say:

```text
Set up my Project Forge Developer Profile.
```

ChatGPT should ask only for useful personal information, normally:

- your exact GitHub username;
- your primary operating system;
- preferred shell;
- editor (VS Code is the normal supported default);
- normal projects/workspace folder;
- learning preference: minimal, normal, or strong.

The only required identity field is the GitHub owner. Other preferences may be omitted when unknown or unnecessary.

A conceptual profile looks like:

```json
{
  "schemaVersion": 1,
  "githubOwner": "your-github-user",
  "operatingSystem": "windows",
  "shell": "powershell",
  "editor": "VS Code",
  "workspaceRoot": "D:\\Projects",
  "learningEmphasis": "normal",
  "contractChannel": "stable"
}
```

You should not need to hand-author JSON; the conversation is the normal setup surface.

Never put passwords, PATs, private SSH keys, access tokens, Production credentials, or project state in the Developer Profile.

## 4. Start your first project

When your Project Forge invitation/readiness says:

```text
READY FOR PROJECT FORGE
```

start with:

```text
New Project: <your idea>
```

Examples:

```text
New Project: I want a small web app for tracking hiking trails I've completed.
```

```text
New Project: I want to learn Playwright by building a useful browser-testing project.
```

```text
New Project: I want a local AI tool that organizes notes without requiring a paid API.
```

Project Forge will guide discovery before creating anything.

## 5. After a project is generated

The generated GitHub repository becomes the durable handoff for that project.

The normal workstation flow is:

```text
clone the repository
→ open the generated VS Code workspace
→ /setup
→ /progress or /next-step
→ /start-work <ID>
```

You do not need to repeat this ChatGPT Project setup for every generated project.

## If something is not ready

Your invitation normally performs readiness verification automatically after `/accept-lean`.

If the public contract or GitHub App check later needs to be retried, use the invitation/doctor issue's existing compatibility command:

```text
/lean-doctor
```

That is a troubleshooting/retry path, not a normal per-project step.
