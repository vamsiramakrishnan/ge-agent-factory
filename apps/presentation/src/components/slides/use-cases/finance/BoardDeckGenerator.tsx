import React from "react";
import { UseCaseSlide } from "../../../agent/UseCaseSlide";
import { FlowStep } from "../../../agent/ProcessFlow";
import { SwimlaneFlow } from "../../../agent/SwimlaneFlow";
import { AgentArchitecture, UseCaseGenerationSpec, AgentBehaviorContract} from "../../../../types/architecture";
import { Presentation, Database, BarChart3, FileText, CheckCircle } from "lucide-react";

const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "s1", label: "Quarterly Cycle", lane: "system", type: "trigger" },
    { id: "a1", label: "KPI Aggregation", lane: "agent", type: "action" },
    { id: "a2", label: "Narrative Generation", lane: "agent", type: "action" },
    { id: "a3", label: "Deck Assembly", lane: "agent", type: "output" },
    { id: "h1", label: "CFO Reviews", lane: "human", type: "hitl" },
  ],
  connections: [["s1", "a1"], ["a1", "a2"], ["a2", "a3"], ["a3", "h1"]],
};

const flow: FlowStep[] = [
  { label: "Data Aggregation", icon: Database, description: "Pull KPIs, financial statements, and strategic metrics from data warehouse.", trigger: "Quarterly", systems: ["BigQuery", "Looker"] },
  { label: "Trend Analysis", icon: BarChart3, description: "Calculate YoY/QoQ comparisons, benchmark gap analysis, and trend computations.", systems: ["BigQuery"], integration: "ADK" },
  { label: "Narrative Drafting", icon: FileText, description: "Transform raw financial data into board-ready narrative tailored by audience.", systems: ["Vertex AI"] },
  { label: "CFO Review", icon: CheckCircle, description: "CFO reviews assembled deck with management discussion before board distribution.", output: "Board Deck" },
];

const architecture: AgentArchitecture = {
  connections: [
    { system: "BigQuery", description: "Financial KPIs, strategic metrics, historical trends", direction: "read", protocol: "BigQuery SQL", category: "analytics" },
    { system: "Looker", description: "Dashboard visualizations, chart exports, metric definitions", direction: "read", protocol: "Looker API", category: "analytics" },
    { system: "Google Slides", description: "Board deck template, formatted presentation output", direction: "write", protocol: "Workspace API", category: "collaboration" },
    { system: "Vertex AI (Gemini)", description: "Management discussion narrative, audience-tailored framing", direction: "bidirectional", protocol: "gRPC", category: "ai" },
  ],
  pipeline: [
    { label: "KPI & Financial Data Pull", description: "Aggregate financial statements, strategic KPIs, and operational metrics from data warehouse. Pull chart visualizations from Looker dashboards.", systems: ["BigQuery", "Looker"], layer: "integration", dataIn: "Financial data warehouse + dashboards", dataOut: "Aggregated KPI dataset with charts" },
    { label: "Trend Computation", description: "Calculate YoY/QoQ comparisons, benchmark gap analysis, and trend projections. Identify key inflection points and notable changes.", systems: ["BigQuery"], layer: "ml", dataIn: "KPI dataset + historical baselines", dataOut: "Trend analysis with benchmark comparisons" },
    { label: "Board Narrative Generation", description: "Gemini transforms raw data into board-ready narrative. Frames differently for audit committee (risk-focused) vs. full board (strategy-focused). Generates management discussion and analysis.", systems: ["Vertex AI (Gemini)"], layer: "llm", dataIn: "Trend analysis + strategic context", dataOut: "Audience-tailored board narratives" },
    { label: "Deck Assembly & Delivery", description: "Assemble narratives, charts, and data into board-ready Google Slides presentation. Route to CFO for review before distribution.", systems: ["Google Slides", "Email"], layer: "integration", dataIn: "Narratives + visualizations", dataOut: "Board deck for CFO review" },
  ],
};


const behaviorContract: AgentBehaviorContract = {
  role: "CFO agent for the Board Deck Generator workflow",
  primaryObjective: "Automated KPI aggregation and chart assembly from 15+ data sources into slide templates. Gemini generates management discussion narratives tailored to each audience — risk vs. strategy focus. so the CFO can move the Deck preparation time KPI.",
  inScope: [
    "Automated KPI aggregation and chart assembly from 15+ data sources into slide templates",
    "Gemini generates management discussion narratives tailored to each audience — risk vs. strategy focus",
    "Board deck assembled in hours instead of days with consistent narrative quality",
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
      description: "Retrieve analytics events from BigQuery for the Board Deck Generator workflow.",
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
      description: "Retrieve dashboards from Looker for the Board Deck Generator workflow.",
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
      description: "Retrieve presentations from Google Slides for the Board Deck Generator workflow.",
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
      name: "lookup_board_deck_generator_controls_playbook",
      kind: "evidence_lookup",
      sourceSystemId: "bigquery",
      description: "Look up sections of the Board Deck Generator Controls Playbook to cite in narrative output, escalation rationale, and audit evidence.",
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
      name: "action_google_slides_generate",
      kind: "action",
      sourceSystemId: "google_slides",
      description: "Execute the generate step in Google Slides after the agent has gathered evidence and validated escalation gates.",
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
      claim: "Deck preparation time moved from 3-5 days toward 4 hours",
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
      claim: "Data sources integrated moved from 5-6 manual toward 15+ automated",
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
      trigger: "Deck preparation time regresses past the 3-5 days baseline by more than 20%",
      action: "escalate_to_human",
      handoffTarget: "CFO",
      rationale: "Significant regressions need human judgment before automated remediation runs against production records.",
    },
    {
      trigger: "Source-system evidence is incomplete or stale (>24h) for any required entity",
      action: "request_more_info",
      rationale: "Recommendations grounded in stale evidence misrepresent current state and undermine audit defensibility.",
    },
    {
      trigger: "Proposed generate action lacks supporting evidence from at least two systems",
      action: "refuse",
      rationale: "Single-system evidence is insufficient to authorize external state changes without manual review.",
    },
  ],
  refusalRules: [
    "Never fabricate metric values; only publish numbers derived from BigQuery (and other named systems) entities.",
    "Never bypass CFO approval on escalation triggers, even when confidence is high.",
    "Never expose individual personal data (PII) in summaries; aggregate or pseudonymise before output.",
    "Never act on data older than the staleness threshold defined in the runbook without a fresh re-query.",
  ],
  goldenEvals: [
    {
      id: "board-deck-generator-end-to-end",
      prompt: "Run the Board Deck Generator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.",
      expectedToolCalls: [
        "query_bigquery_analytics_events",
        "query_looker_dashboards",
        "query_google_slides_presentations",
        "lookup_board_deck_generator_controls_playbook",
        "action_google_slides_generate",
      ],
      mustReferenceEntities: [
        "analytics_events",
        "dashboards",
        "presentations",
      ],
      mustCiteDocuments: [
        "board-deck-generator-controls-playbook",
      ],
      expectedActionOutcome: "Action generate executed against Google Slides, with audit-trail entry and CFO notified of outcomes.",
      forbiddenBehaviors: [
        "do not invent KPI numbers",
        "do not skip the evidence_lookup step before any recommendation",
        "do not execute generate without two-system evidence",
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
    rationale: "Row counts sized for Board Deck Generator so the agent can demonstrate the workflow against realistic transactional volume without simulating a production warehouse.",
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
      id: "board-deck-generator-controls-playbook",
      sourceSystemId: "bigquery",
      type: "policy",
      title: "Board Deck Generator Controls Playbook",
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
      id: "google_slides_generate_api",
      sourceSystemId: "google_slides",
      method: "POST",
      path: "/api/google_slides/generate",
      description: "Synchronous endpoint the agent calls to generate in Google Slides after evidence gating.",
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
      id: "board-deck-generator-baseline-gap",
      description: "Seed a realistic gap where Deck preparation time sits between 3-5 days and 4 hours, so the agent can detect, narrate, and recommend remediation.",
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
      expectedRecommendation: "Explain the gap, cite supporting evidence, and propose the next CFO action.",
    },
  ],
  datastorePackaging: {
    alloydb: {
      database: "board_deck_generator",
      schemas: [
        "google_slides",
      ],
    },
    bigquery: {
      dataset: "finance_board_deck_generator",
      tables: [
        "kpi_summary",
        "evidence_index",
      ],
    },
    cloudStorage: {
      bucketSuffix: "board-deck-generator-evidence",
      prefixes: [
        "documents",
        "audit-trails",
        "exports",
      ],
    },
    apis: {
      serviceName: "board-deck-generator-source-adapters",
      deploymentTarget: "cloud_run",
    },
  },
  validation: {
    smokePrompt: "Run the Board Deck Generator workflow and cite source-system evidence for every claim.",
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

export const BoardDeckGenerator = () => (
  <UseCaseSlide
    title="Board Deck Generator"
    subtitle="A-2008 • FP&A"
    icon={Presentation}
    domainId="domain-20"
    layer="Layer 3: Custom ADK"
    persona="CFO"
    systems={["BigQuery", "Looker", "Google Slides", "Vertex AI"]}
    kpis={[
      { label: "Deck preparation time", before: "3-5 days", after: "4 hours" },
      { label: "Data sources integrated", before: "5-6 manual", after: "15+ automated" },
      { label: "Narrative quality", before: "Copy-paste charts", after: "Audience-tailored" },
    ]}
    triggerType="scheduled"
    swimlane={swimlane}
    flow={flow}
    architecture={architecture}
    hitl={{ actor: "CFO", action: "Review board deck", description: "CFO reviews assembled board deck, validates management discussion narrative, and approves for board distribution." }}
    statusQuo={[
      "Board decks assembled manually by copying charts from Looker into Google Slides over 3-5 days.",
      "Management discussion narratives written from scratch each quarter with inconsistent framing.",
      "Same data presented identically to audit committee and full board despite different priorities."
    ]}
    agentification={[
      "Automated KPI aggregation and chart assembly from 15+ data sources into slide templates.",
      "Gemini generates management discussion narratives tailored to each audience — risk vs. strategy focus.",
      "Board deck assembled in hours instead of days with consistent narrative quality."
    ]}
  />
);
