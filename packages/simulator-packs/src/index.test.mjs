import { describe, expect, test } from "bun:test";

import {
  corpusRoot,
  listSimulators,
  readPackageManifest,
  registryPath,
  resolveCorpusDescriptor,
  validateCorpus,
} from "./index.mjs";

const EXPECTED_CORPUS_ROOT = "apps/ge-demo-generator/simulator-systems";
const EXPECTED_REGISTRY = `${EXPECTED_CORPUS_ROOT}/registry.json`;

describe("@ge/simulator-packs facade", () => {
  test("keeps the manifest pointed at the app-owned simulator corpus", async () => {
    const manifest = await readPackageManifest();
    const defaultCorpus = manifest.corpora.find((corpus) => corpus.id === manifest.defaultCorpusId);

    expect(manifest.packageName).toBe("@ge/simulator-packs");
    expect(defaultCorpus).toMatchObject({
      id: "ge-demo-generator-simulator-systems",
      root: EXPECTED_CORPUS_ROOT,
      registry: EXPECTED_REGISTRY,
    });
  });

  test("resolves corpus paths back to the repository root", async () => {
    const descriptor = await resolveCorpusDescriptor();
    const rootPath = await corpusRoot();
    const resolvedRegistryPath = await registryPath();

    expect(descriptor.root).toBe(EXPECTED_CORPUS_ROOT);
    expect(descriptor.registry).toBe(EXPECTED_REGISTRY);
    expect(rootPath).toBe(descriptor.rootPath);
    expect(resolvedRegistryPath).toBe(descriptor.registryPath);
    expect(rootPath.endsWith(EXPECTED_CORPUS_ROOT)).toBe(true);
    expect(resolvedRegistryPath.endsWith(EXPECTED_REGISTRY)).toBe(true);
  });

  test("lists simulators from the shared registry", async () => {
    const simulators = await listSimulators();
    const ids = simulators.map((simulator) => simulator.id);

    expect(simulators.length).toBeGreaterThan(0);
    expect(ids).toContain("workday");
    expect(ids).toContain("servicenow");
    for (const simulator of simulators) {
      expect(simulator.schemaPath.startsWith(`${EXPECTED_CORPUS_ROOT}/`)).toBe(true);
      expect(simulator.toolsPath.startsWith(`${EXPECTED_CORPUS_ROOT}/`)).toBe(true);
      expect(simulator.seedPath.startsWith(`${EXPECTED_CORPUS_ROOT}/`)).toBe(true);
    }
  });

  test("validates the default corpus through the package API", async () => {
    const simulators = await listSimulators();
    const result = await validateCorpus();

    expect(result).toMatchObject({
      ok: true,
      corpus: "ge-demo-generator-simulator-systems",
      root: EXPECTED_CORPUS_ROOT,
      registry: EXPECTED_REGISTRY,
      errors: [],
    });
    expect(result.simulatorCount).toBe(simulators.length);
  });

  test("rejects unknown corpus ids", async () => {
    await expect(resolveCorpusDescriptor("missing-corpus")).rejects.toThrow("unknown simulator corpus: missing-corpus");
  });
});
