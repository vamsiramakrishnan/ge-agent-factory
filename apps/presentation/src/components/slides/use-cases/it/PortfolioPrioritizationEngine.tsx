import React from "react";
import { UseCaseSlide } from "../../../agent/UseCaseSlide";
import { FlowStep } from "../../../agent/ProcessFlow";
import { SwimlaneFlow } from "../../../agent/SwimlaneFlow";
import { AgentArchitecture, UseCaseGenerationSpec, AgentBehaviorContract} from "../../../../types/architecture";
import { LayoutGrid, Database, Cpu, CheckCircle, FileText } from "lucide-react";

const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "s1", label: "Quarterly Cycle", lane: "system", type: "trigger" },
    { id: "a1", label: "Intake Aggregation", lane: "agent", type: "action" },
    { id: "a2", label: "Multi-Criteria Scoring", lane: "agent", type: "action" },
    { id: "a3", label: "Portfolio Ranking", lane: "agent", type: "output" },
    { id: "h1", label: "CIO Approval", lane: "human", type: "hitl" },
  ],
  connections: [["s1", "a1"], ["a1", "a2"], ["a2", "a3"], ["a3", "h1"]],
};

const flow: FlowStep[] = [
  { label: "Intake Aggregation", icon: Database, description: "Project proposals, resource capacity, and strategic objectives aggregated from intake systems.", trigger: "Quarterly", systems: ["Jira Portfolio", "ServiceNow SPM"] },
  { label: "Multi-Criteria Scoring", icon: Cpu, description: "ROI, strategic fit, risk, and resource availability scored with Monte Carlo on delivery timelines.", systems: ["BigQuery", "Vertex AI"], integration: "ADK" },
  { label: "Portfolio Ranking", icon: FileText, description: "Gemini identifies overlapping initiatives and recommends merging programs to optimize resource allocation.", systems: ["Vertex AI"] },
  { label: "CIO Review", icon: CheckCircle, description: "CIO validates portfolio ranking and approves investment allocation for the quarter.", output: "Approved Portfolio" },
];

const architecture: AgentArchitecture = {
  connections: [
    { system: "Jira Portfolio", description: "Project proposals, resource plans, delivery timelines", direction: "read", protocol: "REST API", category: "erp" },
    { system: "ServiceNow SPM", description: "IT demand intake, project financials, capacity data", direction: "read", protocol: "REST API", category: "erp" },
    { system: "BigQuery", description: "Portfolio analytics, scoring models, historical delivery data", direction: "bidirectional", protocol: "BigQuery SQL", category: "analytics" },
    { system: "Vertex AI (Gemini)", description: "Strategic alignment reasoning, overlap detection, narrative generation", direction: "bidirectional", protocol: "gRPC", category: "ai" },
    { system: "Google Slides", description: "Board-ready portfolio summary presentation", direction: "write", protocol: "Workspace API", category: "collaboration" },
  ],
  pipeline: [
    { label: "Intake Aggregation", description: "Pull project proposals from ServiceNow demand intake and Jira Portfolio. Cross-reference resource capacity from HRIS and strategic objectives from the OKR system.", systems: ["Jira Portfolio", "ServiceNow SPM"], layer: "integration", dataIn: "Project proposals, resource plans, OKR targets", dataOut: "Unified project dataset with capacity constraints" },
    { label: "Multi-Criteria Scoring & Simulation", description: "Score projects on ROI, strategic fit, risk, and resource availability. Run Monte Carlo simulation on delivery timelines to quantify schedule risk. Portfolio optimization using constraint programming.", systems: ["BigQuery", "Vertex AI"], layer: "ml", dataIn: "Unified project dataset", dataOut: "Scored and ranked portfolio with confidence intervals" },
    { label: "Strategic Reasoning & Overlap Detection", description: "Gemini reads project proposals and business cases in natural language. Identifies overlapping initiatives — 'Cloud Migration and Data Platform Modernization share 60% of infrastructure work.' Recommends merging programs with estimated savings.", systems: ["Vertex AI (Gemini)"], layer: "llm", dataIn: "Scored portfolio + proposal narratives", dataOut: "Optimized portfolio with consolidation recommendations" },
    { label: "Delivery & Review", description: "Portfolio ranking formatted as a board-ready presentation. CIO reviews and approves investment allocation before organizational communication.", systems: ["Google Slides"], layer: "integration", dataIn: "Optimized portfolio ranking", dataOut: "Approved portfolio for quarterly execution" },
  ],
};


const behaviorContract: AgentBehaviorContract = {
  role: "CIO / CTO agent for the Portfolio Prioritization Engine workflow",
  primaryObjective: "Gemini reads all project proposals in natural language and identifies initiative overlap with estimated savings from consolidation. Monte Carlo simulation on delivery timelines replaces gut-feel scheduling with probabilistic forecasts. so the CIO / CTO can move the Portfolio review cycle KPI.",
  inScope: [
    "Gemini reads all project proposals in natural language and identifies initiative overlap with estimated savings from consolidation",
    "Monte Carlo simulation on delivery timelines replaces gut-feel scheduling with probabilistic forecasts",
    "CIO receives a ranked portfolio with clear trade-offs, not a 50-slide deck requiring interpretation",
  ],
  outOfScope: [
    "Production deployments outside an approved change window",
    "Irreversible destructive actions on shared infrastructure (DROP, force-delete, key rotation)",
    "Security incident attribution requiring forensics",
  ],
  toolIntents: [
    {
      name: "query_servicenow_spm_tickets",
      kind: "query",
      sourceSystemId: "servicenow_spm",
      description: "Retrieve tickets from ServiceNow SPM for the Portfolio Prioritization Engine workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "tickets_records",
        "tickets_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_jira_portfolio_issues",
      kind: "query",
      sourceSystemId: "jira_portfolio",
      description: "Retrieve issues from Jira Portfolio for the Portfolio Prioritization Engine workflow.",
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
      description: "Retrieve analytics events from BigQuery for the Portfolio Prioritization Engine workflow.",
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
      name: "lookup_portfolio_prioritization_engine_runbook",
      kind: "evidence_lookup",
      sourceSystemId: "bigquery",
      description: "Look up sections of the Portfolio Prioritization Engine Operations Runbook to cite in narrative output, escalation rationale, and audit evidence.",
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
      claim: "Portfolio review cycle moved from 3-4 weeks toward 2 days",
      mustCite: [
        "servicenow_spm.tickets",
        "jira_portfolio.issues",
      ],
      sourceSystemIds: [
        "servicenow_spm",
        "jira_portfolio",
      ],
    },
    {
      claim: "Project overlap detected moved from Ad hoc toward Automated 100%",
      mustCite: [
        "servicenow_spm.tickets",
        "jira_portfolio.issues",
      ],
      sourceSystemIds: [
        "servicenow_spm",
        "jira_portfolio",
      ],
    },
  ],
  escalationRules: [
    {
      trigger: "Portfolio review cycle regresses past the 3-4 weeks baseline by more than 20%",
      action: "escalate_to_human",
      handoffTarget: "CIO / CTO",
      rationale: "Significant regressions need human judgment before automated remediation runs against production records.",
    },
    {
      trigger: "Source-system evidence is incomplete or stale (>24h) for any required entity",
      action: "request_more_info",
      rationale: "Recommendations grounded in stale evidence misrepresent current state and undermine audit defensibility.",
    },
  ],
  refusalRules: [
    "Never fabricate metric values; only publish numbers derived from ServiceNow SPM (and other named systems) entities.",
    "Never bypass CIO / CTO approval on escalation triggers, even when confidence is high.",
    "Never expose individual personal data (PII) in summaries; aggregate or pseudonymise before output.",
    "Never act on data older than the staleness threshold defined in the runbook without a fresh re-query.",
  ],
  goldenEvals: [
    {
      id: "portfolio-prioritization-engine-end-to-end",
      prompt: "Run the Portfolio Prioritization Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.",
      expectedToolCalls: [
        "query_servicenow_spm_tickets",
        "query_jira_portfolio_issues",
        "query_bigquery_analytics_events",
        "lookup_portfolio_prioritization_engine_runbook",
      ],
      mustReferenceEntities: [
        "tickets",
        "issues",
        "analytics_events",
      ],
      mustCiteDocuments: [
        "portfolio-prioritization-engine-runbook",
      ],
      expectedActionOutcome: "CIO / CTO receives a fully-cited recommendation; no external state change without explicit approval.",
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
    rationale: "Row counts sized for Portfolio Prioritization Engine so the agent can demonstrate the workflow against realistic transactional volume without simulating a production warehouse.",
  },
  sourceSystems: [
    {
      id: "servicenow_spm",
      name: "ServiceNow SPM",
      owns: [
        "tickets",
        "change_requests",
        "incidents",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_servicenow_spm_tickets",
        "query_servicenow_spm_change_requests",
        "query_servicenow_spm_incidents",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
    {
      id: "jira_portfolio",
      name: "Jira Portfolio",
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
        "query_jira_portfolio_issues",
        "query_jira_portfolio_sprints",
        "query_jira_portfolio_epics",
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
      name: "tickets",
      sourceSystemId: "servicenow_spm",
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
          name: "priority",
          type: "enum",
          values: [
            "P1",
            "P2",
            "P3",
            "P4",
          ],
          weights: [
            0.05,
            0.15,
            0.4,
            0.4,
          ],
          required: true,
        },
        {
          name: "status",
          type: "enum",
          values: [
            "open",
            "triaged",
            "in_progress",
            "resolved",
            "closed",
          ],
          required: true,
        },
        {
          name: "assignee",
          type: "person.fullName",
          required: true,
        },
        {
          name: "created_at",
          type: "date",
          required: true,
        },
        {
          name: "category",
          type: "enum",
          values: [
            "access",
            "hardware",
            "software",
            "network",
            "policy",
            "billing",
          ],
          required: true,
        },
        {
          name: "sla_met",
          type: "boolean",
          trueRate: 0.78,
        },
      ],
    },
    {
      name: "change_requests",
      sourceSystemId: "servicenow_spm",
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
          name: "priority",
          type: "enum",
          values: [
            "P1",
            "P2",
            "P3",
            "P4",
          ],
          weights: [
            0.05,
            0.15,
            0.4,
            0.4,
          ],
          required: true,
        },
        {
          name: "status",
          type: "enum",
          values: [
            "open",
            "triaged",
            "in_progress",
            "resolved",
            "closed",
          ],
          required: true,
        },
        {
          name: "assignee",
          type: "person.fullName",
          required: true,
        },
        {
          name: "created_at",
          type: "date",
          required: true,
        },
        {
          name: "category",
          type: "enum",
          values: [
            "access",
            "hardware",
            "software",
            "network",
            "policy",
            "billing",
          ],
          required: true,
        },
        {
          name: "sla_met",
          type: "boolean",
          trueRate: 0.78,
        },
      ],
    },
    {
      name: "incidents",
      sourceSystemId: "servicenow_spm",
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
          name: "priority",
          type: "enum",
          values: [
            "P1",
            "P2",
            "P3",
            "P4",
          ],
          weights: [
            0.05,
            0.15,
            0.4,
            0.4,
          ],
          required: true,
        },
        {
          name: "status",
          type: "enum",
          values: [
            "open",
            "triaged",
            "in_progress",
            "resolved",
            "closed",
          ],
          required: true,
        },
        {
          name: "assignee",
          type: "person.fullName",
          required: true,
        },
        {
          name: "created_at",
          type: "date",
          required: true,
        },
        {
          name: "category",
          type: "enum",
          values: [
            "access",
            "hardware",
            "software",
            "network",
            "policy",
            "billing",
          ],
          required: true,
        },
        {
          name: "sla_met",
          type: "boolean",
          trueRate: 0.78,
        },
      ],
    },
    {
      name: "issues",
      sourceSystemId: "jira_portfolio",
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
      sourceSystemId: "jira_portfolio",
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
      sourceSystemId: "jira_portfolio",
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
      id: "portfolio-prioritization-engine-runbook",
      sourceSystemId: "bigquery",
      type: "runbook",
      title: "Portfolio Prioritization Engine Operations Runbook",
      requiredSections: [
        "Detection signals",
        "Triage procedures",
        "Remediation actions",
        "Rollback criteria",
        "Post-incident review",
      ],
      linkedEntities: [
        "tickets",
        "change_requests",
        "incidents",
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
      id: "portfolio-prioritization-engine-baseline-gap",
      description: "Seed a realistic gap where Portfolio review cycle sits between 3-4 weeks and 2 days, so the agent can detect, narrate, and recommend remediation.",
      affectedEntities: [
        "tickets",
        "change_requests",
      ],
      discoveryPath: [
        "Inspect ServiceNow SPM records for the affected entities",
        "Compare against Jira Portfolio historical baseline",
        "Generate a citation-backed recommendation",
      ],
      expectedEvidence: [
        "source-system record",
        "historical baseline metric",
        "generated audit trail",
      ],
      expectedRecommendation: "Explain the gap, cite supporting evidence, and propose the next CIO / CTO action.",
    },
  ],
  datastorePackaging: {
    alloydb: {
      database: "portfolio_prioritization_engine",
      schemas: [
        "servicenow_spm",
        "jira_portfolio",
      ],
    },
    bigquery: {
      dataset: "it_portfolio_prioritization_engine",
      tables: [
        "kpi_summary",
        "evidence_index",
      ],
    },
    cloudStorage: {
      bucketSuffix: "portfolio-prioritization-engine-evidence",
      prefixes: [
        "documents",
        "audit-trails",
        "exports",
      ],
    },
    apis: {
      serviceName: "portfolio-prioritization-engine-source-adapters",
      deploymentTarget: "cloud_run",
    },
  },
  validation: {
    smokePrompt: "Run the Portfolio Prioritization Engine workflow and cite source-system evidence for every claim.",
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

export const PortfolioPrioritizationEngine = () => (
  <UseCaseSlide
    title="Portfolio Prioritization Engine"
    subtitle="A-3801 • IT Strategy & Portfolio"
    icon={LayoutGrid}
    domainId="domain-38"
    layer="Layer 3: Custom ADK"
    persona="CIO / CTO"
    systems={["ServiceNow SPM", "Jira Portfolio", "BigQuery", "Vertex AI"]}
    kpis={[
      { label: "Portfolio review cycle", before: "3-4 weeks", after: "2 days" },
      { label: "Project overlap detected", before: "Ad hoc", after: "Automated 100%" },
      { label: "Resource utilization accuracy", before: "60%", after: "92%" },
    ]}
    triggerType="scheduled"
    swimlane={swimlane}
    flow={flow}
    architecture={architecture}
    hitl={{ actor: "CIO", action: "Approve portfolio ranking", description: "CIO validates scoring weights, reviews consolidation recommendations, and approves quarterly investment allocation." }}
    statusQuo={[
      "Portfolio reviews consume 3-4 weeks of executive time with spreadsheet-based scoring and debate.",
      "Overlapping initiatives discovered only after both are funded and staffed.",
      "Resource allocation based on political negotiation rather than data-driven capacity analysis."
    ]}
    agentification={[
      "Gemini reads all project proposals in natural language and identifies initiative overlap with estimated savings from consolidation.",
      "Monte Carlo simulation on delivery timelines replaces gut-feel scheduling with probabilistic forecasts.",
      "CIO receives a ranked portfolio with clear trade-offs, not a 50-slide deck requiring interpretation."
    ]}
  />
);
