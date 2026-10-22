# Project Forge ChatGPT Contract — Project Rules

## Vocabulary

Use **Project Forge** for the platform, **Project** for the normal thing a Builder creates, and **Builder** or **Developer** for the person using it.

`New Project: <idea>` is the greenfield discovery trigger. `New Project from: <PROJECT_INPUT.json or existing product source>` is the imported-discovery trigger. Both enter the same Bootstrap-owned discovery/generation protocol.

Canonical orchestration:

```text
GitHub App: Project Forge Builder
Repository: mriekki/project-forge-control-plane
Generation request: [generate-project] <owner>/<repository>
Generation manifest: PROJECT_BOOTSTRAP.json
```

Do not emit or rely on retired Lean repository names, packages, commands, baselines, or bootstrap filenames.

## Authority and ownership

Live GitHub repositories are authoritative for current engineering state.

- `mriekki/project-forge-core` owns reusable workflow behavior, Human-in-the-Loop rules, agents/skills, learning, review/delivery behavior, and Core packaging/sync.
- `mriekki/project-forge-bootstrap` owns new-project and imported discovery, the catalog/recipes, `PROJECT_BOOTSTRAP.json`, deterministic greenfield generation, setup/doctor/scaffold contracts, initial work-item materialization, and generation of `docs/product/PROJECT_DECISION_LOG.md`.
- `mriekki/project-forge-deployment-kit` owns reusable deployment mechanics.
- `mriekki/project-forge-adoption-kit` owns applying Project Forge behavior to existing repositories.
- `mriekki/project-forge-platform` owns the public `@mriekki/project-forge` distribution and this public ChatGPT contract.
- `mriekki/project-forge-control-plane` owns public invitation/authorization and GitHub-first generation orchestration.
- generated Projects own their product scope, work items, architecture, code/tests, deployment facts, documentation, accepted baselines, generated decision-log state, and Git/PR/CI state.

This public snapshot is a projection of those owners; it does not transfer ownership.

The generated `docs/product/PROJECT_DECISION_LOG.md` preserves accepted discovery rationale and history. It is explanatory Project-owned evidence, not a second requirements specification and not an operative override of `PROJECT_BOOTSTRAP.json`, `PRODUCT_BRIEF.md`, or approved work-item requirements.

## Human-in-the-Loop

Keep meaningful gates for material requirements/scope, substantive plans when warranted, meaningful implementation/diff acceptance, merge/finalize, release publication, and Production deployment.

Once a bounded action is authorized, routine safe mechanics inside that scope should proceed without repeated ceremonial confirmation.

Never force-push, rewrite history, delete unrelated branches, publish releases/tags, or deploy Production without explicit authorization. Merge never implies Production deployment.

## Existing generated Projects

Do not restart discovery for an existing generated consumer unless the human is intentionally re-baselining/importing it.

Prefer these current project surfaces when present:

```text
README.md
PROJECT_BRIEF.md
docs/project-forge-docs.json
docs/product/PROJECT_DECISION_LOG.md
docs/product/*
docs/architecture/*
docs/engineering/*
docs/operations/*
docs/learning/*
docs/work-items/*
PROJECT_BOOTSTRAP.json
PROJECT_FORGE_BASELINE.json
CORE_BASELINE.json
DEPLOYMENT_BASELINE.json
SCAFFOLD_PLAN.json
DEV_ENVIRONMENT.json
DEPLOYMENT_TOPOLOGY.json
AGENTS.md
Git history
pull requests
CI
```

Repository/database/runtime evidence remains authoritative over generated summaries or diagrams.

## Learning

Learning is optional and must not block delivery. Useful entrypoints include `/code-walkthrough`, `/learning-review`, `/coach`, `/db-lab`, `/system-lab`, and `/docs`.

## Reusable-platform defects

Shared managed code keeps its canonical owner. Fix reusable defects in the owning repository, deliver them under normal gates, then propagate the exact accepted change through the supported update path rather than preserving private consumer forks.

## Safety and provenance

Before consequential GitHub writes, verify authenticated identity and target repository safety when tooling allows.

Do not invent commits, PRs, CI results, package support, catalog support, runtime behavior, or deployment facts. Current repository evidence outranks this snapshot when describing current state.
