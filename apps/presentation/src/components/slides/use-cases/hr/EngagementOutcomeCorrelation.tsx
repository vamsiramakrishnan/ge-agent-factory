import React from "react";
import { UseCaseSlide } from "../../../agent/UseCaseSlide";
import { GitMerge, Database, Brain, Calculator, FileText } from "lucide-react";
import { FlowStep } from "../../../agent/ProcessFlow";
import { SwimlaneFlow } from "../../../agent/SwimlaneFlow";
import { AgentArchitecture, UseCaseGenerationSpec, AgentBehaviorContract} from "../../../../types/architecture";

const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "s1", label: "Data Integration", lane: "system", type: "trigger" },
    { id: "a1", label: "Statistical Modeling", lane: "agent", type: "action" },
    { id: "a2", label: "Impact Quantification", lane: "agent", type: "action" },
    { id: "a3", label: "Strategic Brief", lane: "agent", type: "output" },
  ],
  connections: [["s1", "a1"], ["a1", "a2"], ["a2", "a3"]],
};

const flow: FlowStep[] = [
  { label: "Data Integration", icon: Database, description: "Engagement, attrition, productivity, revenue linked.", trigger: "Quarterly", systems: ["Survey", "HRIS", "Finance"] },
  { label: "Statistical Modeling", icon: Brain, description: "Correlation and causal driver analysis.", systems: ["Gemini", "BigQuery"], integration: "Data Agent" },
  { label: "Impact Quantification", icon: Calculator, description: "Dollar impact of engagement drivers calculated." },
  { label: "Strategic Brief", icon: FileText, description: "C-suite brief with investment recommendations.", output: "Correlation Report" }
];

const architecture: AgentArchitecture = {
  connections: [
    { system: "Qualtrics", description: "Engagement survey scores, eNPS, belonging indices", direction: "read", protocol: "REST API", category: "erp" },
    { system: "Workday", description: "Attrition data, performance ratings, promotion rates", direction: "read", protocol: "REST API", category: "erp" },
    { system: "BigQuery", description: "Unified analytics warehouse for cross-domain correlation", direction: "bidirectional", protocol: "BigQuery SQL", category: "analytics" },
    { system: "Vertex AI (Gemini)", description: "Causal reasoning, narrative generation for C-suite briefs", direction: "bidirectional", protocol: "gRPC", category: "ai" },
    { system: "Finance System", description: "Revenue per employee, productivity metrics, cost data", direction: "read", protocol: "REST API", category: "erp" },
  ],
  pipeline: [
    { label: "Data Integration", description: "Link engagement scores to attrition, productivity, and revenue data across systems. Build unified dataset with time-series alignment for longitudinal analysis.", systems: ["Qualtrics", "Workday", "Finance System"], layer: "integration", dataIn: "Engagement scores + attrition + productivity + revenue", dataOut: "Unified cross-domain dataset with temporal alignment" },
    { label: "Statistical Correlation", description: "Run correlation and causal driver analysis across engagement dimensions and business outcomes. Isolate confounding variables using multi-variable regression models.", systems: ["BigQuery"], layer: "ml", dataIn: "Unified cross-domain dataset", dataOut: "Correlation matrix with causal driver rankings" },
    { label: "Impact Quantification", description: "Gemini translates statistical findings into dollar-value impact estimates. Calculates ROI of engagement improvements on retention, productivity, and revenue outcomes.", systems: ["Vertex AI (Gemini)"], layer: "llm", dataIn: "Correlation matrix + financial data", dataOut: "Dollar-impact estimates per engagement driver" },
    { label: "Strategic Brief Generation", description: "Generate C-suite-ready brief with investment recommendations prioritized by ROI potential. Include trade-off analysis and confidence intervals.", systems: ["Vertex AI (Gemini)"], layer: "llm", dataIn: "Impact estimates + driver rankings", dataOut: "Executive brief with investment recommendations" },
  ],
};


const behaviorContract: AgentBehaviorContract = {
  role: "CHRO agent for the Engagement-to-Outcome Correlation Agent workflow",
  primaryObjective: "Statistical correlation of engagement drivers to attrition, productivity, and revenue outcomes. Causal driver identification using multi-variable modeling techniques. so the CHRO can move the Correlation depth KPI.",
  inScope: [
    "Statistical correlation of engagement drivers to attrition, productivity, and revenue outcomes",
    "Causal driver identification using multi-variable modeling techniques",
    "Data-driven action plan generation with predicted impact on business results",
  ],
  outOfScope: [
    "Final hiring, termination, or compensation decisions (HRBP/leadership retains authority)",
    "Performance management adjudication and disciplinary action",
    "Legal interpretation of employment law in ambiguous jurisdictions",
  ],
  toolIntents: [
    {
      name: "query_culture_amp_engagement_surveys",
      kind: "query",
      sourceSystemId: "culture_amp",
      description: "Retrieve engagement surveys from Culture Amp for the Engagement-to-Outcome Correlation Agent workflow.",
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
      name: "query_workday_employees",
      kind: "query",
      sourceSystemId: "workday",
      description: "Retrieve employees from Workday for the Engagement-to-Outcome Correlation Agent workflow.",
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
      description: "Retrieve analytics events from Google BigQuery for the Engagement-to-Outcome Correlation Agent workflow.",
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
      name: "query_finance_system_finance_system_records",
      kind: "query",
      sourceSystemId: "finance_system",
      description: "Retrieve finance system records from Finance System for the Engagement-to-Outcome Correlation Agent workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "finance_system_records_records",
        "finance_system_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "lookup_engagement_to_outcome_correlation_agent_policy_handbook",
      kind: "evidence_lookup",
      sourceSystemId: "google_bigquery",
      description: "Look up sections of the Engagement-to-Outcome Correlation Agent Policy Handbook to cite in narrative output, escalation rationale, and audit evidence.",
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
      name: "action_culture_amp_execute",
      kind: "action",
      sourceSystemId: "culture_amp",
      description: "Execute the execute step in Culture Amp after the agent has gathered evidence and validated escalation gates.",
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
      claim: "Correlation depth moved from Engagement → retention guess toward Multi-outcome statistical",
      mustCite: [
        "culture_amp.engagement_surveys",
        "workday.employees",
      ],
      sourceSystemIds: [
        "culture_amp",
        "workday",
      ],
    },
    {
      claim: "Causal analysis moved from None toward Driver isolation",
      mustCite: [
        "culture_amp.engagement_surveys",
        "workday.employees",
      ],
      sourceSystemIds: [
        "culture_amp",
        "workday",
      ],
    },
  ],
  escalationRules: [
    {
      trigger: "Correlation depth regresses past the Engagement → retention guess baseline by more than 20%",
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
    "Never fabricate metric values; only publish numbers derived from Culture Amp (and other named systems) entities.",
    "Never bypass CHRO approval on escalation triggers, even when confidence is high.",
    "Never expose individual personal data (PII) in summaries; aggregate or pseudonymise before output.",
    "Never act on data older than the staleness threshold defined in the runbook without a fresh re-query.",
  ],
  goldenEvals: [
    {
      id: "engagement-to-outcome-correlation-agent-end-to-end",
      prompt: "Run the Engagement-to-Outcome Correlation Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.",
      expectedToolCalls: [
        "query_culture_amp_engagement_surveys",
        "query_workday_employees",
        "query_google_bigquery_analytics_events",
        "query_finance_system_finance_system_records",
        "lookup_engagement_to_outcome_correlation_agent_policy_handbook",
        "action_culture_amp_execute",
      ],
      mustReferenceEntities: [
        "engagement_surveys",
        "employees",
        "analytics_events",
        "finance_system_records",
      ],
      mustCiteDocuments: [
        "engagement-to-outcome-correlation-agent-policy-handbook",
      ],
      expectedActionOutcome: "Action execute executed against Culture Amp, with audit-trail entry and CHRO notified of outcomes.",
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
    rationale: "Row counts sized for Engagement-to-Outcome Correlation Agent so the agent can demonstrate the workflow against realistic transactional volume without simulating a production warehouse.",
  },
  sourceSystems: [
    {
      id: "culture_amp",
      name: "Culture Amp",
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
        "query_culture_amp_engagement_surveys",
        "query_culture_amp_feedback_records",
        "query_culture_amp_review_cycles",
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
      id: "finance_system",
      name: "Finance System",
      owns: [
        "finance_system_records",
        "finance_system_events",
        "finance_system_audit_trail",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_finance_system_finance_system_records",
        "query_finance_system_finance_system_events",
        "query_finance_system_finance_system_audit_trail",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
  ],
  entities: [
    {
      name: "engagement_surveys",
      sourceSystemId: "culture_amp",
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
      sourceSystemId: "culture_amp",
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
      sourceSystemId: "culture_amp",
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
      name: "finance_system_records",
      sourceSystemId: "finance_system",
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
      name: "finance_system_events",
      sourceSystemId: "finance_system",
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
          name: "finance_system_record_id",
          type: "ref",
          ref: "finance_system_records.id",
          required: true,
        },
      ],
    },
    {
      name: "finance_system_audit_trail",
      sourceSystemId: "finance_system",
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
      from: "finance_system_events.finance_system_record_id",
      to: "finance_system_records.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
  ],
  documents: [
    {
      id: "engagement-to-outcome-correlation-agent-policy-handbook",
      sourceSystemId: "google_bigquery",
      type: "policy",
      title: "Engagement-to-Outcome Correlation Agent Policy Handbook",
      requiredSections: [
        "Eligibility and scope",
        "Workflow steps",
        "Manager responsibilities",
        "Compliance and audit",
        "Sensitive-data handling",
      ],
      linkedEntities: [
        "engagement_surveys",
        "feedback_records",
        "review_cycles",
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
      id: "culture_amp_execute_api",
      sourceSystemId: "culture_amp",
      method: "POST",
      path: "/api/culture_amp/execute",
      description: "Synchronous endpoint the agent calls to execute in Culture Amp after evidence gating.",
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
      id: "engagement-to-outcome-correlation-agent-baseline-gap",
      description: "Seed a realistic gap where Correlation depth sits between Engagement → retention guess and Multi-outcome statistical, so the agent can detect, narrate, and recommend remediation.",
      affectedEntities: [
        "engagement_surveys",
        "feedback_records",
      ],
      discoveryPath: [
        "Inspect Culture Amp records for the affected entities",
        "Compare against Workday historical baseline",
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
      database: "engagement_to_outcome_correlation_agent",
      schemas: [
        "culture_amp",
        "workday",
        "finance_system",
      ],
    },
    bigquery: {
      dataset: "hr_engagement_to_outcome_correlation_agent",
      tables: [
        "kpi_summary",
        "evidence_index",
      ],
    },
    cloudStorage: {
      bucketSuffix: "engagement-to-outcome-correlation-agent-evidence",
      prefixes: [
        "documents",
        "audit-trails",
        "exports",
      ],
    },
    apis: {
      serviceName: "engagement-to-outcome-correlation-agent-source-adapters",
      deploymentTarget: "cloud_run",
    },
  },
  validation: {
    smokePrompt: "Run the Engagement-to-Outcome Correlation Agent workflow and cite source-system evidence for every claim.",
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

export const EngagementOutcomeCorrelation = () => (
  <UseCaseSlide
    title="Engagement-to-Outcome Correlation Agent"
    subtitle="A-703 • Employee Listening"
    icon={GitMerge}
    domainId="domain-7"
    layer="Layer 4: Data Agent"
    persona="CHRO"
    triggerType="scheduled"
    swimlane={swimlane}
    systems={["Culture Amp", "Workday", "Google BigQuery", "Finance System"]}
    kpis={[
      { label: "Correlation depth", before: "Engagement → retention guess", after: "Multi-outcome statistical" },
      { label: "Causal analysis", before: "None", after: "Driver isolation" },
      { label: "ROI of engagement", before: "Assumed", after: "Quantified" }
    ]}
    flow={flow}
    architecture={architecture}
    statusQuo={[
      "Engagement scores reported in isolation from business metrics.",
      "Correlation to retention and productivity assumed but never proven.",
      "Action planning disconnected from underlying data and root causes."
    ]}
    agentification={[
      "Statistical correlation of engagement drivers to attrition, productivity, and revenue outcomes.",
      "Causal driver identification using multi-variable modeling techniques.",
      "Data-driven action plan generation with predicted impact on business results."
    ]}
  />
);
