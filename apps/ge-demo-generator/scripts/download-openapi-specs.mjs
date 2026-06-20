#!/usr/bin/env node
import { createHash } from "node:crypto";
import { mkdir, readFile, unlink, writeFile } from "node:fs/promises";
import { basename, dirname, extname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(SCRIPT_DIR, "../../..");
const DEFAULT_MANIFEST = resolve(REPO_ROOT, "apps/ge-demo-generator/simulator-systems/openapi-sources.json");
const DEFAULT_OUT_DIR = resolve(REPO_ROOT, "apps/ge-demo-generator/simulator-systems/_openapi");
const DEFAULT_REGISTRY = resolve(REPO_ROOT, "apps/ge-demo-generator/simulator-systems/registry.json");

function parseArgs(argv) {
  const flags = {};
  for (let i = 0; i < argv.length; i += 1) {
    if (!argv[i].startsWith("--")) continue;
    const key = argv[i].slice(2);
    flags[key] = argv[i + 1] && !argv[i + 1].startsWith("--") ? argv[++i] : "true";
  }
  return flags;
}

function asList(value) {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function inferExtension(url, contentType) {
  const pathExt = extname(new URL(url).pathname).toLowerCase();
  if ([".json", ".yaml", ".yml"].includes(pathExt)) return pathExt === ".yml" ? ".yaml" : pathExt;
  if (contentType?.includes("json")) return ".json";
  if (contentType?.includes("yaml") || contentType?.includes("yml")) return ".yaml";
  return ".txt";
}

function sha256(buffer) {
  return createHash("sha256").update(buffer).digest("hex");
}

function parseJsonBuffer(buffer) {
  try {
    return JSON.parse(buffer.toString("utf8"));
  } catch {
    return null;
  }
}

function yamlSpecVersion(buffer) {
  const text = buffer.toString("utf8");
  const openapi = text.match(/^openapi:\s*["']?([^"'\n]+)["']?/m);
  const swagger = text.match(/^swagger:\s*["']?([^"'\n]+)["']?/m);
  return openapi
    ? { format: "openapi", version: openapi[1] }
    : swagger
      ? { format: "swagger", version: swagger[1] }
      : null;
}

function classifySpec(buffer, contentType) {
  const json = parseJsonBuffer(buffer);
  if (json?.openapi) {
    return {
      valid: true,
      format: "openapi",
      version: json.openapi,
      title: json.info?.title || null,
      apiVersion: json.info?.version || null,
      paths: json.paths ? Object.keys(json.paths).length : 0,
      schemas: json.components?.schemas ? Object.keys(json.components.schemas).length : 0,
    };
  }
  if (json?.swagger) {
    return {
      valid: true,
      format: "swagger",
      version: json.swagger,
      title: json.info?.title || null,
      apiVersion: json.info?.version || null,
      paths: json.paths ? Object.keys(json.paths).length : 0,
      schemas: json.definitions ? Object.keys(json.definitions).length : 0,
    };
  }
  if (json?.discoveryVersion && json?.resources) {
    return {
      valid: true,
      format: "google_discovery",
      version: json.discoveryVersion,
      title: json.title || json.name || null,
      apiVersion: json.version || null,
      resources: Object.keys(json.resources).length,
      schemas: json.schemas ? Object.keys(json.schemas).length : 0,
    };
  }
  const yamlSpec = yamlSpecVersion(buffer);
  if (yamlSpec) {
    return {
      valid: true,
      ...yamlSpec,
      title: null,
      apiVersion: null,
    };
  }
  return { valid: false, format: "unknown" };
}

function expectedFormats(source) {
  return new Set(asList(source.format || source.formats || "openapi").map((item) => String(item)));
}

function formatAllowed(source, actualFormat) {
  const expected = expectedFormats(source);
  return expected.has(actualFormat) || expected.has("openapi_or_swagger") && ["openapi", "swagger"].includes(actualFormat);
}

function specFileName(spec, extension) {
  const normalizedExtension = extension === ".yml" ? ".yaml" : extension;
  if (spec.format === "google_discovery") return `discovery${normalizedExtension === ".yaml" ? ".json" : normalizedExtension}`;
  return `openapi${normalizedExtension}`;
}

function docsExtension(url, contentType) {
  const pathExt = extname(new URL(url).pathname).toLowerCase();
  if ([".html", ".htm", ".pdf", ".json", ".yaml", ".yml", ".xml", ".edmx", ".wsdl"].includes(pathExt)) {
    if (pathExt === ".htm") return ".html";
    if (pathExt === ".yml") return ".yaml";
    return pathExt;
  }
  if (contentType?.includes("pdf")) return ".pdf";
  if (contentType?.includes("json")) return ".json";
  if (contentType?.includes("yaml") || contentType?.includes("yml")) return ".yaml";
  if (contentType?.includes("xml")) return ".xml";
  return ".html";
}

async function removeStaleContractFiles(systemDir, keepFile) {
  for (const file of ["openapi.json", "openapi.yaml", "discovery.json"]) {
    if (file === keepFile) continue;
    await unlink(join(systemDir, file)).catch((error) => {
      if (error.code !== "ENOENT") throw error;
    });
  }
}

async function readJson(path) {
  return JSON.parse(await readFile(path, "utf8"));
}

async function writeJson(path, value) {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, `${JSON.stringify(value, null, 2)}\n`);
}

function candidateUrls(source) {
  return [...asList(source.url), ...asList(source.urls), ...asList(source.candidates)]
    .map((candidate) => String(candidate || "").trim())
    .filter(Boolean);
}

function docsUrls(source) {
  return [...asList(source.docs), ...asList(source.docsUrls)]
    .map((candidate) => String(candidate || "").trim())
    .filter(Boolean);
}

async function fetchWithTimeout(url, timeoutMs) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      headers: {
        accept: "application/json, application/yaml, text/yaml, text/plain;q=0.8, */*;q=0.5",
        "user-agent": "ge-agent-factory-openapi-cache/1.0",
      },
      signal: controller.signal,
    });
    const body = Buffer.from(await response.arrayBuffer());
    return {
      ok: response.ok,
      status: response.status,
      statusText: response.statusText,
      contentType: response.headers.get("content-type") || "",
      body,
    };
  } finally {
    clearTimeout(timer);
  }
}

async function downloadDocs(source, { systemDir, timeoutMs }) {
  const urls = docsUrls(source);
  if (!urls.length) return null;
  const results = [];
  for (let index = 0; index < urls.length; index += 1) {
    const url = urls[index];
    try {
      const response = await fetchWithTimeout(url, timeoutMs);
      const extension = docsExtension(url, response.contentType);
      const file = urls.length === 1 ? `docs${extension}` : `docs-${index + 1}${extension}`;
      if (response.ok) {
        await writeFile(join(systemDir, file), response.body);
      }
      results.push({
        url,
        ok: response.ok,
        status: response.status,
        statusText: response.statusText,
        contentType: response.contentType,
        file: response.ok ? file : null,
        bytes: response.ok ? response.body.length : 0,
        sha256: response.ok ? sha256(response.body) : null,
      });
    } catch (error) {
      results.push({ url, ok: false, error: error.message });
    }
  }
  return results.length === 1 ? results[0] : results;
}

function docsOk(docs) {
  if (Array.isArray(docs)) return docs.some((item) => item?.ok);
  return Boolean(docs?.ok);
}

async function downloadSource(source, { outDir, refresh, timeoutMs }) {
  const systemDir = join(outDir, source.systemId);
  await mkdir(systemDir, { recursive: true });

  const metadataPath = join(systemDir, "source.json");
  const urls = candidateUrls(source);
  const baseMetadata = {
    systemId: source.systemId,
    displayName: source.displayName,
    status: source.status || (urls.length ? "downloadable" : "docs_only"),
    provider: source.provider || "vendor",
    license: source.license || "unknown",
    expectedFormats: [...expectedFormats(source)],
    docs: docsUrls(source),
    notes: source.notes || null,
    fetchedAt: new Date().toISOString(),
  };
  const docs = await downloadDocs(source, { systemDir, timeoutMs });

  if (!urls.length || source.status === "docs_only" || source.status === "manual_required" || source.status === "auth_required") {
    await writeJson(metadataPath, {
      ...baseMetadata,
      cached: false,
      docsCache: docs,
      reason: source.status === "auth_required"
        ? "Spec requires authenticated vendor access."
        : source.status === "manual_required"
          ? "No official public machine-readable OpenAPI source is declared yet."
          : "Official docs are declared, but no public machine-readable OpenAPI source is declared yet.",
    });
    return { systemId: source.systemId, status: baseMetadata.status, cached: false, docs: docsUrls(source), docsCached: docsOk(docs) };
  }

  const prior = await readJson(metadataPath).catch(() => null);
  if (!refresh && prior?.cached && prior?.file) {
    if (docs && docs.ok) {
      await writeJson(metadataPath, { ...prior, fetchedAt: baseMetadata.fetchedAt, docsCache: docs });
    }
    return { systemId: source.systemId, status: "cached", cached: true, file: join(systemDir, prior.file), url: prior.url, docsCached: docsOk(docs) || docsOk(prior.docsCache) };
  }

  const attempts = [];
  for (const url of urls) {
    try {
      const response = await fetchWithTimeout(url, timeoutMs);
      attempts.push({
        url,
        ok: response.ok,
        status: response.status,
        statusText: response.statusText,
        contentType: response.contentType,
        bytes: response.body.length,
      });
      if (!response.ok) continue;
      const spec = classifySpec(response.body, response.contentType);
      attempts[attempts.length - 1].spec = spec;
      if (!spec.valid || !formatAllowed(source, spec.format)) continue;
      const extension = inferExtension(url, response.contentType);
      const file = specFileName(spec, extension);
      await removeStaleContractFiles(systemDir, file);
      await writeFile(join(systemDir, file), response.body);
      const metadata = {
        ...baseMetadata,
        status: "downloaded",
        cached: true,
        url,
        file,
        bytes: response.body.length,
        contentType: response.contentType,
        sha256: sha256(response.body),
        spec,
        docsCache: docs,
        attempts,
      };
      await writeJson(metadataPath, metadata);
      return { systemId: source.systemId, status: "downloaded", cached: true, file: join(systemDir, file), url, docsCached: docsOk(docs) };
    } catch (error) {
      attempts.push({ url, ok: false, error: error.message });
    }
  }

  await writeJson(metadataPath, {
    ...baseMetadata,
    status: "download_failed",
    cached: false,
    docsCache: docs,
    attempts,
  });
  return { systemId: source.systemId, status: "download_failed", cached: false, attempts, docsCached: docsOk(docs) };
}

async function main() {
  const flags = parseArgs(process.argv.slice(2));
  const manifestPath = resolve(flags.manifest || DEFAULT_MANIFEST);
  const outDir = resolve(flags.out || DEFAULT_OUT_DIR);
  const manifest = await readJson(manifestPath);
  if (flags.validateCoverage === "true") {
    const registry = await readJson(resolve(flags.registry || DEFAULT_REGISTRY));
    const sourceIds = new Set((manifest.sources || []).map((source) => source.systemId));
    const simulatorIds = new Set((registry.simulators || []).map((simulator) => simulator.id));
    const missingSources = [...simulatorIds].filter((id) => !sourceIds.has(id)).sort();
    const staleSources = [...sourceIds].filter((id) => !simulatorIds.has(id)).sort();
    const coverage = { ok: missingSources.length === 0 && staleSources.length === 0, missingSources, staleSources };
    if (!coverage.ok) {
      console.error(JSON.stringify(coverage, null, 2));
      process.exit(2);
    }
  }
  const requested = flags.system ? new Set(String(flags.system).split(",").map((item) => item.trim()).filter(Boolean)) : null;
  const sources = (manifest.sources || []).filter((source) => !requested || requested.has(source.systemId));
  if (!sources.length) throw new Error(`No OpenAPI source entries matched ${flags.system || basename(manifestPath)}`);

  await mkdir(outDir, { recursive: true });
  const results = [];
  for (const source of sources) {
    results.push(await downloadSource(source, {
      outDir,
      refresh: flags.refresh === "true",
      timeoutMs: Number(flags.timeoutMs || 30000),
    }));
  }

  const report = {
    ok: results.every((result) => result.status !== "download_failed"),
    manifest: manifestPath,
    outDir,
    totals: {
      entries: results.length,
      downloaded: results.filter((result) => result.status === "downloaded").length,
      cached: results.filter((result) => result.status === "cached").length,
      docsOnly: results.filter((result) => ["docs_only", "manual_required", "auth_required"].includes(result.status)).length,
      docsCached: results.filter((result) => result.docsCached).length,
      failed: results.filter((result) => result.status === "download_failed").length,
    },
    results,
  };
  console.log(JSON.stringify(report, null, 2));
  if (flags.check === "true" && !report.ok) process.exit(2);
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exit(1);
});
