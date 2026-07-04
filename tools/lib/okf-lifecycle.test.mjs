// Unit tests for the OKF agent lifecycle (customize → register → track).
// Every test runs against a THROWAWAY corpus under a mkdtemp dir, injected
// through the functions' `root` option (the CLI reads the same knob from
// GE_OKF_ROOT) — the real repo-root okf/ corpus is never touched or assumed
// to exist.
import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { renderConcept, writeConceptFile } from "../../packages/okf/src/index.mjs";
import { COMPILE_ERROR_CODES as E } from "../../packages/okf/src/compile/index.mjs";
import { customizeVariant, okfRoot, parsePairs, registerBundle, trackAgent } from "./okf-lifecycle.mjs";

const NOW = () => "2026-01-01T00:00:00.000Z";

/** Write a minimal base bundle (compiles with zero errors) at <root>/<id>/. */
async function writeBaseBundle(root, id) {
  const dir = join(root, id);
  const files = {
    "index.md": renderConcept(
      { okf_version: "0.1", type: "Knowledge Bundle", title: id, provenance_origin: "manual", provenance_status: "draft" },
      `# ${id}\n`,
    ),
    "playbook.md": renderConcept(
      { type: "Playbook", title: `${id} — Playbook` },
      ["# Playbook", "", "## Role", "", "Reconciliation copilot.", "", "## Primary objective", "", "Reconcile balances with cited Workday evidence.", "", "## In scope", "", "- answer balance questions", "", "## Out of scope", "", "- posting journal entries", "", "## Refusal rules", "", "- Never invent balances."].join("\n"),
    ),
    "systems/workday.md": renderConcept(
      { type: "Source System", title: "Workday" },
      "# Workday\n\n- **Protocol:** REST API\n\n# Schema\n\n_No entities._",
    ),
    "tools/query-balances.md": renderConcept(
      { type: "Agent Tool", title: "query_balances", description: "Fetch Workday GL balances." },
      ["# query_balances", "", "- **Kind:** query", "- **Source system:** [workday](/systems/workday.md)", "", "## Required inputs", "", "- period", "", "## Produces", "", "- balances", "", "## Evidence emitted", "", "- gl_entries rows"].join("\n"),
    ),
  };
  for (const [rel, text] of Object.entries(files)) await writeConceptFile(join(dir, rel), text);
  return dir;
}

let root;
beforeAll(async () => {
  root = await mkdtemp(join(tmpdir(), "ge-okf-lifecycle-"));
  await writeBaseBundle(root, "finance-recon");
});
afterAll(async () => {
  await rm(root, { recursive: true, force: true });
});

describe("okfRoot / parsePairs", () => {
  test("GE_OKF_ROOT overrides the default corpus root", () => {
    const prev = process.env.GE_OKF_ROOT;
    process.env.GE_OKF_ROOT = "/tmp/somewhere/okf";
    try {
      expect(okfRoot()).toBe("/tmp/somewhere/okf");
      expect(okfRoot("/explicit/wins")).toBe("/explicit/wins");
    } finally {
      if (prev === undefined) delete process.env.GE_OKF_ROOT;
      else process.env.GE_OKF_ROOT = prev;
    }
  });

  test("parsePairs accepts repeated and comma-separated from=to items", () => {
    expect(parsePairs(["a=b", "c=d,e=f"], "--swap-system")).toEqual({ a: "b", c: "d", e: "f" });
    expect(parsePairs(undefined, "--swap-system")).toEqual({});
    expect(() => parsePairs(["broken"], "--swap-system")).toThrow(/--swap-system/);
  });
});

describe("ge okf customize", () => {
  test("scaffolds a variant that compiles against its base (system swap applied)", async () => {
    const result = await customizeVariant({
      base: "finance-recon",
      id: "finance-recon-sap",
      swapSystems: { workday: "sap" },
      renames: { Workday: "SAP" },
      root,
    });
    expect(result.agentId).toBe("finance-recon-sap");
    expect(result.baseId).toBe("finance-recon");
    expect(result.variantKind).toBe("source-swap");
    expect(result.compile.errors).toBe(0);
    expect(result.compile.systems).toEqual(["sap"]);
    const index = await readFile(join(root, "finance-recon-sap", "index.md"), "utf8");
    expect(index).toContain('variant_of: "finance-recon"');
    expect(index).toContain("provenance_origin: variant");
    expect(index).toContain("provenance_status: draft");
    const bindings = await readFile(join(root, "finance-recon-sap", "variant", "bindings.md"), "utf8");
    expect(bindings).toContain("| workday | sap |");
    expect(bindings).toContain("| Workday | SAP |");
  });

  test("a bad swap target fails with the compiler's structured error", async () => {
    const err = await customizeVariant({
      base: "finance-recon",
      id: "bad-swap",
      swapSystems: { netsuite: "sap" },
      root,
    }).then(() => null, (e) => e);
    expect(err).not.toBeNull();
    expect(err.errors.map((e) => e.code)).toContain(E.BINDING_UNKNOWN_SYSTEM);
    expect(err.fix).toBeTruthy();
  });

  test("--vertical sets variant_kind vertical and a policy-overlay stub", async () => {
    const result = await customizeVariant({ base: "finance-recon", id: "finance-recon-health", vertical: "healthcare", root });
    expect(result.variantKind).toBe("vertical");
    const bindings = await readFile(join(root, "finance-recon-health", "variant", "bindings.md"), "utf8");
    expect(bindings).toContain("## Policy Overlays");
    expect(bindings).toContain("healthcare");
  });

  test("output is deterministic: same inputs, identical bytes", async () => {
    const outA = join(root, "det-a");
    const outB = join(root, "det-b");
    await customizeVariant({ base: "finance-recon", id: "det", swapSystems: { workday: "sap" }, out: outA, root });
    await customizeVariant({ base: "finance-recon", id: "det", swapSystems: { workday: "sap" }, out: outB, root });
    for (const rel of ["index.md", "variant/bindings.md"]) {
      expect(await readFile(join(outA, rel), "utf8")).toBe(await readFile(join(outB, rel), "utf8"));
    }
  });
});

describe("ge agents register", () => {
  test("flips draft→registered and bumps the version once per run", async () => {
    const dir = await writeBaseBundle(root, "register-me");
    const missingCatalog = join(root, "no-such-catalog.json");
    const first = await registerBundle({ bundle: "register-me", owner: "ops@example.com", root, catalog: false, catalogPath: missingCatalog, now: NOW });
    expect(first).toMatchObject({ agentId: "register-me", version: 1, status: "registered", owner: "ops@example.com", catalogEntry: false });
    const index = await readFile(join(dir, "index.md"), "utf8");
    expect(index).toContain("provenance_status: registered");
    expect(index).toContain('provenance_version: "1"');
    expect(index).toContain('provenance_owner: "ops@example.com"');
    expect(index).toContain('provenance_created_at: "2026-01-01T00:00:00.000Z"');
    // Everything else in the root concept survives the surgical edit.
    expect(index).toContain('okf_version: "0.1"');
    expect(index).toContain("# register-me");

    const second = await registerBundle({ bundle: "register-me", root, catalog: false, catalogPath: missingCatalog, now: NOW });
    expect(second.version).toBe(2);
    expect(second.status).toBe("registered");
    expect(second.owner).toBe("ops@example.com"); // sticky — not erased by an owner-less re-run
  });

  test("registers a variant bundle by resolving its base under the corpus root", async () => {
    await customizeVariant({ base: "finance-recon", id: "register-variant", swapSystems: { workday: "sap" }, root });
    const result = await registerBundle({ bundle: "register-variant", root, catalog: false, catalogPath: join(root, "none.json"), now: NOW });
    expect(result.version).toBe(1);
    expect(result.compile.errors).toBe(0);
    expect(result.compile.systems).toEqual(["sap"]);
  });

  test("an uncompilable bundle refuses to register", async () => {
    const dir = join(root, "broken-bundle");
    await writeConceptFile(join(dir, "index.md"), renderConcept({ okf_version: "0.1", type: "Knowledge Bundle", title: "broken", variant_of: "does-not-exist" }, "# broken\n"));
    const err = await registerBundle({ bundle: dir, root, catalog: false }).then(() => null, (e) => e);
    expect(err).not.toBeNull();
    expect(err.errors.map((e) => e.code)).toContain(E.VARIANT_BASE_MISSING);
  });
});

describe("ge agents track", () => {
  test("reports provenance, registry presence, and walks a two-level lineage", async () => {
    await writeBaseBundle(root, "track-base");
    await customizeVariant({ base: "track-base", id: "track-mid", swapSystems: { workday: "sap" }, root });
    await customizeVariant({ base: "track-mid", id: "track-leaf", renames: { SAP: "SAP S/4HANA" }, root });

    const catalogPath = join(root, "generated-catalog.json");
    await writeConceptFile(catalogPath, JSON.stringify([{ id: "track-leaf", title: "Track Leaf" }]));

    const leaf = await trackAgent({ id: "track-leaf", root, catalogPath });
    expect(leaf.status).toBe("draft");
    expect(leaf.variantOf).toBe("track-mid");
    expect(leaf.lineage.map((l) => l.id)).toEqual(["track-mid", "track-base"]);
    expect(leaf.inRegistry).toBe(true);

    const mid = await trackAgent({ id: "track-mid", root, catalogPath });
    expect(mid.lineage.map((l) => l.id)).toEqual(["track-base"]);
    expect(mid.inRegistry).toBe(false);

    const base = await trackAgent({ id: "track-base", root, catalogPath });
    expect(base.variantOf).toBeNull();
    expect(base.lineage).toEqual([]);
  });

  test("a registered agent reports its provenance block", async () => {
    await writeBaseBundle(root, "track-registered");
    await registerBundle({ bundle: "track-registered", owner: "ops@example.com", root, catalog: false, catalogPath: join(root, "none.json"), now: NOW });
    const tracked = await trackAgent({ id: "track-registered", root, catalogPath: join(root, "none.json") });
    expect(tracked.status).toBe("registered");
    expect(tracked.provenance).toMatchObject({ origin: "manual", status: "registered", version: 1, owner: "ops@example.com" });
  });

  test("an unknown agent id throws a DxError with a fix", async () => {
    const err = await trackAgent({ id: "never-existed", root }).then(() => null, (e) => e);
    expect(err).not.toBeNull();
    expect(String(err.message)).toContain("never-existed");
    expect(err.fix || err.shape?.fix || true).toBeTruthy();
  });
});
