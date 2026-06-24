import React from "react";
import { UseCaseSlide } from "../../../agent/UseCaseSlide";
import { AgentArchitecture, UseCaseGenerationSpec, AgentBehaviorContract} from "../../../../types/architecture";
import { Scale, Upload, Search, Shield, Eye } from "lucide-react";
import { FlowStep } from "../../../agent/ProcessFlow";
import { SwimlaneFlow } from "../../../agent/SwimlaneFlow";

const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "s1", label: "Discipline Event", lane: "system", type: "trigger" },
    { id: "a1", label: "Precedent Search", lane: "agent", type: "action" },
    { id: "a2", label: "Recommendation", lane: "agent", type: "action" },
    { id: "h1", label: "HRBP Approves", lane: "human", type: "hitl" },
    { id: "a3", label: "Action Documented", lane: "agent", type: "output" },
  ],
  connections: [["s1", "a1"], ["a1", "a2"], ["a2", "h1"], ["h1", "a3"]],
};

const flow: FlowStep[] = [
  { label: "Situation Input", icon: Upload, description: "Incident details and employee history provided.", trigger: "Discipline Event", systems: ["ServiceNow"] },
  { label: "Precedent Search", icon: Search, description: "Similar cases and outcomes retrieved and compared.", systems: ["Gemini"], integration: "Agent Designer" },
  { label: "Recommendation", icon: Shield, description: "Consistent action recommended with policy citation." },
  { label: "Risk Assessment", icon: Eye, description: "Legal risk score with ER escalation if needed.", output: "Action Recommendation" }
];

const architecture: AgentArchitecture = {
  connections: [
    { system: "Workday", description: "Employee history, prior disciplinary actions, tenure, performance", direction: "read", protocol: "REST API", category: "erp" },
    { system: "ServiceNow", description: "Incident details, prior case records, investigation outcomes", direction: "bidirectional", protocol: "REST API", category: "erp" },
    { system: "Legal KB", description: "Employment law references, policy library, case law precedents", direction: "read", protocol: "REST API", category: "market-data" },
    { system: "Vertex AI (Gemini)", description: "Precedent matching, consistency reasoning, risk assessment, recommendation drafting", direction: "bidirectional", protocol: "gRPC", category: "ai" },
  ],
  pipeline: [
    { label: "Situation Intake", description: "Capture incident details from ServiceNow and pull employee history from Workday including prior disciplinary actions, tenure, and performance record.", systems: ["ServiceNow", "Workday"], layer: "integration", dataIn: "Incident report + employee ID", dataOut: "Complete situation context with employee history" },
    { label: "Precedent Search & Analysis", description: "Gemini searches historical cases for similar situations. Compares outcomes and identifies the consistent discipline action based on precedent patterns and policy.", systems: ["Vertex AI (Gemini)", "ServiceNow", "Legal KB"], layer: "llm", dataIn: "Situation context + historical case corpus", dataOut: "Matched precedents with outcome analysis" },
    { label: "Recommendation & Risk Assessment", description: "Generate consistent discipline recommendation with policy citations and relevant case law. Score legal risk and flag high-risk cases for automatic ER escalation.", systems: ["Vertex AI (Gemini)", "Legal KB"], layer: "llm", dataIn: "Precedent analysis + applicable policies", dataOut: "Action recommendation with risk score and policy citations" },
    { label: "Documentation & Escalation", description: "Document approved action in ServiceNow with full audit trail. Route high-risk cases to ER team with pre-assembled context for expedited review.", systems: ["ServiceNow"], layer: "integration", dataIn: "Approved recommendation + HRBP decision", dataOut: "Documented action with escalation routing" },
  ],
};


const behaviorContract: AgentBehaviorContract = {
  role: "HRBP agent for the Progressive Discipline Advisor Agent workflow",
  primaryObjective: "Precedent-aware discipline recommendations ensuring consistency across the organization. Automated policy citation and relevant case law references for each situation. so the HRBP can move the Consistency score KPI.",
  inScope: [
    "Precedent-aware discipline recommendations ensuring consistency across the organization",
    "Automated policy citation and relevant case law references for each situation",
    "Real-time legal risk assessment with automatic ER team escalation for high-risk cases",
  ],
  outOfScope: [
    "Final hiring, termination, or compensation decisions (HRBP/leadership retains authority)",
    "Performance management adjudication and disciplinary action",
    "Legal interpretation of employment law in ambiguous jurisdictions",
  ],
  toolIntents: [
    {
      name: "query_servicenow_tickets",
      kind: "query",
      sourceSystemId: "servicenow",
      description: "Retrieve tickets from ServiceNow for the Progressive Discipline Advisor Agent workflow.",
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
      name: "query_workday_employees",
      kind: "query",
      sourceSystemId: "workday",
      description: "Retrieve employees from Workday for the Progressive Discipline Advisor Agent workflow.",
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
      name: "query_legal_db_legal_db_records",
      kind: "query",
      sourceSystemId: "legal_db",
      description: "Retrieve legal db records from Legal DB for the Progressive Discipline Advisor Agent workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "legal_db_records_records",
        "legal_db_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "lookup_progressive_discipline_advisor_agent_policy_handbook",
      kind: "evidence_lookup",
      sourceSystemId: "servicenow",
      description: "Look up sections of the Progressive Discipline Advisor Agent Policy Handbook to cite in narrative output, escalation rationale, and audit evidence.",
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
      name: "action_servicenow_recommend",
      kind: "action",
      sourceSystemId: "servicenow",
      description: "Execute the recommend step in ServiceNow after the agent has gathered evidence and validated escalation gates.",
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
      claim: "Consistency score moved from Varies toward 95%+",
      mustCite: [
        "servicenow.tickets",
        "workday.employees",
      ],
      sourceSystemIds: [
        "servicenow",
        "workday",
      ],
    },
    {
      claim: "Legal risk flags moved from Post-decision toward Pre-decision",
      mustCite: [
        "servicenow.tickets",
        "workday.employees",
      ],
      sourceSystemIds: [
        "servicenow",
        "workday",
      ],
    },
  ],
  escalationRules: [
    {
      trigger: "Consistency score regresses past the Varies baseline by more than 20%",
      action: "escalate_to_human",
      handoffTarget: "HRBP",
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
    "Never fabricate metric values; only publish numbers derived from ServiceNow (and other named systems) entities.",
    "Never bypass HRBP approval on escalation triggers, even when confidence is high.",
    "Never expose individual personal data (PII) in summaries; aggregate or pseudonymise before output.",
    "Never act on data older than the staleness threshold defined in the runbook without a fresh re-query.",
  ],
  goldenEvals: [
    {
      id: "progressive-discipline-advisor-agent-end-to-end",
      prompt: "Run the Progressive Discipline Advisor Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.",
      expectedToolCalls: [
        "query_servicenow_tickets",
        "query_workday_employees",
        "query_legal_db_legal_db_records",
        "lookup_progressive_discipline_advisor_agent_policy_handbook",
        "action_servicenow_recommend",
      ],
      mustReferenceEntities: [
        "tickets",
        "employees",
        "legal_db_records",
      ],
      mustCiteDocuments: [
        "progressive-discipline-advisor-agent-policy-handbook",
      ],
      expectedActionOutcome: "Action recommend executed against ServiceNow, with audit-trail entry and HRBP notified of outcomes.",
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
    rationale: "Row counts sized for Progressive Discipline Advisor Agent so the agent can demonstrate the workflow against realistic transactional volume without simulating a production warehouse.",
  },
  sourceSystems: [
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
      id: "legal_db",
      name: "Legal DB",
      owns: [
        "legal_db_records",
        "legal_db_events",
        "legal_db_audit_trail",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_legal_db_legal_db_records",
        "query_legal_db_legal_db_events",
        "query_legal_db_legal_db_audit_trail",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
  ],
  entities: [
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
      name: "legal_db_records",
      sourceSystemId: "legal_db",
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
      name: "legal_db_events",
      sourceSystemId: "legal_db",
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
          name: "legal_db_record_id",
          type: "ref",
          ref: "legal_db_records.id",
          required: true,
        },
      ],
    },
    {
      name: "legal_db_audit_trail",
      sourceSystemId: "legal_db",
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
      from: "legal_db_events.legal_db_record_id",
      to: "legal_db_records.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
  ],
  documents: [
    {
      id: "progressive-discipline-advisor-agent-policy-handbook",
      sourceSystemId: "servicenow",
      type: "policy",
      title: "Progressive Discipline Advisor Agent Policy Handbook",
      requiredSections: [
        "Eligibility and scope",
        "Workflow steps",
        "Manager responsibilities",
        "Compliance and audit",
        "Sensitive-data handling",
      ],
      linkedEntities: [
        "tickets",
        "change_requests",
        "incidents",
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
      id: "servicenow_recommend_api",
      sourceSystemId: "servicenow",
      method: "POST",
      path: "/api/servicenow/recommend",
      description: "Synchronous endpoint the agent calls to recommend in ServiceNow after evidence gating.",
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
      id: "progressive-discipline-advisor-agent-baseline-gap",
      description: "Seed a realistic gap where Consistency score sits between Varies and 95%+, so the agent can detect, narrate, and recommend remediation.",
      affectedEntities: [
        "tickets",
        "change_requests",
      ],
      discoveryPath: [
        "Inspect ServiceNow records for the affected entities",
        "Compare against Workday historical baseline",
        "Generate a citation-backed recommendation",
      ],
      expectedEvidence: [
        "source-system record",
        "historical baseline metric",
        "generated audit trail",
      ],
      expectedRecommendation: "Explain the gap, cite supporting evidence, and propose the next HRBP action.",
    },
  ],
  datastorePackaging: {
    alloydb: {
      database: "progressive_discipline_advisor_agent",
      schemas: [
        "servicenow",
        "workday",
        "legal_db",
      ],
    },
    bigquery: {
      dataset: "hr_progressive_discipline_advisor_agent",
      tables: [
        "kpi_summary",
        "evidence_index",
      ],
    },
    cloudStorage: {
      bucketSuffix: "progressive-discipline-advisor-agent-evidence",
      prefixes: [
        "documents",
        "audit-trails",
        "exports",
      ],
    },
    apis: {
      serviceName: "progressive-discipline-advisor-agent-source-adapters",
      deploymentTarget: "cloud_run",
    },
  },
  validation: {
    smokePrompt: "Run the Progressive Discipline Advisor Agent workflow and cite source-system evidence for every claim.",
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

export const ProgressiveDisciplineAdvisor = () => (
  <UseCaseSlide
    title="Progressive Discipline Advisor Agent"
    subtitle="A-604 • Employee Relations"
    icon={Scale}
    domainId="domain-6"
    layer="Layer 2: Agent Designer"
    persona="HRBP"
    triggerType="event"
    swimlane={swimlane}
    hitl={{ actor: "HRBP", action: "Approve discipline action", description: "Agent recommends consistent discipline action based on precedent research. HRBP validates recommendation and assesses legal risk before action is taken." }}
    architecture={architecture}
    systems={["ServiceNow", "Workday", "Legal DB"]}
    kpis={[
      { label: "Consistency score", before: "Varies", after: "95%+" },
      { label: "Legal risk flags", before: "Post-decision", after: "Pre-decision" },
      { label: "Precedent research", before: "Hours", after: "Seconds" }
    ]}
    flow={flow}
    statusQuo={[
      "Discipline decisions inconsistent across managers and business units.",
      "Precedent research is manual, time-consuming, and often incomplete.",
      "Legal exposure from disparate treatment due to lack of centralized guidance."
    ]}
    agentification={[
      "Precedent-aware discipline recommendations ensuring consistency across the organization.",
      "Automated policy citation and relevant case law references for each situation.",
      "Real-time legal risk assessment with automatic ER team escalation for high-risk cases."
    ]}
  />
);
