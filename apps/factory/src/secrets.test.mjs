import { mkdtempSync, rmSync, existsSync, readdirSync, statSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { randomBytes } from "node:crypto";
import { expect, test } from "bun:test";
import { upsertSecret, readSecretsEnv } from "./secrets.js";

function tmp() {
  return mkdtempSync(join(tmpdir(), "ge-secrets-"));
}

function withEnv(values, fn) {
  const prev = {};
  for (const [k, v] of Object.entries(values)) {
    prev[k] = process.env[k];
    if (v === undefined) delete process.env[k];
    else process.env[k] = v;
  }
  return Promise.resolve()
    .then(fn)
    .finally(() => {
      for (const [k, v] of Object.entries(prev)) {
        if (v === undefined) delete process.env[k];
        else process.env[k] = v;
      }
    });
}

test("round-trips a secret with an external key and never co-locates a key file", async () => {
  const dir = tmp();
  await withEnv({ GE_SECRETS_KEY: randomBytes(32).toString("base64"), GE_SECRETS_KEY_FILE: undefined }, async () => {
    await upsertSecret(dir, { name: "API_TOKEN", value: "s3cr3t" });
    const env = await readSecretsEnv(dir, ["API_TOKEN"]);
    expect(env.API_TOKEN).toBe("s3cr3t");
    expect(existsSync(join(dir, "secrets.key"))).toBe(false);
  });
  rmSync(dir, { recursive: true, force: true });
});

test("writes the store atomically (no temp/lock artifacts) with 0600 perms", async () => {
  const dir = tmp();
  await withEnv({ GE_SECRETS_KEY: randomBytes(32).toString("base64"), GE_SECRETS_KEY_FILE: undefined }, async () => {
    await upsertSecret(dir, { name: "FOO", value: "bar" });
    const hidden = readdirSync(dir).filter((f) => f.startsWith("."));
    expect(hidden).toEqual([]);
    expect(statSync(join(dir, "secrets.json")).mode & 0o777).toBe(0o600);
  });
  rmSync(dir, { recursive: true, force: true });
});

test("rejects an external key that is not 32 bytes", async () => {
  const dir = tmp();
  await withEnv({ GE_SECRETS_KEY: Buffer.from("too-short").toString("base64"), GE_SECRETS_KEY_FILE: undefined }, async () => {
    await expect(upsertSecret(dir, { name: "FOO", value: "bar" })).rejects.toThrow(/32 bytes/i);
  });
  rmSync(dir, { recursive: true, force: true });
});

test("co-located key fallback still works when no external key is configured", async () => {
  const dir = tmp();
  await withEnv({ GE_SECRETS_KEY: undefined, GE_SECRETS_KEY_FILE: undefined }, async () => {
    await upsertSecret(dir, { name: "FOO", value: "bar" });
    expect(existsSync(join(dir, "secrets.key"))).toBe(true);
    expect((await readSecretsEnv(dir, ["FOO"])).FOO).toBe("bar");
  });
  rmSync(dir, { recursive: true, force: true });
});
