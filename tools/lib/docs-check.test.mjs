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
  test("checks the repository entry-point guides by default", async () => {
    const root = await tempRoot();
    await writeRel(root, "README.md", "[Setup](SETUP.md)\n");
    await writeRel(root, "SETUP.md", "[Contributing](CONTRIBUTING.md)\n");
    await writeRel(root, "CONTRIBUTING.md", "[Agents](AGENTS.md)\n");
    await writeRel(root, "AGENTS.md", "[Docs](docs/)\n");
    await writeRel(root, "docs/index.md", "# Docs\n");

    const result = runDocsCheck({ root });

    expect(result.ok).toBe(true);
    expect(result.checked).toBe(5);
  });

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

  test("passes when img src, blockquotes, and callouts are all well-formed", async () => {
    const root = await tempRoot();
    await writeRel(
      root,
      "docs/_config.yml",
      ["callouts:", "  note:", "    title: Note", "  warning:", "    title: Warning"].join("\n"),
    );
    await writeRel(
      root,
      "docs/guide.md",
      [
        "# Guide",
        "",
        "<img src=\"assets/diagram.svg\" alt=\"a diagram\" width=\"400\">",
        "",
        "> A tip worth calling out.",
        "{: .note }",
        "",
        "> An intentional pull-quote with no marker is allowed (warning only).",
        "",
        "Some trailing text.",
        "",
      ].join("\n"),
    );
    await writeRel(root, "docs/assets/diagram.svg", "<svg></svg>");

    const result = runDocsCheck({ root });

    expect(result.ok).toBe(true);
    expect(result.imageIssues).toEqual([]);
    expect(result.blockquoteIssues).toEqual([]);
    expect(result.calloutWarnings).toEqual([{ path: "docs/guide.md", line: 8 }]);
  });

  test("fails on an image src that does not resolve to a file on disk", async () => {
    const root = await tempRoot();
    await writeRel(root, "docs/_config.yml", ["callouts:", "  note:", "    title: Note"].join("\n"));
    await writeRel(
      root,
      "docs/guide.md",
      ["# Guide", "", "<img src=\"assets/missing.svg\" alt=\"missing\" width=\"400\">", ""].join("\n"),
    );

    const result = runDocsCheck({ root });

    expect(result.ok).toBe(false);
    expect(result.imageIssues).toEqual([{ path: "docs/guide.md", line: 3, src: "assets/missing.svg" }]);
  });

  test("resolves nested-directory img src relative to the markdown file's own directory", async () => {
    const root = await tempRoot();
    await writeRel(root, "docs/_config.yml", ["callouts:", "  note:", "    title: Note"].join("\n"));
    await writeRel(
      root,
      "docs/runbooks/deep.md",
      ["# Deep", "", "<img src=\"../assets/diagrams/flow.svg\" alt=\"flow\" width=\"400\">", ""].join("\n"),
    );
    await writeRel(root, "docs/assets/diagrams/flow.svg", "<svg></svg>");

    const result = runDocsCheck({ root });

    expect(result.ok).toBe(true);
    expect(result.imageIssues).toEqual([]);
  });

  test("fails on an accidental mid-paragraph blockquote (OPERATIONS.md bug shape)", async () => {
    const root = await tempRoot();
    await writeRel(root, "docs/_config.yml", ["callouts:", "  note:", "    title: Note"].join("\n"));
    await writeRel(
      root,
      "docs/OPERATIONS.md",
      [
        "The canonical runbook for deploying the factory. Config resolves: flags",
        "> env > `.ge.json` > terraform outputs > gcloud discovery.",
        "",
        "Use this page when the question is operational.",
        "",
      ].join("\n"),
    );

    const result = runDocsCheck({ root });

    expect(result.ok).toBe(false);
    expect(result.blockquoteIssues).toEqual([{ path: "docs/OPERATIONS.md", line: 2 }]);
  });

  test("does not flag a line that merely contains '>' mid-line, or an intentional blockquote after a blank line", async () => {
    const root = await tempRoot();
    await writeRel(root, "docs/_config.yml", ["callouts:", "  note:", "    title: Note"].join("\n"));
    await writeRel(
      root,
      "docs/guide.md",
      [
        "Config resolves: flags > env > terraform outputs, all on one line.",
        "",
        "> An intentional blockquote starting after a blank line.",
        "> Second line of the same blockquote.",
        "{: .note }",
        "",
      ].join("\n"),
    );

    const result = runDocsCheck({ root });

    expect(result.ok).toBe(true);
    expect(result.blockquoteIssues).toEqual([]);
  });

  test("does not flag a blockquote that starts immediately after a closing code fence", async () => {
    const root = await tempRoot();
    await writeRel(root, "docs/_config.yml", ["callouts:", "  note:", "    title: Note"].join("\n"));
    await writeRel(
      root,
      "docs/guide.md",
      [
        "```bash",
        "gcloud run services update example --vpc-egress=private-ranges-only",
        "```",
        "> `private-ranges-only` keeps public egress on the default path.",
        "{: .note }",
        "",
      ].join("\n"),
    );

    const result = runDocsCheck({ root });

    expect(result.ok).toBe(true);
    expect(result.blockquoteIssues).toEqual([]);
  });

  test("warns (but does not fail) on a blockquote with no recognized callout marker", async () => {
    const root = await tempRoot();
    await writeRel(root, "docs/_config.yml", ["callouts:", "  note:", "    title: Note"].join("\n"));
    await writeRel(
      root,
      "docs/concepts/index.md",
      [
        "# Concepts",
        "",
        "> It is an agent factory, not a prompt-only demo generator.",
        "",
        "More text follows.",
        "",
      ].join("\n"),
    );

    const result = runDocsCheck({ root });

    expect(result.ok).toBe(true);
    expect(result.blockquoteIssues).toEqual([]);
    expect(result.calloutWarnings).toEqual([{ path: "docs/concepts/index.md", line: 3 }]);
  });
});
