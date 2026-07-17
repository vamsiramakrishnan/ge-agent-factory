# Phase 1 — MutationModel: formalize write semantics

> **Status (2026-07-17): safety-reviewed implementation.** Landed with three notes:
> (1) the contract is code-based validation (`packages/byo-systems/src/
> mutation-model.mjs`), not a JSON-Schema file — the repo has no pack
> JSON-Schemas and the existing validators are code, so the schema document
> would have been a third source of truth; (2) OpenAPI inference gained a
> deterministic evidence rule in `sketch_from_openapi`: a string enum is
> preserved as an `enum:` field, and a status-like enum becomes the
> collection's state machine ONLY when the spec declares a write verb on a
> matching path segment — transition *order* stays a linear-chain reviewed
> TODO, never declared truth (the synthesis golden was regenerated for
> exactly these additive changes, verified key-by-key first); (3) apply
> landed alongside infer/validate (`ge systems mutation apply`, dry-run
> default, hash-guarded, hand-authored values always win) because a
> proposal artifact without its consumer is not testable end to end.

## Goal

Give every twin explicit, machine-checkable write semantics — state
transitions, idempotency, approval conditions, side effects, audit
emission, and rollback — so a twin is a production-like state machine
rather than a fake read API. No live access required; this phase runs
entirely on static inputs and can proceed in parallel with Phase 0.

## The packaging decision (settled in the design review)

The simulator runtime **already executes** most of what a mutation model
describes: state machines and transition guards, `approvalBlockers`
raising `missing_approval` (`simulator_runtime/generic.py:980-1052`),
idempotency keys (`idempotency.py`), audit emission (`audit.py`), async
jobs (`async_jobs.py`). What is missing is not execution — it is a
**declared, validated contract** for those semantics, plus inference
from OpenAPI/samples.

Therefore `ge.mutation-model.v1` is a **schema formalization of the
existing workflows section**, not a new `mutations.json` pack file. Two
sources of truth for write semantics (workflows transitions vs. a
parallel mutations object) would drift; the pack loader keeps its three
shapes and gains none.

## Deliverables

### 1. Schema: `ge.mutation-model.v1` as a workflows-section contract

A JSON Schema (checked in beside the existing pack schemas) that the
workflows section of a pack must satisfy for its write-class tools.
Per write operation it declares:

- `semantics`: `create | state_transition | submit | cancel`
- `stateField` + `allowedTransitions` (for `state_transition`)
- `idempotency.keyFields` (mapping onto the runtime's existing
  `idempotency_key` handling)
- `approval.requiredWhen` (predicate rows compiled onto
  `approvalBlockers`)
- `sideEffects`: ordered `{collection, op}` list, audit emission
  included explicitly
- `compensation`: what undoes it (`none | inverse_op | manual`),
  so refinement loops and tests know whether a scenario is recoverable
- a runtime binding whose operation remains structurally read-only; profile,
  record, and compare accept only `GET`/`HEAD`, independent of mutation-model
  metadata

Existing corpus packs that already encode transitions/approvals keep
working: the schema is additive, and a migration script annotates the
inferable fields (`semantics`, `stateField`) across
`apps/factory/simulator-systems/` in one reviewed sweep.

### 2. `ge systems mutation infer`

- Inputs: `--from-openapi` (POST/PUT/PATCH/DELETE operations + request/
  response schemas), `--from-samples`, or an existing pack.
- Output: a **reviewable patch** to the pack's workflows section, in the
  same propose-then-apply style as `ge okf enrich generate/apply` —
  never silently rewrites a pack.
- Implementation: Python, beside the existing synthesis pipeline
  (`apps/factory/mcp-service/synthesis_contract.py`), invoked through
  `@ge/byo-systems` the same way `runSynthesis` drives
  `synthesize_cli.py` (spec on stdin, JSON result on stdout). LLM tier
  optional with a deterministic heuristic fallback, matching the NL
  sketch pattern.

### 3. `ge systems mutation validate`

Static, read-only, fast:

- Every write-class tool in `tools.json` has mutation semantics.
- Transition graphs are closed (no transition into an undeclared state).
- Every mutation declares audit emission.
- Idempotency key fields exist in the operation's input schema.
- Every handler is linked to a real tool/runtime binding, and live profilers
  continue to reject write-class methods independently.

Runs across the whole corpus. Ships as an **informational report
first**; promotion to a hard gate happens only after the one-sweep
migration lands and the corpus is clean.

### 4. Synthesis integration

`ge systems synth` (all three modes) emits mutation-model-conformant
workflows for write tools by default — new twins are born with declared
write semantics; `mutation infer` is the retrofit path for existing
packs and BYO OpenAPI.

### 5. Registry, MCP, console

- Registry entries `systems.mutation.infer` (risk `writes-repo` when
  applying, `read-only` for propose) and `systems.mutation.validate`
  (`read-only`), with `mcp` blocks → `factory_systems_mutation_infer`,
  `factory_systems_mutation_validate`.
- Console: `POST /api/systems/mutation/infer` via the standard
  `argv(body)` job-runner sentinel; validate as an in-process GET
  handler (it is a fast read).

## Deliberately not in this phase

- No `mutation replay` — replaying historical write traces needs the
  Phase 2 replay corpus.
- No runtime behavior change in the simulator engine; it already
  executes these semantics. This phase declares and validates them.
- No live dispatch of writes anywhere (unchanged from Phase 0's rule).

## Tests and gates

- Schema unit tests: valid/invalid workflows-section fixtures.
- Golden fixture: `mutation infer` over a checked-in sample OpenAPI file
  produces a byte-stable proposal (determinism-first; the LLM tier is
  behind a flag and excluded from goldens).
- Corpus sweep: `mutation validate` report checked in as a fixture so
  regressions in the migration are visible in review.
- Parity + standing gates as in every phase.

## Acceptance criteria

- [x] `ge.mutation-model.v1` contract exists
      (`packages/byo-systems/src/mutation-model.mjs`); `pack_loader`
      accepts annotated packs with zero shape changes (full
      simulator-runtime + mcp-service pytest suites green on the
      annotated corpus).
- [x] `ge systems mutation infer --from-openapi <file>` emits a
      reviewable `ge.mutation-proposal.v1`; applying it yields a pack
      that passes `mutation validate` (verified end to end on a sample
      spec: enum + PATCH verb → annotated state-transition handler).
- [x] Synthesized output passes `mutation validate` without retrofit —
      `build_contract_from_sketch` emits the annotations from birth
      (pinned by `tests/test_mutation_annotations.py` and the
      regenerated synthesis golden).
- [x] The migration sweep (`tools/mutation-annotate-corpus.mjs`,
      idempotent, purely additive — verified per-file) annotated all 89
      packs; suites diffed against a clean-HEAD baseline.
- [x] Every write op in the corpus has a versioned mutation model,
      compensation, handler/tool linkage, and runtime binding — enforced
      continuously by `tools/mutation-corpus.test.mjs` (89/89 conformant,
      0 warnings).

## Risks

- **Over-formalization.** Some corpus systems have write tools with
  genuinely fuzzy semantics; the schema needs an explicit
  `semantics: "unmodeled"` escape hatch that `validate` reports but
  does not fail, or the migration sweep stalls.
- **Inference quality.** OpenAPI rarely states transitions. The
  heuristic tier infers `create` vs. `state_transition` from
  verb+path+schema shape and leaves `allowedTransitions` as a reviewed
  TODO rather than hallucinating a state machine.
