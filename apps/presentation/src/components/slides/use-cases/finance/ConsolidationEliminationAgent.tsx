import React from "react";
import { UseCaseSlide } from "../../../agent/UseCaseSlide";
import { FlowStep } from "../../../agent/ProcessFlow";
import { SwimlaneFlow } from "../../../agent/SwimlaneFlow";
import { AgentArchitecture, UseCaseGenerationSpec, AgentBehaviorContract} from "../../../../types/architecture";
import { Combine, Database, ArrowLeftRight, CheckCircle, Globe } from "lucide-react";

const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "s1", label: "Entity Close", lane: "system", type: "trigger" },
    { id: "a1", label: "Data Collection", lane: "agent", type: "action" },
    { id: "a2", label: "Elimination Logic", lane: "agent", type: "action" },
    { id: "a3", label: "Consolidated Statements", lane: "agent", type: "output" },
    { id: "h1", label: "Controller Reviews", lane: "human", type: "hitl" },
  ],
  connections: [["s1", "a1"], ["a1", "a2"], ["a2", "a3"], ["a3", "h1"]],
};

const flow: FlowStep[] = [
  { label: "Entity Collection", icon: Globe, description: "Collect entity-level financials from all subsidiaries. Apply currency translation at appropriate rates.", trigger: "Monthly/Quarterly", systems: ["SAP S/4HANA FI"] },
  { label: "IC Elimination", icon: ArrowLeftRight, description: "Match and eliminate intercompany transactions. Handle currency translation and minority interest.", systems: ["BlackLine", "BigQuery"], integration: "ADK" },
  { label: "Scenario Handling", icon: Combine, description: "Gemini handles complex scenarios — acquired subsidiaries with different accounting policies, LIFO-to-FIFO conforming adjustments.", systems: ["Vertex AI"] },
  { label: "Controller Review", icon: CheckCircle, description: "Controller reviews consolidated statements and approves for reporting.", output: "Consolidated Financial Statements" },
];

const architecture: AgentArchitecture = {
  connections: [
    { system: "SAP S/4HANA FI", description: "Entity-level trial balances, intercompany balances, currency data", direction: "read", protocol: "OData", category: "erp" },
    { system: "BlackLine", description: "IC matching, reconciliation workflows, elimination entries", direction: "bidirectional", protocol: "REST API", category: "erp" },
    { system: "BigQuery", description: "Consolidation analytics, translation rates, elimination history", direction: "bidirectional", protocol: "BigQuery SQL", category: "analytics" },
    { system: "Vertex AI (Gemini)", description: "Complex scenario reasoning, conforming adjustment logic", direction: "bidirectional", protocol: "gRPC", category: "ai" },
  ],
  pipeline: [
    { label: "Entity Data Collection", description: "Collect trial balances from all reporting entities. Validate completeness against entity list. Apply appropriate currency translation method (current rate, temporal, average).", systems: ["SAP S/4HANA FI"], layer: "integration", dataIn: "Entity trial balances + FX rates", dataOut: "Translated entity financials" },
    { label: "IC Matching & Elimination", description: "Match intercompany transactions across entities using BlackLine. Auto-eliminate matched pairs. Flag unmatched items for investigation. Calculate minority interest.", systems: ["BlackLine", "BigQuery"], layer: "ml", dataIn: "Translated financials + IC balances", dataOut: "IC eliminations + minority interest" },
    { label: "Complex Scenario Handling", description: "Gemini handles non-routine consolidation: newly acquired subsidiaries with different accounting policies (LIFO→FIFO conforming), mid-period acquisitions requiring stub-period calculations, foreign currency translation adjustments.", systems: ["Vertex AI (Gemini)"], layer: "llm", dataIn: "Elimination results + acquisition data + policy differences", dataOut: "Conforming adjustments with documentation" },
    { label: "Consolidated Output", description: "Produce consolidated income statement, balance sheet, and cash flow statement. Reconcile elimination entries. Generate consolidation workpapers.", systems: ["SAP S/4HANA FI", "BigQuery"], layer: "integration", dataIn: "All adjustments + eliminations", dataOut: "Consolidated financial statements" },
  ],
};


const behaviorContract: AgentBehaviorContract = {
  role: "Financial Reporting Manager agent for the Consolidation & Elimination Agent workflow",
  primaryObjective: "Automated entity data collection with currency translation reduces cycle time dramatically. 97% IC auto-matching with BlackLine integration minimizes manual investigation. so the Financial Reporting Manager can move the Consolidation cycle KPI.",
  inScope: [
    "Automated entity data collection with currency translation reduces cycle time dramatically",
    "97% IC auto-matching with BlackLine integration minimizes manual investigation",
    "Gemini handles complex scenarios — LIFO-to-FIFO conforming, stub-period acquisitions — with documented rationale",
  ],
  outOfScope: [
    "Final sign-off on materially significant journal entries (Controller retains authority)",
    "Restatement of prior-period filings",
    "Tax position changes that require external advisor review",
  ],
  toolIntents: [
    {
      name: "query_sap_s_4hana_fi_gl_entries",
      kind: "query",
      sourceSystemId: "sap_s_4hana_fi",
      description: "Retrieve gl entries from SAP S/4HANA FI for the Consolidation & Elimination Agent workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "gl_entries_records",
        "gl_entries_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_blackline_reconciliations",
      kind: "query",
      sourceSystemId: "blackline",
      description: "Retrieve reconciliations from BlackLine for the Consolidation & Elimination Agent workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "reconciliations_records",
        "reconciliations_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_bigquery_analytics_events",
      kind: "query",
      sourceSystemId: "bigquery",
      description: "Retrieve analytics events from BigQuery for the Consolidation & Elimination Agent workflow.",
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
      name: "lookup_consolidation_elimination_agent_controls_playbook",
      kind: "evidence_lookup",
      sourceSystemId: "bigquery",
      description: "Look up sections of the Consolidation & Elimination Agent Controls Playbook to cite in narrative output, escalation rationale, and audit evidence.",
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
      name: "action_sap_s_4hana_fi_match",
      kind: "action",
      sourceSystemId: "sap_s_4hana_fi",
      description: "Execute the match step in SAP S/4HANA FI after the agent has gathered evidence and validated escalation gates.",
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
      claim: "Consolidation cycle moved from 3-5 days toward < 1 day",
      mustCite: [
        "sap_s_4hana_fi.gl_entries",
        "blackline.reconciliations",
      ],
      sourceSystemIds: [
        "sap_s_4hana_fi",
        "blackline",
      ],
    },
    {
      claim: "IC elimination rate moved from 80% auto-matched toward 97% auto-matched",
      mustCite: [
        "sap_s_4hana_fi.gl_entries",
        "blackline.reconciliations",
      ],
      sourceSystemIds: [
        "sap_s_4hana_fi",
        "blackline",
      ],
    },
  ],
  escalationRules: [
    {
      trigger: "Consolidation cycle regresses past the 3-5 days baseline by more than 20%",
      action: "escalate_to_human",
      handoffTarget: "Financial Reporting Manager",
      rationale: "Significant regressions need human judgment before automated remediation runs against production records.",
    },
    {
      trigger: "Source-system evidence is incomplete or stale (>24h) for any required entity",
      action: "request_more_info",
      rationale: "Recommendations grounded in stale evidence misrepresent current state and undermine audit defensibility.",
    },
    {
      trigger: "Proposed match action lacks supporting evidence from at least two systems",
      action: "refuse",
      rationale: "Single-system evidence is insufficient to authorize external state changes without manual review.",
    },
  ],
  refusalRules: [
    "Never fabricate metric values; only publish numbers derived from SAP S/4HANA FI (and other named systems) entities.",
    "Never bypass Financial Reporting Manager approval on escalation triggers, even when confidence is high.",
    "Never expose individual personal data (PII) in summaries; aggregate or pseudonymise before output.",
    "Never act on data older than the staleness threshold defined in the runbook without a fresh re-query.",
  ],
  goldenEvals: [
    {
      id: "consolidation-elimination-agent-end-to-end",
      prompt: "Run the Consolidation & Elimination Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.",
      expectedToolCalls: [
        "query_sap_s_4hana_fi_gl_entries",
        "query_blackline_reconciliations",
        "query_bigquery_analytics_events",
        "lookup_consolidation_elimination_agent_controls_playbook",
        "action_sap_s_4hana_fi_match",
      ],
      mustReferenceEntities: [
        "gl_entries",
        "reconciliations",
        "analytics_events",
      ],
      mustCiteDocuments: [
        "consolidation-elimination-agent-controls-playbook",
      ],
      expectedActionOutcome: "Action match executed against SAP S/4HANA FI, with audit-trail entry and Financial Reporting Manager notified of outcomes.",
      forbiddenBehaviors: [
        "do not invent KPI numbers",
        "do not skip the evidence_lookup step before any recommendation",
        "do not execute match without two-system evidence",
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
    rationale: "Row counts sized for Consolidation & Elimination Agent so the agent can demonstrate the workflow against realistic transactional volume without simulating a production warehouse.",
  },
  sourceSystems: [
    {
      id: "sap_s_4hana_fi",
      name: "SAP S/4HANA FI",
      owns: [
        "gl_entries",
        "subledger_balances",
        "open_items",
      ],
      protocol: "RFC/BAPI",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_sap_s_4hana_fi_gl_entries",
        "query_sap_s_4hana_fi_subledger_balances",
        "query_sap_s_4hana_fi_open_items",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
    {
      id: "blackline",
      name: "BlackLine",
      owns: [
        "reconciliations",
        "matching_rules",
        "certifications",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_blackline_reconciliations",
        "query_blackline_matching_rules",
        "query_blackline_certifications",
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
      name: "gl_entries",
      sourceSystemId: "sap_s_4hana_fi",
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
          name: "posting_date",
          type: "date",
          required: true,
        },
        {
          name: "account",
          type: "enum",
          values: [
            "1000-Cash",
            "2000-AP",
            "2100-AR",
            "3000-Revenue",
            "4000-Expense",
            "5000-COGS",
          ],
          required: true,
        },
        {
          name: "amount",
          type: "float",
          min: -50000,
          max: 50000,
          decimals: 2,
          required: true,
        },
        {
          name: "currency",
          type: "enum",
          values: [
            "USD",
            "EUR",
            "GBP",
          ],
          required: true,
        },
        {
          name: "description",
          type: "lorem.sentence",
          required: true,
        },
        {
          name: "status",
          type: "enum",
          values: [
            "posted",
            "pending",
            "reversed",
          ],
          weights: [
            0.8,
            0.15,
            0.05,
          ],
          required: true,
        },
      ],
    },
    {
      name: "subledger_balances",
      sourceSystemId: "sap_s_4hana_fi",
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
          name: "posting_date",
          type: "date",
          required: true,
        },
        {
          name: "account",
          type: "enum",
          values: [
            "1000-Cash",
            "2000-AP",
            "2100-AR",
            "3000-Revenue",
            "4000-Expense",
            "5000-COGS",
          ],
          required: true,
        },
        {
          name: "amount",
          type: "float",
          min: -50000,
          max: 50000,
          decimals: 2,
          required: true,
        },
        {
          name: "currency",
          type: "enum",
          values: [
            "USD",
            "EUR",
            "GBP",
          ],
          required: true,
        },
        {
          name: "description",
          type: "lorem.sentence",
          required: true,
        },
        {
          name: "status",
          type: "enum",
          values: [
            "posted",
            "pending",
            "reversed",
          ],
          weights: [
            0.8,
            0.15,
            0.05,
          ],
          required: true,
        },
      ],
    },
    {
      name: "open_items",
      sourceSystemId: "sap_s_4hana_fi",
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
          name: "posting_date",
          type: "date",
          required: true,
        },
        {
          name: "account",
          type: "enum",
          values: [
            "1000-Cash",
            "2000-AP",
            "2100-AR",
            "3000-Revenue",
            "4000-Expense",
            "5000-COGS",
          ],
          required: true,
        },
        {
          name: "amount",
          type: "float",
          min: -50000,
          max: 50000,
          decimals: 2,
          required: true,
        },
        {
          name: "currency",
          type: "enum",
          values: [
            "USD",
            "EUR",
            "GBP",
          ],
          required: true,
        },
        {
          name: "description",
          type: "lorem.sentence",
          required: true,
        },
        {
          name: "status",
          type: "enum",
          values: [
            "posted",
            "pending",
            "reversed",
          ],
          weights: [
            0.8,
            0.15,
            0.05,
          ],
          required: true,
        },
      ],
    },
    {
      name: "reconciliations",
      sourceSystemId: "blackline",
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
          type: "lorem.sentence",
          required: true,
        },
        {
          name: "status",
          type: "enum",
          values: [
            "open",
            "in_progress",
            "certified",
            "exception",
          ],
          required: true,
        },
        {
          name: "owner",
          type: "person.fullName",
          required: true,
        },
        {
          name: "match_rate",
          type: "float",
          min: 0,
          max: 1,
          decimals: 2,
          required: true,
        },
        {
          name: "last_run",
          type: "date",
          required: true,
        },
      ],
    },
    {
      name: "matching_rules",
      sourceSystemId: "blackline",
      datastore: "alloydb",
      rowCount: 30,
      primaryKey: "id",
      columns: [
        {
          name: "id",
          type: "seq",
          required: true,
        },
        {
          name: "name",
          type: "lorem.sentence",
          required: true,
        },
        {
          name: "status",
          type: "enum",
          values: [
            "open",
            "in_progress",
            "certified",
            "exception",
          ],
          required: true,
        },
        {
          name: "owner",
          type: "person.fullName",
          required: true,
        },
        {
          name: "match_rate",
          type: "float",
          min: 0,
          max: 1,
          decimals: 2,
          required: true,
        },
        {
          name: "last_run",
          type: "date",
          required: true,
        },
      ],
    },
    {
      name: "certifications",
      sourceSystemId: "blackline",
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
          type: "lorem.sentence",
          required: true,
        },
        {
          name: "status",
          type: "enum",
          values: [
            "open",
            "in_progress",
            "certified",
            "exception",
          ],
          required: true,
        },
        {
          name: "owner",
          type: "person.fullName",
          required: true,
        },
        {
          name: "match_rate",
          type: "float",
          min: 0,
          max: 1,
          decimals: 2,
          required: true,
        },
        {
          name: "last_run",
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
      id: "consolidation-elimination-agent-controls-playbook",
      sourceSystemId: "bigquery",
      type: "policy",
      title: "Consolidation & Elimination Agent Controls Playbook",
      requiredSections: [
        "Workflow scope",
        "Materiality thresholds",
        "Escalation triggers",
        "Audit evidence requirements",
        "Quarter-end variations",
      ],
      linkedEntities: [
        "gl_entries",
        "subledger_balances",
        "open_items",
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
      id: "sap_s_4hana_fi_match_api",
      sourceSystemId: "sap_s_4hana_fi",
      method: "POST",
      path: "/api/sap_s_4hana_fi/match",
      description: "Synchronous endpoint the agent calls to match in SAP S/4HANA FI after evidence gating.",
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
      id: "consolidation-elimination-agent-baseline-gap",
      description: "Seed a realistic gap where Consolidation cycle sits between 3-5 days and < 1 day, so the agent can detect, narrate, and recommend remediation.",
      affectedEntities: [
        "gl_entries",
        "subledger_balances",
      ],
      discoveryPath: [
        "Inspect SAP S/4HANA FI records for the affected entities",
        "Compare against BlackLine historical baseline",
        "Generate a citation-backed recommendation",
      ],
      expectedEvidence: [
        "source-system record",
        "historical baseline metric",
        "generated audit trail",
      ],
      expectedRecommendation: "Explain the gap, cite supporting evidence, and propose the next Financial Reporting Manager action.",
    },
  ],
  datastorePackaging: {
    alloydb: {
      database: "consolidation_elimination_agent",
      schemas: [
        "sap_s_4hana_fi",
        "blackline",
      ],
    },
    bigquery: {
      dataset: "finance_consolidation_elimination_agent",
      tables: [
        "kpi_summary",
        "evidence_index",
      ],
    },
    cloudStorage: {
      bucketSuffix: "consolidation-elimination-agent-evidence",
      prefixes: [
        "documents",
        "audit-trails",
        "exports",
      ],
    },
    apis: {
      serviceName: "consolidation-elimination-agent-source-adapters",
      deploymentTarget: "cloud_run",
    },
  },
  validation: {
    smokePrompt: "Run the Consolidation & Elimination Agent workflow and cite source-system evidence for every claim.",
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

export const ConsolidationEliminationAgent = () => (
  <UseCaseSlide
    title="Consolidation & Elimination Agent"
    subtitle="A-2806 • Finance Analytics & Reporting"
    icon={Combine}
    domainId="domain-28"
    layer="Layer 3: Custom ADK"
    persona="Financial Reporting Manager"
    systems={["SAP S/4HANA FI", "BlackLine", "BigQuery", "Vertex AI"]}
    kpis={[
      { label: "Consolidation cycle", before: "3-5 days", after: "< 1 day" },
      { label: "IC elimination rate", before: "80% auto-matched", after: "97% auto-matched" },
      { label: "Conforming adjustments", before: "Manual calculation", after: "AI-computed with documentation" },
    ]}
    triggerType="scheduled"
    swimlane={swimlane}
    flow={flow}
    architecture={architecture}
    hitl={{ actor: "Controller", action: "Review consolidated statements", description: "Controller validates consolidation results, elimination entries, and conforming adjustments before final reporting." }}
    statusQuo={[
      "Consolidation takes days with manual entity collection and IC elimination matching.",
      "Unmatched IC items require manual investigation across multiple entity controllers.",
      "Conforming adjustments for acquired subsidiaries calculated manually in spreadsheets."
    ]}
    agentification={[
      "Automated entity data collection with currency translation reduces cycle time dramatically.",
      "97% IC auto-matching with BlackLine integration minimizes manual investigation.",
      "Gemini handles complex scenarios — LIFO-to-FIFO conforming, stub-period acquisitions — with documented rationale."
    ]}
  />
);
