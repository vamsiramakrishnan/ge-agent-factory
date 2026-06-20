import React from "react";
import { UseCaseSlide } from "../../../agent/UseCaseSlide";
import { ClipboardList, Search, FileText, Mail, Download } from "lucide-react";
import { FlowStep } from "../../../agent/ProcessFlow";
import { SwimlaneFlow } from "../../../agent/SwimlaneFlow";
import { AgentArchitecture, UseCaseGenerationSpec, AgentBehaviorContract} from "../../../../types/architecture";

const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "s1", label: "Survey Cycle", lane: "system", type: "trigger" },
    { id: "a1", label: "Survey Design", lane: "agent", type: "action" },
    { id: "a2", label: "Comms Campaign", lane: "agent", type: "action" },
    { id: "a3", label: "Survey Live", lane: "agent", type: "output" },
  ],
  connections: [["s1", "a1"], ["a1", "a2"], ["a2", "a3"]],
};

const flow: FlowStep[] = [
  { label: "Theme Analysis", icon: Search, description: "Org-specific engagement themes from prior data.", trigger: "Survey Cycle", systems: ["Survey Platform"] },
  { label: "Survey Design", icon: FileText, description: "Context-aware questions with response rate optimization.", systems: ["Gemini"], integration: "Agent Designer" },
  { label: "Comms Campaign", icon: Mail, description: "Personalized launch communications by audience." },
  { label: "Collection", icon: Download, description: "Response monitoring with real-time participation nudges.", output: "Survey Live" }
];

const architecture: AgentArchitecture = {
  connections: [
    { system: "Qualtrics", description: "Survey templates, prior response data, participation metrics", direction: "bidirectional", protocol: "REST API", category: "erp" },
    { system: "Workday", description: "Org structure, team demographics, employee segments", direction: "read", protocol: "REST API", category: "erp" },
    { system: "Google Docs", description: "Survey communications and launch materials", direction: "write", protocol: "Workspace API", category: "collaboration" },
    { system: "Vertex AI (Gemini)", description: "Survey question generation, communication personalization", direction: "bidirectional", protocol: "gRPC", category: "ai" },
    { system: "Slack", description: "Survey launch notifications and participation nudges", direction: "write", protocol: "Webhook", category: "collaboration" },
  ],
  pipeline: [
    { label: "Theme Analysis", description: "Analyze prior survey data and org-specific engagement themes. Pull participation history and response patterns from Qualtrics to identify gaps and fatigue signals.", systems: ["Qualtrics", "Workday"], layer: "integration", dataIn: "Prior survey responses, org demographics", dataOut: "Engagement theme map with participation trends" },
    { label: "Survey Design", description: "Gemini generates context-aware survey questions optimized for response rates, tailoring language and length to audience segments and prior participation behavior.", systems: ["Vertex AI (Gemini)"], layer: "llm", dataIn: "Theme map + org segments + fatigue signals", dataOut: "Optimized survey instrument with audience variants" },
    { label: "Communication Campaign", description: "Personalized launch communications generated per audience segment — tone, channel, and timing optimized based on historical engagement data.", systems: ["Vertex AI (Gemini)", "Google Docs"], layer: "llm", dataIn: "Survey instrument + audience segments", dataOut: "Multi-channel launch communications" },
    { label: "Distribution & Monitoring", description: "Survey deployed with real-time participation monitoring. Automated nudges sent via Slack to low-response teams with contextual encouragement.", systems: ["Qualtrics", "Slack"], layer: "integration", dataIn: "Launch communications + response thresholds", dataOut: "Live survey with participation dashboard" },
  ],
};


const behaviorContract: AgentBehaviorContract = {
  role: "HRBP agent for the Survey Design & Communication Agent workflow",
  primaryObjective: "Context-aware survey design based on org-specific themes and prior results. Personalized launch communications with response rate optimization strategies. so the HRBP can move the Design time KPI.",
  inScope: [
    "Context-aware survey design based on org-specific themes and prior results",
    "Personalized launch communications with response rate optimization strategies",
    "Intelligent survey cadence management to prevent fatigue and maximize participation",
  ],
  outOfScope: [
    "Final hiring, termination, or compensation decisions (HRBP/leadership retains authority)",
    "Performance management adjudication and disciplinary action",
    "Legal interpretation of employment law in ambiguous jurisdictions",
  ],
  toolIntents: [
    {
      name: "query_qualtrics_survey_responses",
      kind: "query",
      sourceSystemId: "qualtrics",
      description: "Retrieve survey responses from Qualtrics for the Survey Design & Communication Agent workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "survey_responses_records",
        "survey_responses_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_culture_amp_engagement_surveys",
      kind: "query",
      sourceSystemId: "culture_amp",
      description: "Retrieve engagement surveys from Culture Amp for the Survey Design & Communication Agent workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "engagement_surveys_records",
        "engagement_surveys_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_slack_messages",
      kind: "query",
      sourceSystemId: "slack",
      description: "Retrieve messages from Slack for the Survey Design & Communication Agent workflow.",
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
      name: "query_gmail_messages",
      kind: "query",
      sourceSystemId: "gmail",
      description: "Retrieve messages from Gmail for the Survey Design & Communication Agent workflow.",
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
      name: "lookup_survey_design_communication_agent_policy_handbook",
      kind: "evidence_lookup",
      sourceSystemId: "qualtrics",
      description: "Look up sections of the Survey Design & Communication Agent Policy Handbook to cite in narrative output, escalation rationale, and audit evidence.",
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
      claim: "Design time moved from 4 weeks toward 3 days",
      mustCite: [
        "qualtrics.survey_responses",
        "culture_amp.engagement_surveys",
      ],
      sourceSystemIds: [
        "qualtrics",
        "culture_amp",
      ],
    },
    {
      claim: "Response rate moved from 55% toward 82%",
      mustCite: [
        "qualtrics.survey_responses",
        "culture_amp.engagement_surveys",
      ],
      sourceSystemIds: [
        "qualtrics",
        "culture_amp",
      ],
    },
  ],
  escalationRules: [
    {
      trigger: "Design time regresses past the 4 weeks baseline by more than 20%",
      action: "escalate_to_human",
      handoffTarget: "HRBP",
      rationale: "Significant regressions need human judgment before automated remediation runs against production records.",
    },
    {
      trigger: "Source-system evidence is incomplete or stale (>24h) for any required entity",
      action: "request_more_info",
      rationale: "Recommendations grounded in stale evidence misrepresent current state and undermine audit defensibility.",
    },
  ],
  refusalRules: [
    "Never fabricate metric values; only publish numbers derived from Qualtrics (and other named systems) entities.",
    "Never bypass HRBP approval on escalation triggers, even when confidence is high.",
    "Never expose individual personal data (PII) in summaries; aggregate or pseudonymise before output.",
    "Never act on data older than the staleness threshold defined in the runbook without a fresh re-query.",
  ],
  goldenEvals: [
    {
      id: "survey-design-communication-agent-end-to-end",
      prompt: "Run the Survey Design & Communication Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.",
      expectedToolCalls: [
        "query_qualtrics_survey_responses",
        "query_culture_amp_engagement_surveys",
        "query_slack_messages",
        "query_gmail_messages",
        "lookup_survey_design_communication_agent_policy_handbook",
      ],
      mustReferenceEntities: [
        "survey_responses",
        "engagement_surveys",
        "messages",
        "messages",
      ],
      mustCiteDocuments: [
        "survey-design-communication-agent-policy-handbook",
      ],
      expectedActionOutcome: "HRBP receives a fully-cited recommendation; no external state change without explicit approval.",
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
    rationale: "Row counts sized for Survey Design & Communication Agent so the agent can demonstrate the workflow against realistic transactional volume without simulating a production warehouse.",
  },
  sourceSystems: [
    {
      id: "qualtrics",
      name: "Qualtrics",
      owns: [
        "survey_responses",
        "respondent_segments",
        "trend_metrics",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_qualtrics_survey_responses",
        "query_qualtrics_respondent_segments",
        "query_qualtrics_trend_metrics",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
    {
      id: "culture_amp",
      name: "Culture Amp",
      owns: [
        "engagement_surveys",
        "feedback_records",
        "review_cycles",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_culture_amp_engagement_surveys",
        "query_culture_amp_feedback_records",
        "query_culture_amp_review_cycles",
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
      name: "survey_responses",
      sourceSystemId: "qualtrics",
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
      name: "respondent_segments",
      sourceSystemId: "qualtrics",
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
      name: "trend_metrics",
      sourceSystemId: "qualtrics",
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
          name: "period",
          type: "enum",
          values: [
            "day",
            "week",
            "month",
            "quarter",
          ],
          required: true,
        },
        {
          name: "metric_name",
          type: "lorem.words",
          required: true,
        },
        {
          name: "value",
          type: "float",
          min: 0,
          max: 100000,
          decimals: 2,
          required: true,
        },
        {
          name: "variance_pct",
          type: "float",
          min: -50,
          max: 50,
          decimals: 2,
          required: true,
        },
        {
          name: "computed_at",
          type: "date",
          required: true,
        },
      ],
    },
    {
      name: "engagement_surveys",
      sourceSystemId: "culture_amp",
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
      name: "feedback_records",
      sourceSystemId: "culture_amp",
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
      name: "review_cycles",
      sourceSystemId: "culture_amp",
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
  relationships: [],
  documents: [
    {
      id: "survey-design-communication-agent-policy-handbook",
      sourceSystemId: "qualtrics",
      type: "policy",
      title: "Survey Design & Communication Agent Policy Handbook",
      requiredSections: [
        "Eligibility and scope",
        "Workflow steps",
        "Manager responsibilities",
        "Compliance and audit",
        "Sensitive-data handling",
      ],
      linkedEntities: [
        "survey_responses",
        "respondent_segments",
        "trend_metrics",
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
      id: "survey-design-communication-agent-baseline-gap",
      description: "Seed a realistic gap where Design time sits between 4 weeks and 3 days, so the agent can detect, narrate, and recommend remediation.",
      affectedEntities: [
        "survey_responses",
        "respondent_segments",
      ],
      discoveryPath: [
        "Inspect Qualtrics records for the affected entities",
        "Compare against Culture Amp historical baseline",
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
      database: "survey_design_communication_agent",
      schemas: [
        "qualtrics",
        "culture_amp",
        "slack",
        "gmail",
      ],
    },
    bigquery: {
      dataset: "hr_survey_design_communication_agent",
      tables: [
        "kpi_summary",
        "evidence_index",
      ],
    },
    cloudStorage: {
      bucketSuffix: "survey-design-communication-agent-evidence",
      prefixes: [
        "documents",
        "audit-trails",
        "exports",
      ],
    },
    apis: {
      serviceName: "survey-design-communication-agent-source-adapters",
      deploymentTarget: "cloud_run",
    },
  },
  validation: {
    smokePrompt: "Run the Survey Design & Communication Agent workflow and cite source-system evidence for every claim.",
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

export const SurveyDesignCommunication = () => (
  <UseCaseSlide
    title="Survey Design & Communication Agent"
    subtitle="A-701 • Employee Listening"
    icon={ClipboardList}
    domainId="domain-7"
    layer="Layer 2: Agent Designer"
    persona="HRBP"
    triggerType="scheduled"
    swimlane={swimlane}
    systems={["Qualtrics", "Culture Amp", "Slack", "Gmail"]}
    kpis={[
      { label: "Design time", before: "4 weeks", after: "3 days" },
      { label: "Response rate", before: "55%", after: "82%" },
      { label: "Survey fatigue", before: "Not managed", after: "AI-optimized cadence" }
    ]}
    flow={flow}
    architecture={architecture}
    statusQuo={[
      "Engagement surveys designed with generic templates that miss org-specific context.",
      "Communication around surveys feels corporate and drives low response rates.",
      "Survey fatigue goes unaddressed, eroding participation over time."
    ]}
    agentification={[
      "Context-aware survey design based on org-specific themes and prior results.",
      "Personalized launch communications with response rate optimization strategies.",
      "Intelligent survey cadence management to prevent fatigue and maximize participation."
    ]}
  />
);
