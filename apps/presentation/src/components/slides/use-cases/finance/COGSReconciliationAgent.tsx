import React from "react";
import { UseCaseSlide } from "../../../agent/UseCaseSlide";
import { FlowStep } from "../../../agent/ProcessFlow";
import { SwimlaneFlow } from "../../../agent/SwimlaneFlow";
import { AgentArchitecture, UseCaseGenerationSpec, AgentBehaviorContract} from "../../../../types/architecture";
import { ArrowLeftRight, Database, Search, CheckCircle, FileCheck } from "lucide-react";

const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "s1", label: "Monthly Close", lane: "system", type: "trigger" },
    { id: "a1", label: "CO-FI Extraction", lane: "agent", type: "action" },
    { id: "a2", label: "Break Investigation", lane: "agent", type: "action" },
    { id: "a3", label: "Reconciliation Report", lane: "agent", type: "output" },
    { id: "h1", label: "Cost Accountant Validates", lane: "human", type: "hitl" },
  ],
  connections: [["s1", "a1"], ["a1", "a2"], ["a2", "a3"], ["a3", "h1"]],
};

const flow: FlowStep[] = [
  { label: "Data Extraction", icon: Database, description: "Extract COGS from both cost accounting (CO) and financial accounting (FI) modules for reconciliation.", trigger: "Monthly", systems: ["SAP S/4HANA CO/FI"] },
  { label: "Variance Analysis", icon: ArrowLeftRight, description: "Identify discrepancies between CO and FI postings. Classify as timing differences, reclassifications, or errors.", systems: ["BigQuery"], integration: "ADK" },
  { label: "Break Investigation", icon: Search, description: "Gemini traces reconciliation breaks to their source — manual reclassifications, posting errors, timing differences.", systems: ["Vertex AI"] },
  { label: "Accountant Validation", icon: CheckCircle, description: "Cost Accountant validates the reconciliation and approves correcting entries.", output: "COGS Reconciliation Report" },
];

const architecture: AgentArchitecture = {
  connections: [
    { system: "SAP S/4HANA CO/FI", description: "Cost of goods sold from controlling and financial accounting modules", direction: "bidirectional", protocol: "OData", category: "erp" },
    { system: "BigQuery", description: "Reconciliation analytics, discrepancy tracking, historical patterns", direction: "bidirectional", protocol: "BigQuery SQL", category: "analytics" },
    { system: "Vertex AI (Gemini)", description: "Break investigation reasoning, correcting entry generation", direction: "bidirectional", protocol: "gRPC", category: "ai" },
  ],
  pipeline: [
    { label: "Parallel Extraction", description: "Extract COGS balances from both CO (cost element view) and FI (GL account view). Align at the same granularity for comparison.", systems: ["SAP S/4HANA CO/FI"], layer: "integration", dataIn: "CO cost reports + FI trial balance", dataOut: "Aligned COGS datasets for comparison" },
    { label: "Discrepancy Detection", description: "Compare CO and FI totals. Classify differences as systematic (recurring timing) vs. one-time (manual entries). Track discrepancy patterns across periods.", systems: ["BigQuery"], layer: "ml", dataIn: "Aligned COGS datasets", dataOut: "Classified discrepancies with patterns" },
    { label: "Root Cause Tracing", description: "Gemini traces each material discrepancy to its source document — was it a manual reclassification that should have been in R&D? A posting to the wrong GL account? Generates the correcting entry.", systems: ["Vertex AI (Gemini)"], layer: "llm", dataIn: "Classified discrepancies + source documents", dataOut: "Root cause analysis with correcting entries" },
    { label: "Reconciliation & Posting", description: "Generate reconciliation report showing opening break, identified items, and correcting entries. Post approved corrections.", systems: ["SAP S/4HANA FI"], layer: "integration", dataIn: "Approved corrections", dataOut: "Reconciled COGS + correcting entries posted" },
  ],
};


const behaviorContract: AgentBehaviorContract = {
  role: "Cost Accountant agent for the COGS Reconciliation Agent workflow",
  primaryObjective: "Automated extraction and alignment of CO and FI COGS data eliminates manual data gathering. Gemini traces breaks to source documents and generates correcting entries automatically. so the Cost Accountant can move the Reconciliation time KPI.",
  inScope: [
    "Automated extraction and alignment of CO and FI COGS data eliminates manual data gathering",
    "Gemini traces breaks to source documents and generates correcting entries automatically",
    "Pattern recognition classifies recurring timing differences, eliminating re-investigation each period",
  ],
  outOfScope: [
    "Final sign-off on materially significant journal entries (Controller retains authority)",
    "Restatement of prior-period filings",
    "Tax position changes that require external advisor review",
  ],
  toolIntents: [
    {
      name: "query_sap_s_4hana_co_fi_cost_centers",
      kind: "query",
      sourceSystemId: "sap_s_4hana_co_fi",
      description: "Retrieve cost centers from SAP S/4HANA CO/FI for the COGS Reconciliation Agent workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "cost_centers_records",
        "cost_centers_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_bigquery_analytics_events",
      kind: "query",
      sourceSystemId: "bigquery",
      description: "Retrieve analytics events from BigQuery for the COGS Reconciliation Agent workflow.",
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
      description: "Retrieve finance 3 records from FINANCE 3 for the COGS Reconciliation Agent workflow.",
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
      name: "lookup_cogs_reconciliation_agent_controls_playbook",
      kind: "evidence_lookup",
      sourceSystemId: "bigquery",
      description: "Look up sections of the COGS Reconciliation Agent Controls Playbook to cite in narrative output, escalation rationale, and audit evidence.",
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
      name: "action_sap_s_4hana_co_fi_generate",
      kind: "action",
      sourceSystemId: "sap_s_4hana_co_fi",
      description: "Execute the generate step in SAP S/4HANA CO/FI after the agent has gathered evidence and validated escalation gates.",
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
      claim: "Reconciliation time moved from 2-3 days toward < 4 hours",
      mustCite: [
        "sap_s_4hana_co_fi.cost_centers",
        "bigquery.analytics_events",
      ],
      sourceSystemIds: [
        "sap_s_4hana_co_fi",
        "bigquery",
      ],
    },
    {
      claim: "Unresolved breaks moved from 5-10% of COGS toward < 0.5%",
      mustCite: [
        "sap_s_4hana_co_fi.cost_centers",
        "bigquery.analytics_events",
      ],
      sourceSystemIds: [
        "sap_s_4hana_co_fi",
        "bigquery",
      ],
    },
  ],
  escalationRules: [
    {
      trigger: "Reconciliation time regresses past the 2-3 days baseline by more than 20%",
      action: "escalate_to_human",
      handoffTarget: "Cost Accountant",
      rationale: "Significant regressions need human judgment before automated remediation runs against production records.",
    },
    {
      trigger: "Source-system evidence is incomplete or stale (>24h) for any required entity",
      action: "request_more_info",
      rationale: "Recommendations grounded in stale evidence misrepresent current state and undermine audit defensibility.",
    },
    {
      trigger: "Proposed generate action lacks supporting evidence from at least two systems",
      action: "refuse",
      rationale: "Single-system evidence is insufficient to authorize external state changes without manual review.",
    },
  ],
  refusalRules: [
    "Never fabricate metric values; only publish numbers derived from SAP S/4HANA CO/FI (and other named systems) entities.",
    "Never bypass Cost Accountant approval on escalation triggers, even when confidence is high.",
    "Never expose individual personal data (PII) in summaries; aggregate or pseudonymise before output.",
    "Never act on data older than the staleness threshold defined in the runbook without a fresh re-query.",
  ],
  goldenEvals: [
    {
      id: "cogs-reconciliation-agent-end-to-end",
      prompt: "Run the COGS Reconciliation Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.",
      expectedToolCalls: [
        "query_sap_s_4hana_co_fi_cost_centers",
        "query_bigquery_analytics_events",
        "query_finance_3_finance_3_records",
        "lookup_cogs_reconciliation_agent_controls_playbook",
        "action_sap_s_4hana_co_fi_generate",
      ],
      mustReferenceEntities: [
        "cost_centers",
        "analytics_events",
        "finance_3_records",
      ],
      mustCiteDocuments: [
        "cogs-reconciliation-agent-controls-playbook",
      ],
      expectedActionOutcome: "Action generate executed against SAP S/4HANA CO/FI, with audit-trail entry and Cost Accountant notified of outcomes.",
      forbiddenBehaviors: [
        "do not invent KPI numbers",
        "do not skip the evidence_lookup step before any recommendation",
        "do not execute generate without two-system evidence",
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
    rationale: "Row counts sized for COGS Reconciliation Agent so the agent can demonstrate the workflow against realistic transactional volume without simulating a production warehouse.",
  },
  sourceSystems: [
    {
      id: "sap_s_4hana_co_fi",
      name: "SAP S/4HANA CO/FI",
      owns: [
        "cost_centers",
        "internal_orders",
        "cost_allocations",
      ],
      protocol: "RFC/BAPI",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_sap_s_4hana_co_fi_cost_centers",
        "query_sap_s_4hana_co_fi_internal_orders",
        "query_sap_s_4hana_co_fi_cost_allocations",
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
      name: "cost_centers",
      sourceSystemId: "sap_s_4hana_co_fi",
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
      name: "internal_orders",
      sourceSystemId: "sap_s_4hana_co_fi",
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
      name: "cost_allocations",
      sourceSystemId: "sap_s_4hana_co_fi",
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
      id: "cogs-reconciliation-agent-controls-playbook",
      sourceSystemId: "bigquery",
      type: "policy",
      title: "COGS Reconciliation Agent Controls Playbook",
      requiredSections: [
        "Workflow scope",
        "Materiality thresholds",
        "Escalation triggers",
        "Audit evidence requirements",
        "Quarter-end variations",
      ],
      linkedEntities: [
        "cost_centers",
        "internal_orders",
        "cost_allocations",
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
      id: "sap_s_4hana_co_fi_generate_api",
      sourceSystemId: "sap_s_4hana_co_fi",
      method: "POST",
      path: "/api/sap_s_4hana_co_fi/generate",
      description: "Synchronous endpoint the agent calls to generate in SAP S/4HANA CO/FI after evidence gating.",
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
      id: "cogs-reconciliation-agent-baseline-gap",
      description: "Seed a realistic gap where Reconciliation time sits between 2-3 days and < 4 hours, so the agent can detect, narrate, and recommend remediation.",
      affectedEntities: [
        "cost_centers",
        "internal_orders",
      ],
      discoveryPath: [
        "Inspect SAP S/4HANA CO/FI records for the affected entities",
        "Compare against BigQuery historical baseline",
        "Generate a citation-backed recommendation",
      ],
      expectedEvidence: [
        "source-system record",
        "historical baseline metric",
        "generated audit trail",
      ],
      expectedRecommendation: "Explain the gap, cite supporting evidence, and propose the next Cost Accountant action.",
    },
  ],
  datastorePackaging: {
    alloydb: {
      database: "cogs_reconciliation_agent",
      schemas: [
        "sap_s_4hana_co_fi",
        "finance_3",
      ],
    },
    bigquery: {
      dataset: "finance_cogs_reconciliation_agent",
      tables: [
        "kpi_summary",
        "evidence_index",
      ],
    },
    cloudStorage: {
      bucketSuffix: "cogs-reconciliation-agent-evidence",
      prefixes: [
        "documents",
        "audit-trails",
        "exports",
      ],
    },
    apis: {
      serviceName: "cogs-reconciliation-agent-source-adapters",
      deploymentTarget: "cloud_run",
    },
  },
  validation: {
    smokePrompt: "Run the COGS Reconciliation Agent workflow and cite source-system evidence for every claim.",
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

export const COGSReconciliationAgent = () => (
  <UseCaseSlide
    title="COGS Reconciliation Agent"
    subtitle="A-2707 • Revenue & Cost Accounting"
    icon={ArrowLeftRight}
    domainId="domain-27"
    layer="Layer 2: Agent Designer"
    persona="Cost Accountant"
    systems={["SAP S/4HANA CO/FI", "BigQuery", "Vertex AI"]}
    kpis={[
      { label: "Reconciliation time", before: "2-3 days", after: "< 4 hours" },
      { label: "Unresolved breaks", before: "5-10% of COGS", after: "< 0.5%" },
      { label: "Correcting entry accuracy", before: "Manual, error-prone", after: "Auto-generated with audit trail" },
    ]}
    triggerType="scheduled"
    swimlane={swimlane}
    flow={flow}
    architecture={architecture}
    hitl={{ actor: "Cost Accountant", action: "Validate reconciliation", description: "Cost Accountant reviews break analysis and approves correcting journal entries before posting." }}
    statusQuo={[
      "COGS reconciliation between CO and FI is a multi-day manual exercise each close.",
      "Breaks investigated one-by-one by tracing source documents in SAP.",
      "Recurring timing differences re-investigated each month instead of being systematically resolved."
    ]}
    agentification={[
      "Automated extraction and alignment of CO and FI COGS data eliminates manual data gathering.",
      "Gemini traces breaks to source documents and generates correcting entries automatically.",
      "Pattern recognition classifies recurring timing differences, eliminating re-investigation each period."
    ]}
  />
);
