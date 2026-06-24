import React from "react";
import { UseCaseSlide } from "../../../agent/UseCaseSlide";
import { FlowStep } from "../../../agent/ProcessFlow";
import { SwimlaneFlow } from "../../../agent/SwimlaneFlow";
import { AgentArchitecture, UseCaseGenerationSpec, AgentBehaviorContract} from "../../../../types/architecture";
import { Shuffle, Database, BarChart3, MessageCircle, FileText } from "lucide-react";

const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "s1", label: "What-If Question", lane: "human", type: "trigger" },
    { id: "a1", label: "Parameter Translation", lane: "agent", type: "action" },
    { id: "a2", label: "Monte Carlo Simulation", lane: "agent", type: "action" },
    { id: "a3", label: "Results Interpretation", lane: "agent", type: "output" },
    { id: "h1", label: "Leader Decides", lane: "human", type: "hitl" },
  ],
  connections: [["s1", "a1"], ["a1", "a2"], ["a2", "a3"], ["a3", "h1"]],
};

const flow: FlowStep[] = [
  { label: "Question Intake", icon: MessageCircle, description: "Translate natural-language what-if question into simulation parameters.", trigger: "Chat + Event", systems: ["Vertex AI"] },
  { label: "Simulation Engine", icon: BarChart3, description: "Monte Carlo simulation across 20+ variables with sensitivity analysis on key drivers.", systems: ["Anaplan", "BigQuery"], integration: "ADK" },
  { label: "Results Interpretation", icon: Shuffle, description: "Interpret probability-weighted outcomes and generate strategic recommendations with trade-offs.", systems: ["Vertex AI"] },
  { label: "Decision Brief", icon: FileText, description: "Deliver scenario comparison with probability distributions and recommended action.", output: "Scenario Analysis" },
];

const architecture: AgentArchitecture = {
  connections: [
    { system: "Anaplan", description: "Baseline financial model, planning assumptions, driver tables", direction: "bidirectional", protocol: "REST API", category: "erp" },
    { system: "BigQuery", description: "Historical driver distributions, correlation data, simulation results", direction: "bidirectional", protocol: "BigQuery SQL", category: "analytics" },
    { system: "Vertex AI (Gemini)", description: "NL question translation, results interpretation, recommendation generation", direction: "bidirectional", protocol: "gRPC", category: "ai" },
  ],
  pipeline: [
    { label: "Question Translation", description: "Gemini translates natural-language what-if questions into structured simulation parameters. Maps business concepts to model drivers.", systems: ["Vertex AI (Gemini)"], layer: "llm", dataIn: "Natural-language scenario question", dataOut: "Structured simulation parameters" },
    { label: "Monte Carlo Simulation", description: "Run Monte Carlo across 20+ variables — revenue growth, headcount, FX rates, commodity prices. Generate probability-weighted outcome distributions with sensitivity rankings.", systems: ["Anaplan", "BigQuery"], layer: "ml", dataIn: "Simulation parameters + historical distributions", dataOut: "Probability-weighted scenario outcomes" },
    { label: "Strategic Interpretation", description: "Gemini interprets simulation results, identifies key trade-offs, and generates strategic recommendations with risk-adjusted reasoning.", systems: ["Vertex AI (Gemini)"], layer: "llm", dataIn: "Scenario outcomes + business context", dataOut: "Strategic recommendation with trade-offs" },
    { label: "Delivery", description: "Format scenario comparison as a decision brief with probability distributions, sensitivity tornado charts, and recommended action.", systems: ["Google Slides", "Email"], layer: "integration", dataIn: "Interpreted scenario analysis", dataOut: "Decision brief delivered to stakeholders" },
  ],
};


const behaviorContract: AgentBehaviorContract = {
  role: "CFO / FP&A Director agent for the Scenario Modeling & Sensitivity workflow",
  primaryObjective: "Natural-language what-if questions translated directly into simulation parameters by Gemini. Monte Carlo runs across 20+ variables in minutes with full probability distributions. so the CFO / FP&A Director can move the Scenario turnaround KPI.",
  inScope: [
    "Natural-language what-if questions translated directly into simulation parameters by Gemini",
    "Monte Carlo runs across 20+ variables in minutes with full probability distributions",
    "Generates strategic recommendations with trade-offs, not just data outputs",
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
      description: "Retrieve budget lines from Anaplan for the Scenario Modeling & Sensitivity workflow.",
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
      name: "query_bigquery_analytics_events",
      kind: "query",
      sourceSystemId: "bigquery",
      description: "Retrieve analytics events from BigQuery for the Scenario Modeling & Sensitivity workflow.",
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
      name: "query_finance_3_finance_3_records",
      kind: "query",
      sourceSystemId: "finance_3",
      description: "Retrieve finance 3 records from FINANCE 3 for the Scenario Modeling & Sensitivity workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "finance_3_records_records",
        "finance_3_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "lookup_scenario_modeling_sensitivity_controls_playbook",
      kind: "evidence_lookup",
      sourceSystemId: "bigquery",
      description: "Look up sections of the Scenario Modeling & Sensitivity Controls Playbook to cite in narrative output, escalation rationale, and audit evidence.",
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
      name: "action_anaplan_recommend",
      kind: "action",
      sourceSystemId: "anaplan",
      description: "Execute the recommend step in Anaplan after the agent has gathered evidence and validated escalation gates.",
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
      claim: "Scenario turnaround moved from 1-2 weeks toward Minutes",
      mustCite: [
        "anaplan.budget_lines",
        "bigquery.analytics_events",
      ],
      sourceSystemIds: [
        "anaplan",
        "bigquery",
      ],
    },
    {
      claim: "Variables modeled moved from 3-5 manual toward 20+ simultaneous",
      mustCite: [
        "anaplan.budget_lines",
        "bigquery.analytics_events",
      ],
      sourceSystemIds: [
        "anaplan",
        "bigquery",
      ],
    },
  ],
  escalationRules: [
    {
      trigger: "Scenario turnaround regresses past the 1-2 weeks baseline by more than 20%",
      action: "escalate_to_human",
      handoffTarget: "CFO / FP&A Director",
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
    "Never fabricate metric values; only publish numbers derived from Anaplan (and other named systems) entities.",
    "Never bypass CFO / FP&A Director approval on escalation triggers, even when confidence is high.",
    "Never expose individual personal data (PII) in summaries; aggregate or pseudonymise before output.",
    "Never act on data older than the staleness threshold defined in the runbook without a fresh re-query.",
  ],
  goldenEvals: [
    {
      id: "scenario-modeling-sensitivity-end-to-end",
      prompt: "Run the Scenario Modeling & Sensitivity workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.",
      expectedToolCalls: [
        "query_anaplan_budget_lines",
        "query_bigquery_analytics_events",
        "query_finance_3_finance_3_records",
        "lookup_scenario_modeling_sensitivity_controls_playbook",
        "action_anaplan_recommend",
      ],
      mustReferenceEntities: [
        "budget_lines",
        "analytics_events",
        "finance_3_records",
      ],
      mustCiteDocuments: [
        "scenario-modeling-sensitivity-controls-playbook",
      ],
      expectedActionOutcome: "Action recommend executed against Anaplan, with audit-trail entry and CFO / FP&A Director notified of outcomes.",
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
    rationale: "Row counts sized for Scenario Modeling & Sensitivity so the agent can demonstrate the workflow against realistic transactional volume without simulating a production warehouse.",
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
    {
      id: "finance_3",
      name: "FINANCE 3",
      owns: [
        "finance_3_records",
        "finance_3_events",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_finance_3_records",
      ],
      evidence: [
        "source_system_record",
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
    {
      name: "finance_3_records",
      sourceSystemId: "finance_3",
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
      name: "finance_3_events",
      sourceSystemId: "finance_3",
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
          name: "finance_3_record_id",
          type: "ref",
          ref: "finance_3_records.id",
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
    {
      from: "finance_3_events.finance_3_record_id",
      to: "finance_3_records.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
  ],
  documents: [
    {
      id: "scenario-modeling-sensitivity-controls-playbook",
      sourceSystemId: "bigquery",
      type: "policy",
      title: "Scenario Modeling & Sensitivity Controls Playbook",
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
  apis: [
    {
      id: "anaplan_recommend_api",
      sourceSystemId: "anaplan",
      method: "POST",
      path: "/api/anaplan/recommend",
      description: "Synchronous endpoint the agent calls to recommend in Anaplan after evidence gating.",
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
      id: "scenario-modeling-sensitivity-baseline-gap",
      description: "Seed a realistic gap where Scenario turnaround sits between 1-2 weeks and Minutes, so the agent can detect, narrate, and recommend remediation.",
      affectedEntities: [
        "budget_lines",
        "forecast_versions",
      ],
      discoveryPath: [
        "Inspect Anaplan records for the affected entities",
        "Compare against BigQuery historical baseline",
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
      database: "scenario_modeling_sensitivity",
      schemas: [
        "anaplan",
        "finance_3",
      ],
    },
    bigquery: {
      dataset: "finance_scenario_modeling_sensitivity",
      tables: [
        "kpi_summary",
        "evidence_index",
      ],
    },
    cloudStorage: {
      bucketSuffix: "scenario-modeling-sensitivity-evidence",
      prefixes: [
        "documents",
        "audit-trails",
        "exports",
      ],
    },
    apis: {
      serviceName: "scenario-modeling-sensitivity-source-adapters",
      deploymentTarget: "cloud_run",
    },
  },
  validation: {
    smokePrompt: "Run the Scenario Modeling & Sensitivity workflow and cite source-system evidence for every claim.",
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

export const ScenarioModelingSensitivity = () => (
  <UseCaseSlide
    title="Scenario Modeling & Sensitivity"
    subtitle="A-2004 • FP&A"
    icon={Shuffle}
    domainId="domain-20"
    layer="Layer 3: Custom ADK"
    persona="CFO / FP&A Director"
    systems={["Anaplan", "BigQuery", "Vertex AI"]}
    kpis={[
      { label: "Scenario turnaround", before: "1-2 weeks", after: "Minutes" },
      { label: "Variables modeled", before: "3-5 manual", after: "20+ simultaneous" },
      { label: "Decision confidence", before: "Single-point estimate", after: "Probability distribution" },
    ]}
    triggerType="chat"
    swimlane={swimlane}
    flow={flow}
    architecture={architecture}
    hitl={{ actor: "CFO / FP&A Director", action: "Select scenario and approve action", description: "Leadership reviews scenario comparison, selects preferred path, and approves strategic action based on probability-weighted outcomes." }}
    statusQuo={[
      "Scenario modeling requires analysts to manually adjust cells in a 50-tab Excel model over days.",
      "Sensitivity analysis limited to 3-5 variables due to manual complexity.",
      "Results presented as single-point estimates without probability distributions or confidence levels."
    ]}
    agentification={[
      "Natural-language what-if questions translated directly into simulation parameters by Gemini.",
      "Monte Carlo runs across 20+ variables in minutes with full probability distributions.",
      "Generates strategic recommendations with trade-offs, not just data outputs."
    ]}
  />
);
