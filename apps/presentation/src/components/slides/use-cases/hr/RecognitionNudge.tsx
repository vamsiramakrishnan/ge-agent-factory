import React from "react";
import { UseCaseSlide } from "../../../agent/UseCaseSlide";
import { Trophy, Zap, Bell, Award, BarChart } from "lucide-react";
import { FlowStep } from "../../../agent/ProcessFlow";
import { SwimlaneFlow } from "../../../agent/SwimlaneFlow";
import { AgentArchitecture, UseCaseGenerationSpec, AgentBehaviorContract} from "../../../../types/architecture";

const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "s1", label: "Event Detected", lane: "system", type: "trigger" },
    { id: "a1", label: "Nudge Generation", lane: "agent", type: "action" },
    { id: "a2", label: "Celebration", lane: "agent", type: "action" },
    { id: "h1", label: "Recognition Sent", lane: "human", type: "output" },
  ],
  connections: [["s1", "a1"], ["a1", "a2"], ["a2", "h1"]],
};

const flow: FlowStep[] = [
  { label: "Event Detection", icon: Zap, description: "Milestones, achievements, anniversaries detected.", trigger: "Event-driven", systems: ["HRIS"] },
  { label: "Nudge Generation", icon: Bell, description: "Contextual recognition prompts for managers.", systems: ["Gemini"], integration: "Agent Designer" },
  { label: "Celebration", icon: Award, description: "Automated celebrations for milestones and achievements." },
  { label: "Tracking", icon: BarChart, description: "Recognition equity tracked across teams.", output: "Recognition Sent" }
];

const architecture: AgentArchitecture = {
  connections: [
    { system: "Bonusly/Achievers", description: "Recognition history, award types, manager activity levels", direction: "read", protocol: "REST API", category: "erp" },
    { system: "Workday", description: "Milestones, anniversaries, project completions, promotions", direction: "read", protocol: "REST API", category: "erp" },
    { system: "Slack", description: "Recognition nudge delivery and celebration notifications", direction: "write", protocol: "Webhook", category: "collaboration" },
    { system: "Vertex AI (Gemini)", description: "Contextual nudge generation, personalized celebration messages", direction: "bidirectional", protocol: "gRPC", category: "ai" },
  ],
  pipeline: [
    { label: "Event Detection", description: "Monitor Workday for recognizable moments — anniversaries, project completions, promotions, and peer nominations. Cross-reference with recognition platform to identify gaps.", systems: ["Workday", "Bonusly/Achievers"], layer: "integration", dataIn: "Employee milestones + recognition activity history", dataOut: "Recognition opportunity queue with gap analysis" },
    { label: "Nudge Generation", description: "Gemini generates contextual recognition prompts for managers, personalized with employee context, achievement details, and suggested recognition types based on team norms.", systems: ["Vertex AI (Gemini)"], layer: "llm", dataIn: "Recognition opportunities + manager activity levels", dataOut: "Personalized nudge messages with recognition suggestions" },
    { label: "Celebration Automation", description: "Auto-generate milestone celebrations with personalized notes. Deliver via Slack with team-appropriate tone and visibility.", systems: ["Vertex AI (Gemini)", "Slack"], layer: "llm", dataIn: "Milestone events + team preferences", dataOut: "Celebration messages delivered to appropriate channels" },
    { label: "Equity Tracking", description: "Track recognition distribution across teams and demographics. Alert on equity gaps and ensure consistent coverage across the organization.", systems: ["Bonusly/Achievers", "Workday"], layer: "integration", dataIn: "Recognition activity + demographic data", dataOut: "Recognition equity dashboard with gap alerts" },
  ],
};


const behaviorContract: AgentBehaviorContract = {
  role: "Manager agent for the Recognition Nudge & Celebration workflow",
  primaryObjective: "Proactive nudges to managers with low recognition activity. Auto-generated milestone celebrations and personalized notes. so the Manager can move the Recognition frequency KPI.",
  inScope: [
    "Proactive nudges to managers with low recognition activity",
    "Auto-generated milestone celebrations and personalized notes",
    "Real-time surfacing of peer recognition for manager follow-up",
  ],
  outOfScope: [
    "Final hiring, termination, or compensation decisions (HRBP/leadership retains authority)",
    "Performance management adjudication and disciplinary action",
    "Legal interpretation of employment law in ambiguous jurisdictions",
  ],
  toolIntents: [
    {
      name: "query_slack_messages",
      kind: "query",
      sourceSystemId: "slack",
      description: "Retrieve messages from Slack for the Recognition Nudge & Celebration workflow.",
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
      name: "query_workday_employees",
      kind: "query",
      sourceSystemId: "workday",
      description: "Retrieve employees from Workday for the Recognition Nudge & Celebration workflow.",
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
      name: "query_recognition_platform_recognition_platform_records",
      kind: "query",
      sourceSystemId: "recognition_platform",
      description: "Retrieve recognition platform records from Recognition Platform for the Recognition Nudge & Celebration workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "recognition_platform_records_records",
        "recognition_platform_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "lookup_recognition_nudge_celebration_policy_handbook",
      kind: "evidence_lookup",
      sourceSystemId: "slack",
      description: "Look up sections of the Recognition Nudge & Celebration Policy Handbook to cite in narrative output, escalation rationale, and audit evidence.",
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
      name: "action_slack_generate",
      kind: "action",
      sourceSystemId: "slack",
      description: "Execute the generate step in Slack after the agent has gathered evidence and validated escalation gates.",
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
      claim: "Recognition frequency moved from Sporadic toward 3x increase",
      mustCite: [
        "slack.messages",
        "workday.employees",
      ],
      sourceSystemIds: [
        "slack",
        "workday",
      ],
    },
    {
      claim: "Coverage moved from Top performers only toward Equitable",
      mustCite: [
        "slack.messages",
        "workday.employees",
      ],
      sourceSystemIds: [
        "slack",
        "workday",
      ],
    },
  ],
  escalationRules: [
    {
      trigger: "Recognition frequency regresses past the Sporadic baseline by more than 20%",
      action: "escalate_to_human",
      handoffTarget: "Manager",
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
    "Never fabricate metric values; only publish numbers derived from Slack (and other named systems) entities.",
    "Never bypass Manager approval on escalation triggers, even when confidence is high.",
    "Never expose individual personal data (PII) in summaries; aggregate or pseudonymise before output.",
    "Never act on data older than the staleness threshold defined in the runbook without a fresh re-query.",
  ],
  goldenEvals: [
    {
      id: "recognition-nudge-celebration-end-to-end",
      prompt: "Run the Recognition Nudge & Celebration workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.",
      expectedToolCalls: [
        "query_slack_messages",
        "query_workday_employees",
        "query_recognition_platform_recognition_platform_records",
        "lookup_recognition_nudge_celebration_policy_handbook",
        "action_slack_generate",
      ],
      mustReferenceEntities: [
        "messages",
        "employees",
        "recognition_platform_records",
      ],
      mustCiteDocuments: [
        "recognition-nudge-celebration-policy-handbook",
      ],
      expectedActionOutcome: "Action generate executed against Slack, with audit-trail entry and Manager notified of outcomes.",
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
    rationale: "Row counts sized for Recognition Nudge & Celebration so the agent can demonstrate the workflow against realistic transactional volume without simulating a production warehouse.",
  },
  sourceSystems: [
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
      id: "recognition_platform",
      name: "Recognition Platform",
      owns: [
        "recognition_platform_records",
        "recognition_platform_events",
        "recognition_platform_audit_trail",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_recognition_platform_recognition_platform_records",
        "query_recognition_platform_recognition_platform_events",
        "query_recognition_platform_recognition_platform_audit_trail",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
  ],
  entities: [
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
      name: "recognition_platform_records",
      sourceSystemId: "recognition_platform",
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
      name: "recognition_platform_events",
      sourceSystemId: "recognition_platform",
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
          name: "recognition_platform_record_id",
          type: "ref",
          ref: "recognition_platform_records.id",
          required: true,
        },
      ],
    },
    {
      name: "recognition_platform_audit_trail",
      sourceSystemId: "recognition_platform",
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
      from: "recognition_platform_events.recognition_platform_record_id",
      to: "recognition_platform_records.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
  ],
  documents: [
    {
      id: "recognition-nudge-celebration-policy-handbook",
      sourceSystemId: "slack",
      type: "policy",
      title: "Recognition Nudge & Celebration Policy Handbook",
      requiredSections: [
        "Eligibility and scope",
        "Workflow steps",
        "Manager responsibilities",
        "Compliance and audit",
        "Sensitive-data handling",
      ],
      linkedEntities: [
        "messages",
        "channels",
        "thread_replies",
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
      id: "slack_generate_api",
      sourceSystemId: "slack",
      method: "POST",
      path: "/api/slack/generate",
      description: "Synchronous endpoint the agent calls to generate in Slack after evidence gating.",
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
      id: "recognition-nudge-celebration-baseline-gap",
      description: "Seed a realistic gap where Recognition frequency sits between Sporadic and 3x increase, so the agent can detect, narrate, and recommend remediation.",
      affectedEntities: [
        "messages",
        "channels",
      ],
      discoveryPath: [
        "Inspect Slack records for the affected entities",
        "Compare against Workday historical baseline",
        "Generate a citation-backed recommendation",
      ],
      expectedEvidence: [
        "source-system record",
        "historical baseline metric",
        "generated audit trail",
      ],
      expectedRecommendation: "Explain the gap, cite supporting evidence, and propose the next Manager action.",
    },
  ],
  datastorePackaging: {
    alloydb: {
      database: "recognition_nudge_celebration",
      schemas: [
        "slack",
        "workday",
        "recognition_platform",
      ],
    },
    bigquery: {
      dataset: "hr_recognition_nudge_celebration",
      tables: [
        "kpi_summary",
        "evidence_index",
      ],
    },
    cloudStorage: {
      bucketSuffix: "recognition-nudge-celebration-evidence",
      prefixes: [
        "documents",
        "audit-trails",
        "exports",
      ],
    },
    apis: {
      serviceName: "recognition-nudge-celebration-source-adapters",
      deploymentTarget: "cloud_run",
    },
  },
  validation: {
    smokePrompt: "Run the Recognition Nudge & Celebration workflow and cite source-system evidence for every claim.",
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

export const RecognitionNudge = () => (
  <UseCaseSlide
    title="Recognition Nudge & Celebration"
    subtitle="A-705 • Employee Engagement"
    icon={Trophy}
    domainId="domain-7"
    layer="Layer 2: Agent Designer"
    persona="Manager"
    triggerType="event"
    swimlane={swimlane}
    systems={["Slack", "Workday", "Recognition Platform"]}
    kpis={[
      { label: "Recognition frequency", before: "Sporadic", after: "3x increase" },
      { label: "Coverage", before: "Top performers only", after: "Equitable" },
      { label: "Milestone misses", before: "Common", after: "Zero" }
    ]}
    flow={flow}
    architecture={architecture}
    statusQuo={[
      "Recognition adoption varies widely; low-activity managers missed.",
      "Milestones (anniversaries, projects) celebrated inconsistently.",
      "No systematic way to surface recognition opportunities to leaders."
    ]}
    agentification={[
      "Proactive nudges to managers with low recognition activity.",
      "Auto-generated milestone celebrations and personalized notes.",
      "Real-time surfacing of peer recognition for manager follow-up."
    ]}
  />
);
