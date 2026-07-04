// Attestations: in-toto Statements carried in DSSE envelopes.
//
// Standard formats on purpose — an attestation minted here is consumable by
// any policy engine that already speaks in-toto/DSSE (sigstore
// policy-controller, Kyverno, GCP Binary Authorization), so the factory's
// proof pack can gate a Kubernetes or Cloud Run admission point later without
// re-encoding. The predicate is the factory's existing verdict JSON
// (promotion packet, LiveProofResult) verbatim; nothing is invented at
// signing time.
import { keyidFor, verifySignature } from "./signer.mjs";

export const IN_TOTO_STATEMENT_TYPE = "https://in-toto.io/Statement/v1";
export const DSSE_PAYLOAD_TYPE = "application/vnd.in-toto+json";

// Predicate types minted by the factory. The promotion packet is the
// pre-handoff proof pack verdict; live proof is the post-deploy gate input.
export const PREDICATE_TYPES = Object.freeze({
  promotionPacket: "ge.dev/attestation/promotion-packet/v1",
  liveProof: "ge.dev/attestation/live-proof/v1",
});

export function buildStatement({ subjectName, subjectDigest, predicateType, predicate }) {
  if (!subjectName || !subjectDigest?.hex) throw new Error("buildStatement requires subjectName and subjectDigest.hex");
  if (!predicateType) throw new Error("buildStatement requires predicateType");
  return {
    _type: IN_TOTO_STATEMENT_TYPE,
    subject: [{ name: subjectName, digest: { sha256: subjectDigest.hex } }],
    predicateType,
    predicate: predicate ?? {},
  };
}

// DSSE Pre-Authentication Encoding: what actually gets signed. Binding the
// payload *type* into the signed bytes is what stops a signature minted over
// one kind of document being replayed as another.
export function preAuthenticationEncoding(payloadType, payloadBytes) {
  const type = Buffer.from(payloadType, "utf8");
  return Buffer.concat([
    Buffer.from(`DSSEv1 ${type.length} `, "utf8"),
    type,
    Buffer.from(` ${payloadBytes.length} `, "utf8"),
    payloadBytes,
  ]);
}

export function signStatement(statement, signer) {
  const payloadBytes = Buffer.from(JSON.stringify(statement), "utf8");
  const sig = signer.sign(preAuthenticationEncoding(DSSE_PAYLOAD_TYPE, payloadBytes));
  return {
    payloadType: DSSE_PAYLOAD_TYPE,
    payload: payloadBytes.toString("base64"),
    signatures: [{ keyid: signer.keyid, sig }],
  };
}

// Parse the statement out of an envelope WITHOUT verifying — for display
// only. Policy decisions must go through verifyEnvelope.
export function openEnvelope(envelope) {
  return JSON.parse(Buffer.from(envelope.payload, "base64").toString("utf8"));
}

// Verify an envelope against a public key: returns { ok, statement, reason }.
// Never throws on bad input — a malformed envelope is a verification failure,
// not a crash, because this sits on the deny path of a gate.
export function verifyEnvelope(envelope, publicKeyPem) {
  try {
    if (!envelope?.payload || !Array.isArray(envelope.signatures) || !envelope.signatures.length) {
      return { ok: false, statement: null, reason: "envelope missing payload or signatures" };
    }
    if (envelope.payloadType !== DSSE_PAYLOAD_TYPE) {
      return { ok: false, statement: null, reason: `unexpected payloadType ${envelope.payloadType}` };
    }
    const payloadBytes = Buffer.from(envelope.payload, "base64");
    const pae = preAuthenticationEncoding(envelope.payloadType, payloadBytes);
    const expectedKeyid = keyidFor(publicKeyPem);
    const matching = envelope.signatures.filter((s) => !s.keyid || s.keyid === expectedKeyid);
    if (!matching.length) return { ok: false, statement: null, reason: "no signature by the trusted key" };
    const verified = matching.some((s) => verifySignature(publicKeyPem, pae, s.sig));
    if (!verified) return { ok: false, statement: null, reason: "signature verification failed" };
    const statement = JSON.parse(payloadBytes.toString("utf8"));
    if (statement._type !== IN_TOTO_STATEMENT_TYPE) {
      return { ok: false, statement: null, reason: `unexpected statement type ${statement._type}` };
    }
    return { ok: true, statement, reason: null };
  } catch (error) {
    return { ok: false, statement: null, reason: `envelope verification error: ${error?.message || String(error)}` };
  }
}
