// spec-review — resolve/inspect an agent spec by usecase id or explicit path
// (`ge spec review`). Verbatim extraction from factory-core.mjs (see AGENTS.md /
// REFACTOR-HANDOFF.md §9 methodology: verbatim move, dependency injection where
// needed, re-export from factory-core.mjs to preserve its public API contract).

import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { loadInterviewSpecEntries, slug, validateGenerationSpec } from "./factory-catalog.mjs";
import { loadCatalog } from "./factory-catalog-search.mjs";
import { LEGACY_STATE_PATHS, STATE_PATHS, displayStatePath } from "./state-paths.mjs";

// Same-directory leaf constant, computed independently (matches state-paths.mjs's
// own pattern) rather than importing REPO_ROOT back from factory-core.mjs, which
// would create an import cycle.
const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");
const GEN_DIR = join(REPO_ROOT, "apps/factory");

function isInsideDir(filePath, rootDir) {
  const root = resolve(rootDir);
  const file = resolve(filePath);
  return file === root || file.startsWith(`${root}/`);
}

function safeSpecReviewPath({ usecaseId, path } = {}) {
  const rawPath = path
    ? String(path)
    : join(displayStatePath(STATE_PATHS.interviews.root), slug(usecaseId || "new-agent", 64) || "new-agent", "agent-spec.json");
  const fullPath = resolve(REPO_ROOT, rawPath);
  const allowedRoots = [
    STATE_PATHS.interviews.root,
    LEGACY_STATE_PATHS.interviews.root,
    join(GEN_DIR, "catalog", "interview-specs"),
  ];
  if (!allowedRoots.some((root) => isInsideDir(fullPath, root))) {
    throw new Error("spec review path must be under .ge/interviews or apps/factory/catalog/interview-specs");
  }
  return fullPath;
}

function summarizeReviewedSpec(spec, usecaseId = null) {
  const generation = spec.generationSpec || spec;
  const quality = validateGenerationSpec(generation);
  return {
    summary: {
      id: spec.id || usecaseId,
      title: spec.title || spec.id || usecaseId || "Generated agent spec",
      department: spec.department || null,
      persona: spec.persona || generation.behaviorContract?.role || null,
      systems: spec.systems || (generation.sourceSystems || []).map((system) => system.id || system.name).filter(Boolean),
      sourceSystems: Array.isArray(generation.sourceSystems) ? generation.sourceSystems.length : 0,
      entities: Array.isArray(generation.entities) ? generation.entities.length : 0,
      documents: Array.isArray(generation.documents) ? generation.documents.length : 0,
      anomalies: Array.isArray(generation.anomalies) ? generation.anomalies.length : 0,
      goldenEvals: Array.isArray(generation.behaviorContract?.goldenEvals) ? generation.behaviorContract.goldenEvals.length : 0,
      buildable: quality.ok,
      maturity: quality.maturity,
    },
    gaps: quality.gaps || [],
  };
}

function generatedInterviewSpecs() {
  const roots = [STATE_PATHS.interviews.root, LEGACY_STATE_PATHS.interviews.root].filter((root, index, all) => all.indexOf(root) === index);
  return roots.flatMap((root) => {
    if (!existsSync(root)) return [];
    return readdirSync(root, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => {
      const specPath = join(root, entry.name, "agent-spec.json");
      if (!existsSync(specPath)) return null;
      try {
        const content = readFileSync(specPath, "utf8");
        const spec = JSON.parse(content);
        return {
          id: spec.id || entry.name,
          title: spec.title || spec.id || entry.name,
          department: spec.department || null,
          source: "generated_artifact",
          path: specPath,
          relativePath: specPath.slice(REPO_ROOT.length + 1),
          content,
          spec,
        };
      } catch {
        return null;
      }
    })
    .filter(Boolean);
  });
}

function candidateScore(entry, words) {
  const text = `${entry.id || ""} ${entry.title || ""} ${entry.subtitle || ""}`.toLowerCase();
  return words.reduce((score, word) => score + (text.includes(word) ? 1 : 0), 0);
}

async function specReviewCandidates(usecaseId) {
  const q = String(usecaseId || "").replace(/-/g, " ").trim().toLowerCase();
  if (!q) return [];
  const words = q.split(/\s+/).filter((word) => word.length > 2);
  if (!words.length) return [];
  const catalog = await loadCatalog();
  const generated = generatedInterviewSpecs().map((entry) => ({
    id: entry.id,
    title: entry.title,
    department: entry.department,
    source: entry.source,
    score: candidateScore(entry, words),
  }));
  const canonical = catalog
    .map((entry) => ({
      id: entry.id,
      title: entry.title,
      department: entry.department || null,
      source: "canonical_catalog_spec",
      score: candidateScore(entry, words),
    }));
  return [...generated, ...canonical]
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score || a.id.localeCompare(b.id))
    .slice(0, 8)
    .map(({ score: _score, ...entry }) => entry);
}

export async function reviewSpec({ usecaseId, path } = {}) {
  const fullPath = safeSpecReviewPath({ usecaseId, path });
  const relativePath = fullPath.startsWith(`${REPO_ROOT}/`) ? fullPath.slice(REPO_ROOT.length + 1) : fullPath;
  const normalizedUsecaseId = usecaseId ? slug(usecaseId, 64) : (relativePath.match(/\.ge(?:-harness)?\/interviews\/([^/]+)\/agent-spec\.json$/)?.[1] || null);
  if (existsSync(fullPath)) {
    const content = readFileSync(fullPath, "utf8");
    let spec;
    try {
      spec = JSON.parse(content);
    } catch (error) {
      return {
        kind: "ge.spec.review",
        source: "generated_artifact",
        found: true,
        parseError: error.message,
        usecaseId: normalizedUsecaseId,
        path: relativePath,
        spec: null,
        content,
        summary: null,
        gaps: ["invalid_json"],
      };
    }
    const reviewed = summarizeReviewedSpec(spec, normalizedUsecaseId);
    return {
      kind: "ge.spec.review",
      source: "generated_artifact",
      found: true,
      usecaseId: normalizedUsecaseId || reviewed.summary.id,
      path: relativePath,
      spec,
      content,
      ...reviewed,
    };
  }

  if (!path && normalizedUsecaseId) {
    const interviewEntries = await loadInterviewSpecEntries({ repoRoot: GEN_DIR });
    const registered = interviewEntries.find((entry) => entry.id === normalizedUsecaseId || entry.registry?.familyId === normalizedUsecaseId);
    if (registered) {
      const reviewed = summarizeReviewedSpec(registered, normalizedUsecaseId);
      const registeredPath = registered.sourcePath?.startsWith(`${REPO_ROOT}/`) ? registered.sourcePath.slice(REPO_ROOT.length + 1) : registered.sourcePath || `apps/factory/catalog/interview-specs/${registered.id}.json`;
      return {
        kind: "ge.spec.review",
        source: "registered_interview_spec",
        found: true,
        usecaseId: registered.id,
        path: registeredPath,
        spec: registered,
        content: `${JSON.stringify(registered, null, 2)}\n`,
        ...reviewed,
      };
    }

    const catalog = await loadCatalog();
    const catalogEntry = catalog.find((entry) => entry.id === normalizedUsecaseId);
    if (catalogEntry) {
      const reviewed = summarizeReviewedSpec(catalogEntry, normalizedUsecaseId);
      return {
        kind: "ge.spec.review",
        source: "canonical_catalog_spec",
        found: true,
        usecaseId: catalogEntry.id,
        path: `apps/factory/generated/use-cases.generated.json#${catalogEntry.id}`,
        spec: catalogEntry,
        content: `${JSON.stringify(catalogEntry, null, 2)}\n`,
        ...reviewed,
      };
    }

    const words = String(normalizedUsecaseId || "").replace(/-/g, " ").trim().toLowerCase().split(/\s+/).filter((word) => word.length > 2);
    const generatedMatches = generatedInterviewSpecs()
      .map((entry) => ({ ...entry, score: candidateScore(entry, words) }))
      .filter((entry) => entry.score > 0)
      .sort((a, b) => b.score - a.score || a.id.localeCompare(b.id));
    if (generatedMatches.length && generatedMatches[0].score >= Math.min(words.length, 2) && generatedMatches.filter((entry) => entry.score === generatedMatches[0].score).length === 1) {
      const match = generatedMatches[0];
      const reviewed = summarizeReviewedSpec(match.spec, match.id);
      return {
        kind: "ge.spec.review",
        source: "generated_artifact",
        resolvedFrom: normalizedUsecaseId,
        found: true,
        usecaseId: match.id,
        path: match.relativePath,
        spec: match.spec,
        content: match.content,
        ...reviewed,
      };
    }
  }

  return {
    kind: "ge.spec.review",
    source: "unresolved",
    found: false,
    usecaseId: normalizedUsecaseId,
    path: relativePath,
    spec: null,
    content: "",
    summary: null,
    gaps: ["spec_id_not_found"],
    candidates: await specReviewCandidates(normalizedUsecaseId),
  };
}
