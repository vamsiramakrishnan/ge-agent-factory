import React from "react";
import { UseCaseSlide } from "../../../agent/UseCaseSlide";
import { FlowStep } from "../../../agent/ProcessFlow";
import { SwimlaneFlow } from "../../../agent/SwimlaneFlow";
import { AgentArchitecture, UseCaseGenerationSpec, AgentBehaviorContract} from "../../../../types/architecture";
import { MessageCircle, Database, Search, FileText } from "lucide-react";

const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "s1", label: "User Question", lane: "human", type: "trigger" },
    { id: "a1", label: "Query Interpretation", lane: "agent", type: "action" },
    { id: "a2", label: "Data Retrieval", lane: "agent", type: "action" },
    { id: "a3", label: "Contextual Answer", lane: "agent", type: "output" },
  ],
  connections: [["s1", "a1"], ["a1", "a2"], ["a2", "a3"]],
};

const flow: FlowStep[] = [
  { label: "Question Intake", icon: MessageCircle, description: "Interpret ambiguous finance questions and determine metrics, time period, and granularity.", trigger: "Chat", systems: ["Vertex AI"] },
  { label: "Query Execution", icon: Database, description: "Translate to SQL, route to appropriate data source, and execute with result caching.", systems: ["BigQuery", "Looker", "Anaplan"], integration: "ADK" },
  { label: "Context Assembly", icon: Search, description: "Enrich raw results with trend context, comparisons, and relevant benchmarks.", systems: ["BigQuery"] },
  { label: "Answer Delivery", icon: FileText, description: "Deliver contextual answer with citations, not just raw numbers.", output: "Contextual Answer" },
];

const architecture: AgentArchitecture = {
  connections: [
    { system: "BigQuery", description: "Financial data warehouse, historical trends, metric definitions", direction: "read", protocol: "BigQuery SQL", category: "analytics" },
    { system: "Looker", description: "Pre-built dashboards, metric catalog, saved views", direction: "read", protocol: "Looker API", category: "analytics" },
    { system: "Anaplan", description: "Budget and forecast data, planning assumptions", direction: "read", protocol: "REST API", category: "erp" },
    { system: "Vertex AI (Gemini)", description: "NL interpretation, SQL generation, contextual answer generation", direction: "bidirectional", protocol: "gRPC", category: "ai" },
  ],
  pipeline: [
    { label: "Question Interpretation", description: "Gemini interprets ambiguous finance questions and determines which metrics, time period, and granularity the user needs. Maps business language to data model.", systems: ["Vertex AI (Gemini)"], layer: "llm", dataIn: "Natural-language finance question", dataOut: "Structured query intent" },
    { label: "NL-to-SQL Translation", description: "Translate interpreted query intent into optimized SQL against the financial data warehouse. Apply result caching for frequently asked questions.", systems: ["BigQuery", "Looker"], layer: "ml", dataIn: "Structured query intent", dataOut: "Query results with metadata" },
    { label: "Contextual Answer Generation", description: "Gemini enriches raw query results with trend context, budget comparisons, and relevant benchmarks. Provides answers with explanations, not just numbers.", systems: ["Vertex AI (Gemini)"], layer: "llm", dataIn: "Query results + historical context", dataOut: "Contextual answer with citations" },
  ],
};


const behaviorContract: AgentBehaviorContract = {
  role: "FP&A Analyst / Business Partner agent for the FP&A Query Assistant workflow",
  primaryObjective: "Gemini interprets ambiguous questions and auto-determines the right metrics, periods, and granularity. NL-to-SQL translation provides instant answers from the financial data warehouse. so the FP&A Analyst / Business Partner can move the Query response time KPI.",
  inScope: [
    "Gemini interprets ambiguous questions and auto-determines the right metrics, periods, and granularity",
    "NL-to-SQL translation provides instant answers from the financial data warehouse",
    "Delivers contextual answers with trend comparisons and citations, not just raw numbers",
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
      description: "Retrieve analytics events from BigQuery for the FP&A Query Assistant workflow.",
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
      description: "Retrieve dashboards from Looker for the FP&A Query Assistant workflow.",
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
      name: "query_anaplan_budget_lines",
      kind: "query",
      sourceSystemId: "anaplan",
      description: "Retrieve budget lines from Anaplan for the FP&A Query Assistant workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "budget_lines_records",
        "budget_lines_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "lookup_fp_a_query_assistant_controls_playbook",
      kind: "evidence_lookup",
      sourceSystemId: "bigquery",
      description: "Look up sections of the FP&A Query Assistant Controls Playbook to cite in narrative output, escalation rationale, and audit evidence.",
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
  ],
  evidenceRequirements: [
    {
      claim: "Query response time moved from Hours to days toward Seconds",
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
      claim: "Self-service rate moved from 10% (analyst bottleneck) toward 80%+",
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
      trigger: "Query response time regresses past the Hours to days baseline by more than 20%",
      action: "escalate_to_human",
      handoffTarget: "FP&A Analyst / Business Partner",
      rationale: "Significant regressions need human judgment before automated remediation runs against production records.",
    },
    {
      trigger: "Source-system evidence is incomplete or stale (>24h) for any required entity",
      action: "request_more_info",
      rationale: "Recommendations grounded in stale evidence misrepresent current state and undermine audit defensibility.",
    },
  ],
  refusalRules: [
    "Never fabricate metric values; only publish numbers derived from BigQuery (and other named systems) entities.",
    "Never bypass FP&A Analyst / Business Partner approval on escalation triggers, even when confidence is high.",
    "Never expose individual personal data (PII) in summaries; aggregate or pseudonymise before output.",
    "Never act on data older than the staleness threshold defined in the runbook without a fresh re-query.",
  ],
  goldenEvals: [
    {
      id: "fp-a-query-assistant-end-to-end",
      prompt: "Run the FP&A Query Assistant workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.",
      expectedToolCalls: [
        "query_bigquery_analytics_events",
        "query_looker_dashboards",
        "query_anaplan_budget_lines",
        "lookup_fp_a_query_assistant_controls_playbook",
      ],
      mustReferenceEntities: [
        "analytics_events",
        "dashboards",
        "budget_lines",
      ],
      mustCiteDocuments: [
        "fp-a-query-assistant-controls-playbook",
      ],
      expectedActionOutcome: "FP&A Analyst / Business Partner receives a fully-cited recommendation; no external state change without explicit approval.",
      forbiddenBehaviors: [
        "do not invent KPI numbers",
        "do not skip the evidence_lookup step before any recommendation",
        "do not act on single-system evidence",
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
    rationale: "Row counts sized for FP&A Query Assistant so the agent can demonstrate the workflow against realistic transactional volume without simulating a production warehouse.",
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
      id: "anaplan",
      name: "Anaplan",
      owns: [
        "budget_lines",
        "forecast_versions",
        "variance_records",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_anaplan_budget_lines",
        "query_anaplan_forecast_versions",
        "query_anaplan_variance_records",
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
      name: "budget_lines",
      sourceSystemId: "anaplan",
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
          name: "cost_center",
          type: "lorem.words",
          required: true,
        },
        {
          name: "period",
          type: "enum",
          values: [
            "month",
            "quarter",
            "year",
          ],
          required: true,
        },
        {
          name: "budget_amount",
          type: "number",
          min: 10000,
          max: 5000000,
          required: true,
        },
        {
          name: "actual_amount",
          type: "number",
          min: 0,
          max: 6000000,
          required: true,
        },
        {
          name: "variance_pct",
          type: "float",
          min: -100,
          max: 100,
          decimals: 2,
          required: true,
        },
        {
          name: "scenario",
          type: "enum",
          values: [
            "baseline",
            "stretch",
            "downside",
          ],
          required: true,
        },
      ],
    },
    {
      name: "forecast_versions",
      sourceSystemId: "anaplan",
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
          name: "cost_center",
          type: "lorem.words",
          required: true,
        },
        {
          name: "period",
          type: "enum",
          values: [
            "month",
            "quarter",
            "year",
          ],
          required: true,
        },
        {
          name: "budget_amount",
          type: "number",
          min: 10000,
          max: 5000000,
          required: true,
        },
        {
          name: "actual_amount",
          type: "number",
          min: 0,
          max: 6000000,
          required: true,
        },
        {
          name: "variance_pct",
          type: "float",
          min: -100,
          max: 100,
          decimals: 2,
          required: true,
        },
        {
          name: "scenario",
          type: "enum",
          values: [
            "baseline",
            "stretch",
            "downside",
          ],
          required: true,
        },
      ],
    },
    {
      name: "variance_records",
      sourceSystemId: "anaplan",
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
  ],
  relationships: [
    {
      from: "analytics_events.historical_metric_id",
      to: "historical_metrics.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
  ],
  documents: [
    {
      id: "fp-a-query-assistant-controls-playbook",
      sourceSystemId: "bigquery",
      type: "policy",
      title: "FP&A Query Assistant Controls Playbook",
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
  apis: [],
  anomalies: [
    {
      id: "fp-a-query-assistant-baseline-gap",
      description: "Seed a realistic gap where Query response time sits between Hours to days and Seconds, so the agent can detect, narrate, and recommend remediation.",
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
      expectedRecommendation: "Explain the gap, cite supporting evidence, and propose the next FP&A Analyst / Business Partner action.",
    },
  ],
  datastorePackaging: {
    alloydb: {
      database: "fp_a_query_assistant",
      schemas: [
        "anaplan",
      ],
    },
    bigquery: {
      dataset: "finance_fp_a_query_assistant",
      tables: [
        "kpi_summary",
        "evidence_index",
      ],
    },
    cloudStorage: {
      bucketSuffix: "fp-a-query-assistant-evidence",
      prefixes: [
        "documents",
        "audit-trails",
        "exports",
      ],
    },
    apis: {
      serviceName: "fp-a-query-assistant-source-adapters",
      deploymentTarget: "cloud_run",
    },
  },
  validation: {
    smokePrompt: "Run the FP&A Query Assistant workflow and cite source-system evidence for every claim.",
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

export const FPAQueryAssistant = () => (
  <UseCaseSlide
    title="FP&A Query Assistant"
    subtitle="A-2009 • FP&A"
    icon={MessageCircle}
    domainId="domain-20"
    layer="Layer 2: Agent Designer"
    persona="FP&A Analyst / Business Partner"
    systems={["BigQuery", "Looker", "Anaplan", "Vertex AI"]}
    kpis={[
      { label: "Query response time", before: "Hours to days", after: "Seconds" },
      { label: "Self-service rate", before: "10% (analyst bottleneck)", after: "80%+" },
      { label: "Answer quality", before: "Raw data tables", after: "Contextual narrative" },
    ]}
    triggerType="chat"
    swimlane={swimlane}
    flow={flow}
    architecture={architecture}
    statusQuo={[
      "Finance questions require analysts to manually query SAP and build Excel summaries — hours per request.",
      "Ambiguous questions like 'how are we tracking against plan?' require back-and-forth clarification.",
      "Answers delivered as raw data tables without trend context or benchmark comparisons."
    ]}
    agentification={[
      "Gemini interprets ambiguous questions and auto-determines the right metrics, periods, and granularity.",
      "NL-to-SQL translation provides instant answers from the financial data warehouse.",
      "Delivers contextual answers with trend comparisons and citations, not just raw numbers."
    ]}
  />
);
