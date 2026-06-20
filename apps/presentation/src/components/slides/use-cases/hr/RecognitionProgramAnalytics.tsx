import React from "react";
import { UseCaseSlide } from "../../../agent/UseCaseSlide";
import { Award, Download, BarChart, Eye, Target } from "lucide-react";
import { FlowStep } from "../../../agent/ProcessFlow";
import { SwimlaneFlow } from "../../../agent/SwimlaneFlow";
import { AgentArchitecture, UseCaseGenerationSpec, AgentBehaviorContract} from "../../../../types/architecture";

const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "s1", label: "Recognition Data", lane: "system", type: "trigger" },
    { id: "a1", label: "Pattern Analysis", lane: "agent", type: "action" },
    { id: "a2", label: "Equity Detection", lane: "agent", type: "action" },
    { id: "a3", label: "ROI Report", lane: "agent", type: "output" },
  ],
  connections: [["s1", "a1"], ["a1", "a2"], ["a2", "a3"]],
};

const flow: FlowStep[] = [
  { label: "Recognition Data", icon: Download, description: "All recognition events, types, participants collected.", trigger: "Continuous", systems: ["Recognition Platform"] },
  { label: "Pattern Analysis", icon: BarChart, description: "Usage patterns across teams, demographics, levels.", systems: ["Gemini", "BigQuery"], integration: "Data Agent" },
  { label: "Equity Detection", icon: Eye, description: "Recognition gaps by gender, tenure, location flagged." },
  { label: "ROI Report", icon: Target, description: "Recognition linked to engagement and retention metrics.", output: "Recognition Report" }
];

const architecture: AgentArchitecture = {
  connections: [
    { system: "Bonusly/Achievers", description: "Recognition events, award types, sender/receiver data", direction: "read", protocol: "REST API", category: "erp" },
    { system: "Workday", description: "Employee demographics, team structure, performance data", direction: "read", protocol: "REST API", category: "erp" },
    { system: "BigQuery", description: "Recognition analytics warehouse, trend data, equity metrics", direction: "bidirectional", protocol: "BigQuery SQL", category: "analytics" },
    { system: "Looker", description: "Interactive recognition dashboards and equity reports", direction: "write", protocol: "Looker API", category: "analytics" },
  ],
  pipeline: [
    { label: "Recognition Data Collection", description: "Aggregate all recognition events from Bonusly/Achievers with sender/receiver metadata. Enrich with Workday demographics for equity analysis across dimensions.", systems: ["Bonusly/Achievers", "Workday"], layer: "integration", dataIn: "Recognition events + employee demographics", dataOut: "Enriched recognition dataset by team × demographic × level" },
    { label: "Pattern & Equity Analysis", description: "Analyze recognition patterns across teams, demographics, levels, and time periods. Detect equity gaps and identify under-recognized populations using statistical methods.", systems: ["BigQuery"], layer: "ml", dataIn: "Enriched recognition dataset", dataOut: "Pattern analysis with equity gap report" },
    { label: "ROI Correlation", description: "Correlate recognition activity with engagement scores and retention outcomes. Calculate program ROI by linking recognition frequency to measurable business impact.", systems: ["BigQuery"], layer: "ml", dataIn: "Recognition patterns + engagement + retention data", dataOut: "ROI metrics with retention correlation" },
    { label: "Dashboard & Reporting", description: "Publish interactive dashboards in Looker with equity tracking, usage trends, and ROI metrics. Enable drill-down by team, location, and demographic dimension.", systems: ["Looker"], layer: "integration", dataIn: "Analytics results + equity metrics", dataOut: "Interactive recognition analytics dashboard" },
  ],
};


const behaviorContract: AgentBehaviorContract = {
  role: "HR Ops Lead agent for the Recognition Program Analytics Agent workflow",
  primaryObjective: "Recognition pattern analytics across organizational dimensions and time periods. Equity gap detection by team, demographic, and level with remediation suggestions. so the HR Ops Lead can move the Usage analysis KPI.",
  inScope: [
    "Recognition pattern analytics across organizational dimensions and time periods",
    "Equity gap detection by team, demographic, and level with remediation suggestions",
    "Automated ROI reporting linking recognition activity to engagement and retention outcomes",
  ],
  outOfScope: [
    "Final hiring, termination, or compensation decisions (HRBP/leadership retains authority)",
    "Performance management adjudication and disciplinary action",
    "Legal interpretation of employment law in ambiguous jurisdictions",
  ],
  toolIntents: [
    {
      name: "query_recognition_platform_recognition_platform_records",
      kind: "query",
      sourceSystemId: "recognition_platform",
      description: "Retrieve recognition platform records from Recognition Platform for the Recognition Program Analytics Agent workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "recognition_platform_records_records",
        "recognition_platform_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_workday_employees",
      kind: "query",
      sourceSystemId: "workday",
      description: "Retrieve employees from Workday for the Recognition Program Analytics Agent workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "employees_records",
        "employees_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_google_bigquery_analytics_events",
      kind: "query",
      sourceSystemId: "google_bigquery",
      description: "Retrieve analytics events from Google BigQuery for the Recognition Program Analytics Agent workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "analytics_events_records",
        "analytics_events_summary",
      ],
      evidenceEmitted: [
        "sql_result",
      ],
    },
    {
      name: "lookup_recognition_program_analytics_agent_policy_handbook",
      kind: "evidence_lookup",
      sourceSystemId: "google_bigquery",
      description: "Look up sections of the Recognition Program Analytics Agent Policy Handbook to cite in narrative output, escalation rationale, and audit evidence.",
      requiredInputs: [
        "section_anchor",
      ],
      produces: [
        "document_section",
        "citation_anchor",
      ],
      evidenceEmitted: [
        "document_reference",
      ],
    },
    {
      name: "action_recognition_platform_execute",
      kind: "action",
      sourceSystemId: "recognition_platform",
      description: "Execute the execute step in Recognition Platform after the agent has gathered evidence and validated escalation gates.",
      requiredInputs: [
        "target_id",
        "rationale",
      ],
      produces: [
        "action_id",
        "audit_record_id",
      ],
      evidenceEmitted: [
        "api_response",
        "generated_audit_trail",
      ],
    },
  ],
  evidenceRequirements: [
    {
      claim: "Usage analysis moved from Annual toward Real-time",
      mustCite: [
        "recognition_platform.recognition_platform_records",
        "workday.employees",
      ],
      sourceSystemIds: [
        "recognition_platform",
        "workday",
      ],
    },
    {
      claim: "Equity tracking moved from None toward By team/demo",
      mustCite: [
        "recognition_platform.recognition_platform_records",
        "workday.employees",
      ],
      sourceSystemIds: [
        "recognition_platform",
        "workday",
      ],
    },
  ],
  escalationRules: [
    {
      trigger: "Usage analysis regresses past the Annual baseline by more than 20%",
      action: "escalate_to_human",
      handoffTarget: "HR Ops Lead",
      rationale: "Significant regressions need human judgment before automated remediation runs against production records.",
    },
    {
      trigger: "Source-system evidence is incomplete or stale (>24h) for any required entity",
      action: "request_more_info",
      rationale: "Recommendations grounded in stale evidence misrepresent current state and undermine audit defensibility.",
    },
    {
      trigger: "Proposed execute action lacks supporting evidence from at least two systems",
      action: "refuse",
      rationale: "Single-system evidence is insufficient to authorize external state changes without manual review.",
    },
  ],
  refusalRules: [
    "Never fabricate metric values; only publish numbers derived from Recognition Platform (and other named systems) entities.",
    "Never bypass HR Ops Lead approval on escalation triggers, even when confidence is high.",
    "Never expose individual personal data (PII) in summaries; aggregate or pseudonymise before output.",
    "Never act on data older than the staleness threshold defined in the runbook without a fresh re-query.",
  ],
  goldenEvals: [
    {
      id: "recognition-program-analytics-agent-end-to-end",
      prompt: "Run the Recognition Program Analytics Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.",
      expectedToolCalls: [
        "query_recognition_platform_recognition_platform_records",
        "query_workday_employees",
        "query_google_bigquery_analytics_events",
        "lookup_recognition_program_analytics_agent_policy_handbook",
        "action_recognition_platform_execute",
      ],
      mustReferenceEntities: [
        "recognition_platform_records",
        "employees",
        "analytics_events",
      ],
      mustCiteDocuments: [
        "recognition-program-analytics-agent-policy-handbook",
      ],
      expectedActionOutcome: "Action execute executed against Recognition Platform, with audit-trail entry and HR Ops Lead notified of outcomes.",
      forbiddenBehaviors: [
        "do not invent KPI numbers",
        "do not skip the evidence_lookup step before any recommendation",
        "do not execute execute without two-system evidence",
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
    rationale: "Row counts sized for Recognition Program Analytics Agent so the agent can demonstrate the workflow against realistic transactional volume without simulating a production warehouse.",
  },
  sourceSystems: [
    {
      id: "recognition_platform",
      name: "Recognition Platform",
      owns: [
        "recognition_platform_records",
        "recognition_platform_events",
        "recognition_platform_audit_trail",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_recognition_platform_recognition_platform_records",
        "query_recognition_platform_recognition_platform_events",
        "query_recognition_platform_recognition_platform_audit_trail",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
    {
      id: "workday",
      name: "Workday",
      owns: [
        "employees",
        "positions",
        "compensation_records",
      ],
      protocol: "Workday REST",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_workday_employees",
        "query_workday_positions",
        "query_workday_compensation_records",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
    {
      id: "google_bigquery",
      name: "Google BigQuery",
      owns: [
        "analytics_events",
        "historical_metrics",
        "cached_aggregates",
      ],
      protocol: "BigQuery SQL",
      localBacking: [
        "bigquery",
      ],
      toolNames: [
        "query_google_bigquery_analytics_events",
        "query_google_bigquery_historical_metrics",
        "query_google_bigquery_cached_aggregates",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
  ],
  entities: [
    {
      name: "recognition_platform_records",
      sourceSystemId: "recognition_platform",
      datastore: "alloydb",
      rowCount: 60,
      primaryKey: "id",
      columns: [
        {
          name: "id",
          type: "seq",
          required: true,
        },
        {
          name: "source_record_id",
          type: "seq",
          required: true,
        },
        {
          name: "status",
          type: "enum",
          values: [
            "active",
            "pending",
            "closed",
          ],
          required: true,
        },
        {
          name: "owner",
          type: "person.fullName",
          required: true,
        },
        {
          name: "created_at",
          type: "date",
          required: true,
        },
        {
          name: "notes",
          type: "lorem.sentence",
        },
      ],
    },
    {
      name: "recognition_platform_events",
      sourceSystemId: "recognition_platform",
      datastore: "alloydb",
      rowCount: 60,
      primaryKey: "id",
      columns: [
        {
          name: "id",
          type: "seq",
          required: true,
        },
        {
          name: "actor",
          type: "person.fullName",
          required: true,
        },
        {
          name: "action",
          type: "enum",
          values: [
            "create",
            "update",
            "delete",
            "approve",
            "reject",
            "escalate",
            "view",
            "share",
          ],
          required: true,
        },
        {
          name: "target_type",
          type: "lorem.words",
          required: true,
        },
        {
          name: "created_at",
          type: "date",
          required: true,
        },
        {
          name: "notes",
          type: "lorem.sentence",
        },
        {
          name: "recognition_platform_record_id",
          type: "ref",
          ref: "recognition_platform_records.id",
          required: true,
        },
      ],
    },
    {
      name: "recognition_platform_audit_trail",
      sourceSystemId: "recognition_platform",
      datastore: "alloydb",
      rowCount: 60,
      primaryKey: "id",
      columns: [
        {
          name: "id",
          type: "seq",
          required: true,
        },
        {
          name: "actor",
          type: "person.fullName",
          required: true,
        },
        {
          name: "action",
          type: "enum",
          values: [
            "create",
            "update",
            "delete",
            "approve",
            "reject",
            "escalate",
            "view",
            "share",
          ],
          required: true,
        },
        {
          name: "target_type",
          type: "lorem.words",
          required: true,
        },
        {
          name: "created_at",
          type: "date",
          required: true,
        },
        {
          name: "notes",
          type: "lorem.sentence",
        },
      ],
    },
    {
      name: "employees",
      sourceSystemId: "workday",
      datastore: "alloydb",
      rowCount: 60,
      primaryKey: "id",
      columns: [
        {
          name: "id",
          type: "seq",
          required: true,
        },
        {
          name: "source_record_id",
          type: "seq",
          required: true,
        },
        {
          name: "name",
          type: "person.fullName",
          required: true,
        },
        {
          name: "email",
          type: "internet.email",
          required: true,
        },
        {
          name: "department",
          type: "enum",
          values: [
            "Finance",
            "HR",
            "IT",
            "Marketing",
            "Procurement",
            "Engineering",
            "Operations",
          ],
          required: true,
        },
        {
          name: "region",
          type: "enum",
          values: [
            "US",
            "EMEA",
            "APAC",
            "LATAM",
          ],
          required: true,
        },
        {
          name: "status",
          type: "enum",
          values: [
            "active",
            "on_leave",
            "inactive",
          ],
          weights: [
            0.85,
            0.1,
            0.05,
          ],
          required: true,
        },
        {
          name: "level",
          type: "enum",
          values: [
            "L3",
            "L4",
            "L5",
            "L6",
            "L7",
          ],
          required: true,
        },
        {
          name: "hired_on",
          type: "date",
          required: true,
        },
      ],
    },
    {
      name: "positions",
      sourceSystemId: "workday",
      datastore: "alloydb",
      rowCount: 60,
      primaryKey: "id",
      columns: [
        {
          name: "id",
          type: "seq",
          required: true,
        },
        {
          name: "source_record_id",
          type: "seq",
          required: true,
        },
        {
          name: "name",
          type: "person.fullName",
          required: true,
        },
        {
          name: "email",
          type: "internet.email",
          required: true,
        },
        {
          name: "department",
          type: "enum",
          values: [
            "Finance",
            "HR",
            "IT",
            "Marketing",
            "Procurement",
            "Engineering",
            "Operations",
          ],
          required: true,
        },
        {
          name: "region",
          type: "enum",
          values: [
            "US",
            "EMEA",
            "APAC",
            "LATAM",
          ],
          required: true,
        },
        {
          name: "status",
          type: "enum",
          values: [
            "active",
            "on_leave",
            "inactive",
          ],
          weights: [
            0.85,
            0.1,
            0.05,
          ],
          required: true,
        },
        {
          name: "level",
          type: "enum",
          values: [
            "L3",
            "L4",
            "L5",
            "L6",
            "L7",
          ],
          required: true,
        },
        {
          name: "hired_on",
          type: "date",
          required: true,
        },
      ],
    },
    {
      name: "compensation_records",
      sourceSystemId: "workday",
      datastore: "alloydb",
      rowCount: 60,
      primaryKey: "id",
      columns: [
        {
          name: "id",
          type: "seq",
          required: true,
        },
        {
          name: "source_record_id",
          type: "seq",
          required: true,
        },
        {
          name: "name",
          type: "person.fullName",
          required: true,
        },
        {
          name: "email",
          type: "internet.email",
          required: true,
        },
        {
          name: "department",
          type: "enum",
          values: [
            "Finance",
            "HR",
            "IT",
            "Marketing",
            "Procurement",
            "Engineering",
            "Operations",
          ],
          required: true,
        },
        {
          name: "region",
          type: "enum",
          values: [
            "US",
            "EMEA",
            "APAC",
            "LATAM",
          ],
          required: true,
        },
        {
          name: "status",
          type: "enum",
          values: [
            "active",
            "on_leave",
            "inactive",
          ],
          weights: [
            0.85,
            0.1,
            0.05,
          ],
          required: true,
        },
        {
          name: "level",
          type: "enum",
          values: [
            "L3",
            "L4",
            "L5",
            "L6",
            "L7",
          ],
          required: true,
        },
        {
          name: "hired_on",
          type: "date",
          required: true,
        },
      ],
    },
    {
      name: "analytics_events",
      sourceSystemId: "google_bigquery",
      datastore: "bigquery",
      rowCount: 60,
      primaryKey: "id",
      columns: [
        {
          name: "id",
          type: "seq",
          required: true,
        },
        {
          name: "period",
          type: "enum",
          values: [
            "day",
            "week",
            "month",
            "quarter",
          ],
          required: true,
        },
        {
          name: "metric_name",
          type: "lorem.words",
          required: true,
        },
        {
          name: "value",
          type: "float",
          min: 0,
          max: 100000,
          decimals: 2,
          required: true,
        },
        {
          name: "variance_pct",
          type: "float",
          min: -50,
          max: 50,
          decimals: 2,
          required: true,
        },
        {
          name: "computed_at",
          type: "date",
          required: true,
        },
        {
          name: "historical_metric_id",
          type: "ref",
          ref: "historical_metrics.id",
          required: true,
        },
      ],
    },
    {
      name: "historical_metrics",
      sourceSystemId: "google_bigquery",
      datastore: "bigquery",
      rowCount: 60,
      primaryKey: "id",
      columns: [
        {
          name: "id",
          type: "seq",
          required: true,
        },
        {
          name: "period",
          type: "enum",
          values: [
            "day",
            "week",
            "month",
            "quarter",
          ],
          required: true,
        },
        {
          name: "metric_name",
          type: "lorem.words",
          required: true,
        },
        {
          name: "value",
          type: "float",
          min: 0,
          max: 100000,
          decimals: 2,
          required: true,
        },
        {
          name: "variance_pct",
          type: "float",
          min: -50,
          max: 50,
          decimals: 2,
          required: true,
        },
        {
          name: "computed_at",
          type: "date",
          required: true,
        },
      ],
    },
    {
      name: "cached_aggregates",
      sourceSystemId: "google_bigquery",
      datastore: "bigquery",
      rowCount: 60,
      primaryKey: "id",
      columns: [
        {
          name: "id",
          type: "seq",
          required: true,
        },
        {
          name: "period",
          type: "enum",
          values: [
            "day",
            "week",
            "month",
            "quarter",
          ],
          required: true,
        },
        {
          name: "metric_name",
          type: "lorem.words",
          required: true,
        },
        {
          name: "value",
          type: "float",
          min: 0,
          max: 100000,
          decimals: 2,
          required: true,
        },
        {
          name: "variance_pct",
          type: "float",
          min: -50,
          max: 50,
          decimals: 2,
          required: true,
        },
        {
          name: "computed_at",
          type: "date",
          required: true,
        },
      ],
    },
  ],
  relationships: [
    {
      from: "recognition_platform_events.recognition_platform_record_id",
      to: "recognition_platform_records.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
    {
      from: "analytics_events.historical_metric_id",
      to: "historical_metrics.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
  ],
  documents: [
    {
      id: "recognition-program-analytics-agent-policy-handbook",
      sourceSystemId: "google_bigquery",
      type: "policy",
      title: "Recognition Program Analytics Agent Policy Handbook",
      requiredSections: [
        "Eligibility and scope",
        "Workflow steps",
        "Manager responsibilities",
        "Compliance and audit",
        "Sensitive-data handling",
      ],
      linkedEntities: [
        "recognition_platform_records",
        "recognition_platform_events",
        "recognition_platform_audit_trail",
      ],
      minimumWordCount: 500,
      citationAnchors: [
        "eligibility",
        "workflow",
        "compliance",
        "sensitive-data",
      ],
    },
  ],
  apis: [
    {
      id: "recognition_platform_execute_api",
      sourceSystemId: "recognition_platform",
      method: "POST",
      path: "/api/recognition_platform/execute",
      description: "Synchronous endpoint the agent calls to execute in Recognition Platform after evidence gating.",
      requestSchema: {
        target_id: "string",
        rationale: "string",
        metadata: "object",
      },
      responseSchema: {
        action_id: "string",
        status: "string",
        audit_record_id: "string",
      },
      idempotencyKey: "target_id+rationale",
    },
  ],
  anomalies: [
    {
      id: "recognition-program-analytics-agent-baseline-gap",
      description: "Seed a realistic gap where Usage analysis sits between Annual and Real-time, so the agent can detect, narrate, and recommend remediation.",
      affectedEntities: [
        "recognition_platform_records",
        "recognition_platform_events",
      ],
      discoveryPath: [
        "Inspect Recognition Platform records for the affected entities",
        "Compare against Workday historical baseline",
        "Generate a citation-backed recommendation",
      ],
      expectedEvidence: [
        "source-system record",
        "historical baseline metric",
        "generated audit trail",
      ],
      expectedRecommendation: "Explain the gap, cite supporting evidence, and propose the next HR Ops Lead action.",
    },
  ],
  datastorePackaging: {
    alloydb: {
      database: "recognition_program_analytics_agent",
      schemas: [
        "recognition_platform",
        "workday",
      ],
    },
    bigquery: {
      dataset: "hr_recognition_program_analytics_agent",
      tables: [
        "kpi_summary",
        "evidence_index",
      ],
    },
    cloudStorage: {
      bucketSuffix: "recognition-program-analytics-agent-evidence",
      prefixes: [
        "documents",
        "audit-trails",
        "exports",
      ],
    },
    apis: {
      serviceName: "recognition-program-analytics-agent-source-adapters",
      deploymentTarget: "cloud_run",
    },
  },
  validation: {
    smokePrompt: "Run the Recognition Program Analytics Agent workflow and cite source-system evidence for every claim.",
    expectedAnswer: [
      "uses canonical source-system tools",
      "cites the governing document",
      "names the next operator action",
    ],
    assertions: [
      "canonical source-system tool names",
      "minimum row policy met",
      "audit trail emitted on actions",
      "evidence_lookup invoked before recommendations",
    ],
  },
  behaviorContract: behaviorContract,
};

export const RecognitionProgramAnalytics = () => (
  <UseCaseSlide
    title="Recognition Program Analytics Agent"
    subtitle="A-704 • Recognition & Rewards"
    icon={Award}
    domainId="domain-7"
    layer="Layer 4: Data Agent"
    persona="HR Ops Lead"
    triggerType="scheduled"
    swimlane={swimlane}
    systems={["Recognition Platform", "Workday", "Google BigQuery"]}
    kpis={[
      { label: "Usage analysis", before: "Annual", after: "Real-time" },
      { label: "Equity tracking", before: "None", after: "By team/demo" },
      { label: "ROI linkage", before: "Assumed", after: "Proven" }
    ]}
    flow={flow}
    architecture={architecture}
    statusQuo={[
      "Recognition program usage data rarely analyzed for patterns or gaps.",
      "Recognition equity across teams and demographics remains unknown.",
      "Program ROI is unjustifiable at budget time without concrete metrics."
    ]}
    agentification={[
      "Recognition pattern analytics across organizational dimensions and time periods.",
      "Equity gap detection by team, demographic, and level with remediation suggestions.",
      "Automated ROI reporting linking recognition activity to engagement and retention outcomes."
    ]}
  />
);
