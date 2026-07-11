import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { readJsonAsync } from "@ge/std/json-io";
import { buildSpecCodeTrace, candidateIntentToolNames } from "./spec-code-trace.js";
import { DATA_PATHS, REQUIRED_WORKSPACE_FILES, WORKSPACE_PATHS } from "./workspace-contract.js";
import { DEFAULT_AGENT_MODEL } from "./known-models.js";

function readJson(path, fallback = null) {
  return readJsonAsync(path, fallback, { rethrowUnexpected: true });
}

function check(id, ok, message, detail = {}) {
  return { id, ok: Boolean(ok), level: ok ? "ok" : "error", message, ...detail };
}

function functionSignature(text, name) {
  const match = text.match(new RegExp(`(?:async\\s+)?def\\s+${name}\\s*\\(([^)]*)\\)\\s*(?:->\\s*[^:]+)?\\s*:`));
  return match ? match[1] : "";
}

function signatureHasParams(signature, params) {
  return params.every((param) => new RegExp(`(?:^|[,\\s])${param}\\s*(?::|=|,|$)`).test(signature));
}

function isBypassRefusalEval(evalSpec) {
  const text = [
    evalSpec?.id,
    evalSpec?.prompt,
    ...(evalSpec?.expectedBehaviors || []),
    ...(evalSpec?.forbiddenBehaviors || []),
  ].join(" ");
  return /(skip|bypass).{0,80}(evidence|policy|compliance|approval|source|check)|take responsibility|refus/i.test(text);
}

export async function validateWorkspaceFiles(workspaceDir) {
  return REQUIRED_WORKSPACE_FILES.map((rel) => check(`file:${rel}`, existsSync(join(workspaceDir, rel)), `${rel} exists`, { path: rel }));
}

export async function validateMockData(workspaceDir) {
  const manifest = await readJson(join(workspaceDir, WORKSPACE_PATHS.fixtureManifest), null);
  const schema = await readJson(join(workspaceDir, WORKSPACE_PATHS.schema), null);
  const useCaseSpec = await readJson(join(workspaceDir, WORKSPACE_PATHS.useCaseSpec), null);
  if (!manifest) return [check("mock:manifest", false, "fixtures/manifest.json exists")];
  const checks = [
    check("mock:tables_present", Array.isArray(manifest.tables) && manifest.tables.length > 0, "fixture manifest has tables", { count: manifest.tables?.length || 0 }),
    check("spec:usecase_present", Boolean(useCaseSpec), "mock_systems/usecase-spec.json exists"),
    check("spec:systems_present", Array.isArray(manifest.systems) && manifest.systems.length > 0, "manifest has canonical source systems", { count: manifest.systems?.length || 0 }),
  ];
  const systems = new Set((manifest.systems || []).map((system) => system.id).filter(Boolean));
  const rowsByTable = {};

  for (const table of manifest.tables || []) {
    const tableId = table.name || table.path || "table";
    const relPath = table.jsonPath || table.path;
    const rows = relPath ? await readJson(join(workspaceDir, "fixtures", relPath), null) : null;
    checks.push(check(`mock:${tableId}:file`, Array.isArray(rows), `${tableId} fixture file loads`, { path: relPath }));
    if (!Array.isArray(rows)) continue;
    rowsByTable[tableId] = rows;
    checks.push(check(`mock:${tableId}:rows`, rows.length === table.rowCount && rows.length > 0, `${tableId} row count matches manifest`, { expected: table.rowCount, actual: rows.length }));
    const minRows = schema?.rowPolicy?.minimumRowsPerEntity || useCaseSpec?.rowPolicy?.minimumRowsPerEntity || 1;
    checks.push(check(`mock:${tableId}:row_policy`, rows.length >= minRows, `${tableId} meets minimum row policy`, { minimum: minRows, actual: rows.length }));
    checks.push(check(`spec:${tableId}:source_system`, Boolean(table.sourceSystem && table.sourceSystemId), `${tableId} maps to a named source system`, { sourceSystem: table.sourceSystem, sourceSystemId: table.sourceSystemId }));
    if (table.sourceSystemId) {
      checks.push(check(`spec:${tableId}:source_system_registered`, systems.has(table.sourceSystemId), `${tableId} source system is registered in manifest`, { sourceSystemId: table.sourceSystemId }));
    }
    const pk = table.primaryKey || "id";
    const values = rows.map((row) => row?.[pk]).filter((value) => value !== undefined && value !== null && value !== "");
    checks.push(check(`mock:${tableId}:primary_key_present`, values.length === rows.length, `${tableId}.${pk} present on every row`, { primaryKey: pk }));
    checks.push(check(`mock:${tableId}:primary_key_unique`, new Set(values).size === values.length, `${tableId}.${pk} values are unique`, { primaryKey: pk }));
    for (const col of table.columns || []) {
      const missing = rows.filter((row) => row[col.name] === undefined || row[col.name] === null || row[col.name] === "").length;
      checks.push(check(`mock:${tableId}:column:${col.name}`, missing < rows.length, `${tableId}.${col.name} has data`, { missing, rows: rows.length }));
    }
  }

  for (const tableDef of schema?.tables || []) {
    const rows = rowsByTable[tableDef.name] || [];
    for (const col of tableDef.columns || []) {
      if (col.type !== "ref" || !col.ref) continue;
      const [refTable, refField = "id"] = col.ref.split(".");
      const refRows = rowsByTable[refTable] || [];
      const refValues = new Set(refRows.map((row) => row?.[refField]).filter((value) => value !== undefined && value !== null && value !== ""));
      const missing = rows.filter((row) => row?.[col.name] && !refValues.has(row[col.name])).length;
      checks.push(check(`integrity:${tableDef.name}.${col.name}`, missing === 0 && refValues.size > 0, `${tableDef.name}.${col.name} references ${col.ref}`, { missing, referencedRows: refValues.size }));
    }
  }

  for (const doc of manifest.documents || []) {
    checks.push(check(`mock:document:${doc.id}`, existsSync(join(workspaceDir, "fixtures", doc.path || "")), `${doc.id} document exists`, { path: doc.path }));
    checks.push(check(`spec:document:${doc.id}:content`, (doc.wordCount || 0) >= 60, `${doc.id} has substantive document content`, { wordCount: doc.wordCount || 0 }));
  }

  return checks;
}

export async function validateAgentContract(workspaceDir) {
  const agentPath = join(workspaceDir, WORKSPACE_PATHS.agent);
  const toolsPath = join(workspaceDir, WORKSPACE_PATHS.tools);
  const pyprojectPath = join(workspaceDir, WORKSPACE_PATHS.pyproject);
  const useCaseSpec = await readJson(join(workspaceDir, WORKSPACE_PATHS.useCaseSpec), null);
  const manifest = await readJson(join(workspaceDir, WORKSPACE_PATHS.fixtureManifest), null);
  const agentText = existsSync(agentPath) ? await readFile(agentPath, "utf8") : "";
  const toolsText = existsSync(toolsPath) ? await readFile(toolsPath, "utf8") : "";
  const pyprojectText = existsSync(pyprojectPath) ? await readFile(pyprojectPath, "utf8") : "";
  const behavior = useCaseSpec?.behaviorContract || null;
  const tables = manifest?.tables || useCaseSpec?.dataContracts || [];
  const toolIntents = Array.isArray(behavior?.toolIntents) ? behavior.toolIntents : [];
  const actionIntents = toolIntents.filter((intent) => ["action", "notification", "evidence_lookup", "calculation"].includes(intent.kind));
  const beforeToolSignature = functionSignature(agentText, "enforce_tool_contract");
  const afterToolSignature = functionSignature(agentText, "capture_tool_evidence");

  const checks = [
    check("agent:entrypoint", /root_agent\s*=/.test(agentText), "app/agent.py defines root_agent"),
    check("agent:uses_tools", /source_adapters|mock_tools/.test(agentText), "agent wires source adapters"),
    check("agent:tools_list", /source_adapters\s*=|mock_tools\s*=/.test(toolsText), "app/tools.py exports source adapters"),
    check("agent:semantic_model_tool", /def\s+describe_data_model\s*\(/.test(toolsText) && /FunctionTool\(func=describe_data_model\)/.test(toolsText), "app/tools.py exposes describe_data_model for semantic grounding"),
    check("agent:no_generic_mock_naming", !/list_mock_systems|query_mock_|mock data source/i.test(toolsText), "tools avoid generic mock-source naming"),
    check("agent:no_google_auth_required", !/google\.auth\.default|GOOGLE_GENAI_USE_VERTEXAI/.test(agentText + toolsText), "local mock agent does not require Google auth"),
    check("agent:pyproject_adk", /google-adk/.test(pyprojectText), "pyproject declares google-adk dependency"),
    // Review point: a generated agent must run on the model the workspace was
    // BUILT with — recorded in its own manifest (useCaseSpec.agentQualityPlan.
    // adkCapabilities.model), falling back to DEFAULT_AGENT_MODEL. Reading the
    // workspace's own record (not process.env.GE_AGENT_MODEL) keeps validity
    // self-contained: a fixed workspace validates the same regardless of the
    // validator's environment. The check id keeps its historical name for
    // ledger/skill-doc continuity.
    ((expectedModel, foundModel) => check(
      "agent:model_is_gemini_3_5_flash",
      foundModel === expectedModel,
      `agent.py uses the workspace's declared model (${expectedModel})`,
      { foundModel, expectedModel },
    ))(
      String(useCaseSpec?.agentQualityPlan?.adkCapabilities?.model || DEFAULT_AGENT_MODEL).trim(),
      agentText.match(/model\s*=\s*["']([^"']+)["']/)?.[1] || null,
    ),
    // Review point: never ship the 2048 boilerplate. Unset (model default) is fine;
    // a deliberate, use-case-sized bound is fine. Only an exact 2048 fails.
    check(
      "agent:max_output_tokens_not_boilerplate",
      !/max_output_tokens\s*=\s*2048\b/.test(agentText),
      "agent.py max_output_tokens is use-case sized or unset (not the 2048 boilerplate)",
      { foundMaxOutputTokens: agentText.match(/max_output_tokens\s*=\s*(\d+)/)?.[1] || "unset" },
    ),
    check("behavior:contract_present", Boolean(behavior), "use case has a behavior contract"),
  ];

  if (behavior) {
    const nonQueryIntents = toolIntents.filter((intent) => intent && intent.kind && intent.kind !== "query");
    const escalations = Array.isArray(behavior.escalationRules) ? behavior.escalationRules : [];
    const refusals = Array.isArray(behavior.refusalRules) ? behavior.refusalRules : [];
    const evals = Array.isArray(behavior.goldenEvals) ? behavior.goldenEvals : [];
    const intentNames = new Set(toolIntents.flatMap((intent) => candidateIntentToolNames(intent, tables)));
    const evalsMissingTools = evals.filter((ev) => (!Array.isArray(ev.expectedToolCalls) || ev.expectedToolCalls.length === 0) && !isBypassRefusalEval(ev));
    const evalsWithUnknownTools = evals
      .map((ev) => ({ id: ev.id, unknown: (ev.expectedToolCalls || []).filter((name) => !intentNames.has(name)) }))
      .filter((entry) => entry.unknown.length > 0);
    const genericInstructionStub = /Use the fixture-backed source adapters to inspect available data\. Never invent data\./.test(agentText);

    checks.push(
      check("behavior:role", String(behavior.role || "").length >= 20, "behavior contract declares a domain-specific role"),
      check("behavior:objective", String(behavior.primaryObjective || "").length >= 60, "behavior contract declares a substantive primary objective"),
      check("behavior:tool_intents", toolIntents.length >= 3, "behavior contract declares multiple tool intents", { count: toolIntents.length }),
      check("behavior:non_query_intent", nonQueryIntents.length >= 1, "behavior contract has at least one action/notification/evidence/calculation intent", { nonQueryCount: nonQueryIntents.length }),
      check("behavior:evidence_requirements", Array.isArray(behavior.evidenceRequirements) && behavior.evidenceRequirements.length > 0, "behavior contract declares evidence requirements"),
      check("behavior:escalation_rules", escalations.length >= 1, "behavior contract defines at least one escalation/refusal trigger", { count: escalations.length }),
      check("behavior:refusal_rules", refusals.length >= 1, "behavior contract lists hard guardrails", { count: refusals.length }),
      check("behavior:golden_evals", evals.length >= 1, "behavior contract declares golden evals"),
      check("behavior:evals_have_tool_calls", evalsMissingTools.length === 0, "every non-refusal golden eval declares expectedToolCalls", { missing: evalsMissingTools.map((ev) => ev.id || "?") }),
      check("behavior:evals_reference_intents", evalsWithUnknownTools.length === 0, "golden eval expectedToolCalls all reference declared tool intents", { offenders: evalsWithUnknownTools }),
      check("agent:instruction_uses_objective", agentText.includes(String(behavior.primaryObjective || "").slice(0, 40)), "agent instruction includes behavior objective"),
      check("agent:contract_instruction_not_generic", !genericInstructionStub, "agent.py uses the contract-derived instruction, not the generic stub"),
      check("agent:contract_sections", /PRIMARY OBJECTIVE/.test(agentText) && /TOOL PLAYBOOK/.test(agentText), "agent.py instruction contains contract sections (PRIMARY OBJECTIVE, TOOL PLAYBOOK)"),
      check("spec:agent_quality_plan", Boolean(useCaseSpec?.agentQualityPlan?.adkCapabilities && useCaseSpec?.agentQualityPlan?.evalPlan), "use case spec includes agent quality plan metadata"),
      check("agent:advanced_adk_config", /generate_content_config\s*=/.test(agentText) && /output_key\s*=/.test(agentText) && /description\s*=/.test(agentText), "agent.py configures deterministic generation, output state, and delegation description"),
      check("agent:state_callbacks", /before_agent_callback\s*=/.test(agentText) && /before_tool_callback\s*=/.test(agentText) && /after_tool_callback\s*=/.test(agentText), "agent.py wires ADK callbacks for state, safety, and evidence capture"),
      check("agent:before_tool_callback_signature", signatureHasParams(beforeToolSignature, ["tool", "args", "tool_context"]) || /\*\*kwargs/.test(beforeToolSignature), "before_tool_callback accepts ADK tool, args, and tool_context keyword arguments", { signature: beforeToolSignature }),
      check("agent:after_tool_callback_signature", (signatureHasParams(afterToolSignature, ["tool", "args", "tool_context"]) && (/tool_response/.test(afterToolSignature) || /\*\*kwargs/.test(afterToolSignature))) || /\*\*kwargs/.test(afterToolSignature), "after_tool_callback accepts ADK tool response and tool_context keyword arguments", { signature: afterToolSignature }),
    );
    for (const intent of actionIntents) {
      const candidates = candidateIntentToolNames(intent, tables);
      const implementedName = candidates.find((name) => toolsText.includes(`def ${name}`));
      checks.push(check(`agent:contract_tool:${intent.name}`, Boolean(implementedName), `${intent.name} is implemented as a generated tool`, { candidates, implementedName: implementedName || null }));
    }
    for (const intent of toolIntents) {
      if (!intent?.name) continue;
      const candidates = candidateIntentToolNames(intent, tables);
      const implementedName = candidates.find((name) => toolsText.includes(`def ${name}`));
      const signature = implementedName ? functionSignature(toolsText, implementedName) : "";
      checks.push(check(`agent:tool_intent:${intent.name}`, Boolean(implementedName), `${intent.name} declared in behaviorContract is implemented`, { candidates, implementedName: implementedName || null }));
      for (const input of intent.requiredInputs || []) {
        const hasInput = signatureHasParams(signature, [input]) || toolsText.includes(`${input}:`) || toolsText.includes(`${input}=`) || toolsText.includes(`${input}_`);
        checks.push(check(`agent:tool_input:${intent.name}:${input}`, hasInput, `${intent.name} exposes required input ${input}`, { implementedName: implementedName || null, signature }));
      }
    }

    const goldenPath = join(workspaceDir, WORKSPACE_PATHS.goldenEvals);
    const golden = existsSync(goldenPath) ? await readJson(goldenPath, null) : null;
    checks.push(check("evals:golden_file", Boolean(golden && Array.isArray(golden.evals) && golden.evals.length > 0), "evals/golden.json exists with at least one eval", { path: WORKSPACE_PATHS.goldenEvals }));
    checks.push(check("evals:agents_cli_evalset", existsSync(join(workspaceDir, WORKSPACE_PATHS.behaviorEvalset)), "agents-cli evalset exists"));
    checks.push(check("evals:agents_cli_config", existsSync(join(workspaceDir, WORKSPACE_PATHS.evalConfig)), "agents-cli eval config exists"));
    checks.push(check("evals:optimization_config", existsSync(join(workspaceDir, WORKSPACE_PATHS.optimizationConfig)), "agents-cli optimization config exists"));
  }

  return checks;
}

export async function validateSourceIntegration(workspaceDir) {
  const planPath = join(workspaceDir, DATA_PATHS.sourceIntegrationPlan);
  const registryPath = join(workspaceDir, DATA_PATHS.toolRegistryPlan);
  const plan = await readJson(planPath, null);
  const registry = await readJson(registryPath, null);
  const dataPlan = await readJson(join(workspaceDir, DATA_PATHS.dataPlan), null);
  const dataPlanningStarted = Boolean(dataPlan?.sources?.length || existsSync(join(workspaceDir, DATA_PATHS.packageIndex)));
  if (!plan) return [check("integration:plan", !dataPlanningStarted, dataPlanningStarted ? `${DATA_PATHS.sourceIntegrationPlan} exists` : "source integration plan not required until data packaging")];
  const sources = Array.isArray(plan.sources) ? plan.sources : [];
  const firstParty = plan.registries?.toolRegistry?.firstPartyMcpServices || [];
  const customServers = plan.registries?.toolRegistry?.customMcpServers || [];
  const requiredApis = plan.googleCloud?.requiredApis || [];
  const customNeedsAdapter = sources.some((source) => source.mcpStrategy?.customMcpAdapter);
  return [
    check("integration:plan", true, `${DATA_PATHS.sourceIntegrationPlan} exists`, { path: DATA_PATHS.sourceIntegrationPlan }),
    check("integration:sources", sources.length > 0, "source integration plan covers at least one source system", { count: sources.length }),
    check("integration:required_apis", requiredApis.length > 0, "source integration plan declares required Google Cloud APIs", { count: requiredApis.length }),
    check("integration:tool_registry_plan", Boolean(registry), `${DATA_PATHS.toolRegistryPlan} exists`, { path: DATA_PATHS.toolRegistryPlan }),
    check("integration:first_party_or_custom_mcp", firstParty.length + customServers.length > 0, "plan declares first-party MCP services or custom MCP registry targets", { firstParty: firstParty.length, customServers: customServers.length }),
    check("integration:custom_mcp_adapter_artifacts", !customNeedsAdapter || existsSync(join(workspaceDir, "mock_data", "apis", "mcp-tools.json")), "custom MCP sources have mock_data/apis/mcp-tools.json", { required: customNeedsAdapter }),
  ];
}

export async function validateSpecCodeTrace(workspaceDir) {
  const trace = await buildSpecCodeTrace(workspaceDir);
  const checks = [
    check("trace:artifact", trace.kind === "ge.spec_code_trace", "spec-code trace can be built"),
    check("trace:behavior_contract", !trace.blockers.includes("missing behaviorContract"), "trace has behavior contract source of truth"),
    check("trace:intent_coverage", trace.coverage.requiredIntentCoverage === 1, "all behaviorContract tool intents are implemented, registered, and represented", { coverage: trace.coverage.requiredIntentCoverage, blockers: trace.blockers.filter((item) => item.startsWith("intent not fully implemented:")) }),
    check("trace:instruction_coverage", trace.coverage.instructionCoverage === 1, "agent instruction includes required behavior contract sections", { coverage: trace.coverage.instructionCoverage }),
    check("trace:eval_assets", trace.evals.goldenJsonPresent && trace.evals.evalsetPresent, "golden eval and agents-cli evalset are present", { goldenPath: WORKSPACE_PATHS.goldenEvals, evalsetPath: WORKSPACE_PATHS.behaviorEvalset }),
    check("trace:callbacks", trace.callbacks.beforeToolWired && trace.callbacks.afterToolWired, "ADK tool callbacks are wired"),
  ];
  return { trace, checks };
}

export async function runWorkspaceValidation(workspaceDir) {
  const traceResult = await validateSpecCodeTrace(workspaceDir);
  const groups = {
    files: await validateWorkspaceFiles(workspaceDir),
    mockData: await validateMockData(workspaceDir),
    agent: await validateAgentContract(workspaceDir),
    sourceIntegration: await validateSourceIntegration(workspaceDir),
    specCodeTrace: traceResult.checks,
  };
  const checks = Object.entries(groups).flatMap(([group, items]) => items.map((item) => ({ group, ...item })));
  return {
    ok: checks.every((item) => item.ok),
    checks,
    specCodeTrace: traceResult.trace,
    summary: Object.fromEntries(Object.entries(groups).map(([group, items]) => [
      group,
      { passed: items.filter((item) => item.ok).length, total: items.length },
    ])),
  };
}
