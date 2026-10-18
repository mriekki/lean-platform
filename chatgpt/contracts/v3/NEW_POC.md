# Project Forge ChatGPT Contract — New Project Discovery

Canonical human-facing trigger:

```text
New Project: <idea>
```

Compatibility alias:

```text
New POC: <idea>
```

Both triggers enter the same repository-owned discovery/catalog/generation protocol. Do not create a second discovery behavior for the new wording.

Start interactive discovery. Do not generate a repository immediately.

## Conversation behavior

Ask one material question at a time whenever practical.

When a material decision has a bounded answer space, prefer concise choices, normally 3–6 plausible options. Mark a justified preferred option `RECOMMENDED`; include `Other / specify` and `Not sure — recommend one` when useful. Keep genuinely open-ended product framing open-ended.

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

- target users;
- problem/opportunity;
- desired V1 outcome;
- primary end-to-end workflow;
- success criteria;
- explicit V1 non-goals;
- learning/demonstration goals;
- supported development operating systems;
- approved GitHub repository owner/name;
- deployment outcome/intent.

Ask conditionally when relevant about:

- data/persistence;
- security/privacy and sensitive data;
- destructive or consequential actions;
- external integrations;
- background/event-driven work;
- deployment/environment topology;
- repository/team constraints;
- stack constraints/preferences;
- imported source maturity and future-roadmap intent.

## Deployment discovery — outcome first

Do not begin by assuming a second computer, a home LAN, SSH, Staging, or Production exists.

When deployment is material, establish the desired outcome before infrastructure. Prefer a bounded choice such as:

```text
How do you expect to run/share this Project?

1. Local development only
2. Local/demo use on my development machine
3. Shareable demo accessible to other people
4. Production-like deployment for learning/testing
5. Real Production deployment
6. Not sure — recommend one
```

Map that decision to deployment outcome/intent without silently choosing infrastructure. Only then ask the smallest topology questions needed.

When another execution target may be needed, establish what is actually available:

```text
workstation only
second machine
VPS/cloud VM
managed hosting
undecided
```

A developer with one workstation is a normal discovery case.

Keep environment purpose separate from physical placement:

```text
environment purpose
→ placement
→ isolation
→ exposure
→ optional concrete target/provider binding
```

Current placement vocabulary includes `workstation`, `remote-target`, `managed-service`, and `deferred`.

For compatible local/demo use, a repository-supported one-machine path may be:

```text
purpose: demo
placement: workstation
isolation: container
exposure: loopback
adapter: workstation-container
bindingState: configured
```

The reusable workstation-container adapter is loopback-only. Do not silently widen it to LAN or public exposure.

If the Builder wants a shareable/public demo but has no supported target/provider adapter yet, preserve the outcome and allow an intentionally deferred binding:

```text
purpose: demo
placement: deferred
isolation: deferred
exposure: deferred
adapter: deferred
bindingState: deferred
```

Deferred deployment is a valid generated-Project state. It must not block repository generation, local development, scaffolding, tests/CI, documentation, or learning. Do not force infrastructure provisioning just to make Bootstrap complete.

For a remote target, ask only relevant facts: named environment/purpose, supported target/runtime profile, network scope, access transport, promotion needs, routing intent when material, and lifecycle/disposal intent. Address discovery is not host identity; strict independently verified trust remains separate.

Multiple logical environments may share one physical target. If Staging and Production share a physical failure domain, preserve their independent environment/data/runtime/authorization identities and state explicitly that host-level Production isolation is not demonstrated. Colocation never weakens Production gates.

`managed-service` is a provider-adapter boundary, not generic cloud support. Do not call a provider supported unless the live catalog and reusable implementation define its credential boundary, deterministic plan/apply/check behavior, and proof evidence. Otherwise label the recommendation `CATALOG GAP`.

Safety invariants:

- Production is never implicit/default;
- environment identity is independent of physical-machine count;
- failure of one environment never redirects to another;
- workstation deployment never silently widens loopback exposure;
- deferred deployment never triggers guessed provisioning;
- unknown/changed remote host identity blocks access;
- destructive tear-down remains explicit and limited to owned Project/environment resources.

## Stack support

Define V1 before choosing technology unless imported discovery already supplies a coherent definition.

Repository-supported facts must come from the live Bootstrap catalog/recipes/policies. General model knowledge may recommend uncataloged technology, but label it `CATALOG GAP` and never imply Bootstrap automation exists unless live Bootstrap evidence supports it.

Technology recommendations should consider project shape, product constraints, deployment, portability, learning goals, ecosystem fit, and the Builder's familiarity/stretch goals.

After the initial idea and V1 shape are understood, prefer guided bounded choices for technology and deployment decisions: normally 3–6 relevant options, one justified `RECOMMENDED` choice when appropriate, plus `Other / specify` and `Not sure — recommend one`. Free-form answers remain valid.

The recommended baseline should have a free development/testing path. Paid services may be optional integrations but are not required merely to develop/test the baseline.

Version selection follows the live Bootstrap technology policy: use latest stable compatible at definition time, prefer upstream-recommended LTS/stable channels when appropriate, avoid prerelease/nightly by default, and record exact reproducible versions rather than `latest`/ranges.

Docker is optional and must not be inferred merely because the Project is a web application.

Before generation approval, present one coherent proposed technical shape including project type, application technologies, persistence, testing, local development, deployment type, support limitations, and why the recommendation fits.

## Imported/re-baseline discovery

Canonical human-facing trigger:

```text
New Project from: <POC_INPUT.json or existing product source>
```

Compatibility alias:

```text
New POC from: <POC_INPUT.json or existing product source>
```

Treat source-derived facts as the starting point. Do not replay complete discovery.

Re-ask only missing material decisions, conflicts, stale assumptions, unsupported catalog claims, or facts the human wants to revisit. Preserve useful source definition maturity and future-roadmap intent without automatically promoting it.

`POC_INPUT.json` is discovery evidence, not generation authority. Only the final approved `POC_BOOTSTRAP.json` authorizes deterministic generation.

## Normal lifecycle

```text
idea
→ Project Discovery
→ V1 scope / non-goals
→ stack recommendation + support-state check
→ work-item decomposition
→ generation proposal
→ exact Bootstrap + @mriekki/lean distribution provenance selection
→ human approval
→ approved POC_BOOTSTRAP.json
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
- exact public `@mriekki/lean` package name/version/profile required by the live Bootstrap protocol;
- `generation.lean.integrity` uses normal machine resolution (`registry`) unless an exact trusted SHA-512 value is already available;
- authenticated identity matches the approved target owner;
- target repository is safe for first publication.

Do not ask the human to look up, paste, or approve npm `dist.integrity`. Package/version/profile are the meaningful approval surface. Bootstrap resolves exact SHA-512 provenance deterministically before reusable mutation and generated state records the exact resolved value.

Do not require `/lean-doctor` as a per-Project discovery or approval gate. Invitation readiness is verified automatically on the normal activation path; GitHub App target access is independently enforced fail-closed by the Control Plane at generation time.

Do not ask for a local workspace root merely to generate remotely.

If repository creation is unavailable, ask the human to create the approved private empty target and stop until it is visible. Do not silently substitute a ZIP, local-only generation, or a different target.

Human approval of the generation proposal authorizes the bounded initial Project creation after the repository gate passes. Do not insert a second ceremonial approval merely to seed the manifest or invoke deterministic generation when evidence is unchanged.

## Completion condition

Discovery is ready for a generation proposal when:

- V1 is coherent;
- major risks are acknowledged;
- development platforms are known;
- deployment outcome and required logical environment topology are known when relevant;
- target owner/repository is approved;
- exact Bootstrap provenance can be established;
- exact supported `@mriekki/lean` package version/profile can be established and integrity can be machine-resolved;
- stack/deployment choices are supported or an explicit catalog-gap decision is recorded;
- initial V1 work items and preserved future roadmap are ready for review;
- imported project artifacts are classified when applicable.

Technical identifiers such as `POC_BOOTSTRAP.json`, `POC_INPUT.json`, `greenfield-poc`, and `[generate-poc]` remain exact compatibility names even though the human-facing term is Project.
