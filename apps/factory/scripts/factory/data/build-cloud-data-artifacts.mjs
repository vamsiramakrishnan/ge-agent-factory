// Orchestrates the cloud-data packaging step (buildCloudDataArtifacts in the
// former factory.mjs): resolves project/dataset/bucket/prefix, walks the
// fixture manifest through the pure derivers in ./render-cloud-data-plan.mjs
// and ./mcp-tool-descriptors.mjs, and writes every artifact (BigQuery schemas,
// NDJSON rows, the load script, the cloud-data-manifest, the per-agent MCP
// tool manifest, the deploy-plan sidecar) plus the manifest.cloud / pipeline
// cloudDataPlan step markers. Extracted verbatim; factory.mjs still owns
// pipeline state I/O and the ok()/fail() contract, injected as `deps` (same
// pattern as buildAgentQualityPlan elsewhere in this tree) since this
// function is itself the file-writing orchestration layer, not a pure deriver.
import { join, basename } from "node:path";
import { bigQuerySafeName, rowsToNdjson } from "./bigquery-types.mjs";
import { mcpToolDescriptors } from "./mcp-tool-descriptors.mjs";
import { buildCloudDataPlan, buildCloudTableRecord, buildDocumentManifest, renderCloudLoadScript } from "./render-cloud-data-plan.mjs";
import { loadSimulatorRegistry } from "../simulators/registry.mjs";

export async function buildCloudDataArtifacts(dir, flags = {}, deps) {
  const {
    loadPipeline, requireStep, readJson, fail, mkdir, writeJson, writeText,
    savePipeline, manifestPath, fixturesDir, cloudDataDir, deployPlanPath,
    GENERATED_AT,
  } = deps;
  const pipeline = await loadPipeline(dir);
  requireStep(pipeline, "generate");
  const manifest = await readJson(manifestPath(dir), null);
  if (!manifest) fail("No fixture manifest. Run 'factory generate' first.", "GE0003");

  const project = flags.project || "<gcp-project>";
  const location = flags.location || flags.region || "US";
  const scenario = bigQuerySafeName(manifest.id || pipeline.name || basename(dir));
  const dataset = bigQuerySafeName(flags.dataset || `ge_mock_${scenario}`);
  const bucket = flags.bucket || `${project}-factory-${scenario}`.toLowerCase().replace(/[^a-z0-9._-]/g, "-");
  const prefix = (flags.prefix || `factory/${scenario}`).replace(/^\/+|\/+$/g, "");
  const outDir = cloudDataDir(dir);

  await mkdir(join(outDir, "bigquery", "schemas"), { recursive: true });
  await mkdir(join(outDir, "bigquery", "ndjson"), { recursive: true });
  await mkdir(join(outDir, "storage"), { recursive: true });

  const tables = [];
  for (const table of manifest.tables || []) {
    const sourcePath = table.jsonPath || table.path;
    const rows = await readJson(join(fixturesDir(dir), sourcePath), null);
    if (!Array.isArray(rows)) fail(`Cloud data packaging requires JSON fixture rows for ${table.name}`);
    const { schema, schemaPathRel, ndjsonPathRel, record } = buildCloudTableRecord({
      table, rows, project, location, dataset, bucket, prefix, manifestId: manifest.id,
    });
    await writeJson(join(dir, schemaPathRel), schema);
    await writeText(join(dir, ndjsonPathRel), rowsToNdjson(rows));
    tables.push(record);
  }

  const { documentRows, documentManifestSchema } = buildDocumentManifest(manifest, { bucket, prefix });
  await writeJson(join(outDir, "bigquery", "schemas", "documents_manifest.schema.json"), documentManifestSchema);
  await writeText(join(outDir, "bigquery", "ndjson", "documents_manifest.jsonl"), rowsToNdjson(documentRows));

  const scriptPath = join(outDir, "load-to-google-cloud.sh");
  await writeText(scriptPath, renderCloudLoadScript({ project, location, dataset, bucket, prefix, scenario, tables }));

  const plan = buildCloudDataPlan({ scenario, generatedAt: GENERATED_AT, project, location, dataset, bucket, prefix, tables, documentRows, manifest });

  await writeJson(join(outDir, "cloud-data-manifest.json"), plan);

  // Per-agent MCP tool manifest in the shape mcp-service/server.py expects
  // ({ tools: [{name,description,inputSchema}] }). load_data uploads this to
  // gs://<dataBucket>/agents/<id>/mcp-tools.json so the dept MCP service can
  // serve this agent's tools at runtime (resolved via ?agent=<id>).
  await writeJson(join(outDir, "mcp-tools.json"), {
    id: `${scenario}_mcp_tools`,
    generatedAt: plan.generatedAt,
    agentId: manifest.id || scenario,
    simulatorRegistry: {
      path: "apps/factory/simulator-systems/registry.json",
      version: loadSimulatorRegistry().version,
    },
    tools: mcpToolDescriptors(manifest),
  });
  await writeJson(deployPlanPath(dir), {
    ...plan,
    nextCommands: [
      `bash mock_data/cloud/load-to-google-cloud.sh`,
      `factory deploy --dir ${dir} --project ${project} --region ${flags.region || "us-central1"} --target agent_runtime`,
    ],
  });

  manifest.cloud = {
    status: "plan_ready",
    target: "bigquery_and_cloud_storage",
    dataset,
    bucket,
    prefix,
    manifestPath: "mock_data/cloud/cloud-data-manifest.json",
    loadScript: "mock_data/cloud/load-to-google-cloud.sh",
  };
  await writeJson(manifestPath(dir), manifest);

  pipeline.steps.cloudDataPlan = {
    status: "done",
    completedAt: plan.generatedAt,
    target: "bigquery_and_cloud_storage",
    dataset,
    bucket,
    prefix,
  };
  await savePipeline(dir, pipeline);
  return plan;
}
