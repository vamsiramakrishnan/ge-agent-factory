// The Agent Passport: the consolidated, signed, portable proof document.
//
// docs/concepts/agent-passport-and-proof-pack.md named this as roadmap work
// ("one signed, portable document"); this module is that document's shape.
// It binds one subject identity (workspace digest + contract digest) to the
// signed attestations over the proof pack, so the whole thing travels as a
// single file and any consumer can verify it offline with the public key.
import { openEnvelope } from "./attestation.mjs";

export const PASSPORT_API_VERSION = "ge.dev/v1";
export const PASSPORT_KIND = "AgentPassport";
export const PASSPORT_SCHEMA_VERSION = 1;

export function buildPassport({
  subjectName,
  workspaceDigest,
  contractDigest,
  issuer,
  attestations = [],
  issuedAt = new Date().toISOString(),
  workspace = {},
}) {
  if (!subjectName) throw new Error("buildPassport requires subjectName");
  if (!workspaceDigest?.hex || !contractDigest?.hex) throw new Error("buildPassport requires workspaceDigest and contractDigest");
  if (!issuer?.keyid) throw new Error("buildPassport requires an issuer keyid");
  return {
    apiVersion: PASSPORT_API_VERSION,
    kind: PASSPORT_KIND,
    schemaVersion: PASSPORT_SCHEMA_VERSION,
    subject: {
      name: subjectName,
      digest: { sha256: workspaceDigest.hex },
      fileCount: workspaceDigest.fileCount ?? null,
      contractDigest: { sha256: contractDigest.hex },
    },
    workspace,
    issuedAt,
    issuer: { keyid: issuer.keyid, algorithm: issuer.algorithm || "ed25519" },
    attestations,
  };
}

export function isPassport(value) {
  return Boolean(value && value.kind === PASSPORT_KIND && value.apiVersion === PASSPORT_API_VERSION && Array.isArray(value.attestations));
}

// Display-only summary (no verification): which predicate types the passport
// carries and what identity it claims.
export function summarizePassport(passport) {
  if (!isPassport(passport)) return null;
  const predicateTypes = passport.attestations.map((envelope) => {
    try {
      return openEnvelope(envelope).predicateType;
    } catch {
      return "<unreadable>"; // best-effort: display summary of a corrupt envelope; verification rejects it properly
    }
  });
  return {
    subject: passport.subject,
    issuedAt: passport.issuedAt,
    keyid: passport.issuer?.keyid || null,
    predicateTypes,
  };
}
