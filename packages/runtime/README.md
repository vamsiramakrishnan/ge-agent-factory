# @ge/runtime

Standalone JavaScript helpers for GE factory runtime events, task summaries, blockers,
artifact refs, and resume plans.

## Solves

- Lets daemon, CLI, UI, and future remote workers share one runtime contract.
- Keeps event parsing and task normalization testable without importing the CLI.
- Provides a small package boundary for future publishing or reuse in external runners.
