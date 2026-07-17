# Phase 2 — SystemProfile, ReplayCorpus, realism compare

> **Status (2026-07-17): safety-reviewed implementation.** Landed with these
> notes: (1) `@ge/redaction` is the golden-fixtured centerpiece — headers
> are default-deny for credentials with no policy at all, PII detectors
> (email/phone/SSN/Luhn-checked card) are always on, and the golden
> (`src/fixtures/exchange-redacted.golden.json`) makes any behavior change
> a reviewable diff. (2) `synth --from-profile --from-traces` honors the
> JS/Python split: the redacted corpus is projected to samples in JS
> (`projectCorpusToSamples`, REST collection/id parity) and compiled by the
> existing Python samples pipeline unchanged — redacted values are fine
> because synthesis reads field *presence*, which is exactly the
> field-coverage gap `compare` reports. (3) OTel import stays deferred (an
> adapter, not a design change); NDJSON + HAR both land, redacting on
> import. (4) The realism report separates mechanical dimensions
> (endpoint/field coverage, pass/gap) from advisory ones (latency/error,
> which stay advisory until the metrics earn trust) and every gap names the
> exact command that closes it. Verified end to end against a local stub:
> profile → record (email redacted to `[REDACTED]` before disk) → compare
> (flags `owner_team`/`contact_email` missing, dials only GET) →
> `synth --from-traces` (twin schema gains both fields).

## Goal

Point `ge` at a real system safely: capture a redacted profile, record
read-only traffic into a replay corpus, compile a more realistic twin
from profile + traces, and measure the twin against read-only live
probes. Depends on Phase 0 (dispatch seam, `connector-core`,
`calls-live-readonly` risk level).

## Safety invariants (non-negotiable, enforced structurally)

1. **Read production, simulate mutation.** The profiler and recorder accept
   only allowlisted `GET`/`HEAD` operations. `connector-core` independently
   refuses every write-class method, so this does not depend on pack metadata.
2. **Redaction before disk.** Every captured byte — bodies *and
   headers* — passes the redaction module before any write. Auth tokens
   are the canonical header case.
3. **Secrets by reference.** Profiles store `env:VAR` references; no
   token value ever lands in an artifact, log, or error.
4. **Bounded and explicit.** Every live-touching command requires
   `--max-calls`, honors an allowlist from the profile, and carries the
   `calls-live-readonly` risk level so every surface (CLI confirm,
   console permission, MCP tool description) presents it distinctly.

## Deliverables

### 1. `packages/redaction` (new, safety-critical)

- Policy schema `ge.redaction-policy.v1`: field-path rules
  (mask/drop/hash), header rules (default-deny `authorization`,
  `cookie`, `x-api-key`; allowlist to keep), body detectors for common
  PII classes.
- `redactExchange(request, response, policy)` → redacted exchange +
  report entries. Pure, no IO.
- Emits `redaction-report.json` (`ge.redaction-report.v1`): what was
  masked/dropped and by which rule — reviewable evidence that capture
  was clean.
- **Golden fixtures required**: checked-in raw→redacted pairs including
  bearer headers, nested PII, and binary bodies. A change to redaction
  behavior must show up as a golden diff.

### 2. `ge systems profile` — `ge.system-profile.v1`

```
ge systems profile <system> --kind rest --base-url <url> \
  --openapi <path> --auth env:VAR --redact <policy> \
  [--probe-allowlist <ops>] [--max-calls N] [--out <path>]
```

- Output: `.ge/systems/profiles/<system>.profile.json` — system id,
  kind, OpenAPI hash, auth *reference*, `allowedProbes` (read ops only),
  `forbiddenOperations` (every write op, cross-checked against Phase 1
  markers), redaction-policy hash, capture timestamp.
- With no `--base-url` it is a pure static profile (OpenAPI only, risk
  `read-only`); with one, optional reachability probing via
  `connector-core` (risk `calls-live-readonly`).
- Refuses to run against a PII-bearing domain without `--redact`.

### 3. `ge systems record` — `ge.replay-corpus.v1`

```
ge systems record <system> --profile <path> --script <probes.yaml> \
  --max-calls N --out .ge/replay/system-<system>.ndjson
```

- Executes a declarative read-only probe script through
  `connector-core`; every exchange is redacted, then appended as NDJSON
  with latency, status, and a coarse `timestampClass` (no raw wall-clock
  precision — corpus entries must not become a covert timing side
  channel on production data).
- Import adapters for existing captures: NDJSON pass-through and HAR in
  this phase (both run through redaction on import). OpenTelemetry
  export import is deferred — it is an adapter, not a design change.
- The corpus schema is shared with Phase 3: agent transcripts, cassettes
  (`tools/lib/live/cassette.mjs` NDJSON), and system traces are
  different `kind`s of one corpus format, so failure analysis can join
  across them later without a migration.

### 4. Twin compiler enrichment: `synth --from-profile --from-traces`

- `ge systems synth` accepts `--from-profile` and `--from-traces`
  alongside the existing three modes. The Python pipeline
  (`synthesis_sketch.py` / `synthesis_seed.py`) consumes them to
  improve what it already produces: seed realism (value distributions
  from observed fields), latency bands and error classes
  (`throttle.py` / `failures.py` config from observed latencies and
  statuses), pagination and search behavior from observed responses.
- **Pack contract unchanged.** Profile, corpus, redaction report, and
  realism report live beside the pack under `.ge/`; the pack itself
  stays within the shapes `pack_loader.py` already accepts.
- Write-model stance: traces are read-only by construction, so write
  semantics still come from Phase 1 inference (OpenAPI/samples), never
  from live capture.

### 5. `ge systems compare` — `ge.realism-report.v1`

```
ge systems compare <system> --profile <path> --twin <system-or-path> \
  --max-calls N
```

- Risk `calls-live-readonly`. Issues allowlisted read probes against the
  live system and the same ops against the twin; reports endpoint/tool
  coverage, field coverage, enum/value realism, latency-band fit, and
  error-class coverage, with a per-dimension pass/advisory/gap verdict
  and a `next:` line naming the exact command that closes each gap.
- Never calls a write op (structural, via profile
  `forbiddenOperations` + connector refusal).
- Output `.ge/systems/profiles/<system>.realism-report.json`; rendered
  human-readable at a TTY, byte-stable with `--json`, per house style.

### 6. Registry, MCP, console, doctor

- Registry entries: `systems.profile`, `systems.record`,
  `systems.compare` with `mcp` blocks (`factory_systems_profile`,
  `factory_systems_record`, `factory_systems_compare`) and console
  routes through the standard job-runner sentinel.
- `ge systems doctor` learns to validate profiles and corpora on disk
  (schema, redaction-report presence, hash agreement with the policy).
- Local vs. cloud: identical artifact schemas; cloud execution resolves
  auth via Secret Manager references and the environment's network
  allowlist instead of local env vars. Any twin synthesized from a
  profile in remote mode requires an explicit overlay durability choice
  (`--local`/`--remote`), removing the silent default for BYO twins
  (`resolveOverlayScope`, `packages/byo-systems/src/index.mjs:206`).

## Deliberately not in this phase

- No mutation probing of any kind, including against sandboxes (revisit
  after Phase 1 + 2 are proven; a sandbox write-capture mode is a
  separate, explicitly-flagged follow-up).
- No OTel import, no `mcp`-kind profiling.
- No automatic twin regeneration from a realism report — the report
  names commands; the operator runs them.

## Tests and gates

- Redaction goldens (see above) — the gate for this phase.
- Recorder integration test against a local stub server: corpus entries
  are redacted, bounded by `--max-calls`, and schema-valid.
- Compare integration test: stub server vs. a twin synthesized from the
  stub's OpenAPI — report dimensions populated, zero write calls issued
  (assert on the stub's request log).
- Synthesis determinism: `--from-traces` with a fixed corpus fixture
  produces byte-stable pack output (golden).
- Parity + standing gates.

## Acceptance criteria

- [x] A developer can profile a stub REST system (read allowlist / write
      denylist split, auth by reference) and, with `--probe`, one
      read-only reachability dial (`tools/lib/system-profile.mjs`).
- [x] `ge systems record` produces a bounded, allowlist-enforced,
      redacted `ge.replay-corpus.v1` + its redaction report; HAR and
      NDJSON import both redact on import, dropping write traffic
      (`tools/lib/system-record.mjs`).
- [x] `ge systems synth --from-profile --from-traces` produces a twin
      whose field coverage measurably reflects the corpus, within
      existing pack shapes — verified: the twin schema gained
      `owner_team`/`contact_email` from the recorded corpus. (Latency/
      error bands stay the realism report's advisory dimensions; deriving
      them into pack sections is a follow-up, since corpus values are
      redacted.)
- [x] `ge systems compare` runs read-only (only GET dialed; write
      endpoints never touched) and emits an actionable
      `ge.realism-report.v1` naming the command that closes each gap.
- [x] No secret value or unredacted PII appears in any artifact —
      asserted in `@ge/redaction` (golden), `tools/lib/system-live.test.mjs`,
      and confirmed end to end (`jane@example.com` → `[REDACTED]` in the
      written corpus, auth token never serialized).

## Risks

- **Redaction false confidence.** A policy that misses a field leaks
  data into `.ge/`. Mitigations: default-deny headers, PII detectors on
  by default, the redaction report makes "what survived" reviewable,
  and profiles refuse PII domains without a policy.
- **Realism metrics that flatter.** Coverage percentages can look good
  while value distributions are wrong. The report separates coverage
  (mechanical) from realism (distributional) and marks the latter
  advisory until the metrics earn trust.
- **Enterprise approval.** Even read-only production probing is an
  approval event in most orgs. The profile's `allowedProbes` allowlist
  is the reviewable artifact for that conversation; docs must say so.
