# Project Forge ChatGPT Contract — Existing Project

For an existing generated Project, the repository is the durable handoff.

Do not restart `New Project:` / `New Project:` discovery unless the human is intentionally re-baselining or importing the Project.

## Resolve current state

Inspect only the evidence needed to determine the actual lifecycle position:

- root briefing/readme;
- authoritative product/work-item docs;
- `docs/project-forge-docs.json` and structured documentation;
- `PROJECT_BOOTSTRAP.json`, `PROJECT_FORGE_BASELINE.json`, and component baselines;
- branch/status/diff;
- pull request and CI state;
- deployment/readiness evidence when relevant.

Conversation state may hold the immediate next action, but durable Project state belongs in the repository.

## Engineering lifecycle

```text
/start-work <ID>
→ requirements/context
→ substantive plan approval when warranted
→ implementation authorization
→ safe short-lived branch setup
→ implementation + tests
→ Reviewer
→ human meaningful-diff acceptance
→ optional learning
→ /deliver
→ PR + PR CI
→ one merge/finalize gate
→ post-merge default-branch CI
→ safe delivered-branch cleanup
→ DELIVERY COMPLETE
```

If evidence materially changes after acceptance, reopen the relevant review gate.

## Learning and documentation

Learning is optional/non-blocking. Relevant entrypoints include `/db-lab`, `/system-lab`, `/code-walkthrough`, `/learning-review`, and `/docs`.

Generated evidence may be refreshed from current safe evidence, but it must not silently replace project-authored authority or invent/approve architectural decisions.
