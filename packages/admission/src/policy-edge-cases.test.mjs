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
  computeWorkspaceDigest,
  createLocalSigner,
  evaluateAdmission,
  generateAdmissionKeypair,
  openEnvelope,
  preAuthenticationEncoding,
  signStatement,
  verifyEnvelope,
  verifySignature,
  DSSE_PAYLOAD_TYPE,
} from "./index.mjs";

function makeWorkspace(extra = {}) {
  const dir = mkdtempSync(join(tmpdir(), "ge-admission-edge-"));
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
const OTHER_KEYS = generateAdmissionKeypair();
const OTHER_SIGNER = createLocalSigner(OTHER_KEYS.privateKeyPem, OTHER_KEYS.publicKeyPem);

function expectedFor(dir) {
  return {
    workspaceDigest: computeWorkspaceDigest(dir),
    contractDigest: computeFileDigest(join(dir, "mock_systems", "usecase-spec.json")),
    proofBinding: computeProofBinding(dir),
  };
}

function promotionAttestation(dir) {
  const workspaceDigest = computeWorkspaceDigest(dir);
  return signStatement(buildStatement({
    subjectName: "test-agent",
    subjectDigest: workspaceDigest,
    predicateType: PREDICATE_TYPES.promotionPacket,
    predicate: { promotionGate: { ok: true }, proofBinding: computeProofBinding(dir) },
  }), SIGNER);
}

function passportWith(dir, attestations) {
  return buildPassport({
    subjectName: "test-agent",
    workspaceDigest: computeWorkspaceDigest(dir),
    contractDigest: computeFileDigest(join(dir, "mock_systems", "usecase-spec.json")),
    issuer: SIGNER,
    attestations,
  });
}

describe("evaluateAdmission — untested blocker codes", () => {
  test("denies with GEADM002 when an attestation fails verification", () => {
    const dir = makeWorkspace();
    // A valid promotion attestation keeps GEADM005 from firing, so GEADM002 is
    // isolated. The extra envelope is signed by an untrusted key.
    const workspaceDigest = computeWorkspaceDigest(dir);
    const badEnvelope = signStatement(buildStatement({
      subjectName: "test-agent",
      subjectDigest: workspaceDigest,
      predicateType: PREDICATE_TYPES.liveProof,
      predicate: { status: "passed" },
    }), OTHER_SIGNER);
    const passport = passportWith(dir, [promotionAttestation(dir), badEnvelope]);
    const decision = evaluateAdmission({ passport, expected: expectedFor(dir), publicKeyPem: KEYS.publicKeyPem });
    expect(decision.allowed).toBe(false);
    expect(decision.blockers.map((b) => b.code)).toContain("GEADM002");
  });

  test("GEADM002 also fires when an attestation payload is tampered", () => {
    const dir = makeWorkspace();
    const good = promotionAttestation(dir);
    const tampered = {
      ...good,
      payload: Buffer.from(JSON.stringify({ ...openEnvelope(good), predicate: { promotionGate: { ok: false } } })).toString("base64"),
    };
    const passport = passportWith(dir, [tampered]);
    const decision = evaluateAdmission({ passport, expected: expectedFor(dir), publicKeyPem: KEYS.publicKeyPem });
    expect(decision.allowed).toBe(false);
    expect(decision.blockers.map((b) => b.code)).toContain("GEADM002");
  });

  test("denies with GEADM005 when the passport carries no promotion-packet attestation", () => {
    const dir = makeWorkspace();
    // A properly-signed live-proof attestation verifies, but no promotion packet.
    const live = signStatement(buildStatement({
      subjectName: "test-agent",
      subjectDigest: computeWorkspaceDigest(dir),
      predicateType: PREDICATE_TYPES.liveProof,
      predicate: { status: "passed" },
    }), SIGNER);
    const passport = passportWith(dir, [live]);
    const decision = evaluateAdmission({ passport, expected: expectedFor(dir), publicKeyPem: KEYS.publicKeyPem });
    expect(decision.allowed).toBe(false);
    expect(decision.blockers.map((b) => b.code)).toContain("GEADM005");
  });

  test("GEADM005 also fires for a passport with an empty attestations array", () => {
    const dir = makeWorkspace();
    const passport = passportWith(dir, []);
    const decision = evaluateAdmission({ passport, expected: expectedFor(dir), publicKeyPem: KEYS.publicKeyPem });
    expect(decision.blockers.map((b) => b.code)).toContain("GEADM005");
  });
});

describe("signer/envelope — malformed input fails closed", () => {
  test("verifySignature returns false for a garbage (non-base64) signature, never throws", () => {
    const bytes = Buffer.from("hello");
    expect(verifySignature(KEYS.publicKeyPem, bytes, "!!!not-base64!!!")).toBe(false);
    expect(verifySignature(KEYS.publicKeyPem, bytes, "")).toBe(false);
  });

  test("verifySignature returns false when the signed bytes are tampered", () => {
    const bytes = Buffer.from("original");
    const sig = SIGNER.sign(bytes);
    expect(verifySignature(KEYS.publicKeyPem, bytes, sig)).toBe(true);
    expect(verifySignature(KEYS.publicKeyPem, Buffer.from("tampered"), sig)).toBe(false);
  });

  test("verifySignature returns false when verified with the wrong public key", () => {
    const bytes = Buffer.from("payload");
    const sig = SIGNER.sign(bytes);
    expect(verifySignature(OTHER_KEYS.publicKeyPem, bytes, sig)).toBe(false);
  });

  test("openEnvelope throws on a garbage payload", () => {
    expect(() => openEnvelope({ payload: Buffer.from("not json{{{").toString("base64") })).toThrow();
    expect(() => openEnvelope({ payload: "@@@not-base64@@@" })).toThrow();
  });

  test("verifyEnvelope fails closed on malformed envelopes without throwing", () => {
    const cases = [
      undefined,
      null,
      {},
      { payload: "abc" },
      { payload: "abc", signatures: [] },
      { payloadType: "text/plain", payload: "abc", signatures: [{ sig: "x" }] },
      { payloadType: DSSE_PAYLOAD_TYPE, payload: Buffer.from("not json").toString("base64"), signatures: [{ sig: "x" }] },
    ];
    for (const envelope of cases) {
      const result = verifyEnvelope(envelope, KEYS.publicKeyPem);
      expect(result.ok).toBe(false);
      expect(result.statement).toBe(null);
      expect(typeof result.reason).toBe("string");
    }
  });

  test("verifyEnvelope rejects a well-formed envelope whose signature is garbage", () => {
    const dir = makeWorkspace();
    const good = promotionAttestation(dir);
    const bad = { ...good, signatures: [{ keyid: SIGNER.keyid, sig: "!!!garbage!!!" }] };
    const result = verifyEnvelope(bad, KEYS.publicKeyPem);
    expect(result.ok).toBe(false);
    expect(result.statement).toBe(null);
  });

  test("verifyEnvelope rejects a valid envelope when its statement _type is swapped", () => {
    const statement = buildStatement({
      subjectName: "a",
      subjectDigest: { hex: "cd".repeat(32) },
      predicateType: PREDICATE_TYPES.promotionPacket,
      predicate: {},
    });
    // Re-sign a forged statement (wrong _type) so the signature is valid but the type check must reject it.
    const forged = { ...statement, _type: "https://example.com/NotAStatement" };
    const payloadBytes = Buffer.from(JSON.stringify(forged), "utf8");
    const sig = SIGNER.sign(preAuthenticationEncoding(DSSE_PAYLOAD_TYPE, payloadBytes));
    const envelope = { payloadType: DSSE_PAYLOAD_TYPE, payload: payloadBytes.toString("base64"), signatures: [{ keyid: SIGNER.keyid, sig }] };
    const result = verifyEnvelope(envelope, KEYS.publicKeyPem);
    expect(result.ok).toBe(false);
    expect(result.reason).toContain("unexpected statement type");
  });
});

// Guard that these edge cases don't accidentally weaken policy defaults.
test("DEFAULT_ADMISSION_POLICY stays audit-mode (required: false)", () => {
  expect(DEFAULT_ADMISSION_POLICY.required).toBe(false);
});
