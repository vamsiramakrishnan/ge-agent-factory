import React from "react";
import { UseCaseSlide } from "../../../agent/UseCaseSlide";
import { FlowStep } from "../../../agent/ProcessFlow";
import { SwimlaneFlow } from "../../../agent/SwimlaneFlow";
import { AgentArchitecture, AgentBehaviorContract, UseCaseGenerationSpec } from "../../../../types/architecture";
import { BarChart3, Database, TrendingUp, FileText, Target } from "lucide-react";

const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "s1", label: "Close Complete", lane: "system", type: "trigger" },
    { id: "a1", label: "Metrics Aggregation", lane: "agent", type: "action" },
    { id: "a2", label: "Bottleneck Analysis", lane: "agent", type: "action" },
    { id: "a3", label: "Retrospective Narrative", lane: "agent", type: "output" },
  ],
  connections: [["s1", "a1"], ["a1", "a2"], ["a2", "a3"]],
};

const flow: FlowStep[] = [
  { label: "Metrics Collection", icon: Database, description: "Aggregate close metrics — cycle time, task completion, bottleneck data.", trigger: "Post-close", systems: ["BlackLine", "BigQuery"] },
  { label: "Performance Analysis", icon: TrendingUp, description: "Task-level performance analysis, bottleneck identification, and trend vs. target days.", systems: ["BigQuery", "Looker"], integration: "ADK" },
  { label: "Retrospective Generation", icon: FileText, description: "Generate close retrospective narrative with root cause for delays and improvement recommendations.", systems: ["Vertex AI"] },
  { label: "Dashboard Refresh", icon: Target, description: "Refresh close analytics dashboards and distribute retrospective report.", output: "Close Analytics" },
];

const architecture: AgentArchitecture = {
  connections: [
    { system: "BlackLine", description: "Close task completion data, cycle times, dependency tracking", direction: "read", protocol: "REST API", category: "erp" },
    { system: "BigQuery", description: "Historical close metrics, trend data, benchmark comparisons", direction: "bidirectional", protocol: "BigQuery SQL", category: "analytics" },
    { system: "Looker", description: "Close analytics dashboards, performance visualizations", direction: "write", protocol: "Looker API", category: "analytics" },
    { system: "Vertex AI (Gemini)", description: "Retrospective narrative generation, improvement recommendations", direction: "bidirectional", protocol: "gRPC", category: "ai" },
  ],
  pipeline: [
    { label: "Close Metrics Aggregation", description: "Aggregate task-level completion times, dependency wait times, and exception counts from the completed close cycle.", systems: ["BlackLine", "BigQuery"], layer: "integration", dataIn: "Close task completion data", dataOut: "Aggregated close metrics" },
    { label: "Bottleneck & Trend Analysis", description: "Identify bottleneck tasks, compare cycle time against target days, and track trend improvement or regression across close cycles.", systems: ["BigQuery", "Looker"], layer: "ml", dataIn: "Close metrics + historical trends", dataOut: "Bottleneck analysis + trend comparison" },
    { label: "Retrospective Narrative", description: "Gemini generates close retrospective narrative explaining what caused delays, which improvements worked, and specific recommendations to reduce cycle time further.", systems: ["Vertex AI (Gemini)"], layer: "llm", dataIn: "Bottleneck analysis + task-level data", dataOut: "Close retrospective with recommendations" },
    { label: "Dashboard & Distribution", description: "Refresh Looker close analytics dashboards and distribute retrospective report to accounting leadership.", systems: ["Looker", "Email"], layer: "integration", dataIn: "Analysis results", dataOut: "Updated dashboards + retrospective report" },
  ],
};

const behaviorContract: AgentBehaviorContract = {
  role: "Month-end close retrospective analyst for GE controllership",
  primaryObjective: "Aggregate close metrics from BlackLine and BigQuery, identify bottleneck tasks and owners, compute trend vs target days, generate retrospective narrative with root-cause analysis and recommendations via Gemini, and publish refreshed Looker dashboards and distributed retrospective reports.",
  inScope: [
    "Task-level cycle time analysis across completed close cycles",
    "Bottleneck identification: recurring tasks, owners, and delay patterns",
    "Trend analysis: comparing actual close cycle time against target days across 2+ years monthly history",
    "Retrospective narrative generation with root-cause analysis and data-driven improvement recommendations",
    "Looker dashboard refresh and retrospective report distribution to controllers",
  ],
  outOfScope: [
    "Journal posting or GL account reconciliation — accounting work, not analytics",
    "Task ownership reassignment or personnel changes — HR/management decision, not agent recommendation",
    "SOX control overrides or audit exception approval — compliance governance only",
    "Future close planning or staffing decisions — strategic business planning, not analytics output",
  ],
  toolIntents: [
    {
      name: "query_blackline_close_tasks",
      kind: "query",
      sourceSystemId: "blackline",
      description: "Retrieve close task completion data: planned vs actual duration, assignee, status, dependency references for the most recent completed cycle.",
      requiredInputs: ["cycle_id"],
      produces: ["close_tasks_summary", "task_list_with_durations"],
      evidenceEmitted: ["source_system_record"],
    },
    {
      name: "query_blackline_task_dependencies",
      kind: "query",
      sourceSystemId: "blackline",
      description: "Resolve task dependency chains to identify critical path and wait-time contributors in the close cycle.",
      requiredInputs: ["cycle_id"],
      produces: ["dependency_graph", "wait_time_analysis"],
      evidenceEmitted: ["source_system_record"],
    },
    {
      name: "query_bigquery_close_history",
      kind: "query",
      sourceSystemId: "bigquery",
      description: "Retrieve historical close cycle data (cycle_id, target_days, actual_days, status) for 2+ years to compute trend.",
      requiredInputs: ["lookback_months"],
      produces: ["cycle_trend_data", "aggregated_metrics"],
      evidenceEmitted: ["sql_result"],
    },
    {
      name: "query_bigquery_benchmark_metrics",
      kind: "query",
      sourceSystemId: "bigquery",
      description: "Query benchmark metrics and KPIs for close cycle performance comparison against industry standards or prior-year baseline.",
      requiredInputs: ["metric_type", "cycle_range"],
      produces: ["benchmark_comparison", "variance_analysis"],
      evidenceEmitted: ["sql_result"],
    },
    {
      name: "action_looker_publish_dashboard",
      kind: "action",
      sourceSystemId: "looker",
      description: "Refresh and publish the close analytics dashboard with the latest bottleneck analysis and trend comparison visualizations.",
      requiredInputs: ["dashboard_id", "analysis_results"],
      produces: ["dashboard_url", "publication_timestamp"],
      evidenceEmitted: ["api_response"],
    },
    {
      name: "action_email_distribute_retrospective",
      kind: "action",
      sourceSystemId: "looker",
      description: "Distribute the generated retrospective report and recommendations to controllers and accounting leadership via email.",
      requiredInputs: ["recipient_list", "report_body", "cycle_id"],
      produces: ["distribution_id", "delivery_timestamp"],
      evidenceEmitted: ["api_response"],
    },
    {
      name: "evidence_close_cycle_playbook",
      kind: "evidence_lookup",
      sourceSystemId: "blackline",
      description: "Cite the close cycle playbook for task definitions, cycle target-day rationale, and bottleneck escalation thresholds.",
      requiredInputs: ["citation_anchor"],
      produces: ["document_citation"],
      evidenceEmitted: ["document_reference"],
    },
    {
      name: "evidence_close_acceleration_sop",
      kind: "evidence_lookup",
      sourceSystemId: "bigquery",
      description: "Cite the close acceleration SOP for recurring-bottleneck remediation procedures and escalation rules.",
      requiredInputs: ["citation_anchor"],
      produces: ["document_citation"],
      evidenceEmitted: ["document_reference"],
    },
  ],
  evidenceRequirements: [
    {
      claim: "Task X is a bottleneck causing Y hours of delay",
      mustCite: ["close_tasks.assignee", "close_tasks.status", "close_tasks.actual_duration_hours", "close_tasks.planned_duration_hours"],
      sourceSystemIds: ["blackline"],
    },
    {
      claim: "Close cycle time has trended worse/better over the last N months",
      mustCite: ["close_cycles.target_days", "close_cycles.actual_days", "cycle_time_trend aggregation"],
      sourceSystemIds: ["bigquery"],
    },
    {
      claim: "Recurring bottleneck pattern detected in 3+ consecutive cycles",
      mustCite: ["close-cycle-playbook.bottleneck-rules", "close_tasks.id", "close_cycles.cycle_id"],
      sourceSystemIds: ["blackline", "bigquery"],
    },
  ],
  escalationRules: [
    {
      trigger: "Bottleneck task has recurred in 3+ consecutive close cycles",
      action: "escalate_to_human",
      handoffTarget: "Controller",
      rationale: "A recurring bottleneck indicates a systemic issue (staffing, process, tool) that requires management decision-making; the agent recommends escalation with evidence.",
    },
    {
      trigger: "Insufficient close cycle history: fewer than 12 months of data available",
      action: "request_more_info",
      rationale: "Trend analysis requires at least 1 year (12 cycles) of monthly close data to establish a meaningful pattern; request a date range once more history is available.",
    },
    {
      trigger: "Close task dependencies are missing or incomplete",
      action: "refuse",
      rationale: "Cannot compute critical-path bottleneck analysis without a complete dependency graph; refuse and cite the close-cycle-playbook.task-definition-requirements section.",
    },
    {
      trigger: "Cycle target_days metric is missing or zero in the baseline data",
      action: "request_more_info",
      rationale: "Trend analysis requires a documented target; ask the controller to confirm the target close cycle time (e.g., 8 business days) before computing variance.",
    },
  ],
  refusalRules: [
    "Never invent or assume task durations, cycle times, or bottleneck metrics — cite only BigQuery and BlackLine source records.",
    "Never recommend task owner reassignment or staffing changes — that is a management decision, not an analytics output.",
    "Never override or waive documented close cycle target days or SOP escalation thresholds.",
    "Never claim a bottleneck is 'fixed' without evidence from a subsequent cycle showing the task duration is below the threshold.",
  ],
  goldenEvals: [
    {
      id: "full-month-end-retrospective",
      prompt: "Generate a full retrospective for our May 2026 close cycle. We closed in 8.5 days vs. a 7-day target. What bottleneck tasks delayed us, and what are your recommendations?",
      expectedToolCalls: [
        "query_blackline_close_tasks",
        "query_blackline_task_dependencies",
        "query_bigquery_close_history",
        "query_bigquery_benchmark_metrics",
        "evidence_close_cycle_playbook",
        "evidence_close_acceleration_sop",
        "action_looker_publish_dashboard",
        "action_email_distribute_retrospective",
      ],
      mustReferenceEntities: ["close_tasks", "task_dependencies", "close_cycles", "retrospective_reports"],
      mustCiteDocuments: ["close-cycle-playbook", "close-acceleration-sop"],
      expectedActionOutcome: "Retrospective report published to Looker and distributed to controllers with bottleneck analysis, trend vs target, and improvement recommendations.",
      forbiddenBehaviors: [
        "do not invent task durations or cycle times",
        "do not recommend owner reassignment without explicit controller approval",
      ],
    },
    {
      id: "bottleneck-attribution-only",
      prompt: "Which close tasks took longer than planned in April 2026, and how much did they delay the overall cycle?",
      expectedToolCalls: [
        "query_blackline_close_tasks",
        "query_blackline_task_dependencies",
        "evidence_close_cycle_playbook",
      ],
      mustReferenceEntities: ["close_tasks", "task_dependencies"],
      mustCiteDocuments: ["close-cycle-playbook"],
      expectedActionOutcome: "Task-level bottleneck analysis with actual vs planned duration comparison; no action output.",
      forbiddenBehaviors: [
        "do not call action_looker_publish_dashboard without explicit request",
      ],
    },
    {
      id: "insufficient-data-refusal",
      prompt: "Show me the close cycle trend for the last 2 years.",
      expectedToolCalls: [
        "query_bigquery_close_history",
      ],
      expectedActionOutcome: "If fewer than 12 months of data: refuse and request_more_info with specific date range needed; if >= 12 months: return trend with root-cause analysis.",
      forbiddenBehaviors: [
        "do not extrapolate or invent cycle time data beyond the available history",
      ],
    },
  ],
};

const generationSpec: UseCaseGenerationSpec = {
  version: 1,
  rowPolicy: {
    defaultRowsPerEntity: 50,
    minimumRowsPerEntity: 25,
    seed: 42,
    rationale: "Month-end close analytics needs sufficient task, cycle, and report history to demonstrate bottleneck attribution, trend analysis, and retrospective narrative generation without becoming a large-data demo.",
  },
  sourceSystems: [
    {
      id: "blackline",
      name: "BlackLine",
      owns: ["close_tasks", "task_dependencies", "close_cycles", "assignees"],
      protocol: "REST API",
      localBacking: ["json-api", "alloydb"],
      toolNames: ["query_blackline_close_tasks", "query_blackline_task_dependencies"],
      mcpToolNames: ["blackline_get_close_tasks", "blackline_get_task_dependencies"],
      evidence: ["source_system_record"],
    },
    {
      id: "bigquery",
      name: "BigQuery",
      owns: ["close_cycles", "cycle_metrics", "benchmark_data", "trend_aggregations"],
      protocol: "BigQuery SQL",
      localBacking: ["json-api", "bigquery"],
      toolNames: ["query_bigquery_close_history", "query_bigquery_benchmark_metrics"],
      mcpToolNames: ["bigquery_query_close_history", "bigquery_query_benchmarks"],
      evidence: ["sql_result"],
    },
    {
      id: "looker",
      name: "Looker",
      owns: ["dashboards", "visualizations", "reports", "distributions"],
      protocol: "Looker API",
      localBacking: ["json-api", "bigquery"],
      toolNames: ["action_looker_publish_dashboard", "action_email_distribute_retrospective"],
      mcpToolNames: ["looker_refresh_dashboard", "looker_distribute_report"],
      evidence: ["api_response"],
    },
  ],
  entities: [
    {
      name: "close_tasks",
      sourceSystemId: "blackline",
      datastore: "alloydb",
      rowCount: 80,
      primaryKey: "id",
      columns: [
        { name: "id", type: "seq", required: true },
        { name: "cycle_id", type: "ref", ref: "close_cycles.id", required: true },
        { name: "task_name", type: "lorem.sentence", required: true },
        { name: "assignee", type: "person.fullName", required: true },
        { name: "status", type: "enum", values: ["not_started", "in_progress", "completed", "blocked"], weights: [0.05, 0.05, 0.85, 0.05], required: true },
        { name: "planned_duration_hours", type: "number", min: 1, max: 40, required: true },
        { name: "actual_duration_hours", type: "number", min: 0, max: 48, required: true },
        { name: "dependency_id", type: "ref", ref: "close_tasks.id", required: false },
      ],
    },
    {
      name: "task_dependencies",
      sourceSystemId: "blackline",
      datastore: "alloydb",
      rowCount: 50,
      primaryKey: "id",
      columns: [
        { name: "id", type: "seq", required: true },
        { name: "task_id", type: "ref", ref: "close_tasks.id", required: true },
        { name: "depends_on_task_id", type: "ref", ref: "close_tasks.id", required: true },
        { name: "wait_time_hours", type: "number", min: 0, max: 24, required: true },
      ],
    },
    {
      name: "close_cycles",
      sourceSystemId: "bigquery",
      datastore: "bigquery",
      rowCount: 30,
      primaryKey: "id",
      columns: [
        { name: "id", type: "seq", required: true },
        { name: "cycle_id", type: "lorem.sentence", required: true },
        { name: "target_days", type: "number", min: 5, max: 10, required: true },
        { name: "actual_days", type: "number", min: 5, max: 15, required: true },
        { name: "status", type: "enum", values: ["open", "closed", "reviewed"], weights: [0.05, 0.80, 0.15], required: true },
      ],
    },
    {
      name: "retrospective_reports",
      sourceSystemId: "looker",
      datastore: "bigquery",
      rowCount: 30,
      primaryKey: "id",
      columns: [
        { name: "id", type: "seq", required: true },
        { name: "cycle_id", type: "ref", ref: "close_cycles.id", required: true },
        { name: "body", type: "lorem.paragraph", required: true },
        { name: "recommendations", type: "lorem.paragraph", required: true },
      ],
    },
  ],
  relationships: [
    { from: "close_tasks.cycle_id", to: "close_cycles.id", cardinality: "many-to-one", orphanPolicy: "none" },
    { from: "close_tasks.dependency_id", to: "close_tasks.id", cardinality: "many-to-one", orphanPolicy: "allowed" },
    { from: "task_dependencies.task_id", to: "close_tasks.id", cardinality: "many-to-one", orphanPolicy: "none" },
    { from: "task_dependencies.depends_on_task_id", to: "close_tasks.id", cardinality: "many-to-one", orphanPolicy: "none" },
    { from: "retrospective_reports.cycle_id", to: "close_cycles.id", cardinality: "many-to-one", orphanPolicy: "none" },
  ],
  documents: [
    {
      id: "close-cycle-playbook",
      sourceSystemId: "blackline",
      type: "guide",
      title: "Close Cycle Playbook",
      requiredSections: ["Task definition and sequencing", "Target days rationale", "Bottleneck rules and escalation", "Review and sign-off procedures"],
      linkedEntities: ["close_tasks", "close_cycles"],
      minimumWordCount: 500,
      citationAnchors: ["cycle-target", "bottleneck-rules", "escalation-thresholds", "task-definition-requirements"],
    },
    {
      id: "close-acceleration-sop",
      sourceSystemId: "bigquery",
      type: "sop",
      title: "Close Acceleration SOP",
      requiredSections: ["Recurring bottleneck remediation", "Escalation procedures", "Approval workflows", "Success metrics"],
      linkedEntities: ["close_tasks", "retrospective_reports"],
      minimumWordCount: 400,
      citationAnchors: ["recurring-bottleneck-action", "escalation-approval", "success-criteria"],
    },
  ],
  apis: [
    {
      systemId: "looker",
      operation: "refresh_close_dashboard",
      method: "POST",
      path: "/systems/looker/dashboards/refresh",
      requestSchema: { dashboard_id: "string", analysis_results: "object" },
      responseSchema: { dashboard_url: "string", publication_timestamp: "string", status: "string" },
      fixture: "mock_data/apis/fixtures/looker_refresh_dashboard.json",
      mcpToolName: "looker_refresh_dashboard",
    },
    {
      systemId: "looker",
      operation: "distribute_retrospective",
      method: "POST",
      path: "/systems/email/retrospective-distribution",
      requestSchema: { recipient_list: "array", report_body: "string", cycle_id: "string" },
      responseSchema: { distribution_id: "string", delivery_timestamp: "string", status: "string" },
      fixture: "mock_data/apis/fixtures/looker_distribute_retrospective.json",
      mcpToolName: "looker_distribute_report",
    },
  ],
  anomalies: [
    {
      id: "recurring-bottleneck-task",
      description: "A close task appears as a bottleneck (actual_duration_hours > planned_duration_hours + 4) in 3+ consecutive cycles, indicating a systemic process or staffing issue.",
      affectedEntities: ["close_tasks", "close_cycles", "task_dependencies"],
      discoveryPath: ["Group close_tasks by cycle", "Filter tasks with duration variance >= 4 hours", "Identify tasks appearing in 3+ cycles", "Flag assignee and task_name as recurring"],
      expectedEvidence: ["BlackLine source records for task durations", "BigQuery cycle aggregation showing pattern", "Close-cycle-playbook citation for remediation"],
      expectedRecommendation: "Escalate to Controller with evidence of recurring bottleneck; recommend process redesign, automation, or staffing adjustment per close-acceleration-sop.",
    },
  ],
  datastorePackaging: {
    alloydb: { database: "finance_close", schemas: ["blackline"] },
    bigquery: { dataset: "finance_close_analytics", tables: ["close_cycles", "bottleneck_frequency", "cycle_time_trend"] },
    cloudStorage: { bucketSuffix: "finance-close-evidence", prefixes: ["reports", "retrospectives"] },
    apis: { serviceName: "finance-close-analytics-adapters", deploymentTarget: "cloud_run" },
  },
  behaviorContract,
  validation: {
    smokePrompt: "Generate a retrospective for our May 2026 close. We closed in 8.5 days; target was 7. What tasks delayed us and what should we improve?",
    expectedAnswer: [
      "cites BlackLine close tasks with planned vs actual duration",
      "identifies bottleneck tasks and assignees",
      "compares actual days vs target days with trend analysis",
      "generates improvement recommendations backed by data",
    ],
    assertions: [
      "all tool names use canonical system ids (blackline, bigquery, looker)",
      "all task and cycle foreign keys resolve correctly",
      "at least one document citation is used per claim type",
      "response demonstrates retrospective narrative with recommendations",
    ],
  },
};

export const MonthEndCloseAnalytics = () => (
  <UseCaseSlide
    title="Month-End Close Analytics"
    subtitle="A-2107 • GL & Close"
    icon={BarChart3}
    domainId="domain-21"
    layer="Layer 4: Data Agent"
    persona="Controller"
    systems={["BlackLine", "BigQuery", "Looker", "Vertex AI"]}
    kpis={[
      { label: "Close cycle improvement", before: "No tracking", after: "Measured monthly" },
      { label: "Bottleneck visibility", before: "Anecdotal", after: "Data-driven" },
      { label: "Repeat delays", before: "Same issues recur", after: "Addressed proactively" },
    ]}
    triggerType="scheduled"
    swimlane={swimlane}
    flow={flow}
    architecture={architecture}
    generationSpec={generationSpec}
    statusQuo={[
      "Close performance assessed anecdotally — no systematic tracking of task-level cycle times.",
      "Same bottleneck tasks cause delays quarter after quarter without structured improvement.",
      "No retrospective process to identify root causes and recommend specific improvements."
    ]}
    agentification={[
      "Automated close metrics tracking at the task level with trend analysis across cycles.",
      "Data-driven bottleneck identification pinpoints exactly which tasks and owners cause delays.",
      "Gemini generates retrospective narratives with specific, actionable improvement recommendations."
    ]}
  />
);
