import React from "react";
import { UseCaseSlide } from "../../../agent/UseCaseSlide";
import { FlowStep } from "../../../agent/ProcessFlow";
import { SwimlaneFlow } from "../../../agent/SwimlaneFlow";
import { AgentArchitecture, UseCaseGenerationSpec, AgentBehaviorContract} from "../../../../types/architecture";
import { ArrowUpRight, Database, BarChart3, Lightbulb, CheckCircle } from "lucide-react";

const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "s1", label: "Weekly Analysis", lane: "system", type: "trigger" },
    { id: "a1", label: "Funnel Analysis", lane: "agent", type: "action" },
    { id: "a2", label: "Hypothesis Gen", lane: "agent", type: "action" },
    { id: "a3", label: "Test Backlog", lane: "agent", type: "output" },
  ],
  connections: [["s1", "a1"], ["a1", "a2"], ["a2", "a3"]],
};

const flow: FlowStep[] = [
  { label: "Data Collection", icon: Database, description: "Pull funnel data from GA4, heatmaps from Hotjar, and form analytics from HubSpot.", trigger: "Weekly", systems: ["GA4", "Hotjar"] },
  { label: "Drop-off Analysis", icon: BarChart3, description: "Statistical funnel analysis with behavior pattern clustering from session recordings.", systems: ["BigQuery ML"], integration: "ADK" },
  { label: "Hypothesis Generation", icon: Lightbulb, description: "LLM analyzes user behavior patterns and generates conversion optimization hypotheses.", systems: ["Vertex AI"] },
  { label: "Test Queue", icon: ArrowUpRight, description: "Prioritized test backlog with predicted impact and statistical test design.", output: "CRO Test Backlog" },
];

const architecture: AgentArchitecture = {
  connections: [
    { system: "Google Analytics 4", description: "Funnel conversion data, user flow paths, event tracking", direction: "read", protocol: "REST API", category: "analytics" },
    { system: "Hotjar", description: "Heatmaps, session recordings, behavior pattern data", direction: "read", protocol: "REST API", category: "analytics" },
    { system: "Google Optimize", description: "A/B test configuration, experiment results, variant management", direction: "bidirectional", protocol: "REST API", category: "analytics" },
    { system: "HubSpot", description: "Form analytics, submission rates, field-level drop-off", direction: "read", protocol: "REST API", category: "erp" },
    { system: "BigQuery", description: "Historical test results, funnel trend data, segment analysis", direction: "bidirectional", protocol: "BigQuery SQL", category: "analytics" },
    { system: "Vertex AI (Gemini)", description: "Behavior interpretation, hypothesis generation, test design", direction: "bidirectional", protocol: "gRPC", category: "ai" },
  ],
  pipeline: [
    { label: "Behavioral Data Assembly", description: "Pull funnel conversion data from GA4, heatmap and session recording data from Hotjar, form analytics from HubSpot. Aggregate historical test results from BigQuery.", systems: ["GA4", "Hotjar", "HubSpot", "BigQuery"], layer: "integration", dataIn: "Multi-source behavioral data", dataOut: "Unified conversion funnel dataset" },
    { label: "Statistical Funnel Analysis", description: "Funnel drop-off analysis with statistical significance. Session recording clustering by behavior pattern. Multivariate test design with sample size calculations.", systems: ["BigQuery ML"], layer: "ml", dataIn: "Funnel dataset + session data", dataOut: "Drop-off patterns with significance scores" },
    { label: "Hypothesis Generation", description: "Gemini analyzes behavior patterns and generates optimization hypotheses. 'Mobile users from paid social drop off at the form at 3x desktop rate — form requires 8 fields. Hypothesis: reducing to 4 fields will increase mobile conversion by 35-50%.'", systems: ["Vertex AI (Gemini)"], layer: "llm", dataIn: "Drop-off patterns + behavioral context", dataOut: "Prioritized hypotheses with predicted impact" },
    { label: "Test Backlog & Design", description: "Generate prioritized test backlog with experiment designs. Configure A/B tests in Google Optimize. Track results and aggregate learnings for future hypotheses.", systems: ["Google Optimize"], layer: "integration", dataIn: "Approved hypotheses", dataOut: "Configured experiments + test backlog" },
  ],
};


const behaviorContract: AgentBehaviorContract = {
  role: "Digital Marketing Mgr agent for the Conversion Rate Optimization Agent workflow",
  primaryObjective: "Gemini generates conversion hypotheses grounded in behavioral data — mobile drop-off patterns, form friction, CTA placement. Automated funnel analysis identifies statistically significant drop-off points weekly. so the Digital Marketing Mgr can move the Tests launched/quarter KPI.",
  inScope: [
    "Gemini generates conversion hypotheses grounded in behavioral data — mobile drop-off patterns, form friction, CTA placement",
    "Automated funnel analysis identifies statistically significant drop-off points weekly",
    "Test backlog with predicted impact and proper statistical design generated automatically",
  ],
  outOfScope: [
    "Final approval of paid spend reallocations above the governance threshold",
    "Trademark, legal, or regulated-industry claim approval",
    "Crisis communications without comms-team sign-off",
  ],
  toolIntents: [
    {
      name: "query_ga4_session_events",
      kind: "query",
      sourceSystemId: "ga4",
      description: "Retrieve session events from GA4 for the Conversion Rate Optimization Agent workflow.",
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
      name: "query_hotjar_hotjar_records",
      kind: "query",
      sourceSystemId: "hotjar",
      description: "Retrieve hotjar records from Hotjar for the Conversion Rate Optimization Agent workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "hotjar_records_records",
        "hotjar_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_google_optimize_google_optimize_records",
      kind: "query",
      sourceSystemId: "google_optimize",
      description: "Retrieve google optimize records from Google Optimize for the Conversion Rate Optimization Agent workflow.",
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
      description: "Retrieve contacts from HubSpot for the Conversion Rate Optimization Agent workflow.",
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
      name: "lookup_conversion_rate_optimization_agent_playbook",
      kind: "evidence_lookup",
      sourceSystemId: "ga4",
      description: "Look up sections of the Conversion Rate Optimization Agent Playbook to cite in narrative output, escalation rationale, and audit evidence.",
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
      name: "action_hotjar_generate",
      kind: "action",
      sourceSystemId: "hotjar",
      description: "Execute the generate step in Hotjar after the agent has gathered evidence and validated escalation gates.",
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
      claim: "Tests launched/quarter moved from 3-5 manual toward 15+ automated",
      mustCite: [
        "ga4.session_events",
        "hotjar.hotjar_records",
      ],
      sourceSystemIds: [
        "ga4",
        "hotjar",
      ],
    },
    {
      claim: "Conversion rate lift moved from Ad-hoc gains toward +22% avg",
      mustCite: [
        "ga4.session_events",
        "hotjar.hotjar_records",
      ],
      sourceSystemIds: [
        "ga4",
        "hotjar",
      ],
    },
  ],
  escalationRules: [
    {
      trigger: "Tests launched/quarter regresses past the 3-5 manual baseline by more than 20%",
      action: "escalate_to_human",
      handoffTarget: "Digital Marketing Mgr",
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
    "Never fabricate metric values; only publish numbers derived from GA4 (and other named systems) entities.",
    "Never bypass Digital Marketing Mgr approval on escalation triggers, even when confidence is high.",
    "Never expose individual personal data (PII) in summaries; aggregate or pseudonymise before output.",
    "Never act on data older than the staleness threshold defined in the runbook without a fresh re-query.",
  ],
  goldenEvals: [
    {
      id: "conversion-rate-optimization-agent-end-to-end",
      prompt: "Run the Conversion Rate Optimization Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.",
      expectedToolCalls: [
        "query_ga4_session_events",
        "query_hotjar_hotjar_records",
        "query_google_optimize_google_optimize_records",
        "query_hubspot_contacts",
        "lookup_conversion_rate_optimization_agent_playbook",
        "action_hotjar_generate",
      ],
      mustReferenceEntities: [
        "session_events",
        "hotjar_records",
        "google_optimize_records",
        "contacts",
        "analytics_events",
      ],
      mustCiteDocuments: [
        "conversion-rate-optimization-agent-playbook",
      ],
      expectedActionOutcome: "Action generate executed against Hotjar, with audit-trail entry and Digital Marketing Mgr notified of outcomes.",
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
    rationale: "Row counts sized for Conversion Rate Optimization Agent so the agent can demonstrate the workflow against realistic transactional volume without simulating a production warehouse.",
  },
  sourceSystems: [
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
      id: "hotjar",
      name: "Hotjar",
      owns: [
        "hotjar_records",
        "hotjar_events",
        "hotjar_audit_trail",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_hotjar_hotjar_records",
        "query_hotjar_hotjar_events",
        "query_hotjar_hotjar_audit_trail",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
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
      name: "hotjar_records",
      sourceSystemId: "hotjar",
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
      name: "hotjar_events",
      sourceSystemId: "hotjar",
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
          name: "hotjar_record_id",
          type: "ref",
          ref: "hotjar_records.id",
          required: true,
        },
      ],
    },
    {
      name: "hotjar_audit_trail",
      sourceSystemId: "hotjar",
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
      from: "session_events.conversion_path_id",
      to: "conversion_paths.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
    {
      from: "hotjar_events.hotjar_record_id",
      to: "hotjar_records.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
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
      from: "analytics_events.historical_metric_id",
      to: "historical_metrics.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
  ],
  documents: [
    {
      id: "conversion-rate-optimization-agent-playbook",
      sourceSystemId: "ga4",
      type: "playbook",
      title: "Conversion Rate Optimization Agent Playbook",
      requiredSections: [
        "Audience guidelines",
        "Brand voice rules",
        "Channel-specific guardrails",
        "Measurement framework",
        "Approval thresholds",
      ],
      linkedEntities: [
        "session_events",
        "conversion_paths",
        "audience_segments",
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
      id: "hotjar_generate_api",
      sourceSystemId: "hotjar",
      method: "POST",
      path: "/api/hotjar/generate",
      description: "Synchronous endpoint the agent calls to generate in Hotjar after evidence gating.",
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
      id: "conversion-rate-optimization-agent-baseline-gap",
      description: "Seed a realistic gap where Tests launched/quarter sits between 3-5 manual and 15+ automated, so the agent can detect, narrate, and recommend remediation.",
      affectedEntities: [
        "session_events",
        "conversion_paths",
      ],
      discoveryPath: [
        "Inspect GA4 records for the affected entities",
        "Compare against Hotjar historical baseline",
        "Generate a citation-backed recommendation",
      ],
      expectedEvidence: [
        "source-system record",
        "historical baseline metric",
        "generated audit trail",
      ],
      expectedRecommendation: "Explain the gap, cite supporting evidence, and propose the next Digital Marketing Mgr action.",
    },
  ],
  datastorePackaging: {
    alloydb: {
      database: "conversion_rate_optimization_agent",
      schemas: [
        "hotjar",
        "google_optimize",
        "hubspot",
      ],
    },
    bigquery: {
      dataset: "marketing_conversion_rate_optimization_agent",
      tables: [
        "kpi_summary",
        "evidence_index",
      ],
    },
    cloudStorage: {
      bucketSuffix: "conversion-rate-optimization-agent-evidence",
      prefixes: [
        "documents",
        "audit-trails",
        "exports",
      ],
    },
    apis: {
      serviceName: "conversion-rate-optimization-agent-source-adapters",
      deploymentTarget: "cloud_run",
    },
  },
  validation: {
    smokePrompt: "Run the Conversion Rate Optimization Agent workflow and cite source-system evidence for every claim.",
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

export const ConversionRateOptimizer = () => (
  <UseCaseSlide
    title="Conversion Rate Optimization Agent"
    subtitle="A-3207 • Digital Marketing & SEO/SEM"
    icon={ArrowUpRight}
    domainId="domain-32"
    layer="Layer 4: Data Agent"
    persona="Digital Marketing Mgr"
    systems={["GA4", "Hotjar", "Google Optimize", "HubSpot", "BigQuery", "Vertex AI"]}
    kpis={[
      { label: "Tests launched/quarter", before: "3-5 manual", after: "15+ automated" },
      { label: "Conversion rate lift", before: "Ad-hoc gains", after: "+22% avg" },
      { label: "Hypothesis accuracy", before: "Gut-based", after: "Data-validated" },
    ]}
    triggerType="scheduled"
    swimlane={swimlane}
    flow={flow}
    architecture={architecture}
    statusQuo={[
      "CRO driven by intuition with limited A/B testing due to slow hypothesis generation.",
      "Session recording review is time-intensive — only a fraction of recordings analyzed.",
      "Test results documented inconsistently, making institutional learning difficult."
    ]}
    agentification={[
      "Gemini generates conversion hypotheses grounded in behavioral data — mobile drop-off patterns, form friction, CTA placement.",
      "Automated funnel analysis identifies statistically significant drop-off points weekly.",
      "Test backlog with predicted impact and proper statistical design generated automatically."
    ]}
  />
);
