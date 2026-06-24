import React from "react";
import { UseCaseSlide } from "../../../agent/UseCaseSlide";
import { FlowStep } from "../../../agent/ProcessFlow";
import { SwimlaneFlow } from "../../../agent/SwimlaneFlow";
import { AgentArchitecture, UseCaseGenerationSpec, AgentBehaviorContract} from "../../../../types/architecture";
import { Target, Database, TrendingUp, FileText, Send } from "lucide-react";

const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "s1", label: "Weekly Cycle", lane: "system", type: "trigger" },
    { id: "a1", label: "KPI Collection", lane: "agent", type: "action" },
    { id: "a2", label: "Trajectory Forecast", lane: "agent", type: "action" },
    { id: "a3", label: "Progress Narrative", lane: "agent", type: "output" },
  ],
  connections: [["s1", "a1"], ["a1", "a2"], ["a2", "a3"]],
};

const flow: FlowStep[] = [
  { label: "KPI Collection", icon: Database, description: "Pipeline, MQL, engagement, and traffic KPIs pulled from CRM, MAP, and GA4.", trigger: "Weekly", systems: ["Salesforce CRM", "HubSpot", "GA4"] },
  { label: "Trajectory Forecast", icon: TrendingUp, description: "Run-rate analysis with confidence intervals to predict quarter-end achievement for each KR.", systems: ["BigQuery", "Looker"], integration: "Analytics" },
  { label: "Gap Diagnosis", icon: FileText, description: "Gemini interprets why specific OKRs are off-track by correlating multiple data sources and generating recommendations.", systems: ["Vertex AI"] },
  { label: "Report Distribution", icon: Send, description: "Weekly OKR progress report with trajectory forecasts and corrective action recommendations distributed.", output: "OKR Report" },
];

const architecture: AgentArchitecture = {
  connections: [
    { system: "Salesforce CRM", description: "Pipeline value, bookings, win rate, deal velocity", direction: "read", protocol: "REST API", category: "erp" },
    { system: "HubSpot", description: "MQL volume, engagement metrics, email performance", direction: "read", protocol: "REST API", category: "erp" },
    { system: "Google Analytics 4", description: "Website traffic, conversion rates, channel performance", direction: "read", protocol: "REST API", category: "analytics" },
    { system: "BigQuery", description: "Unified KPI data warehouse, trajectory calculations", direction: "bidirectional", protocol: "BigQuery SQL", category: "analytics" },
    { system: "Looker", description: "OKR progress dashboards, trend visualizations", direction: "write", protocol: "REST API", category: "analytics" },
    { system: "Vertex AI (Gemini)", description: "Gap diagnosis, root cause correlation, recommendation generation", direction: "bidirectional", protocol: "gRPC", category: "ai" },
  ],
  pipeline: [
    { label: "KPI Aggregation", description: "Pull pipeline (Salesforce), MQL (HubSpot), traffic and conversion (GA4) data. Aggregate into weekly KPI snapshot in BigQuery.", systems: ["Salesforce CRM", "HubSpot", "Google Analytics 4", "BigQuery"], layer: "integration", dataIn: "Raw KPI data across CRM, MAP, and web analytics", dataOut: "Unified weekly KPI snapshot" },
    { label: "Trajectory Forecasting", description: "Given current run rate, forecast whether each KR will be achieved by quarter-end. Calculate confidence intervals and pacing analysis against targets.", systems: ["BigQuery ML", "Looker"], layer: "ml", dataIn: "Historical KPI trends + current period actuals", dataOut: "KR trajectory forecasts with confidence levels" },
    { label: "Gap Diagnosis & Recommendations", description: "Gemini interprets why specific OKRs are off-track by correlating data sources. Identifies root causes and generates corrective action recommendations.", systems: ["Vertex AI (Gemini)"], layer: "llm", dataIn: "Trajectory data + campaign context + external factors", dataOut: "Progress narrative with gap diagnosis and recommendations" },
    { label: "Report Distribution", description: "Weekly OKR progress report generated and distributed to marketing leadership. Looker dashboards updated with latest trajectory data.", systems: ["Looker", "Google Workspace", "Email"], layer: "integration", dataIn: "Progress narrative + forecasts", dataOut: "Distributed OKR report + updated dashboards" },
  ],
};


const behaviorContract: AgentBehaviorContract = {
  role: "CMO agent for the Marketing OKR Tracker workflow",
  primaryObjective: "Gemini interprets why specific OKRs are off-track by correlating pipeline, campaign, and engagement data with external factors. Trajectory forecasting with confidence intervals predicts quarter-end achievement probability for each KR. so the CMO can move the OKR reporting time KPI.",
  inScope: [
    "Gemini interprets why specific OKRs are off-track by correlating pipeline, campaign, and engagement data with external factors",
    "Trajectory forecasting with confidence intervals predicts quarter-end achievement probability for each KR",
    "Generates natural language progress narratives with corrective action recommendations tied to specific campaigns",
  ],
  outOfScope: [
    "Final approval of paid spend reallocations above the governance threshold",
    "Trademark, legal, or regulated-industry claim approval",
    "Crisis communications without comms-team sign-off",
  ],
  toolIntents: [
    {
      name: "query_salesforce_crm_accounts",
      kind: "query",
      sourceSystemId: "salesforce_crm",
      description: "Retrieve accounts from Salesforce CRM for the Marketing OKR Tracker workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "accounts_records",
        "accounts_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_hubspot_contacts",
      kind: "query",
      sourceSystemId: "hubspot",
      description: "Retrieve contacts from HubSpot for the Marketing OKR Tracker workflow.",
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
      name: "query_google_analytics_4_session_events",
      kind: "query",
      sourceSystemId: "google_analytics_4",
      description: "Retrieve session events from Google Analytics 4 for the Marketing OKR Tracker workflow.",
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
      name: "query_looker_dashboards",
      kind: "query",
      sourceSystemId: "looker",
      description: "Retrieve dashboards from Looker for the Marketing OKR Tracker workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "dashboards_records",
        "dashboards_summary",
      ],
      evidenceEmitted: [
        "sql_result",
      ],
    },
    {
      name: "lookup_marketing_okr_tracker_playbook",
      kind: "evidence_lookup",
      sourceSystemId: "google_analytics_4",
      description: "Look up sections of the Marketing OKR Tracker Playbook to cite in narrative output, escalation rationale, and audit evidence.",
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
      name: "action_salesforce_crm_recommend",
      kind: "action",
      sourceSystemId: "salesforce_crm",
      description: "Execute the recommend step in Salesforce CRM after the agent has gathered evidence and validated escalation gates.",
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
      claim: "OKR reporting time moved from 4-6 hours/week toward Automated",
      mustCite: [
        "salesforce_crm.accounts",
        "hubspot.contacts",
      ],
      sourceSystemIds: [
        "salesforce_crm",
        "hubspot",
      ],
    },
    {
      claim: "Forecast accuracy moved from \\u00b130% toward \\u00b110%",
      mustCite: [
        "salesforce_crm.accounts",
        "hubspot.contacts",
      ],
      sourceSystemIds: [
        "salesforce_crm",
        "hubspot",
      ],
    },
  ],
  escalationRules: [
    {
      trigger: "OKR reporting time regresses past the 4-6 hours/week baseline by more than 20%",
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
    "Never fabricate metric values; only publish numbers derived from Salesforce CRM (and other named systems) entities.",
    "Never bypass CMO approval on escalation triggers, even when confidence is high.",
    "Never expose individual personal data (PII) in summaries; aggregate or pseudonymise before output.",
    "Never act on data older than the staleness threshold defined in the runbook without a fresh re-query.",
  ],
  goldenEvals: [
    {
      id: "marketing-okr-tracker-end-to-end",
      prompt: "Run the Marketing OKR Tracker workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.",
      expectedToolCalls: [
        "query_salesforce_crm_accounts",
        "query_hubspot_contacts",
        "query_google_analytics_4_session_events",
        "query_looker_dashboards",
        "lookup_marketing_okr_tracker_playbook",
        "action_salesforce_crm_recommend",
      ],
      mustReferenceEntities: [
        "accounts",
        "contacts",
        "session_events",
        "dashboards",
      ],
      mustCiteDocuments: [
        "marketing-okr-tracker-playbook",
      ],
      expectedActionOutcome: "Action recommend executed against Salesforce CRM, with audit-trail entry and CMO notified of outcomes.",
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
    rationale: "Row counts sized for Marketing OKR Tracker so the agent can demonstrate the workflow against realistic transactional volume without simulating a production warehouse.",
  },
  sourceSystems: [
    {
      id: "salesforce_crm",
      name: "Salesforce CRM",
      owns: [
        "accounts",
        "opportunities",
        "campaign_influence",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_salesforce_crm_accounts",
        "query_salesforce_crm_opportunities",
        "query_salesforce_crm_campaign_influence",
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
      name: "accounts",
      sourceSystemId: "salesforce_crm",
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
      name: "opportunities",
      sourceSystemId: "salesforce_crm",
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
      name: "campaign_influence",
      sourceSystemId: "salesforce_crm",
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
  ],
  documents: [
    {
      id: "marketing-okr-tracker-playbook",
      sourceSystemId: "google_analytics_4",
      type: "playbook",
      title: "Marketing OKR Tracker Playbook",
      requiredSections: [
        "Audience guidelines",
        "Brand voice rules",
        "Channel-specific guardrails",
        "Measurement framework",
        "Approval thresholds",
      ],
      linkedEntities: [
        "accounts",
        "opportunities",
        "campaign_influence",
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
      id: "salesforce_crm_recommend_api",
      sourceSystemId: "salesforce_crm",
      method: "POST",
      path: "/api/salesforce_crm/recommend",
      description: "Synchronous endpoint the agent calls to recommend in Salesforce CRM after evidence gating.",
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
      id: "marketing-okr-tracker-baseline-gap",
      description: "Seed a realistic gap where OKR reporting time sits between 4-6 hours/week and Automated, so the agent can detect, narrate, and recommend remediation.",
      affectedEntities: [
        "accounts",
        "opportunities",
      ],
      discoveryPath: [
        "Inspect Salesforce CRM records for the affected entities",
        "Compare against HubSpot historical baseline",
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
      database: "marketing_okr_tracker",
      schemas: [
        "salesforce_crm",
        "hubspot",
      ],
    },
    bigquery: {
      dataset: "marketing_marketing_okr_tracker",
      tables: [
        "kpi_summary",
        "evidence_index",
      ],
    },
    cloudStorage: {
      bucketSuffix: "marketing-okr-tracker-evidence",
      prefixes: [
        "documents",
        "audit-trails",
        "exports",
      ],
    },
    apis: {
      serviceName: "marketing-okr-tracker-source-adapters",
      deploymentTarget: "cloud_run",
    },
  },
  validation: {
    smokePrompt: "Run the Marketing OKR Tracker workflow and cite source-system evidence for every claim.",
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

export const MarketingOKRTracker = () => (
  <UseCaseSlide
    title="Marketing OKR Tracker"
    subtitle="A-2907 \u2022 Marketing Strategy"
    icon={Target}
    domainId="domain-29"
    layer="Layer 4: Data Agent"
    persona="CMO"
    systems={["Salesforce CRM", "HubSpot", "Google Analytics 4", "Looker", "Vertex AI"]}
    kpis={[
      { label: "OKR reporting time", before: "4-6 hours/week", after: "Automated" },
      { label: "Forecast accuracy", before: "\u00b130%", after: "\u00b110%" },
      { label: "Gap diagnosis depth", before: "Surface metrics", after: "Multi-source root cause" },
    ]}
    triggerType="scheduled"
    swimlane={swimlane}
    flow={flow}
    architecture={architecture}
    statusQuo={[
      "OKR progress tracked in spreadsheets with manual data pulls from 5+ systems each week.",
      "Trajectory forecasting limited to simple linear projections without confidence intervals.",
      "Root cause analysis for off-track KRs requires ad-hoc investigation across multiple tools."
    ]}
    agentification={[
      "Gemini interprets why specific OKRs are off-track by correlating pipeline, campaign, and engagement data with external factors.",
      "Trajectory forecasting with confidence intervals predicts quarter-end achievement probability for each KR.",
      "Generates natural language progress narratives with corrective action recommendations tied to specific campaigns."
    ]}
  />
);
