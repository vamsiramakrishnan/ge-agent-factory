import React from "react";
import { UseCaseSlide } from "../../../agent/UseCaseSlide";
import { FlowStep } from "../../../agent/ProcessFlow";
import { SwimlaneFlow } from "../../../agent/SwimlaneFlow";
import { AgentArchitecture, UseCaseGenerationSpec, AgentBehaviorContract} from "../../../../types/architecture";
import { LogOut, Download, Brain, TrendingUp, FileText } from "lucide-react";

const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "n1", label: "Responses Collected", lane: "system", type: "trigger" },
    { id: "n2", label: "Theme Extraction", lane: "agent", type: "action" },
    { id: "n3", label: "Trend Analysis", lane: "agent", type: "action" },
    { id: "n4", label: "Leadership Brief", lane: "agent", type: "output" },
  ],
  connections: [["n1", "n2"], ["n2", "n3"], ["n3", "n4"]],
};

const architecture: AgentArchitecture = {
  connections: [
    { system: "Qualtrics", description: "Exit interview responses, survey transcripts, structured feedback", direction: "read", protocol: "REST API", category: "erp" },
    { system: "Workday", description: "Departing employee demographics, tenure, department, manager", direction: "read", protocol: "REST API", category: "erp" },
    { system: "BigQuery", description: "Exit theme warehouse, historical departure trends, retention data", direction: "bidirectional", protocol: "BigQuery SQL", category: "analytics" },
    { system: "Vertex AI (Gemini)", description: "NLP theme extraction, sentiment analysis, retention recommendation generation", direction: "bidirectional", protocol: "gRPC", category: "ai" },
  ],
  pipeline: [
    { label: "Response Collection", description: "Aggregate exit interview transcripts and survey data from Qualtrics. Enrich with Workday demographics — tenure, level, department, manager — for segmented analysis.", systems: ["Qualtrics", "Workday"], layer: "integration", dataIn: "Exit interview responses + departing employee metadata", dataOut: "Enriched exit response dataset by segment" },
    { label: "Theme Extraction", description: "Gemini performs NLP analysis on open-text responses to extract departure themes and sentiment. Categorize by theme (compensation, growth, management, culture) with verbatim evidence.", systems: ["Vertex AI (Gemini)"], layer: "llm", dataIn: "Enriched exit response dataset", dataOut: "Theme clusters with sentiment scores and verbatims" },
    { label: "Trend Analysis", description: "Analyze departure themes over time by department, tenure cohort, level, and manager. Identify emerging patterns and compare against historical benchmarks.", systems: ["BigQuery"], layer: "ml", dataIn: "Theme clusters + historical departure data", dataOut: "Trend report with emerging pattern alerts" },
    { label: "Leadership Brief", description: "Generate actionable insight summaries for leadership with targeted retention recommendations. Prioritize interventions by estimated impact on future attrition.", systems: ["Vertex AI (Gemini)"], layer: "llm", dataIn: "Trend report + retention intervention data", dataOut: "Leadership brief with prioritized retention recommendations" },
  ],
};


const behaviorContract: AgentBehaviorContract = {
  role: "HRBP agent for the Exit Interview Insight Synthesizer workflow",
  primaryObjective: "NLP analysis of exit interview responses for automated theme extraction. Trend reporting by department, tenure, and level with historical comparison. so the HRBP can move the Analysis method KPI.",
  inScope: [
    "NLP analysis of exit interview responses for automated theme extraction",
    "Trend reporting by department, tenure, and level with historical comparison",
    "Actionable insight summaries for leadership with targeted retention recommendations",
  ],
  outOfScope: [
    "Final hiring, termination, or compensation decisions (HRBP/leadership retains authority)",
    "Performance management adjudication and disciplinary action",
    "Legal interpretation of employment law in ambiguous jurisdictions",
  ],
  toolIntents: [
    {
      name: "query_survey_platform_survey_platform_records",
      kind: "query",
      sourceSystemId: "survey_platform",
      description: "Retrieve survey platform records from Survey Platform for the Exit Interview Insight Synthesizer workflow.",
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
      name: "query_workday_employees",
      kind: "query",
      sourceSystemId: "workday",
      description: "Retrieve employees from Workday for the Exit Interview Insight Synthesizer workflow.",
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
      name: "query_google_docs_documents",
      kind: "query",
      sourceSystemId: "google_docs",
      description: "Retrieve documents from Google Docs for the Exit Interview Insight Synthesizer workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "documents_records",
        "documents_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "lookup_exit_interview_insight_synthesizer_policy_handbook",
      kind: "evidence_lookup",
      sourceSystemId: "google_docs",
      description: "Look up sections of the Exit Interview Insight Synthesizer Policy Handbook to cite in narrative output, escalation rationale, and audit evidence.",
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
      name: "action_survey_platform_recommend",
      kind: "action",
      sourceSystemId: "survey_platform",
      description: "Execute the recommend step in Survey Platform after the agent has gathered evidence and validated escalation gates.",
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
      claim: "Analysis method moved from Read individually toward NLP theme extraction",
      mustCite: [
        "survey_platform.survey_platform_records",
        "workday.employees",
      ],
      sourceSystemIds: [
        "survey_platform",
        "workday",
      ],
    },
    {
      claim: "Insight delivery moved from Quarterly if ever toward Monthly automated",
      mustCite: [
        "survey_platform.survey_platform_records",
        "workday.employees",
      ],
      sourceSystemIds: [
        "survey_platform",
        "workday",
      ],
    },
  ],
  escalationRules: [
    {
      trigger: "Analysis method regresses past the Read individually baseline by more than 20%",
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
      trigger: "Proposed recommend action lacks supporting evidence from at least two systems",
      action: "refuse",
      rationale: "Single-system evidence is insufficient to authorize external state changes without manual review.",
    },
  ],
  refusalRules: [
    "Never fabricate metric values; only publish numbers derived from Survey Platform (and other named systems) entities.",
    "Never bypass HRBP approval on escalation triggers, even when confidence is high.",
    "Never expose individual personal data (PII) in summaries; aggregate or pseudonymise before output.",
    "Never act on data older than the staleness threshold defined in the runbook without a fresh re-query.",
  ],
  goldenEvals: [
    {
      id: "exit-interview-insight-synthesizer-end-to-end",
      prompt: "Run the Exit Interview Insight Synthesizer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.",
      expectedToolCalls: [
        "query_survey_platform_survey_platform_records",
        "query_workday_employees",
        "query_google_docs_documents",
        "lookup_exit_interview_insight_synthesizer_policy_handbook",
        "action_survey_platform_recommend",
      ],
      mustReferenceEntities: [
        "survey_platform_records",
        "employees",
        "documents",
      ],
      mustCiteDocuments: [
        "exit-interview-insight-synthesizer-policy-handbook",
      ],
      expectedActionOutcome: "Action recommend executed against Survey Platform, with audit-trail entry and HRBP notified of outcomes.",
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
    rationale: "Row counts sized for Exit Interview Insight Synthesizer so the agent can demonstrate the workflow against realistic transactional volume without simulating a production warehouse.",
  },
  sourceSystems: [
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
      id: "google_docs",
      name: "Google Docs",
      owns: [
        "documents",
        "comments",
        "revision_history",
      ],
      protocol: "Workspace API",
      localBacking: [
        "cloud-storage",
      ],
      toolNames: [
        "query_google_docs_documents",
        "query_google_docs_comments",
        "query_google_docs_revision_history",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
  ],
  entities: [
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
      name: "documents",
      sourceSystemId: "google_docs",
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
          name: "title",
          type: "lorem.sentence",
          required: true,
        },
        {
          name: "owner",
          type: "person.fullName",
          required: true,
        },
        {
          name: "status",
          type: "enum",
          values: [
            "draft",
            "review",
            "published",
            "archived",
          ],
          required: true,
        },
        {
          name: "last_updated",
          type: "date",
          required: true,
        },
      ],
    },
    {
      name: "comments",
      sourceSystemId: "google_docs",
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
      name: "revision_history",
      sourceSystemId: "google_docs",
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
          name: "document_id",
          type: "ref",
          ref: "documents.id",
          required: true,
        },
      ],
    },
  ],
  relationships: [
    {
      from: "survey_platform_events.survey_platform_record_id",
      to: "survey_platform_records.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
    {
      from: "revision_history.document_id",
      to: "documents.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
  ],
  documents: [
    {
      id: "exit-interview-insight-synthesizer-policy-handbook",
      sourceSystemId: "survey_platform",
      type: "policy",
      title: "Exit Interview Insight Synthesizer Policy Handbook",
      requiredSections: [
        "Eligibility and scope",
        "Workflow steps",
        "Manager responsibilities",
        "Compliance and audit",
        "Sensitive-data handling",
      ],
      linkedEntities: [
        "survey_platform_records",
        "survey_platform_events",
        "survey_platform_audit_trail",
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
      id: "survey_platform_recommend_api",
      sourceSystemId: "survey_platform",
      method: "POST",
      path: "/api/survey_platform/recommend",
      description: "Synchronous endpoint the agent calls to recommend in Survey Platform after evidence gating.",
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
      id: "exit-interview-insight-synthesizer-baseline-gap",
      description: "Seed a realistic gap where Analysis method sits between Read individually and NLP theme extraction, so the agent can detect, narrate, and recommend remediation.",
      affectedEntities: [
        "survey_platform_records",
        "survey_platform_events",
      ],
      discoveryPath: [
        "Inspect Survey Platform records for the affected entities",
        "Compare against Workday historical baseline",
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
      database: "exit_interview_insight_synthesizer",
      schemas: [
        "survey_platform",
        "workday",
        "google_docs",
      ],
    },
    bigquery: {
      dataset: "hr_exit_interview_insight_synthesizer",
      tables: [
        "kpi_summary",
        "evidence_index",
      ],
    },
    cloudStorage: {
      bucketSuffix: "exit-interview-insight-synthesizer-evidence",
      prefixes: [
        "documents",
        "audit-trails",
        "exports",
      ],
    },
    apis: {
      serviceName: "exit-interview-insight-synthesizer-source-adapters",
      deploymentTarget: "cloud_run",
    },
  },
  validation: {
    smokePrompt: "Run the Exit Interview Insight Synthesizer workflow and cite source-system evidence for every claim.",
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

export const ExitInterviewSynthesizer = () => (
  <UseCaseSlide
    triggerType="scheduled"
    swimlane={swimlane}
    title="Exit Interview Insight Synthesizer"
    subtitle="A-808 • Offboarding"
    icon={LogOut}
    domainId="domain-8"
    layer="Layer 1: OOTB"
    persona="HRBP"
    systems={["Survey Platform", "Workday", "Google Docs"]}
    kpis={[
      { label: "Analysis method", before: "Read individually", after: "NLP theme extraction" },
      { label: "Insight delivery", before: "Quarterly if ever", after: "Monthly automated" },
      { label: "Action linkage", before: "None", after: "Retention recommendations" }
    ]}
    statusQuo={[
      "Exit interviews conducted inconsistently with varying question quality.",
      "Response data sits unanalyzed in forms and spreadsheets.",
      "Leadership rarely sees aggregated departure insights or actionable themes."
    ]}
    agentification={[
      "NLP analysis of exit interview responses for automated theme extraction.",
      "Trend reporting by department, tenure, and level with historical comparison.",
      "Actionable insight summaries for leadership with targeted retention recommendations."
    ]}
    architecture={architecture}
    flow={[
      { label: "Responses Collected", icon: Download, description: "Exit interview transcripts and survey data.", trigger: "Monthly", systems: ["Survey Platform"] },
      { label: "Theme Extraction", icon: Brain, description: "NLP analysis for departure reasons and themes.", systems: ["Gemini"], integration: "OOTB" },
      { label: "Trend Analysis", icon: TrendingUp, description: "Trends by department, tenure, level, manager." },
      { label: "Leadership Brief", icon: FileText, description: "Actionable insights with retention recommendations.", output: "Exit Report" }
    ]}
  />
);
