import React from "react";
import { UseCaseSlide } from "../../../agent/UseCaseSlide";
import { FlowStep } from "../../../agent/ProcessFlow";
import { SwimlaneFlow } from "../../../agent/SwimlaneFlow";
import { AgentArchitecture, UseCaseGenerationSpec, AgentBehaviorContract} from "../../../../types/architecture";
import { HeartHandshake, Mail, TrendingDown, Brain, ShieldAlert } from "lucide-react";

const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "s1", label: "Monthly Cycle", lane: "system", type: "trigger" },
    { id: "a1", label: "Signal Aggregate", lane: "agent", type: "action" },
    { id: "a2", label: "Tone Analysis", lane: "agent", type: "action" },
    { id: "a3", label: "Health Brief", lane: "agent", type: "output" },
    { id: "s2", label: "SRM Dashboard", lane: "system", type: "output" },
  ],
  connections: [["s1", "a1"], ["a1", "a2"], ["a2", "a3"], ["a3", "s2"]],
};

const flow: FlowStep[] = [
  { label: "Signal Collection", icon: Mail, description: "Communication metadata, meeting attendance, escalation records, and survey responses aggregated.", trigger: "Monthly", systems: ["Email Metadata", "Meeting Logs"] },
  { label: "Sentiment Scoring", icon: TrendingDown, description: "Response time trending, escalation frequency, and composite relationship health scoring.", systems: ["BigQuery", "Survey Data"], integration: "ADK" },
  { label: "Tone Shift Detection", icon: Brain, description: "LLM detects qualitative shifts — 'partnership' language evolving to 'contractual obligations' framing.", systems: ["Vertex AI"] },
  { label: "Relationship Brief", icon: ShieldAlert, description: "Early-warning relationship brief delivered to SRM with recommended interventions.", output: "Health Report" },
];

const architecture: AgentArchitecture = {
  connections: [
    { system: "Email Metadata", description: "Response time patterns, communication frequency, email volume trends", direction: "read", protocol: "REST API", category: "collaboration" },
    { system: "Meeting Logs", description: "Meeting attendance records, QBR notes, executive participation tracking", direction: "read", protocol: "REST API", category: "collaboration" },
    { system: "Escalation Records", description: "Escalation frequency, severity, resolution patterns", direction: "read", protocol: "REST API", category: "erp" },
    { system: "Survey Data", description: "Relationship satisfaction surveys, NPS scores, qualitative feedback", direction: "read", protocol: "REST API", category: "analytics" },
    { system: "Vertex AI (Gemini)", description: "Tone shift detection, qualitative signal interpretation, early-warning brief generation", direction: "bidirectional", protocol: "gRPC", category: "ai" },
  ],
  pipeline: [
    { label: "Signal Aggregation", description: "Aggregate communication metadata (response times, email frequency, meeting attendance), escalation logs, and survey responses from multiple channels into a unified relationship signal dataset.", systems: ["Email Metadata", "Meeting Logs", "Escalation Records", "Survey Data"], layer: "integration", dataIn: "Email metadata + meeting logs + escalations + surveys", dataOut: "Unified relationship signal timeline" },
    { label: "Sentiment & Health Scoring", description: "Sentiment scoring on survey data, response time trending analysis, escalation frequency monitoring, and composite relationship health scoring across multiple dimensions.", systems: ["BigQuery", "Survey Data"], layer: "ml", dataIn: "Relationship signal timeline", dataOut: "Composite health scores with trend indicators" },
    { label: "Tone Shift Detection & Early Warning", description: "Gemini interprets qualitative signals that analytics miss: supplier account manager response time shifted from same-day to 3-4 days, VP of Sales attended the last QBR (unusual). Detects tone shifts in meeting notes: 'Supplier language shifted from partnership to contractual obligations over 3 QBRs — declining relationship health.' Generates early-warning briefs for SRM.", systems: ["Vertex AI (Gemini)"], layer: "llm", dataIn: "Health scores + meeting notes + communication patterns", dataOut: "Early-warning relationship brief with recommended interventions" },
  ],
};


const behaviorContract: AgentBehaviorContract = {
  role: "Supplier Relationship Manager agent for the Relationship Health Analyzer workflow",
  primaryObjective: "LLM interprets qualitative signals: supplier account manager response times shifted from same-day to 3-4 days, and their VP of Sales attended the last QBR — unusual, suggesting risk or upsell intent. Detects tone shifts across QBR meeting notes: 'Supplier language shifted from partnership to contractual obligations over the last 3 QBRs — declining relationship health.' so the Supplier Relationship Manager can move the Relationship risk detection KPI.",
  inScope: [
    "LLM interprets qualitative signals: supplier account manager response times shifted from same-day to 3-4 days, and their VP of Sales attended the last QBR — unusual, suggesting risk or upsell intent",
    "Detects tone shifts across QBR meeting notes: 'Supplier language shifted from partnership to contractual obligations over the last 3 QBRs — declining relationship health.'",
    "Generates early-warning relationship briefs combining response time trends, escalation patterns, and sentiment analysis for proactive SRM engagement",
  ],
  outOfScope: [
    "Contract execution without legal review",
    "Supplier disqualification decisions (category lead retains authority)",
    "Single-source justification overrides above policy threshold",
  ],
  toolIntents: [
    {
      name: "query_email_metadata_email_metadata_records",
      kind: "query",
      sourceSystemId: "email_metadata",
      description: "Retrieve email metadata records from Email Metadata for the Relationship Health Analyzer workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "email_metadata_records_records",
        "email_metadata_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_meeting_logs_meeting_logs_records",
      kind: "query",
      sourceSystemId: "meeting_logs",
      description: "Retrieve meeting logs records from Meeting Logs for the Relationship Health Analyzer workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "meeting_logs_records_records",
        "meeting_logs_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_escalation_records_escalation_records_records",
      kind: "query",
      sourceSystemId: "escalation_records",
      description: "Retrieve escalation records records from Escalation Records for the Relationship Health Analyzer workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "escalation_records_records_records",
        "escalation_records_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_survey_data_survey_data_records",
      kind: "query",
      sourceSystemId: "survey_data",
      description: "Retrieve survey data records from Survey Data for the Relationship Health Analyzer workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "survey_data_records_records",
        "survey_data_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "lookup_relationship_health_analyzer_policy_guide",
      kind: "evidence_lookup",
      sourceSystemId: "email_metadata",
      description: "Look up sections of the Relationship Health Analyzer Procurement Policy Guide to cite in narrative output, escalation rationale, and audit evidence.",
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
      name: "action_email_metadata_generate",
      kind: "action",
      sourceSystemId: "email_metadata",
      description: "Execute the generate step in Email Metadata after the agent has gathered evidence and validated escalation gates.",
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
      claim: "Relationship risk detection moved from Post-exit discovery toward 3-6 month early warning",
      mustCite: [
        "email_metadata.email_metadata_records",
        "meeting_logs.meeting_logs_records",
      ],
      sourceSystemIds: [
        "email_metadata",
        "meeting_logs",
      ],
    },
    {
      claim: "Qualitative signal coverage moved from Annual survey only toward Continuous multi-channel",
      mustCite: [
        "email_metadata.email_metadata_records",
        "meeting_logs.meeting_logs_records",
      ],
      sourceSystemIds: [
        "email_metadata",
        "meeting_logs",
      ],
    },
  ],
  escalationRules: [
    {
      trigger: "Relationship risk detection regresses past the Post-exit discovery baseline by more than 20%",
      action: "escalate_to_human",
      handoffTarget: "Supplier Relationship Manager",
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
    "Never fabricate metric values; only publish numbers derived from Email Metadata (and other named systems) entities.",
    "Never bypass Supplier Relationship Manager approval on escalation triggers, even when confidence is high.",
    "Never expose individual personal data (PII) in summaries; aggregate or pseudonymise before output.",
    "Never act on data older than the staleness threshold defined in the runbook without a fresh re-query.",
  ],
  goldenEvals: [
    {
      id: "relationship-health-analyzer-end-to-end",
      prompt: "Run the Relationship Health Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.",
      expectedToolCalls: [
        "query_email_metadata_email_metadata_records",
        "query_meeting_logs_meeting_logs_records",
        "query_escalation_records_escalation_records_records",
        "query_survey_data_survey_data_records",
        "lookup_relationship_health_analyzer_policy_guide",
        "action_email_metadata_generate",
      ],
      mustReferenceEntities: [
        "email_metadata_records",
        "meeting_logs_records",
        "escalation_records_records",
        "survey_data_records",
      ],
      mustCiteDocuments: [
        "relationship-health-analyzer-policy-guide",
      ],
      expectedActionOutcome: "Action generate executed against Email Metadata, with audit-trail entry and Supplier Relationship Manager notified of outcomes.",
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
    rationale: "Row counts sized for Relationship Health Analyzer so the agent can demonstrate the workflow against realistic transactional volume without simulating a production warehouse.",
  },
  sourceSystems: [
    {
      id: "email_metadata",
      name: "Email Metadata",
      owns: [
        "email_metadata_records",
        "email_metadata_events",
        "email_metadata_audit_trail",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_email_metadata_email_metadata_records",
        "query_email_metadata_email_metadata_events",
        "query_email_metadata_email_metadata_audit_trail",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
    {
      id: "meeting_logs",
      name: "Meeting Logs",
      owns: [
        "meeting_logs_records",
        "meeting_logs_events",
        "meeting_logs_audit_trail",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_meeting_logs_meeting_logs_records",
        "query_meeting_logs_meeting_logs_events",
        "query_meeting_logs_meeting_logs_audit_trail",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
    {
      id: "escalation_records",
      name: "Escalation Records",
      owns: [
        "escalation_records_records",
        "escalation_records_events",
        "escalation_records_audit_trail",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_escalation_records_escalation_records_records",
        "query_escalation_records_escalation_records_events",
        "query_escalation_records_escalation_records_audit_trail",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
    {
      id: "survey_data",
      name: "Survey Data",
      owns: [
        "survey_data_records",
        "survey_data_events",
        "survey_data_audit_trail",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_survey_data_survey_data_records",
        "query_survey_data_survey_data_events",
        "query_survey_data_survey_data_audit_trail",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
  ],
  entities: [
    {
      name: "email_metadata_records",
      sourceSystemId: "email_metadata",
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
      name: "email_metadata_events",
      sourceSystemId: "email_metadata",
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
          name: "email_metadata_record_id",
          type: "ref",
          ref: "email_metadata_records.id",
          required: true,
        },
      ],
    },
    {
      name: "email_metadata_audit_trail",
      sourceSystemId: "email_metadata",
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
      name: "meeting_logs_records",
      sourceSystemId: "meeting_logs",
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
      name: "meeting_logs_events",
      sourceSystemId: "meeting_logs",
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
      name: "meeting_logs_audit_trail",
      sourceSystemId: "meeting_logs",
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
      name: "escalation_records_records",
      sourceSystemId: "escalation_records",
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
      name: "escalation_records_events",
      sourceSystemId: "escalation_records",
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
        {
          name: "escalation_records_record_id",
          type: "ref",
          ref: "escalation_records_records.id",
          required: true,
        },
      ],
    },
    {
      name: "escalation_records_audit_trail",
      sourceSystemId: "escalation_records",
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
      name: "survey_data_records",
      sourceSystemId: "survey_data",
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
      name: "survey_data_events",
      sourceSystemId: "survey_data",
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
          name: "survey_data_record_id",
          type: "ref",
          ref: "survey_data_records.id",
          required: true,
        },
      ],
    },
    {
      name: "survey_data_audit_trail",
      sourceSystemId: "survey_data",
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
      from: "email_metadata_events.email_metadata_record_id",
      to: "email_metadata_records.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
    {
      from: "escalation_records_events.escalation_records_record_id",
      to: "escalation_records_records.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
    {
      from: "survey_data_events.survey_data_record_id",
      to: "survey_data_records.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
  ],
  documents: [
    {
      id: "relationship-health-analyzer-policy-guide",
      sourceSystemId: "email_metadata",
      type: "policy",
      title: "Relationship Health Analyzer Procurement Policy Guide",
      requiredSections: [
        "Sourcing principles",
        "Approval thresholds",
        "Supplier risk requirements",
        "Contract and compliance gates",
        "Exception handling",
      ],
      linkedEntities: [
        "email_metadata_records",
        "email_metadata_events",
        "email_metadata_audit_trail",
      ],
      minimumWordCount: 500,
      citationAnchors: [
        "sourcing",
        "approvals",
        "supplier-risk",
        "exceptions",
      ],
    },
  ],
  apis: [
    {
      id: "email_metadata_generate_api",
      sourceSystemId: "email_metadata",
      method: "POST",
      path: "/api/email_metadata/generate",
      description: "Synchronous endpoint the agent calls to generate in Email Metadata after evidence gating.",
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
      id: "relationship-health-analyzer-baseline-gap",
      description: "Seed a realistic gap where Relationship risk detection sits between Post-exit discovery and 3-6 month early warning, so the agent can detect, narrate, and recommend remediation.",
      affectedEntities: [
        "email_metadata_records",
        "email_metadata_events",
      ],
      discoveryPath: [
        "Inspect Email Metadata records for the affected entities",
        "Compare against Meeting Logs historical baseline",
        "Generate a citation-backed recommendation",
      ],
      expectedEvidence: [
        "source-system record",
        "historical baseline metric",
        "generated audit trail",
      ],
      expectedRecommendation: "Explain the gap, cite supporting evidence, and propose the next Supplier Relationship Manager action.",
    },
  ],
  datastorePackaging: {
    alloydb: {
      database: "relationship_health_analyzer",
      schemas: [
        "email_metadata",
        "meeting_logs",
        "escalation_records",
        "survey_data",
      ],
    },
    bigquery: {
      dataset: "procurement_relationship_health_analyzer",
      tables: [
        "kpi_summary",
        "evidence_index",
      ],
    },
    cloudStorage: {
      bucketSuffix: "relationship-health-analyzer-evidence",
      prefixes: [
        "documents",
        "audit-trails",
        "exports",
      ],
    },
    apis: {
      serviceName: "relationship-health-analyzer-source-adapters",
      deploymentTarget: "cloud_run",
    },
  },
  validation: {
    smokePrompt: "Run the Relationship Health Analyzer workflow and cite source-system evidence for every claim.",
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

export const RelationshipHealthAnalyzer = () => (
  <UseCaseSlide
    title="Relationship Health Analyzer"
    subtitle="A-1706 • Supplier Performance"
    icon={HeartHandshake}
    domainId="domain-17"
    layer="Layer 3: Custom ADK"
    persona="Supplier Relationship Manager"
    systems={["Email Metadata", "Meeting Logs", "Escalation Records", "Survey Data", "Vertex AI"]}
    kpis={[
      { label: "Relationship risk detection", before: "Post-exit discovery", after: "3-6 month early warning" },
      { label: "Qualitative signal coverage", before: "Annual survey only", after: "Continuous multi-channel" },
      { label: "At-risk supplier interventions", before: "Reactive", after: "Proactive engagement" },
    ]}
    triggerType="scheduled"
    swimlane={swimlane}
    flow={flow}
    architecture={architecture}
    statusQuo={[
      "Relationship health assessed through annual surveys with no visibility into day-to-day tone shifts.",
      "Account manager response time degradation goes unnoticed until a critical escalation surfaces.",
      "QBR meeting notes are filed but never systematically analyzed for sentiment or language pattern changes."
    ]}
    agentification={[
      "LLM interprets qualitative signals: supplier account manager response times shifted from same-day to 3-4 days, and their VP of Sales attended the last QBR — unusual, suggesting risk or upsell intent.",
      "Detects tone shifts across QBR meeting notes: 'Supplier language shifted from partnership to contractual obligations over the last 3 QBRs — declining relationship health.'",
      "Generates early-warning relationship briefs combining response time trends, escalation patterns, and sentiment analysis for proactive SRM engagement."
    ]}
  />
);
