import React from "react";
import { UseCaseSlide } from "../../../agent/UseCaseSlide";
import { FlowStep } from "../../../agent/ProcessFlow";
import { SwimlaneFlow } from "../../../agent/SwimlaneFlow";
import { AgentArchitecture, UseCaseGenerationSpec, AgentBehaviorContract} from "../../../../types/architecture";
import { Database, FileInput, Tag, Brain, BarChart3 } from "lucide-react";

const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "s1", label: "Nightly ETL Trigger", lane: "system", type: "trigger" },
    { id: "a1", label: "Data Extraction", lane: "agent", type: "action" },
    { id: "a2", label: "ML Classification", lane: "agent", type: "action" },
    { id: "a3", label: "LLM Enrichment", lane: "agent", type: "action" },
    { id: "a4", label: "Spend Cube Refresh", lane: "agent", type: "output" },
  ],
  connections: [["s1", "a1"], ["a1", "a2"], ["a2", "a3"], ["a3", "a4"]],
};

const flow: FlowStep[] = [
  { label: "Data Extraction", icon: FileInput, description: "PO/invoice/contract line items extracted from ERP and procurement platforms.", trigger: "Nightly", systems: ["SAP S/4HANA", "Coupa", "Ariba"] },
  { label: "ML Classification", icon: Tag, description: "UNSPSC L1-L4 taxonomy applied to structured fields; supplier entity resolution via clustering.", systems: ["BigQuery", "SpendHQ", "Sievo"], integration: "Data Agent" },
  { label: "LLM Enrichment", icon: Brain, description: "Ambiguous PO descriptions ('per quote #4521') classified by reading vendor context, cost center, and history.", systems: ["Vertex AI"] },
  { label: "Cube Refresh", icon: BarChart3, description: "Enriched dimensional model loaded into BigQuery spend cube for analytics consumption.", output: "Spend Cube" },
];

const architecture: AgentArchitecture = {
  connections: [
    { system: "SAP S/4HANA", description: "PO/invoice line items, material master, vendor master, GL postings", direction: "read", protocol: "RFC/BAPI", category: "erp" },
    { system: "Coupa", description: "Requisition and PO data, catalog transactions, supplier records", direction: "read", protocol: "REST API", category: "erp" },
    { system: "Ariba", description: "Sourcing event data, contract-linked spend, supplier profiles", direction: "read", protocol: "REST API", category: "erp" },
    { system: "SpendHQ", description: "Spend classification rules, taxonomy management, data quality scoring", direction: "bidirectional", protocol: "REST API", category: "analytics" },
    { system: "Sievo", description: "Spend analytics enrichment, supplier normalization, category mapping", direction: "bidirectional", protocol: "REST API", category: "analytics" },
    { system: "BigQuery", description: "Dimensional spend cube, enriched data warehouse, analytics consumption layer", direction: "bidirectional", protocol: "BigQuery SQL", category: "analytics" },
    { system: "Vertex AI (Gemini)", description: "Ambiguous PO description classification, entity resolution reasoning", direction: "bidirectional", protocol: "gRPC", category: "ai" },
  ],
  pipeline: [
    { label: "Multi-Source Extraction", description: "Nightly ETL extracts PO/invoice/contract line items from ERP and procurement platforms. Data normalized across source system formats with initial deduplication and quality scoring.", systems: ["SAP S/4HANA", "Coupa", "Ariba"], layer: "integration", dataIn: "Raw PO/invoice/contract data across systems", dataOut: "Normalized transaction dataset" },
    { label: "ML Classification & Entity Resolution", description: "UNSPSC L1-L4 taxonomy classification on structured fields. Supplier entity resolution via clustering algorithms to merge name variants. Data quality scoring flags low-confidence records for LLM enrichment.", systems: ["SpendHQ", "Sievo", "BigQuery"], layer: "ml", dataIn: "Normalized transactions", dataOut: "Classified records (80% ML-confident)" },
    { label: "LLM Enrichment", description: "Gemini handles the 15-20% of transactions ML classifiers cannot confidently classify — PO descriptions like 'per quote #4521' or 'project materials — see attachment.' Reads vendor context, cost center, and purchase history to reason about correct category. Resolves entity ambiguities requiring business judgment.", systems: ["Vertex AI (Gemini)"], layer: "llm", dataIn: "Low-confidence records with context", dataOut: "Fully enriched spend cube (97%+ classified)" },
  ],
};


const behaviorContract: AgentBehaviorContract = {
  role: "Procurement Analytics Lead agent for the Spend Cube Builder & Enrichment workflow",
  primaryObjective: "ML taxonomy classifies 80% of transactions; LLM handles the remaining ambiguous 20% by reading vendor context and purchase history. Gemini resolves entity ambiguities requiring business judgment — same parent company or different legal entity. so the Procurement Analytics Lead can move the Classification accuracy KPI.",
  inScope: [
    "ML taxonomy classifies 80% of transactions; LLM handles the remaining ambiguous 20% by reading vendor context and purchase history",
    "Gemini resolves entity ambiguities requiring business judgment — same parent company or different legal entity",
    "Nightly automated enrichment replaces weeks of manual data wrangling",
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
      description: "Retrieve transactions from SAP S/4HANA for the Spend Cube Builder & Enrichment workflow.",
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
      description: "Retrieve requisitions from Coupa for the Spend Cube Builder & Enrichment workflow.",
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
      name: "query_ariba_ariba_records",
      kind: "query",
      sourceSystemId: "ariba",
      description: "Retrieve ariba records from Ariba for the Spend Cube Builder & Enrichment workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "ariba_records_records",
        "ariba_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_spendhq_spendhq_records",
      kind: "query",
      sourceSystemId: "spendhq",
      description: "Retrieve spendhq records from SpendHQ for the Spend Cube Builder & Enrichment workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "spendhq_records_records",
        "spendhq_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "lookup_spend_cube_builder_enrichment_policy_guide",
      kind: "evidence_lookup",
      sourceSystemId: "bigquery",
      description: "Look up sections of the Spend Cube Builder & Enrichment Procurement Policy Guide to cite in narrative output, escalation rationale, and audit evidence.",
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
      name: "action_sap_s_4hana_enrich",
      kind: "action",
      sourceSystemId: "sap_s_4hana",
      description: "Execute the enrich step in SAP S/4HANA after the agent has gathered evidence and validated escalation gates.",
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
      claim: "Classification accuracy moved from 80-85% toward 97%+",
      mustCite: [
        "sap_s_4hana.transactions",
        "coupa.requisitions",
      ],
      sourceSystemIds: [
        "sap_s_4hana",
        "coupa",
      ],
    },
    {
      claim: "Enrichment cycle time moved from 2-3 weeks manual toward Overnight automated",
      mustCite: [
        "sap_s_4hana.transactions",
        "coupa.requisitions",
      ],
      sourceSystemIds: [
        "sap_s_4hana",
        "coupa",
      ],
    },
  ],
  escalationRules: [
    {
      trigger: "Classification accuracy regresses past the 80-85% baseline by more than 20%",
      action: "escalate_to_human",
      handoffTarget: "Procurement Analytics Lead",
      rationale: "Significant regressions need human judgment before automated remediation runs against production records.",
    },
    {
      trigger: "Source-system evidence is incomplete or stale (>24h) for any required entity",
      action: "request_more_info",
      rationale: "Recommendations grounded in stale evidence misrepresent current state and undermine audit defensibility.",
    },
    {
      trigger: "Proposed enrich action lacks supporting evidence from at least two systems",
      action: "refuse",
      rationale: "Single-system evidence is insufficient to authorize external state changes without manual review.",
    },
  ],
  refusalRules: [
    "Never fabricate metric values; only publish numbers derived from SAP S/4HANA (and other named systems) entities.",
    "Never bypass Procurement Analytics Lead approval on escalation triggers, even when confidence is high.",
    "Never expose individual personal data (PII) in summaries; aggregate or pseudonymise before output.",
    "Never act on data older than the staleness threshold defined in the runbook without a fresh re-query.",
  ],
  goldenEvals: [
    {
      id: "spend-cube-builder-enrichment-end-to-end",
      prompt: "Run the Spend Cube Builder & Enrichment workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.",
      expectedToolCalls: [
        "query_sap_s_4hana_transactions",
        "query_coupa_requisitions",
        "query_ariba_ariba_records",
        "query_spendhq_spendhq_records",
        "lookup_spend_cube_builder_enrichment_policy_guide",
        "action_sap_s_4hana_enrich",
      ],
      mustReferenceEntities: [
        "transactions",
        "requisitions",
        "ariba_records",
        "spendhq_records",
        "sievo_records",
        "analytics_events",
      ],
      mustCiteDocuments: [
        "spend-cube-builder-enrichment-policy-guide",
      ],
      expectedActionOutcome: "Action enrich executed against SAP S/4HANA, with audit-trail entry and Procurement Analytics Lead notified of outcomes.",
      forbiddenBehaviors: [
        "do not invent KPI numbers",
        "do not skip the evidence_lookup step before any recommendation",
        "do not execute enrich without two-system evidence",
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
    rationale: "Row counts sized for Spend Cube Builder & Enrichment so the agent can demonstrate the workflow against realistic transactional volume without simulating a production warehouse.",
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
      id: "ariba",
      name: "Ariba",
      owns: [
        "ariba_records",
        "ariba_events",
        "ariba_audit_trail",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_ariba_ariba_records",
        "query_ariba_ariba_events",
        "query_ariba_ariba_audit_trail",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
    {
      id: "spendhq",
      name: "SpendHQ",
      owns: [
        "spendhq_records",
        "spendhq_events",
        "spendhq_audit_trail",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_spendhq_spendhq_records",
        "query_spendhq_spendhq_events",
        "query_spendhq_spendhq_audit_trail",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
    {
      id: "sievo",
      name: "Sievo",
      owns: [
        "sievo_records",
        "sievo_events",
        "sievo_audit_trail",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_sievo_sievo_records",
        "query_sievo_sievo_events",
        "query_sievo_sievo_audit_trail",
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
    {
      name: "ariba_records",
      sourceSystemId: "ariba",
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
      name: "ariba_events",
      sourceSystemId: "ariba",
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
          name: "ariba_record_id",
          type: "ref",
          ref: "ariba_records.id",
          required: true,
        },
      ],
    },
    {
      name: "ariba_audit_trail",
      sourceSystemId: "ariba",
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
      ],
    },
    {
      name: "spendhq_records",
      sourceSystemId: "spendhq",
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
      name: "spendhq_events",
      sourceSystemId: "spendhq",
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
          name: "spendhq_record_id",
          type: "ref",
          ref: "spendhq_records.id",
          required: true,
        },
      ],
    },
    {
      name: "spendhq_audit_trail",
      sourceSystemId: "spendhq",
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
      ],
    },
    {
      name: "sievo_records",
      sourceSystemId: "sievo",
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
      name: "sievo_events",
      sourceSystemId: "sievo",
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
          name: "sievo_record_id",
          type: "ref",
          ref: "sievo_records.id",
          required: true,
        },
      ],
    },
    {
      name: "sievo_audit_trail",
      sourceSystemId: "sievo",
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
      from: "ariba_events.ariba_record_id",
      to: "ariba_records.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
    {
      from: "spendhq_events.spendhq_record_id",
      to: "spendhq_records.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
    {
      from: "sievo_events.sievo_record_id",
      to: "sievo_records.id",
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
      id: "spend-cube-builder-enrichment-policy-guide",
      sourceSystemId: "bigquery",
      type: "policy",
      title: "Spend Cube Builder & Enrichment Procurement Policy Guide",
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
      id: "sap_s_4hana_enrich_api",
      sourceSystemId: "sap_s_4hana",
      method: "POST",
      path: "/api/sap_s_4hana/enrich",
      description: "Synchronous endpoint the agent calls to enrich in SAP S/4HANA after evidence gating.",
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
      id: "spend-cube-builder-enrichment-baseline-gap",
      description: "Seed a realistic gap where Classification accuracy sits between 80-85% and 97%+, so the agent can detect, narrate, and recommend remediation.",
      affectedEntities: [
        "transactions",
        "journal_entries",
      ],
      discoveryPath: [
        "Inspect SAP S/4HANA records for the affected entities",
        "Compare against Coupa historical baseline",
        "Generate a citation-backed recommendation",
      ],
      expectedEvidence: [
        "source-system record",
        "historical baseline metric",
        "generated audit trail",
      ],
      expectedRecommendation: "Explain the gap, cite supporting evidence, and propose the next Procurement Analytics Lead action.",
    },
  ],
  datastorePackaging: {
    alloydb: {
      database: "spend_cube_builder_enrichment",
      schemas: [
        "sap_s_4hana",
        "coupa",
        "ariba",
        "spendhq",
        "sievo",
      ],
    },
    bigquery: {
      dataset: "procurement_spend_cube_builder_enrichment",
      tables: [
        "kpi_summary",
        "evidence_index",
      ],
    },
    cloudStorage: {
      bucketSuffix: "spend-cube-builder-enrichment-evidence",
      prefixes: [
        "documents",
        "audit-trails",
        "exports",
      ],
    },
    apis: {
      serviceName: "spend-cube-builder-enrichment-source-adapters",
      deploymentTarget: "cloud_run",
    },
  },
  validation: {
    smokePrompt: "Run the Spend Cube Builder & Enrichment workflow and cite source-system evidence for every claim.",
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

export const SpendCubeBuilderEnrichment = () => (
  <UseCaseSlide
    title="Spend Cube Builder & Enrichment"
    subtitle="A-1901 • Spend Analytics"
    icon={Database}
    domainId="domain-19"
    layer="Layer 4: Data Agent"
    persona="Procurement Analytics Lead"
    systems={["SAP S/4HANA", "Coupa", "Ariba", "SpendHQ", "Sievo", "BigQuery"]}
    kpis={[
      { label: "Classification accuracy", before: "80-85%", after: "97%+" },
      { label: "Enrichment cycle time", before: "2-3 weeks manual", after: "Overnight automated" },
      { label: "Unclassified spend", before: "15-20%", after: "<3%" },
    ]}
    triggerType="scheduled"
    swimlane={swimlane}
    flow={flow}
    architecture={architecture}
    statusQuo={[
      "15-20% of PO line items unclassifiable — descriptions like 'misc. parts per drawing Rev C' defeat rule-based engines.",
      "Supplier entity resolution handled manually — 'Acme Corp' vs. 'Acme Holdings GmbH' requires analyst judgment.",
      "Spend cube refresh takes 2-3 weeks with manual cleansing, delaying category insights."
    ]}
    agentification={[
      "ML taxonomy classifies 80% of transactions; LLM handles the remaining ambiguous 20% by reading vendor context and purchase history.",
      "Gemini resolves entity ambiguities requiring business judgment — same parent company or different legal entity.",
      "Nightly automated enrichment replaces weeks of manual data wrangling."
    ]}
  />
);
