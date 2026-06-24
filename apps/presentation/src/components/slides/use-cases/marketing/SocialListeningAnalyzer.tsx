import React from "react";
import { UseCaseSlide } from "../../../agent/UseCaseSlide";
import { FlowStep } from "../../../agent/ProcessFlow";
import { SwimlaneFlow } from "../../../agent/SwimlaneFlow";
import { AgentArchitecture, UseCaseGenerationSpec, AgentBehaviorContract} from "../../../../types/architecture";
import { Ear, Database, AlertTriangle, BarChart3, CheckCircle } from "lucide-react";

const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "s1", label: "Daily Scan", lane: "system", type: "trigger" },
    { id: "a1", label: "Mention Aggregation", lane: "agent", type: "action" },
    { id: "a2", label: "Sentiment Analysis", lane: "agent", type: "action" },
    { id: "a3", label: "Insight Report", lane: "agent", type: "output" },
  ],
  connections: [["s1", "a1"], ["a1", "a2"], ["a2", "a3"]],
};

const flow: FlowStep[] = [
  { label: "Mention Ingest", icon: Database, description: "Pull social mentions and conversations from Sprout Social and Brandwatch.", trigger: "Daily + Spike", systems: ["Sprout Social", "Brandwatch"] },
  { label: "Sentiment Scoring", icon: BarChart3, description: "Topic clustering, mention volume trends, share of voice calculation, and influencer identification.", systems: ["BigQuery ML"] },
  { label: "Nuance Interpretation", icon: Ear, description: "LLM interprets sarcasm, implied criticism, and cultural context that sentiment models miss.", systems: ["Vertex AI"], integration: "ADK" },
  { label: "Alert & Report", icon: AlertTriangle, description: "Sentiment spike alerts and daily listening report with actionable recommendations.", output: "Listening Report" },
];

const architecture: AgentArchitecture = {
  connections: [
    { system: "Sprout Social", description: "Social mentions, conversations, engagement data, brand tags", direction: "read", protocol: "REST API", category: "analytics" },
    { system: "Brandwatch", description: "Broad social listening, topic monitoring, competitive mentions", direction: "read", protocol: "REST API", category: "analytics" },
    { system: "BigQuery", description: "Mention aggregation, sentiment trends, share of voice history", direction: "bidirectional", protocol: "BigQuery SQL", category: "analytics" },
    { system: "Vertex AI (Gemini)", description: "Nuanced sentiment interpretation, sarcasm detection, context analysis", direction: "bidirectional", protocol: "gRPC", category: "ai" },
    { system: "Slack", description: "Real-time sentiment spike alerts to social and brand teams", direction: "write", protocol: "Webhook", category: "collaboration" },
  ],
  pipeline: [
    { label: "Social Mention Aggregation", description: "Pull brand mentions, competitor mentions, and industry conversations from Sprout Social and Brandwatch. Aggregate in BigQuery with timestamp and source metadata.", systems: ["Sprout Social", "Brandwatch", "BigQuery"], layer: "integration", dataIn: "Raw social mentions across platforms", dataOut: "Structured mention dataset" },
    { label: "Quantitative Sentiment Analysis", description: "Sentiment scoring, topic clustering, mention volume trend analysis, share of voice calculation. Anomaly detection for sudden sentiment shifts or mention spikes.", systems: ["BigQuery ML"], layer: "ml", dataIn: "Mention dataset", dataOut: "Sentiment scores + topic clusters + anomalies" },
    { label: "Contextual Interpretation", description: "Gemini interprets nuance in social conversations — sarcasm, implied criticism, cultural context. 'A thread with 50+ replies criticizing our ad isn't a crisis — it's engagement bait from a competitor's community manager. Genuine customer sentiment is positive.'", systems: ["Vertex AI (Gemini)"], layer: "llm", dataIn: "Flagged conversations + sentiment data", dataOut: "Contextual sentiment report with recommendations" },
    { label: "Alert & Distribution", description: "Sentiment spike alerts via Slack immediately. Daily listening digest with share of voice, emerging topics, and recommended actions distributed to social and brand teams.", systems: ["Slack"], layer: "integration", dataIn: "Interpreted sentiment data", dataOut: "Alerts + daily listening digest" },
  ],
};


const behaviorContract: AgentBehaviorContract = {
  role: "Social Media Mgr agent for the Social Listening & Sentiment Analyzer workflow",
  primaryObjective: "Gemini interprets nuanced social conversations — distinguishing genuine criticism from manufactured controversy. Real-time anomaly detection alerts on sentiment spikes before they become crises. so the Social Media Mgr can move the Sentiment detection KPI.",
  inScope: [
    "Gemini interprets nuanced social conversations — distinguishing genuine criticism from manufactured controversy",
    "Real-time anomaly detection alerts on sentiment spikes before they become crises",
    "Daily listening digests with actionable recommendations replace ad-hoc monitoring",
  ],
  outOfScope: [
    "Final approval of paid spend reallocations above the governance threshold",
    "Trademark, legal, or regulated-industry claim approval",
    "Crisis communications without comms-team sign-off",
  ],
  toolIntents: [
    {
      name: "query_sprout_social_social_posts",
      kind: "query",
      sourceSystemId: "sprout_social",
      description: "Retrieve social posts from Sprout Social for the Social Listening & Sentiment Analyzer workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "social_posts_records",
        "social_posts_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_brandwatch_brand_mentions",
      kind: "query",
      sourceSystemId: "brandwatch",
      description: "Retrieve brand mentions from Brandwatch for the Social Listening & Sentiment Analyzer workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "brand_mentions_records",
        "brand_mentions_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_bigquery_analytics_events",
      kind: "query",
      sourceSystemId: "bigquery",
      description: "Retrieve analytics events from BigQuery for the Social Listening & Sentiment Analyzer workflow.",
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
      name: "lookup_social_listening_sentiment_analyzer_playbook",
      kind: "evidence_lookup",
      sourceSystemId: "bigquery",
      description: "Look up sections of the Social Listening & Sentiment Analyzer Playbook to cite in narrative output, escalation rationale, and audit evidence.",
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
      name: "action_sprout_social_recommend",
      kind: "action",
      sourceSystemId: "sprout_social",
      description: "Execute the recommend step in Sprout Social after the agent has gathered evidence and validated escalation gates.",
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
      claim: "Sentiment detection moved from Weekly manual toward Real-time",
      mustCite: [
        "sprout_social.social_posts",
        "brandwatch.brand_mentions",
      ],
      sourceSystemIds: [
        "sprout_social",
        "brandwatch",
      ],
    },
    {
      claim: "Crisis response time moved from 24-48 hours toward < 2 hours",
      mustCite: [
        "sprout_social.social_posts",
        "brandwatch.brand_mentions",
      ],
      sourceSystemIds: [
        "sprout_social",
        "brandwatch",
      ],
    },
  ],
  escalationRules: [
    {
      trigger: "Sentiment detection regresses past the Weekly manual baseline by more than 20%",
      action: "escalate_to_human",
      handoffTarget: "Social Media Mgr",
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
    "Never fabricate metric values; only publish numbers derived from Sprout Social (and other named systems) entities.",
    "Never bypass Social Media Mgr approval on escalation triggers, even when confidence is high.",
    "Never expose individual personal data (PII) in summaries; aggregate or pseudonymise before output.",
    "Never act on data older than the staleness threshold defined in the runbook without a fresh re-query.",
  ],
  goldenEvals: [
    {
      id: "social-listening-sentiment-analyzer-end-to-end",
      prompt: "Run the Social Listening & Sentiment Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.",
      expectedToolCalls: [
        "query_sprout_social_social_posts",
        "query_brandwatch_brand_mentions",
        "query_bigquery_analytics_events",
        "lookup_social_listening_sentiment_analyzer_playbook",
        "action_sprout_social_recommend",
      ],
      mustReferenceEntities: [
        "social_posts",
        "brand_mentions",
        "analytics_events",
      ],
      mustCiteDocuments: [
        "social-listening-sentiment-analyzer-playbook",
      ],
      expectedActionOutcome: "Action recommend executed against Sprout Social, with audit-trail entry and Social Media Mgr notified of outcomes.",
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
    rationale: "Row counts sized for Social Listening & Sentiment Analyzer so the agent can demonstrate the workflow against realistic transactional volume without simulating a production warehouse.",
  },
  sourceSystems: [
    {
      id: "sprout_social",
      name: "Sprout Social",
      owns: [
        "social_posts",
        "engagement_metrics",
        "publishing_queue",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_sprout_social_social_posts",
        "query_sprout_social_engagement_metrics",
        "query_sprout_social_publishing_queue",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
    {
      id: "brandwatch",
      name: "Brandwatch",
      owns: [
        "brand_mentions",
        "sentiment_scores",
        "topic_clusters",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_brandwatch_brand_mentions",
        "query_brandwatch_sentiment_scores",
        "query_brandwatch_topic_clusters",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
    {
      id: "bigquery",
      name: "BigQuery",
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
        "query_bigquery_analytics_events",
        "query_bigquery_historical_metrics",
        "query_bigquery_cached_aggregates",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
  ],
  entities: [
    {
      name: "social_posts",
      sourceSystemId: "sprout_social",
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
      name: "engagement_metrics",
      sourceSystemId: "sprout_social",
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
      name: "publishing_queue",
      sourceSystemId: "sprout_social",
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
      name: "brand_mentions",
      sourceSystemId: "brandwatch",
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
      name: "sentiment_scores",
      sourceSystemId: "brandwatch",
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
      name: "topic_clusters",
      sourceSystemId: "brandwatch",
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
      name: "analytics_events",
      sourceSystemId: "bigquery",
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
      sourceSystemId: "bigquery",
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
      sourceSystemId: "bigquery",
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
      from: "analytics_events.historical_metric_id",
      to: "historical_metrics.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
  ],
  documents: [
    {
      id: "social-listening-sentiment-analyzer-playbook",
      sourceSystemId: "bigquery",
      type: "playbook",
      title: "Social Listening & Sentiment Analyzer Playbook",
      requiredSections: [
        "Audience guidelines",
        "Brand voice rules",
        "Channel-specific guardrails",
        "Measurement framework",
        "Approval thresholds",
      ],
      linkedEntities: [
        "social_posts",
        "engagement_metrics",
        "publishing_queue",
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
      id: "sprout_social_recommend_api",
      sourceSystemId: "sprout_social",
      method: "POST",
      path: "/api/sprout_social/recommend",
      description: "Synchronous endpoint the agent calls to recommend in Sprout Social after evidence gating.",
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
      id: "social-listening-sentiment-analyzer-baseline-gap",
      description: "Seed a realistic gap where Sentiment detection sits between Weekly manual and Real-time, so the agent can detect, narrate, and recommend remediation.",
      affectedEntities: [
        "social_posts",
        "engagement_metrics",
      ],
      discoveryPath: [
        "Inspect Sprout Social records for the affected entities",
        "Compare against Brandwatch historical baseline",
        "Generate a citation-backed recommendation",
      ],
      expectedEvidence: [
        "source-system record",
        "historical baseline metric",
        "generated audit trail",
      ],
      expectedRecommendation: "Explain the gap, cite supporting evidence, and propose the next Social Media Mgr action.",
    },
  ],
  datastorePackaging: {
    alloydb: {
      database: "social_listening_sentiment_analyzer",
      schemas: [
        "sprout_social",
        "brandwatch",
      ],
    },
    bigquery: {
      dataset: "marketing_social_listening_sentiment_analyzer",
      tables: [
        "kpi_summary",
        "evidence_index",
      ],
    },
    cloudStorage: {
      bucketSuffix: "social-listening-sentiment-analyzer-evidence",
      prefixes: [
        "documents",
        "audit-trails",
        "exports",
      ],
    },
    apis: {
      serviceName: "social-listening-sentiment-analyzer-source-adapters",
      deploymentTarget: "cloud_run",
    },
  },
  validation: {
    smokePrompt: "Run the Social Listening & Sentiment Analyzer workflow and cite source-system evidence for every claim.",
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

export const SocialListeningAnalyzer = () => (
  <UseCaseSlide
    title="Social Listening & Sentiment Analyzer"
    subtitle="A-3302 • Social Media & Community"
    icon={Ear}
    domainId="domain-33"
    layer="Layer 3: Custom ADK"
    persona="Social Media Mgr"
    systems={["Sprout Social", "Brandwatch", "BigQuery", "Vertex AI"]}
    kpis={[
      { label: "Sentiment detection", before: "Weekly manual", after: "Real-time" },
      { label: "Crisis response time", before: "24-48 hours", after: "< 2 hours" },
      { label: "Share of voice accuracy", before: "Estimated", after: "Continuous tracking" },
    ]}
    triggerType="scheduled"
    swimlane={swimlane}
    flow={flow}
    architecture={architecture}
    statusQuo={[
      "Social listening done weekly via manual platform checks — sentiment shifts missed for days.",
      "Sentiment scoring misses sarcasm, cultural context, and manufactured controversy.",
      "Share of voice estimated quarterly rather than tracked continuously."
    ]}
    agentification={[
      "Gemini interprets nuanced social conversations — distinguishing genuine criticism from manufactured controversy.",
      "Real-time anomaly detection alerts on sentiment spikes before they become crises.",
      "Daily listening digests with actionable recommendations replace ad-hoc monitoring."
    ]}
  />
);
