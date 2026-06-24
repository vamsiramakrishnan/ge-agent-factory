import React from "react";
import { UseCaseSlide } from "../../../agent/UseCaseSlide";
import { FlowStep } from "../../../agent/ProcessFlow";
import { SwimlaneFlow } from "../../../agent/SwimlaneFlow";
import { AgentArchitecture, UseCaseGenerationSpec, AgentBehaviorContract} from "../../../../types/architecture";
import { GitMerge, FileText, Search, Brain, CheckCircle } from "lucide-react";

const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "s1", label: "Invoice Received", lane: "system", type: "trigger" },
    { id: "a1", label: "Fuzzy Matching", lane: "agent", type: "action" },
    { id: "a2", label: "Exception Analysis", lane: "agent", type: "action" },
    { id: "a3", label: "Resolution Proposal", lane: "agent", type: "output" },
    { id: "h1", label: "AP Manager Review", lane: "human", type: "hitl" },
  ],
  connections: [["s1", "a1"], ["a1", "a2"], ["a2", "a3"], ["a3", "h1"]],
};

const flow: FlowStep[] = [
  { label: "Invoice Ingested", icon: FileText, description: "Invoice received and PO + goods receipt data pulled from ERP for matching.", trigger: "Event-driven", systems: ["SAP S/4HANA (MIRO)", "Kofax"] },
  { label: "Fuzzy Match", icon: Search, description: "PO, goods receipt, and invoice matched with configurable tolerances. Auto-post on match.", systems: ["Coupa Pay", "Basware"], integration: "ADK" },
  { label: "Exception Reasoning", icon: Brain, description: "LLM reads invoice descriptions for context — 'includes $2,340 expedited shipping per email approval from John Smith.'", systems: ["Vertex AI"] },
  { label: "AP Manager Decides", icon: CheckCircle, description: "Context-aware resolution recommendations presented to AP Manager for above-threshold exceptions.", output: "Matched Invoice" },
];

const architecture: AgentArchitecture = {
  connections: [
    { system: "SAP S/4HANA", description: "PO data, goods receipt (MIRO/MIR7), invoice posting, price and quantity tolerances", direction: "bidirectional", protocol: "RFC/BAPI", category: "erp" },
    { system: "Coupa Pay", description: "Invoice receipt, matching rules, auto-post for matched invoices, exception routing", direction: "bidirectional", protocol: "REST API", category: "erp" },
    { system: "Basware", description: "AP automation workflows, invoice processing pipeline, exception queue management", direction: "bidirectional", protocol: "REST API", category: "erp" },
    { system: "Kofax", description: "Invoice image capture, OCR-extracted invoice data for matching", direction: "read", protocol: "REST API", category: "erp" },
    { system: "Vertex AI (Gemini)", description: "Exception reasoning — reads invoice descriptions to understand context behind discrepancies", direction: "bidirectional", protocol: "gRPC", category: "ai" },
    { system: "BigQuery", description: "Historical exception patterns, auto-resolution rule training data", direction: "read", protocol: "BigQuery SQL", category: "analytics" },
  ],
  pipeline: [
    { label: "Data Assembly", description: "Pull PO data and goods receipt from ERP, receive invoice from AP automation platform. Align line items across all three documents for matching.", systems: ["SAP S/4HANA", "Coupa Pay", "Kofax"], layer: "integration", dataIn: "PO + goods receipt + invoice documents", dataOut: "Aligned three-way document set by line item" },
    { label: "Fuzzy Matching & Auto-Resolution", description: "Execute matching with configurable tolerances. Auto-resolve common exceptions: quantity within tolerance, price rounding differences, tax calculation variances. Anomaly detection on discrepancy patterns.", systems: ["Basware", "BigQuery"], layer: "ml", dataIn: "Aligned PO/GR/invoice line items", dataOut: "Match results with auto-resolved exceptions and remaining outliers" },
    { label: "Exception Reasoning", description: "For unresolved exceptions, LLM reads invoice descriptions for context: an invoice for $52,340 against a $50,000 PO where the description says 'includes $2,340 expedited shipping per email approval from John Smith' triggers a PO change order recommendation, not a rejection. Interprets credit memos with partial credits across multiple invoices.", systems: ["Vertex AI (Gemini)"], layer: "llm", dataIn: "Unresolved exceptions with invoice descriptions", dataOut: "Context-aware resolution recommendations with evidence" },
    { label: "Posting & Escalation", description: "Auto-post matched invoices. Route above-threshold exceptions with resolution recommendations and supporting evidence to AP Manager for review.", systems: ["SAP S/4HANA", "Coupa Pay"], layer: "integration", dataIn: "Match results + resolution recommendations", dataOut: "Posted invoices + escalated exceptions" },
  ],
};


const behaviorContract: AgentBehaviorContract = {
  role: "AP Manager agent for the Three-Way Match Exception Handler workflow",
  primaryObjective: "Fuzzy matching auto-resolves 75% of exceptions — qty tolerances, tax rounding, price adjustments within contract bands. LLM reads invoice line descriptions to understand context: 'includes expedited shipping per email approval' triggers a PO change order, not a rejection. so the AP Manager can move the Exception rate KPI.",
  inScope: [
    "Fuzzy matching auto-resolves 75% of exceptions — qty tolerances, tax rounding, price adjustments within contract bands",
    "LLM reads invoice line descriptions to understand context: 'includes expedited shipping per email approval' triggers a PO change order, not a rejection",
    "Generates context-aware resolution recommendations with supporting evidence for AP Manager review",
  ],
  outOfScope: [
    "Contract execution without legal review",
    "Supplier disqualification decisions (category lead retains authority)",
    "Single-source justification overrides above policy threshold",
  ],
  toolIntents: [
    {
      name: "query_sap_s_4hana_miro_mir7_sap_s_4hana_miro_mir7_records",
      kind: "query",
      sourceSystemId: "sap_s_4hana_miro_mir7",
      description: "Retrieve sap s 4hana miro mir7 records from SAP S/4HANA (MIRO/MIR7) for the Three-Way Match Exception Handler workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "sap_s_4hana_miro_mir7_records_records",
        "sap_s_4hana_miro_mir7_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_coupa_pay_requisitions",
      kind: "query",
      sourceSystemId: "coupa_pay",
      description: "Retrieve requisitions from Coupa Pay for the Three-Way Match Exception Handler workflow.",
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
      name: "query_basware_basware_records",
      kind: "query",
      sourceSystemId: "basware",
      description: "Retrieve basware records from Basware for the Three-Way Match Exception Handler workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "basware_records_records",
        "basware_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_kofax_kofax_records",
      kind: "query",
      sourceSystemId: "kofax",
      description: "Retrieve kofax records from Kofax for the Three-Way Match Exception Handler workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "kofax_records_records",
        "kofax_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "lookup_three_way_match_exception_handler_policy_guide",
      kind: "evidence_lookup",
      sourceSystemId: "sap_s_4hana_miro_mir7",
      description: "Look up sections of the Three-Way Match Exception Handler Procurement Policy Guide to cite in narrative output, escalation rationale, and audit evidence.",
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
      name: "action_sap_s_4hana_miro_mir7_recommend",
      kind: "action",
      sourceSystemId: "sap_s_4hana_miro_mir7",
      description: "Execute the recommend step in SAP S/4HANA (MIRO/MIR7) after the agent has gathered evidence and validated escalation gates.",
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
      claim: "Exception rate moved from 25-35% toward 5-8%",
      mustCite: [
        "sap_s_4hana_miro_mir7.sap_s_4hana_miro_mir7_records",
        "coupa_pay.requisitions",
      ],
      sourceSystemIds: [
        "sap_s_4hana_miro_mir7",
        "coupa_pay",
      ],
    },
    {
      claim: "Avg resolution time moved from 3-5 days toward 4 hours",
      mustCite: [
        "sap_s_4hana_miro_mir7.sap_s_4hana_miro_mir7_records",
        "coupa_pay.requisitions",
      ],
      sourceSystemIds: [
        "sap_s_4hana_miro_mir7",
        "coupa_pay",
      ],
    },
  ],
  escalationRules: [
    {
      trigger: "Exception rate regresses past the 25-35% baseline by more than 20%",
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
      trigger: "Proposed recommend action lacks supporting evidence from at least two systems",
      action: "refuse",
      rationale: "Single-system evidence is insufficient to authorize external state changes without manual review.",
    },
  ],
  refusalRules: [
    "Never fabricate metric values; only publish numbers derived from SAP S/4HANA (MIRO/MIR7) (and other named systems) entities.",
    "Never bypass AP Manager approval on escalation triggers, even when confidence is high.",
    "Never expose individual personal data (PII) in summaries; aggregate or pseudonymise before output.",
    "Never act on data older than the staleness threshold defined in the runbook without a fresh re-query.",
  ],
  goldenEvals: [
    {
      id: "three-way-match-exception-handler-end-to-end",
      prompt: "Run the Three-Way Match Exception Handler workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.",
      expectedToolCalls: [
        "query_sap_s_4hana_miro_mir7_sap_s_4hana_miro_mir7_records",
        "query_coupa_pay_requisitions",
        "query_basware_basware_records",
        "query_kofax_kofax_records",
        "lookup_three_way_match_exception_handler_policy_guide",
        "action_sap_s_4hana_miro_mir7_recommend",
      ],
      mustReferenceEntities: [
        "sap_s_4hana_miro_mir7_records",
        "requisitions",
        "basware_records",
        "kofax_records",
      ],
      mustCiteDocuments: [
        "three-way-match-exception-handler-policy-guide",
      ],
      expectedActionOutcome: "Action recommend executed against SAP S/4HANA (MIRO/MIR7), with audit-trail entry and AP Manager notified of outcomes.",
      forbiddenBehaviors: [
        "do not invent KPI numbers",
        "do not skip the evidence_lookup step before any recommendation",
        "do not execute recommend without two-system evidence",
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
    rationale: "Row counts sized for Three-Way Match Exception Handler so the agent can demonstrate the workflow against realistic transactional volume without simulating a production warehouse.",
  },
  sourceSystems: [
    {
      id: "sap_s_4hana_miro_mir7",
      name: "SAP S/4HANA (MIRO/MIR7)",
      owns: [
        "sap_s_4hana_miro_mir7_records",
        "sap_s_4hana_miro_mir7_events",
        "sap_s_4hana_miro_mir7_audit_trail",
      ],
      protocol: "RFC/BAPI",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_sap_s_4hana_miro_mir7_sap_s_4hana_miro_mir7_records",
        "query_sap_s_4hana_miro_mir7_sap_s_4hana_miro_mir7_events",
        "query_sap_s_4hana_miro_mir7_sap_s_4hana_miro_mir7_audit_trail",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
    {
      id: "coupa_pay",
      name: "Coupa Pay",
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
        "query_coupa_pay_requisitions",
        "query_coupa_pay_purchase_orders",
        "query_coupa_pay_invoices",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
    {
      id: "basware",
      name: "Basware",
      owns: [
        "basware_records",
        "basware_events",
        "basware_audit_trail",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_basware_basware_records",
        "query_basware_basware_events",
        "query_basware_basware_audit_trail",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
    {
      id: "kofax",
      name: "Kofax",
      owns: [
        "kofax_records",
        "kofax_events",
        "kofax_audit_trail",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_kofax_kofax_records",
        "query_kofax_kofax_events",
        "query_kofax_kofax_audit_trail",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
  ],
  entities: [
    {
      name: "sap_s_4hana_miro_mir7_records",
      sourceSystemId: "sap_s_4hana_miro_mir7",
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
      name: "sap_s_4hana_miro_mir7_events",
      sourceSystemId: "sap_s_4hana_miro_mir7",
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
          name: "sap_s_4hana_miro_mir7_record_id",
          type: "ref",
          ref: "sap_s_4hana_miro_mir7_records.id",
          required: true,
        },
      ],
    },
    {
      name: "sap_s_4hana_miro_mir7_audit_trail",
      sourceSystemId: "sap_s_4hana_miro_mir7",
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
      name: "requisitions",
      sourceSystemId: "coupa_pay",
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
      sourceSystemId: "coupa_pay",
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
      sourceSystemId: "coupa_pay",
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
      name: "basware_records",
      sourceSystemId: "basware",
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
      name: "basware_events",
      sourceSystemId: "basware",
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
          name: "basware_record_id",
          type: "ref",
          ref: "basware_records.id",
          required: true,
        },
      ],
    },
    {
      name: "basware_audit_trail",
      sourceSystemId: "basware",
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
      name: "kofax_records",
      sourceSystemId: "kofax",
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
      name: "kofax_events",
      sourceSystemId: "kofax",
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
          name: "kofax_record_id",
          type: "ref",
          ref: "kofax_records.id",
          required: true,
        },
      ],
    },
    {
      name: "kofax_audit_trail",
      sourceSystemId: "kofax",
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
      from: "sap_s_4hana_miro_mir7_events.sap_s_4hana_miro_mir7_record_id",
      to: "sap_s_4hana_miro_mir7_records.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
    {
      from: "basware_events.basware_record_id",
      to: "basware_records.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
    {
      from: "kofax_events.kofax_record_id",
      to: "kofax_records.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
  ],
  documents: [
    {
      id: "three-way-match-exception-handler-policy-guide",
      sourceSystemId: "sap_s_4hana_miro_mir7",
      type: "policy",
      title: "Three-Way Match Exception Handler Procurement Policy Guide",
      requiredSections: [
        "Sourcing principles",
        "Approval thresholds",
        "Supplier risk requirements",
        "Contract and compliance gates",
        "Exception handling",
      ],
      linkedEntities: [
        "sap_s_4hana_miro_mir7_records",
        "sap_s_4hana_miro_mir7_events",
        "sap_s_4hana_miro_mir7_audit_trail",
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
      id: "sap_s_4hana_miro_mir7_recommend_api",
      sourceSystemId: "sap_s_4hana_miro_mir7",
      method: "POST",
      path: "/api/sap_s_4hana_miro_mir7/recommend",
      description: "Synchronous endpoint the agent calls to recommend in SAP S/4HANA (MIRO/MIR7) after evidence gating.",
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
      id: "three-way-match-exception-handler-baseline-gap",
      description: "Seed a realistic gap where Exception rate sits between 25-35% and 5-8%, so the agent can detect, narrate, and recommend remediation.",
      affectedEntities: [
        "sap_s_4hana_miro_mir7_records",
        "sap_s_4hana_miro_mir7_events",
      ],
      discoveryPath: [
        "Inspect SAP S/4HANA (MIRO/MIR7) records for the affected entities",
        "Compare against Coupa Pay historical baseline",
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
      database: "three_way_match_exception_handler",
      schemas: [
        "sap_s_4hana_miro_mir7",
        "coupa_pay",
        "basware",
        "kofax",
      ],
    },
    bigquery: {
      dataset: "procurement_three_way_match_exception_handler",
      tables: [
        "kpi_summary",
        "evidence_index",
      ],
    },
    cloudStorage: {
      bucketSuffix: "three-way-match-exception-handler-evidence",
      prefixes: [
        "documents",
        "audit-trails",
        "exports",
      ],
    },
    apis: {
      serviceName: "three-way-match-exception-handler-source-adapters",
      deploymentTarget: "cloud_run",
    },
  },
  validation: {
    smokePrompt: "Run the Three-Way Match Exception Handler workflow and cite source-system evidence for every claim.",
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

export const ThreeWayMatchExceptionHandler = () => (
  <UseCaseSlide
    title="Three-Way Match Exception Handler"
    subtitle="A-1503 • Procure-to-Pay"
    icon={GitMerge}
    domainId="domain-15"
    layer="Layer 3: Custom ADK"
    persona="AP Manager"
    systems={["SAP S/4HANA (MIRO/MIR7)", "Coupa Pay", "Basware", "Kofax"]}
    kpis={[
      { label: "Exception rate", before: "25-35%", after: "5-8%" },
      { label: "Avg resolution time", before: "3-5 days", after: "4 hours" },
      { label: "Auto-resolution rate", before: "0%", after: "75% of exceptions" },
    ]}
    triggerType="event"
    swimlane={swimlane}
    flow={flow}
    architecture={architecture}
    hitl={{ actor: "AP Manager", action: "Approve exception resolution", description: "AP Manager reviews context-aware resolution recommendations for above-threshold exceptions where agent cannot auto-resolve." }}
    statusQuo={[
      "AP clerks manually investigate every PO-GR-invoice mismatch, emailing buyers and warehouse for context.",
      "Simple tolerance exceptions (tax rounding, qty variance) handled identically to genuine discrepancies.",
      "Credit memos referencing multiple original invoices with partial credits require hours of manual tracing."
    ]}
    agentification={[
      "Fuzzy matching auto-resolves 75% of exceptions — qty tolerances, tax rounding, price adjustments within contract bands.",
      "LLM reads invoice line descriptions to understand context: 'includes expedited shipping per email approval' triggers a PO change order, not a rejection.",
      "Generates context-aware resolution recommendations with supporting evidence for AP Manager review."
    ]}
  />
);
