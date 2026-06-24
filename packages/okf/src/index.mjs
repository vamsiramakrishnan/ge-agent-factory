// @ge/okf — standalone OKF (Open Knowledge Format) v0.1 bundle toolkit.
//
// A small, dependency-free (node builtins only) library for reading and writing
// OKF "Knowledge Bundles". It carries NO domain/spec-specific logic — it is the
// reusable primitive layer (slugging, frontmatter, concept I/O, links) on top of
// which a bundle mapping can be built.
//
// OKF v0.1 (GoogleCloudPlatform/knowledge-catalog okf/SPEC.md):
//   - A "Knowledge Bundle" is a directory tree of UTF-8 Markdown "Concepts".
//   - Each Concept = YAML frontmatter (between `---`) + free-form markdown body.
//   - Frontmatter REQUIRES a non-empty `type`; RECOMMENDS title/description/
//     resource/tags/timestamp. Extra keys allowed.
//   - Relationships are plain markdown links; prefer bundle-ABSOLUTE links that
//     start with `/` (e.g. `/systems/blackline.md`).
//   - The ROOT index.md is the only place `okf_version: "0.1"` belongs.

import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";

export const OKF_VERSION = "0.1";

/** Slugify into a filesystem- and link-safe concept id segment. */
export function slug(value) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-") || "untitled";
}

/** Bundle-absolute link to a concept (id is the file path minus `.md`). */
export function link(conceptId, label) {
  const target = `/${String(conceptId).replace(/^\/+/, "")}.md`;
  return `[${label ?? conceptId}](${target})`;
}

const NEEDS_QUOTE = /[:#\-?&*!,[\]{}|>'"@`]|^\s|\s$/;

function emitScalar(value) {
  const str = String(value ?? "");
  if (str === "") return '""';
  // Always quote okf_version-style values and anything with YAML-special chars.
  if (NEEDS_QUOTE.test(str) || /^(true|false|null|~|\d)/i.test(str)) {
    return `"${str.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
  }
  return str;
}

/**
 * Emit YAML frontmatter for the (small, flat) shapes OKF concepts need:
 * scalars and arrays of scalars. Key order is preserved.
 */
export function emitFrontmatter(fields) {
  const lines = ["---"];
  for (const [key, value] of Object.entries(fields)) {
    if (value === undefined || value === null) continue;
    if (Array.isArray(value)) {
      const items = value.filter((v) => v !== undefined && v !== null && String(v).length);
      if (!items.length) continue;
      lines.push(`${key}:`);
      for (const item of items) lines.push(`  - ${emitScalar(item)}`);
    } else {
      lines.push(`${key}: ${emitScalar(value)}`);
    }
  }
  lines.push("---");
  return lines.join("\n");
}

/** Render a full concept (frontmatter + body) as a Markdown string. */
export function renderConcept(fields, body = "") {
  const fm = emitFrontmatter(fields);
  const trimmed = String(body || "").trim();
  return `${fm}\n\n${trimmed}\n`;
}

function unquote(value) {
  const str = String(value ?? "").trim();
  if ((str.startsWith('"') && str.endsWith('"')) || (str.startsWith("'") && str.endsWith("'"))) {
    return str.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, "\\");
  }
  return str;
}

/**
 * Parse a concept file into `{ frontmatter, body }`. Tolerant of the small
 * scalar/list YAML subset emitted by `emitFrontmatter`; unknown keys are kept.
 */
export function parseConcept(text) {
  const src = String(text ?? "");
  const match = src.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) return { frontmatter: {}, body: src.trim() };
  const fm = {};
  let currentKey = null;
  for (const rawLine of match[1].split("\n")) {
    const line = rawLine.replace(/\s+$/, "");
    if (!line.trim()) continue;
    const listMatch = line.match(/^\s+-\s*(.*)$/);
    if (listMatch && currentKey) {
      if (!Array.isArray(fm[currentKey])) fm[currentKey] = [];
      fm[currentKey].push(unquote(listMatch[1]));
      continue;
    }
    const keyMatch = line.match(/^([a-zA-Z0-9_-]+):\s*(.*)$/);
    if (keyMatch) {
      currentKey = keyMatch[1];
      const value = keyMatch[2];
      if (value === "") {
        fm[currentKey] = [];
      } else if (value.startsWith("[") && value.endsWith("]")) {
        fm[currentKey] = value
          .slice(1, -1)
          .split(",")
          .map((v) => unquote(v))
          .filter(Boolean);
      } else {
        fm[currentKey] = unquote(value);
      }
    }
  }
  return { frontmatter: fm, body: (match[2] || "").trim() };
}

/** Extract body sections keyed by their `#`-level heading text. */
export function bodySections(body) {
  const sections = {};
  let current = "_preamble";
  sections[current] = [];
  for (const line of String(body || "").split("\n")) {
    const heading = line.match(/^#{1,6}\s+(.*)$/);
    if (heading) {
      current = heading[1].trim();
      sections[current] = [];
    } else {
      sections[current].push(line);
    }
  }
  for (const key of Object.keys(sections)) sections[key] = sections[key].join("\n").trim();
  return sections;
}

/** Pull all bundle-absolute concept links (`/x/y.md`) out of a markdown blob. */
export function extractLinks(markdown) {
  const out = [];
  const re = /\[[^\]]*\]\((\/[^)]+?)\.md\)/g;
  let m;
  while ((m = re.exec(String(markdown || ""))) !== null) {
    out.push(m[1].replace(/^\//, ""));
  }
  return out;
}

/** Atomic-ish text write: write to a temp sibling, then rename into place. */
export async function writeConceptFile(absPath, contents) {
  await mkdir(dirname(absPath), { recursive: true });
  const tmp = `${absPath}.tmp-${process.pid}`;
  await writeFile(tmp, contents, "utf8");
  await rename(tmp, absPath);
}

export async function readConceptFile(absPath) {
  return parseConcept(await readFile(absPath, "utf8"));
}

/** Resolve a use-case spec by id from the generated catalog. */
export function findUseCase(catalog, id) {
  const list = Array.isArray(catalog) ? catalog : catalog.useCases || catalog.items || Object.values(catalog);
  return list.find((entry) => entry && entry.id === id) || null;
}

export function joinBundle(outDir, ...segments) {
  return join(outDir, ...segments);
}
