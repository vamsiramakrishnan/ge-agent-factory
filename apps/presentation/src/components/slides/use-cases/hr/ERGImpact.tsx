import React from "react";
import { UseCaseSlide } from "../../../agent/UseCaseSlide";
import { FlowStep } from "../../../agent/ProcessFlow";
import { SwimlaneFlow } from "../../../agent/SwimlaneFlow";
import { AgentArchitecture, UseCaseGenerationSpec, AgentBehaviorContract} from "../../../../types/architecture";
import { Users, Download, Brain, Calculator, FileText } from "lucide-react";

const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "n1", label: "ERG Activity Data", lane: "system", type: "trigger" },
    { id: "n2", label: "Impact Analysis", lane: "agent", type: "action" },
    { id: "n3", label: "ROI Calculation", lane: "agent", type: "action" },
    { id: "n4", label: "Impact Report", lane: "agent", type: "output" },
  ],
  connections: [["n1", "n2"], ["n2", "n3"], ["n3", "n4"]],
};

const architecture: AgentArchitecture = {
  connections: [
    { system: "Workday", description: "Employee data, retention metrics, engagement scores for ERG members", direction: "read", protocol: "REST API", category: "erp" },
    { system: "Slack", description: "ERG channel activity, event RSVPs, member engagement signals", direction: "read", protocol: "REST API", category: "collaboration" },
    { system: "BigQuery", description: "ERG analytics warehouse, membership trends, impact correlation data", direction: "bidirectional", protocol: "BigQuery SQL", category: "analytics" },
    { system: "Looker", description: "ERG impact dashboards, executive sponsor reports, budget tracking", direction: "write", protocol: "Looker API", category: "analytics" },
    { system: "Vertex AI (Gemini)", description: "Impact correlation reasoning, ROI calculation, recommendation generation", direction: "bidirectional", protocol: "gRPC", category: "ai" },
  ],
  pipeline: [
    { label: "Activity Data Aggregation", description: "Aggregate ERG membership, event participation, and Slack channel activity. Link to Workday employee records for retention and engagement correlation.", systems: ["Workday", "Slack"], layer: "integration", dataIn: "ERG events + membership + Slack activity + employee data", dataOut: "Unified ERG activity dataset with employee linkage" },
    { label: "Impact Correlation", description: "Correlate ERG participation with retention, engagement, and promotion outcomes. Use statistical methods to isolate ERG impact from confounding variables.", systems: ["BigQuery"], layer: "ml", dataIn: "ERG activity dataset + outcome data", dataOut: "Impact correlation with statistical significance" },
    { label: "ROI Calculation", description: "Gemini quantifies business value of ERG programs — retention savings, engagement lift, talent pipeline contribution. Generate budget justification with defensible metrics.", systems: ["Vertex AI (Gemini)"], layer: "llm", dataIn: "Impact correlations + budget data + retention costs", dataOut: "ROI report with business value quantification" },
    { label: "Executive Dashboard", description: "Publish ERG impact dashboards in Looker with membership growth, budget utilization, and business impact metrics. Generate executive sponsor reports with growth recommendations.", systems: ["Looker"], layer: "integration", dataIn: "ROI report + trend data", dataOut: "Executive dashboard with sponsor reports" },
  ],
};


const behaviorContract: AgentBehaviorContract = {
  role: "DEI Lead agent for the ERG Engagement & Impact workflow",
  primaryObjective: "Automated tracking of membership and event participation. Quantified impact reports linking ERG activity to retention. so the DEI Lead can move the Impact measurement KPI.",
  inScope: [
    "Automated tracking of membership and event participation",
    "Quantified impact reports linking ERG activity to retention",
    "Real-time budget utilization and executive sponsor dashboards",
  ],
  outOfScope: [
    "Final hiring, termination, or compensation decisions (HRBP/leadership retains authority)",
    "Performance management adjudication and disciplinary action",
    "Legal interpretation of employment law in ambiguous jurisdictions",
  ],
  toolIntents: [
    {
      name: "query_recognition_platform_recognition_platform_records",
      kind: "query",
      sourceSystemId: "recognition_platform",
      description: "Retrieve recognition platform records from Recognition Platform for the ERG Engagement & Impact workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "recognition_platform_records_records",
        "recognition_platform_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_workday_employees",
      kind: "query",
      sourceSystemId: "workday",
      description: "Retrieve employees from Workday for the ERG Engagement & Impact workflow.",
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
      description: "Retrieve analytics events from Google BigQuery for the ERG Engagement & Impact workflow.",
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
      name: "query_survey_platform_survey_platform_records",
      kind: "query",
      sourceSystemId: "survey_platform",
      description: "Retrieve survey platform records from Survey Platform for the ERG Engagement & Impact workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "survey_platform_records_records",
        "survey_platform_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "lookup_erg_engagement_impact_policy_handbook",
      kind: "evidence_lookup",
      sourceSystemId: "google_bigquery",
      description: "Look up sections of the ERG Engagement & Impact Policy Handbook to cite in narrative output, escalation rationale, and audit evidence.",
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
      claim: "Impact measurement moved from Participation count toward Business impact",
      mustCite: [
        "recognition_platform.recognition_platform_records",
        "workday.employees",
      ],
      sourceSystemIds: [
        "recognition_platform",
        "workday",
      ],
    },
    {
      claim: "Budget justification moved from Anecdotal toward ROI-proven",
      mustCite: [
        "recognition_platform.recognition_platform_records",
        "workday.employees",
      ],
      sourceSystemIds: [
        "recognition_platform",
        "workday",
      ],
    },
  ],
  escalationRules: [
    {
      trigger: "Impact measurement regresses past the Participation count baseline by more than 20%",
      action: "escalate_to_human",
      handoffTarget: "DEI Lead",
      rationale: "Significant regressions need human judgment before automated remediation runs against production records.",
    },
    {
      trigger: "Source-system evidence is incomplete or stale (>24h) for any required entity",
      action: "request_more_info",
      rationale: "Recommendations grounded in stale evidence misrepresent current state and undermine audit defensibility.",
    },
  ],
  refusalRules: [
    "Never fabricate metric values; only publish numbers derived from Recognition Platform (and other named systems) entities.",
    "Never bypass DEI Lead approval on escalation triggers, even when confidence is high.",
    "Never expose individual personal data (PII) in summaries; aggregate or pseudonymise before output.",
    "Never act on data older than the staleness threshold defined in the runbook without a fresh re-query.",
  ],
  goldenEvals: [
    {
      id: "erg-engagement-impact-end-to-end",
      prompt: "Run the ERG Engagement & Impact workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.",
      expectedToolCalls: [
        "query_recognition_platform_recognition_platform_records",
        "query_workday_employees",
        "query_google_bigquery_analytics_events",
        "query_survey_platform_survey_platform_records",
        "lookup_erg_engagement_impact_policy_handbook",
      ],
      mustReferenceEntities: [
        "recognition_platform_records",
        "employees",
        "analytics_events",
        "survey_platform_records",
      ],
      mustCiteDocuments: [
        "erg-engagement-impact-policy-handbook",
      ],
      expectedActionOutcome: "DEI Lead receives a fully-cited recommendation; no external state change without explicit approval.",
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
    rationale: "Row counts sized for ERG Engagement & Impact so the agent can demonstrate the workflow against realistic transactional volume without simulating a production warehouse.",
  },
  sourceSystems: [
    {
      id: "recognition_platform",
      name: "Recognition Platform",
      owns: [
        "recognition_platform_records",
        "recognition_platform_events",
        "recognition_platform_audit_trail",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_recognition_platform_recognition_platform_records",
        "query_recognition_platform_recognition_platform_events",
        "query_recognition_platform_recognition_platform_audit_trail",
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
      id: "survey_platform",
      name: "Survey Platform",
      owns: [
        "survey_platform_records",
        "survey_platform_events",
        "survey_platform_audit_trail",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_survey_platform_survey_platform_records",
        "query_survey_platform_survey_platform_events",
        "query_survey_platform_survey_platform_audit_trail",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
  ],
  entities: [
    {
      name: "recognition_platform_records",
      sourceSystemId: "recognition_platform",
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
      name: "recognition_platform_events",
      sourceSystemId: "recognition_platform",
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
          name: "recognition_platform_record_id",
          type: "ref",
          ref: "recognition_platform_records.id",
          required: true,
        },
      ],
    },
    {
      name: "recognition_platform_audit_trail",
      sourceSystemId: "recognition_platform",
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
      name: "survey_platform_records",
      sourceSystemId: "survey_platform",
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
          name: "respondent_id",
          type: "seq",
          required: true,
        },
        {
          name: "question_code",
          type: "lorem.words",
          required: true,
        },
        {
          name: "score",
          type: "number",
          min: 1,
          max: 10,
          required: true,
        },
        {
          name: "comment",
          type: "lorem.sentence",
        },
        {
          name: "submitted_at",
          type: "date",
          required: true,
        },
      ],
    },
    {
      name: "survey_platform_events",
      sourceSystemId: "survey_platform",
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
          name: "survey_platform_record_id",
          type: "ref",
          ref: "survey_platform_records.id",
          required: true,
        },
      ],
    },
    {
      name: "survey_platform_audit_trail",
      sourceSystemId: "survey_platform",
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
  ],
  relationships: [
    {
      from: "recognition_platform_events.recognition_platform_record_id",
      to: "recognition_platform_records.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
    {
      from: "analytics_events.historical_metric_id",
      to: "historical_metrics.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
    {
      from: "survey_platform_events.survey_platform_record_id",
      to: "survey_platform_records.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
  ],
  documents: [
    {
      id: "erg-engagement-impact-policy-handbook",
      sourceSystemId: "google_bigquery",
      type: "policy",
      title: "ERG Engagement & Impact Policy Handbook",
      requiredSections: [
        "Eligibility and scope",
        "Workflow steps",
        "Manager responsibilities",
        "Compliance and audit",
        "Sensitive-data handling",
      ],
      linkedEntities: [
        "recognition_platform_records",
        "recognition_platform_events",
        "recognition_platform_audit_trail",
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
      id: "erg-engagement-impact-baseline-gap",
      description: "Seed a realistic gap where Impact measurement sits between Participation count and Business impact, so the agent can detect, narrate, and recommend remediation.",
      affectedEntities: [
        "recognition_platform_records",
        "recognition_platform_events",
      ],
      discoveryPath: [
        "Inspect Recognition Platform records for the affected entities",
        "Compare against Workday historical baseline",
        "Generate a citation-backed recommendation",
      ],
      expectedEvidence: [
        "source-system record",
        "historical baseline metric",
        "generated audit trail",
      ],
      expectedRecommendation: "Explain the gap, cite supporting evidence, and propose the next DEI Lead action.",
    },
  ],
  datastorePackaging: {
    alloydb: {
      database: "erg_engagement_impact",
      schemas: [
        "recognition_platform",
        "workday",
        "survey_platform",
      ],
    },
    bigquery: {
      dataset: "hr_erg_engagement_impact",
      tables: [
        "kpi_summary",
        "evidence_index",
      ],
    },
    cloudStorage: {
      bucketSuffix: "erg-engagement-impact-evidence",
      prefixes: [
        "documents",
        "audit-trails",
        "exports",
      ],
    },
    apis: {
      serviceName: "erg-engagement-impact-source-adapters",
      deploymentTarget: "cloud_run",
    },
  },
  validation: {
    smokePrompt: "Run the ERG Engagement & Impact workflow and cite source-system evidence for every claim.",
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

export const ERGImpact = () => (
  <UseCaseSlide
    triggerType="scheduled"
    swimlane={swimlane}
    title="ERG Engagement & Impact"
    subtitle="A-904 • DEI & Belonging"
    icon={Users}
    domainId="domain-9"
    layer="Layer 4: Data Agent"
    persona="DEI Lead"
    systems={["Recognition Platform", "Workday", "Google BigQuery", "Survey Platform"]}
    kpis={[
      { label: "Impact measurement", before: "Participation count", after: "Business impact" },
      { label: "Budget justification", before: "Anecdotal", after: "ROI-proven" },
      { label: "Engagement correlation", before: "Assumed", after: "Validated" }
    ]}
    statusQuo={[
      "ERG membership and event data tracked in manual spreadsheets.",
      "Business impact of ERGs is anecdotal and difficult to quantify.",
      "Budget utilization reporting is ad-hoc and disjointed."
    ]}
    agentification={[
      "Automated tracking of membership and event participation.",
      "Quantified impact reports linking ERG activity to retention.",
      "Real-time budget utilization and executive sponsor dashboards."
    ]}
    architecture={architecture}
    flow={[
      { label: "ERG Activity Data", icon: Download, description: "Events, membership, participation aggregated.", trigger: "Quarterly", systems: ["ERG Platform"] },
      { label: "Impact Analysis", icon: Brain, description: "ERG participation correlated to retention and engagement.", systems: ["Gemini", "BigQuery"], integration: "Data Agent" },
      { label: "ROI Calculation", icon: Calculator, description: "Business value of ERG programs quantified." },
      { label: "Impact Report", icon: FileText, description: "Executive report with growth recommendations.", output: "ERG Impact Report" }
    ]}
  />
);
