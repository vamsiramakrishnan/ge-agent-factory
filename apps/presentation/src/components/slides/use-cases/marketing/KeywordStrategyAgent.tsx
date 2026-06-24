import React from "react";
import { UseCaseSlide } from "../../../agent/UseCaseSlide";
import { FlowStep } from "../../../agent/ProcessFlow";
import { SwimlaneFlow } from "../../../agent/SwimlaneFlow";
import { AgentArchitecture, UseCaseGenerationSpec, AgentBehaviorContract} from "../../../../types/architecture";
import { Target, Database, TrendingUp, FileText, CheckCircle } from "lucide-react";

const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "s1", label: "Monthly Refresh", lane: "system", type: "trigger" },
    { id: "a1", label: "Keyword Universe", lane: "agent", type: "action" },
    { id: "a2", label: "Gap Analysis", lane: "agent", type: "action" },
    { id: "a3", label: "Strategy Brief", lane: "agent", type: "output" },
  ],
  connections: [["s1", "a1"], ["a1", "a2"], ["a2", "a3"]],
};

const flow: FlowStep[] = [
  { label: "Data Collection", icon: Database, description: "Pull keyword rankings, search volumes, and competitor gaps from SEMrush and Ahrefs.", trigger: "Monthly", systems: ["SEMrush", "Ahrefs"] },
  { label: "Trend Detection", icon: TrendingUp, description: "Google Trends and Search Console data reveal emerging queries and seasonal patterns.", systems: ["Google Trends", "Google Search Console"] },
  { label: "Intent Clustering", icon: Target, description: "Cluster keywords by search intent and map to content strategy recommendations.", systems: ["Vertex AI", "BigQuery"], integration: "ADK" },
  { label: "Strategy Output", icon: FileText, description: "Keyword strategy brief with topic clusters, content gaps, and priority recommendations.", output: "Keyword Strategy" },
];

const architecture: AgentArchitecture = {
  connections: [
    { system: "SEMrush", description: "Keyword rankings, difficulty scores, competitor keyword gaps", direction: "read", protocol: "REST API", category: "analytics" },
    { system: "Ahrefs", description: "Keyword explorer data, content gap analysis, SERP features", direction: "read", protocol: "REST API", category: "analytics" },
    { system: "Google Trends", description: "Search interest trends, seasonal patterns, emerging queries", direction: "read", protocol: "REST API", category: "market-data" },
    { system: "Google Search Console", description: "Actual search queries, CTR by position, impression data", direction: "read", protocol: "REST API", category: "analytics" },
    { system: "BigQuery", description: "Keyword universe storage, historical trend analysis, clustering", direction: "bidirectional", protocol: "BigQuery SQL", category: "analytics" },
    { system: "Vertex AI (Gemini)", description: "Search intent classification, content strategy reasoning", direction: "bidirectional", protocol: "gRPC", category: "ai" },
  ],
  pipeline: [
    { label: "Keyword Universe Assembly", description: "Aggregate keyword rankings from SEMrush and Ahrefs. Pull actual search queries and CTR data from Google Search Console. Maintain comprehensive keyword universe in BigQuery.", systems: ["SEMrush", "Ahrefs", "Google Search Console", "BigQuery"], layer: "integration", dataIn: "Raw keyword data across platforms", dataOut: "Unified keyword universe with metrics" },
    { label: "Trend & Gap Detection", description: "Google Trends analysis for emerging queries. Keyword difficulty scoring, cannibalization detection, and topic cluster mapping via BigQuery ML.", systems: ["Google Trends", "BigQuery ML"], layer: "ml", dataIn: "Keyword universe + trend signals", dataOut: "Opportunity-scored keyword gaps" },
    { label: "Intent-Aware Strategy", description: "Gemini classifies search intent behind keyword clusters and reasons about content strategy implications. Identifies mixed-intent keywords needing multiple content pieces.", systems: ["Vertex AI (Gemini)"], layer: "llm", dataIn: "Scored keyword gaps + SERP analysis", dataOut: "Keyword strategy brief with content recommendations" },
    { label: "Brief Delivery", description: "Strategy brief formatted with topic clusters, priority keywords, content type recommendations, and estimated traffic potential. Delivered to content and SEO teams.", systems: ["Google Docs"], layer: "integration", dataIn: "Keyword strategy", dataOut: "Distributed keyword strategy brief" },
  ],
};


const behaviorContract: AgentBehaviorContract = {
  role: "SEO/SEM Specialist agent for the Keyword Strategy Agent workflow",
  primaryObjective: "Gemini analyzes search intent behind keyword clusters — distinguishing informational, commercial, and transactional queries. Continuous trend monitoring surfaces emerging opportunities before competitors. so the SEO/SEM Specialist can move the Keywords tracked KPI.",
  inScope: [
    "Gemini analyzes search intent behind keyword clusters — distinguishing informational, commercial, and transactional queries",
    "Continuous trend monitoring surfaces emerging opportunities before competitors",
    "Automated topic cluster mapping connects keyword strategy to content pipeline",
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
      description: "Retrieve keyword rankings from SEMrush for the Keyword Strategy Agent workflow.",
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
      name: "query_ahrefs_keyword_rankings",
      kind: "query",
      sourceSystemId: "ahrefs",
      description: "Retrieve keyword rankings from Ahrefs for the Keyword Strategy Agent workflow.",
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
      name: "query_google_trends_google_trends_records",
      kind: "query",
      sourceSystemId: "google_trends",
      description: "Retrieve google trends records from Google Trends for the Keyword Strategy Agent workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "google_trends_records_records",
        "google_trends_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_google_search_console_google_search_console_records",
      kind: "query",
      sourceSystemId: "google_search_console",
      description: "Retrieve google search console records from Google Search Console for the Keyword Strategy Agent workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "google_search_console_records_records",
        "google_search_console_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "lookup_keyword_strategy_agent_playbook",
      kind: "evidence_lookup",
      sourceSystemId: "bigquery",
      description: "Look up sections of the Keyword Strategy Agent Playbook to cite in narrative output, escalation rationale, and audit evidence.",
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
      claim: "Keywords tracked moved from 500 manual toward 25K+ automated",
      mustCite: [
        "semrush.keyword_rankings",
        "ahrefs.keyword_rankings",
      ],
      sourceSystemIds: [
        "semrush",
        "ahrefs",
      ],
    },
    {
      claim: "Gap identification moved from Quarterly toward Continuous",
      mustCite: [
        "semrush.keyword_rankings",
        "ahrefs.keyword_rankings",
      ],
      sourceSystemIds: [
        "semrush",
        "ahrefs",
      ],
    },
  ],
  escalationRules: [
    {
      trigger: "Keywords tracked regresses past the 500 manual baseline by more than 20%",
      action: "escalate_to_human",
      handoffTarget: "SEO/SEM Specialist",
      rationale: "Significant regressions need human judgment before automated remediation runs against production records.",
    },
    {
      trigger: "Source-system evidence is incomplete or stale (>24h) for any required entity",
      action: "request_more_info",
      rationale: "Recommendations grounded in stale evidence misrepresent current state and undermine audit defensibility.",
    },
  ],
  refusalRules: [
    "Never fabricate metric values; only publish numbers derived from SEMrush (and other named systems) entities.",
    "Never bypass SEO/SEM Specialist approval on escalation triggers, even when confidence is high.",
    "Never expose individual personal data (PII) in summaries; aggregate or pseudonymise before output.",
    "Never act on data older than the staleness threshold defined in the runbook without a fresh re-query.",
  ],
  goldenEvals: [
    {
      id: "keyword-strategy-agent-end-to-end",
      prompt: "Run the Keyword Strategy Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.",
      expectedToolCalls: [
        "query_semrush_keyword_rankings",
        "query_ahrefs_keyword_rankings",
        "query_google_trends_google_trends_records",
        "query_google_search_console_google_search_console_records",
        "lookup_keyword_strategy_agent_playbook",
      ],
      mustReferenceEntities: [
        "keyword_rankings",
        "keyword_rankings",
        "google_trends_records",
        "google_search_console_records",
        "analytics_events",
      ],
      mustCiteDocuments: [
        "keyword-strategy-agent-playbook",
      ],
      expectedActionOutcome: "SEO/SEM Specialist receives a fully-cited recommendation; no external state change without explicit approval.",
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
    rationale: "Row counts sized for Keyword Strategy Agent so the agent can demonstrate the workflow against realistic transactional volume without simulating a production warehouse.",
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
      id: "ahrefs",
      name: "Ahrefs",
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
        "query_ahrefs_keyword_rankings",
        "query_ahrefs_backlink_profile",
        "query_ahrefs_competitor_data",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
    {
      id: "google_trends",
      name: "Google Trends",
      owns: [
        "google_trends_records",
        "google_trends_events",
        "google_trends_audit_trail",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_google_trends_google_trends_records",
        "query_google_trends_google_trends_events",
        "query_google_trends_google_trends_audit_trail",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
    {
      id: "google_search_console",
      name: "Google Search Console",
      owns: [
        "google_search_console_records",
        "google_search_console_events",
        "google_search_console_audit_trail",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_google_search_console_google_search_console_records",
        "query_google_search_console_google_search_console_events",
        "query_google_search_console_google_search_console_audit_trail",
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
      name: "google_trends_records",
      sourceSystemId: "google_trends",
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
      name: "google_trends_events",
      sourceSystemId: "google_trends",
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
          name: "google_trends_record_id",
          type: "ref",
          ref: "google_trends_records.id",
          required: true,
        },
      ],
    },
    {
      name: "google_trends_audit_trail",
      sourceSystemId: "google_trends",
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
      name: "google_search_console_records",
      sourceSystemId: "google_search_console",
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
      name: "google_search_console_events",
      sourceSystemId: "google_search_console",
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
          name: "google_search_console_record_id",
          type: "ref",
          ref: "google_search_console_records.id",
          required: true,
        },
      ],
    },
    {
      name: "google_search_console_audit_trail",
      sourceSystemId: "google_search_console",
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
      from: "google_trends_events.google_trends_record_id",
      to: "google_trends_records.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
    {
      from: "google_search_console_events.google_search_console_record_id",
      to: "google_search_console_records.id",
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
      id: "keyword-strategy-agent-playbook",
      sourceSystemId: "bigquery",
      type: "playbook",
      title: "Keyword Strategy Agent Playbook",
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
  apis: [],
  anomalies: [
    {
      id: "keyword-strategy-agent-baseline-gap",
      description: "Seed a realistic gap where Keywords tracked sits between 500 manual and 25K+ automated, so the agent can detect, narrate, and recommend remediation.",
      affectedEntities: [
        "keyword_rankings",
        "backlink_profile",
      ],
      discoveryPath: [
        "Inspect SEMrush records for the affected entities",
        "Compare against Ahrefs historical baseline",
        "Generate a citation-backed recommendation",
      ],
      expectedEvidence: [
        "source-system record",
        "historical baseline metric",
        "generated audit trail",
      ],
      expectedRecommendation: "Explain the gap, cite supporting evidence, and propose the next SEO/SEM Specialist action.",
    },
  ],
  datastorePackaging: {
    alloydb: {
      database: "keyword_strategy_agent",
      schemas: [
        "semrush",
        "ahrefs",
        "google_trends",
        "google_search_console",
      ],
    },
    bigquery: {
      dataset: "marketing_keyword_strategy_agent",
      tables: [
        "kpi_summary",
        "evidence_index",
      ],
    },
    cloudStorage: {
      bucketSuffix: "keyword-strategy-agent-evidence",
      prefixes: [
        "documents",
        "audit-trails",
        "exports",
      ],
    },
    apis: {
      serviceName: "keyword-strategy-agent-source-adapters",
      deploymentTarget: "cloud_run",
    },
  },
  validation: {
    smokePrompt: "Run the Keyword Strategy Agent workflow and cite source-system evidence for every claim.",
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

export const KeywordStrategyAgent = () => (
  <UseCaseSlide
    title="Keyword Strategy Agent"
    subtitle="A-3202 • Digital Marketing & SEO/SEM"
    icon={Target}
    domainId="domain-32"
    layer="Layer 4: Data Agent"
    persona="SEO/SEM Specialist"
    systems={["SEMrush", "Ahrefs", "Google Trends", "Google Search Console", "BigQuery"]}
    kpis={[
      { label: "Keywords tracked", before: "500 manual", after: "25K+ automated" },
      { label: "Gap identification", before: "Quarterly", after: "Continuous" },
      { label: "Content pipeline coverage", before: "40%", after: "90%" },
    ]}
    triggerType="scheduled"
    swimlane={swimlane}
    flow={flow}
    architecture={architecture}
    statusQuo={[
      "Keyword research done ad-hoc in spreadsheets with manual competitor comparison.",
      "Search intent classification relies on individual judgment without systematic analysis.",
      "Emerging topic opportunities missed due to infrequent trend monitoring."
    ]}
    agentification={[
      "Gemini analyzes search intent behind keyword clusters — distinguishing informational, commercial, and transactional queries.",
      "Continuous trend monitoring surfaces emerging opportunities before competitors.",
      "Automated topic cluster mapping connects keyword strategy to content pipeline."
    ]}
  />
);
