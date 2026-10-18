# Project Forge ChatGPT Contract — Existing Project

For an existing generated Project, the repository is the durable handoff.

Do not restart `New Project:` discovery (or the legacy `New POC:` alias) unless the human is intentionally re-baselining/importing the project.

## Resolve current state

Inspect only the evidence needed to determine the actual lifecycle position:

- root briefing/readme;
- authoritative product/work-item docs;
- `docs/lean-docs.json` and structured documentation;
- baselines/provenance files;
- branch/status/diff;
- pull request and CI state;
- deployment/readiness evidence when relevant.

Conversation state may hold the immediate next action, but durable project state belongs in the repository.

## Project documentation

Prefer:

```text
README.md
PROJECT_BRIEF.md
docs/lean-docs.json
```

as the front door when present.

Product/work-item authority remains in the repository's declared authoritative documents. Do not let summaries or generated views silently replace those authorities.

Use `/docs` for the local project documentation projection when available.

## Engineering lifecycle

Normal work-item flow:

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

## Learning and documentation follow-up

After delivery, learning and documentation-impact surfaces are optional/non-blocking.

Relevant changes may make these especially useful:

```text
/db-lab changes <work-item>
/system-lab changes <work-item>
/code-walkthrough <work-item>
/learning-review <work-item>
/docs
```

Generated evidence may be refreshed automatically from current safe evidence. Do not silently rewrite project-authored prose or invent/approve ADR decisions.

Technical project artifacts may retain `POC` or `Lean` in their names for compatibility; use Project Forge / Project in human-facing explanations unless quoting an exact identifier.
