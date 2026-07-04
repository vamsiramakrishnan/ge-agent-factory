# packages/

Shared Bun-workspace packages consumed by `apps/*` and `tools/*`. Each package
has its own `README.md` (a handful use `AGENTS.md` as their primary doc, with a
one-line `README.md` pointer added for GitHub-preview/README-only tooling —
see the "Docs" column below; `agent-spec` is schema-first, so its human-facing
doc is the generated [Spec schema](../docs/reference/spec-schema.md) reference).
For where each engine sits on the factory line — station → skill → `ge`
command → package — see the
[factory-line matrix](../skills/README.md#the-factory-line-matrix).

| Package | Docs | Status | Purpose |
|---------|------|--------|---------|
| [`admission`](admission) | [README.md](admission/README.md) | private | Admission-control primitives for shipped agents: workspace/contract content digests, Ed25519-signed DSSE attestations (in-toto) over the proof pack, the consolidated Agent Passport document, and the `evaluateAdmission()` policy evaluator behind `ge passport` and the handoff admission gate. Driven on the line by the [`admitting-agents`](../skills/admitting-agents/SKILL.md) skill. |
| [`agent-resolver`](agent-resolver) | [AGENTS.md](agent-resolver/AGENTS.md) | private | Pure id-algebra for the deck↔console agent identity thread (`normalizeAgentId`, `candidateKeys`, `sameAgent`). |
| [`agent-spec`](agent-spec) | [Spec schema (generated)](../docs/reference/spec-schema.md) | private | The agent-spec contract: zod schemas + inferred types for the generation spec, behavior contract, and normalized registry entry, plus the shipped imperative validators. Leaf package — no `apps/*` or `tools/*` imports. |
| [`agent-workspace`](agent-workspace) | [README.md](agent-workspace/README.md) | private | Pure workspace contract helpers for generated GE agents. |
| [`contracts`](contracts) | [AGENTS.md](contracts/AGENTS.md) | private | The single typed shape every GE surface agrees on (console, presentation, and the `.mjs` tools via JSDoc). |
| [`create-ge-agent-factory`](create-ge-agent-factory) | [README.md](create-ge-agent-factory/README.md) | published (npm) | The `bunx create-ge-agent-factory` bootstrap: clone the repo, provision the toolchain via mise, install deps and the `ge` command, verify the install, and link the factory skills into your coding agent. |
| [`design`](design) | [AGENTS.md](design/AGENTS.md) | private | Single source design system for every GE front-end (`apps/console`, `apps/presentation`). |
| [`evalkit`](evalkit) | [README.md](evalkit/README.md) | private | Eval-generation and eval-metrics engine: the behavioral compiler (graph → expansions → set-cover selection), perturbation/adversarial synthesis, eval-artifact emitters, lexical-similarity metrics, and eval statistics. Driven on the line by the [`driving-live-proof`](../skills/driving-live-proof/SKILL.md) skill via `ge evals compile`; reference: [Evaluation generation](../docs/reference/evaluation-generation.md). |
| [`generated-agent-runtime`](generated-agent-runtime) | [README.md](generated-agent-runtime/README.md) | Python, no `package.json` | Shared Python helpers for generated GE agents. |
| [`okf`](okf) | [README.md](okf/README.md) | private | Standalone, dependency-free toolkit for the Open Knowledge Format (OKF) v0.1. |
| [`run-ledger`](run-ledger) | [README.md](run-ledger/README.md) | private | Framework-agnostic "follow any long-running pipeline" observability primitive (run/stage ledger + SSE frame/event schema). |
| [`runtime`](runtime) | [README.md](runtime/README.md) | private | Standalone JavaScript helpers for GE factory runtime events, task summaries, blockers, artifact refs, and resume plans. |
| [`simulator-runtime`](simulator-runtime) | [README.md](simulator-runtime/README.md) | Python, no `package.json` | Stateful MCP simulator server driven by a JSON pack corpus, with FK integrity, idempotency, and throttling. |
| [`std`](std) | [README.md](std/README.md) | private | Neutral leaf utilities (naming, cli-args, json-io, json-repair, csv-io, list, gcp-config, merge) shared across `apps/*`, `tools/*`, and `packages/*`. |
| [`synthkit`](synthkit) | [README.md](synthkit/README.md) | private | Deterministic synthetic-data engine: pack recipes, seeded statistical distributions, the realism tier, faker-backed value generation, and the Snowfakery recipe renderers. Driven on the line by the [`building-simulators`](../skills/building-simulators/SKILL.md) skill via `ge data synth`; reference: [Synthetic data](../docs/reference/synthetic-data.md). |
| [`ui`](ui) | [AGENTS.md](ui/AGENTS.md) | private | Shared GE React UI primitives used by every front-end (`apps/console`, `apps/presentation`). |

See [`CONTRIBUTING.md`](../CONTRIBUTING.md#repo-layout) for how `packages/`
fits into the rest of the repo, and
[`packages/std/README.md`](std/README.md) for the `@ge/std` utility catalog.
