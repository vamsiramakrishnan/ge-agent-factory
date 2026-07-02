// WS2 Step 3: every corpus spec must safeParse with GenerationSpecSchema OR be
// listed in fixtures/known-nonconforming.json with its zod error paths — an
// honest inventory, not a silent skip. Specs that fail today's
// validateGenerationSpec are allowed to fail parse; the file records why.
//
// Corpus here = the on-disk segments of the parity oracle's corpus
// (see parity.test.mjs):
//   1. apps/factory/catalog/interview-specs/**/*.json — the raw file IS the
//      normalized entry `loadInterviewSpecEntries` returns (normalize passes
//      `generationSpec` through by reference), so parsing the file covers the
//      loaded-entry view too; these files are additionally parsed with
//      AgentSpecEntrySchema.
//   2. packages/agent-spec/tests/fixtures/specs/*.json — the checked-in
//      edge-case corpus (mostly deliberately broken, hence inventoried).
import { describe, expect, test } from "bun:test";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { AgentSpecEntrySchema, GenerationSpecSchema } from "../src/schema";

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(HERE, "..", "..", "..");
const INTERVIEW_SPEC_DIR = join(REPO_ROOT, "apps", "factory", "catalog", "interview-specs");
const LOCAL_FIXTURE_DIR = join(HERE, "fixtures", "specs");
const KNOWN_NONCONFORMING_PATH = join(HERE, "fixtures", "known-nonconforming.json");

function walkJson(dir: string): string[] {
  if (!existsSync(dir)) return [];
  const out: string[] = [];
  const walk = (current: string) => {
    for (const name of readdirSync(current).sort()) {
      const abs = join(current, name);
      if (statSync(abs).isDirectory()) walk(abs);
      else if (name.endsWith(".json")) out.push(abs);
    }
  };
  walk(dir);
  return out.sort();
}

type CorpusEntry = { id: string; raw: Record<string, unknown> };

function corpus(): CorpusEntry[] {
  const entries: CorpusEntry[] = [];
  for (const file of walkJson(INTERVIEW_SPEC_DIR)) {
    entries.push({
      id: `interview-specs/${relative(INTERVIEW_SPEC_DIR, file)}`,
      raw: JSON.parse(readFileSync(file, "utf8")),
    });
  }
  for (const file of walkJson(LOCAL_FIXTURE_DIR)) {
    entries.push({
      id: `fixture/${relative(LOCAL_FIXTURE_DIR, file)}`,
      raw: JSON.parse(readFileSync(file, "utf8")),
    });
  }
  return entries;
}

function issuePaths(error: { issues: Array<{ path: PropertyKey[]; code: string }> }): string[] {
  return error.issues.map((issue) => `${issue.path.join(".") || "(root)"}: ${issue.code}`);
}

describe("GenerationSpecSchema over the corpus", () => {
  const known: Record<string, { reason: string; errors: string[] }> = JSON.parse(
    readFileSync(KNOWN_NONCONFORMING_PATH, "utf8"),
  );

  test("every corpus spec parses, or is inventoried in known-nonconforming.json", () => {
    const failures: Record<string, string[]> = {};
    for (const { id, raw } of corpus()) {
      const spec = raw.generationSpec ?? raw.spec ?? raw.agentSpec ?? null;
      if (spec === null) {
        failures[id] = ["(root): no generationSpec/spec/agentSpec on the entry"];
        continue;
      }
      const result = GenerationSpecSchema.safeParse(spec);
      if (!result.success) failures[id] = issuePaths(result.error);
    }
    for (const [id, errors] of Object.entries(failures)) {
      expect(known, `unlisted nonconforming spec ${id}: ${errors.join("; ")}`).toHaveProperty([id]);
    }
    // No stale inventory: everything listed must actually fail to parse.
    for (const id of Object.keys(known)) {
      expect(failures, `known-nonconforming entry ${id} now parses — remove it`).toHaveProperty([
        id,
      ]);
    }
  });

  test("normalized entries on disk parse with AgentSpecEntrySchema", () => {
    const files = walkJson(INTERVIEW_SPEC_DIR);
    expect(files.length).toBeGreaterThan(0);
    for (const file of files) {
      const result = AgentSpecEntrySchema.safeParse(JSON.parse(readFileSync(file, "utf8")));
      expect(
        result.success,
        `${relative(REPO_ROOT, file)}: ${result.success ? "" : issuePaths(result.error).join("; ")}`,
      ).toBe(true);
    }
  });

  test("the catalog-grade fixture parses (shape and validators agree on a good spec)", () => {
    const raw = JSON.parse(
      readFileSync(join(LOCAL_FIXTURE_DIR, "catalog-grade.json"), "utf8"),
    ) as { generationSpec: unknown };
    const result = GenerationSpecSchema.safeParse(raw.generationSpec);
    expect(result.success, result.success ? "" : issuePaths(result.error).join("; ")).toBe(true);
  });

  test("extra keys survive parsing (loose objects, no stripping)", () => {
    const raw = JSON.parse(
      readFileSync(join(LOCAL_FIXTURE_DIR, "catalog-grade.json"), "utf8"),
    ) as { generationSpec: Record<string, unknown> };
    const withExtra = { ...raw.generationSpec, futureField: { keep: "me" } };
    const parsed = GenerationSpecSchema.parse(withExtra);
    expect((parsed as Record<string, unknown>).futureField).toEqual({ keep: "me" });
  });
});
