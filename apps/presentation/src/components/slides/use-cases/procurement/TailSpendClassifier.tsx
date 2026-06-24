import React from "react";
import { UseCaseSlide } from "../../../agent/UseCaseSlide";
import { FlowStep } from "../../../agent/ProcessFlow";
import { SwimlaneFlow } from "../../../agent/SwimlaneFlow";
import { AgentArchitecture, UseCaseGenerationSpec, AgentBehaviorContract} from "../../../../types/architecture";
import { ShoppingCart, Database, Layers, Brain, FileBarChart } from "lucide-react";

const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "s1", label: "Monthly ETL", lane: "system", type: "trigger" },
    { id: "a1", label: "Pareto Analysis", lane: "agent", type: "action" },
    { id: "a2", label: "ML Clustering", lane: "agent", type: "action" },
    { id: "a3", label: "LLM Interpretation", lane: "agent", type: "action" },
    { id: "a4", label: "Opportunity Roadmap", lane: "agent", type: "output" },
  ],
  connections: [["s1", "a1"], ["a1", "a2"], ["a2", "a3"], ["a3", "a4"]],
};

const flow: FlowStep[] = [
  { label: "Spend Extraction", icon: Database, description: "Tail spend data below strategic sourcing threshold extracted from source systems.", trigger: "Monthly", systems: ["BigQuery", "SAP S/4HANA"] },
  { label: "Pareto Segmentation", icon: Layers, description: "Transaction distribution analyzed to identify addressable tail spend clusters.", systems: ["BigQuery", "Vertex AI"], integration: "Data Agent" },
  { label: "ML Clustering", icon: Brain, description: "Tail transactions clustered by similarity — vendor, category, BU — with consolidation sizing.", systems: ["Vertex AI"] },
  { label: "Intervention Plan", icon: FileBarChart, description: "LLM interprets why each cluster exists and recommends catalog expansion, preferred-provider framework, or P-card channel.", output: "Opportunity Roadmap" },
];

const architecture: AgentArchitecture = {
  connections: [
    { system: "SAP S/4HANA", description: "PO/invoice line items, vendor master, material groups", direction: "read", protocol: "RFC/BAPI", category: "erp" },
    { system: "Coupa", description: "Requisition history, catalog coverage, channel attribution", direction: "read", protocol: "REST API", category: "erp" },
    { system: "BigQuery", description: "Enriched spend cube, tail spend segmentation, clustering output", direction: "bidirectional", protocol: "BigQuery SQL", category: "analytics" },
    { system: "Vertex AI (Gemini)", description: "PO description interpretation, intervention recommendation generation", direction: "bidirectional", protocol: "gRPC", category: "ai" },
  ],
  pipeline: [
    { label: "Tail Spend Extraction", description: "Extract transactions below strategic sourcing threshold from ERP and procurement platforms. Segment by value, frequency, vendor count, and category coverage.", systems: ["SAP S/4HANA", "Coupa", "BigQuery"], layer: "integration", dataIn: "Raw PO/invoice data below threshold", dataOut: "Segmented tail spend dataset" },
    { label: "Pareto & Cluster Analysis", description: "Pareto analysis on transaction distribution to identify addressable clusters. ML clustering groups similar purchases by vendor, category, and BU to size consolidation opportunities.", systems: ["BigQuery"], layer: "ml", dataIn: "Segmented tail transactions", dataOut: "Addressable clusters with consolidation sizing" },
    { label: "LLM Interpretation & Roadmap", description: "Gemini reads PO descriptions to understand what is actually being bought — 'office supplies' might be lab consumables. Recommends the right intervention per cluster: catalog expansion, preferred-provider framework, or P-card migration.", systems: ["Vertex AI (Gemini)"], layer: "llm", dataIn: "Clusters with PO descriptions and context", dataOut: "Prioritized intervention roadmap with savings estimates" },
  ],
};


const behaviorContract: AgentBehaviorContract = {
  role: "Indirect Procurement Lead agent for the Tail Spend Classifier & Opportunity Finder workflow",
  primaryObjective: "Pareto analysis segments the tail by transaction distribution; ML clusters similar purchases across vendors and BUs to size consolidation opportunities. LLM reads PO descriptions to understand what is actually being bought — 'office supplies' might really be lab consumables that belong in a scientific supplier catalog. so the Indirect Procurement Lead can move the Tail spend visibility KPI.",
  inScope: [
    "Pareto analysis segments the tail by transaction distribution; ML clusters similar purchases across vendors and BUs to size consolidation opportunities",
    "LLM reads PO descriptions to understand what is actually being bought — 'office supplies' might really be lab consumables that belong in a scientific supplier catalog",
    "Generates a prioritized intervention roadmap: expand Staples catalog for office clusters, create preferred-provider framework for consulting clusters, migrate routine purchases to P-card",
  ],
  outOfScope: [
    "Contract execution without legal review",
    "Supplier disqualification decisions (category lead retains authority)",
    "Single-source justification overrides above policy threshold",
  ],
  toolIntents: [
    {
      name: "query_bigquery_analytics_events",
      kind: "query",
      sourceSystemId: "bigquery",
      description: "Retrieve analytics events from BigQuery for the Tail Spend Classifier & Opportunity Finder workflow.",
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
      name: "query_sap_s_4hana_transactions",
      kind: "query",
      sourceSystemId: "sap_s_4hana",
      description: "Retrieve transactions from SAP S/4HANA for the Tail Spend Classifier & Opportunity Finder workflow.",
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
      name: "query_coupa_requisitions",
      kind: "query",
      sourceSystemId: "coupa",
      description: "Retrieve requisitions from Coupa for the Tail Spend Classifier & Opportunity Finder workflow.",
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
      name: "lookup_tail_spend_classifier_opportunity_finder_policy_guide",
      kind: "evidence_lookup",
      sourceSystemId: "bigquery",
      description: "Look up sections of the Tail Spend Classifier & Opportunity Finder Procurement Policy Guide to cite in narrative output, escalation rationale, and audit evidence.",
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
      claim: "Tail spend visibility moved from 30% classified toward 95% classified",
      mustCite: [
        "bigquery.analytics_events",
        "sap_s_4hana.transactions",
      ],
      sourceSystemIds: [
        "bigquery",
        "sap_s_4hana",
      ],
    },
    {
      claim: "Addressable opportunities moved from Ad-hoc guesswork toward Prioritized roadmap",
      mustCite: [
        "bigquery.analytics_events",
        "sap_s_4hana.transactions",
      ],
      sourceSystemIds: [
        "bigquery",
        "sap_s_4hana",
      ],
    },
  ],
  escalationRules: [
    {
      trigger: "Tail spend visibility regresses past the 30% classified baseline by more than 20%",
      action: "escalate_to_human",
      handoffTarget: "Indirect Procurement Lead",
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
    "Never bypass Indirect Procurement Lead approval on escalation triggers, even when confidence is high.",
    "Never expose individual personal data (PII) in summaries; aggregate or pseudonymise before output.",
    "Never act on data older than the staleness threshold defined in the runbook without a fresh re-query.",
  ],
  goldenEvals: [
    {
      id: "tail-spend-classifier-opportunity-finder-end-to-end",
      prompt: "Run the Tail Spend Classifier & Opportunity Finder workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.",
      expectedToolCalls: [
        "query_bigquery_analytics_events",
        "query_sap_s_4hana_transactions",
        "query_coupa_requisitions",
        "lookup_tail_spend_classifier_opportunity_finder_policy_guide",
        "action_sap_s_4hana_generate",
      ],
      mustReferenceEntities: [
        "analytics_events",
        "transactions",
        "requisitions",
      ],
      mustCiteDocuments: [
        "tail-spend-classifier-opportunity-finder-policy-guide",
      ],
      expectedActionOutcome: "Action generate executed against SAP S/4HANA, with audit-trail entry and Indirect Procurement Lead notified of outcomes.",
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
    rationale: "Row counts sized for Tail Spend Classifier & Opportunity Finder so the agent can demonstrate the workflow against realistic transactional volume without simulating a production warehouse.",
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
      id: "tail-spend-classifier-opportunity-finder-policy-guide",
      sourceSystemId: "bigquery",
      type: "policy",
      title: "Tail Spend Classifier & Opportunity Finder Procurement Policy Guide",
      requiredSections: [
        "Sourcing principles",
        "Approval thresholds",
        "Supplier risk requirements",
        "Contract and compliance gates",
        "Exception handling",
      ],
      linkedEntities: [
        "analytics_events",
        "historical_metrics",
        "cached_aggregates",
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
      id: "tail-spend-classifier-opportunity-finder-baseline-gap",
      description: "Seed a realistic gap where Tail spend visibility sits between 30% classified and 95% classified, so the agent can detect, narrate, and recommend remediation.",
      affectedEntities: [
        "analytics_events",
        "historical_metrics",
      ],
      discoveryPath: [
        "Inspect BigQuery records for the affected entities",
        "Compare against SAP S/4HANA historical baseline",
        "Generate a citation-backed recommendation",
      ],
      expectedEvidence: [
        "source-system record",
        "historical baseline metric",
        "generated audit trail",
      ],
      expectedRecommendation: "Explain the gap, cite supporting evidence, and propose the next Indirect Procurement Lead action.",
    },
  ],
  datastorePackaging: {
    alloydb: {
      database: "tail_spend_classifier_opportunity_finder",
      schemas: [
        "sap_s_4hana",
        "coupa",
      ],
    },
    bigquery: {
      dataset: "procurement_tail_spend_classifier_opportunity_finder",
      tables: [
        "kpi_summary",
        "evidence_index",
      ],
    },
    cloudStorage: {
      bucketSuffix: "tail-spend-classifier-opportunity-finder-evidence",
      prefixes: [
        "documents",
        "audit-trails",
        "exports",
      ],
    },
    apis: {
      serviceName: "tail-spend-classifier-opportunity-finder-source-adapters",
      deploymentTarget: "cloud_run",
    },
  },
  validation: {
    smokePrompt: "Run the Tail Spend Classifier & Opportunity Finder workflow and cite source-system evidence for every claim.",
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

export const TailSpendClassifier = () => (
  <UseCaseSlide
    title="Tail Spend Classifier & Opportunity Finder"
    subtitle="A-1801 • Indirect & Tail Spend"
    icon={ShoppingCart}
    domainId="domain-18"
    layer="Layer 4: Data Agent"
    persona="Indirect Procurement Lead"
    systems={["BigQuery", "SAP S/4HANA", "Coupa", "Vertex AI"]}
    kpis={[
      { label: "Tail spend visibility", before: "30% classified", after: "95% classified" },
      { label: "Addressable opportunities", before: "Ad-hoc guesswork", after: "Prioritized roadmap" },
      { label: "Consolidation savings", before: "Unquantified", after: "12-18% on migrated spend" },
    ]}
    triggerType="scheduled"
    swimlane={swimlane}
    flow={flow}
    architecture={architecture}
    statusQuo={[
      "Tail spend is a black box — thousands of low-value transactions across hundreds of vendors with no visibility into what is actually being bought.",
      "Category managers focus on strategic spend; nobody owns the long tail, so fragmentation grows unchecked.",
      "PO descriptions like 'misc supplies' or 'per quote' make it impossible to classify spend without manual review."
    ]}
    agentification={[
      "Pareto analysis segments the tail by transaction distribution; ML clusters similar purchases across vendors and BUs to size consolidation opportunities.",
      "LLM reads PO descriptions to understand what is actually being bought — 'office supplies' might really be lab consumables that belong in a scientific supplier catalog.",
      "Generates a prioritized intervention roadmap: expand Staples catalog for office clusters, create preferred-provider framework for consulting clusters, migrate routine purchases to P-card."
    ]}
  />
);
