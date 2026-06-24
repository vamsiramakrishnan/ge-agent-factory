import React from "react";
import { UseCaseSlide } from "../../../agent/UseCaseSlide";
import { PieChart, Download, BarChart, Calculator, Target } from "lucide-react";
import { FlowStep } from "../../../agent/ProcessFlow";
import { SwimlaneFlow } from "../../../agent/SwimlaneFlow";
import { AgentArchitecture, UseCaseGenerationSpec, AgentBehaviorContract} from "../../../../types/architecture";

const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "s1", label: "Channel Data", lane: "system", type: "trigger" },
    { id: "a1", label: "Performance Analysis", lane: "agent", type: "action" },
    { id: "a2", label: "ROI Modeling", lane: "agent", type: "action" },
    { id: "a3", label: "Recommendations", lane: "agent", type: "output" },
  ],
  connections: [["s1", "a1"], ["a1", "a2"], ["a2", "a3"]],
};

const architecture: AgentArchitecture = {
  connections: [
    { system: "Greenhouse", description: "Candidate source tracking, funnel conversion data", direction: "read", protocol: "REST API", category: "erp" },
    { system: "LinkedIn", description: "Sponsored job metrics, InMail response rates", direction: "read", protocol: "REST API", category: "market-data" },
    { system: "Indeed", description: "Job posting performance, click-through and apply rates", direction: "read", protocol: "REST API", category: "market-data" },
    { system: "BigQuery", description: "Channel analytics data warehouse, ROI models", direction: "bidirectional", protocol: "BigQuery SQL", category: "analytics" },
    { system: "Looker", description: "Interactive channel performance dashboards", direction: "write", protocol: "Looker API", category: "analytics" },
  ],
  pipeline: [
    { label: "Channel Data Collection", description: "Aggregate source attribution, funnel metrics, and cost data from Greenhouse, LinkedIn, and Indeed into BigQuery analytics warehouse.", systems: ["Greenhouse", "LinkedIn", "Indeed", "BigQuery"], layer: "integration", dataIn: "Raw channel metrics across platforms", dataOut: "Unified channel performance dataset" },
    { label: "ROI & Quality Analysis", description: "Calculate quality-adjusted ROI per channel factoring in candidate conversion rates, hire performance, and retention outcomes. Predictive budget models.", systems: ["BigQuery"], layer: "ml", dataIn: "Unified channel data + hire outcomes", dataOut: "Channel ROI scores with quality metrics" },
    { label: "Recommendations & Dashboards", description: "Generate budget reallocation recommendations and publish real-time channel performance dashboards to Looker for TA leadership.", systems: ["Looker", "BigQuery"], layer: "integration", dataIn: "ROI scores + budget allocation data", dataOut: "Channel optimization recommendations" },
  ],
};


const behaviorContract: AgentBehaviorContract = {
  role: "TA Lead agent for the Sourcing Channel Analytics Agent workflow",
  primaryObjective: "Real-time channel performance dashboards tracking volume, conversion rates, and time-to-fill by source. Cost-per-quality-hire analytics that weight candidate performance and retention outcomes by sourcing channel. so the TA Lead can move the Channel ROI visibility KPI.",
  inScope: [
    "Real-time channel performance dashboards tracking volume, conversion rates, and time-to-fill by source",
    "Cost-per-quality-hire analytics that weight candidate performance and retention outcomes by sourcing channel",
    "Predictive budget optimization recommendations that reallocate spend toward highest-performing channels",
  ],
  outOfScope: [
    "Final hiring, termination, or compensation decisions (HRBP/leadership retains authority)",
    "Performance management adjudication and disciplinary action",
    "Legal interpretation of employment law in ambiguous jurisdictions",
  ],
  toolIntents: [
    {
      name: "query_ats_ats_records",
      kind: "query",
      sourceSystemId: "ats",
      description: "Retrieve ats records from ATS for the Sourcing Channel Analytics Agent workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "ats_records_records",
        "ats_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_linkedin_linkedin_records",
      kind: "query",
      sourceSystemId: "linkedin",
      description: "Retrieve linkedin records from LinkedIn for the Sourcing Channel Analytics Agent workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "linkedin_records_records",
        "linkedin_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_indeed_indeed_records",
      kind: "query",
      sourceSystemId: "indeed",
      description: "Retrieve indeed records from Indeed for the Sourcing Channel Analytics Agent workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "indeed_records_records",
        "indeed_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_google_bigquery_analytics_events",
      kind: "query",
      sourceSystemId: "google_bigquery",
      description: "Retrieve analytics events from Google BigQuery for the Sourcing Channel Analytics Agent workflow.",
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
      name: "lookup_sourcing_channel_analytics_agent_policy_handbook",
      kind: "evidence_lookup",
      sourceSystemId: "google_bigquery",
      description: "Look up sections of the Sourcing Channel Analytics Agent Policy Handbook to cite in narrative output, escalation rationale, and audit evidence.",
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
      name: "action_ats_recommend",
      kind: "action",
      sourceSystemId: "ats",
      description: "Execute the recommend step in ATS after the agent has gathered evidence and validated escalation gates.",
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
      claim: "Channel ROI visibility moved from Quarterly toward Real-time",
      mustCite: [
        "ats.ats_records",
        "linkedin.linkedin_records",
      ],
      sourceSystemIds: [
        "ats",
        "linkedin",
      ],
    },
    {
      claim: "Cost per quality hire moved from Unknown toward By channel",
      mustCite: [
        "ats.ats_records",
        "linkedin.linkedin_records",
      ],
      sourceSystemIds: [
        "ats",
        "linkedin",
      ],
    },
  ],
  escalationRules: [
    {
      trigger: "Channel ROI visibility regresses past the Quarterly baseline by more than 20%",
      action: "escalate_to_human",
      handoffTarget: "TA Lead",
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
    "Never fabricate metric values; only publish numbers derived from ATS (and other named systems) entities.",
    "Never bypass TA Lead approval on escalation triggers, even when confidence is high.",
    "Never expose individual personal data (PII) in summaries; aggregate or pseudonymise before output.",
    "Never act on data older than the staleness threshold defined in the runbook without a fresh re-query.",
  ],
  goldenEvals: [
    {
      id: "sourcing-channel-analytics-agent-end-to-end",
      prompt: "Run the Sourcing Channel Analytics Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.",
      expectedToolCalls: [
        "query_ats_ats_records",
        "query_linkedin_linkedin_records",
        "query_indeed_indeed_records",
        "query_google_bigquery_analytics_events",
        "lookup_sourcing_channel_analytics_agent_policy_handbook",
        "action_ats_recommend",
      ],
      mustReferenceEntities: [
        "ats_records",
        "linkedin_records",
        "indeed_records",
        "analytics_events",
      ],
      mustCiteDocuments: [
        "sourcing-channel-analytics-agent-policy-handbook",
      ],
      expectedActionOutcome: "Action recommend executed against ATS, with audit-trail entry and TA Lead notified of outcomes.",
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
    rationale: "Row counts sized for Sourcing Channel Analytics Agent so the agent can demonstrate the workflow against realistic transactional volume without simulating a production warehouse.",
  },
  sourceSystems: [
    {
      id: "ats",
      name: "ATS",
      owns: [
        "ats_records",
        "ats_events",
        "ats_audit_trail",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_ats_ats_records",
        "query_ats_ats_events",
        "query_ats_ats_audit_trail",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
    {
      id: "linkedin",
      name: "LinkedIn",
      owns: [
        "linkedin_records",
        "linkedin_events",
        "linkedin_audit_trail",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_linkedin_linkedin_records",
        "query_linkedin_linkedin_events",
        "query_linkedin_linkedin_audit_trail",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
    {
      id: "indeed",
      name: "Indeed",
      owns: [
        "indeed_records",
        "indeed_events",
        "indeed_audit_trail",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_indeed_indeed_records",
        "query_indeed_indeed_events",
        "query_indeed_indeed_audit_trail",
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
      name: "ats_records",
      sourceSystemId: "ats",
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
      name: "ats_events",
      sourceSystemId: "ats",
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
          name: "ats_record_id",
          type: "ref",
          ref: "ats_records.id",
          required: true,
        },
      ],
    },
    {
      name: "ats_audit_trail",
      sourceSystemId: "ats",
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
      name: "linkedin_records",
      sourceSystemId: "linkedin",
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
      name: "linkedin_events",
      sourceSystemId: "linkedin",
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
          name: "linkedin_record_id",
          type: "ref",
          ref: "linkedin_records.id",
          required: true,
        },
      ],
    },
    {
      name: "linkedin_audit_trail",
      sourceSystemId: "linkedin",
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
      name: "indeed_records",
      sourceSystemId: "indeed",
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
      name: "indeed_events",
      sourceSystemId: "indeed",
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
          name: "indeed_record_id",
          type: "ref",
          ref: "indeed_records.id",
          required: true,
        },
      ],
    },
    {
      name: "indeed_audit_trail",
      sourceSystemId: "indeed",
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
      from: "ats_events.ats_record_id",
      to: "ats_records.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
    {
      from: "linkedin_events.linkedin_record_id",
      to: "linkedin_records.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
    {
      from: "indeed_events.indeed_record_id",
      to: "indeed_records.id",
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
      id: "sourcing-channel-analytics-agent-policy-handbook",
      sourceSystemId: "google_bigquery",
      type: "policy",
      title: "Sourcing Channel Analytics Agent Policy Handbook",
      requiredSections: [
        "Eligibility and scope",
        "Workflow steps",
        "Manager responsibilities",
        "Compliance and audit",
        "Sensitive-data handling",
      ],
      linkedEntities: [
        "ats_records",
        "ats_events",
        "ats_audit_trail",
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
  apis: [
    {
      id: "ats_recommend_api",
      sourceSystemId: "ats",
      method: "POST",
      path: "/api/ats/recommend",
      description: "Synchronous endpoint the agent calls to recommend in ATS after evidence gating.",
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
      id: "sourcing-channel-analytics-agent-baseline-gap",
      description: "Seed a realistic gap where Channel ROI visibility sits between Quarterly and Real-time, so the agent can detect, narrate, and recommend remediation.",
      affectedEntities: [
        "ats_records",
        "ats_events",
      ],
      discoveryPath: [
        "Inspect ATS records for the affected entities",
        "Compare against LinkedIn historical baseline",
        "Generate a citation-backed recommendation",
      ],
      expectedEvidence: [
        "source-system record",
        "historical baseline metric",
        "generated audit trail",
      ],
      expectedRecommendation: "Explain the gap, cite supporting evidence, and propose the next TA Lead action.",
    },
  ],
  datastorePackaging: {
    alloydb: {
      database: "sourcing_channel_analytics_agent",
      schemas: [
        "ats",
        "linkedin",
        "indeed",
      ],
    },
    bigquery: {
      dataset: "hr_sourcing_channel_analytics_agent",
      tables: [
        "kpi_summary",
        "evidence_index",
      ],
    },
    cloudStorage: {
      bucketSuffix: "sourcing-channel-analytics-agent-evidence",
      prefixes: [
        "documents",
        "audit-trails",
        "exports",
      ],
    },
    apis: {
      serviceName: "sourcing-channel-analytics-agent-source-adapters",
      deploymentTarget: "cloud_run",
    },
  },
  validation: {
    smokePrompt: "Run the Sourcing Channel Analytics Agent workflow and cite source-system evidence for every claim.",
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

export const SourcingChannelAnalytics = () => (
  <UseCaseSlide
    title="Sourcing Channel Analytics Agent"
    subtitle="A-205 • Sourcing & Candidate Pipeline"
    icon={PieChart}
    domainId="domain-2"
    layer="Layer 4: Data Agent"
    persona="TA Lead"
    systems={["ATS", "LinkedIn", "Indeed", "Google BigQuery"]}
    kpis={[
      { label: "Channel ROI visibility", before: "Quarterly", after: "Real-time" },
      { label: "Cost per quality hire", before: "Unknown", after: "By channel" },
      { label: "Budget optimization", before: "Historical", after: "Predictive" }
    ]}
    triggerType="scheduled"
    swimlane={swimlane}
    architecture={architecture}
    statusQuo={[
      "Channel effectiveness measured quarterly at best, with no real-time visibility into sourcing performance.",
      "ROI per channel is unknown — cost-per-hire metrics do not distinguish candidate quality by source.",
      "Budget allocation based on historical habit and vendor relationships rather than data-driven optimization."
    ]}
    agentification={[
      "Real-time channel performance dashboards tracking volume, conversion rates, and time-to-fill by source.",
      "Cost-per-quality-hire analytics that weight candidate performance and retention outcomes by sourcing channel.",
      "Predictive budget optimization recommendations that reallocate spend toward highest-performing channels."
    ]}
    flow={[
      { label: "Data Collection", icon: Download, description: "Source, funnel, cost data aggregated across channels.", trigger: "Continuous", systems: ["ATS", "Job Boards"] },
      { label: "Performance Analysis", icon: BarChart, description: "Channel effectiveness and cost-per-hire analyzed.", systems: ["Gemini", "BigQuery"], integration: "Data Agent" },
      { label: "ROI Modeling", icon: Calculator, description: "Quality-adjusted ROI calculated per channel." },
      { label: "Recommendations", icon: Target, description: "Budget reallocation recommendations generated.", output: "Channel Report" }
    ] as FlowStep[]}
  />
);
