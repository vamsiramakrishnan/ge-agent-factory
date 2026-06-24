import React from "react";
import { UseCaseSlide } from "../../../agent/UseCaseSlide";
import { AgentArchitecture, UseCaseGenerationSpec, AgentBehaviorContract} from "../../../../types/architecture";
import { GraduationCap, Download, Brain, BarChart, Target } from "lucide-react";
import { FlowStep } from "../../../agent/ProcessFlow";
import { SwimlaneFlow } from "../../../agent/SwimlaneFlow";

const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "s1", label: "Skills Inventory", lane: "system", type: "trigger" },
    { id: "a1", label: "Gap Analysis", lane: "agent", type: "action" },
    { id: "a2", label: "Heatmap Generation", lane: "agent", type: "action" },
    { id: "a3", label: "Priority Actions", lane: "agent", type: "output" },
  ],
  connections: [["s1", "a1"], ["a1", "a2"], ["a2", "a3"]],
};

const flow: FlowStep[] = [
  { label: "Skills Inventory", icon: Download, description: "Current skills from assessments, certs, self-ratings.", trigger: "Continuous", systems: ["HRIS", "LMS"] },
  { label: "Gap Analysis", icon: Brain, description: "Current vs required skills gaps quantified by role.", systems: ["Gemini"], integration: "ADK" },
  { label: "Heatmap Generation", icon: BarChart, description: "Org-wide capability heatmaps by team and function." },
  { label: "Priority Actions", icon: Target, description: "Critical gap interventions recommended.", output: "Skills Report" }
];

const architecture: AgentArchitecture = {
  connections: [
    { system: "Workday", description: "Job profiles, role requirements, employee skills inventory, career frameworks", direction: "read", protocol: "REST API", category: "erp" },
    { system: "Cornerstone", description: "Learning completions, certifications, assessment scores", direction: "read", protocol: "REST API", category: "erp" },
    { system: "Degreed", description: "Self-reported skills, learning activity, skill ratings from peers", direction: "read", protocol: "REST API", category: "erp" },
    { system: "BigQuery", description: "Skills taxonomy warehouse, gap analytics, capability heatmaps", direction: "bidirectional", protocol: "BigQuery SQL", category: "analytics" },
    { system: "Vertex AI (Gemini)", description: "Skills inference from projects, gap prioritization reasoning, intervention recommendations", direction: "bidirectional", protocol: "gRPC", category: "ai" },
  ],
  pipeline: [
    { label: "Skills Inventory Assembly", description: "Aggregate skills data from Workday job profiles, Cornerstone certifications, and Degreed self-assessments. Normalize against a unified skills taxonomy.", systems: ["Workday", "Cornerstone", "Degreed"], layer: "integration", dataIn: "Skills from assessments, certs, self-ratings, JDs", dataOut: "Unified skills inventory per employee" },
    { label: "Gap Analysis", description: "Gemini compares current skills inventory against role requirements and future-state capability needs. Quantifies gaps by criticality, breadth, and business impact.", systems: ["Vertex AI (Gemini)", "BigQuery"], layer: "llm", dataIn: "Skills inventory + role requirements + strategy goals", dataOut: "Quantified gap scores by role, team, and function" },
    { label: "Heatmap & Prioritization", description: "Generate org-wide capability heatmaps highlighting critical gap clusters. Prioritize interventions by business impact, gap severity, and development feasibility.", systems: ["BigQuery"], layer: "ml", dataIn: "Gap scores across organization", dataOut: "Interactive capability heatmap with priority actions" },
    { label: "Intervention Recommendations", description: "Recommend targeted L&D programs, hiring plans, or redeployment strategies to close critical gaps. Link recommendations to available learning content.", systems: ["Vertex AI (Gemini)", "Cornerstone"], layer: "llm", dataIn: "Prioritized gaps + available learning catalog", dataOut: "Actionable intervention plan with ROI estimates" },
  ],
};


const behaviorContract: AgentBehaviorContract = {
  role: "L&D Lead agent for the Skills Gap Analyzer workflow",
  primaryObjective: "Dynamic skills mapping from projects, learning, and JDs. Heat maps identifying critical organizational capability gaps. so the L&D Lead can move the Mapping coverage KPI.",
  inScope: [
    "Dynamic skills mapping from projects, learning, and JDs",
    "Heat maps identifying critical organizational capability gaps",
    "Investment prioritization based on business impact evidence",
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
      description: "Retrieve employees from Workday for the Skills Gap Analyzer workflow.",
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
      name: "query_skills_db_skills_db_records",
      kind: "query",
      sourceSystemId: "skills_db",
      description: "Retrieve skills db records from Skills DB for the Skills Gap Analyzer workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "skills_db_records_records",
        "skills_db_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_lms_lms_records",
      kind: "query",
      sourceSystemId: "lms",
      description: "Retrieve lms records from LMS for the Skills Gap Analyzer workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "lms_records_records",
        "lms_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_google_bigquery_analytics_events",
      kind: "query",
      sourceSystemId: "google_bigquery",
      description: "Retrieve analytics events from Google BigQuery for the Skills Gap Analyzer workflow.",
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
      name: "lookup_skills_gap_analyzer_policy_handbook",
      kind: "evidence_lookup",
      sourceSystemId: "google_bigquery",
      description: "Look up sections of the Skills Gap Analyzer Policy Handbook to cite in narrative output, escalation rationale, and audit evidence.",
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
      claim: "Mapping coverage moved from Key roles only toward All roles",
      mustCite: [
        "workday.employees",
        "skills_db.skills_db_records",
      ],
      sourceSystemIds: [
        "workday",
        "skills_db",
      ],
    },
    {
      claim: "Gap detection moved from Annual survey toward Real-time",
      mustCite: [
        "workday.employees",
        "skills_db.skills_db_records",
      ],
      sourceSystemIds: [
        "workday",
        "skills_db",
      ],
    },
  ],
  escalationRules: [
    {
      trigger: "Mapping coverage regresses past the Key roles only baseline by more than 20%",
      action: "escalate_to_human",
      handoffTarget: "L&D Lead",
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
    "Never bypass L&D Lead approval on escalation triggers, even when confidence is high.",
    "Never expose individual personal data (PII) in summaries; aggregate or pseudonymise before output.",
    "Never act on data older than the staleness threshold defined in the runbook without a fresh re-query.",
  ],
  goldenEvals: [
    {
      id: "skills-gap-analyzer-end-to-end",
      prompt: "Run the Skills Gap Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.",
      expectedToolCalls: [
        "query_workday_employees",
        "query_skills_db_skills_db_records",
        "query_lms_lms_records",
        "query_google_bigquery_analytics_events",
        "lookup_skills_gap_analyzer_policy_handbook",
      ],
      mustReferenceEntities: [
        "employees",
        "skills_db_records",
        "lms_records",
        "analytics_events",
      ],
      mustCiteDocuments: [
        "skills-gap-analyzer-policy-handbook",
      ],
      expectedActionOutcome: "L&D Lead receives a fully-cited recommendation; no external state change without explicit approval.",
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
    rationale: "Row counts sized for Skills Gap Analyzer so the agent can demonstrate the workflow against realistic transactional volume without simulating a production warehouse.",
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
      id: "skills_db",
      name: "Skills DB",
      owns: [
        "skills_db_records",
        "skills_db_events",
        "skills_db_audit_trail",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_skills_db_skills_db_records",
        "query_skills_db_skills_db_events",
        "query_skills_db_skills_db_audit_trail",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
    {
      id: "lms",
      name: "LMS",
      owns: [
        "lms_records",
        "lms_events",
        "lms_audit_trail",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_lms_lms_records",
        "query_lms_lms_events",
        "query_lms_lms_audit_trail",
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
      name: "skills_db_records",
      sourceSystemId: "skills_db",
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
      name: "skills_db_events",
      sourceSystemId: "skills_db",
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
          name: "skills_db_record_id",
          type: "ref",
          ref: "skills_db_records.id",
          required: true,
        },
      ],
    },
    {
      name: "skills_db_audit_trail",
      sourceSystemId: "skills_db",
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
      name: "lms_records",
      sourceSystemId: "lms",
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
      name: "lms_events",
      sourceSystemId: "lms",
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
          name: "lms_record_id",
          type: "ref",
          ref: "lms_records.id",
          required: true,
        },
      ],
    },
    {
      name: "lms_audit_trail",
      sourceSystemId: "lms",
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
      from: "skills_db_events.skills_db_record_id",
      to: "skills_db_records.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
    {
      from: "lms_events.lms_record_id",
      to: "lms_records.id",
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
      id: "skills-gap-analyzer-policy-handbook",
      sourceSystemId: "google_bigquery",
      type: "policy",
      title: "Skills Gap Analyzer Policy Handbook",
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
      id: "skills-gap-analyzer-baseline-gap",
      description: "Seed a realistic gap where Mapping coverage sits between Key roles only and All roles, so the agent can detect, narrate, and recommend remediation.",
      affectedEntities: [
        "employees",
        "positions",
      ],
      discoveryPath: [
        "Inspect Workday records for the affected entities",
        "Compare against Skills DB historical baseline",
        "Generate a citation-backed recommendation",
      ],
      expectedEvidence: [
        "source-system record",
        "historical baseline metric",
        "generated audit trail",
      ],
      expectedRecommendation: "Explain the gap, cite supporting evidence, and propose the next L&D Lead action.",
    },
  ],
  datastorePackaging: {
    alloydb: {
      database: "skills_gap_analyzer",
      schemas: [
        "workday",
        "skills_db",
        "lms",
      ],
    },
    bigquery: {
      dataset: "hr_skills_gap_analyzer",
      tables: [
        "kpi_summary",
        "evidence_index",
      ],
    },
    cloudStorage: {
      bucketSuffix: "skills-gap-analyzer-evidence",
      prefixes: [
        "documents",
        "audit-trails",
        "exports",
      ],
    },
    apis: {
      serviceName: "skills-gap-analyzer-source-adapters",
      deploymentTarget: "cloud_run",
    },
  },
  validation: {
    smokePrompt: "Run the Skills Gap Analyzer workflow and cite source-system evidence for every claim.",
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

export const SkillsGapAnalyzer = () => (
  <UseCaseSlide
    title="Skills Gap Analyzer"
    subtitle="A-501 • L&D"
    icon={GraduationCap}
    domainId="domain-5"
    layer="Layer 3: Custom ADK"
    persona="L&D Lead"
    triggerType="scheduled"
    swimlane={swimlane}
    architecture={architecture}
    systems={["Workday", "Skills DB", "LMS", "Google BigQuery"]}
    kpis={[
      { label: "Mapping coverage", before: "Key roles only", after: "All roles" },
      { label: "Gap detection", before: "Annual survey", after: "Real-time" },
      { label: "Capability heatmap", before: "Spreadsheet", after: "Interactive" }
    ]}
    flow={flow}
    statusQuo={[
      "Skills gaps assessed via manual surveys and interviews.",
      "Prioritization driven by stakeholder influence, not data.",
      "Learning investment disconnected from future-state needs."
    ]}
    agentification={[
      "Dynamic skills mapping from projects, learning, and JDs.",
      "Heat maps identifying critical organizational capability gaps.",
      "Investment prioritization based on business impact evidence."
    ]}
  />
);
