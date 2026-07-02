# packages/

Shared Bun-workspace packages consumed by `apps/*` and `tools/*`. Each package
has its own `README.md` (a handful use `AGENTS.md` as their primary doc, with a
one-line `README.md` pointer added for GitHub-preview/README-only tooling —
see the "Docs" column below).

| Package | Docs | Status | Purpose |
|---------|------|--------|---------|
| [`agent-resolver`](agent-resolver) | [AGENTS.md](agent-resolver/AGENTS.md) | private | Pure id-algebra for the deck↔console agent identity thread (`normalizeAgentId`, `candidateKeys`, `sameAgent`). |
| [`agent-workspace`](agent-workspace) | [README.md](agent-workspace/README.md) | private | Pure workspace contract helpers for generated GE agents. |
| [`contracts`](contracts) | [AGENTS.md](contracts/AGENTS.md) | private | The single typed shape every GE surface agrees on (console, presentation, and the `.mjs` tools via JSDoc). |
| [`design`](design) | [AGENTS.md](design/AGENTS.md) | private | Single source design system for every GE front-end (`apps/console`, `apps/presentation`). |
| [`factory-install`](factory-install) | [README.md](factory-install/README.md) | private | Plan-only install contract for the GE factory deployment surface. |
| [`generated-agent-runtime`](generated-agent-runtime) | [README.md](generated-agent-runtime/README.md) | Python, no `package.json` | Shared Python helpers for generated GE agents. |
| [`okf`](okf) | [README.md](okf/README.md) | private | Standalone, dependency-free toolkit for the Open Knowledge Format (OKF) v0.1. |
| [`run-ledger`](run-ledger) | [README.md](run-ledger/README.md) | private | Framework-agnostic "follow any long-running pipeline" observability primitive (run/stage ledger + SSE frame/event schema). |
| [`runtime`](runtime) | [README.md](runtime/README.md) | private | Standalone JavaScript helpers for GE factory runtime events, task summaries, blockers, artifact refs, and resume plans. |
| [`simulator-packs`](simulator-packs) | [README.md](simulator-packs/README.md) | private | Package facade for the simulator corpus currently stored under `apps/factory/simulator-systems`. |
| [`simulator-runtime`](simulator-runtime) | [README.md](simulator-runtime/README.md) | Python, no `package.json` | Stateful MCP simulator server driven by a JSON pack corpus, with FK integrity, idempotency, and throttling. |
| [`std`](std) | [README.md](std/README.md) | private | Neutral leaf utilities (naming, cli-args, json-io, json-repair, csv-io, list, gcp-config, merge) shared across `apps/*`, `tools/*`, and `packages/*`. |
| [`ui`](ui) | [AGENTS.md](ui/AGENTS.md) | private | Shared GE React UI primitives used by every front-end (`apps/console`, `apps/presentation`). |

See [`CONTRIBUTING.md`](../CONTRIBUTING.md#repo-layout) for how `packages/`
fits into the rest of the repo, and
[`packages/std/README.md`](std/README.md) for the `@ge/std` utility catalog.
