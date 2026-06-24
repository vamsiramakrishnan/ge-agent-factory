import React from "react";
import { UseCaseSlide } from "../../../agent/UseCaseSlide";
import { FlowStep } from "../../../agent/ProcessFlow";
import { SwimlaneFlow } from "../../../agent/SwimlaneFlow";
import { AgentArchitecture, UseCaseGenerationSpec, AgentBehaviorContract} from "../../../../types/architecture";
import { Route, Inbox, Brain, ArrowRight, Headset } from "lucide-react";

const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "s1", label: "Ticket Created", lane: "system", type: "trigger" },
    { id: "a1", label: "NLP Classification", lane: "agent", type: "action" },
    { id: "a2", label: "Priority & Routing", lane: "agent", type: "action" },
    { id: "a3", label: "Team Assignment", lane: "agent", type: "output" },
    { id: "h1", label: "Agent Resolves", lane: "human", type: "hitl" },
  ],
  connections: [["s1", "a1"], ["a1", "a2"], ["a2", "a3"], ["a3", "h1"]],
};

const flow: FlowStep[] = [
  { label: "Ticket Intake", icon: Inbox, description: "New ticket received via ServiceNow, Jira, or Slack with user description and metadata.", trigger: "Event-driven", systems: ["ServiceNow", "Jira Service Mgmt"] },
  { label: "NLP Classification", icon: Brain, description: "Ticket text analyzed for category, urgency signals, and VIP indicators.", systems: ["Vertex AI"], integration: "ADK" },
  { label: "Intelligent Routing", icon: Route, description: "Ticket routed to optimal team based on classification, agent workload, and skill matching.", systems: ["ServiceNow", "BigQuery"] },
  { label: "Agent Resolution", icon: ArrowRight, description: "Service desk agent receives pre-classified ticket with relevant KB articles attached.", output: "Routed Ticket" },
];

const architecture: AgentArchitecture = {
  connections: [
    { system: "ServiceNow", description: "Ticket creation, routing, SLA management", direction: "bidirectional", protocol: "REST API", category: "erp" },
    { system: "Jira Service Mgmt", description: "IT service requests, incident tickets", direction: "bidirectional", protocol: "REST API", category: "erp" },
    { system: "Slack", description: "User-submitted requests, conversational intake", direction: "read", protocol: "REST API", category: "collaboration" },
    { system: "BigQuery", description: "Historical routing accuracy, agent workload analytics", direction: "bidirectional", protocol: "BigQuery SQL", category: "analytics" },
    { system: "Vertex AI (Gemini)", description: "Ticket classification, urgency detection, VIP identification", direction: "bidirectional", protocol: "gRPC", category: "ai" },
  ],
  pipeline: [
    { label: "Multi-Channel Intake", description: "Receive tickets from ServiceNow portal, Jira Service Management, and Slack bot. Normalize into unified ticket schema with user metadata and department context.", systems: ["ServiceNow", "Jira Service Mgmt", "Slack"], layer: "integration", dataIn: "Tickets from multiple channels", dataOut: "Normalized ticket with user context" },
    { label: "NLP Classification & Priority", description: "Gemini analyzes ticket text for category, subcategory, urgency signals ('board presentation in 30 minutes'), and VIP indicators. Predicts priority based on business impact.", systems: ["Vertex AI (Gemini)"], layer: "llm", dataIn: "Ticket text + user metadata", dataOut: "Classified ticket with predicted priority" },
    { label: "Intelligent Routing", description: "Route to optimal assignment group based on classification, agent skill matrix, current workload, and historical resolution patterns. Attach relevant KB articles.", systems: ["ServiceNow", "BigQuery"], layer: "ml", dataIn: "Classified ticket + agent availability", dataOut: "Routed ticket with KB suggestions" },
    { label: "Feedback & Learning", description: "Track routing accuracy — if tickets are rerouted, capture the correction to improve future classification. Monitor first-contact resolution rates by assignment group.", systems: ["BigQuery"], layer: "integration", dataIn: "Resolution outcomes + rerouting events", dataOut: "Improved routing model" },
  ],
};


const behaviorContract: AgentBehaviorContract = {
  role: "IT Service Desk Manager agent for the Intelligent Ticket Router workflow",
  primaryObjective: "Gemini understands urgency signals in natural language — 'board presentation in 30 minutes' triggers VIP protocol. LLM classifies tickets with 92% first-route accuracy, reducing rerouting and resolution time. so the IT Service Desk Manager can move the Routing accuracy KPI.",
  inScope: [
    "Gemini understands urgency signals in natural language — 'board presentation in 30 minutes' triggers VIP protocol",
    "LLM classifies tickets with 92% first-route accuracy, reducing rerouting and resolution time",
    "Continuous learning from rerouting corrections improves classification accuracy over time",
  ],
  outOfScope: [
    "Production deployments outside an approved change window",
    "Irreversible destructive actions on shared infrastructure (DROP, force-delete, key rotation)",
    "Security incident attribution requiring forensics",
  ],
  toolIntents: [
    {
      name: "query_servicenow_tickets",
      kind: "query",
      sourceSystemId: "servicenow",
      description: "Retrieve tickets from ServiceNow for the Intelligent Ticket Router workflow.",
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
      name: "query_jira_service_mgmt_issues",
      kind: "query",
      sourceSystemId: "jira_service_mgmt",
      description: "Retrieve issues from Jira Service Mgmt for the Intelligent Ticket Router workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "issues_records",
        "issues_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_slack_messages",
      kind: "query",
      sourceSystemId: "slack",
      description: "Retrieve messages from Slack for the Intelligent Ticket Router workflow.",
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
      name: "lookup_intelligent_ticket_router_runbook",
      kind: "evidence_lookup",
      sourceSystemId: "servicenow",
      description: "Look up sections of the Intelligent Ticket Router Operations Runbook to cite in narrative output, escalation rationale, and audit evidence.",
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
      name: "action_servicenow_route",
      kind: "action",
      sourceSystemId: "servicenow",
      description: "Execute the route step in ServiceNow after the agent has gathered evidence and validated escalation gates.",
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
      claim: "Routing accuracy moved from 65% first-route correct toward 92% first-route correct",
      mustCite: [
        "servicenow.tickets",
        "jira_service_mgmt.issues",
      ],
      sourceSystemIds: [
        "servicenow",
        "jira_service_mgmt",
      ],
    },
    {
      claim: "Ticket triage time moved from 8-12 min manual toward Instant automated",
      mustCite: [
        "servicenow.tickets",
        "jira_service_mgmt.issues",
      ],
      sourceSystemIds: [
        "servicenow",
        "jira_service_mgmt",
      ],
    },
  ],
  escalationRules: [
    {
      trigger: "Routing accuracy regresses past the 65% first-route correct baseline by more than 20%",
      action: "escalate_to_human",
      handoffTarget: "IT Service Desk Manager",
      rationale: "Significant regressions need human judgment before automated remediation runs against production records.",
    },
    {
      trigger: "Source-system evidence is incomplete or stale (>24h) for any required entity",
      action: "request_more_info",
      rationale: "Recommendations grounded in stale evidence misrepresent current state and undermine audit defensibility.",
    },
    {
      trigger: "Proposed route action lacks supporting evidence from at least two systems",
      action: "refuse",
      rationale: "Single-system evidence is insufficient to authorize external state changes without manual review.",
    },
  ],
  refusalRules: [
    "Never fabricate metric values; only publish numbers derived from ServiceNow (and other named systems) entities.",
    "Never bypass IT Service Desk Manager approval on escalation triggers, even when confidence is high.",
    "Never expose individual personal data (PII) in summaries; aggregate or pseudonymise before output.",
    "Never act on data older than the staleness threshold defined in the runbook without a fresh re-query.",
  ],
  goldenEvals: [
    {
      id: "intelligent-ticket-router-end-to-end",
      prompt: "Run the Intelligent Ticket Router workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.",
      expectedToolCalls: [
        "query_servicenow_tickets",
        "query_jira_service_mgmt_issues",
        "query_slack_messages",
        "lookup_intelligent_ticket_router_runbook",
        "action_servicenow_route",
      ],
      mustReferenceEntities: [
        "tickets",
        "issues",
        "messages",
      ],
      mustCiteDocuments: [
        "intelligent-ticket-router-runbook",
      ],
      expectedActionOutcome: "Action route executed against ServiceNow, with audit-trail entry and IT Service Desk Manager notified of outcomes.",
      forbiddenBehaviors: [
        "do not invent KPI numbers",
        "do not skip the evidence_lookup step before any recommendation",
        "do not execute route without two-system evidence",
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
    rationale: "Row counts sized for Intelligent Ticket Router so the agent can demonstrate the workflow against realistic transactional volume without simulating a production warehouse.",
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
      id: "jira_service_mgmt",
      name: "Jira Service Mgmt",
      owns: [
        "issues",
        "sprints",
        "epics",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_jira_service_mgmt_issues",
        "query_jira_service_mgmt_sprints",
        "query_jira_service_mgmt_epics",
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
      name: "issues",
      sourceSystemId: "jira_service_mgmt",
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
      name: "sprints",
      sourceSystemId: "jira_service_mgmt",
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
      name: "epics",
      sourceSystemId: "jira_service_mgmt",
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
  ],
  relationships: [],
  documents: [
    {
      id: "intelligent-ticket-router-runbook",
      sourceSystemId: "servicenow",
      type: "runbook",
      title: "Intelligent Ticket Router Operations Runbook",
      requiredSections: [
        "Detection signals",
        "Triage procedures",
        "Remediation actions",
        "Rollback criteria",
        "Post-incident review",
      ],
      linkedEntities: [
        "tickets",
        "change_requests",
        "incidents",
      ],
      minimumWordCount: 500,
      citationAnchors: [
        "detection",
        "triage",
        "remediation",
        "rollback",
      ],
    },
  ],
  apis: [
    {
      id: "servicenow_route_api",
      sourceSystemId: "servicenow",
      method: "POST",
      path: "/api/servicenow/route",
      description: "Synchronous endpoint the agent calls to route in ServiceNow after evidence gating.",
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
      id: "intelligent-ticket-router-baseline-gap",
      description: "Seed a realistic gap where Routing accuracy sits between 65% first-route correct and 92% first-route correct, so the agent can detect, narrate, and recommend remediation.",
      affectedEntities: [
        "tickets",
        "change_requests",
      ],
      discoveryPath: [
        "Inspect ServiceNow records for the affected entities",
        "Compare against Jira Service Mgmt historical baseline",
        "Generate a citation-backed recommendation",
      ],
      expectedEvidence: [
        "source-system record",
        "historical baseline metric",
        "generated audit trail",
      ],
      expectedRecommendation: "Explain the gap, cite supporting evidence, and propose the next IT Service Desk Manager action.",
    },
  ],
  datastorePackaging: {
    alloydb: {
      database: "intelligent_ticket_router",
      schemas: [
        "servicenow",
        "jira_service_mgmt",
        "slack",
      ],
    },
    bigquery: {
      dataset: "it_intelligent_ticket_router",
      tables: [
        "kpi_summary",
        "evidence_index",
      ],
    },
    cloudStorage: {
      bucketSuffix: "intelligent-ticket-router-evidence",
      prefixes: [
        "documents",
        "audit-trails",
        "exports",
      ],
    },
    apis: {
      serviceName: "intelligent-ticket-router-source-adapters",
      deploymentTarget: "cloud_run",
    },
  },
  validation: {
    smokePrompt: "Run the Intelligent Ticket Router workflow and cite source-system evidence for every claim.",
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

export const IntelligentTicketRouter = () => (
  <UseCaseSlide
    title="Intelligent Ticket Router"
    subtitle="IT5-01 • IT Service Management"
    icon={Headset}
    domainId="domain-42"
    layer="Layer 2: Agent Designer"
    persona="IT Service Desk Manager"
    systems={["ServiceNow", "Jira Service Mgmt", "Slack", "Vertex AI"]}
    kpis={[
      { label: "Routing accuracy", before: "65% first-route correct", after: "92% first-route correct" },
      { label: "Ticket triage time", before: "8-12 min manual", after: "Instant automated" },
      { label: "Misroute rate", before: "35% rerouted", after: "<8% rerouted" },
    ]}
    triggerType="event"
    swimlane={swimlane}
    flow={flow}
    architecture={architecture}
    hitl={{ actor: "Service Desk Agent", action: "Resolve routed ticket", description: "Agent receives pre-classified ticket with relevant KB articles and resolves using the agent's domain expertise." }}
    statusQuo={[
      "Tickets manually categorized and routed by L1 agents, with 35% requiring rerouting to the correct team.",
      "Priority assignment based on user-selected urgency rather than business impact analysis.",
      "VIP escalation protocols triggered manually, often missing time-critical executive requests.",
    ]}
    agentification={[
      "Gemini understands urgency signals in natural language — 'board presentation in 30 minutes' triggers VIP protocol.",
      "LLM classifies tickets with 92% first-route accuracy, reducing rerouting and resolution time.",
      "Continuous learning from rerouting corrections improves classification accuracy over time.",
    ]}
  />
);
