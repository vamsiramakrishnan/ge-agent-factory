// Signing for admission attestations.
//
// The default signer is a local Ed25519 keypair (node:crypto, PEM on disk —
// key management is the caller's job). The signer is an interface on purpose:
// `{ keyid, algorithm, sign(bytes) }` — a Cloud KMS or sigstore-keyless
// implementation can replace the local one without touching the attestation
// or policy layers.
import {
  createPrivateKey,
  createPublicKey,
  generateKeyPairSync,
  sign as edSign,
  verify as edVerify,
} from "node:crypto";
import { sha256Hex } from "./digest.mjs";

export const SIGNATURE_ALGORITHM = "ed25519";

export function generateAdmissionKeypair() {
  const { privateKey, publicKey } = generateKeyPairSync("ed25519");
  return {
    privateKeyPem: privateKey.export({ type: "pkcs8", format: "pem" }).toString(),
    publicKeyPem: publicKey.export({ type: "spki", format: "pem" }).toString(),
  };
}

// Stable key identity: sha256 of the DER-encoded SPKI public key. Rendered in
// envelopes and passports so a verifier can say *which* key must check out.
export function keyidFor(publicKeyPem) {
  const der = createPublicKey(publicKeyPem).export({ type: "spki", format: "der" });
  return sha256Hex(der);
}

export function createLocalSigner(privateKeyPem, publicKeyPem) {
  const privateKey = createPrivateKey(privateKeyPem);
  const keyid = keyidFor(publicKeyPem);
  return {
    keyid,
    algorithm: SIGNATURE_ALGORITHM,
    sign(bytes) {
      // Ed25519 signs the message directly (digest algorithm must be null).
      return edSign(null, bytes, privateKey).toString("base64");
    },
  };
}

export function verifySignature(publicKeyPem, bytes, signatureBase64) {
  return edVerify(null, bytes, createPublicKey(publicKeyPem), Buffer.from(signatureBase64, "base64"));
}
