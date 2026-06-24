import { randomBytes, createCipheriv, createDecipheriv, createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { writeJson } from "../../../tools/lib/json-io.mjs";

const SECRET_NAME_RE = /^[A-Z][A-Z0-9_]{1,63}$/;

let warnedColocatedKey = false;

// Resolve the AES-256 key. Prefer an externally-held key (GE_SECRETS_KEY base64,
// or GE_SECRETS_KEY_FILE) so the key never sits next to the ciphertext. Only when
// neither is set do we fall back to a co-located key file — and warn that this is
// obfuscation, not protection, since anyone who can read the directory gets both.
async function ensureKey(dataRoot) {
  if (process.env.GE_SECRETS_KEY) {
    const key = Buffer.from(process.env.GE_SECRETS_KEY, "base64");
    if (key.length !== 32) throw new Error("GE_SECRETS_KEY must decode to exactly 32 bytes (base64-encoded)");
    return key;
  }
  if (process.env.GE_SECRETS_KEY_FILE) {
    const key = await readFile(process.env.GE_SECRETS_KEY_FILE);
    if (key.length !== 32) throw new Error(`GE_SECRETS_KEY_FILE (${process.env.GE_SECRETS_KEY_FILE}) must contain exactly 32 bytes`);
    return key;
  }
  if (!warnedColocatedKey) {
    warnedColocatedKey = true;
    console.warn(
      `[secrets] Encryption key is co-located with the encrypted store under ${dataRoot}. ` +
        `This is obfuscation, not protection: anyone who can read the directory can decrypt. ` +
        `Set GE_SECRETS_KEY (base64, 32 bytes) or GE_SECRETS_KEY_FILE to hold the key elsewhere.`,
    );
  }
  const keyPath = join(dataRoot, "secrets.key");
  if (existsSync(keyPath)) return readFile(keyPath);
  await mkdir(dirname(keyPath), { recursive: true });
  const key = randomBytes(32);
  await writeFile(keyPath, key, { mode: 0o600 });
  return key;
}

async function readStore(dataRoot) {
  const path = join(dataRoot, "secrets.json");
  try {
    return JSON.parse(await readFile(path, "utf8"));
  } catch (error) {
    if (error?.code === "ENOENT") return { secrets: {} };
    // Surface corruption instead of silently returning an empty store (which
    // would wipe every secret on the next write).
    throw new Error(`secrets store at ${path} is unreadable: ${error.message}`);
  }
}

function writeStore(dataRoot, store) {
  // Atomic (temp+fsync+rename) write with owner-only perms.
  writeJson(join(dataRoot, "secrets.json"), store, { mode: 0o600 });
}

function validateSecretName(name) {
  const value = String(name || "").trim().toUpperCase();
  if (!SECRET_NAME_RE.test(value)) throw new Error("invalid secret name");
  return value;
}

function encrypt(key, value) {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key, iv);
  const ciphertext = Buffer.concat([cipher.update(String(value), "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return {
    alg: "aes-256-gcm",
    iv: iv.toString("base64"),
    tag: tag.toString("base64"),
    ciphertext: ciphertext.toString("base64"),
  };
}

function decrypt(key, record) {
  const decipher = createDecipheriv("aes-256-gcm", key, Buffer.from(record.iv, "base64"));
  decipher.setAuthTag(Buffer.from(record.tag, "base64"));
  return Buffer.concat([
    decipher.update(Buffer.from(record.ciphertext, "base64")),
    decipher.final(),
  ]).toString("utf8");
}

function mask(value) {
  if (!value) return "";
  const digest = createHash("sha256").update(String(value)).digest("hex").slice(0, 8);
  return `sha256:${digest}`;
}

export async function listSecrets(dataRoot) {
  const store = await readStore(dataRoot);
  return Object.entries(store.secrets || {}).map(([name, record]) => ({
    name,
    scope: record.scope || "workspace",
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
    valueHash: record.valueHash || null,
  })).sort((a, b) => a.name.localeCompare(b.name));
}

export async function upsertSecret(dataRoot, { name, value, scope = "workspace" }) {
  const secretName = validateSecretName(name);
  if (typeof value !== "string" || value.length === 0) throw new Error("secret value required");
  const key = await ensureKey(dataRoot);
  const store = await readStore(dataRoot);
  const now = new Date().toISOString();
  const existing = store.secrets?.[secretName];
  store.secrets = {
    ...(store.secrets || {}),
    [secretName]: {
      ...encrypt(key, value),
      scope: String(scope || "workspace"),
      valueHash: mask(value),
      createdAt: existing?.createdAt || now,
      updatedAt: now,
    },
  };
  await writeStore(dataRoot, store);
  return (await listSecrets(dataRoot)).find((item) => item.name === secretName);
}

export async function deleteSecret(dataRoot, name) {
  const secretName = validateSecretName(name);
  const store = await readStore(dataRoot);
  delete store.secrets?.[secretName];
  await writeStore(dataRoot, store);
}

export async function readSecretsEnv(dataRoot, names = []) {
  const uniqueNames = [...new Set((Array.isArray(names) ? names : []).map(validateSecretName))];
  if (uniqueNames.length === 0) return {};
  const key = await ensureKey(dataRoot);
  const store = await readStore(dataRoot);
  const env = {};
  for (const name of uniqueNames) {
    const record = store.secrets?.[name];
    if (!record) continue;
    env[name] = decrypt(key, record);
  }
  return env;
}
