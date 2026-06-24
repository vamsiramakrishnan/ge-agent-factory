import React from "react";
import { UseCaseSlide } from "../../../agent/UseCaseSlide";
import { FlowStep } from "../../../agent/ProcessFlow";
import { SwimlaneFlow } from "../../../agent/SwimlaneFlow";
import { AgentArchitecture, UseCaseGenerationSpec, AgentBehaviorContract} from "../../../../types/architecture";
import { Wallet, Database, Calculator, Brain, CheckCircle } from "lucide-react";

const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "s1", label: "Pre-Payment Run", lane: "system", type: "trigger" },
    { id: "a1", label: "Discount Analysis", lane: "agent", type: "action" },
    { id: "a2", label: "Working Capital Optimization", lane: "agent", type: "action" },
    { id: "a3", label: "Treasury Briefing", lane: "agent", type: "output" },
    { id: "h1", label: "Treasury Approves", lane: "human", type: "hitl" },
  ],
  connections: [["s1", "a1"], ["a1", "a2"], ["a2", "a3"], ["a3", "h1"]],
};

const flow: FlowStep[] = [
  { label: "Payment Proposal", icon: Database, description: "Pending payment proposals pulled from ERP payment program.", trigger: "Scheduled", systems: ["SAP S/4HANA FI (F110)"] },
  { label: "Discount Optimization", icon: Calculator, description: "Dynamic discounting offers from Taulia/C2FO evaluated against company cost of capital.", systems: ["Taulia", "C2FO"], integration: "ADK" },
  { label: "Treasury Briefing", icon: Brain, description: "LLM generates treasury briefing explaining payment strategy decisions and working capital impact in business terms.", systems: ["Vertex AI"] },
  { label: "Treasury Approves", icon: CheckCircle, description: "Treasury reviews optimized payment batch with DPO impact analysis and approves execution.", output: "Optimized Payment Run" },
];

const architecture: AgentArchitecture = {
  connections: [
    { system: "SAP S/4HANA FI", description: "Payment program (F110), pending payment proposals, payment term master data", direction: "bidirectional", protocol: "RFC/BAPI", category: "erp" },
    { system: "Taulia", description: "Dynamic discounting offers, early pay discount rates, supplier participation status", direction: "bidirectional", protocol: "REST API", category: "erp" },
    { system: "C2FO", description: "Supply chain finance marketplace, available discount offers, acceptance rates", direction: "bidirectional", protocol: "REST API", category: "erp" },
    { system: "Treasury Systems", description: "Cost of capital rates, working capital targets, DPO benchmarks", direction: "read", protocol: "REST API", category: "analytics" },
    { system: "Vertex AI (Gemini)", description: "Treasury briefing generation explaining payment strategy decisions in business terms", direction: "bidirectional", protocol: "gRPC", category: "ai" },
  ],
  pipeline: [
    { label: "Payment Proposal Extraction", description: "Pull pending payment proposals from ERP payment program. Aggregate invoice details, payment terms, and eligible discount offers from Taulia and C2FO.", systems: ["SAP S/4HANA FI", "Taulia", "C2FO"], layer: "integration", dataIn: "Pending payment batch with invoice/term details", dataOut: "Consolidated payment proposal with discount opportunities" },
    { label: "Discount & Working Capital Optimization", description: "Evaluate early pay discount APR against company cost of capital for each invoice. Model DPO impact across payment scenarios. Segment suppliers by payment term strategy — strategic suppliers for early pay, others for standard terms.", systems: ["Treasury Systems", "Taulia", "C2FO"], layer: "ml", dataIn: "Discount offers + cost of capital + DPO targets", dataOut: "Optimized payment batch with discount/term recommendations" },
    { label: "Treasury Briefing Generation", description: "LLM generates treasury briefing explaining payment strategy decisions: 'This supplier offers 2/10 Net 30 but also participates in supply chain finance at LIBOR+200bps — early pay discount yields higher APR equivalent, recommend direct early pay.' Working capital impact summarized in business terms.", systems: ["Vertex AI (Gemini)"], layer: "llm", dataIn: "Optimization results + edge cases", dataOut: "Treasury briefing with strategy rationale" },
    { label: "Payment Execution", description: "Submit optimized payment batch for treasury approval. Execute approved payments through ERP payment program.", systems: ["SAP S/4HANA FI"], layer: "integration", dataIn: "Approved optimized payment batch", dataOut: "Executed payments with discount capture confirmation" },
  ],
};


const behaviorContract: AgentBehaviorContract = {
  role: "Treasury agent for the Payment Optimization Agent workflow",
  primaryObjective: "Dynamic discounting engine evaluates early pay discount APR vs. company cost of capital for every invoice. Resolves edge cases: '2/10 Net 30 vs. supply chain finance at LIBOR+200bps — which is more cost-effective?' with full scenario modeling. so the Treasury can move the Early pay discount capture KPI.",
  inScope: [
    "Dynamic discounting engine evaluates early pay discount APR vs. company cost of capital for every invoice",
    "Resolves edge cases: '2/10 Net 30 vs. supply chain finance at LIBOR+200bps — which is more cost-effective?' with full scenario modeling",
    "LLM generates treasury briefings explaining payment strategy decisions and working capital impact in business terms",
  ],
  outOfScope: [
    "Contract execution without legal review",
    "Supplier disqualification decisions (category lead retains authority)",
    "Single-source justification overrides above policy threshold",
  ],
  toolIntents: [
    {
      name: "query_sap_s_4hana_fi_f110_gl_entries",
      kind: "query",
      sourceSystemId: "sap_s_4hana_fi_f110",
      description: "Retrieve gl entries from SAP S/4HANA FI (F110) for the Payment Optimization Agent workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "gl_entries_records",
        "gl_entries_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_taulia_taulia_records",
      kind: "query",
      sourceSystemId: "taulia",
      description: "Retrieve taulia records from Taulia for the Payment Optimization Agent workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "taulia_records_records",
        "taulia_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_c2fo_c2fo_records",
      kind: "query",
      sourceSystemId: "c2fo",
      description: "Retrieve c2fo records from C2FO for the Payment Optimization Agent workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "c2fo_records_records",
        "c2fo_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_treasury_systems_treasury_systems_records",
      kind: "query",
      sourceSystemId: "treasury_systems",
      description: "Retrieve treasury systems records from Treasury Systems for the Payment Optimization Agent workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "treasury_systems_records_records",
        "treasury_systems_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "lookup_payment_optimization_agent_policy_guide",
      kind: "evidence_lookup",
      sourceSystemId: "sap_s_4hana_fi_f110",
      description: "Look up sections of the Payment Optimization Agent Procurement Policy Guide to cite in narrative output, escalation rationale, and audit evidence.",
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
      name: "action_sap_s_4hana_fi_f110_generate",
      kind: "action",
      sourceSystemId: "sap_s_4hana_fi_f110",
      description: "Execute the generate step in SAP S/4HANA FI (F110) after the agent has gathered evidence and validated escalation gates.",
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
      claim: "Early pay discount capture moved from 12% of eligible toward 78% of eligible",
      mustCite: [
        "sap_s_4hana_fi_f110.gl_entries",
        "taulia.taulia_records",
      ],
      sourceSystemIds: [
        "sap_s_4hana_fi_f110",
        "taulia",
      ],
    },
    {
      claim: "Annual discount revenue moved from $340K toward $2.1M",
      mustCite: [
        "sap_s_4hana_fi_f110.gl_entries",
        "taulia.taulia_records",
      ],
      sourceSystemIds: [
        "sap_s_4hana_fi_f110",
        "taulia",
      ],
    },
  ],
  escalationRules: [
    {
      trigger: "Early pay discount capture regresses past the 12% of eligible baseline by more than 20%",
      action: "escalate_to_human",
      handoffTarget: "Treasury",
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
    "Never fabricate metric values; only publish numbers derived from SAP S/4HANA FI (F110) (and other named systems) entities.",
    "Never bypass Treasury approval on escalation triggers, even when confidence is high.",
    "Never expose individual personal data (PII) in summaries; aggregate or pseudonymise before output.",
    "Never act on data older than the staleness threshold defined in the runbook without a fresh re-query.",
  ],
  goldenEvals: [
    {
      id: "payment-optimization-agent-end-to-end",
      prompt: "Run the Payment Optimization Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.",
      expectedToolCalls: [
        "query_sap_s_4hana_fi_f110_gl_entries",
        "query_taulia_taulia_records",
        "query_c2fo_c2fo_records",
        "query_treasury_systems_treasury_systems_records",
        "lookup_payment_optimization_agent_policy_guide",
        "action_sap_s_4hana_fi_f110_generate",
      ],
      mustReferenceEntities: [
        "gl_entries",
        "taulia_records",
        "c2fo_records",
        "treasury_systems_records",
      ],
      mustCiteDocuments: [
        "payment-optimization-agent-policy-guide",
      ],
      expectedActionOutcome: "Action generate executed against SAP S/4HANA FI (F110), with audit-trail entry and Treasury notified of outcomes.",
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
    rationale: "Row counts sized for Payment Optimization Agent so the agent can demonstrate the workflow against realistic transactional volume without simulating a production warehouse.",
  },
  sourceSystems: [
    {
      id: "sap_s_4hana_fi_f110",
      name: "SAP S/4HANA FI (F110)",
      owns: [
        "gl_entries",
        "subledger_balances",
        "open_items",
      ],
      protocol: "RFC/BAPI",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_sap_s_4hana_fi_f110_gl_entries",
        "query_sap_s_4hana_fi_f110_subledger_balances",
        "query_sap_s_4hana_fi_f110_open_items",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
    {
      id: "taulia",
      name: "Taulia",
      owns: [
        "taulia_records",
        "taulia_events",
        "taulia_audit_trail",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_taulia_taulia_records",
        "query_taulia_taulia_events",
        "query_taulia_taulia_audit_trail",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
    {
      id: "c2fo",
      name: "C2FO",
      owns: [
        "c2fo_records",
        "c2fo_events",
        "c2fo_audit_trail",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_c2fo_c2fo_records",
        "query_c2fo_c2fo_events",
        "query_c2fo_c2fo_audit_trail",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
    {
      id: "treasury_systems",
      name: "Treasury Systems",
      owns: [
        "treasury_systems_records",
        "treasury_systems_events",
        "treasury_systems_audit_trail",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_treasury_systems_treasury_systems_records",
        "query_treasury_systems_treasury_systems_events",
        "query_treasury_systems_treasury_systems_audit_trail",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
  ],
  entities: [
    {
      name: "gl_entries",
      sourceSystemId: "sap_s_4hana_fi_f110",
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
      name: "subledger_balances",
      sourceSystemId: "sap_s_4hana_fi_f110",
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
      name: "open_items",
      sourceSystemId: "sap_s_4hana_fi_f110",
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
      name: "taulia_records",
      sourceSystemId: "taulia",
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
      name: "taulia_events",
      sourceSystemId: "taulia",
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
          name: "taulia_record_id",
          type: "ref",
          ref: "taulia_records.id",
          required: true,
        },
      ],
    },
    {
      name: "taulia_audit_trail",
      sourceSystemId: "taulia",
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
      name: "c2fo_records",
      sourceSystemId: "c2fo",
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
      name: "c2fo_events",
      sourceSystemId: "c2fo",
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
          name: "c2fo_record_id",
          type: "ref",
          ref: "c2fo_records.id",
          required: true,
        },
      ],
    },
    {
      name: "c2fo_audit_trail",
      sourceSystemId: "c2fo",
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
      name: "treasury_systems_records",
      sourceSystemId: "treasury_systems",
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
      name: "treasury_systems_events",
      sourceSystemId: "treasury_systems",
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
          name: "treasury_systems_record_id",
          type: "ref",
          ref: "treasury_systems_records.id",
          required: true,
        },
      ],
    },
    {
      name: "treasury_systems_audit_trail",
      sourceSystemId: "treasury_systems",
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
      from: "taulia_events.taulia_record_id",
      to: "taulia_records.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
    {
      from: "c2fo_events.c2fo_record_id",
      to: "c2fo_records.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
    {
      from: "treasury_systems_events.treasury_systems_record_id",
      to: "treasury_systems_records.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
  ],
  documents: [
    {
      id: "payment-optimization-agent-policy-guide",
      sourceSystemId: "sap_s_4hana_fi_f110",
      type: "policy",
      title: "Payment Optimization Agent Procurement Policy Guide",
      requiredSections: [
        "Sourcing principles",
        "Approval thresholds",
        "Supplier risk requirements",
        "Contract and compliance gates",
        "Exception handling",
      ],
      linkedEntities: [
        "gl_entries",
        "subledger_balances",
        "open_items",
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
      id: "sap_s_4hana_fi_f110_generate_api",
      sourceSystemId: "sap_s_4hana_fi_f110",
      method: "POST",
      path: "/api/sap_s_4hana_fi_f110/generate",
      description: "Synchronous endpoint the agent calls to generate in SAP S/4HANA FI (F110) after evidence gating.",
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
      id: "payment-optimization-agent-baseline-gap",
      description: "Seed a realistic gap where Early pay discount capture sits between 12% of eligible and 78% of eligible, so the agent can detect, narrate, and recommend remediation.",
      affectedEntities: [
        "gl_entries",
        "subledger_balances",
      ],
      discoveryPath: [
        "Inspect SAP S/4HANA FI (F110) records for the affected entities",
        "Compare against Taulia historical baseline",
        "Generate a citation-backed recommendation",
      ],
      expectedEvidence: [
        "source-system record",
        "historical baseline metric",
        "generated audit trail",
      ],
      expectedRecommendation: "Explain the gap, cite supporting evidence, and propose the next Treasury action.",
    },
  ],
  datastorePackaging: {
    alloydb: {
      database: "payment_optimization_agent",
      schemas: [
        "sap_s_4hana_fi_f110",
        "taulia",
        "c2fo",
        "treasury_systems",
      ],
    },
    bigquery: {
      dataset: "procurement_payment_optimization_agent",
      tables: [
        "kpi_summary",
        "evidence_index",
      ],
    },
    cloudStorage: {
      bucketSuffix: "payment-optimization-agent-evidence",
      prefixes: [
        "documents",
        "audit-trails",
        "exports",
      ],
    },
    apis: {
      serviceName: "payment-optimization-agent-source-adapters",
      deploymentTarget: "cloud_run",
    },
  },
  validation: {
    smokePrompt: "Run the Payment Optimization Agent workflow and cite source-system evidence for every claim.",
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

export const PaymentOptimizationAgent = () => (
  <UseCaseSlide
    title="Payment Optimization Agent"
    subtitle="A-1507 • Procure-to-Pay"
    icon={Wallet}
    domainId="domain-15"
    layer="Layer 4: Data Agent"
    persona="Treasury"
    systems={["SAP S/4HANA FI (F110)", "Taulia", "C2FO", "Treasury Systems"]}
    kpis={[
      { label: "Early pay discount capture", before: "12% of eligible", after: "78% of eligible" },
      { label: "Annual discount revenue", before: "$340K", after: "$2.1M" },
      { label: "Working capital impact", before: "Unoptimized DPO", after: "+4 days DPO" },
    ]}
    triggerType="scheduled"
    swimlane={swimlane}
    flow={flow}
    architecture={architecture}
    hitl={{ actor: "Treasury", action: "Approve optimized payment batch", description: "Treasury reviews payment optimization recommendations including dynamic discount APR analysis and DPO impact before executing the payment run." }}
    statusQuo={[
      "Early payment discounts (2/10 Net 30) missed because AP processes invoices after the discount window closes.",
      "No systematic comparison between early pay discounts and supply chain finance program rates.",
      "Treasury receives no briefing on payment strategy — payments run on autopilot at standard terms."
    ]}
    agentification={[
      "Dynamic discounting engine evaluates early pay discount APR vs. company cost of capital for every invoice.",
      "Resolves edge cases: '2/10 Net 30 vs. supply chain finance at LIBOR+200bps — which is more cost-effective?' with full scenario modeling.",
      "LLM generates treasury briefings explaining payment strategy decisions and working capital impact in business terms."
    ]}
  />
);
