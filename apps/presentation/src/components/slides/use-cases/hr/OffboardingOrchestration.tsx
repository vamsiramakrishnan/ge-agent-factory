import React from "react";
import { UseCaseSlide } from "../../../agent/UseCaseSlide";
import { FlowStep } from "../../../agent/ProcessFlow";
import { SwimlaneFlow } from "../../../agent/SwimlaneFlow";
import { AgentArchitecture, UseCaseGenerationSpec, AgentBehaviorContract} from "../../../../types/architecture";
import { Rocket, Zap, Settings, Shield, CheckCircle } from "lucide-react";

const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "n1", label: "Exit Event", lane: "system", type: "trigger" },
    { id: "n2", label: "Task Dispatch", lane: "agent", type: "action" },
    { id: "n3", label: "Access Revocation", lane: "agent", type: "action" },
    { id: "n4", label: "Offboarded", lane: "system", type: "output" },
  ],
  connections: [["n1", "n2"], ["n2", "n3"], ["n3", "n4"]],
};

const architecture: AgentArchitecture = {
  connections: [
    { system: "Workday", description: "Termination events, employee records, final pay calculation", direction: "bidirectional", protocol: "REST API", category: "erp" },
    { system: "ServiceNow", description: "Offboarding task orchestration, IT deprovisioning tickets", direction: "bidirectional", protocol: "REST API", category: "erp" },
    { system: "Google Workspace", description: "Account deactivation, file transfer, shared drive cleanup", direction: "write", protocol: "Admin SDK", category: "collaboration" },
    { system: "Slack", description: "Offboarding notifications, manager alerts, status updates", direction: "write", protocol: "Webhook", category: "collaboration" },
  ],
  pipeline: [
    { label: "Exit Trigger", description: "Detect termination or resignation event in Workday. Initiate offboarding workflow with appropriate urgency (voluntary vs. involuntary) and compliance requirements.", systems: ["Workday"], layer: "integration", dataIn: "Termination event with exit type and effective date", dataOut: "Offboarding workflow with task checklist" },
    { label: "Task Orchestration", description: "Auto-create tasks across IT, security, facilities, and finance via ServiceNow. Sequence tasks based on dependencies and compliance deadlines.", systems: ["ServiceNow"], layer: "integration", dataIn: "Offboarding checklist + system inventory", dataOut: "Dispatched tasks with SLA tracking" },
    { label: "Access Revocation", description: "Systematically revoke access across Google Workspace, Active Directory, and all connected systems. Verify revocation and handle file transfer to managers.", systems: ["Google Workspace"], layer: "integration", dataIn: "User access inventory + revocation schedule", dataOut: "Access revocation confirmations + file transfer log" },
    { label: "Closeout & Compliance", description: "Confirm asset return, process final pay, generate compliance notices (COBRA, etc.). Send status updates via Slack and close offboarding case.", systems: ["Workday", "Slack"], layer: "integration", dataIn: "Task completions + compliance requirements", dataOut: "Completed offboarding record with audit trail" },
  ],
};


const behaviorContract: AgentBehaviorContract = {
  role: "HR Ops Lead agent for the Offboarding Orchestration workflow",
  primaryObjective: "Autonomous orchestration of deprovisioning and asset recovery. Automated compliance notice generation (COBRA, etc.). so the HR Ops Lead can move the Deprovisioning time KPI.",
  inScope: [
    "Autonomous orchestration of deprovisioning and asset recovery",
    "Automated compliance notice generation (COBRA, etc.)",
    "Real-time status tracking with automated escalation loops",
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
      description: "Retrieve employees from Workday for the Offboarding Orchestration workflow.",
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
      name: "query_active_directory_directory_users",
      kind: "query",
      sourceSystemId: "active_directory",
      description: "Retrieve directory users from Active Directory for the Offboarding Orchestration workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "directory_users_records",
        "directory_users_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_servicenow_tickets",
      kind: "query",
      sourceSystemId: "servicenow",
      description: "Retrieve tickets from ServiceNow for the Offboarding Orchestration workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "tickets_records",
        "tickets_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_google_workspace_accounts",
      kind: "query",
      sourceSystemId: "google_workspace",
      description: "Retrieve accounts from Google Workspace for the Offboarding Orchestration workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "accounts_records",
        "accounts_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "lookup_offboarding_orchestration_policy_handbook",
      kind: "evidence_lookup",
      sourceSystemId: "workday",
      description: "Look up sections of the Offboarding Orchestration Policy Handbook to cite in narrative output, escalation rationale, and audit evidence.",
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
      name: "action_workday_provision",
      kind: "action",
      sourceSystemId: "workday",
      description: "Execute the provision step in Workday after the agent has gathered evidence and validated escalation gates.",
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
      claim: "Deprovisioning time moved from 5 days toward 4 hours",
      mustCite: [
        "workday.employees",
        "active_directory.directory_users",
      ],
      sourceSystemIds: [
        "workday",
        "active_directory",
      ],
    },
    {
      claim: "Asset recovery moved from 60% toward 95%",
      mustCite: [
        "workday.employees",
        "active_directory.directory_users",
      ],
      sourceSystemIds: [
        "workday",
        "active_directory",
      ],
    },
  ],
  escalationRules: [
    {
      trigger: "Deprovisioning time regresses past the 5 days baseline by more than 20%",
      action: "escalate_to_human",
      handoffTarget: "HR Ops Lead",
      rationale: "Significant regressions need human judgment before automated remediation runs against production records.",
    },
    {
      trigger: "Source-system evidence is incomplete or stale (>24h) for any required entity",
      action: "request_more_info",
      rationale: "Recommendations grounded in stale evidence misrepresent current state and undermine audit defensibility.",
    },
    {
      trigger: "Proposed provision action lacks supporting evidence from at least two systems",
      action: "refuse",
      rationale: "Single-system evidence is insufficient to authorize external state changes without manual review.",
    },
  ],
  refusalRules: [
    "Never fabricate metric values; only publish numbers derived from Workday (and other named systems) entities.",
    "Never bypass HR Ops Lead approval on escalation triggers, even when confidence is high.",
    "Never expose individual personal data (PII) in summaries; aggregate or pseudonymise before output.",
    "Never act on data older than the staleness threshold defined in the runbook without a fresh re-query.",
  ],
  goldenEvals: [
    {
      id: "offboarding-orchestration-end-to-end",
      prompt: "Run the Offboarding Orchestration workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.",
      expectedToolCalls: [
        "query_workday_employees",
        "query_active_directory_directory_users",
        "query_servicenow_tickets",
        "query_google_workspace_accounts",
        "lookup_offboarding_orchestration_policy_handbook",
        "action_workday_provision",
      ],
      mustReferenceEntities: [
        "employees",
        "directory_users",
        "tickets",
        "accounts",
      ],
      mustCiteDocuments: [
        "offboarding-orchestration-policy-handbook",
      ],
      expectedActionOutcome: "Action provision executed against Workday, with audit-trail entry and HR Ops Lead notified of outcomes.",
      forbiddenBehaviors: [
        "do not invent KPI numbers",
        "do not skip the evidence_lookup step before any recommendation",
        "do not execute provision without two-system evidence",
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
    rationale: "Row counts sized for Offboarding Orchestration so the agent can demonstrate the workflow against realistic transactional volume without simulating a production warehouse.",
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
      id: "active_directory",
      name: "Active Directory",
      owns: [
        "directory_users",
        "security_groups",
        "role_assignments",
      ],
      protocol: "Graph API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_active_directory_directory_users",
        "query_active_directory_security_groups",
        "query_active_directory_role_assignments",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
    {
      id: "servicenow",
      name: "ServiceNow",
      owns: [
        "tickets",
        "change_requests",
        "incidents",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_servicenow_tickets",
        "query_servicenow_change_requests",
        "query_servicenow_incidents",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
    {
      id: "google_workspace",
      name: "Google Workspace",
      owns: [
        "accounts",
        "group_memberships",
        "license_assignments",
      ],
      protocol: "Workspace API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_google_workspace_accounts",
        "query_google_workspace_group_memberships",
        "query_google_workspace_license_assignments",
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
      name: "directory_users",
      sourceSystemId: "active_directory",
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
      name: "security_groups",
      sourceSystemId: "active_directory",
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
      name: "role_assignments",
      sourceSystemId: "active_directory",
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
      name: "tickets",
      sourceSystemId: "servicenow",
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
          name: "title",
          type: "lorem.sentence",
          required: true,
        },
        {
          name: "priority",
          type: "enum",
          values: [
            "P1",
            "P2",
            "P3",
            "P4",
          ],
          weights: [
            0.05,
            0.15,
            0.4,
            0.4,
          ],
          required: true,
        },
        {
          name: "status",
          type: "enum",
          values: [
            "open",
            "triaged",
            "in_progress",
            "resolved",
            "closed",
          ],
          required: true,
        },
        {
          name: "assignee",
          type: "person.fullName",
          required: true,
        },
        {
          name: "created_at",
          type: "date",
          required: true,
        },
        {
          name: "category",
          type: "enum",
          values: [
            "access",
            "hardware",
            "software",
            "network",
            "policy",
            "billing",
          ],
          required: true,
        },
        {
          name: "sla_met",
          type: "boolean",
          trueRate: 0.78,
        },
      ],
    },
    {
      name: "change_requests",
      sourceSystemId: "servicenow",
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
          name: "title",
          type: "lorem.sentence",
          required: true,
        },
        {
          name: "priority",
          type: "enum",
          values: [
            "P1",
            "P2",
            "P3",
            "P4",
          ],
          weights: [
            0.05,
            0.15,
            0.4,
            0.4,
          ],
          required: true,
        },
        {
          name: "status",
          type: "enum",
          values: [
            "open",
            "triaged",
            "in_progress",
            "resolved",
            "closed",
          ],
          required: true,
        },
        {
          name: "assignee",
          type: "person.fullName",
          required: true,
        },
        {
          name: "created_at",
          type: "date",
          required: true,
        },
        {
          name: "category",
          type: "enum",
          values: [
            "access",
            "hardware",
            "software",
            "network",
            "policy",
            "billing",
          ],
          required: true,
        },
        {
          name: "sla_met",
          type: "boolean",
          trueRate: 0.78,
        },
      ],
    },
    {
      name: "incidents",
      sourceSystemId: "servicenow",
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
          name: "title",
          type: "lorem.sentence",
          required: true,
        },
        {
          name: "priority",
          type: "enum",
          values: [
            "P1",
            "P2",
            "P3",
            "P4",
          ],
          weights: [
            0.05,
            0.15,
            0.4,
            0.4,
          ],
          required: true,
        },
        {
          name: "status",
          type: "enum",
          values: [
            "open",
            "triaged",
            "in_progress",
            "resolved",
            "closed",
          ],
          required: true,
        },
        {
          name: "assignee",
          type: "person.fullName",
          required: true,
        },
        {
          name: "created_at",
          type: "date",
          required: true,
        },
        {
          name: "category",
          type: "enum",
          values: [
            "access",
            "hardware",
            "software",
            "network",
            "policy",
            "billing",
          ],
          required: true,
        },
        {
          name: "sla_met",
          type: "boolean",
          trueRate: 0.78,
        },
      ],
    },
    {
      name: "accounts",
      sourceSystemId: "google_workspace",
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
          name: "account_name",
          type: "company.name",
          required: true,
        },
        {
          name: "amount",
          type: "number",
          min: 5000,
          max: 1000000,
          required: true,
        },
        {
          name: "stage",
          type: "enum",
          values: [
            "prospecting",
            "qualification",
            "proposal",
            "negotiation",
            "closed_won",
            "closed_lost",
          ],
          required: true,
        },
        {
          name: "owner",
          type: "person.fullName",
          required: true,
        },
        {
          name: "close_date",
          type: "date",
          required: true,
        },
      ],
    },
    {
      name: "group_memberships",
      sourceSystemId: "google_workspace",
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
      name: "license_assignments",
      sourceSystemId: "google_workspace",
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
  ],
  relationships: [],
  documents: [
    {
      id: "offboarding-orchestration-policy-handbook",
      sourceSystemId: "workday",
      type: "policy",
      title: "Offboarding Orchestration Policy Handbook",
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
      id: "workday_provision_api",
      sourceSystemId: "workday",
      method: "POST",
      path: "/api/workday/provision",
      description: "Synchronous endpoint the agent calls to provision in Workday after evidence gating.",
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
      id: "offboarding-orchestration-baseline-gap",
      description: "Seed a realistic gap where Deprovisioning time sits between 5 days and 4 hours, so the agent can detect, narrate, and recommend remediation.",
      affectedEntities: [
        "employees",
        "positions",
      ],
      discoveryPath: [
        "Inspect Workday records for the affected entities",
        "Compare against Active Directory historical baseline",
        "Generate a citation-backed recommendation",
      ],
      expectedEvidence: [
        "source-system record",
        "historical baseline metric",
        "generated audit trail",
      ],
      expectedRecommendation: "Explain the gap, cite supporting evidence, and propose the next HR Ops Lead action.",
    },
  ],
  datastorePackaging: {
    alloydb: {
      database: "offboarding_orchestration",
      schemas: [
        "workday",
        "active_directory",
        "servicenow",
        "google_workspace",
      ],
    },
    bigquery: {
      dataset: "hr_offboarding_orchestration",
      tables: [
        "kpi_summary",
        "evidence_index",
      ],
    },
    cloudStorage: {
      bucketSuffix: "offboarding-orchestration-evidence",
      prefixes: [
        "documents",
        "audit-trails",
        "exports",
      ],
    },
    apis: {
      serviceName: "offboarding-orchestration-source-adapters",
      deploymentTarget: "cloud_run",
    },
  },
  validation: {
    smokePrompt: "Run the Offboarding Orchestration workflow and cite source-system evidence for every claim.",
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

export const OffboardingOrchestration = () => (
  <UseCaseSlide
    triggerType="event"
    swimlane={swimlane}
    title="Offboarding Orchestration"
    subtitle="A-807 • HR Operations"
    icon={Rocket}
    domainId="domain-8"
    layer="Layer 2: Agent Designer"
    persona="HR Ops Lead"
    systems={["Workday", "Active Directory", "ServiceNow", "Google Workspace"]}
    kpis={[
      { label: "Deprovisioning time", before: "5 days", after: "4 hours" },
      { label: "Asset recovery", before: "60%", after: "95%" },
      { label: "Security gaps", before: "Common", after: "Zero" }
    ]}
    statusQuo={[
      "Exit triggers manual checklists across 5-6 siloed systems.",
      "Security risks from delayed or missed access revocation.",
      "Asset recovery and final pay calculation are labor-intensive."
    ]}
    agentification={[
      "Autonomous orchestration of deprovisioning and asset recovery.",
      "Automated compliance notice generation (COBRA, etc.).",
      "Real-time status tracking with automated escalation loops."
    ]}
    architecture={architecture}
    flow={[
      { label: "Termination Trigger", icon: Zap, description: "Resignation or termination initiates workflow.", trigger: "Exit Event", systems: ["HRIS"] },
      { label: "Task Dispatch", icon: Settings, description: "IT, security, facilities, finance tasks auto-created.", systems: ["Gemini", "ServiceNow"], integration: "Agent Designer" },
      { label: "Access Revocation", icon: Shield, description: "System access revoked on schedule with verification." },
      { label: "Closeout", icon: CheckCircle, description: "Asset return confirmed, final pay processed.", output: "Offboarded" }
    ]}
  />
);
