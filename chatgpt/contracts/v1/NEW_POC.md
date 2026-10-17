# Lean ChatGPT Contract — New POC Discovery

Trigger:

```text
New POC: <idea>
```

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
- production/deployment intent.

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

## Stack support

Define V1 before choosing technology unless imported discovery already supplies a coherent definition.

Repository-supported facts must come from the live Bootstrap catalog/recipes/policies. General model knowledge may recommend uncataloged technology, but label it `CATALOG GAP` and never imply Bootstrap automation exists unless live Bootstrap evidence supports it.

## Imported/re-baseline discovery

Trigger:

```text
New POC from: <POC_INPUT.json or existing product source>
```

Treat source-derived facts as the starting point. Do not replay complete discovery.

Re-ask only missing material decisions, conflicts, stale assumptions, unsupported catalog claims, or facts the human wants to revisit. Preserve useful source definition maturity and future-roadmap intent without automatically promoting it.

`POC_INPUT.json` is discovery evidence, not generation authority. Only the final approved `POC_BOOTSTRAP.json` authorizes deterministic generation.

## Normal lifecycle

```text
idea
→ discovery
→ V1 scope / non-goals
→ stack recommendation + support-state check
→ work-item decomposition
→ generation proposal
→ exact Bootstrap + Lean distribution provenance selection
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

Generation/setup/doctor/application scaffold/human workspace acceptance are distinct states. Machine success is evidence, not human acceptance.

## GitHub-first generation

For ChatGPT, GitHub-first generation is preferred.

Before generation confirm:

- approved target owner/repository;
- exact accepted Bootstrap provenance;
- exact public Lean package name/version/profile/integrity required by the live Bootstrap protocol;
- authenticated identity matches the approved target owner;
- target repository is safe for first publication.

Do not ask for a local workspace root merely to generate remotely.

If repository creation is unavailable, ask the human to create the approved private empty target and stop until it is visible. Do not silently substitute a ZIP, local-only generation, or a different target.

## Completion condition

Discovery is ready for a generation proposal when:

- V1 is coherent;
- major risks are acknowledged;
- development platforms are known;
- deployment intent/environment roles are known when relevant;
- target owner/repository is approved;
- exact Bootstrap provenance can be established;
- exact supported Lean distribution provenance can be established;
- stack/deployment choices are supported or an explicit catalog-gap decision is recorded;
- initial V1 work items and preserved future roadmap are ready for review;
- imported project artifacts are classified when applicable.
