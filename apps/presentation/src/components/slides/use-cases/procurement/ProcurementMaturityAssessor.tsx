import React from "react";
import { UseCaseSlide } from "../../../agent/UseCaseSlide";
import { FlowStep } from "../../../agent/ProcessFlow";
import { SwimlaneFlow } from "../../../agent/SwimlaneFlow";
import { AgentArchitecture, UseCaseGenerationSpec, AgentBehaviorContract} from "../../../../types/architecture";
import { Award, ClipboardList, Brain, Target, CheckCircle } from "lucide-react";

const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "s1", label: "Survey & Metrics", lane: "system", type: "trigger" },
    { id: "a1", label: "NLP Assessment", lane: "agent", type: "action" },
    { id: "a2", label: "Benchmark Scoring", lane: "agent", type: "action" },
    { id: "a3", label: "Roadmap Generation", lane: "agent", type: "output" },
    { id: "h1", label: "CPO Reviews", lane: "human", type: "hitl" },
  ],
  connections: [["s1", "a1"], ["a1", "a2"], ["a2", "a3"], ["a3", "h1"]],
};

const flow: FlowStep[] = [
  { label: "Data Collection", icon: ClipboardList, description: "Self-assessment surveys and process metrics gathered from teams.", trigger: "Annual / On-demand", systems: ["Survey Tools", "Internal Process Metrics"] },
  { label: "NLP Analysis", icon: Brain, description: "Free-text responses analyzed to extract qualitative pain points alongside scores.", systems: ["Vertex AI", "BigQuery"], integration: "ADK" },
  { label: "Framework Scoring", icon: Target, description: "Automated benchmarking against Hackett/CAPS maturity frameworks across 25+ dimensions.", systems: ["Benchmark Databases"] },
  { label: "CPO Approval", icon: CheckCircle, description: "CPO validates gap prioritization and approves transformation roadmap.", output: "Maturity Roadmap" },
];

const architecture: AgentArchitecture = {
  connections: [
    { system: "Survey Tools", description: "Self-assessment questionnaires distributed to procurement teams and stakeholders", direction: "read", protocol: "REST API", category: "collaboration" },
    { system: "Internal Process Metrics", description: "Operational KPIs from procurement systems — cycle times, touchless rates, spend coverage", direction: "read", protocol: "REST API", category: "erp" },
    { system: "Benchmark Databases", description: "Hackett, CAPS, and Gartner maturity frameworks with peer comparison data", direction: "read", protocol: "REST API", category: "market-data" },
    { system: "BigQuery", description: "Maturity scores, gap analysis storage, historical assessment trends", direction: "bidirectional", protocol: "BigQuery SQL", category: "analytics" },
    { system: "Vertex AI (Gemini)", description: "Free-text survey analysis and diagnostic narrative generation", direction: "bidirectional", protocol: "gRPC", category: "ai" },
  ],
  pipeline: [
    { label: "Survey & Metrics Collection", description: "Distribute assessment surveys, collect responses, pull process KPIs from operational systems. Aggregate quantitative scores and free-text feedback into a unified assessment dataset.", systems: ["Survey Tools", "Internal Process Metrics"], layer: "integration", dataIn: "Survey responses + operational KPIs across procurement functions", dataOut: "Unified assessment dataset with scores and free-text" },
    { label: "Maturity Scoring & Benchmarking", description: "Score against Hackett/CAPS maturity framework dimensions. Calculate gap-to-peer on each dimension. Generate weighted composite scores with statistical confidence.", systems: ["Benchmark Databases", "BigQuery"], layer: "ml", dataIn: "Unified assessment dataset", dataOut: "Dimension-level maturity scores with peer benchmarks" },
    { label: "Diagnostic Narrative & Roadmap", description: "Gemini analyzes free-text survey responses where stakeholders describe pain in their own words. Synthesizes quantitative maturity scores with qualitative feedback into a diagnostic narrative. Maps specific gaps to specific agents that address them — connecting maturity deficits to the transformation roadmap.", systems: ["Vertex AI (Gemini)"], layer: "llm", dataIn: "Maturity scores + free-text pain points + agent catalog", dataOut: "Diagnostic narrative with gap-to-agent roadmap" },
  ],
};


const behaviorContract: AgentBehaviorContract = {
  role: "CPO agent for the Procurement Maturity Assessor workflow",
  primaryObjective: "NLP analyzes free-text survey responses to extract qualitative pain points alongside quantitative scoring. Benchmarks against Hackett/CAPS frameworks automatically. so the CPO can move the Assessment time KPI.",
  inScope: [
    "NLP analyzes free-text survey responses to extract qualitative pain points alongside quantitative scoring",
    "Benchmarks against Hackett/CAPS frameworks automatically",
    "Maps specific maturity gaps to specific agents in the transformation roadmap — connecting deficits to solutions",
  ],
  outOfScope: [
    "Contract execution without legal review",
    "Supplier disqualification decisions (category lead retains authority)",
    "Single-source justification overrides above policy threshold",
  ],
  toolIntents: [
    {
      name: "query_survey_tools_survey_tools_records",
      kind: "query",
      sourceSystemId: "survey_tools",
      description: "Retrieve survey tools records from Survey Tools for the Procurement Maturity Assessor workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "survey_tools_records_records",
        "survey_tools_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_internal_process_metrics_internal_process_metrics_records",
      kind: "query",
      sourceSystemId: "internal_process_metrics",
      description: "Retrieve internal process metrics records from Internal Process Metrics for the Procurement Maturity Assessor workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "internal_process_metrics_records_records",
        "internal_process_metrics_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_benchmark_databases_benchmark_databases_records",
      kind: "query",
      sourceSystemId: "benchmark_databases",
      description: "Retrieve benchmark databases records from Benchmark Databases for the Procurement Maturity Assessor workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "benchmark_databases_records_records",
        "benchmark_databases_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_bigquery_analytics_events",
      kind: "query",
      sourceSystemId: "bigquery",
      description: "Retrieve analytics events from BigQuery for the Procurement Maturity Assessor workflow.",
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
      name: "lookup_procurement_maturity_assessor_policy_guide",
      kind: "evidence_lookup",
      sourceSystemId: "bigquery",
      description: "Look up sections of the Procurement Maturity Assessor Procurement Policy Guide to cite in narrative output, escalation rationale, and audit evidence.",
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
      claim: "Assessment time moved from 6-8 weeks toward 1 week",
      mustCite: [
        "survey_tools.survey_tools_records",
        "internal_process_metrics.internal_process_metrics_records",
      ],
      sourceSystemIds: [
        "survey_tools",
        "internal_process_metrics",
      ],
    },
    {
      claim: "Benchmark dimensions moved from 5-6 manual toward 25+ automated",
      mustCite: [
        "survey_tools.survey_tools_records",
        "internal_process_metrics.internal_process_metrics_records",
      ],
      sourceSystemIds: [
        "survey_tools",
        "internal_process_metrics",
      ],
    },
  ],
  escalationRules: [
    {
      trigger: "Assessment time regresses past the 6-8 weeks baseline by more than 20%",
      action: "escalate_to_human",
      handoffTarget: "CPO",
      rationale: "Significant regressions need human judgment before automated remediation runs against production records.",
    },
    {
      trigger: "Source-system evidence is incomplete or stale (>24h) for any required entity",
      action: "request_more_info",
      rationale: "Recommendations grounded in stale evidence misrepresent current state and undermine audit defensibility.",
    },
  ],
  refusalRules: [
    "Never fabricate metric values; only publish numbers derived from Survey Tools (and other named systems) entities.",
    "Never bypass CPO approval on escalation triggers, even when confidence is high.",
    "Never expose individual personal data (PII) in summaries; aggregate or pseudonymise before output.",
    "Never act on data older than the staleness threshold defined in the runbook without a fresh re-query.",
  ],
  goldenEvals: [
    {
      id: "procurement-maturity-assessor-end-to-end",
      prompt: "Run the Procurement Maturity Assessor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.",
      expectedToolCalls: [
        "query_survey_tools_survey_tools_records",
        "query_internal_process_metrics_internal_process_metrics_records",
        "query_benchmark_databases_benchmark_databases_records",
        "query_bigquery_analytics_events",
        "lookup_procurement_maturity_assessor_policy_guide",
      ],
      mustReferenceEntities: [
        "survey_tools_records",
        "internal_process_metrics_records",
        "benchmark_databases_records",
        "analytics_events",
      ],
      mustCiteDocuments: [
        "procurement-maturity-assessor-policy-guide",
      ],
      expectedActionOutcome: "CPO receives a fully-cited recommendation; no external state change without explicit approval.",
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
    rationale: "Row counts sized for Procurement Maturity Assessor so the agent can demonstrate the workflow against realistic transactional volume without simulating a production warehouse.",
  },
  sourceSystems: [
    {
      id: "survey_tools",
      name: "Survey Tools",
      owns: [
        "survey_tools_records",
        "survey_tools_events",
        "survey_tools_audit_trail",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_survey_tools_survey_tools_records",
        "query_survey_tools_survey_tools_events",
        "query_survey_tools_survey_tools_audit_trail",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
    {
      id: "internal_process_metrics",
      name: "Internal Process Metrics",
      owns: [
        "internal_process_metrics_records",
        "internal_process_metrics_events",
        "internal_process_metrics_audit_trail",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_internal_process_metrics_internal_process_metrics_records",
        "query_internal_process_metrics_internal_process_metrics_events",
        "query_internal_process_metrics_internal_process_metrics_audit_trail",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
    {
      id: "benchmark_databases",
      name: "Benchmark Databases",
      owns: [
        "benchmark_databases_records",
        "benchmark_databases_events",
        "benchmark_databases_audit_trail",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_benchmark_databases_benchmark_databases_records",
        "query_benchmark_databases_benchmark_databases_events",
        "query_benchmark_databases_benchmark_databases_audit_trail",
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
      name: "survey_tools_records",
      sourceSystemId: "survey_tools",
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
      name: "survey_tools_events",
      sourceSystemId: "survey_tools",
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
          name: "survey_tools_record_id",
          type: "ref",
          ref: "survey_tools_records.id",
          required: true,
        },
      ],
    },
    {
      name: "survey_tools_audit_trail",
      sourceSystemId: "survey_tools",
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
      name: "internal_process_metrics_records",
      sourceSystemId: "internal_process_metrics",
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
      name: "internal_process_metrics_events",
      sourceSystemId: "internal_process_metrics",
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
          name: "internal_process_metrics_record_id",
          type: "ref",
          ref: "internal_process_metrics_records.id",
          required: true,
        },
      ],
    },
    {
      name: "internal_process_metrics_audit_trail",
      sourceSystemId: "internal_process_metrics",
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
      name: "benchmark_databases_records",
      sourceSystemId: "benchmark_databases",
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
      name: "benchmark_databases_events",
      sourceSystemId: "benchmark_databases",
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
          name: "benchmark_databases_record_id",
          type: "ref",
          ref: "benchmark_databases_records.id",
          required: true,
        },
      ],
    },
    {
      name: "benchmark_databases_audit_trail",
      sourceSystemId: "benchmark_databases",
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
      from: "survey_tools_events.survey_tools_record_id",
      to: "survey_tools_records.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
    {
      from: "internal_process_metrics_events.internal_process_metrics_record_id",
      to: "internal_process_metrics_records.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
    {
      from: "benchmark_databases_events.benchmark_databases_record_id",
      to: "benchmark_databases_records.id",
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
      id: "procurement-maturity-assessor-policy-guide",
      sourceSystemId: "bigquery",
      type: "policy",
      title: "Procurement Maturity Assessor Procurement Policy Guide",
      requiredSections: [
        "Sourcing principles",
        "Approval thresholds",
        "Supplier risk requirements",
        "Contract and compliance gates",
        "Exception handling",
      ],
      linkedEntities: [
        "survey_tools_records",
        "survey_tools_events",
        "survey_tools_audit_trail",
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
      id: "procurement-maturity-assessor-baseline-gap",
      description: "Seed a realistic gap where Assessment time sits between 6-8 weeks and 1 week, so the agent can detect, narrate, and recommend remediation.",
      affectedEntities: [
        "survey_tools_records",
        "survey_tools_events",
      ],
      discoveryPath: [
        "Inspect Survey Tools records for the affected entities",
        "Compare against Internal Process Metrics historical baseline",
        "Generate a citation-backed recommendation",
      ],
      expectedEvidence: [
        "source-system record",
        "historical baseline metric",
        "generated audit trail",
      ],
      expectedRecommendation: "Explain the gap, cite supporting evidence, and propose the next CPO action.",
    },
  ],
  datastorePackaging: {
    alloydb: {
      database: "procurement_maturity_assessor",
      schemas: [
        "survey_tools",
        "internal_process_metrics",
        "benchmark_databases",
      ],
    },
    bigquery: {
      dataset: "procurement_procurement_maturity_assessor",
      tables: [
        "kpi_summary",
        "evidence_index",
      ],
    },
    cloudStorage: {
      bucketSuffix: "procurement-maturity-assessor-evidence",
      prefixes: [
        "documents",
        "audit-trails",
        "exports",
      ],
    },
    apis: {
      serviceName: "procurement-maturity-assessor-source-adapters",
      deploymentTarget: "cloud_run",
    },
  },
  validation: {
    smokePrompt: "Run the Procurement Maturity Assessor workflow and cite source-system evidence for every claim.",
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

export const ProcurementMaturityAssessor = () => (
  <UseCaseSlide
    title="Procurement Maturity Assessor"
    subtitle="A-1106 • Procurement Strategy"
    icon={Award}
    domainId="domain-11"
    layer="Layer 3: Custom ADK"
    persona="CPO"
    systems={["Survey Tools", "Internal Process Metrics", "Benchmark Databases", "BigQuery"]}
    kpis={[
      { label: "Assessment time", before: "6-8 weeks", after: "1 week" },
      { label: "Benchmark dimensions", before: "5-6 manual", after: "25+ automated" },
      { label: "Gap-to-action mapping", before: "None", after: "Agent-linked" },
    ]}
    triggerType="scheduled"
    swimlane={swimlane}
    flow={flow}
    architecture={architecture}
    hitl={{ actor: "CPO", action: "Review maturity assessment", description: "CPO reviews maturity diagnostic, validates gap prioritization, and approves transformation roadmap before team communication." }}
    statusQuo={[
      "Maturity assessments done annually via consultant engagements costing $200K+.",
      "Results are static reports that sit on shelves.",
      "No linkage between maturity gaps and specific improvement actions."
    ]}
    agentification={[
      "NLP analyzes free-text survey responses to extract qualitative pain points alongside quantitative scoring.",
      "Benchmarks against Hackett/CAPS frameworks automatically.",
      "Maps specific maturity gaps to specific agents in the transformation roadmap — connecting deficits to solutions."
    ]}
  />
);
