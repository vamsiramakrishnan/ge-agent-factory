import { describe, expect, test } from "bun:test";
import { mkdtempSync, mkdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  DEFAULT_ADMISSION_POLICY,
  PREDICATE_TYPES,
  buildPassport,
  buildStatement,
  computeFileDigest,
  computeProofBinding,
  computeTreeDigest,
  computeWorkspaceDigest,
  createLocalSigner,
  evaluateAdmission,
  generateAdmissionKeypair,
  keyidFor,
  openEnvelope,
  signStatement,
  summarizePassport,
  verifyEnvelope,
} from "./index.mjs";

function makeWorkspace(extra = {}) {
  const dir = mkdtempSync(join(tmpdir(), "ge-admission-"));
  mkdirSync(join(dir, "app"), { recursive: true });
  mkdirSync(join(dir, "mock_systems"), { recursive: true });
  mkdirSync(join(dir, "artifacts"), { recursive: true });
  writeFileSync(join(dir, "app", "agent.py"), "print('agent')\n");
  writeFileSync(join(dir, "mock_systems", "usecase-spec.json"), JSON.stringify({ behaviorContract: { role: "test" } }));
  writeFileSync(join(dir, "artifacts", "promotion-packet.json"), JSON.stringify({ promotionGate: { ok: true } }));
  for (const [rel, content] of Object.entries(extra)) writeFileSync(join(dir, rel), content);
  return dir;
}

const KEYS = generateAdmissionKeypair();
const SIGNER = createLocalSigner(KEYS.privateKeyPem, KEYS.publicKeyPem);

function passportFor(dir, { predicate = null, issuedAt = new Date().toISOString(), extraAttestations = [] } = {}) {
  predicate ||= { promotionGate: { ok: true }, proofBinding: computeProofBinding(dir) };
  const workspaceDigest = computeWorkspaceDigest(dir);
  const contractDigest = computeFileDigest(join(dir, "mock_systems", "usecase-spec.json"));
  const statement = buildStatement({
    subjectName: "test-agent",
    subjectDigest: workspaceDigest,
    predicateType: PREDICATE_TYPES.promotionPacket,
    predicate,
  });
  return buildPassport({
    subjectName: "test-agent",
    workspaceDigest,
    contractDigest,
    issuer: SIGNER,
    issuedAt,
    attestations: [signStatement(statement, SIGNER), ...extraAttestations],
  });
}

describe("digest", () => {
  test("is deterministic and ignores evidence + volatile dirs", () => {
    const dir = makeWorkspace();
    const first = computeWorkspaceDigest(dir);
    const second = computeWorkspaceDigest(dir);
    expect(first.hex).toBe(second.hex);
    // artifacts/ and pruned dirs do not participate in identity
    writeFileSync(join(dir, "artifacts", "agent-passport.json"), "{}");
    mkdirSync(join(dir, "__pycache__"), { recursive: true });
    writeFileSync(join(dir, "__pycache__", "junk.pyc"), "junk");
    expect(computeWorkspaceDigest(dir).hex).toBe(first.hex);
    // shipped bytes do
    writeFileSync(join(dir, "app", "agent.py"), "print('changed')\n");
    expect(computeWorkspaceDigest(dir).hex).not.toBe(first.hex);
  });

  test("proof tree digests include explicit file roots", () => {
    const dir = makeWorkspace({ "ge.lock.json": "{\"version\":1}\n" });
    const first = computeTreeDigest(dir, ["ge.lock.json"]);
    writeFileSync(join(dir, "ge.lock.json"), "{\"version\":2}\n");
    const second = computeTreeDigest(dir, ["ge.lock.json"]);
    expect(first.fileCount).toBe(1);
    expect(second.fileCount).toBe(1);
    expect(second.hex).not.toBe(first.hex);
  });
});

describe("attestation round-trip", () => {
  test("signs and verifies a statement; tampering fails closed", () => {
    const statement = buildStatement({
      subjectName: "a",
      subjectDigest: { hex: "ab".repeat(32) },
      predicateType: PREDICATE_TYPES.promotionPacket,
      predicate: { promotionGate: { ok: true } },
    });
    const envelope = signStatement(statement, SIGNER);
    const verified = verifyEnvelope(envelope, KEYS.publicKeyPem);
    expect(verified.ok).toBe(true);
    expect(verified.statement.predicateType).toBe(PREDICATE_TYPES.promotionPacket);
    expect(openEnvelope(envelope).subject[0].digest.sha256).toBe("ab".repeat(32));

    const tampered = { ...envelope, payload: Buffer.from(JSON.stringify({ ...statement, predicate: { promotionGate: { ok: false } } })).toString("base64") };
    expect(verifyEnvelope(tampered, KEYS.publicKeyPem).ok).toBe(false);

    const otherKeys = generateAdmissionKeypair();
    expect(verifyEnvelope(envelope, otherKeys.publicKeyPem).ok).toBe(false);
    expect(keyidFor(KEYS.publicKeyPem)).toBe(SIGNER.keyid);
  });
});

describe("passport", () => {
  test("summarizes subject identity and predicate types", () => {
    const dir = makeWorkspace();
    const passport = passportFor(dir);
    const summary = summarizePassport(passport);
    expect(summary.subject.name).toBe("test-agent");
    expect(summary.predicateTypes).toEqual([PREDICATE_TYPES.promotionPacket]);
    expect(summary.keyid).toBe(SIGNER.keyid);
  });
});

describe("evaluateAdmission", () => {
  test("allows a fresh, signed, matching passport with a passing gate", () => {
    const dir = makeWorkspace();
    const passport = passportFor(dir);
    const decision = evaluateAdmission({
      passport,
      expected: {
        workspaceDigest: computeWorkspaceDigest(dir),
        contractDigest: computeFileDigest(join(dir, "mock_systems", "usecase-spec.json")),
        proofBinding: computeProofBinding(dir),
      },
      publicKeyPem: KEYS.publicKeyPem,
    });
    expect(decision.allowed).toBe(true);
    expect(decision.blockers).toEqual([]);
    expect(decision.kind).toBe("AdmissionDecision");
  });

  test("denies with GEADM001 when no passport exists", () => {
    const decision = evaluateAdmission({ passport: null, expected: {}, publicKeyPem: KEYS.publicKeyPem, subjectName: "x" });
    expect(decision.allowed).toBe(false);
    expect(decision.blockers[0].code).toBe("GEADM001");
  });

  test("denies with GEADM003 when the workspace changed after issuance", () => {
    const dir = makeWorkspace();
    const passport = passportFor(dir);
    writeFileSync(join(dir, "app", "agent.py"), "print('drifted')\n");
    const decision = evaluateAdmission({
      passport,
      expected: {
        workspaceDigest: computeWorkspaceDigest(dir),
        contractDigest: computeFileDigest(join(dir, "mock_systems", "usecase-spec.json")),
        proofBinding: computeProofBinding(dir),
      },
      publicKeyPem: KEYS.publicKeyPem,
    });
    expect(decision.allowed).toBe(false);
    expect(decision.blockers.map((b) => b.code)).toContain("GEADM003");
  });


  test("denies with GEADM009 when attested proof binding is stale", () => {
    const dir = makeWorkspace();
    const stale = computeProofBinding(dir);
    const passport = passportFor(dir, { predicate: { promotionGate: { ok: true }, proofBinding: stale } });
    writeFileSync(join(dir, "app", "agent.py"), "print('proof drift')\n");
    const decision = evaluateAdmission({
      passport,
      expected: {
        workspaceDigest: computeWorkspaceDigest(dir),
        contractDigest: computeFileDigest(join(dir, "mock_systems", "usecase-spec.json")),
        proofBinding: computeProofBinding(dir),
      },
      publicKeyPem: KEYS.publicKeyPem,
    });
    expect(decision.blockers.map((b) => b.code)).toContain("GEADM009");
  });

  test("denies with GEADM004 when the contract changed after issuance", () => {
    const dir = makeWorkspace();
    const passport = passportFor(dir);
    writeFileSync(join(dir, "mock_systems", "usecase-spec.json"), JSON.stringify({ behaviorContract: { role: "changed" } }));
    const decision = evaluateAdmission({
      passport,
      expected: {
        // digest also changes with the spec file; assert the contract-specific code fires too
        workspaceDigest: computeWorkspaceDigest(dir),
        contractDigest: computeFileDigest(join(dir, "mock_systems", "usecase-spec.json")),
        proofBinding: computeProofBinding(dir),
      },
      publicKeyPem: KEYS.publicKeyPem,
    });
    expect(decision.allowed).toBe(false);
    expect(decision.blockers.map((b) => b.code)).toContain("GEADM004");
  });

  test("denies with GEADM006 when the attested promotion gate is failing", () => {
    const dir = makeWorkspace();
    const passport = passportFor(dir, { predicate: { promotionGate: { ok: false, blockers: ["validation report is not passing"] } } });
    const decision = evaluateAdmission({
      passport,
      expected: {
        workspaceDigest: computeWorkspaceDigest(dir),
        contractDigest: computeFileDigest(join(dir, "mock_systems", "usecase-spec.json")),
        proofBinding: computeProofBinding(dir),
      },
      publicKeyPem: KEYS.publicKeyPem,
    });
    expect(decision.allowed).toBe(false);
    expect(decision.blockers.map((b) => b.code)).toContain("GEADM006");
  });

  test("denies with GEADM007 when the passport is older than maxAgeDays", () => {
    const dir = makeWorkspace();
    const issuedAt = new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString();
    const passport = passportFor(dir, { issuedAt });
    const decision = evaluateAdmission({
      passport,
      expected: {
        workspaceDigest: computeWorkspaceDigest(dir),
        contractDigest: computeFileDigest(join(dir, "mock_systems", "usecase-spec.json")),
        proofBinding: computeProofBinding(dir),
      },
      publicKeyPem: KEYS.publicKeyPem,
      policy: { ...DEFAULT_ADMISSION_POLICY, maxAgeDays: 30 },
    });
    expect(decision.allowed).toBe(false);
    expect(decision.blockers.map((b) => b.code)).toContain("GEADM007");
  });

  test("requireLiveProof denies with GEADM008 without a live-proof attestation", () => {
    const dir = makeWorkspace();
    const passport = passportFor(dir);
    const decision = evaluateAdmission({
      passport,
      expected: {
        workspaceDigest: computeWorkspaceDigest(dir),
        contractDigest: computeFileDigest(join(dir, "mock_systems", "usecase-spec.json")),
        proofBinding: computeProofBinding(dir),
      },
      publicKeyPem: KEYS.publicKeyPem,
      policy: { ...DEFAULT_ADMISSION_POLICY, requireLiveProof: true },
    });
    expect(decision.allowed).toBe(false);
    expect(decision.blockers.map((b) => b.code)).toContain("GEADM008");
  });

  test("stays a dry-run by default: required=false is reported, not enforced here", () => {
    const decision = evaluateAdmission({ passport: null, expected: {}, publicKeyPem: KEYS.publicKeyPem, subjectName: "x" });
    expect(decision.required).toBe(false);
    // enforcement (skip/deny at handoff) is the caller's job, keyed on `required`
  });
});
