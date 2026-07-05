---
title: Admit an agent
parent: Guides
nav_order: 9
layout: default
description: Mint the signed Agent Passport with ge passport emit, verify its integrity, and run the admission gate that ge handoff enforces — contractual checks enforced as an admission controller.
---

# Admit an agent

**Scope:** local — everything here runs on your machine, costs nothing, and
mutates only workspace artifacts and `.ge/` state. The gate's *enforcement*
happens at `ge handoff`, and that command's cloud cost is unchanged.

The factory's proof pack shows an agent honored its contract; the admission
gate makes that proof **checkable at the release boundary** instead of
trusted. `ge passport emit` consolidates the proof pack into one signed,
digest-bound document (the
[Agent Passport](../concepts/agent-passport-and-proof-pack.html)); `ge
passport admit` evaluates it against policy and records an allow/deny
decision; and `ge handoff` runs that same evaluation for every workspace it
releases — refusing denied ones once the gate is required.

## When to use this

- An agent proved locally and is about to ship — give it a passport so the
  release decision is evidence, not trust.
- You are wiring release automation or CI and want a machine allow/deny
  (`ge passport admit --json`, exit code included) in the pipeline.
- An auditor asks *"what justified shipping this, and can you prove nothing
  changed since?"* — the passport plus the decision log is the answer.

## Prerequisites

- A locally-built, proven workspace with a promotion packet from `ge prove`
  — the passport attests that packet, so it has to exist first.
- Optional but stronger: a live proof result on this machine
  ([Prove the shipped agent live](prove-live.html)) — `emit` attests it
  automatically when present.

## Steps

1. **Mint the passport** for a proven workspace:

   ```bash
   ge passport emit <workspace-id>
   ```

   This computes the subject identity — one sha256 over everything that
   ships (evidence under `artifacts/` and volatile dirs excluded) plus the
   contract digest. It signs in-toto/DSSE attestations over the promotion
   packet (and live proof, when present) with the local Ed25519 issuing key
   (`.ge/keys/`, generated on first use), and writes
   `artifacts/agent-passport.json` into the workspace.

2. **Verify integrity** whenever you need to check the passport still
   describes the bytes on disk:

   ```bash
   ge passport verify <workspace-id>
   ```

   It checks the signature and recomputes both digests. A ✗ means the
   workspace (or contract) changed since issuance — that is the feature:
   re-prove, then re-emit.

3. **Run the admission gate** — the same decision `ge handoff` enforces:

   ```bash
   ge passport admit <workspace-id>
   ```

   The decision is recorded either way: the workspace's
   `artifacts/admission-decision.json` and the append-only
   `.ge/admission/decisions.jsonl` audit log. Blockers carry stable
   `GEADM001`–`GEADM008` codes, each naming its fix command.

4. **Hand off.** `ge handoff agents-cli` evaluates admission for every
   workspace before anything is uploaded. By default the gate is in **audit
   mode**: denials are recorded and logged, nothing is refused. To enforce
   it, set the policy in `.ge.json`:

   ```jsonc
   {
     "promotion": {
       "gates": {
         "admission": {
           "required": true,        // deny → the workspace is not released
           "maxAgeDays": 30,        // stale passports must be re-minted
           "requireLiveProof": false // true: passport must attest a passing live proof
         }
       }
     }
   }
   ```

   The staged rollout is deliberate and mirrors `promotion.gates.live` and
   the Agent Gateway's DRY_RUN → ENFORCED path: run in audit mode first,
   read the decision log, then flip `required`.

## Break-glass

A denied release can still be forced — visibly:

```bash
ge handoff agents-cli --force        # or GE_ADMISSION_BREAK_GLASS=1
```

`--force` never changes the decision; it changes what happens next, and the
override is stamped into the recorded decision (`"overridden": true`) and
the audit log. Same philosophy as the promotion gate's `--force`: possible,
deliberate, and on the record.

## Verify

- `ge passport admit <id> --json` exits non-zero on a denial once the gate
  is `required` — CI-friendly.
- `cat .ge/admission/decisions.jsonl` — one JSON decision per line, newest
  last, including overrides.
- Tamper test: touch any file under the workspace's `app/` and re-run
  `ge passport verify <id>` — the subject digest check fails (`GEADM003`
  from `admit`), which is exactly the guarantee the gate exists to give.

## Related

- [Agent Passport & Proof Pack](../concepts/agent-passport-and-proof-pack.html) —
  what the passport consolidates and why.
- [Evals as Proof](../concepts/evals-as-proof.html) — how the attested
  evidence is produced.
- [Hand off to agents-cli](handoff-agents-cli.html) — the release act the
  gate fronts.
- [Prove the shipped agent live](prove-live.html) — the optional live-proof
  attestation.
