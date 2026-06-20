import React from "react";
import { UseCaseSlide } from "../../../agent/UseCaseSlide";
import { FlowStep } from "../../../agent/ProcessFlow";
import { SwimlaneFlow } from "../../../agent/SwimlaneFlow";
import { AgentArchitecture, UseCaseGenerationSpec, AgentBehaviorContract} from "../../../../types/architecture";
import { Award, Download, BarChart, Calculator, Bell } from "lucide-react";

const flow: FlowStep[] = [
  { label: "Grant Data", icon: Download, description: "Equity grants, vesting schedules, current value synced.", trigger: "Vesting Event", systems: ["Equity Platform"] },
  { label: "Dashboard Generation", icon: BarChart, description: "Personalized equity portfolio visualization.", systems: ["Gemini"], integration: "OOTB" },
  { label: "Tax Guidance", icon: Calculator, description: "Plain-language tax impact explanations generated." },
  { label: "Notification", icon: Bell, description: "Proactive vesting and exercise window alerts.", output: "Equity Portal" },
];

const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "trigger", label: "Vesting Event", lane: "system", type: "trigger" },
    { id: "dash", label: "Dashboard Generation", lane: "agent", type: "action" },
    { id: "tax", label: "Tax Guidance", lane: "agent", type: "action" },
    { id: "output", label: "Employee Notified", lane: "human", type: "output" },
  ],
  connections: [["trigger", "dash"], ["dash", "tax"], ["tax", "output"]],
};

const architecture: AgentArchitecture = {
  connections: [
    { system: "Workday", description: "Employee profile, compensation history, employment status", direction: "read", protocol: "REST API", category: "erp" },
    { system: "Carta/Shareworks", description: "Equity grants, vesting schedules, exercise history, current valuations", direction: "read", protocol: "REST API", category: "erp" },
    { system: "Google Docs", description: "Personalized equity statements, tax guidance documents", direction: "write", protocol: "Workspace API", category: "collaboration" },
    { system: "Vertex AI (Gemini)", description: "Plain-language tax explanations, portfolio visualization, notification content", direction: "bidirectional", protocol: "gRPC", category: "ai" },
  ],
  pipeline: [
    { label: "Grant Data Sync", description: "Pull equity grant details, vesting schedules, exercise windows, and current valuations from Carta/Shareworks. Match with employee profile from Workday.", systems: ["Carta/Shareworks", "Workday"], layer: "integration", dataIn: "Equity platform records + employee profiles", dataOut: "Unified equity portfolio per participant" },
    { label: "Dashboard & Tax Generation", description: "Gemini generates personalized equity portfolio visualizations with interactive vesting timelines. Creates plain-language tax impact explanations tailored to each participant's jurisdiction and situation.", systems: ["Vertex AI (Gemini)"], layer: "llm", dataIn: "Equity portfolio + tax jurisdiction data", dataOut: "Personalized dashboard content + tax guidance" },
    { label: "Proactive Notifications", description: "Automated vesting event notifications and exercise window alerts with action prompts. Distributed via email and employee portal with read tracking.", systems: ["Google Docs", "Gmail"], layer: "integration", dataIn: "Upcoming vesting events + exercise windows", dataOut: "Timely participant notifications with action links" },
  ],
};


const behaviorContract: AgentBehaviorContract = {
  role: "Employee agent for the Equity Participant Communicator workflow",
  primaryObjective: "Personalized equity portfolio dashboards with interactive vesting timelines. Automated vesting and exercise window notifications with action prompts. so the Employee can move the Participant understanding KPI.",
  inScope: [
    "Personalized equity portfolio dashboards with interactive vesting timelines",
    "Automated vesting and exercise window notifications with action prompts",
    "Plain-language tax impact explanations tailored to each participant's situation",
  ],
  outOfScope: [
    "Final hiring, termination, or compensation decisions (HRBP/leadership retains authority)",
    "Performance management adjudication and disciplinary action",
    "Legal interpretation of employment law in ambiguous jurisdictions",
  ],
  toolIntents: [
    {
      name: "query_e_trade_e_trade_records",
      kind: "query",
      sourceSystemId: "e_trade",
      description: "Retrieve e trade records from E*Trade for the Equity Participant Communicator workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "e_trade_records_records",
        "e_trade_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_carta_carta_records",
      kind: "query",
      sourceSystemId: "carta",
      description: "Retrieve carta records from Carta for the Equity Participant Communicator workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "carta_records_records",
        "carta_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_workday_employees",
      kind: "query",
      sourceSystemId: "workday",
      description: "Retrieve employees from Workday for the Equity Participant Communicator workflow.",
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
      name: "query_gmail_messages",
      kind: "query",
      sourceSystemId: "gmail",
      description: "Retrieve messages from Gmail for the Equity Participant Communicator workflow.",
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
      name: "lookup_equity_participant_communicator_policy_handbook",
      kind: "evidence_lookup",
      sourceSystemId: "e_trade",
      description: "Look up sections of the Equity Participant Communicator Policy Handbook to cite in narrative output, escalation rationale, and audit evidence.",
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
      claim: "Participant understanding moved from Low toward High",
      mustCite: [
        "e_trade.e_trade_records",
        "carta.carta_records",
      ],
      sourceSystemIds: [
        "e_trade",
        "carta",
      ],
    },
    {
      claim: "Vesting notifications moved from Manual check toward Proactive",
      mustCite: [
        "e_trade.e_trade_records",
        "carta.carta_records",
      ],
      sourceSystemIds: [
        "e_trade",
        "carta",
      ],
    },
  ],
  escalationRules: [
    {
      trigger: "Participant understanding regresses past the Low baseline by more than 20%",
      action: "escalate_to_human",
      handoffTarget: "Employee",
      rationale: "Significant regressions need human judgment before automated remediation runs against production records.",
    },
    {
      trigger: "Source-system evidence is incomplete or stale (>24h) for any required entity",
      action: "request_more_info",
      rationale: "Recommendations grounded in stale evidence misrepresent current state and undermine audit defensibility.",
    },
  ],
  refusalRules: [
    "Never fabricate metric values; only publish numbers derived from E*Trade (and other named systems) entities.",
    "Never bypass Employee approval on escalation triggers, even when confidence is high.",
    "Never expose individual personal data (PII) in summaries; aggregate or pseudonymise before output.",
    "Never act on data older than the staleness threshold defined in the runbook without a fresh re-query.",
  ],
  goldenEvals: [
    {
      id: "equity-participant-communicator-end-to-end",
      prompt: "Run the Equity Participant Communicator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.",
      expectedToolCalls: [
        "query_e_trade_e_trade_records",
        "query_carta_carta_records",
        "query_workday_employees",
        "query_gmail_messages",
        "lookup_equity_participant_communicator_policy_handbook",
      ],
      mustReferenceEntities: [
        "e_trade_records",
        "carta_records",
        "employees",
        "messages",
      ],
      mustCiteDocuments: [
        "equity-participant-communicator-policy-handbook",
      ],
      expectedActionOutcome: "Employee receives a fully-cited recommendation; no external state change without explicit approval.",
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
    rationale: "Row counts sized for Equity Participant Communicator so the agent can demonstrate the workflow against realistic transactional volume without simulating a production warehouse.",
  },
  sourceSystems: [
    {
      id: "e_trade",
      name: "E*Trade",
      owns: [
        "e_trade_records",
        "e_trade_events",
        "e_trade_audit_trail",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_e_trade_e_trade_records",
        "query_e_trade_e_trade_events",
        "query_e_trade_e_trade_audit_trail",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
    {
      id: "carta",
      name: "Carta",
      owns: [
        "carta_records",
        "carta_events",
        "carta_audit_trail",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_carta_carta_records",
        "query_carta_carta_events",
        "query_carta_carta_audit_trail",
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
      id: "gmail",
      name: "Gmail",
      owns: [
        "messages",
        "threads",
        "delivery_receipts",
      ],
      protocol: "Workspace API",
      localBacking: [
        "json-api",
      ],
      toolNames: [
        "query_gmail_messages",
        "query_gmail_threads",
        "query_gmail_delivery_receipts",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
  ],
  entities: [
    {
      name: "e_trade_records",
      sourceSystemId: "e_trade",
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
      name: "e_trade_events",
      sourceSystemId: "e_trade",
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
          name: "e_trade_record_id",
          type: "ref",
          ref: "e_trade_records.id",
          required: true,
        },
      ],
    },
    {
      name: "e_trade_audit_trail",
      sourceSystemId: "e_trade",
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
      name: "carta_records",
      sourceSystemId: "carta",
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
      name: "carta_events",
      sourceSystemId: "carta",
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
          name: "carta_record_id",
          type: "ref",
          ref: "carta_records.id",
          required: true,
        },
      ],
    },
    {
      name: "carta_audit_trail",
      sourceSystemId: "carta",
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
      name: "messages",
      sourceSystemId: "gmail",
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
      name: "threads",
      sourceSystemId: "gmail",
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
      name: "delivery_receipts",
      sourceSystemId: "gmail",
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
      from: "e_trade_events.e_trade_record_id",
      to: "e_trade_records.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
    {
      from: "carta_events.carta_record_id",
      to: "carta_records.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
  ],
  documents: [
    {
      id: "equity-participant-communicator-policy-handbook",
      sourceSystemId: "e_trade",
      type: "policy",
      title: "Equity Participant Communicator Policy Handbook",
      requiredSections: [
        "Eligibility and scope",
        "Workflow steps",
        "Manager responsibilities",
        "Compliance and audit",
        "Sensitive-data handling",
      ],
      linkedEntities: [
        "e_trade_records",
        "e_trade_events",
        "e_trade_audit_trail",
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
      id: "equity-participant-communicator-baseline-gap",
      description: "Seed a realistic gap where Participant understanding sits between Low and High, so the agent can detect, narrate, and recommend remediation.",
      affectedEntities: [
        "e_trade_records",
        "e_trade_events",
      ],
      discoveryPath: [
        "Inspect E*Trade records for the affected entities",
        "Compare against Carta historical baseline",
        "Generate a citation-backed recommendation",
      ],
      expectedEvidence: [
        "source-system record",
        "historical baseline metric",
        "generated audit trail",
      ],
      expectedRecommendation: "Explain the gap, cite supporting evidence, and propose the next Employee action.",
    },
  ],
  datastorePackaging: {
    alloydb: {
      database: "equity_participant_communicator",
      schemas: [
        "e_trade",
        "carta",
        "workday",
        "gmail",
      ],
    },
    bigquery: {
      dataset: "hr_equity_participant_communicator",
      tables: [
        "kpi_summary",
        "evidence_index",
      ],
    },
    cloudStorage: {
      bucketSuffix: "equity-participant-communicator-evidence",
      prefixes: [
        "documents",
        "audit-trails",
        "exports",
      ],
    },
    apis: {
      serviceName: "equity-participant-communicator-source-adapters",
      deploymentTarget: "cloud_run",
    },
  },
  validation: {
    smokePrompt: "Run the Equity Participant Communicator workflow and cite source-system evidence for every claim.",
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

export const EquityParticipantCommunicator = () => (
  <UseCaseSlide
    title="Equity Participant Communicator"
    subtitle="A-409 • Total Rewards"
    icon={Award}
    domainId="domain-4"
    layer="Layer 1: OOTB"
    persona="Employee"
    systems={["E*Trade", "Carta", "Workday", "Gmail"]}
    kpis={[
      { label: "Participant understanding", before: "Low", after: "High" },
      { label: "Vesting notifications", before: "Manual check", after: "Proactive" },
      { label: "Tax question volume", before: "High to HR", after: "-70%" },
    ]}
    flow={flow}
    triggerType="event"
    swimlane={swimlane}
    architecture={architecture}
    statusQuo={[
      "Equity communications are confusing, leaving participants disengaged.",
      "Vesting schedules tracked manually with no proactive notifications.",
      "Tax implications poorly explained, leading to costly employee mistakes."
    ]}
    agentification={[
      "Personalized equity portfolio dashboards with interactive vesting timelines.",
      "Automated vesting and exercise window notifications with action prompts.",
      "Plain-language tax impact explanations tailored to each participant's situation."
    ]}
  />
);
