# Project Forge ChatGPT Contract — Project Rules

## Public vocabulary and technical compatibility

Use these terms in human-facing conversation and onboarding:

- **Project Forge** — the platform;
- **Project** — the normal thing a Builder creates;
- **Builder** or **Developer** — the person using it;
- **Project Discovery** — idea-to-definition work;
- **Project Workflow** or **Guided Build** — the implementation/delivery lifecycle;
- **Learning Track** — optional structured learning/coaching;
- **Developer Profile** — small user-specific identity/environment/preferences state.

Canonical public orchestration identity:

```text
GitHub App: Project Forge Builder
Repository: mriekki/project-forge-control-plane
```

`mriekki/lean-poc-control-plane` is a historical/redirect compatibility alias only. Preserve stable technical identifiers such as `@mriekki/lean`, `POC_BOOTSTRAP.json`, `POC_INPUT.json`, `[generate-poc]`, `[invite-lean]`, `/accept-lean`, and `/lean-update`.

`New Project:` is the canonical human-facing greenfield trigger. `New POC:` remains a compatibility alias for the same internal discovery/generation behavior.

## Authority

Live repositories are authoritative for current engineering state.

Reusable ownership remains:

- `mriekki/lean-agentic-core` — reusable workflow behavior, Human-in-the-Loop rules, learning, review/delivery behavior, reusable managed assets.
- `mriekki/lean-poc-bootstrap` — new-project discovery, manifest/catalog/recipes, deterministic greenfield generation, setup/doctor/scaffold contracts. Internal files may still use POC terminology.
- `mriekki/lean-platform` — public Project Forge distribution/transport, including this public ChatGPT contract projection.
- `mriekki/project-forge-control-plane` — cross-account invitation/authorization and GitHub-first generation orchestration.
- generated Projects — their own product scope, work items, architecture, code/tests, deployment facts, documentation, accepted baselines, Git/PR/CI state.

This public snapshot is a distribution projection. It does not transfer canonical ownership away from Core, Bootstrap, Deployment Kit, or the Control Plane.

## Human-in-the-Loop

Keep meaningful gates for:

- material requirements/scope;
- substantive plan approval when warranted;
- meaningful implementation/diff acceptance;
- merge/finalize;
- release publication when applicable;
- Production deployment.

Once a bounded action is authorized, routine safe mechanics inside that scope should proceed without repeated ceremonial confirmation.

Never force-push, rewrite history, delete unrelated branches, publish releases/tags, or deploy Production without explicit authorization.

Merge never implies Production deployment.

## Existing generated Projects

Do not restart `New Project:` / `New POC:` discovery for an existing generated consumer unless the human is intentionally re-baselining/importing the project.

Prefer these current project surfaces when present:

```text
README.md
PROJECT_BRIEF.md
docs/lean-docs.json
docs/product/*
docs/architecture/*
docs/engineering/*
docs/operations/*
docs/learning/*
docs/work-items/*
POC_BOOTSTRAP.json
LEAN_BASELINE.json
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

`PROJECT_BRIEF.md` is a project briefing/navigation surface, not a second requirements authority.

Generated DB/System diagrams and the local docs site are disposable evidence projections; repository/database/runtime evidence remains authoritative.

## Learning

Learning is optional and does not block delivery.

Useful entrypoints include:

```text
/code-walkthrough
/learning-review
/coach
/db-lab
/system-lab
/docs
```

Run the labs to get current evidence-backed views; do not require the developer to manually maintain generated diagrams.

## Reusable-platform defects

Shared managed code keeps its canonical owner. Do not preserve private consumer forks of reusable managed files merely because a consumer exposed a defect. Fix the owning canonical repository, deliver it under normal gates, then propagate the exact accepted reusable change through the supported update path.

## Safety and provenance

Before consequential GitHub writes, verify authenticated identity and target repository safety when tooling allows.

Project Forge must not require membership in a shared/admin-owned GitHub organization for normal Builder onboarding, Project creation, local development, or supported deployment paths. Any genuine organization-owned dependency is project/environment-specific and must be explicit.

Do not invent commits, PRs, CI results, package support, catalog support, runtime behavior, or deployment facts.

Current repo evidence outranks this snapshot when describing current state.
