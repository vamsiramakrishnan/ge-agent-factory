import React from "react";
import { UseCaseSlide } from "../../../agent/UseCaseSlide";
import { FlowStep } from "../../../agent/ProcessFlow";
import { SwimlaneFlow } from "../../../agent/SwimlaneFlow";
import { AgentArchitecture, UseCaseGenerationSpec, AgentBehaviorContract} from "../../../../types/architecture";
import { Scale, RefreshCw, Brain, Eye, Target } from "lucide-react";

const flow: FlowStep[] = [
  { label: "Comp Data Sync", icon: RefreshCw, description: "Compensation, demographics, role data aggregated.", trigger: "Continuous", systems: ["HRIS"] },
  { label: "Regression Analysis", icon: Brain, description: "Multi-variable pay equity regression with controls.", systems: ["Gemini", "BigQuery"], integration: "ADK" },
  { label: "Gap Identification", icon: Eye, description: "Statistically significant gaps flagged with root cause." },
  { label: "Remediation Plan", icon: Target, description: "Targeted adjustments with budget impact modeled.", output: "Equity Report" },
];

const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "trigger", label: "Comp Data Sync", lane: "system", type: "trigger" },
    { id: "regression", label: "Regression Analysis", lane: "agent", type: "action" },
    { id: "gap", label: "Gap Identification", lane: "agent", type: "action" },
    { id: "hitl", label: "CHRO Approves Remediation", lane: "human", type: "hitl" },
    { id: "output", label: "Equity Report", lane: "agent", type: "output" },
  ],
  connections: [["trigger", "regression"], ["regression", "gap"], ["gap", "hitl"], ["hitl", "output"]],
};

const architecture: AgentArchitecture = {
  connections: [
    { system: "Workday", description: "Compensation records, demographics, job profiles, tenure data", direction: "read", protocol: "REST API", category: "erp" },
    { system: "BigQuery", description: "Pay equity regression models, historical audit results, remediation tracking", direction: "bidirectional", protocol: "BigQuery SQL", category: "analytics" },
    { system: "Vertex AI (Gemini)", description: "Multi-variable regression analysis, gap root-cause reasoning, remediation narrative", direction: "bidirectional", protocol: "gRPC", category: "ai" },
  ],
  pipeline: [
    { label: "Compensation Data Sync", description: "Aggregate compensation, demographics, role, tenure, and performance data from Workday. Normalize across pay structures, currencies, and jurisdictions.", systems: ["Workday"], layer: "integration", dataIn: "Raw comp records across all employees", dataOut: "Normalized comp dataset with demographic controls" },
    { label: "Multi-Variable Regression", description: "Run pay equity regressions controlling for legitimate factors (role, experience, performance, location). Identify statistically significant gaps by gender, ethnicity, and intersectional groups.", systems: ["BigQuery", "Vertex AI (Gemini)"], layer: "ml", dataIn: "Normalized comp dataset with control variables", dataOut: "Statistical gap analysis with confidence intervals" },
    { label: "Root Cause & Remediation", description: "Gemini reasons about gap root causes -- hiring, promotion velocity, or market adjustments. Models targeted remediation costs and prioritizes adjustments by impact and budget.", systems: ["Vertex AI (Gemini)"], layer: "llm", dataIn: "Gap analysis + historical promotion/hire data", dataOut: "Remediation plan with cost projections" },
    { label: "Executive Reporting", description: "Equity audit report formatted for CHRO review with drill-down by org unit, job family, and demographic dimension. Remediation tracking dashboard updated.", systems: ["Looker", "Google Sheets"], layer: "integration", dataIn: "Approved remediation plan", dataOut: "Board-ready equity audit report" },
  ],
};


const behaviorContract: AgentBehaviorContract = {
  role: "CHRO agent for the Pay Equity Audit workflow",
  primaryObjective: "Continuous multi-variate regression on compensation data. Real-time identification of statistically significant gaps. so the CHRO can move the Audit frequency KPI.",
  inScope: [
    "Continuous multi-variate regression on compensation data",
    "Real-time identification of statistically significant gaps",
    "Remediation cost modeling integrated into budget planning",
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
      description: "Retrieve employees from Workday for the Pay Equity Audit workflow.",
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
      name: "query_google_bigquery_analytics_events",
      kind: "query",
      sourceSystemId: "google_bigquery",
      description: "Retrieve analytics events from Google BigQuery for the Pay Equity Audit workflow.",
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
      name: "query_syndio_syndio_records",
      kind: "query",
      sourceSystemId: "syndio",
      description: "Retrieve syndio records from Syndio for the Pay Equity Audit workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "syndio_records_records",
        "syndio_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_google_sheets_sheets",
      kind: "query",
      sourceSystemId: "google_sheets",
      description: "Retrieve sheets from Google Sheets for the Pay Equity Audit workflow.",
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
      name: "lookup_pay_equity_audit_policy_handbook",
      kind: "evidence_lookup",
      sourceSystemId: "google_bigquery",
      description: "Look up sections of the Pay Equity Audit Policy Handbook to cite in narrative output, escalation rationale, and audit evidence.",
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
      claim: "Audit frequency moved from Annual toward Continuous",
      mustCite: [
        "workday.employees",
        "google_bigquery.analytics_events",
      ],
      sourceSystemIds: [
        "workday",
        "google_bigquery",
      ],
    },
    {
      claim: "Gap detection moved from Broad averages toward Regression-based",
      mustCite: [
        "workday.employees",
        "google_bigquery.analytics_events",
      ],
      sourceSystemIds: [
        "workday",
        "google_bigquery",
      ],
    },
  ],
  escalationRules: [
    {
      trigger: "Audit frequency regresses past the Annual baseline by more than 20%",
      action: "escalate_to_human",
      handoffTarget: "CHRO",
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
    "Never fabricate metric values; only publish numbers derived from Workday (and other named systems) entities.",
    "Never bypass CHRO approval on escalation triggers, even when confidence is high.",
    "Never expose individual personal data (PII) in summaries; aggregate or pseudonymise before output.",
    "Never act on data older than the staleness threshold defined in the runbook without a fresh re-query.",
  ],
  goldenEvals: [
    {
      id: "pay-equity-audit-end-to-end",
      prompt: "Run the Pay Equity Audit workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.",
      expectedToolCalls: [
        "query_workday_employees",
        "query_google_bigquery_analytics_events",
        "query_syndio_syndio_records",
        "query_google_sheets_sheets",
        "lookup_pay_equity_audit_policy_handbook",
        "action_workday_execute",
      ],
      mustReferenceEntities: [
        "employees",
        "analytics_events",
        "syndio_records",
        "sheets",
      ],
      mustCiteDocuments: [
        "pay-equity-audit-policy-handbook",
      ],
      expectedActionOutcome: "Action execute executed against Workday, with audit-trail entry and CHRO notified of outcomes.",
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
    rationale: "Row counts sized for Pay Equity Audit so the agent can demonstrate the workflow against realistic transactional volume without simulating a production warehouse.",
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
      id: "syndio",
      name: "Syndio",
      owns: [
        "syndio_records",
        "syndio_events",
        "syndio_audit_trail",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_syndio_syndio_records",
        "query_syndio_syndio_events",
        "query_syndio_syndio_audit_trail",
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
      name: "syndio_records",
      sourceSystemId: "syndio",
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
      name: "syndio_events",
      sourceSystemId: "syndio",
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
          name: "syndio_record_id",
          type: "ref",
          ref: "syndio_records.id",
          required: true,
        },
      ],
    },
    {
      name: "syndio_audit_trail",
      sourceSystemId: "syndio",
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
  ],
  relationships: [
    {
      from: "analytics_events.historical_metric_id",
      to: "historical_metrics.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
    {
      from: "syndio_events.syndio_record_id",
      to: "syndio_records.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
    {
      from: "edit_history.sheet_id",
      to: "sheets.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
  ],
  documents: [
    {
      id: "pay-equity-audit-policy-handbook",
      sourceSystemId: "google_bigquery",
      type: "policy",
      title: "Pay Equity Audit Policy Handbook",
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
      id: "pay-equity-audit-baseline-gap",
      description: "Seed a realistic gap where Audit frequency sits between Annual and Continuous, so the agent can detect, narrate, and recommend remediation.",
      affectedEntities: [
        "employees",
        "positions",
      ],
      discoveryPath: [
        "Inspect Workday records for the affected entities",
        "Compare against Google BigQuery historical baseline",
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
      database: "pay_equity_audit",
      schemas: [
        "workday",
        "syndio",
        "google_sheets",
      ],
    },
    bigquery: {
      dataset: "hr_pay_equity_audit",
      tables: [
        "kpi_summary",
        "evidence_index",
      ],
    },
    cloudStorage: {
      bucketSuffix: "pay-equity-audit-evidence",
      prefixes: [
        "documents",
        "audit-trails",
        "exports",
      ],
    },
    apis: {
      serviceName: "pay-equity-audit-source-adapters",
      deploymentTarget: "cloud_run",
    },
  },
  validation: {
    smokePrompt: "Run the Pay Equity Audit workflow and cite source-system evidence for every claim.",
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

export const PayEquityAudit = () => (
  <UseCaseSlide
    title="Pay Equity Audit"
    subtitle="A-404 • Total Rewards"
    icon={Scale}
    domainId="domain-4"
    layer="Layer 3: Custom ADK"
    persona="CHRO"
    systems={["Workday", "Google BigQuery", "Syndio", "Google Sheets"]}
    kpis={[
      { label: "Audit frequency", before: "Annual", after: "Continuous" },
      { label: "Gap detection", before: "Broad averages", after: "Regression-based" },
      { label: "Remediation speed", before: "6 months", after: "Real-time" },
    ]}
    flow={flow}
    triggerType="scheduled"
    swimlane={swimlane}
    architecture={architecture}
    hitl={{ actor: "CHRO", action: "Approve remediation plan", description: "Agent runs continuous pay equity regression analysis. CHRO reviews statistically significant gaps and approves targeted remediation adjustments before implementation." }}
    statusQuo={[
      "Audits done annually with expensive external consultants.",
      "Static reports provide no ability to model remediation.",
      "Gaps discovered too late to fix within budget cycles."
    ]}
    agentification={[
      "Continuous multi-variate regression on compensation data.",
      "Real-time identification of statistically significant gaps.",
      "Remediation cost modeling integrated into budget planning."
    ]}
  />
);
