import React from "react";
import { UseCaseSlide } from "../../../agent/UseCaseSlide";
import { FlowStep } from "../../../agent/ProcessFlow";
import { SwimlaneFlow } from "../../../agent/SwimlaneFlow";
import { AgentArchitecture, UseCaseGenerationSpec, AgentBehaviorContract} from "../../../../types/architecture";
import { Search, Brain, BarChart, Send } from "lucide-react";

const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "n1", label: "Natural Language Query", lane: "human", type: "trigger" },
    { id: "n2", label: "Query Translation", lane: "agent", type: "action" },
    { id: "n3", label: "Visualization", lane: "agent", type: "action" },
    { id: "n4", label: "Report Delivered", lane: "human", type: "output" },
  ],
  connections: [["n1", "n2"], ["n2", "n3"], ["n3", "n4"]],
};

const architecture: AgentArchitecture = {
  connections: [
    { system: "BigQuery", description: "Unified HR data lake with cross-domain tables, query execution", direction: "bidirectional", protocol: "BigQuery SQL", category: "analytics" },
    { system: "Workday", description: "Real-time employee data for query enrichment and validation", direction: "read", protocol: "REST API", category: "erp" },
    { system: "Looker", description: "Visualization rendering, dashboard embedding, scheduled reports", direction: "write", protocol: "Looker API", category: "analytics" },
    { system: "Vertex AI (Gemini)", description: "Natural language to SQL translation, result interpretation", direction: "bidirectional", protocol: "gRPC", category: "ai" },
  ],
  pipeline: [
    { label: "Query Intake", description: "Receive natural language question from user. Parse intent, identify required data domains (HRIS, ATS, LMS, compensation), and validate user access permissions.", systems: ["Vertex AI (Gemini)"], layer: "llm", dataIn: "Natural language question + user permissions", dataOut: "Parsed query intent with required domains" },
    { label: "SQL Generation", description: "Gemini translates natural language into optimized BigQuery SQL, joining across HR data lake tables. Apply row-level security and data governance rules.", systems: ["Vertex AI (Gemini)", "BigQuery"], layer: "llm", dataIn: "Parsed intent + data lake schema + security rules", dataOut: "Optimized SQL query with governance applied" },
    { label: "Execution & Validation", description: "Execute query against BigQuery HR data lake. Validate results for reasonableness and enrich with real-time Workday data where needed.", systems: ["BigQuery", "Workday"], layer: "integration", dataIn: "SQL query", dataOut: "Query results with validation checks" },
    { label: "Visualization & Export", description: "Auto-select appropriate visualization type based on data shape. Render in Looker with export and scheduling options for stakeholder distribution.", systems: ["Looker"], layer: "integration", dataIn: "Validated query results", dataOut: "Interactive visualization with export options" },
  ],
};


const behaviorContract: AgentBehaviorContract = {
  role: "People Analyst agent for the HR Data Lake Query workflow",
  primaryObjective: "Natural language interface to the unified HR data lake. Instant NL-to-SQL translation for complex cross-domain queries. so the People Analyst can move the Query method KPI.",
  inScope: [
    "Natural language interface to the unified HR data lake",
    "Instant NL-to-SQL translation for complex cross-domain queries",
    "Self-service visualization generation for HRBPs and executives",
  ],
  outOfScope: [
    "Final hiring, termination, or compensation decisions (HRBP/leadership retains authority)",
    "Performance management adjudication and disciplinary action",
    "Legal interpretation of employment law in ambiguous jurisdictions",
  ],
  toolIntents: [
    {
      name: "query_google_bigquery_analytics_events",
      kind: "query",
      sourceSystemId: "google_bigquery",
      description: "Retrieve analytics events from Google BigQuery for the HR Data Lake Query workflow.",
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
      name: "query_workday_employees",
      kind: "query",
      sourceSystemId: "workday",
      description: "Retrieve employees from Workday for the HR Data Lake Query workflow.",
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
      name: "query_looker_dashboards",
      kind: "query",
      sourceSystemId: "looker",
      description: "Retrieve dashboards from Looker for the HR Data Lake Query workflow.",
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
      name: "query_google_cloud_billing_records",
      kind: "query",
      sourceSystemId: "google_cloud",
      description: "Retrieve billing records from Google Cloud for the HR Data Lake Query workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "billing_records_records",
        "billing_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "lookup_hr_data_lake_query_policy_handbook",
      kind: "evidence_lookup",
      sourceSystemId: "google_bigquery",
      description: "Look up sections of the HR Data Lake Query Policy Handbook to cite in narrative output, escalation rationale, and audit evidence.",
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
      name: "action_workday_execute",
      kind: "action",
      sourceSystemId: "workday",
      description: "Execute the execute step in Workday after the agent has gathered evidence and validated escalation gates.",
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
      claim: "Query method moved from SQL required toward Natural language",
      mustCite: [
        "google_bigquery.analytics_events",
        "workday.employees",
      ],
      sourceSystemIds: [
        "google_bigquery",
        "workday",
      ],
    },
    {
      claim: "Report generation moved from Days toward Minutes",
      mustCite: [
        "google_bigquery.analytics_events",
        "workday.employees",
      ],
      sourceSystemIds: [
        "google_bigquery",
        "workday",
      ],
    },
  ],
  escalationRules: [
    {
      trigger: "Query method regresses past the SQL required baseline by more than 20%",
      action: "escalate_to_human",
      handoffTarget: "People Analyst",
      rationale: "Significant regressions need human judgment before automated remediation runs against production records.",
    },
    {
      trigger: "Source-system evidence is incomplete or stale (>24h) for any required entity",
      action: "request_more_info",
      rationale: "Recommendations grounded in stale evidence misrepresent current state and undermine audit defensibility.",
    },
    {
      trigger: "Proposed execute action lacks supporting evidence from at least two systems",
      action: "refuse",
      rationale: "Single-system evidence is insufficient to authorize external state changes without manual review.",
    },
  ],
  refusalRules: [
    "Never fabricate metric values; only publish numbers derived from Google BigQuery (and other named systems) entities.",
    "Never bypass People Analyst approval on escalation triggers, even when confidence is high.",
    "Never expose individual personal data (PII) in summaries; aggregate or pseudonymise before output.",
    "Never act on data older than the staleness threshold defined in the runbook without a fresh re-query.",
  ],
  goldenEvals: [
    {
      id: "hr-data-lake-query-end-to-end",
      prompt: "Run the HR Data Lake Query workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.",
      expectedToolCalls: [
        "query_google_bigquery_analytics_events",
        "query_workday_employees",
        "query_looker_dashboards",
        "query_google_cloud_billing_records",
        "lookup_hr_data_lake_query_policy_handbook",
        "action_workday_execute",
      ],
      mustReferenceEntities: [
        "analytics_events",
        "employees",
        "dashboards",
        "billing_records",
      ],
      mustCiteDocuments: [
        "hr-data-lake-query-policy-handbook",
      ],
      expectedActionOutcome: "Action execute executed against Workday, with audit-trail entry and People Analyst notified of outcomes.",
      forbiddenBehaviors: [
        "do not invent KPI numbers",
        "do not skip the evidence_lookup step before any recommendation",
        "do not execute execute without two-system evidence",
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
    rationale: "Row counts sized for HR Data Lake Query so the agent can demonstrate the workflow against realistic transactional volume without simulating a production warehouse.",
  },
  sourceSystems: [
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
    {
      id: "google_cloud",
      name: "Google Cloud",
      owns: [
        "billing_records",
        "resource_inventory",
        "alarm_events",
      ],
      protocol: "GCP SDK",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_google_cloud_billing_records",
        "query_google_cloud_resource_inventory",
        "query_google_cloud_alarm_events",
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
    {
      name: "billing_records",
      sourceSystemId: "google_cloud",
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
      name: "resource_inventory",
      sourceSystemId: "google_cloud",
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
      name: "alarm_events",
      sourceSystemId: "google_cloud",
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
          name: "billing_record_id",
          type: "ref",
          ref: "billing_records.id",
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
    {
      from: "alarm_events.billing_record_id",
      to: "billing_records.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
  ],
  documents: [
    {
      id: "hr-data-lake-query-policy-handbook",
      sourceSystemId: "google_bigquery",
      type: "policy",
      title: "HR Data Lake Query Policy Handbook",
      requiredSections: [
        "Eligibility and scope",
        "Workflow steps",
        "Manager responsibilities",
        "Compliance and audit",
        "Sensitive-data handling",
      ],
      linkedEntities: [
        "analytics_events",
        "historical_metrics",
        "cached_aggregates",
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
      id: "workday_execute_api",
      sourceSystemId: "workday",
      method: "POST",
      path: "/api/workday/execute",
      description: "Synchronous endpoint the agent calls to execute in Workday after evidence gating.",
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
      id: "hr-data-lake-query-baseline-gap",
      description: "Seed a realistic gap where Query method sits between SQL required and Natural language, so the agent can detect, narrate, and recommend remediation.",
      affectedEntities: [
        "analytics_events",
        "historical_metrics",
      ],
      discoveryPath: [
        "Inspect Google BigQuery records for the affected entities",
        "Compare against Workday historical baseline",
        "Generate a citation-backed recommendation",
      ],
      expectedEvidence: [
        "source-system record",
        "historical baseline metric",
        "generated audit trail",
      ],
      expectedRecommendation: "Explain the gap, cite supporting evidence, and propose the next People Analyst action.",
    },
  ],
  datastorePackaging: {
    alloydb: {
      database: "hr_data_lake_query",
      schemas: [
        "workday",
        "google_cloud",
      ],
    },
    bigquery: {
      dataset: "hr_hr_data_lake_query",
      tables: [
        "kpi_summary",
        "evidence_index",
      ],
    },
    cloudStorage: {
      bucketSuffix: "hr-data-lake-query-evidence",
      prefixes: [
        "documents",
        "audit-trails",
        "exports",
      ],
    },
    apis: {
      serviceName: "hr-data-lake-query-source-adapters",
      deploymentTarget: "cloud_run",
    },
  },
  validation: {
    smokePrompt: "Run the HR Data Lake Query workflow and cite source-system evidence for every claim.",
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

export const HRDataLakeQuery = () => (
  <UseCaseSlide
    triggerType="chat"
    swimlane={swimlane}
    title="HR Data Lake Query"
    subtitle="A-1001 • People Analytics"
    icon={Search}
    domainId="domain-10"
    layer="Layer 4: Data Agent"
    persona="People Analyst"
    systems={["Google BigQuery", "Workday", "Looker", "Google Cloud"]}
    kpis={[
      { label: "Query method", before: "SQL required", after: "Natural language" },
      { label: "Report generation", before: "Days", after: "Minutes" },
      { label: "Data access", before: "Analyst bottleneck", after: "Self-service" }
    ]}
    statusQuo={[
      "Ad-hoc analysis requires technical SQL skills or BI team requests.",
      "Joining data across HRIS, ATS, and LMS takes days or weeks.",
      "Leaders rely on static reports that don't answer follow-up questions."
    ]}
    agentification={[
      "Natural language interface to the unified HR data lake.",
      "Instant NL-to-SQL translation for complex cross-domain queries.",
      "Self-service visualization generation for HRBPs and executives."
    ]}
    architecture={architecture}
    flow={[
      { label: "Natural Language Query", icon: Search, description: "User asks question in plain English.", trigger: "On-demand", systems: ["Portal"] },
      { label: "Query Translation", icon: Brain, description: "NL translated to optimized SQL across HR data lake.", systems: ["Gemini", "BigQuery"], integration: "Data Agent" },
      { label: "Visualization", icon: BarChart, description: "Results auto-visualized with appropriate chart types." },
      { label: "Export & Share", icon: Send, description: "Reports exported or scheduled for stakeholders.", output: "Analytics Report" }
    ]}
  />
);
