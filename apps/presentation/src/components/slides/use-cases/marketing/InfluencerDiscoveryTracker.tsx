import React from "react";
import { UseCaseSlide } from "../../../agent/UseCaseSlide";
import { FlowStep } from "../../../agent/ProcessFlow";
import { SwimlaneFlow } from "../../../agent/SwimlaneFlow";
import { AgentArchitecture, UseCaseGenerationSpec, AgentBehaviorContract} from "../../../../types/architecture";
import { Star, Search, BarChart3, Users, CheckCircle } from "lucide-react";

const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "s1", label: "Monthly Scan", lane: "system", type: "trigger" },
    { id: "a1", label: "Influencer Discovery", lane: "agent", type: "action" },
    { id: "a2", label: "Quality Assessment", lane: "agent", type: "action" },
    { id: "a3", label: "Recommendations", lane: "agent", type: "output" },
    { id: "h1", label: "Social Mgr Approves", lane: "human", type: "hitl" },
  ],
  connections: [["s1", "a1"], ["a1", "a2"], ["a2", "a3"], ["a3", "h1"]],
};

const flow: FlowStep[] = [
  { label: "Platform Scan", icon: Search, description: "Scan social platforms for industry influencers matching brand criteria.", trigger: "Monthly", systems: ["Sprout Social", "LinkedIn"] },
  { label: "Quality Scoring", icon: BarChart3, description: "Score influencers on reach, engagement, relevance, and audience authenticity.", systems: ["BigQuery ML"] },
  { label: "Content Review", icon: Star, description: "LLM evaluates content quality and brand alignment beyond surface metrics.", systems: ["Vertex AI"], integration: "ADK" },
  { label: "Manager Review", icon: CheckCircle, description: "Social Media Manager reviews recommendations and approves partnership outreach.", output: "Influencer Shortlist" },
];

const architecture: AgentArchitecture = {
  connections: [
    { system: "Sprout Social", description: "Influencer identification, engagement tracking, campaign monitoring", direction: "read", protocol: "REST API", category: "analytics" },
    { system: "LinkedIn", description: "Professional influencer discovery, content quality, audience data", direction: "read", protocol: "REST API", category: "collaboration" },
    { system: "YouTube", description: "Video influencer discovery, subscriber data, engagement metrics", direction: "read", protocol: "REST API", category: "analytics" },
    { system: "BigQuery", description: "Influencer database, scoring models, ROI tracking", direction: "bidirectional", protocol: "BigQuery SQL", category: "analytics" },
    { system: "Vertex AI (Gemini)", description: "Content quality evaluation, brand alignment assessment", direction: "bidirectional", protocol: "gRPC", category: "ai" },
  ],
  pipeline: [
    { label: "Influencer Discovery", description: "Scan social platforms for industry influencers using keyword and topic matching. Pull engagement rates, audience demographics, and content frequency from Sprout Social, LinkedIn, and YouTube.", systems: ["Sprout Social", "LinkedIn", "YouTube"], layer: "integration", dataIn: "Platform profiles + engagement data", dataOut: "Raw influencer candidate list" },
    { label: "Quantitative Scoring", description: "Score influencers on reach x engagement x relevance. Audience overlap analysis, fake follower detection via engagement pattern analysis. ROI tracking for existing influencer campaigns.", systems: ["BigQuery ML"], layer: "ml", dataIn: "Influencer metrics + audience data", dataOut: "Scored influencer rankings" },
    { label: "Content Quality Assessment", description: "Gemini evaluates influencer content quality beyond metrics — does this person actually understand the industry? Analyzes recent content for brand alignment: 'This influencer shifted from enterprise tech to crypto — audience alignment dropped from 72% to 31%.'", systems: ["Vertex AI (Gemini)"], layer: "llm", dataIn: "Influencer content + scoring data", dataOut: "Brand-aligned recommendations with rationale" },
    { label: "Recommendation & Tracking", description: "Generate influencer shortlist with partnership opportunity briefs. Maintain influencer database with engagement history and campaign ROI. Route recommendations for manager approval.", systems: ["BigQuery"], layer: "integration", dataIn: "Assessed influencer list", dataOut: "Influencer shortlist + outreach briefs" },
  ],
};


const behaviorContract: AgentBehaviorContract = {
  role: "Social Media Mgr agent for the Influencer Discovery & Tracking workflow",
  primaryObjective: "Gemini evaluates content quality beyond metrics — whether influencers genuinely understand the industry vs. just having followers. Automated fake follower detection and audience overlap analysis across platforms. so the Social Media Mgr can move the Discovery time KPI.",
  inScope: [
    "Gemini evaluates content quality beyond metrics — whether influencers genuinely understand the industry vs. just having followers",
    "Automated fake follower detection and audience overlap analysis across platforms",
    "Continuous partnership ROI tracking with brand alignment monitoring over time",
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
      description: "Retrieve social posts from Sprout Social for the Influencer Discovery & Tracking workflow.",
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
      name: "query_linkedin_linkedin_records",
      kind: "query",
      sourceSystemId: "linkedin",
      description: "Retrieve linkedin records from LinkedIn for the Influencer Discovery & Tracking workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "linkedin_records_records",
        "linkedin_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_youtube_youtube_records",
      kind: "query",
      sourceSystemId: "youtube",
      description: "Retrieve youtube records from YouTube for the Influencer Discovery & Tracking workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "youtube_records_records",
        "youtube_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_bigquery_analytics_events",
      kind: "query",
      sourceSystemId: "bigquery",
      description: "Retrieve analytics events from BigQuery for the Influencer Discovery & Tracking workflow.",
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
      name: "lookup_influencer_discovery_tracking_playbook",
      kind: "evidence_lookup",
      sourceSystemId: "bigquery",
      description: "Look up sections of the Influencer Discovery & Tracking Playbook to cite in narrative output, escalation rationale, and audit evidence.",
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
      claim: "Discovery time moved from 20 hours/month toward 2 hours",
      mustCite: [
        "sprout_social.social_posts",
        "linkedin.linkedin_records",
      ],
      sourceSystemIds: [
        "sprout_social",
        "linkedin",
      ],
    },
    {
      claim: "Fake follower detection moved from Manual spot-checks toward Automated",
      mustCite: [
        "sprout_social.social_posts",
        "linkedin.linkedin_records",
      ],
      sourceSystemIds: [
        "sprout_social",
        "linkedin",
      ],
    },
  ],
  escalationRules: [
    {
      trigger: "Discovery time regresses past the 20 hours/month baseline by more than 20%",
      action: "escalate_to_human",
      handoffTarget: "Social Media Mgr",
      rationale: "Significant regressions need human judgment before automated remediation runs against production records.",
    },
    {
      trigger: "Source-system evidence is incomplete or stale (>24h) for any required entity",
      action: "request_more_info",
      rationale: "Recommendations grounded in stale evidence misrepresent current state and undermine audit defensibility.",
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
      id: "influencer-discovery-tracking-end-to-end",
      prompt: "Run the Influencer Discovery & Tracking workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.",
      expectedToolCalls: [
        "query_sprout_social_social_posts",
        "query_linkedin_linkedin_records",
        "query_youtube_youtube_records",
        "query_bigquery_analytics_events",
        "lookup_influencer_discovery_tracking_playbook",
      ],
      mustReferenceEntities: [
        "social_posts",
        "linkedin_records",
        "youtube_records",
        "analytics_events",
      ],
      mustCiteDocuments: [
        "influencer-discovery-tracking-playbook",
      ],
      expectedActionOutcome: "Social Media Mgr receives a fully-cited recommendation; no external state change without explicit approval.",
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
    rationale: "Row counts sized for Influencer Discovery & Tracking so the agent can demonstrate the workflow against realistic transactional volume without simulating a production warehouse.",
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
      id: "linkedin",
      name: "LinkedIn",
      owns: [
        "linkedin_records",
        "linkedin_events",
        "linkedin_audit_trail",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_linkedin_linkedin_records",
        "query_linkedin_linkedin_events",
        "query_linkedin_linkedin_audit_trail",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
    {
      id: "youtube",
      name: "YouTube",
      owns: [
        "youtube_records",
        "youtube_events",
        "youtube_audit_trail",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_youtube_youtube_records",
        "query_youtube_youtube_events",
        "query_youtube_youtube_audit_trail",
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
      name: "linkedin_records",
      sourceSystemId: "linkedin",
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
      name: "linkedin_events",
      sourceSystemId: "linkedin",
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
          name: "linkedin_record_id",
          type: "ref",
          ref: "linkedin_records.id",
          required: true,
        },
      ],
    },
    {
      name: "linkedin_audit_trail",
      sourceSystemId: "linkedin",
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
      name: "youtube_records",
      sourceSystemId: "youtube",
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
      name: "youtube_events",
      sourceSystemId: "youtube",
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
          name: "youtube_record_id",
          type: "ref",
          ref: "youtube_records.id",
          required: true,
        },
      ],
    },
    {
      name: "youtube_audit_trail",
      sourceSystemId: "youtube",
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
      from: "linkedin_events.linkedin_record_id",
      to: "linkedin_records.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
    {
      from: "youtube_events.youtube_record_id",
      to: "youtube_records.id",
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
      id: "influencer-discovery-tracking-playbook",
      sourceSystemId: "bigquery",
      type: "playbook",
      title: "Influencer Discovery & Tracking Playbook",
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
  apis: [],
  anomalies: [
    {
      id: "influencer-discovery-tracking-baseline-gap",
      description: "Seed a realistic gap where Discovery time sits between 20 hours/month and 2 hours, so the agent can detect, narrate, and recommend remediation.",
      affectedEntities: [
        "social_posts",
        "engagement_metrics",
      ],
      discoveryPath: [
        "Inspect Sprout Social records for the affected entities",
        "Compare against LinkedIn historical baseline",
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
      database: "influencer_discovery_tracking",
      schemas: [
        "sprout_social",
        "linkedin",
        "youtube",
      ],
    },
    bigquery: {
      dataset: "marketing_influencer_discovery_tracking",
      tables: [
        "kpi_summary",
        "evidence_index",
      ],
    },
    cloudStorage: {
      bucketSuffix: "influencer-discovery-tracking-evidence",
      prefixes: [
        "documents",
        "audit-trails",
        "exports",
      ],
    },
    apis: {
      serviceName: "influencer-discovery-tracking-source-adapters",
      deploymentTarget: "cloud_run",
    },
  },
  validation: {
    smokePrompt: "Run the Influencer Discovery & Tracking workflow and cite source-system evidence for every claim.",
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

export const InfluencerDiscoveryTracker = () => (
  <UseCaseSlide
    title="Influencer Discovery & Tracking"
    subtitle="A-3304 • Social Media & Community"
    icon={Star}
    domainId="domain-33"
    layer="Layer 3: Custom ADK"
    persona="Social Media Mgr"
    systems={["Sprout Social", "LinkedIn", "YouTube", "BigQuery", "Vertex AI"]}
    kpis={[
      { label: "Discovery time", before: "20 hours/month", after: "2 hours" },
      { label: "Fake follower detection", before: "Manual spot-checks", after: "Automated" },
      { label: "Influencer ROI tracking", before: "Ad-hoc", after: "Continuous" },
    ]}
    triggerType="scheduled"
    swimlane={swimlane}
    flow={flow}
    architecture={architecture}
    hitl={{ actor: "Social Media Mgr", action: "Approve partnerships", description: "Social Media Manager reviews influencer recommendations, validates brand alignment, and approves partnership outreach before engagement." }}
    statusQuo={[
      "Influencer discovery through manual platform searches and industry connections.",
      "Follower authenticity and engagement quality assessed through time-consuming manual review.",
      "Influencer ROI tracked inconsistently — difficult to justify continued partnerships."
    ]}
    agentification={[
      "Gemini evaluates content quality beyond metrics — whether influencers genuinely understand the industry vs. just having followers.",
      "Automated fake follower detection and audience overlap analysis across platforms.",
      "Continuous partnership ROI tracking with brand alignment monitoring over time."
    ]}
  />
);
