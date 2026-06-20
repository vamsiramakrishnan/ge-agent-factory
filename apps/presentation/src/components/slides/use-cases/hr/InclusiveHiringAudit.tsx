import React from "react";
import { UseCaseSlide } from "../../../agent/UseCaseSlide";
import { FlowStep } from "../../../agent/ProcessFlow";
import { SwimlaneFlow } from "../../../agent/SwimlaneFlow";
import { AgentArchitecture, UseCaseGenerationSpec, AgentBehaviorContract} from "../../../../types/architecture";
import { UserSearch, Download, Filter, Eye, Target } from "lucide-react";

const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "n1", label: "Pipeline Data", lane: "system", type: "trigger" },
    { id: "n2", label: "Funnel Analysis", lane: "agent", type: "action" },
    { id: "n3", label: "Drop-off Detection", lane: "agent", type: "action" },
    { id: "n4", label: "TA Lead Reviews", lane: "human", type: "hitl" },
    { id: "n5", label: "Hiring Audit", lane: "agent", type: "output" },
  ],
  connections: [["n1", "n2"], ["n2", "n3"], ["n3", "n4"], ["n4", "n5"]],
};

const architecture: AgentArchitecture = {
  connections: [
    { system: "Greenhouse", description: "Candidate pipeline data, stage progression, interviewer feedback", direction: "read", protocol: "REST API", category: "erp" },
    { system: "Workday", description: "Hire demographics, job requisition data, hiring manager info", direction: "read", protocol: "REST API", category: "erp" },
    { system: "BigQuery", description: "Hiring funnel analytics, conversion rates, statistical models", direction: "bidirectional", protocol: "BigQuery SQL", category: "analytics" },
    { system: "Vertex AI (Gemini)", description: "Drop-off analysis reasoning, intervention recommendation generation", direction: "bidirectional", protocol: "gRPC", category: "ai" },
  ],
  pipeline: [
    { label: "Pipeline Data Collection", description: "Pull candidate pipeline data from Greenhouse with demographic information at each funnel stage. Join with Workday requisition data for hiring manager and role context.", systems: ["Greenhouse", "Workday"], layer: "integration", dataIn: "Candidate records with stage progression + demographics", dataOut: "Enriched pipeline dataset by stage × demographic" },
    { label: "Funnel Analysis", description: "Calculate conversion rates by demographic dimension at every funnel stage. Apply statistical significance testing to identify meaningful drop-off points versus noise.", systems: ["BigQuery"], layer: "ml", dataIn: "Enriched pipeline dataset", dataOut: "Stage-by-stage conversion rates with significance scores" },
    { label: "Drop-off Detection", description: "Gemini analyzes statistically significant drop-off points to identify root causes — interviewer bias patterns, job description language, sourcing channel gaps, and stage-specific barriers.", systems: ["Vertex AI (Gemini)"], layer: "llm", dataIn: "Conversion rates + interviewer data + JD text", dataOut: "Root cause analysis with bias pattern identification" },
    { label: "Intervention Recommendations", description: "Generate stage-specific intervention plans — structured interview guides, JD language rewrites, sourcing channel diversification, and panel composition recommendations.", systems: ["Vertex AI (Gemini)"], layer: "llm", dataIn: "Root cause analysis + best practice database", dataOut: "Prioritized intervention plan with expected impact" },
  ],
};


const behaviorContract: AgentBehaviorContract = {
  role: "TA Lead agent for the Inclusive Hiring Audit workflow",
  primaryObjective: "Real-time analysis of funnel stages by demographic dimension. Automated identification of diversity drop-off points by manager. so the TA Lead can move the Funnel analysis KPI.",
  inScope: [
    "Real-time analysis of funnel stages by demographic dimension",
    "Automated identification of diversity drop-off points by manager",
    "Targeted intervention recommendations based on funnel signals",
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
      description: "Retrieve ats records from ATS for the Inclusive Hiring Audit workflow.",
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
      name: "query_workday_employees",
      kind: "query",
      sourceSystemId: "workday",
      description: "Retrieve employees from Workday for the Inclusive Hiring Audit workflow.",
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
      description: "Retrieve analytics events from Google BigQuery for the Inclusive Hiring Audit workflow.",
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
      name: "lookup_inclusive_hiring_audit_policy_handbook",
      kind: "evidence_lookup",
      sourceSystemId: "google_bigquery",
      description: "Look up sections of the Inclusive Hiring Audit Policy Handbook to cite in narrative output, escalation rationale, and audit evidence.",
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
      claim: "Funnel analysis moved from Outcome only toward Stage-by-stage",
      mustCite: [
        "ats.ats_records",
        "workday.employees",
      ],
      sourceSystemIds: [
        "ats",
        "workday",
      ],
    },
    {
      claim: "Drop-off detection moved from Anecdotal toward Statistical",
      mustCite: [
        "ats.ats_records",
        "workday.employees",
      ],
      sourceSystemIds: [
        "ats",
        "workday",
      ],
    },
  ],
  escalationRules: [
    {
      trigger: "Funnel analysis regresses past the Outcome only baseline by more than 20%",
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
      id: "inclusive-hiring-audit-end-to-end",
      prompt: "Run the Inclusive Hiring Audit workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.",
      expectedToolCalls: [
        "query_ats_ats_records",
        "query_workday_employees",
        "query_google_bigquery_analytics_events",
        "lookup_inclusive_hiring_audit_policy_handbook",
        "action_ats_recommend",
      ],
      mustReferenceEntities: [
        "ats_records",
        "employees",
        "analytics_events",
      ],
      mustCiteDocuments: [
        "inclusive-hiring-audit-policy-handbook",
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
    rationale: "Row counts sized for Inclusive Hiring Audit so the agent can demonstrate the workflow against realistic transactional volume without simulating a production warehouse.",
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
  ],
  relationships: [
    {
      from: "ats_events.ats_record_id",
      to: "ats_records.id",
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
      id: "inclusive-hiring-audit-policy-handbook",
      sourceSystemId: "google_bigquery",
      type: "policy",
      title: "Inclusive Hiring Audit Policy Handbook",
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
      id: "inclusive-hiring-audit-baseline-gap",
      description: "Seed a realistic gap where Funnel analysis sits between Outcome only and Stage-by-stage, so the agent can detect, narrate, and recommend remediation.",
      affectedEntities: [
        "ats_records",
        "ats_events",
      ],
      discoveryPath: [
        "Inspect ATS records for the affected entities",
        "Compare against Workday historical baseline",
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
      database: "inclusive_hiring_audit",
      schemas: [
        "ats",
        "workday",
      ],
    },
    bigquery: {
      dataset: "hr_inclusive_hiring_audit",
      tables: [
        "kpi_summary",
        "evidence_index",
      ],
    },
    cloudStorage: {
      bucketSuffix: "inclusive-hiring-audit-evidence",
      prefixes: [
        "documents",
        "audit-trails",
        "exports",
      ],
    },
    apis: {
      serviceName: "inclusive-hiring-audit-source-adapters",
      deploymentTarget: "cloud_run",
    },
  },
  validation: {
    smokePrompt: "Run the Inclusive Hiring Audit workflow and cite source-system evidence for every claim.",
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

export const InclusiveHiringAudit = () => (
  <UseCaseSlide
    triggerType="scheduled"
    swimlane={swimlane}
    hitl={{ actor: "TA Lead", action: "Review hiring equity data", description: "Agent analyzes hiring funnel conversion rates by demographic at every stage. TA Lead reviews statistically significant drop-off points and approves intervention plans." }}
    title="Inclusive Hiring Audit"
    subtitle="A-902 • DEI & Belonging"
    icon={UserSearch}
    domainId="domain-9"
    layer="Layer 4: Data Agent"
    persona="TA Lead"
    systems={["ATS", "Workday", "Google BigQuery"]}
    kpis={[
      { label: "Funnel analysis", before: "Outcome only", after: "Stage-by-stage" },
      { label: "Drop-off detection", before: "Anecdotal", after: "Statistical" },
      { label: "Intervention speed", before: "Post-mortem", after: "Real-time" }
    ]}
    statusQuo={[
      "Hiring funnel diversity analyzed periodically (if at all).",
      "Drop-off points in the candidate funnel remain unidentified.",
      "Interventions are reactive and lack granular data support."
    ]}
    agentification={[
      "Real-time analysis of funnel stages by demographic dimension.",
      "Automated identification of diversity drop-off points by manager.",
      "Targeted intervention recommendations based on funnel signals."
    ]}
    architecture={architecture}
    flow={[
      { label: "Pipeline Data", icon: Download, description: "Candidate pipeline with demographics at each stage.", trigger: "Continuous", systems: ["ATS"] },
      { label: "Funnel Analysis", icon: Filter, description: "Conversion rates by demographic at every stage.", systems: ["Gemini", "BigQuery"], integration: "Data Agent" },
      { label: "Drop-off Detection", icon: Eye, description: "Statistically significant drop-off points identified." },
      { label: "Recommendations", icon: Target, description: "Stage-specific interventions to improve equity.", output: "Hiring Audit" }
    ]}
  />
);
