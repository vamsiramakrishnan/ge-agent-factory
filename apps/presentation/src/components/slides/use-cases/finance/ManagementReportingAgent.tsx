import React from "react";
import { UseCaseSlide } from "../../../agent/UseCaseSlide";
import { FlowStep } from "../../../agent/ProcessFlow";
import { SwimlaneFlow } from "../../../agent/SwimlaneFlow";
import { AgentArchitecture, UseCaseGenerationSpec, AgentBehaviorContract} from "../../../../types/architecture";
import { Presentation, Database, Users, CheckCircle, BarChart3 } from "lucide-react";

const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "s1", label: "Monthly Close", lane: "system", type: "trigger" },
    { id: "a1", label: "KPI Collection", lane: "agent", type: "action" },
    { id: "a2", label: "Audience Tailoring", lane: "agent", type: "action" },
    { id: "a3", label: "Management Reports", lane: "agent", type: "output" },
    { id: "h1", label: "CFO Reviews", lane: "human", type: "hitl" },
  ],
  connections: [["s1", "a1"], ["a1", "a2"], ["a2", "a3"], ["a3", "h1"]],
};

const flow: FlowStep[] = [
  { label: "Data Aggregation", icon: Database, description: "Pull operational and financial KPIs from data warehouse and visualization platform.", trigger: "Monthly", systems: ["BigQuery", "Looker"] },
  { label: "Audience Analysis", icon: Users, description: "Tailor reports for each executive: CEO gets strategic summary, COO gets operational detail, CFO gets full financial package.", systems: ["Vertex AI"], integration: "ADK" },
  { label: "Report Generation", icon: Presentation, description: "Generate audience-appropriate management reports with commentary and visualizations.", systems: ["Google Slides", "Vertex AI"] },
  { label: "CFO Review", icon: CheckCircle, description: "CFO reviews the management reporting package before distribution to leadership.", output: "Management Reporting Package" },
];

const architecture: AgentArchitecture = {
  connections: [
    { system: "BigQuery", description: "Operational and financial KPIs, trend data, segment analytics", direction: "read", protocol: "BigQuery SQL", category: "analytics" },
    { system: "Looker", description: "Interactive dashboards, drill-down analytics, data visualization", direction: "read", protocol: "REST API", category: "analytics" },
    { system: "Google Slides", description: "Formatted management presentations", direction: "write", protocol: "Workspace API", category: "collaboration" },
    { system: "Vertex AI (Gemini)", description: "Audience-tailored narrative generation, insight prioritization", direction: "bidirectional", protocol: "gRPC", category: "ai" },
  ],
  pipeline: [
    { label: "KPI Aggregation", description: "Pull financial KPIs (revenue, margins, cash flow) and operational metrics (utilization, SLA, customer satisfaction) from the data warehouse.", systems: ["BigQuery", "Looker"], layer: "integration", dataIn: "Raw KPI data from multiple sources", dataOut: "Consolidated KPI dataset with comparatives" },
    { label: "Trend & Status Computation", description: "Calculate YoY/QoQ trends, traffic-light status indicators, and drill-down analytics by business unit, region, and product line.", systems: ["BigQuery"], layer: "ml", dataIn: "Consolidated KPIs", dataOut: "Trended KPIs with status indicators" },
    { label: "Audience Tailoring", description: "Gemini generates three report variants from the same data: CEO gets a one-page strategic summary with 5 key metrics; COO gets operational detail by BU; CFO gets the full financial package with commentary.", systems: ["Vertex AI (Gemini)"], layer: "llm", dataIn: "Trended KPIs + organizational context", dataOut: "Audience-tailored report narratives" },
    { label: "Presentation Assembly", description: "Format reports into Google Slides presentations with charts, tables, and commentary. Distribute to leadership team.", systems: ["Google Slides"], layer: "integration", dataIn: "Report narratives + visualizations", dataOut: "Management reporting package" },
  ],
};


const behaviorContract: AgentBehaviorContract = {
  role: "Financial Reporting Manager agent for the Management Reporting Agent workflow",
  primaryObjective: "Gemini generates audience-tailored reports — strategic for CEO, operational for COO, financial for CFO. Automated KPI aggregation delivers reports on close day instead of days later. so the Financial Reporting Manager can move the Report preparation KPI.",
  inScope: [
    "Gemini generates audience-tailored reports — strategic for CEO, operational for COO, financial for CFO",
    "Automated KPI aggregation delivers reports on close day instead of days later",
    "AI commentary focuses on insights and recommended actions, not restating chart data",
  ],
  outOfScope: [
    "Final sign-off on materially significant journal entries (Controller retains authority)",
    "Restatement of prior-period filings",
    "Tax position changes that require external advisor review",
  ],
  toolIntents: [
    {
      name: "query_bigquery_analytics_events",
      kind: "query",
      sourceSystemId: "bigquery",
      description: "Retrieve analytics events from BigQuery for the Management Reporting Agent workflow.",
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
      name: "query_looker_dashboards",
      kind: "query",
      sourceSystemId: "looker",
      description: "Retrieve dashboards from Looker for the Management Reporting Agent workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "dashboards_records",
        "dashboards_summary",
      ],
      evidenceEmitted: [
        "sql_result",
      ],
    },
    {
      name: "query_google_slides_presentations",
      kind: "query",
      sourceSystemId: "google_slides",
      description: "Retrieve presentations from Google Slides for the Management Reporting Agent workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "presentations_records",
        "presentations_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "lookup_management_reporting_agent_controls_playbook",
      kind: "evidence_lookup",
      sourceSystemId: "bigquery",
      description: "Look up sections of the Management Reporting Agent Controls Playbook to cite in narrative output, escalation rationale, and audit evidence.",
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
      name: "action_google_slides_recommend",
      kind: "action",
      sourceSystemId: "google_slides",
      description: "Execute the recommend step in Google Slides after the agent has gathered evidence and validated escalation gates.",
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
      claim: "Report preparation moved from 2-3 days post-close toward Same-day automated",
      mustCite: [
        "bigquery.analytics_events",
        "looker.dashboards",
      ],
      sourceSystemIds: [
        "bigquery",
        "looker",
      ],
    },
    {
      claim: "Audience variants moved from 1 generic report toward 3 tailored versions",
      mustCite: [
        "bigquery.analytics_events",
        "looker.dashboards",
      ],
      sourceSystemIds: [
        "bigquery",
        "looker",
      ],
    },
  ],
  escalationRules: [
    {
      trigger: "Report preparation regresses past the 2-3 days post-close baseline by more than 20%",
      action: "escalate_to_human",
      handoffTarget: "Financial Reporting Manager",
      rationale: "Significant regressions need human judgment before automated remediation runs against production records.",
    },
    {
      trigger: "Source-system evidence is incomplete or stale (>24h) for any required entity",
      action: "request_more_info",
      rationale: "Recommendations grounded in stale evidence misrepresent current state and undermine audit defensibility.",
    },
    {
      trigger: "Proposed recommend action lacks supporting evidence from at least two systems",
      action: "refuse",
      rationale: "Single-system evidence is insufficient to authorize external state changes without manual review.",
    },
  ],
  refusalRules: [
    "Never fabricate metric values; only publish numbers derived from BigQuery (and other named systems) entities.",
    "Never bypass Financial Reporting Manager approval on escalation triggers, even when confidence is high.",
    "Never expose individual personal data (PII) in summaries; aggregate or pseudonymise before output.",
    "Never act on data older than the staleness threshold defined in the runbook without a fresh re-query.",
  ],
  goldenEvals: [
    {
      id: "management-reporting-agent-end-to-end",
      prompt: "Run the Management Reporting Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.",
      expectedToolCalls: [
        "query_bigquery_analytics_events",
        "query_looker_dashboards",
        "query_google_slides_presentations",
        "lookup_management_reporting_agent_controls_playbook",
        "action_google_slides_recommend",
      ],
      mustReferenceEntities: [
        "analytics_events",
        "dashboards",
        "presentations",
      ],
      mustCiteDocuments: [
        "management-reporting-agent-controls-playbook",
      ],
      expectedActionOutcome: "Action recommend executed against Google Slides, with audit-trail entry and Financial Reporting Manager notified of outcomes.",
      forbiddenBehaviors: [
        "do not invent KPI numbers",
        "do not skip the evidence_lookup step before any recommendation",
        "do not execute recommend without two-system evidence",
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
    rationale: "Row counts sized for Management Reporting Agent so the agent can demonstrate the workflow against realistic transactional volume without simulating a production warehouse.",
  },
  sourceSystems: [
    {
      id: "bigquery",
      name: "BigQuery",
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
        "query_bigquery_analytics_events",
        "query_bigquery_historical_metrics",
        "query_bigquery_cached_aggregates",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
    {
      id: "looker",
      name: "Looker",
      owns: [
        "dashboards",
        "explore_queries",
        "metric_definitions",
      ],
      protocol: "LookerML",
      localBacking: [
        "bigquery",
      ],
      toolNames: [
        "query_looker_dashboards",
        "query_looker_explore_queries",
        "query_looker_metric_definitions",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
    {
      id: "google_slides",
      name: "Google Slides",
      owns: [
        "presentations",
        "slide_assets",
        "view_logs",
      ],
      protocol: "Workspace API",
      localBacking: [
        "cloud-storage",
      ],
      toolNames: [
        "query_google_slides_presentations",
        "query_google_slides_slide_assets",
        "query_google_slides_view_logs",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
  ],
  entities: [
    {
      name: "analytics_events",
      sourceSystemId: "bigquery",
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
      sourceSystemId: "bigquery",
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
      sourceSystemId: "bigquery",
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
      name: "dashboards",
      sourceSystemId: "looker",
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
      name: "explore_queries",
      sourceSystemId: "looker",
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
      name: "metric_definitions",
      sourceSystemId: "looker",
      datastore: "bigquery",
      rowCount: 30,
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
      name: "presentations",
      sourceSystemId: "google_slides",
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
          name: "title",
          type: "lorem.sentence",
          required: true,
        },
        {
          name: "owner",
          type: "person.fullName",
          required: true,
        },
        {
          name: "status",
          type: "enum",
          values: [
            "draft",
            "review",
            "published",
            "archived",
          ],
          required: true,
        },
        {
          name: "last_updated",
          type: "date",
          required: true,
        },
      ],
    },
    {
      name: "slide_assets",
      sourceSystemId: "google_slides",
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
      name: "view_logs",
      sourceSystemId: "google_slides",
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
          name: "presentation_id",
          type: "ref",
          ref: "presentations.id",
          required: true,
        },
      ],
    },
  ],
  relationships: [
    {
      from: "analytics_events.historical_metric_id",
      to: "historical_metrics.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
    {
      from: "view_logs.presentation_id",
      to: "presentations.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
  ],
  documents: [
    {
      id: "management-reporting-agent-controls-playbook",
      sourceSystemId: "bigquery",
      type: "policy",
      title: "Management Reporting Agent Controls Playbook",
      requiredSections: [
        "Workflow scope",
        "Materiality thresholds",
        "Escalation triggers",
        "Audit evidence requirements",
        "Quarter-end variations",
      ],
      linkedEntities: [
        "analytics_events",
        "historical_metrics",
        "cached_aggregates",
      ],
      minimumWordCount: 500,
      citationAnchors: [
        "scope",
        "materiality",
        "escalation",
        "audit-evidence",
      ],
    },
  ],
  apis: [
    {
      id: "google_slides_recommend_api",
      sourceSystemId: "google_slides",
      method: "POST",
      path: "/api/google_slides/recommend",
      description: "Synchronous endpoint the agent calls to recommend in Google Slides after evidence gating.",
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
      id: "management-reporting-agent-baseline-gap",
      description: "Seed a realistic gap where Report preparation sits between 2-3 days post-close and Same-day automated, so the agent can detect, narrate, and recommend remediation.",
      affectedEntities: [
        "analytics_events",
        "historical_metrics",
      ],
      discoveryPath: [
        "Inspect BigQuery records for the affected entities",
        "Compare against Looker historical baseline",
        "Generate a citation-backed recommendation",
      ],
      expectedEvidence: [
        "source-system record",
        "historical baseline metric",
        "generated audit trail",
      ],
      expectedRecommendation: "Explain the gap, cite supporting evidence, and propose the next Financial Reporting Manager action.",
    },
  ],
  datastorePackaging: {
    alloydb: {
      database: "management_reporting_agent",
      schemas: [
        "google_slides",
      ],
    },
    bigquery: {
      dataset: "finance_management_reporting_agent",
      tables: [
        "kpi_summary",
        "evidence_index",
      ],
    },
    cloudStorage: {
      bucketSuffix: "management-reporting-agent-evidence",
      prefixes: [
        "documents",
        "audit-trails",
        "exports",
      ],
    },
    apis: {
      serviceName: "management-reporting-agent-source-adapters",
      deploymentTarget: "cloud_run",
    },
  },
  validation: {
    smokePrompt: "Run the Management Reporting Agent workflow and cite source-system evidence for every claim.",
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

export const ManagementReportingAgent = () => (
  <UseCaseSlide
    title="Management Reporting Agent"
    subtitle="A-2802 • Finance Analytics & Reporting"
    icon={Presentation}
    domainId="domain-28"
    layer="Layer 3: Custom ADK"
    persona="Financial Reporting Manager"
    systems={["BigQuery", "Looker", "Google Slides", "Vertex AI"]}
    kpis={[
      { label: "Report preparation", before: "2-3 days post-close", after: "Same-day automated" },
      { label: "Audience variants", before: "1 generic report", after: "3 tailored versions" },
      { label: "Commentary drafting", before: "Manual by FP&A", after: "AI-generated with review" },
    ]}
    triggerType="scheduled"
    swimlane={swimlane}
    flow={flow}
    architecture={architecture}
    hitl={{ actor: "CFO", action: "Review management package", description: "CFO reviews the management reporting package and approves distribution to the leadership team." }}
    statusQuo={[
      "Management reports take days to compile from multiple dashboards and spreadsheets.",
      "Same generic report sent to all executives regardless of their decision-making needs.",
      "Commentary written manually, often repeating the same data that charts already show."
    ]}
    agentification={[
      "Gemini generates audience-tailored reports — strategic for CEO, operational for COO, financial for CFO.",
      "Automated KPI aggregation delivers reports on close day instead of days later.",
      "AI commentary focuses on insights and recommended actions, not restating chart data."
    ]}
  />
);
