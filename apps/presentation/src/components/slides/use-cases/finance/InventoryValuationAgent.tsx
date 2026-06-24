import React from "react";
import { UseCaseSlide } from "../../../agent/UseCaseSlide";
import { FlowStep } from "../../../agent/ProcessFlow";
import { SwimlaneFlow } from "../../../agent/SwimlaneFlow";
import { AgentArchitecture, UseCaseGenerationSpec, AgentBehaviorContract} from "../../../../types/architecture";
import { Package, Database, AlertTriangle, CheckCircle, TrendingDown } from "lucide-react";

const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "s1", label: "Quarter-End", lane: "system", type: "trigger" },
    { id: "a1", label: "Inventory Analysis", lane: "agent", type: "action" },
    { id: "a2", label: "Impairment Assessment", lane: "agent", type: "action" },
    { id: "a3", label: "Valuation Report", lane: "agent", type: "output" },
    { id: "h1", label: "Controller Reviews", lane: "human", type: "hitl" },
  ],
  connections: [["s1", "a1"], ["a1", "a2"], ["a2", "a3"], ["a3", "h1"]],
};

const flow: FlowStep[] = [
  { label: "Balance Extraction", icon: Database, description: "Pull inventory balances by location and material. Apply FIFO/weighted average valuation methods.", trigger: "Monthly/Quarterly", systems: ["SAP S/4HANA MM/FI"] },
  { label: "SLOB Analysis", icon: TrendingDown, description: "Identify slow-moving and obsolete inventory using aging, consumption patterns, and NRV calculations.", systems: ["BigQuery"], integration: "ADK" },
  { label: "Write-Down Assessment", icon: AlertTriangle, description: "Gemini assesses write-down candidates by cross-referencing production plans, product discontinuation, and market conditions.", systems: ["Vertex AI"] },
  { label: "Controller Approval", icon: CheckCircle, description: "Controller reviews impairment recommendations and approves write-down entries.", output: "Inventory Valuation Report" },
];

const architecture: AgentArchitecture = {
  connections: [
    { system: "SAP S/4HANA MM/FI", description: "Inventory balances, material master, stock movements, valuation data", direction: "bidirectional", protocol: "OData", category: "erp" },
    { system: "BigQuery", description: "Aging analytics, consumption forecasts, NRV calculations, reserve history", direction: "bidirectional", protocol: "BigQuery SQL", category: "analytics" },
    { system: "Vertex AI (Gemini)", description: "Write-down assessment reasoning, production plan interpretation", direction: "bidirectional", protocol: "gRPC", category: "ai" },
  ],
  pipeline: [
    { label: "Inventory Snapshot", description: "Extract inventory balances by material, plant, and storage location. Apply valuation methods (FIFO/weighted average) and calculate carrying values.", systems: ["SAP S/4HANA MM/FI"], layer: "integration", dataIn: "Material master + stock movements", dataOut: "Valued inventory snapshot by location" },
    { label: "SLOB Identification", description: "Classify inventory by aging bucket. Calculate consumption velocity and forecast future demand. Compute net realizable value using recent sales prices less completion costs.", systems: ["BigQuery"], layer: "ml", dataIn: "Inventory snapshot + sales history + demand forecast", dataOut: "SLOB candidates with NRV calculations" },
    { label: "Impairment Reasoning", description: "Gemini assesses each write-down candidate: Is the product line discontinued? Are production plans consuming this material? Is there a market for scrap? Generates write-down memo with supporting documentation.", systems: ["Vertex AI (Gemini)"], layer: "llm", dataIn: "SLOB candidates + production plans + market data", dataOut: "Write-down recommendations with supporting memos" },
    { label: "Journal Entry & Reporting", description: "Generate write-down journal entries for approved items. Update inventory reserve schedules and generate the valuation report.", systems: ["SAP S/4HANA FI"], layer: "integration", dataIn: "Approved write-downs", dataOut: "Posted entries + valuation report" },
  ],
};


const behaviorContract: AgentBehaviorContract = {
  role: "Cost Accountant agent for the Inventory Valuation Agent workflow",
  primaryObjective: "Item-level impairment assessment replaces blanket reserves with documented rationale per material. Gemini cross-references production plans and product discontinuation to identify true obsolescence. so the Cost Accountant can move the SLOB identification time KPI.",
  inScope: [
    "Item-level impairment assessment replaces blanket reserves with documented rationale per material",
    "Gemini cross-references production plans and product discontinuation to identify true obsolescence",
    "Automated NRV calculations using current market and scrap pricing data",
  ],
  outOfScope: [
    "Final sign-off on materially significant journal entries (Controller retains authority)",
    "Restatement of prior-period filings",
    "Tax position changes that require external advisor review",
  ],
  toolIntents: [
    {
      name: "query_sap_s_4hana_mm_fi_purchase_orders",
      kind: "query",
      sourceSystemId: "sap_s_4hana_mm_fi",
      description: "Retrieve purchase orders from SAP S/4HANA MM/FI for the Inventory Valuation Agent workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "purchase_orders_records",
        "purchase_orders_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_bigquery_analytics_events",
      kind: "query",
      sourceSystemId: "bigquery",
      description: "Retrieve analytics events from BigQuery for the Inventory Valuation Agent workflow.",
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
      name: "query_finance_3_finance_3_records",
      kind: "query",
      sourceSystemId: "finance_3",
      description: "Retrieve finance 3 records from FINANCE 3 for the Inventory Valuation Agent workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "finance_3_records_records",
        "finance_3_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "lookup_inventory_valuation_agent_controls_playbook",
      kind: "evidence_lookup",
      sourceSystemId: "bigquery",
      description: "Look up sections of the Inventory Valuation Agent Controls Playbook to cite in narrative output, escalation rationale, and audit evidence.",
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
      claim: "SLOB identification time moved from 1-2 weeks toward < 1 day",
      mustCite: [
        "sap_s_4hana_mm_fi.purchase_orders",
        "bigquery.analytics_events",
      ],
      sourceSystemIds: [
        "sap_s_4hana_mm_fi",
        "bigquery",
      ],
    },
    {
      claim: "Write-down accuracy moved from Conservative blanket reserves toward Item-level assessment",
      mustCite: [
        "sap_s_4hana_mm_fi.purchase_orders",
        "bigquery.analytics_events",
      ],
      sourceSystemIds: [
        "sap_s_4hana_mm_fi",
        "bigquery",
      ],
    },
  ],
  escalationRules: [
    {
      trigger: "SLOB identification time regresses past the 1-2 weeks baseline by more than 20%",
      action: "escalate_to_human",
      handoffTarget: "Cost Accountant",
      rationale: "Significant regressions need human judgment before automated remediation runs against production records.",
    },
    {
      trigger: "Source-system evidence is incomplete or stale (>24h) for any required entity",
      action: "request_more_info",
      rationale: "Recommendations grounded in stale evidence misrepresent current state and undermine audit defensibility.",
    },
  ],
  refusalRules: [
    "Never fabricate metric values; only publish numbers derived from SAP S/4HANA MM/FI (and other named systems) entities.",
    "Never bypass Cost Accountant approval on escalation triggers, even when confidence is high.",
    "Never expose individual personal data (PII) in summaries; aggregate or pseudonymise before output.",
    "Never act on data older than the staleness threshold defined in the runbook without a fresh re-query.",
  ],
  goldenEvals: [
    {
      id: "inventory-valuation-agent-end-to-end",
      prompt: "Run the Inventory Valuation Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.",
      expectedToolCalls: [
        "query_sap_s_4hana_mm_fi_purchase_orders",
        "query_bigquery_analytics_events",
        "query_finance_3_finance_3_records",
        "lookup_inventory_valuation_agent_controls_playbook",
      ],
      mustReferenceEntities: [
        "purchase_orders",
        "analytics_events",
        "finance_3_records",
      ],
      mustCiteDocuments: [
        "inventory-valuation-agent-controls-playbook",
      ],
      expectedActionOutcome: "Cost Accountant receives a fully-cited recommendation; no external state change without explicit approval.",
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
    rationale: "Row counts sized for Inventory Valuation Agent so the agent can demonstrate the workflow against realistic transactional volume without simulating a production warehouse.",
  },
  sourceSystems: [
    {
      id: "sap_s_4hana_mm_fi",
      name: "SAP S/4HANA MM/FI",
      owns: [
        "purchase_orders",
        "material_movements",
        "vendors",
      ],
      protocol: "RFC/BAPI",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_sap_s_4hana_mm_fi_purchase_orders",
        "query_sap_s_4hana_mm_fi_material_movements",
        "query_sap_s_4hana_mm_fi_vendors",
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
      id: "finance_3",
      name: "FINANCE 3",
      owns: [
        "finance_3_records",
        "finance_3_events",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_finance_3_records",
      ],
      evidence: [
        "source_system_record",
      ],
    },
  ],
  entities: [
    {
      name: "purchase_orders",
      sourceSystemId: "sap_s_4hana_mm_fi",
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
      name: "material_movements",
      sourceSystemId: "sap_s_4hana_mm_fi",
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
      name: "vendors",
      sourceSystemId: "sap_s_4hana_mm_fi",
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
      name: "finance_3_records",
      sourceSystemId: "finance_3",
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
      name: "finance_3_events",
      sourceSystemId: "finance_3",
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
          name: "finance_3_record_id",
          type: "ref",
          ref: "finance_3_records.id",
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
      from: "finance_3_events.finance_3_record_id",
      to: "finance_3_records.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
  ],
  documents: [
    {
      id: "inventory-valuation-agent-controls-playbook",
      sourceSystemId: "bigquery",
      type: "policy",
      title: "Inventory Valuation Agent Controls Playbook",
      requiredSections: [
        "Workflow scope",
        "Materiality thresholds",
        "Escalation triggers",
        "Audit evidence requirements",
        "Quarter-end variations",
      ],
      linkedEntities: [
        "purchase_orders",
        "material_movements",
        "vendors",
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
      id: "inventory-valuation-agent-baseline-gap",
      description: "Seed a realistic gap where SLOB identification time sits between 1-2 weeks and < 1 day, so the agent can detect, narrate, and recommend remediation.",
      affectedEntities: [
        "purchase_orders",
        "material_movements",
      ],
      discoveryPath: [
        "Inspect SAP S/4HANA MM/FI records for the affected entities",
        "Compare against BigQuery historical baseline",
        "Generate a citation-backed recommendation",
      ],
      expectedEvidence: [
        "source-system record",
        "historical baseline metric",
        "generated audit trail",
      ],
      expectedRecommendation: "Explain the gap, cite supporting evidence, and propose the next Cost Accountant action.",
    },
  ],
  datastorePackaging: {
    alloydb: {
      database: "inventory_valuation_agent",
      schemas: [
        "sap_s_4hana_mm_fi",
        "finance_3",
      ],
    },
    bigquery: {
      dataset: "finance_inventory_valuation_agent",
      tables: [
        "kpi_summary",
        "evidence_index",
      ],
    },
    cloudStorage: {
      bucketSuffix: "inventory-valuation-agent-evidence",
      prefixes: [
        "documents",
        "audit-trails",
        "exports",
      ],
    },
    apis: {
      serviceName: "inventory-valuation-agent-source-adapters",
      deploymentTarget: "cloud_run",
    },
  },
  validation: {
    smokePrompt: "Run the Inventory Valuation Agent workflow and cite source-system evidence for every claim.",
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

export const InventoryValuationAgent = () => (
  <UseCaseSlide
    title="Inventory Valuation Agent"
    subtitle="A-2706 • Revenue & Cost Accounting"
    icon={Package}
    domainId="domain-27"
    layer="Layer 3: Custom ADK"
    persona="Cost Accountant"
    systems={["SAP S/4HANA MM/FI", "BigQuery", "Vertex AI"]}
    kpis={[
      { label: "SLOB identification time", before: "1-2 weeks", after: "< 1 day" },
      { label: "Write-down accuracy", before: "Conservative blanket reserves", after: "Item-level assessment" },
      { label: "Inventory carrying cost", before: "12-15% of revenue", after: "8-10% optimized" },
    ]}
    triggerType="scheduled"
    swimlane={swimlane}
    flow={flow}
    architecture={architecture}
    hitl={{ actor: "Controller", action: "Approve write-down entries", description: "Controller reviews impairment assessments and approves write-down journal entries with supporting documentation." }}
    statusQuo={[
      "Inventory write-down analysis relies on manual aging reports with blanket percentage reserves.",
      "Obsolete inventory from discontinued products not identified until physical count.",
      "NRV calculations performed in spreadsheets with stale pricing data."
    ]}
    agentification={[
      "Item-level impairment assessment replaces blanket reserves with documented rationale per material.",
      "Gemini cross-references production plans and product discontinuation to identify true obsolescence.",
      "Automated NRV calculations using current market and scrap pricing data."
    ]}
  />
);
