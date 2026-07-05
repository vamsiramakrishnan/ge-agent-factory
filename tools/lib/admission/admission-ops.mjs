// Operator wiring for @ge/admission — `ge passport emit|verify|admit` and the
// admission gate `ge handoff` consults before releasing a workspace.
//
// Layering: the crypto/policy engine is the leaf package (@ge/admission);
// this module owns everything operator-shaped — where keys live
// (.ge/keys/), where policy comes from (.ge.json promotion.gates.admission,
// same staged-rollout convention as promotion.gates.live), which artifacts
// feed the attestations (the promotion packet the build already writes, the
// live proof result when one exists), and the decision record (the
// workspace's artifacts/admission-decision.json plus the append-only
// .ge/admission/decisions.jsonl audit log — every decision lands there,
// including break-glass overrides).
//
// Return/throw contract as everywhere in tools/lib: data on success, DxError
// on failure; rendering belongs to the ge.mjs boundary.
import { appendFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { readJson, writeJson } from "@ge/std/json-io";
import { ARTIFACT_PATHS, WORKSPACE_PATHS, workspacePath } from "@ge/agent-workspace";
import {
  DEFAULT_ADMISSION_POLICY,
  PREDICATE_TYPES,
  buildPassport,
  buildStatement,
  computeFileDigest,
  computeWorkspaceDigest,
  computeProofBinding,
  createLocalSigner,
  evaluateAdmission,
  generateAdmissionKeypair,
  signStatement,
  summarizePassport,
  verifyEnvelope,
} from "@ge/admission";
import { STATE_PATHS, displayStatePath, statePath } from "../state-paths.mjs";
import { LOCAL_PROJECTS, resolveLocalWorkspaceId } from "../local-workspaces.mjs";
import { DxError } from "../errors/dx-error.mjs";

const KEY_FILE = "admission-ed25519.pem";
const PUBLIC_KEY_FILE = "admission-ed25519.pub.pem";
const DECISION_LOG = () => statePath("admission", "decisions.jsonl");

export { DEFAULT_ADMISSION_POLICY };

// Policy lives in .ge.json under `promotion.gates.admission` (the same
// sanctioned free-form block as `promotion.gates.live`), staged defaults:
// the gate evaluates and records everywhere, and refuses only once an
// operator sets `required: true`.
export function admissionGatePolicy(configFile = STATE_PATHS.config) {
  const file = readJson(configFile, {}) || {};
  return { ...DEFAULT_ADMISSION_POLICY, ...(file.promotion?.gates?.admission || {}) };
}

export function admissionKeyPaths() {
  return {
    privateKeyPath: statePath("keys", KEY_FILE),
    publicKeyPath: statePath("keys", PUBLIC_KEY_FILE),
  };
}

// Load the local issuing keypair, generating one on first use. The private
// key never leaves .ge/keys/ (mode 0600); the signer interface in
// @ge/admission is where a KMS-backed issuer would replace this.
export function ensureAdmissionKeys() {
  const { privateKeyPath, publicKeyPath } = admissionKeyPaths();
  if (existsSync(privateKeyPath) && existsSync(publicKeyPath)) {
    return {
      privateKeyPem: readFileSync(privateKeyPath, "utf8"),
      publicKeyPem: readFileSync(publicKeyPath, "utf8"),
      privateKeyPath,
      publicKeyPath,
      created: false,
    };
  }
  const { privateKeyPem, publicKeyPem } = generateAdmissionKeypair();
  mkdirSync(join(statePath("keys")), { recursive: true });
  writeFileSync(privateKeyPath, privateKeyPem, { mode: 0o600 });
  writeFileSync(publicKeyPath, publicKeyPem, { mode: 0o644 });
  return { privateKeyPem, publicKeyPem, privateKeyPath, publicKeyPath, created: true };
}

function trustedPublicKey() {
  const { publicKeyPath } = admissionKeyPaths();
  if (!existsSync(publicKeyPath)) {
    throw new DxError("no admission verification key on this machine.", {
      where: `keys: ${displayStatePath(publicKeyPath)}`,
      why: "verifying a passport needs the issuer's public key, and none has been generated or installed here",
      fix: "ge passport emit <id>",
    });
  }
  return readFileSync(publicKeyPath, "utf8");
}

function resolveWorkspace(id) {
  if (!id) {
    throw new DxError("no workspace id given.", {
      where: "passport subject",
      why: "passports bind to exactly one workspace; there is no default",
      fix: "ge passport emit <workspace-id>",
    });
  }
  const resolved = (() => {
    try {
      return resolveLocalWorkspaceId(id);
    } catch {
      return id; // best-effort: unresolvable ids fall through to the existence check below, which throws with the fix
    }
  })();
  const dir = join(LOCAL_PROJECTS, resolved);
  if (!existsSync(dir)) {
    throw new DxError(`no local workspace '${id}'.`, {
      where: `workspaces: ${displayStatePath(LOCAL_PROJECTS)}`,
      why: "passports are minted over locally-built, proven workspaces",
      fix: "ge prove",
    });
  }
  return { id: resolved, dir };
}

function subjectDigests(dir) {
  return {
    workspaceDigest: computeWorkspaceDigest(dir),
    contractDigest: computeFileDigest(workspacePath(dir, WORKSPACE_PATHS.useCaseSpec)),
    proofBinding: computeProofBinding(dir),
  };
}

function writeWorkspaceJsonSync(dir, relPath, value) {
  const path = workspacePath(dir, relPath);
  writeJson(path, value); // atomic (temp + rename) — a crash mid-write never leaves a torn passport/decision
  return path;
}

// ── emit ─────────────────────────────────────────────────────────────────────
// Mint the consolidated signed Agent Passport for one workspace: subject
// digests, an attestation over the promotion packet (required — it carries
// the promotion-gate verdict), and one over the live proof result when one
// exists on this machine.
export function emitPassport({ id } = {}) {
  const workspace = resolveWorkspace(id);
  const packet = readJson(workspacePath(workspace.dir, ARTIFACT_PATHS.promotionPacket), null);
  if (!packet) {
    throw new DxError(`workspace '${workspace.id}' has no promotion packet.`, {
      where: `workspace artifact: ${ARTIFACT_PATHS.promotionPacket}`,
      why: "the passport attests the proof pack, and the promotion packet (with its gate verdict) is its core — there is nothing to attest yet",
      fix: "ge prove",
    });
  }
  if (!existsSync(workspacePath(workspace.dir, WORKSPACE_PATHS.useCaseSpec))) {
    throw new DxError(`workspace '${workspace.id}' has no contract (${WORKSPACE_PATHS.useCaseSpec}).`, {
      where: `workspace: ${workspace.id}`,
      why: "the passport binds evidence to the contract digest, and the contract file is missing",
      fix: "ge prove",
    });
  }

  const keys = ensureAdmissionKeys();
  const signer = createLocalSigner(keys.privateKeyPem, keys.publicKeyPem);
  const digests = subjectDigests(workspace.dir);
  const proofBinding = computeProofBinding(workspace.dir);
  const boundPacket = { ...packet, proofBinding, promotionGate: packet.promotionGate || { ok: true, blockers: [] } };

  const attestations = [
    signStatement(buildStatement({
      subjectName: workspace.id,
      subjectDigest: digests.workspaceDigest,
      predicateType: PREDICATE_TYPES.promotionPacket,
      predicate: boundPacket,
    }), signer),
  ];
  const liveProof = readJson(statePath("proof", "live-proof-result.json"), null);
  if (liveProof) {
    attestations.push(signStatement(buildStatement({
      subjectName: workspace.id,
      subjectDigest: digests.workspaceDigest,
      predicateType: PREDICATE_TYPES.liveProof,
      predicate: liveProof,
    }), signer));
  }

  const passport = buildPassport({
    subjectName: workspace.id,
    workspaceDigest: digests.workspaceDigest,
    contractDigest: digests.contractDigest,
    issuer: signer,
    attestations,
    workspace: {
      id: workspace.id,
      useCaseId: boundPacket.workspace?.useCaseId || null,
      mode: boundPacket.workspace?.mode || null,
    },
  });
  const path = writeWorkspaceJsonSync(workspace.dir, ARTIFACT_PATHS.agentPassport, passport);
  return {
    kind: "ge.passport.emit",
    id: workspace.id,
    path,
    subject: passport.subject,
    predicateTypes: attestations.length === 2 ? ["promotion-packet", "live-proof"] : ["promotion-packet"],
    keyid: signer.keyid,
    keyCreated: keys.created,
    next: `ge passport admit ${workspace.id}`,
  };
}

// ── verify ───────────────────────────────────────────────────────────────────
// Integrity only (signatures + digest binding), no policy: "is this passport
// authentic and does it describe these exact bytes?"
export function verifyPassport({ id } = {}) {
  const workspace = resolveWorkspace(id);
  const passport = readJson(workspacePath(workspace.dir, ARTIFACT_PATHS.agentPassport), null);
  if (!passport) {
    throw new DxError(`workspace '${workspace.id}' has no agent passport.`, {
      where: `workspace artifact: ${ARTIFACT_PATHS.agentPassport}`,
      why: "nothing to verify — no passport has been emitted for this workspace",
      fix: `ge passport emit ${workspace.id}`,
    });
  }
  const publicKeyPem = trustedPublicKey();
  const digests = subjectDigests(workspace.dir);
  const signatureResults = (passport.attestations || []).map((envelope) => verifyEnvelope(envelope, publicKeyPem));
  const checks = [
    ...signatureResults.map((result, index) => ({
      id: `attestation:${index}`,
      ok: result.ok,
      detail: result.ok ? result.statement.predicateType : result.reason,
    })),
    {
      id: "subject:workspace-digest",
      ok: passport.subject?.digest?.sha256 === digests.workspaceDigest.hex,
      detail: passport.subject?.digest?.sha256 === digests.workspaceDigest.hex
        ? `sha256:${digests.workspaceDigest.hex.slice(0, 12)}… over ${digests.workspaceDigest.fileCount} files`
        : "workspace content changed since the passport was issued",
    },
    {
      id: "subject:contract-digest",
      ok: passport.subject?.contractDigest?.sha256 === digests.contractDigest.hex,
      detail: passport.subject?.contractDigest?.sha256 === digests.contractDigest.hex
        ? `sha256:${digests.contractDigest.hex.slice(0, 12)}…`
        : "contract changed since the passport was issued",
    },
  ];
  return {
    kind: "ge.passport.verify",
    id: workspace.id,
    ok: checks.every((check) => check.ok),
    summary: summarizePassport(passport),
    checks,
    next: checks.every((check) => check.ok) ? `ge passport admit ${workspace.id}` : `ge passport emit ${workspace.id}`,
  };
}

// ── admit ────────────────────────────────────────────────────────────────────
// The admission decision: policy evaluation over the verified passport, with
// the decision recorded no matter which way it goes. `force` is break-glass:
// it never changes the decision, only how the caller acts on it — and it is
// stamped into the record so using it is a visible, deliberate act (the same
// philosophy as the promotion gate's --force).
export function checkAdmission({ id, stage = "handoff", force = false, record = true, configFile = undefined } = {}) {
  const workspace = resolveWorkspace(id);
  const policy = admissionGatePolicy(configFile);
  const passport = readJson(workspacePath(workspace.dir, ARTIFACT_PATHS.agentPassport), null);
  const { publicKeyPath } = admissionKeyPaths();
  const publicKeyPem = existsSync(publicKeyPath) ? readFileSync(publicKeyPath, "utf8") : null;

  const decision = evaluateAdmission({
    passport,
    expected: subjectDigests(workspace.dir),
    publicKeyPem,
    policy,
    subjectName: workspace.id,
  });
  decision.workspaceId = workspace.id;
  decision.stage = stage;
  decision.overridden = Boolean(force && !decision.allowed);

  if (record) {
    // The decision record is the audit trail, so its write is mandatory —
    // unlike the shadow ledger, a failure here fails the decision.
    writeWorkspaceJsonSync(workspace.dir, ARTIFACT_PATHS.admissionDecision, decision);
    mkdirSync(join(statePath("admission")), { recursive: true });
    appendFileSync(DECISION_LOG(), `${JSON.stringify(decision)}\n`, "utf8");
  }
  return decision;
}

// The enforcement rule `ge handoff` applies per workspace:
// - gate not required (audit mode, the default) → admit, decision recorded
// - gate required + decision allowed → admit
// - gate required + denied + --force → admit, override stamped in the record
// - gate required + denied → refuse
export function shouldAdmit(decision, { force = false } = {}) {
  return decision.allowed || !decision.required || Boolean(force);
}

export function admitForHandoff(id, { force = false, log = () => {}, configFile = undefined } = {}) {
  const decision = checkAdmission({ id, stage: "handoff", force, configFile });
  const admit = shouldAdmit(decision, { force });
  if (!decision.allowed) {
    const summary = decision.blockers.map((b) => `${b.code || "?"} ${b.what}`).join("; ");
    if (admit && decision.required) log(`⚠ ${id}: admission denied but overridden by --force (recorded): ${summary}`);
    else if (admit) log(`▲ ${id}: admission gate (audit mode) found blockers: ${summary}`);
    else log(`✗ ${id}: admission denied: ${summary}`);
  }
  return { admit, decision };
}
