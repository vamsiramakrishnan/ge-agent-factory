import React from "react";
import { UseCaseSlide } from "../../../agent/UseCaseSlide";
import { FlowStep } from "../../../agent/ProcessFlow";
import { SwimlaneFlow } from "../../../agent/SwimlaneFlow";
import { AgentArchitecture, UseCaseGenerationSpec, AgentBehaviorContract} from "../../../../types/architecture";
import { Globe, Download, BarChart, Eye, Target } from "lucide-react";

const flow: FlowStep[] = [
  { label: "Data Aggregation", icon: Download, description: "Survey data from multiple providers normalized.", trigger: "Continuous", systems: ["Mercer", "Radford"] },
  { label: "Positioning Analysis", icon: BarChart, description: "Percentile positioning by role, level, geo.", systems: ["Gemini", "BigQuery"], integration: "Data Agent" },
  { label: "Gap Detection", icon: Eye, description: "Below-market roles and flight risks identified." },
  { label: "Recommendations", icon: Target, description: "Targeted adjustment recommendations with cost impact.", output: "Benchmark Report" },
];

const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "trigger", label: "Survey Data", lane: "system", type: "trigger" },
    { id: "position", label: "Positioning Analysis", lane: "agent", type: "action" },
    { id: "gap", label: "Gap Detection", lane: "agent", type: "action" },
    { id: "output", label: "Benchmark Report", lane: "agent", type: "output" },
  ],
  connections: [["trigger", "position"], ["position", "gap"], ["gap", "output"]],
};

const architecture: AgentArchitecture = {
  connections: [
    { system: "Mercer", description: "Total remuneration survey data, job matching, market percentiles", direction: "read", protocol: "REST API", category: "market-data" },
    { system: "Radford", description: "Technology sector compensation benchmarks, equity data", direction: "read", protocol: "REST API", category: "market-data" },
    { system: "Payscale", description: "Real-time market pricing, pay practices survey data", direction: "read", protocol: "REST API", category: "market-data" },
    { system: "Workday", description: "Employee compensation records, job profiles, grade structures", direction: "read", protocol: "REST API", category: "erp" },
    { system: "BigQuery", description: "Normalized benchmark data warehouse, trend analytics", direction: "bidirectional", protocol: "BigQuery SQL", category: "analytics" },
    { system: "Vertex AI (Gemini)", description: "Peer group reasoning, gap analysis narrative generation", direction: "bidirectional", protocol: "gRPC", category: "ai" },
  ],
  pipeline: [
    { label: "Survey Data Aggregation", description: "Ingest and normalize compensation survey data from Mercer, Radford, and Payscale. Harmonize job matching taxonomies and percentile scales across providers.", systems: ["Mercer", "Radford", "Payscale"], layer: "integration", dataIn: "Raw survey extracts with disparate job codes", dataOut: "Unified benchmark dataset by role × level × geography" },
    { label: "Competitive Positioning Analysis", description: "Map internal Workday compensation data against unified benchmarks. Calculate percentile positioning by role family, level, and geography with statistical confidence intervals.", systems: ["Workday", "BigQuery"], layer: "ml", dataIn: "Internal comp data + unified benchmarks", dataOut: "Percentile positioning heatmap with gap scores" },
    { label: "Gap Detection & Recommendations", description: "Gemini reasons about below-market roles, flight-risk populations, and cost-of-adjustment scenarios. Generates targeted recommendations with budget impact projections.", systems: ["Vertex AI (Gemini)", "BigQuery"], layer: "llm", dataIn: "Positioning gaps + employee tenure/performance data", dataOut: "Prioritized adjustment recommendations with cost impact" },
    { label: "Report Distribution", description: "Benchmark reports formatted for Comp Manager review with interactive drill-downs by org unit and peer group comparison.", systems: ["Looker", "Google Sheets"], layer: "integration", dataIn: "Analyzed benchmark results", dataOut: "Interactive benchmark report" },
  ],
};


const behaviorContract: AgentBehaviorContract = {
  role: "Comp Manager agent for the Market Benchmarking Analysis Agent workflow",
  primaryObjective: "Continuous market data aggregation across multiple compensation sources. Real-time competitive positioning dashboards by role family and geography. so the Comp Manager can move the Data sources KPI.",
  inScope: [
    "Continuous market data aggregation across multiple compensation sources",
    "Real-time competitive positioning dashboards by role family and geography",
    "Automated peer group analysis adapting to evolving talent market dynamics",
  ],
  outOfScope: [
    "Final hiring, termination, or compensation decisions (HRBP/leadership retains authority)",
    "Performance management adjudication and disciplinary action",
    "Legal interpretation of employment law in ambiguous jurisdictions",
  ],
  toolIntents: [
    {
      name: "query_mercer_mercer_records",
      kind: "query",
      sourceSystemId: "mercer",
      description: "Retrieve mercer records from Mercer for the Market Benchmarking Analysis Agent workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "mercer_records_records",
        "mercer_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_radford_radford_records",
      kind: "query",
      sourceSystemId: "radford",
      description: "Retrieve radford records from Radford for the Market Benchmarking Analysis Agent workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "radford_records_records",
        "radford_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_payscale_payscale_records",
      kind: "query",
      sourceSystemId: "payscale",
      description: "Retrieve payscale records from Payscale for the Market Benchmarking Analysis Agent workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "payscale_records_records",
        "payscale_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_google_bigquery_analytics_events",
      kind: "query",
      sourceSystemId: "google_bigquery",
      description: "Retrieve analytics events from Google BigQuery for the Market Benchmarking Analysis Agent workflow.",
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
      name: "lookup_market_benchmarking_analysis_agent_policy_handbook",
      kind: "evidence_lookup",
      sourceSystemId: "google_bigquery",
      description: "Look up sections of the Market Benchmarking Analysis Agent Policy Handbook to cite in narrative output, escalation rationale, and audit evidence.",
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
      claim: "Data sources moved from 2-3 surveys toward 10+ continuous",
      mustCite: [
        "mercer.mercer_records",
        "radford.radford_records",
      ],
      sourceSystemIds: [
        "mercer",
        "radford",
      ],
    },
    {
      claim: "Refresh rate moved from Annual toward Monthly",
      mustCite: [
        "mercer.mercer_records",
        "radford.radford_records",
      ],
      sourceSystemIds: [
        "mercer",
        "radford",
      ],
    },
  ],
  escalationRules: [
    {
      trigger: "Data sources regresses past the 2-3 surveys baseline by more than 20%",
      action: "escalate_to_human",
      handoffTarget: "Comp Manager",
      rationale: "Significant regressions need human judgment before automated remediation runs against production records.",
    },
    {
      trigger: "Source-system evidence is incomplete or stale (>24h) for any required entity",
      action: "request_more_info",
      rationale: "Recommendations grounded in stale evidence misrepresent current state and undermine audit defensibility.",
    },
  ],
  refusalRules: [
    "Never fabricate metric values; only publish numbers derived from Mercer (and other named systems) entities.",
    "Never bypass Comp Manager approval on escalation triggers, even when confidence is high.",
    "Never expose individual personal data (PII) in summaries; aggregate or pseudonymise before output.",
    "Never act on data older than the staleness threshold defined in the runbook without a fresh re-query.",
  ],
  goldenEvals: [
    {
      id: "market-benchmarking-analysis-agent-end-to-end",
      prompt: "Run the Market Benchmarking Analysis Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.",
      expectedToolCalls: [
        "query_mercer_mercer_records",
        "query_radford_radford_records",
        "query_payscale_payscale_records",
        "query_google_bigquery_analytics_events",
        "lookup_market_benchmarking_analysis_agent_policy_handbook",
      ],
      mustReferenceEntities: [
        "mercer_records",
        "radford_records",
        "payscale_records",
        "analytics_events",
      ],
      mustCiteDocuments: [
        "market-benchmarking-analysis-agent-policy-handbook",
      ],
      expectedActionOutcome: "Comp Manager receives a fully-cited recommendation; no external state change without explicit approval.",
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
    rationale: "Row counts sized for Market Benchmarking Analysis Agent so the agent can demonstrate the workflow against realistic transactional volume without simulating a production warehouse.",
  },
  sourceSystems: [
    {
      id: "mercer",
      name: "Mercer",
      owns: [
        "mercer_records",
        "mercer_events",
        "mercer_audit_trail",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_mercer_mercer_records",
        "query_mercer_mercer_events",
        "query_mercer_mercer_audit_trail",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
    {
      id: "radford",
      name: "Radford",
      owns: [
        "radford_records",
        "radford_events",
        "radford_audit_trail",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_radford_radford_records",
        "query_radford_radford_events",
        "query_radford_radford_audit_trail",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
    {
      id: "payscale",
      name: "Payscale",
      owns: [
        "payscale_records",
        "payscale_events",
        "payscale_audit_trail",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_payscale_payscale_records",
        "query_payscale_payscale_events",
        "query_payscale_payscale_audit_trail",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
    {
      id: "google_bigquery",
      name: "Google BigQuery",
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
        "query_google_bigquery_analytics_events",
        "query_google_bigquery_historical_metrics",
        "query_google_bigquery_cached_aggregates",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
  ],
  entities: [
    {
      name: "mercer_records",
      sourceSystemId: "mercer",
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
      name: "mercer_events",
      sourceSystemId: "mercer",
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
          name: "mercer_record_id",
          type: "ref",
          ref: "mercer_records.id",
          required: true,
        },
      ],
    },
    {
      name: "mercer_audit_trail",
      sourceSystemId: "mercer",
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
      name: "radford_records",
      sourceSystemId: "radford",
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
      name: "radford_events",
      sourceSystemId: "radford",
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
          name: "radford_record_id",
          type: "ref",
          ref: "radford_records.id",
          required: true,
        },
      ],
    },
    {
      name: "radford_audit_trail",
      sourceSystemId: "radford",
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
      name: "payscale_records",
      sourceSystemId: "payscale",
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
      name: "payscale_events",
      sourceSystemId: "payscale",
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
          name: "payscale_record_id",
          type: "ref",
          ref: "payscale_records.id",
          required: true,
        },
      ],
    },
    {
      name: "payscale_audit_trail",
      sourceSystemId: "payscale",
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
      sourceSystemId: "google_bigquery",
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
      sourceSystemId: "google_bigquery",
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
      sourceSystemId: "google_bigquery",
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
      from: "mercer_events.mercer_record_id",
      to: "mercer_records.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
    {
      from: "radford_events.radford_record_id",
      to: "radford_records.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
    {
      from: "payscale_events.payscale_record_id",
      to: "payscale_records.id",
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
      id: "market-benchmarking-analysis-agent-policy-handbook",
      sourceSystemId: "google_bigquery",
      type: "policy",
      title: "Market Benchmarking Analysis Agent Policy Handbook",
      requiredSections: [
        "Eligibility and scope",
        "Workflow steps",
        "Manager responsibilities",
        "Compliance and audit",
        "Sensitive-data handling",
      ],
      linkedEntities: [
        "mercer_records",
        "mercer_events",
        "mercer_audit_trail",
      ],
      minimumWordCount: 500,
      citationAnchors: [
        "eligibility",
        "workflow",
        "compliance",
        "sensitive-data",
      ],
    },
  ],
  apis: [],
  anomalies: [
    {
      id: "market-benchmarking-analysis-agent-baseline-gap",
      description: "Seed a realistic gap where Data sources sits between 2-3 surveys and 10+ continuous, so the agent can detect, narrate, and recommend remediation.",
      affectedEntities: [
        "mercer_records",
        "mercer_events",
      ],
      discoveryPath: [
        "Inspect Mercer records for the affected entities",
        "Compare against Radford historical baseline",
        "Generate a citation-backed recommendation",
      ],
      expectedEvidence: [
        "source-system record",
        "historical baseline metric",
        "generated audit trail",
      ],
      expectedRecommendation: "Explain the gap, cite supporting evidence, and propose the next Comp Manager action.",
    },
  ],
  datastorePackaging: {
    alloydb: {
      database: "market_benchmarking_analysis_agent",
      schemas: [
        "mercer",
        "radford",
        "payscale",
      ],
    },
    bigquery: {
      dataset: "hr_market_benchmarking_analysis_agent",
      tables: [
        "kpi_summary",
        "evidence_index",
      ],
    },
    cloudStorage: {
      bucketSuffix: "market-benchmarking-analysis-agent-evidence",
      prefixes: [
        "documents",
        "audit-trails",
        "exports",
      ],
    },
    apis: {
      serviceName: "market-benchmarking-analysis-agent-source-adapters",
      deploymentTarget: "cloud_run",
    },
  },
  validation: {
    smokePrompt: "Run the Market Benchmarking Analysis Agent workflow and cite source-system evidence for every claim.",
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

export const MarketBenchmarking = () => (
  <UseCaseSlide
    title="Market Benchmarking Analysis Agent"
    subtitle="A-401 • Total Rewards"
    icon={Globe}
    domainId="domain-4"
    layer="Layer 4: Data Agent"
    persona="Comp Manager"
    systems={["Mercer", "Radford", "Payscale", "Google BigQuery"]}
    kpis={[
      { label: "Data sources", before: "2-3 surveys", after: "10+ continuous" },
      { label: "Refresh rate", before: "Annual", after: "Monthly" },
      { label: "Peer group accuracy", before: "Broad industry", after: "Custom peer set" },
    ]}
    flow={flow}
    triggerType="scheduled"
    swimlane={swimlane}
    architecture={architecture}
    statusQuo={[
      "Market data purchased annually from 2-3 surveys with limited granularity.",
      "Competitive positioning analysis done in spreadsheets, months stale.",
      "Peer group comparisons are static and miss emerging talent competitors."
    ]}
    agentification={[
      "Continuous market data aggregation across multiple compensation sources.",
      "Real-time competitive positioning dashboards by role family and geography.",
      "Automated peer group analysis adapting to evolving talent market dynamics."
    ]}
  />
);
