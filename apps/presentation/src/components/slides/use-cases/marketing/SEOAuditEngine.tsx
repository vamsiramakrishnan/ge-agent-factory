import React from "react";
import { UseCaseSlide } from "../../../agent/UseCaseSlide";
import { FlowStep } from "../../../agent/ProcessFlow";
import { SwimlaneFlow } from "../../../agent/SwimlaneFlow";
import { AgentArchitecture, UseCaseGenerationSpec, AgentBehaviorContract} from "../../../../types/architecture";
import { Search, Globe, AlertTriangle, FileText, CheckCircle } from "lucide-react";

const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "s1", label: "Monthly Crawl", lane: "system", type: "trigger" },
    { id: "a1", label: "Technical Audit", lane: "agent", type: "action" },
    { id: "a2", label: "Content Analysis", lane: "agent", type: "action" },
    { id: "a3", label: "Recommendations", lane: "agent", type: "output" },
    { id: "h1", label: "SEO Specialist Reviews", lane: "human", type: "hitl" },
  ],
  connections: [["s1", "a1"], ["a1", "a2"], ["a2", "a3"], ["a3", "h1"]],
};

const flow: FlowStep[] = [
  { label: "Site Crawl", icon: Globe, description: "Full technical crawl via Screaming Frog and Ahrefs for indexation, speed, and link health.", trigger: "Monthly", systems: ["Ahrefs", "Screaming Frog"] },
  { label: "Ranking Analysis", icon: Search, description: "Keyword ranking data compared with competitor positions from SEMrush.", systems: ["SEMrush", "Google Search Console"] },
  { label: "Issue Diagnosis", icon: AlertTriangle, description: "LLM interprets why pages underperform despite strong technical signals.", systems: ["Vertex AI", "BigQuery"], integration: "ADK" },
  { label: "Specialist Review", icon: CheckCircle, description: "SEO/SEM Specialist validates recommendations and prioritizes fix backlog.", output: "SEO Audit Report" },
];

const architecture: AgentArchitecture = {
  connections: [
    { system: "Ahrefs", description: "Backlink profiles, domain authority, content gap data", direction: "read", protocol: "REST API", category: "analytics" },
    { system: "SEMrush", description: "Keyword rankings, competitor positions, traffic estimates", direction: "read", protocol: "REST API", category: "analytics" },
    { system: "Google Search Console", description: "Indexation status, crawl errors, Core Web Vitals", direction: "read", protocol: "REST API", category: "analytics" },
    { system: "BigQuery", description: "Historical ranking trends, audit result aggregation", direction: "bidirectional", protocol: "BigQuery SQL", category: "analytics" },
    { system: "Vertex AI (Gemini)", description: "Content gap reasoning, search intent interpretation", direction: "bidirectional", protocol: "gRPC", category: "ai" },
    { system: "Jira", description: "SEO fix tickets auto-created and prioritized", direction: "write", protocol: "REST API", category: "collaboration" },
  ],
  pipeline: [
    { label: "Technical Crawl Aggregation", description: "Run full-site crawl via Ahrefs and Screaming Frog. Collect page speed, broken links, redirect chains, canonicalization issues, and Core Web Vitals from Search Console.", systems: ["Ahrefs", "Google Search Console"], layer: "integration", dataIn: "Raw crawl data + Search Console metrics", dataOut: "Technical health scorecard per page" },
    { label: "Ranking & Competitor Analysis", description: "Compare keyword positions against top competitors in SEMrush. Identify ranking declines, keyword cannibalization, and content gaps using BigQuery trend data.", systems: ["SEMrush", "BigQuery"], layer: "ml", dataIn: "Keyword rankings + competitor data", dataOut: "Ranking trend analysis + content gaps" },
    { label: "Intent-Aware Diagnosis", description: "Gemini interprets why pages aren't ranking despite strong technical SEO — analyzing content relevance, search intent mismatches, and competitor depth advantages.", systems: ["Vertex AI (Gemini)"], layer: "llm", dataIn: "Technical scores + ranking gaps + competitor content", dataOut: "Prioritized SEO recommendations with rationale" },
    { label: "Ticket & Report Generation", description: "Generate audit report with prioritized fix backlog. Auto-create Jira tickets for technical issues. Route strategic recommendations to SEO Specialist for review.", systems: ["Jira"], layer: "integration", dataIn: "Prioritized recommendations", dataOut: "Audit report + Jira tickets" },
  ],
};


const behaviorContract: AgentBehaviorContract = {
  role: "SEO/SEM Specialist agent for the SEO Audit & Recommendation Engine workflow",
  primaryObjective: "Gemini reasons about why pages underperform — diagnosing intent mismatches, not just technical issues. Automated monthly crawls with continuous ranking trend monitoring and anomaly alerts. so the SEO/SEM Specialist can move the Audit completion time KPI.",
  inScope: [
    "Gemini reasons about why pages underperform — diagnosing intent mismatches, not just technical issues",
    "Automated monthly crawls with continuous ranking trend monitoring and anomaly alerts",
    "Prioritized fix backlog with estimated traffic impact generated automatically",
  ],
  outOfScope: [
    "Final approval of paid spend reallocations above the governance threshold",
    "Trademark, legal, or regulated-industry claim approval",
    "Crisis communications without comms-team sign-off",
  ],
  toolIntents: [
    {
      name: "query_ahrefs_keyword_rankings",
      kind: "query",
      sourceSystemId: "ahrefs",
      description: "Retrieve keyword rankings from Ahrefs for the SEO Audit & Recommendation Engine workflow.",
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
      name: "query_semrush_keyword_rankings",
      kind: "query",
      sourceSystemId: "semrush",
      description: "Retrieve keyword rankings from SEMrush for the SEO Audit & Recommendation Engine workflow.",
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
      name: "query_google_search_console_google_search_console_records",
      kind: "query",
      sourceSystemId: "google_search_console",
      description: "Retrieve google search console records from Google Search Console for the SEO Audit & Recommendation Engine workflow.",
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
      name: "query_bigquery_analytics_events",
      kind: "query",
      sourceSystemId: "bigquery",
      description: "Retrieve analytics events from BigQuery for the SEO Audit & Recommendation Engine workflow.",
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
      name: "lookup_seo_audit_recommendation_engine_playbook",
      kind: "evidence_lookup",
      sourceSystemId: "bigquery",
      description: "Look up sections of the SEO Audit & Recommendation Engine Playbook to cite in narrative output, escalation rationale, and audit evidence.",
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
      name: "action_ahrefs_recommend",
      kind: "action",
      sourceSystemId: "ahrefs",
      description: "Execute the recommend step in Ahrefs after the agent has gathered evidence and validated escalation gates.",
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
      claim: "Audit completion time moved from 2-3 weeks toward 4 hours",
      mustCite: [
        "ahrefs.keyword_rankings",
        "semrush.keyword_rankings",
      ],
      sourceSystemIds: [
        "ahrefs",
        "semrush",
      ],
    },
    {
      claim: "Issues detected moved from Top 20 manual toward 500+ automated",
      mustCite: [
        "ahrefs.keyword_rankings",
        "semrush.keyword_rankings",
      ],
      sourceSystemIds: [
        "ahrefs",
        "semrush",
      ],
    },
  ],
  escalationRules: [
    {
      trigger: "Audit completion time regresses past the 2-3 weeks baseline by more than 20%",
      action: "escalate_to_human",
      handoffTarget: "SEO/SEM Specialist",
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
    "Never fabricate metric values; only publish numbers derived from Ahrefs (and other named systems) entities.",
    "Never bypass SEO/SEM Specialist approval on escalation triggers, even when confidence is high.",
    "Never expose individual personal data (PII) in summaries; aggregate or pseudonymise before output.",
    "Never act on data older than the staleness threshold defined in the runbook without a fresh re-query.",
  ],
  goldenEvals: [
    {
      id: "seo-audit-recommendation-engine-end-to-end",
      prompt: "Run the SEO Audit & Recommendation Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.",
      expectedToolCalls: [
        "query_ahrefs_keyword_rankings",
        "query_semrush_keyword_rankings",
        "query_google_search_console_google_search_console_records",
        "query_bigquery_analytics_events",
        "lookup_seo_audit_recommendation_engine_playbook",
        "action_ahrefs_recommend",
      ],
      mustReferenceEntities: [
        "keyword_rankings",
        "keyword_rankings",
        "google_search_console_records",
        "analytics_events",
      ],
      mustCiteDocuments: [
        "seo-audit-recommendation-engine-playbook",
      ],
      expectedActionOutcome: "Action recommend executed against Ahrefs, with audit-trail entry and SEO/SEM Specialist notified of outcomes.",
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
    rationale: "Row counts sized for SEO Audit & Recommendation Engine so the agent can demonstrate the workflow against realistic transactional volume without simulating a production warehouse.",
  },
  sourceSystems: [
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
      sourceSystemId: "ahrefs",
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
      sourceSystemId: "ahrefs",
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
      sourceSystemId: "ahrefs",
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
      id: "seo-audit-recommendation-engine-playbook",
      sourceSystemId: "bigquery",
      type: "playbook",
      title: "SEO Audit & Recommendation Engine Playbook",
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
      id: "ahrefs_recommend_api",
      sourceSystemId: "ahrefs",
      method: "POST",
      path: "/api/ahrefs/recommend",
      description: "Synchronous endpoint the agent calls to recommend in Ahrefs after evidence gating.",
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
      id: "seo-audit-recommendation-engine-baseline-gap",
      description: "Seed a realistic gap where Audit completion time sits between 2-3 weeks and 4 hours, so the agent can detect, narrate, and recommend remediation.",
      affectedEntities: [
        "keyword_rankings",
        "backlink_profile",
      ],
      discoveryPath: [
        "Inspect Ahrefs records for the affected entities",
        "Compare against SEMrush historical baseline",
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
      database: "seo_audit_recommendation_engine",
      schemas: [
        "ahrefs",
        "semrush",
        "google_search_console",
      ],
    },
    bigquery: {
      dataset: "marketing_seo_audit_recommendation_engine",
      tables: [
        "kpi_summary",
        "evidence_index",
      ],
    },
    cloudStorage: {
      bucketSuffix: "seo-audit-recommendation-engine-evidence",
      prefixes: [
        "documents",
        "audit-trails",
        "exports",
      ],
    },
    apis: {
      serviceName: "seo-audit-recommendation-engine-source-adapters",
      deploymentTarget: "cloud_run",
    },
  },
  validation: {
    smokePrompt: "Run the SEO Audit & Recommendation Engine workflow and cite source-system evidence for every claim.",
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

export const SEOAuditEngine = () => (
  <UseCaseSlide
    title="SEO Audit & Recommendation Engine"
    subtitle="A-3201 • Digital Marketing & SEO/SEM"
    icon={Search}
    domainId="domain-32"
    layer="Layer 3: Custom ADK"
    persona="SEO/SEM Specialist"
    systems={["Ahrefs", "SEMrush", "Google Search Console", "BigQuery", "Vertex AI"]}
    kpis={[
      { label: "Audit completion time", before: "2-3 weeks", after: "4 hours" },
      { label: "Issues detected", before: "Top 20 manual", after: "500+ automated" },
      { label: "Ranking recovery speed", before: "8-12 weeks", after: "3-4 weeks" },
    ]}
    triggerType="scheduled"
    swimlane={swimlane}
    flow={flow}
    architecture={architecture}
    hitl={{ actor: "SEO/SEM Specialist", action: "Review SEO recommendations", description: "Specialist validates audit findings, prioritizes fix backlog, and approves content restructuring recommendations before implementation." }}
    statusQuo={[
      "Manual site audits using multiple disconnected tools take weeks to compile.",
      "Ranking declines diagnosed reactively — often weeks after traffic drops.",
      "Content gap analysis limited to keyword-level checks without intent understanding."
    ]}
    agentification={[
      "Gemini reasons about why pages underperform — diagnosing intent mismatches, not just technical issues.",
      "Automated monthly crawls with continuous ranking trend monitoring and anomaly alerts.",
      "Prioritized fix backlog with estimated traffic impact generated automatically."
    ]}
  />
);
