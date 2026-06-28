#!/usr/bin/env node
// One-shot content migration: copy the repo's existing Jekyll markdown
// (../../docs) into the Starlight content tree, stripping Jekyll-only
// frontmatter (parent, nav_order, layout, has_children, permalink, …) and
// keeping/deriving the `title` Starlight needs. Not a framework — a content
// move. Run with --dry-run to preview.
//
//   node apps/docs/scripts/migrate-from-jekyll.mjs --dry-run
//   node apps/docs/scripts/migrate-from-jekyll.mjs
import { readdirSync, readFileSync, mkdirSync, writeFileSync, statSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const SRC = join(HERE, "..", "..", "..", "docs");
const DEST = join(HERE, "..", "src", "content", "docs");
const DRY = process.argv.includes("--dry-run");

// Jekyll/site-internal trees we don't want as published docs pages.
const SKIP_DIRS = new Set(["_site", "vendor", "_includes", "_layouts", "_sass", "assets"]);
const KEEP_KEYS = new Set(["title", "description"]);

function walk(dir, acc = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name) || entry.name.startsWith(".")) continue;
      walk(join(dir, entry.name), acc);
    } else if (entry.name.endsWith(".md") || entry.name.endsWith(".mdx")) {
      acc.push(join(dir, entry.name));
    }
  }
  return acc;
}

function clean(text, fallbackTitle) {
  const m = text.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  const body = m ? m[2] : text;
  const fmLines = m ? m[1].split("\n") : [];
  const kept = {};
  for (const line of fmLines) {
    const km = line.match(/^([A-Za-z_]+):\s*(.*)$/);
    if (km && KEEP_KEYS.has(km[1]) && km[2].trim()) kept[km[1]] = km[2].trim();
  }
  if (!kept.title) {
    const h1 = body.match(/^#\s+(.+)$/m);
    kept.title = h1 ? h1[1].trim().replace(/`/g, "") : fallbackTitle;
  }
  const fm = ["---", `title: ${JSON.stringify(kept.title)}`];
  if (kept.description) fm.push(`description: ${JSON.stringify(kept.description)}`);
  fm.push("---", "");
  return fm.join("\n") + body.replace(/^#\s+.+\n+/, "");
}

const files = (() => { try { return walk(SRC); } catch { return []; } })();
let migrated = 0;
for (const file of files) {
  const rel = relative(SRC, file);
  const fallback = rel.replace(/\.mdx?$/, "").split("/").pop().replace(/[-_]/g, " ");
  const out = join(DEST, rel.replace(/\.mdx$/, ".md"));
  const cleaned = clean(readFileSync(file, "utf8"), fallback);
  if (DRY) {
    console.log(`${rel}  →  ${relative(join(HERE, ".."), out)}`);
  } else {
    mkdirSync(dirname(out), { recursive: true });
    writeFileSync(out, cleaned);
  }
  migrated += 1;
}
console.log(`${DRY ? "[dry-run] would migrate" : "migrated"} ${migrated} pages from docs/ → Starlight`);
console.log("Then add each top-level section to the `sidebar` autogenerate list in astro.config.mjs.");
