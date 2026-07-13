// The /llms.txt + /llms-full.txt endpoints (src/pages/*.txt.js).
//
// Two layers:
//   1. unit tests over the pure logic in src/lib/llms.mjs (no Astro needed)
//   2. build tests over dist/llms.txt + dist/llms-full.txt — if the site
//      hasn't been built yet in this checkout, the test runs the real
//      `bun run build` (sync + astro build, ~30s) once and asserts on the
//      artifacts it produces, so the endpoints are exercised end to end.
import { expect, test } from "bun:test";
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  buildLlmsFullTxt,
  buildLlmsTxt,
  firstProseSentence,
  orderPages,
  plainifyMdx,
  sectionLabelOf,
  siteRootFrom,
  urlFor,
} from "../src/lib/llms.mjs";

const APP = join(dirname(fileURLToPath(import.meta.url)), "..");
const DIST = join(APP, "dist");

// ── unit: plainifyMdx ───────────────────────────────────────────────────────

test("plainifyMdx strips imports, glossary anchors, and MDX escapes", () => {
  const body = [
    "import { Steps } from '@astrojs/starlight/components';",
    "",
    'The <a href="/ge-agent-factory/reference/glossary/#harness" title="The refinement loop.">harness</a> loop',
    "uses \\{placeholders} and &lt;useCaseId> tokens.",
    "",
    "<Steps>",
    "",
    "1. **Run it.**",
    "",
    "</Steps>",
    "",
    ":::tip[Every surface is scriptable]",
    "Pass `--json` anywhere.",
    ":::",
  ].join("\n");
  const plain = plainifyMdx(body);
  expect(plain).not.toContain("import {");
  expect(plain).not.toContain("<a ");
  expect(plain).not.toContain("title=");
  expect(plain).not.toContain("<Steps>");
  expect(plain).not.toContain(":::");
  expect(plain).toContain("The harness loop");
  expect(plain).toContain("uses {placeholders} and <useCaseId> tokens.");
  expect(plain).toContain("**Every surface is scriptable:**");
  expect(plain).toContain("Pass `--json` anywhere.");
});

test("plainifyMdx leaves fenced code untouched and can absolutize page links", () => {
  const fence = "```bash\nimport nothing  # keep: <a title=\"x\"> and \\{ inside fences\n```";
  const body = `See [the line](/ge-agent-factory/concepts/the-factory-line/).\n\n${fence}\n`;
  const plain = plainifyMdx(body, {
    base: "/ge-agent-factory",
    siteRoot: "https://example.test/ge-agent-factory",
  });
  expect(plain).toContain(fence);
  expect(plain).toContain("[the line](https://example.test/ge-agent-factory/concepts/the-factory-line/)");
});

test("plainifyMdx converts html anchors and images to markdown", () => {
  const plain = plainifyMdx('<p align="center">\n  <img src="/x/y.svg" alt="the diagram" width="900" />\n</p>\n\nAnd <a href="https://example.test/">a link</a>.\n');
  expect(plain).toContain("![the diagram](/x/y.svg)");
  expect(plain).toContain("[a link](https://example.test/)");
  expect(plain).not.toContain("<p");
  expect(plain).not.toContain("</p>");
});

// ── unit: ordering + index shape ────────────────────────────────────────────

test("orderPages is deterministic: sidebar section, then order, then slug", () => {
  const pages = [
    { id: "reference/cli", data: { sidebar: {} } },
    { id: "console/readiness", data: { sidebar: {} } },
    { id: "catalog-verticals", data: { sidebar: {} } },
    { id: "concepts/index", data: { sidebar: { order: 0 } } },
    { id: "operations", data: { sidebar: { order: 6 } } },
    { id: "index", data: {} },
    { id: "catalog", data: { sidebar: {} } },
    { id: "reference/architecture", data: { sidebar: {} } },
    { id: "start/quickstart", data: { sidebar: { order: 2 } } },
    { id: "concepts/specs-and-okf", data: { sidebar: { order: 2 } } },
  ];
  const ids = orderPages(pages).map((p) => p.id);
  expect(ids).toEqual([
    "index",
    "start/quickstart",
    "catalog",
    "catalog-verticals",
    "concepts/index",
    "concepts/specs-and-okf",
    "console/readiness",
    "operations",
    "reference/architecture",
    "reference/cli",
  ]);
  expect(sectionLabelOf("index")).toBe("Start Here");
  expect(sectionLabelOf("catalog-verticals")).toBe("Agent catalog");
  expect(sectionLabelOf("operations")).toBe("Operations");
});

test("buildLlmsTxt renders title, blockquote description, and grouped links", () => {
  const siteRoot = siteRootFrom("https://example.test/", "/base/");
  expect(siteRoot).toBe("https://example.test/base");
  expect(urlFor("index", siteRoot)).toBe("https://example.test/base/");
  const text = buildLlmsTxt({
    title: "T",
    description: "D.",
    siteRoot,
    pages: [
      { id: "start/quickstart", title: "Quickstart", description: "Go." },
      { id: "reference/cli", title: "CLI", description: "" },
    ],
  });
  expect(text.startsWith("# T\n\n> D.\n")).toBe(true);
  expect(text).toContain("## Start Here");
  expect(text).toContain("- [Quickstart](https://example.test/base/start/quickstart/): Go.");
  expect(text).toContain("## Reference");
  expect(text).toContain("- [CLI](https://example.test/base/reference/cli/)");
  expect(text).toContain("llms-full.txt");
});

test("LLM exports group each section once and state the web-only catalog scope", () => {
  const siteRoot = "https://example.test/base";
  const pages = [
    { id: "console/readiness", title: "Readiness", description: "Check." },
    { id: "catalog", title: "Horizontal", description: "Shared." },
    { id: "console/index", title: "Console", description: "Operate." },
    { id: "catalog-verticals", title: "Vertical", description: "Industry." },
  ];
  const text = buildLlmsTxt({
    title: "T",
    description: "D.",
    siteRoot,
    pages,
    catalogScope: { detailPageCount: 513 },
  });
  expect(text.match(/^## Agent catalog$/gm)).toHaveLength(1);
  expect(text.match(/^## Console$/gm)).toHaveLength(1);
  expect(text).toContain("513 generated agent detail pages");
  expect(text).toContain("[Catalog explorer](https://example.test/base/catalog/explorer/)");

  const full = buildLlmsFullTxt({
    title: "T",
    description: "D.",
    siteRoot,
    pages: pages.map((page) => ({ ...page, plain: `${page.title} body.` })),
    catalogScope: { detailPageCount: 513 },
  });
  expect(full).toContain("Catalog scope:");
  expect(full).toContain("513 generated agent detail pages");
});

test("firstProseSentence skips non-prose and flattens links", () => {
  const plain = "## Heading\n\n![img](/x.svg)\n\nSee [the line](/b/c/) for what each stage produces. More text.\n";
  expect(firstProseSentence(plain)).toBe("See the line for what each stage produces.");
});

// ── build: the dist artifacts ───────────────────────────────────────────────

function ensureBuilt() {
  if (existsSync(join(DIST, "llms.txt")) && existsSync(join(DIST, "llms-full.txt"))) return;
  execFileSync("bun", ["run", "build"], { cwd: APP, stdio: "pipe", timeout: 240_000 });
}

test(
  "astro build emits dist/llms.txt indexing every published page",
  () => {
    ensureBuilt();
    const text = readFileSync(join(DIST, "llms.txt"), "utf8");
    expect(text.startsWith("# GE Agent Factory\n\n> ")).toBe(true);
    const links = text.match(/^- \[[^\]]+\]\(https:\/\/vamsiramakrishnan\.github\.io\/ge-agent-factory\/[^)]*\)/gm) ?? [];
    expect(links.length).toBeGreaterThanOrEqual(30);
    for (const section of ["## Start Here", "## Agent catalog", "## Core Concepts", "## Guides", "## Operations", "## Reference"]) {
      expect(text).toContain(section);
    }
    expect(text.match(/^## Console$/gm)).toHaveLength(1);
    expect(text).toContain("513 generated agent detail pages");
  },
  300_000,
);

test(
  "astro build emits dist/llms-full.txt as plain markdown of the whole site",
  () => {
    ensureBuilt();
    const text = readFileSync(join(DIST, "llms-full.txt"), "utf8");
    // A known heading from docs/OPERATIONS.md survives the round trip …
    expect(text).toContain("## Stage graph (per agent)");
    // … while the MDX build details do not.
    expect(text).not.toMatch(/^import .* from ['"]/m);
    expect(text).not.toMatch(/<a [^>]*title=/);
    expect(text).toContain("URL: https://vamsiramakrishnan.github.io/ge-agent-factory/operations/");
  },
  300_000,
);
