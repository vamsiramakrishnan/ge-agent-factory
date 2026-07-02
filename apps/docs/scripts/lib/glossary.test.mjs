import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { headingSlug, linkGlossaryTerms, parseGlossary } from "./glossary.mjs";

const ROUTE = "/ge-agent-factory/reference/glossary/";
const GLOSSARY_MD = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "..", "..", "docs", "GLOSSARY.md");

const FIXTURE = `# Glossary

### Harness

**What it is:** The local review-and-fix step that runs on your machine.
More detail follows in a second sentence.

---

### OKF / Knowledge Bundle

**What it is:** OKF is a portable version of an agent's spec.

---

### A few more terms that trip people up

- **Canary** — a build of exactly one agent. Nothing to do with feature flags.
- **Mission** — one orchestrated, resumable run of the factory pipeline.
`;

const entries = parseGlossary(FIXTURE);
const link = (text) => linkGlossaryTerms(text, entries, { route: ROUTE });

describe("parseGlossary", () => {
  test("parses heading entries with anchor and first sentence", () => {
    const harness = entries.find((e) => e.term === "Harness");
    expect(harness.anchor).toBe("harness");
    expect(harness.title).toBe("The local review-and-fix step that runs on your machine.");
  });

  test("splits multi-headword entries into aliases sharing one anchor", () => {
    const okf = entries.find((e) => e.term === "OKF / Knowledge Bundle");
    expect(okf.aliases).toEqual(["OKF", "Knowledge Bundle"]);
    expect(okf.anchor).toBe("okf--knowledge-bundle");
  });

  test("parses bullet terms anchored at their section heading", () => {
    const canary = entries.find((e) => e.term === "Canary");
    expect(canary.anchor).toBe(headingSlug("A few more terms that trip people up"));
    expect(canary.title).toBe("a build of exactly one agent.");
  });

  test("parses every headword the real docs/GLOSSARY.md declares", () => {
    const real = parseGlossary(readFileSync(GLOSSARY_MD, "utf8"));
    const terms = real.map((e) => e.term);
    for (const expected of [
      "Harness",
      "OKF / Knowledge Bundle",
      "Behavior Contract",
      "Promotion Gate",
      "Build Boundary",
      "agents-cli",
      "Canary",
      "Interview",
      "Mission",
      "Workspace",
    ]) {
      expect(terms).toContain(expected);
    }
  });
});

describe("linkGlossaryTerms", () => {
  test("links only the first occurrence of a term", () => {
    const out = link("The harness runs first. Then the harness runs again.");
    expect(out.match(/<a /g)?.length).toBe(1);
    expect(out).toContain(`<a href="${ROUTE}#harness" title="The local review-and-fix step that runs on your machine.">harness</a>`);
    expect(out).toMatch(/Then the harness runs again\.$/);
  });

  test("is case-insensitive and preserves the original casing", () => {
    const out = link("HARNESS wiring matters.");
    expect(out).toContain(">HARNESS</a>");
    expect(out).toContain(`href="${ROUTE}#harness"`);
  });

  test("links multiword terms, preferring the longest match", () => {
    const out = link("Export a Knowledge Bundle for grounding.");
    expect(out).toContain(`<a href="${ROUTE}#okf--knowledge-bundle"`);
    expect(out).toContain(">Knowledge Bundle</a>");
  });

  test("links a multiword term that wraps across a line break", () => {
    const out = link("Export a Knowledge\nBundle for grounding.");
    expect(out).toContain(">Knowledge\nBundle</a>");
  });

  test("never links inside sheltered code tokens, existing links, or headings", () => {
    const out = link(
      [
        "## The harness stage",
        "", // heading must stay untouched
        "See [the harness docs](./harness.md) and ICODE0 first.",
        "", // ICODE0 stands in for `harness` — sheltered inline code
      ].join("\n"),
    );
    expect(out).not.toContain("<a ");
  });

  test("does not link term-shaped substrings of hyphenated identifiers", () => {
    const real = parseGlossary(readFileSync(GLOSSARY_MD, "utf8"));
    const out = linkGlossaryTerms("The google-agents-cli package.", real, { route: ROUTE });
    expect(out).not.toContain("<a ");
  });

  test("does not double-link overlapping terms and links each entry once", () => {
    const out = link("A canary mission: the canary proves the mission works.");
    expect(out.match(/<a /g)?.length).toBe(2);
    expect(out).toContain(">canary</a>");
    expect(out).toContain(">mission</a>");
  });

  test("links plural mentions of a singular headword", () => {
    const out = link("Two missions ran overnight.");
    expect(out).toContain(">missions</a>");
  });

  test("escapes quotes in the tooltip title attribute", () => {
    const quoted = parseGlossary(
      '### Gate\n\n**What it is:** The "pass or fail" check.\n',
    );
    const out = linkGlossaryTerms("The gate decides.", quoted, { route: ROUTE });
    expect(out).toContain('title="The &quot;pass or fail&quot; check."');
  });
});
