import { test, expect } from "bun:test";
import {
  renderToolsPreambleLines,
  renderDocumentToolLines,
} from "../scripts/factory/tools/render-tools-py.mjs";

const MANIFEST = {
  id: "benefits-audit-agent",
  systems: [{ id: "workday", name: "Workday" }],
  documents: [
    { id: "policy", title: "Benefits Policy", type: "policy", path: "docs/policy.md", sourceSystemId: "workday", wordCount: 250 },
  ],
};
const TABLES = [
  { name: "employees", sourceSystem: "Workday", sourceSystemId: "workday" },
];

test("preamble renders the fixed helpers + scenario-bound tools", () => {
  const lines = renderToolsPreambleLines({ manifest: MANIFEST, tables: TABLES });
  const text = lines.join("\n");
  // Module docstring is bound to the manifest id.
  expect(lines[0]).toBe('"""Auto-generated fixture-backed tools for: benefits-audit-agent"""');
  // Always-present helpers + tools.
  for (const needle of ["def _json(", "def _csv(", "def _deterministic_id(", "def describe_data_model(", "def list_systems("]) {
    expect(text).toContain(needle);
  }
  // list_systems embeds the scenario id, systems, and the projected table tuples.
  expect(text).toContain('"scenario": "benefits-audit-agent"');
  expect(text).toContain(JSON.stringify(MANIFEST.systems));
  expect(text).toContain(JSON.stringify([{ name: "employees", sourceSystem: "Workday", sourceSystemId: "workday" }]));
  // _CONTRACT_DOCUMENTS carries the source_system_id projection (compact JSON, no spaces).
  expect(text).toContain('"source_system_id":"workday"');
});

test("preamble tolerates a manifest with no documents/systems", () => {
  const lines = renderToolsPreambleLines({ manifest: { id: "x" }, tables: [] });
  const text = lines.join("\n");
  expect(text).toContain("_CONTRACT_DOCUMENTS = []");
  expect(text).toContain('"systems": []');
  expect(text).toContain('"tables": []');
});

test("document tools render list/read/search bound to the docs array", () => {
  const lines = renderDocumentToolLines(MANIFEST.documents);
  const text = lines.join("\n");
  for (const needle of ["def list_documents(", "def read_document(", "def search_documents("]) {
    expect(text).toContain(needle);
  }
  // read_document/search_documents embed the {id,path,title} projection (not type/wordCount).
  expect(text).toContain(JSON.stringify([{ id: "policy", path: "docs/policy.md", title: "Benefits Policy" }]));
  // list_documents embeds the richer projection incl. wordCount.
  expect(text).toContain(JSON.stringify([{ id: "policy", title: "Benefits Policy", type: "policy", path: "docs/policy.md", wordCount: 250 }]));
});
