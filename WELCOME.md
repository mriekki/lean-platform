# Welcome to Project Forge

**Build real software. Learn the engineering behind it.**

Project Forge is an AI-guided software development and learning platform for people who want to build their own software projects with a structured engineering workflow instead of treating AI as an unstructured code generator.

You bring an idea. Project Forge helps you turn it into a defined, working project while keeping you in control of the important decisions and giving you optional ways to understand the engineering behind what gets built.

## What Project Forge helps you do

A typical project journey looks like this:

```text
Your idea
   ↓
Guided Project Discovery
   ↓
V1 scope + non-goals
   ↓
Technology, testing, data, and deployment choices
   ↓
Private GitHub Project Repository
   ↓
Ready-to-use development workspace
   ↓
Small Work Items
   ↓
AI-assisted implementation + tests
   ↓
Meaningful review and pull-request delivery
   ↓
Optional environments and deployment
   ↓
Optional Code Walkthrough / Learning Review / Coaching
```

You do not need to know the final architecture before you start. Project Forge asks one material question at a time, recommends choices when useful, explains tradeoffs, and records the decisions you approve.

## A simple example

You might start with:

```text
New Project: I want an app that tracks hiking trails I've completed.
```

Project Forge may help you work through questions such as:

- Who will use it?
- What should V1 actually accomplish?
- Is this primarily a web, mobile, desktop, CLI, embedded, automation, or AI project?
- What stack best fits the goal and what you want to learn?
- What data needs to persist?
- What testing approach makes sense?
- Should V1 run only locally, or should it have Demo, Staging, or Production environments later?

Before project creation, you see the proposed scope and technical shape and decide whether to accept or change it.

Once approved, Project Forge can create and generate the initial private GitHub project under **your own GitHub account**, verify its CI, and guide you into local setup.

## What the AI does—and what you still control

Project Forge can help with discovery, technology recommendations, project generation, setup guidance, implementation, testing, review, deployment mechanics, explanations, and coaching.

It does not remove meaningful human gates. You remain responsible for decisions such as:

- what you are actually building;
- material scope changes;
- accepting meaningful implementation or diff changes;
- merging pull requests;
- publishing releases;
- Production deployment and destructive Production actions.

The goal is to remove repetitive ceremony without removing human judgment.

## The learning layer

Learning is optional.

You can focus almost entirely on getting something built, or ask Project Forge to help you understand more of the code and engineering decisions along the way.

The normal learning tools include:

```text
/code-walkthrough
/learning-review
/coach
```

A Developer Profile can record a learning preference such as minimal, normal, or strong so the experience can fit what you want from a particular period of work.

Learning never has to block delivery.

## Projects can grow with you

A Project may be a small experiment, but it may also grow to include:

- persistent application data;
- CI and pull-request delivery;
- multiple developers or workstations;
- Demo, Staging, Production, or other named environments;
- deployment and tear-down workflows;
- ongoing Work Items and roadmap development.

## Your projects and credentials stay yours

Each Builder owns their own project repositories.

Joining Project Forge does **not** grant access to another developer's private applications, and another Builder does not automatically receive access to yours.

Project Forge also does not require you to send another developer or ChatGPT your GitHub password, personal access token, SSH private key, or other secrets.

Technical automation uses scoped **Project Forge Builder** GitHub App access and project/workstation-specific credential boundaries.

## What you need to join

A new Builder normally needs:

- a GitHub account;
- an invitation from an active Project Forge admin;
- permission to install or approve the **Project Forge Builder** GitHub App;
- a ChatGPT account with a coding Project for the guided experience.

Developer tools such as VS Code, language SDKs, Docker, databases, or platform-specific tooling are handled later by each generated project's `/setup` workflow as needed. You do not need to preinstall every technology Project Forge supports before joining.

## Activation is intentionally short

Your personal invitation issue guides you through two actions:

```text
1. Install/approve the Project Forge Builder GitHub App
2. In that same issue, add a comment containing exactly: /accept-lean
```

Opening the invitation link alone does not activate access. Project Forge verifies the exact invited GitHub identity, App installation, authorization, and public platform contract after the explicit `/accept-lean` comment.

A successful onboarding ends with:

```text
READY FOR PROJECT FORGE
```

The `/lean-doctor` command is available if a readiness check ever needs to be retried, but it is not part of the normal happy path.

## Configure ChatGPT once

After activation, follow the one-time setup at:

[`chatgpt/SETUP.md`](chatgpt/SETUP.md)

That setup creates a small Project Forge coding Project in ChatGPT and records only a lightweight Developer Profile—identity, local environment/preferences, and learning preference. It does not store project state or secrets.

## Then start building

Once setup is complete, your normal starting point is simply:

```text
New Project: <your idea>
```

If you're not sure what to build, you can ask for project ideas or for a walkthrough of an example Project Forge journey before creating anything.
