// Use-case lookup / fuzzy resolution against the source map, plus spec→use-case
// normalization, for the mock-data planner. Extracted from plan-mock-data.mjs
// verbatim — pure functions, byte output identical to the former inline helpers.

import { basename } from "node:path";
import { sourceKindForSystem } from "./lakehouse-targets.mjs";

export function normalizeUseCaseLookup(value) {
  return String(value || "")
    .replace(/Agent$/i, "")
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function lookupCandidates(useCase = {}) {
  return [
    useCase.id,
    useCase.title,
    useCase.path,
    useCase.sourcePath,
    basename(useCase.path || useCase.sourcePath || "").replace(/\.tsx$/i, ""),
  ].filter(Boolean);
}

export function scoreUseCaseMatch(useCase, requested) {
  const needle = normalizeUseCaseLookup(requested);
  if (!needle) return 0;
  const needleTokens = new Set(needle.split("-").filter((token) => token.length > 2));
  let best = 0;
  for (const rawCandidate of lookupCandidates(useCase)) {
    const candidate = normalizeUseCaseLookup(rawCandidate);
    if (!candidate) continue;
    if (candidate === needle) best = Math.max(best, 100);
    else if (candidate.endsWith(`-${needle}`) || candidate.startsWith(`${needle}-`)) best = Math.max(best, 90);
    else if (candidate.includes(needle) || needle.includes(candidate)) best = Math.max(best, 80);
    const candidateTokens = new Set(candidate.split("-").filter((token) => token.length > 2));
    const overlap = [...needleTokens].filter((token) => candidateTokens.has(token)).length;
    if (overlap >= 2) best = Math.max(best, 40 + overlap * 10);
  }
  return best;
}

export function resolveUseCase(sourceMap, requested) {
  const useCases = sourceMap?.useCases || [];
  const exact = useCases.find((item) => lookupCandidates(item).map(normalizeUseCaseLookup).includes(normalizeUseCaseLookup(requested)));
  if (exact) return { match: exact, suggestions: [], ambiguous: false };

  const ranked = useCases
    .map((item) => ({ item, score: scoreUseCaseMatch(item, requested) }))
    .filter((entry) => entry.score >= 60)
    .sort((a, b) => b.score - a.score || String(a.item.id || "").localeCompare(String(b.item.id || "")));
  if (ranked.length === 1 || (ranked[0] && ranked[0].score >= 80 && ranked[0].score > (ranked[1]?.score || 0))) {
    return { match: ranked[0].item, suggestions: [], ambiguous: false };
  }
  return {
    match: null,
    ambiguous: ranked.length > 1,
    suggestions: ranked.slice(0, 8).map(({ item, score }) => ({ id: item.id, title: item.title, department: item.department, score })),
  };
}

export function useCaseNotFoundMessage(usecase, suggestions = [], ambiguous = false) {
  const prefix = ambiguous ? `Use case is ambiguous in source map: ${usecase}` : `Use case not found in source map: ${usecase}`;
  if (!suggestions.length) return prefix;
  return [
    prefix,
    "Closest matches:",
    ...suggestions.map((item) => `- ${item.id}${item.title ? ` (${item.title})` : ""}`),
  ].join("\n");
}

export function useCaseFromSpec(spec = {}, sourcePath = null) {
  const generationSpec = spec.generationSpec || spec.spec || spec.agentSpec || {};
  const sourceSystems = Array.isArray(generationSpec.sourceSystems) ? generationSpec.sourceSystems : [];
  return {
    ...spec,
    id: spec.id,
    title: spec.title || spec.id,
    department: spec.department || "general",
    generationSpec,
    sourcePath,
    sources: sourceSystems.map((system) => ({
      system: system.name || system.id,
      description: system.description || `${system.name || system.id} owns ${(system.owns || []).join(", ")}`,
      direction: "read",
      protocol: system.protocol || "simulator",
      dataKind: sourceKindForSystem(system),
    })),
  };
}
