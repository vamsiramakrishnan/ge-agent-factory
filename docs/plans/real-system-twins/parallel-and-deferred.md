# Parallel track and deferred items

> **Status (2026-07-17): deferred design record.** Items below are not current
> CLI promises; the generated CLI reference is the source of truth.

## Parallel track — land any time

### `ge byo lock` / `ge byo diff` / `ge byo verify`

Make `ge.byo.yaml` reproducible and reviewable. Cheap because
`planByoApply` (`tools/lib/byo-manifest.mjs`) already classifies every
manifest action as appliable / planned-only / invalid — the lock is that
classification plus content hashes, frozen:

- `ge byo lock` → `ge.byo.lock.json`: per-section resolved state
  (binding contents, evalset hashes, policy values, model choices,
  overlay backend) with the manifest hash it derives from.
- `ge byo diff`: lock vs. current manifest + current applied state —
  the "what changed since we reviewed this" answer.
- `ge byo verify`: applied state matches the lock (CI-friendly,
  `read-only`).

Registry entries + `factory_byo_lock`/`_diff`/`_verify` MCP tools.
No new concepts; one artifact schema (`ge.byo.lock.v1`). Signing can
wait — hash-pinning delivers the review story; signatures are additive
later.

## Deferred — real, but sequenced behind the phases

### Domain packs: make `evals.domainPacks` appliable

Today the manifest section is planned-only (`byo-manifest.mjs`) while
enrichment separately consumes `domain-packs/<id>/pack.json`. The next
step is wiring apply: a domain pack listed in the manifest feeds
`ge okf enrich plan/generate` and eval compile inputs. A "marketplace"
(publishing, discovery, third-party packs) is a distribution problem to
revisit only after several packs exist and are applied in anger.
**After:** Phase 3 (packs should carry rubrics/adversarial seeds that
`analyze`/`refine` consume, so the consumption contract should exist
first).

### Impact-aware regression selection

"Changed spec path → affected tools → affected systems → affected evals
→ required proof" is exactly the Phase 3 traceability chain read in
reverse, plus a diff front-end. Build it as `ge evals impact --since
<ref>` emitting a selection the existing set-cover selector respects —
eval compile already over-generates and selects
(`tools/lib/evals/compile-command.mjs`), so this is a filter, not new
machinery. **After:** Phase 3 lands `case-provenance.json` and its
standing gate.

### Library upgrade orchestration

Mass quality-audit → enrich → (conditionally) skill-generate → prove →
status update across the 514-blueprint library. The pieces exist or are
being built (`okf.quality.audit`, `okf.enrich.shard` for parallel
manifests, Phase 4's renderer, `ge prove`); the deferred work is the
orchestrator, its reporting, and the operational cost controls
(`--parallel`, resumability via the run ledger). **After:** Phases 1–4,
because an orchestrator amplifies whatever quality bar the per-item
commands enforce — build the bar first.

### Connector SDK (full)

Phase 0 ships `packages/connector-core` (REST, bearer-from-env,
read-only + refuse-writes). The full SDK — `mcp`-kind dialing, OAuth/
mTLS, `describeTools`, `simulateMutation` bridging to the twin,
scaffold/test/publish commands — grows from that interface as Phases
0–2 exercise it. Do not scaffold the SDK ahead of its consumers; every
interface method must have a caller in the tree.

### Sandbox write-capture mode

Capturing real mutation behavior from a staging/sandbox system
(explicitly flagged, never production) would sharpen MutationModel
inference. Deferred until Phase 1's schema and Phase 2's
recorder are proven, because it reuses both and multiplies the safety
surface: it needs its own risk level discussion (a sandbox write is
still a write) and an unambiguous "this is not production" attestation
in the profile.

### The `ge flywheel` noun

Reconsidered only if operators demonstrably need macro-orchestration
over record → prove → analyze → refine → re-prove after Phase 3 lands.
See the naming decision in
[phase-3-analyze-refine.md](phase-3-analyze-refine.md).
