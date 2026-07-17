/**
 * MutationModel (`ge.mutation-model.v1`): the declared, validated contract
 * for a twin's WRITE semantics — Phase 1 of docs/plans/real-system-twins/.
 *
 * The simulator runtime already EXECUTES write semantics (state machines,
 * approval blockers, idempotency replay, audit emission — see
 * packages/simulator-runtime/simulator_runtime/generic.py's submit/create
 * handlers). What was missing is the contract layer: a schema the workflows
 * section must satisfy for its write handlers, so "what does this twin do on
 * a write" is declared and machine-checkable instead of folklore. It is
 * deliberately a FORMALIZATION OF THE EXISTING workflows section — additive
 * annotation keys plus invariants over keys the runtime already reads —
 * never a parallel `mutations.json` file (two sources of truth for write
 * semantics would drift; the pack loader keeps its shapes and gains none).
 *
 * The two annotation keys, per write handler:
 *   semantics     create | state_transition | async_job | unmodeled
 *   compensation  none | inverse_op | manual
 *
 * `unmodeled` is the explicit escape hatch for genuinely fuzzy write tools:
 * validate() reports it as a warning, never a failure, so the corpus sweep
 * can land without inventing state machines that don't exist.
 *
 * Same package conventions: node builtins only, every path injected.
 */
import { createHash, randomUUID } from "node:crypto";
import { link, lstat, open, readFile, realpath, unlink } from "node:fs/promises";
import { basename, dirname, isAbsolute, join, relative, resolve } from "node:path";

export const MUTATION_MODEL_SCHEMA_VERSION = "ge.mutation-model.v1";
export const MUTATION_PROPOSAL_SCHEMA_VERSION = "ge.mutation-proposal.v1";
export const MUTATION_APPLY_LOCK_SCHEMA_VERSION = "ge.mutation-apply-lock.v1";
export const MUTATION_APPLY_LOCK_MAX_BYTES = 4096;
export const MUTATION_APPLY_LOCK_DEAD_OWNER_GRACE_MS = 1_000;
export const MUTATION_APPLY_LOCK_MAX_AGE_MS = 5 * 60_000;
const MUTATION_APPLY_LOCK_FUTURE_SKEW_MS = 5_000;

const MUTATION_SYSTEM_ID = /^[a-z][a-z0-9_]{0,127}$/;

/** Reject path-shaped or otherwise non-canonical simulator system ids. */
export function assertMutationSystemId(system) {
  if (typeof system !== "string" || !MUTATION_SYSTEM_ID.test(system)) {
    throw new Error("mutation system id must match /^[a-z][a-z0-9_]{0,127}$/");
  }
  return system;
}

function isContainedBy(parent, candidate) {
  const rel = relative(parent, candidate);
  return rel === "" || (!rel.startsWith("..") && !isAbsolute(rel));
}

/**
 * Resolve the one pack a proposal is allowed to mutate. The canonical corpus
 * must stay inside the canonical repository, and the target must be the real
 * (non-symlinked) direct child named by the proposal's safe system id.
 */
export async function resolveMutationPackDir({ repoRoot, system, packDir } = {}) {
  const safeSystem = assertMutationSystemId(system);
  if (!repoRoot) throw new Error("mutation apply requires repoRoot");

  const repoInput = resolve(repoRoot);
  const repoCanonical = await realpath(repoInput);
  const corpusInput = resolve(repoInput, "apps", "factory", "simulator-systems");
  const corpusCanonical = await realpath(corpusInput);
  if (!isContainedBy(repoCanonical, corpusCanonical)) {
    throw new Error("simulator corpus resolves outside the repository");
  }

  const expectedInput = resolve(corpusInput, safeSystem);
  const requestedInput = packDir ? resolve(packDir) : expectedInput;
  if (requestedInput !== expectedInput) {
    throw new Error(`mutation packDir must be the repository pack for system ${JSON.stringify(safeSystem)}`);
  }

  const packCanonical = await realpath(requestedInput);
  const expectedCanonical = resolve(corpusCanonical, safeSystem);
  if (packCanonical !== expectedCanonical || !isContainedBy(corpusCanonical, packCanonical)) {
    throw new Error(`mutation pack for ${JSON.stringify(safeSystem)} must be a non-symlinked direct child of the repository corpus`);
  }
  return packCanonical;
}

/** Closed vocabulary: what a write handler does to twin state. */
export const MUTATION_SEMANTICS = Object.freeze(["create", "state_transition", "async_job", "unmodeled"]);

/** Closed vocabulary: what undoes a write (for refinement loops and tests). */
export const MUTATION_COMPENSATIONS = Object.freeze(["none", "inverse_op", "manual"]);

/** Binding ops that mutate twin state (generic.py's write half of _BINDING_OPS). */
export const WRITE_BINDING_OPS = Object.freeze(["create", "submit"]);

const LEGACY_SUBMIT = /^submit_.+_update$/;
const LEGACY_WRITE_TOOLS = new Set(["submit_worker_change"]);

/** The only idempotency argument consumed by simulator_runtime/idempotency.py. */
export const RUNTIME_IDEMPOTENCY_KEY = "idempotency_key";

/** True when a tools.json entry is write-class (explicit binding or legacy name). */
export function isWriteTool(tool) {
  if (!tool || typeof tool !== "object") return false;
  const op = tool.binding?.op;
  if (op) return WRITE_BINDING_OPS.includes(op);
  const name = String(tool.name || "");
  return LEGACY_SUBMIT.test(name) || LEGACY_WRITE_TOOLS.has(name);
}

function writeBindingOp(tool) {
  if (!isWriteTool(tool)) return null;
  return tool.binding?.op || "submit";
}

/**
 * Derive the v1 annotations for one workflow handler — the pure inference
 * `mutation infer`, the corpus sweep, and synthesis parity tests all share.
 * Existing annotation values are preserved (hand-authored truth wins); only
 * missing keys are filled.
 */
export function inferHandlerAnnotations(handler = {}, { bindingOp } = {}) {
  let semantics = handler.semantics;
  if (!MUTATION_SEMANTICS.includes(semantics)) {
    if (handler.async === true) semantics = "async_job";
    else if (handler.stateField || handler.transitions) semantics = "state_transition";
    else if (bindingOp === "create") semantics = "create";
    else semantics = "unmodeled";
  }
  const compensation = MUTATION_COMPENSATIONS.includes(handler.compensation) ? handler.compensation : "manual";
  return { semantics, compensation };
}

/**
 * Annotate a workflows section (pure — returns a new object, input untouched).
 * Only handlers backing write tools are annotated; read-side handler entries
 * (there are none today, but the loop doesn't assume that) pass through.
 * @param {object} workflows — the pack's workflows.json object
 * @param {object} tools — the pack's tools.json object (for binding ops)
 */
export function annotateWorkflows(workflows = {}, tools = {}) {
  const handlers = workflows.toolHandlers || {};
  const toolByName = new Map((tools.tools || []).map((t) => [t.name, t]));
  const annotated = {};
  for (const [name, handler] of Object.entries(handlers)) {
    const tool = toolByName.get(name);
    if (!isWriteTool(tool)) {
      annotated[name] = handler;
      continue;
    }
    annotated[name] = { ...handler, ...inferHandlerAnnotations(handler, { bindingOp: writeBindingOp(tool) }) };
  }
  return { ...workflows, mutationModel: MUTATION_MODEL_SCHEMA_VERSION, toolHandlers: annotated };
}

/*
 * Parse just enough JSON structure to locate object properties without
 * serializing the document again. The corpus migration only adds/replaces
 * scalar annotation fields; retaining source ranges lets it preserve every
 * unrelated line and compact array exactly as authored.
 */
function parseJsonRanges(text) {
  let index = 0;
  const skipSpace = () => {
    while (/\s/.test(text[index] || "")) index++;
  };
  const parseString = () => {
    const start = index++;
    while (index < text.length) {
      if (text[index] === "\\") {
        index += 2;
      } else if (text[index++] === '"') {
        return { type: "string", start, end: index, value: JSON.parse(text.slice(start, index)) };
      }
    }
    throw new SyntaxError("unterminated JSON string");
  };
  const parseValue = () => {
    skipSpace();
    const start = index;
    if (text[index] === "{") return parseObject();
    if (text[index] === "[") {
      index++;
      const items = [];
      skipSpace();
      while (text[index] !== "]") {
        items.push(parseValue());
        skipSpace();
        if (text[index] === ",") {
          index++;
          skipSpace();
        } else if (text[index] !== "]") {
          throw new SyntaxError(`expected ',' or ']' at offset ${index}`);
        }
      }
      index++;
      return { type: "array", start, end: index, items };
    }
    if (text[index] === '"') return parseString();
    while (index < text.length && !/[\s,}\]]/.test(text[index])) index++;
    if (index === start) throw new SyntaxError(`expected JSON value at offset ${index}`);
    return { type: "scalar", start, end: index };
  };
  const parseObject = () => {
    const start = index++;
    const properties = new Map();
    skipSpace();
    while (text[index] !== "}") {
      if (text[index] !== '"') throw new SyntaxError(`expected object key at offset ${index}`);
      const key = parseString();
      skipSpace();
      if (text[index++] !== ":") throw new SyntaxError(`expected ':' at offset ${index - 1}`);
      const value = parseValue();
      properties.set(key.value, { key, value });
      skipSpace();
      if (text[index] === ",") {
        index++;
        skipSpace();
      } else if (text[index] !== "}") {
        throw new SyntaxError(`expected ',' or '}' at offset ${index}`);
      }
    }
    const close = index++;
    return { type: "object", start, close, end: index, properties };
  };

  const root = parseValue();
  skipSpace();
  if (index !== text.length) throw new SyntaxError(`unexpected content at offset ${index}`);
  return root;
}

function indentationAt(text, offset) {
  const lineStart = text.lastIndexOf("\n", offset - 1) + 1;
  return text.slice(lineStart, offset).match(/^\s*/)?.[0] || "";
}

function appendObjectProperties(text, node, values) {
  if (!values.length) return null;
  const closeIndent = indentationAt(text, node.close);
  const first = node.properties.values().next().value;
  const childIndent = first ? indentationAt(text, first.key.start) : `${closeIndent}  `;
  const prefix = node.properties.size ? "," : "";
  const body = values.map(([key, value]) => {
    const encoded = JSON.stringify(value, null, 2).split("\n");
    const rendered = encoded.length === 1
      ? encoded[0]
      : `${encoded[0]}\n${encoded.slice(1).map((line) => `${childIndent}${line}`).join("\n")}`;
    return `${childIndent}${JSON.stringify(key)}: ${rendered}`;
  }).join(",\n");
  return { start: node.close, end: node.close, text: `${prefix}\n${body}\n${closeIndent}` };
}

/**
 * Return a minimally edited workflows JSON document. Only genuine write
 * handlers (as classified by the runtime's explicit/legacy binding rules)
 * receive annotations; unrelated formatting and read handlers are untouched.
 */
export function annotateWorkflowsText(sourceText, tools = {}) {
  const workflows = JSON.parse(sourceText);
  const annotated = annotateWorkflows(workflows, tools);
  const root = parseJsonRanges(sourceText);
  if (root.type !== "object") throw new TypeError("workflows JSON must be an object");
  const handlersNode = root.properties.get("toolHandlers")?.value;
  if (handlersNode && handlersNode.type !== "object") throw new TypeError("workflows.toolHandlers must be an object");

  const edits = [];
  const modelProperty = root.properties.get("mutationModel");
  if (!modelProperty) {
    edits.push(appendObjectProperties(sourceText, root, [["mutationModel", MUTATION_MODEL_SCHEMA_VERSION]]));
  } else if (workflows.mutationModel !== MUTATION_MODEL_SCHEMA_VERSION) {
    edits.push({
      start: modelProperty.value.start,
      end: modelProperty.value.end,
      text: JSON.stringify(MUTATION_MODEL_SCHEMA_VERSION),
    });
  }

  if (handlersNode) {
    for (const [name, proposed] of Object.entries(annotated.toolHandlers || {})) {
      const original = workflows.toolHandlers?.[name];
      if (original === proposed) continue; // read-side handler passed through by reference
      const handlerNode = handlersNode.properties.get(name)?.value;
      if (!handlerNode || handlerNode.type !== "object") continue;
      const additions = [];
      for (const key of ["semantics", "compensation"]) {
        const property = handlerNode.properties.get(key);
        if (!property) {
          additions.push([key, proposed[key]]);
        } else if (original[key] !== proposed[key]) {
          edits.push({ start: property.value.start, end: property.value.end, text: JSON.stringify(proposed[key]) });
        }
      }
      if (additions.length) edits.push(appendObjectProperties(sourceText, handlerNode, additions));
    }
  }

  let text = sourceText;
  for (const edit of edits.filter(Boolean).sort((a, b) => b.start - a.start)) {
    text = `${text.slice(0, edit.start)}${edit.text}${text.slice(edit.end)}`;
  }
  if (JSON.stringify(JSON.parse(text)) !== JSON.stringify(annotated)) {
    throw new Error("minimal workflows annotation did not reproduce the inferred contract");
  }
  return { workflows: annotated, text, changed: text !== sourceText };
}

function enumVocabulary(field) {
  if (typeof field === "string" && field.startsWith("enum:")) {
    return new Set(field.slice("enum:".length).split("|").filter(Boolean));
  }
  if (field && typeof field === "object" && Array.isArray(field.enum)) {
    return new Set(field.enum.filter((value) => typeof value === "string" && value));
  }
  return null;
}

function transitionsProblems(name, transitions, vocabulary = null) {
  const problems = [];
  if (transitions === undefined) return problems;
  if (!transitions || typeof transitions !== "object" || Array.isArray(transitions)) {
    return [`${name}: transitions must be an object of {sourceState: [targetStates]}`];
  }
  for (const [source, allowed] of Object.entries(transitions)) {
    if (!source || (source !== "*" && vocabulary && !vocabulary.has(source))) {
      problems.push(`${name}: transition source ${JSON.stringify(source)} is not in the declared state vocabulary`);
    }
    if (!Array.isArray(allowed)) {
      problems.push(`${name}: transitions["${source}"] must be an array of state names`);
      continue;
    }
    const seen = new Set();
    for (const target of allowed) {
      if (typeof target !== "string" || !target) {
        problems.push(`${name}: transitions["${source}"] contains an empty or non-string target state`);
        continue;
      }
      if (seen.has(target)) problems.push(`${name}: transitions["${source}"] contains duplicate target ${JSON.stringify(target)}`);
      seen.add(target);
      if (target !== "*" && vocabulary && !vocabulary.has(target)) {
        problems.push(`${name}: transition target ${JSON.stringify(target)} is not in the declared state vocabulary`);
      }
    }
  }
  if (Object.keys(transitions).length === 0) {
    problems.push(`${name}: transitions is empty — declare the state graph or mark the handler semantics "unmodeled"`);
  }
  return problems;
}

const isObject = (value) => Boolean(value) && typeof value === "object" && !Array.isArray(value);

function inputProperties(tool) {
  return isObject(tool?.inputSchema?.properties) ? tool.inputSchema.properties : {};
}

/**
 * Validate ONE pack's write semantics against the v1 contract.
 * Returns problems (fail) and warnings (informational) — never throws on
 * content; the caller decides severity. Pure over the three section objects.
 * @param {{schema?: object, tools?: object, workflows?: object}} pack
 */
export function validatePackMutations({ schema = {}, tools = {}, workflows = {} } = {}) {
  const problems = [];
  const warnings = [];
  const collections = new Set(Object.keys(schema.collections || {}));
  const handlers = isObject(workflows.toolHandlers) ? workflows.toolHandlers : {};
  const toolList = Array.isArray(tools.tools) ? tools.tools : [];
  const toolByName = new Map();
  for (const tool of toolList) {
    if (!tool?.name) {
      problems.push("tools.tools contains an entry without a name");
      continue;
    }
    if (toolByName.has(tool.name)) problems.push(`${tool.name}: duplicate tool name`);
    toolByName.set(tool.name, tool);
  }
  const writeTools = toolList.filter(isWriteTool);

  if (!Number.isInteger(workflows.version) || workflows.version < 1) {
    problems.push("workflows.version must be a positive integer");
  }
  if (workflows.mutationModel !== MUTATION_MODEL_SCHEMA_VERSION) {
    problems.push(`workflows.mutationModel must be ${MUTATION_MODEL_SCHEMA_VERSION}`);
  }
  if (workflows.toolHandlers !== undefined && !isObject(workflows.toolHandlers)) {
    problems.push("workflows.toolHandlers must be an object");
  }

  // Every runtime write binding must have exactly one workflow declaration.
  for (const tool of writeTools) {
    const op = writeBindingOp(tool);
    const handler = handlers[tool.name];
    if (!handler) {
      problems.push(`${tool.name}: write tool (op: ${op}) has no workflows.toolHandlers entry — a silent dead write`);
    }
    if (!isObject(tool.inputSchema) || tool.inputSchema.type !== "object" || !isObject(tool.inputSchema.properties)) {
      problems.push(`${tool.name}: write tool inputSchema must be an object schema with properties`);
    }
    if (tool.binding?.op) {
      if (!tool.binding.collection) problems.push(`${tool.name}: ${op} binding requires collection`);
      if (!tool.binding.primaryKey) problems.push(`${tool.name}: ${op} binding requires primaryKey`);
    }
  }

  for (const [name, handler] of Object.entries(handlers)) {
    if (!isObject(handler)) {
      problems.push(`${name}: handler must be an object`);
      continue;
    }
    const tool = toolByName.get(name);
    const op = writeBindingOp(tool);
    if (!tool) {
      problems.push(`${name}: handler has no matching tools.tools entry`);
    } else if (!op) {
      problems.push(`${name}: handler is linked to non-write tool ${JSON.stringify(tool.binding?.op || null)}`);
    }
    const properties = inputProperties(tool);

    const semantics = handler.semantics;
    if (!MUTATION_SEMANTICS.includes(semantics)) {
      problems.push(`${name}: semantics must be one of ${MUTATION_SEMANTICS.join("|")} (got ${JSON.stringify(semantics)})`);
    } else if (semantics === "unmodeled") {
      warnings.push(`${name}: semantics "unmodeled" — write behavior is not contractually modeled (allowed, but Phase 2 realism can't check it)`);
    }
    if (!MUTATION_COMPENSATIONS.includes(handler.compensation)) {
      problems.push(`${name}: compensation must be one of ${MUTATION_COMPENSATIONS.join("|")}`);
    }
    if (op === "create" && semantics !== "create") {
      problems.push(`${name}: create binding requires semantics "create"`);
    }
    if (op === "submit" && semantics === "create") {
      problems.push(`${name}: submit binding cannot declare semantics "create"`);
    }
    if (handler.async === true && semantics !== "async_job") {
      problems.push(`${name}: async handler requires semantics "async_job"`);
    }
    if (semantics === "async_job" && handler.async !== true) {
      problems.push(`${name}: semantics "async_job" requires async: true`);
    }
    if (handler.collection !== undefined && collections.size && !collections.has(handler.collection)) {
      problems.push(`${name}: collection "${handler.collection}" is not in schema.collections`);
    }
    if (tool?.binding?.op) {
      if (handler.collection !== tool.binding.collection) {
        problems.push(`${name}: handler.collection must match binding.collection`);
      }
      if (handler.primaryKey !== tool.binding.primaryKey) {
        problems.push(`${name}: handler.primaryKey must match binding.primaryKey`);
      }
    }
    if (op === "submit" && handler.primaryKey && !Object.hasOwn(properties, handler.primaryKey)) {
      problems.push(`${name}: primaryKey ${JSON.stringify(handler.primaryKey)} is not declared in tool.inputSchema.properties`);
    }

    const stateSpec = schema.collections?.[handler.collection]?.fields?.[handler.stateField];
    const toolStateSpec = properties[handler.targetStateArg || handler.stateField];
    const vocabulary = enumVocabulary(stateSpec) || enumVocabulary(toolStateSpec);
    if (semantics === "state_transition" || semantics === "async_job") {
      if (!handler.collection) problems.push(`${name}: state_transition requires collection`);
      if (handler.transitions === undefined) {
        problems.push(`${name}: ${semantics} requires a transitions map enforced by the runtime`);
      } else {
        problems.push(...transitionsProblems(name, handler.transitions, vocabulary));
      }
      if (!handler.stateField || !Object.hasOwn(schema.collections?.[handler.collection]?.fields || {}, handler.stateField)) {
        problems.push(`${name}: stateField ${JSON.stringify(handler.stateField)} is not declared in the collection schema`);
      }
      const targetArg = handler.targetStateArg || handler.stateField;
      if (!targetArg || !Object.hasOwn(properties, targetArg)) {
        problems.push(`${name}: targetStateArg ${JSON.stringify(targetArg)} is not declared in tool.inputSchema.properties`);
      }
    }
    if (handler.transitionCandidates !== undefined) {
      if (!Array.isArray(handler.transitionCandidates) || !handler.transitionCandidates.every((value) => typeof value === "string" && value)) {
        problems.push(`${name}: transitionCandidates must be an array of non-empty state names`);
      } else {
        const candidates = new Set(handler.transitionCandidates);
        if (candidates.size !== handler.transitionCandidates.length) {
          problems.push(`${name}: transitionCandidates must not contain duplicates`);
        }
        if (vocabulary) {
          for (const candidate of candidates) {
            if (!vocabulary.has(candidate)) {
              problems.push(`${name}: transition candidate ${JSON.stringify(candidate)} is not in the declared state vocabulary`);
            }
          }
        }
      }
    }
    for (const blocker of handler.approvalBlockers || []) {
      const blockerCollection = blocker?.collection || "approvals";
      if (collections.size && !collections.has(blockerCollection)) {
        problems.push(`${name}: approvalBlockers collection "${blockerCollection}" is not in schema.collections`);
      }
    }
    if (handler.idempotency !== undefined) {
      const keyFields = handler.idempotency?.keyFields;
      if (!isObject(handler.idempotency) || !Array.isArray(keyFields) || keyFields.length !== 1) {
        problems.push(`${name}: idempotency.keyFields must be ["${RUNTIME_IDEMPOTENCY_KEY}"]`);
      } else if (keyFields[0] !== RUNTIME_IDEMPOTENCY_KEY) {
        problems.push(`${name}: runtime only honors idempotency key field "${RUNTIME_IDEMPOTENCY_KEY}"`);
      } else if (!Object.hasOwn(properties, RUNTIME_IDEMPOTENCY_KEY)) {
        problems.push(`${name}: idempotency key "${RUNTIME_IDEMPOTENCY_KEY}" is not declared in tool.inputSchema.properties`);
      }
    }
  }

  return { ok: problems.length === 0, problems, warnings, handlerCount: Object.keys(handlers).length, writeToolCount: writeTools.length };
}

const sha256 = (text) => `sha256:${createHash("sha256").update(text).digest("hex")}`;

function mergeProposal(workflows, proposal) {
  const base = Object.keys(workflows).length === 0 && isObject(proposal.workflows)
    ? { ...proposal.workflows, toolHandlers: {} }
    : workflows;
  const currentHandlers = isObject(base.toolHandlers) ? base.toolHandlers : {};
  const merged = { ...base, toolHandlers: { ...currentHandlers }, mutationModel: MUTATION_MODEL_SCHEMA_VERSION };
  const changes = [];
  for (const [name, proposed] of Object.entries(proposal.workflows?.toolHandlers || {})) {
    const existing = currentHandlers[name];
    if (!isObject(existing)) {
      merged.toolHandlers[name] = proposed;
      changes.push({ handler: name, kind: "added" });
      continue;
    }
    const addedKeys = Object.keys(proposed).filter((key) => existing[key] === undefined);
    if (addedKeys.length) {
      merged.toolHandlers[name] = { ...proposed, ...existing };
      changes.push({ handler: name, kind: "annotated", keys: addedKeys });
    }
  }
  return { merged, changes };
}

function renderProposalMerge(currentText, workflows, merged, proposal) {
  if (currentText === null) return `${JSON.stringify(merged, null, 2)}\n`;
  const root = parseJsonRanges(currentText);
  if (root.type !== "object") throw new TypeError("workflows JSON must be an object");
  const edits = [];
  const modelProperty = root.properties.get("mutationModel");
  if (!modelProperty) {
    edits.push(appendObjectProperties(currentText, root, [["mutationModel", MUTATION_MODEL_SCHEMA_VERSION]]));
  } else if (workflows.mutationModel !== MUTATION_MODEL_SCHEMA_VERSION) {
    edits.push({ start: modelProperty.value.start, end: modelProperty.value.end, text: JSON.stringify(MUTATION_MODEL_SCHEMA_VERSION) });
  }

  const handlersProperty = root.properties.get("toolHandlers");
  if (!handlersProperty) {
    edits.push(appendObjectProperties(currentText, root, [["toolHandlers", merged.toolHandlers]]));
  } else if (handlersProperty.value.type !== "object") {
    throw new TypeError("workflows.toolHandlers must be an object");
  } else {
    const handlersNode = handlersProperty.value;
    const newHandlers = [];
    for (const [name, proposed] of Object.entries(proposal.workflows?.toolHandlers || {})) {
      const handlerProperty = handlersNode.properties.get(name);
      if (!handlerProperty) {
        newHandlers.push([name, proposed]);
        continue;
      }
      if (handlerProperty.value.type !== "object") throw new TypeError(`workflows.toolHandlers.${name} must be an object`);
      const existing = workflows.toolHandlers?.[name];
      const additions = Object.entries(proposed).filter(([key]) => existing?.[key] === undefined);
      if (additions.length) edits.push(appendObjectProperties(currentText, handlerProperty.value, additions));
    }
    if (newHandlers.length) edits.push(appendObjectProperties(currentText, handlersNode, newHandlers));
  }

  let text = currentText;
  for (const edit of edits.filter(Boolean).sort((a, b) => b.start - a.start)) {
    text = `${text.slice(0, edit.start)}${edit.text}${text.slice(edit.end)}`;
  }
  if (!text.endsWith("\n")) text += "\n";
  if (JSON.stringify(JSON.parse(text)) !== JSON.stringify(merged)) {
    throw new Error("minimal workflows merge did not reproduce the proposal result");
  }
  return text;
}

/**
 * Build a reviewable mutation proposal from a synthesized contract — the
 * `ge systems mutation infer` artifact, mirroring okf enrich's
 * propose-then-apply shape (hash-bound to the target it was inferred
 * against; apply is dry-run by default). Pure except for the injected
 * hashes; the caller supplies the synthesized contract and, when the target
 * pack already exists, its current workflows.json text.
 * @param {{contract: object, system: string, source: {mode: string, path?: string, contentHash?: string},
 *          baseWorkflowsText?: string|null}} options
 */
export function buildMutationProposal({ contract = {}, system, source = {}, baseWorkflowsText = null } = {}) {
  assertMutationSystemId(system);
  const catalog = contract.workflowCatalog || contract.workflows || {};
  const tools = { tools: contract.toolCatalog?.tools || contract.tools || [] };
  const workflows = annotateWorkflows(catalog, tools);
  return {
    schemaVersion: MUTATION_PROPOSAL_SCHEMA_VERSION,
    system,
    source,
    baseWorkflowsHash: baseWorkflowsText === null || baseWorkflowsText === undefined ? null : sha256(baseWorkflowsText),
    workflows,
    writeBindings: (tools.tools || []).filter(isWriteTool).map((tool) => ({ name: tool.name, binding: tool.binding || null })),
  };
}

function sameFile(left, right) {
  return left.dev === right.dev && left.ino === right.ino;
}

async function readBoundedLockMetadata(handle, lockPath) {
  const stats = await handle.stat();
  if (!stats.isFile() || stats.size < 1 || stats.size > MUTATION_APPLY_LOCK_MAX_BYTES) {
    throw new Error(`mutation apply lock metadata is missing or exceeds ${MUTATION_APPLY_LOCK_MAX_BYTES} bytes; refusing ambiguous recovery: ${lockPath}`);
  }
  const text = await handle.readFile("utf8");
  let metadata;
  try {
    metadata = JSON.parse(text);
  } catch {
    throw new Error(`mutation apply lock metadata is invalid; refusing ambiguous recovery: ${lockPath}`);
  }
  if (metadata?.schemaVersion !== MUTATION_APPLY_LOCK_SCHEMA_VERSION ||
      !Number.isSafeInteger(metadata.ownerPid) || metadata.ownerPid < 1 ||
      !Number.isSafeInteger(metadata.createdAtMs) || metadata.createdAtMs < 1 ||
      typeof metadata.token !== "string" || !/^[0-9a-f]{8}-[0-9a-f-]{27}$/i.test(metadata.token)) {
    throw new Error(`mutation apply lock metadata is invalid; refusing ambiguous recovery: ${lockPath}`);
  }
  return { metadata, stats };
}

async function persistLockMetadata(lock) {
  const text = `${JSON.stringify(lock.metadata)}\n`;
  const size = Buffer.byteLength(text, "utf8");
  if (size > MUTATION_APPLY_LOCK_MAX_BYTES) throw new Error("mutation apply lock metadata exceeds its byte cap");
  await lock.handle.truncate(0);
  const { bytesWritten } = await lock.handle.write(text, 0, "utf8");
  if (bytesWritten !== size) throw new Error("mutation apply lock metadata write was incomplete");
  await lock.handle.truncate(size);
  await lock.handle.sync();
}

function ownerProcessState(pid) {
  try {
    process.kill(pid, 0);
    return "alive";
  } catch (error) {
    if (error?.code === "ESRCH") return "dead";
    return "unknown";
  }
}

function staleLockDecision(metadata, lockPath) {
  const ageMs = Date.now() - metadata.createdAtMs;
  if (ageMs < -MUTATION_APPLY_LOCK_FUTURE_SKEW_MS) {
    throw new Error(`mutation apply lock timestamp is in the future; refusing ambiguous recovery: ${lockPath}`);
  }
  const state = ownerProcessState(metadata.ownerPid);
  const deadAndPastGrace = state === "dead" && ageMs >= MUTATION_APPLY_LOCK_DEAD_OWNER_GRACE_MS;
  const leaseExpired = ageMs >= MUTATION_APPLY_LOCK_MAX_AGE_MS;
  return { stale: deadAndPastGrace || leaseExpired, state };
}

async function verifiedFileHash(path, expectedHash, label) {
  const stats = await lstat(path).catch((error) => {
    if (error?.code === "ENOENT") return null;
    throw error;
  });
  if (!stats) return null;
  if (!stats.isFile()) throw new Error(`${label} is not a regular file; refusing ambiguous recovery: ${path}`);
  const hash = sha256(await readFile(path, "utf8"));
  if (expectedHash && hash !== expectedHash) {
    throw new Error(`${label} hash does not match the interrupted transaction; refusing ambiguous recovery: ${path}`);
  }
  return { stats, hash };
}

function interruptedTransaction(lockPath, metadata) {
  const transaction = metadata.transaction;
  if (!transaction || transaction.schemaVersion !== "ge.mutation-apply-transaction.v1") {
    throw new Error(`mutation apply recovery guard has no valid transaction metadata; refusing ambiguous recovery: ${lockPath}`);
  }
  const workflowsPath = lockPath.slice(0, -".mutation-apply.lock".length);
  if (!workflowsPath || transaction.workflowsName !== basename(workflowsPath) ||
      (transaction.currentHash !== null && !/^sha256:[0-9a-f]{64}$/.test(transaction.currentHash)) ||
      !/^sha256:[0-9a-f]{64}$/.test(transaction.nextHash)) {
    throw new Error(`mutation apply transaction metadata is invalid; refusing ambiguous recovery: ${lockPath}`);
  }
  const expectedBackupName = transaction.currentHash === null
    ? null
    : `${basename(workflowsPath)}.${metadata.ownerPid}.${metadata.token}.mutation-apply-backup`;
  if (transaction.backupName !== expectedBackupName) {
    throw new Error(`mutation apply backup identity is invalid; refusing ambiguous recovery: ${lockPath}`);
  }
  return {
    ...transaction,
    workflowsPath,
    backupPath: expectedBackupName ? join(dirname(workflowsPath), expectedBackupName) : null,
  };
}

async function reconcileInterruptedReplace(lockPath, metadata) {
  const transaction = interruptedTransaction(lockPath, metadata);
  const target = await verifiedFileHash(transaction.workflowsPath, null, "mutation target");
  const backup = transaction.backupPath
    ? await verifiedFileHash(transaction.backupPath, transaction.currentHash, "mutation backup")
    : null;

  if (!target) {
    if (transaction.currentHash === null) return;
    if (!backup) {
      throw new Error(`mutation target is detached and its verified backup is missing; refusing ambiguous recovery: ${lockPath}`);
    }
    await link(transaction.backupPath, transaction.workflowsPath);
    const restored = await verifiedFileHash(transaction.workflowsPath, transaction.currentHash, "restored mutation target");
    if (!sameFile(restored.stats, backup.stats)) {
      throw new Error(`restored mutation target does not match its backup inode; refusing ambiguous recovery: ${lockPath}`);
    }
    await unlink(transaction.backupPath);
    return;
  }

  if (target.hash !== transaction.currentHash && target.hash !== transaction.nextHash) {
    throw new Error(`mutation target differs from both sides of the interrupted transaction; refusing ambiguous recovery: ${lockPath}`);
  }
  if (backup) await unlink(transaction.backupPath);
}

async function recoverDeadOwnerLock(lockPath) {
  // A hard-link claim serializes stale recovery without moving or deleting
  // the live lock. Other contenders fail closed while this claim exists.
  const recoveryPath = `${lockPath}.recovery`;
  let createdRecoveryGuard = false;
  try {
    await link(lockPath, recoveryPath);
    createdRecoveryGuard = true;
  } catch (error) {
    if (error?.code === "EEXIST") createdRecoveryGuard = false;
    else if (error?.code === "ENOENT") return;
    else throw error;
  }

  let recoveryHandle;
  let lockHandle;
  let recovered = false;
  let recoveryGuardRemoved = false;
  try {
    recoveryHandle = await open(recoveryPath, "r");
    lockHandle = await open(lockPath, "r");
    const [{ metadata, stats: recoveryStats }, { metadata: lockMetadata, stats: lockStats }] = await Promise.all([
      readBoundedLockMetadata(recoveryHandle, lockPath),
      readBoundedLockMetadata(lockHandle, lockPath),
    ]);
    if (!sameFile(recoveryStats, lockStats) || metadata.token !== lockMetadata.token || metadata.ownerPid !== lockMetadata.ownerPid) {
      throw new Error(`mutation apply recovery guard does not match lock ownership; refusing ambiguous recovery: ${lockPath}`);
    }
    const decision = staleLockDecision(metadata, lockPath);
    if (!decision.stale && decision.state === "alive") {
      throw new Error(`another mutation apply holds ${lockPath} (pid ${metadata.ownerPid})`);
    }
    if (!decision.stale) {
      throw new Error(`cannot verify mutation apply lock owner pid ${metadata.ownerPid}; refusing ambiguous recovery: ${lockPath}`);
    }

    if (!createdRecoveryGuard) await reconcileInterruptedReplace(lockPath, metadata);

    const currentStats = await lstat(lockPath).catch((error) => {
      if (error?.code === "ENOENT") return null;
      throw error;
    });
    if (!currentStats) return;
    if (!sameFile(recoveryStats, currentStats)) {
      throw new Error(`mutation apply lock changed during recovery; refusing removal: ${lockPath}`);
    }
    // Remove the recovery guard first. If the process dies before removing
    // the stale lock, the next contender can create a fresh guard and retry;
    // the reverse order could leave an orphan guard with no lock to validate.
    await unlink(recoveryPath);
    recoveryGuardRemoved = true;
    await unlink(lockPath);
    recovered = true;
  } finally {
    await recoveryHandle?.close();
    await lockHandle?.close();
    if (!recoveryGuardRemoved && (createdRecoveryGuard || recovered)) {
      await unlink(recoveryPath).catch((error) => {
        if (error?.code !== "ENOENT") throw error;
      });
    }
  }
}

async function acquireMutationApplyLock(lockPath) {
  for (let attempt = 0; attempt < 2; attempt++) {
    let handle;
    try {
      handle = await open(lockPath, "wx");
      const metadata = {
        schemaVersion: MUTATION_APPLY_LOCK_SCHEMA_VERSION,
        ownerPid: process.pid,
        createdAtMs: Date.now(),
        token: randomUUID(),
      };
      const lock = { handle, metadata };
      await persistLockMetadata(lock);
      return lock;
    } catch (error) {
      if (handle) {
        await handle.close().catch(() => {}); // best-effort: preserve the original lock-acquisition error below
        await unlink(lockPath).catch(() => {}); // best-effort: a concurrent contender may already own or remove the path
      }
      if (error?.code !== "EEXIST") throw error;
      if (attempt > 0) throw new Error(`another mutation apply holds ${lockPath}`);
      await recoverDeadOwnerLock(lockPath);
    }
  }
  throw new Error(`could not acquire mutation apply lock: ${lockPath}`);
}

async function assertMutationApplyLockOwned(lockPath, lock) {
  const handle = await open(lockPath, "r").catch((error) => {
    if (error?.code === "ENOENT") return null;
    throw error;
  });
  if (!handle) throw new Error(`mutation apply lock disappeared: ${lockPath}`);
  try {
    const { metadata } = await readBoundedLockMetadata(handle, lockPath);
    if (metadata.token !== lock.metadata.token || metadata.ownerPid !== lock.metadata.ownerPid) {
      throw new Error(`mutation apply lock ownership changed: ${lockPath}`);
    }
  } finally {
    await handle.close();
  }
}

async function releaseMutationApplyLock(lockPath, lock) {
  await lock.handle.close();
  await assertMutationApplyLockOwned(lockPath, lock);
  await unlink(lockPath);
}

async function readOptionalText(path) {
  return readFile(path, "utf8").catch((error) => {
    if (error?.code === "ENOENT") return null;
    throw error;
  });
}

async function restoreDetachedTarget({ workflowsPath, backupPath, tempPath, nextHash }) {
  const currentText = await readOptionalText(workflowsPath);
  if (currentText === null) {
    await link(backupPath, workflowsPath);
    return true;
  }
  const [currentStats, tempStats] = await Promise.all([lstat(workflowsPath), lstat(tempPath)]);
  if (sameFile(currentStats, tempStats) && sha256(currentText) === nextHash) {
    await unlink(workflowsPath);
    await link(backupPath, workflowsPath);
    return true;
  }
  return false;
}

async function replaceWorkflowsWhileGuarded({
  workflowsPath,
  tempPath,
  currentHash,
  nextHash,
  lockPath,
  lock,
  backupPath,
  afterTargetDetached,
}) {
  await assertMutationApplyLockOwned(lockPath, lock);
  if (currentHash === null) {
    await afterTargetDetached?.({ workflowsPath });
    await assertMutationApplyLockOwned(lockPath, lock);
    try {
      await link(tempPath, workflowsPath);
    } catch (error) {
      if (error?.code === "EEXIST") {
        throw new Error("workflows.json appeared during mutation apply; refusing to overwrite it");
      }
      throw error;
    }
    if (sha256(await readFile(workflowsPath, "utf8")) !== nextHash) {
      throw new Error("workflows.json changed during mutation apply; refusing an ambiguous result");
    }
    await assertMutationApplyLockOwned(lockPath, lock);
    return;
  }

  let targetDetached = false;
  let backupRemoved = false;
  try {
    await link(workflowsPath, backupPath);
    const [targetStats, backupStats] = await Promise.all([lstat(workflowsPath), lstat(backupPath)]);
    if (!sameFile(targetStats, backupStats) || sha256(await readFile(backupPath, "utf8")) !== currentHash) {
      throw new Error("workflows.json changed immediately before mutation apply; no changes were written");
    }
    await assertMutationApplyLockOwned(lockPath, lock);
    await unlink(workflowsPath);
    targetDetached = true;
    await afterTargetDetached?.({ workflowsPath, backupPath });
    await assertMutationApplyLockOwned(lockPath, lock);
    try {
      // A hard link is the portable create-if-absent installation primitive:
      // unlike rename(), it cannot overwrite a non-cooperating writer's file.
      await link(tempPath, workflowsPath);
    } catch (error) {
      if (error?.code === "EEXIST") {
        throw new Error("workflows.json changed during mutation apply; refusing to overwrite it");
      }
      throw error;
    }
    if (sha256(await readFile(backupPath, "utf8")) !== currentHash ||
        sha256(await readFile(workflowsPath, "utf8")) !== nextHash) {
      throw new Error("workflows.json changed during mutation apply; refusing an ambiguous result");
    }
    await assertMutationApplyLockOwned(lockPath, lock);
    await unlink(backupPath);
    backupRemoved = true;
  } catch (error) {
    if (targetDetached && !backupRemoved) {
      const restored = await restoreDetachedTarget({ workflowsPath, backupPath, tempPath, nextHash });
      if (restored) {
        await unlink(backupPath);
        backupRemoved = true;
      } else {
        error.message += `; original retained at ${backupPath}`;
      }
    }
    throw error;
  } finally {
    if (!targetDetached && !backupRemoved) {
      await unlink(backupPath).catch((error) => {
        if (error?.code !== "ENOENT") throw error;
      });
    }
  }
}

async function replaceWorkflowsWithoutClobber(options) {
  const { workflowsPath, currentHash, nextHash, lockPath, lock } = options;
  const guardPath = `${lockPath}.recovery`;
  const backupName = currentHash === null
    ? null
    : `${basename(workflowsPath)}.${lock.metadata.ownerPid}.${lock.metadata.token}.mutation-apply-backup`;
  const backupPath = backupName ? join(dirname(workflowsPath), backupName) : null;
  lock.metadata.transaction = {
    schemaVersion: "ge.mutation-apply-transaction.v1",
    workflowsName: basename(workflowsPath),
    backupName,
    currentHash,
    nextHash,
  };
  await persistLockMetadata(lock);
  try {
    // The same hard-link name stale recovery claims also guards the short
    // detach/install window. An expired lease therefore cannot be reclaimed
    // underneath an owner that is already performing the exclusive replace.
    await link(lockPath, guardPath);
  } catch (error) {
    if (error?.code === "EEXIST") throw new Error(`mutation apply lock recovery is already active: ${lockPath}`);
    throw error;
  }
  try {
    await assertMutationApplyLockOwned(lockPath, lock);
    return await replaceWorkflowsWhileGuarded({ ...options, backupPath });
  } finally {
    await unlink(guardPath).catch((error) => {
      if (error?.code !== "ENOENT") throw error;
    });
  }
}

/**
 * Apply a mutation proposal to a pack's workflows.json. Dry-run by default
 * (`write: false`) — returns what WOULD change. Merge rules keep
 * hand-authored truth authoritative: a handler the pack already declares
 * only gains keys it is missing; existing values are never overwritten. The
 * hash guard refuses a proposal inferred against a different workflows.json
 * unless `force` (same posture as okf enrich's baseOkfHash guard).
 * @param {{proposal: object, repoRoot: string, packDir?: string, write?: boolean, force?: boolean,
 *          testHooks?: {afterTargetDetached?: Function}}} options
 */
export async function applyMutationProposal({ proposal, repoRoot, packDir, write = false, force = false, testHooks } = {}) {
  if (!proposal || proposal.schemaVersion !== MUTATION_PROPOSAL_SCHEMA_VERSION) {
    throw new Error(`proposal must have schemaVersion ${MUTATION_PROPOSAL_SCHEMA_VERSION}`);
  }
  assertMutationSystemId(proposal.system);
  if (!Object.hasOwn(proposal, "baseWorkflowsHash") ||
      (proposal.baseWorkflowsHash !== null && !/^sha256:[0-9a-f]{64}$/.test(proposal.baseWorkflowsHash))) {
    throw new Error("proposal.baseWorkflowsHash must be null (file absent) or a sha256 digest");
  }
  const canonicalPackDir = await resolveMutationPackDir({ repoRoot, system: proposal.system, packDir });
  const workflowsPath = join(canonicalPackDir, "workflows.json");
  const readCurrent = () => readFile(workflowsPath, "utf8").catch((error) => {
    if (error?.code === "ENOENT") return null;
    throw error;
  });
  const prepare = async () => {
    const currentText = await readCurrent();
    const currentHash = currentText === null ? null : sha256(currentText);
    if (currentHash !== proposal.baseWorkflowsHash && !force) {
      throw new Error(
        `workflows.json changed since this proposal was inferred (hash mismatch) — re-run ge systems mutation infer, or pass --force`,
      );
    }
    let current;
    try {
      current = currentText === null ? {} : JSON.parse(currentText);
    } catch (error) {
      throw new Error(`could not parse ${workflowsPath}: ${error?.message || error}`);
    }
    const { merged, changes } = mergeProposal(current, proposal);
    const nextText = renderProposalMerge(currentText, current, merged, proposal);
    return { currentText, currentHash, nextText, changes };
  };

  if (!write) {
    const prepared = await prepare();
    return {
      schemaVersion: "ge.mutation-apply-result.v1",
      system: proposal.system,
      dryRun: true,
      workflowsPath,
      changes: prepared.changes,
      resultWorkflowsHash: sha256(prepared.nextText),
    };
  }

  // Serialize mutation applies for this pack. Installation uses an exclusive
  // hard link after detaching a hash-checked backup, so a writer that ignores
  // our lock cannot be silently overwritten by a rename.
  const lockPath = `${workflowsPath}.mutation-apply.lock`;
  const tempPath = `${workflowsPath}.${process.pid}.${randomUUID()}.tmp`;
  const lock = await acquireMutationApplyLock(lockPath);
  let result;
  let operationError = null;
  try {
    const prepared = await prepare();
    if (prepared.nextText !== prepared.currentText) {
      const temp = await open(tempPath, "wx");
      try {
        await temp.writeFile(prepared.nextText, "utf8");
        await temp.sync();
      } finally {
        await temp.close();
      }
      await replaceWorkflowsWithoutClobber({
        workflowsPath,
        tempPath,
        currentHash: prepared.currentHash,
        nextHash: sha256(prepared.nextText),
        lockPath,
        lock,
        afterTargetDetached: testHooks?.afterTargetDetached,
      });
    }
    result = {
      schemaVersion: "ge.mutation-apply-result.v1",
      system: proposal.system,
      dryRun: false,
      workflowsPath,
      changes: prepared.changes,
      resultWorkflowsHash: sha256(prepared.nextText),
    };
  } catch (error) {
    operationError = error;
  }
  let cleanupError = null;
  await unlink(tempPath).catch((error) => {
    if (error?.code !== "ENOENT") cleanupError = error;
  });
  await releaseMutationApplyLock(lockPath, lock).catch((error) => {
    cleanupError ||= error;
  });
  if (operationError && cleanupError) throw new AggregateError([operationError, cleanupError], operationError.message);
  if (operationError) throw operationError;
  if (cleanupError) throw cleanupError;
  return result;
}

async function readJsonSection(path) {
  if (!path) return null;
  try {
    return JSON.parse(await readFile(path, "utf8"));
  } catch (error) {
    throw new Error(`could not read pack section ${path}: ${error?.message || error}`);
  }
}

/**
 * Validate write semantics across the whole curated corpus (or one system).
 * Reads each registry entry's section paths; packs with no workflows and no
 * write tools pass trivially (a read-only twin has nothing to model).
 * @param {{repoRoot: string, registryPath?: string, system?: string}} options
 */
export async function validateCorpusMutations({ repoRoot, registryPath, system } = {}) {
  if (!repoRoot && !registryPath) throw new Error("validateCorpusMutations requires repoRoot or registryPath");
  const path = registryPath || join(repoRoot, "apps", "factory", "simulator-systems", "registry.json");
  const registry = JSON.parse(await readFile(path, "utf8"));
  const simulators = (registry.simulators || []).filter((sim) => sim?.id && (!system || sim.id === system));
  if (system && !simulators.length) throw new Error(`system "${system}" is not in the simulator registry`);

  const systems = [];
  for (const sim of simulators) {
    const sections = {
      schema: await readJsonSection(sim.schemaPath && join(repoRoot, sim.schemaPath)),
      tools: await readJsonSection(sim.toolsPath && join(repoRoot, sim.toolsPath)),
      workflows: await readJsonSection(sim.workflowsPath && join(repoRoot, sim.workflowsPath)),
    };
    const hasWrites =
      (sections.tools?.tools || []).some(isWriteTool) || Object.keys(sections.workflows?.toolHandlers || {}).length > 0;
    if (!hasWrites) {
      systems.push({ system: sim.id, ok: true, problems: [], warnings: [], handlerCount: 0, writeToolCount: 0 });
      continue;
    }
    const result = validatePackMutations({
      schema: sections.schema || {},
      tools: sections.tools || {},
      workflows: sections.workflows || {},
    });
    systems.push({ system: sim.id, ...result });
  }
  const failing = systems.filter((entry) => !entry.ok);
  return {
    schemaVersion: MUTATION_MODEL_SCHEMA_VERSION,
    ok: failing.length === 0,
    systems,
    summary: {
      total: systems.length,
      failing: failing.length,
      warnings: systems.reduce((n, entry) => n + entry.warnings.length, 0),
    },
  };
}
