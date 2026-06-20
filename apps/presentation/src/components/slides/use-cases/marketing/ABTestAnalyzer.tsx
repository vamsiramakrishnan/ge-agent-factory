import React from "react";
import { UseCaseSlide } from "../../../agent/UseCaseSlide";
import { FlowStep } from "../../../agent/ProcessFlow";
import { SwimlaneFlow } from "../../../agent/SwimlaneFlow";
import { AgentArchitecture, UseCaseGenerationSpec, AgentBehaviorContract} from "../../../../types/architecture";
import { FlaskConical, Zap, BarChart3, FileText, CheckCircle } from "lucide-react";

const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "s1", label: "Test Reaches Significance", lane: "system", type: "trigger" },
    { id: "a1", label: "Statistical Analysis", lane: "agent", type: "action" },
    { id: "a2", label: "Segment Breakdown", lane: "agent", type: "action" },
    { id: "a3", label: "Strategy Insight", lane: "agent", type: "output" },
  ],
  connections: [["s1", "a1"], ["a1", "a2"], ["a2", "a3"]],
};

const flow: FlowStep[] = [
  { label: "Test Monitoring", icon: Zap, description: "Monitor running A/B tests across platforms. Alert when tests reach statistical significance.", trigger: "Event + Weekly", systems: ["Google Optimize", "HubSpot"] },
  { label: "Statistical Analysis", icon: BarChart3, description: "Bayesian and frequentist significance testing, segment-level analysis, interaction effects.", systems: ["BigQuery ML"] },
  { label: "Strategic Interpretation", icon: FileText, description: "LLM interprets results beyond 'variant B won' — explains strategic implications.", systems: ["Vertex AI"] },
  { label: "Learning Archive", icon: FlaskConical, description: "Results archived in BigQuery with strategic insights for future test design.", output: "Test Report" },
];

const architecture: AgentArchitecture = {
  connections: [
    { system: "Google Optimize", description: "A/B test configurations, variant performance, experiment management", direction: "bidirectional", protocol: "REST API", category: "analytics" },
    { system: "HubSpot", description: "Email A/B tests, landing page experiments, form tests", direction: "read", protocol: "REST API", category: "erp" },
    { system: "Google Analytics 4", description: "Test traffic data, conversion events, behavioral segments", direction: "read", protocol: "REST API", category: "analytics" },
    { system: "BigQuery", description: "Test result archive, significance calculations, segment analysis", direction: "bidirectional", protocol: "BigQuery SQL", category: "analytics" },
    { system: "Vertex AI (Gemini)", description: "Strategic interpretation of test results, learning synthesis", direction: "bidirectional", protocol: "gRPC", category: "ai" },
  ],
  pipeline: [
    { label: "Test Data Collection", description: "Monitor running A/B tests across Google Optimize, HubSpot, and GA4. Collect variant performance data with segment-level breakdowns. Alert when tests reach minimum sample size.", systems: ["Google Optimize", "HubSpot", "GA4"], layer: "integration", dataIn: "Test variant performance data", dataOut: "Structured test results with segments" },
    { label: "Statistical Significance Analysis", description: "Bayesian and frequentist significance testing. Sample size validation, segment-level analysis (enterprise vs SMB), interaction effect detection. Sequential testing for early stopping decisions.", systems: ["BigQuery ML"], layer: "ml", dataIn: "Test results with segments", dataOut: "Significance scores + segment breakdowns" },
    { label: "Strategic Interpretation", description: "Gemini interprets results beyond 'variant B won.' 'Long-form landing page beat short-form by 23% for enterprise but performed 15% worse for SMB — enterprise buyers need more information. Recommend segment-specific variants rather than single winner.'", systems: ["Vertex AI (Gemini)"], layer: "llm", dataIn: "Significance results + segment data", dataOut: "Strategic test insights + recommendations" },
    { label: "Archive & Learning", description: "Archive test results with strategic insights in BigQuery learning database. Generate test reports. Feed learnings into future hypothesis generation for CRO Agent.", systems: ["BigQuery"], layer: "integration", dataIn: "Interpreted results", dataOut: "Test archive + learning database" },
  ],
};


const behaviorContract: AgentBehaviorContract = {
  role: "Marketing Analyst agent for the A/B Test Analyzer workflow",
  primaryObjective: "Gemini interprets test results strategically — segment-specific winner analysis reveals enterprise vs. SMB divergence. Automated significance monitoring with instant alerts when tests reach conclusions. so the Marketing Analyst can move the Analysis turnaround KPI.",
  inScope: [
    "Gemini interprets test results strategically — segment-specific winner analysis reveals enterprise vs. SMB divergence",
    "Automated significance monitoring with instant alerts when tests reach conclusions",
    "Test learnings archived in searchable database, preventing repeated experiments",
  ],
  outOfScope: [
    "Final approval of paid spend reallocations above the governance threshold",
    "Trademark, legal, or regulated-industry claim approval",
    "Crisis communications without comms-team sign-off",
  ],
  toolIntents: [
    {
      name: "query_google_optimize_google_optimize_records",
      kind: "query",
      sourceSystemId: "google_optimize",
      description: "Retrieve google optimize records from Google Optimize for the A/B Test Analyzer workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "google_optimize_records_records",
        "google_optimize_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_hubspot_contacts",
      kind: "query",
      sourceSystemId: "hubspot",
      description: "Retrieve contacts from HubSpot for the A/B Test Analyzer workflow.",
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
      name: "query_ga4_session_events",
      kind: "query",
      sourceSystemId: "ga4",
      description: "Retrieve session events from GA4 for the A/B Test Analyzer workflow.",
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
      description: "Retrieve analytics events from BigQuery for the A/B Test Analyzer workflow.",
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
      name: "lookup_a_b_test_analyzer_playbook",
      kind: "evidence_lookup",
      sourceSystemId: "ga4",
      description: "Look up sections of the A/B Test Analyzer Playbook to cite in narrative output, escalation rationale, and audit evidence.",
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
      name: "action_google_optimize_archive",
      kind: "action",
      sourceSystemId: "google_optimize",
      description: "Execute the archive step in Google Optimize after the agent has gathered evidence and validated escalation gates.",
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
      claim: "Analysis turnaround moved from 3-5 days manual toward Instant",
      mustCite: [
        "google_optimize.google_optimize_records",
        "hubspot.contacts",
      ],
      sourceSystemIds: [
        "google_optimize",
        "hubspot",
      ],
    },
    {
      claim: "Segment analysis moved from Top-level only toward Multi-segment",
      mustCite: [
        "google_optimize.google_optimize_records",
        "hubspot.contacts",
      ],
      sourceSystemIds: [
        "google_optimize",
        "hubspot",
      ],
    },
  ],
  escalationRules: [
    {
      trigger: "Analysis turnaround regresses past the 3-5 days manual baseline by more than 20%",
      action: "escalate_to_human",
      handoffTarget: "Marketing Analyst",
      rationale: "Significant regressions need human judgment before automated remediation runs against production records.",
    },
    {
      trigger: "Source-system evidence is incomplete or stale (>24h) for any required entity",
      action: "request_more_info",
      rationale: "Recommendations grounded in stale evidence misrepresent current state and undermine audit defensibility.",
    },
    {
      trigger: "Proposed archive action lacks supporting evidence from at least two systems",
      action: "refuse",
      rationale: "Single-system evidence is insufficient to authorize external state changes without manual review.",
    },
  ],
  refusalRules: [
    "Never fabricate metric values; only publish numbers derived from Google Optimize (and other named systems) entities.",
    "Never bypass Marketing Analyst approval on escalation triggers, even when confidence is high.",
    "Never expose individual personal data (PII) in summaries; aggregate or pseudonymise before output.",
    "Never act on data older than the staleness threshold defined in the runbook without a fresh re-query.",
  ],
  goldenEvals: [
    {
      id: "a-b-test-analyzer-end-to-end",
      prompt: "Run the A/B Test Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.",
      expectedToolCalls: [
        "query_google_optimize_google_optimize_records",
        "query_hubspot_contacts",
        "query_ga4_session_events",
        "query_bigquery_analytics_events",
        "lookup_a_b_test_analyzer_playbook",
        "action_google_optimize_archive",
      ],
      mustReferenceEntities: [
        "google_optimize_records",
        "contacts",
        "session_events",
        "analytics_events",
      ],
      mustCiteDocuments: [
        "a-b-test-analyzer-playbook",
      ],
      expectedActionOutcome: "Action archive executed against Google Optimize, with audit-trail entry and Marketing Analyst notified of outcomes.",
      forbiddenBehaviors: [
        "do not invent KPI numbers",
        "do not skip the evidence_lookup step before any recommendation",
        "do not execute archive without two-system evidence",
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
    rationale: "Row counts sized for A/B Test Analyzer so the agent can demonstrate the workflow against realistic transactional volume without simulating a production warehouse.",
  },
  sourceSystems: [
    {
      id: "google_optimize",
      name: "Google Optimize",
      owns: [
        "google_optimize_records",
        "google_optimize_events",
        "google_optimize_audit_trail",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_google_optimize_google_optimize_records",
        "query_google_optimize_google_optimize_events",
        "query_google_optimize_google_optimize_audit_trail",
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
  ],
  entities: [
    {
      name: "google_optimize_records",
      sourceSystemId: "google_optimize",
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
      name: "google_optimize_events",
      sourceSystemId: "google_optimize",
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
          name: "google_optimize_record_id",
          type: "ref",
          ref: "google_optimize_records.id",
          required: true,
        },
      ],
    },
    {
      name: "google_optimize_audit_trail",
      sourceSystemId: "google_optimize",
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
  ],
  relationships: [
    {
      from: "google_optimize_events.google_optimize_record_id",
      to: "google_optimize_records.id",
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
      id: "a-b-test-analyzer-playbook",
      sourceSystemId: "ga4",
      type: "playbook",
      title: "A/B Test Analyzer Playbook",
      requiredSections: [
        "Audience guidelines",
        "Brand voice rules",
        "Channel-specific guardrails",
        "Measurement framework",
        "Approval thresholds",
      ],
      linkedEntities: [
        "google_optimize_records",
        "google_optimize_events",
        "google_optimize_audit_trail",
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
      id: "google_optimize_archive_api",
      sourceSystemId: "google_optimize",
      method: "POST",
      path: "/api/google_optimize/archive",
      description: "Synchronous endpoint the agent calls to archive in Google Optimize after evidence gating.",
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
      id: "a-b-test-analyzer-baseline-gap",
      description: "Seed a realistic gap where Analysis turnaround sits between 3-5 days manual and Instant, so the agent can detect, narrate, and recommend remediation.",
      affectedEntities: [
        "google_optimize_records",
        "google_optimize_events",
      ],
      discoveryPath: [
        "Inspect Google Optimize records for the affected entities",
        "Compare against HubSpot historical baseline",
        "Generate a citation-backed recommendation",
      ],
      expectedEvidence: [
        "source-system record",
        "historical baseline metric",
        "generated audit trail",
      ],
      expectedRecommendation: "Explain the gap, cite supporting evidence, and propose the next Marketing Analyst action.",
    },
  ],
  datastorePackaging: {
    alloydb: {
      database: "a_b_test_analyzer",
      schemas: [
        "google_optimize",
        "hubspot",
      ],
    },
    bigquery: {
      dataset: "marketing_a_b_test_analyzer",
      tables: [
        "kpi_summary",
        "evidence_index",
      ],
    },
    cloudStorage: {
      bucketSuffix: "a-b-test-analyzer-evidence",
      prefixes: [
        "documents",
        "audit-trails",
        "exports",
      ],
    },
    apis: {
      serviceName: "a-b-test-analyzer-source-adapters",
      deploymentTarget: "cloud_run",
    },
  },
  validation: {
    smokePrompt: "Run the A/B Test Analyzer workflow and cite source-system evidence for every claim.",
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

export const ABTestAnalyzer = () => (
  <UseCaseSlide
    title="A/B Test Analyzer"
    subtitle="A-3403 • Marketing Analytics & Attribution"
    icon={FlaskConical}
    domainId="domain-34"
    layer="Layer 4: Data Agent"
    persona="Marketing Analyst"
    systems={["Google Optimize", "HubSpot", "GA4", "BigQuery", "Vertex AI"]}
    kpis={[
      { label: "Analysis turnaround", before: "3-5 days manual", after: "Instant" },
      { label: "Segment analysis", before: "Top-level only", after: "Multi-segment" },
      { label: "Learning retention", before: "Tribal knowledge", after: "Searchable archive" },
    ]}
    triggerType="event"
    swimlane={swimlane}
    flow={flow}
    architecture={architecture}
    statusQuo={[
      "A/B test analysis done manually — results often sit for days before interpretation.",
      "Analysis limited to top-level winner/loser without segment-level insights.",
      "Test learnings documented inconsistently, leading to repeated experiments."
    ]}
    agentification={[
      "Gemini interprets test results strategically — segment-specific winner analysis reveals enterprise vs. SMB divergence.",
      "Automated significance monitoring with instant alerts when tests reach conclusions.",
      "Test learnings archived in searchable database, preventing repeated experiments."
    ]}
  />
);
