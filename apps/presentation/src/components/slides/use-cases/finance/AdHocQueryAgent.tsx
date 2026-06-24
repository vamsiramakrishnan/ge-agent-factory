import React from "react";
import { UseCaseSlide } from "../../../agent/UseCaseSlide";
import { FlowStep } from "../../../agent/ProcessFlow";
import { SwimlaneFlow } from "../../../agent/SwimlaneFlow";
import { AgentArchitecture, UseCaseGenerationSpec, AgentBehaviorContract} from "../../../../types/architecture";
import { MessageSquare, Database, Search, CheckCircle, Zap } from "lucide-react";

const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "s1", label: "User Question", lane: "human", type: "trigger" },
    { id: "a1", label: "Query Translation", lane: "agent", type: "action" },
    { id: "a2", label: "Context Assembly", lane: "agent", type: "action" },
    { id: "a3", label: "Answer + Context", lane: "agent", type: "output" },
    { id: "h1", label: "User Acts on Insight", lane: "human", type: "hitl" },
  ],
  connections: [["s1", "a1"], ["a1", "a2"], ["a2", "a3"], ["a3", "h1"]],
};

const flow: FlowStep[] = [
  { label: "Question Intake", icon: MessageSquare, description: "Receive natural language finance question via chat interface.", trigger: "Chat", systems: ["Vertex AI"] },
  { label: "NL-to-SQL", icon: Search, description: "Translate ambiguous request into precise SQL query against appropriate data source.", systems: ["BigQuery", "SAP S/4HANA"], integration: "ADK" },
  { label: "Contextual Response", icon: Zap, description: "Return results with business context: not just numbers, but explanations and recommended next steps.", systems: ["Vertex AI"] },
  { label: "User Action", icon: CheckCircle, description: "User reviews the answer and acts on the insight or asks follow-up questions.", output: "Contextual Answer" },
];

const architecture: AgentArchitecture = {
  connections: [
    { system: "BigQuery", description: "Financial data warehouse, operational metrics, historical data", direction: "read", protocol: "BigQuery SQL", category: "analytics" },
    { system: "Looker", description: "Semantic model, cached queries, existing dashboard data", direction: "read", protocol: "REST API", category: "analytics" },
    { system: "SAP S/4HANA", description: "Real-time ERP data for transactional queries", direction: "read", protocol: "OData", category: "erp" },
    { system: "Vertex AI (Gemini)", description: "NL-to-SQL translation, result interpretation, contextual responses", direction: "bidirectional", protocol: "gRPC", category: "ai" },
  ],
  pipeline: [
    { label: "Intent Parsing", description: "Gemini interprets ambiguous finance questions: 'how are we tracking against plan?' becomes specific metrics, time period, and granularity. Determines which data source to query.", systems: ["Vertex AI (Gemini)"], layer: "llm", dataIn: "Natural language question", dataOut: "Structured query intent with parameters" },
    { label: "Query Execution", description: "Translate intent into optimized SQL against BigQuery or OData against SAP. Leverage Looker semantic model for consistent metric definitions. Cache results.", systems: ["BigQuery", "Looker", "SAP S/4HANA"], layer: "ml", dataIn: "Query intent", dataOut: "Raw query results" },
    { label: "Contextual Response", description: "Gemini wraps raw results with business context: 'Q2 revenue is $48.2M vs. plan of $50M — the $1.8M shortfall is concentrated in EMEA enterprise, tracking 15% below due to 3 delayed deals.' Suggests follow-up analyses.", systems: ["Vertex AI (Gemini)"], layer: "llm", dataIn: "Query results + business context", dataOut: "Contextual answer with citations" },
    { label: "Learning Loop", description: "Track question patterns and frequently requested analyses. Pre-compute common queries for faster response.", systems: ["BigQuery"], layer: "integration", dataIn: "Query history", dataOut: "Optimized query cache" },
  ],
};


const behaviorContract: AgentBehaviorContract = {
  role: "FP&A Analyst agent for the Ad-Hoc Query Agent workflow",
  primaryObjective: "Natural language interface makes financial data accessible to any business user. Gemini interprets ambiguous questions and returns answers with business context and citations. so the FP&A Analyst can move the Query response time KPI.",
  inScope: [
    "Natural language interface makes financial data accessible to any business user",
    "Gemini interprets ambiguous questions and returns answers with business context and citations",
    "Learning loop pre-computes frequently asked analyses for instant response",
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
      description: "Retrieve analytics events from BigQuery for the Ad-Hoc Query Agent workflow.",
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
      description: "Retrieve dashboards from Looker for the Ad-Hoc Query Agent workflow.",
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
      name: "query_sap_s_4hana_transactions",
      kind: "query",
      sourceSystemId: "sap_s_4hana",
      description: "Retrieve transactions from SAP S/4HANA for the Ad-Hoc Query Agent workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "transactions_records",
        "transactions_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "lookup_ad_hoc_query_agent_controls_playbook",
      kind: "evidence_lookup",
      sourceSystemId: "bigquery",
      description: "Look up sections of the Ad-Hoc Query Agent Controls Playbook to cite in narrative output, escalation rationale, and audit evidence.",
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
      claim: "Query response time moved from Hours-days (manual pull) toward < 30 seconds",
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
      claim: "Data accessibility moved from Requires SQL knowledge toward Natural language",
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
      trigger: "Query response time regresses past the Hours-days (manual pull) baseline by more than 20%",
      action: "escalate_to_human",
      handoffTarget: "FP&A Analyst",
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
    "Never bypass FP&A Analyst approval on escalation triggers, even when confidence is high.",
    "Never expose individual personal data (PII) in summaries; aggregate or pseudonymise before output.",
    "Never act on data older than the staleness threshold defined in the runbook without a fresh re-query.",
  ],
  goldenEvals: [
    {
      id: "ad-hoc-query-agent-end-to-end",
      prompt: "Run the Ad-Hoc Query Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.",
      expectedToolCalls: [
        "query_bigquery_analytics_events",
        "query_looker_dashboards",
        "query_sap_s_4hana_transactions",
        "lookup_ad_hoc_query_agent_controls_playbook",
      ],
      mustReferenceEntities: [
        "analytics_events",
        "dashboards",
        "transactions",
      ],
      mustCiteDocuments: [
        "ad-hoc-query-agent-controls-playbook",
      ],
      expectedActionOutcome: "FP&A Analyst receives a fully-cited recommendation; no external state change without explicit approval.",
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
    rationale: "Row counts sized for Ad-Hoc Query Agent so the agent can demonstrate the workflow against realistic transactional volume without simulating a production warehouse.",
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
      id: "sap_s_4hana",
      name: "SAP S/4HANA",
      owns: [
        "transactions",
        "journal_entries",
        "master_data",
      ],
      protocol: "RFC/BAPI",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_sap_s_4hana_transactions",
        "query_sap_s_4hana_journal_entries",
        "query_sap_s_4hana_master_data",
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
      name: "transactions",
      sourceSystemId: "sap_s_4hana",
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
          name: "posting_date",
          type: "date",
          required: true,
        },
        {
          name: "account",
          type: "enum",
          values: [
            "1000-Cash",
            "2000-AP",
            "2100-AR",
            "3000-Revenue",
            "4000-Expense",
            "5000-COGS",
          ],
          required: true,
        },
        {
          name: "amount",
          type: "float",
          min: -50000,
          max: 50000,
          decimals: 2,
          required: true,
        },
        {
          name: "currency",
          type: "enum",
          values: [
            "USD",
            "EUR",
            "GBP",
          ],
          required: true,
        },
        {
          name: "description",
          type: "lorem.sentence",
          required: true,
        },
        {
          name: "status",
          type: "enum",
          values: [
            "posted",
            "pending",
            "reversed",
          ],
          weights: [
            0.8,
            0.15,
            0.05,
          ],
          required: true,
        },
      ],
    },
    {
      name: "journal_entries",
      sourceSystemId: "sap_s_4hana",
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
          name: "posting_date",
          type: "date",
          required: true,
        },
        {
          name: "account",
          type: "enum",
          values: [
            "1000-Cash",
            "2000-AP",
            "2100-AR",
            "3000-Revenue",
            "4000-Expense",
            "5000-COGS",
          ],
          required: true,
        },
        {
          name: "amount",
          type: "float",
          min: -50000,
          max: 50000,
          decimals: 2,
          required: true,
        },
        {
          name: "currency",
          type: "enum",
          values: [
            "USD",
            "EUR",
            "GBP",
          ],
          required: true,
        },
        {
          name: "description",
          type: "lorem.sentence",
          required: true,
        },
        {
          name: "status",
          type: "enum",
          values: [
            "posted",
            "pending",
            "reversed",
          ],
          weights: [
            0.8,
            0.15,
            0.05,
          ],
          required: true,
        },
      ],
    },
    {
      name: "master_data",
      sourceSystemId: "sap_s_4hana",
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
      id: "ad-hoc-query-agent-controls-playbook",
      sourceSystemId: "bigquery",
      type: "policy",
      title: "Ad-Hoc Query Agent Controls Playbook",
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
      id: "ad-hoc-query-agent-baseline-gap",
      description: "Seed a realistic gap where Query response time sits between Hours-days (manual pull) and < 30 seconds, so the agent can detect, narrate, and recommend remediation.",
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
      expectedRecommendation: "Explain the gap, cite supporting evidence, and propose the next FP&A Analyst action.",
    },
  ],
  datastorePackaging: {
    alloydb: {
      database: "ad_hoc_query_agent",
      schemas: [
        "sap_s_4hana",
      ],
    },
    bigquery: {
      dataset: "finance_ad_hoc_query_agent",
      tables: [
        "kpi_summary",
        "evidence_index",
      ],
    },
    cloudStorage: {
      bucketSuffix: "ad-hoc-query-agent-evidence",
      prefixes: [
        "documents",
        "audit-trails",
        "exports",
      ],
    },
    apis: {
      serviceName: "ad-hoc-query-agent-source-adapters",
      deploymentTarget: "cloud_run",
    },
  },
  validation: {
    smokePrompt: "Run the Ad-Hoc Query Agent workflow and cite source-system evidence for every claim.",
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

export const AdHocQueryAgent = () => (
  <UseCaseSlide
    title="Ad-Hoc Query Agent"
    subtitle="A-2804 • Finance Analytics & Reporting"
    icon={MessageSquare}
    domainId="domain-28"
    layer="Layer 3: Custom ADK"
    persona="FP&A Analyst"
    systems={["BigQuery", "Looker", "SAP S/4HANA", "Vertex AI"]}
    kpis={[
      { label: "Query response time", before: "Hours-days (manual pull)", after: "< 30 seconds" },
      { label: "Data accessibility", before: "Requires SQL knowledge", after: "Natural language" },
      { label: "Context quality", before: "Raw numbers only", after: "Numbers + explanations + next steps" },
    ]}
    triggerType="chat"
    swimlane={swimlane}
    flow={flow}
    architecture={architecture}
    hitl={{ actor: "Finance User", action: "Act on insight", description: "User reviews the contextual answer and either acts on the insight or asks follow-up questions for deeper analysis." }}
    statusQuo={[
      "Ad-hoc finance questions require SQL skills or waiting for an analyst to pull data from SAP.",
      "Results returned as raw numbers without business context or explanation.",
      "Same questions asked repeatedly — no learning or caching across the organization."
    ]}
    agentification={[
      "Natural language interface makes financial data accessible to any business user.",
      "Gemini interprets ambiguous questions and returns answers with business context and citations.",
      "Learning loop pre-computes frequently asked analyses for instant response."
    ]}
  />
);
