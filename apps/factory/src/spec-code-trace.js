import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { readJsonAsync } from "@ge/std/json-io";
import { snakeCase } from "@ge/std/naming";
import { WORKSPACE_PATHS } from "./workspace-contract.js";

function readJson(path, fallback = null) {
  return readJsonAsync(path, fallback, { rethrowUnexpected: true });
}

async function readText(path) {
  try {
    return await readFile(path, "utf8");
  } catch (error) {
    if (error?.code === "ENOENT") return "";
    throw error;
  }
}

function safePyName(value) {
  const name = snakeCase(value);
  return /^[a-z_]/.test(name) ? name : `tool_${name || "generated"}`;
}

function tableToolName(table) {
  const source = snakeCase(table?.sourceSystemId || "source");
  const tableName = snakeCase(table?.name || "records");
  const dedupedTable = tableName === source || tableName.startsWith(`${source}_`)
    ? tableName.slice(source.length).replace(/^_+/, "") || "records"
    : tableName;
  return snakeCase(`${source}_${dedupedTable}`);
}

function queryIntentTableName(intent) {
  const source = snakeCase(intent?.sourceSystemId || "");
  const name = snakeCase(intent?.name || "").replace(/^query_/, "");
  if (source && name.startsWith(`${source}_`)) return name.slice(source.length + 1) || "records";
  return name || "records";
}

export function canonicalIntentToolName(intent, tables = []) {
  if (!intent?.name) return "";
  if (intent.kind !== "query") return safePyName(intent.name);
  const source = snakeCase(intent.sourceSystemId || "");
  const tableName = queryIntentTableName(intent);
  const matchingTable = tables.find((table) => (
    snakeCase(table.sourceSystemId || "") === source
    && snakeCase(table.name || "") === tableName
  ));
  if (matchingTable) return `query_${tableToolName(matchingTable)}`;
  const sameNameTables = tables.filter((table) => snakeCase(table.name || "") === tableName);
  if (sameNameTables.length === 1) return `query_${tableToolName(sameNameTables[0])}`;
  return safePyName(intent.name);
}

export function candidateIntentToolNames(intent, tables = []) {
  const names = [
    safePyName(intent?.name),
    canonicalIntentToolName(intent, tables),
  ].filter(Boolean);
  return [...new Set(names)];
}

function functionSignature(text, name) {
  const match = text.match(new RegExp(`(?:async\\s+)?def\\s+${name}\\s*\\(([^)]*)\\)\\s*(?:->\\s*[^:]+)?\\s*:`));
  return match ? match[1] : "";
}

function signatureIncludesInput(signature, input) {
  const name = snakeCase(input);
  return new RegExp(`(?:^|[,\\s])${name}\\s*(?::|=|,|$)`).test(signature);
}

function includesAll(text, values = []) {
  return values.every((value) => !value || text.includes(String(value)));
}

function regexIncludes(text, pattern) {
  return pattern.test(text);
}

export async function buildSpecCodeTrace(workspaceDir) {
  const spec = await readJson(join(workspaceDir, WORKSPACE_PATHS.useCaseSpec), null);
  const manifest = await readJson(join(workspaceDir, WORKSPACE_PATHS.fixtureManifest), null);
  const golden = await readJson(join(workspaceDir, WORKSPACE_PATHS.goldenEvals), null);
  const evalset = await readJson(join(workspaceDir, WORKSPACE_PATHS.behaviorEvalset), null);
  const agentText = await readText(join(workspaceDir, WORKSPACE_PATHS.agent));
  const toolsText = await readText(join(workspaceDir, WORKSPACE_PATHS.tools));
  const smokeText = await readText(join(workspaceDir, WORKSPACE_PATHS.smokeTest));

  const behavior = spec?.behaviorContract || spec?.generationSpec?.behaviorContract || null;
  const tables = manifest?.tables || spec?.dataContracts || [];
  const toolIntents = Array.isArray(behavior?.toolIntents) ? behavior.toolIntents.filter((intent) => intent?.name) : [];
  const goldenEvals = Array.isArray(behavior?.goldenEvals) ? behavior.goldenEvals : [];
  const expectedCalls = new Set([
    ...(Array.isArray(golden?.evals) ? golden.evals : []).flatMap((ev) => ev.expectedToolCalls || []),
    ...goldenEvals.flatMap((ev) => ev.expectedToolCalls || []),
  ].map(safePyName));

  const intentRows = toolIntents.map((intent) => {
    const toolNameCandidates = candidateIntentToolNames(intent, tables);
    const implementedToolName = toolNameCandidates.find((name) => regexIncludes(toolsText, new RegExp(`(?:async\\s+)?def\\s+${name}\\s*\\(`))) || "";
    const registeredToolName = toolNameCandidates.find((name) => regexIncludes(toolsText, new RegExp(`FunctionTool\\(func=${name}\\)`))) || "";
    const canonicalToolName = implementedToolName || registeredToolName || toolNameCandidates[0] || "";
    const signature = functionSignature(toolsText, canonicalToolName);
    const implemented = Boolean(implementedToolName);
    const registered = Boolean(registeredToolName);
    const instructionMention = toolNameCandidates.some((name) => agentText.includes(name)) || agentText.includes(intent.name);
    const coveredByGoldenEval = toolNameCandidates.some((name) => expectedCalls.has(name));
    const coveredBySmokeTest = toolNameCandidates.some((name) => smokeText.includes(name)) || smokeText.includes(intent.name);
    const requiredInputs = (intent.requiredInputs || []).map((input) => ({
      name: snakeCase(input),
      inSignature: signatureIncludesInput(signature, input),
    }));
    const produced = (intent.produces || []).map((name) => ({
      name,
      inToolBody: toolsText.includes(String(name)),
    }));
    const evidence = (intent.evidenceEmitted || intent.evidence || []).map((name) => ({
      name,
      inToolBody: toolsText.includes(String(name)),
    }));
    const requiredOk = implemented
      && registered
      && instructionMention
      && requiredInputs.every((input) => input.inSignature)
      && produced.every((item) => item.inToolBody)
      && evidence.every((item) => item.inToolBody);
    return {
      intentName: intent.name,
      kind: intent.kind || "unknown",
      sourceSystemId: intent.sourceSystemId || null,
      canonicalToolName,
      toolNameCandidates,
      implemented,
      registered,
      instructionMention,
      coveredByGoldenEval,
      coveredBySmokeTest,
      requiredInputs,
      produces: produced,
      evidence,
      requiredOk,
    };
  });

  const instructionSections = [
    "PRIMARY OBJECTIVE",
    "TOOL PLAYBOOK",
    "EVIDENCE YOU MUST CITE",
    "ESCALATION & REFUSAL TRIGGERS",
    "HARD GUARDRAILS",
  ].map((section) => ({ section, present: agentText.includes(section) }));
  const callbackTrace = {
    beforeToolSignature: functionSignature(agentText, "enforce_tool_contract"),
    afterToolSignature: functionSignature(agentText, "capture_tool_evidence"),
    beforeToolWired: agentText.includes("before_tool_callback=enforce_tool_contract"),
    afterToolWired: agentText.includes("after_tool_callback=capture_tool_evidence"),
  };
  const evalTrace = {
    goldenJsonPresent: Boolean(golden?.evals?.length),
    evalsetPresent: Boolean(evalset?.eval_cases?.length),
    goldenEvalCount: golden?.evals?.length || 0,
    evalsetCaseCount: evalset?.eval_cases?.length || 0,
  };
  const totals = {
    intents: intentRows.length,
    requiredIntentsOk: intentRows.filter((row) => row.requiredOk).length,
    goldenEvalCoveredIntents: intentRows.filter((row) => row.coveredByGoldenEval).length,
    smokeCoveredIntents: intentRows.filter((row) => row.coveredBySmokeTest).length,
    instructionSectionsPresent: instructionSections.filter((row) => row.present).length,
    instructionSectionsTotal: instructionSections.length,
  };
  const blockers = [];
  if (!behavior) blockers.push("missing behaviorContract");
  if (!manifest) blockers.push("missing fixtures/manifest.json");
  if (toolIntents.length === 0) blockers.push("no behaviorContract.toolIntents");
  for (const row of intentRows) {
    if (!row.requiredOk) blockers.push(`intent not fully implemented: ${row.intentName}`);
  }
  if (!instructionSections.every((row) => row.present)) blockers.push("agent instruction missing required contract sections");
  if (!callbackTrace.beforeToolWired || !callbackTrace.afterToolWired) blockers.push("ADK tool callbacks not wired");
  if (!evalTrace.goldenJsonPresent) blockers.push("missing evals/golden.json evals");
  if (!evalTrace.evalsetPresent) blockers.push("missing agents-cli behavior evalset");

  const requiredIntentCoverage = totals.intents ? totals.requiredIntentsOk / totals.intents : 0;
  const instructionCoverage = totals.instructionSectionsPresent / totals.instructionSectionsTotal;
  const ok = blockers.length === 0 && requiredIntentCoverage === 1 && instructionCoverage === 1;

  return {
    schemaVersion: 1,
    kind: "ge.spec_code_trace",
    workspace: spec?.id || manifest?.id || null,
    ok,
    generatedAt: new Date().toISOString(),
    sourceOfTruth: {
      useCaseSpec: existsSync(join(workspaceDir, WORKSPACE_PATHS.useCaseSpec)),
      fixtureManifest: existsSync(join(workspaceDir, WORKSPACE_PATHS.fixtureManifest)),
    },
    totals,
    coverage: {
      requiredIntentCoverage,
      instructionCoverage,
      goldenEvalIntentCoverage: totals.intents ? totals.goldenEvalCoveredIntents / totals.intents : 0,
      smokeIntentCoverage: totals.intents ? totals.smokeCoveredIntents / totals.intents : 0,
    },
    instructionSections,
    callbacks: callbackTrace,
    evals: evalTrace,
    intents: intentRows,
    blockers,
    consistency: {
      primaryObjectiveInAgent: includesAll(agentText, [behavior?.primaryObjective?.slice?.(0, 40)].filter(Boolean)),
      roleInAgent: behavior?.role ? agentText.includes(behavior.role) : false,
    },
  };
}
