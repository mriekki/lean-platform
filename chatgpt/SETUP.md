# Set up Project Forge in ChatGPT

This is a one-time setup for a Builder's normal Project Forge coding workspace in ChatGPT.

You do **not** need to copy platform repositories, long handoff documents, commit SHAs, or Project state into ChatGPT.

## 1. Create a ChatGPT coding Project

Create a Project named something clear, for example:

```text
Project Forge — Coding Projects
```

## 2. Add the exact current Project instruction

The canonical persistent instruction is `PROJECT_INSTRUCTIONS.md` in the immutable contract snapshot named by:

```text
https://raw.githubusercontent.com/mriekki/project-forge-platform/main/chatgpt/current.json
```

Read `snapshotPath` from that descriptor, open `PROJECT_INSTRUCTIONS.md` under that exact snapshot directory, and copy the fenced instruction text **verbatim** into the ChatGPT Project instructions.

Do not maintain a second hand-copied variant from this setup page. When Project Forge advances the stable contract, `chatgpt/current.json` is the pointer to the current immutable instruction source.

The persistent instruction should remain small. Do not add legacy/versioned handoff-file references, component commit SHAs, product requirements, or current Project state to it.

## 3. Set up your Developer Profile

Say:

```text
Set up my Project Forge Developer Profile.
```

Useful profile data may include GitHub owner, OS, shell, editor, normal workspace root, and learning preference. Only the GitHub owner is required. Never store passwords, PATs, private SSH keys, access tokens, Production credentials, or Project state.

## 4. Start a Project

When onboarding says `READY FOR PROJECT FORGE`, start greenfield discovery with:

```text
New Project: <your idea>
```

For imported discovery from an existing product definition or validated `PROJECT_INPUT.json`, start with:

```text
New Project from: <PROJECT_INPUT.json or existing product source>
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

You do not repeat this ChatGPT setup for every generated Project. The generated repository is the durable Project handoff and current-state authority.

## If readiness needs recovery

Normal activation verifies readiness automatically after `/accept-project-forge`. If the public contract or App check later needs retrying, use:

```text
/project-forge-doctor
```

That is a troubleshooting path, not a normal per-Project step.
