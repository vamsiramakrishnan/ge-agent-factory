# Phase 4 — The operating skill

> **Status (2026-07-17): superseded.** The current `ge okf skill` path and
> `authoring-okf-specs` skill cover this need. The material below is retained
> only as design history.

## Goal

Give every generated agent an operating manual a coding assistant can
execute: inspect the contract, run proof, read failed traces, propose
repairs through the sanctioned paths, and re-prove before handoff.
Start with **one parameterized skill**; per-blueprint generation is a
deterministic renderer added only where it earns its maintenance cost.

## Why one skill first, not 514

The OKF bundle already *is* most of the operating manual: `playbook.md`
carries scope, escalation, and refusal rules; `evals.md` and
`proof-obligations/` carry the proof recipe; `spec.json` carries
systems and architecture. A generated per-agent SKILL.md that restates
the bundle is a drift liability across 514 blueprints the moment the
template changes — and this repo's golden/generated-region culture
exists precisely to prevent that class of rot. So:

1. **Now:** one skill that takes the bundle as input.
2. **Later, conditionally:** a deterministic per-agent renderer, gated
   like the other generated regions (`--check` mode in `docs:gate`
   style), only where domain packs contribute content a generic skill
   cannot express.

## Deliverables

### 1. `skills/operating-a-generated-agent/`

A hand-authored skill following the existing `skills/` conventions
(SKILL.md + references, registered in `skills/skill-routing.json`,
surfaced by `mise run skills-install` and the plugin/extension
distribution surfaces).

Parameterized by an agent id or OKF bundle path, it teaches the
assistant to:

1. Read the contract: `okf/<id>/` bundle — `index.md` provenance,
   `spec.json`, `playbook.md` scope/escalation/refusal, `evals.md`,
   `proof-obligations/`.
2. Check standing: `ge okf quality`, `ge okf eval verify`, library
   status.
3. Prove: `ge prove` / `ge prove --live` (cassette-first), read
   `.ge/proof/live-proof-result.json` and the eval matrix.
4. Diagnose: `ge evals analyze` clusters (Phase 3), transcripts,
   cassettes.
5. Repair through sanctioned paths: `ge evals refine --proposal-only`,
   `ge okf enrich generate/apply`, `ge okf customize` — with the fix
   routed to spec/OKF/pack/evalset, not to generated workspace code.
6. Verify twin fidelity when a failure smells environmental:
   `ge systems compare` (Phase 2), `ge systems doctor`.
7. Re-prove and check gates before any handoff.

Hard rules embedded in SKILL.md (these are the product's honesty
posture, stated for the assistant):

- The contract (spec + OKF bundle) is the source of truth; generated
  workspace code is a build artifact — patch the contract or overlays,
  not the output.
- Never add tool authority, weaken a refusal/escalation rule, or bypass
  an approval gate as a "fix"; those are contract changes and go
  through the contract path.
- Inspect traces before changing instructions.
- A metric the live stream cannot support is reported `unavailable`,
  never assumed passing (matches `prove-live.mjs` behavior).
- Any fix is re-proven before handoff; baselines are never updated to
  make a failure disappear.
- Prefer the `factory_*` MCP tools; the `ge` CLI is the fallback (both
  are the same registry-backed core, so this is preference, not
  correctness).

### 2. Routing and distribution

- `skills/skill-routing.json` entry with triggers ("operate this agent",
  "why did proof fail", "repair the agent", agent/bundle ids).
- Skill matrix regeneration: `bun run docs:skill-matrix` (the matrix in
  `skills/README.md` and `docs/reference/architecture.md` is a
  generated region).
- Ships through the existing surfaces automatically (skills-install,
  Claude Code plugin, Gemini extension) — no new distribution work.

### 3. `ge okf skill generate` (conditional, second half)

Only after the generic skill has real usage and a domain pack exists
whose content it cannot express:

- A deterministic renderer: bundle + domain pack → skill directory;
  byte-stable output, `--check` drift mode, wired into the docs gate the
  way the CLI reference and skill matrix are.
- Registry entry + `factory_okf_skill_generate` MCP tool; risk
  `writes-repo`.
- Generated skills carry a generated-region banner naming the
  regeneration command, and review policy treats hand-edits to them the
  way hand-edits to other generated regions are treated: rejected.

## Deliberately not in this phase

- No mass generation across the library (that is the deferred library
  upgrade orchestration, and it depends on this phase proving the
  template).
- No target-specific skill dialects (claude-code vs. codex vs.
  gemini-cli) until the generic skill demonstrates a real divergence
  need; the existing skills already serve multiple assistants from one
  format.

## Tests and gates

- Skill lint: routing entry valid, referenced files exist, skill matrix
  regenerated (`docs:gate` covers the generated regions).
- For the conditional renderer: golden fixture bundle → byte-stable
  skill output; `--check` mode fails on drift.
- A scripted dry-run of the skill's command sequence against a fixture
  agent (cassette-backed) — the skill's recipe must not name a command
  or path that does not exist; this doubles as living documentation.

## Acceptance criteria

- [ ] `skills/operating-a-generated-agent/` exists, routes, installs,
      and its full recipe executes against a fixture agent on cassettes
      with zero cloud access.
- [ ] The skill's hard rules match runtime reality (unavailable-metric
      honesty, gate behavior) — asserted by the dry-run script, not
      review.
- [ ] Skill matrix and routing regenerate clean under `docs:gate`.
- [ ] (Conditional half) One domain-pack-bearing blueprint renders a
      per-agent skill deterministically with drift gating.

## Risks

- **Skill/reality drift.** The dry-run script is the mitigation; it must
  run in CI, not just at authoring time.
- **Premature per-agent generation.** The conditional gate ("a domain
  pack the generic skill cannot express") should be applied literally in
  review — the pull toward generating 514 directories because it demos
  well is exactly what this phase is structured to resist.
