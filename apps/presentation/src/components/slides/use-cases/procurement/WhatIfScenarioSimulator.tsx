import React from "react";
import { UseCaseSlide } from "../../../agent/UseCaseSlide";
import { FlowStep } from "../../../agent/ProcessFlow";
import { SwimlaneFlow } from "../../../agent/SwimlaneFlow";
import { AgentArchitecture, UseCaseGenerationSpec, AgentBehaviorContract} from "../../../../types/architecture";
import { FlaskConical, MessageCircle, Shuffle, Brain, FileText } from "lucide-react";

const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "s1", label: "User What-If Question", lane: "system", type: "trigger" },
    { id: "a1", label: "Parameter Translation", lane: "agent", type: "action" },
    { id: "a2", label: "Monte Carlo Simulation", lane: "agent", type: "action" },
    { id: "a3", label: "Result Interpretation", lane: "agent", type: "action" },
    { id: "a4", label: "Strategic Recommendation", lane: "agent", type: "output" },
  ],
  connections: [["s1", "a1"], ["a1", "a2"], ["a2", "a3"], ["a3", "a4"]],
};

const flow: FlowStep[] = [
  { label: "Question Parsing", icon: MessageCircle, description: "Natural-language what-if questions translated into simulation parameters by LLM.", trigger: "Chat", systems: ["Vertex AI"] },
  { label: "Data Assembly", icon: Shuffle, description: "Relevant spend, contract, market, and supplier data pulled for scenario modeling.", systems: ["BigQuery"], integration: "ADK" },
  { label: "Simulation", icon: Brain, description: "Monte Carlo simulation with sensitivity analysis across cost, risk, and capacity dimensions.", systems: ["BigQuery", "Vertex AI"] },
  { label: "Interpretation", icon: FileText, description: "LLM interprets probability-weighted outcomes and generates strategic recommendations with break-even analysis.", output: "Scenario Report" },
];

const architecture: AgentArchitecture = {
  connections: [
    { system: "BigQuery", description: "Spend data, contract terms, supplier data, simulation engine, scenario storage", direction: "bidirectional", protocol: "BigQuery SQL", category: "analytics" },
    { system: "Vertex AI (Gemini)", description: "Natural-language question translation, simulation interpretation, strategic recommendation generation", direction: "bidirectional", protocol: "gRPC", category: "ai" },
    { system: "S&P Global Platts", description: "Commodity price data for cost factor modeling in sourcing scenarios", direction: "read", protocol: "REST API", category: "market-data" },
    { system: "SAP S/4HANA", description: "Current supplier costs, logistics rates, inventory levels for baseline modeling", direction: "read", protocol: "RFC/BAPI", category: "erp" },
  ],
  pipeline: [
    { label: "Question-to-Parameters", description: "Gemini translates natural-language what-if questions into simulation parameters — 'nearshore PCB supply from China to Mexico' becomes adjustments across logistics, labor, tariffs, inventory, and lead time variables. Identifies which data sets are needed.", systems: ["Vertex AI (Gemini)"], layer: "llm", dataIn: "Natural-language scenario question", dataOut: "Structured simulation parameters + data requirements" },
    { label: "Data Assembly & Simulation", description: "Pull relevant spend, contract, market, and supplier data for the scenario. Monte Carlo simulation with sensitivity analysis across cost, risk, and capacity dimensions. Probability-weighted outcome modeling with decision tree evaluation.", systems: ["BigQuery", "S&P Global Platts", "SAP S/4HANA"], layer: "ml", dataIn: "Simulation parameters + baseline data", dataOut: "Probability distributions + sensitivity outputs" },
    { label: "Interpretation & Recommendation", description: "Gemini interprets simulation outputs and generates strategic recommendations with break-even analysis — 'Nearshoring reduces TCO by 6% and lead time by 40% but increases unit cost by 12%. Net savings from inventory reduction and tariff avoidance. Break-even requires 18-month commitment.'", systems: ["Vertex AI (Gemini)"], layer: "llm", dataIn: "Simulation results + probability distributions", dataOut: "Strategic scenario report with recommendations" },
  ],
};


const behaviorContract: AgentBehaviorContract = {
  role: "Procurement Analytics Lead agent for the What-If Scenario Simulator workflow",
  primaryObjective: "LLM translates natural-language questions into simulation parameters: 'nearshore PCB supply from China to Mexico' becomes cost factor adjustments across logistics, labor, tariffs, and inventory. Monte Carlo simulation across 20+ variables with sensitivity analysis and probability-weighted outcomes. so the Procurement Analytics Lead can move the Scenario analysis time KPI.",
  inScope: [
    "LLM translates natural-language questions into simulation parameters: 'nearshore PCB supply from China to Mexico' becomes cost factor adjustments across logistics, labor, tariffs, and inventory",
    "Monte Carlo simulation across 20+ variables with sensitivity analysis and probability-weighted outcomes",
    "Generates strategic recommendations: 'Nearshoring reduces TCO by 6% and lead time by 40% — break-even requires 18-month commitment.'",
  ],
  outOfScope: [
    "Contract execution without legal review",
    "Supplier disqualification decisions (category lead retains authority)",
    "Single-source justification overrides above policy threshold",
  ],
  toolIntents: [
    {
      name: "query_bigquery_analytics_events",
      kind: "query",
      sourceSystemId: "bigquery",
      description: "Retrieve analytics events from BigQuery for the What-If Scenario Simulator workflow.",
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
      name: "query_procurement_2_procurement_2_records",
      kind: "query",
      sourceSystemId: "procurement_2",
      description: "Retrieve procurement 2 records from PROCUREMENT 2 for the What-If Scenario Simulator workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "procurement_2_records_records",
        "procurement_2_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_procurement_3_procurement_3_records",
      kind: "query",
      sourceSystemId: "procurement_3",
      description: "Retrieve procurement 3 records from PROCUREMENT 3 for the What-If Scenario Simulator workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "procurement_3_records_records",
        "procurement_3_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "lookup_what_if_scenario_simulator_policy_guide",
      kind: "evidence_lookup",
      sourceSystemId: "bigquery",
      description: "Look up sections of the What-If Scenario Simulator Procurement Policy Guide to cite in narrative output, escalation rationale, and audit evidence.",
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
      name: "action_procurement_2_recommend",
      kind: "action",
      sourceSystemId: "procurement_2",
      description: "Execute the recommend step in PROCUREMENT 2 after the agent has gathered evidence and validated escalation gates.",
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
      claim: "Scenario analysis time moved from 1-2 weeks in Excel toward Minutes via chat",
      mustCite: [
        "bigquery.analytics_events",
        "procurement_2.procurement_2_records",
      ],
      sourceSystemIds: [
        "bigquery",
        "procurement_2",
      ],
    },
    {
      claim: "Variables simulated moved from 3-5 manual toward 20+ Monte Carlo",
      mustCite: [
        "bigquery.analytics_events",
        "procurement_2.procurement_2_records",
      ],
      sourceSystemIds: [
        "bigquery",
        "procurement_2",
      ],
    },
  ],
  escalationRules: [
    {
      trigger: "Scenario analysis time regresses past the 1-2 weeks in Excel baseline by more than 20%",
      action: "escalate_to_human",
      handoffTarget: "Procurement Analytics Lead",
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
    "Never fabricate metric values; only publish numbers derived from BigQuery (and other named systems) entities.",
    "Never bypass Procurement Analytics Lead approval on escalation triggers, even when confidence is high.",
    "Never expose individual personal data (PII) in summaries; aggregate or pseudonymise before output.",
    "Never act on data older than the staleness threshold defined in the runbook without a fresh re-query.",
  ],
  goldenEvals: [
    {
      id: "what-if-scenario-simulator-end-to-end",
      prompt: "Run the What-If Scenario Simulator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.",
      expectedToolCalls: [
        "query_bigquery_analytics_events",
        "query_procurement_2_procurement_2_records",
        "query_procurement_3_procurement_3_records",
        "lookup_what_if_scenario_simulator_policy_guide",
        "action_procurement_2_recommend",
      ],
      mustReferenceEntities: [
        "analytics_events",
        "procurement_2_records",
        "procurement_3_records",
      ],
      mustCiteDocuments: [
        "what-if-scenario-simulator-policy-guide",
      ],
      expectedActionOutcome: "Action recommend executed against PROCUREMENT 2, with audit-trail entry and Procurement Analytics Lead notified of outcomes.",
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
    rationale: "Row counts sized for What-If Scenario Simulator so the agent can demonstrate the workflow against realistic transactional volume without simulating a production warehouse.",
  },
  sourceSystems: [
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
      id: "procurement_2",
      name: "PROCUREMENT 2",
      owns: [
        "procurement_2_records",
        "procurement_2_events",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_procurement_2_records",
      ],
      evidence: [
        "source_system_record",
      ],
    },
    {
      id: "procurement_3",
      name: "PROCUREMENT 3",
      owns: [
        "procurement_3_records",
        "procurement_3_events",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_procurement_3_records",
      ],
      evidence: [
        "source_system_record",
      ],
    },
  ],
  entities: [
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
      name: "procurement_2_records",
      sourceSystemId: "procurement_2",
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
      name: "procurement_2_events",
      sourceSystemId: "procurement_2",
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
          name: "procurement_2_record_id",
          type: "ref",
          ref: "procurement_2_records.id",
          required: true,
        },
      ],
    },
    {
      name: "procurement_3_records",
      sourceSystemId: "procurement_3",
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
      name: "procurement_3_events",
      sourceSystemId: "procurement_3",
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
          name: "procurement_3_record_id",
          type: "ref",
          ref: "procurement_3_records.id",
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
      from: "procurement_2_events.procurement_2_record_id",
      to: "procurement_2_records.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
    {
      from: "procurement_3_events.procurement_3_record_id",
      to: "procurement_3_records.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
  ],
  documents: [
    {
      id: "what-if-scenario-simulator-policy-guide",
      sourceSystemId: "bigquery",
      type: "policy",
      title: "What-If Scenario Simulator Procurement Policy Guide",
      requiredSections: [
        "Sourcing principles",
        "Approval thresholds",
        "Supplier risk requirements",
        "Contract and compliance gates",
        "Exception handling",
      ],
      linkedEntities: [
        "analytics_events",
        "historical_metrics",
        "cached_aggregates",
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
  apis: [
    {
      id: "procurement_2_recommend_api",
      sourceSystemId: "procurement_2",
      method: "POST",
      path: "/api/procurement_2/recommend",
      description: "Synchronous endpoint the agent calls to recommend in PROCUREMENT 2 after evidence gating.",
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
      id: "what-if-scenario-simulator-baseline-gap",
      description: "Seed a realistic gap where Scenario analysis time sits between 1-2 weeks in Excel and Minutes via chat, so the agent can detect, narrate, and recommend remediation.",
      affectedEntities: [
        "analytics_events",
        "historical_metrics",
      ],
      discoveryPath: [
        "Inspect BigQuery records for the affected entities",
        "Compare against PROCUREMENT 2 historical baseline",
        "Generate a citation-backed recommendation",
      ],
      expectedEvidence: [
        "source-system record",
        "historical baseline metric",
        "generated audit trail",
      ],
      expectedRecommendation: "Explain the gap, cite supporting evidence, and propose the next Procurement Analytics Lead action.",
    },
  ],
  datastorePackaging: {
    alloydb: {
      database: "what_if_scenario_simulator",
      schemas: [
        "procurement_2",
        "procurement_3",
      ],
    },
    bigquery: {
      dataset: "procurement_what_if_scenario_simulator",
      tables: [
        "kpi_summary",
        "evidence_index",
      ],
    },
    cloudStorage: {
      bucketSuffix: "what-if-scenario-simulator-evidence",
      prefixes: [
        "documents",
        "audit-trails",
        "exports",
      ],
    },
    apis: {
      serviceName: "what-if-scenario-simulator-source-adapters",
      deploymentTarget: "cloud_run",
    },
  },
  validation: {
    smokePrompt: "Run the What-If Scenario Simulator workflow and cite source-system evidence for every claim.",
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

export const WhatIfScenarioSimulator = () => (
  <UseCaseSlide
    title="What-If Scenario Simulator"
    subtitle="A-1910 • Spend Analytics"
    icon={FlaskConical}
    domainId="domain-19"
    layer="Layer 3: Custom ADK"
    persona="Procurement Analytics Lead"
    systems={["BigQuery", "Vertex AI"]}
    kpis={[
      { label: "Scenario analysis time", before: "1-2 weeks in Excel", after: "Minutes via chat" },
      { label: "Variables simulated", before: "3-5 manual", after: "20+ Monte Carlo" },
      { label: "Decision confidence", before: "Single-point estimate", after: "Probability-weighted range" },
    ]}
    triggerType="chat"
    swimlane={swimlane}
    flow={flow}
    architecture={architecture}
    statusQuo={[
      "What-if analysis done in Excel with 3-5 manually varied inputs — takes 1-2 weeks per scenario.",
      "Single-point estimates hide risk: 'nearshoring saves 6%' without probability distribution or break-even analysis.",
      "Strategic questions ('what if we consolidate to 2 suppliers?') require analyst effort that delays decisions."
    ]}
    agentification={[
      "LLM translates natural-language questions into simulation parameters: 'nearshore PCB supply from China to Mexico' becomes cost factor adjustments across logistics, labor, tariffs, and inventory.",
      "Monte Carlo simulation across 20+ variables with sensitivity analysis and probability-weighted outcomes.",
      "Generates strategic recommendations: 'Nearshoring reduces TCO by 6% and lead time by 40% — break-even requires 18-month commitment.'"
    ]}
  />
);
