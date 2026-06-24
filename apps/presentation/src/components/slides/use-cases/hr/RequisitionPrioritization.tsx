import React from "react";
import { UseCaseSlide } from "../../../agent/UseCaseSlide";
import { ListOrdered, Database, BarChart, Users, Target } from "lucide-react";
import { FlowStep } from "../../../agent/ProcessFlow";
import { SwimlaneFlow } from "../../../agent/SwimlaneFlow";
import { AgentArchitecture, UseCaseGenerationSpec, AgentBehaviorContract} from "../../../../types/architecture";

const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "s1", label: "Open Req Pool", lane: "system", type: "trigger" },
    { id: "a1", label: "Priority Scoring", lane: "agent", type: "action" },
    { id: "a2", label: "Recruiter Matching", lane: "agent", type: "action" },
    { id: "a3", label: "Priority Queue", lane: "agent", type: "output" },
  ],
  connections: [["s1", "a1"], ["a1", "a2"], ["a2", "a3"]],
};

const architecture: AgentArchitecture = {
  connections: [
    { system: "Workday", description: "Headcount targets, business unit priorities, org context", direction: "read", protocol: "REST API", category: "erp" },
    { system: "BigQuery", description: "Historical fill rates, time-to-fill analytics, recruiter performance", direction: "bidirectional", protocol: "BigQuery SQL", category: "analytics" },
    { system: "Vertex AI (Gemini)", description: "Priority scoring, recruiter-req matching optimization", direction: "bidirectional", protocol: "gRPC", category: "ai" },
  ],
  pipeline: [
    { label: "Req Pool Aggregation", description: "Aggregate all open requisitions with business context from Workday. Enrich with historical fill rates and difficulty metrics from BigQuery.", systems: ["Workday", "BigQuery"], layer: "integration", dataIn: "Open requisitions + business context", dataOut: "Enriched req pool with historical context" },
    { label: "Priority Scoring", description: "Multi-factor scoring using business criticality, revenue impact, fill difficulty, and time-sensitivity. Dynamic re-ranking as conditions change.", systems: ["BigQuery", "Vertex AI (Gemini)"], layer: "ml", dataIn: "Enriched req pool + business signals", dataOut: "Scored and ranked priority queue" },
    { label: "Recruiter Matching", description: "Gemini matches requisitions to recruiters based on domain expertise, historical success rates, current workload, and capacity planning.", systems: ["Vertex AI (Gemini)"], layer: "llm", dataIn: "Priority queue + recruiter profiles", dataOut: "Optimized req-recruiter assignments" },
  ],
};


const behaviorContract: AgentBehaviorContract = {
  role: "TA Lead agent for the Requisition Prioritization Agent workflow",
  primaryObjective: "AI-driven priority scoring based on business criticality, time-to-fill risk, and projected revenue impact. Smart recruiter-requisition matching using expertise profiles, historical fill rates, and current workload balance. so the TA Lead can move the Prioritization KPI.",
  inScope: [
    "AI-driven priority scoring based on business criticality, time-to-fill risk, and projected revenue impact",
    "Smart recruiter-requisition matching using expertise profiles, historical fill rates, and current workload balance",
    "Dynamic priority re-ranking as business conditions shift, with transparent scoring rationale for hiring managers",
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
      description: "Retrieve ats records from ATS for the Requisition Prioritization Agent workflow.",
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
      description: "Retrieve employees from Workday for the Requisition Prioritization Agent workflow.",
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
      description: "Retrieve analytics events from Google BigQuery for the Requisition Prioritization Agent workflow.",
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
      name: "lookup_requisition_prioritization_agent_policy_handbook",
      kind: "evidence_lookup",
      sourceSystemId: "google_bigquery",
      description: "Look up sections of the Requisition Prioritization Agent Policy Handbook to cite in narrative output, escalation rationale, and audit evidence.",
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
      name: "action_ats_file",
      kind: "action",
      sourceSystemId: "ats",
      description: "Execute the file step in ATS after the agent has gathered evidence and validated escalation gates.",
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
      claim: "Prioritization moved from Gut feel toward Data-driven",
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
      claim: "Time-to-fill risk moved from Unknown toward Predicted",
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
      trigger: "Prioritization regresses past the Gut feel baseline by more than 20%",
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
      trigger: "Proposed file action lacks supporting evidence from at least two systems",
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
      id: "requisition-prioritization-agent-end-to-end",
      prompt: "Run the Requisition Prioritization Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.",
      expectedToolCalls: [
        "query_ats_ats_records",
        "query_workday_employees",
        "query_google_bigquery_analytics_events",
        "lookup_requisition_prioritization_agent_policy_handbook",
        "action_ats_file",
      ],
      mustReferenceEntities: [
        "ats_records",
        "employees",
        "analytics_events",
      ],
      mustCiteDocuments: [
        "requisition-prioritization-agent-policy-handbook",
      ],
      expectedActionOutcome: "Action file executed against ATS, with audit-trail entry and TA Lead notified of outcomes.",
      forbiddenBehaviors: [
        "do not invent KPI numbers",
        "do not skip the evidence_lookup step before any recommendation",
        "do not execute file without two-system evidence",
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
    rationale: "Row counts sized for Requisition Prioritization Agent so the agent can demonstrate the workflow against realistic transactional volume without simulating a production warehouse.",
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
      id: "requisition-prioritization-agent-policy-handbook",
      sourceSystemId: "google_bigquery",
      type: "policy",
      title: "Requisition Prioritization Agent Policy Handbook",
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
      id: "ats_file_api",
      sourceSystemId: "ats",
      method: "POST",
      path: "/api/ats/file",
      description: "Synchronous endpoint the agent calls to file in ATS after evidence gating.",
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
      id: "requisition-prioritization-agent-baseline-gap",
      description: "Seed a realistic gap where Prioritization sits between Gut feel and Data-driven, so the agent can detect, narrate, and recommend remediation.",
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
      database: "requisition_prioritization_agent",
      schemas: [
        "ats",
        "workday",
      ],
    },
    bigquery: {
      dataset: "hr_requisition_prioritization_agent",
      tables: [
        "kpi_summary",
        "evidence_index",
      ],
    },
    cloudStorage: {
      bucketSuffix: "requisition-prioritization-agent-evidence",
      prefixes: [
        "documents",
        "audit-trails",
        "exports",
      ],
    },
    apis: {
      serviceName: "requisition-prioritization-agent-source-adapters",
      deploymentTarget: "cloud_run",
    },
  },
  validation: {
    smokePrompt: "Run the Requisition Prioritization Agent workflow and cite source-system evidence for every claim.",
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

export const RequisitionPrioritization = () => (
  <UseCaseSlide
    title="Requisition Prioritization Agent"
    subtitle="A-202 • Requisition & Approval"
    icon={ListOrdered}
    domainId="domain-2"
    layer="Layer 4: Data Agent"
    persona="TA Lead"
    systems={["ATS", "Workday", "Google BigQuery"]}
    kpis={[
      { label: "Prioritization", before: "Gut feel", after: "Data-driven" },
      { label: "Time-to-fill risk", before: "Unknown", after: "Predicted" },
      { label: "Recruiter match", before: "Random", after: "Optimized" }
    ]}
    triggerType="scheduled"
    swimlane={swimlane}
    architecture={architecture}
    statusQuo={[
      "Requisitions prioritized by hiring manager urgency rather than measurable business impact or strategic alignment.",
      "Recruiter assignment based on availability and team rotation, not domain expertise or past success rates.",
      "No visibility into how open requisitions compete for shared recruiting bandwidth across the organization."
    ]}
    agentification={[
      "AI-driven priority scoring based on business criticality, time-to-fill risk, and projected revenue impact.",
      "Smart recruiter-requisition matching using expertise profiles, historical fill rates, and current workload balance.",
      "Dynamic priority re-ranking as business conditions shift, with transparent scoring rationale for hiring managers."
    ]}
    flow={[
      { label: "Req Pool", icon: Database, description: "Open requisitions aggregated with context.", trigger: "Daily", systems: ["ATS"] },
      { label: "Scoring", icon: BarChart, description: "Business impact, urgency, fill difficulty scored.", systems: ["Gemini", "BigQuery"], integration: "Data Agent" },
      { label: "Recruiter Match", icon: Users, description: "Optimal recruiter assigned by expertise and load." },
      { label: "Priority Queue", icon: Target, description: "Stack-ranked queue published to TA team.", output: "Priority Board" }
    ] as FlowStep[]}
  />
);
