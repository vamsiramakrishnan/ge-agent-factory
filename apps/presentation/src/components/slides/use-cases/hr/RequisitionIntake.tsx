import React from "react";
import { UseCaseSlide } from "../../../agent/UseCaseSlide";
import { ClipboardCheck, Upload, Shield, Search, Send } from "lucide-react";
import { FlowStep } from "../../../agent/ProcessFlow";
import { SwimlaneFlow } from "../../../agent/SwimlaneFlow";
import { AgentArchitecture, UseCaseGenerationSpec, AgentBehaviorContract} from "../../../../types/architecture";

const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "h1", label: "Manager Submits Req", lane: "human", type: "trigger" },
    { id: "a1", label: "Auto-Validate", lane: "agent", type: "action" },
    { id: "a2", label: "Enrichment", lane: "agent", type: "action" },
    { id: "h2", label: "HRBP Validates", lane: "human", type: "hitl" },
    { id: "a3", label: "Approved Req", lane: "agent", type: "output" },
  ],
  connections: [["h1", "a1"], ["a1", "a2"], ["a2", "h2"], ["h2", "a3"]],
};

const architecture: AgentArchitecture = {
  connections: [
    { system: "Workday", description: "Headcount plan, budget allocation, job profiles", direction: "read", protocol: "REST API", category: "erp" },
    { system: "Greenhouse", description: "Requisition creation, approval workflows, ATS integration", direction: "bidirectional", protocol: "REST API", category: "erp" },
    { system: "BigQuery", description: "Historical req analytics, fill-rate benchmarks", direction: "read", protocol: "BigQuery SQL", category: "analytics" },
    { system: "Vertex AI (Gemini)", description: "Conversational intake, auto-validation, enrichment", direction: "bidirectional", protocol: "gRPC", category: "ai" },
  ],
  pipeline: [
    { label: "Intake & Validation", description: "Conversational intake captures role requirements from hiring managers. Auto-validates against headcount plan, budget, and comp bands from Workday.", systems: ["Workday", "Greenhouse"], layer: "integration", dataIn: "Manager role request + workforce plan", dataOut: "Validated requisition with enrichment" },
    { label: "Enrichment & Scoring", description: "Gemini enriches requisition with market data, similar req history, and fill-difficulty predictions from BigQuery analytics.", systems: ["BigQuery", "Vertex AI (Gemini)"], layer: "llm", dataIn: "Validated req + market context", dataOut: "Enriched, scored requisition" },
    { label: "Routing & Approval", description: "Approved requisition routed to HRBP and finance with SLA tracking. Exception-only review for standard roles.", systems: ["Greenhouse", "Workday"], layer: "integration", dataIn: "Enriched requisition", dataOut: "Approved req in ATS" },
  ],
};


const behaviorContract: AgentBehaviorContract = {
  role: "Recruiter agent for the Requisition Intake & Validation workflow",
  primaryObjective: "Conversational intake auto-populates from workforce plan. Real-time budget validation via Finance API integration. so the Recruiter can move the Intake time KPI.",
  inScope: [
    "Conversational intake auto-populates from workforce plan",
    "Real-time budget validation via Finance API integration",
    "Zero-touch validation for standard roles; exception-only review",
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
      description: "Retrieve employees from Workday for the Requisition Intake & Validation workflow.",
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
      description: "Retrieve employee records from SAP SuccessFactors for the Requisition Intake & Validation workflow.",
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
      name: "query_slack_messages",
      kind: "query",
      sourceSystemId: "slack",
      description: "Retrieve messages from Slack for the Requisition Intake & Validation workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "messages_records",
        "messages_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_servicenow_tickets",
      kind: "query",
      sourceSystemId: "servicenow",
      description: "Retrieve tickets from ServiceNow for the Requisition Intake & Validation workflow.",
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
      name: "lookup_requisition_intake_validation_policy_handbook",
      kind: "evidence_lookup",
      sourceSystemId: "workday",
      description: "Look up sections of the Requisition Intake & Validation Policy Handbook to cite in narrative output, escalation rationale, and audit evidence.",
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
  ],
  evidenceRequirements: [
    {
      claim: "Intake time moved from 3 days toward 15 min",
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
      claim: "Validation errors moved from 25% toward <2%",
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
      trigger: "Intake time regresses past the 3 days baseline by more than 20%",
      action: "escalate_to_human",
      handoffTarget: "Recruiter",
      rationale: "Significant regressions need human judgment before automated remediation runs against production records.",
    },
    {
      trigger: "Source-system evidence is incomplete or stale (>24h) for any required entity",
      action: "request_more_info",
      rationale: "Recommendations grounded in stale evidence misrepresent current state and undermine audit defensibility.",
    },
  ],
  refusalRules: [
    "Never fabricate metric values; only publish numbers derived from Workday (and other named systems) entities.",
    "Never bypass Recruiter approval on escalation triggers, even when confidence is high.",
    "Never expose individual personal data (PII) in summaries; aggregate or pseudonymise before output.",
    "Never act on data older than the staleness threshold defined in the runbook without a fresh re-query.",
  ],
  goldenEvals: [
    {
      id: "requisition-intake-validation-end-to-end",
      prompt: "Run the Requisition Intake & Validation workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.",
      expectedToolCalls: [
        "query_workday_employees",
        "query_sap_successfactors_employee_records",
        "query_slack_messages",
        "query_servicenow_tickets",
        "lookup_requisition_intake_validation_policy_handbook",
      ],
      mustReferenceEntities: [
        "employees",
        "employee_records",
        "messages",
        "tickets",
      ],
      mustCiteDocuments: [
        "requisition-intake-validation-policy-handbook",
      ],
      expectedActionOutcome: "Recruiter receives a fully-cited recommendation; no external state change without explicit approval.",
      forbiddenBehaviors: [
        "do not invent KPI numbers",
        "do not skip the evidence_lookup step before any recommendation",
        "do not act on single-system evidence",
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
    rationale: "Row counts sized for Requisition Intake & Validation so the agent can demonstrate the workflow against realistic transactional volume without simulating a production warehouse.",
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
      id: "slack",
      name: "Slack",
      owns: [
        "messages",
        "channels",
        "thread_replies",
      ],
      protocol: "Slack API",
      localBacking: [
        "json-api",
      ],
      toolNames: [
        "query_slack_messages",
        "query_slack_channels",
        "query_slack_thread_replies",
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
      name: "messages",
      sourceSystemId: "slack",
      datastore: "json-api",
      rowCount: 60,
      primaryKey: "id",
      columns: [
        {
          name: "id",
          type: "seq",
          required: true,
        },
        {
          name: "channel",
          type: "lorem.words",
          required: true,
        },
        {
          name: "author",
          type: "person.fullName",
          required: true,
        },
        {
          name: "body",
          type: "lorem.sentence",
          required: true,
        },
        {
          name: "sentiment",
          type: "enum",
          values: [
            "positive",
            "neutral",
            "negative",
          ],
          weights: [
            0.4,
            0.4,
            0.2,
          ],
          required: true,
        },
        {
          name: "sent_at",
          type: "date",
          required: true,
        },
      ],
    },
    {
      name: "channels",
      sourceSystemId: "slack",
      datastore: "json-api",
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
      name: "thread_replies",
      sourceSystemId: "slack",
      datastore: "json-api",
      rowCount: 60,
      primaryKey: "id",
      columns: [
        {
          name: "id",
          type: "seq",
          required: true,
        },
        {
          name: "channel",
          type: "lorem.words",
          required: true,
        },
        {
          name: "author",
          type: "person.fullName",
          required: true,
        },
        {
          name: "body",
          type: "lorem.sentence",
          required: true,
        },
        {
          name: "sentiment",
          type: "enum",
          values: [
            "positive",
            "neutral",
            "negative",
          ],
          weights: [
            0.4,
            0.4,
            0.2,
          ],
          required: true,
        },
        {
          name: "sent_at",
          type: "date",
          required: true,
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
  ],
  relationships: [],
  documents: [
    {
      id: "requisition-intake-validation-policy-handbook",
      sourceSystemId: "workday",
      type: "policy",
      title: "Requisition Intake & Validation Policy Handbook",
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
  apis: [],
  anomalies: [
    {
      id: "requisition-intake-validation-baseline-gap",
      description: "Seed a realistic gap where Intake time sits between 3 days and 15 min, so the agent can detect, narrate, and recommend remediation.",
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
      expectedRecommendation: "Explain the gap, cite supporting evidence, and propose the next Recruiter action.",
    },
  ],
  datastorePackaging: {
    alloydb: {
      database: "requisition_intake_validation",
      schemas: [
        "workday",
        "sap_successfactors",
        "slack",
        "servicenow",
      ],
    },
    bigquery: {
      dataset: "hr_requisition_intake_validation",
      tables: [
        "kpi_summary",
        "evidence_index",
      ],
    },
    cloudStorage: {
      bucketSuffix: "requisition-intake-validation-evidence",
      prefixes: [
        "documents",
        "audit-trails",
        "exports",
      ],
    },
    apis: {
      serviceName: "requisition-intake-validation-source-adapters",
      deploymentTarget: "cloud_run",
    },
  },
  validation: {
    smokePrompt: "Run the Requisition Intake & Validation workflow and cite source-system evidence for every claim.",
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

export const RequisitionIntake = () => (
  <UseCaseSlide
    title="Requisition Intake & Validation"
    subtitle="A-201 • Talent Acquisition"
    icon={ClipboardCheck}
    domainId="domain-2"
    layer="Layer 2: Agent Designer"
    persona="Recruiter"
    systems={["Workday", "SAP SuccessFactors", "Slack", "ServiceNow"]}
    kpis={[
      { label: "Intake time", before: "3 days", after: "15 min" },
      { label: "Validation errors", before: "25%", after: "<2%" },
      { label: "Budget checks", before: "Manual", after: "Real-time" }
    ]}
    triggerType="chat"
    swimlane={swimlane}
    hitl={{ actor: "HRBP", action: "Validate requisition", description: "Agent validates budget and headcount plan. HRBP reviews and confirms alignment with workforce strategy before routing to finance." }}
    architecture={architecture}
    statusQuo={[
      "Managers fill incomplete forms in ATS; manual HRBP validation.",
      "Finance budget confirmation takes 1-3 days via email.",
      "Comp team manually validates grade and salary ranges."
    ]}
    agentification={[
      "Conversational intake auto-populates from workforce plan.",
      "Real-time budget validation via Finance API integration.",
      "Zero-touch validation for standard roles; exception-only review."
    ]}
    flow={[
      { label: "Req Submitted", icon: Upload, description: "Hiring manager submits via conversational form.", trigger: "Manager Request", systems: ["Slack"] },
      { label: "Auto-Validate", icon: Shield, description: "Budget, headcount plan, comp band validated.", systems: ["Gemini", "HRIS"], integration: "Agent Designer" },
      { label: "Enrichment", icon: Search, description: "Market data and similar req history appended." },
      { label: "Routed", icon: Send, description: "Validated req routed to HRBP and finance.", output: "Approved Req" }
    ] as FlowStep[]}
  />
);
