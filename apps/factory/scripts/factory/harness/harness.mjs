// Antigravity harness orchestration: cmdHarnessReview (read-only spec-to-code
// audit) and cmdHarnessRefine (write-enabled implementation pass), plus every
// helper only they use. Extracted verbatim out of factory.mjs — moving code,
// not changing behavior.
//
// Dependency injection, not import-back: factory.mjs still owns pipeline
// state I/O (loadPipeline/savePipeline/markStep), the ok()/fail() contract
// (these two commands intentionally return the BARE summary object rather
// than ok(summary) — see the notes inline below, preserved verbatim), the
// harness-runner/harness-work-item bridges, the zod schemas, and the flag
// predicates (truthyFlag/wantsVertex/envOff) that are also used elsewhere in
// factory.mjs (assertPromotable, quality-gate, from-usecase, batch-audit).
// Passed in via `deps`, matching the injection pattern already used for
// buildAgentQualityPlan elsewhere in this tree.
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { isAbsolute, join, resolve } from "node:path";
import { extractFirstJsonObject } from "@ge/std/json-repair";
import { resolveGcpProject } from "@ge/std/gcp-config";
import { renderEvalConfig } from "../evals/render-eval-artifacts.mjs";

// Non-fatal: validate parsed harness output against its zod source of truth.
// Warns (keeps the output) so a contract drift surfaces without breaking a run.
function validateHarnessOutput(schema, value, label) {
  const result = schema.safeParse(value);
  if (!result.success) {
    console.error(`⚠  ${label} output failed schema validation (kept anyway): ${result.error.issues.map((i) => `${i.path.join(".") || "(root)"}: ${i.message}`).join("; ")}`);
  }
  return result.success;
}

function resolveHarnessLocation(flags = {}) {
  return flags.location
    || flags.region
    || process.env.GOOGLE_GENAI_LOCATION
    || process.env.GEMINI_ENTERPRISE_LOCATION
    || process.env.ANTIGRAVITY_VERTEX_LOCATION
    || process.env.GOOGLE_CLOUD_LOCATION
    || "global";
}

async function readWorkspaceReviewContext(dir) {
  const files = [
    "mock_systems/usecase-spec.json",
    "fixtures/manifest.json",
    "app/agent.py",
    "app/tools.py",
    "evals/golden.json",
    "tests/eval/eval_config.json",
    "tests/eval/evalsets/ge_behavior_contract.evalset.json",
    "artifacts/validation-report.json",
    "README.md",
  ];
  const parts = [];
  for (const rel of files) {
    const path = join(dir, rel);
    if (!existsSync(path)) continue;
    const text = await readFile(path, "utf8").catch(() => ""); // best-effort: excerpt bundle only; file may vanish between existsSync and the read
    parts.push([
      `## ${rel}`,
      "```",
      text.slice(0, 24000),
      text.length > 24000 ? "\n[truncated]" : "",
      "```",
    ].join("\n"));
  }
  return parts.join("\n\n");
}

export async function cmdHarnessReview(dir, flags, deps) {
  const {
    readJson, manifestPath, fail, mkdir, writeText, writeJson,
    loadPipeline, savePipeline, markStep, nextCommandFor,
    runHarnessTask, REPO_ROOT, HARNESS_DATA_ROOT,
    harnessReviewSchema, wantsVertex, truthyFlag,
    harnessResponseSchemaFile, reviewFanoutOptions,
  } = deps;
  const manifest = await readJson(manifestPath(dir), null);
  const spec = await readJson(join(dir, "mock_systems", "usecase-spec.json"), null);
  if (!manifest && !spec) fail("No generated workspace context found. Run 'factory from-usecase' or 'factory tools' first.");
  await mkdir(join(dir, "artifacts"), { recursive: true }).catch((error) => console.warn(`[harness] could not create directory ${join(dir, "artifacts")} — ${error?.message || String(error)}`));

  // Flag → env (centralized GE_HARNESS_AGENT knob) → historical default; the
  // claude/codex adapters run this same read-only audit with the JSON schema
  // embedded in the prompt (extractFirstJsonObject parses either way).
  const provider = flags.agent || flags.provider || process.env.GE_HARNESS_AGENT || "antigravity-sdk";
  const context = await readWorkspaceReviewContext(dir);
  const message = [
    "Review this generated GE ADK agent workspace for spec-to-code generation quality. Do not edit files.",
    "",
    "Source of truth: mock_systems/usecase-spec.json and fixtures/manifest.json.",
    "Your job is to audit whether the generated code and eval assets faithfully implement that spec, not whether the workspace merely imports.",
    "",
    "Required checks:",
    "- Every behaviorContract.toolIntent resolves to a canonical implemented Python tool; non-query intents are included in source_adapters.",
    "- app/agent.py renders the behavior contract into role, objective, scope, tool playbook, evidence requirements, escalation/refusal triggers, and hard guardrails.",
    "- app/tools.py uses source-system-specific names and returns evidence/audit fields promised by the contract.",
    "- Required inputs and produced IDs from toolIntents are represented in function signatures and results.",
    "- evals/golden.json and tests/eval/evalsets/ge_behavior_contract.evalset.json mirror goldenEvals and expected tool trajectories.",
    "- ADK runtime details are real: root_agent, generation config, output_key, callback wiring, and callback signatures compatible with ADK keyword invocation.",
    "- Validation artifacts either pass or explain a concrete generator/harness gap.",
    "",
    "Return only a single JSON object with this schema:",
    JSON.stringify({
      ok_to_promote: false,
      agent_quality_score: 0,
      spec_to_code_score: 0,
      spec_gaps: [],
      agent_logic_gaps: [],
      tool_gaps: [],
      mock_data_gaps: [],
      eval_gaps: [],
      adk_capability_gaps: [],
      recommended_generator_changes: [],
      recommended_pack_changes: [],
      required_follow_up_commands: [],
    }, null, 2),
    "",
    context,
  ].join("\n");

  const result = await runHarnessTask({
    repoRoot: REPO_ROOT,
    dataRoot: HARNESS_DATA_ROOT,
    workspaceDir: dir,
    agentId: provider,
    message,
    stages: ["review", "validate", "eval", "adk"],
    permissionProfile: flags["permission-profile"] || "review",
    model: flags.model || "default",
    vertex: wantsVertex(flags),
    project: resolveGcpProject({ explicit: flags.project || flags["gcp-project"] }),
    location: resolveHarnessLocation(flags),
    responseSchemaFile: harnessResponseSchemaFile("harness-review"),
    ...reviewFanoutOptions(),
    timeoutSec: Number(flags["timeout-sec"] || 300),
  });

  await writeText(join(dir, "artifacts", `${provider}-harness-review.raw.txt`), result.text || result.stdout || "");
  await writeJson(join(dir, "artifacts", `${provider}-harness-review.events.json`), {
    ok: result.ok,
    status: result.status,
    code: result.code,
    signal: result.signal,
    stderr: result.stderr,
    runtime: {
      adapterId: result.plan.adapterId,
      permissionProfile: result.plan.permissionProfile.id,
      requestedCapabilities: result.plan.requestedCapabilities,
      skills: result.plan.skills.map((skill) => ({
        id: skill.id,
        path: skill.relativePath,
        workspacePath: skill.workspaceRelativePath,
        capability: skill.capability,
      })),
    },
    events: result.events,
    diagnostics: result.summary?.diagnostics || [],
    runSummary: result.summary || null,
  });

  let review = null;
  let parseError = null;
  try {
    review = extractFirstJsonObject(result.text || result.stdout || "");
    validateHarnessOutput(harnessReviewSchema, review, "harness review");
    await writeJson(join(dir, "artifacts", `${provider}-harness-review.json`), review);
    await writeJson(join(dir, "artifacts", "harness-review.json"), {
      provider,
      ...review,
    });
    await applyHarnessReviewFeedback(dir, provider, review, deps);
  } catch (error) {
    parseError = error.message;
  }
  const soft = truthyFlag(flags.soft);
  if (!result.ok || !review) {
    const reason = !result.ok
      ? `harness run failed: ${result.stderr || result.status}`
      : `did not return parseable JSON: ${parseError}`;
    if (soft) {
      const summary = { step: "harness-review", provider, skipped: true, degraded: true, reason };
      console.error(`⚠  ${provider} harness review degraded (deterministic code kept): ${reason}`);
      // NOTE: intentionally `return summary;` (bare), not `return ok(summary);`.
      // This function is both a top-level command handler (registry wraps its
      // return value in {ok:true,...} at render time) AND an internal helper
      // called directly by cmdFromUseCase/cmdBatchAudit/cmdQualityGate, which
      // embed this exact return value verbatim (e.g. `harnessReview: reviewResult`
      // in from-usecase's own ok({...}) payload). Wrapping here would double-wrap
      // ok:true into that nested position and change byte-identical JSON output.
      return summary;
    }
    fail(`${provider} harness review ${reason}`, "GE0012");
  }
  const pipeline = await loadPipeline(dir);
  markStep(pipeline, "harnessReview", "done", {
    provider,
    output: `artifacts/${provider}-harness-review.json`,
    okToPromote: review.ok_to_promote,
    score: review.agent_quality_score,
    specToCodeScore: review.spec_to_code_score,
  });
  await savePipeline(dir, pipeline);
  const summary = {
    step: "harness-review",
    provider,
    output: `artifacts/${provider}-harness-review.json`,
    okToPromote: review.ok_to_promote,
    score: review.agent_quality_score,
    specToCodeScore: review.spec_to_code_score,
    nextCommand: nextCommandFor(pipeline, dir),
  };
  // See NOTE above: bare `return summary;` — the registry wraps ok:true for
  // top-level rendering; internal callers embed this value as-is.
  return summary;
}

async function applyHarnessReviewFeedback(dir, provider, review, deps) {
  const { writeJson, readJson, GENERATED_AT } = deps;
  const feedback = {
    kind: "ge.harness_review.feedback",
    provider,
    generatedAt: GENERATED_AT,
    okToPromote: review.ok_to_promote === true,
    score: Number(review.agent_quality_score || 0),
    specToCodeScore: Number(review.spec_to_code_score || 0),
    specGaps: Array.isArray(review.spec_gaps) ? review.spec_gaps : [],
    agentLogicGaps: Array.isArray(review.agent_logic_gaps) ? review.agent_logic_gaps : [],
    toolGaps: Array.isArray(review.tool_gaps) ? review.tool_gaps : [],
    mockDataGaps: Array.isArray(review.mock_data_gaps) ? review.mock_data_gaps : [],
    evalGaps: Array.isArray(review.eval_gaps) ? review.eval_gaps : [],
    adkCapabilityGaps: Array.isArray(review.adk_capability_gaps) ? review.adk_capability_gaps : [],
    recommendedGeneratorChanges: Array.isArray(review.recommended_generator_changes) ? review.recommended_generator_changes : [],
    recommendedPackChanges: Array.isArray(review.recommended_pack_changes) ? review.recommended_pack_changes : [],
    requiredFollowUpCommands: Array.isArray(review.required_follow_up_commands) ? review.required_follow_up_commands : [],
  };
  await writeJson(join(dir, "artifacts", "generator-feedback.json"), feedback);
  const specPath = join(dir, "mock_systems", "usecase-spec.json");
  const spec = await readJson(specPath, null);
  if (spec) {
    spec.agentQualityPlan = {
      ...(spec.agentQualityPlan || {}),
      harnessFeedback: feedback,
    };
    await writeJson(specPath, spec);
  }
  return feedback;
}

// Resumable refine: a stable save dir keeps SDK session artifacts grouped per
// work item. Recent google-antigravity SDKs treat conversation_id as resume-only
// and fail if the id is not already present, so first-run refine must not invent
// a conversation id. Operators can still pass GE_HARNESS_CONVERSATION_ID when
// resuming a known SDK-assigned conversation.
function refineSessionId(dir, workItem, { basename }) {
  const base = workItem.runId && workItem.itemId
    ? `${workItem.runId}-${workItem.itemId}`
    : `refine-${basename(dir)}`;
  return base.replace(/[^A-Za-z0-9._-]/g, "_");
}

async function refineResumeOptions(dir, workItem, deps) {
  const { envOff, HARNESS_DATA_ROOT, mkdir, basename } = deps;
  if (envOff("GE_HARNESS_NO_RESUME")) return {};
  const id = refineSessionId(dir, workItem, { basename });
  const saveDir = join(HARNESS_DATA_ROOT, "harness-sessions", id);
  await mkdir(saveDir, { recursive: true }).catch((error) => console.warn(`[harness] could not create directory ${saveDir} — ${error?.message || String(error)}`));
  return { saveDir };
}

export async function cmdHarnessRefine(dir, flags, deps) {
  const {
    readJson, manifestPath, fail, mkdir, writeText, writeJson,
    loadPipeline, savePipeline, markStep, nextCommandFor,
    runHarnessTask, REPO_ROOT, HARNESS_DATA_ROOT,
    harnessRefineSchema, wantsVertex, truthyFlag,
    harnessResponseSchemaFile, basename,
    buildHarnessWorkItem, writeHarnessWorkItem, buildHarnessRefinePrompt, buildHarnessRunSummary,
  } = deps;
  const manifest = await readJson(manifestPath(dir), null);
  const spec = await readJson(join(dir, "mock_systems", "usecase-spec.json"), null);
  if (!manifest && !spec) fail("No generated workspace context found. Run 'factory from-usecase' or 'factory tools' first.");
  await mkdir(join(dir, "artifacts"), { recursive: true }).catch((error) => console.warn(`[harness] could not create directory ${join(dir, "artifacts")} — ${error?.message || String(error)}`));

  const provider = flags.agent || flags.provider || process.env.GE_HARNESS_AGENT || "antigravity-sdk";
  const workItem = buildHarnessWorkItem({
    runId: flags["run-id"] || process.env.GE_AGENT_FACTORY_RUN_ID || null,
    itemId: flags["item-id"] || process.env.GE_AGENT_FACTORY_ITEM_ID || null,
    workspaceDir: dir,
    stage: "harness_refine",
    adapter: provider,
    locality: flags.locality || process.env.GE_HARNESS_LOCALITY || (process.env.K_SERVICE ? "remote" : "local"),
    project: resolveGcpProject({ explicit: flags.project || flags["gcp-project"] }),
    location: resolveHarnessLocation(flags),
    targetGate: flags["target-gate"] || "validate",
    permissionProfile: flags["permission-profile"] || "workspace_write",
    model: flags.model || "default",
    soft: truthyFlag(flags.soft),
  });
  await writeHarnessWorkItem(dir, workItem);
  const reviewPath = join(dir, "artifacts", `${provider}-harness-review.json`);
  const feedbackPath = join(dir, "artifacts", "generator-feedback.json");
  const review = await readJson(reviewPath, null);
  const feedback = await readJson(feedbackPath, null);
  const context = await readWorkspaceReviewContext(dir);
  const message = await buildHarnessRefinePrompt({ workItem, workspaceContext: context, review, feedback });
  const resumeOpts = await refineResumeOptions(dir, workItem, deps);

  const result = await runHarnessTask({
    repoRoot: REPO_ROOT,
    dataRoot: HARNESS_DATA_ROOT,
    workspaceDir: dir,
    agentId: provider,
    message,
    stages: ["implementation", "repair", "validate", "eval", "adk"],
    permissionProfile: workItem.permissionProfile,
    model: workItem.model,
    vertex: wantsVertex(flags),
    project: resolveGcpProject({ explicit: flags.project || flags["gcp-project"] }),
    location: resolveHarnessLocation(flags),
    responseSchemaFile: harnessResponseSchemaFile("harness-refine"),
    protectFiles: ["tools.py"],
    // Refine fixes generated code in place; it never deletes workspace files or
    // generates images. Remove those builtins from the model's context entirely.
    disableTools: ["DELETE_FILE", "GENERATE_IMAGE"],
    // Resumable session: re-running refine on the same work item resumes rather
    // than starting from scratch.
    ...resumeOpts,
    timeoutSec: Number(flags["timeout-sec"] || 600),
  });

  await writeText(join(dir, "artifacts", `${provider}-harness-refine.raw.txt`), result.text || result.stdout || "");
  await writeJson(join(dir, "artifacts", `${provider}-harness-refine.events.json`), {
    workItem,
    ok: result.ok,
    status: result.status,
    code: result.code,
    signal: result.signal,
    stderr: result.stderr,
    runtime: {
      adapterId: result.plan.adapterId,
      permissionProfile: result.plan.permissionProfile.id,
      requestedCapabilities: result.plan.requestedCapabilities,
      skills: result.plan.skills.map((skill) => ({
        id: skill.id,
        path: skill.relativePath,
        workspacePath: skill.workspaceRelativePath,
        capability: skill.capability,
      })),
    },
    events: result.events,
    diagnostics: result.summary?.diagnostics || [],
    runSummary: result.summary || null,
  });
  if (!result.ok) {
    const reason = `harness run failed: ${result.stderr || result.status}`;
    if (truthyFlag(flags.soft)) {
      const summary = { step: "harness-refine", provider, skipped: true, degraded: true, reason };
      console.error(`⚠  ${provider} harness refine degraded (deterministic code kept): ${reason}`);
      // See NOTE in cmdHarnessReview above: bare return, not return ok(...).
      return summary;
    }
    fail(`${provider} harness refine ${reason}`, "GE0012");
  }

  let refine = null;
  try {
    refine = extractFirstJsonObject(result.text || result.stdout || "");
  } catch {
    refine = {
      changed_files: [],
      summary: String(result.text || result.stdout || "").slice(0, 4000),
      verification_commands: [],
      remaining_gaps: ["Harness did not return parseable JSON completion packet."],
    };
  }
  validateHarnessOutput(harnessRefineSchema, refine, "harness refine");
  await writeJson(join(dir, "artifacts", `${provider}-harness-refine.json`), refine);
  await writeJson(join(dir, "artifacts", "harness-refine.json"), {
    provider,
    workItem,
    ...refine,
  });
  await writeJson(join(dir, "artifacts", "harness-run-summary.json"), await buildHarnessRunSummary({
    workItem,
    result,
    provider,
    output: `artifacts/${provider}-harness-refine.json`,
    changedFiles: refine.changed_files || [],
  }));
  const pipeline = await loadPipeline(dir);
  markStep(pipeline, "harnessRefine", "done", {
    provider,
    output: `artifacts/${provider}-harness-refine.json`,
    changedFiles: refine.changed_files || [],
  });
  await savePipeline(dir, pipeline);
  const summary = {
    step: "harness-refine",
    provider,
    output: `artifacts/${provider}-harness-refine.json`,
    changedFiles: refine.changed_files || [],
    nextCommand: nextCommandFor(pipeline, dir),
  };
  // See NOTE in cmdHarnessReview above: bare return, not return ok(...).
  return summary;
}

// ── harness-as-judge ────────────────────────────────────────────────────────
// The judge lane runs through the SAME harness adapters (antigravity-sdk,
// claude, codex, gemini — flag → GE_HARNESS_AGENT → default) and the same
// skill materialization as review/refine, instead of being a bare model id in
// eval_config.yaml. Split of responsibilities:
//   · rubric (LLM-judged) metrics — the harness grades each case against the
//     behavior contract's rubric prose (the SAME rubric source that renders
//     eval_config.yaml's judge metric, via renderEvalConfig), one 0–1 score
//     per standard metric name;
//   · aggregation + thresholds — deterministic code below (mean per metric,
//     gated against the same thresholds the platform judge uses);
//   · computed metrics (transport, tool trajectory, response match, grounding)
//     stay in the deterministic lane (evalkit / `ge prove --live`), never LLM.

// Normalize judge input into [{ id, prompt, response, toolCalls }] cases.
// Accepts a bare case array, a `ge drive`/prove LiveTranscript ({turns:[...]}),
// or an object wrapping either under `cases`.
export function normalizeJudgeCases(raw) {
  if (Array.isArray(raw)) {
    return raw.map((entry, index) => ({
      id: String(entry?.id || `case-${index + 1}`),
      prompt: String(entry?.prompt || entry?.input || entry?.question || entry?.user?.text || ""),
      response: String(entry?.response || entry?.finalResponse || entry?.final_response || entry?.output || entry?.assistant?.text || entry?.text || ""),
      toolCalls: (entry?.toolCalls || entry?.tool_calls || entry?.invocationTools || []).map((tool) => String(tool?.name || tool)),
    })).filter((entry) => entry.prompt || entry.response);
  }
  if (raw && Array.isArray(raw.turns)) {
    return raw.turns.map((turn, index) => ({
      id: `turn-${(Number.isInteger(turn?.index) ? turn.index : index) + 1}`,
      prompt: String(turn?.user?.text || ""),
      response: String(turn?.assistant?.text || ""),
      toolCalls: (turn?.invocationTools || []).map((tool) => String(tool?.name || tool)),
    })).filter((entry) => entry.prompt || entry.response);
  }
  if (raw && Array.isArray(raw.cases)) return normalizeJudgeCases(raw.cases);
  return [];
}

function judgeRubricLines(rubrics) {
  return rubrics.map((rubric) => `- ${rubric.rubric_id}: ${rubric.rubric_content.text_property}`);
}

// Deterministic aggregation of per-case judge scores into standard
// metric-shaped rows: { metric: { meanScore, threshold, pass, cases } }.
export function aggregateJudgeMetrics(cases, { toolUseThreshold, finalResponseThreshold }) {
  const mean = (key) => cases.length
    ? Number((cases.reduce((sum, entry) => sum + (Number(entry[key]) || 0), 0) / cases.length).toFixed(4))
    : 0;
  const row = (meanScore, threshold) => ({ meanScore, threshold, pass: cases.length > 0 && meanScore >= threshold, cases: cases.length });
  const behaviorThreshold = Math.min(toolUseThreshold, finalResponseThreshold);
  return {
    tool_use_quality: row(mean("tool_use_quality"), toolUseThreshold),
    final_response_quality: row(mean("final_response_quality"), finalResponseThreshold),
    ge_behavior_contract_judge: row(mean("behavior_contract_score"), behaviorThreshold),
  };
}

export async function cmdHarnessJudge(dir, flags, deps) {
  const {
    readJson, fail, mkdir, writeText, writeJson,
    loadPipeline, savePipeline, markStep, nextCommandFor,
    runHarnessTask, REPO_ROOT, HARNESS_DATA_ROOT,
    harnessJudgeSchema, wantsVertex, truthyFlag,
    harnessResponseSchemaFile, reviewFanoutOptions,
  } = deps;
  const spec = await readJson(join(dir, "mock_systems", "usecase-spec.json"), null);
  const behaviorContract = spec?.behaviorContract || spec?.generationSpec?.behaviorContract || null;
  if (!behaviorContract) fail("No behavior contract found (mock_systems/usecase-spec.json). Run 'factory from-usecase' or 'factory tools' first.");
  if (!flags.results) {
    fail("Pass --results <path> — a JSON file of cases to judge: a `ge drive`/`ge prove --live` transcript (.ge/transcripts/<id>.json), an agents-cli eval generate output, or an array of {prompt, response, toolCalls} objects.");
  }
  const resultsPath = isAbsolute(flags.results) ? flags.results : resolve(dir, flags.results);
  const rawResults = await readJson(resultsPath, null);
  if (!rawResults) fail(`Could not read judge input: ${resultsPath}`);
  const cases = normalizeJudgeCases(rawResults);
  if (!cases.length) fail(`Judge input has no gradeable cases (need prompt/response pairs): ${resultsPath}`);
  await mkdir(join(dir, "artifacts"), { recursive: true }).catch((error) => console.warn(`[harness] could not create directory ${join(dir, "artifacts")} — ${error?.message || String(error)}`));

  const provider = flags.agent || flags.provider || process.env.GE_HARNESS_AGENT || "antigravity-sdk";
  // Same rubric source as the generated eval_config.yaml judge metric — one
  // rubric prose, two execution lanes (platform judge_model, harness judge).
  const criteria = renderEvalConfig(behaviorContract).criteria;
  const toolUse = criteria.rubric_based_tool_use_quality_v1;
  const finalResponse = criteria.rubric_based_final_response_quality_v1;
  const message = [
    "Judge the recorded agent behavior below against its behavior contract. Do not edit files.",
    "",
    "For EVERY case: judge each rubric independently (1 satisfied, 0 violated), using toolCalls for tool-use rubrics and response for final-response rubrics. Then report, per case:",
    "- tool_use_quality: fraction of tool-use rubrics satisfied (0.0-1.0)",
    "- final_response_quality: fraction of final-response rubrics satisfied (0.0-1.0)",
    "- behavior_contract_score: fraction of ALL rubrics satisfied (0.0-1.0)",
    "",
    "Tool-use rubrics:",
    ...judgeRubricLines(toolUse.rubrics),
    "",
    "Final-response rubrics:",
    ...judgeRubricLines(finalResponse.rubrics),
    "",
    "Return only a single JSON object with this schema:",
    JSON.stringify({
      cases: [{ id: "", tool_use_quality: 0, final_response_quality: 0, behavior_contract_score: 0, rubric_verdicts: [{ rubric_id: "", verdict: 0, reason: "" }], explanation: "" }],
      notes: [],
    }, null, 2),
    "",
    "# Cases to judge",
    "",
    "```json",
    JSON.stringify(cases, null, 2).slice(0, 120000),
    "```",
  ].join("\n");

  const result = await runHarnessTask({
    repoRoot: REPO_ROOT,
    dataRoot: HARNESS_DATA_ROOT,
    workspaceDir: dir,
    agentId: provider,
    message,
    // "eval" routes the eval/judging skills from the skill registry into the
    // run — the judge is a harness WITH skills, not a bare model call.
    stages: ["eval", "review"],
    permissionProfile: flags["permission-profile"] || "review",
    model: flags.model || "default",
    vertex: wantsVertex(flags),
    project: resolveGcpProject({ explicit: flags.project || flags["gcp-project"] }),
    location: resolveHarnessLocation(flags),
    responseSchemaFile: harnessResponseSchemaFile("harness-judge"),
    ...reviewFanoutOptions(),
    timeoutSec: Number(flags["timeout-sec"] || 600),
  });

  await writeText(join(dir, "artifacts", `${provider}-harness-judge.raw.txt`), result.text || result.stdout || "");
  let judged = null;
  let parseError = null;
  try {
    judged = extractFirstJsonObject(result.text || result.stdout || "");
    validateHarnessOutput(harnessJudgeSchema, judged, "harness judge");
  } catch (error) {
    parseError = error.message;
  }
  if (!result.ok || !judged || !Array.isArray(judged.cases)) {
    const reason = !result.ok
      ? `harness run failed: ${result.stderr || result.status}`
      : `did not return parseable JSON: ${parseError || "no cases array"}`;
    if (truthyFlag(flags.soft)) {
      const summary = { step: "harness-judge", provider, skipped: true, degraded: true, reason };
      console.error(`⚠  ${provider} harness judge degraded: ${reason}`);
      // Bare return, same contract as cmdHarnessReview (see the NOTE there).
      return summary;
    }
    fail(`${provider} harness judge ${reason}`, "GE0012");
  }

  const metrics = aggregateJudgeMetrics(judged.cases, {
    toolUseThreshold: toolUse.threshold,
    finalResponseThreshold: finalResponse.threshold,
  });
  const pass = Object.values(metrics).every((metric) => metric.pass);
  const artifact = {
    kind: "ge.harness_judge.result",
    provider,
    resultsPath,
    casesJudged: judged.cases.length,
    metrics,
    pass,
    cases: judged.cases,
    notes: Array.isArray(judged.notes) ? judged.notes : [],
    // Deterministic metrics (transport, trajectory, response match, grounding)
    // are the other lane: `ge prove --live` / evalkit — never judged here.
    computedMetricsLane: "ge prove --live",
  };
  await writeJson(join(dir, "artifacts", `${provider}-harness-judge.json`), artifact);
  await writeJson(join(dir, "artifacts", "harness-judge.json"), artifact);
  const pipeline = await loadPipeline(dir);
  markStep(pipeline, "harnessJudge", pass ? "done" : "failed", {
    provider,
    output: `artifacts/${provider}-harness-judge.json`,
    pass,
    cases: judged.cases.length,
  });
  await savePipeline(dir, pipeline);
  const summary = {
    step: "harness-judge",
    provider,
    output: `artifacts/${provider}-harness-judge.json`,
    pass,
    metrics,
    casesJudged: judged.cases.length,
    nextCommand: nextCommandFor(pipeline, dir),
  };
  // Bare return, same contract as cmdHarnessReview (see the NOTE there).
  return summary;
}

// Exported for tests / callers that want the individual helpers without going
// through a cmd* function.
export const __internal = {
  validateHarnessOutput,
  readWorkspaceReviewContext,
  applyHarnessReviewFeedback,
  refineSessionId,
  resolveHarnessLocation,
  refineResumeOptions,
};
