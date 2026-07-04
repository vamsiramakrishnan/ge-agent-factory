import { mkdir, readFile, writeFile } from "node:fs/promises";
import { basename, join, relative, resolve } from "node:path";
import { glob } from "tinyglobby";
import { slug as baseSlug } from "@ge/std/naming";
import {
  AGENT_SPEC_SCHEMA_VERSION,
  INTERVIEW_SPEC_DIR,
} from "@ge/agent-spec/constants";
import { asArray, nonEmptyString, validateAgentSpecQuality } from "@ge/agent-spec/validate";
import { classifyUseCase } from "./catalog-taxonomy.js";

// The agent-spec CONTRACT — the three quality validators (byte-stable
// { ok, maturity, gaps } output), their constants, and the zod shape
// authority — lives in packages/agent-spec (@ge/agent-spec). This file
// re-exports it unchanged so its existing importers keep working, and keeps
// the factory-side IO (normalize/load/write/summarize), which is not
// contract. The .mjs subpaths are used (not the package root) so plain-node
// callers of this file never load TypeScript.
export {
  AGENT_SPEC_SCHEMA_VERSION,
  INTERVIEW_SPEC_DIR,
  REQUIRED_BEHAVIOR_FIELDS,
} from "@ge/agent-spec/constants";
export {
  validateGenerationSpec,
  validateCatalogParity,
  validateAgentSpecQuality,
} from "@ge/agent-spec/validate";

export const slug = (value, max = 96) => baseSlug(value, { max });

// Distinct from core/naming's canonicalSystemId ON PURPOSE: this collapses
// non-alphanumerics to "_" but does NOT split camelCase ("fooBar" -> "foobar",
// not "foo_bar"). These ids are persisted registry keys, so they must stay
// stable — do not "unify" this with snakeCase/canonicalSystemId.
export function sourceSystemId(system) {
  return String(system || "source_system")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "") || "source_system";
}

export function normalizeAgentSpecEntry(raw, {
  sourceKind = "unknown",
  sourcePath = null,
  repoRoot = process.cwd(),
  registeredAt = null,
} = {}) {
  const generationSpec = raw.generationSpec || raw.spec || raw.agentSpec || null;
  const id = slug(raw.id || raw.useCaseId || raw.title);
  if (!id) throw new Error("agent spec entry requires id or title");
  if (!nonEmptyString(raw.title)) throw new Error(`agent spec ${id} requires title`);
  if (!nonEmptyString(raw.department)) throw new Error(`agent spec ${id} requires department`);

  const systems = asArray(raw.systems?.length ? raw.systems : generationSpec?.sourceSystems?.map((system) => system.name || system.id));
  const quality = validateAgentSpecQuality(raw);
  const variant = normalizeVariantMetadata(raw, id);
  const relativeSourcePath = sourcePath
    ? (sourcePath.startsWith("..") || sourcePath.startsWith(".") ? sourcePath : relative(repoRoot, sourcePath))
    : raw.sourcePath || null;

  return {
    id,
    title: raw.title.trim(),
    department: raw.department.trim(),
    sourcePath: relativeSourcePath,
    subtitle: raw.subtitle || "",
    persona: raw.persona || raw.ownerPersona || raw.stakeholder || "",
    layer: raw.layer || "Layer 3: Custom ADK",
    triggerType: raw.triggerType || raw.trigger || "on-demand",
    domainId: raw.domainId || raw.domain || null,
    systems,
    kpis: asArray(raw.kpis),
    statusQuo: asArray(raw.statusQuo || raw.asIs || raw.currentState),
    agentification: asArray(raw.agentification || raw.toBe || raw.futureState),
    architecture: {
      connections: asArray(raw.architecture?.connections || raw.connections),
      pipeline: asArray(raw.architecture?.pipeline || raw.pipeline),
    },
    generationSpec,
    hasBehaviorContract: Boolean(generationSpec?.behaviorContract?.toolIntents?.length),
    // Three-axis taxonomy (industry × function × value stream) — derived from
    // catalog/taxonomy.json so horizontal and vertical agents share one
    // queryable classification (see src/catalog-taxonomy.js).
    classification: raw.classification || classifyUseCase({
      department: raw.department,
      subtitle: raw.subtitle,
      domainId: raw.domainId || raw.domain || null,
    }),
    registry: {
      schemaVersion: AGENT_SPEC_SCHEMA_VERSION,
      sourceKind,
      sourcePath: relativeSourcePath,
      familyId: raw.familyId || raw.registry?.familyId || variant.familyId,
      variant,
      lineage: normalizeLineage(raw, variant),
      registeredAt: registeredAt || raw.registry?.registeredAt || null,
      build: {
        enabled: quality.ok,
        reason: quality.ok ? "production spec passed registry quality gates" : "spec is retained but not buildable until gaps are fixed",
      },
      quality,
      provenance: {
        interviewId: raw.interviewId || raw.registry?.provenance?.interviewId || null,
        author: raw.author || raw.registry?.provenance?.author || null,
        sourceArtifact: raw.sourceArtifact || raw.registry?.provenance?.sourceArtifact || null,
      },
    },
  };
}

function normalizeVariantMetadata(raw, id) {
  const variant = raw.variant || raw.registry?.variant || {};
  const familyId = slug(raw.familyId || raw.registry?.familyId || variant.familyId || raw.baseUseCaseId || raw.baseId || id);
  const variantId = slug(variant.variantId || raw.variantId || id);
  return {
    familyId,
    variantId,
    variantOf: slug(variant.variantOf || raw.variantOf || raw.baseUseCaseId || raw.baseId || ""),
    label: variant.label || raw.variantLabel || (variant.variantOf || raw.variantOf || raw.baseUseCaseId ? "Derived variant" : "Canonical"),
    dimensions: {
      logic: asArray(variant.dimensions?.logic || raw.logicChanges),
      systems: asArray(variant.dimensions?.systems || raw.systemChanges),
      persona: asArray(variant.dimensions?.persona || raw.personaChanges),
      jurisdiction: asArray(variant.dimensions?.jurisdiction || raw.jurisdictionChanges),
      dataShape: asArray(variant.dimensions?.dataShape || raw.dataShapeChanges),
      policy: asArray(variant.dimensions?.policy || raw.policyChanges),
    },
    invariants: asArray(variant.invariants || raw.invariants),
    changeSummary: asArray(variant.changeSummary || raw.changeSummary),
  };
}

function normalizeLineage(raw, variant) {
  const lineage = raw.lineage || raw.registry?.lineage || {};
  return {
    baseUseCaseId: slug(lineage.baseUseCaseId || raw.baseUseCaseId || raw.baseId || variant.variantOf || ""),
    baseSpecVersion: lineage.baseSpecVersion || raw.baseSpecVersion || null,
    refinementMethod: lineage.refinementMethod || raw.refinementMethod || (variant.variantOf ? "spec_refinement" : "original_authoring"),
    refinementPromptPath: lineage.refinementPromptPath || raw.refinementPromptPath || null,
    sourceDiffPath: lineage.sourceDiffPath || raw.sourceDiffPath || null,
    compatibility: {
      preserveBehaviorContract: lineage.compatibility?.preserveBehaviorContract ?? raw.preserveBehaviorContract ?? false,
      preserveEvalIds: lineage.compatibility?.preserveEvalIds ?? raw.preserveEvalIds ?? false,
      preserveSourceSystemIds: lineage.compatibility?.preserveSourceSystemIds ?? raw.preserveSourceSystemIds ?? false,
    },
  };
}

export function mergeAgentSpecEntries(entries) {
  const seen = new Map();
  const merged = [];
  for (const entry of entries) {
    const prior = seen.get(entry.id);
    if (prior) {
      throw new Error(`duplicate agent spec id "${entry.id}" from ${entry.sourcePath || entry.registry?.sourceKind}; already used by ${prior.sourcePath || prior.registry?.sourceKind}`);
    }
    seen.set(entry.id, entry);
    merged.push(entry);
  }
  return sortAgentSpecEntries(merged);
}

export function sortAgentSpecEntries(entries) {
  return [...entries].sort((a, b) => (
    String(a.department || "").localeCompare(String(b.department || ""))
    || String(a.title || "").localeCompare(String(b.title || ""))
  ));
}

async function walkJson(dir) {
  // tinyglobby returns [] for a missing cwd (matches the prior ENOENT → []).
  return (await glob("**/*.json", { cwd: dir, absolute: true })).sort();
}

export async function loadInterviewSpecEntries({ repoRoot, dir = join(repoRoot, INTERVIEW_SPEC_DIR) } = {}) {
  const files = await walkJson(dir);
  const entries = [];
  for (const file of files) {
    const raw = JSON.parse(await readFile(file, "utf8"));
    entries.push(normalizeAgentSpecEntry(raw, {
      sourceKind: "interview",
      sourcePath: file,
      repoRoot,
      registeredAt: raw.registry?.registeredAt || raw.registeredAt || null,
    }));
  }
  return entries;
}

export async function writeInterviewSpecEntry({ repoRoot, entry, dir = join(repoRoot, INTERVIEW_SPEC_DIR), allowDraft = false } = {}) {
  const normalized = normalizeAgentSpecEntry(entry, {
    sourceKind: "interview",
    sourcePath: join(dir, `${slug(entry.id || entry.title)}.json`),
    repoRoot,
    registeredAt: new Date().toISOString(),
  });
  if (!allowDraft && !normalized.registry.quality.ok) {
    throw new Error(`interview spec is not buildable: ${normalized.registry.quality.gaps.join(", ")}`);
  }
  const outPath = join(dir, `${normalized.id}.json`);
  await mkdir(dir, { recursive: true });
  await writeFile(outPath, `${JSON.stringify(normalized, null, 2)}\n`, "utf8");
  return { entry: normalized, path: outPath, file: basename(outPath) };
}

export function registrySummary(entries) {
  return {
    total: entries.length,
    buildable: entries.filter((entry) => entry.registry?.build?.enabled).length,
    bySource: entries.reduce((acc, entry) => {
      const source = entry.registry?.sourceKind || "unknown";
      acc[source] = (acc[source] || 0) + 1;
      return acc;
    }, {}),
    byDepartment: entries.reduce((acc, entry) => {
      const department = entry.department || "unknown";
      acc[department] = (acc[department] || 0) + 1;
      return acc;
    }, {}),
    families: entries.reduce((acc, entry) => {
      const family = entry.registry?.familyId || entry.id;
      acc[family] = (acc[family] || 0) + 1;
      return acc;
    }, {}),
  };
}

export function defaultInterviewSpecPath(repoRoot) {
  return resolve(repoRoot, INTERVIEW_SPEC_DIR);
}
