import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import test from "node:test";
import { getAgentDef } from "../src/agents.js";
import { buildHandoffPacket, buildHarnessRunPlan } from "../src/harness-runtime.js";
import { runPreflight } from "../src/preflight.js";
import { parseJsonStreamEvent, startServer } from "../src/server.js";
import { loadSkillRegistry, selectSkillsForContext } from "../src/skill-registry.js";
import { runWorkspaceValidation } from "../src/workspace-validation.js";
import { validateAgentWorkspace } from "../src/agent-workspace-pipeline.js";
import { GENERATOR_DATA_ROOT, GENERATOR_WORKSPACES_ROOT } from "../src/state-paths.js";
import { ARTIFACT_PATHS } from "../src/workspace-contract.js";
import { runWorkspaceDoctor } from "../src/workspace-doctor.js";
import { runWorkspaceRepair } from "../src/workspace-repair.js";
import { startWebServer } from "../src/web-server.js";
import { createOutputParser } from "../src/output-parsers.js";
import {
  closeDatabase,
  getAgentSpecRegistryDb,
  listAgentSpecRegistryDb,
  openDatabase,
  replaceAgentSpecRegistryDb,
} from "../src/db.js";
import { normalizeAgentSpecEntry } from "../src/agent-spec-registry.js";
import { buildControlPlanePlan, factoryStageStatus, nextFactoryStage } from "../src/factory-orchestration.js";
import { buildCloudTaskCommand, buildStageExecutionPlan, parseCloudBuildDescribe, parseCloudBuildId, parseWorkerPayload, runFactoryWorker } from "../src/factory-worker.js";
import { buildHarnessWorkItem } from "../src/harness-work-item.js";
import { analyticsPack } from "../scripts/ge-mock/packs/analytics.mjs";
import { contentCollaborationPack } from "../scripts/ge-mock/packs/content-collaboration.mjs";
import { crmMarketingOpsPack } from "../scripts/ge-mock/packs/crm-marketing-ops.mjs";
import { financeErpPack } from "../scripts/ge-mock/packs/finance-erp.mjs";
import { hrEmployeeRecordsPack } from "../scripts/ge-mock/packs/hr-employee-records.mjs";
import { identitySecurityPack } from "../scripts/ge-mock/packs/identity-security.mjs";
import { itsmPack } from "../scripts/ge-mock/packs/itsm.mjs";
import { learningTalentPack } from "../scripts/ge-mock/packs/learning-talent.mjs";
import { procurementOpsPack } from "../scripts/ge-mock/packs/procurement-ops.mjs";
import { digitalAssetPack } from "../scripts/ge-mock/packs/digital-assets.mjs";
import { seoMonitoringPack } from "../scripts/ge-mock/packs/seo-monitoring.mjs";
import { thirdPartyRiskPack } from "../scripts/ge-mock/packs/third-party-risk.mjs";
import { enrichScenarioSpec } from "../scripts/ge-mock/packs/index.mjs";

const REPO_ROOT = resolve(new URL("..", import.meta.url).pathname);
const CANONICAL_REPO_ROOT = resolve(REPO_ROOT, "..", "..");
// Derive the workspaces root from the SAME module the in-process server uses
// (src/state-paths.js) so the test and server can never disagree, regardless of
// how the suite is launched (bun test / node --test, with or without
// GE_HARNESS_DATA_ROOT). The canonical runner still sets that env var to isolate
// into .ge/test/ge-demo-generator; a bare runner falls back to .ge/factory — but
// in BOTH cases the server and the test resolve the identical directory.
const DATA_ROOT = GENERATOR_DATA_ROOT;
const PROJECTS_ROOT = GENERATOR_WORKSPACES_ROOT;
const INSTALLED_AGENTS_CLI_WORKFLOW = join(process.env.HOME || "/home/user", ".agents", "skills", "google-agents-cli-workflow", "SKILL.md");

function minimalBehaviorSpec() {
  return {
    behaviorContract: {
      role: "HR benefits enrollment assistant for employee self-service",
      primaryObjective: "Help employees answer benefits questions and complete compliant enrollment steps using only cited Workday and Benefits Platform evidence.",
      toolIntents: [
        { name: "query_workday_employees", kind: "query", sourceSystemId: "workday", description: "Find employee eligibility and profile records." },
        { name: "query_benefits_platform_enrollments", kind: "query", sourceSystemId: "benefits_platform", description: "Find current enrollment records." },
        { name: "action_benefits_platform_enroll", kind: "action", sourceSystemId: "benefits_platform", description: "Submit an enrollment transaction.", requiredInputs: ["employee_id"] },
      ],
      evidenceRequirements: [{ claim: "enrollment eligibility", mustCite: ["source-system record"], sourceSystemIds: ["workday", "benefits_platform"] }],
      escalationRules: [{ trigger: "employee identity cannot be verified", action: "escalate", handoffTarget: "HR benefits specialist", rationale: "Benefits changes require verified identity." }],
      refusalRules: ["Do not invent enrollment identifiers."],
      goldenEvals: [{
        id: "enroll-employee",
        prompt: "Enroll EMP-1 in benefits.",
        expectedToolCalls: ["query_workday_employees", "action_benefits_platform_enroll"],
        mustReferenceEntities: ["employees"],
      }],
    },
    agentQualityPlan: {
      adkCapabilities: {
        outputKey: "last_response",
        callbacks: ["before_agent_callback", "before_tool_callback", "after_tool_callback"],
      },
      evalPlan: {
        agentEvals: ["tool_trajectory_avg_score", "rubric_based_final_response_quality_v1"],
      },
    },
  };
}

async function writeValidationFixtureWorkspace(workspace, { rows = [{ id: "EMP-1", name: "A" }, { id: "EMP-2", name: "B" }] } = {}) {
  await mkdir(join(workspace, "fixtures", "tables"), { recursive: true });
  await mkdir(join(workspace, "mock_systems"), { recursive: true });
  await mkdir(join(workspace, "app"), { recursive: true });
  await mkdir(join(workspace, "tests"), { recursive: true });
  await mkdir(join(workspace, "tests", "eval", "evalsets"), { recursive: true });
  await mkdir(join(workspace, "evals"), { recursive: true });
  await writeFile(join(workspace, "mock_systems", "pipeline.json"), JSON.stringify({ steps: {} }), "utf8");
  await writeFile(join(workspace, "mock_systems", "usecase-spec.json"), JSON.stringify(minimalBehaviorSpec()), "utf8");
  await writeFile(join(workspace, "mock_systems", "schema.json"), JSON.stringify({
    tables: [{ name: "employees", columns: [{ name: "id" }, { name: "name" }] }],
    rowPolicy: { minimumRowsPerEntity: 1 },
  }), "utf8");
  await writeFile(join(workspace, "fixtures", "manifest.json"), JSON.stringify({
    id: "validation",
    systems: [
      { id: "workday", name: "Workday" },
      { id: "benefits_platform", name: "Benefits Platform" },
    ],
    tables: [{
      name: "employees",
      jsonPath: "tables/employees.json",
      rowCount: rows.length,
      primaryKey: "id",
      sourceSystem: "Workday",
      sourceSystemId: "workday",
      columns: [{ name: "id" }, { name: "name" }],
    }],
    documents: [],
  }), "utf8");
  await writeFile(join(workspace, "fixtures", "tables", "employees.json"), JSON.stringify(rows), "utf8");
  await writeFile(join(workspace, "app", "agent.py"), [
    "from .tools import source_adapters",
    "PRIMARY_OBJECTIVE = 'Help employees answer benefits questions and complete compliant enrollment steps using only cited Workday and Benefits Platform evidence.'",
    "INSTRUCTION = '''PRIMARY OBJECTIVE",
    "Help employees answer benefits questions and complete compliant enrollment steps using only cited Workday and Benefits Platform evidence.",
    "ADK RUNTIME DESIGN",
    "TOOL PLAYBOOK",
    "- query_workday_employees",
    "- query_benefits_platform_enrollments",
    "- action_benefits_platform_enroll",
    "EVIDENCE YOU MUST CITE",
    "- Workday and Benefits Platform source records",
    "ESCALATION & REFUSAL TRIGGERS",
    "- Escalate when employee identity cannot be verified",
    "HARD GUARDRAILS",
    "- Do not invent enrollment identifiers.",
    "'''",
    "class DummyAgent:",
    "    def __init__(self, **kwargs):",
    "        self.__dict__.update(kwargs)",
    "async def enforce_tool_contract(tool=None, args=None, tool_context=None, **kwargs):",
    "    return None",
    "async def capture_tool_evidence(tool=None, args=None, tool_context=None, tool_response=None, **kwargs):",
    "    return None",
    "root_agent = DummyAgent(",
    "    instruction=INSTRUCTION,",
    "    name='benefits_assistant_agent',",
    "    model='gemini-3.5-flash',",
    "    description='Benefits assistant fixture',",
    "    generate_content_config=object(),",
    "    output_key='last_response',",
    "    before_agent_callback=object(),",
    "    before_tool_callback=enforce_tool_contract,",
    "    after_tool_callback=capture_tool_evidence,",
    ")",
  ].join("\n"), "utf8");
  await writeFile(join(workspace, "app", "tools.py"), [
    "class FunctionTool:",
    "    def __init__(self, func): self.func = func",
    "def describe_data_model(): return {'tables': []}",
    "def query_workday_employees(): return {'rows': []}",
    "def query_benefits_platform_enrollments(): return {'rows': []}",
    "def action_benefits_platform_enroll(employee_id='EMP-1'): return {'audit_trail': 'AUDIT-1'}",
    "source_adapters = [FunctionTool(func=describe_data_model), FunctionTool(func=query_workday_employees), FunctionTool(func=query_benefits_platform_enrollments), FunctionTool(func=action_benefits_platform_enroll)]",
  ].join("\n"), "utf8");
  await writeFile(join(workspace, "pyproject.toml"), "dependencies = [\"google-adk\"]\n", "utf8");
  await writeFile(join(workspace, "tests", "test_smoke.py"), "def test_ok(): assert True\n", "utf8");
  await writeFile(join(workspace, "evals", "golden.json"), JSON.stringify({
    primaryObjective: minimalBehaviorSpec().behaviorContract.primaryObjective,
    evals: minimalBehaviorSpec().behaviorContract.goldenEvals,
  }), "utf8");
  await writeFile(join(workspace, "tests", "eval", "evalsets", "ge_behavior_contract.evalset.json"), JSON.stringify({
    eval_set_id: "ge_behavior_contract",
    eval_cases: [{ eval_id: "enroll-employee", conversation: [], session_input: { app_name: "app", user_id: "test", state: {} } }],
  }), "utf8");
  await writeFile(join(workspace, "tests", "eval", "eval_config.json"), JSON.stringify({ criteria: {} }), "utf8");
  await writeFile(join(workspace, "tests", "eval", "optimization_config.json"), JSON.stringify({
    train_dataset: "tests/eval/evalsets/ge_behavior_contract.evalset.json",
    validation_dataset: "tests/eval/evalsets/ge_behavior_contract.evalset.json",
  }), "utf8");
}

async function readSse(response) {
  const text = await response.text();
  return text
    .split("\n\n")
    .map((chunk) => {
      const lines = chunk.split("\n");
      const event = lines.find((line) => line.startsWith("event:"))?.slice(6).trim();
      const data = lines.find((line) => line.startsWith("data:"))?.slice(5);
      return event && data ? { event, data: JSON.parse(data) } : null;
    })
    .filter(Boolean);
}

test("server imports and web mode do not initialize daemon persistence", async () => {
  const parsed = parseJsonStreamEvent(JSON.stringify({ type: "message", delta: "hello" }));
  assert.equal(parsed.type, "json_event");
  const existedBefore = existsSync(DATA_ROOT);

  const { server, url } = await startWebServer({ port: 0, returnServer: true });
  try {
    const html = await fetch(url).then((res) => res.text());
    assert.match(html, /GE Demo Generator|Gemini Enterprise|Agent/);
    assert.equal(existsSync(DATA_ROOT), existedBefore);
  } finally {
    await new Promise((resolveClose) => server.close(resolveClose));
  }
});

test("harness planner selects capabilities and binds safe review permissions", async () => {
  const agents = [
    { id: "gemini", name: "Gemini CLI", available: false },
    { id: "claude", name: "Claude Code", available: true },
    { id: "mock", name: "Mock", available: true },
  ];
  const plan = buildHarnessRunPlan({
    agents,
    requestedAgentId: "gemini",
    message: "Audit the daemon for regressions and review risks.",
  });
  assert.equal(plan.adapterId, "claude");
  assert.equal(plan.fallbackFrom, "gemini");
  assert.equal(plan.permissionProfile.id, "review");
  assert.ok(plan.requestedCapabilities.includes("review"));

  const gemini = await getAgentDef("gemini");
  assert.equal(gemini.buildArgs("", { permissionProfile: "review" }).includes("yolo"), false);
  assert.equal(gemini.buildArgs("", { permissionProfile: "workspace_write" }).includes("yolo"), true);
});

test("agent spec registry preserves variant lineage and build gates", async () => {
  const entry = normalizeAgentSpecEntry({
    id: "benefits-assistant-successfactors",
    title: "Benefits Assistant SuccessFactors Variant",
    department: "hr",
    subtitle: "Resolve benefits eligibility and enrollment questions with cited HR source evidence.",
    persona: "HR shared services benefits specialist",
    familyId: "benefits-assistant",
    variantOf: "benefits-assistant",
    kpis: [
      { label: "Eligibility answer cycle time", before: "2 business days", after: "< 2 minutes" },
      { label: "Unsupported enrollment answers", before: "Manual review required", after: "Blocked by citation gates" },
    ],
    statusQuo: ["HR agents manually inspect SuccessFactors records.", "Benefits policy citations are assembled ad hoc."],
    agentification: ["Agent queries employee eligibility records.", "Agent cites policy evidence before recommending next steps."],
    architecture: {
      connections: ["SAP SuccessFactors employee record query", "Benefits Platform policy and enrollment lookup"],
      pipeline: ["Interview-generated spec", "Mock data and simulator seed", "ADK agent build and golden eval"],
    },
    variant: {
      label: "SuccessFactors source-system variant",
      dimensions: {
        systems: ["Replace Workday with SAP SuccessFactors"],
        logic: ["Keep eligibility logic but remap enrollment statuses"],
      },
      invariants: ["Cite source-system evidence before recommending enrollment actions"],
    },
    systems: ["SAP SuccessFactors", "Benefits Platform", "Vertex AI"],
    generationSpec: {
      version: 1,
      rowPolicy: {
        defaultRowsPerEntity: 25,
        minimumRowsPerEntity: 1,
        rationale: "Small deterministic fixtures cover eligible, ineligible, and pending enrollment states.",
      },
      sourceSystems: [
        {
          id: "successfactors",
          name: "SAP SuccessFactors",
          owns: ["employees"],
          protocol: "mcp",
          localBacking: ["sqlite"],
          toolNames: ["query_successfactors_employees"],
          evidence: ["employee eligibility record"],
        },
        {
          id: "benefits_platform",
          name: "Benefits Platform",
          owns: ["benefits-policy", "enrollments"],
          protocol: "mcp",
          localBacking: ["markdown", "sqlite"],
          toolNames: ["query_benefits_platform_enrollments", "lookup_benefits_policy", "submit_benefits_exception"],
          evidence: ["policy citation", "enrollment record"],
        },
      ],
      entities: [
        {
          name: "employees",
          sourceSystemId: "successfactors",
          primaryKey: "id",
          datastore: "alloydb",
          rowCount: 25,
          columns: [{ name: "id" }, { name: "status" }, { name: "country" }],
        },
      ],
      documents: [
        {
          id: "benefits-policy",
          sourceSystemId: "benefits_platform",
          title: "Benefits Policy",
          requiredSections: ["Eligibility"],
          citationAnchors: ["eligibility"],
          minimumWordCount: 500,
        },
      ],
      anomalies: [
        {
          id: "identity-mismatch",
          description: "Employee record identity fields conflict with the enrollment request.",
          affectedEntities: ["employees"],
          expectedEvidence: ["employee eligibility record"],
        },
      ],
      datastorePackaging: { structured: ["alloydb"], unstructured: ["markdown"], vector: ["vertex_ai"] },
      validation: {
        smokePrompt: "Can EMP-1 enroll in medical benefits?",
        assertions: ["cites SuccessFactors employee record", "cites Benefits Policy eligibility section"],
      },
      behaviorContract: {
        role: "Benefits enrollment assistant for HR shared services",
        primaryObjective: "Answer benefits eligibility questions and recommend compliant enrollment next steps using only cited SuccessFactors and Benefits Platform evidence.",
        inScope: ["Eligibility lookup", "Enrollment status explanation"],
        outOfScope: ["Legal advice", "Unsupported plan changes"],
        toolIntents: [
          {
            name: "query_successfactors_employees",
            kind: "query",
            sourceSystemId: "successfactors",
            description: "Retrieve employee eligibility attributes from SuccessFactors.",
            requiredInputs: ["employee_id"],
            produces: ["employee_record"],
            evidenceEmitted: ["employee eligibility record"],
          },
          {
            name: "lookup_benefits_policy",
            kind: "evidence_lookup",
            sourceSystemId: "benefits_platform",
            description: "Find cited policy sections for eligibility decisions.",
            requiredInputs: ["policy_topic"],
            produces: ["policy_excerpt"],
            evidenceEmitted: ["policy citation"],
          },
          {
            name: "submit_benefits_exception",
            kind: "action",
            sourceSystemId: "benefits_platform",
            description: "Open a benefits exception case when eligibility is ambiguous.",
            requiredInputs: ["employee_id", "reason"],
            produces: ["exception_case_id"],
            evidenceEmitted: ["case audit record"],
          },
        ],
        evidenceRequirements: [{ claim: "eligibility", mustCite: ["source-system record"], sourceSystemIds: ["successfactors"] }],
        escalationRules: [
          { trigger: "identity mismatch", action: "escalate", handoffTarget: "HR benefits specialist" },
          { trigger: "policy evidence missing", action: "request_more_info", handoffTarget: "Benefits policy owner" },
        ],
        refusalRules: ["Do not invent eligibility or enrollment status.", "Do not recommend a plan change without cited policy evidence."],
        goldenEvals: [{ id: "eligibility-check", prompt: "Can EMP-1 enroll?", expectedToolCalls: ["query_successfactors_employees"] }],
      },
    },
  });

  assert.equal(entry.registry.build.enabled, true);
  assert.equal(entry.registry.familyId, "benefits-assistant");
  assert.equal(entry.registry.variant.variantOf, "benefits-assistant");
  assert.deepEqual(entry.registry.variant.dimensions.systems, ["Replace Workday with SAP SuccessFactors"]);
});

test("agent spec registry instantiates into sqlite projection", async () => {
  const dataRoot = join(DATA_ROOT, `registry-db-${Date.now()}`);
  await openDatabase(dataRoot);
  try {
    const entry = normalizeAgentSpecEntry({
      id: "policy-answering-agent",
      title: "Policy Answering Agent",
      department: "hr",
      subtitle: "Answer HR policy questions with SharePoint citations and auditable refusals.",
      persona: "HR operations policy owner",
      kpis: [
        { label: "Policy response latency", before: "1 business day", after: "< 1 minute" },
        { label: "Uncited policy answers", before: "Manual QA sample", after: "Blocked by golden evals" },
      ],
      statusQuo: ["Employees search SharePoint manually.", "Policy owners review ambiguous answers after the fact."],
      agentification: ["Agent retrieves the relevant handbook section.", "Agent refuses answers without citation anchors."],
      architecture: {
        connections: ["SharePoint policy document lookup", "Vertex AI grounded response generation"],
        pipeline: ["Spec registry entry", "Document fixture generation", "Golden eval and ADK build"],
      },
      systems: ["SharePoint", "Vertex AI"],
      generationSpec: {
        version: 1,
        rowPolicy: {
          defaultRowsPerEntity: 20,
          minimumRowsPerEntity: 1,
          rationale: "Policy fixtures need enough rows to cover active, draft, and retired handbook entries.",
        },
        sourceSystems: [{
          id: "sharepoint",
          name: "SharePoint",
          owns: ["policy_documents", "policy-handbook"],
          protocol: "mcp",
          localBacking: ["markdown", "sqlite"],
          toolNames: ["query_sharepoint_documents", "lookup_policy_handbook", "open_policy_escalation"],
          evidence: ["document citation", "policy metadata"],
        }],
        entities: [{
          name: "policy_documents",
          sourceSystemId: "sharepoint",
          primaryKey: "id",
          datastore: "alloydb",
          rowCount: 20,
          columns: [{ name: "id" }, { name: "title" }, { name: "status" }],
        }],
        documents: [{
          id: "policy-handbook",
          sourceSystemId: "sharepoint",
          title: "Policy Handbook",
          requiredSections: ["Eligibility"],
          citationAnchors: ["policy"],
          minimumWordCount: 500,
        }],
        anomalies: [{
          id: "retired-policy-citation",
          description: "A retired policy document still matches the employee prompt and must not be used as current evidence.",
          affectedEntities: ["policy_documents"],
          expectedEvidence: ["policy metadata"],
        }],
        datastorePackaging: { structured: ["alloydb"], unstructured: ["markdown"], vector: ["vertex_ai"] },
        validation: {
          smokePrompt: "What is the current eligibility policy?",
          assertions: ["uses the active policy handbook", "includes a citation anchor"],
        },
        behaviorContract: {
          role: "HR policy answering assistant",
          primaryObjective: "Answer employee policy questions with direct citations from SharePoint policy documents and refuse unsupported interpretations.",
          inScope: ["Policy lookup", "Handbook citation"],
          outOfScope: ["Legal advice", "Uncited interpretation"],
          toolIntents: [
            {
              name: "query_sharepoint_documents",
              kind: "query",
              sourceSystemId: "sharepoint",
              description: "Search SharePoint policy metadata by topic and status.",
              requiredInputs: ["topic"],
              produces: ["policy_document"],
              evidenceEmitted: ["policy metadata"],
            },
            {
              name: "lookup_policy_handbook",
              kind: "evidence_lookup",
              sourceSystemId: "sharepoint",
              description: "Retrieve handbook sections and citation anchors.",
              requiredInputs: ["document_id", "section"],
              produces: ["policy_excerpt"],
              evidenceEmitted: ["document citation"],
            },
            {
              name: "open_policy_escalation",
              kind: "action",
              sourceSystemId: "sharepoint",
              description: "Create an escalation record for ambiguous policy language.",
              requiredInputs: ["policy_id", "question"],
              produces: ["escalation_id"],
              evidenceEmitted: ["escalation audit record"],
            },
          ],
          evidenceRequirements: [{ claim: "policy answer", mustCite: ["document citation"], sourceSystemIds: ["sharepoint"] }],
          escalationRules: [
            { trigger: "policy ambiguity", action: "escalate", handoffTarget: "HR policy owner" },
            { trigger: "active policy not found", action: "request_more_info", handoffTarget: "SharePoint content owner" },
          ],
          refusalRules: ["Do not answer without a citation.", "Do not cite retired policy documents as current guidance."],
          goldenEvals: [{ id: "policy-citation", prompt: "What is the policy?", expectedToolCalls: ["lookup_policy_handbook"] }],
        },
      },
    });
    replaceAgentSpecRegistryDb([entry]);
    assert.equal(getAgentSpecRegistryDb("policy-answering-agent").buildable, true);
    assert.equal(listAgentSpecRegistryDb({ department: "hr", buildable: true }).length, 1);
  } finally {
    closeDatabase();
  }
});

test("analytics pack seeds coherent metric fixtures", () => {
  const metricColumns = [
    { name: "id" },
    { name: "period" },
    { name: "metric_name" },
    { name: "value" },
    { name: "variance_pct" },
    { name: "computed_at" },
  ];
  const schema = {
    domain: "finance",
    useCaseSpec: { id: "account-reconciliation-agent", title: "Account Reconciliation Agent", department: "finance" },
    tables: [
      { name: "historical_metrics", columns: metricColumns },
      { name: "analytics_events", columns: [...metricColumns, { name: "historical_metric_id" }] },
      { name: "cached_aggregates", columns: metricColumns },
    ],
  };
  const generatedTables = {
    historical_metrics: [{ id: "HIST-1" }, { id: "HIST-2" }],
    analytics_events: [{ id: "EVT-1" }, { id: "EVT-2" }],
    cached_aggregates: [{ id: "AGG-1" }, { id: "AGG-2" }],
  };

  analyticsPack.apply({ schema, generatedTables });

  assert.equal(generatedTables.historical_metrics[0].metric_name, "close_cycle_days");
  assert.equal(generatedTables.historical_metrics[0].variance_pct, 0);
  assert.equal(generatedTables.analytics_events[0].metric_name, "close_cycle_days");
  assert.equal(generatedTables.analytics_events[0].historical_metric_id, "HIST-1");
  assert.equal(generatedTables.analytics_events[0].variance_pct, -15.1);
  assert.equal(generatedTables.cached_aggregates[0].metric_name, "close_cycle_days");
  assert.equal(generatedTables.cached_aggregates[0].computed_at, "2026-05-31");
});

test("content collaboration pack seeds document review fixtures", () => {
  const schema = {
    useCaseSpec: { title: "Policy Publisher" },
    tables: [
      { name: "documents", columns: [{ name: "id" }, { name: "title" }, { name: "owner" }, { name: "status" }, { name: "last_updated" }] },
      { name: "comments", columns: [{ name: "id" }, { name: "status" }, { name: "owner" }, { name: "created_at" }, { name: "notes" }, { name: "document_id" }] },
      { name: "revision_history", columns: [{ name: "id" }, { name: "actor" }, { name: "action" }, { name: "target_type" }, { name: "created_at" }, { name: "notes" }, { name: "document_id" }] },
    ],
  };
  const generatedTables = {
    documents: [{ id: "DOC-1" }],
    comments: [{ id: "COM-1" }],
    revision_history: [{ id: "REV-1" }],
  };

  contentCollaborationPack.apply({ schema, generatedTables });

  assert.equal(generatedTables.documents[0].title, "Policy Publisher Policy Brief");
  assert.equal(generatedTables.comments[0].document_id, "DOC-1");
  assert.equal(generatedTables.revision_history[0].action, "create");
});

test("crm marketing pack seeds funnel fixtures", () => {
  const schema = {
    tables: [
      { name: "accounts", columns: [{ name: "account_name" }, { name: "amount" }, { name: "stage" }, { name: "owner" }, { name: "close_date" }] },
      { name: "campaigns", columns: [{ name: "campaign_name" }, { name: "status" }, { name: "owner" }, { name: "notes" }] },
    ],
  };
  const generatedTables = { accounts: [{}], campaigns: [{}] };

  crmMarketingOpsPack.apply({ schema, generatedTables });

  assert.equal(generatedTables.accounts[0].account_name, "Apex Industrial");
  assert.equal(generatedTables.accounts[0].stage, "qualification");
  assert.equal(generatedTables.campaigns[0].campaign_name, "Q3 Pipeline Acceleration");
});

test("procurement pack seeds spend and approval fixtures", () => {
  const schema = {
    tables: [
      { name: "purchase_orders", columns: [{ name: "vendor" }, { name: "amount" }, { name: "currency" }, { name: "status" }, { name: "due_date" }] },
      { name: "contracts", columns: [{ name: "vendor" }, { name: "amount" }, { name: "status" }, { name: "notes" }] },
    ],
  };
  const generatedTables = { purchase_orders: [{}], contracts: [{}] };

  procurementOpsPack.apply({ schema, generatedTables });

  assert.equal(generatedTables.purchase_orders[0].vendor, "Apex Facilities");
  assert.equal(generatedTables.purchase_orders[0].status, "pending");
  assert.equal(generatedTables.contracts[0].amount, 55500.75);
});

test("finance erp pack seeds close-control fixtures", () => {
  const schema = {
    tables: [
      { name: "gl_entries", columns: [{ name: "posting_date" }, { name: "account" }, { name: "amount" }, { name: "currency" }, { name: "description" }, { name: "status" }] },
      { name: "accounts_payable", columns: [{ name: "vendor" }, { name: "amount" }, { name: "status" }, { name: "due_date" }] },
    ],
  };
  const generatedTables = { gl_entries: [{}, {}], accounts_payable: [{}] };

  financeErpPack.apply({ schema, generatedTables });

  assert.equal(generatedTables.gl_entries[0].account, "1000-Cash");
  assert.equal(generatedTables.gl_entries[1].status, "pending");
  assert.equal(generatedTables.accounts_payable[0].vendor, "Apex Facilities");
});

test("remaining system packs seed operational fixtures", () => {
  const commonCols = [{ name: "status" }, { name: "owner" }, { name: "created_at" }, { name: "notes" }];
  const employeeCols = [{ name: "id" }, { name: "source_record_id" }, { name: "name" }, { name: "employment_status" }, { name: "region" }];
  const schema = {
    useCaseSpec: { title: "System Pack Fixture Test" },
    tables: [
      { name: "tickets", columns: commonCols },
      { name: "employees", columns: employeeCols },
      { name: "lms_records", columns: commonCols },
      { name: "access_grants", columns: commonCols },
      { name: "assets", columns: commonCols },
      { name: "keyword_rankings", columns: commonCols },
      { name: "ofac_sdn_records", columns: commonCols },
    ],
  };
  const generatedTables = {
    tickets: [{}],
    employees: [{}],
    lms_records: [{}],
    access_grants: [{}],
    assets: [{}],
    keyword_rankings: [{}],
    ofac_sdn_records: [{}],
  };

  itsmPack.apply({ schema, generatedTables });
  hrEmployeeRecordsPack.apply({ schema, generatedTables });
  learningTalentPack.apply({ schema, generatedTables });
  identitySecurityPack.apply({ schema, generatedTables });
  digitalAssetPack.apply({ schema, generatedTables });
  seoMonitoringPack.apply({ schema, generatedTables });
  thirdPartyRiskPack.apply({ schema, generatedTables });

  assert.equal(generatedTables.tickets[0].owner, "Avery Brooks");
  assert.equal(generatedTables.employees[0].id, "EMP-0007");
  assert.equal(generatedTables.lms_records[0].owner, "Talent Ops");
  assert.equal(generatedTables.access_grants[0].owner, "IAM Admin");
  assert.equal(generatedTables.assets[0].owner, "Brand Ops");
  assert.equal(generatedTables.keyword_rankings[0].owner, "SEO Lead");
  assert.equal(generatedTables.ofac_sdn_records[0].owner, "Risk Ops");
});

test("scenario packs enrich behavior contracts with eval hints", () => {
  const schema = {
    domain: "it",
    systems: [{ id: "servicenow", name: "ServiceNow" }],
    useCaseSpec: {
      id: "incident-remediation",
      title: "Incident Remediation",
      department: "it",
      behaviorContract: {
        role: "ITSM assistant",
        primaryObjective: "Triage incidents using ServiceNow evidence.",
        toolIntents: [{ name: "query_servicenow_incidents", kind: "query", sourceSystemId: "servicenow" }],
        goldenEvals: [{ id: "triage", prompt: "Triage active incidents.", expectedToolCalls: ["query_servicenow_incidents"] }],
      },
    },
    tables: [{ name: "incidents", columns: [{ name: "status" }] }],
  };

  enrichScenarioSpec(schema);

  const hints = schema.useCaseSpec.behaviorContract.evalEnrichment.packHints;
  assert.ok(hints.some((hint) => hint.packId === "system_itsm"));
  assert.ok(schema.useCaseSpec.behaviorContract.refusalRules.some((rule) => rule.includes("incident")));
});

test("skill registry maps harness capabilities to repository skills", async () => {
  const registry = await loadSkillRegistry(REPO_ROOT);
  assert.equal(registry.root, `${CANONICAL_REPO_ROOT}/skills`);
  const missingBindings = registry.bindings.filter((binding) => !registry.skills.some((skill) => skill.id === binding.skill));
  assert.deepEqual(missingBindings, []);
  assert.equal(registry.bindings.some((binding) => binding.skill.startsWith("ge-")), false);
  assert.ok(registry.skills.some((skill) => skill.id === "interviewing-specs" && skill.origin === "repository"));
  assert.ok(registry.skills.some((skill) => skill.id === "running-factory" && skill.relativePath === "skills/running-factory/SKILL.md"));
  assert.ok(registry.skills.some((skill) => skill.id === "checking-workspaces" && skill.origin === "repository"));
  if (existsSync(INSTALLED_AGENTS_CLI_WORKFLOW)) {
    assert.ok(registry.skills.some((skill) => skill.id === "google-agents-cli-workflow" && skill.origin === "agents-cli"));
  }

  const selected = selectSkillsForContext({
    registry,
    capabilities: ["adk_build", "google_fluency", "testing"],
    stages: ["create"],
    message: "Build a local ADK agent with deterministic mock data and a smoke test.",
  });
  const selectedIds = selected.map((skill) => skill.id);
  assert.ok(selectedIds.includes("interviewing-specs"));
  assert.ok(selectedIds.includes("running-factory"));
  assert.ok(selectedIds.includes("building-simulators"));
  assert.ok(selectedIds.includes("checking-workspaces"));
  if (existsSync(INSTALLED_AGENTS_CLI_WORKFLOW)) {
    assert.ok(selectedIds.includes("google-agents-cli-workflow"));
    assert.ok(selectedIds.includes("google-agents-cli-adk-code"));
    assert.ok(selectedIds.includes("google-agents-cli-eval"));
  }

  const handoff = buildHandoffPacket({
    receiver: "gemini",
    run: { id: "run-1" },
    project: { id: "proj-1", name: "Project" },
    cwd: "/workspace",
    repoRoot: REPO_ROOT,
    userRequest: "Build an ADK agent",
    plan: {
      adapterId: "gemini",
      requestedCapabilities: ["adk_build"],
      adapterCapabilities: { bestFor: "ADK" },
      permissionProfile: { id: "workspace_write", description: "Workspace write" },
      ownedPaths: ["/workspace"],
      avoidPaths: [],
      skills: selected.map((skill) => ({ ...skill, workspaceRelativePath: `.ge-harness/skills/${skill.id}/SKILL.md` })),
    },
  });
  assert.match(handoff, /skills\/running-factory\/SKILL\.md/);
  assert.match(handoff, /\.ge-harness\/skills\/running-factory\/SKILL\.md/);
  if (existsSync(INSTALLED_AGENTS_CLI_WORKFLOW)) {
    assert.match(handoff, /google-agents-cli-workflow\/SKILL\.md/);
    assert.match(handoff, /\.ge-harness\/skills\/google-agents-cli-workflow\/SKILL\.md/);
  }
  assert.match(handoff, /Gemini CLI, Codex CLI, Claude Code/);
  assert.match(handoff, /Spec-To-Code Quality Gate/);
  assert.match(handoff, /behaviorContract\.toolIntents/);
  assert.match(handoff, /ge_behavior_contract\.evalset\.json/);
});

test("preflight reports local tools, ports, and findings", async () => {
  const report = await runPreflight({
    repoRoot: REPO_ROOT,
    dataRoot: DATA_ROOT,
    daemonPort: 0,
    webPort: 0,
    versionTimeoutMs: 50,
  });
  assert.equal(typeof report.ok, "boolean");
  assert.ok(report.tools.some((tool) => tool.id === "node" && tool.available));
  assert.ok(report.ports.every((port) => "available" in port && "reason" in port));
  assert.equal(typeof report.readiness.local, "boolean");
});

test("factory control plane models managed release orchestration", () => {
  assert.equal(nextFactoryStage("deploy_runtime"), "poll_runtime");
  const statuses = factoryStageStatus({
    currentStage: "deploy_runtime",
    targetStage: "publish_enterprise",
    completed: ["plan", "generate_workspace", "generate_data", "package_data", "validate", "preview", "plan_deploy"],
  });
  assert.equal(statuses.find((stage) => stage.id === "deploy_runtime").status, "running");

  const plan = buildControlPlanePlan({
    project: "vital-octagon-19612",
    projectNumber: "440790012685",
    region: "us-central1",
    bucket: "vital-octagon-19612-ge-agent-factory",
  });
  assert.equal(plan.services.cloudBuild.ownsStages.includes("deploy_runtime"), true);
  assert.equal(plan.services.cloudBuild.ownsStages.includes("publish_enterprise"), true);
  assert.ok(plan.commands.some((cmd) => cmd.includes("cloudbuild.googleapis.com")));
  assert.ok(plan.commands.some((cmd) => cmd.includes("gcloud tasks queues create")));
  const workerStep = plan.provisionSteps.find((step) => step.id === "worker-service");
  assert.ok(workerStep.apply.includes("--no-allow-unauthenticated"));
  assert.ok(workerStep.apply.includes("--timeout"));
});

test("factory worker parses payloads and dispatches release stages to Cloud Build", async () => {
  const payload = parseWorkerPayload({
    runId: "run-1",
    itemId: "hr-benefits",
    workspaceId: "hr-benefits",
    stage: "deploy_runtime",
    targetStage: "publish_enterprise",
    workspaceDir: DATA_ROOT,
    artifactPrefix: "gs://factory/runs/run-1/items/hr-benefits",
    cloud: {
      projectId: "vital-octagon-19612",
      runtimeRegion: "us-central1",
      artifactBucket: "vital-octagon-19612-ge-agent-factory",
      workerServiceUrl: "https://ge-agent-factory-worker-test.a.run.app",
      geminiEnterpriseLocation: "global",
      geminiEnterpriseApp: "projects/440790012685/locations/global/collections/default_collection/engines/phoenix-telco_1751440131886",
    },
  });
  const plan = buildStageExecutionPlan(payload);
  assert.equal(plan.owner, "cloud_build");
  assert.equal(plan.nextStage, "poll_runtime");
  assert.equal(plan.commands[0][0], "gcloud");
  assert.ok(plan.commands[0][1].includes("builds"));
  assert.ok(plan.commands[0][1].includes("--async"));
  assert.ok(plan.commands[0][1].includes("--format=json"));
  assert.ok(plan.commands[0][1].join(" ").includes("_STAGE=deploy_runtime"));
  assert.ok(plan.commands[0][1].join(" ").includes("_GOOGLE_GENAI_LOCATION=global"));
  assert.ok(plan.commands[0][1].join(" ").includes("_RUN_AGENT_EVALS=true"));
  assert.ok(plan.commands[0][1].join(" ").includes("_RUN_AGENT_LINT=true"));
  assert.ok(plan.commands[0][1].join(" ").includes("_RUN_DEPLOYED_SMOKE=true"));
  assert.equal(plan.commands[0][1].join(" ").includes("agents-cli"), false);
  // Security hardening Stage B: builds submit AS the builder SA (so runner can drop
  // cloudbuild.builds.editor). The logs destination is satisfied by the config's
  // options.logging: CLOUD_LOGGING_ONLY — so we must NOT pass --gcs-log-dir
  // (build.logs_bucket is mutually exclusive with CLOUD_LOGGING_ONLY).
  const deployArgsStr = plan.commands[0][1].join(" ");
  assert.ok(plan.commands[0][1].includes("--service-account"));
  assert.ok(deployArgsStr.includes("projects/vital-octagon-19612/serviceAccounts/ge-agent-factory-builder@vital-octagon-19612.iam.gserviceaccount.com"));
  assert.ok(!plan.commands[0][1].includes("--gcs-log-dir"));
  const task = await buildCloudTaskCommand(payload);
  assert.equal(task[0], "gcloud");
  assert.ok(task[1].includes("tasks"));
  assert.ok(task[1].includes("create-http-task"));
  assert.ok(task[1].includes("--oidc-service-account-email"));
  assert.ok(task[1].includes("--oidc-token-audience"));
  assert.ok(task[1].join(" ").includes("https://ge-agent-factory-worker-test.a.run.app"));
  const body = JSON.parse(task[1][task[1].indexOf("--body-content") + 1]);
  assert.equal(body.stage, "deploy_runtime");
  assert.equal(body.cloud.workerServiceUrl, "https://ge-agent-factory-worker-test.a.run.app");

  const validatePayload = parseWorkerPayload({
    ...payload,
    stage: "validate",
    targetStage: "validate",
  });
  const validatePlan = buildStageExecutionPlan(validatePayload);
  assert.equal(validatePlan.owner, "cloud_build");
  assert.equal(validatePlan.nextStage, "preview");
  assert.ok(validatePlan.commands[0][1].join(" ").includes("_STAGE=validate"));

  const previewPlan = buildStageExecutionPlan(parseWorkerPayload({
    ...payload,
    stage: "preview",
    targetStage: "preview",
  }));
  assert.equal(previewPlan.owner, "cloud_build");
  assert.equal(previewPlan.nextStage, "plan_deploy");
  assert.ok(previewPlan.commands[0][1].includes("builds"));
  assert.ok(previewPlan.commands[0][1].join(" ").includes("_STAGE=preview"));

  const packagePlan = buildStageExecutionPlan(parseWorkerPayload({
    ...payload,
    stage: "package_data",
    targetStage: "package_data",
    options: { useCaseId: "BenefitsAssistant" },
  }));
  assert.equal(packagePlan.owner, "cloud_run_service");
  assert.ok(packagePlan.commands[0][1].includes("--usecase"));
  assert.ok(packagePlan.commands[0][1].includes("BenefitsAssistant"));

  const refinePlan = buildStageExecutionPlan(parseWorkerPayload({
    ...payload,
    stage: "harness_refine",
    targetStage: "validate",
    options: { refine: true, harnessProvider: "antigravity-sdk" },
  }));
  assert.equal(refinePlan.owner, "cloud_run_service");
  assert.equal(refinePlan.commands[0][1][0], "scripts/verify-harness-runtime.mjs");
  assert.ok(refinePlan.commands[0][1].includes("--provider"));
  assert.ok(refinePlan.commands[0][1].includes("antigravity-sdk"));
  assert.ok(refinePlan.commands[2][1].includes("--run-id"));
  assert.ok(refinePlan.commands[2][1].includes("run-1"));
  assert.ok(refinePlan.commands[2][1].includes("--item-id"));
  assert.ok(refinePlan.commands[2][1].includes("hr-benefits"));
  assert.ok(refinePlan.commands[2][1].includes("--locality"));
  assert.ok(refinePlan.commands[2][1].includes("remote"));

  const deployPlan = buildStageExecutionPlan(parseWorkerPayload({
    ...payload,
    stage: "plan_deploy",
    targetStage: "plan_deploy",
  }));
  assert.equal(deployPlan.owner, "control_plane");
  assert.equal(deployPlan.nextStage, "load_data");
  // Promotion gate runs first, then the deploy plan.
  assert.deepEqual(deployPlan.commands[0][1].slice(0, 3), ["scripts/ge-mock.mjs", "promotion-gate", "--dir"]);
  assert.deepEqual(deployPlan.commands[1][1].slice(0, 3), ["scripts/run-deploy-plan.mjs", "--workspace-dir", DATA_ROOT]);

  const pollPlan = buildStageExecutionPlan(parseWorkerPayload({
    ...payload,
    stage: "validate",
    targetStage: "validate",
    options: { cloudBuildId: "801a30d4-5a83-4266-bb8f-e6c602586d31" },
  }));
  assert.equal(pollPlan.owner, "cloud_build_poll");
  assert.deepEqual(pollPlan.commands[0][1].slice(0, 3), ["builds", "describe", "801a30d4-5a83-4266-bb8f-e6c602586d31"]);
  assert.equal(parseCloudBuildId('{"id":"801a30d4-5a83-4266-bb8f-e6c602586d31"}'), "801a30d4-5a83-4266-bb8f-e6c602586d31");
  assert.equal(parseCloudBuildDescribe('{"id":"b1","status":"SUCCESS","logUrl":"https://example.test"}').status, "SUCCESS");

  const dryPayload = parseWorkerPayload({
    ...payload,
    stage: "generate_data",
    cloud: { projectId: "" },
  });
  const result = await runFactoryWorker(dryPayload, { dryRun: true });
  assert.equal(result.status, "planned");
  assert.equal(result.owner, "cloud_run_service");
});

test("harness work items carry stage skills, artifacts, and workspace boundaries", () => {
  const item = buildHarnessWorkItem({
    runId: "run-1",
    itemId: "benefits-agent",
    workspaceDir: join(DATA_ROOT, "benefits-agent"),
    stage: "harness_refine",
    adapter: "antigravity-sdk",
    locality: "remote",
    project: "demo-project",
    location: "global",
  });
  assert.equal(item.kind, "ge.harness.work_item");
  assert.equal(item.adapter, "antigravity-sdk");
  assert.equal(item.locality, "remote");
  assert.ok(item.requiredSkills.includes("checking-workspaces"));
  assert.ok(item.requiredSkills.includes("recording-evidence"));
  assert.ok(item.expectedArtifacts.includes("artifacts/validation-report.json"));
  assert.deepEqual(item.allowedWriteRoots, [join(DATA_ROOT, "benefits-agent")]);
});

test("gemini stream parser normalizes message and wrapped tool events", async () => {
  const parser = createOutputParser("gemini-json");
  const events = parser.feed([
    JSON.stringify({ type: "message", content: "hello", delta: true }),
    JSON.stringify({ type: "tool_use", input: { name: "write_file", path: "app/agent.py" } }),
    JSON.stringify({ type: "tool_call_result", result: "done" }),
    "",
  ].join("\n"));
  assert.deepEqual(events[0], { kind: "text", text: "hello" });
  assert.equal(events[1].kind, "tool_use");
  assert.equal(events[1].name, "write_file");
  assert.equal(events[1].input.path, "app/agent.py");
  assert.equal(events[2].kind, "tool_result");
  assert.equal(events[2].content, "done");
});

test("daemon exposes health, systems, agents, and workspaces", async () => {
  const { server, url } = await startServer({ port: 0, returnServer: true });
  try {
    const health = await fetch(`${url}/api/health`).then((res) => res.json());
    assert.equal(health.ok, true);
    assert.equal(typeof health.systems, "number");

    const daemonStatus = await fetch(`${url}/api/daemon/status`).then((res) => res.json());
    assert.equal(daemonStatus.ok, true);
    assert.equal(typeof daemonStatus.pid, "number");
    assert.equal(Array.isArray(daemonStatus.activeRuns), true);

    const systems = await fetch(`${url}/api/systems`).then((res) => res.json());
    assert.ok(systems.systems.some((system) => system.id === "bigquery"));

    const departments = await fetch(`${url}/api/departments`).then((res) => res.json());
    assert.ok(departments.departments.some((department) => department.id === "hr" && department.useCaseCount > 50));
    assert.ok(departments.interviewQuestions.some((question) => question.id === "systems"));

    const useCases = await fetch(`${url}/api/use-cases?department=it&q=access`).then((res) => res.json());
    assert.ok(useCases.useCases.some((useCase) => useCase.title.includes("Access")));

    const agents = await fetch(`${url}/api/agents`).then((res) => res.json());
    assert.ok(agents.agents.some((agent) => agent.id === "gemini"));

    const workspaceName = `Smoke Workspace ${Date.now()}`;
    const created = await fetch(`${url}/api/workspaces`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name: workspaceName }),
    }).then((res) => res.json());
    assert.match(created.workspace.id, /^smoke-workspace-/);
    assert.equal(created.workspace.manifest, undefined);

    const manifest = JSON.parse(await readFile(join(PROJECTS_ROOT, created.workspace.id, "workspace.json"), "utf8"));
    assert.equal(manifest.id, created.workspace.id);
    assert.equal(manifest.name, workspaceName);
    assert.ok(manifest.capabilities.includes("workspace"));
    assert.equal(manifest.readiness.workspace.status, "ready");
    assert.ok(Array.isArray(manifest.nextActions));
    assert.equal(manifest.runs.events, "runs/<runId>/events.jsonl");

    const workspaces = await fetch(`${url}/api/workspaces`).then((res) => res.json());
    const listed = workspaces.workspaces.find((workspace) => workspace.id === created.workspace.id);
    assert.equal(listed.manifest.id, created.workspace.id);
  } finally {
    await new Promise((resolveClose) => server.close(resolveClose));
  }
});

test("mock agent run persists SSE events to workspace jsonl", async () => {
  const { server, url } = await startServer({ port: 0, returnServer: true });
  try {
    const created = await fetch(`${url}/api/workspaces`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name: `Run Events ${Date.now()}` }),
    }).then((res) => res.json());

    const response = await fetch(`${url}/api/chat`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ agentId: "mock", projectId: created.workspace.id, message: "persist this run" }),
    });
    const events = await readSse(response);
    const runId = events.find((item) => item.event === "status" && item.data.runId)?.data.runId;
    assert.ok(runId);
    assert.ok(events.some((item) => item.event === "end" && item.data.status === "succeeded"));

    const runStatus = await fetch(`${url}/api/runs/${runId}`).then((res) => res.json());
    assert.equal(runStatus.run.status, "succeeded");
    assert.equal(runStatus.run.projectId, created.workspace.id);

    const runWait = await fetch(`${url}/api/runs/${runId}/wait`).then((res) => res.json());
    assert.equal(runWait.run.status, "succeeded");

    const runList = await fetch(`${url}/api/runs?projectId=${created.workspace.id}`).then((res) => res.json());
    assert.ok(runList.runs.some((run) => run.id === runId));

    const logPath = join(PROJECTS_ROOT, created.workspace.id, "runs", runId, "events.jsonl");
    const lines = (await readFile(logPath, "utf8")).trim().split("\n").map((line) => JSON.parse(line));
    assert.ok(lines.some((line) => line.event === "status" && line.data.runId === runId));
    assert.ok(lines.some((line) => line.event === "agent" && line.data.delta.includes("Mock Harness Agent online.")));
    assert.ok(lines.some((line) => line.event === "end" && line.data.status === "succeeded"));
  } finally {
    await new Promise((resolveClose) => server.close(resolveClose));
  }
});

test("chat sessions are scoped per workspace agent", async () => {
  const { server, url } = await startServer({ port: 0, returnServer: true });
  try {
    const created = await fetch(`${url}/api/workspaces`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name: `Scoped Chat ${Date.now()}` }),
    }).then((res) => res.json());

    const agentA = await fetch(`${url}/api/workspaces/${created.workspace.id}/agents`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name: "Benefits Agent", dirName: "benefits-agent" }),
    }).then((res) => res.json());
    const agentB = await fetch(`${url}/api/workspaces/${created.workspace.id}/agents`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name: "Payroll Agent", dirName: "payroll-agent" }),
    }).then((res) => res.json());

    const sessionA = await fetch(`${url}/api/workspaces/${created.workspace.id}/chat/sessions`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ title: "Benefits chat", agentId: agentA.agent.id }),
    }).then((res) => res.json());
    const sessionB = await fetch(`${url}/api/workspaces/${created.workspace.id}/chat/sessions`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ title: "Payroll chat", agentId: agentB.agent.id }),
    }).then((res) => res.json());

    await fetch(`${url}/api/workspaces/${created.workspace.id}/chat/sessions/${sessionA.session.id}/messages`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ role: "user", content: "benefits only" }),
    });
    await fetch(`${url}/api/workspaces/${created.workspace.id}/chat/sessions/${sessionB.session.id}/messages`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ role: "user", content: "payroll only" }),
    });

    const listA = await fetch(`${url}/api/workspaces/${created.workspace.id}/chat/sessions?agentId=${agentA.agent.id}`).then((res) => res.json());
    const listB = await fetch(`${url}/api/workspaces/${created.workspace.id}/chat/sessions?agentId=${agentB.agent.id}`).then((res) => res.json());
    const rootList = await fetch(`${url}/api/workspaces/${created.workspace.id}/chat/sessions`).then((res) => res.json());

    assert.deepEqual(listA.sessions.map((s) => s.title), ["Benefits chat"]);
    assert.deepEqual(listB.sessions.map((s) => s.title), ["Payroll chat"]);
    assert.deepEqual(rootList.sessions, []);

    const messagesA = await fetch(`${url}/api/workspaces/${created.workspace.id}/chat/sessions/${sessionA.session.id}/messages`).then((res) => res.json());
    const messagesB = await fetch(`${url}/api/workspaces/${created.workspace.id}/chat/sessions/${sessionB.session.id}/messages`).then((res) => res.json());
    assert.equal(messagesA.messages[0].content, "benefits only");
    assert.equal(messagesB.messages[0].content, "payroll only");
  } finally {
    await new Promise((resolveClose) => server.close(resolveClose));
  }
});

test("json stream parser preserves raw event data", () => {
  const parsed = parseJsonStreamEvent(JSON.stringify({
    type: "tool_use",
    id: "abc",
    name: "write_file",
    message: { content: [{ text: "writing" }] },
  }));
  assert.equal(parsed.type, "json_event");
  assert.equal(parsed.eventType, "tool_use");
  assert.equal(parsed.raw.name, "write_file");
  assert.equal(parsed.delta, "writing");
});

test("project wakeups start runs and coalesce duplicates", async () => {
  const { server, url } = await startServer({ port: 0, returnServer: true });
  try {
    const created = await fetch(`${url}/api/workspaces`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name: `Wakeup ${Date.now()}` }),
    }).then((res) => res.json());

    const first = await fetch(`${url}/api/workspaces/${created.workspace.id}/wakeups`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ agentId: "mock", reason: "on_demand", message: "first heartbeat GE_MOCK_AGENT_SLOW" }),
    }).then((res) => res.json());
    assert.equal(first.coalesced, false);
    assert.equal(first.run.projectId, created.workspace.id);
    assert.equal(first.run.wakeupReason, "on_demand");

    const second = await fetch(`${url}/api/workspaces/${created.workspace.id}/wakeups`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ agentId: "mock", reason: "automation", message: "merge this" }),
    }).then((res) => res.json());
    assert.equal(second.coalesced, true);
    assert.equal(second.run.id, first.run.id);
    assert.equal(second.run.coalescedWakeupCount, 1);

    const waited = await fetch(`${url}/api/runs/${first.run.id}/wait`).then((res) => res.json());
    assert.equal(waited.run.status, "succeeded");
  } finally {
    await new Promise((resolveClose) => server.close(resolveClose));
  }
});

test("tasks, activity, heartbeat policies, adapters, and secrets are durable daemon primitives", async () => {
  const { server, url } = await startServer({ port: 0, returnServer: true });
  try {
    const created = await fetch(`${url}/api/workspaces`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name: `Control Plane ${Date.now()}` }),
    }).then((res) => res.json());

    const agentRes = await fetch(`${url}/api/workspaces/${created.workspace.id}/agents`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name: "Ops Agent", dirName: "ops-agent" }),
    }).then((res) => res.json());
    const agentId = agentRes.agent.id;

    const policyRes = await fetch(`${url}/api/workspaces/${created.workspace.id}/agents/${agentId}/heartbeat-policy`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ enabled: true, intervalSec: 300, timeoutSec: 60, graceSec: 2, secretNames: ["OPENAI_API_KEY"] }),
    }).then((res) => res.json());
    assert.equal(policyRes.policy.enabled, true);
    assert.deepEqual(policyRes.policy.secretNames, ["OPENAI_API_KEY"]);

    const secretRes = await fetch(`${url}/api/workspaces/${created.workspace.id}/secrets`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name: "OPENAI_API_KEY", value: "sk-test", scope: "workspace" }),
    }).then((res) => res.json());
    assert.equal(secretRes.secret.name, "OPENAI_API_KEY");
    assert.equal(secretRes.secret.value, undefined);
    assert.match(secretRes.secret.valueHash, /^sha256:/);

    const taskRes = await fetch(`${url}/api/workspaces/${created.workspace.id}/tasks`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ title: "Draft rollout plan", goal: "Ship safely", assigneeAgentId: agentId, runtimeAgentId: "mock", priority: 1 }),
    }).then((res) => res.json());
    assert.equal(taskRes.task.status, "open");
    assert.equal(taskRes.task.assigneeAgentId, agentId);

    const updatedTask = await fetch(`${url}/api/workspaces/${created.workspace.id}/tasks/${taskRes.task.id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ status: "accepted" }),
    }).then((res) => res.json());
    assert.equal(updatedTask.task.status, "accepted");
    assert.ok(updatedTask.task.acceptedAt);

    const adapters = await fetch(`${url}/api/runtime/adapters`).then((res) => res.json());
    assert.ok(adapters.adapters.some((adapter) => adapter.id === "mock" && adapter.envPolicy === "allowlist-plus-scoped-secrets"));

    const capabilities = await fetch(`${url}/api/runtime/capabilities`).then((res) => res.json());
    assert.ok(capabilities.permissionProfiles.some((profile) => profile.id === "review" && profile.writeAllowed === false));
    assert.ok(capabilities.adapters.some((adapter) => adapter.id === "gemini" && adapter.capabilities.primary.includes("adk_build")));

    const skills = await fetch(`${url}/api/runtime/skills`).then((res) => res.json());
    assert.ok(skills.skills.some((skill) => skill.id === "building-simulators"));
    assert.ok(skills.bindings.some((binding) => binding.capability === "simulator_build" && binding.skill === "building-simulators"));
    if (existsSync(INSTALLED_AGENTS_CLI_WORKFLOW)) {
      assert.ok(skills.skills.some((skill) => skill.id === "google-agents-cli-workflow"));
      assert.ok(skills.bindings.some((binding) => binding.capability === "agents_workflow" && binding.skill === "google-agents-cli-workflow"));
    }

    const activity = await fetch(`${url}/api/workspaces/${created.workspace.id}/activity`).then((res) => res.json());
    assert.ok(activity.events.some((event) => event.type === "task.created" && event.entityId === taskRes.task.id));
    assert.ok(activity.events.some((event) => event.type === "agent.heartbeat_policy_updated" && event.entityId === agentId));
    assert.ok(activity.events.some((event) => event.type === "secret.upserted" && event.entityId === "OPENAI_API_KEY"));
  } finally {
    await new Promise((resolveClose) => server.close(resolveClose));
  }
});

test("mock harness runs include capability plan events and runtime status", async () => {
  const { server, url } = await startServer({ port: 0, returnServer: true });
  try {
    const created = await fetch(`${url}/api/workspaces`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name: `Harness Plan ${Date.now()}` }),
    }).then((res) => res.json());

    const response = await fetch(`${url}/api/chat`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        agentId: "mock",
        projectId: created.workspace.id,
        message: "Build a small local ADK test fixture.",
        permissionProfile: "workspace_write",
        ownedPaths: ["app/"],
        avoidPaths: ["README.md"],
      }),
    });
    const events = await readSse(response);
    const plan = events.find((item) => item.event === "plan")?.data;
    assert.equal(plan.adapterId, "mock");
    assert.equal(plan.permissionProfile, "workspace_write");
    assert.deepEqual(plan.ownedPaths, ["app/"]);
    assert.ok(plan.requestedCapabilities.includes("adk_build"));
    assert.ok(plan.skills.some((skill) => skill.id === "running-factory"));
    assert.ok(plan.skills.some((skill) => skill.workspacePath === ".ge-harness/skills/running-factory/SKILL.md"));
    assert.equal(existsSync(join(PROJECTS_ROOT, created.workspace.id, ".ge-harness", "skills", "running-factory", "SKILL.md")), true);
    if (existsSync(INSTALLED_AGENTS_CLI_WORKFLOW)) {
      assert.ok(plan.skills.some((skill) => skill.id === "google-agents-cli-workflow"));
      assert.ok(plan.skills.some((skill) => skill.workspacePath === ".ge-harness/skills/google-agents-cli-workflow/SKILL.md"));
      assert.equal(existsSync(join(PROJECTS_ROOT, created.workspace.id, ".ge-harness", "skills", "google-agents-cli-workflow", "SKILL.md")), true);
    }

    const runId = events.find((item) => item.event === "status" && item.data.runId)?.data.runId;
    const runStatus = await fetch(`${url}/api/runs/${runId}`).then((res) => res.json());
    assert.equal(runStatus.run.runtime.adapterId, "mock");
    assert.equal(runStatus.run.runtime.permissionProfile, "workspace_write");
    assert.ok(runStatus.run.runtime.skills.some((skill) => skill.workspacePath === ".ge-harness/skills/running-factory/SKILL.md"));
    if (existsSync(INSTALLED_AGENTS_CLI_WORKFLOW)) {
      assert.ok(runStatus.run.runtime.skills.some((skill) => skill.workspacePath === ".ge-harness/skills/google-agents-cli-workflow/SKILL.md"));
    }
  } finally {
    await new Promise((resolveClose) => server.close(resolveClose));
  }
});

test("workspace validation catches generated fixture and agent contracts", async () => {
  const { server, url } = await startServer({ port: 0, returnServer: true });
  try {
    const created = await fetch(`${url}/api/workspaces`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name: `Validation ${Date.now()}` }),
    }).then((res) => res.json());
    const workspace = join(PROJECTS_ROOT, created.workspace.id);
    await writeValidationFixtureWorkspace(workspace);

    const validation = await runWorkspaceValidation(workspace);
    assert.equal(validation.ok, true);
    assert.ok(validation.checks.some((check) => check.id === "mock:employees:primary_key_unique" && check.ok));
    assert.ok(validation.checks.some((check) => check.id === "agent:no_google_auth_required" && check.ok));
    assert.ok(validation.checks.some((check) => check.id === "agent:semantic_model_tool" && check.ok));
    assert.ok(validation.checks.some((check) => check.id === "agent:before_tool_callback_signature" && check.ok));
    assert.ok(validation.checks.some((check) => check.id === "agent:after_tool_callback_signature" && check.ok));
    assert.equal(validation.specCodeTrace.ok, true);
    assert.equal(validation.specCodeTrace.coverage.requiredIntentCoverage, 1);
  } finally {
    await new Promise((resolveClose) => server.close(resolveClose));
  }
});

test("workspace pipeline writes canonical validation artifacts", async () => {
  const { server, url } = await startServer({ port: 0, returnServer: true });
  try {
    const created = await fetch(`${url}/api/workspaces`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name: `Pipeline ${Date.now()}` }),
    }).then((res) => res.json());
    const workspace = join(PROJECTS_ROOT, created.workspace.id);
    await writeValidationFixtureWorkspace(workspace);

    const report = await validateAgentWorkspace({
      workspaceDir: workspace,
      manifestPath: join(workspace, "workspace.json"),
      workspaceId: created.workspace.id,
      repoRoot: REPO_ROOT,
      testsRequested: false,
      source: "test",
    });

    assert.equal(report.ok, true);
    assert.equal(report.specCodeTrace.path, ARTIFACT_PATHS.specCodeTrace);
    assert.ok(existsSync(join(workspace, ARTIFACT_PATHS.specCodeTrace)));
    assert.ok(existsSync(join(workspace, ARTIFACT_PATHS.validationReport)));
    assert.ok(existsSync(join(workspace, ARTIFACT_PATHS.validationReportMarkdown)));
    const validationReport = JSON.parse(await readFile(join(workspace, ARTIFACT_PATHS.validationReport), "utf8"));
    assert.equal(validationReport.source, "test");
    assert.equal(validationReport.specCodeTrace.ok, true);
  } finally {
    await new Promise((resolveClose) => server.close(resolveClose));
  }
});

test("workspace doctor blocks preview before validation evidence exists", async () => {
  const { server, url } = await startServer({ port: 0, returnServer: true });
  try {
    const created = await fetch(`${url}/api/workspaces`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name: `Doctor ${Date.now()}` }),
    }).then((res) => res.json());
    const workspace = join(PROJECTS_ROOT, created.workspace.id);
    await writeValidationFixtureWorkspace(workspace);

    const report = await runWorkspaceDoctor({
      workspaceDir: workspace,
      manifestPath: join(workspace, "workspace.json"),
      workspaceId: created.workspace.id,
      repoRoot: REPO_ROOT,
      stage: "preview",
    });

    assert.equal(report.ok, false);
    assert.ok(report.blockers.some((blocker) => blocker.id === "validation:report"));
    assert.ok(report.repairTasks.some((task) => task.id === "run-validation"));
    assert.ok(existsSync(join(workspace, ARTIFACT_PATHS.workspaceDoctor)));

    const apiResponse = await fetch(`${url}/api/workspaces/${created.workspace.id}/workspace-doctor?stage=preview`);
    const apiReport = await apiResponse.json();
    assert.equal(apiResponse.status, 422);
    assert.equal(apiReport.ok, false);
    assert.ok(apiReport.blockers.some((blocker) => blocker.id === "validation:report"));
  } finally {
    await new Promise((resolveClose) => server.close(resolveClose));
  }
});

test("workspace repair loop executes doctor repair tasks until preview gate passes", async () => {
  const { server, url } = await startServer({ port: 0, returnServer: true });
  try {
    const created = await fetch(`${url}/api/workspaces`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name: `Repair ${Date.now()}` }),
    }).then((res) => res.json());
    const workspace = join(PROJECTS_ROOT, created.workspace.id);
    await writeValidationFixtureWorkspace(workspace);

    const report = await runWorkspaceRepair({
      workspaceDir: workspace,
      manifestPath: join(workspace, "workspace.json"),
      workspaceId: created.workspace.id,
      repoRoot: REPO_ROOT,
      stage: "preview",
      maxAttempts: 2,
      executors: {
        "run-validation": async () => {
          const validation = await validateAgentWorkspace({
            workspaceDir: workspace,
            manifestPath: join(workspace, "workspace.json"),
            workspaceId: created.workspace.id,
            repoRoot: REPO_ROOT,
            testsRequested: false,
            source: "repair-test",
          });
          return { ok: validation.ok, summary: "validation repaired" };
        },
      },
      source: "test",
    });

    assert.equal(report.ok, true);
    assert.equal(report.finalDoctor.ok, true);
    assert.ok(report.attempts.some((attempt) => attempt.actions.some((action) => action.taskId === "run-validation" && action.ok)));
    assert.ok(existsSync(join(workspace, ARTIFACT_PATHS.workspaceRepair)));
    assert.ok(existsSync(join(workspace, ARTIFACT_PATHS.workspaceRepairMarkdown)));

    const apiCreated = await fetch(`${url}/api/workspaces`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name: `Repair API ${Date.now()}` }),
    }).then((res) => res.json());
    const apiWorkspace = join(PROJECTS_ROOT, apiCreated.workspace.id);
    await writeValidationFixtureWorkspace(apiWorkspace);
    const apiResponse = await fetch(`${url}/api/workspaces/${apiCreated.workspace.id}/workspace-repair`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ stage: "preview", attempts: 2 }),
    });
    const apiReport = await apiResponse.json();
    assert.equal(apiResponse.status, 200);
    assert.equal(apiReport.ok, true);
    assert.ok(apiReport.attempts.some((attempt) => attempt.actions.some((action) => action.taskId === "run-validation" && action.ok)));
  } finally {
    await new Promise((resolveClose) => server.close(resolveClose));
  }
});

test("generated root workspace is exposed as an agent when no agent row exists", async () => {
  const { server, url } = await startServer({ port: 0, returnServer: true });
  try {
    const created = await fetch(`${url}/api/workspaces`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name: `Root Agent ${Date.now()}`, departmentId: "hr" }),
    }).then((res) => res.json());
    const workspace = join(PROJECTS_ROOT, created.workspace.id);
    await mkdir(join(workspace, "app"), { recursive: true });
    await mkdir(join(workspace, "fixtures"), { recursive: true });
    await mkdir(join(workspace, "mock_systems"), { recursive: true });
    await writeFile(join(workspace, "app", "agent.py"), "root_agent = object()\n", "utf8");
    await writeFile(join(workspace, "workspace.json"), JSON.stringify({
      id: created.workspace.id,
      name: created.workspace.name,
      departmentId: "hr",
      goal: "Root workspace agent",
      readiness: {
        agent: { status: "ready" },
        mockData: { status: "ready" },
      },
    }), "utf8");

    const agents = await fetch(`${url}/api/workspaces/${created.workspace.id}/agents`).then((res) => res.json());
    assert.equal(agents.agents.length, 1);
    assert.equal(agents.agents[0].dirName, "");
    assert.equal(agents.agents[0].stage, "generated");

    const manifest = JSON.parse(await readFile(join(workspace, "workspace.json"), "utf8"));
    assert.equal(manifest.agent.stage, "generated");
  } finally {
    await new Promise((resolveClose) => server.close(resolveClose));
  }
});

test("root workspace agent stage persists after validation", async () => {
  const { server, url } = await startServer({ port: 0, returnServer: true });
  try {
    const created = await fetch(`${url}/api/workspaces`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name: `Stage Persist ${Date.now()}`, departmentId: "hr" }),
    }).then((res) => res.json());
    const workspace = join(PROJECTS_ROOT, created.workspace.id);
    await mkdir(join(workspace, "mock_data", "plan"), { recursive: true });
    await writeValidationFixtureWorkspace(workspace, { rows: [{ id: "EMP-1", name: "A" }] });
    await writeFile(join(workspace, "mock_data", "plan", "data-plan.json"), JSON.stringify({
      datastores: [{ id: "employees_oltp", kind: "oltp_sql", target: "alloydb" }],
    }), "utf8");
    await writeFile(join(workspace, "workspace.json"), JSON.stringify({
      id: created.workspace.id,
      name: created.workspace.name,
      departmentId: "hr",
      goal: "Persist tested stage",
      readiness: {
        agent: { status: "ready" },
        mockData: { status: "ready" },
        tests: { status: "created" },
      },
    }), "utf8");

    const initial = await fetch(`${url}/api/workspaces/${created.workspace.id}/agents`).then((res) => res.json());
    const agent = initial.agents[0];
    assert.equal(agent.stage, "generated");

    const patched = await fetch(`${url}/api/workspaces/${created.workspace.id}/agents/${agent.id}/stage`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ stage: "tested" }),
    }).then((res) => res.json());
    assert.equal(patched.agent.stage, "tested");

    const refreshed = await fetch(`${url}/api/workspaces/${created.workspace.id}/agents`).then((res) => res.json());
    assert.equal(refreshed.agents[0].stage, "tested");

    const manifest = JSON.parse(await readFile(join(workspace, "workspace.json"), "utf8"));
    assert.equal(manifest.agent.stage, "tested");
    assert.equal(manifest.readiness.tests.status, "passing");
    assert.ok(manifest.capabilities.includes("smoke_tests"));

    await fetch(`${url}/api/workspaces`).then((res) => res.json());
    const rebuiltManifest = JSON.parse(await readFile(join(workspace, "workspace.json"), "utf8"));
    assert.equal(rebuiltManifest.agent.stage, "tested");

    delete rebuiltManifest.agent;
    await writeFile(join(workspace, "workspace.json"), JSON.stringify(rebuiltManifest), "utf8");
    const resynced = await fetch(`${url}/api/workspaces/${created.workspace.id}/agents`).then((res) => res.json());
    assert.equal(resynced.agents[0].stage, "tested");
    const resyncedManifest = JSON.parse(await readFile(join(workspace, "workspace.json"), "utf8"));
    assert.equal(resyncedManifest.agent.stage, "tested");
  } finally {
    await new Promise((resolveClose) => server.close(resolveClose));
  }
});

test("workspace versions are restorable git snapshots", async () => {
  const { server, url } = await startServer({ port: 0, returnServer: true });
  try {
    const created = await fetch(`${url}/api/workspaces`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name: `Snapshot Restore ${Date.now()}` }),
    }).then((res) => res.json());
    const workspace = join(PROJECTS_ROOT, created.workspace.id);
    await mkdir(join(workspace, "app"), { recursive: true });
    await writeFile(join(workspace, "app", "agent.py"), "root_agent = 'v1'\n", "utf8");

    const version = await fetch(`${url}/api/workspaces/${created.workspace.id}/versions`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ brief: { title: "v1" } }),
    }).then((res) => res.json());
    assert.match(version.version.snapshotRef, /^[0-9a-f]{40}$/);
    assert.ok(version.version.fileCount >= 1);

    await writeFile(join(workspace, "app", "agent.py"), "root_agent = 'v2'\n", "utf8");
    await writeFile(join(workspace, "app", "extra.py"), "temporary\n", "utf8");

    const promoted = await fetch(`${url}/api/workspaces/${created.workspace.id}/versions/1/promote`, {
      method: "PATCH",
    }).then((res) => res.json());
    assert.equal(promoted.currentVersion, 1);
    assert.equal(await readFile(join(workspace, "app", "agent.py"), "utf8"), "root_agent = 'v1'\n");
    await assert.rejects(readFile(join(workspace, "app", "extra.py"), "utf8"), /ENOENT/);
  } finally {
    await new Promise((resolveClose) => server.close(resolveClose));
  }
});

test("promotion packet packages validation preview and plan artifacts", async () => {
  const { server, url } = await startServer({ port: 0, returnServer: true });
  try {
    const created = await fetch(`${url}/api/workspaces`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name: `Promotion Packet ${Date.now()}`, departmentId: "hr" }),
    }).then((res) => res.json());
    const workspace = join(PROJECTS_ROOT, created.workspace.id);
    await mkdir(join(workspace, "app"), { recursive: true });
    await mkdir(join(workspace, "fixtures", "tables"), { recursive: true });
    await mkdir(join(workspace, "mock_systems"), { recursive: true });
    await mkdir(join(workspace, "mock_data", "plan"), { recursive: true });
    await mkdir(join(workspace, "tests"), { recursive: true });
    await mkdir(join(workspace, "tests", "eval", "evalsets"), { recursive: true });
    await mkdir(join(workspace, "evals"), { recursive: true });
    await mkdir(join(workspace, "artifacts"), { recursive: true });
    await writeFile(join(workspace, "app", "agent.py"), "from .tools import mock_tools\nroot_agent = object()\n", "utf8");
    await writeFile(join(workspace, "app", "tools.py"), "mock_tools = []\n", "utf8");
    await writeFile(join(workspace, "pyproject.toml"), "dependencies = [\"google-adk\"]\n", "utf8");
    await writeFile(join(workspace, "tests", "test_smoke.py"), "def test_ok(): assert True\n", "utf8");
    await writeFile(join(workspace, "mock_systems", "pipeline.json"), JSON.stringify({
      steps: {
        test: { status: "done", exitCode: 0 },
        serve: { status: "done", mode: "adk_run", output: "artifacts/preview-report.json" },
      },
    }), "utf8");
    await writeFile(join(workspace, "mock_systems", "schema.json"), JSON.stringify({ tables: [{ name: "employees" }] }), "utf8");
    await writeFile(join(workspace, "mock_systems", "usecase-spec.json"), JSON.stringify(minimalBehaviorSpec()), "utf8");
    await writeFile(join(workspace, "mock_data", "plan", "data-plan.json"), JSON.stringify({
      datastores: [{ id: "employees_oltp", kind: "oltp_sql", target: "alloydb" }],
    }), "utf8");
    await writeFile(join(workspace, "fixtures", "manifest.json"), JSON.stringify({
      tables: [{ name: "employees", jsonPath: "tables/employees.json", rowCount: 1, primaryKey: "id", columns: [{ name: "id" }] }],
      documents: [],
    }), "utf8");
    await writeFile(join(workspace, "fixtures", "tables", "employees.json"), JSON.stringify([{ id: "EMP-1" }]), "utf8");
    await writeFile(join(workspace, "evals", "golden.json"), JSON.stringify({
      primaryObjective: minimalBehaviorSpec().behaviorContract.primaryObjective,
      evals: minimalBehaviorSpec().behaviorContract.goldenEvals,
    }), "utf8");
    await writeFile(join(workspace, "tests", "eval", "evalsets", "ge_behavior_contract.evalset.json"), JSON.stringify({
      eval_set_id: "ge_behavior_contract",
      eval_cases: [{ eval_id: "enroll-employee", conversation: [], session_input: { app_name: "app", user_id: "test", state: {} } }],
    }), "utf8");
    await writeFile(join(workspace, "artifacts", "spec-code-trace.json"), JSON.stringify({
      kind: "ge.spec_code_trace",
      ok: true,
      totals: { intents: 3, requiredIntentsOk: 3 },
      coverage: { requiredIntentCoverage: 1, instructionCoverage: 1 },
      blockers: [],
    }), "utf8");
    await writeFile(join(workspace, "artifacts", "validation-report.json"), JSON.stringify({ ok: true, checks: [{ ok: true }], testExitCode: 0 }), "utf8");
    await writeFile(join(workspace, "artifacts", "preview-report.json"), JSON.stringify({
      ok: true,
      prompt: "hello",
      response: "ready",
      rootAgentPath: "app",
      code: 0,
      generatedAt: new Date().toISOString(),
    }), "utf8");

    const packet = await fetch(`${url}/api/workspaces/${created.workspace.id}/promotion-packet`, { method: "POST" }).then((res) => res.json());
    assert.ok(packet.paths.includes("artifacts/PROMOTION_PACKET.md"));
    assert.ok(packet.paths.includes("artifacts/GRAPH.md"));
    assert.equal(packet.packet.evidence.validation.ok, true);
    assert.equal(packet.packet.evidence.specCodeTrace.ok, true);
    assert.equal(packet.packet.promotionGate.ok, true);
    assert.equal(packet.packet.evidence.preview.ok, true);
    assert.ok(packet.packet.capabilities.includes("local_preview"));
    assert.ok(packet.packet.visualization.graph.nodes.some((node) => node.id === "alloydb"));
    assert.ok(packet.packet.visualization.graph.nodes.some((node) => node.id === "firestore"));
    assert.ok(packet.packet.visualization.graph.nodes.some((node) => node.id === "bigtable"));
    assert.ok(packet.packet.googleCloud.commandGroups.some((group) => group.id === "oltp_firestore"));
    assert.equal(packet.packet.nextActions[0], "deploy:plan");

    const deployGate = await runWorkspaceDoctor({
      workspaceDir: workspace,
      manifestPath: join(workspace, "workspace.json"),
      workspaceId: created.workspace.id,
      repoRoot: REPO_ROOT,
      stage: "deploy:plan",
    });
    assert.equal(deployGate.ok, true);

    const deployPlan = await fetch(`${url}/api/workspaces/${created.workspace.id}/plans/deploy`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ target: "agent_runtime" }),
    }).then((res) => res.json());
    assert.equal(deployPlan.readiness.deployPlan.status, "ready");
    assert.equal(deployPlan.nextActions[0], "publish:plan");
    assert.ok(deployPlan.plan.commandGroups.some((group) => group.id === "oltp_alloydb"));
    assert.ok(deployPlan.plan.commandGroups.some((group) => group.id === "oltp_firestore"));
    assert.ok(deployPlan.plan.commandGroups.some((group) => group.id === "oltp_bigtable"));

    const publishPlan = await fetch(`${url}/api/workspaces/${created.workspace.id}/plans/publish`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ appId: "app-1" }),
    }).then((res) => res.json());
    assert.equal(publishPlan.readiness.publishPlan.status, "ready");
    assert.ok(publishPlan.nextActions.includes("deploy"));
    assert.ok(existsSync(join(workspace, "artifacts", "PROMOTION_PACKET.md")));
    assert.ok(existsSync(join(workspace, "artifacts", "GRAPH.md")));
    assert.ok(existsSync(join(workspace, "artifacts", "DEPLOY_PLAN.md")));
    assert.ok(existsSync(join(workspace, "artifacts", "PUBLISH_PLAN.md")));
  } finally {
    await new Promise((resolveClose) => server.close(resolveClose));
  }
});

test("agent directories are rejected when they escape the workspace", async () => {
  const { server, url } = await startServer({ port: 0, returnServer: true });
  try {
    const created = await fetch(`${url}/api/workspaces`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name: `Agent Dir ${Date.now()}` }),
    }).then((res) => res.json());
    const response = await fetch(`${url}/api/workspaces/${created.workspace.id}/agents`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name: "Bad Agent", dirName: "../../outside" }),
    });
    assert.equal(response.status, 400);
  } finally {
    await new Promise((resolveClose) => server.close(resolveClose));
  }
});
