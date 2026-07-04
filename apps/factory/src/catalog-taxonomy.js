// Catalog taxonomy: the three-axis classification (industry × function ×
// value stream) that lets horizontal and vertical agents live in one catalog
// without overloading `department`.
//
// The data lives in catalog/taxonomy.json (tracked, hand-curated). This module
// loads it once and classifies use-case entries:
//   - horizontal entries (department ∈ horizontal functions) classify as
//     industry "cross_industry" with function == department;
//   - vertical entries (department ∈ industries) resolve their value stream
//     from the subtitle code ("R-1101 • …" → "R-11") or domainId number, and
//     inherit the stream's function binding — which is how "a retailer's
//     procurement is special" is representable: retail R-12 carries function
//     supply_chain, which declares specializes: ["procurement"].
//
// Library contract (AGENTS.md): return data, throw on failure — no printing.

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const TAXONOMY_PATH = join(HERE, "..", "catalog", "taxonomy.json");

let cache = null;

export function loadTaxonomy() {
  if (!cache) {
    const raw = JSON.parse(readFileSync(TAXONOMY_PATH, "utf8"));
    cache = {
      ...raw,
      industriesById: new Map(raw.industries.map((industry) => [industry.id, industry])),
      functionsById: new Map(raw.functions.map((fn) => [fn.id, fn])),
      valueStreamsByCode: new Map(raw.valueStreams.map((stream) => [stream.code, stream])),
    };
  }
  return cache;
}

/** Value-stream code from a catalog subtitle like "R-1101 • Merchandising & Assortment". */
export function valueStreamCodeFromSubtitle(subtitle) {
  const match = String(subtitle || "").match(/^([A-Z]+-\d{2})\d{2}\b/);
  return match ? match[1] : null;
}

function valueStreamFor(taxonomy, entry, industry) {
  const byCode = valueStreamCodeFromSubtitle(entry.subtitle);
  if (byCode && taxonomy.valueStreamsByCode.has(byCode)) return taxonomy.valueStreamsByCode.get(byCode);
  const domainMatch = String(entry.domainId || "").match(/domain-(\d+)/);
  if (domainMatch) {
    const number = Number(domainMatch[1]);
    return taxonomy.valueStreams.find(
      (stream) => stream.industry === industry.id && Number(stream.code.replace(/^[A-Z]+-/, "")) === number,
    ) || null;
  }
  return null;
}

/**
 * Classify a use-case entry (needs department; subtitle/domainId sharpen the
 * value-stream resolution for vertical entries). Returns
 * `{ industry, industryCode, function, functionKind, specializes, valueStream }`
 * — valueStream is `{ code, title }` or null (horizontal agents segment by
 * domain catalog, not industry value streams).
 */
export function classifyUseCase(entry = {}) {
  const taxonomy = loadTaxonomy();
  const department = String(entry.department || "").trim();

  const industry = taxonomy.industriesById.get(department) || taxonomy.industriesById.get("cross_industry");
  const isVertical = industry.id !== "cross_industry";

  let fn = null;
  let valueStream = null;
  if (isVertical) {
    valueStream = valueStreamFor(taxonomy, entry, industry);
    fn = valueStream ? taxonomy.functionsById.get(valueStream.function) || null : null;
  } else {
    fn = taxonomy.functions.find((candidate) => candidate.kind === "horizontal" && candidate.department === department) || null;
  }

  return {
    industry: industry.id,
    industryCode: industry.code,
    function: fn?.id || department || null,
    functionKind: fn?.kind || (isVertical ? "vertical" : "horizontal"),
    specializes: fn?.specializes || [],
    valueStream: valueStream ? { code: valueStream.code, title: valueStream.title } : null,
  };
}

/**
 * All function ids in the family of a horizontal function — itself plus every
 * shared/vertical function that declares it in `specializes`. Answers
 * "show me every procurement-family agent, industry-specialized ones included".
 */
export function functionFamily(functionId) {
  const taxonomy = loadTaxonomy();
  const family = new Set([functionId]);
  for (const fn of taxonomy.functions) {
    if ((fn.specializes || []).includes(functionId)) family.add(fn.id);
  }
  return [...family];
}
