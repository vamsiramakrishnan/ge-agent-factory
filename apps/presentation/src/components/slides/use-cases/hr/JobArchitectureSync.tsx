import React from "react";
import { UseCaseSlide } from "../../../agent/UseCaseSlide";
import { FlowStep } from "../../../agent/ProcessFlow";
import { RefreshCw, Zap, Shield, Eye } from "lucide-react";
import { SwimlaneFlow } from "../../../agent/SwimlaneFlow";
import { AgentArchitecture, UseCaseGenerationSpec, AgentBehaviorContract} from "../../../../types/architecture";

const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "s1", label: "Change Detected", lane: "system", type: "trigger" },
    { id: "a1", label: "Cross-Validation", lane: "agent", type: "action" },
    { id: "a2", label: "Drift Check", lane: "agent", type: "action" },
    { id: "s2", label: "HRIS Updated", lane: "system", type: "output" },
  ],
  connections: [["s1", "a1"], ["a1", "a2"], ["a2", "s2"]],
};

const flow: FlowStep[] = [
  { label: "Change Detected", icon: Zap, description: "Job architecture or comp band update triggers sync.", trigger: "Change Event", systems: ["Comp System"] },
  { label: "Validation", icon: Shield, description: "Cross-references against compensation bands and levels.", systems: ["Gemini"], integration: "Agent Designer" },
  { label: "Drift Check", icon: Eye, description: "Identifies misalignments between JDs, comp, and HRIS." },
  { label: "Auto-Sync", icon: RefreshCw, description: "Updates pushed to HRIS with full audit trail.", output: "Synced Records" },
];

const architecture: AgentArchitecture = {
  connections: [
    { system: "Workday", description: "Job profiles, titles, leveling data, HRIS records", direction: "bidirectional", protocol: "REST API", category: "erp" },
    { system: "SAP SuccessFactors", description: "Job classification, role catalog, position data", direction: "bidirectional", protocol: "OData API", category: "erp" },
    { system: "Mercer", description: "Compensation bands, job evaluation data, market benchmarks", direction: "read", protocol: "REST API", category: "market-data" },
    { system: "BigQuery", description: "Architecture drift analytics, sync audit logs", direction: "bidirectional", protocol: "BigQuery SQL", category: "analytics" },
  ],
  pipeline: [
    { label: "Change Detection", description: "Monitor job architecture, compensation band, and HRIS updates across Workday, SAP SuccessFactors, and Mercer. Detect changes that require cross-system synchronization.", systems: ["Workday", "SAP SuccessFactors", "Mercer"], layer: "integration", dataIn: "Change events from job architecture systems", dataOut: "Detected drift and change records" },
    { label: "Cross-Validation", description: "Validate changes against compensation bands, leveling framework, and role taxonomy. Identify misalignments between JDs, comp data, and HRIS records.", systems: ["BigQuery"], layer: "ml", dataIn: "Change records + architecture rules", dataOut: "Validated sync actions with drift flags" },
    { label: "Auto-Sync & Audit", description: "Push validated updates to HRIS systems with full audit trail. Escalate drift anomalies that require human review.", systems: ["Workday", "SAP SuccessFactors", "BigQuery"], layer: "integration", dataIn: "Validated sync actions", dataOut: "Synced records with audit log" },
  ],
};


const behaviorContract: AgentBehaviorContract = {
  role: "Comp Manager agent for the Job Architecture Sync Agent workflow",
  primaryObjective: "Continuous bidirectional sync between job architecture, compensation bands, and HRIS records. Automated drift detection alerts when roles, titles, or leveling deviate from the approved architecture. so the Comp Manager can move the Sync frequency KPI.",
  inScope: [
    "Continuous bidirectional sync between job architecture, compensation bands, and HRIS records",
    "Automated drift detection alerts when roles, titles, or leveling deviate from the approved architecture",
    "Real-time publishing of architecture changes with full audit trail and downstream impact notifications",
  ],
  outOfScope: [
    "Final hiring, termination, or compensation decisions (HRBP/leadership retains authority)",
    "Performance management adjudication and disciplinary action",
    "Legal interpretation of employment law in ambiguous jurisdictions",
  ],
  toolIntents: [
    {
      name: "query_workday_employees",
      kind: "query",
      sourceSystemId: "workday",
      description: "Retrieve employees from Workday for the Job Architecture Sync Agent workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "employees_records",
        "employees_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_sap_successfactors_employee_records",
      kind: "query",
      sourceSystemId: "sap_successfactors",
      description: "Retrieve employee records from SAP SuccessFactors for the Job Architecture Sync Agent workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "employee_records_records",
        "employee_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_mercer_mercer_records",
      kind: "query",
      sourceSystemId: "mercer",
      description: "Retrieve mercer records from Mercer for the Job Architecture Sync Agent workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "mercer_records_records",
        "mercer_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_google_sheets_sheets",
      kind: "query",
      sourceSystemId: "google_sheets",
      description: "Retrieve sheets from Google Sheets for the Job Architecture Sync Agent workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "sheets_records",
        "sheets_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "lookup_job_architecture_sync_agent_policy_handbook",
      kind: "evidence_lookup",
      sourceSystemId: "google_sheets",
      description: "Look up sections of the Job Architecture Sync Agent Policy Handbook to cite in narrative output, escalation rationale, and audit evidence.",
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
      name: "action_workday_publish",
      kind: "action",
      sourceSystemId: "workday",
      description: "Execute the publish step in Workday after the agent has gathered evidence and validated escalation gates.",
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
      claim: "Sync frequency moved from Quarterly toward Real-time",
      mustCite: [
        "workday.employees",
        "sap_successfactors.employee_records",
      ],
      sourceSystemIds: [
        "workday",
        "sap_successfactors",
      ],
    },
    {
      claim: "Drift detection moved from Manual audit toward Automated",
      mustCite: [
        "workday.employees",
        "sap_successfactors.employee_records",
      ],
      sourceSystemIds: [
        "workday",
        "sap_successfactors",
      ],
    },
  ],
  escalationRules: [
    {
      trigger: "Sync frequency regresses past the Quarterly baseline by more than 20%",
      action: "escalate_to_human",
      handoffTarget: "Comp Manager",
      rationale: "Significant regressions need human judgment before automated remediation runs against production records.",
    },
    {
      trigger: "Source-system evidence is incomplete or stale (>24h) for any required entity",
      action: "request_more_info",
      rationale: "Recommendations grounded in stale evidence misrepresent current state and undermine audit defensibility.",
    },
    {
      trigger: "Proposed publish action lacks supporting evidence from at least two systems",
      action: "refuse",
      rationale: "Single-system evidence is insufficient to authorize external state changes without manual review.",
    },
  ],
  refusalRules: [
    "Never fabricate metric values; only publish numbers derived from Workday (and other named systems) entities.",
    "Never bypass Comp Manager approval on escalation triggers, even when confidence is high.",
    "Never expose individual personal data (PII) in summaries; aggregate or pseudonymise before output.",
    "Never act on data older than the staleness threshold defined in the runbook without a fresh re-query.",
  ],
  goldenEvals: [
    {
      id: "job-architecture-sync-agent-end-to-end",
      prompt: "Run the Job Architecture Sync Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.",
      expectedToolCalls: [
        "query_workday_employees",
        "query_sap_successfactors_employee_records",
        "query_mercer_mercer_records",
        "query_google_sheets_sheets",
        "lookup_job_architecture_sync_agent_policy_handbook",
        "action_workday_publish",
      ],
      mustReferenceEntities: [
        "employees",
        "employee_records",
        "mercer_records",
        "sheets",
      ],
      mustCiteDocuments: [
        "job-architecture-sync-agent-policy-handbook",
      ],
      expectedActionOutcome: "Action publish executed against Workday, with audit-trail entry and Comp Manager notified of outcomes.",
      forbiddenBehaviors: [
        "do not invent KPI numbers",
        "do not skip the evidence_lookup step before any recommendation",
        "do not execute publish without two-system evidence",
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
    rationale: "Row counts sized for Job Architecture Sync Agent so the agent can demonstrate the workflow against realistic transactional volume without simulating a production warehouse.",
  },
  sourceSystems: [
    {
      id: "workday",
      name: "Workday",
      owns: [
        "employees",
        "positions",
        "compensation_records",
      ],
      protocol: "Workday REST",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_workday_employees",
        "query_workday_positions",
        "query_workday_compensation_records",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
    {
      id: "sap_successfactors",
      name: "SAP SuccessFactors",
      owns: [
        "employee_records",
        "performance_reviews",
        "talent_pool",
      ],
      protocol: "RFC/BAPI",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_sap_successfactors_employee_records",
        "query_sap_successfactors_performance_reviews",
        "query_sap_successfactors_talent_pool",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
    {
      id: "mercer",
      name: "Mercer",
      owns: [
        "mercer_records",
        "mercer_events",
        "mercer_audit_trail",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_mercer_mercer_records",
        "query_mercer_mercer_events",
        "query_mercer_mercer_audit_trail",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
    {
      id: "google_sheets",
      name: "Google Sheets",
      owns: [
        "sheets",
        "named_ranges",
        "edit_history",
      ],
      protocol: "Workspace API",
      localBacking: [
        "cloud-storage",
      ],
      toolNames: [
        "query_google_sheets_sheets",
        "query_google_sheets_named_ranges",
        "query_google_sheets_edit_history",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
  ],
  entities: [
    {
      name: "employees",
      sourceSystemId: "workday",
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
          name: "name",
          type: "person.fullName",
          required: true,
        },
        {
          name: "email",
          type: "internet.email",
          required: true,
        },
        {
          name: "department",
          type: "enum",
          values: [
            "Finance",
            "HR",
            "IT",
            "Marketing",
            "Procurement",
            "Engineering",
            "Operations",
          ],
          required: true,
        },
        {
          name: "region",
          type: "enum",
          values: [
            "US",
            "EMEA",
            "APAC",
            "LATAM",
          ],
          required: true,
        },
        {
          name: "status",
          type: "enum",
          values: [
            "active",
            "on_leave",
            "inactive",
          ],
          weights: [
            0.85,
            0.1,
            0.05,
          ],
          required: true,
        },
        {
          name: "level",
          type: "enum",
          values: [
            "L3",
            "L4",
            "L5",
            "L6",
            "L7",
          ],
          required: true,
        },
        {
          name: "hired_on",
          type: "date",
          required: true,
        },
      ],
    },
    {
      name: "positions",
      sourceSystemId: "workday",
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
          name: "name",
          type: "person.fullName",
          required: true,
        },
        {
          name: "email",
          type: "internet.email",
          required: true,
        },
        {
          name: "department",
          type: "enum",
          values: [
            "Finance",
            "HR",
            "IT",
            "Marketing",
            "Procurement",
            "Engineering",
            "Operations",
          ],
          required: true,
        },
        {
          name: "region",
          type: "enum",
          values: [
            "US",
            "EMEA",
            "APAC",
            "LATAM",
          ],
          required: true,
        },
        {
          name: "status",
          type: "enum",
          values: [
            "active",
            "on_leave",
            "inactive",
          ],
          weights: [
            0.85,
            0.1,
            0.05,
          ],
          required: true,
        },
        {
          name: "level",
          type: "enum",
          values: [
            "L3",
            "L4",
            "L5",
            "L6",
            "L7",
          ],
          required: true,
        },
        {
          name: "hired_on",
          type: "date",
          required: true,
        },
      ],
    },
    {
      name: "compensation_records",
      sourceSystemId: "workday",
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
          name: "name",
          type: "person.fullName",
          required: true,
        },
        {
          name: "email",
          type: "internet.email",
          required: true,
        },
        {
          name: "department",
          type: "enum",
          values: [
            "Finance",
            "HR",
            "IT",
            "Marketing",
            "Procurement",
            "Engineering",
            "Operations",
          ],
          required: true,
        },
        {
          name: "region",
          type: "enum",
          values: [
            "US",
            "EMEA",
            "APAC",
            "LATAM",
          ],
          required: true,
        },
        {
          name: "status",
          type: "enum",
          values: [
            "active",
            "on_leave",
            "inactive",
          ],
          weights: [
            0.85,
            0.1,
            0.05,
          ],
          required: true,
        },
        {
          name: "level",
          type: "enum",
          values: [
            "L3",
            "L4",
            "L5",
            "L6",
            "L7",
          ],
          required: true,
        },
        {
          name: "hired_on",
          type: "date",
          required: true,
        },
      ],
    },
    {
      name: "employee_records",
      sourceSystemId: "sap_successfactors",
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
          name: "name",
          type: "person.fullName",
          required: true,
        },
        {
          name: "email",
          type: "internet.email",
          required: true,
        },
        {
          name: "department",
          type: "enum",
          values: [
            "Finance",
            "HR",
            "IT",
            "Marketing",
            "Procurement",
            "Engineering",
            "Operations",
          ],
          required: true,
        },
        {
          name: "region",
          type: "enum",
          values: [
            "US",
            "EMEA",
            "APAC",
            "LATAM",
          ],
          required: true,
        },
        {
          name: "status",
          type: "enum",
          values: [
            "active",
            "on_leave",
            "inactive",
          ],
          weights: [
            0.85,
            0.1,
            0.05,
          ],
          required: true,
        },
        {
          name: "level",
          type: "enum",
          values: [
            "L3",
            "L4",
            "L5",
            "L6",
            "L7",
          ],
          required: true,
        },
        {
          name: "hired_on",
          type: "date",
          required: true,
        },
      ],
    },
    {
      name: "performance_reviews",
      sourceSystemId: "sap_successfactors",
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
      name: "talent_pool",
      sourceSystemId: "sap_successfactors",
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
          name: "name",
          type: "person.fullName",
          required: true,
        },
        {
          name: "email",
          type: "internet.email",
          required: true,
        },
        {
          name: "department",
          type: "enum",
          values: [
            "Finance",
            "HR",
            "IT",
            "Marketing",
            "Procurement",
            "Engineering",
            "Operations",
          ],
          required: true,
        },
        {
          name: "region",
          type: "enum",
          values: [
            "US",
            "EMEA",
            "APAC",
            "LATAM",
          ],
          required: true,
        },
        {
          name: "status",
          type: "enum",
          values: [
            "active",
            "on_leave",
            "inactive",
          ],
          weights: [
            0.85,
            0.1,
            0.05,
          ],
          required: true,
        },
        {
          name: "level",
          type: "enum",
          values: [
            "L3",
            "L4",
            "L5",
            "L6",
            "L7",
          ],
          required: true,
        },
        {
          name: "hired_on",
          type: "date",
          required: true,
        },
      ],
    },
    {
      name: "mercer_records",
      sourceSystemId: "mercer",
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
      name: "mercer_events",
      sourceSystemId: "mercer",
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
          name: "mercer_record_id",
          type: "ref",
          ref: "mercer_records.id",
          required: true,
        },
      ],
    },
    {
      name: "mercer_audit_trail",
      sourceSystemId: "mercer",
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
      name: "sheets",
      sourceSystemId: "google_sheets",
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
      name: "named_ranges",
      sourceSystemId: "google_sheets",
      datastore: "alloydb",
      rowCount: 30,
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
      name: "edit_history",
      sourceSystemId: "google_sheets",
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
          name: "sheet_id",
          type: "ref",
          ref: "sheets.id",
          required: true,
        },
      ],
    },
  ],
  relationships: [
    {
      from: "mercer_events.mercer_record_id",
      to: "mercer_records.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
    {
      from: "edit_history.sheet_id",
      to: "sheets.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
  ],
  documents: [
    {
      id: "job-architecture-sync-agent-policy-handbook",
      sourceSystemId: "workday",
      type: "policy",
      title: "Job Architecture Sync Agent Policy Handbook",
      requiredSections: [
        "Eligibility and scope",
        "Workflow steps",
        "Manager responsibilities",
        "Compliance and audit",
        "Sensitive-data handling",
      ],
      linkedEntities: [
        "employees",
        "positions",
        "compensation_records",
      ],
      minimumWordCount: 500,
      citationAnchors: [
        "eligibility",
        "workflow",
        "compliance",
        "sensitive-data",
      ],
    },
  ],
  apis: [
    {
      id: "workday_publish_api",
      sourceSystemId: "workday",
      method: "POST",
      path: "/api/workday/publish",
      description: "Synchronous endpoint the agent calls to publish in Workday after evidence gating.",
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
      id: "job-architecture-sync-agent-baseline-gap",
      description: "Seed a realistic gap where Sync frequency sits between Quarterly and Real-time, so the agent can detect, narrate, and recommend remediation.",
      affectedEntities: [
        "employees",
        "positions",
      ],
      discoveryPath: [
        "Inspect Workday records for the affected entities",
        "Compare against SAP SuccessFactors historical baseline",
        "Generate a citation-backed recommendation",
      ],
      expectedEvidence: [
        "source-system record",
        "historical baseline metric",
        "generated audit trail",
      ],
      expectedRecommendation: "Explain the gap, cite supporting evidence, and propose the next Comp Manager action.",
    },
  ],
  datastorePackaging: {
    alloydb: {
      database: "job_architecture_sync_agent",
      schemas: [
        "workday",
        "sap_successfactors",
        "mercer",
        "google_sheets",
      ],
    },
    bigquery: {
      dataset: "hr_job_architecture_sync_agent",
      tables: [
        "kpi_summary",
        "evidence_index",
      ],
    },
    cloudStorage: {
      bucketSuffix: "job-architecture-sync-agent-evidence",
      prefixes: [
        "documents",
        "audit-trails",
        "exports",
      ],
    },
    apis: {
      serviceName: "job-architecture-sync-agent-source-adapters",
      deploymentTarget: "cloud_run",
    },
  },
  validation: {
    smokePrompt: "Run the Job Architecture Sync Agent workflow and cite source-system evidence for every claim.",
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

export const JobArchitectureSync = () => (
  <UseCaseSlide
    title="Job Architecture Sync Agent"
    subtitle="A-108 • Job Architecture & Role Management"
    icon={RefreshCw}
    domainId="domain-1"
    layer="Layer 2: Agent Designer"
    persona="Comp Manager"
    systems={["Workday", "SAP SuccessFactors", "Mercer", "Google Sheets"]}
    kpis={[
      { label: "Sync frequency", before: "Quarterly", after: "Real-time" },
      { label: "Drift detection", before: "Manual audit", after: "Automated" },
      { label: "HRIS accuracy", before: "85%", after: "99%" },
    ]}
    triggerType="event"
    swimlane={swimlane}
    flow={flow}
    architecture={architecture}
    statusQuo={[
      "Job architecture updates manually synced between compensation systems and HRIS, causing persistent drift.",
      "Job descriptions diverge from actual roles over time with no mechanism to detect or correct mismatches.",
      "Version mismatches between published job families, leveling frameworks, and active postings."
    ]}
    agentification={[
      "Continuous bidirectional sync between job architecture, compensation bands, and HRIS records.",
      "Automated drift detection alerts when roles, titles, or leveling deviate from the approved architecture.",
      "Real-time publishing of architecture changes with full audit trail and downstream impact notifications."
    ]}
  />
);
