import React from "react";
import { UseCaseSlide } from "../../../agent/UseCaseSlide";
import { FlowStep } from "../../../agent/ProcessFlow";
import { SwimlaneFlow } from "../../../agent/SwimlaneFlow";
import { AgentArchitecture, UseCaseGenerationSpec, AgentBehaviorContract} from "../../../../types/architecture";
import { ClipboardList, Database, Clock, CheckCircle, MessageCircle } from "lucide-react";

const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "s1", label: "Finding Issued", lane: "system", type: "trigger" },
    { id: "a1", label: "Log & Assign", lane: "agent", type: "action" },
    { id: "a2", label: "Remediation Assessment", lane: "agent", type: "action" },
    { id: "a3", label: "Status Report", lane: "agent", type: "output" },
    { id: "h1", label: "CAE Validates", lane: "human", type: "hitl" },
  ],
  connections: [["s1", "a1"], ["a1", "a2"], ["a2", "a3"], ["a3", "h1"]],
};

const flow: FlowStep[] = [
  { label: "Finding Intake", icon: Database, description: "Log new audit finding with severity, root cause, and affected process. Auto-assign remediation owner.", trigger: "Event-driven", systems: ["AuditBoard", "ServiceNow"] },
  { label: "Remediation Tracking", icon: Clock, description: "Monitor remediation progress, send deadline reminders, escalate overdue items.", systems: ["AuditBoard", "ServiceNow"], integration: "ADK" },
  { label: "Response Evaluation", icon: MessageCircle, description: "Gemini assesses whether management's remediation response addresses root cause or merely treats symptoms.", systems: ["Vertex AI"] },
  { label: "CAE Validation", icon: CheckCircle, description: "Chief Audit Executive validates remediation adequacy and approves finding closure.", output: "Remediation Status Report" },
];

const architecture: AgentArchitecture = {
  connections: [
    { system: "AuditBoard", description: "Finding repository, remediation plans, historical findings", direction: "bidirectional", protocol: "REST API", category: "erp" },
    { system: "ServiceNow", description: "Remediation task tracking, workflow management", direction: "bidirectional", protocol: "REST API", category: "erp" },
    { system: "Vertex AI (Gemini)", description: "Remediation adequacy assessment, root cause analysis", direction: "bidirectional", protocol: "gRPC", category: "ai" },
  ],
  pipeline: [
    { label: "Finding Registration", description: "Capture finding details, classify severity, identify affected controls, and assign remediation owner based on process ownership matrix.", systems: ["AuditBoard", "ServiceNow"], layer: "integration", dataIn: "Audit finding with evidence", dataOut: "Registered finding with assigned owner" },
    { label: "Pattern Detection", description: "Compare new findings against historical database to identify recurrence patterns and systemic issues across business units.", systems: ["AuditBoard", "BigQuery"], layer: "ml", dataIn: "New finding + historical findings", dataOut: "Recurrence analysis with root cause patterns" },
    { label: "Remediation Assessment", description: "Gemini evaluates management's remediation response: does it address the root cause? Is the timeline realistic? Are similar controls also affected?", systems: ["Vertex AI (Gemini)"], layer: "llm", dataIn: "Management response + root cause analysis", dataOut: "Remediation adequacy assessment" },
    { label: "Reporting & Closure", description: "Generate status reports for audit committee. Track closure verification and update risk assessment based on remediation outcomes.", systems: ["AuditBoard"], layer: "integration", dataIn: "Validated remediation", dataOut: "Audit committee status report" },
  ],
};


const behaviorContract: AgentBehaviorContract = {
  role: "Chief Audit Executive agent for the Audit Finding Tracker workflow",
  primaryObjective: "Automated deadline tracking with escalation ensures findings don't age without action. Gemini evaluates whether remediation plans address root cause or just treat symptoms. so the Chief Audit Executive can move the Avg remediation time KPI.",
  inScope: [
    "Automated deadline tracking with escalation ensures findings don't age without action",
    "Gemini evaluates whether remediation plans address root cause or just treat symptoms",
    "Pattern detection across historical findings surfaces systemic issues requiring enterprise-level intervention",
  ],
  outOfScope: [
    "Final sign-off on materially significant journal entries (Controller retains authority)",
    "Restatement of prior-period filings",
    "Tax position changes that require external advisor review",
  ],
  toolIntents: [
    {
      name: "query_auditboard_auditboard_records",
      kind: "query",
      sourceSystemId: "auditboard",
      description: "Retrieve auditboard records from AuditBoard for the Audit Finding Tracker workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "auditboard_records_records",
        "auditboard_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_servicenow_tickets",
      kind: "query",
      sourceSystemId: "servicenow",
      description: "Retrieve tickets from ServiceNow for the Audit Finding Tracker workflow.",
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
      name: "query_finance_3_finance_3_records",
      kind: "query",
      sourceSystemId: "finance_3",
      description: "Retrieve finance 3 records from FINANCE 3 for the Audit Finding Tracker workflow.",
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
      name: "lookup_audit_finding_tracker_controls_playbook",
      kind: "evidence_lookup",
      sourceSystemId: "auditboard",
      description: "Look up sections of the Audit Finding Tracker Controls Playbook to cite in narrative output, escalation rationale, and audit evidence.",
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
      name: "action_auditboard_execute",
      kind: "action",
      sourceSystemId: "auditboard",
      description: "Execute the execute step in AuditBoard after the agent has gathered evidence and validated escalation gates.",
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
      claim: "Avg remediation time moved from 90-120 days toward 30-45 days",
      mustCite: [
        "auditboard.auditboard_records",
        "servicenow.tickets",
      ],
      sourceSystemIds: [
        "auditboard",
        "servicenow",
      ],
    },
    {
      claim: "Overdue findings moved from 25-35% toward < 10%",
      mustCite: [
        "auditboard.auditboard_records",
        "servicenow.tickets",
      ],
      sourceSystemIds: [
        "auditboard",
        "servicenow",
      ],
    },
  ],
  escalationRules: [
    {
      trigger: "Avg remediation time regresses past the 90-120 days baseline by more than 20%",
      action: "escalate_to_human",
      handoffTarget: "Chief Audit Executive",
      rationale: "Significant regressions need human judgment before automated remediation runs against production records.",
    },
    {
      trigger: "Source-system evidence is incomplete or stale (>24h) for any required entity",
      action: "request_more_info",
      rationale: "Recommendations grounded in stale evidence misrepresent current state and undermine audit defensibility.",
    },
    {
      trigger: "Proposed execute action lacks supporting evidence from at least two systems",
      action: "refuse",
      rationale: "Single-system evidence is insufficient to authorize external state changes without manual review.",
    },
  ],
  refusalRules: [
    "Never fabricate metric values; only publish numbers derived from AuditBoard (and other named systems) entities.",
    "Never bypass Chief Audit Executive approval on escalation triggers, even when confidence is high.",
    "Never expose individual personal data (PII) in summaries; aggregate or pseudonymise before output.",
    "Never act on data older than the staleness threshold defined in the runbook without a fresh re-query.",
  ],
  goldenEvals: [
    {
      id: "audit-finding-tracker-end-to-end",
      prompt: "Run the Audit Finding Tracker workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.",
      expectedToolCalls: [
        "query_auditboard_auditboard_records",
        "query_servicenow_tickets",
        "query_finance_3_finance_3_records",
        "lookup_audit_finding_tracker_controls_playbook",
        "action_auditboard_execute",
      ],
      mustReferenceEntities: [
        "auditboard_records",
        "tickets",
        "finance_3_records",
      ],
      mustCiteDocuments: [
        "audit-finding-tracker-controls-playbook",
      ],
      expectedActionOutcome: "Action execute executed against AuditBoard, with audit-trail entry and Chief Audit Executive notified of outcomes.",
      forbiddenBehaviors: [
        "do not invent KPI numbers",
        "do not skip the evidence_lookup step before any recommendation",
        "do not execute execute without two-system evidence",
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
    rationale: "Row counts sized for Audit Finding Tracker so the agent can demonstrate the workflow against realistic transactional volume without simulating a production warehouse.",
  },
  sourceSystems: [
    {
      id: "auditboard",
      name: "AuditBoard",
      owns: [
        "auditboard_records",
        "auditboard_events",
        "auditboard_audit_trail",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_auditboard_auditboard_records",
        "query_auditboard_auditboard_events",
        "query_auditboard_auditboard_audit_trail",
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
      name: "auditboard_records",
      sourceSystemId: "auditboard",
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
      name: "auditboard_events",
      sourceSystemId: "auditboard",
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
      name: "auditboard_audit_trail",
      sourceSystemId: "auditboard",
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
      from: "finance_3_events.finance_3_record_id",
      to: "finance_3_records.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
  ],
  documents: [
    {
      id: "audit-finding-tracker-controls-playbook",
      sourceSystemId: "auditboard",
      type: "policy",
      title: "Audit Finding Tracker Controls Playbook",
      requiredSections: [
        "Workflow scope",
        "Materiality thresholds",
        "Escalation triggers",
        "Audit evidence requirements",
        "Quarter-end variations",
      ],
      linkedEntities: [
        "auditboard_records",
        "auditboard_events",
        "auditboard_audit_trail",
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
      id: "auditboard_execute_api",
      sourceSystemId: "auditboard",
      method: "POST",
      path: "/api/auditboard/execute",
      description: "Synchronous endpoint the agent calls to execute in AuditBoard after evidence gating.",
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
      id: "audit-finding-tracker-baseline-gap",
      description: "Seed a realistic gap where Avg remediation time sits between 90-120 days and 30-45 days, so the agent can detect, narrate, and recommend remediation.",
      affectedEntities: [
        "auditboard_records",
        "auditboard_events",
      ],
      discoveryPath: [
        "Inspect AuditBoard records for the affected entities",
        "Compare against ServiceNow historical baseline",
        "Generate a citation-backed recommendation",
      ],
      expectedEvidence: [
        "source-system record",
        "historical baseline metric",
        "generated audit trail",
      ],
      expectedRecommendation: "Explain the gap, cite supporting evidence, and propose the next Chief Audit Executive action.",
    },
  ],
  datastorePackaging: {
    alloydb: {
      database: "audit_finding_tracker",
      schemas: [
        "auditboard",
        "servicenow",
        "finance_3",
      ],
    },
    bigquery: {
      dataset: "finance_audit_finding_tracker",
      tables: [
        "kpi_summary",
        "evidence_index",
      ],
    },
    cloudStorage: {
      bucketSuffix: "audit-finding-tracker-evidence",
      prefixes: [
        "documents",
        "audit-trails",
        "exports",
      ],
    },
    apis: {
      serviceName: "audit-finding-tracker-source-adapters",
      deploymentTarget: "cloud_run",
    },
  },
  validation: {
    smokePrompt: "Run the Audit Finding Tracker workflow and cite source-system evidence for every claim.",
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

export const AuditFindingTracker = () => (
  <UseCaseSlide
    title="Audit Finding Tracker"
    subtitle="A-2603 • Internal Audit & Controls"
    icon={ClipboardList}
    domainId="domain-26"
    layer="Layer 2: Agent Designer"
    persona="Chief Audit Executive"
    systems={["AuditBoard", "ServiceNow", "Vertex AI"]}
    kpis={[
      { label: "Avg remediation time", before: "90-120 days", after: "30-45 days" },
      { label: "Overdue findings", before: "25-35%", after: "< 10%" },
      { label: "Recurrence rate", before: "20%", after: "< 5%" },
    ]}
    triggerType="event"
    swimlane={swimlane}
    flow={flow}
    architecture={architecture}
    hitl={{ actor: "Chief Audit Executive", action: "Validate remediation adequacy", description: "CAE reviews remediation response to ensure root cause is addressed before approving finding closure." }}
    statusQuo={[
      "Findings tracked in spreadsheets with manual follow-up emails to remediation owners.",
      "Remediation responses accepted at face value without assessing root cause adequacy.",
      "Recurrent findings across audit cycles indicate systemic issues not being addressed."
    ]}
    agentification={[
      "Automated deadline tracking with escalation ensures findings don't age without action.",
      "Gemini evaluates whether remediation plans address root cause or just treat symptoms.",
      "Pattern detection across historical findings surfaces systemic issues requiring enterprise-level intervention."
    ]}
  />
);
