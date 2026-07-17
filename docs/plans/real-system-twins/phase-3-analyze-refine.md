# Phase 3 — Failure analysis and refine on top of live proof

> **Status (2026-07-17): deferred.** This remains a design record; none of the
> commands described below should be treated as shipped until they appear in
> the generated CLI reference.

## Goal

Close the loop from a failing live-proof case to a reviewed, targeted
fix with a before/after delta — the quality flywheel — by extending the
existing `evals`/`prove` surface rather than minting a parallel
`flywheel` stack. The genuinely new capabilities are exactly two:
**analyze** (cluster failures) and **refine** (propose a mapped patch).
Run, grade, baseline, drift, and gating already exist
(`ge drive`, `ge prove --live`, `tools/lib/live/prove-live.mjs`,
`tools/lib/gates/live-gate.mjs`).

## Prerequisite: the traceability chain

"Map a failure to the thing that fixes it" requires a chain that only
partially exists. Evals compile from **interview-spec envelopes**
(`apps/factory/catalog/interview-specs/`, via
`tools/lib/evals/compile-command.mjs` and `@ge/evalkit`), not from OKF
markdown; OKF bundles reference the spec through provenance
frontmatter. The chain to build:

```
eval case ──→ generating expansion + capability
          ──→ spec path (interview-spec envelope JSON pointer)
          ──→ OKF bundle section (via provenance_source_ref)
          ──→ tool / system (via the spec's architecture.connections)
```

**Deliverable 3.0:** `@ge/evalkit` emits `case-provenance.json` beside
the existing `graph.json`/`coverage.json` under `.ge/behavioral/` — for
every compiled case: which expansion generated it, which capability and
evidence rule it exercises, and the spec JSON pointer(s) it derives
from. This is additive compiler output; the evalset format is untouched.
Everything else in this phase consumes it.

## Deliverables

### 1. `ge evals analyze` — `ge.failure-analysis.v1`

```
ge evals analyze [--run .ge/proof/live-proof-result.json] \
  [--transcripts .ge/transcripts] [--corpus .ge/replay/...] [--cluster]
```

- Inputs: the live proof result + eval matrix
  (`.ge/proof/live-proof-result.json`, `eval-matrix.json`), transcripts,
  cassettes, and (post-Phase 2) system-trace corpora — all already
  NDJSON/JSON under `.ge/`.
- Clusters failing cases by failure signature: which metric failed
  (`response_match`, `tool_trajectory`, `grounding_citations`, drift,
  responder), at which turn class, against which capability (via
  case-provenance).
- Output: failure clusters, each carrying its member cases, the shared
  signature, and the provenance paths its members trace to. Honest
  about unknowns: a cluster whose live stream exposed no tool metadata
  says `trajectory: unavailable`, mirroring the existing metric-status
  honesty in `prove-live.mjs`.
- Risk `read-only`; pure computation over existing artifacts.

### 2. `ge evals refine --proposal-only` — `ge.fix-proposal.v1`

- Input: one or more failure clusters.
- For each cluster, classify the **fix target** using the traceability
  chain:
  `spec_gap | instruction_gap | tool_schema_gap | twin_gap | eval_gap |
  runtime_drift` — every proposal names a concrete path (spec JSON
  pointer, OKF bundle file, pack section, evalset case) or it does not
  ship.
- Emits a reviewable proposal in the same propose→review→apply pattern
  as `ge okf enrich generate/apply` (reuse that machinery's shape;
  `packages/capability-registry` `okf.enrich.*` is the precedent).
  `--proposal-only` is the default and, in this phase, the only mode —
  there is no auto-apply.
- **Separation of powers, structurally:** the proposal generator uses
  `refinementModel`; grading uses `judgeModel` (both already distinct in
  `.ge.schema.json`). `refine` cannot mark its own proposal validated —
  validation is a fresh `ge prove --live` run.
- **Authority check:** a proposal that would widen the agent's authority
  beyond the contract (new tools, weakened refusal/escalation rules,
  removed approval gates) is flagged `contract_change_required` and
  routed to the spec/OKF path — never presented as a prompt tweak.

### 3. Before/after delta: `ge prove --live --against <run>`

- Small addition to `prove-live.mjs`: compare the current run's
  per-case, per-metric results against a named prior
  `live-proof-result.json`; render the delta (fixed / regressed /
  unchanged / new) per case and per cluster.
- Baselines keep their existing meaning (per-case policy conformance,
  never auto-accepted, drift fails the verdict); the delta is a
  reporting layer, not a second baseline mechanism.
- Promotion gates unchanged: a refine→re-prove cycle still passes
  through `evaluateLiveGate` like any other run.

### 4. Registry, MCP, console

- Registry entries `evals.analyze` (`read-only`), `evals.refine`
  (`read-only` for propose; applying a proposal routes through the
  target's existing apply command, e.g. `okf.enrich.apply`, which
  already carries `writes-repo`), and the `prove.live` entry gains the
  `--against` flag. MCP: `factory_evals_analyze`,
  `factory_evals_refine`.
- Console: failure clusters and proposal review render from the same
  artifacts (`GET` in-process handlers; they are fast reads).

## The naming decision, made explicit

No `ge flywheel` noun in this phase. If, after these land, operators
demonstrably need a macro command that chains
record → prove → analyze → refine → re-prove, add it then as thin
orchestration over these registry entries. A new noun that shells into
old nouns is how CLIs rot; the loop must earn its name.

## Deliberately not in this phase

- No auto-applied fixes, no auto-accepted baselines, no gate bypasses.
- No synthetic-scenario generation (`--synthesize N`) — eval compile's
  expansion machinery already over-generates; wiring analyze-informed
  targeted generation into it is a follow-up once clusters exist.
- No production-trace ingestion beyond what Phase 2 corpora provide.

## Tests and gates

- Provenance: compile a fixture spec; assert every selected case has a
  resolvable provenance chain (no dangling pointers).
- Analyze: golden fixture — a checked-in proof result + transcripts
  produce byte-stable clusters.
- Refine: fixture clusters produce proposals whose fix-target paths all
  resolve; an authority-widening fixture is flagged
  `contract_change_required` (this test is the guardrail).
- Delta: two fixture proof results render the expected
  fixed/regressed/unchanged sets.
- Parity + standing gates.

## Acceptance criteria

- [ ] Every compiled eval case carries resolvable provenance to spec
      path and OKF bundle section.
- [ ] A failing cassette-replayed proof run yields clusters, and
      `refine` maps each to a named fix target with a reviewable
      proposal.
- [ ] A proposal that widens authority is structurally flagged, not
      silently emitted as an instruction patch.
- [ ] `ge prove --live --against <prior-run>` renders an honest
      per-case delta; gates and baselines behave exactly as before.
- [ ] The full loop — drive/record → prove → analyze → refine →
      apply-via-target-command → re-prove → delta — runs end-to-end on
      cassettes with zero cloud access.

## Risks

- **Provenance rot.** The chain is only useful if compile keeps it
  accurate; the provenance test must be a standing gate, not a one-off.
- **Plausible-but-wrong proposals.** Mitigated by proposal-only default,
  independent judge, authority check, and the rule that validation is a
  fresh proof run. The failure mode to watch in review: proposals that
  fix the eval instead of the agent — `eval_gap` classifications need
  human scrutiny and the docs should say so.
