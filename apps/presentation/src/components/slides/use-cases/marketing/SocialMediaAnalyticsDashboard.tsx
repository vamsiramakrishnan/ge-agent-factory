import React from "react";
import { UseCaseSlide } from "../../../agent/UseCaseSlide";
import { FlowStep } from "../../../agent/ProcessFlow";
import { SwimlaneFlow } from "../../../agent/SwimlaneFlow";
import { AgentArchitecture, UseCaseGenerationSpec, AgentBehaviorContract} from "../../../../types/architecture";
import { BarChart3, Database, TrendingUp, FileText, CheckCircle } from "lucide-react";

const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "s1", label: "Weekly Refresh", lane: "system", type: "trigger" },
    { id: "a1", label: "Metrics Aggregation", lane: "agent", type: "action" },
    { id: "a2", label: "Performance Analysis", lane: "agent", type: "action" },
    { id: "a3", label: "Narrative Report", lane: "agent", type: "output" },
  ],
  connections: [["s1", "a1"], ["a1", "a2"], ["a2", "a3"]],
};

const flow: FlowStep[] = [
  { label: "Data Aggregation", icon: Database, description: "Pull platform metrics from Sprout Social and Hootsuite, correlate with GA4 website traffic.", trigger: "Weekly", systems: ["Sprout Social", "GA4"] },
  { label: "Benchmarking", icon: TrendingUp, description: "Engagement rate benchmarking, follower growth modeling, and viral coefficient estimation.", systems: ["BigQuery ML"] },
  { label: "Narrative Generation", icon: FileText, description: "LLM generates performance narratives explaining the 'so what' behind the numbers.", systems: ["Vertex AI"] },
  { label: "Dashboard Delivery", icon: BarChart3, description: "Updated Looker dashboards and narrative weekly report distributed to marketing leadership.", output: "Social Performance Report" },
];

const architecture: AgentArchitecture = {
  connections: [
    { system: "Sprout Social", description: "Platform engagement metrics, post performance, audience demographics", direction: "read", protocol: "REST API", category: "analytics" },
    { system: "Hootsuite", description: "Cross-platform analytics, content performance, team metrics", direction: "read", protocol: "REST API", category: "analytics" },
    { system: "Google Analytics 4", description: "Social traffic attribution, conversion tracking, user behavior", direction: "read", protocol: "REST API", category: "analytics" },
    { system: "BigQuery", description: "Historical social metrics, trend analysis, benchmarking", direction: "bidirectional", protocol: "BigQuery SQL", category: "analytics" },
    { system: "Looker", description: "Social performance dashboards, leadership reporting", direction: "write", protocol: "Looker API", category: "analytics" },
    { system: "Vertex AI (Gemini)", description: "Performance narrative generation, insight synthesis", direction: "bidirectional", protocol: "gRPC", category: "ai" },
  ],
  pipeline: [
    { label: "Metrics Aggregation", description: "Pull platform-specific metrics from Sprout Social and Hootsuite. Correlate social engagement with website traffic and conversions from GA4. Aggregate in BigQuery.", systems: ["Sprout Social", "Hootsuite", "GA4", "BigQuery"], layer: "integration", dataIn: "Raw platform metrics + web analytics", dataOut: "Unified social performance dataset" },
    { label: "Benchmarking & Trend Analysis", description: "Engagement rate benchmarking against industry standards. Follower growth modeling, content type performance ranking, viral coefficient estimation, cross-platform attribution.", systems: ["BigQuery ML"], layer: "ml", dataIn: "Social performance dataset", dataOut: "Benchmarked metrics with trend analysis" },
    { label: "Performance Narrative", description: "Gemini generates weekly narratives explaining the 'so what.' 'LinkedIn engagement up 23% WoW driven by CEO's AI adoption post — this single organic post generated more engagement than entire paid social budget. Recommend building executive thought leadership program.'", systems: ["Vertex AI (Gemini)"], layer: "llm", dataIn: "Benchmarked metrics + content context", dataOut: "Narrative performance report" },
    { label: "Dashboard & Distribution", description: "Updated Looker dashboards with latest metrics. Weekly narrative report distributed to marketing leadership via email.", systems: ["Looker"], layer: "integration", dataIn: "Narrative report + updated metrics", dataOut: "Live dashboards + distributed report" },
  ],
};


const behaviorContract: AgentBehaviorContract = {
  role: "Social Media Mgr agent for the Social Media Analytics Dashboard workflow",
  primaryObjective: "Gemini generates performance narratives that explain the 'so what' — not just data but strategic implications. Unified cross-platform analytics with automated benchmarking and trend detection. so the Social Media Mgr can move the Report creation time KPI.",
  inScope: [
    "Gemini generates performance narratives that explain the 'so what' — not just data but strategic implications",
    "Unified cross-platform analytics with automated benchmarking and trend detection",
    "Weekly leadership reports with actionable recommendations generated automatically",
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
      description: "Retrieve social posts from Sprout Social for the Social Media Analytics Dashboard workflow.",
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
      name: "query_hootsuite_social_posts",
      kind: "query",
      sourceSystemId: "hootsuite",
      description: "Retrieve social posts from Hootsuite for the Social Media Analytics Dashboard workflow.",
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
      name: "query_ga4_session_events",
      kind: "query",
      sourceSystemId: "ga4",
      description: "Retrieve session events from GA4 for the Social Media Analytics Dashboard workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "session_events_records",
        "session_events_summary",
      ],
      evidenceEmitted: [
        "sql_result",
      ],
    },
    {
      name: "query_bigquery_analytics_events",
      kind: "query",
      sourceSystemId: "bigquery",
      description: "Retrieve analytics events from BigQuery for the Social Media Analytics Dashboard workflow.",
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
      name: "lookup_social_media_analytics_dashboard_playbook",
      kind: "evidence_lookup",
      sourceSystemId: "ga4",
      description: "Look up sections of the Social Media Analytics Dashboard Playbook to cite in narrative output, escalation rationale, and audit evidence.",
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
      claim: "Report creation time moved from 4-5 hours/week toward Automated",
      mustCite: [
        "sprout_social.social_posts",
        "hootsuite.social_posts",
      ],
      sourceSystemIds: [
        "sprout_social",
        "hootsuite",
      ],
    },
    {
      claim: "Metrics coverage moved from 3 platforms manual toward All platforms unified",
      mustCite: [
        "sprout_social.social_posts",
        "hootsuite.social_posts",
      ],
      sourceSystemIds: [
        "sprout_social",
        "hootsuite",
      ],
    },
  ],
  escalationRules: [
    {
      trigger: "Report creation time regresses past the 4-5 hours/week baseline by more than 20%",
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
      id: "social-media-analytics-dashboard-end-to-end",
      prompt: "Run the Social Media Analytics Dashboard workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.",
      expectedToolCalls: [
        "query_sprout_social_social_posts",
        "query_hootsuite_social_posts",
        "query_ga4_session_events",
        "query_bigquery_analytics_events",
        "lookup_social_media_analytics_dashboard_playbook",
        "action_sprout_social_recommend",
      ],
      mustReferenceEntities: [
        "social_posts",
        "social_posts",
        "session_events",
        "analytics_events",
        "dashboards",
      ],
      mustCiteDocuments: [
        "social-media-analytics-dashboard-playbook",
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
    rationale: "Row counts sized for Social Media Analytics Dashboard so the agent can demonstrate the workflow against realistic transactional volume without simulating a production warehouse.",
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
      id: "hootsuite",
      name: "Hootsuite",
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
        "query_hootsuite_social_posts",
        "query_hootsuite_engagement_metrics",
        "query_hootsuite_publishing_queue",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
    {
      id: "ga4",
      name: "GA4",
      owns: [
        "session_events",
        "conversion_paths",
        "audience_segments",
      ],
      protocol: "REST API",
      localBacking: [
        "bigquery",
      ],
      toolNames: [
        "query_ga4_session_events",
        "query_ga4_conversion_paths",
        "query_ga4_audience_segments",
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
    {
      id: "looker",
      name: "Looker",
      owns: [
        "dashboards",
        "explore_queries",
        "metric_definitions",
      ],
      protocol: "LookerML",
      localBacking: [
        "bigquery",
      ],
      toolNames: [
        "query_looker_dashboards",
        "query_looker_explore_queries",
        "query_looker_metric_definitions",
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
      name: "session_events",
      sourceSystemId: "ga4",
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
          name: "conversion_path_id",
          type: "ref",
          ref: "conversion_paths.id",
          required: true,
        },
      ],
    },
    {
      name: "conversion_paths",
      sourceSystemId: "ga4",
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
      name: "audience_segments",
      sourceSystemId: "ga4",
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
    {
      name: "dashboards",
      sourceSystemId: "looker",
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
      name: "explore_queries",
      sourceSystemId: "looker",
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
      name: "metric_definitions",
      sourceSystemId: "looker",
      datastore: "bigquery",
      rowCount: 30,
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
      from: "session_events.conversion_path_id",
      to: "conversion_paths.id",
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
      id: "social-media-analytics-dashboard-playbook",
      sourceSystemId: "ga4",
      type: "playbook",
      title: "Social Media Analytics Dashboard Playbook",
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
      id: "social-media-analytics-dashboard-baseline-gap",
      description: "Seed a realistic gap where Report creation time sits between 4-5 hours/week and Automated, so the agent can detect, narrate, and recommend remediation.",
      affectedEntities: [
        "social_posts",
        "engagement_metrics",
      ],
      discoveryPath: [
        "Inspect Sprout Social records for the affected entities",
        "Compare against Hootsuite historical baseline",
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
      database: "social_media_analytics_dashboard",
      schemas: [
        "sprout_social",
        "hootsuite",
      ],
    },
    bigquery: {
      dataset: "marketing_social_media_analytics_dashboard",
      tables: [
        "kpi_summary",
        "evidence_index",
      ],
    },
    cloudStorage: {
      bucketSuffix: "social-media-analytics-dashboard-evidence",
      prefixes: [
        "documents",
        "audit-trails",
        "exports",
      ],
    },
    apis: {
      serviceName: "social-media-analytics-dashboard-source-adapters",
      deploymentTarget: "cloud_run",
    },
  },
  validation: {
    smokePrompt: "Run the Social Media Analytics Dashboard workflow and cite source-system evidence for every claim.",
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

export const SocialMediaAnalyticsDashboard = () => (
  <UseCaseSlide
    title="Social Media Analytics Dashboard"
    subtitle="A-3305 • Social Media & Community"
    icon={BarChart3}
    domainId="domain-33"
    layer="Layer 4: Data Agent"
    persona="Social Media Mgr"
    systems={["Sprout Social", "Hootsuite", "GA4", "BigQuery", "Looker"]}
    kpis={[
      { label: "Report creation time", before: "4-5 hours/week", after: "Automated" },
      { label: "Metrics coverage", before: "3 platforms manual", after: "All platforms unified" },
      { label: "Insight actionability", before: "Data tables", after: "Narrative insights" },
    ]}
    triggerType="scheduled"
    swimlane={swimlane}
    flow={flow}
    architecture={architecture}
    statusQuo={[
      "Social media reports compiled manually from multiple platform dashboards each week.",
      "Cross-platform performance comparison requires manual spreadsheet aggregation.",
      "Reports show numbers but lack narrative explaining what drove the performance."
    ]}
    agentification={[
      "Gemini generates performance narratives that explain the 'so what' — not just data but strategic implications.",
      "Unified cross-platform analytics with automated benchmarking and trend detection.",
      "Weekly leadership reports with actionable recommendations generated automatically."
    ]}
  />
);
