import { afterEach, describe, expect, test } from "bun:test";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { runDocsCheck } from "./docs-check.mjs";

const roots = [];

async function tempRoot() {
  const root = await mkdtemp(join(tmpdir(), "ge-docs-check-"));
  roots.push(root);
  return root;
}

async function writeRel(root, relPath, value) {
  await mkdir(join(root, relPath, ".."), { recursive: true });
  await writeFile(join(root, relPath), value, "utf8");
}

afterEach(async () => {
  await Promise.all(roots.splice(0).map((root) => rm(root, { recursive: true, force: true })));
});

describe("docs check", () => {
  test("accepts local markdown, html, directory, and root-relative links", async () => {
    const root = await tempRoot();
    await writeRel(root, "README.md", [
      "[Docs](docs/)",
      "[Guide](docs/guide.html)",
      "[Root](/docs/reference/index.md)",
    ].join("\n"));
    await writeRel(root, "docs/index.md", "[Guide](./guide.md)");
    await writeRel(root, "docs/guide.md", "[Reference](reference/)");
    await writeRel(root, "docs/reference/index.md", "# Reference\n");

    const result = runDocsCheck({ root });

    expect(result.ok).toBe(true);
    expect(result.checked).toBe(4);
  });

  test("reports broken local links", async () => {
    const root = await tempRoot();
    await writeRel(root, "README.md", "[Missing](docs/missing.md)\n");

    const result = runDocsCheck({ root });

    expect(result.ok).toBe(false);
    expect(result.findings).toEqual([{ path: "README.md", link: "docs/missing.md" }]);
  });
});
