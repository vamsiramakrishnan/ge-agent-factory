import React from "react";
import { UseCaseSlide } from "../../../agent/UseCaseSlide";
import { FlowStep } from "../../../agent/ProcessFlow";
import { SwimlaneFlow } from "../../../agent/SwimlaneFlow";
import { AgentArchitecture, UseCaseGenerationSpec, AgentBehaviorContract} from "../../../../types/architecture";
import { Zap, Upload, BarChart, Globe, Target } from "lucide-react";

const flow: FlowStep[] = [
  { label: "Employee Profile", icon: Upload, description: "Current comp, performance, tenure, market data loaded.", trigger: "On-demand", systems: ["HRIS", "Comp Data"] },
  { label: "Package Modeling", icon: BarChart, description: "Base, bonus, equity, benefits scenarios compared.", systems: ["Gemini"], integration: "ADK" },
  { label: "Market Positioning", icon: Globe, description: "Total rewards positioned against market percentiles." },
  { label: "Recommendation", icon: Target, description: "Optimized package recommendation with retention impact.", output: "Rewards Model" },
];

const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "trigger", label: "Employee Profile", lane: "human", type: "trigger" },
    { id: "model", label: "Package Modeling", lane: "agent", type: "action" },
    { id: "market", label: "Market Positioning", lane: "agent", type: "action" },
    { id: "hitl", label: "Comp Manager Approves", lane: "human", type: "hitl" },
    { id: "output", label: "Rewards Model", lane: "agent", type: "output" },
  ],
  connections: [["trigger", "model"], ["model", "market"], ["market", "hitl"], ["hitl", "output"]],
};

const architecture: AgentArchitecture = {
  connections: [
    { system: "Workday", description: "Employee comp history, performance, tenure, grade, benefits elections", direction: "read", protocol: "REST API", category: "erp" },
    { system: "Mercer", description: "Market benchmark data for total rewards positioning", direction: "read", protocol: "REST API", category: "market-data" },
    { system: "BigQuery", description: "Rewards modeling workspace, retention correlation analytics", direction: "bidirectional", protocol: "BigQuery SQL", category: "analytics" },
    { system: "Vertex AI (Gemini)", description: "Package optimization reasoning, retention impact modeling, tax analysis", direction: "bidirectional", protocol: "gRPC", category: "ai" },
  ],
  pipeline: [
    { label: "Employee Profile Assembly", description: "Aggregate current compensation, performance history, tenure, and benefits elections from Workday. Pull market positioning data from Mercer for the employee's role and geography.", systems: ["Workday", "Mercer"], layer: "integration", dataIn: "Employee ID + role + location", dataOut: "Complete employee rewards profile with market context" },
    { label: "Package Scenario Modeling", description: "Gemini models multiple total rewards scenarios across base, bonus, equity, and benefits. Evaluates trade-offs between cash and equity mix, internal equity impact, and retention correlation.", systems: ["Vertex AI (Gemini)", "BigQuery"], layer: "llm", dataIn: "Employee profile + market data + budget constraints", dataOut: "Ranked package scenarios with trade-off analysis" },
    { label: "Market & Equity Validation", description: "Validate each scenario against market percentiles and internal equity bands. Cross-jurisdiction tax optimization for global employees.", systems: ["BigQuery", "Mercer"], layer: "ml", dataIn: "Package scenarios + peer comp data", dataOut: "Validated scenarios with equity and tax impact" },
    { label: "Recommendation & Approval", description: "Optimized package recommendation presented to Comp Manager with retention impact projections and internal equity validation.", systems: ["Google Sheets", "Email"], layer: "integration", dataIn: "Top-ranked validated scenario", dataOut: "Approved total rewards package" },
  ],
};


const behaviorContract: AgentBehaviorContract = {
  role: "Comp Manager agent for the Total Rewards Optimizer workflow",
  primaryObjective: "Real-time modeling of base, bonus, and equity scenarios. Automated internal equity and market benchmark validation. so the Comp Manager can move the Scenario speed KPI.",
  inScope: [
    "Real-time modeling of base, bonus, and equity scenarios",
    "Automated internal equity and market benchmark validation",
    "Integrated cross-jurisdiction tax and net-pay optimization",
  ],
  outOfScope: [
    "Final hiring, termination, or compensation decisions (HRBP/leadership retains authority)",
    "Performance management adjudication and disciplinary action",
    "Legal interpretation of employment law in ambiguous jurisdictions",
  ],
  toolIntents: [
    {
      name: "query_workday_employees",
      kind: "query",
      sourceSystemId: "workday",
      description: "Retrieve employees from Workday for the Total Rewards Optimizer workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "employees_records",
        "employees_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_mercer_mercer_records",
      kind: "query",
      sourceSystemId: "mercer",
      description: "Retrieve mercer records from Mercer for the Total Rewards Optimizer workflow.",
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
      name: "query_e_trade_e_trade_records",
      kind: "query",
      sourceSystemId: "e_trade",
      description: "Retrieve e trade records from E*Trade for the Total Rewards Optimizer workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "e_trade_records_records",
        "e_trade_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_google_bigquery_analytics_events",
      kind: "query",
      sourceSystemId: "google_bigquery",
      description: "Retrieve analytics events from Google BigQuery for the Total Rewards Optimizer workflow.",
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
      name: "lookup_total_rewards_optimizer_policy_handbook",
      kind: "evidence_lookup",
      sourceSystemId: "google_bigquery",
      description: "Look up sections of the Total Rewards Optimizer Policy Handbook to cite in narrative output, escalation rationale, and audit evidence.",
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
      claim: "Scenario speed moved from Days toward Minutes",
      mustCite: [
        "workday.employees",
        "mercer.mercer_records",
      ],
      sourceSystemIds: [
        "workday",
        "mercer",
      ],
    },
    {
      claim: "Components modeled moved from Base + bonus toward Full package",
      mustCite: [
        "workday.employees",
        "mercer.mercer_records",
      ],
      sourceSystemIds: [
        "workday",
        "mercer",
      ],
    },
  ],
  escalationRules: [
    {
      trigger: "Scenario speed regresses past the Days baseline by more than 20%",
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
    "Never fabricate metric values; only publish numbers derived from Workday (and other named systems) entities.",
    "Never bypass Comp Manager approval on escalation triggers, even when confidence is high.",
    "Never expose individual personal data (PII) in summaries; aggregate or pseudonymise before output.",
    "Never act on data older than the staleness threshold defined in the runbook without a fresh re-query.",
  ],
  goldenEvals: [
    {
      id: "total-rewards-optimizer-end-to-end",
      prompt: "Run the Total Rewards Optimizer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.",
      expectedToolCalls: [
        "query_workday_employees",
        "query_mercer_mercer_records",
        "query_e_trade_e_trade_records",
        "query_google_bigquery_analytics_events",
        "lookup_total_rewards_optimizer_policy_handbook",
      ],
      mustReferenceEntities: [
        "employees",
        "mercer_records",
        "e_trade_records",
        "analytics_events",
      ],
      mustCiteDocuments: [
        "total-rewards-optimizer-policy-handbook",
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
    rationale: "Row counts sized for Total Rewards Optimizer so the agent can demonstrate the workflow against realistic transactional volume without simulating a production warehouse.",
  },
  sourceSystems: [
    {
      id: "workday",
      name: "Workday",
      owns: [
        "employees",
        "positions",
        "compensation_records",
      ],
      protocol: "Workday REST",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_workday_employees",
        "query_workday_positions",
        "query_workday_compensation_records",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
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
      id: "e_trade",
      name: "E*Trade",
      owns: [
        "e_trade_records",
        "e_trade_events",
        "e_trade_audit_trail",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_e_trade_e_trade_records",
        "query_e_trade_e_trade_events",
        "query_e_trade_e_trade_audit_trail",
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
      name: "employees",
      sourceSystemId: "workday",
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
          name: "department",
          type: "enum",
          values: [
            "Finance",
            "HR",
            "IT",
            "Marketing",
            "Procurement",
            "Engineering",
            "Operations",
          ],
          required: true,
        },
        {
          name: "region",
          type: "enum",
          values: [
            "US",
            "EMEA",
            "APAC",
            "LATAM",
          ],
          required: true,
        },
        {
          name: "status",
          type: "enum",
          values: [
            "active",
            "on_leave",
            "inactive",
          ],
          weights: [
            0.85,
            0.1,
            0.05,
          ],
          required: true,
        },
        {
          name: "level",
          type: "enum",
          values: [
            "L3",
            "L4",
            "L5",
            "L6",
            "L7",
          ],
          required: true,
        },
        {
          name: "hired_on",
          type: "date",
          required: true,
        },
      ],
    },
    {
      name: "positions",
      sourceSystemId: "workday",
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
          name: "department",
          type: "enum",
          values: [
            "Finance",
            "HR",
            "IT",
            "Marketing",
            "Procurement",
            "Engineering",
            "Operations",
          ],
          required: true,
        },
        {
          name: "region",
          type: "enum",
          values: [
            "US",
            "EMEA",
            "APAC",
            "LATAM",
          ],
          required: true,
        },
        {
          name: "status",
          type: "enum",
          values: [
            "active",
            "on_leave",
            "inactive",
          ],
          weights: [
            0.85,
            0.1,
            0.05,
          ],
          required: true,
        },
        {
          name: "level",
          type: "enum",
          values: [
            "L3",
            "L4",
            "L5",
            "L6",
            "L7",
          ],
          required: true,
        },
        {
          name: "hired_on",
          type: "date",
          required: true,
        },
      ],
    },
    {
      name: "compensation_records",
      sourceSystemId: "workday",
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
          name: "department",
          type: "enum",
          values: [
            "Finance",
            "HR",
            "IT",
            "Marketing",
            "Procurement",
            "Engineering",
            "Operations",
          ],
          required: true,
        },
        {
          name: "region",
          type: "enum",
          values: [
            "US",
            "EMEA",
            "APAC",
            "LATAM",
          ],
          required: true,
        },
        {
          name: "status",
          type: "enum",
          values: [
            "active",
            "on_leave",
            "inactive",
          ],
          weights: [
            0.85,
            0.1,
            0.05,
          ],
          required: true,
        },
        {
          name: "level",
          type: "enum",
          values: [
            "L3",
            "L4",
            "L5",
            "L6",
            "L7",
          ],
          required: true,
        },
        {
          name: "hired_on",
          type: "date",
          required: true,
        },
      ],
    },
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
      name: "e_trade_records",
      sourceSystemId: "e_trade",
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
      name: "e_trade_events",
      sourceSystemId: "e_trade",
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
          name: "e_trade_record_id",
          type: "ref",
          ref: "e_trade_records.id",
          required: true,
        },
      ],
    },
    {
      name: "e_trade_audit_trail",
      sourceSystemId: "e_trade",
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
      from: "e_trade_events.e_trade_record_id",
      to: "e_trade_records.id",
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
      id: "total-rewards-optimizer-policy-handbook",
      sourceSystemId: "google_bigquery",
      type: "policy",
      title: "Total Rewards Optimizer Policy Handbook",
      requiredSections: [
        "Eligibility and scope",
        "Workflow steps",
        "Manager responsibilities",
        "Compliance and audit",
        "Sensitive-data handling",
      ],
      linkedEntities: [
        "employees",
        "positions",
        "compensation_records",
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
      id: "total-rewards-optimizer-baseline-gap",
      description: "Seed a realistic gap where Scenario speed sits between Days and Minutes, so the agent can detect, narrate, and recommend remediation.",
      affectedEntities: [
        "employees",
        "positions",
      ],
      discoveryPath: [
        "Inspect Workday records for the affected entities",
        "Compare against Mercer historical baseline",
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
      database: "total_rewards_optimizer",
      schemas: [
        "workday",
        "mercer",
        "e_trade",
      ],
    },
    bigquery: {
      dataset: "hr_total_rewards_optimizer",
      tables: [
        "kpi_summary",
        "evidence_index",
      ],
    },
    cloudStorage: {
      bucketSuffix: "total-rewards-optimizer-evidence",
      prefixes: [
        "documents",
        "audit-trails",
        "exports",
      ],
    },
    apis: {
      serviceName: "total-rewards-optimizer-source-adapters",
      deploymentTarget: "cloud_run",
    },
  },
  validation: {
    smokePrompt: "Run the Total Rewards Optimizer workflow and cite source-system evidence for every claim.",
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

export const TotalRewardsOptimizer = () => (
  <UseCaseSlide
    title="Total Rewards Optimizer"
    subtitle="A-408 • Total Rewards"
    icon={Zap}
    domainId="domain-4"
    layer="Layer 3: Custom ADK"
    persona="Comp Manager"
    systems={["Workday", "Mercer", "E*Trade", "Google BigQuery"]}
    kpis={[
      { label: "Scenario speed", before: "Days", after: "Minutes" },
      { label: "Components modeled", before: "Base + bonus", after: "Full package" },
      { label: "Retention correlation", before: "Assumed", after: "Validated" },
    ]}
    flow={flow}
    triggerType="event"
    swimlane={swimlane}
    architecture={architecture}
    hitl={{ actor: "Comp Manager", action: "Approve rewards package", description: "Agent models total rewards scenarios across base, bonus, equity, and benefits. Comp Manager reviews market positioning and retention impact before finalizing package." }}
    statusQuo={[
      "Total comp modeling for offers or retention is manual and slow.",
      "Internal equity checks are sampled rather than comprehensive.",
      "Cross-jurisdiction tax implications calculated offline in spreadsheets."
    ]}
    agentification={[
      "Real-time modeling of base, bonus, and equity scenarios.",
      "Automated internal equity and market benchmark validation.",
      "Integrated cross-jurisdiction tax and net-pay optimization."
    ]}
  />
);
