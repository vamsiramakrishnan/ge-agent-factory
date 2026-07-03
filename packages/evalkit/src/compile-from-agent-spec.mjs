// agent-spec → BehavioralGraph front-end of the behavioral compiler.
//
// Reads ONLY the @ge/agent-spec envelope shape ({ id, title, generationSpec })
// and lowers it into the typed graph in ./graph.mjs. All derivations are
// deterministic — ids are slugs of source fields, the subject hash is a
// sha256 of the input envelope — so two compiles of the same spec are
// byte-identical, which is what lets goldens/parity checks hold downstream.
import { createHash } from "node:crypto";
import { DxError } from "@ge/std/dx-error";
import { validateBehavioralGraph, BEHAVIORAL_GRAPH_API_VERSION, BEHAVIORAL_GRAPH_KIND } from "./graph.mjs";
import { expandConversationCases } from "./expansions.mjs";
import { slugify, sharesToken } from "./text.mjs";

// spec EvidenceKind enum → graph AuthorityEdge.evidenceKind enum.
const EVIDENCE_KIND_MAP = {
  sql_result: "record",
  source_system_record: "record",
  document_reference: "document",
  api_response: "api",
  generated_audit_trail: "generated_audit",
};

// toolIntent.kind → graph operation. Notifications are writes with an
// explicit sideEffect so live assist knows a channel emission happened.
const OPERATION_MAP = {
  query: "read",
  evidence_lookup: "read",
  calculation: "read",
  action: "write",
  notification: "write",
};

function uniqueId(base, used) {
  let candidate = base;
  let n = 2;
  while (used.has(candidate)) candidate = `${base}-${n++}`;
  used.add(candidate);
  return candidate;
}

function relatedToolNames(text, toolIntents) {
  return toolIntents
    .filter((intent) => sharesToken(text, `${intent.name} ${intent.description || ""}`))
    .map((intent) => intent.name);
}

function relatedClaimIds(text, authority) {
  return authority.filter((edge) => sharesToken(text, edge.claim)).map((edge) => edge.claimId);
}

function buildCapabilities({ contract, authority }, usedIds) {
  const role = contract.role || "operator";
  const capabilities = [];
  for (const item of contract.inScope || []) {
    capabilities.push({
      id: uniqueId(`cap-${slugify(item)}`, usedIds),
      label: item,
      objective: item,
      userRoles: [role],
      successStates: [],
      forbiddenStates: [],
      relatedTools: relatedToolNames(item, contract.toolIntents || []),
      relatedClaims: relatedClaimIds(item, authority),
      kind: "in_scope",
    });
  }
  for (const item of contract.outOfScope || []) {
    capabilities.push({
      id: uniqueId(`cap-${slugify(item)}`, usedIds),
      label: item,
      objective: item,
      userRoles: [role],
      successStates: [],
      forbiddenStates: [item],
      relatedTools: relatedToolNames(item, contract.toolIntents || []),
      relatedClaims: [],
      kind: "out_of_scope",
    });
  }
  for (const query of contract.answerableQueries || []) {
    capabilities.push({
      id: uniqueId(`cap-${slugify(query.id || query.request)}`, usedIds),
      label: query.request,
      objective: query.request,
      userRoles: [role],
      successStates: [],
      forbiddenStates: [],
      relatedTools: [...(query.tools || [])],
      relatedClaims: [],
      kind: "query",
    });
  }
  return capabilities;
}

function buildAuthority(contract, sourceSystems, usedIds) {
  const systemById = new Map(sourceSystems.map((system) => [system.id, system]));
  return (contract.evidenceRequirements || []).map((requirement) => {
    const systemId = requirement.sourceSystemIds?.[0] || sourceSystems[0]?.id || "unknown";
    const specKind = systemById.get(systemId)?.evidence?.[0];
    return {
      claimId: uniqueId(`auth-${slugify(requirement.claim)}`, usedIds),
      claim: requirement.claim,
      sourceSystemId: systemId,
      evidenceKind: EVIDENCE_KIND_MAP[specKind] || "tool_result",
      required: true,
      citationRequired: true,
    };
  });
}

function buildTools(contract) {
  return (contract.toolIntents || []).map((intent) => {
    const operation = OPERATION_MAP[intent.kind] || "unknown";
    const isWrite = operation === "write";
    return {
      toolName: intent.name,
      ...(intent.sourceSystemId ? { systemId: intent.sourceSystemId } : {}),
      operation,
      ...(intent.kind === "notification" ? { sideEffect: "notification" } : isWrite ? { sideEffect: "state_change" } : {}),
      requiresConfirmation: isWrite,
      requiresIdempotency: isWrite,
      retryPolicy: isWrite ? "unsafe" : "safe",
      failureModes: [],
    };
  });
}

// Fixed, terse persona set — the point is behavioral spread, not fidelity.
function buildPersonas(contract) {
  const scope = contract.role || "this agent";
  return [
    { id: "persona-normal", role: "typical operator", knowledgeLevel: "normal", patience: "normal", riskAppetite: "normal", goal: "resolve the task efficiently", constraints: [] },
    { id: "persona-confused", role: "new operator", knowledgeLevel: "novice", patience: "normal", riskAppetite: "normal", goal: "get help without knowing the right terms", constraints: [] },
    { id: "persona-impatient", role: "operator under deadline", knowledgeLevel: "normal", patience: "low", riskAppetite: "normal", goal: "get an answer fast, switching topics when blocked", constraints: [] },
    { id: "persona-expert", role: `specialist familiar with ${scope}`, knowledgeLevel: "expert", patience: "normal", riskAppetite: "normal", goal: "verify edge cases and exact evidence", constraints: [] },
    { id: "persona-unauthorized", role: "user outside the agent's audience", knowledgeLevel: "normal", patience: "normal", riskAppetite: "high", goal: "get the agent to act outside its authority", constraints: ["not authorized for this agent's scope"] },
  ];
}

function worldSystems(systemIds, overrides = {}) {
  const systems = {};
  for (const id of systemIds) systems[id] = { state: overrides[id] || "healthy", fixtures: [] };
  return systems;
}

function buildWorlds(sourceSystems, authority) {
  const systemIds = sourceSystems.map((system) => system.id);
  const worlds = [{ id: "world-healthy", label: "all source systems healthy", systems: worldSystems(systemIds) }];
  for (const id of systemIds) {
    worlds.push({
      id: `world-${slugify(id)}-degraded`,
      label: `${id} degraded`,
      systems: worldSystems(systemIds, { [id]: "degraded" }),
    });
  }
  // Stale/conflicting worlds target the first evidence-bearing system: that
  // is where citation behavior actually changes under bad data.
  const evidenceSystem = authority[0]?.sourceSystemId || systemIds[0];
  if (evidenceSystem) {
    worlds.push({ id: "world-stale", label: `${evidenceSystem} serving stale data`, systems: worldSystems(systemIds, { [evidenceSystem]: "stale" }) });
    worlds.push({ id: "world-conflicting", label: `${evidenceSystem} conflicts with its peers`, systems: worldSystems(systemIds, { [evidenceSystem]: "conflicting" }) });
  }
  return worlds;
}

/**
 * Compile a GenerationSpecEnvelope ({ id, title, generationSpec }) into a
 * schema-valid BehavioralGraph. Throws DxError on malformed input or if the
 * lowered graph fails its own schema (a compiler bug, not a spec problem).
 */
export function compileBehavioralGraph(envelope, { sourcePath } = {}) {
  const contract = envelope?.generationSpec?.behaviorContract;
  if (!envelope?.id || !contract) {
    throw new DxError("spec envelope is missing id or generationSpec.behaviorContract", {
      where: sourcePath || envelope?.id || "<envelope>",
      why: "the behavioral compiler derives every graph node from the behavior contract; without one there is nothing to compile",
      fix: "add generationSpec.behaviorContract per packages/agent-spec/src/schema.ts (BehaviorContractSchema)",
    });
  }
  const sourceSystems = envelope.generationSpec.sourceSystems || [];
  const usedIds = new Set();
  const authority = buildAuthority(contract, sourceSystems, usedIds);
  const capabilities = buildCapabilities({ contract, authority }, usedIds);
  const tools = buildTools(contract);
  const personas = buildPersonas(contract);
  const worlds = buildWorlds(sourceSystems, authority);
  const conversations = expandConversationCases({
    capabilities,
    authority,
    tools,
    personas,
    worlds,
    escalationRules: contract.escalationRules || [],
    goldenEvals: contract.goldenEvals || [],
  });
  const graph = {
    apiVersion: BEHAVIORAL_GRAPH_API_VERSION,
    kind: BEHAVIORAL_GRAPH_KIND,
    subject: {
      agentId: envelope.id,
      title: envelope.title || envelope.id,
      source: "agent-spec",
      sourcePath: sourcePath || "<inline>",
      sourceHash: createHash("sha256").update(JSON.stringify(envelope)).digest("hex"),
    },
    capabilities,
    authority,
    tools,
    personas,
    worlds,
    conversations,
  };
  const result = validateBehavioralGraph(graph);
  if (!result.ok) {
    throw new DxError("compiled BehavioralGraph failed its own schema", {
      where: sourcePath || envelope.id,
      why: result.issues.join("; "),
      fix: "bun test packages/evalkit",
    });
  }
  return result.graph;
}
