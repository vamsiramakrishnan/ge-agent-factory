import React from "react";
import { UseCaseSlide } from "../../../agent/UseCaseSlide";
import { FlowStep } from "../../../agent/ProcessFlow";
import { SwimlaneFlow } from "../../../agent/SwimlaneFlow";
import { AgentArchitecture, UseCaseGenerationSpec, AgentBehaviorContract} from "../../../../types/architecture";
import { Calendar, RefreshCw, AlertTriangle, FileText, Send } from "lucide-react";

const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "s1", label: "Weekly / Campaign Event", lane: "system", type: "trigger" },
    { id: "a1", label: "Calendar Sync", lane: "agent", type: "action" },
    { id: "a2", label: "Conflict Detection", lane: "agent", type: "action" },
    { id: "a3", label: "Weekly Digest", lane: "agent", type: "output" },
  ],
  connections: [["s1", "a1"], ["a1", "a2"], ["a2", "a3"]],
};

const flow: FlowStep[] = [
  { label: "Calendar Sync", icon: RefreshCw, description: "Campaigns from HubSpot synced with Asana timelines and Google Calendar for unified view.", trigger: "Weekly + Event", systems: ["HubSpot", "Asana"] },
  { label: "Conflict Detection", icon: AlertTriangle, description: "Audience overlap and resource over-allocation detected across concurrent campaigns.", systems: ["HubSpot", "BigQuery"], integration: "Analytics" },
  { label: "Priority Reasoning", icon: FileText, description: "Gemini reasons about which overlapping campaigns should take priority based on funnel stage and deal potential.", systems: ["Vertex AI"] },
  { label: "Digest Distribution", icon: Send, description: "Weekly campaign summary with scheduling recommendations sent to marketing leadership.", output: "Campaign Digest" },
];

const architecture: AgentArchitecture = {
  connections: [
    { system: "HubSpot", description: "Campaign schedules, audience targeting, email send calendars", direction: "bidirectional", protocol: "REST API", category: "erp" },
    { system: "Asana", description: "Project timelines, task dependencies, resource allocation", direction: "bidirectional", protocol: "REST API", category: "collaboration" },
    { system: "Google Calendar", description: "Marketing event calendar, team availability, milestone dates", direction: "bidirectional", protocol: "Workspace API", category: "collaboration" },
    { system: "Salesforce CRM", description: "Deal pipeline data for prioritization context, revenue targets", direction: "read", protocol: "REST API", category: "erp" },
    { system: "Slack", description: "Scheduling alerts, conflict notifications, weekly digests", direction: "write", protocol: "Webhook", category: "collaboration" },
  ],
  pipeline: [
    { label: "Calendar Synchronization", description: "Sync campaigns from HubSpot with Asana timelines and Google Calendar. Detect scheduling conflicts and cross-campaign dependencies.", systems: ["HubSpot", "Asana", "Google Calendar"], layer: "integration", dataIn: "Campaign schedules across systems", dataOut: "Unified marketing calendar" },
    { label: "Overlap & Conflict Analysis", description: "Optimal send-time prediction based on historical engagement. Audience overlap detection across concurrent campaigns. Resource over-allocation flagging.", systems: ["HubSpot", "BigQuery"], layer: "ml", dataIn: "Campaign audience definitions + team capacity", dataOut: "Conflict alerts + optimal timing recommendations" },
    { label: "Priority Reasoning", description: "When campaigns target overlapping audiences in the same week, Gemini reasons about which should take priority based on funnel stage, deal size potential, and response fatigue. Generates weekly narrative summaries.", systems: ["Vertex AI (Gemini)"], layer: "llm", dataIn: "Conflict data + pipeline context + engagement history", dataOut: "Prioritization recommendations + campaign digest" },
    { label: "Alert & Digest Delivery", description: "Conflict alerts pushed immediately via Slack. Weekly campaign digest with scheduling recommendations sent to marketing leadership.", systems: ["Slack", "Email"], layer: "integration", dataIn: "Recommendations + digest", dataOut: "Distributed alerts and weekly summary" },
  ],
};


const behaviorContract: AgentBehaviorContract = {
  role: "VP Marketing agent for the Campaign Calendar Orchestrator workflow",
  primaryObjective: "Gemini reasons about campaign priority when overlapping audiences are targeted in the same week, considering funnel stage and deal potential. Automated audience overlap detection prevents response fatigue from concurrent campaigns. so the VP Marketing can move the Scheduling conflicts detected KPI.",
  inScope: [
    "Gemini reasons about campaign priority when overlapping audiences are targeted in the same week, considering funnel stage and deal potential",
    "Automated audience overlap detection prevents response fatigue from concurrent campaigns",
    "Generates weekly campaign summary narratives with scheduling recommendations for leadership review",
  ],
  outOfScope: [
    "Final approval of paid spend reallocations above the governance threshold",
    "Trademark, legal, or regulated-industry claim approval",
    "Crisis communications without comms-team sign-off",
  ],
  toolIntents: [
    {
      name: "query_asana_asana_records",
      kind: "query",
      sourceSystemId: "asana",
      description: "Retrieve asana records from Asana for the Campaign Calendar Orchestrator workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "asana_records_records",
        "asana_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_hubspot_contacts",
      kind: "query",
      sourceSystemId: "hubspot",
      description: "Retrieve contacts from HubSpot for the Campaign Calendar Orchestrator workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "contacts_records",
        "contacts_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_google_calendar_events",
      kind: "query",
      sourceSystemId: "google_calendar",
      description: "Retrieve events from Google Calendar for the Campaign Calendar Orchestrator workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "events_records",
        "events_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_salesforce_crm_accounts",
      kind: "query",
      sourceSystemId: "salesforce_crm",
      description: "Retrieve accounts from Salesforce CRM for the Campaign Calendar Orchestrator workflow.",
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
      name: "lookup_campaign_calendar_orchestrator_playbook",
      kind: "evidence_lookup",
      sourceSystemId: "asana",
      description: "Look up sections of the Campaign Calendar Orchestrator Playbook to cite in narrative output, escalation rationale, and audit evidence.",
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
      name: "action_asana_recommend",
      kind: "action",
      sourceSystemId: "asana",
      description: "Execute the recommend step in Asana after the agent has gathered evidence and validated escalation gates.",
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
      claim: "Scheduling conflicts detected moved from Post-launch toward Pre-launch automated",
      mustCite: [
        "asana.asana_records",
        "hubspot.contacts",
      ],
      sourceSystemIds: [
        "asana",
        "hubspot",
      ],
    },
    {
      claim: "Audience overlap resolution moved from Manual review toward AI-prioritized",
      mustCite: [
        "asana.asana_records",
        "hubspot.contacts",
      ],
      sourceSystemIds: [
        "asana",
        "hubspot",
      ],
    },
  ],
  escalationRules: [
    {
      trigger: "Scheduling conflicts detected regresses past the Post-launch baseline by more than 20%",
      action: "escalate_to_human",
      handoffTarget: "VP Marketing",
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
    "Never fabricate metric values; only publish numbers derived from Asana (and other named systems) entities.",
    "Never bypass VP Marketing approval on escalation triggers, even when confidence is high.",
    "Never expose individual personal data (PII) in summaries; aggregate or pseudonymise before output.",
    "Never act on data older than the staleness threshold defined in the runbook without a fresh re-query.",
  ],
  goldenEvals: [
    {
      id: "campaign-calendar-orchestrator-end-to-end",
      prompt: "Run the Campaign Calendar Orchestrator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.",
      expectedToolCalls: [
        "query_asana_asana_records",
        "query_hubspot_contacts",
        "query_google_calendar_events",
        "query_salesforce_crm_accounts",
        "lookup_campaign_calendar_orchestrator_playbook",
        "action_asana_recommend",
      ],
      mustReferenceEntities: [
        "asana_records",
        "contacts",
        "events",
        "accounts",
        "messages",
      ],
      mustCiteDocuments: [
        "campaign-calendar-orchestrator-playbook",
      ],
      expectedActionOutcome: "Action recommend executed against Asana, with audit-trail entry and VP Marketing notified of outcomes.",
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
    rationale: "Row counts sized for Campaign Calendar Orchestrator so the agent can demonstrate the workflow against realistic transactional volume without simulating a production warehouse.",
  },
  sourceSystems: [
    {
      id: "asana",
      name: "Asana",
      owns: [
        "asana_records",
        "asana_events",
        "asana_audit_trail",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_asana_asana_records",
        "query_asana_asana_events",
        "query_asana_asana_audit_trail",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
    {
      id: "hubspot",
      name: "HubSpot",
      owns: [
        "contacts",
        "deals",
        "engagement_events",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_hubspot_contacts",
        "query_hubspot_deals",
        "query_hubspot_engagement_events",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
    {
      id: "google_calendar",
      name: "Google Calendar",
      owns: [
        "events",
        "attendee_responses",
        "room_bookings",
      ],
      protocol: "Workspace API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_google_calendar_events",
        "query_google_calendar_attendee_responses",
        "query_google_calendar_room_bookings",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
    {
      id: "salesforce_crm",
      name: "Salesforce CRM",
      owns: [
        "accounts",
        "opportunities",
        "campaign_influence",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_salesforce_crm_accounts",
        "query_salesforce_crm_opportunities",
        "query_salesforce_crm_campaign_influence",
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
      name: "asana_records",
      sourceSystemId: "asana",
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
      name: "asana_events",
      sourceSystemId: "asana",
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
          name: "asana_record_id",
          type: "ref",
          ref: "asana_records.id",
          required: true,
        },
      ],
    },
    {
      name: "asana_audit_trail",
      sourceSystemId: "asana",
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
      name: "contacts",
      sourceSystemId: "hubspot",
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
          name: "company",
          type: "company.name",
          required: true,
        },
        {
          name: "score",
          type: "number",
          min: 0,
          max: 100,
          required: true,
        },
        {
          name: "stage",
          type: "enum",
          values: [
            "new",
            "qualified",
            "engaged",
            "opportunity",
            "lost",
          ],
          required: true,
        },
        {
          name: "created_at",
          type: "date",
          required: true,
        },
      ],
    },
    {
      name: "deals",
      sourceSystemId: "hubspot",
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
      name: "engagement_events",
      sourceSystemId: "hubspot",
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
          name: "company",
          type: "company.name",
          required: true,
        },
        {
          name: "score",
          type: "number",
          min: 0,
          max: 100,
          required: true,
        },
        {
          name: "stage",
          type: "enum",
          values: [
            "new",
            "qualified",
            "engaged",
            "opportunity",
            "lost",
          ],
          required: true,
        },
        {
          name: "created_at",
          type: "date",
          required: true,
        },
        {
          name: "contact_id",
          type: "ref",
          ref: "contacts.id",
          required: true,
        },
      ],
    },
    {
      name: "events",
      sourceSystemId: "google_calendar",
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
          name: "attendee_response_id",
          type: "ref",
          ref: "attendee_responses.id",
          required: true,
        },
      ],
    },
    {
      name: "attendee_responses",
      sourceSystemId: "google_calendar",
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
          name: "respondent_id",
          type: "seq",
          required: true,
        },
        {
          name: "question_code",
          type: "lorem.words",
          required: true,
        },
        {
          name: "score",
          type: "number",
          min: 1,
          max: 10,
          required: true,
        },
        {
          name: "comment",
          type: "lorem.sentence",
        },
        {
          name: "submitted_at",
          type: "date",
          required: true,
        },
      ],
    },
    {
      name: "room_bookings",
      sourceSystemId: "google_calendar",
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
      name: "accounts",
      sourceSystemId: "salesforce_crm",
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
      name: "opportunities",
      sourceSystemId: "salesforce_crm",
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
      name: "campaign_influence",
      sourceSystemId: "salesforce_crm",
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
          name: "name",
          type: "lorem.sentence",
          required: true,
        },
        {
          name: "channel",
          type: "enum",
          values: [
            "email",
            "social",
            "search",
            "display",
            "content",
            "events",
          ],
          required: true,
        },
        {
          name: "segment",
          type: "enum",
          values: [
            "enterprise",
            "mid_market",
            "smb",
          ],
          required: true,
        },
        {
          name: "impressions",
          type: "number",
          min: 1000,
          max: 500000,
          required: true,
        },
        {
          name: "conversions",
          type: "number",
          min: 0,
          max: 5000,
          required: true,
        },
        {
          name: "spend",
          type: "number",
          min: 1000,
          max: 200000,
          required: true,
        },
        {
          name: "ctr",
          type: "float",
          min: 0.1,
          max: 9.5,
          decimals: 2,
          required: true,
        },
        {
          name: "launched_on",
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
  ],
  relationships: [
    {
      from: "asana_events.asana_record_id",
      to: "asana_records.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
    {
      from: "engagement_events.contact_id",
      to: "contacts.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
    {
      from: "events.attendee_response_id",
      to: "attendee_responses.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
  ],
  documents: [
    {
      id: "campaign-calendar-orchestrator-playbook",
      sourceSystemId: "asana",
      type: "playbook",
      title: "Campaign Calendar Orchestrator Playbook",
      requiredSections: [
        "Audience guidelines",
        "Brand voice rules",
        "Channel-specific guardrails",
        "Measurement framework",
        "Approval thresholds",
      ],
      linkedEntities: [
        "asana_records",
        "asana_events",
        "asana_audit_trail",
      ],
      minimumWordCount: 500,
      citationAnchors: [
        "audience",
        "brand-voice",
        "channels",
        "approvals",
      ],
    },
  ],
  apis: [
    {
      id: "asana_recommend_api",
      sourceSystemId: "asana",
      method: "POST",
      path: "/api/asana/recommend",
      description: "Synchronous endpoint the agent calls to recommend in Asana after evidence gating.",
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
      id: "campaign-calendar-orchestrator-baseline-gap",
      description: "Seed a realistic gap where Scheduling conflicts detected sits between Post-launch and Pre-launch automated, so the agent can detect, narrate, and recommend remediation.",
      affectedEntities: [
        "asana_records",
        "asana_events",
      ],
      discoveryPath: [
        "Inspect Asana records for the affected entities",
        "Compare against HubSpot historical baseline",
        "Generate a citation-backed recommendation",
      ],
      expectedEvidence: [
        "source-system record",
        "historical baseline metric",
        "generated audit trail",
      ],
      expectedRecommendation: "Explain the gap, cite supporting evidence, and propose the next VP Marketing action.",
    },
  ],
  datastorePackaging: {
    alloydb: {
      database: "campaign_calendar_orchestrator",
      schemas: [
        "asana",
        "hubspot",
        "google_calendar",
        "salesforce_crm",
        "slack",
      ],
    },
    bigquery: {
      dataset: "marketing_campaign_calendar_orchestrator",
      tables: [
        "kpi_summary",
        "evidence_index",
      ],
    },
    cloudStorage: {
      bucketSuffix: "campaign-calendar-orchestrator-evidence",
      prefixes: [
        "documents",
        "audit-trails",
        "exports",
      ],
    },
    apis: {
      serviceName: "campaign-calendar-orchestrator-source-adapters",
      deploymentTarget: "cloud_run",
    },
  },
  validation: {
    smokePrompt: "Run the Campaign Calendar Orchestrator workflow and cite source-system evidence for every claim.",
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

export const CampaignCalendarOrchestrator = () => (
  <UseCaseSlide
    title="Campaign Calendar Orchestrator"
    subtitle="A-2906 \u2022 Marketing Strategy"
    icon={Calendar}
    domainId="domain-29"
    layer="Layer 2: Agent Designer"
    persona="VP Marketing"
    systems={["Asana", "HubSpot", "Google Calendar", "Salesforce CRM", "Slack"]}
    kpis={[
      { label: "Scheduling conflicts detected", before: "Post-launch", after: "Pre-launch automated" },
      { label: "Audience overlap resolution", before: "Manual review", after: "AI-prioritized" },
      { label: "Campaign coordination time", before: "3-4 hours/week", after: "30 min/week" },
    ]}
    triggerType="scheduled"
    swimlane={swimlane}
    flow={flow}
    architecture={architecture}
    statusQuo={[
      "Campaign scheduling managed in spreadsheets with no automated conflict detection for audience overlap.",
      "Teams discover scheduling conflicts after campaigns launch when engagement drops from fatigue.",
      "Weekly campaign coordination requires multiple meetings across demand gen, content, and social teams."
    ]}
    agentification={[
      "Gemini reasons about campaign priority when overlapping audiences are targeted in the same week, considering funnel stage and deal potential.",
      "Automated audience overlap detection prevents response fatigue from concurrent campaigns.",
      "Generates weekly campaign summary narratives with scheduling recommendations for leadership review."
    ]}
  />
);
