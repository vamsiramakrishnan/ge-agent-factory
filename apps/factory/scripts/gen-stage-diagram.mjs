#!/usr/bin/env node
// Generate docs/diagrams-src/factory-stages.mmd — the literal factory stage
// graph — from FACTORY_STAGE_GRAPH (apps/factory/src/factory-orchestration.js),
// where array order IS the edge list (nextFactoryStage = index + 1). This is
// the companion to docs/diagrams-src/factory-line.mmd: that one is the
// hand-drawn *conceptual* three-movement diagram; this one is the exact stage
// sequence, generated so it cannot drift from the orchestration source.
//
// Lives in apps/factory/scripts/ (not tools/) because it imports app source —
// tools/ must never import from apps/* (tools/check-no-app-imports.mjs).
//
//   node apps/factory/scripts/gen-stage-diagram.mjs           # regenerate
//   node apps/factory/scripts/gen-stage-diagram.mjs --check   # exit 1 on drift
//
// Rendering to SVG stays in the existing pipeline: `bun run docs:diagrams`
// (and its --check covers the SVG). Colors come from packages/design PALETTE —
// the single source of truth for brand hexes; no hex literals here.
//
// RENDERER LANDMINE (docs/DESIGN.md): classDef/class lines must NOT end with a
// semicolon — beautiful-mermaid's `^class\s+([\w,-]+)\s+(\w+)$` regex silently
// fails to match and renders a phantom node named `class`. The lines below are
// emitted semicolon-free and the test asserts it stays that way.
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { FACTORY_STAGE_GRAPH } from "../src/factory-orchestration.js";
import { PALETTE } from "../../../packages/design/src/palette.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT_PATH = join(HERE, "..", "..", "..", "docs", "diagrams-src", "factory-stages.mmd");

// Owner → node style. One classDef per owner, brand palette only, following
// docs/DESIGN.md's color convention (blue = control/primary emphasis,
// green = cloud build/release, muted surfaces for the service tiers).
export const OWNER_STYLES = {
  control_plane: { fill: PALETTE.secondaryContainer, stroke: PALETTE.primary },
  cloud_run_service: { fill: PALETTE.surfaceContainer, stroke: PALETTE.secondary },
  cloud_build: { fill: PALETTE.tertiaryContainer, stroke: PALETTE.tertiary },
  cloud_tasks: { fill: PALETTE.surfaceContainerHigh, stroke: PALETTE.primaryDark },
};

export function generateMermaid(stages = FACTORY_STAGE_GRAPH) {
  const lines = [
    "%% GENERATED from apps/factory/src/factory-orchestration.js — run bun run docs:stage-diagram",
    "flowchart TD",
  ];
  for (const stage of stages) {
    lines.push(`  ${stage.id}["${stage.label}"]`);
  }
  // Array order is the edge list (nextFactoryStage = index + 1).
  for (let i = 0; i + 1 < stages.length; i += 1) {
    lines.push(`  ${stages[i].id} --> ${stages[i + 1].id}`);
  }
  const owners = [...new Set(stages.map((stage) => stage.owner))];
  for (const owner of owners) {
    const style = OWNER_STYLES[owner];
    if (!style) throw new Error(`no OWNER_STYLES entry for stage owner "${owner}" — add one (PALETTE hexes only)`);
    // NO trailing semicolon (see the renderer landmine note above).
    lines.push(`  classDef ${owner} fill:${style.fill},stroke:${style.stroke},color:${PALETTE.onSurface}`);
  }
  for (const owner of owners) {
    const ids = stages.filter((stage) => stage.owner === owner).map((stage) => stage.id);
    lines.push(`  class ${ids.join(",")} ${owner}`);
  }
  return `${lines.join("\n")}\n`;
}

function main() {
  const check = process.argv.includes("--check");
  const generated = generateMermaid();
  if (check) {
    let current = "";
    try {
      current = readFileSync(OUT_PATH, "utf8");
    } catch {
      // missing file is drift
    }
    if (current !== generated) {
      console.error("✗ docs/diagrams-src/factory-stages.mmd is stale vs FACTORY_STAGE_GRAPH");
      console.error("Run: bun run docs:stage-diagram && bun run docs:diagrams");
      process.exit(1);
    }
    console.log("✓ docs/diagrams-src/factory-stages.mmd matches FACTORY_STAGE_GRAPH");
    return;
  }
  writeFileSync(OUT_PATH, generated);
  console.log("generated docs/diagrams-src/factory-stages.mmd (render: bun run docs:diagrams)");
}

const __isEntryPoint = (() => {
  try {
    const invoked = process.argv?.[1] ? new URL(`file://${resolve(process.argv[1])}`).href : null;
    return invoked === import.meta.url;
  } catch {
    return false;
  }
})();

if (__isEntryPoint) {
  main();
}
