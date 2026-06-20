import React from "react";
import { UseCaseSlide } from "../../../agent/UseCaseSlide";
import { FlowStep } from "../../../agent/ProcessFlow";
import { SwimlaneFlow } from "../../../agent/SwimlaneFlow";
import { AgentArchitecture, UseCaseGenerationSpec, AgentBehaviorContract} from "../../../../types/architecture";
import { Eye, Globe, TrendingUp, FileText, Send } from "lucide-react";

const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "s1", label: "Weekly Scan / Alert", lane: "system", type: "trigger" },
    { id: "a1", label: "Multi-Source Ingest", lane: "agent", type: "action" },
    { id: "a2", label: "Signal Interpretation", lane: "agent", type: "action" },
    { id: "a3", label: "Competitive Brief", lane: "agent", type: "output" },
  ],
  connections: [["s1", "a1"], ["a1", "a2"], ["a2", "a3"]],
};

const flow: FlowStep[] = [
  { label: "Signal Collection", icon: Globe, description: "Competitor websites, news feeds, LinkedIn pages, and ad spend data continuously monitored.", trigger: "Weekly + Event", systems: ["SEMrush", "Crayon"] },
  { label: "Ranking Analysis", icon: TrendingUp, description: "Share of voice tracking, keyword ranking comparison, and ad spend estimation aggregated.", systems: ["SEMrush", "BigQuery"], integration: "Analytics" },
  { label: "Impact Interpretation", icon: FileText, description: "Gemini reads competitor announcements and reasons about positioning impact with actionable recommendations.", systems: ["Vertex AI"] },
  { label: "Brief Distribution", icon: Send, description: "Competitive intelligence brief distributed to marketing and sales leadership.", output: "Competitive Brief" },
];

const architecture: AgentArchitecture = {
  connections: [
    { system: "SEMrush", description: "Keyword rankings, ad spend estimates, competitor domain analytics", direction: "read", protocol: "REST API", category: "analytics" },
    { system: "Crayon", description: "Competitor website changes, product updates, pricing changes", direction: "read", protocol: "REST API", category: "market-data" },
    { system: "Google News API", description: "Real-time competitor mentions, industry news, press releases", direction: "read", protocol: "REST API", category: "market-data" },
    { system: "LinkedIn", description: "Competitor company page activity, job postings, leadership changes", direction: "read", protocol: "REST API", category: "market-data" },
    { system: "BigQuery", description: "Historical competitive data, trend analysis, signal aggregation", direction: "bidirectional", protocol: "BigQuery SQL", category: "analytics" },
    { system: "Vertex AI (Gemini)", description: "Competitive signal interpretation, impact reasoning, brief generation", direction: "bidirectional", protocol: "gRPC", category: "ai" },
  ],
  pipeline: [
    { label: "Signal Collection", description: "Poll competitor websites via SEMrush, ingest news feeds from Google News API, monitor LinkedIn company pages for job postings and leadership changes. Aggregate all signals into BigQuery.", systems: ["SEMrush", "Crayon", "Google News API", "LinkedIn"], layer: "integration", dataIn: "Raw competitor web, news, and social signals", dataOut: "Unified competitive signal feed" },
    { label: "Quantitative Analysis", description: "Share of voice tracking across organic and paid channels. Keyword ranking comparison, ad spend estimation, pricing change detection. Trend analysis over time.", systems: ["SEMrush", "BigQuery"], layer: "ml", dataIn: "Competitive signal feed", dataOut: "Share of voice metrics + ranking trends + spend estimates" },
    { label: "Impact Interpretation", description: "Gemini reads competitor blog posts announcing product launches and reasons about positioning impact. Synthesizes SEMrush data, news signals, and product comparisons into actionable competitive briefs.", systems: ["Vertex AI (Gemini)"], layer: "llm", dataIn: "Competitive metrics + unstructured announcements", dataOut: "Actionable competitive intelligence brief" },
    { label: "Distribution", description: "Competitive briefs delivered to marketing and sales leadership. Critical alerts pushed immediately for competitor announcements requiring rapid response.", systems: ["Slack", "Email"], layer: "integration", dataIn: "Competitive brief", dataOut: "Distributed intelligence alerts" },
  ],
};


const behaviorContract: AgentBehaviorContract = {
  role: "CMO agent for the Competitive Intelligence Monitor workflow",
  primaryObjective: "Gemini reads competitor announcements and reasons about positioning impact, interpreting marketing-speak that requires contextual understanding. Synthesizes SEMrush ranking data, news signals, and product comparisons into actionable briefs with specific recommendations. so the CMO can move the Competitor signal latency KPI.",
  inScope: [
    "Gemini reads competitor announcements and reasons about positioning impact, interpreting marketing-speak that requires contextual understanding",
    "Synthesizes SEMrush ranking data, news signals, and product comparisons into actionable briefs with specific recommendations",
    "Distinguishes between noise and genuine competitive threats by correlating multiple signal types across sources",
  ],
  outOfScope: [
    "Final approval of paid spend reallocations above the governance threshold",
    "Trademark, legal, or regulated-industry claim approval",
    "Crisis communications without comms-team sign-off",
  ],
  toolIntents: [
    {
      name: "query_semrush_keyword_rankings",
      kind: "query",
      sourceSystemId: "semrush",
      description: "Retrieve keyword rankings from SEMrush for the Competitive Intelligence Monitor workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "keyword_rankings_records",
        "keyword_rankings_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_crayon_crayon_records",
      kind: "query",
      sourceSystemId: "crayon",
      description: "Retrieve crayon records from Crayon for the Competitive Intelligence Monitor workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "crayon_records_records",
        "crayon_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_google_news_api_google_news_api_records",
      kind: "query",
      sourceSystemId: "google_news_api",
      description: "Retrieve google news api records from Google News API for the Competitive Intelligence Monitor workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "google_news_api_records_records",
        "google_news_api_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_bigquery_analytics_events",
      kind: "query",
      sourceSystemId: "bigquery",
      description: "Retrieve analytics events from BigQuery for the Competitive Intelligence Monitor workflow.",
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
      name: "lookup_competitive_intelligence_monitor_playbook",
      kind: "evidence_lookup",
      sourceSystemId: "bigquery",
      description: "Look up sections of the Competitive Intelligence Monitor Playbook to cite in narrative output, escalation rationale, and audit evidence.",
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
      name: "action_semrush_recommend",
      kind: "action",
      sourceSystemId: "semrush",
      description: "Execute the recommend step in SEMrush after the agent has gathered evidence and validated escalation gates.",
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
      claim: "Competitor signal latency moved from Weeks toward < 24 hours",
      mustCite: [
        "semrush.keyword_rankings",
        "crayon.crayon_records",
      ],
      sourceSystemIds: [
        "semrush",
        "crayon",
      ],
    },
    {
      claim: "Sources monitored moved from 3-4 manual toward 15+ automated",
      mustCite: [
        "semrush.keyword_rankings",
        "crayon.crayon_records",
      ],
      sourceSystemIds: [
        "semrush",
        "crayon",
      ],
    },
  ],
  escalationRules: [
    {
      trigger: "Competitor signal latency regresses past the Weeks baseline by more than 20%",
      action: "escalate_to_human",
      handoffTarget: "CMO",
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
    "Never fabricate metric values; only publish numbers derived from SEMrush (and other named systems) entities.",
    "Never bypass CMO approval on escalation triggers, even when confidence is high.",
    "Never expose individual personal data (PII) in summaries; aggregate or pseudonymise before output.",
    "Never act on data older than the staleness threshold defined in the runbook without a fresh re-query.",
  ],
  goldenEvals: [
    {
      id: "competitive-intelligence-monitor-end-to-end",
      prompt: "Run the Competitive Intelligence Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.",
      expectedToolCalls: [
        "query_semrush_keyword_rankings",
        "query_crayon_crayon_records",
        "query_google_news_api_google_news_api_records",
        "query_bigquery_analytics_events",
        "lookup_competitive_intelligence_monitor_playbook",
        "action_semrush_recommend",
      ],
      mustReferenceEntities: [
        "keyword_rankings",
        "crayon_records",
        "google_news_api_records",
        "analytics_events",
      ],
      mustCiteDocuments: [
        "competitive-intelligence-monitor-playbook",
      ],
      expectedActionOutcome: "Action recommend executed against SEMrush, with audit-trail entry and CMO notified of outcomes.",
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
    rationale: "Row counts sized for Competitive Intelligence Monitor so the agent can demonstrate the workflow against realistic transactional volume without simulating a production warehouse.",
  },
  sourceSystems: [
    {
      id: "semrush",
      name: "SEMrush",
      owns: [
        "keyword_rankings",
        "backlink_profile",
        "competitor_data",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_semrush_keyword_rankings",
        "query_semrush_backlink_profile",
        "query_semrush_competitor_data",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
    {
      id: "crayon",
      name: "Crayon",
      owns: [
        "crayon_records",
        "crayon_events",
        "crayon_audit_trail",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_crayon_crayon_records",
        "query_crayon_crayon_events",
        "query_crayon_crayon_audit_trail",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
    {
      id: "google_news_api",
      name: "Google News API",
      owns: [
        "google_news_api_records",
        "google_news_api_events",
        "google_news_api_audit_trail",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_google_news_api_google_news_api_records",
        "query_google_news_api_google_news_api_events",
        "query_google_news_api_google_news_api_audit_trail",
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
      name: "keyword_rankings",
      sourceSystemId: "semrush",
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
      name: "backlink_profile",
      sourceSystemId: "semrush",
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
      name: "competitor_data",
      sourceSystemId: "semrush",
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
      name: "crayon_records",
      sourceSystemId: "crayon",
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
      name: "crayon_events",
      sourceSystemId: "crayon",
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
          name: "crayon_record_id",
          type: "ref",
          ref: "crayon_records.id",
          required: true,
        },
      ],
    },
    {
      name: "crayon_audit_trail",
      sourceSystemId: "crayon",
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
      name: "google_news_api_records",
      sourceSystemId: "google_news_api",
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
      name: "google_news_api_events",
      sourceSystemId: "google_news_api",
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
          name: "google_news_api_record_id",
          type: "ref",
          ref: "google_news_api_records.id",
          required: true,
        },
      ],
    },
    {
      name: "google_news_api_audit_trail",
      sourceSystemId: "google_news_api",
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
      from: "crayon_events.crayon_record_id",
      to: "crayon_records.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
    {
      from: "google_news_api_events.google_news_api_record_id",
      to: "google_news_api_records.id",
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
      id: "competitive-intelligence-monitor-playbook",
      sourceSystemId: "bigquery",
      type: "playbook",
      title: "Competitive Intelligence Monitor Playbook",
      requiredSections: [
        "Audience guidelines",
        "Brand voice rules",
        "Channel-specific guardrails",
        "Measurement framework",
        "Approval thresholds",
      ],
      linkedEntities: [
        "keyword_rankings",
        "backlink_profile",
        "competitor_data",
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
      id: "semrush_recommend_api",
      sourceSystemId: "semrush",
      method: "POST",
      path: "/api/semrush/recommend",
      description: "Synchronous endpoint the agent calls to recommend in SEMrush after evidence gating.",
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
      id: "competitive-intelligence-monitor-baseline-gap",
      description: "Seed a realistic gap where Competitor signal latency sits between Weeks and < 24 hours, so the agent can detect, narrate, and recommend remediation.",
      affectedEntities: [
        "keyword_rankings",
        "backlink_profile",
      ],
      discoveryPath: [
        "Inspect SEMrush records for the affected entities",
        "Compare against Crayon historical baseline",
        "Generate a citation-backed recommendation",
      ],
      expectedEvidence: [
        "source-system record",
        "historical baseline metric",
        "generated audit trail",
      ],
      expectedRecommendation: "Explain the gap, cite supporting evidence, and propose the next CMO action.",
    },
  ],
  datastorePackaging: {
    alloydb: {
      database: "competitive_intelligence_monitor",
      schemas: [
        "semrush",
        "crayon",
        "google_news_api",
      ],
    },
    bigquery: {
      dataset: "marketing_competitive_intelligence_monitor",
      tables: [
        "kpi_summary",
        "evidence_index",
      ],
    },
    cloudStorage: {
      bucketSuffix: "competitive-intelligence-monitor-evidence",
      prefixes: [
        "documents",
        "audit-trails",
        "exports",
      ],
    },
    apis: {
      serviceName: "competitive-intelligence-monitor-source-adapters",
      deploymentTarget: "cloud_run",
    },
  },
  validation: {
    smokePrompt: "Run the Competitive Intelligence Monitor workflow and cite source-system evidence for every claim.",
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

export const CompetitiveIntelligenceMonitor = () => (
  <UseCaseSlide
    title="Competitive Intelligence Monitor"
    subtitle="A-2903 \u2022 Marketing Strategy"
    icon={Eye}
    domainId="domain-29"
    layer="Layer 3: Custom ADK"
    persona="CMO"
    systems={["SEMrush", "Crayon", "Google News API", "BigQuery", "Vertex AI"]}
    kpis={[
      { label: "Competitor signal latency", before: "Weeks", after: "< 24 hours" },
      { label: "Sources monitored", before: "3-4 manual", after: "15+ automated" },
      { label: "Actionable insights per month", before: "2-3", after: "12-15" },
    ]}
    triggerType="scheduled"
    swimlane={swimlane}
    flow={flow}
    architecture={architecture}
    statusQuo={[
      "Competitive intelligence gathered ad-hoc from sales anecdotes and quarterly analyst reports.",
      "Competitor product launches discovered days or weeks after announcement through informal channels.",
      "No systematic tracking of competitor ad spend, keyword strategy, or content positioning changes."
    ]}
    agentification={[
      "Gemini reads competitor announcements and reasons about positioning impact, interpreting marketing-speak that requires contextual understanding.",
      "Synthesizes SEMrush ranking data, news signals, and product comparisons into actionable briefs with specific recommendations.",
      "Distinguishes between noise and genuine competitive threats by correlating multiple signal types across sources."
    ]}
  />
);
