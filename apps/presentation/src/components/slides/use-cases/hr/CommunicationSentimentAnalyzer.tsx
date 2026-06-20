import React from "react";
import { UseCaseSlide } from "../../../agent/UseCaseSlide";
import { Radio, Download, Brain, BarChart, Target } from "lucide-react";
import { FlowStep } from "../../../agent/ProcessFlow";
import { SwimlaneFlow } from "../../../agent/SwimlaneFlow";
import { AgentArchitecture, UseCaseGenerationSpec, AgentBehaviorContract} from "../../../../types/architecture";

const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "s1", label: "Engagement Data", lane: "system", type: "trigger" },
    { id: "a1", label: "Sentiment Analysis", lane: "agent", type: "action" },
    { id: "a2", label: "Effectiveness Score", lane: "agent", type: "action" },
    { id: "a3", label: "Optimization Recommendations", lane: "agent", type: "output" },
  ],
  connections: [["s1", "a1"], ["a1", "a2"], ["a2", "a3"]],
};

const flow: FlowStep[] = [
  { label: "Engagement Data", icon: Download, description: "Opens, clicks, reactions, replies tracked.", trigger: "Post-Send", systems: ["Email", "Slack", "Intranet"] },
  { label: "Sentiment Analysis", icon: Brain, description: "NLP analysis of employee reactions and comments.", systems: ["Gemini", "BigQuery"], integration: "Data Agent" },
  { label: "Effectiveness Score", icon: BarChart, description: "Communication effectiveness scored and benchmarked." },
  { label: "Optimization", icon: Target, description: "A/B testing insights for future communications.", output: "Comms Analytics" }
];

const architecture: AgentArchitecture = {
  connections: [
    { system: "Slack", description: "Message reactions, replies, thread engagement data", direction: "read", protocol: "REST API", category: "collaboration" },
    { system: "Email (Gmail)", description: "Open rates, click-through rates, reply signals", direction: "read", protocol: "Workspace API", category: "collaboration" },
    { system: "Workday", description: "Employee segments for demographic engagement analysis", direction: "read", protocol: "REST API", category: "erp" },
    { system: "BigQuery", description: "Communication analytics warehouse, historical benchmarks", direction: "bidirectional", protocol: "BigQuery SQL", category: "analytics" },
    { system: "Vertex AI (Gemini)", description: "NLP sentiment analysis, effectiveness scoring, optimization recommendations", direction: "bidirectional", protocol: "gRPC", category: "ai" },
  ],
  pipeline: [
    { label: "Engagement Data Collection", description: "Aggregate multi-channel engagement signals — opens, clicks, reactions, replies, and thread depth from Slack and email. Join with Workday segments for demographic analysis.", systems: ["Slack", "Email (Gmail)", "Workday"], layer: "integration", dataIn: "Channel engagement metrics + employee segments", dataOut: "Unified engagement dataset by channel × segment" },
    { label: "Sentiment Analysis", description: "Gemini performs NLP analysis on employee reactions, comments, and reply sentiment. Detect emerging themes and emotional tone across communication types.", systems: ["Vertex AI (Gemini)"], layer: "llm", dataIn: "Employee reactions and comments", dataOut: "Sentiment scores with theme clusters" },
    { label: "Effectiveness Scoring", description: "Score each communication on reach, engagement depth, and sentiment. Benchmark against historical performance and organizational averages.", systems: ["BigQuery"], layer: "ml", dataIn: "Engagement metrics + sentiment scores", dataOut: "Communication effectiveness scorecard" },
    { label: "Optimization Recommendations", description: "Generate A/B testing insights and content optimization recommendations for future communications based on historical performance patterns.", systems: ["Vertex AI (Gemini)"], layer: "llm", dataIn: "Effectiveness scores + historical patterns", dataOut: "Optimization playbook with A/B test suggestions" },
  ],
};


const behaviorContract: AgentBehaviorContract = {
  role: "Internal Comms agent for the Communication Reach & Sentiment Analyzer workflow",
  primaryObjective: "Multi-channel reach and engagement analytics with interaction depth scoring. NLP sentiment analysis of employee reactions and feedback signals. so the Internal Comms can move the Reach measurement KPI.",
  inScope: [
    "Multi-channel reach and engagement analytics with interaction depth scoring",
    "NLP sentiment analysis of employee reactions and feedback signals",
    "A/B testing recommendations for communication optimization and strategy refinement",
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
      description: "Retrieve messages from Slack for the Communication Reach & Sentiment Analyzer workflow.",
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
      description: "Retrieve messages from Gmail for the Communication Reach & Sentiment Analyzer workflow.",
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
      name: "query_intranet_intranet_records",
      kind: "query",
      sourceSystemId: "intranet",
      description: "Retrieve intranet records from Intranet for the Communication Reach & Sentiment Analyzer workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "intranet_records_records",
        "intranet_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_google_bigquery_analytics_events",
      kind: "query",
      sourceSystemId: "google_bigquery",
      description: "Retrieve analytics events from Google BigQuery for the Communication Reach & Sentiment Analyzer workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "analytics_events_records",
        "analytics_events_summary",
      ],
      evidenceEmitted: [
        "sql_result",
      ],
    },
    {
      name: "lookup_communication_reach_sentiment_analyzer_policy_handbook",
      kind: "evidence_lookup",
      sourceSystemId: "google_bigquery",
      description: "Look up sections of the Communication Reach & Sentiment Analyzer Policy Handbook to cite in narrative output, escalation rationale, and audit evidence.",
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
      name: "action_slack_recommend",
      kind: "action",
      sourceSystemId: "slack",
      description: "Execute the recommend step in Slack after the agent has gathered evidence and validated escalation gates.",
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
      claim: "Reach measurement moved from Open rates only toward Multi-channel",
      mustCite: [
        "slack.messages",
        "gmail.messages",
      ],
      sourceSystemIds: [
        "slack",
        "gmail",
      ],
    },
    {
      claim: "Sentiment tracking moved from None toward NLP-analyzed",
      mustCite: [
        "slack.messages",
        "gmail.messages",
      ],
      sourceSystemIds: [
        "slack",
        "gmail",
      ],
    },
  ],
  escalationRules: [
    {
      trigger: "Reach measurement regresses past the Open rates only baseline by more than 20%",
      action: "escalate_to_human",
      handoffTarget: "Internal Comms",
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
    "Never fabricate metric values; only publish numbers derived from Slack (and other named systems) entities.",
    "Never bypass Internal Comms approval on escalation triggers, even when confidence is high.",
    "Never expose individual personal data (PII) in summaries; aggregate or pseudonymise before output.",
    "Never act on data older than the staleness threshold defined in the runbook without a fresh re-query.",
  ],
  goldenEvals: [
    {
      id: "communication-reach-sentiment-analyzer-end-to-end",
      prompt: "Run the Communication Reach & Sentiment Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.",
      expectedToolCalls: [
        "query_slack_messages",
        "query_gmail_messages",
        "query_intranet_intranet_records",
        "query_google_bigquery_analytics_events",
        "lookup_communication_reach_sentiment_analyzer_policy_handbook",
        "action_slack_recommend",
      ],
      mustReferenceEntities: [
        "messages",
        "messages",
        "intranet_records",
        "analytics_events",
      ],
      mustCiteDocuments: [
        "communication-reach-sentiment-analyzer-policy-handbook",
      ],
      expectedActionOutcome: "Action recommend executed against Slack, with audit-trail entry and Internal Comms notified of outcomes.",
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
    rationale: "Row counts sized for Communication Reach & Sentiment Analyzer so the agent can demonstrate the workflow against realistic transactional volume without simulating a production warehouse.",
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
    {
      id: "intranet",
      name: "Intranet",
      owns: [
        "intranet_records",
        "intranet_events",
        "intranet_audit_trail",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_intranet_intranet_records",
        "query_intranet_intranet_events",
        "query_intranet_intranet_audit_trail",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
    {
      id: "google_bigquery",
      name: "Google BigQuery",
      owns: [
        "analytics_events",
        "historical_metrics",
        "cached_aggregates",
      ],
      protocol: "BigQuery SQL",
      localBacking: [
        "bigquery",
      ],
      toolNames: [
        "query_google_bigquery_analytics_events",
        "query_google_bigquery_historical_metrics",
        "query_google_bigquery_cached_aggregates",
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
    {
      name: "intranet_records",
      sourceSystemId: "intranet",
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
      name: "intranet_events",
      sourceSystemId: "intranet",
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
          name: "intranet_record_id",
          type: "ref",
          ref: "intranet_records.id",
          required: true,
        },
      ],
    },
    {
      name: "intranet_audit_trail",
      sourceSystemId: "intranet",
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
      name: "analytics_events",
      sourceSystemId: "google_bigquery",
      datastore: "bigquery",
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
        {
          name: "historical_metric_id",
          type: "ref",
          ref: "historical_metrics.id",
          required: true,
        },
      ],
    },
    {
      name: "historical_metrics",
      sourceSystemId: "google_bigquery",
      datastore: "bigquery",
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
      name: "cached_aggregates",
      sourceSystemId: "google_bigquery",
      datastore: "bigquery",
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
  ],
  relationships: [
    {
      from: "intranet_events.intranet_record_id",
      to: "intranet_records.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
    {
      from: "analytics_events.historical_metric_id",
      to: "historical_metrics.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
  ],
  documents: [
    {
      id: "communication-reach-sentiment-analyzer-policy-handbook",
      sourceSystemId: "google_bigquery",
      type: "policy",
      title: "Communication Reach & Sentiment Analyzer Policy Handbook",
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
      id: "slack_recommend_api",
      sourceSystemId: "slack",
      method: "POST",
      path: "/api/slack/recommend",
      description: "Synchronous endpoint the agent calls to recommend in Slack after evidence gating.",
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
      id: "communication-reach-sentiment-analyzer-baseline-gap",
      description: "Seed a realistic gap where Reach measurement sits between Open rates only and Multi-channel, so the agent can detect, narrate, and recommend remediation.",
      affectedEntities: [
        "messages",
        "channels",
      ],
      discoveryPath: [
        "Inspect Slack records for the affected entities",
        "Compare against Gmail historical baseline",
        "Generate a citation-backed recommendation",
      ],
      expectedEvidence: [
        "source-system record",
        "historical baseline metric",
        "generated audit trail",
      ],
      expectedRecommendation: "Explain the gap, cite supporting evidence, and propose the next Internal Comms action.",
    },
  ],
  datastorePackaging: {
    alloydb: {
      database: "communication_reach_sentiment_analyzer",
      schemas: [
        "slack",
        "gmail",
        "intranet",
      ],
    },
    bigquery: {
      dataset: "hr_communication_reach_sentiment_analyzer",
      tables: [
        "kpi_summary",
        "evidence_index",
      ],
    },
    cloudStorage: {
      bucketSuffix: "communication-reach-sentiment-analyzer-evidence",
      prefixes: [
        "documents",
        "audit-trails",
        "exports",
      ],
    },
    apis: {
      serviceName: "communication-reach-sentiment-analyzer-source-adapters",
      deploymentTarget: "cloud_run",
    },
  },
  validation: {
    smokePrompt: "Run the Communication Reach & Sentiment Analyzer workflow and cite source-system evidence for every claim.",
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

export const CommunicationSentimentAnalyzer = () => (
  <UseCaseSlide
    title="Communication Reach & Sentiment Analyzer"
    subtitle="A-707 • Internal Communications"
    icon={Radio}
    domainId="domain-7"
    layer="Layer 4: Data Agent"
    persona="Internal Comms"
    triggerType="scheduled"
    swimlane={swimlane}
    systems={["Slack", "Gmail", "Intranet", "Google BigQuery"]}
    kpis={[
      { label: "Reach measurement", before: "Open rates only", after: "Multi-channel" },
      { label: "Sentiment tracking", before: "None", after: "NLP-analyzed" },
      { label: "Content optimization", before: "Gut feel", after: "A/B tested" }
    ]}
    flow={flow}
    architecture={architecture}
    statusQuo={[
      "Communication effectiveness measured by open rates only, missing true engagement.",
      "Employee sentiment about company messaging remains unknown and untracked.",
      "No feedback loop exists to improve future communications based on past results."
    ]}
    agentification={[
      "Multi-channel reach and engagement analytics with interaction depth scoring.",
      "NLP sentiment analysis of employee reactions and feedback signals.",
      "A/B testing recommendations for communication optimization and strategy refinement."
    ]}
  />
);
