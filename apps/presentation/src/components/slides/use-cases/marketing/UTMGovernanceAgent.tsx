import React from "react";
import { UseCaseSlide } from "../../../agent/UseCaseSlide";
import { FlowStep } from "../../../agent/ProcessFlow";
import { SwimlaneFlow } from "../../../agent/SwimlaneFlow";
import { AgentArchitecture, UseCaseGenerationSpec, AgentBehaviorContract} from "../../../../types/architecture";
import { Tag, Zap, Search, CheckCircle, BarChart3 } from "lucide-react";

const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "s1", label: "Campaign Created", lane: "system", type: "trigger" },
    { id: "a1", label: "UTM Validation", lane: "agent", type: "action" },
    { id: "a2", label: "Dedup Detection", lane: "agent", type: "action" },
    { id: "a3", label: "Canonical URL", lane: "agent", type: "output" },
    { id: "h1", label: "Attribution Clean", lane: "human", type: "hitl" },
  ],
  connections: [["s1", "a1"], ["a1", "a2"], ["a2", "a3"], ["a3", "h1"]],
};

const flow: FlowStep[] = [
  { label: "Campaign Trigger", icon: Zap, description: "New campaign created or tracking URL submitted for validation.", trigger: "Event", systems: ["HubSpot"] },
  { label: "Convention Check", icon: Search, description: "UTM parameters validated against naming taxonomy and historical patterns.", systems: ["BigQuery"], integration: "ADK" },
  { label: "Dedup & Canonical", icon: Tag, description: "Duplicate or near-duplicate UTMs detected and canonical naming suggested.", systems: ["Vertex AI"] },
  { label: "Clean Attribution", icon: BarChart3, description: "Compliant tracking URL generated and attribution data quality maintained.", output: "Validated Tracking URL" },
];

const architecture: AgentArchitecture = {
  connections: [
    { system: "Google Analytics 4", description: "UTM parameter ingestion, campaign tracking, attribution data", direction: "bidirectional", protocol: "REST API", category: "analytics" },
    { system: "HubSpot", description: "Campaign URL generation, tracking parameter configuration", direction: "bidirectional", protocol: "REST API", category: "erp" },
    { system: "Google Sheets", description: "UTM taxonomy reference, naming convention documentation", direction: "read", protocol: "Workspace API", category: "collaboration" },
    { system: "BigQuery", description: "Historical UTM data, compliance rate tracking, attribution quality scores", direction: "bidirectional", protocol: "BigQuery SQL", category: "analytics" },
    { system: "Vertex AI (Gemini)", description: "Near-duplicate detection, canonical naming suggestion, cleanup prioritization", direction: "bidirectional", protocol: "gRPC", category: "ai" },
    { system: "Slack", description: "Non-compliance alerts, canonical naming suggestions", direction: "write", protocol: "Webhook", category: "collaboration" },
  ],
  pipeline: [
    { label: "Parameter Validation", description: "Intercept campaign URL generation and validate UTM parameters against naming taxonomy. Check for required fields (source, medium, campaign) and format compliance (lowercase, hyphen-delimited).", systems: ["HubSpot", "Google Sheets"], layer: "integration", dataIn: "Submitted UTM parameters", dataOut: "Validation results with specific violations" },
    { label: "Compliance Scoring", description: "Score UTM compliance rate by team and campaign type. Track orphaned parameters, detect naming drift over time, and calculate attribution data quality impact.", systems: ["BigQuery ML"], layer: "ml", dataIn: "UTM history + validation results", dataOut: "Compliance metrics + quality impact score" },
    { label: "Semantic Deduplication", description: "Gemini catches UTM governance issues that pattern matching misses. Detects that 'webinar-ai-2025' and '2025-ai-webinar' refer to the same campaign. Suggests canonical naming and identifies historical data needing cleanup.", systems: ["Vertex AI (Gemini)"], layer: "llm", dataIn: "Current UTMs + historical UTM corpus", dataOut: "Canonical suggestions + cleanup backlog" },
    { label: "Auto-Generation & Alerting", description: "Auto-generate compliant tracking URLs from campaign briefs. Alert teams on non-compliant parameters before campaign launch. Weekly audit report on UTM hygiene.", systems: ["HubSpot", "Slack", "Google Analytics 4"], layer: "integration", dataIn: "Campaign brief + taxonomy rules", dataOut: "Compliant URLs + hygiene report" },
  ],
};


const behaviorContract: AgentBehaviorContract = {
  role: "Marketing Ops Lead agent for the UTM & Tracking Governance Agent workflow",
  primaryObjective: "Gemini detects semantic duplicates that pattern matching misses — different word orders referring to same campaign. LLM suggests canonical naming and identifies historical attribution data needing cleanup. so the Marketing Ops Lead can move the UTM compliance rate KPI.",
  inScope: [
    "Gemini detects semantic duplicates that pattern matching misses — different word orders referring to same campaign",
    "LLM suggests canonical naming and identifies historical attribution data needing cleanup",
    "Auto-generates compliant tracking URLs from campaign briefs, eliminating manual naming decisions",
  ],
  outOfScope: [
    "Final approval of paid spend reallocations above the governance threshold",
    "Trademark, legal, or regulated-industry claim approval",
    "Crisis communications without comms-team sign-off",
  ],
  toolIntents: [
    {
      name: "query_google_analytics_4_session_events",
      kind: "query",
      sourceSystemId: "google_analytics_4",
      description: "Retrieve session events from Google Analytics 4 for the UTM & Tracking Governance Agent workflow.",
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
      name: "query_hubspot_contacts",
      kind: "query",
      sourceSystemId: "hubspot",
      description: "Retrieve contacts from HubSpot for the UTM & Tracking Governance Agent workflow.",
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
      name: "query_google_sheets_sheets",
      kind: "query",
      sourceSystemId: "google_sheets",
      description: "Retrieve sheets from Google Sheets for the UTM & Tracking Governance Agent workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "sheets_records",
        "sheets_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_bigquery_analytics_events",
      kind: "query",
      sourceSystemId: "bigquery",
      description: "Retrieve analytics events from BigQuery for the UTM & Tracking Governance Agent workflow.",
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
      name: "lookup_utm_tracking_governance_agent_playbook",
      kind: "evidence_lookup",
      sourceSystemId: "google_analytics_4",
      description: "Look up sections of the UTM & Tracking Governance Agent Playbook to cite in narrative output, escalation rationale, and audit evidence.",
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
      name: "action_hubspot_generate",
      kind: "action",
      sourceSystemId: "hubspot",
      description: "Execute the generate step in HubSpot after the agent has gathered evidence and validated escalation gates.",
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
      claim: "UTM compliance rate moved from 62% of campaigns toward 98% of campaigns",
      mustCite: [
        "google_analytics_4.session_events",
        "hubspot.contacts",
      ],
      sourceSystemIds: [
        "google_analytics_4",
        "hubspot",
      ],
    },
    {
      claim: "Attribution accuracy moved from Fragmented by naming toward Unified canonical",
      mustCite: [
        "google_analytics_4.session_events",
        "hubspot.contacts",
      ],
      sourceSystemIds: [
        "google_analytics_4",
        "hubspot",
      ],
    },
  ],
  escalationRules: [
    {
      trigger: "UTM compliance rate regresses past the 62% of campaigns baseline by more than 20%",
      action: "escalate_to_human",
      handoffTarget: "Marketing Ops Lead",
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
    "Never fabricate metric values; only publish numbers derived from Google Analytics 4 (and other named systems) entities.",
    "Never bypass Marketing Ops Lead approval on escalation triggers, even when confidence is high.",
    "Never expose individual personal data (PII) in summaries; aggregate or pseudonymise before output.",
    "Never act on data older than the staleness threshold defined in the runbook without a fresh re-query.",
  ],
  goldenEvals: [
    {
      id: "utm-tracking-governance-agent-end-to-end",
      prompt: "Run the UTM & Tracking Governance Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.",
      expectedToolCalls: [
        "query_google_analytics_4_session_events",
        "query_hubspot_contacts",
        "query_google_sheets_sheets",
        "query_bigquery_analytics_events",
        "lookup_utm_tracking_governance_agent_playbook",
        "action_hubspot_generate",
      ],
      mustReferenceEntities: [
        "session_events",
        "contacts",
        "sheets",
        "analytics_events",
      ],
      mustCiteDocuments: [
        "utm-tracking-governance-agent-playbook",
      ],
      expectedActionOutcome: "Action generate executed against HubSpot, with audit-trail entry and Marketing Ops Lead notified of outcomes.",
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
    rationale: "Row counts sized for UTM & Tracking Governance Agent so the agent can demonstrate the workflow against realistic transactional volume without simulating a production warehouse.",
  },
  sourceSystems: [
    {
      id: "google_analytics_4",
      name: "Google Analytics 4",
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
        "query_google_analytics_4_session_events",
        "query_google_analytics_4_conversion_paths",
        "query_google_analytics_4_audience_segments",
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
      id: "google_sheets",
      name: "Google Sheets",
      owns: [
        "sheets",
        "named_ranges",
        "edit_history",
      ],
      protocol: "Workspace API",
      localBacking: [
        "cloud-storage",
      ],
      toolNames: [
        "query_google_sheets_sheets",
        "query_google_sheets_named_ranges",
        "query_google_sheets_edit_history",
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
      sourceSystemId: "google_analytics_4",
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
      sourceSystemId: "google_analytics_4",
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
      sourceSystemId: "google_analytics_4",
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
      name: "sheets",
      sourceSystemId: "google_sheets",
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
      name: "named_ranges",
      sourceSystemId: "google_sheets",
      datastore: "alloydb",
      rowCount: 30,
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
      name: "edit_history",
      sourceSystemId: "google_sheets",
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
          name: "sheet_id",
          type: "ref",
          ref: "sheets.id",
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
      from: "engagement_events.contact_id",
      to: "contacts.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
    {
      from: "edit_history.sheet_id",
      to: "sheets.id",
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
      id: "utm-tracking-governance-agent-playbook",
      sourceSystemId: "google_analytics_4",
      type: "playbook",
      title: "UTM & Tracking Governance Agent Playbook",
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
      id: "hubspot_generate_api",
      sourceSystemId: "hubspot",
      method: "POST",
      path: "/api/hubspot/generate",
      description: "Synchronous endpoint the agent calls to generate in HubSpot after evidence gating.",
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
      id: "utm-tracking-governance-agent-baseline-gap",
      description: "Seed a realistic gap where UTM compliance rate sits between 62% of campaigns and 98% of campaigns, so the agent can detect, narrate, and recommend remediation.",
      affectedEntities: [
        "session_events",
        "conversion_paths",
      ],
      discoveryPath: [
        "Inspect Google Analytics 4 records for the affected entities",
        "Compare against HubSpot historical baseline",
        "Generate a citation-backed recommendation",
      ],
      expectedEvidence: [
        "source-system record",
        "historical baseline metric",
        "generated audit trail",
      ],
      expectedRecommendation: "Explain the gap, cite supporting evidence, and propose the next Marketing Ops Lead action.",
    },
  ],
  datastorePackaging: {
    alloydb: {
      database: "utm_tracking_governance_agent",
      schemas: [
        "hubspot",
        "google_sheets",
      ],
    },
    bigquery: {
      dataset: "marketing_utm_tracking_governance_agent",
      tables: [
        "kpi_summary",
        "evidence_index",
      ],
    },
    cloudStorage: {
      bucketSuffix: "utm-tracking-governance-agent-evidence",
      prefixes: [
        "documents",
        "audit-trails",
        "exports",
      ],
    },
    apis: {
      serviceName: "utm-tracking-governance-agent-source-adapters",
      deploymentTarget: "cloud_run",
    },
  },
  validation: {
    smokePrompt: "Run the UTM & Tracking Governance Agent workflow and cite source-system evidence for every claim.",
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

export const UTMGovernanceAgent = () => (
  <UseCaseSlide
    title="UTM & Tracking Governance Agent"
    subtitle="A-3606 • Marketing Operations"
    icon={Tag}
    domainId="domain-36"
    layer="Layer 2: Agent Designer"
    persona="Marketing Ops Lead"
    systems={["Google Analytics 4", "HubSpot", "Google Sheets", "BigQuery"]}
    kpis={[
      { label: "UTM compliance rate", before: "62% of campaigns", after: "98% of campaigns" },
      { label: "Attribution accuracy", before: "Fragmented by naming", after: "Unified canonical" },
      { label: "Manual URL review", before: "15 min/campaign", after: "Automated" },
    ]}
    triggerType="event"
    swimlane={swimlane}
    flow={flow}
    architecture={architecture}
    statusQuo={[
      "UTM parameters created inconsistently across teams — same campaign tracked under 3 different names.",
      "Attribution reports unreliable because 30% of UTMs don't follow naming conventions.",
      "Manual UTM review process that nobody follows under deadline pressure."
    ]}
    agentification={[
      "Gemini detects semantic duplicates that pattern matching misses — different word orders referring to same campaign.",
      "LLM suggests canonical naming and identifies historical attribution data needing cleanup.",
      "Auto-generates compliant tracking URLs from campaign briefs, eliminating manual naming decisions."
    ]}
  />
);
