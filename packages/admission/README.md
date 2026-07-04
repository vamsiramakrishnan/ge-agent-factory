# @ge/admission

Admission-control primitives for shipped agents — the engine behind
`ge passport` and the admission gate at `ge handoff`.

The factory's contractual checks (validation, spec-to-code trace, harness
verdicts, live proof) produce evidence; this package makes that evidence
**verifiable and bindable** so an admission point can check it instead of
trusting it:

- **`digest`** — content identity: one sha256 over everything that ships in a
  workspace (evidence under `artifacts/` and volatile dirs excluded), plus a
  contract digest, so attestations bind to exact bytes.
- **`signer`** — Ed25519 signing with a stable keyid; the signer is an
  interface (`{ keyid, algorithm, sign }`) so Cloud KMS or sigstore-keyless
  can replace the local keypair without touching the layers above.
- **`attestation`** — in-toto Statements in DSSE envelopes, with the
  factory's own verdict JSON (promotion packet, LiveProofResult) as the
  predicate. Standard formats on purpose: consumable later by sigstore
  policy-controller, Kyverno, or Binary Authorization unchanged.
- **`passport`** — the consolidated, signed, portable Agent Passport document
  (`artifacts/agent-passport.json`): one subject identity + the signed
  attestations, verifiable offline.
- **`policy`** — `evaluateAdmission()`: passport + freshly recomputed digests
  + trusted public key + policy → an `AdmissionDecision` with stable
  `GEADM001`–`GEADM008` blockers. Verifies evidence, never produces it.

Leaf package: node builtins only, no `apps/*` or `tools/*` imports. The
operator wiring (key storage under `.ge/keys/`, `.ge.json`
`promotion.gates.admission` policy, the handoff gate, the decision log) lives
in `tools/lib/admission/`.
