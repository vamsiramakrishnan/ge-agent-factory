import React from "react";
import { UseCaseSlide } from "../../../agent/UseCaseSlide";
import { FlowStep } from "../../../agent/ProcessFlow";
import { SwimlaneFlow } from "../../../agent/SwimlaneFlow";
import { AgentArchitecture, UseCaseGenerationSpec, AgentBehaviorContract} from "../../../../types/architecture";
import { Calculator, FileInput, Database, Brain, CheckCircle } from "lucide-react";

const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "s1", label: "Sourcing Decision", lane: "system", type: "trigger" },
    { id: "a1", label: "Cost Aggregation", lane: "agent", type: "action" },
    { id: "a2", label: "TCO Modeling", lane: "agent", type: "action" },
    { id: "a3", label: "Hidden Cost Analysis", lane: "agent", type: "action" },
    { id: "a4", label: "TCO Comparison", lane: "agent", type: "output" },
    { id: "h1", label: "Category Mgr Review", lane: "human", type: "hitl" },
  ],
  connections: [["s1", "a1"], ["a1", "a2"], ["a2", "a3"], ["a3", "a4"], ["a4", "h1"]],
};

const flow: FlowStep[] = [
  { label: "Cost Ingestion", icon: FileInput, description: "Unit pricing, freight, duties, quality costs, and inventory carrying costs pulled from ERP.", trigger: "Pre-sourcing", systems: ["SAP S/4HANA"] },
  { label: "Multi-Factor Modeling", icon: Database, description: "TCO model spans acquisition, logistics, quality, inventory carrying, disposal, and risk premium.", systems: ["BigQuery", "Vertex AI"], integration: "ADK" },
  { label: "Hidden Cost Discovery", icon: Brain, description: "LLM quantifies hidden costs: dedicated liaison FTE, requalification testing, non-standard packaging requirements.", systems: ["Vertex AI"] },
  { label: "Category Mgr Approval", icon: CheckCircle, description: "Category Manager validates TCO model assumptions and approves supplier comparison for sourcing committee.", output: "TCO Report" },
];

const architecture: AgentArchitecture = {
  connections: [
    { system: "SAP S/4HANA", description: "Unit pricing, freight/duties, quality cost data, warranty claims, inventory carrying costs", direction: "read", protocol: "RFC/BAPI", category: "erp" },
    { system: "BigQuery", description: "Multi-factor TCO models, sensitivity analysis, supplier comparison analytics", direction: "bidirectional", protocol: "BigQuery SQL", category: "analytics" },
    { system: "Vertex AI (Gemini)", description: "Hidden cost discovery, non-standard cost structure interpretation, TCO narrative generation", direction: "bidirectional", protocol: "gRPC", category: "ai" },
    { system: "Logistics Systems", description: "Freight rates, transit times, customs duties by origin/destination", direction: "read", protocol: "REST API", category: "erp" },
  ],
  pipeline: [
    { label: "Cost Component Aggregation", description: "Pull structured cost components from ERP — unit price, freight, duties, quality costs (warranty, inspection, reject rates), inventory carrying costs, and disposal costs. Aggregate logistics rates and customs duties by supplier geography.", systems: ["SAP S/4HANA", "Logistics Systems"], layer: "integration", dataIn: "Structured cost data across systems", dataOut: "Multi-dimensional cost component matrix" },
    { label: "TCO Modeling & Sensitivity", description: "Multi-factor TCO model spanning acquisition, logistics, quality, inventory carrying, disposal, and risk premium. Sensitivity analysis on key variables with scenario comparison across suppliers, regions, and strategies.", systems: ["BigQuery"], layer: "ml", dataIn: "Cost component matrix + scenario parameters", dataOut: "TCO comparison with sensitivity ranges" },
    { label: "Hidden Cost Discovery & Narrative", description: "Gemini quantifies hidden costs invisible in structured systems — dedicated liaison FTEs, requalification testing, non-standard packaging requirements. Interprets non-standard supplier cost structures ('tooling amortized over first 50K units'). Generates TCO narrative explaining why lowest unit price is not lowest total cost.", systems: ["Vertex AI (Gemini)"], layer: "llm", dataIn: "TCO model + supplier proposals", dataOut: "Complete TCO report with hidden cost narrative" },
  ],
};


const behaviorContract: AgentBehaviorContract = {
  role: "Category Manager agent for the Total Cost of Ownership Modeler workflow",
  primaryObjective: "Multi-factor TCO spans 25+ cost dimensions: acquisition, logistics, quality, carrying, disposal, and risk premium. LLM quantifies hidden costs invisible in structured systems — 'Supplier B requires a dedicated engineering liaison (0.25 FTE at $150K).' so the Category Manager can move the Cost factors modeled KPI.",
  inScope: [
    "Multi-factor TCO spans 25+ cost dimensions: acquisition, logistics, quality, carrying, disposal, and risk premium",
    "LLM quantifies hidden costs invisible in structured systems — 'Supplier B requires a dedicated engineering liaison (0.25 FTE at $150K).'",
    "Generates narrative explaining why lowest unit price is not lowest total cost with supplier-specific breakdowns",
  ],
  outOfScope: [
    "Contract execution without legal review",
    "Supplier disqualification decisions (category lead retains authority)",
    "Single-source justification overrides above policy threshold",
  ],
  toolIntents: [
    {
      name: "query_sap_s_4hana_transactions",
      kind: "query",
      sourceSystemId: "sap_s_4hana",
      description: "Retrieve transactions from SAP S/4HANA for the Total Cost of Ownership Modeler workflow.",
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
      name: "query_bigquery_analytics_events",
      kind: "query",
      sourceSystemId: "bigquery",
      description: "Retrieve analytics events from BigQuery for the Total Cost of Ownership Modeler workflow.",
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
      name: "query_procurement_3_procurement_3_records",
      kind: "query",
      sourceSystemId: "procurement_3",
      description: "Retrieve procurement 3 records from PROCUREMENT 3 for the Total Cost of Ownership Modeler workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "procurement_3_records_records",
        "procurement_3_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "lookup_total_cost_of_ownership_modeler_policy_guide",
      kind: "evidence_lookup",
      sourceSystemId: "bigquery",
      description: "Look up sections of the Total Cost of Ownership Modeler Procurement Policy Guide to cite in narrative output, escalation rationale, and audit evidence.",
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
      name: "action_sap_s_4hana_generate",
      kind: "action",
      sourceSystemId: "sap_s_4hana",
      description: "Execute the generate step in SAP S/4HANA after the agent has gathered evidence and validated escalation gates.",
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
      claim: "Cost factors modeled moved from 5-8 visible costs toward 25+ including hidden",
      mustCite: [
        "sap_s_4hana.transactions",
        "bigquery.analytics_events",
      ],
      sourceSystemIds: [
        "sap_s_4hana",
        "bigquery",
      ],
    },
    {
      claim: "TCO analysis time moved from 1-2 weeks toward 4 hours",
      mustCite: [
        "sap_s_4hana.transactions",
        "bigquery.analytics_events",
      ],
      sourceSystemIds: [
        "sap_s_4hana",
        "bigquery",
      ],
    },
  ],
  escalationRules: [
    {
      trigger: "Cost factors modeled regresses past the 5-8 visible costs baseline by more than 20%",
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
    "Never fabricate metric values; only publish numbers derived from SAP S/4HANA (and other named systems) entities.",
    "Never bypass Category Manager approval on escalation triggers, even when confidence is high.",
    "Never expose individual personal data (PII) in summaries; aggregate or pseudonymise before output.",
    "Never act on data older than the staleness threshold defined in the runbook without a fresh re-query.",
  ],
  goldenEvals: [
    {
      id: "total-cost-of-ownership-modeler-end-to-end",
      prompt: "Run the Total Cost of Ownership Modeler workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.",
      expectedToolCalls: [
        "query_sap_s_4hana_transactions",
        "query_bigquery_analytics_events",
        "query_procurement_3_procurement_3_records",
        "lookup_total_cost_of_ownership_modeler_policy_guide",
        "action_sap_s_4hana_generate",
      ],
      mustReferenceEntities: [
        "transactions",
        "analytics_events",
        "procurement_3_records",
      ],
      mustCiteDocuments: [
        "total-cost-of-ownership-modeler-policy-guide",
      ],
      expectedActionOutcome: "Action generate executed against SAP S/4HANA, with audit-trail entry and Category Manager notified of outcomes.",
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
    rationale: "Row counts sized for Total Cost of Ownership Modeler so the agent can demonstrate the workflow against realistic transactional volume without simulating a production warehouse.",
  },
  sourceSystems: [
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
      id: "procurement_3",
      name: "PROCUREMENT 3",
      owns: [
        "procurement_3_records",
        "procurement_3_events",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_procurement_3_records",
      ],
      evidence: [
        "source_system_record",
      ],
    },
  ],
  entities: [
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
      name: "procurement_3_records",
      sourceSystemId: "procurement_3",
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
      name: "procurement_3_events",
      sourceSystemId: "procurement_3",
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
          name: "procurement_3_record_id",
          type: "ref",
          ref: "procurement_3_records.id",
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
      from: "procurement_3_events.procurement_3_record_id",
      to: "procurement_3_records.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
  ],
  documents: [
    {
      id: "total-cost-of-ownership-modeler-policy-guide",
      sourceSystemId: "bigquery",
      type: "policy",
      title: "Total Cost of Ownership Modeler Procurement Policy Guide",
      requiredSections: [
        "Sourcing principles",
        "Approval thresholds",
        "Supplier risk requirements",
        "Contract and compliance gates",
        "Exception handling",
      ],
      linkedEntities: [
        "transactions",
        "journal_entries",
        "master_data",
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
      id: "sap_s_4hana_generate_api",
      sourceSystemId: "sap_s_4hana",
      method: "POST",
      path: "/api/sap_s_4hana/generate",
      description: "Synchronous endpoint the agent calls to generate in SAP S/4HANA after evidence gating.",
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
      id: "total-cost-of-ownership-modeler-baseline-gap",
      description: "Seed a realistic gap where Cost factors modeled sits between 5-8 visible costs and 25+ including hidden, so the agent can detect, narrate, and recommend remediation.",
      affectedEntities: [
        "transactions",
        "journal_entries",
      ],
      discoveryPath: [
        "Inspect SAP S/4HANA records for the affected entities",
        "Compare against BigQuery historical baseline",
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
      database: "total_cost_of_ownership_modeler",
      schemas: [
        "sap_s_4hana",
        "procurement_3",
      ],
    },
    bigquery: {
      dataset: "procurement_total_cost_of_ownership_modeler",
      tables: [
        "kpi_summary",
        "evidence_index",
      ],
    },
    cloudStorage: {
      bucketSuffix: "total-cost-of-ownership-modeler-evidence",
      prefixes: [
        "documents",
        "audit-trails",
        "exports",
      ],
    },
    apis: {
      serviceName: "total-cost-of-ownership-modeler-source-adapters",
      deploymentTarget: "cloud_run",
    },
  },
  validation: {
    smokePrompt: "Run the Total Cost of Ownership Modeler workflow and cite source-system evidence for every claim.",
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

export const TotalCostOwnershipModeler = () => (
  <UseCaseSlide
    title="Total Cost of Ownership Modeler"
    subtitle="A-1905 • Spend Analytics"
    icon={Calculator}
    domainId="domain-19"
    layer="Layer 3: Custom ADK"
    persona="Category Manager"
    systems={["SAP S/4HANA", "BigQuery", "Vertex AI"]}
    kpis={[
      { label: "Cost factors modeled", before: "5-8 visible costs", after: "25+ including hidden" },
      { label: "TCO analysis time", before: "1-2 weeks", after: "4 hours" },
      { label: "Lowest-price selection rate", before: "70% default to cheapest", after: "Decision based on true TCO" },
    ]}
    triggerType="event"
    swimlane={swimlane}
    flow={flow}
    architecture={architecture}
    hitl={{ actor: "Category Manager", action: "Validate TCO model and assumptions", description: "Category Manager reviews cost factor inputs, validates hidden cost estimates, and approves TCO comparison before sourcing committee presentation." }}
    statusQuo={[
      "TCO analysis limited to unit price + freight — hidden costs (liaison FTE, rework, safety stock) ignored.",
      "Lowest unit price wins by default because total cost is too hard to calculate.",
      "Non-standard supplier cost structures ('tooling amortized over first 50K units') modeled incorrectly."
    ]}
    agentification={[
      "Multi-factor TCO spans 25+ cost dimensions: acquisition, logistics, quality, carrying, disposal, and risk premium.",
      "LLM quantifies hidden costs invisible in structured systems — 'Supplier B requires a dedicated engineering liaison (0.25 FTE at $150K).'",
      "Generates narrative explaining why lowest unit price is not lowest total cost with supplier-specific breakdowns."
    ]}
  />
);
