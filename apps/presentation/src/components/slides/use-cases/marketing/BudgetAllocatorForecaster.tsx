import React from "react";
import { UseCaseSlide } from "../../../agent/UseCaseSlide";
import { FlowStep } from "../../../agent/ProcessFlow";
import { SwimlaneFlow } from "../../../agent/SwimlaneFlow";
import { AgentArchitecture, UseCaseGenerationSpec, AgentBehaviorContract} from "../../../../types/architecture";
import { DollarSign, Database, TrendingUp, AlertTriangle, CheckCircle } from "lucide-react";

const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "s1", label: "Monthly Cycle", lane: "system", type: "trigger" },
    { id: "a1", label: "Spend Actuals Ingest", lane: "agent", type: "action" },
    { id: "a2", label: "ROI Forecasting", lane: "agent", type: "action" },
    { id: "a3", label: "Reallocation Recs", lane: "agent", type: "output" },
    { id: "h1", label: "VP Marketing Review", lane: "human", type: "hitl" },
  ],
  connections: [["s1", "a1"], ["a1", "a2"], ["a2", "a3"], ["a3", "h1"]],
};

const flow: FlowStep[] = [
  { label: "Spend Aggregation", icon: Database, description: "Actuals pulled from ad platforms and MAP, aggregated as budget vs. actual by channel.", trigger: "Monthly", systems: ["Google Ads", "Meta Ads", "HubSpot"] },
  { label: "ROI Forecasting", icon: TrendingUp, description: "Marketing mix modeling with Monte Carlo simulation on budget scenarios and diminishing returns.", systems: ["BigQuery", "Anaplan"], integration: "BigQuery ML" },
  { label: "Variance Analysis", icon: AlertTriangle, description: "Gemini interprets why channels underperform by reading campaign notes, creative logs, and market context.", systems: ["Vertex AI"] },
  { label: "VP Approval", icon: CheckCircle, description: "VP Marketing reviews reallocation recommendations with business rationale before budget shifts.", output: "Budget Reallocation" },
];

const architecture: AgentArchitecture = {
  connections: [
    { system: "Google Ads", description: "Campaign spend actuals, CPC trends, conversion data", direction: "read", protocol: "REST API", category: "erp" },
    { system: "Meta Ads Manager", description: "Social ad spend, audience performance, creative metrics", direction: "read", protocol: "REST API", category: "erp" },
    { system: "HubSpot", description: "MAP spend tracking, email campaign costs, lead source data", direction: "read", protocol: "REST API", category: "erp" },
    { system: "Anaplan", description: "Financial planning models, budget templates, scenario inputs", direction: "bidirectional", protocol: "REST API", category: "analytics" },
    { system: "BigQuery", description: "Unified spend cube, marketing mix models, scenario simulations", direction: "bidirectional", protocol: "BigQuery SQL", category: "analytics" },
    { system: "Looker", description: "Budget vs. actual dashboards, channel ROI visualizations", direction: "write", protocol: "REST API", category: "analytics" },
  ],
  pipeline: [
    { label: "Spend Aggregation", description: "Pull spend actuals from Google Ads, Meta Ads, LinkedIn Ads, and HubSpot. Aggregate budget vs. actual by channel and campaign in BigQuery.", systems: ["Google Ads", "Meta Ads Manager", "HubSpot", "BigQuery"], layer: "integration", dataIn: "Raw spend data across ad platforms and MAP", dataOut: "Unified spend cube by channel x campaign x period" },
    { label: "ROI Forecasting & Simulation", description: "Run marketing mix modeling with diminishing returns curve fitting per channel. Monte Carlo simulation on budget reallocation scenarios to estimate impact on pipeline.", systems: ["BigQuery ML", "Anaplan"], layer: "ml", dataIn: "Historical spend and pipeline data", dataOut: "Channel ROI forecasts with confidence intervals" },
    { label: "Variance Interpretation", description: "Gemini reads campaign notes, creative change logs, and competitive context to explain why channels underperform forecasts. Generates budget reallocation recommendations with business rationale.", systems: ["Vertex AI (Gemini)"], layer: "llm", dataIn: "Variance data + campaign context + market signals", dataOut: "Reallocation recommendations with explanations" },
    { label: "Dashboard & Delivery", description: "Budget performance dashboards updated in Looker. Variance alerts and reallocation proposals sent to VP Marketing for approval.", systems: ["Looker", "Email"], layer: "integration", dataIn: "Forecast outputs + recommendations", dataOut: "Interactive dashboards + variance alerts" },
  ],
};


const behaviorContract: AgentBehaviorContract = {
  role: "VP Marketing agent for the Budget Allocator & Forecaster workflow",
  primaryObjective: "Gemini interprets why channels underperform by reading campaign notes, creative change logs, and market context beyond the numbers. Marketing mix modeling with Monte Carlo simulation enables scenario-based budget optimization with confidence intervals. so the VP Marketing can move the Budget cycle time KPI.",
  inScope: [
    "Gemini interprets why channels underperform by reading campaign notes, creative change logs, and market context beyond the numbers",
    "Marketing mix modeling with Monte Carlo simulation enables scenario-based budget optimization with confidence intervals",
    "Generates reallocation recommendations with business rationale, enabling monthly rather than quarterly budget adjustments",
  ],
  outOfScope: [
    "Final approval of paid spend reallocations above the governance threshold",
    "Trademark, legal, or regulated-industry claim approval",
    "Crisis communications without comms-team sign-off",
  ],
  toolIntents: [
    {
      name: "query_anaplan_budget_lines",
      kind: "query",
      sourceSystemId: "anaplan",
      description: "Retrieve budget lines from Anaplan for the Budget Allocator & Forecaster workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "budget_lines_records",
        "budget_lines_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_hubspot_contacts",
      kind: "query",
      sourceSystemId: "hubspot",
      description: "Retrieve contacts from HubSpot for the Budget Allocator & Forecaster workflow.",
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
      name: "query_google_ads_campaigns",
      kind: "query",
      sourceSystemId: "google_ads",
      description: "Retrieve campaigns from Google Ads for the Budget Allocator & Forecaster workflow.",
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
      name: "query_bigquery_analytics_events",
      kind: "query",
      sourceSystemId: "bigquery",
      description: "Retrieve analytics events from BigQuery for the Budget Allocator & Forecaster workflow.",
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
      name: "lookup_budget_allocator_forecaster_playbook",
      kind: "evidence_lookup",
      sourceSystemId: "google_ads",
      description: "Look up sections of the Budget Allocator & Forecaster Playbook to cite in narrative output, escalation rationale, and audit evidence.",
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
      name: "action_anaplan_recommend",
      kind: "action",
      sourceSystemId: "anaplan",
      description: "Execute the recommend step in Anaplan after the agent has gathered evidence and validated escalation gates.",
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
      claim: "Budget cycle time moved from 2 weeks toward 2 days",
      mustCite: [
        "anaplan.budget_lines",
        "hubspot.contacts",
      ],
      sourceSystemIds: [
        "anaplan",
        "hubspot",
      ],
    },
    {
      claim: "Forecast accuracy moved from \\u00b125% toward \\u00b18%",
      mustCite: [
        "anaplan.budget_lines",
        "hubspot.contacts",
      ],
      sourceSystemIds: [
        "anaplan",
        "hubspot",
      ],
    },
  ],
  escalationRules: [
    {
      trigger: "Budget cycle time regresses past the 2 weeks baseline by more than 20%",
      action: "escalate_to_human",
      handoffTarget: "VP Marketing",
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
    "Never fabricate metric values; only publish numbers derived from Anaplan (and other named systems) entities.",
    "Never bypass VP Marketing approval on escalation triggers, even when confidence is high.",
    "Never expose individual personal data (PII) in summaries; aggregate or pseudonymise before output.",
    "Never act on data older than the staleness threshold defined in the runbook without a fresh re-query.",
  ],
  goldenEvals: [
    {
      id: "budget-allocator-forecaster-end-to-end",
      prompt: "Run the Budget Allocator & Forecaster workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.",
      expectedToolCalls: [
        "query_anaplan_budget_lines",
        "query_hubspot_contacts",
        "query_google_ads_campaigns",
        "query_bigquery_analytics_events",
        "lookup_budget_allocator_forecaster_playbook",
        "action_anaplan_recommend",
      ],
      mustReferenceEntities: [
        "budget_lines",
        "contacts",
        "campaigns",
        "analytics_events",
        "dashboards",
      ],
      mustCiteDocuments: [
        "budget-allocator-forecaster-playbook",
      ],
      expectedActionOutcome: "Action recommend executed against Anaplan, with audit-trail entry and VP Marketing notified of outcomes.",
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
    rationale: "Row counts sized for Budget Allocator & Forecaster so the agent can demonstrate the workflow against realistic transactional volume without simulating a production warehouse.",
  },
  sourceSystems: [
    {
      id: "anaplan",
      name: "Anaplan",
      owns: [
        "budget_lines",
        "forecast_versions",
        "variance_records",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_anaplan_budget_lines",
        "query_anaplan_forecast_versions",
        "query_anaplan_variance_records",
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
      name: "budget_lines",
      sourceSystemId: "anaplan",
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
          name: "cost_center",
          type: "lorem.words",
          required: true,
        },
        {
          name: "period",
          type: "enum",
          values: [
            "month",
            "quarter",
            "year",
          ],
          required: true,
        },
        {
          name: "budget_amount",
          type: "number",
          min: 10000,
          max: 5000000,
          required: true,
        },
        {
          name: "actual_amount",
          type: "number",
          min: 0,
          max: 6000000,
          required: true,
        },
        {
          name: "variance_pct",
          type: "float",
          min: -100,
          max: 100,
          decimals: 2,
          required: true,
        },
        {
          name: "scenario",
          type: "enum",
          values: [
            "baseline",
            "stretch",
            "downside",
          ],
          required: true,
        },
      ],
    },
    {
      name: "forecast_versions",
      sourceSystemId: "anaplan",
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
          name: "cost_center",
          type: "lorem.words",
          required: true,
        },
        {
          name: "period",
          type: "enum",
          values: [
            "month",
            "quarter",
            "year",
          ],
          required: true,
        },
        {
          name: "budget_amount",
          type: "number",
          min: 10000,
          max: 5000000,
          required: true,
        },
        {
          name: "actual_amount",
          type: "number",
          min: 0,
          max: 6000000,
          required: true,
        },
        {
          name: "variance_pct",
          type: "float",
          min: -100,
          max: 100,
          decimals: 2,
          required: true,
        },
        {
          name: "scenario",
          type: "enum",
          values: [
            "baseline",
            "stretch",
            "downside",
          ],
          required: true,
        },
      ],
    },
    {
      name: "variance_records",
      sourceSystemId: "anaplan",
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
      id: "budget-allocator-forecaster-playbook",
      sourceSystemId: "google_ads",
      type: "playbook",
      title: "Budget Allocator & Forecaster Playbook",
      requiredSections: [
        "Audience guidelines",
        "Brand voice rules",
        "Channel-specific guardrails",
        "Measurement framework",
        "Approval thresholds",
      ],
      linkedEntities: [
        "budget_lines",
        "forecast_versions",
        "variance_records",
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
      id: "anaplan_recommend_api",
      sourceSystemId: "anaplan",
      method: "POST",
      path: "/api/anaplan/recommend",
      description: "Synchronous endpoint the agent calls to recommend in Anaplan after evidence gating.",
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
      id: "budget-allocator-forecaster-baseline-gap",
      description: "Seed a realistic gap where Budget cycle time sits between 2 weeks and 2 days, so the agent can detect, narrate, and recommend remediation.",
      affectedEntities: [
        "budget_lines",
        "forecast_versions",
      ],
      discoveryPath: [
        "Inspect Anaplan records for the affected entities",
        "Compare against HubSpot historical baseline",
        "Generate a citation-backed recommendation",
      ],
      expectedEvidence: [
        "source-system record",
        "historical baseline metric",
        "generated audit trail",
      ],
      expectedRecommendation: "Explain the gap, cite supporting evidence, and propose the next VP Marketing action.",
    },
  ],
  datastorePackaging: {
    alloydb: {
      database: "budget_allocator_forecaster",
      schemas: [
        "anaplan",
        "hubspot",
      ],
    },
    bigquery: {
      dataset: "marketing_budget_allocator_forecaster",
      tables: [
        "kpi_summary",
        "evidence_index",
      ],
    },
    cloudStorage: {
      bucketSuffix: "budget-allocator-forecaster-evidence",
      prefixes: [
        "documents",
        "audit-trails",
        "exports",
      ],
    },
    apis: {
      serviceName: "budget-allocator-forecaster-source-adapters",
      deploymentTarget: "cloud_run",
    },
  },
  validation: {
    smokePrompt: "Run the Budget Allocator & Forecaster workflow and cite source-system evidence for every claim.",
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

export const BudgetAllocatorForecaster = () => (
  <UseCaseSlide
    title="Budget Allocator & Forecaster"
    subtitle="A-2902 \u2022 Marketing Strategy"
    icon={DollarSign}
    domainId="domain-29"
    layer="Layer 4: Data Agent"
    persona="VP Marketing"
    systems={["Anaplan", "HubSpot", "Google Ads", "BigQuery", "Looker"]}
    kpis={[
      { label: "Budget cycle time", before: "2 weeks", after: "2 days" },
      { label: "Forecast accuracy", before: "\u00b125%", after: "\u00b18%" },
      { label: "Reallocation frequency", before: "Quarterly", after: "Monthly" },
    ]}
    triggerType="scheduled"
    swimlane={swimlane}
    flow={flow}
    architecture={architecture}
    hitl={{ actor: "VP Marketing", action: "Approve budget allocation", description: "VP Marketing reviews reallocation recommendations, variance explanations, and budget shift rationale before execution." }}
    statusQuo={[
      "Budget allocation based on prior year spend with minor adjustments, not data-driven optimization.",
      "Variance analysis requires manual pull from 5+ ad platforms and spreadsheet reconciliation.",
      "Channel underperformance diagnosed weeks after the fact with limited root cause visibility."
    ]}
    agentification={[
      "Gemini interprets why channels underperform by reading campaign notes, creative change logs, and market context beyond the numbers.",
      "Marketing mix modeling with Monte Carlo simulation enables scenario-based budget optimization with confidence intervals.",
      "Generates reallocation recommendations with business rationale, enabling monthly rather than quarterly budget adjustments."
    ]}
  />
);
