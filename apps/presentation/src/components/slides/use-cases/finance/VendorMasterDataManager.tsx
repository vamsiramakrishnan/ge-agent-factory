import React from "react";
import { UseCaseSlide } from "../../../agent/UseCaseSlide";
import { FlowStep } from "../../../agent/ProcessFlow";
import { SwimlaneFlow } from "../../../agent/SwimlaneFlow";
import { AgentArchitecture, UseCaseGenerationSpec, AgentBehaviorContract} from "../../../../types/architecture";
import { Database, Search, Shield, AlertTriangle, CheckCircle } from "lucide-react";

const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "s1", label: "Vendor Request", lane: "system", type: "trigger" },
    { id: "a1", label: "Data Validation", lane: "agent", type: "action" },
    { id: "a2", label: "Duplicate Check", lane: "agent", type: "action" },
    { id: "a3", label: "Identity Resolution", lane: "agent", type: "action" },
    { id: "h1", label: "AP Manager Reviews", lane: "human", type: "hitl" },
    { id: "a4", label: "Master Updated", lane: "agent", type: "output" },
  ],
  connections: [["s1", "a1"], ["a1", "a2"], ["a2", "a3"], ["a3", "h1"], ["h1", "a4"]],
};

const flow: FlowStep[] = [
  { label: "Request Intake", icon: Database, description: "Receive new vendor request or periodic review trigger.", trigger: "Event / Periodic", systems: ["SAP S/4HANA", "Coupa"] },
  { label: "Validation & Screening", icon: Shield, description: "Validate vendor data, verify banking details, check D&B and IRS TIN matching.", systems: ["D&B", "IRS TIN"], integration: "ADK" },
  { label: "Identity Resolution", icon: Search, description: "Resolve vendor identity ambiguity — name variants, related entities, shared bank accounts.", systems: ["Vertex AI"] },
  { label: "Master Update", icon: CheckCircle, description: "Update vendor master record after AP Manager review of flagged items.", output: "Updated Vendor Master" },
];

const architecture: AgentArchitecture = {
  connections: [
    { system: "SAP S/4HANA (Vendor Master)", description: "Vendor records, banking details, payment terms, tax IDs", direction: "bidirectional", protocol: "RFC/BAPI", category: "erp" },
    { system: "Coupa", description: "Supplier profiles, onboarding data, catalog information", direction: "read", protocol: "REST API", category: "erp" },
    { system: "D&B (Dun & Bradstreet)", description: "Business verification, DUNS numbers, financial health scores", direction: "read", protocol: "REST API", category: "market-data" },
    { system: "IRS TIN Matching", description: "Tax ID verification, W-9 validation", direction: "read", protocol: "REST API", category: "market-data" },
    { system: "Vertex AI (Gemini)", description: "Vendor identity ambiguity resolution, related entity detection", direction: "bidirectional", protocol: "gRPC", category: "ai" },
  ],
  pipeline: [
    { label: "Data Collection & Validation", description: "Collect vendor data from request form or existing master. Validate TIN against IRS matching service, verify business existence via D&B.", systems: ["SAP S/4HANA", "D&B", "IRS TIN"], layer: "integration", dataIn: "Vendor request or existing record", dataOut: "Validated vendor data with verification status" },
    { label: "Duplicate & Quality Detection", description: "Check for duplicate vendors using data quality scoring — name similarity, address matching, TIN comparison. Identify dormant vendors for cleanup.", systems: ["BigQuery", "SAP S/4HANA"], layer: "ml", dataIn: "Validated vendor data + existing master", dataOut: "Duplicate flags + quality scores" },
    { label: "Identity Resolution", description: "Gemini resolves vendor identity ambiguity — are 'Acme Corp' and 'Acme Industries LLC' the same entity? Analyzes TIN, bank accounts, addresses, and corporate relationships.", systems: ["Vertex AI (Gemini)"], layer: "llm", dataIn: "Duplicate flags + vendor context", dataOut: "Resolution recommendations with evidence" },
    { label: "Master Update & Audit", description: "Update vendor master after AP Manager review. Maintain full audit trail of changes with verification evidence.", systems: ["SAP S/4HANA", "Coupa"], layer: "integration", dataIn: "Approved vendor data", dataOut: "Updated master + audit trail" },
  ],
};


const behaviorContract: AgentBehaviorContract = {
  role: "AP Manager agent for the Vendor Master Data Manager workflow",
  primaryObjective: "Automated TIN verification, D&B validation, and bank detail screening at onboarding. ML-based duplicate detection catches name variants and related entities before they enter the master. so the AP Manager can move the Vendor onboarding time KPI.",
  inScope: [
    "Automated TIN verification, D&B validation, and bank detail screening at onboarding",
    "ML-based duplicate detection catches name variants and related entities before they enter the master",
    "Gemini resolves identity ambiguity by analyzing TIN, bank accounts, and corporate relationships",
  ],
  outOfScope: [
    "Final sign-off on materially significant journal entries (Controller retains authority)",
    "Restatement of prior-period filings",
    "Tax position changes that require external advisor review",
  ],
  toolIntents: [
    {
      name: "query_sap_s_4hana_transactions",
      kind: "query",
      sourceSystemId: "sap_s_4hana",
      description: "Retrieve transactions from SAP S/4HANA for the Vendor Master Data Manager workflow.",
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
      description: "Retrieve requisitions from Coupa for the Vendor Master Data Manager workflow.",
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
      name: "query_d_b_d_b_records",
      kind: "query",
      sourceSystemId: "d_b",
      description: "Retrieve d b records from D&B for the Vendor Master Data Manager workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "d_b_records_records",
        "d_b_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_irs_tin_matching_irs_tin_matching_records",
      kind: "query",
      sourceSystemId: "irs_tin_matching",
      description: "Retrieve irs tin matching records from IRS TIN Matching for the Vendor Master Data Manager workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "irs_tin_matching_records_records",
        "irs_tin_matching_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "lookup_vendor_master_data_manager_controls_playbook",
      kind: "evidence_lookup",
      sourceSystemId: "sap_s_4hana",
      description: "Look up sections of the Vendor Master Data Manager Controls Playbook to cite in narrative output, escalation rationale, and audit evidence.",
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
      name: "action_sap_s_4hana_onboard",
      kind: "action",
      sourceSystemId: "sap_s_4hana",
      description: "Execute the onboard step in SAP S/4HANA after the agent has gathered evidence and validated escalation gates.",
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
      claim: "Vendor onboarding time moved from 5-7 days toward 1 day",
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
      claim: "Duplicate vendors moved from 8% of master toward < 1%",
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
      trigger: "Vendor onboarding time regresses past the 5-7 days baseline by more than 20%",
      action: "escalate_to_human",
      handoffTarget: "AP Manager",
      rationale: "Significant regressions need human judgment before automated remediation runs against production records.",
    },
    {
      trigger: "Source-system evidence is incomplete or stale (>24h) for any required entity",
      action: "request_more_info",
      rationale: "Recommendations grounded in stale evidence misrepresent current state and undermine audit defensibility.",
    },
    {
      trigger: "Proposed onboard action lacks supporting evidence from at least two systems",
      action: "refuse",
      rationale: "Single-system evidence is insufficient to authorize external state changes without manual review.",
    },
  ],
  refusalRules: [
    "Never fabricate metric values; only publish numbers derived from SAP S/4HANA (and other named systems) entities.",
    "Never bypass AP Manager approval on escalation triggers, even when confidence is high.",
    "Never expose individual personal data (PII) in summaries; aggregate or pseudonymise before output.",
    "Never act on data older than the staleness threshold defined in the runbook without a fresh re-query.",
  ],
  goldenEvals: [
    {
      id: "vendor-master-data-manager-end-to-end",
      prompt: "Run the Vendor Master Data Manager workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.",
      expectedToolCalls: [
        "query_sap_s_4hana_transactions",
        "query_coupa_requisitions",
        "query_d_b_d_b_records",
        "query_irs_tin_matching_irs_tin_matching_records",
        "lookup_vendor_master_data_manager_controls_playbook",
        "action_sap_s_4hana_onboard",
      ],
      mustReferenceEntities: [
        "transactions",
        "requisitions",
        "d_b_records",
        "irs_tin_matching_records",
      ],
      mustCiteDocuments: [
        "vendor-master-data-manager-controls-playbook",
      ],
      expectedActionOutcome: "Action onboard executed against SAP S/4HANA, with audit-trail entry and AP Manager notified of outcomes.",
      forbiddenBehaviors: [
        "do not invent KPI numbers",
        "do not skip the evidence_lookup step before any recommendation",
        "do not execute onboard without two-system evidence",
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
    rationale: "Row counts sized for Vendor Master Data Manager so the agent can demonstrate the workflow against realistic transactional volume without simulating a production warehouse.",
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
      id: "d_b",
      name: "D&B",
      owns: [
        "d_b_records",
        "d_b_events",
        "d_b_audit_trail",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_d_b_d_b_records",
        "query_d_b_d_b_events",
        "query_d_b_d_b_audit_trail",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
    {
      id: "irs_tin_matching",
      name: "IRS TIN Matching",
      owns: [
        "irs_tin_matching_records",
        "irs_tin_matching_events",
        "irs_tin_matching_audit_trail",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_irs_tin_matching_irs_tin_matching_records",
        "query_irs_tin_matching_irs_tin_matching_events",
        "query_irs_tin_matching_irs_tin_matching_audit_trail",
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
      name: "d_b_records",
      sourceSystemId: "d_b",
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
      name: "d_b_events",
      sourceSystemId: "d_b",
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
          name: "d_b_record_id",
          type: "ref",
          ref: "d_b_records.id",
          required: true,
        },
      ],
    },
    {
      name: "d_b_audit_trail",
      sourceSystemId: "d_b",
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
      name: "irs_tin_matching_records",
      sourceSystemId: "irs_tin_matching",
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
      name: "irs_tin_matching_events",
      sourceSystemId: "irs_tin_matching",
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
          name: "irs_tin_matching_record_id",
          type: "ref",
          ref: "irs_tin_matching_records.id",
          required: true,
        },
      ],
    },
    {
      name: "irs_tin_matching_audit_trail",
      sourceSystemId: "irs_tin_matching",
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
  ],
  relationships: [
    {
      from: "d_b_events.d_b_record_id",
      to: "d_b_records.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
    {
      from: "irs_tin_matching_events.irs_tin_matching_record_id",
      to: "irs_tin_matching_records.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
  ],
  documents: [
    {
      id: "vendor-master-data-manager-controls-playbook",
      sourceSystemId: "sap_s_4hana",
      type: "policy",
      title: "Vendor Master Data Manager Controls Playbook",
      requiredSections: [
        "Workflow scope",
        "Materiality thresholds",
        "Escalation triggers",
        "Audit evidence requirements",
        "Quarter-end variations",
      ],
      linkedEntities: [
        "transactions",
        "journal_entries",
        "master_data",
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
  apis: [
    {
      id: "sap_s_4hana_onboard_api",
      sourceSystemId: "sap_s_4hana",
      method: "POST",
      path: "/api/sap_s_4hana/onboard",
      description: "Synchronous endpoint the agent calls to onboard in SAP S/4HANA after evidence gating.",
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
      id: "vendor-master-data-manager-baseline-gap",
      description: "Seed a realistic gap where Vendor onboarding time sits between 5-7 days and 1 day, so the agent can detect, narrate, and recommend remediation.",
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
      expectedRecommendation: "Explain the gap, cite supporting evidence, and propose the next AP Manager action.",
    },
  ],
  datastorePackaging: {
    alloydb: {
      database: "vendor_master_data_manager",
      schemas: [
        "sap_s_4hana",
        "coupa",
        "d_b",
        "irs_tin_matching",
      ],
    },
    bigquery: {
      dataset: "finance_vendor_master_data_manager",
      tables: [
        "kpi_summary",
        "evidence_index",
      ],
    },
    cloudStorage: {
      bucketSuffix: "vendor-master-data-manager-evidence",
      prefixes: [
        "documents",
        "audit-trails",
        "exports",
      ],
    },
    apis: {
      serviceName: "vendor-master-data-manager-source-adapters",
      deploymentTarget: "cloud_run",
    },
  },
  validation: {
    smokePrompt: "Run the Vendor Master Data Manager workflow and cite source-system evidence for every claim.",
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

export const VendorMasterDataManager = () => (
  <UseCaseSlide
    title="Vendor Master Data Manager"
    subtitle="A-2205 • Accounts Payable"
    icon={Database}
    domainId="domain-22"
    layer="Layer 3: Custom ADK"
    persona="AP Manager"
    systems={["SAP S/4HANA", "Coupa", "D&B", "IRS TIN Matching", "Vertex AI"]}
    kpis={[
      { label: "Vendor onboarding time", before: "5-7 days", after: "1 day" },
      { label: "Duplicate vendors", before: "8% of master", after: "< 1%" },
      { label: "Fraudulent vendor risk", before: "Discovered post-payment", after: "Blocked at onboarding" },
    ]}
    triggerType="event"
    swimlane={swimlane}
    flow={flow}
    architecture={architecture}
    hitl={{ actor: "AP Manager", action: "Review flagged vendors", description: "AP Manager reviews vendors flagged for identity ambiguity, duplicate suspicion, or suspicious banking details before approving master data changes." }}
    statusQuo={[
      "Vendor onboarding takes 5-7 days with manual TIN verification and bank detail confirmation.",
      "Duplicate vendors accumulate over time — 8% of the master is estimated duplicates.",
      "Vendor identity ambiguity (name changes, related entities) not systematically detected."
    ]}
    agentification={[
      "Automated TIN verification, D&B validation, and bank detail screening at onboarding.",
      "ML-based duplicate detection catches name variants and related entities before they enter the master.",
      "Gemini resolves identity ambiguity by analyzing TIN, bank accounts, and corporate relationships."
    ]}
  />
);
