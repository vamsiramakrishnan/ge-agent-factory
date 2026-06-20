// @ge/okf — round-trip-critical primitive tests.
//
// Covers the helpers the spec<->OKF converters depend on: slug determinism &
// collision-safety, renderConcept->parseConcept round-trip, extractLinks, and
// emitFrontmatter. Assertions targeting these primitives are ported from the
// app-level spec-to-okf.test.mjs. Run with: bun test.

import { test, expect } from "bun:test";

import {
  OKF_VERSION,
  emitFrontmatter,
  extractLinks,
  link,
  parseConcept,
  renderConcept,
  slug,
} from "./index.mjs";

test("OKF_VERSION is 0.1", () => {
  expect(OKF_VERSION).toBe("0.1");
});

test("slug is deterministic and filesystem/link-safe", () => {
  expect(slug("Account Reconciliation Agent")).toBe("account-reconciliation-agent");
  expect(slug("SAP S/4HANA (FI)")).toBe("sap-s-4hana-fi");
  // Idempotent: slugging a slug returns the same value.
  expect(slug(slug("Quote-to-Cash!"))).toBe(slug("Quote-to-Cash!"));
  // Quotes/apostrophes are dropped (not hyphenated), runs of other non-alnum
  // collapse to a single hyphen.
  expect(slug("O'Brien's   report")).toBe("obriens-report");
  expect(slug('say "hi" now')).toBe("say-hi-now");
  // Empty / junk input falls back to a stable sentinel.
  expect(slug("")).toBe("untitled");
  expect(slug("   ---   ")).toBe("untitled");
  expect(slug(null)).toBe("untitled");
});

test("slug collapses distinct source strings to the SAME base (callers must disambiguate)", () => {
  // This is the collision the converter has to guard against: underscore and
  // hyphen variants both slug to one base, so the toolkit alone is not enough —
  // it's the caller's job to dedupe (verified in the app-level test).
  expect(slug("notify_manager")).toBe("notify-manager");
  expect(slug("notify-manager")).toBe("notify-manager");
});

test("renderConcept -> parseConcept round-trips scalars and lists", () => {
  const fields = { type: "Agent Tool", title: "x", tags: ["a", "b"], okf_version: "0.1" };
  const md = renderConcept(fields, "# Body\n\nhello");
  const parsed = parseConcept(md);
  expect(parsed.frontmatter.type).toBe("Agent Tool");
  expect(parsed.frontmatter.okf_version).toBe("0.1");
  expect(parsed.frontmatter.tags).toEqual(["a", "b"]);
  expect(parsed.body).toContain("hello");
});

test("renderConcept round-trips values with YAML-special characters", () => {
  const fields = {
    type: "Source System",
    title: "SAP: S/4HANA - FI",
    description: 'He said "close the books"',
  };
  const parsed = parseConcept(renderConcept(fields, "body"));
  expect(parsed.frontmatter.title).toBe("SAP: S/4HANA - FI");
  expect(parsed.frontmatter.description).toBe('He said "close the books"');
});

test("parseConcept tolerates a body with no frontmatter", () => {
  const parsed = parseConcept("just a body, no fences");
  expect(parsed.frontmatter).toEqual({});
  expect(parsed.body).toBe("just a body, no fences");
});

test("emitFrontmatter preserves key order and drops empty values", () => {
  const fm = emitFrontmatter({ type: "X", title: "T", tags: [], skip: null, keep: "y" });
  const lines = fm.split("\n");
  expect(lines[0]).toBe("---");
  expect(lines.at(-1)).toBe("---");
  // Empty list and null are omitted.
  expect(fm).not.toContain("tags:");
  expect(fm).not.toContain("skip:");
  // Order preserved: type before title before keep.
  expect(fm.indexOf("type:")).toBeLessThan(fm.indexOf("title:"));
  expect(fm.indexOf("title:")).toBeLessThan(fm.indexOf("keep:"));
});

test("extractLinks pulls bundle-absolute concept ids out of a blob", () => {
  const body = [
    `See ${link("tools/query-gl-entries", "GL query")}.`,
    `And ${link("systems/sap-s-4hana-fi")}.`,
    "An [external](https://example.com) link and a (/not-a-concept.txt) are ignored.",
  ].join("\n");
  const ids = extractLinks(body);
  expect(ids).toContain("tools/query-gl-entries");
  expect(ids).toContain("systems/sap-s-4hana-fi");
  expect(ids.length).toBe(2);
});

test("link produces a bundle-absolute target regardless of leading slashes", () => {
  expect(link("systems/x", "X")).toBe("[X](/systems/x.md)");
  expect(link("/systems/x")).toBe("[/systems/x](/systems/x.md)");
});
