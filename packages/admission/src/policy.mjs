// The admission policy evaluator: passport + expected identity → decision.
//
// This is the verdict function an admission point calls. It verifies
// evidence, it never produces evidence — no evals run here, no code is
// inspected; signatures, digests, freshness, and attested verdicts are
// checked, and everything else is a blocker with a fix command. Blockers use
// the same { code, what, retryable, fix } shape as the live gate
// (GELIVE00x), with stable GEADM00x codes.
//
// Staged-rollout defaults mirror `promotion.gates.live`: the gate evaluates
// (and records) everywhere, but only *refuses* once an operator sets
// `required: true` — landing in audit mode first is the house convention
// (see the Agent Gateway's DRY_RUN → ENFORCED path).
import { verifyEnvelope, PREDICATE_TYPES } from "./attestation.mjs";
import { isPassport } from "./passport.mjs";

export const ADMISSION_API_VERSION = "ge.dev/v1";
export const ADMISSION_DECISION_KIND = "AdmissionDecision";

export const DEFAULT_ADMISSION_POLICY = Object.freeze({
  required: false,
  maxAgeDays: 30,
  requireLiveProof: false,
});

const DAY_MS = 24 * 60 * 60 * 1000;

function blocker(code, what, fix, retryable = false) {
  return { code, what, retryable, fix };
}

function statementSubjectSha256(statement) {
  return statement?.subject?.[0]?.digest?.sha256 || null;
}

// Evaluate admission for one subject. Inputs:
// - passport: the parsed artifacts/agent-passport.json (or null when absent)
// - expected: { workspaceDigest, contractDigest } freshly recomputed from the
//   workspace being admitted — the binding check that makes evidence forgery
//   and stale evidence equally visible
// - publicKeyPem: the trusted verification key
// - policy: DEFAULT_ADMISSION_POLICY overlaid with .ge.json promotion.gates.admission
// - now: injectable clock for freshness checks (tests)
export function evaluateAdmission({
  passport,
  expected,
  publicKeyPem,
  policy = DEFAULT_ADMISSION_POLICY,
  subjectName = null,
  now = new Date(),
} = {}) {
  const effective = { ...DEFAULT_ADMISSION_POLICY, ...policy };
  const blockers = [];
  const name = subjectName || passport?.subject?.name || "<unknown>";
  const emitFix = `ge passport emit ${name}`;

  if (!isPassport(passport)) {
    blockers.push(blocker("GEADM001", "no signed agent passport for this workspace", emitFix));
    return decision({ name, passport: null, blockers, effective, now });
  }

  const verified = [];
  for (const envelope of passport.attestations) {
    const result = verifyEnvelope(envelope, publicKeyPem);
    if (!result.ok) {
      blockers.push(blocker("GEADM002", `attestation failed verification: ${result.reason}`, emitFix));
      continue;
    }
    verified.push(result.statement);
  }

  if (expected?.workspaceDigest?.hex && passport.subject?.digest?.sha256 !== expected.workspaceDigest.hex) {
    blockers.push(blocker(
      "GEADM003",
      "workspace content changed since the passport was issued (subject digest mismatch)",
      `ge prove, then ${emitFix}`,
    ));
  }
  if (expected?.contractDigest?.hex && passport.subject?.contractDigest?.sha256 !== expected.contractDigest.hex) {
    blockers.push(blocker(
      "GEADM004",
      "the agent contract changed since the passport was issued (contract digest mismatch)",
      `ge prove, then ${emitFix}`,
    ));
  }

  const promotion = verified.find((s) => s.predicateType === PREDICATE_TYPES.promotionPacket);
  if (!promotion) {
    blockers.push(blocker("GEADM005", "passport carries no verified promotion-packet attestation", emitFix));
  } else {
    // The attested statement must bind to the same subject the passport claims —
    // a valid signature over a different workspace is still a mismatch.
    if (statementSubjectSha256(promotion) !== passport.subject?.digest?.sha256) {
      blockers.push(blocker("GEADM003", "promotion-packet attestation subject does not match the passport subject", emitFix));
    }
    const gate = promotion.predicate?.promotionGate;
    if (gate?.ok !== true) {
      const detail = (gate?.blockers || []).slice(0, 3).join("; ") || "promotion gate verdict missing";
      blockers.push(blocker("GEADM006", `attested promotion gate is not passing: ${detail}`, "ge prove"));
    }
  }

  const issued = Date.parse(passport.issuedAt || "");
  if (!Number.isFinite(issued)) {
    blockers.push(blocker("GEADM007", "passport has no readable issuedAt timestamp", emitFix));
  } else if (effective.maxAgeDays > 0 && now.getTime() - issued > effective.maxAgeDays * DAY_MS) {
    const ageDays = Math.floor((now.getTime() - issued) / DAY_MS);
    blockers.push(blocker("GEADM007", `passport is ${ageDays} day(s) old — older than the gate's maxAgeDays ${effective.maxAgeDays}`, emitFix));
  }

  if (effective.requireLiveProof) {
    const live = verified.find((s) => s.predicateType === PREDICATE_TYPES.liveProof);
    const passed = live?.predicate?.status === "passed" || live?.predicate?.verdict?.passed === true;
    if (!live) blockers.push(blocker("GEADM008", "the gate requires live proof and the passport carries no live-proof attestation", `ge prove --live, then ${emitFix}`));
    else if (!passed) blockers.push(blocker("GEADM008", `attested live proof is not passing (status ${live.predicate?.status || "unknown"})`, "ge prove --live"));
  }

  return decision({ name, passport, blockers, effective, now });
}

function decision({ name, passport, blockers, effective, now }) {
  return {
    apiVersion: ADMISSION_API_VERSION,
    kind: ADMISSION_DECISION_KIND,
    gate: "admission",
    required: effective.required,
    allowed: blockers.length === 0,
    subject: passport?.subject || { name },
    evaluatedAt: now.toISOString(),
    policy: effective,
    blockers,
    next: blockers.length ? blockers[0].fix : "ge handoff agents-cli",
  };
}
