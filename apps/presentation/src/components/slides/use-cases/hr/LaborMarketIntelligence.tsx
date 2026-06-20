import React from "react";
import { UseCaseSlide } from "../../../agent/UseCaseSlide";
import { FlowStep } from "../../../agent/ProcessFlow";
import { Globe, Download, Search, Shield, FileText } from "lucide-react";
import { SwimlaneFlow } from "../../../agent/SwimlaneFlow";
import { AgentArchitecture, UseCaseGenerationSpec, AgentBehaviorContract} from "../../../../types/architecture";

const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "s1", label: "Market Data Feeds", lane: "system", type: "trigger" },
    { id: "a1", label: "Market Analysis", lane: "agent", type: "action" },
    { id: "a2", label: "Risk Scoring", lane: "agent", type: "action" },
    { id: "a3", label: "Intelligence Brief", lane: "agent", type: "output" },
  ],
  connections: [["s1", "a1"], ["a1", "a2"], ["a2", "a3"]],
};

const flow: FlowStep[] = [
  { label: "Data Ingestion", icon: Download, description: "Salary surveys, job postings, labor stats aggregated.", trigger: "Continuous", systems: ["BLS", "LinkedIn"] },
  { label: "Market Analysis", icon: Search, description: "Competitive positioning and supply-demand analysis.", systems: ["Gemini"], integration: "Data Agent" },
  { label: "Risk Scoring", icon: Shield, description: "Talent supply risk scored by role, location, skills.", systems: ["BigQuery"] },
  { label: "Intelligence Brief", icon: FileText, description: "Actionable market intelligence delivered to leaders.", output: "Market Report" },
];

const architecture: AgentArchitecture = {
  connections: [
    { system: "LinkedIn Talent Insights", description: "Talent pool sizes, hiring trends, skill availability", direction: "read", protocol: "REST API", category: "market-data" },
    { system: "Lightcast", description: "Job posting volumes, salary benchmarks, skill demand signals", direction: "read", protocol: "REST API", category: "market-data" },
    { system: "BLS Data", description: "Labor force statistics, unemployment rates, wage indices", direction: "read", protocol: "REST API", category: "market-data" },
    { system: "BigQuery", description: "Aggregated market intelligence data lake, trend models", direction: "bidirectional", protocol: "BigQuery SQL", category: "analytics" },
    { system: "Vertex AI (Gemini)", description: "Market synthesis, talent risk scoring, intelligence brief generation", direction: "bidirectional", protocol: "gRPC", category: "ai" },
  ],
  pipeline: [
    { label: "Market Data Ingestion", description: "Continuous crawling of LinkedIn Talent Insights, Lightcast job postings, and BLS labor statistics. Data normalized and stored in BigQuery market intelligence lake.", systems: ["LinkedIn Talent Insights", "Lightcast", "BLS Data", "BigQuery"], layer: "integration", dataIn: "Raw market feeds from multiple sources", dataOut: "Normalized market data in BigQuery" },
    { label: "Talent Supply Risk Modeling", description: "Time-series analysis on talent supply trends. Risk scoring by role, location, and skill cluster using historical patterns and predictive models.", systems: ["BigQuery", "Vertex AI (Gemini)"], layer: "ml", dataIn: "Normalized market data + internal demand signals", dataOut: "Talent supply risk scores by role × location" },
    { label: "Intelligence Brief Generation", description: "Gemini synthesizes market data into actionable intelligence briefs for HR leaders. Highlights competitive positioning, emerging skill shortages, and salary pressure points.", systems: ["Vertex AI (Gemini)"], layer: "llm", dataIn: "Risk scores + market trends + competitive data", dataOut: "Executive market intelligence brief" },
  ],
};


const behaviorContract: AgentBehaviorContract = {
  role: "CHRO agent for the Labor Market Intelligence workflow",
  primaryObjective: "Continuous crawling of external market data joined with internal skills. Real-time surfacing of talent supply risks by role and geography. so the CHRO can move the Data freshness KPI.",
  inScope: [
    "Continuous crawling of external market data joined with internal skills",
    "Real-time surfacing of talent supply risks by role and geography",
    "Predictive benchmarking of salary and availability trends",
  ],
  outOfScope: [
    "Final hiring, termination, or compensation decisions (HRBP/leadership retains authority)",
    "Performance management adjudication and disciplinary action",
    "Legal interpretation of employment law in ambiguous jurisdictions",
  ],
  toolIntents: [
    {
      name: "query_linkedin_talent_insights_linkedin_talent_insights_records",
      kind: "query",
      sourceSystemId: "linkedin_talent_insights",
      description: "Retrieve linkedin talent insights records from LinkedIn Talent Insights for the Labor Market Intelligence workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "linkedin_talent_insights_records_records",
        "linkedin_talent_insights_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_bls_data_bls_data_records",
      kind: "query",
      sourceSystemId: "bls_data",
      description: "Retrieve bls data records from BLS Data for the Labor Market Intelligence workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "bls_data_records_records",
        "bls_data_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_lightcast_lightcast_records",
      kind: "query",
      sourceSystemId: "lightcast",
      description: "Retrieve lightcast records from Lightcast for the Labor Market Intelligence workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "lightcast_records_records",
        "lightcast_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_google_bigquery_analytics_events",
      kind: "query",
      sourceSystemId: "google_bigquery",
      description: "Retrieve analytics events from Google BigQuery for the Labor Market Intelligence workflow.",
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
      name: "lookup_labor_market_intelligence_policy_handbook",
      kind: "evidence_lookup",
      sourceSystemId: "google_bigquery",
      description: "Look up sections of the Labor Market Intelligence Policy Handbook to cite in narrative output, escalation rationale, and audit evidence.",
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
      claim: "Data freshness moved from Quarterly toward Real-time",
      mustCite: [
        "linkedin_talent_insights.linkedin_talent_insights_records",
        "bls_data.bls_data_records",
      ],
      sourceSystemIds: [
        "linkedin_talent_insights",
        "bls_data",
      ],
    },
    {
      claim: "Markets monitored moved from 5 toward 200+",
      mustCite: [
        "linkedin_talent_insights.linkedin_talent_insights_records",
        "bls_data.bls_data_records",
      ],
      sourceSystemIds: [
        "linkedin_talent_insights",
        "bls_data",
      ],
    },
  ],
  escalationRules: [
    {
      trigger: "Data freshness regresses past the Quarterly baseline by more than 20%",
      action: "escalate_to_human",
      handoffTarget: "CHRO",
      rationale: "Significant regressions need human judgment before automated remediation runs against production records.",
    },
    {
      trigger: "Source-system evidence is incomplete or stale (>24h) for any required entity",
      action: "request_more_info",
      rationale: "Recommendations grounded in stale evidence misrepresent current state and undermine audit defensibility.",
    },
  ],
  refusalRules: [
    "Never fabricate metric values; only publish numbers derived from LinkedIn Talent Insights (and other named systems) entities.",
    "Never bypass CHRO approval on escalation triggers, even when confidence is high.",
    "Never expose individual personal data (PII) in summaries; aggregate or pseudonymise before output.",
    "Never act on data older than the staleness threshold defined in the runbook without a fresh re-query.",
  ],
  goldenEvals: [
    {
      id: "labor-market-intelligence-end-to-end",
      prompt: "Run the Labor Market Intelligence workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.",
      expectedToolCalls: [
        "query_linkedin_talent_insights_linkedin_talent_insights_records",
        "query_bls_data_bls_data_records",
        "query_lightcast_lightcast_records",
        "query_google_bigquery_analytics_events",
        "lookup_labor_market_intelligence_policy_handbook",
      ],
      mustReferenceEntities: [
        "linkedin_talent_insights_records",
        "bls_data_records",
        "lightcast_records",
        "analytics_events",
      ],
      mustCiteDocuments: [
        "labor-market-intelligence-policy-handbook",
      ],
      expectedActionOutcome: "CHRO receives a fully-cited recommendation; no external state change without explicit approval.",
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
    rationale: "Row counts sized for Labor Market Intelligence so the agent can demonstrate the workflow against realistic transactional volume without simulating a production warehouse.",
  },
  sourceSystems: [
    {
      id: "linkedin_talent_insights",
      name: "LinkedIn Talent Insights",
      owns: [
        "linkedin_talent_insights_records",
        "linkedin_talent_insights_events",
        "linkedin_talent_insights_audit_trail",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_linkedin_talent_insights_linkedin_talent_insights_records",
        "query_linkedin_talent_insights_linkedin_talent_insights_events",
        "query_linkedin_talent_insights_linkedin_talent_insights_audit_trail",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
    {
      id: "bls_data",
      name: "BLS Data",
      owns: [
        "bls_data_records",
        "bls_data_events",
        "bls_data_audit_trail",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_bls_data_bls_data_records",
        "query_bls_data_bls_data_events",
        "query_bls_data_bls_data_audit_trail",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
    {
      id: "lightcast",
      name: "Lightcast",
      owns: [
        "lightcast_records",
        "lightcast_events",
        "lightcast_audit_trail",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_lightcast_lightcast_records",
        "query_lightcast_lightcast_events",
        "query_lightcast_lightcast_audit_trail",
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
      name: "linkedin_talent_insights_records",
      sourceSystemId: "linkedin_talent_insights",
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
      name: "linkedin_talent_insights_events",
      sourceSystemId: "linkedin_talent_insights",
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
          name: "linkedin_talent_insights_record_id",
          type: "ref",
          ref: "linkedin_talent_insights_records.id",
          required: true,
        },
      ],
    },
    {
      name: "linkedin_talent_insights_audit_trail",
      sourceSystemId: "linkedin_talent_insights",
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
      name: "bls_data_records",
      sourceSystemId: "bls_data",
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
      name: "bls_data_events",
      sourceSystemId: "bls_data",
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
          name: "bls_data_record_id",
          type: "ref",
          ref: "bls_data_records.id",
          required: true,
        },
      ],
    },
    {
      name: "bls_data_audit_trail",
      sourceSystemId: "bls_data",
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
      name: "lightcast_records",
      sourceSystemId: "lightcast",
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
      name: "lightcast_events",
      sourceSystemId: "lightcast",
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
          name: "lightcast_record_id",
          type: "ref",
          ref: "lightcast_records.id",
          required: true,
        },
      ],
    },
    {
      name: "lightcast_audit_trail",
      sourceSystemId: "lightcast",
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
      from: "linkedin_talent_insights_events.linkedin_talent_insights_record_id",
      to: "linkedin_talent_insights_records.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
    {
      from: "bls_data_events.bls_data_record_id",
      to: "bls_data_records.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
    {
      from: "lightcast_events.lightcast_record_id",
      to: "lightcast_records.id",
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
      id: "labor-market-intelligence-policy-handbook",
      sourceSystemId: "google_bigquery",
      type: "policy",
      title: "Labor Market Intelligence Policy Handbook",
      requiredSections: [
        "Eligibility and scope",
        "Workflow steps",
        "Manager responsibilities",
        "Compliance and audit",
        "Sensitive-data handling",
      ],
      linkedEntities: [
        "linkedin_talent_insights_records",
        "linkedin_talent_insights_events",
        "linkedin_talent_insights_audit_trail",
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
      id: "labor-market-intelligence-baseline-gap",
      description: "Seed a realistic gap where Data freshness sits between Quarterly and Real-time, so the agent can detect, narrate, and recommend remediation.",
      affectedEntities: [
        "linkedin_talent_insights_records",
        "linkedin_talent_insights_events",
      ],
      discoveryPath: [
        "Inspect LinkedIn Talent Insights records for the affected entities",
        "Compare against BLS Data historical baseline",
        "Generate a citation-backed recommendation",
      ],
      expectedEvidence: [
        "source-system record",
        "historical baseline metric",
        "generated audit trail",
      ],
      expectedRecommendation: "Explain the gap, cite supporting evidence, and propose the next CHRO action.",
    },
  ],
  datastorePackaging: {
    alloydb: {
      database: "labor_market_intelligence",
      schemas: [
        "linkedin_talent_insights",
        "bls_data",
        "lightcast",
      ],
    },
    bigquery: {
      dataset: "hr_labor_market_intelligence",
      tables: [
        "kpi_summary",
        "evidence_index",
      ],
    },
    cloudStorage: {
      bucketSuffix: "labor-market-intelligence-evidence",
      prefixes: [
        "documents",
        "audit-trails",
        "exports",
      ],
    },
    apis: {
      serviceName: "labor-market-intelligence-source-adapters",
      deploymentTarget: "cloud_run",
    },
  },
  validation: {
    smokePrompt: "Run the Labor Market Intelligence workflow and cite source-system evidence for every claim.",
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

export const LaborMarketIntelligence = () => (
  <UseCaseSlide
    title="Labor Market Intelligence"
    subtitle="A-102 • Workforce Planning"
    icon={Globe}
    domainId="domain-1"
    layer="Layer 4: Data Agent"
    persona="CHRO"
    systems={["LinkedIn Talent Insights", "BLS Data", "Lightcast", "Google BigQuery"]}
    kpis={[
      { label: "Data freshness", before: "Quarterly", after: "Real-time" },
      { label: "Markets monitored", before: "5", after: "200+" },
      { label: "Talent risk alerts", before: "0", after: "Continuous" },
    ]}
    triggerType="scheduled"
    swimlane={swimlane}
    flow={flow}
    architecture={architecture}
    statusQuo={[
      "Manual research of industry labor reports and competitor hiring.",
      "Internal skills inventory is a point-in-time snapshot.",
      "Talent supply risks discovered reactively during hiring."
    ]}
    agentification={[
      "Continuous crawling of external market data joined with internal skills.",
      "Real-time surfacing of talent supply risks by role and geography.",
      "Predictive benchmarking of salary and availability trends."
    ]}
  />
);
