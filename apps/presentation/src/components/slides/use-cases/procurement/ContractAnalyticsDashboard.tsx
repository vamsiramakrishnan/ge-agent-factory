import React from "react";
import { UseCaseSlide } from "../../../agent/UseCaseSlide";
import { FlowStep } from "../../../agent/ProcessFlow";
import { SwimlaneFlow } from "../../../agent/SwimlaneFlow";
import { AgentArchitecture, UseCaseGenerationSpec, AgentBehaviorContract} from "../../../../types/architecture";
import { BarChart3, Database, TrendingUp, MessageSquare, FileOutput } from "lucide-react";

const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "s1", label: "Weekly Refresh", lane: "system", type: "trigger" },
    { id: "a1", label: "Metadata Extract", lane: "agent", type: "action" },
    { id: "a2", label: "Trend Analysis", lane: "agent", type: "action" },
    { id: "a3", label: "Narrative Generation", lane: "agent", type: "action" },
    { id: "a4", label: "Dashboard Published", lane: "agent", type: "output" },
  ],
  connections: [["s1", "a1"], ["a1", "a2"], ["a2", "a3"], ["a3", "a4"]],
};

const flow: FlowStep[] = [
  { label: "Data Extract", icon: Database, description: "Contract metadata extracted from CLM — cycle times, deviation rates, clause types, expiry dates.", trigger: "Scheduled", systems: ["Icertis"] },
  { label: "Trend Analysis", icon: TrendingUp, description: "Statistical analysis on cycle times, compliance scores, negotiation success rates, and expiry risk heat maps.", systems: ["BigQuery", "Looker"] },
  { label: "Narrative Commentary", icon: MessageSquare, description: "LLM generates explanatory commentary — why cycle times changed, pattern identification in negotiation outcomes.", systems: ["Vertex AI"], integration: "ADK" },
  { label: "Dashboard Delivery", icon: FileOutput, description: "Looker dashboards refreshed with AI-generated narrative insights distributed to stakeholders.", output: "Analytics Dashboard" },
];

const architecture: AgentArchitecture = {
  connections: [
    { system: "Icertis Analytics", description: "Contract metadata — cycle times, clause types, deviation rates, expiry dates", direction: "read", protocol: "REST API", category: "clm" },
    { system: "BigQuery", description: "Aggregated contract analytics, trend calculations, negotiation outcome data", direction: "bidirectional", protocol: "BigQuery SQL", category: "analytics" },
    { system: "Looker", description: "Dashboard visualization, expiry risk heat maps, stakeholder distribution", direction: "write", protocol: "Looker API", category: "analytics" },
    { system: "Vertex AI (Gemini)", description: "Narrative commentary generation, pattern identification in negotiation outcomes", direction: "bidirectional", protocol: "gRPC", category: "ai" },
  ],
  pipeline: [
    { label: "Metadata Extraction", description: "Extract contract metadata from CLM — cycle times (request-to-signature), deviation rates by clause type, compliance scores, expiry dates. Aggregate in BigQuery dimensional model for trend analysis.", systems: ["Icertis Analytics", "BigQuery"], layer: "integration", dataIn: "CLM contract metadata", dataOut: "Aggregated contract analytics in BigQuery" },
    { label: "Trend & Pattern Analysis", description: "Statistical trend analysis on cycle times, compliance score distributions, and clause negotiation success rates. Build expiry risk heat maps. Detect anomalies in cycle time patterns and deviation rate shifts.", systems: ["BigQuery", "Looker"], layer: "ml", dataIn: "Aggregated contract analytics", dataOut: "Trend visualizations + anomaly alerts + heat maps" },
    { label: "Narrative Commentary", description: "Gemini generates explanatory commentary for dashboard insights: 'Cycle time increased 40% driven by 3 board-approval deals, not systemic slowdown.' Identifies patterns in negotiation outcomes: 'Suppliers consistently push back on IP ownership in professional services — pre-negotiate standard IP framework.'", systems: ["Vertex AI (Gemini)"], layer: "llm", dataIn: "Trend data + anomaly alerts + negotiation outcomes", dataOut: "AI-generated narrative insights for dashboards" },
  ],
};


const behaviorContract: AgentBehaviorContract = {
  role: "Contract Manager agent for the Contract Analytics Dashboard workflow",
  primaryObjective: "Gemini generates narrative commentary: 'Cycle time increased 40% driven by 3 board-approval deals, not systemic slowdown — excluding outliers, improved 5%.' LLM identifies negotiation patterns: 'Suppliers consistently push back on IP ownership in professional services — pre-negotiate standard IP framework.' so the Contract Manager can move the Reporting cycle KPI.",
  inScope: [
    "Gemini generates narrative commentary: 'Cycle time increased 40% driven by 3 board-approval deals, not systemic slowdown — excluding outliers, improved 5%.'",
    "LLM identifies negotiation patterns: 'Suppliers consistently push back on IP ownership in professional services — pre-negotiate standard IP framework.'",
    "Automated weekly dashboards with trend analysis, expiry risk heat maps, and clause-level negotiation success rates in Looker",
  ],
  outOfScope: [
    "Contract execution without legal review",
    "Supplier disqualification decisions (category lead retains authority)",
    "Single-source justification overrides above policy threshold",
  ],
  toolIntents: [
    {
      name: "query_icertis_analytics_contracts",
      kind: "query",
      sourceSystemId: "icertis_analytics",
      description: "Retrieve contracts from Icertis Analytics for the Contract Analytics Dashboard workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "contracts_records",
        "contracts_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_bigquery_analytics_events",
      kind: "query",
      sourceSystemId: "bigquery",
      description: "Retrieve analytics events from BigQuery for the Contract Analytics Dashboard workflow.",
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
      description: "Retrieve dashboards from Looker for the Contract Analytics Dashboard workflow.",
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
      name: "lookup_contract_analytics_dashboard_policy_guide",
      kind: "evidence_lookup",
      sourceSystemId: "bigquery",
      description: "Look up sections of the Contract Analytics Dashboard Procurement Policy Guide to cite in narrative output, escalation rationale, and audit evidence.",
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
      name: "action_icertis_analytics_generate",
      kind: "action",
      sourceSystemId: "icertis_analytics",
      description: "Execute the generate step in Icertis Analytics after the agent has gathered evidence and validated escalation gates.",
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
      claim: "Reporting cycle moved from Monthly manual toward Weekly automated",
      mustCite: [
        "icertis_analytics.contracts",
        "bigquery.analytics_events",
      ],
      sourceSystemIds: [
        "icertis_analytics",
        "bigquery",
      ],
    },
    {
      claim: "Insight depth moved from Raw metrics only toward Narrative + root cause",
      mustCite: [
        "icertis_analytics.contracts",
        "bigquery.analytics_events",
      ],
      sourceSystemIds: [
        "icertis_analytics",
        "bigquery",
      ],
    },
  ],
  escalationRules: [
    {
      trigger: "Reporting cycle regresses past the Monthly manual baseline by more than 20%",
      action: "escalate_to_human",
      handoffTarget: "Contract Manager",
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
    "Never fabricate metric values; only publish numbers derived from Icertis Analytics (and other named systems) entities.",
    "Never bypass Contract Manager approval on escalation triggers, even when confidence is high.",
    "Never expose individual personal data (PII) in summaries; aggregate or pseudonymise before output.",
    "Never act on data older than the staleness threshold defined in the runbook without a fresh re-query.",
  ],
  goldenEvals: [
    {
      id: "contract-analytics-dashboard-end-to-end",
      prompt: "Run the Contract Analytics Dashboard workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.",
      expectedToolCalls: [
        "query_icertis_analytics_contracts",
        "query_bigquery_analytics_events",
        "query_looker_dashboards",
        "lookup_contract_analytics_dashboard_policy_guide",
        "action_icertis_analytics_generate",
      ],
      mustReferenceEntities: [
        "contracts",
        "analytics_events",
        "dashboards",
      ],
      mustCiteDocuments: [
        "contract-analytics-dashboard-policy-guide",
      ],
      expectedActionOutcome: "Action generate executed against Icertis Analytics, with audit-trail entry and Contract Manager notified of outcomes.",
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
    rationale: "Row counts sized for Contract Analytics Dashboard so the agent can demonstrate the workflow against realistic transactional volume without simulating a production warehouse.",
  },
  sourceSystems: [
    {
      id: "icertis_analytics",
      name: "Icertis Analytics",
      owns: [
        "contracts",
        "amendments",
        "obligations",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_icertis_analytics_contracts",
        "query_icertis_analytics_amendments",
        "query_icertis_analytics_obligations",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
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
  ],
  entities: [
    {
      name: "contracts",
      sourceSystemId: "icertis_analytics",
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
          name: "counterparty",
          type: "company.name",
          required: true,
        },
        {
          name: "value",
          type: "number",
          min: 10000,
          max: 5000000,
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
          name: "start_date",
          type: "date",
          required: true,
        },
        {
          name: "end_date",
          type: "date",
          required: true,
        },
        {
          name: "status",
          type: "enum",
          values: [
            "draft",
            "negotiating",
            "active",
            "expired",
            "terminated",
          ],
          required: true,
        },
        {
          name: "auto_renew",
          type: "boolean",
          trueRate: 0.4,
        },
      ],
    },
    {
      name: "amendments",
      sourceSystemId: "icertis_analytics",
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
          name: "counterparty",
          type: "company.name",
          required: true,
        },
        {
          name: "value",
          type: "number",
          min: 10000,
          max: 5000000,
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
          name: "start_date",
          type: "date",
          required: true,
        },
        {
          name: "end_date",
          type: "date",
          required: true,
        },
        {
          name: "status",
          type: "enum",
          values: [
            "draft",
            "negotiating",
            "active",
            "expired",
            "terminated",
          ],
          required: true,
        },
        {
          name: "auto_renew",
          type: "boolean",
          trueRate: 0.4,
        },
      ],
    },
    {
      name: "obligations",
      sourceSystemId: "icertis_analytics",
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
          name: "counterparty",
          type: "company.name",
          required: true,
        },
        {
          name: "value",
          type: "number",
          min: 10000,
          max: 5000000,
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
          name: "start_date",
          type: "date",
          required: true,
        },
        {
          name: "end_date",
          type: "date",
          required: true,
        },
        {
          name: "status",
          type: "enum",
          values: [
            "draft",
            "negotiating",
            "active",
            "expired",
            "terminated",
          ],
          required: true,
        },
        {
          name: "auto_renew",
          type: "boolean",
          trueRate: 0.4,
        },
      ],
    },
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
      id: "contract-analytics-dashboard-policy-guide",
      sourceSystemId: "bigquery",
      type: "policy",
      title: "Contract Analytics Dashboard Procurement Policy Guide",
      requiredSections: [
        "Sourcing principles",
        "Approval thresholds",
        "Supplier risk requirements",
        "Contract and compliance gates",
        "Exception handling",
      ],
      linkedEntities: [
        "contracts",
        "amendments",
        "obligations",
      ],
      minimumWordCount: 500,
      citationAnchors: [
        "sourcing",
        "approvals",
        "supplier-risk",
        "exceptions",
      ],
    },
  ],
  apis: [
    {
      id: "icertis_analytics_generate_api",
      sourceSystemId: "icertis_analytics",
      method: "POST",
      path: "/api/icertis_analytics/generate",
      description: "Synchronous endpoint the agent calls to generate in Icertis Analytics after evidence gating.",
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
      id: "contract-analytics-dashboard-baseline-gap",
      description: "Seed a realistic gap where Reporting cycle sits between Monthly manual and Weekly automated, so the agent can detect, narrate, and recommend remediation.",
      affectedEntities: [
        "contracts",
        "amendments",
      ],
      discoveryPath: [
        "Inspect Icertis Analytics records for the affected entities",
        "Compare against BigQuery historical baseline",
        "Generate a citation-backed recommendation",
      ],
      expectedEvidence: [
        "source-system record",
        "historical baseline metric",
        "generated audit trail",
      ],
      expectedRecommendation: "Explain the gap, cite supporting evidence, and propose the next Contract Manager action.",
    },
  ],
  datastorePackaging: {
    alloydb: {
      database: "contract_analytics_dashboard",
      schemas: [
        "icertis_analytics",
      ],
    },
    bigquery: {
      dataset: "procurement_contract_analytics_dashboard",
      tables: [
        "kpi_summary",
        "evidence_index",
      ],
    },
    cloudStorage: {
      bucketSuffix: "contract-analytics-dashboard-evidence",
      prefixes: [
        "documents",
        "audit-trails",
        "exports",
      ],
    },
    apis: {
      serviceName: "contract-analytics-dashboard-source-adapters",
      deploymentTarget: "cloud_run",
    },
  },
  validation: {
    smokePrompt: "Run the Contract Analytics Dashboard workflow and cite source-system evidence for every claim.",
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

export const ContractAnalyticsDashboard = () => (
  <UseCaseSlide
    title="Contract Analytics Dashboard"
    subtitle="A-1408 • Contract Lifecycle"
    icon={BarChart3}
    domainId="domain-14"
    layer="Layer 4: Full Orchestration"
    persona="Contract Manager"
    systems={["Icertis Analytics", "BigQuery", "Looker"]}
    kpis={[
      { label: "Reporting cycle", before: "Monthly manual", after: "Weekly automated" },
      { label: "Insight depth", before: "Raw metrics only", after: "Narrative + root cause" },
      { label: "Negotiation pattern visibility", before: "None", after: "Clause-level trends" },
    ]}
    triggerType="scheduled"
    swimlane={swimlane}
    flow={flow}
    architecture={architecture}
    statusQuo={[
      "Contract metrics compiled manually in monthly reports — cycle time, deviation rates, and compliance scores in static spreadsheets.",
      "No explanation for metric changes — stakeholders see that cycle time increased 40% but not why.",
      "Negotiation outcome patterns invisible — teams repeat the same concessions without learning from past deals."
    ]}
    agentification={[
      "Gemini generates narrative commentary: 'Cycle time increased 40% driven by 3 board-approval deals, not systemic slowdown — excluding outliers, improved 5%.'",
      "LLM identifies negotiation patterns: 'Suppliers consistently push back on IP ownership in professional services — pre-negotiate standard IP framework.'",
      "Automated weekly dashboards with trend analysis, expiry risk heat maps, and clause-level negotiation success rates in Looker."
    ]}
  />
);
