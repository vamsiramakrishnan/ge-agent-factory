---
name: admitting-agents
description: Operates the release admission layer of the GE Agent Factory — minting and verifying signed Agent Passports and running the admission gate that fronts handoff. Use when a proven agent needs a passport (ge passport emit), when verifying evidence integrity before a release, when evaluating or enforcing the admission decision (ge passport admit, promotion.gates.admission), when reading GEADM blockers or the admission decision log, or when a denied release needs a recorded break-glass override.
---

# Admitting Agents

Use this skill at the release boundary, when a locally-proven agent is about
to cross the handoff line and the decision to let it through should be
evidence, not trust.

In plain language: the factory's contractual checks produce a proof pack;
this skill owns making that proof **verifiable** (a signed, digest-bound
Agent Passport) and **enforced** (an admission gate at `ge handoff` with a
recorded allow/deny decision). It is the admission-controller pattern
applied to the factory's own release path: the checks run upstream, the gate
only verifies — signatures, digest bindings, freshness, attested verdicts —
and every decision lands in an audit log, including the break-glass ones.

## Assembly-Line Slot

- **First step:** confirm the workspace is proven — it needs a promotion
  packet (`ge prove` produces one); a live proof result on the machine is
  attested too when present.
- **Plays a role in:** release — after local proof (and optionally live
  proof), immediately before and during `ge handoff`.
- **Input:** a locally-built workspace with `artifacts/promotion-packet.json`;
  optionally `.ge/proof/live-proof-result.json`; the policy block in
  `.ge.json` `promotion.gates.admission`.
- **Output:** the signed passport (`artifacts/agent-passport.json`), the
  recorded decision (`artifacts/admission-decision.json`), and the
  append-only audit log (`.ge/admission/decisions.jsonl`).
- **Next step:** `ge handoff agents-cli` (the gate runs inside it); on a
  denial, the blocker's `fix` command routes the work upstream
  (re-prove → re-emit).

## Workflow

1. **Mint after proving** (`ge passport emit <id>`): the passport binds the
   proof pack to the exact bytes that ship — one sha256 over the workspace
   (evidence and volatile dirs excluded) plus the contract digest, signed
   with the local Ed25519 issuing key (`.ge/keys/`, generated on first use).
   Re-prove → re-emit; a passport is cheap and never edited by hand.
2. **Verify when in doubt** (`ge passport verify <id>`): signatures plus
   recomputed digests. A ✗ is information, not an obstacle — the workspace
   or contract changed since issuance, so the evidence no longer applies.
3. **Admit before releasing** (`ge passport admit <id>`): the same
   evaluation `ge handoff` runs, standalone — CI-usable (`--json`, non-zero
   exit on a required-gate denial). The decision is recorded either way.
4. **Enforce deliberately**: the gate ships in audit mode
   (`required: false`) — decisions are recorded, nothing is refused. Read
   the decision log, then set `promotion.gates.admission.required: true` in
   `.ge.json`. The staged rollout mirrors `promotion.gates.live` and the
   Agent Gateway's DRY_RUN → ENFORCED path.
5. **Read verdicts, not vibes**: blockers carry stable `GEADM001`–`GEADM008`
   codes with what/fix — GEADM001 no passport, GEADM002 signature,
   GEADM003/004 workspace/contract drift, GEADM005/006 promotion-gate
   attestation missing/failing, GEADM007 stale, GEADM008 live proof
   missing/failing when required.
6. **Break glass on the record**: `ge handoff --force` (or
   `GE_ADMISSION_BREAK_GLASS=1`) releases despite a denial; the override is
   stamped into the decision and the audit log. Never edit a passport or a
   decision file to make a gate pass.

## Commands

Mint, verify, admit — the loop for one workspace:

```bash
bun tools/ge.mjs passport emit <workspace-id>
bun tools/ge.mjs passport verify <workspace-id>
bun tools/ge.mjs passport admit <workspace-id> --json
```

Handoff with the gate (audit mode by default; `--force` is the recorded
break-glass):

```bash
bun tools/ge.mjs handoff agents-cli
bun tools/ge.mjs handoff agents-cli --force
```

Read the audit trail:

```bash
cat .ge/admission/decisions.jsonl | tail -5
cat .ge/factory/workspaces/<id>/artifacts/admission-decision.json
```

## Safety rails

- **Never hand-edit** `agent-passport.json` or `admission-decision.json` —
  the digest/signature checks exist to catch exactly that; fix the input
  (re-prove) instead.
- **The private key stays put.** `.ge/keys/admission-ed25519.pem` is
  per-machine (mode 0600). Do not commit, copy, or share it; delete it and
  the next `emit` mints a fresh one (old passports then fail verification —
  re-emit them).
- **Do not flip `required: true` blind.** Run audit mode first and read
  `.ge/admission/decisions.jsonl` — the same review-then-enforce discipline
  as the gateway's authz layer.
- **`--force` is an override, not a fix.** It records the denial and
  releases anyway; the blockers still name the real work.

## Common mistakes

- Emitting a passport before `ge prove` — there is no promotion packet yet,
  so there is nothing to attest; the command refuses with the fix.
- Treating a GEADM003 digest mismatch as a bug — any change to shipped bytes
  after issuance *should* invalidate the passport; re-prove and re-emit.
- Expecting `ge passport admit` to fail CI while the gate is still in audit
  mode — the exit code only goes non-zero once `required: true` (or pass
  `--json` and assert on `allowed` yourself).
- Confusing `verify` (integrity: is this passport authentic for these
  bytes?) with `admit` (policy: may this workspace ship?).

## Done when

- The workspace carries a fresh signed passport, `ge passport admit` reports
  `allowed: true` with no blockers, the decision is on the record in
  `.ge/admission/decisions.jsonl`, and `ge handoff` released it without an
  override — or, for an enforced rollout: audit-mode decisions were
  reviewed and `promotion.gates.admission.required` is `true` with the
  fleet still admitting cleanly.

## References

- Worked example: `references/example-session.md` — a proof-to-passport
  admission loop, including a stale-passport failure.
- Reference: `docs/reference/admission.md` — the passport and decision file
  formats, the `promotion.gates.admission` policy keys, the full
  `GEADM001`–`GEADM008` blocker table, key management, and break-glass.
- Cookbook: `docs/cookbooks/admit-an-agent.md` — the worked loop, the policy
  block, and the break-glass contract.
- Concepts: `docs/concepts/agent-passport-and-proof-pack.md` (what the
  passport consolidates), `docs/concepts/evals-as-proof.md` (how the
  attested evidence is produced).
- Engine: `@ge/admission` (`packages/admission/README.md`) — digests, DSSE
  signing, the policy evaluator; operator wiring in
  `tools/lib/admission/admission-ops.mjs`.
