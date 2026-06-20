import React from "react";
import { UseCaseSlide } from "../../../agent/UseCaseSlide";
import { FlowStep } from "../../../agent/ProcessFlow";
import { SwimlaneFlow } from "../../../agent/SwimlaneFlow";
import { AgentArchitecture, UseCaseGenerationSpec, AgentBehaviorContract} from "../../../../types/architecture";
import { Layout, Download, BarChart, Calculator, FileText } from "lucide-react";

const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "n1", label: "Usage Data", lane: "system", type: "trigger" },
    { id: "n2", label: "Utilization Analysis", lane: "agent", type: "action" },
    { id: "n3", label: "ROI Assessment", lane: "agent", type: "action" },
    { id: "n4", label: "Renewal Intelligence", lane: "agent", type: "output" },
  ],
  connections: [["n1", "n2"], ["n2", "n3"], ["n3", "n4"]],
};

const architecture: AgentArchitecture = {
  connections: [
    { system: "Gartner", description: "Market research, vendor ratings, capability assessments", direction: "read", protocol: "REST API", category: "market-data" },
    { system: "G2", description: "User reviews, satisfaction scores, feature comparisons", direction: "read", protocol: "REST API", category: "market-data" },
    { system: "Workday", description: "Current HR tech stack usage, license allocations, integration points", direction: "read", protocol: "REST API", category: "erp" },
    { system: "BigQuery", description: "Tech stack analytics, utilization trends, cost optimization data", direction: "bidirectional", protocol: "BigQuery SQL", category: "analytics" },
    { system: "Vertex AI (Gemini)", description: "Utilization analysis reasoning, ROI assessment, renewal strategy generation", direction: "bidirectional", protocol: "gRPC", category: "ai" },
  ],
  pipeline: [
    { label: "Usage Data Collection", description: "Sync login frequency, feature usage, and license allocation data from all HR systems. Aggregate with Gartner and G2 market data for competitive context.", systems: ["Workday", "Gartner", "G2"], layer: "integration", dataIn: "System usage logs + license data + market research", dataOut: "Unified tech stack dataset with market context" },
    { label: "Utilization Analysis", description: "Analyze license utilization, feature adoption rates, and capability overlap across the HR tech stack. Identify waste, underused features, and duplicate capabilities.", systems: ["BigQuery"], layer: "ml", dataIn: "Tech stack dataset + license costs", dataOut: "Utilization report with waste identification" },
    { label: "ROI Assessment", description: "Gemini calculates per-system ROI and generates cost optimization recommendations. Compare internal utilization against market benchmarks and peer adoption.", systems: ["Vertex AI (Gemini)"], layer: "llm", dataIn: "Utilization report + market benchmarks", dataOut: "ROI scorecard with optimization opportunities" },
    { label: "Renewal Intelligence", description: "Generate renewal strategy with negotiation data points, competitive alternatives, and 12-month forecast. Produce tech stack rationalization roadmap.", systems: ["Vertex AI (Gemini)"], layer: "llm", dataIn: "ROI scorecard + renewal timeline + market data", dataOut: "Renewal strategy with negotiation playbook" },
  ],
};


const behaviorContract: AgentBehaviorContract = {
  role: "HR Tech Lead agent for the HR Tech Stack Intelligence workflow",
  primaryObjective: "Real-time inventory and license utilization monitoring. Proactive renewal alerts with cost-saving recommendations. so the HR Tech Lead can move the License utilization KPI.",
  inScope: [
    "Real-time inventory and license utilization monitoring",
    "Proactive renewal alerts with cost-saving recommendations",
    "Automated detection of duplicate or underused capabilities",
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
      description: "Retrieve employees from Workday for the HR Tech Stack Intelligence workflow.",
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
      name: "query_servicenow_tickets",
      kind: "query",
      sourceSystemId: "servicenow",
      description: "Retrieve tickets from ServiceNow for the HR Tech Stack Intelligence workflow.",
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
      name: "query_google_admin_google_admin_records",
      kind: "query",
      sourceSystemId: "google_admin",
      description: "Retrieve google admin records from Google Admin for the HR Tech Stack Intelligence workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "google_admin_records_records",
        "google_admin_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_license_manager_license_manager_records",
      kind: "query",
      sourceSystemId: "license_manager",
      description: "Retrieve license manager records from License Manager for the HR Tech Stack Intelligence workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "license_manager_records_records",
        "license_manager_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "lookup_hr_tech_stack_intelligence_policy_handbook",
      kind: "evidence_lookup",
      sourceSystemId: "workday",
      description: "Look up sections of the HR Tech Stack Intelligence Policy Handbook to cite in narrative output, escalation rationale, and audit evidence.",
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
      name: "action_workday_recommend",
      kind: "action",
      sourceSystemId: "workday",
      description: "Execute the recommend step in Workday after the agent has gathered evidence and validated escalation gates.",
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
      claim: "License utilization moved from Unknown until renewal toward Real-time",
      mustCite: [
        "workday.employees",
        "servicenow.tickets",
      ],
      sourceSystemIds: [
        "workday",
        "servicenow",
      ],
    },
    {
      claim: "Cost waste moved from Hidden toward Quantified",
      mustCite: [
        "workday.employees",
        "servicenow.tickets",
      ],
      sourceSystemIds: [
        "workday",
        "servicenow",
      ],
    },
  ],
  escalationRules: [
    {
      trigger: "License utilization regresses past the Unknown until renewal baseline by more than 20%",
      action: "escalate_to_human",
      handoffTarget: "HR Tech Lead",
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
    "Never fabricate metric values; only publish numbers derived from Workday (and other named systems) entities.",
    "Never bypass HR Tech Lead approval on escalation triggers, even when confidence is high.",
    "Never expose individual personal data (PII) in summaries; aggregate or pseudonymise before output.",
    "Never act on data older than the staleness threshold defined in the runbook without a fresh re-query.",
  ],
  goldenEvals: [
    {
      id: "hr-tech-stack-intelligence-end-to-end",
      prompt: "Run the HR Tech Stack Intelligence workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.",
      expectedToolCalls: [
        "query_workday_employees",
        "query_servicenow_tickets",
        "query_google_admin_google_admin_records",
        "query_license_manager_license_manager_records",
        "lookup_hr_tech_stack_intelligence_policy_handbook",
        "action_workday_recommend",
      ],
      mustReferenceEntities: [
        "employees",
        "tickets",
        "google_admin_records",
        "license_manager_records",
      ],
      mustCiteDocuments: [
        "hr-tech-stack-intelligence-policy-handbook",
      ],
      expectedActionOutcome: "Action recommend executed against Workday, with audit-trail entry and HR Tech Lead notified of outcomes.",
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
    rationale: "Row counts sized for HR Tech Stack Intelligence so the agent can demonstrate the workflow against realistic transactional volume without simulating a production warehouse.",
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
      id: "google_admin",
      name: "Google Admin",
      owns: [
        "google_admin_records",
        "google_admin_events",
        "google_admin_audit_trail",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_google_admin_google_admin_records",
        "query_google_admin_google_admin_events",
        "query_google_admin_google_admin_audit_trail",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
    {
      id: "license_manager",
      name: "License Manager",
      owns: [
        "license_manager_records",
        "license_manager_events",
        "license_manager_audit_trail",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_license_manager_license_manager_records",
        "query_license_manager_license_manager_events",
        "query_license_manager_license_manager_audit_trail",
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
      name: "google_admin_records",
      sourceSystemId: "google_admin",
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
      name: "google_admin_events",
      sourceSystemId: "google_admin",
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
          name: "google_admin_record_id",
          type: "ref",
          ref: "google_admin_records.id",
          required: true,
        },
      ],
    },
    {
      name: "google_admin_audit_trail",
      sourceSystemId: "google_admin",
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
      name: "license_manager_records",
      sourceSystemId: "license_manager",
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
      name: "license_manager_events",
      sourceSystemId: "license_manager",
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
          name: "license_manager_record_id",
          type: "ref",
          ref: "license_manager_records.id",
          required: true,
        },
      ],
    },
    {
      name: "license_manager_audit_trail",
      sourceSystemId: "license_manager",
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
      from: "google_admin_events.google_admin_record_id",
      to: "google_admin_records.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
    {
      from: "license_manager_events.license_manager_record_id",
      to: "license_manager_records.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
  ],
  documents: [
    {
      id: "hr-tech-stack-intelligence-policy-handbook",
      sourceSystemId: "workday",
      type: "policy",
      title: "HR Tech Stack Intelligence Policy Handbook",
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
      id: "workday_recommend_api",
      sourceSystemId: "workday",
      method: "POST",
      path: "/api/workday/recommend",
      description: "Synchronous endpoint the agent calls to recommend in Workday after evidence gating.",
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
      id: "hr-tech-stack-intelligence-baseline-gap",
      description: "Seed a realistic gap where License utilization sits between Unknown until renewal and Real-time, so the agent can detect, narrate, and recommend remediation.",
      affectedEntities: [
        "employees",
        "positions",
      ],
      discoveryPath: [
        "Inspect Workday records for the affected entities",
        "Compare against ServiceNow historical baseline",
        "Generate a citation-backed recommendation",
      ],
      expectedEvidence: [
        "source-system record",
        "historical baseline metric",
        "generated audit trail",
      ],
      expectedRecommendation: "Explain the gap, cite supporting evidence, and propose the next HR Tech Lead action.",
    },
  ],
  datastorePackaging: {
    alloydb: {
      database: "hr_tech_stack_intelligence",
      schemas: [
        "workday",
        "servicenow",
        "google_admin",
        "license_manager",
      ],
    },
    bigquery: {
      dataset: "hr_hr_tech_stack_intelligence",
      tables: [
        "kpi_summary",
        "evidence_index",
      ],
    },
    cloudStorage: {
      bucketSuffix: "hr-tech-stack-intelligence-evidence",
      prefixes: [
        "documents",
        "audit-trails",
        "exports",
      ],
    },
    apis: {
      serviceName: "hr-tech-stack-intelligence-source-adapters",
      deploymentTarget: "cloud_run",
    },
  },
  validation: {
    smokePrompt: "Run the HR Tech Stack Intelligence workflow and cite source-system evidence for every claim.",
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

export const HRTechIntelligence = () => (
  <UseCaseSlide
    triggerType="scheduled"
    swimlane={swimlane}
    title="HR Tech Stack Intelligence"
    subtitle="A-1004 • HR Technology"
    icon={Layout}
    domainId="domain-10"
    layer="Layer 2: Agent Designer"
    persona="HR Tech Lead"
    systems={["Workday", "ServiceNow", "Google Admin", "License Manager"]}
    kpis={[
      { label: "License utilization", before: "Unknown until renewal", after: "Real-time" },
      { label: "Cost waste", before: "Hidden", after: "Quantified" },
      { label: "Renewal prep", before: "Scramble", after: "12-month forecast" }
    ]}
    statusQuo={[
      "HR tech inventory maintained in manual spreadsheets.",
      "License waste goes undetected; renewals are reactive.",
      "Cost optimization opportunities are identified ad-hoc."
    ]}
    agentification={[
      "Real-time inventory and license utilization monitoring.",
      "Proactive renewal alerts with cost-saving recommendations.",
      "Automated detection of duplicate or underused capabilities."
    ]}
    architecture={architecture}
    flow={[
      { label: "Usage Data", icon: Download, description: "Login, feature usage, license allocation synced.", trigger: "Continuous", systems: ["All HR Systems"] },
      { label: "Utilization Analysis", icon: BarChart, description: "License usage, feature adoption, waste identified.", systems: ["Gemini"], integration: "Agent Designer" },
      { label: "ROI Assessment", icon: Calculator, description: "Per-system ROI and cost optimization opportunities." },
      { label: "Renewal Intelligence", icon: FileText, description: "Renewal strategy with negotiation data points.", output: "Tech Report" }
    ]}
  />
);
