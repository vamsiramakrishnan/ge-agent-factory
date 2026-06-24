import React from "react";
import { UseCaseSlide } from "../../../agent/UseCaseSlide";
import { FlowStep } from "../../../agent/ProcessFlow";
import { SwimlaneFlow } from "../../../agent/SwimlaneFlow";
import { AgentArchitecture, UseCaseGenerationSpec, AgentBehaviorContract} from "../../../../types/architecture";
import { Calculator, Database, GitMerge, FileText, CheckCircle } from "lucide-react";

const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "s1", label: "Budget Cycle Start", lane: "system", type: "trigger" },
    { id: "a1", label: "Template Distribution", lane: "agent", type: "action" },
    { id: "a2", label: "Submission Consolidation", lane: "agent", type: "action" },
    { id: "a3", label: "Narrative Synthesis", lane: "agent", type: "output" },
    { id: "h1", label: "CFO Approves Budget", lane: "human", type: "hitl" },
  ],
  connections: [["s1", "a1"], ["a1", "a2"], ["a2", "a3"], ["a3", "h1"]],
};

const flow: FlowStep[] = [
  { label: "Actuals Ingest", icon: Database, description: "Pull actuals from ERP and distribute budget templates to BU leaders.", trigger: "Annual/Quarterly", systems: ["SAP BPC", "Anaplan"] },
  { label: "Consolidation", icon: GitMerge, description: "Consolidate 20+ BU submissions, resolve conflicts, and baseline against historical spend.", systems: ["Anaplan", "BigQuery"], integration: "ADK" },
  { label: "Narrative Synthesis", icon: FileText, description: "Gemini reads BU justifications and synthesizes into coherent CFO-ready budget narrative.", systems: ["Vertex AI"] },
  { label: "CFO Approval", icon: CheckCircle, description: "CFO validates consolidated budget, savings targets, and investment priorities.", output: "Approved Budget" },
];

const architecture: AgentArchitecture = {
  connections: [
    { system: "Anaplan", description: "Budget templates, BU submissions, consolidation workspace", direction: "bidirectional", protocol: "REST API", category: "erp" },
    { system: "SAP BPC", description: "Historical actuals, prior-year budget baseline", direction: "read", protocol: "RFC/BAPI", category: "erp" },
    { system: "Workday Adaptive", description: "Workforce planning inputs, headcount budgets", direction: "read", protocol: "REST API", category: "erp" },
    { system: "BigQuery", description: "Enriched spend analytics, trend baselines, variance history", direction: "bidirectional", protocol: "BigQuery SQL", category: "analytics" },
    { system: "Vertex AI (Gemini)", description: "Budget narrative synthesis, justification assessment", direction: "bidirectional", protocol: "gRPC", category: "ai" },
  ],
  pipeline: [
    { label: "Actuals & Template Distribution", description: "Pull actuals from ERP, generate pre-populated budget templates with historical baselines, and distribute to 20+ BU leaders with submission deadlines.", systems: ["SAP BPC", "Anaplan"], layer: "integration", dataIn: "GL actuals, prior-year budget", dataOut: "Pre-populated BU templates" },
    { label: "Submission Consolidation", description: "Aggregate BU submissions, apply growth rate modeling, detect departmental outliers, and reconcile cross-BU dependencies.", systems: ["Anaplan", "BigQuery"], layer: "ml", dataIn: "20+ BU budget submissions", dataOut: "Consolidated budget with variance flags" },
    { label: "Narrative Synthesis", description: "Gemini reads narrative justifications from BU leaders and assesses reasonableness against historical patterns and strategic priorities. Synthesizes into a coherent CFO-ready budget narrative.", systems: ["Vertex AI (Gemini)"], layer: "llm", dataIn: "Consolidated budget + BU narratives", dataOut: "CFO-ready budget package with narrative" },
    { label: "Approval & Distribution", description: "Route consolidated budget to CFO for approval, then distribute approved targets back to BUs with variance explanations.", systems: ["Anaplan", "Email"], layer: "integration", dataIn: "Approved budget narrative", dataOut: "Distributed budget targets" },
  ],
};


const behaviorContract: AgentBehaviorContract = {
  role: "CFO / FP&A Director agent for the Budget Builder & Consolidation workflow",
  primaryObjective: "Gemini reads all BU narrative justifications and assesses reasonableness against historical patterns. Automated consolidation resolves cross-BU conflicts and flags outlier growth assumptions. so the CFO / FP&A Director can move the Budget cycle time KPI.",
  inScope: [
    "Gemini reads all BU narrative justifications and assesses reasonableness against historical patterns",
    "Automated consolidation resolves cross-BU conflicts and flags outlier growth assumptions",
    "Synthesizes 20+ submissions into a coherent CFO-ready budget narrative with strategic alignment assessment",
  ],
  outOfScope: [
    "Final sign-off on materially significant journal entries (Controller retains authority)",
    "Restatement of prior-period filings",
    "Tax position changes that require external advisor review",
  ],
  toolIntents: [
    {
      name: "query_anaplan_budget_lines",
      kind: "query",
      sourceSystemId: "anaplan",
      description: "Retrieve budget lines from Anaplan for the Budget Builder & Consolidation workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "budget_lines_records",
        "budget_lines_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_sap_bpc_budget_lines",
      kind: "query",
      sourceSystemId: "sap_bpc",
      description: "Retrieve budget lines from SAP BPC for the Budget Builder & Consolidation workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "budget_lines_records",
        "budget_lines_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_workday_adaptive_employees",
      kind: "query",
      sourceSystemId: "workday_adaptive",
      description: "Retrieve employees from Workday Adaptive for the Budget Builder & Consolidation workflow.",
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
      name: "query_bigquery_analytics_events",
      kind: "query",
      sourceSystemId: "bigquery",
      description: "Retrieve analytics events from BigQuery for the Budget Builder & Consolidation workflow.",
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
      name: "lookup_budget_builder_consolidation_controls_playbook",
      kind: "evidence_lookup",
      sourceSystemId: "bigquery",
      description: "Look up sections of the Budget Builder & Consolidation Controls Playbook to cite in narrative output, escalation rationale, and audit evidence.",
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
      claim: "Budget cycle time moved from 8-12 weeks toward 2-3 weeks",
      mustCite: [
        "anaplan.budget_lines",
        "sap_bpc.budget_lines",
      ],
      sourceSystemIds: [
        "anaplan",
        "sap_bpc",
      ],
    },
    {
      claim: "BU submissions consolidated moved from Manual in Excel toward Auto-consolidated",
      mustCite: [
        "anaplan.budget_lines",
        "sap_bpc.budget_lines",
      ],
      sourceSystemIds: [
        "anaplan",
        "sap_bpc",
      ],
    },
  ],
  escalationRules: [
    {
      trigger: "Budget cycle time regresses past the 8-12 weeks baseline by more than 20%",
      action: "escalate_to_human",
      handoffTarget: "CFO / FP&A Director",
      rationale: "Significant regressions need human judgment before automated remediation runs against production records.",
    },
    {
      trigger: "Source-system evidence is incomplete or stale (>24h) for any required entity",
      action: "request_more_info",
      rationale: "Recommendations grounded in stale evidence misrepresent current state and undermine audit defensibility.",
    },
  ],
  refusalRules: [
    "Never fabricate metric values; only publish numbers derived from Anaplan (and other named systems) entities.",
    "Never bypass CFO / FP&A Director approval on escalation triggers, even when confidence is high.",
    "Never expose individual personal data (PII) in summaries; aggregate or pseudonymise before output.",
    "Never act on data older than the staleness threshold defined in the runbook without a fresh re-query.",
  ],
  goldenEvals: [
    {
      id: "budget-builder-consolidation-end-to-end",
      prompt: "Run the Budget Builder & Consolidation workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.",
      expectedToolCalls: [
        "query_anaplan_budget_lines",
        "query_sap_bpc_budget_lines",
        "query_workday_adaptive_employees",
        "query_bigquery_analytics_events",
        "lookup_budget_builder_consolidation_controls_playbook",
      ],
      mustReferenceEntities: [
        "budget_lines",
        "budget_lines",
        "employees",
        "analytics_events",
      ],
      mustCiteDocuments: [
        "budget-builder-consolidation-controls-playbook",
      ],
      expectedActionOutcome: "CFO / FP&A Director receives a fully-cited recommendation; no external state change without explicit approval.",
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
    rationale: "Row counts sized for Budget Builder & Consolidation so the agent can demonstrate the workflow against realistic transactional volume without simulating a production warehouse.",
  },
  sourceSystems: [
    {
      id: "anaplan",
      name: "Anaplan",
      owns: [
        "budget_lines",
        "forecast_versions",
        "variance_records",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_anaplan_budget_lines",
        "query_anaplan_forecast_versions",
        "query_anaplan_variance_records",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
    {
      id: "sap_bpc",
      name: "SAP BPC",
      owns: [
        "budget_lines",
        "forecast_versions",
        "variance_records",
      ],
      protocol: "RFC/BAPI",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_sap_bpc_budget_lines",
        "query_sap_bpc_forecast_versions",
        "query_sap_bpc_variance_records",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
    {
      id: "workday_adaptive",
      name: "Workday Adaptive",
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
        "query_workday_adaptive_employees",
        "query_workday_adaptive_positions",
        "query_workday_adaptive_compensation_records",
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
      name: "budget_lines",
      sourceSystemId: "anaplan",
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
          name: "cost_center",
          type: "lorem.words",
          required: true,
        },
        {
          name: "period",
          type: "enum",
          values: [
            "month",
            "quarter",
            "year",
          ],
          required: true,
        },
        {
          name: "budget_amount",
          type: "number",
          min: 10000,
          max: 5000000,
          required: true,
        },
        {
          name: "actual_amount",
          type: "number",
          min: 0,
          max: 6000000,
          required: true,
        },
        {
          name: "variance_pct",
          type: "float",
          min: -100,
          max: 100,
          decimals: 2,
          required: true,
        },
        {
          name: "scenario",
          type: "enum",
          values: [
            "baseline",
            "stretch",
            "downside",
          ],
          required: true,
        },
      ],
    },
    {
      name: "forecast_versions",
      sourceSystemId: "anaplan",
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
          name: "cost_center",
          type: "lorem.words",
          required: true,
        },
        {
          name: "period",
          type: "enum",
          values: [
            "month",
            "quarter",
            "year",
          ],
          required: true,
        },
        {
          name: "budget_amount",
          type: "number",
          min: 10000,
          max: 5000000,
          required: true,
        },
        {
          name: "actual_amount",
          type: "number",
          min: 0,
          max: 6000000,
          required: true,
        },
        {
          name: "variance_pct",
          type: "float",
          min: -100,
          max: 100,
          decimals: 2,
          required: true,
        },
        {
          name: "scenario",
          type: "enum",
          values: [
            "baseline",
            "stretch",
            "downside",
          ],
          required: true,
        },
      ],
    },
    {
      name: "variance_records",
      sourceSystemId: "anaplan",
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
      sourceSystemId: "workday_adaptive",
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
      sourceSystemId: "workday_adaptive",
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
      sourceSystemId: "workday_adaptive",
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
      id: "budget-builder-consolidation-controls-playbook",
      sourceSystemId: "bigquery",
      type: "policy",
      title: "Budget Builder & Consolidation Controls Playbook",
      requiredSections: [
        "Workflow scope",
        "Materiality thresholds",
        "Escalation triggers",
        "Audit evidence requirements",
        "Quarter-end variations",
      ],
      linkedEntities: [
        "budget_lines",
        "forecast_versions",
        "variance_records",
      ],
      minimumWordCount: 500,
      citationAnchors: [
        "scope",
        "materiality",
        "escalation",
        "audit-evidence",
      ],
    },
  ],
  apis: [],
  anomalies: [
    {
      id: "budget-builder-consolidation-baseline-gap",
      description: "Seed a realistic gap where Budget cycle time sits between 8-12 weeks and 2-3 weeks, so the agent can detect, narrate, and recommend remediation.",
      affectedEntities: [
        "budget_lines",
        "forecast_versions",
      ],
      discoveryPath: [
        "Inspect Anaplan records for the affected entities",
        "Compare against SAP BPC historical baseline",
        "Generate a citation-backed recommendation",
      ],
      expectedEvidence: [
        "source-system record",
        "historical baseline metric",
        "generated audit trail",
      ],
      expectedRecommendation: "Explain the gap, cite supporting evidence, and propose the next CFO / FP&A Director action.",
    },
  ],
  datastorePackaging: {
    alloydb: {
      database: "budget_builder_consolidation",
      schemas: [
        "anaplan",
        "sap_bpc",
        "workday_adaptive",
      ],
    },
    bigquery: {
      dataset: "finance_budget_builder_consolidation",
      tables: [
        "kpi_summary",
        "evidence_index",
      ],
    },
    cloudStorage: {
      bucketSuffix: "budget-builder-consolidation-evidence",
      prefixes: [
        "documents",
        "audit-trails",
        "exports",
      ],
    },
    apis: {
      serviceName: "budget-builder-consolidation-source-adapters",
      deploymentTarget: "cloud_run",
    },
  },
  validation: {
    smokePrompt: "Run the Budget Builder & Consolidation workflow and cite source-system evidence for every claim.",
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

export const BudgetBuilderConsolidation = () => (
  <UseCaseSlide
    title="Budget Builder & Consolidation"
    subtitle="A-2001 • FP&A"
    icon={Calculator}
    domainId="domain-20"
    layer="Layer 3: Custom ADK"
    persona="CFO / FP&A Director"
    systems={["Anaplan", "SAP BPC", "Workday Adaptive", "BigQuery", "Vertex AI"]}
    kpis={[
      { label: "Budget cycle time", before: "8-12 weeks", after: "2-3 weeks" },
      { label: "BU submissions consolidated", before: "Manual in Excel", after: "Auto-consolidated" },
      { label: "Narrative quality", before: "Copy-paste fragments", after: "Synthesized narrative" },
    ]}
    triggerType="scheduled"
    swimlane={swimlane}
    flow={flow}
    architecture={architecture}
    hitl={{ actor: "CFO", action: "Approve consolidated budget", description: "CFO validates consolidated budget, investment priorities, and savings targets before distribution to BUs." }}
    statusQuo={[
      "Budget consolidation requires manually merging 20+ Excel workbooks with inconsistent formats.",
      "BU justifications are read individually — no cross-BU synthesis or pattern detection.",
      "Budget narratives assembled by copy-pasting fragments from BU submissions into PowerPoint."
    ]}
    agentification={[
      "Gemini reads all BU narrative justifications and assesses reasonableness against historical patterns.",
      "Automated consolidation resolves cross-BU conflicts and flags outlier growth assumptions.",
      "Synthesizes 20+ submissions into a coherent CFO-ready budget narrative with strategic alignment assessment."
    ]}
  />
);
