import React from "react";
import { UseCaseSlide } from "../../../agent/UseCaseSlide";
import { FlowStep } from "../../../agent/ProcessFlow";
import { SwimlaneFlow } from "../../../agent/SwimlaneFlow";
import { AgentArchitecture, UseCaseGenerationSpec, AgentBehaviorContract} from "../../../../types/architecture";
import { TrendingUp, Download, Brain, FileText } from "lucide-react";

const flow: FlowStep[] = [
  { label: "Feedback Ingestion", icon: Download, description: "360, pulse, peer feedback data aggregated.", trigger: "Continuous", systems: ["HRIS", "Surveys"] },
  { label: "NLP Analysis", icon: Brain, description: "Theme extraction, sentiment trends, pattern detection.", systems: ["Gemini", "BigQuery"], integration: "Data Agent" },
  { label: "Trend Mapping", icon: TrendingUp, description: "Longitudinal trends by team, manager, individual." },
  { label: "Review Input", icon: FileText, description: "Auto-generated performance review input summary.", output: "Trend Report" },
];

const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "trigger", label: "Feedback Ingestion", lane: "system", type: "trigger" },
    { id: "nlp", label: "NLP Analysis", lane: "agent", type: "action" },
    { id: "trends", label: "Trend Mapping", lane: "agent", type: "action" },
    { id: "output", label: "Review Input Summary", lane: "agent", type: "output" },
  ],
  connections: [["trigger", "nlp"], ["nlp", "trends"], ["trends", "output"]],
};

const architecture: AgentArchitecture = {
  connections: [
    { system: "Workday", description: "Performance reviews, manager assessments, historical ratings", direction: "read", protocol: "REST API", category: "erp" },
    { system: "Lattice", description: "360 feedback, peer reviews, pulse survey responses", direction: "read", protocol: "REST API", category: "erp" },
    { system: "BigQuery", description: "Feedback analytics warehouse, longitudinal trend data", direction: "bidirectional", protocol: "BigQuery SQL", category: "analytics" },
    { system: "Vertex AI (Gemini)", description: "NLP theme extraction, sentiment analysis, trend synthesis", direction: "bidirectional", protocol: "gRPC", category: "ai" },
  ],
  pipeline: [
    { label: "Feedback Aggregation", description: "Ingest 360 feedback, pulse surveys, and peer reviews from Lattice and Workday. Normalize and store in BigQuery analytics warehouse.", systems: ["Workday", "Lattice", "BigQuery"], layer: "integration", dataIn: "360s, pulse surveys, peer reviews, manager notes", dataOut: "Unified feedback corpus in BigQuery" },
    { label: "NLP Theme Extraction", description: "Gemini performs NLP analysis to extract recurring themes, sentiment trends, and development patterns across all feedback channels.", systems: ["Vertex AI (Gemini)", "BigQuery"], layer: "llm", dataIn: "Unified feedback corpus", dataOut: "Theme clusters with sentiment scores" },
    { label: "Longitudinal Trend Analysis", description: "Time-series analysis of feedback themes by team, manager, and individual. Generate review input summaries with evidence citations.", systems: ["BigQuery"], layer: "ml", dataIn: "Theme clusters + historical data", dataOut: "Trend reports with review input summaries" },
  ],
};


const behaviorContract: AgentBehaviorContract = {
  role: "HRBP agent for the Feedback Trend Analyzer workflow",
  primaryObjective: "NLP-powered feedback theme extraction across all feedback channels. Sentiment trend analysis tracking employee development over time. so the HRBP can move the Feedback aggregation KPI.",
  inScope: [
    "NLP-powered feedback theme extraction across all feedback channels",
    "Sentiment trend analysis tracking employee development over time",
    "Auto-generated performance review input summaries with evidence citations",
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
      description: "Retrieve employees from Workday for the Feedback Trend Analyzer workflow.",
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
      name: "query_lattice_engagement_surveys",
      kind: "query",
      sourceSystemId: "lattice",
      description: "Retrieve engagement surveys from Lattice for the Feedback Trend Analyzer workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "engagement_surveys_records",
        "engagement_surveys_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_google_bigquery_analytics_events",
      kind: "query",
      sourceSystemId: "google_bigquery",
      description: "Retrieve analytics events from Google BigQuery for the Feedback Trend Analyzer workflow.",
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
      description: "Retrieve survey platform records from Survey Platform for the Feedback Trend Analyzer workflow.",
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
      name: "lookup_feedback_trend_analyzer_policy_handbook",
      kind: "evidence_lookup",
      sourceSystemId: "google_bigquery",
      description: "Look up sections of the Feedback Trend Analyzer Policy Handbook to cite in narrative output, escalation rationale, and audit evidence.",
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
      name: "action_workday_generate",
      kind: "action",
      sourceSystemId: "workday",
      description: "Execute the generate step in Workday after the agent has gathered evidence and validated escalation gates.",
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
      claim: "Feedback aggregation moved from Never toward Continuous",
      mustCite: [
        "workday.employees",
        "lattice.engagement_surveys",
      ],
      sourceSystemIds: [
        "workday",
        "lattice",
      ],
    },
    {
      claim: "Theme detection moved from Manual read toward NLP-automated",
      mustCite: [
        "workday.employees",
        "lattice.engagement_surveys",
      ],
      sourceSystemIds: [
        "workday",
        "lattice",
      ],
    },
  ],
  escalationRules: [
    {
      trigger: "Feedback aggregation regresses past the Never baseline by more than 20%",
      action: "escalate_to_human",
      handoffTarget: "HRBP",
      rationale: "Significant regressions need human judgment before automated remediation runs against production records.",
    },
    {
      trigger: "Source-system evidence is incomplete or stale (>24h) for any required entity",
      action: "request_more_info",
      rationale: "Recommendations grounded in stale evidence misrepresent current state and undermine audit defensibility.",
    },
    {
      trigger: "Proposed generate action lacks supporting evidence from at least two systems",
      action: "refuse",
      rationale: "Single-system evidence is insufficient to authorize external state changes without manual review.",
    },
  ],
  refusalRules: [
    "Never fabricate metric values; only publish numbers derived from Workday (and other named systems) entities.",
    "Never bypass HRBP approval on escalation triggers, even when confidence is high.",
    "Never expose individual personal data (PII) in summaries; aggregate or pseudonymise before output.",
    "Never act on data older than the staleness threshold defined in the runbook without a fresh re-query.",
  ],
  goldenEvals: [
    {
      id: "feedback-trend-analyzer-end-to-end",
      prompt: "Run the Feedback Trend Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.",
      expectedToolCalls: [
        "query_workday_employees",
        "query_lattice_engagement_surveys",
        "query_google_bigquery_analytics_events",
        "query_survey_platform_survey_platform_records",
        "lookup_feedback_trend_analyzer_policy_handbook",
        "action_workday_generate",
      ],
      mustReferenceEntities: [
        "employees",
        "engagement_surveys",
        "analytics_events",
        "survey_platform_records",
      ],
      mustCiteDocuments: [
        "feedback-trend-analyzer-policy-handbook",
      ],
      expectedActionOutcome: "Action generate executed against Workday, with audit-trail entry and HRBP notified of outcomes.",
      forbiddenBehaviors: [
        "do not invent KPI numbers",
        "do not skip the evidence_lookup step before any recommendation",
        "do not execute generate without two-system evidence",
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
    rationale: "Row counts sized for Feedback Trend Analyzer so the agent can demonstrate the workflow against realistic transactional volume without simulating a production warehouse.",
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
      id: "lattice",
      name: "Lattice",
      owns: [
        "engagement_surveys",
        "feedback_records",
        "review_cycles",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_lattice_engagement_surveys",
        "query_lattice_feedback_records",
        "query_lattice_review_cycles",
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
      name: "engagement_surveys",
      sourceSystemId: "lattice",
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
      name: "feedback_records",
      sourceSystemId: "lattice",
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
      name: "review_cycles",
      sourceSystemId: "lattice",
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
      id: "feedback-trend-analyzer-policy-handbook",
      sourceSystemId: "google_bigquery",
      type: "policy",
      title: "Feedback Trend Analyzer Policy Handbook",
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
      id: "workday_generate_api",
      sourceSystemId: "workday",
      method: "POST",
      path: "/api/workday/generate",
      description: "Synchronous endpoint the agent calls to generate in Workday after evidence gating.",
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
      id: "feedback-trend-analyzer-baseline-gap",
      description: "Seed a realistic gap where Feedback aggregation sits between Never and Continuous, so the agent can detect, narrate, and recommend remediation.",
      affectedEntities: [
        "employees",
        "positions",
      ],
      discoveryPath: [
        "Inspect Workday records for the affected entities",
        "Compare against Lattice historical baseline",
        "Generate a citation-backed recommendation",
      ],
      expectedEvidence: [
        "source-system record",
        "historical baseline metric",
        "generated audit trail",
      ],
      expectedRecommendation: "Explain the gap, cite supporting evidence, and propose the next HRBP action.",
    },
  ],
  datastorePackaging: {
    alloydb: {
      database: "feedback_trend_analyzer",
      schemas: [
        "workday",
        "lattice",
        "survey_platform",
      ],
    },
    bigquery: {
      dataset: "hr_feedback_trend_analyzer",
      tables: [
        "kpi_summary",
        "evidence_index",
      ],
    },
    cloudStorage: {
      bucketSuffix: "feedback-trend-analyzer-evidence",
      prefixes: [
        "documents",
        "audit-trails",
        "exports",
      ],
    },
    apis: {
      serviceName: "feedback-trend-analyzer-source-adapters",
      deploymentTarget: "cloud_run",
    },
  },
  validation: {
    smokePrompt: "Run the Feedback Trend Analyzer workflow and cite source-system evidence for every claim.",
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

export const FeedbackTrendAnalyzer = () => (
  <UseCaseSlide
    title="Feedback Trend Analyzer"
    subtitle="A-304 • Performance Mgmt"
    icon={TrendingUp}
    domainId="domain-3"
    layer="Layer 4: Data Agent"
    persona="HRBP"
    systems={["Workday", "Lattice", "Google BigQuery", "Survey Platform"]}
    kpis={[
      { label: "Feedback aggregation", before: "Never", after: "Continuous" },
      { label: "Theme detection", before: "Manual read", after: "NLP-automated" },
      { label: "Review input quality", before: "Sparse", after: "Rich longitudinal" },
    ]}
    flow={flow}
    triggerType="scheduled"
    swimlane={swimlane}
    architecture={architecture}
    statusQuo={[
      "Feedback collected but never aggregated into actionable insights.",
      "Patterns and themes invisible across teams and time periods.",
      "Performance reviews lack longitudinal data to support fair assessments."
    ]}
    agentification={[
      "NLP-powered feedback theme extraction across all feedback channels.",
      "Sentiment trend analysis tracking employee development over time.",
      "Auto-generated performance review input summaries with evidence citations."
    ]}
  />
);
