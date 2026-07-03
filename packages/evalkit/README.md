# evalkit

Feed it an agent contract (a `GenerationSpecEnvelope`) and it compiles the
**full executable behavior suite** — behavioral graph, deterministic case pool,
set-cover-selected conversation cases, ADK evalset, agents-cli grading dataset,
bench/load profile — plus the metrics and statistics to grade the results.

It is a **leaf package**: it imports only `@ge/std`, `yaml`, and `zod`, never `apps/*`
or `tools/*` (enforced by `node tools/check-no-app-imports.mjs`), so the `ge`
CLI, the factory's generate pipeline, and the live-proof harness all grade
against one engine that cannot drift between them.

## The behavioral compiler (`@ge/evalkit/compiler`)

A four-stage pipeline; every stage is importable on its own:

| stage | module | what it does |
| ----- | ------ | ------------ |
| graph | `graph.mjs` | `BehavioralGraph` zod schemas + validator — capabilities, tool behaviors, authority edges, personas, worlds |
| build | `compile-from-agent-spec.mjs` | spec envelope → validated graph (stable slug ids, keyword-linked capabilities↔tools/claims) |
| expand | `expansions.mjs` | graph → the deterministic `ConversationCase` pool, each case tagged with `<dimension>:<value>` coverage |
| select | `select-cases.mjs` | greedy weighted set-cover over coverage tags under a case budget, with a coverage/gap report |

`compile.mjs`'s `compileBehavioralSuite` runs the whole pass and (optionally)
persists the four artifacts — `graph.json`, `coverage.json`,
`selected-cases.json`, `bench-profile.json`.

## Hardening expansions

Both opt-in, both OFF by default — default artifacts stay byte-identical:

- **`@ge/evalkit/perturbations`** — linguistic variants of already-selected
  cases (register shifts, seeded typos, distractor context, compound asks)
  that never touch what the case expects.
- **`@ge/evalkit/adversarial`** — safety/abuse case families (prompt
  injection, authority spoofing, exfiltration, …) synthesized from the graph
  nodes they probe.

## Emitters (`@ge/evalkit/emitters`)

One module per on-disk artifact shape (see `src/emitters/index.mjs` for the
family header and the byte-golden constraints that pin each):

- `emitAdkEvalset` / `writeAdkEvalset` — ADK-camelCase evalset with GE context
  in a `geMetadata` sidecar.
- `emitAgentsCliDataset` / `writeAgentsCliDataset` — flat agents-cli grading
  records.
- `renderGoldenEvals`, `renderAgentsCliEvalSet`, `renderEvalConfig`,
  `renderOptimizationConfig` — the generated-workspace legacy (v1) artifacts,
  kept byte-golden during the agents-cli migration window.
  `renderAgentsCliEvalSet` takes the factory's naming/derivation helpers as an
  injected parameter; the factory's binding lives at
  `apps/factory/scripts/factory/evals/render-eval-artifacts.mjs`.
- `renderEvalDataset`, `renderSplitEvalDatasets` — the modern agents-cli
  (>= 1.0) `EvaluationDataset` for `eval generate`/`eval grade`
  (`tests/eval/datasets/*.json`), derived from the rendered v1 evalset via the
  CLI's own evalset→dataset migration transform, plus its holdout
  train/validation partitions (direct `eval optimize` inputs).
- `renderEvalConfigYaml` — `tests/eval/eval_config.yaml` for `eval grade`:
  built-in metrics mapped from the v1 criteria, the behavior-contract
  LLM-judge metric (`judge_model_sampling_count: 5` — native
  self-consistency), and the `ge_thresholds` CI-gate extension block.
- `renderHoldoutSplit` — the deterministic per-id train/validation split that
  feeds the split datasets (written as `tests/eval/holdout_split.json`).

Retired with the `GE_EVAL_V2` gate: `renderSplitEvalSets` (split *evalsets* —
replaced by the split datasets), `renderOptimizationConfigV2` (`eval optimize`
consumes `EvaluationDataset` files directly), and `renderJudgePanelConfig`
(`judge_panel.json` — replaced by the judge metric's native sampling knob in
`eval_config.yaml`).

## Metrics and stats

- **`@ge/evalkit/metrics`** — advisory lexical similarity (`lexicalSimilarity`
  blends `rougeL` order-awareness with `trigramCosine` typo tolerance). Never
  a pass/fail input; it explains *why* a structural match scored as it did.
- **`@ge/evalkit/stats`** — eval statistics: `wilsonInterval` (score
  confidence), `bootstrapCI` (seeded, via `mulberry32`), `passAtK`,
  `flakiness`.

`@ge/evalkit/metric-applicability` is the single table answering "can metric X
grade rail Y" for the local ADK rail vs the live stream-assist rail — docs,
`ge evals applicability`, and gating code all read this one source.

## Determinism

Same spec in, byte-identical artifacts out. No clock (timestamps are passed in
by callers), no `Math.random` (every seeded choice hashes ids with FNV-1a).
Several downstream tests compare emitted artifacts byte-for-byte — treat any
output change here as an interface change.

## Consumers

- `ge evals compile` / the MCP server — via
  `tools/lib/evals/compile-command.mjs`, the thin command that resolves spec
  sources and state paths (tools concerns) around this engine.
- the factory's generate step — golden evals, evalset, eval/optimization
  configs for every generated workspace.
- `ge prove --live` — `lexicalSimilarity` and `wilsonInterval` on live
  transcripts.
