#!/usr/bin/env node
// Render docs/diagrams-src/*.mmd (Mermaid source) to docs/assets/diagrams/*.svg
// via beautiful-mermaid, so every diagram in docs/ shares one visual system
// instead of hand-drawn ASCII art of varying quality.
//   node tools/gen-docs-diagrams.mjs           # regenerate
//   node tools/gen-docs-diagrams.mjs --check   # fail if any .svg is stale
import { readFileSync, writeFileSync, existsSync, readdirSync } from "node:fs";
import { dirname, join, basename } from "node:path";
import { fileURLToPath } from "node:url";
import { renderMermaidSVG } from "beautiful-mermaid";
import { DIAGRAM_THEME } from "./lib/docs-diagram-theme.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const SRC_DIR = join(HERE, "..", "docs", "diagrams-src");
const OUT_DIR = join(HERE, "..", "docs", "assets", "diagrams");
const check = process.argv.includes("--check");

const sources = readdirSync(SRC_DIR).filter((f) => f.endsWith(".mmd")).sort();
let drift = 0;

for (const file of sources) {
  const name = basename(file, ".mmd");
  const src = readFileSync(join(SRC_DIR, file), "utf8");
  const svg = `${renderMermaidSVG(src, DIAGRAM_THEME)}\n`;
  const outPath = join(OUT_DIR, `${name}.svg`);

  if (check) {
    const current = existsSync(outPath) ? readFileSync(outPath, "utf8") : "";
    if (current !== svg) {
      console.error(`✗ assets/diagrams/${name}.svg is stale vs diagrams-src/${file}`);
      drift += 1;
    }
  } else {
    writeFileSync(outPath, svg);
    console.log(`generated assets/diagrams/${name}.svg`);
  }
}

if (check) {
  if (drift) {
    console.error("Run: node tools/gen-docs-diagrams.mjs");
    process.exit(1);
  }
  console.log(`✓ ${sources.length} docs diagrams match their Mermaid source`);
}
