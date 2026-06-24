import React from "react";
import { UseCaseSlide } from "../../../agent/UseCaseSlide";
import { FlowStep } from "../../../agent/ProcessFlow";
import { SwimlaneFlow } from "../../../agent/SwimlaneFlow";
import { AgentArchitecture, UseCaseGenerationSpec, AgentBehaviorContract} from "../../../../types/architecture";
import { Layers, Database, Globe, FileText, CheckCircle } from "lucide-react";

const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "s1", label: "Quarterly Cycle", lane: "system", type: "trigger" },
    { id: "a1", label: "Spend Analysis", lane: "agent", type: "action" },
    { id: "a2", label: "Market Synthesis", lane: "agent", type: "action" },
    { id: "a3", label: "Strategy Draft", lane: "agent", type: "output" },
    { id: "h1", label: "Director Reviews", lane: "human", type: "hitl" },
  ],
  connections: [["s1", "a1"], ["a1", "a2"], ["a2", "a3"], ["a3", "h1"]],
};

const flow: FlowStep[] = [
  { label: "Spend Ingest", icon: Database, description: "Three years of spend data aggregated from source systems.", trigger: "Quarterly", systems: ["SAP Ariba", "Coupa"] },
  { label: "Market Analysis", icon: Globe, description: "Commodity indices, supplier financials, and risk signals synthesized.", systems: ["Vertex AI", "BigQuery"], integration: "ADK" },
  { label: "Strategy Draft", icon: FileText, description: "Category strategy narrative with savings levers and risk trade-offs generated.", systems: ["Vertex AI"] },
  { label: "Director Approval", icon: CheckCircle, description: "Category Director validates targets and approves for stakeholder distribution.", output: "Category Strategy" },
];

const architecture: AgentArchitecture = {
  connections: [
    { system: "SAP Ariba", description: "Historical category spend, supplier base data", direction: "read", protocol: "REST API", category: "erp" },
    { system: "Coupa", description: "Requisition history, contract coverage rates", direction: "read", protocol: "REST API", category: "erp" },
    { system: "BigQuery", description: "Enriched spend cube, trend analytics, classification", direction: "bidirectional", protocol: "BigQuery SQL", category: "analytics" },
    { system: "Vertex AI (Gemini)", description: "Strategy narrative generation, savings reasoning", direction: "bidirectional", protocol: "gRPC", category: "ai" },
    { system: "S&P Global Platts", description: "Commodity price indices, market trend signals", direction: "read", protocol: "REST API", category: "market-data" },
    { system: "Google Slides", description: "Board-ready strategy presentation output", direction: "write", protocol: "Workspace API", category: "collaboration" },
  ],
  pipeline: [
    { label: "Spend Aggregation", description: "Pull 3 years of category spend from Ariba and Coupa. Enrich with UNSPSC classification and supplier entity resolution from BigQuery spend cube.", systems: ["SAP Ariba", "Coupa", "BigQuery"], layer: "integration", dataIn: "Raw PO/invoice data across systems", dataOut: "Unified spend cube by supplier × category × BU" },
    { label: "Market Intelligence Synthesis", description: "Aggregate commodity price trends, supplier financial signals, and competitive landscape data. Time-series analysis on key indices.", systems: ["S&P Global Platts", "BigQuery ML"], layer: "ml", dataIn: "Commodity feeds + supplier financials", dataOut: "Market context with trend forecasts" },
    { label: "Strategy Narrative Generation", description: "Gemini reasons about which savings levers are realistic given category maturity — consolidation vs. spec change vs. demand management. Drafts strategy document with trade-offs, not just data.", systems: ["Vertex AI (Gemini)"], layer: "llm", dataIn: "Spend cube + market context + supplier scores", dataOut: "Category strategy document with savings targets" },
    { label: "Delivery & Review", description: "Strategy document formatted as board-ready presentation and delivered to Category Director for validation before stakeholder distribution.", systems: ["Google Slides", "Email"], layer: "integration", dataIn: "Approved strategy narrative", dataOut: "Distributed strategy deck" },
  ],
};


const behaviorContract: AgentBehaviorContract = {
  role: "Category Director agent for the Category Strategy Generator workflow",
  primaryObjective: "Gemini synthesizes 3 years of spend, market intel, and supplier performance into coherent strategy narratives. LLM reasons about which savings levers are realistic given category maturity. so the Category Director can move the Strategy creation time KPI.",
  inScope: [
    "Gemini synthesizes 3 years of spend, market intel, and supplier performance into coherent strategy narratives",
    "LLM reasons about which savings levers are realistic given category maturity",
    "Generates board-ready documents with trade-offs, not data dumps",
  ],
  outOfScope: [
    "Contract execution without legal review",
    "Supplier disqualification decisions (category lead retains authority)",
    "Single-source justification overrides above policy threshold",
  ],
  toolIntents: [
    {
      name: "query_sap_ariba_category_mgmt_suppliers",
      kind: "query",
      sourceSystemId: "sap_ariba_category_mgmt",
      description: "Retrieve suppliers from SAP Ariba Category Mgmt for the Category Strategy Generator workflow.",
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
      name: "query_coupa_requisitions",
      kind: "query",
      sourceSystemId: "coupa",
      description: "Retrieve requisitions from Coupa for the Category Strategy Generator workflow.",
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
      name: "query_bigquery_analytics_events",
      kind: "query",
      sourceSystemId: "bigquery",
      description: "Retrieve analytics events from BigQuery for the Category Strategy Generator workflow.",
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
      name: "lookup_category_strategy_generator_policy_guide",
      kind: "evidence_lookup",
      sourceSystemId: "bigquery",
      description: "Look up sections of the Category Strategy Generator Procurement Policy Guide to cite in narrative output, escalation rationale, and audit evidence.",
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
      name: "action_sap_ariba_category_mgmt_generate",
      kind: "action",
      sourceSystemId: "sap_ariba_category_mgmt",
      description: "Execute the generate step in SAP Ariba Category Mgmt after the agent has gathered evidence and validated escalation gates.",
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
      claim: "Strategy creation time moved from 4-6 weeks toward 2 days",
      mustCite: [
        "sap_ariba_category_mgmt.suppliers",
        "coupa.requisitions",
      ],
      sourceSystemIds: [
        "sap_ariba_category_mgmt",
        "coupa",
      ],
    },
    {
      claim: "Data sources analyzed moved from 3-4 manual toward 15+ automated",
      mustCite: [
        "sap_ariba_category_mgmt.suppliers",
        "coupa.requisitions",
      ],
      sourceSystemIds: [
        "sap_ariba_category_mgmt",
        "coupa",
      ],
    },
  ],
  escalationRules: [
    {
      trigger: "Strategy creation time regresses past the 4-6 weeks baseline by more than 20%",
      action: "escalate_to_human",
      handoffTarget: "Category Director",
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
    "Never fabricate metric values; only publish numbers derived from SAP Ariba Category Mgmt (and other named systems) entities.",
    "Never bypass Category Director approval on escalation triggers, even when confidence is high.",
    "Never expose individual personal data (PII) in summaries; aggregate or pseudonymise before output.",
    "Never act on data older than the staleness threshold defined in the runbook without a fresh re-query.",
  ],
  goldenEvals: [
    {
      id: "category-strategy-generator-end-to-end",
      prompt: "Run the Category Strategy Generator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.",
      expectedToolCalls: [
        "query_sap_ariba_category_mgmt_suppliers",
        "query_coupa_requisitions",
        "query_bigquery_analytics_events",
        "lookup_category_strategy_generator_policy_guide",
        "action_sap_ariba_category_mgmt_generate",
      ],
      mustReferenceEntities: [
        "suppliers",
        "requisitions",
        "analytics_events",
      ],
      mustCiteDocuments: [
        "category-strategy-generator-policy-guide",
      ],
      expectedActionOutcome: "Action generate executed against SAP Ariba Category Mgmt, with audit-trail entry and Category Director notified of outcomes.",
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
    rationale: "Row counts sized for Category Strategy Generator so the agent can demonstrate the workflow against realistic transactional volume without simulating a production warehouse.",
  },
  sourceSystems: [
    {
      id: "sap_ariba_category_mgmt",
      name: "SAP Ariba Category Mgmt",
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
        "query_sap_ariba_category_mgmt_suppliers",
        "query_sap_ariba_category_mgmt_sourcing_events",
        "query_sap_ariba_category_mgmt_contracts",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
    {
      id: "coupa",
      name: "Coupa",
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
        "query_coupa_requisitions",
        "query_coupa_purchase_orders",
        "query_coupa_invoices",
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
  ],
  entities: [
    {
      name: "suppliers",
      sourceSystemId: "sap_ariba_category_mgmt",
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
      sourceSystemId: "sap_ariba_category_mgmt",
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
      sourceSystemId: "sap_ariba_category_mgmt",
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
      name: "requisitions",
      sourceSystemId: "coupa",
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
      sourceSystemId: "coupa",
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
      sourceSystemId: "coupa",
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
      id: "category-strategy-generator-policy-guide",
      sourceSystemId: "bigquery",
      type: "policy",
      title: "Category Strategy Generator Procurement Policy Guide",
      requiredSections: [
        "Sourcing principles",
        "Approval thresholds",
        "Supplier risk requirements",
        "Contract and compliance gates",
        "Exception handling",
      ],
      linkedEntities: [
        "suppliers",
        "sourcing_events",
        "contracts",
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
      id: "sap_ariba_category_mgmt_generate_api",
      sourceSystemId: "sap_ariba_category_mgmt",
      method: "POST",
      path: "/api/sap_ariba_category_mgmt/generate",
      description: "Synchronous endpoint the agent calls to generate in SAP Ariba Category Mgmt after evidence gating.",
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
      id: "category-strategy-generator-baseline-gap",
      description: "Seed a realistic gap where Strategy creation time sits between 4-6 weeks and 2 days, so the agent can detect, narrate, and recommend remediation.",
      affectedEntities: [
        "suppliers",
        "sourcing_events",
      ],
      discoveryPath: [
        "Inspect SAP Ariba Category Mgmt records for the affected entities",
        "Compare against Coupa historical baseline",
        "Generate a citation-backed recommendation",
      ],
      expectedEvidence: [
        "source-system record",
        "historical baseline metric",
        "generated audit trail",
      ],
      expectedRecommendation: "Explain the gap, cite supporting evidence, and propose the next Category Director action.",
    },
  ],
  datastorePackaging: {
    alloydb: {
      database: "category_strategy_generator",
      schemas: [
        "sap_ariba_category_mgmt",
        "coupa",
      ],
    },
    bigquery: {
      dataset: "procurement_category_strategy_generator",
      tables: [
        "kpi_summary",
        "evidence_index",
      ],
    },
    cloudStorage: {
      bucketSuffix: "category-strategy-generator-evidence",
      prefixes: [
        "documents",
        "audit-trails",
        "exports",
      ],
    },
    apis: {
      serviceName: "category-strategy-generator-source-adapters",
      deploymentTarget: "cloud_run",
    },
  },
  validation: {
    smokePrompt: "Run the Category Strategy Generator workflow and cite source-system evidence for every claim.",
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

export const CategoryStrategyGenerator = () => (
  <UseCaseSlide
    title="Category Strategy Generator"
    subtitle="A-1101 • Procurement Strategy"
    icon={Layers}
    domainId="domain-11"
    layer="Layer 3: Custom ADK"
    persona="Category Director"
    systems={["SAP Ariba Category Mgmt", "Coupa", "BigQuery", "Vertex AI"]}
    kpis={[
      { label: "Strategy creation time", before: "4-6 weeks", after: "2 days" },
      { label: "Data sources analyzed", before: "3-4 manual", after: "15+ automated" },
      { label: "Savings pipeline accuracy", before: "Gut feel", after: "Data-validated" },
    ]}
    triggerType="scheduled"
    swimlane={swimlane}
    flow={flow}
    architecture={architecture}
    hitl={{ actor: "Category Director", action: "Approve category strategy", description: "Director validates strategy recommendations, savings targets, and risk assessment before stakeholder distribution." }}
    statusQuo={[
      "Category strategies built in PowerPoint from fragmented spend data across 3+ systems.",
      "Market intelligence from ad-hoc calls and outdated reports.",
      "Savings targets based on historical precedent, not data-driven analysis."
    ]}
    agentification={[
      "Gemini synthesizes 3 years of spend, market intel, and supplier performance into coherent strategy narratives.",
      "LLM reasons about which savings levers are realistic given category maturity.",
      "Generates board-ready documents with trade-offs, not data dumps."
    ]}
  />
);
