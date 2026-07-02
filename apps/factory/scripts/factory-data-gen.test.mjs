// Seed-pinned unit tests for the faker data-gen cluster (generateDocument /
// generateDomainDocuments / generateParagraph / pickEntityRefs / generateValue)
// and the Snowfakery recipe renderers (snowfakeryFakeForColumn /
// renderYamlValue). Written against the in-file functions BEFORE their
// extraction into factory/fixtures/ and factory/data/ — these assertions are
// the parity proof across the move and must not change with it.
//
// The functions are nondeterministic per-process unless seeded, so every
// faker-backed test reseeds the SAME faker singleton factory.mjs imports
// (module identity via the shared "@faker-js/faker" specifier) and asserts
// exact outputs. Pure functions (renderYamlValue, snowfakeryFakeForColumn,
// generateValue's seq branch) are asserted without seeding.
import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { faker } from "@faker-js/faker";
import { generateDocument, generateDomainDocuments, generateParagraph, pickEntityRefs } from "./factory/fixtures/document-gen.mjs";
import { generateValue } from "./factory/fixtures/value-gen.mjs";
import { renderYamlValue, snowfakeryFakeForColumn } from "./factory/data/snowfakery-recipe-render.mjs";

const FIXTURE_DIR = join(dirname(fileURLToPath(import.meta.url)), "..", "tests", "fixtures", "data-gen-unit");
const manifest = JSON.parse(readFileSync(join(FIXTURE_DIR, "manifest.json"), "utf8"));
// The generatedTables shape cmdGenerate builds: table name → array of row objects.
const generatedTables = Object.fromEntries(
  manifest.tables.map((t) => [t.name, JSON.parse(readFileSync(join(FIXTURE_DIR, t.jsonPath), "utf8"))]),
);

// ── renderYamlValue ──────────────────────────────────────────

describe("renderYamlValue", () => {
  test("string scalar is JSON-quoted (quote characters escaped)", () => {
    expect(renderYamlValue('say "hi"')).toBe('"say \\"hi\\""');
  });

  test("number and boolean scalars render bare, with indent padding", () => {
    expect(renderYamlValue(42, 2)).toBe("  42");
    expect(renderYamlValue(true)).toBe("true");
    expect(renderYamlValue(3.5, 4)).toBe("    3.5");
  });

  test("null / non-object falls back to null", () => {
    expect(renderYamlValue(null)).toBe("null");
    expect(renderYamlValue(undefined)).toBe("null");
  });

  test("flat object renders key: JSON-value lines", () => {
    expect(renderYamlValue({ min: 0, max: 1000 })).toBe("min: 0\nmax: 1000");
    expect(renderYamlValue({ fake: "Name" }, 6)).toBe('      fake: "Name"');
  });

  test("nested object recurses with +2 indent", () => {
    expect(renderYamlValue({ date_between: { start_date: "2024-01-01", end_date: "2026-12-31" } }, 6)).toBe(
      [
        "      date_between:",
        '        start_date: "2024-01-01"',
        '        end_date: "2026-12-31"',
      ].join("\n"),
    );
  });

  test("array child renders inline as JSON on the key line", () => {
    expect(renderYamlValue({ choices: ["A", "B"] })).toBe('choices: ["A","B"]');
  });

  test("top-level array renders via Object.entries (index keys)", () => {
    expect(renderYamlValue(["a", "b"])).toBe('0: "a"\n1: "b"');
  });
});

// ── snowfakeryFakeForColumn ──────────────────────────────────

describe("snowfakeryFakeForColumn", () => {
  test("ref column → reference to the BigQuery-safe target table", () => {
    expect(snowfakeryFakeForColumn({ name: "contract_id", type: "ref", ref: "contracts.id" })).toEqual({ reference: "contracts" });
    expect(snowfakeryFakeForColumn({ name: "contract_id", type: "ref" })).toEqual({ reference: "Unknown" });
  });

  test("number / float → random_number with min/max (defaults 0..1000)", () => {
    expect(snowfakeryFakeForColumn({ name: "qty", type: "number", min: 5, max: 10 })).toEqual({ random_number: { min: 5, max: 10 } });
    expect(snowfakeryFakeForColumn({ name: "qty", type: "number" })).toEqual({ random_number: { min: 0, max: 1000 } });
    expect(snowfakeryFakeForColumn({ name: "amount", type: "float", min: 1, max: 2 })).toEqual({ random_number: { min: 1, max: 2 } });
  });

  test("boolean → random_choice expression", () => {
    expect(snowfakeryFakeForColumn({ name: "flag", type: "boolean" })).toBe("${{random_choice(true, false)}}");
  });

  test("date → date_between with min/max (defaults 2024-01-01..2026-12-31)", () => {
    expect(snowfakeryFakeForColumn({ name: "when", type: "date", min: "2025-01-01", max: "2025-12-31" })).toEqual({ date_between: { start_date: "2025-01-01", end_date: "2025-12-31" } });
    expect(snowfakeryFakeForColumn({ name: "when", type: "date" })).toEqual({ date_between: { start_date: "2024-01-01", end_date: "2026-12-31" } });
  });

  test("enum → random_choice over JSON-quoted values (defaults A/B/C)", () => {
    expect(snowfakeryFakeForColumn({ name: "status", type: "enum", values: ["open", "closed"] })).toBe('${{random_choice("open", "closed" )}}');
    expect(snowfakeryFakeForColumn({ name: "status", type: "enum" })).toBe('${{random_choice("A", "B", "C" )}}');
  });

  test("person.* type or name containing 'name' → Name", () => {
    expect(snowfakeryFakeForColumn({ name: "owner", type: "person.fullName" })).toEqual({ fake: "Name" });
    expect(snowfakeryFakeForColumn({ name: "customer_name", type: "string" })).toEqual({ fake: "Name" });
  });

  test("internet.email type or name containing 'email' → Email", () => {
    expect(snowfakeryFakeForColumn({ name: "contact", type: "internet.email" })).toEqual({ fake: "Email" });
    expect(snowfakeryFakeForColumn({ name: "email_address", type: "string" })).toEqual({ fake: "Email" });
  });

  test("company/vendor/supplier names or company.* type → Company", () => {
    expect(snowfakeryFakeForColumn({ name: "vendor", type: "string" })).toEqual({ fake: "Company" });
    expect(snowfakeryFakeForColumn({ name: "supplier", type: "string" })).toEqual({ fake: "Company" });
    expect(snowfakeryFakeForColumn({ name: "employer", type: "company.name" })).toEqual({ fake: "Company" });
  });

  test("city / state / address / phone name heuristics", () => {
    expect(snowfakeryFakeForColumn({ name: "city", type: "string" })).toEqual({ fake: "City" });
    expect(snowfakeryFakeForColumn({ name: "state", type: "string" })).toEqual({ fake: "State" });
    expect(snowfakeryFakeForColumn({ name: "street_address", type: "string" })).toEqual({ fake: "StreetAddress" });
    expect(snowfakeryFakeForColumn({ name: "phone", type: "string" })).toEqual({ fake: "PhoneNumber" });
  });

  test("description/notes/body names or paragraph type → Paragraph", () => {
    expect(snowfakeryFakeForColumn({ name: "description", type: "string" })).toEqual({ fake: "Paragraph" });
    expect(snowfakeryFakeForColumn({ name: "notes", type: "string" })).toEqual({ fake: "Paragraph" });
    expect(snowfakeryFakeForColumn({ name: "body", type: "string" })).toEqual({ fake: "Paragraph" });
    expect(snowfakeryFakeForColumn({ name: "summary", type: "lorem.paragraph" })).toEqual({ fake: "Paragraph" });
  });

  test("title name or sentence type → Sentence", () => {
    expect(snowfakeryFakeForColumn({ name: "title", type: "string" })).toEqual({ fake: "Sentence" });
    expect(snowfakeryFakeForColumn({ name: "headline", type: "lorem.sentence" })).toEqual({ fake: "Sentence" });
  });

  test("seq → unique_id expression", () => {
    expect(snowfakeryFakeForColumn({ name: "id", type: "seq" })).toBe("${{unique_id}}");
  });

  test("anything else → Word", () => {
    expect(snowfakeryFakeForColumn({ name: "code", type: "string" })).toEqual({ fake: "Word" });
    expect(snowfakeryFakeForColumn({})).toEqual({ fake: "Word" });
  });
});

// ── generateValue ────────────────────────────────────────────

describe("generateValue", () => {
  test("seq branch is pure: pattern substitution with zero-padding", () => {
    expect(generateValue({ name: "id", type: "seq" }, 0, {})).toBe("ID-0001");
    expect(generateValue({ name: "id", type: "seq" }, 41, {})).toBe("ID-0042");
    expect(generateValue({ name: "emp", type: "seq", pattern: "EMP-{n:2}" }, 7, {})).toBe("EMP-08");
    expect(generateValue({ name: "emp", type: "seq", pattern: "{n}" }, 7, {})).toBe("0008");
  });

  test("every faker-backed branch is stable under seed 42", () => {
    faker.seed(42);
    expect(generateValue({ name: "qty", type: "number", min: 1, max: 9 }, 0, {})).toBe(4);
    expect(generateValue({ name: "amount", type: "float", min: 0, max: 10, decimals: 2 }, 0, {})).toBe(9.51);
    expect(generateValue({ name: "when", type: "date", min: "2024-01-01", max: "2024-12-31" }, 0, {})).toBe("2024-09-24");
    expect(generateValue({ name: "status", type: "enum", values: ["open", "closed", "void"] }, 0, {})).toBe("closed");
    expect(generateValue({ name: "tier", type: "enum", values: ["gold", "silver"], weights: [9, 1] }, 0, {})).toBe("gold");
    expect(generateValue({ name: "enum_default", type: "enum" }, 0, {})).toBe("A");
    expect(generateValue({ name: "flag", type: "boolean", trueRate: 0.9 }, 0, {})).toBe(true);
    // ref with an existing table: samples the referenced field from its rows.
    expect(generateValue({ name: "contract", type: "ref", ref: "contracts.counterparty" }, 0, generatedTables)).toBe("counterparty-3");
    // ref with a missing table: synthesizes "<entity>-<n>".
    expect(generateValue({ name: "widget", type: "ref", ref: "widgets.id" }, 0, generatedTables)).toBe("widgets-61");
    // dotted faker path, no options.
    expect(generateValue({ name: "owner", type: "person.fullName" }, 0, {})).toBe("Warren Effertz");
    // dotted faker path with len → options.length.
    expect(generateValue({ name: "code", type: "string.alpha", len: 5 }, 0, {})).toBe("jpBwp");
    // unknown dotted path falls through to lorem.word().
    expect(generateValue({ name: "mystery", type: "bogus.nope" }, 0, {})).toBe("perspiciatis");
    // plain string type → lorem.word().
    expect(generateValue({ name: "note", type: "string" }, 0, {})).toBe("apud");
  });
});

// ── pickEntityRefs / generateParagraph ───────────────────────

describe("pickEntityRefs", () => {
  test("samples stable entity refs across tables under seed 42", () => {
    faker.seed(42);
    expect(pickEntityRefs(generatedTables, 3)).toEqual([
      { id: "id-002", context: "sales_orders record (id-002)" },
      { id: "id-003", context: "sales_orders record (id-003)" },
      { id: "id-003", context: "contracts record (id-003)" },
    ]);
  });

  test("stops after the first table once count is satisfied", () => {
    faker.seed(42);
    expect(pickEntityRefs(generatedTables, 1)).toEqual([
      { id: "id-002", context: "sales_orders record (id-002)" },
    ]);
  });

  test("empty tables → no refs", () => {
    expect(pickEntityRefs({}, 3)).toEqual([]);
  });
});

describe("generateParagraph", () => {
  test("is stable under seed 42 and can cite an entity ref", () => {
    faker.seed(42);
    expect(generateParagraph("leave management, accrual, carry-over limits", [{ id: "id-001", context: "contracts record (x)" }])).toBe(
      "Based on current analysis and industry benchmarks carry-over limits within the defined scope. Automated checks verify compliance with carry-over limits standards are met.",
    );
    expect(generateParagraph("", [])).toBe(
      "The organization requires all stakeholders to adhere to operations within the defined scope. Furthermore, ongoing monitoring ensures operations standards are met.",
    );
  });
});

// ── generateDocument / generateDomainDocuments ───────────────

describe("generateDocument", () => {
  test("full run over the fixture doc spec matches the pinned markdown", () => {
    faker.seed(42);
    const doc = generateDocument(manifest.documents[0], manifest.domain, generatedTables);
    expect(doc.title).toBe("ASC 606 Contract Analyzer Controls Playbook");
    expect(doc.content).toBe(readFileSync(join(FIXTURE_DIR, "expected", "document.md"), "utf8"));
    // minimumWordCount: 500 in the fixture spec — the padding loop must satisfy it.
    expect(doc.content.split(/\s+/).filter(Boolean).length).toBeGreaterThanOrEqual(500);
  });
});

describe("generateDomainDocuments", () => {
  test("finance domain produces the pinned five-doc set", () => {
    faker.seed(42);
    const docs = generateDomainDocuments("finance", generatedTables);
    expect(JSON.stringify(docs, null, 2) + "\n").toBe(readFileSync(join(FIXTURE_DIR, "expected", "finance-domain-docs.json"), "utf8"));
  });

  test("unknown domain falls back to the hr doc set", () => {
    faker.seed(42);
    expect(generateDomainDocuments("aerospace", generatedTables).map((d) => d.id)).toEqual([
      "hr-policy-leave",
      "hr-policy-compensation",
      "hr-sop-onboarding",
      "hr-report-attrition",
      "hr-kb-benefits",
    ]);
  });
});
