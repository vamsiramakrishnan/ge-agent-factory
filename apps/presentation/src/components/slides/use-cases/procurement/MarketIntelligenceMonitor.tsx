import React from "react";
import { UseCaseSlide } from "../../../agent/UseCaseSlide";
import { FlowStep } from "../../../agent/ProcessFlow";
import { SwimlaneFlow } from "../../../agent/SwimlaneFlow";
import { AgentArchitecture, UseCaseGenerationSpec, AgentBehaviorContract} from "../../../../types/architecture";
import { Radar, Rss, TrendingUp, Brain, Bell } from "lucide-react";

const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "s1", label: "Feed Polling", lane: "system", type: "trigger" },
    { id: "a1", label: "Signal Ingestion", lane: "agent", type: "action" },
    { id: "a2", label: "Impact Analysis", lane: "agent", type: "action" },
    { id: "a3", label: "Intel Brief", lane: "agent", type: "output" },
    { id: "s2", label: "Alert Distribution", lane: "system", type: "output" },
  ],
  connections: [["s1", "a1"], ["a1", "a2"], ["a2", "a3"], ["a3", "s2"]],
};

const flow: FlowStep[] = [
  { label: "Feed Ingestion", icon: Rss, description: "Commodity indices, news APIs, and credit signals polled continuously from multiple providers.", trigger: "Continuous", systems: ["S&P Platts", "ICIS", "Mintec"] },
  { label: "Price Tracking", icon: TrendingUp, description: "Commodity time-series analysis with volatility calculation and threshold breach detection.", systems: ["BigQuery"], integration: "API" },
  { label: "LLM Synthesis", icon: Brain, description: "Gemini connects tariff changes to affected suppliers across sub-tier geography, even when articles never mention your company.", systems: ["Vertex AI", "Google News API"] },
  { label: "Alert Delivery", icon: Bell, description: "Actionable intelligence briefs pushed to category managers with recommended procurement actions.", output: "Market Intel Brief" },
];

const architecture: AgentArchitecture = {
  connections: [
    { system: "S&P Global Platts", description: "Commodity price indices for metals, energy, petrochemicals", direction: "read", protocol: "REST API", category: "market-data" },
    { system: "ICIS", description: "Chemical and energy commodity pricing and market reports", direction: "read", protocol: "REST API", category: "market-data" },
    { system: "Mintec", description: "Food and agricultural commodity price data and analytics", direction: "read", protocol: "REST API", category: "market-data" },
    { system: "Google News API", description: "Real-time news articles on tariffs, disruptions, and market events", direction: "read", protocol: "REST API", category: "market-data" },
    { system: "Dun & Bradstreet", description: "Supplier credit alerts and financial signal monitoring", direction: "read", protocol: "REST API", category: "market-data" },
    { system: "BigQuery", description: "Time-series storage for commodity prices, trend analytics, alert history", direction: "bidirectional", protocol: "BigQuery SQL", category: "analytics" },
  ],
  pipeline: [
    { label: "Feed Ingestion & Storage", description: "Poll commodity price feeds from Platts, ICIS, and Mintec. Ingest news via Google News API. Aggregate D&B credit alerts. Store all signals in BigQuery time-series tables.", systems: ["S&P Global Platts", "ICIS", "Mintec", "Dun & Bradstreet"], layer: "integration", dataIn: "Raw commodity feeds, news articles, credit signals", dataOut: "Normalized signals stored in BigQuery" },
    { label: "Price Tracking & Threshold Detection", description: "Commodity price time-series analysis with volatility calculation. Threshold breach detection triggers alert pipeline. Trend extrapolation identifies emerging price movements.", systems: ["BigQuery ML"], layer: "ml", dataIn: "Historical and current commodity prices", dataOut: "Volatility metrics, threshold breaches, trend forecasts" },
    { label: "Intelligence Synthesis", description: "Gemini reads news articles about tariff changes, geopolitical events, and supply disruptions. Reasons about which suppliers and categories are affected even when articles never mention your company. Synthesizes commodity data, news, and supplier geography into actionable briefs.", systems: ["Vertex AI (Gemini)", "Google News API"], layer: "llm", dataIn: "Threshold breaches + news articles + supplier geography", dataOut: "Actionable market intelligence briefs with recommended actions" },
  ],
};


const behaviorContract: AgentBehaviorContract = {
  role: "Category Manager agent for the Market Intelligence Monitor workflow",
  primaryObjective: "Gemini reads a Financial Times article on rare earth tariffs and reasons that 3 of your electronics suppliers source sub-components from affected regions. LLM synthesizes commodity data, news, and supplier geography into briefs: 'Steel up 8% MoM from EU CBAM — accelerate Q3 structural components sourcing.' so the Category Manager can move the Market signal latency KPI.",
  inScope: [
    "Gemini reads a Financial Times article on rare earth tariffs and reasons that 3 of your electronics suppliers source sub-components from affected regions",
    "LLM synthesizes commodity data, news, and supplier geography into briefs: 'Steel up 8% MoM from EU CBAM — accelerate Q3 structural components sourcing.'",
    "Continuous monitoring replaces periodic manual research, giving category teams hours of lead time instead of days of lag",
  ],
  outOfScope: [
    "Contract execution without legal review",
    "Supplier disqualification decisions (category lead retains authority)",
    "Single-source justification overrides above policy threshold",
  ],
  toolIntents: [
    {
      name: "query_s_p_global_platts_s_p_global_platts_records",
      kind: "query",
      sourceSystemId: "s_p_global_platts",
      description: "Retrieve s p global platts records from S&P Global Platts for the Market Intelligence Monitor workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "s_p_global_platts_records_records",
        "s_p_global_platts_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_icis_icis_records",
      kind: "query",
      sourceSystemId: "icis",
      description: "Retrieve icis records from ICIS for the Market Intelligence Monitor workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "icis_records_records",
        "icis_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_mintec_mintec_records",
      kind: "query",
      sourceSystemId: "mintec",
      description: "Retrieve mintec records from Mintec for the Market Intelligence Monitor workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "mintec_records_records",
        "mintec_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_google_news_api_google_news_api_records",
      kind: "query",
      sourceSystemId: "google_news_api",
      description: "Retrieve google news api records from Google News API for the Market Intelligence Monitor workflow.",
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
      name: "lookup_market_intelligence_monitor_policy_guide",
      kind: "evidence_lookup",
      sourceSystemId: "bigquery",
      description: "Look up sections of the Market Intelligence Monitor Procurement Policy Guide to cite in narrative output, escalation rationale, and audit evidence.",
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
      claim: "Market signal latency moved from Days to weeks toward <4 hours",
      mustCite: [
        "s_p_global_platts.s_p_global_platts_records",
        "icis.icis_records",
      ],
      sourceSystemIds: [
        "s_p_global_platts",
        "icis",
      ],
    },
    {
      claim: "Sources monitored moved from 2-3 manual toward 40+ automated",
      mustCite: [
        "s_p_global_platts.s_p_global_platts_records",
        "icis.icis_records",
      ],
      sourceSystemIds: [
        "s_p_global_platts",
        "icis",
      ],
    },
  ],
  escalationRules: [
    {
      trigger: "Market signal latency regresses past the Days to weeks baseline by more than 20%",
      action: "escalate_to_human",
      handoffTarget: "Category Manager",
      rationale: "Significant regressions need human judgment before automated remediation runs against production records.",
    },
    {
      trigger: "Source-system evidence is incomplete or stale (>24h) for any required entity",
      action: "request_more_info",
      rationale: "Recommendations grounded in stale evidence misrepresent current state and undermine audit defensibility.",
    },
  ],
  refusalRules: [
    "Never fabricate metric values; only publish numbers derived from S&P Global Platts (and other named systems) entities.",
    "Never bypass Category Manager approval on escalation triggers, even when confidence is high.",
    "Never expose individual personal data (PII) in summaries; aggregate or pseudonymise before output.",
    "Never act on data older than the staleness threshold defined in the runbook without a fresh re-query.",
  ],
  goldenEvals: [
    {
      id: "market-intelligence-monitor-end-to-end",
      prompt: "Run the Market Intelligence Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.",
      expectedToolCalls: [
        "query_s_p_global_platts_s_p_global_platts_records",
        "query_icis_icis_records",
        "query_mintec_mintec_records",
        "query_google_news_api_google_news_api_records",
        "lookup_market_intelligence_monitor_policy_guide",
      ],
      mustReferenceEntities: [
        "s_p_global_platts_records",
        "icis_records",
        "mintec_records",
        "google_news_api_records",
        "dun_bradstreet_records",
        "analytics_events",
      ],
      mustCiteDocuments: [
        "market-intelligence-monitor-policy-guide",
      ],
      expectedActionOutcome: "Category Manager receives a fully-cited recommendation; no external state change without explicit approval.",
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
    rationale: "Row counts sized for Market Intelligence Monitor so the agent can demonstrate the workflow against realistic transactional volume without simulating a production warehouse.",
  },
  sourceSystems: [
    {
      id: "s_p_global_platts",
      name: "S&P Global Platts",
      owns: [
        "s_p_global_platts_records",
        "s_p_global_platts_events",
        "s_p_global_platts_audit_trail",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_s_p_global_platts_s_p_global_platts_records",
        "query_s_p_global_platts_s_p_global_platts_events",
        "query_s_p_global_platts_s_p_global_platts_audit_trail",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
    {
      id: "icis",
      name: "ICIS",
      owns: [
        "icis_records",
        "icis_events",
        "icis_audit_trail",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_icis_icis_records",
        "query_icis_icis_events",
        "query_icis_icis_audit_trail",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
    {
      id: "mintec",
      name: "Mintec",
      owns: [
        "mintec_records",
        "mintec_events",
        "mintec_audit_trail",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_mintec_mintec_records",
        "query_mintec_mintec_events",
        "query_mintec_mintec_audit_trail",
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
      id: "dun_bradstreet",
      name: "Dun & Bradstreet",
      owns: [
        "dun_bradstreet_records",
        "dun_bradstreet_events",
        "dun_bradstreet_audit_trail",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_dun_bradstreet_dun_bradstreet_records",
        "query_dun_bradstreet_dun_bradstreet_events",
        "query_dun_bradstreet_dun_bradstreet_audit_trail",
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
      name: "s_p_global_platts_records",
      sourceSystemId: "s_p_global_platts",
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
      name: "s_p_global_platts_events",
      sourceSystemId: "s_p_global_platts",
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
          name: "s_p_global_platts_record_id",
          type: "ref",
          ref: "s_p_global_platts_records.id",
          required: true,
        },
      ],
    },
    {
      name: "s_p_global_platts_audit_trail",
      sourceSystemId: "s_p_global_platts",
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
      name: "icis_records",
      sourceSystemId: "icis",
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
      name: "icis_events",
      sourceSystemId: "icis",
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
          name: "icis_record_id",
          type: "ref",
          ref: "icis_records.id",
          required: true,
        },
      ],
    },
    {
      name: "icis_audit_trail",
      sourceSystemId: "icis",
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
      name: "mintec_records",
      sourceSystemId: "mintec",
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
      name: "mintec_events",
      sourceSystemId: "mintec",
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
          name: "mintec_record_id",
          type: "ref",
          ref: "mintec_records.id",
          required: true,
        },
      ],
    },
    {
      name: "mintec_audit_trail",
      sourceSystemId: "mintec",
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
      name: "dun_bradstreet_records",
      sourceSystemId: "dun_bradstreet",
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
      name: "dun_bradstreet_events",
      sourceSystemId: "dun_bradstreet",
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
          name: "dun_bradstreet_record_id",
          type: "ref",
          ref: "dun_bradstreet_records.id",
          required: true,
        },
      ],
    },
    {
      name: "dun_bradstreet_audit_trail",
      sourceSystemId: "dun_bradstreet",
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
      from: "s_p_global_platts_events.s_p_global_platts_record_id",
      to: "s_p_global_platts_records.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
    {
      from: "icis_events.icis_record_id",
      to: "icis_records.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
    {
      from: "mintec_events.mintec_record_id",
      to: "mintec_records.id",
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
      from: "dun_bradstreet_events.dun_bradstreet_record_id",
      to: "dun_bradstreet_records.id",
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
      id: "market-intelligence-monitor-policy-guide",
      sourceSystemId: "bigquery",
      type: "policy",
      title: "Market Intelligence Monitor Procurement Policy Guide",
      requiredSections: [
        "Sourcing principles",
        "Approval thresholds",
        "Supplier risk requirements",
        "Contract and compliance gates",
        "Exception handling",
      ],
      linkedEntities: [
        "s_p_global_platts_records",
        "s_p_global_platts_events",
        "s_p_global_platts_audit_trail",
      ],
      minimumWordCount: 500,
      citationAnchors: [
        "sourcing",
        "approvals",
        "supplier-risk",
        "exceptions",
      ],
    },
  ],
  apis: [],
  anomalies: [
    {
      id: "market-intelligence-monitor-baseline-gap",
      description: "Seed a realistic gap where Market signal latency sits between Days to weeks and <4 hours, so the agent can detect, narrate, and recommend remediation.",
      affectedEntities: [
        "s_p_global_platts_records",
        "s_p_global_platts_events",
      ],
      discoveryPath: [
        "Inspect S&P Global Platts records for the affected entities",
        "Compare against ICIS historical baseline",
        "Generate a citation-backed recommendation",
      ],
      expectedEvidence: [
        "source-system record",
        "historical baseline metric",
        "generated audit trail",
      ],
      expectedRecommendation: "Explain the gap, cite supporting evidence, and propose the next Category Manager action.",
    },
  ],
  datastorePackaging: {
    alloydb: {
      database: "market_intelligence_monitor",
      schemas: [
        "s_p_global_platts",
        "icis",
        "mintec",
        "google_news_api",
        "dun_bradstreet",
      ],
    },
    bigquery: {
      dataset: "procurement_market_intelligence_monitor",
      tables: [
        "kpi_summary",
        "evidence_index",
      ],
    },
    cloudStorage: {
      bucketSuffix: "market-intelligence-monitor-evidence",
      prefixes: [
        "documents",
        "audit-trails",
        "exports",
      ],
    },
    apis: {
      serviceName: "market-intelligence-monitor-source-adapters",
      deploymentTarget: "cloud_run",
    },
  },
  validation: {
    smokePrompt: "Run the Market Intelligence Monitor workflow and cite source-system evidence for every claim.",
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

export const MarketIntelligenceMonitor = () => (
  <UseCaseSlide
    title="Market Intelligence Monitor"
    subtitle="A-1202 • Strategic Sourcing"
    icon={Radar}
    domainId="domain-12"
    layer="Layer 3: Custom ADK"
    persona="Category Manager"
    systems={["S&P Global Platts", "ICIS", "Mintec", "Google News API", "Dun & Bradstreet", "BigQuery"]}
    kpis={[
      { label: "Market signal latency", before: "Days to weeks", after: "<4 hours" },
      { label: "Sources monitored", before: "2-3 manual", after: "40+ automated" },
      { label: "Actionable alerts/month", before: "Ad hoc", after: "12-15 validated" },
    ]}
    triggerType="scheduled"
    swimlane={swimlane}
    flow={flow}
    architecture={architecture}
    statusQuo={[
      "Market intelligence comes from ad-hoc broker calls and analyst reports that are weeks old by the time category teams review them.",
      "Tariff changes and geopolitical events are noticed reactively — after supplier price increases arrive, not before.",
      "No systematic connection between commodity movements and specific supplier or category exposure."
    ]}
    agentification={[
      "Gemini reads a Financial Times article on rare earth tariffs and reasons that 3 of your electronics suppliers source sub-components from affected regions.",
      "LLM synthesizes commodity data, news, and supplier geography into briefs: 'Steel up 8% MoM from EU CBAM — accelerate Q3 structural components sourcing.'",
      "Continuous monitoring replaces periodic manual research, giving category teams hours of lead time instead of days of lag."
    ]}
  />
);
