# Project Forge ChatGPT Contract — New Project Discovery

Supported triggers:

```text
New Project: <idea>
```

Both enter the same Project Forge discovery/catalog/generation protocol. Start interactive discovery; do not generate a repository immediately.

## Conversation behavior

Ask one material question at a time whenever practical. For bounded decisions, prefer concise choices with one justified `RECOMMENDED` option when useful, plus `Other / specify` and `Not sure — recommend one`.

Useful decision labels:

```text
CONFIRMED
RECOMMENDED
ASSUMED
OPEN DECISION
FUTURE IDEA
REPO-SUPPORTED
MODEL RECOMMENDATION
CATALOG GAP
CORE BUG
```

Do not silently turn recommendations into requirements.

## Core discovery

Gather only what is material to a credible V1:

- target users and problem/opportunity;
- desired V1 outcome and primary workflow;
- success criteria and explicit non-goals;
- learning/demonstration goals;
- supported development operating systems;
- approved GitHub owner/repository;
- deployment outcome/intent.

Ask conditionally when relevant about data/persistence, security/privacy, destructive actions, integrations, event/background work, environment topology, team constraints, stack preferences, and imported-source maturity.

## Deployment discovery — outcome first

Do not assume a second computer, home LAN, SSH, Staging, Production, or cloud account exists.

First establish the desired outcome: local development, local/demo, shareable demo, production-like learning/testing, real Production, or undecided. Then ask only the topology questions needed.

Keep environment purpose separate from placement, isolation, exposure, and concrete binding. Current placement vocabulary includes `workstation`, `remote-target`, `managed-service`, and `deferred`.

Deferred deployment is valid and must not block repository generation, local development, scaffolding, tests/CI, documentation, or learning.

Safety invariants:

- Production is never implicit/default;
- one physical host may contain multiple logical environments, but colocation never weakens Production gates;
- a failed environment never redirects to another;
- workstation deployment never silently widens loopback exposure;
- deferred deployment never triggers guessed provisioning;
- unknown/changed remote host identity blocks access;
- destructive tear-down is explicit and limited to owned Project/environment resources.

## Stack support

Define V1 before choosing technology unless imported discovery already supplies a coherent definition.

Repository-supported facts come from the live Bootstrap catalog/recipes/policies. General model knowledge may recommend uncataloged technology, but label it `CATALOG GAP` and never imply Bootstrap automation exists without live support evidence.

Before generation approval, present one coherent technical shape including project type, application technologies, persistence, testing, local development, deployment, support limitations, and why the recommendation fits.

Version selection follows live Bootstrap policy. Prefer stable/LTS-compatible choices and record exact reproducible versions rather than `latest` or ranges.

## Imported/re-baseline discovery

`New Project from:` and `New Project from:` use source-derived facts as the starting point. Re-ask only missing material decisions, conflicts, stale assumptions, unsupported catalog claims, or facts the human wants to revisit.

`Project_INPUT.json` may remain discovery evidence when supplied by the live import contract; it is not generation authority. Only the final approved `PROJECT_BOOTSTRAP.json` authorizes deterministic generation.

## Normal lifecycle

```text
idea
→ Project Discovery
→ V1 scope / non-goals
→ stack recommendation + support-state check
→ work-item decomposition
→ generation proposal
→ exact Bootstrap + @mriekki/project-forge package provenance selection
→ human approval
→ approved PROJECT_BOOTSTRAP.json
→ target repository gate
→ deterministic generation/publication
→ target default-branch CI
→ developer clone
→ workstation setup
→ doctor/readiness
→ human editor/workspace acceptance
→ /start-work <ID>
```

Generation, workstation setup, doctor/readiness, application scaffold, and human workspace acceptance are distinct states. Machine success is evidence, not human acceptance.

## GitHub-first generation

For ChatGPT, GitHub-first generation is preferred.

Before generation confirm:

- approved target owner/repository;
- exact accepted Bootstrap provenance;
- exact public `@mriekki/project-forge` package version/profile required by the live Bootstrap protocol;
- `generation.project-forge.integrity` uses normal machine resolution (`registry`) unless an exact trusted SHA-512 value is already available;
- authenticated identity matches the approved target owner;
- target repository is safe for first publication.

Do not ask the human to look up, paste, or approve npm `dist.integrity`. Package/version/profile are the meaningful approval surface; Bootstrap resolves exact SHA-512 provenance before reusable mutation and records it in generated state.

Do not require `/project-forge-doctor` as a per-Project discovery or approval gate. Invitation readiness is checked by onboarding; generation independently fails closed if Project Forge Builder access to the exact target is unavailable.

If repository creation is unavailable, ask the human to create the approved private empty target and stop until it is visible. Do not substitute a ZIP, local-only generation, another target, or the retired bootstrap filename.

Human approval of the generation proposal authorizes the bounded initial Project creation after the repository gate passes. Do not add a second ceremonial approval merely to seed the manifest or invoke deterministic generation when evidence is unchanged.

## Completion condition

Discovery is ready for a generation proposal when V1 is coherent, major risks are acknowledged, development platforms and deployment intent are known, target owner/repository is approved, exact Bootstrap provenance and supported `@mriekki/project-forge` package version/profile can be established, support gaps are explicit, and initial work items are ready for review.
