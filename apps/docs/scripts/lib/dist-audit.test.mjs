import { afterEach, expect, test } from "bun:test";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { auditDist } from "./dist-audit.mjs";

const roots = [];

async function fixture(files) {
  const root = await mkdtemp(join(tmpdir(), "ge-docs-dist-"));
  roots.push(root);
  for (const [rel, content] of Object.entries(files)) {
    const file = join(root, rel);
    await mkdir(join(file, ".."), { recursive: true });
    await writeFile(file, content, "utf8");
  }
  return root;
}

afterEach(async () => {
  await Promise.all(roots.splice(0).map((root) => rm(root, { recursive: true, force: true })));
});

test("audits base-relative and page-relative links, assets, and fragments", async () => {
  const dist = await fixture({
    "index.html": '<a href="/ge-agent-factory/guide/#step-one">Guide</a><img src="/ge-agent-factory/a.png">',
    "guide/index.html": '<h2 id="step-one">Step one</h2><a href="../">Home</a>',
    "a.png": "png",
  });
  const result = auditDist({ dist, base: "/ge-agent-factory" });
  expect(result.ok).toBe(true);
  expect(result.pages).toBe(2);
  expect(result.references).toBe(3);
});

test("reports missing targets, missing fragments, paths outside the base, and duplicate IDs", async () => {
  const dist = await fixture({
    "index.html": [
      '<div id="same"></div><div id="same"></div>',
      '<a href="/ge-agent-factory/missing/">Missing</a>',
      '<a href="/ge-agent-factory/guide/#absent">Fragment</a>',
      '<a href="/outside/">Outside</a>',
    ].join("\n"),
    "guide/index.html": '<h2 id="present">Present</h2>',
  });
  const result = auditDist({ dist });
  expect(result.ok).toBe(false);
  expect(result.issues.map((issue) => issue.kind).sort()).toEqual([
    "duplicate-id",
    "missing-fragment",
    "missing-target",
    "outside-base",
  ]);
  expect(result.issues.find((issue) => issue.kind === "duplicate-id")?.lines).toEqual([1, 1]);
  expect(result.issues.find((issue) => issue.kind === "missing-target")?.line).toBe(2);
  expect(result.issues.find((issue) => issue.kind === "missing-fragment")?.line).toBe(3);
  expect(result.issues.find((issue) => issue.kind === "outside-base")?.line).toBe(4);
});

test("decodes encoded fragment identifiers and ignores external/data references", async () => {
  const dist = await fixture({
    "index.html": [
      '<h2 id="why now">Why now</h2>',
      '<a href="#why%20now">Jump</a>',
      '<a href="https://example.test/missing">External</a>',
      '<img src="data:image/svg+xml;base64,AAAA">',
    ].join("\n"),
  });
  expect(auditDist({ dist }).ok).toBe(true);
});
