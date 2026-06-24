import React from "react";
import { UseCaseSlide } from "../../../agent/UseCaseSlide";
import { FlowStep } from "../../../agent/ProcessFlow";
import { SwimlaneFlow } from "../../../agent/SwimlaneFlow";
import { AgentArchitecture, UseCaseGenerationSpec, AgentBehaviorContract} from "../../../../types/architecture";
import { PieChart, Database, TrendingUp, FileText, CheckCircle } from "lucide-react";

const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "s1", label: "Quarterly Cycle", lane: "system", type: "trigger" },
    { id: "a1", label: "Data Assembly", lane: "agent", type: "action" },
    { id: "a2", label: "MMM Execution", lane: "agent", type: "action" },
    { id: "a3", label: "Strategy Brief", lane: "agent", type: "output" },
    { id: "h1", label: "CMO Reviews", lane: "human", type: "hitl" },
  ],
  connections: [["s1", "a1"], ["a1", "a2"], ["a2", "a3"], ["a3", "h1"]],
};

const flow: FlowStep[] = [
  { label: "Data Assembly", icon: Database, description: "Aggregate 24+ months of channel spend and revenue data with external variables.", trigger: "Quarterly", systems: ["Google Ads", "Meta Ads", "Salesforce CRM"] },
  { label: "Model Execution", icon: TrendingUp, description: "Bayesian regression MMM with response curves, saturation detection, and cross-channel synergy.", systems: ["BigQuery ML", "Vertex AI"] },
  { label: "Strategy Translation", icon: FileText, description: "LLM translates complex MMM output into actionable budget reallocation recommendations.", systems: ["Vertex AI"] },
  { label: "CMO Review", icon: CheckCircle, description: "CMO reviews budget optimization recommendations before implementation.", output: "Budget Strategy" },
];

const architecture: AgentArchitecture = {
  connections: [
    { system: "Google Ads", description: "Paid search spend, impression data, conversion tracking", direction: "read", protocol: "REST API", category: "analytics" },
    { system: "Meta Ads", description: "Social ad spend, reach, engagement, conversion data", direction: "read", protocol: "REST API", category: "analytics" },
    { system: "Salesforce CRM", description: "Revenue data, pipeline progression, deal attribution", direction: "read", protocol: "REST API", category: "erp" },
    { system: "BigQuery", description: "Spend history warehouse, MMM execution, response curve modeling", direction: "bidirectional", protocol: "BigQuery SQL", category: "analytics" },
    { system: "Looker", description: "MMM results visualization, budget scenario dashboards", direction: "write", protocol: "Looker API", category: "analytics" },
    { system: "Vertex AI (Gemini)", description: "MMM output translation, strategy narrative generation", direction: "bidirectional", protocol: "gRPC", category: "ai" },
  ],
  pipeline: [
    { label: "Spend & Revenue Data Assembly", description: "Aggregate 24+ months of channel spend from Google Ads, Meta Ads, and other platforms. Pull revenue and pipeline data from Salesforce CRM. Include external variables (seasonality, market index) for model accuracy.", systems: ["Google Ads", "Meta Ads", "Salesforce CRM", "BigQuery"], layer: "integration", dataIn: "Historical spend + revenue + external factors", dataOut: "MMM-ready dataset" },
    { label: "Marketing Mix Modeling", description: "Bayesian regression MMM with response curve estimation per channel. Saturation point detection, budget optimization with constraints, cross-channel synergy measurement. Diminishing returns analysis.", systems: ["BigQuery ML", "Vertex AI"], layer: "ml", dataIn: "MMM dataset", dataOut: "Channel response curves + optimal allocation" },
    { label: "Strategy Translation", description: "Gemini translates complex MMM output into actionable strategy. 'Content marketing has highest marginal ROI but is approaching saturation. Video content shows strong synergy with paid search — deals engaging both converted 2.3x faster. Recommend reallocating $200K from blog to video.'", systems: ["Vertex AI (Gemini)"], layer: "llm", dataIn: "MMM results + channel data", dataOut: "Budget reallocation strategy with rationale" },
    { label: "CMO Presentation & Scenarios", description: "Generate budget scenario dashboards in Looker (conservative, moderate, aggressive). Present strategy brief with trade-offs to CMO for review and approval.", systems: ["Looker"], layer: "integration", dataIn: "Strategy + scenarios", dataOut: "Budget strategy deck + scenario dashboards" },
  ],
};


const behaviorContract: AgentBehaviorContract = {
  role: "CMO agent for the Marketing Mix Modeler workflow",
  primaryObjective: "Gemini translates complex MMM output into actionable strategy with specific budget recommendations. In-house quarterly MMM with Bayesian regression, saturation detection, and scenario modeling. so the CMO can move the MMM execution KPI.",
  inScope: [
    "Gemini translates complex MMM output into actionable strategy with specific budget recommendations",
    "In-house quarterly MMM with Bayesian regression, saturation detection, and scenario modeling",
    "Cross-channel synergy quantified — identifying which channel combinations amplify results",
  ],
  outOfScope: [
    "Final approval of paid spend reallocations above the governance threshold",
    "Trademark, legal, or regulated-industry claim approval",
    "Crisis communications without comms-team sign-off",
  ],
  toolIntents: [
    {
      name: "query_bigquery_analytics_events",
      kind: "query",
      sourceSystemId: "bigquery",
      description: "Retrieve analytics events from BigQuery for the Marketing Mix Modeler workflow.",
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
      name: "query_google_ads_campaigns",
      kind: "query",
      sourceSystemId: "google_ads",
      description: "Retrieve campaigns from Google Ads for the Marketing Mix Modeler workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "campaigns_records",
        "campaigns_summary",
      ],
      evidenceEmitted: [
        "sql_result",
      ],
    },
    {
      name: "query_meta_ads_campaigns",
      kind: "query",
      sourceSystemId: "meta_ads",
      description: "Retrieve campaigns from Meta Ads for the Marketing Mix Modeler workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "campaigns_records",
        "campaigns_summary",
      ],
      evidenceEmitted: [
        "sql_result",
      ],
    },
    {
      name: "query_salesforce_crm_accounts",
      kind: "query",
      sourceSystemId: "salesforce_crm",
      description: "Retrieve accounts from Salesforce CRM for the Marketing Mix Modeler workflow.",
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
      name: "lookup_marketing_mix_modeler_playbook",
      kind: "evidence_lookup",
      sourceSystemId: "bigquery",
      description: "Look up sections of the Marketing Mix Modeler Playbook to cite in narrative output, escalation rationale, and audit evidence.",
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
      claim: "MMM execution moved from External agency quarterly toward In-house automated",
      mustCite: [
        "bigquery.analytics_events",
        "google_ads.campaigns",
      ],
      sourceSystemIds: [
        "bigquery",
        "google_ads",
      ],
    },
    {
      claim: "Budget optimization moved from Gut-feel allocation toward Data-driven ROI curves",
      mustCite: [
        "bigquery.analytics_events",
        "google_ads.campaigns",
      ],
      sourceSystemIds: [
        "bigquery",
        "google_ads",
      ],
    },
  ],
  escalationRules: [
    {
      trigger: "MMM execution regresses past the External agency quarterly baseline by more than 20%",
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
    "Never fabricate metric values; only publish numbers derived from BigQuery (and other named systems) entities.",
    "Never bypass CMO approval on escalation triggers, even when confidence is high.",
    "Never expose individual personal data (PII) in summaries; aggregate or pseudonymise before output.",
    "Never act on data older than the staleness threshold defined in the runbook without a fresh re-query.",
  ],
  goldenEvals: [
    {
      id: "marketing-mix-modeler-end-to-end",
      prompt: "Run the Marketing Mix Modeler workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.",
      expectedToolCalls: [
        "query_bigquery_analytics_events",
        "query_google_ads_campaigns",
        "query_meta_ads_campaigns",
        "query_salesforce_crm_accounts",
        "lookup_marketing_mix_modeler_playbook",
        "action_salesforce_crm_recommend",
      ],
      mustReferenceEntities: [
        "analytics_events",
        "campaigns",
        "campaigns",
        "accounts",
        "dashboards",
      ],
      mustCiteDocuments: [
        "marketing-mix-modeler-playbook",
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
    rationale: "Row counts sized for Marketing Mix Modeler so the agent can demonstrate the workflow against realistic transactional volume without simulating a production warehouse.",
  },
  sourceSystems: [
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
      id: "google_ads",
      name: "Google Ads",
      owns: [
        "campaigns",
        "ad_groups",
        "spend_records",
      ],
      protocol: "Ads API",
      localBacking: [
        "bigquery",
      ],
      toolNames: [
        "query_google_ads_campaigns",
        "query_google_ads_ad_groups",
        "query_google_ads_spend_records",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
    {
      id: "meta_ads",
      name: "Meta Ads",
      owns: [
        "campaigns",
        "ad_creatives",
        "spend_records",
      ],
      protocol: "Ads API",
      localBacking: [
        "bigquery",
      ],
      toolNames: [
        "query_meta_ads_campaigns",
        "query_meta_ads_ad_creatives",
        "query_meta_ads_spend_records",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
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
      name: "campaigns",
      sourceSystemId: "google_ads",
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
      name: "ad_groups",
      sourceSystemId: "google_ads",
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
      name: "spend_records",
      sourceSystemId: "google_ads",
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
          name: "service",
          type: "lorem.words",
          required: true,
        },
        {
          name: "amount",
          type: "float",
          min: 1,
          max: 10000,
          decimals: 2,
          required: true,
        },
        {
          name: "currency",
          type: "enum",
          values: [
            "USD",
            "EUR",
          ],
          required: true,
        },
        {
          name: "period_start",
          type: "date",
          required: true,
        },
        {
          name: "period_end",
          type: "date",
          required: true,
        },
      ],
    },
    {
      name: "ad_creatives",
      sourceSystemId: "meta_ads",
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
      from: "analytics_events.historical_metric_id",
      to: "historical_metrics.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
  ],
  documents: [
    {
      id: "marketing-mix-modeler-playbook",
      sourceSystemId: "bigquery",
      type: "playbook",
      title: "Marketing Mix Modeler Playbook",
      requiredSections: [
        "Audience guidelines",
        "Brand voice rules",
        "Channel-specific guardrails",
        "Measurement framework",
        "Approval thresholds",
      ],
      linkedEntities: [
        "analytics_events",
        "historical_metrics",
        "cached_aggregates",
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
      id: "marketing-mix-modeler-baseline-gap",
      description: "Seed a realistic gap where MMM execution sits between External agency quarterly and In-house automated, so the agent can detect, narrate, and recommend remediation.",
      affectedEntities: [
        "analytics_events",
        "historical_metrics",
      ],
      discoveryPath: [
        "Inspect BigQuery records for the affected entities",
        "Compare against Google Ads historical baseline",
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
      database: "marketing_mix_modeler",
      schemas: [
        "salesforce_crm",
      ],
    },
    bigquery: {
      dataset: "marketing_marketing_mix_modeler",
      tables: [
        "kpi_summary",
        "evidence_index",
      ],
    },
    cloudStorage: {
      bucketSuffix: "marketing-mix-modeler-evidence",
      prefixes: [
        "documents",
        "audit-trails",
        "exports",
      ],
    },
    apis: {
      serviceName: "marketing-mix-modeler-source-adapters",
      deploymentTarget: "cloud_run",
    },
  },
  validation: {
    smokePrompt: "Run the Marketing Mix Modeler workflow and cite source-system evidence for every claim.",
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

export const MarketingMixModeler = () => (
  <UseCaseSlide
    title="Marketing Mix Modeler"
    subtitle="A-3405 • Marketing Analytics & Attribution"
    icon={PieChart}
    domainId="domain-34"
    layer="Layer 4: Data Agent"
    persona="CMO"
    systems={["BigQuery", "Google Ads", "Meta Ads", "Salesforce CRM", "Looker", "Vertex AI"]}
    kpis={[
      { label: "MMM execution", before: "External agency quarterly", after: "In-house automated" },
      { label: "Budget optimization", before: "Gut-feel allocation", after: "Data-driven ROI curves" },
      { label: "Cross-channel synergy", before: "Not measured", after: "Quantified" },
    ]}
    triggerType="scheduled"
    swimlane={swimlane}
    flow={flow}
    architecture={architecture}
    hitl={{ actor: "CMO", action: "Review budget recommendations", description: "CMO reviews marketing mix model results, evaluates budget reallocation scenarios, and approves strategy changes before implementation." }}
    statusQuo={[
      "Marketing mix modeling outsourced to agencies — expensive and delivered quarterly with lag.",
      "Budget allocation based on historical precedent and gut feel rather than response curves.",
      "Cross-channel synergies not measured — missing opportunities to optimize channel combinations."
    ]}
    agentification={[
      "Gemini translates complex MMM output into actionable strategy with specific budget recommendations.",
      "In-house quarterly MMM with Bayesian regression, saturation detection, and scenario modeling.",
      "Cross-channel synergy quantified — identifying which channel combinations amplify results."
    ]}
  />
);
