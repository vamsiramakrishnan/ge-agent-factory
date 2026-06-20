import React from "react";
import { UseCaseSlide } from "../../../agent/UseCaseSlide";
import { FlowStep } from "../../../agent/ProcessFlow";
import { SwimlaneFlow } from "../../../agent/SwimlaneFlow";
import { AgentArchitecture, UseCaseGenerationSpec, AgentBehaviorContract} from "../../../../types/architecture";
import { FileText, Clock, GitCompare, AlertTriangle, CheckCircle } from "lucide-react";

const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "s1", label: "Timesheet Filed", lane: "system", type: "trigger" },
    { id: "a1", label: "Rate Card Check", lane: "agent", type: "action" },
    { id: "a2", label: "Scope Creep Scan", lane: "agent", type: "action" },
    { id: "a3", label: "Deviation Report", lane: "agent", type: "output" },
    { id: "h1", label: "Procurement Lead", lane: "human", type: "hitl" },
  ],
  connections: [["s1", "a1"], ["a1", "a2"], ["a2", "a3"], ["a3", "h1"]],
};

const flow: FlowStep[] = [
  { label: "Timesheet Ingest", icon: Clock, description: "Timesheets and deliverable submissions collected from VMS platforms.", trigger: "On submission", systems: ["SAP Fieldglass", "Beeline"] },
  { label: "Rate Compliance", icon: GitCompare, description: "Billed rates validated against contracted rate cards; hours checked against SOW budget.", systems: ["Coupa", "Contract system"], integration: "Custom ADK" },
  { label: "Scope Analysis", icon: AlertTriangle, description: "LLM compares timesheet activity descriptions against SOW deliverables to detect scope creep.", systems: ["Vertex AI"] },
  { label: "Lead Review", icon: CheckCircle, description: "Procurement Lead reviews deviations and determines if scope change requires a new SOW.", output: "Scope Compliance Report" },
];

const architecture: AgentArchitecture = {
  connections: [
    { system: "SAP Fieldglass", description: "Timesheet submissions, rate cards, worker assignments, SOW milestones", direction: "bidirectional", protocol: "REST API", category: "erp" },
    { system: "Beeline", description: "VMS timesheet data, contingent workforce hours, vendor compliance", direction: "read", protocol: "REST API", category: "erp" },
    { system: "Coupa", description: "Services spend tracking, PO matching, budget consumption", direction: "read", protocol: "REST API", category: "erp" },
    { system: "Contract System", description: "SOW scope definitions, rate cards, milestone schedules, budget caps", direction: "read", protocol: "REST API", category: "clm" },
    { system: "Vertex AI (Gemini)", description: "Scope creep detection, timesheet narrative analysis, change request assessment", direction: "bidirectional", protocol: "gRPC", category: "ai" },
  ],
  pipeline: [
    { label: "Timesheet & Rate Validation", description: "Collect timesheets from VMS platforms. Validate billed rates against contracted rate cards, check hours against SOW budget caps, and verify worker role assignments match approved categories.", systems: ["SAP Fieldglass", "Beeline", "Contract System"], layer: "integration", dataIn: "Timesheet submissions + rate cards", dataOut: "Rate compliance results with variance flags" },
    { label: "Burn Rate & Milestone Tracking", description: "Track SOW budget consumption rates, milestone completion percentages, and contingent workforce hour trends. Flag burn rate deviations that project budget overruns before they occur.", systems: ["Coupa", "SAP Fieldglass"], layer: "ml", dataIn: "Budget data + milestone schedule", dataOut: "Burn rate projections with overrun alerts" },
    { label: "Scope Creep Detection", description: "Gemini compares timesheet activity descriptions against SOW deliverables to detect scope creep — 'SOW covers Phase 1 design but timesheets show UAT support, which is Phase 3 work.' Assesses whether change requests constitute material scope changes requiring new SOWs.", systems: ["Vertex AI (Gemini)"], layer: "llm", dataIn: "Timesheet narratives + SOW scope", dataOut: "Scope deviation report with change recommendation" },
  ],
};


const behaviorContract: AgentBehaviorContract = {
  role: "Procurement Lead agent for the Services Procurement & SOW Manager workflow",
  primaryObjective: "Rate card compliance engine validates every timesheet against contracted rates, roles, and budget caps in real time. LLM detects scope creep by comparing timesheet narratives against SOW scope: 'SOW covers Phase 1 system design but timesheets show user acceptance testing support — this is Phase 3 work charged against Phase 1.' so the Procurement Lead can move the Scope creep detection KPI.",
  inScope: [
    "Rate card compliance engine validates every timesheet against contracted rates, roles, and budget caps in real time",
    "LLM detects scope creep by comparing timesheet narratives against SOW scope: 'SOW covers Phase 1 system design but timesheets show user acceptance testing support — this is Phase 3 work charged against Phase 1.'",
    "Interprets whether a change request is a material scope change requiring a new SOW or within the original scope flexibility, generating evidence-based deviation reports for the Procurement Lead",
  ],
  outOfScope: [
    "Contract execution without legal review",
    "Supplier disqualification decisions (category lead retains authority)",
    "Single-source justification overrides above policy threshold",
  ],
  toolIntents: [
    {
      name: "query_sap_fieldglass_gl_entries",
      kind: "query",
      sourceSystemId: "sap_fieldglass",
      description: "Retrieve gl entries from SAP Fieldglass for the Services Procurement & SOW Manager workflow.",
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
      name: "query_beeline_beeline_records",
      kind: "query",
      sourceSystemId: "beeline",
      description: "Retrieve beeline records from Beeline for the Services Procurement & SOW Manager workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "beeline_records_records",
        "beeline_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_vms_platforms_vms_platforms_records",
      kind: "query",
      sourceSystemId: "vms_platforms",
      description: "Retrieve vms platforms records from VMS platforms for the Services Procurement & SOW Manager workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "vms_platforms_records_records",
        "vms_platforms_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_coupa_requisitions",
      kind: "query",
      sourceSystemId: "coupa",
      description: "Retrieve requisitions from Coupa for the Services Procurement & SOW Manager workflow.",
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
      name: "lookup_services_procurement_sow_manager_policy_guide",
      kind: "evidence_lookup",
      sourceSystemId: "sap_fieldglass",
      description: "Look up sections of the Services Procurement & SOW Manager Procurement Policy Guide to cite in narrative output, escalation rationale, and audit evidence.",
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
      name: "action_sap_fieldglass_validate",
      kind: "action",
      sourceSystemId: "sap_fieldglass",
      description: "Execute the validate step in SAP Fieldglass after the agent has gathered evidence and validated escalation gates.",
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
      claim: "Scope creep detection moved from Caught at renewal toward Flagged within 1 week",
      mustCite: [
        "sap_fieldglass.gl_entries",
        "beeline.beeline_records",
      ],
      sourceSystemIds: [
        "sap_fieldglass",
        "beeline",
      ],
    },
    {
      claim: "Rate card compliance moved from 68% audited annually toward 100% validated per timesheet",
      mustCite: [
        "sap_fieldglass.gl_entries",
        "beeline.beeline_records",
      ],
      sourceSystemIds: [
        "sap_fieldglass",
        "beeline",
      ],
    },
  ],
  escalationRules: [
    {
      trigger: "Scope creep detection regresses past the Caught at renewal baseline by more than 20%",
      action: "escalate_to_human",
      handoffTarget: "Procurement Lead",
      rationale: "Significant regressions need human judgment before automated remediation runs against production records.",
    },
    {
      trigger: "Source-system evidence is incomplete or stale (>24h) for any required entity",
      action: "request_more_info",
      rationale: "Recommendations grounded in stale evidence misrepresent current state and undermine audit defensibility.",
    },
    {
      trigger: "Proposed validate action lacks supporting evidence from at least two systems",
      action: "refuse",
      rationale: "Single-system evidence is insufficient to authorize external state changes without manual review.",
    },
  ],
  refusalRules: [
    "Never fabricate metric values; only publish numbers derived from SAP Fieldglass (and other named systems) entities.",
    "Never bypass Procurement Lead approval on escalation triggers, even when confidence is high.",
    "Never expose individual personal data (PII) in summaries; aggregate or pseudonymise before output.",
    "Never act on data older than the staleness threshold defined in the runbook without a fresh re-query.",
  ],
  goldenEvals: [
    {
      id: "services-procurement-sow-manager-end-to-end",
      prompt: "Run the Services Procurement & SOW Manager workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.",
      expectedToolCalls: [
        "query_sap_fieldglass_gl_entries",
        "query_beeline_beeline_records",
        "query_vms_platforms_vms_platforms_records",
        "query_coupa_requisitions",
        "lookup_services_procurement_sow_manager_policy_guide",
        "action_sap_fieldglass_validate",
      ],
      mustReferenceEntities: [
        "gl_entries",
        "beeline_records",
        "vms_platforms_records",
        "requisitions",
        "contract_system_records",
      ],
      mustCiteDocuments: [
        "services-procurement-sow-manager-policy-guide",
      ],
      expectedActionOutcome: "Action validate executed against SAP Fieldglass, with audit-trail entry and Procurement Lead notified of outcomes.",
      forbiddenBehaviors: [
        "do not invent KPI numbers",
        "do not skip the evidence_lookup step before any recommendation",
        "do not execute validate without two-system evidence",
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
    rationale: "Row counts sized for Services Procurement & SOW Manager so the agent can demonstrate the workflow against realistic transactional volume without simulating a production warehouse.",
  },
  sourceSystems: [
    {
      id: "sap_fieldglass",
      name: "SAP Fieldglass",
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
        "query_sap_fieldglass_gl_entries",
        "query_sap_fieldglass_subledger_balances",
        "query_sap_fieldglass_open_items",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
    {
      id: "beeline",
      name: "Beeline",
      owns: [
        "beeline_records",
        "beeline_events",
        "beeline_audit_trail",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_beeline_beeline_records",
        "query_beeline_beeline_events",
        "query_beeline_beeline_audit_trail",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
    {
      id: "vms_platforms",
      name: "VMS platforms",
      owns: [
        "vms_platforms_records",
        "vms_platforms_events",
        "vms_platforms_audit_trail",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_vms_platforms_vms_platforms_records",
        "query_vms_platforms_vms_platforms_events",
        "query_vms_platforms_vms_platforms_audit_trail",
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
      id: "contract_system",
      name: "Contract system",
      owns: [
        "contract_system_records",
        "contract_system_events",
        "contract_system_audit_trail",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_contract_system_contract_system_records",
        "query_contract_system_contract_system_events",
        "query_contract_system_contract_system_audit_trail",
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
      sourceSystemId: "sap_fieldglass",
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
      sourceSystemId: "sap_fieldglass",
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
      sourceSystemId: "sap_fieldglass",
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
      name: "beeline_records",
      sourceSystemId: "beeline",
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
      name: "beeline_events",
      sourceSystemId: "beeline",
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
          name: "beeline_record_id",
          type: "ref",
          ref: "beeline_records.id",
          required: true,
        },
      ],
    },
    {
      name: "beeline_audit_trail",
      sourceSystemId: "beeline",
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
      name: "vms_platforms_records",
      sourceSystemId: "vms_platforms",
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
      name: "vms_platforms_events",
      sourceSystemId: "vms_platforms",
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
          name: "vms_platforms_record_id",
          type: "ref",
          ref: "vms_platforms_records.id",
          required: true,
        },
      ],
    },
    {
      name: "vms_platforms_audit_trail",
      sourceSystemId: "vms_platforms",
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
      name: "contract_system_records",
      sourceSystemId: "contract_system",
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
      name: "contract_system_events",
      sourceSystemId: "contract_system",
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
          name: "contract_system_record_id",
          type: "ref",
          ref: "contract_system_records.id",
          required: true,
        },
      ],
    },
    {
      name: "contract_system_audit_trail",
      sourceSystemId: "contract_system",
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
  ],
  relationships: [
    {
      from: "beeline_events.beeline_record_id",
      to: "beeline_records.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
    {
      from: "vms_platforms_events.vms_platforms_record_id",
      to: "vms_platforms_records.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
    {
      from: "contract_system_events.contract_system_record_id",
      to: "contract_system_records.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
  ],
  documents: [
    {
      id: "services-procurement-sow-manager-policy-guide",
      sourceSystemId: "sap_fieldglass",
      type: "policy",
      title: "Services Procurement & SOW Manager Procurement Policy Guide",
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
      id: "sap_fieldglass_validate_api",
      sourceSystemId: "sap_fieldglass",
      method: "POST",
      path: "/api/sap_fieldglass/validate",
      description: "Synchronous endpoint the agent calls to validate in SAP Fieldglass after evidence gating.",
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
      id: "services-procurement-sow-manager-baseline-gap",
      description: "Seed a realistic gap where Scope creep detection sits between Caught at renewal and Flagged within 1 week, so the agent can detect, narrate, and recommend remediation.",
      affectedEntities: [
        "gl_entries",
        "subledger_balances",
      ],
      discoveryPath: [
        "Inspect SAP Fieldglass records for the affected entities",
        "Compare against Beeline historical baseline",
        "Generate a citation-backed recommendation",
      ],
      expectedEvidence: [
        "source-system record",
        "historical baseline metric",
        "generated audit trail",
      ],
      expectedRecommendation: "Explain the gap, cite supporting evidence, and propose the next Procurement Lead action.",
    },
  ],
  datastorePackaging: {
    alloydb: {
      database: "services_procurement_sow_manager",
      schemas: [
        "sap_fieldglass",
        "beeline",
        "vms_platforms",
        "coupa",
        "contract_system",
      ],
    },
    bigquery: {
      dataset: "procurement_services_procurement_sow_manager",
      tables: [
        "kpi_summary",
        "evidence_index",
      ],
    },
    cloudStorage: {
      bucketSuffix: "services-procurement-sow-manager-evidence",
      prefixes: [
        "documents",
        "audit-trails",
        "exports",
      ],
    },
    apis: {
      serviceName: "services-procurement-sow-manager-source-adapters",
      deploymentTarget: "cloud_run",
    },
  },
  validation: {
    smokePrompt: "Run the Services Procurement & SOW Manager workflow and cite source-system evidence for every claim.",
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

export const ServicesProcurementSOWManager = () => (
  <UseCaseSlide
    title="Services Procurement & SOW Manager"
    subtitle="A-1806 • Indirect & Tail Spend"
    icon={FileText}
    domainId="domain-18"
    layer="Layer 3: Custom ADK"
    persona="Procurement Lead"
    systems={["SAP Fieldglass", "Beeline", "VMS platforms", "Coupa", "Contract system"]}
    kpis={[
      { label: "Scope creep detection", before: "Caught at renewal", after: "Flagged within 1 week" },
      { label: "Rate card compliance", before: "68% audited annually", after: "100% validated per timesheet" },
      { label: "SOW budget overrun", before: "22% avg overrun", after: "<5% with early warning" },
    ]}
    triggerType="event"
    swimlane={swimlane}
    flow={flow}
    architecture={architecture}
    hitl={{ actor: "Procurement Lead", action: "Review scope deviation", description: "Procurement Lead reviews flagged scope creep and determines whether a change request or new SOW is required before authorizing continued work." }}
    statusQuo={[
      "Services spend is governed by SOWs that nobody re-reads after signing — scope creep goes undetected until budget overruns surface at renewal.",
      "Rate card compliance is checked annually during audits, not per timesheet — overbilling accumulates for months before detection.",
      "Timesheets describe activities in vague terms like 'project support' making it impossible to verify work aligns with contracted deliverables."
    ]}
    agentification={[
      "Rate card compliance engine validates every timesheet against contracted rates, roles, and budget caps in real time.",
      "LLM detects scope creep by comparing timesheet narratives against SOW scope: 'SOW covers Phase 1 system design but timesheets show user acceptance testing support — this is Phase 3 work charged against Phase 1.'",
      "Interprets whether a change request is a material scope change requiring a new SOW or within the original scope flexibility, generating evidence-based deviation reports for the Procurement Lead."
    ]}
  />
);
