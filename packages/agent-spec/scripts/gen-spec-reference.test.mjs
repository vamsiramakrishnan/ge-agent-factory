// Tests for packages/agent-spec/scripts/gen-spec-reference.mjs — the generator
// that renders the spec-schema field tables in docs/reference/spec-schema.md
// from the zod schemas in ../src/schema.ts.
import { expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  EscalationActionSchema,
  EvidenceKindSchema,
  ToolIntentKindSchema,
} from "../src/schema.ts";
import {
  REGIONS,
  beginMarker,
  endMarker,
  generateRegion,
  splitDoc,
} from "./gen-spec-reference.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const DOC_PATH = join(HERE, "..", "..", "..", "docs", "reference", "spec-schema.md");

test("enum values render from the schema, not hand-written duplicates", () => {
  const region = generateRegion("spec-schema-behavior-contract");
  expect(region).toContain(
    `| \`kind\` | enum | yes | one of ${ToolIntentKindSchema.options.map((v) => `\`${v}\``).join(", ")} |`,
  );
  expect(region).toContain(
    `one of ${EscalationActionSchema.options.map((v) => `\`${v}\``).join(", ")}`,
  );
  expect(region).toContain(
    `each one of ${EvidenceKindSchema.options.map((v) => `\`${v}\``).join(", ")}`,
  );
});

test("required-ness and constraints come straight from the zod schemas", () => {
  const gs = generateRegion("spec-schema-generation-spec");
  expect(gs).toContain("| `version` | number | yes | literal `1` |");
  expect(gs).toContain("| `behaviorContract` | object | yes |");
  expect(gs).toContain("| `relationships[]` | object[] | no |");
  const bc = generateRegion("spec-schema-behavior-contract");
  expect(bc).toContain("| `primaryObjective` | string | yes | min length 60 |");
  expect(bc).toContain("| `toolIntents[]` | object[] | yes | min 3 items |");
  expect(bc).toContain("| `workflow` | object | no |");
});

test("nested object schemas render as dotted-path sub-tables, two levels deep", () => {
  const gs = generateRegion("spec-schema-generation-spec");
  for (const heading of [
    "**`generationSpec.sourceSystems[]`**",
    "**`generationSpec.entities[].columns[]`**",
    "**`generationSpec.datastorePackaging.cloudStorage`**",
  ]) {
    expect(gs).toContain(`${heading}\n`);
  }
  const bc = generateRegion("spec-schema-behavior-contract");
  expect(bc).toContain("**`behaviorContract.workflow.steps[]`**\n");
});

test("behaviorContract is cross-referenced, not expanded, inside the generationSpec region", () => {
  const gs = generateRegion("spec-schema-generation-spec");
  expect(gs).toContain("see [`behaviorContract`](#behaviorcontract)");
  expect(gs).not.toContain("**`generationSpec.behaviorContract");
});

test("union and record types render structurally", () => {
  const gs = generateRegion("spec-schema-generation-spec");
  expect(gs).toContain("| `min` | string or number | no |");
  expect(gs).toContain("| `requestSchema` | record<string, string> | yes |");
});

test("checked-in docs/reference/spec-schema.md regions match the schemas (no drift)", () => {
  const doc = readFileSync(DOC_PATH, "utf8");
  for (const { id } of REGIONS) {
    const { region } = splitDoc(doc, id);
    expect(region).toBe(generateRegion(id));
  }
});

test("splitDoc throws on missing and duplicated markers", () => {
  const id = REGIONS[0].id;
  expect(() => splitDoc("no markers here", id)).toThrow(/marker pair not found/);
  const doubled = `${beginMarker(id)}\nx\n${endMarker(id)}\n${beginMarker(id)}\ny\n${endMarker(id)}`;
  expect(() => splitDoc(doubled, id)).toThrow(/duplicated marker/);
});
