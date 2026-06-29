import { mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { expect, test } from "bun:test";
import { readJson, writeJson, updateJson } from "./json-io.mjs";

function tempDir(name) {
  return mkdtempSync(join(tmpdir(), `ge-json-io-${name}-`));
}

test("readJson returns fallback for missing files", () => {
  expect(readJson(join(tmpdir(), "ge-json-io-missing.json"), { ok: false })).toEqual({ ok: false });
});

test("readJson returns fallback for invalid JSON", () => {
  const dir = tempDir("invalid");
  try {
    const path = join(dir, "bad.json");
    writeFileSync(path, "{ broken json", "utf8");

    expect(readJson(path, ["fallback"])).toEqual(["fallback"]);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("writeJson creates parent directories and formats JSON", () => {
  const dir = tempDir("write");
  try {
    const path = join(dir, "deep", "nested", "file.json");
    writeJson(path, { ok: true });

    expect(readFileSync(path, "utf8")).toBe('{\n  "ok": true\n}\n');
    expect(readJson(path)).toEqual({ ok: true });
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("writeJson writes atomically and leaves no temp/lock artifacts", () => {
  const dir = tempDir("atomic");
  try {
    const path = join(dir, "state.json");
    writeJson(path, { a: 1 });
    writeJson(path, { a: 2 });

    expect(readdirSync(dir).sort()).toEqual(["state.json"]);
    expect(readJson(path)).toEqual({ a: 2 });
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("writeJson honors an explicit file mode", () => {
  const dir = tempDir("mode");
  try {
    const path = join(dir, "secret.json");
    writeJson(path, { token: "x" }, { mode: 0o600 });
    const { statSync } = require("node:fs");
    expect(statSync(path).mode & 0o777).toBe(0o600);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("updateJson applies a transform and persists the result", async () => {
  const dir = tempDir("update");
  try {
    const path = join(dir, "state.json");
    writeJson(path, { n: 1 });
    const next = await updateJson(path, (cur) => ({ n: cur.n + 1 }));

    expect(next).toEqual({ n: 2 });
    expect(readJson(path)).toEqual({ n: 2 });
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("updateJson uses the fallback when the file is missing", async () => {
  const dir = tempDir("update-missing");
  try {
    const path = join(dir, "missing.json");
    const next = await updateJson(path, (cur) => ({ items: [...cur.items, "x"] }), { fallback: { items: [] } });

    expect(next).toEqual({ items: ["x"] });
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("updateJson serializes concurrent read-modify-write without lost updates", async () => {
  const dir = tempDir("concurrent");
  try {
    const path = join(dir, "counter.json");
    await Promise.all(
      Array.from({ length: 25 }, () =>
        updateJson(path, (cur) => ({ n: (cur?.n || 0) + 1 }), { fallback: { n: 0 } })),
    );

    expect(readJson(path)).toEqual({ n: 25 });
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
