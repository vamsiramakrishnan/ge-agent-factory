import React from "react";
import { UseCaseSlide } from "../../../agent/UseCaseSlide";
import { FlowStep } from "../../../agent/ProcessFlow";
import { SwimlaneFlow } from "../../../agent/SwimlaneFlow";
import { AgentArchitecture, UseCaseGenerationSpec, AgentBehaviorContract} from "../../../../types/architecture";
import { PieChart, Database, AlertTriangle, Brain, BarChart3 } from "lucide-react";

const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "s1", label: "Weekly Refresh", lane: "system", type: "trigger" },
    { id: "a1", label: "ETL & Aggregation", lane: "agent", type: "action" },
    { id: "a2", label: "Anomaly Detection", lane: "agent", type: "action" },
    { id: "a3", label: "Commentary Gen", lane: "agent", type: "action" },
    { id: "s2", label: "Dashboard + Alerts", lane: "system", type: "output" },
  ],
  connections: [["s1", "a1"], ["a1", "a2"], ["a2", "a3"], ["a3", "s2"]],
};

const flow: FlowStep[] = [
  { label: "Data Refresh", icon: Database, description: "Scheduled ETL from sourcing and ERP systems into BigQuery spend cube, Looker dashboard refresh triggered.", trigger: "Weekly", systems: ["Coupa", "SAP Ariba"] },
  { label: "Anomaly Detection", icon: AlertTriangle, description: "Spend pattern anomalies identified — unexpected vendor, unusual amount, new category activity, contract coverage gaps.", systems: ["BigQuery"], integration: "API" },
  { label: "LLM Commentary", icon: Brain, description: "Gemini cross-references anomalies with project data and seasonal patterns to generate plain-English explanations.", systems: ["Vertex AI"] },
  { label: "Dashboard Delivery", icon: BarChart3, description: "Interactive dashboard with narrative commentary sections and threshold-based alerts distributed to category teams.", output: "Category Dashboard" },
];

const architecture: AgentArchitecture = {
  connections: [
    { system: "Coupa Analytics", description: "Procurement transaction data and contract coverage metrics", direction: "read", protocol: "REST API", category: "erp" },
    { system: "SAP Ariba Analytics", description: "Sourcing event data and supplier performance indicators", direction: "read", protocol: "REST API", category: "erp" },
    { system: "BigQuery", description: "Spend cube, anomaly detection models, and trend analytics", direction: "bidirectional", protocol: "BigQuery SQL", category: "analytics" },
    { system: "Looker", description: "Interactive dashboard rendering with narrative commentary sections", direction: "write", protocol: "Looker API", category: "analytics" },
    { system: "Vertex AI (Gemini)", description: "Anomaly explanation, root cause reasoning, and dashboard commentary generation", direction: "bidirectional", protocol: "gRPC", category: "ai" },
  ],
  pipeline: [
    { label: "ETL & Aggregation", description: "Scheduled ETL from Coupa and Ariba analytics into BigQuery spend cube. Refresh dimensional model with latest PO, invoice, and contract coverage data.", systems: ["Coupa Analytics", "SAP Ariba Analytics", "BigQuery"], layer: "integration", dataIn: "Raw transaction data from sourcing and ERP systems", dataOut: "Refreshed spend cube with current-week data" },
    { label: "Anomaly Detection & Trending", description: "Statistical anomaly detection on spend patterns — unexpected vendor, unusual amount, new category activity. Trend decomposition and Pareto analysis. Contract coverage heat map generation.", systems: ["BigQuery ML"], layer: "ml", dataIn: "Refreshed spend cube", dataOut: "Flagged anomalies with statistical confidence scores" },
    { label: "Commentary Generation", description: "Gemini cross-references detected anomalies with project data, seasonal patterns, and recent contract changes. Generates plain-English commentary: 'IT hardware up 35% QoQ — driven by data center refresh, not organic growth.'", systems: ["Vertex AI (Gemini)"], layer: "llm", dataIn: "Anomalies + project data + contract changes", dataOut: "Dashboard sections with narrative commentary" },
    { label: "Dashboard Delivery", description: "Formatted dashboard with narrative commentary sections published to Looker. Threshold-based alerts distributed to category teams via email and Slack.", systems: ["Looker", "Email"], layer: "integration", dataIn: "Scored anomalies with commentary", dataOut: "Interactive dashboard with alerts distributed" },
  ],
};


const behaviorContract: AgentBehaviorContract = {
  role: "Category Manager agent for the Category Spend Dashboard workflow",
  primaryObjective: "Gemini generates plain-English commentary per dashboard section: 'IT hardware up 35% QoQ — driven by data center refresh, not organic growth. Normalizes in Q3.' LLM cross-references spend anomalies with project approvals, seasonal patterns, and contract changes to explain the why, not just the what. so the Category Manager can move the Dashboard refresh lag KPI.",
  inScope: [
    "Gemini generates plain-English commentary per dashboard section: 'IT hardware up 35% QoQ — driven by data center refresh, not organic growth. Normalizes in Q3.'",
    "LLM cross-references spend anomalies with project approvals, seasonal patterns, and contract changes to explain the why, not just the what",
    "Automated weekly refresh means category teams start Monday with current data and actionable insights, not stale reports",
  ],
  outOfScope: [
    "Contract execution without legal review",
    "Supplier disqualification decisions (category lead retains authority)",
    "Single-source justification overrides above policy threshold",
  ],
  toolIntents: [
    {
      name: "query_coupa_analytics_requisitions",
      kind: "query",
      sourceSystemId: "coupa_analytics",
      description: "Retrieve requisitions from Coupa Analytics for the Category Spend Dashboard workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "requisitions_records",
        "requisitions_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_sap_ariba_analytics_suppliers",
      kind: "query",
      sourceSystemId: "sap_ariba_analytics",
      description: "Retrieve suppliers from SAP Ariba Analytics for the Category Spend Dashboard workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "suppliers_records",
        "suppliers_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_bigquery_analytics_events",
      kind: "query",
      sourceSystemId: "bigquery",
      description: "Retrieve analytics events from BigQuery for the Category Spend Dashboard workflow.",
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
      description: "Retrieve dashboards from Looker for the Category Spend Dashboard workflow.",
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
      name: "lookup_category_spend_dashboard_policy_guide",
      kind: "evidence_lookup",
      sourceSystemId: "bigquery",
      description: "Look up sections of the Category Spend Dashboard Procurement Policy Guide to cite in narrative output, escalation rationale, and audit evidence.",
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
      name: "action_coupa_analytics_generate",
      kind: "action",
      sourceSystemId: "coupa_analytics",
      description: "Execute the generate step in Coupa Analytics after the agent has gathered evidence and validated escalation gates.",
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
      claim: "Dashboard refresh lag moved from Manual monthly toward Automated weekly",
      mustCite: [
        "coupa_analytics.requisitions",
        "sap_ariba_analytics.suppliers",
      ],
      sourceSystemIds: [
        "coupa_analytics",
        "sap_ariba_analytics",
      ],
    },
    {
      claim: "Anomalies explained moved from 0% auto-explained toward 85% with root cause",
      mustCite: [
        "coupa_analytics.requisitions",
        "sap_ariba_analytics.suppliers",
      ],
      sourceSystemIds: [
        "coupa_analytics",
        "sap_ariba_analytics",
      ],
    },
  ],
  escalationRules: [
    {
      trigger: "Dashboard refresh lag regresses past the Manual monthly baseline by more than 20%",
      action: "escalate_to_human",
      handoffTarget: "Category Manager",
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
    "Never fabricate metric values; only publish numbers derived from Coupa Analytics (and other named systems) entities.",
    "Never bypass Category Manager approval on escalation triggers, even when confidence is high.",
    "Never expose individual personal data (PII) in summaries; aggregate or pseudonymise before output.",
    "Never act on data older than the staleness threshold defined in the runbook without a fresh re-query.",
  ],
  goldenEvals: [
    {
      id: "category-spend-dashboard-end-to-end",
      prompt: "Run the Category Spend Dashboard workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.",
      expectedToolCalls: [
        "query_coupa_analytics_requisitions",
        "query_sap_ariba_analytics_suppliers",
        "query_bigquery_analytics_events",
        "query_looker_dashboards",
        "lookup_category_spend_dashboard_policy_guide",
        "action_coupa_analytics_generate",
      ],
      mustReferenceEntities: [
        "requisitions",
        "suppliers",
        "analytics_events",
        "dashboards",
      ],
      mustCiteDocuments: [
        "category-spend-dashboard-policy-guide",
      ],
      expectedActionOutcome: "Action generate executed against Coupa Analytics, with audit-trail entry and Category Manager notified of outcomes.",
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
    rationale: "Row counts sized for Category Spend Dashboard so the agent can demonstrate the workflow against realistic transactional volume without simulating a production warehouse.",
  },
  sourceSystems: [
    {
      id: "coupa_analytics",
      name: "Coupa Analytics",
      owns: [
        "requisitions",
        "purchase_orders",
        "invoices",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_coupa_analytics_requisitions",
        "query_coupa_analytics_purchase_orders",
        "query_coupa_analytics_invoices",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
    {
      id: "sap_ariba_analytics",
      name: "SAP Ariba Analytics",
      owns: [
        "suppliers",
        "sourcing_events",
        "contracts",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_sap_ariba_analytics_suppliers",
        "query_sap_ariba_analytics_sourcing_events",
        "query_sap_ariba_analytics_contracts",
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
      name: "requisitions",
      sourceSystemId: "coupa_analytics",
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
          name: "vendor",
          type: "company.name",
          required: true,
        },
        {
          name: "amount",
          type: "float",
          min: 100,
          max: 100000,
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
            "JPY",
          ],
          weights: [
            0.7,
            0.15,
            0.1,
            0.05,
          ],
          required: true,
        },
        {
          name: "status",
          type: "enum",
          values: [
            "draft",
            "pending",
            "approved",
            "paid",
            "rejected",
          ],
          weights: [
            0.1,
            0.3,
            0.3,
            0.2,
            0.1,
          ],
          required: true,
        },
        {
          name: "created_at",
          type: "date",
          required: true,
        },
        {
          name: "due_date",
          type: "date",
          required: true,
        },
      ],
    },
    {
      name: "purchase_orders",
      sourceSystemId: "coupa_analytics",
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
          name: "vendor",
          type: "company.name",
          required: true,
        },
        {
          name: "amount",
          type: "float",
          min: 100,
          max: 100000,
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
            "JPY",
          ],
          weights: [
            0.7,
            0.15,
            0.1,
            0.05,
          ],
          required: true,
        },
        {
          name: "status",
          type: "enum",
          values: [
            "draft",
            "pending",
            "approved",
            "paid",
            "rejected",
          ],
          weights: [
            0.1,
            0.3,
            0.3,
            0.2,
            0.1,
          ],
          required: true,
        },
        {
          name: "created_at",
          type: "date",
          required: true,
        },
        {
          name: "due_date",
          type: "date",
          required: true,
        },
      ],
    },
    {
      name: "invoices",
      sourceSystemId: "coupa_analytics",
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
          name: "vendor",
          type: "company.name",
          required: true,
        },
        {
          name: "amount",
          type: "float",
          min: 100,
          max: 100000,
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
            "JPY",
          ],
          weights: [
            0.7,
            0.15,
            0.1,
            0.05,
          ],
          required: true,
        },
        {
          name: "status",
          type: "enum",
          values: [
            "draft",
            "pending",
            "approved",
            "paid",
            "rejected",
          ],
          weights: [
            0.1,
            0.3,
            0.3,
            0.2,
            0.1,
          ],
          required: true,
        },
        {
          name: "created_at",
          type: "date",
          required: true,
        },
        {
          name: "due_date",
          type: "date",
          required: true,
        },
      ],
    },
    {
      name: "suppliers",
      sourceSystemId: "sap_ariba_analytics",
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
          name: "name",
          type: "company.name",
          required: true,
        },
        {
          name: "category",
          type: "enum",
          values: [
            "IT",
            "Consulting",
            "Manufacturing",
            "Logistics",
            "Facilities",
            "Marketing",
          ],
          required: true,
        },
        {
          name: "rating",
          type: "number",
          min: 1,
          max: 5,
          required: true,
        },
        {
          name: "annual_spend",
          type: "number",
          min: 10000,
          max: 5000000,
          required: true,
        },
        {
          name: "risk_score",
          type: "enum",
          values: [
            "low",
            "medium",
            "high",
          ],
          weights: [
            0.5,
            0.35,
            0.15,
          ],
          required: true,
        },
        {
          name: "status",
          type: "enum",
          values: [
            "active",
            "pending_review",
            "terminated",
          ],
          required: true,
        },
        {
          name: "onboarded_on",
          type: "date",
          required: true,
        },
      ],
    },
    {
      name: "sourcing_events",
      sourceSystemId: "sap_ariba_analytics",
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
        {
          name: "supplier_id",
          type: "ref",
          ref: "suppliers.id",
          required: true,
        },
      ],
    },
    {
      name: "contracts",
      sourceSystemId: "sap_ariba_analytics",
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
      from: "sourcing_events.supplier_id",
      to: "suppliers.id",
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
      id: "category-spend-dashboard-policy-guide",
      sourceSystemId: "bigquery",
      type: "policy",
      title: "Category Spend Dashboard Procurement Policy Guide",
      requiredSections: [
        "Sourcing principles",
        "Approval thresholds",
        "Supplier risk requirements",
        "Contract and compliance gates",
        "Exception handling",
      ],
      linkedEntities: [
        "requisitions",
        "purchase_orders",
        "invoices",
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
      id: "coupa_analytics_generate_api",
      sourceSystemId: "coupa_analytics",
      method: "POST",
      path: "/api/coupa_analytics/generate",
      description: "Synchronous endpoint the agent calls to generate in Coupa Analytics after evidence gating.",
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
      id: "category-spend-dashboard-baseline-gap",
      description: "Seed a realistic gap where Dashboard refresh lag sits between Manual monthly and Automated weekly, so the agent can detect, narrate, and recommend remediation.",
      affectedEntities: [
        "requisitions",
        "purchase_orders",
      ],
      discoveryPath: [
        "Inspect Coupa Analytics records for the affected entities",
        "Compare against SAP Ariba Analytics historical baseline",
        "Generate a citation-backed recommendation",
      ],
      expectedEvidence: [
        "source-system record",
        "historical baseline metric",
        "generated audit trail",
      ],
      expectedRecommendation: "Explain the gap, cite supporting evidence, and propose the next Category Manager action.",
    },
  ],
  datastorePackaging: {
    alloydb: {
      database: "category_spend_dashboard",
      schemas: [
        "coupa_analytics",
        "sap_ariba_analytics",
      ],
    },
    bigquery: {
      dataset: "procurement_category_spend_dashboard",
      tables: [
        "kpi_summary",
        "evidence_index",
      ],
    },
    cloudStorage: {
      bucketSuffix: "category-spend-dashboard-evidence",
      prefixes: [
        "documents",
        "audit-trails",
        "exports",
      ],
    },
    apis: {
      serviceName: "category-spend-dashboard-source-adapters",
      deploymentTarget: "cloud_run",
    },
  },
  validation: {
    smokePrompt: "Run the Category Spend Dashboard workflow and cite source-system evidence for every claim.",
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

export const CategorySpendDashboard = () => (
  <UseCaseSlide
    title="Category Spend Dashboard"
    subtitle="A-1208 • Strategic Sourcing"
    icon={PieChart}
    domainId="domain-12"
    layer="Layer 4: Data Agent"
    persona="Category Manager"
    systems={["Coupa Analytics", "SAP Ariba Analytics", "BigQuery", "Looker"]}
    kpis={[
      { label: "Dashboard refresh lag", before: "Manual monthly", after: "Automated weekly" },
      { label: "Anomalies explained", before: "0% auto-explained", after: "85% with root cause" },
      { label: "Time to insight", before: "Half-day of SQL", after: "Open and read" },
    ]}
    triggerType="scheduled"
    swimlane={swimlane}
    flow={flow}
    architecture={architecture}
    statusQuo={[
      "Category managers build spend dashboards manually in Excel, pulling data from Ariba, Coupa, and ERP each month.",
      "When anomalies appear — a 40% spike in a category — the team spends days investigating root cause across systems.",
      "Dashboard commentary is written manually for monthly business reviews, consuming a full day of analyst time."
    ]}
    agentification={[
      "Gemini generates plain-English commentary per dashboard section: 'IT hardware up 35% QoQ — driven by data center refresh, not organic growth. Normalizes in Q3.'",
      "LLM cross-references spend anomalies with project approvals, seasonal patterns, and contract changes to explain the why, not just the what.",
      "Automated weekly refresh means category teams start Monday with current data and actionable insights, not stale reports."
    ]}
  />
);
