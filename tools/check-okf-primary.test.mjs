import { expect, test } from "bun:test";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { checkOkfPrimary, formatOkfPrimaryReport } from "./check-okf-primary.mjs";

// Synthetic repo roots: a tracked registry + okf/ bundles + interview specs,
// planted precisely so each finding kind can be asserted in isolation.

const BUNDLE_INDEX = [
  "---",
  'okf_version: "0.1"',
  "type: Knowledge Bundle",
  "title: Alpha",
  "provenance_origin: deck",
  "provenance_status: registered",
  "---",
  "",
  "# Alpha",
  "",
].join("\n");

function writeRegistry(root, ids) {
  const file = join(root, "apps", "factory", "src", "agent-spec-registry.generated.json");
  mkdirSync(join(root, "apps", "factory", "src"), { recursive: true });
  writeFileSync(file, JSON.stringify({ kind: "ge.agent_spec.registry", entries: ids.map((id) => ({ id })) }, null, 2));
}

function writeBundle(root, id, { index = BUNDLE_INDEX, specId = id, spec = true } = {}) {
  const dir = join(root, "okf", id);
  mkdirSync(dir, { recursive: true });
  if (index !== null) writeFileSync(join(dir, "index.md"), index);
  if (spec) writeFileSync(join(dir, "spec.json"), `${JSON.stringify({ id: specId, title: id }, null, 2)}\n`);
}

function withRoot(fn) {
  const root = mkdtempSync(join(tmpdir(), "check-okf-primary-test-"));
  try {
    return fn(root);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

test("registry entries with matching bundles pass", () => {
  withRoot((root) => {
    writeRegistry(root, ["alpha", "beta"]);
    writeBundle(root, "alpha");
    writeBundle(root, "beta");
    const result = checkOkfPrimary({ root });
    expect(result.findings).toEqual([]);
    expect(result.ok).toBe(true);
    expect(formatOkfPrimaryReport(result)).toContain("2 registry entries ↔ 2 corpus bundles");
  });
});

test("a catalog entry without a bundle fails with the migrate fix hint", () => {
  withRoot((root) => {
    writeRegistry(root, ["alpha", "orphan-entry"]);
    writeBundle(root, "alpha");
    const result = checkOkfPrimary({ root });
    expect(result.ok).toBe(false);
    expect(result.findings.map((f) => f.kind)).toEqual(["entry-without-bundle"]);
    expect(formatOkfPrimaryReport(result)).toContain("author the bundle or run: bun run catalog:migrate");
  });
});

test("a bundle without a catalog entry fails with the rebuild hint", () => {
  withRoot((root) => {
    writeRegistry(root, ["alpha"]);
    writeBundle(root, "alpha");
    writeBundle(root, "stray-bundle");
    const result = checkOkfPrimary({ root });
    expect(result.ok).toBe(false);
    expect(result.findings.map((f) => f.kind)).toEqual(["bundle-without-entry"]);
    expect(formatOkfPrimaryReport(result)).toContain("bun run catalog");
  });
});

test("a bundle missing okf_version/provenance frontmatter or spec.json is incomplete", () => {
  withRoot((root) => {
    writeRegistry(root, ["alpha", "beta"]);
    writeBundle(root, "alpha", { index: "---\ntype: Knowledge Bundle\ntitle: Alpha\n---\n# Alpha\n" });
    writeBundle(root, "beta", { spec: false });
    const result = checkOkfPrimary({ root });
    expect(result.ok).toBe(false);
    const kinds = result.findings.map((f) => f.kind);
    expect(kinds.every((kind) => kind === "bundle-incomplete")).toBe(true);
    expect(result.findings.some((f) => f.detail.includes("okf_version"))).toBe(true);
    expect(result.findings.some((f) => f.detail.includes("provenance"))).toBe(true);
    expect(result.findings.some((f) => f.detail.includes("spec.json is missing"))).toBe(true);
  });
});

test("a spec.json id that disagrees with the directory name is flagged", () => {
  withRoot((root) => {
    writeRegistry(root, ["alpha"]);
    writeBundle(root, "alpha", { specId: "not-alpha" });
    const result = checkOkfPrimary({ root });
    expect(result.ok).toBe(false);
    expect(result.findings[0].detail).toContain('declares id "not-alpha"');
  });
});

test("an interview spec without a bundle is caught (cannot silently drop out)", () => {
  withRoot((root) => {
    writeRegistry(root, ["alpha"]);
    writeBundle(root, "alpha");
    const interviews = join(root, "apps", "factory", "catalog", "interview-specs");
    mkdirSync(interviews, { recursive: true });
    writeFileSync(join(interviews, "gamma.json"), `${JSON.stringify({ id: "gamma", title: "Gamma" }, null, 2)}\n`);
    const result = checkOkfPrimary({ root });
    expect(result.ok).toBe(false);
    expect(result.findings.map((f) => f.kind)).toEqual(["interview-without-bundle"]);
  });
});

test("a missing corpus directory is a single loud finding", () => {
  withRoot((root) => {
    writeRegistry(root, ["alpha"]);
    const result = checkOkfPrimary({ root });
    expect(result.ok).toBe(false);
    expect(result.findings.map((f) => f.kind)).toEqual(["missing-corpus"]);
  });
});
