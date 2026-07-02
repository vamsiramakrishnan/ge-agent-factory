#!/usr/bin/env node
// Generate the field tables of docs/reference/spec-schema.md from the zod
// schemas in packages/agent-spec/src/schema.ts (the shape authority for the
// spec contract, via zod v4's native z.toJSONSchema). The generated markdown
// lives between three marker pairs — one region per top-level spec part
// (generationSpec / behaviorContract / architecture); the hand-written prose,
// JSON examples, consumer checklist, and round-trip notes around the markers
// are never touched.
//
//   node packages/agent-spec/scripts/gen-spec-reference.mjs           # regenerate
//   node packages/agent-spec/scripts/gen-spec-reference.mjs --check   # exit 1 (+ diff) if stale
//
// House rule (docs/plans/taste-campaign/05-generated-truth.md): this script
// renders ONLY what the schemas contain — names, types, required-ness,
// constraints (minLength/minItems/…), and enum values. The schemas carry no
// .describe() strings, so the tables carry no description column; field
// semantics stay in the hand-written prose around the regions.
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { z } from "zod";
import {
  ArchitectureSchema,
  BehaviorContractSchema,
  GenerationSpecSchema,
} from "../src/schema.ts";

const HERE = dirname(fileURLToPath(import.meta.url));
const DOC_PATH = join(HERE, "..", "..", "..", "docs", "reference", "spec-schema.md");

export const REGIONS = [
  {
    id: "spec-schema-generation-spec",
    root: "generationSpec",
    schema: GenerationSpecSchema,
    // behaviorContract gets its own region below — don't expand it here.
    stop: { behaviorContract: "see [`behaviorContract`](#behaviorcontract)" },
  },
  {
    id: "spec-schema-behavior-contract",
    root: "behaviorContract",
    schema: BehaviorContractSchema,
    stop: {},
  },
  {
    id: "spec-schema-architecture",
    root: "architecture",
    schema: ArchitectureSchema,
    stop: {},
  },
];

export const beginMarker = (id) =>
  `<!-- BEGIN GENERATED: ${id} — do not edit; run \`bun run docs:spec-ref\` -->`;
export const endMarker = (id) => `<!-- END GENERATED: ${id} -->`;

// ── JSON-schema → markdown rendering ─────────────────────────────────────────

const code = (s) => `\`${s}\``;

function isRecordNode(node) {
  return (
    node?.type === "object" && !node.properties && typeof node.additionalProperties === "object" &&
    node.additionalProperties?.type !== undefined
  );
}

export function typeLabel(node) {
  if (!node || typeof node !== "object") return "unknown";
  if (node.anyOf) return node.anyOf.map(typeLabel).join(" or ");
  if (node.enum) return "enum";
  if (node.type === "array") return `${typeLabel(node.items ?? {})}[]`;
  if (isRecordNode(node)) {
    return `record<${node.propertyNames?.type ?? "string"}, ${typeLabel(node.additionalProperties)}>`;
  }
  if (node.type === "object") return "object";
  if (node.type === "null") return "null";
  return node.type ?? "unknown";
}

export function constraintsOf(node) {
  if (!node || typeof node !== "object") return [];
  const out = [];
  if (node.const !== undefined) out.push(`literal ${code(JSON.stringify(node.const))}`);
  if (node.enum) out.push(`one of ${node.enum.map(code).join(", ")}`);
  if (node.minLength !== undefined) out.push(`min length ${node.minLength}`);
  if (node.maxLength !== undefined) out.push(`max length ${node.maxLength}`);
  if (node.minimum !== undefined) out.push(`min ${node.minimum}`);
  if (node.maximum !== undefined) out.push(`max ${node.maximum}`);
  if (node.type === "array" && node.items) {
    if (node.minItems !== undefined) out.push(`min ${node.minItems} item${node.minItems === 1 ? "" : "s"}`);
    if (node.maxItems !== undefined) out.push(`max ${node.maxItems} item${node.maxItems === 1 ? "" : "s"}`);
    if (node.items.enum) out.push(`each one of ${node.items.enum.map(code).join(", ")}`);
  }
  return out;
}

// The object node a property row should recurse into (the property itself, or
// an array-of-objects' items), or null when there is nothing to expand.
function childObjectOf(node) {
  if (node?.type === "object" && node.properties) return node;
  if (node?.type === "array" && node.items?.type === "object" && node.items.properties) {
    return node.items;
  }
  return null;
}

// Render one object node as a table, then its object-shaped children as
// sub-tables, depth-first in property order. `path` is the dotted field path
// used as the sub-table heading (arrays carry a `[]` suffix).
function renderObject(path, node, out, stop, isRoot) {
  if (!isRoot) out.push(`**${code(path)}**`, "");
  const required = new Set(node.required ?? []);
  out.push("| Field | Type | Required | Constraints |", "|---|---|---|---|");
  const children = [];
  for (const [name, prop] of Object.entries(node.properties ?? {})) {
    const label = prop?.type === "array" ? `${name}[]` : name;
    const constraints = constraintsOf(prop);
    if (stop[name] !== undefined) {
      constraints.push(stop[name]);
    } else {
      const child = childObjectOf(prop);
      if (child) children.push([`${path}.${label}`, child]);
    }
    out.push(
      `| ${code(label)} | ${typeLabel(prop)} | ${required.has(name) ? "yes" : "no"} | ${constraints.join("; ")} |`,
    );
  }
  out.push("");
  for (const [childPath, child] of children) renderObject(childPath, child, out, stop, false);
}

export function generateRegion(regionId) {
  const region = REGIONS.find((r) => r.id === regionId);
  if (!region) throw new Error(`unknown region id: ${regionId}`);
  const jsonSchema = z.toJSONSchema(region.schema, { io: "input", reused: "inline" });
  const out = [];
  // Every schema in schema.ts is a z.looseObject on purpose (specs in the
  // wild carry extra keys); surface that only when the schema actually says so.
  if (jsonSchema.additionalProperties !== undefined && jsonSchema.additionalProperties !== false) {
    out.push("All object shapes below are loose: unknown extra keys are allowed, not rejected.", "");
  }
  renderObject(region.root, jsonSchema, out, region.stop ?? {}, true);
  while (out.at(-1) === "") out.pop();
  return out.join("\n");
}

// ── doc splicing (same marker mechanics as tools/gen-cli-reference.mjs) ─────

export function splitDoc(doc, regionId) {
  const BEGIN = beginMarker(regionId);
  const END = endMarker(regionId);
  const beginIdx = doc.indexOf(BEGIN);
  const endIdx = doc.indexOf(END);
  if (beginIdx < 0 || endIdx < 0 || endIdx < beginIdx) {
    throw new Error(`marker pair not found in ${DOC_PATH} (expected "${BEGIN}" … "${END}")`);
  }
  if (doc.indexOf(BEGIN, beginIdx + 1) >= 0 || doc.indexOf(END, endIdx + 1) >= 0) {
    throw new Error(`duplicated marker for region ${regionId} in ${DOC_PATH}`);
  }
  return {
    before: doc.slice(0, beginIdx + BEGIN.length),
    region: doc.slice(beginIdx + BEGIN.length, endIdx).replace(/^\n/, "").replace(/\n$/, ""),
    after: doc.slice(endIdx),
  };
}

function printLineDiff(expected, actual) {
  const a = expected.split("\n");
  const b = actual.split("\n");
  const max = Math.max(a.length, b.length);
  let shown = 0;
  for (let i = 0; i < max && shown < 20; i += 1) {
    if (a[i] !== b[i]) {
      console.error(`  line ${i + 1}:`);
      console.error(`    - ${b[i] ?? "<missing>"}`);
      console.error(`    + ${a[i] ?? "<missing>"}`);
      shown += 1;
    }
  }
  if (shown === 20) console.error("  … (more differences elided)");
}

async function main() {
  const check = process.argv.includes("--check");
  let doc = readFileSync(DOC_PATH, "utf8");
  let stale = 0;
  for (const { id } of REGIONS) {
    const { before, region, after } = splitDoc(doc, id);
    const generated = generateRegion(id);
    if (region === generated) continue;
    if (check) {
      console.error(`✗ docs/reference/spec-schema.md ${id} region is stale vs packages/agent-spec/src/schema.ts`);
      printLineDiff(generated, region);
      stale += 1;
    } else {
      doc = `${before}\n${generated}\n${after}`;
    }
  }
  if (check) {
    if (stale > 0) {
      console.error("Run: bun run docs:spec-ref");
      process.exit(1);
    }
    console.log("✓ docs/reference/spec-schema.md generated regions match packages/agent-spec/src/schema.ts");
    return;
  }
  writeFileSync(DOC_PATH, doc);
  console.log(`generated docs/reference/spec-schema.md regions (${REGIONS.map((r) => r.id).join(", ")})`);
}

// Run only when this file is the process entry point (house pattern from
// apps/factory/scripts/factory.mjs) — importing it must stay side-effect-free.
const __isEntryPoint = (() => {
  try {
    const invoked = process.argv?.[1] ? new URL(`file://${resolve(process.argv[1])}`).href : null;
    return invoked === import.meta.url;
  } catch {
    return false;
  }
})();

if (__isEntryPoint) {
  await main();
}
