import React from "react";
import { UseCaseSlide } from "../../../agent/UseCaseSlide";
import { FlowStep } from "../../../agent/ProcessFlow";
import { SwimlaneFlow } from "../../../agent/SwimlaneFlow";
import { AgentArchitecture, UseCaseGenerationSpec, AgentBehaviorContract} from "../../../../types/architecture";
import { Layers, Database, Cpu, FileText, BarChart3 } from "lucide-react";

const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "s1", label: "Sprint Planning", lane: "system", type: "trigger" },
    { id: "a1", label: "Metric Aggregation", lane: "agent", type: "action" },
    { id: "a2", label: "Debt Scoring", lane: "agent", type: "action" },
    { id: "a3", label: "Priority Ranking", lane: "agent", type: "output" },
    { id: "s2", label: "Sprint Backlog", lane: "system", type: "output" },
  ],
  connections: [["s1", "a1"], ["a1", "a2"], ["a2", "a3"], ["a3", "s2"]],
};

const flow: FlowStep[] = [
  { label: "Metric Aggregation", icon: Database, description: "Code quality metrics, dependency age, vulnerability counts, and incident correlation data aggregated.", trigger: "Bi-weekly", systems: ["SonarQube", "GitHub", "Jira"] },
  { label: "Debt Scoring", icon: Cpu, description: "Technical debt scored by code smells x change frequency x incident correlation with refactoring ROI estimation.", systems: ["BigQuery", "Vertex AI"], integration: "API" },
  { label: "Priority Ranking", icon: FileText, description: "Gemini prioritizes debt with business context — correlating maintenance burden with feature delivery impact.", systems: ["Vertex AI"] },
  { label: "Sprint Integration", icon: BarChart3, description: "Prioritized tech debt items recommended for sprint allocation with estimated payback period.", output: "Ranked Tech Debt Backlog" },
];

const architecture: AgentArchitecture = {
  connections: [
    { system: "SonarQube", description: "Code smells, complexity metrics, duplication, security hotspots", direction: "read", protocol: "REST API", category: "analytics" },
    { system: "GitHub", description: "Change frequency, file churn, dependency age, contributor patterns", direction: "read", protocol: "GraphQL API", category: "erp" },
    { system: "Jira", description: "Incident tickets, sprint velocity, feature backlog priorities", direction: "read", protocol: "REST API", category: "erp" },
    { system: "BigQuery", description: "Debt scoring models, incident correlation data, ROI calculations", direction: "bidirectional", protocol: "BigQuery SQL", category: "analytics" },
    { system: "Vertex AI (Gemini)", description: "Business context reasoning, priority ranking, sprint allocation advice", direction: "bidirectional", protocol: "gRPC", category: "ai" },
  ],
  pipeline: [
    { label: "Metric Aggregation", description: "Aggregate code quality metrics from SonarQube, dependency age and change frequency from GitHub, vulnerability counts from Snyk, and incident correlation from Jira.", systems: ["SonarQube", "GitHub", "Jira"], layer: "integration", dataIn: "Code quality + change history + incident data", dataOut: "Unified tech debt metrics by module" },
    { label: "Debt Scoring & ROI Estimation", description: "Score technical debt using composite metric: code smells x change frequency x incident correlation. Estimate refactoring ROI based on reduced incident rate and improved change velocity.", systems: ["BigQuery"], layer: "ml", dataIn: "Unified debt metrics", dataOut: "Scored debt items with ROI estimates" },
    { label: "Business Context Prioritization", description: "Gemini prioritizes with context: 'The auth module has highest debt score — involved in 4 incidents this quarter, every change takes 3x longer. Recommend 20% of sprint to refactoring before adding SSO.'", systems: ["Vertex AI (Gemini)"], layer: "llm", dataIn: "Debt scores + incident history + feature roadmap", dataOut: "Prioritized debt backlog with business rationale" },
    { label: "Sprint Integration", description: "Recommended tech debt items formatted as Jira stories with acceptance criteria, estimated effort, and expected payback period for sprint planning.", systems: ["Jira"], layer: "integration", dataIn: "Prioritized debt items", dataOut: "Tech debt stories in sprint backlog" },
  ],
};


const behaviorContract: AgentBehaviorContract = {
  role: "VP Engineering / DevOps Lead agent for the Tech Debt Prioritizer workflow",
  primaryObjective: "Gemini correlates code quality with incidents and change velocity to produce a data-driven priority ranking. Refactoring ROI estimation gives engineering leadership a business case for tech debt investment. so the VP Engineering / DevOps Lead can move the Debt prioritization method KPI.",
  inScope: [
    "Gemini correlates code quality with incidents and change velocity to produce a data-driven priority ranking",
    "Refactoring ROI estimation gives engineering leadership a business case for tech debt investment",
    "Sprint planning shifts from debate to data — the auth module refactor would prevent 4 incidents per quarter",
  ],
  outOfScope: [
    "Production deployments outside an approved change window",
    "Irreversible destructive actions on shared infrastructure (DROP, force-delete, key rotation)",
    "Security incident attribution requiring forensics",
  ],
  toolIntents: [
    {
      name: "query_sonarqube_code_smells",
      kind: "query",
      sourceSystemId: "sonarqube",
      description: "Retrieve code smells from SonarQube for the Tech Debt Prioritizer workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "code_smells_records",
        "code_smells_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_github_pull_requests",
      kind: "query",
      sourceSystemId: "github",
      description: "Retrieve pull requests from GitHub for the Tech Debt Prioritizer workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "pull_requests_records",
        "pull_requests_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_jira_issues",
      kind: "query",
      sourceSystemId: "jira",
      description: "Retrieve issues from Jira for the Tech Debt Prioritizer workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "issues_records",
        "issues_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_bigquery_analytics_events",
      kind: "query",
      sourceSystemId: "bigquery",
      description: "Retrieve analytics events from BigQuery for the Tech Debt Prioritizer workflow.",
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
      name: "lookup_tech_debt_prioritizer_runbook",
      kind: "evidence_lookup",
      sourceSystemId: "bigquery",
      description: "Look up sections of the Tech Debt Prioritizer Operations Runbook to cite in narrative output, escalation rationale, and audit evidence.",
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
      claim: "Debt prioritization method moved from Gut feel toward Data-driven scoring",
      mustCite: [
        "sonarqube.code_smells",
        "github.pull_requests",
      ],
      sourceSystemIds: [
        "sonarqube",
        "github",
      ],
    },
    {
      claim: "Incident reduction from refactoring moved from Unknown toward 40% fewer repeat incidents",
      mustCite: [
        "sonarqube.code_smells",
        "github.pull_requests",
      ],
      sourceSystemIds: [
        "sonarqube",
        "github",
      ],
    },
  ],
  escalationRules: [
    {
      trigger: "Debt prioritization method regresses past the Gut feel baseline by more than 20%",
      action: "escalate_to_human",
      handoffTarget: "VP Engineering / DevOps Lead",
      rationale: "Significant regressions need human judgment before automated remediation runs against production records.",
    },
    {
      trigger: "Source-system evidence is incomplete or stale (>24h) for any required entity",
      action: "request_more_info",
      rationale: "Recommendations grounded in stale evidence misrepresent current state and undermine audit defensibility.",
    },
  ],
  refusalRules: [
    "Never fabricate metric values; only publish numbers derived from SonarQube (and other named systems) entities.",
    "Never bypass VP Engineering / DevOps Lead approval on escalation triggers, even when confidence is high.",
    "Never expose individual personal data (PII) in summaries; aggregate or pseudonymise before output.",
    "Never act on data older than the staleness threshold defined in the runbook without a fresh re-query.",
  ],
  goldenEvals: [
    {
      id: "tech-debt-prioritizer-end-to-end",
      prompt: "Run the Tech Debt Prioritizer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.",
      expectedToolCalls: [
        "query_sonarqube_code_smells",
        "query_github_pull_requests",
        "query_jira_issues",
        "query_bigquery_analytics_events",
        "lookup_tech_debt_prioritizer_runbook",
      ],
      mustReferenceEntities: [
        "code_smells",
        "pull_requests",
        "issues",
        "analytics_events",
      ],
      mustCiteDocuments: [
        "tech-debt-prioritizer-runbook",
      ],
      expectedActionOutcome: "VP Engineering / DevOps Lead receives a fully-cited recommendation; no external state change without explicit approval.",
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
    rationale: "Row counts sized for Tech Debt Prioritizer so the agent can demonstrate the workflow against realistic transactional volume without simulating a production warehouse.",
  },
  sourceSystems: [
    {
      id: "sonarqube",
      name: "SonarQube",
      owns: [
        "code_smells",
        "security_hotspots",
        "quality_gates",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_sonarqube_code_smells",
        "query_sonarqube_security_hotspots",
        "query_sonarqube_quality_gates",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
    {
      id: "github",
      name: "GitHub",
      owns: [
        "pull_requests",
        "commits",
        "workflow_runs",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_github_pull_requests",
        "query_github_commits",
        "query_github_workflow_runs",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
    {
      id: "jira",
      name: "Jira",
      owns: [
        "issues",
        "sprints",
        "epics",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_jira_issues",
        "query_jira_sprints",
        "query_jira_epics",
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
      name: "code_smells",
      sourceSystemId: "sonarqube",
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
          name: "severity",
          type: "enum",
          values: [
            "low",
            "medium",
            "high",
            "critical",
          ],
          weights: [
            0.4,
            0.35,
            0.2,
            0.05,
          ],
          required: true,
        },
        {
          name: "status",
          type: "enum",
          values: [
            "open",
            "triaged",
            "mitigated",
            "accepted_risk",
            "closed",
          ],
          required: true,
        },
        {
          name: "detected_at",
          type: "date",
          required: true,
        },
        {
          name: "asset",
          type: "lorem.words",
          required: true,
        },
      ],
    },
    {
      name: "security_hotspots",
      sourceSystemId: "sonarqube",
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
          name: "severity",
          type: "enum",
          values: [
            "low",
            "medium",
            "high",
            "critical",
          ],
          weights: [
            0.4,
            0.35,
            0.2,
            0.05,
          ],
          required: true,
        },
        {
          name: "status",
          type: "enum",
          values: [
            "open",
            "triaged",
            "mitigated",
            "accepted_risk",
            "closed",
          ],
          required: true,
        },
        {
          name: "detected_at",
          type: "date",
          required: true,
        },
        {
          name: "asset",
          type: "lorem.words",
          required: true,
        },
      ],
    },
    {
      name: "quality_gates",
      sourceSystemId: "sonarqube",
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
          name: "severity",
          type: "enum",
          values: [
            "low",
            "medium",
            "high",
            "critical",
          ],
          weights: [
            0.4,
            0.35,
            0.2,
            0.05,
          ],
          required: true,
        },
        {
          name: "status",
          type: "enum",
          values: [
            "open",
            "triaged",
            "mitigated",
            "accepted_risk",
            "closed",
          ],
          required: true,
        },
        {
          name: "detected_at",
          type: "date",
          required: true,
        },
        {
          name: "asset",
          type: "lorem.words",
          required: true,
        },
      ],
    },
    {
      name: "pull_requests",
      sourceSystemId: "github",
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
      name: "commits",
      sourceSystemId: "github",
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
      name: "workflow_runs",
      sourceSystemId: "github",
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
          name: "name",
          type: "lorem.words",
          required: true,
        },
        {
          name: "status",
          type: "enum",
          values: [
            "pending",
            "running",
            "succeeded",
            "failed",
            "rolled_back",
          ],
          required: true,
        },
        {
          name: "duration_seconds",
          type: "number",
          min: 5,
          max: 7200,
          required: true,
        },
        {
          name: "started_at",
          type: "date",
          required: true,
        },
        {
          name: "environment",
          type: "enum",
          values: [
            "dev",
            "staging",
            "prod",
          ],
          required: true,
        },
      ],
    },
    {
      name: "issues",
      sourceSystemId: "jira",
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
      name: "sprints",
      sourceSystemId: "jira",
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
      name: "epics",
      sourceSystemId: "jira",
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
      from: "analytics_events.historical_metric_id",
      to: "historical_metrics.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
  ],
  documents: [
    {
      id: "tech-debt-prioritizer-runbook",
      sourceSystemId: "bigquery",
      type: "runbook",
      title: "Tech Debt Prioritizer Operations Runbook",
      requiredSections: [
        "Detection signals",
        "Triage procedures",
        "Remediation actions",
        "Rollback criteria",
        "Post-incident review",
      ],
      linkedEntities: [
        "code_smells",
        "security_hotspots",
        "quality_gates",
      ],
      minimumWordCount: 500,
      citationAnchors: [
        "detection",
        "triage",
        "remediation",
        "rollback",
      ],
    },
  ],
  apis: [],
  anomalies: [
    {
      id: "tech-debt-prioritizer-baseline-gap",
      description: "Seed a realistic gap where Debt prioritization method sits between Gut feel and Data-driven scoring, so the agent can detect, narrate, and recommend remediation.",
      affectedEntities: [
        "code_smells",
        "security_hotspots",
      ],
      discoveryPath: [
        "Inspect SonarQube records for the affected entities",
        "Compare against GitHub historical baseline",
        "Generate a citation-backed recommendation",
      ],
      expectedEvidence: [
        "source-system record",
        "historical baseline metric",
        "generated audit trail",
      ],
      expectedRecommendation: "Explain the gap, cite supporting evidence, and propose the next VP Engineering / DevOps Lead action.",
    },
  ],
  datastorePackaging: {
    alloydb: {
      database: "tech_debt_prioritizer",
      schemas: [
        "sonarqube",
        "github",
        "jira",
      ],
    },
    bigquery: {
      dataset: "it_tech_debt_prioritizer",
      tables: [
        "kpi_summary",
        "evidence_index",
      ],
    },
    cloudStorage: {
      bucketSuffix: "tech-debt-prioritizer-evidence",
      prefixes: [
        "documents",
        "audit-trails",
        "exports",
      ],
    },
    apis: {
      serviceName: "tech-debt-prioritizer-source-adapters",
      deploymentTarget: "cloud_run",
    },
  },
  validation: {
    smokePrompt: "Run the Tech Debt Prioritizer workflow and cite source-system evidence for every claim.",
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

export const TechDebtPrioritizer = () => (
  <UseCaseSlide
    title="Tech Debt Prioritizer"
    subtitle="A-3903 • Software Engineering & DevOps"
    icon={Layers}
    domainId="domain-39"
    layer="Layer 4: Data Agent"
    persona="VP Engineering / DevOps Lead"
    systems={["SonarQube", "GitHub", "Jira", "BigQuery", "Vertex AI"]}
    kpis={[
      { label: "Debt prioritization method", before: "Gut feel", after: "Data-driven scoring" },
      { label: "Incident reduction from refactoring", before: "Unknown", after: "40% fewer repeat incidents" },
      { label: "Sprint debt allocation", before: "0-5% ad hoc", after: "20% systematic" },
    ]}
    triggerType="scheduled"
    swimlane={swimlane}
    flow={flow}
    architecture={architecture}
    statusQuo={[
      "Tech debt prioritized by gut feel during sprint planning — the loudest engineer wins allocation.",
      "No correlation between code quality metrics and actual incident frequency or change velocity impact.",
      "Refactoring rarely happens because there is no quantified business case to justify the investment."
    ]}
    agentification={[
      "Gemini correlates code quality with incidents and change velocity to produce a data-driven priority ranking.",
      "Refactoring ROI estimation gives engineering leadership a business case for tech debt investment.",
      "Sprint planning shifts from debate to data — the auth module refactor would prevent 4 incidents per quarter."
    ]}
  />
);
