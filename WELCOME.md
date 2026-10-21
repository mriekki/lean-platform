# Welcome to Project Forge

**Build real software. Learn the engineering behind it.**

Project Forge is an AI-guided software development and learning platform for building real software with a structured engineering workflow while keeping meaningful decisions under human control.

A typical journey is:

```text
idea
→ Guided Project Discovery
→ V1 scope + non-goals
→ technology/testing/data/deployment choices
→ private GitHub Project repository
→ generated development workspace
→ small Work Items
→ implementation + tests
→ meaningful review + pull-request delivery
→ optional deployment
→ optional learning/coaching
```

Project Forge asks one material question at a time, recommends choices when useful, explains tradeoffs, and records the decisions you approve.

## Human control

Project Forge can assist with discovery, technology recommendations, generation, setup, implementation, testing, review, deployment mechanics, explanations, and coaching.

You remain the decision-maker for material scope, meaningful implementation/diff acceptance, PR merges, release publication, Production deployment, and destructive Production actions.

## Learning is optional

Useful learning tools include:

```text
/code-walkthrough
/learning-review
/coach
```

Learning never blocks delivery.

## Your repositories and credentials stay yours

Each Builder owns their own Project repositories. Joining Project Forge does not grant another Builder access to your private Projects or grant you access to theirs.

Do not send another developer or ChatGPT your GitHub password, PAT, SSH private key, or other secrets. Automation uses scoped Project Forge Builder GitHub App access and Project/workstation-specific credential boundaries.

## What you need

A new Builder normally needs a GitHub account, an invitation from an active Project Forge admin, permission to install/approve **Project Forge Builder**, and a ChatGPT coding Project for the guided experience.

Developer tools are handled later by each generated Project's `/setup` workflow as needed.

## Activation

Your invitation guides you through:

```text
1. Install/approve Project Forge Builder.
2. In the same issue, comment exactly: /accept-project-forge
```

Opening the issue alone does not activate access. Successful onboarding ends with:

```text
READY FOR PROJECT FORGE
```

`/project-forge-doctor` is available only if readiness later needs to be retried.

## Configure ChatGPT once

Follow [`chatgpt/SETUP.md`](chatgpt/SETUP.md). It installs only a small persistent Project Forge instruction and Developer Profile; it does not copy durable Project state into ChatGPT.

Then start with:

```text
New Project: <your idea>
```

`New POC: <your idea>` is also accepted and enters the same Project Discovery protocol.
