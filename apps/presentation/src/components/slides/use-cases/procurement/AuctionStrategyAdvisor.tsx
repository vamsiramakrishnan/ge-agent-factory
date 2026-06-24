import React from "react";
import { UseCaseSlide } from "../../../agent/UseCaseSlide";
import { FlowStep } from "../../../agent/ProcessFlow";
import { SwimlaneFlow } from "../../../agent/SwimlaneFlow";
import { AgentArchitecture, UseCaseGenerationSpec, AgentBehaviorContract} from "../../../../types/architecture";
import { Gavel, Database, Cpu, Brain, Settings } from "lucide-react";

const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "s1", label: "Pre-Auction Setup", lane: "system", type: "trigger" },
    { id: "a1", label: "Historical Analysis", lane: "agent", type: "action" },
    { id: "a2", label: "Format Selection", lane: "agent", type: "action" },
    { id: "a3", label: "Bidder Profiling", lane: "agent", type: "action" },
    { id: "a4", label: "Strategy Brief", lane: "agent", type: "output" },
  ],
  connections: [["s1", "a1"], ["a1", "a2"], ["a2", "a3"], ["a3", "a4"]],
};

const flow: FlowStep[] = [
  { label: "History Pull", icon: Database, description: "Historical auction data, bid patterns, and price decline curves retrieved from sourcing platform.", trigger: "Pre-auction", systems: ["SAP Ariba e-Auction", "Coupa"] },
  { label: "Game Theory Model", icon: Cpu, description: "Bidding pattern analysis, reserve price optimization, and lot bundling scenarios modeled.", systems: ["BigQuery"], integration: "ADK" },
  { label: "Format Reasoning", icon: Brain, description: "Gemini reasons about optimal format — English, Dutch, Japanese, or sealed bid — based on competitive dynamics and switching costs.", systems: ["Vertex AI"] },
  { label: "Pre-Auction Brief", icon: Settings, description: "Strategy brief with anticipated supplier behavior and recommended lot structure delivered to sourcing team.", output: "Auction Strategy" },
];

const architecture: AgentArchitecture = {
  connections: [
    { system: "SAP Ariba e-Auction", description: "Historical auction data, bid patterns, and price decline curves", direction: "bidirectional", protocol: "REST API", category: "erp" },
    { system: "Coupa", description: "Auction event configuration, lot structures, and bidder management", direction: "bidirectional", protocol: "REST API", category: "erp" },
    { system: "BigQuery", description: "Game theory modeling, bidding pattern analysis, reserve price optimization", direction: "bidirectional", protocol: "BigQuery SQL", category: "analytics" },
    { system: "Vertex AI (Gemini)", description: "Auction format reasoning, bidder behavior anticipation, strategy brief generation", direction: "bidirectional", protocol: "gRPC", category: "ai" },
  ],
  pipeline: [
    { label: "Historical Data Assembly", description: "Pull historical auction data from Ariba and Coupa — bid patterns, price decline curves, round dynamics, participation rates. Aggregate into BigQuery for analysis.", systems: ["SAP Ariba e-Auction", "Coupa"], layer: "integration", dataIn: "Historical auction events, bids, and outcomes", dataOut: "Structured auction performance dataset" },
    { label: "Game Theory & Optimization", description: "Model bidding patterns using game theory. Analyze historical price decline curves and round dynamics. Optimize reserve prices and lot bundling scenarios. Simulate competitive intensity under different auction formats.", systems: ["BigQuery ML"], layer: "ml", dataIn: "Structured auction history + bidder profiles", dataOut: "Reserve prices, lot structures, format recommendations" },
    { label: "Strategy Brief Generation", description: "Gemini reasons about which auction format fits the specific competitive situation — considering qualified bidders, switching costs, relationship dynamics, and category commoditization. Generates pre-auction briefing anticipating supplier behavior.", systems: ["Vertex AI (Gemini)"], layer: "llm", dataIn: "Optimization outputs + competitive landscape + category context", dataOut: "Pre-auction strategy brief with bidder behavior predictions" },
  ],
};


const behaviorContract: AgentBehaviorContract = {
  role: "Strategic Sourcing Lead agent for the Auction Strategy Advisor workflow",
  primaryObjective: "Gemini reasons about auction format fit: 'Only 2 qualified bidders with high switching costs — sealed bid outperforms English auction here.' LLM generates pre-auction briefings anticipating supplier behavior: 'Supplier A historically hits a floor at 8% below market in round 3.' so the Strategic Sourcing Lead can move the Auction savings yield KPI.",
  inScope: [
    "Gemini reasons about auction format fit: 'Only 2 qualified bidders with high switching costs — sealed bid outperforms English auction here.'",
    "LLM generates pre-auction briefings anticipating supplier behavior: 'Supplier A historically hits a floor at 8% below market in round 3.'",
    "Game theory modeling optimizes lot bundling and reserve prices based on historical price decline curves and competitive intensity",
  ],
  outOfScope: [
    "Contract execution without legal review",
    "Supplier disqualification decisions (category lead retains authority)",
    "Single-source justification overrides above policy threshold",
  ],
  toolIntents: [
    {
      name: "query_sap_ariba_e_auction_suppliers",
      kind: "query",
      sourceSystemId: "sap_ariba_e_auction",
      description: "Retrieve suppliers from SAP Ariba e-Auction for the Auction Strategy Advisor workflow.",
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
      description: "Retrieve requisitions from Coupa for the Auction Strategy Advisor workflow.",
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
      description: "Retrieve analytics events from BigQuery for the Auction Strategy Advisor workflow.",
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
      name: "lookup_auction_strategy_advisor_policy_guide",
      kind: "evidence_lookup",
      sourceSystemId: "bigquery",
      description: "Look up sections of the Auction Strategy Advisor Procurement Policy Guide to cite in narrative output, escalation rationale, and audit evidence.",
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
      name: "action_sap_ariba_e_auction_generate",
      kind: "action",
      sourceSystemId: "sap_ariba_e_auction",
      description: "Execute the generate step in SAP Ariba e-Auction after the agent has gathered evidence and validated escalation gates.",
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
      claim: "Auction savings yield moved from 5-8% toward 12-18%",
      mustCite: [
        "sap_ariba_e_auction.suppliers",
        "coupa.requisitions",
      ],
      sourceSystemIds: [
        "sap_ariba_e_auction",
        "coupa",
      ],
    },
    {
      claim: "Format selection accuracy moved from Default English toward Data-driven per event",
      mustCite: [
        "sap_ariba_e_auction.suppliers",
        "coupa.requisitions",
      ],
      sourceSystemIds: [
        "sap_ariba_e_auction",
        "coupa",
      ],
    },
  ],
  escalationRules: [
    {
      trigger: "Auction savings yield regresses past the 5-8% baseline by more than 20%",
      action: "escalate_to_human",
      handoffTarget: "Strategic Sourcing Lead",
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
    "Never fabricate metric values; only publish numbers derived from SAP Ariba e-Auction (and other named systems) entities.",
    "Never bypass Strategic Sourcing Lead approval on escalation triggers, even when confidence is high.",
    "Never expose individual personal data (PII) in summaries; aggregate or pseudonymise before output.",
    "Never act on data older than the staleness threshold defined in the runbook without a fresh re-query.",
  ],
  goldenEvals: [
    {
      id: "auction-strategy-advisor-end-to-end",
      prompt: "Run the Auction Strategy Advisor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.",
      expectedToolCalls: [
        "query_sap_ariba_e_auction_suppliers",
        "query_coupa_requisitions",
        "query_bigquery_analytics_events",
        "lookup_auction_strategy_advisor_policy_guide",
        "action_sap_ariba_e_auction_generate",
      ],
      mustReferenceEntities: [
        "suppliers",
        "requisitions",
        "analytics_events",
      ],
      mustCiteDocuments: [
        "auction-strategy-advisor-policy-guide",
      ],
      expectedActionOutcome: "Action generate executed against SAP Ariba e-Auction, with audit-trail entry and Strategic Sourcing Lead notified of outcomes.",
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
    rationale: "Row counts sized for Auction Strategy Advisor so the agent can demonstrate the workflow against realistic transactional volume without simulating a production warehouse.",
  },
  sourceSystems: [
    {
      id: "sap_ariba_e_auction",
      name: "SAP Ariba e-Auction",
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
        "query_sap_ariba_e_auction_suppliers",
        "query_sap_ariba_e_auction_sourcing_events",
        "query_sap_ariba_e_auction_contracts",
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
      sourceSystemId: "sap_ariba_e_auction",
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
      sourceSystemId: "sap_ariba_e_auction",
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
      sourceSystemId: "sap_ariba_e_auction",
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
      id: "auction-strategy-advisor-policy-guide",
      sourceSystemId: "bigquery",
      type: "policy",
      title: "Auction Strategy Advisor Procurement Policy Guide",
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
      id: "sap_ariba_e_auction_generate_api",
      sourceSystemId: "sap_ariba_e_auction",
      method: "POST",
      path: "/api/sap_ariba_e_auction/generate",
      description: "Synchronous endpoint the agent calls to generate in SAP Ariba e-Auction after evidence gating.",
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
      id: "auction-strategy-advisor-baseline-gap",
      description: "Seed a realistic gap where Auction savings yield sits between 5-8% and 12-18%, so the agent can detect, narrate, and recommend remediation.",
      affectedEntities: [
        "suppliers",
        "sourcing_events",
      ],
      discoveryPath: [
        "Inspect SAP Ariba e-Auction records for the affected entities",
        "Compare against Coupa historical baseline",
        "Generate a citation-backed recommendation",
      ],
      expectedEvidence: [
        "source-system record",
        "historical baseline metric",
        "generated audit trail",
      ],
      expectedRecommendation: "Explain the gap, cite supporting evidence, and propose the next Strategic Sourcing Lead action.",
    },
  ],
  datastorePackaging: {
    alloydb: {
      database: "auction_strategy_advisor",
      schemas: [
        "sap_ariba_e_auction",
        "coupa",
      ],
    },
    bigquery: {
      dataset: "procurement_auction_strategy_advisor",
      tables: [
        "kpi_summary",
        "evidence_index",
      ],
    },
    cloudStorage: {
      bucketSuffix: "auction-strategy-advisor-evidence",
      prefixes: [
        "documents",
        "audit-trails",
        "exports",
      ],
    },
    apis: {
      serviceName: "auction-strategy-advisor-source-adapters",
      deploymentTarget: "cloud_run",
    },
  },
  validation: {
    smokePrompt: "Run the Auction Strategy Advisor workflow and cite source-system evidence for every claim.",
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

export const AuctionStrategyAdvisor = () => (
  <UseCaseSlide
    title="Auction Strategy Advisor"
    subtitle="A-1206 • Strategic Sourcing"
    icon={Gavel}
    domainId="domain-12"
    layer="Layer 3: Custom ADK"
    persona="Strategic Sourcing Lead"
    systems={["SAP Ariba e-Auction", "Coupa", "BigQuery", "Vertex AI"]}
    kpis={[
      { label: "Auction savings yield", before: "5-8%", after: "12-18%" },
      { label: "Format selection accuracy", before: "Default English", after: "Data-driven per event" },
      { label: "Bidder participation rate", before: "65%", after: "88%" },
    ]}
    triggerType="event"
    swimlane={swimlane}
    flow={flow}
    architecture={architecture}
    statusQuo={[
      "Auction format defaults to English reverse auction regardless of category dynamics, competitive landscape, or switching costs.",
      "Reserve prices set by gut feel — often too high (leaving value on the table) or too low (triggering supplier disengagement).",
      "No systematic analysis of historical bidding behavior to anticipate supplier strategies during the event."
    ]}
    agentification={[
      "Gemini reasons about auction format fit: 'Only 2 qualified bidders with high switching costs — sealed bid outperforms English auction here.'",
      "LLM generates pre-auction briefings anticipating supplier behavior: 'Supplier A historically hits a floor at 8% below market in round 3.'",
      "Game theory modeling optimizes lot bundling and reserve prices based on historical price decline curves and competitive intensity."
    ]}
  />
);
