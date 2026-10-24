# Migrating from copied handoff files

Earlier handoff files intentionally reduced context loss, but they still duplicated reusable operating rules and Project state. Project Forge now uses a pointer-based public contract plus repository-owned Project state instead.

## Target state

Each developer maintains only:

1. the small persistent ChatGPT Project instruction resolved from the current public contract;
2. a small personal Developer Profile for identity, workstation, and learning preferences;
3. normal generated Project repositories as durable Project state.

Project Forge operating-contract updates are published by advancing `chatgpt/current.json` to a new immutable contract snapshot when needed.

## Migrating an existing ChatGPT Project

Do not delete useful historical context before verifying the replacement path.

1. Add the exact current persistent instruction described by [`SETUP.md`](SETUP.md).
2. Confirm a fresh conversation resolves `chatgpt/current.json` and the referenced immutable snapshot.
3. Confirm an existing generated Project can resume from repository-owned artifacts, Git history, pull requests, and CI without copied current-state context.
4. Confirm a new `New Project:` flow follows the current discovery contract.
5. After equivalence is accepted, stop treating copied long-form handoff files as required onboarding or current-state authority.

Legacy handoff files may remain as historical/reference material where useful. They should not need routine updates merely because Project Forge or a generated Project evolves.

New Builders should use invitation + current public-contract onboarding directly rather than starting with legacy handoff files.

## What should no longer require redistribution

Normal changes such as these should require no user handoff-file replacement:

- discovery-question refinements;
- stack/catalog support rules;
- documentation conventions;
- learning labs;
- Human-in-the-Loop refinements;
- Bootstrap protocol changes;
- generation behavior;
- generated Project artifact changes.

A future change to the bootstrap descriptor location or schema itself may still require updating the small persistent Project instruction and this migration guidance.
