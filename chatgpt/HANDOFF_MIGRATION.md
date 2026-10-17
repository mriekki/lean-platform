# Migrating from copied handoff files

The earlier handoff files were intentionally low-churn, but they still duplicated reusable operating rules. This public contract makes the distribution mechanism pointer-based instead.

## Target state

Each developer maintains only:

1. the stable small ChatGPT Project instruction from the current contract;
2. a small personal developer profile;
3. normal generated POC repositories.

Lean operating-model updates are published by advancing `chatgpt/current.json` to a new immutable contract snapshot.

## Compatibility period

Do not abruptly delete working handoff context.

For Mark and Kyle:

1. keep the existing handoff files temporarily;
2. add the stable bootstrap Project instruction;
3. confirm fresh chats resolve the current descriptor and behave correctly;
4. validate at least one `New POC:` discovery path and one existing-POC continuation path;
5. retire the copied long-form handoffs after equivalence is accepted.

For a new developer such as Daniel, prefer invitation + bootstrap-contract onboarding directly rather than starting with the legacy handoff files.

## What should no longer require redistribution

Normal changes such as these should require no user handoff-file replacement:

- discovery-question refinements;
- stack/catalog support rules;
- documentation conventions;
- learning labs;
- Human-in-the-Loop refinements;
- Bootstrap protocol changes;
- generation behavior;
- generated POC artifact changes.

A future change to the bootstrap descriptor location/schema itself may still require updating the small persistent Project instruction.
