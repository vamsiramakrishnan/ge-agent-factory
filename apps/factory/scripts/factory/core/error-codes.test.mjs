// Unit tests for the stable-error-code registry (next-horizon B4).
//
// The load-bearing guarantee: every docsAnchor is a REAL anchor on the
// published docs site. Anchors are re-derived here from the docs/ source
// headings using the same slug rule the site's renderer applies
// (apps/docs/scripts/lib/glossary.mjs headingSlug — the stated github-slugger
// mirror the glossary auto-linker already relies on), so a heading rename that
// would 404 a deep link fails this suite instead of shipping.
import { describe, expect, test } from "bun:test";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { headingSlug } from "../../../../docs/scripts/lib/glossary.mjs";
import {
  DOCS_SITE_BASE_URL,
  ERROR_CODES,
  GENERIC_ERROR_CODE,
  docsUrlFor,
  resolveErrorCode,
} from "./error-codes.mjs";
import { FactoryCommandError, fail } from "./pipeline.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO = join(HERE, "..", "..", "..", "..", "..");
const DOCS = join(REPO, "docs");

// docs/-source file for a site page route. Mirrors ONLY the PAGE_MAP entries
// (apps/docs/scripts/sync-content.mjs) that error codes actually deep-link to,
// plus the passthrough rule for cookbooks/concepts/reference — this is test
// fixture knowledge, not a runtime constant.
const TOP_LEVEL_ROUTES = {
  operations: "OPERATIONS.md",
  "reference/mcp": "MCP.md",
  "reference/glossary": "GLOSSARY.md",
  "start/what-is-the-factory": "index.md",
  "start/developer-guide": "developers.md",
};

function docsSourceFor(route) {
  if (TOP_LEVEL_ROUTES[route]) return join(DOCS, TOP_LEVEL_ROUTES[route]);
  const [head] = route.split("/");
  if (["concepts", "cookbooks", "reference"].includes(head)) return join(DOCS, `${route}.md`);
  return null;
}

// All anchor slugs a docs page publishes: strip fenced code (same fence shape
// sync-content.mjs shelters, so a `# comment` inside a bash block never counts
// as a heading), collect ATX headings, slugify, and de-duplicate the way
// github-slugger does (second occurrence gets -1, then -2, ...).
function anchorSlugsFor(sourcePath) {
  const text = readFileSync(sourcePath, "utf8").replace(/^(```|~~~)[\s\S]*?^\1[^\n]*$/gm, "");
  const seen = new Map();
  const slugs = new Set();
  for (const m of text.matchAll(/^#{1,6}\s+(.+?)\s*$/gm)) {
    const base = headingSlug(m[1]);
    const n = seen.get(base) ?? 0;
    seen.set(base, n + 1);
    slugs.add(n === 0 ? base : `${base}-${n}`);
  }
  return slugs;
}

describe("error-code registry shape", () => {
  test("every code is well-formed GE#### with a non-empty summary and a route/#slug anchor", () => {
    const codes = Object.keys(ERROR_CODES);
    expect(codes.length).toBeGreaterThan(0);
    for (const code of codes) {
      expect(code).toMatch(/^GE\d{4}$/);
      const entry = ERROR_CODES[code];
      expect(typeof entry.summary).toBe("string");
      expect(entry.summary.length).toBeGreaterThan(0);
      expect(entry.docsAnchor).toMatch(/^[a-z0-9/-]+\/#[a-z0-9_-]+$/);
    }
  });

  test("codes are unique after normalization (no aliasing like GE01 vs GE0001)", () => {
    const numeric = Object.keys(ERROR_CODES).map((code) => Number(code.slice(2)));
    expect(new Set(numeric).size).toBe(numeric.length);
  });

  test("the generic fallback code is itself registered", () => {
    expect(ERROR_CODES[GENERIC_ERROR_CODE]).toBeDefined();
  });
});

describe("every docsAnchor resolves against the docs/ sources", () => {
  for (const [code, entry] of Object.entries(ERROR_CODES)) {
    test(`${code} → ${entry.docsAnchor}`, () => {
      const [route, slug] = entry.docsAnchor.split("/#");
      const source = docsSourceFor(route);
      expect(source).not.toBeNull();
      expect(existsSync(source)).toBe(true);
      expect(anchorSlugsFor(source)).toContain(slug);
    });
  }
});

describe("every GE#### literal in the command sources is a registered code", () => {
  // A typo'd code at a fail() site would silently render as UNCODED (the
  // boundaries only decorate codes that resolve); this scan turns that into a
  // test failure. Covers apps/factory/scripts (all fail() homes) and tools/ge
  // (the guarded() boundary).
  const roots = [join(REPO, "apps", "factory", "scripts"), join(REPO, "tools", "ge")];
  const files = roots.flatMap((root) =>
    readdirSync(root, { recursive: true })
      .map(String)
      .filter((rel) => rel.endsWith(".mjs") && !rel.includes("node_modules") && !rel.endsWith(".test.mjs"))
      .map((rel) => join(root, rel)),
  );

  test("scanned a meaningful number of source files", () => {
    expect(files.length).toBeGreaterThan(10);
  });

  test("all referenced codes resolve", () => {
    const unknown = [];
    for (const file of files) {
      const text = readFileSync(file, "utf8");
      for (const m of text.matchAll(/"(GE\d{4})"/g)) {
        if (!Object.hasOwn(ERROR_CODES, m[1])) unknown.push(`${file}: ${m[1]}`);
      }
    }
    expect(unknown).toEqual([]);
  });
});

describe("resolveErrorCode / docsUrlFor", () => {
  test("a FactoryCommandError minted by fail(msg, code) resolves to its code", () => {
    let thrown;
    try {
      fail("No manifest. Run 'factory generate' first.", "GE0003");
    } catch (e) {
      thrown = e;
    }
    expect(thrown).toBeInstanceOf(FactoryCommandError);
    expect(resolveErrorCode(thrown)).toBe("GE0003");
  });

  test("a 1-arg fail() stays backward compatible: no code attached, resolves to null", () => {
    let thrown;
    try {
      fail("plain failure");
    } catch (e) {
      thrown = e;
    }
    expect(thrown).toBeInstanceOf(FactoryCommandError);
    expect(thrown.message).toBe("plain failure");
    expect(thrown.code).toBeNull();
    expect(resolveErrorCode(thrown)).toBeNull();
  });

  test("Node system error codes (e.g. ENOENT) never resolve", () => {
    const e = new Error("ENOENT: no such file");
    e.code = "ENOENT";
    expect(resolveErrorCode(e)).toBeNull();
  });

  test("unknown GE codes and non-error values resolve to null", () => {
    const e = new Error("boom");
    e.code = "GE9999";
    expect(resolveErrorCode(e)).toBeNull();
    expect(resolveErrorCode(null)).toBeNull();
    expect(resolveErrorCode("string")).toBeNull();
  });

  test("docsUrlFor joins the site base with the anchor for known codes, null otherwise", () => {
    expect(docsUrlFor("GE0003")).toBe(`${DOCS_SITE_BASE_URL}${ERROR_CODES.GE0003.docsAnchor}`);
    expect(docsUrlFor("GE9999")).toBeNull();
  });
});
