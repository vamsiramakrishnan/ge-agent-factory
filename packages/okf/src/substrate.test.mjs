import { describe, expect, test } from "bun:test";
import { mkdtemp, writeFile, mkdir } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { readOkfBundle, renderConcept, baseConformance } from "./index.mjs";

describe("GE OKF substrate primitives", () => {
  test("unknown fields and unknown types are accepted", async () => {
    const dir = await mkdtemp(join(tmpdir(), "okf-substrate-"));
    await writeFile(join(dir, "x.md"), renderConcept({ type: "Mystery", title: "X", custom: "kept" }, "# Citations\n"));
    const bundle = await readOkfBundle(dir);
    expect(bundle.concepts[0].type).toBe("Mystery");
    expect(bundle.concepts[0].frontmatter.custom).toBe("kept");
    expect(baseConformance(bundle).ok).toBe(true);
  });
  test("missing type is a base conformance failure", async () => {
    const dir = await mkdtemp(join(tmpdir(), "okf-substrate-"));
    await writeFile(join(dir, "x.md"), renderConcept({ title: "X" }, "Body"));
    const bundle = await readOkfBundle(dir);
    expect(baseConformance(bundle).ok).toBe(false);
  });
  test("index and log are reserved, log date groups parse", async () => {
    const dir = await mkdtemp(join(tmpdir(), "okf-substrate-"));
    await writeFile(join(dir, "index.md"), "# Root\n");
    await writeFile(join(dir, "log.md"), "# 2026-07-03\n\n- init\n");
    const bundle = await readOkfBundle(dir);
    expect(bundle.concepts.length).toBe(0);
    expect(bundle.indexes.length).toBe(1);
    expect(bundle.logs[0].entries[0].date).toBe("2026-07-03");
  });
  test("absolute and relative links resolve; broken links warn only", async () => {
    const dir = await mkdtemp(join(tmpdir(), "okf-substrate-"));
    await mkdir(join(dir, "claims"), { recursive: true });
    await mkdir(join(dir, "documents"), { recursive: true });
    await writeFile(join(dir, "documents", "policy.md"), renderConcept({ type: "Document", title: "Policy" }, "Body"));
    await writeFile(join(dir, "claims", "x.md"), renderConcept({ type: "Claim", title: "X" }, "# Authority\n- [Policy](/documents/policy.md)\n- [Missing](../documents/missing.md)\n"));
    const bundle = await readOkfBundle(dir);
    const claim = bundle.concepts.find((c) => c.id === "claims/x");
    expect(claim.links.map((l) => l.target)).toEqual(["documents/policy", "documents/missing"]);
    expect(baseConformance(bundle).ok).toBe(true);
    expect(bundle.warnings.some((w) => w.code === "OKF_BROKEN_LINK")).toBe(true);
  });
});
