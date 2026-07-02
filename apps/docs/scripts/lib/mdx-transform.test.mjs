import { describe, expect, test } from "bun:test";
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  convertAutolinks,
  escapeMdxHostileTokens,
  restoreInlineCode,
  selfCloseVoidTags,
  shelterInlineCode,
  stripHtmlComments,
  validateMdx,
} from "./mdx-transform.mjs";

describe("escapeMdxHostileTokens", () => {
  test("escapes prose braces MDX would read as expressions", () => {
    expect(escapeMdxHostileTokens("grants bigquery.{dataEditor,jobUser} roles")).toBe(
      "grants bigquery.\\{dataEditor,jobUser} roles",
    );
  });

  test("escapes placeholder tags but keeps the known-safe HTML tags", () => {
    expect(escapeMdxHostileTokens("run with --id <useCaseId> today")).toBe("run with --id &lt;useCaseId> today");
    const html = '<p align="center"><img src="x.svg"><br><details><summary>More</summary></details></p>';
    expect(escapeMdxHostileTokens(html)).toBe(html);
  });
});

describe("inline-code sheltering", () => {
  test("shelters spans that wrap across a single newline and restores them", () => {
    const src = "maps each binding (`{op, store,\nentity}`) to an operation";
    const { sheltered, spans } = shelterInlineCode(src);
    expect(sheltered).not.toContain("{op");
    expect(restoreInlineCode(escapeMdxHostileTokens(sheltered), spans)).toBe(src);
  });

  test("does not swallow paragraphs around a stray backtick", () => {
    const src = "a stray ` here\n\nand another ` there";
    expect(shelterInlineCode(src).sheltered).toBe(src);
  });
});

describe("void tags, comments, autolinks", () => {
  test("self-closes markdown-style img and br tags for JSX", () => {
    expect(selfCloseVoidTags('<img src="a.svg" width="420">')).toBe('<img src="a.svg" width="420" />');
    expect(selfCloseVoidTags("line<br>break")).toBe("line<br />break");
    expect(selfCloseVoidTags('<img src="a.svg" />')).toBe('<img src="a.svg" />');
  });

  test("drops HTML comments (MDX has no such construct)", () => {
    expect(stripHtmlComments("before\n<!-- screenshot: Overview -->\nafter")).toBe("before\n\nafter");
  });

  test("rewrites CommonMark autolinks to explicit links", () => {
    expect(convertAutolinks("the console (<http://localhost:18260>) is")).toBe(
      "the console ([http://localhost:18260](http://localhost:18260)) is",
    );
  });
});

describe("validateMdx — the parse guard behind the sync", () => {
  test("accepts a clean page", async () => {
    expect(await validateMdx("---\ntitle: x\n---\n\nSome **prose** and `code`.\n")).toEqual([]);
  });

  test("catches a planted hostile token in a file under the synced tree, with line info", async () => {
    // Simulates a future docs/ page whose hostile token slipped past the
    // mechanical escapes — planted as a temp file under src/content/docs/
    // (never in docs/), exactly where the sync writes emitted pages.
    const contentDir = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "src", "content", "docs");
    const planted = join(contentDir, ".tmp-mdx-guard-plant.mdx");
    mkdirSync(contentDir, { recursive: true });
    // A kramdown IAL is the canonical hostile token: fine on GitHub/Jekyll,
    // an invalid JSX expression ({: …} is not JavaScript) in MDX.
    writeFileSync(planted, "safe line\n\nan unescaped {: .note} kramdown IAL in prose\n");
    try {
      const errors = await validateMdx(readFileSync(planted, "utf8"));
      expect(errors).not.toBeNull(); // compiler must be resolvable via Astro's deps
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].line).toBe(3);
      expect(errors[0].reason).toMatch(/expression|acorn|Unexpected/i);
    } finally {
      rmSync(planted, { force: true });
    }
  });

  test("catches an unclosed tag the escaper deliberately trusts", async () => {
    const errors = await validateMdx("a <p>paragraph that never closes\n");
    expect(errors?.length).toBeGreaterThan(0);
  });
});
