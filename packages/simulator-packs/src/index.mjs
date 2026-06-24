import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const PACKAGE_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const REPO_ROOT = resolve(PACKAGE_ROOT, "../..");
const MANIFEST_PATH = resolve(PACKAGE_ROOT, "manifest.json");

export async function readPackageManifest() {
  return JSON.parse(await readFile(MANIFEST_PATH, "utf8"));
}

export async function resolveCorpusDescriptor(id = null) {
  const manifest = await readPackageManifest();
  const selectedId = id || manifest.defaultCorpusId;
  const corpus = manifest.corpora.find((item) => item.id === selectedId);
  if (!corpus) {
    throw new Error(`unknown simulator corpus: ${selectedId}`);
  }
  return {
    ...corpus,
    rootPath: resolve(REPO_ROOT, corpus.root),
    registryPath: resolve(REPO_ROOT, corpus.registry),
  };
}

export async function corpusRoot(id = null) {
  return (await resolveCorpusDescriptor(id)).rootPath;
}

export async function registryPath(id = null) {
  return (await resolveCorpusDescriptor(id)).registryPath;
}

export async function readRegistry(id = null) {
  const descriptor = await resolveCorpusDescriptor(id);
  return JSON.parse(await readFile(descriptor.registryPath, "utf8"));
}

export async function listSimulators(id = null) {
  const registry = await readRegistry(id);
  return Array.isArray(registry.simulators) ? registry.simulators : [];
}

export async function validateCorpus(id = null) {
  const descriptor = await resolveCorpusDescriptor(id);
  const errors = [];
  if (!existsSync(descriptor.rootPath)) {
    errors.push(`corpus root missing: ${descriptor.root}`);
  }
  if (!existsSync(descriptor.registryPath)) {
    errors.push(`registry missing: ${descriptor.registry}`);
  }

  let simulators = [];
  if (errors.length === 0) {
    const registry = await readRegistry(id);
    simulators = Array.isArray(registry.simulators) ? registry.simulators : [];
    for (const simulator of simulators) {
      if (!simulator.id) errors.push("simulator missing id");
      for (const key of ["schemaPath", "toolsPath", "seedPath"]) {
        if (simulator[key] && !existsSync(resolve(REPO_ROOT, simulator[key]))) {
          errors.push(`${simulator.id || "<unknown>"} missing ${key}: ${simulator[key]}`);
        }
      }
    }
  }

  return {
    ok: errors.length === 0,
    corpus: descriptor.id,
    root: descriptor.root,
    registry: descriptor.registry,
    simulatorCount: simulators.length,
    errors,
  };
}

export function formatValidationResult(result) {
  return JSON.stringify(result, null, 2);
}
