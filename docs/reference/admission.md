---
title: Admission gate & Agent Passport
parent: Reference
nav_order: 17
layout: default
description: The signed Agent Passport file, the AdmissionDecision record, the promotion.gates.admission policy keys, the GEADM blocker codes, key management under .ge/keys/, and the break-glass contract.
---

# Admission gate & Agent Passport

The admission gate is the factory's contractual checks operationalized as an
admission controller: the proof pack is consolidated into one **signed,
digest-bound document** (the Agent Passport), and a policy evaluation over
that document produces a **recorded allow/deny decision** that `ge handoff`
enforces per workspace. The gate *verifies* evidence — signatures, digest
bindings, freshness, attested verdicts — it never produces it: evals and
validation run upstream, exactly once.

Sources of truth: `packages/admission` (digests, signing, attestation,
policy — see its README) and `tools/lib/admission/admission-ops.mjs`
(keys, policy resolution, decision records). The worked loop is
[Admit an agent](../cookbooks/admit-an-agent.html).

## The subject identity

Every attestation binds to two digests, recomputed from disk at every check:

| Digest | Over | Excludes |
|---|---|---|
| workspace (`subject.digest`) | every file that ships, sorted, byte-exact | `artifacts/` (evidence, not shipped bytes) and the volatile dirs the handoff tar prunes (`.venv`, `node_modules`, `__pycache__`, `.pytest_cache`, `runs`, `versions`, `.ge-harness`, `.git`) |
| contract (`subject.contractDigest`) | `mock_systems/usecase-spec.json` | — |

Any change to shipped bytes or the contract invalidates every existing
attestation by construction — that is the gate's core guarantee.

## `artifacts/agent-passport.json` — the passport

Minted by `ge passport emit <id>`; never edited by hand.

| Field | What it is |
|---|---|
| `apiVersion` / `kind` | `ge.dev/v1` / `AgentPassport` (`schemaVersion: 1`) |
| `subject` | `name` (workspace id), `digest.sha256`, `fileCount`, `contractDigest.sha256` |
| `workspace` | `id`, `useCaseId`, `mode` — display metadata from the promotion packet |
| `issuedAt` | ISO timestamp; freshness is checked against `maxAgeDays` |
| `issuer` | `keyid` (sha256 of the SPKI public key) + `algorithm` (`ed25519`) |
| `attestations[]` | DSSE envelopes (`payloadType: application/vnd.in-toto+json`), each carrying an in-toto Statement whose predicate is a factory verdict verbatim |

Predicate types carried today:

| `predicateType` | Predicate | Emitted |
|---|---|---|
| `ge.dev/attestation/promotion-packet/v1` | the workspace's promotion packet (with its gate verdict) | always — `emit` refuses without one |
| `ge.dev/attestation/live-proof/v1` | the LiveProofResult | when `.ge/proof/live-proof-result.json` exists on the minting machine |

The formats are standard (in-toto Statement v1 in a DSSE envelope) on
purpose: the same attestations are consumable by policy engines that already
speak them — sigstore policy-controller, Kyverno, GCP Binary Authorization —
if a Kubernetes- or broker-shaped admission point is added downstream.

## `promotion.gates.admission` — gate policy

Lives in `.ge.json`, merged over defaults (extra keys sanctioned, same as
`promotion.gates.live`):

| Key | Default | Meaning |
|---|---|---|
| `required` | `false` | `false`: audit mode — every decision is recorded, nothing is refused. `true`: `ge handoff` refuses denied workspaces and `ge passport admit` exits non-zero on a denial. |
| `maxAgeDays` | `30` | a passport older than this is stale (`GEADM007`); `0` disables the freshness check |
| `requireLiveProof` | `false` | `true`: the passport must carry a *passing* live-proof attestation (`GEADM008`) |

The staged rollout is the house convention (`promotion.gates.live`, the
Agent Gateway's DRY_RUN → ENFORCED): run in audit mode, read the decision
log, then set `required: true`.

## `AdmissionDecision` — the recorded verdict

Produced by `ge passport admit` and by the gate inside `ge handoff`;
recorded **on every evaluation** to the workspace's
`artifacts/admission-decision.json` and appended to the machine-wide audit
log `.ge/admission/decisions.jsonl` (one JSON decision per line, newest
last).

| Field | What it says |
|---|---|
| `apiVersion` / `kind` | `ge.dev/v1` / `AdmissionDecision` |
| `gate` | `admission` |
| `required` | whether policy enforces this decision |
| `allowed` | `true` iff no blockers |
| `subject` | the passport's subject (or the bare workspace name when no passport exists) |
| `stage` | what the decision was for (`handoff` by default) |
| `overridden` | `true` when break-glass was used against a denial |
| `blockers[]` | `{ code, what, retryable, fix }` — same shape as the live gate's |
| `next` | the literal next command |

## `GEADM` blocker codes

| Code | Means | Fix |
|---|---|---|
| `GEADM001` | no signed passport for this workspace | `ge passport emit <id>` |
| `GEADM002` | an attestation failed signature verification | re-emit; check the key |
| `GEADM003` | workspace bytes changed since issuance (subject digest mismatch) | `ge prove`, then re-emit |
| `GEADM004` | the contract changed since issuance (contract digest mismatch) | `ge prove`, then re-emit |
| `GEADM005` | no verified promotion-packet attestation in the passport | `ge passport emit <id>` |
| `GEADM006` | the *attested* promotion gate is not passing | `ge prove` |
| `GEADM007` | passport stale (`maxAgeDays`) or unreadable `issuedAt` | `ge passport emit <id>` |
| `GEADM008` | live proof required but missing or not passing | `ge prove --live`, then re-emit |

## Keys

The issuing keypair is per-machine, generated on first `emit`:

- `.ge/keys/admission-ed25519.pem` — private key, mode 0600. Never commit,
  copy, or share it.
- `.ge/keys/admission-ed25519.pub.pem` — the verification key `verify` and
  `admit` trust.

Deleting the private key and re-running `emit` mints a fresh pair; passports
signed by the old key then fail verification (`GEADM002`) until re-emitted.
The signer is an interface in `@ge/admission` — a Cloud KMS or
sigstore-keyless issuer can replace the local file pair without touching the
attestation or policy layers.

## Break-glass

`ge handoff agents-cli --force` (or `GE_ADMISSION_BREAK_GLASS=1`) releases
despite a denial. The override never changes the decision — it changes what
happens next, and it is stamped into the record (`"overridden": true`) and
the audit log. Same philosophy as the promotion gate's `--force` /
`GE_ALLOW_UNPROMOTED`: possible, deliberate, on the record.

## Surfaces

- **CLI:** `ge passport emit|verify|admit`, the gate inside `ge handoff`.
- **Console:** `POST /api/ge/passport/emit|verify|admit` — generated from
  the shared command registry (see
  [Console & APIs](console-and-apis.html)).
- **MCP:** `factory_passport_emit` / `factory_passport_verify` /
  `factory_passport_admit`, plus `factory_handoff`'s `force` param — see
  [MCP tools](../MCP.html).
- **Skill:** [`admitting-agents`](https://github.com/vamsiramakrishnan/ge-agent-factory/tree/main/skills/admitting-agents)
  packages the whole job for an agent harness.

## Related

- [Admit an agent](../cookbooks/admit-an-agent.html) — the worked loop.
- [Agent Passport & Proof Pack](../concepts/agent-passport-and-proof-pack.html) —
  the concept and what the passport consolidates.
- [Evals as Proof](../concepts/evals-as-proof.html) — how the attested
  evidence is produced upstream.
- [Live budgets and gates](live-budgets.html) — the sibling
  `promotion.gates.live` policy.
