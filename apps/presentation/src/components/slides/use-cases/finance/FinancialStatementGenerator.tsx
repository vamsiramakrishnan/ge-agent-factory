import React from "react";
import { UseCaseSlide } from "../../../agent/UseCaseSlide";
import { FlowStep } from "../../../agent/ProcessFlow";
import { SwimlaneFlow } from "../../../agent/SwimlaneFlow";
import { AgentArchitecture, UseCaseGenerationSpec, AgentBehaviorContract} from "../../../../types/architecture";
import { FileSpreadsheet, Database, FileText, CheckCircle, BarChart3 } from "lucide-react";

const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "s1", label: "Close Completed", lane: "system", type: "trigger" },
    { id: "a1", label: "Trial Balance Mapping", lane: "agent", type: "action" },
    { id: "a2", label: "Statement Generation", lane: "agent", type: "action" },
    { id: "a3", label: "Financial Package", lane: "agent", type: "output" },
    { id: "h1", label: "Controller Reviews", lane: "human", type: "hitl" },
  ],
  connections: [["s1", "a1"], ["a1", "a2"], ["a2", "a3"], ["a3", "h1"]],
};

const flow: FlowStep[] = [
  { label: "TB Extraction", icon: Database, description: "Extract trial balance from ERP and apply financial statement mapping to GL accounts.", trigger: "Monthly/Quarterly", systems: ["SAP S/4HANA FI", "Workiva"] },
  { label: "Statement Assembly", icon: FileSpreadsheet, description: "Generate income statement, balance sheet, and cash flow statement with period-over-period calculations.", systems: ["BigQuery"], integration: "ADK" },
  { label: "MD&A Narrative", icon: FileText, description: "Gemini generates management discussion narrative for each statement line with variance explanations.", systems: ["Vertex AI"] },
  { label: "Controller Review", icon: CheckCircle, description: "Controller reviews the financial package and approves for distribution.", output: "Financial Statement Package" },
];

const architecture: AgentArchitecture = {
  connections: [
    { system: "SAP S/4HANA FI", description: "Trial balance, GL account master, sub-ledger details", direction: "read", protocol: "OData", category: "erp" },
    { system: "Workiva", description: "Statement templates, XBRL tagging, filing workflows", direction: "bidirectional", protocol: "REST API", category: "collaboration" },
    { system: "BigQuery", description: "Historical financials, period comparisons, rounding reconciliation", direction: "bidirectional", protocol: "BigQuery SQL", category: "analytics" },
    { system: "Vertex AI (Gemini)", description: "MD&A narrative generation, variance explanation drafting", direction: "bidirectional", protocol: "gRPC", category: "ai" },
  ],
  pipeline: [
    { label: "Trial Balance Processing", description: "Extract trial balance from SAP FI. Apply financial statement mapping rules to classify GL accounts into income statement, balance sheet, and cash flow categories.", systems: ["SAP S/4HANA FI"], layer: "integration", dataIn: "GL trial balance", dataOut: "Mapped balances by financial statement line" },
    { label: "Statement Calculation", description: "Generate three financial statements with period-over-period and YoY comparisons. Reconcile rounding differences. Validate balance sheet equation.", systems: ["BigQuery"], layer: "ml", dataIn: "Mapped balances", dataOut: "Draft financial statements with comparatives" },
    { label: "Narrative Generation", description: "Gemini generates management discussion for each material line item: 'Revenue increased 12% to $156M driven by 3 new enterprise customers.' Adapts depth based on materiality thresholds.", systems: ["Vertex AI (Gemini)"], layer: "llm", dataIn: "Financial statements + operational context", dataOut: "Financial package with MD&A narratives" },
    { label: "Formatting & Filing", description: "Format into Workiva templates for regulatory filing. Apply XBRL tags. Generate internal management package separately.", systems: ["Workiva"], layer: "integration", dataIn: "Financial package", dataOut: "Filing-ready statements + management package" },
  ],
};


const behaviorContract: AgentBehaviorContract = {
  role: "Financial Reporting Manager agent for the Financial Statement Generator workflow",
  primaryObjective: "Automated TB-to-statement mapping with validated balance sheet equation on close day. Gemini generates management discussion narratives with variance explanations tailored to materiality. so the Financial Reporting Manager can move the Statement preparation KPI.",
  inScope: [
    "Automated TB-to-statement mapping with validated balance sheet equation on close day",
    "Gemini generates management discussion narratives with variance explanations tailored to materiality",
    "Parallel generation of regulatory filing format and internal management package from same data",
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
      description: "Retrieve gl entries from SAP S/4HANA FI for the Financial Statement Generator workflow.",
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
      name: "query_workiva_workiva_records",
      kind: "query",
      sourceSystemId: "workiva",
      description: "Retrieve workiva records from Workiva for the Financial Statement Generator workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "workiva_records_records",
        "workiva_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_bigquery_analytics_events",
      kind: "query",
      sourceSystemId: "bigquery",
      description: "Retrieve analytics events from BigQuery for the Financial Statement Generator workflow.",
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
      name: "lookup_financial_statement_generator_controls_playbook",
      kind: "evidence_lookup",
      sourceSystemId: "bigquery",
      description: "Look up sections of the Financial Statement Generator Controls Playbook to cite in narrative output, escalation rationale, and audit evidence.",
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
      name: "action_sap_s_4hana_fi_generate",
      kind: "action",
      sourceSystemId: "sap_s_4hana_fi",
      description: "Execute the generate step in SAP S/4HANA FI after the agent has gathered evidence and validated escalation gates.",
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
      claim: "Statement preparation moved from 2-3 days post-close toward Same-day automated",
      mustCite: [
        "sap_s_4hana_fi.gl_entries",
        "workiva.workiva_records",
      ],
      sourceSystemIds: [
        "sap_s_4hana_fi",
        "workiva",
      ],
    },
    {
      claim: "MD&A drafting time moved from 1-2 days toward Auto-generated with review",
      mustCite: [
        "sap_s_4hana_fi.gl_entries",
        "workiva.workiva_records",
      ],
      sourceSystemIds: [
        "sap_s_4hana_fi",
        "workiva",
      ],
    },
  ],
  escalationRules: [
    {
      trigger: "Statement preparation regresses past the 2-3 days post-close baseline by more than 20%",
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
      trigger: "Proposed generate action lacks supporting evidence from at least two systems",
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
      id: "financial-statement-generator-end-to-end",
      prompt: "Run the Financial Statement Generator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.",
      expectedToolCalls: [
        "query_sap_s_4hana_fi_gl_entries",
        "query_workiva_workiva_records",
        "query_bigquery_analytics_events",
        "lookup_financial_statement_generator_controls_playbook",
        "action_sap_s_4hana_fi_generate",
      ],
      mustReferenceEntities: [
        "gl_entries",
        "workiva_records",
        "analytics_events",
      ],
      mustCiteDocuments: [
        "financial-statement-generator-controls-playbook",
      ],
      expectedActionOutcome: "Action generate executed against SAP S/4HANA FI, with audit-trail entry and Financial Reporting Manager notified of outcomes.",
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
    rationale: "Row counts sized for Financial Statement Generator so the agent can demonstrate the workflow against realistic transactional volume without simulating a production warehouse.",
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
      id: "workiva",
      name: "Workiva",
      owns: [
        "workiva_records",
        "workiva_events",
        "workiva_audit_trail",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_workiva_workiva_records",
        "query_workiva_workiva_events",
        "query_workiva_workiva_audit_trail",
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
      name: "workiva_records",
      sourceSystemId: "workiva",
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
      name: "workiva_events",
      sourceSystemId: "workiva",
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
          name: "workiva_record_id",
          type: "ref",
          ref: "workiva_records.id",
          required: true,
        },
      ],
    },
    {
      name: "workiva_audit_trail",
      sourceSystemId: "workiva",
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
      from: "workiva_events.workiva_record_id",
      to: "workiva_records.id",
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
      id: "financial-statement-generator-controls-playbook",
      sourceSystemId: "bigquery",
      type: "policy",
      title: "Financial Statement Generator Controls Playbook",
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
      id: "sap_s_4hana_fi_generate_api",
      sourceSystemId: "sap_s_4hana_fi",
      method: "POST",
      path: "/api/sap_s_4hana_fi/generate",
      description: "Synchronous endpoint the agent calls to generate in SAP S/4HANA FI after evidence gating.",
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
      id: "financial-statement-generator-baseline-gap",
      description: "Seed a realistic gap where Statement preparation sits between 2-3 days post-close and Same-day automated, so the agent can detect, narrate, and recommend remediation.",
      affectedEntities: [
        "gl_entries",
        "subledger_balances",
      ],
      discoveryPath: [
        "Inspect SAP S/4HANA FI records for the affected entities",
        "Compare against Workiva historical baseline",
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
      database: "financial_statement_generator",
      schemas: [
        "sap_s_4hana_fi",
        "workiva",
      ],
    },
    bigquery: {
      dataset: "finance_financial_statement_generator",
      tables: [
        "kpi_summary",
        "evidence_index",
      ],
    },
    cloudStorage: {
      bucketSuffix: "financial-statement-generator-evidence",
      prefixes: [
        "documents",
        "audit-trails",
        "exports",
      ],
    },
    apis: {
      serviceName: "financial-statement-generator-source-adapters",
      deploymentTarget: "cloud_run",
    },
  },
  validation: {
    smokePrompt: "Run the Financial Statement Generator workflow and cite source-system evidence for every claim.",
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

export const FinancialStatementGenerator = () => (
  <UseCaseSlide
    title="Financial Statement Generator"
    subtitle="A-2801 • Finance Analytics & Reporting"
    icon={FileSpreadsheet}
    domainId="domain-28"
    layer="Layer 3: Custom ADK"
    persona="Financial Reporting Manager"
    systems={["SAP S/4HANA FI", "Workiva", "BigQuery", "Vertex AI"]}
    kpis={[
      { label: "Statement preparation", before: "2-3 days post-close", after: "Same-day automated" },
      { label: "MD&A drafting time", before: "1-2 days", after: "Auto-generated with review" },
      { label: "Rounding errors", before: "Manual reconciliation", after: "Zero — automated validation" },
    ]}
    triggerType="scheduled"
    swimlane={swimlane}
    flow={flow}
    architecture={architecture}
    hitl={{ actor: "Controller", action: "Review financial package", description: "Controller validates financial statements and management discussion narratives before distribution and filing." }}
    statusQuo={[
      "Financial statements assembled manually from trial balance extracts with complex mapping rules.",
      "MD&A narratives written from scratch each period by finance staff.",
      "Rounding reconciliation between statements takes hours of manual adjustment."
    ]}
    agentification={[
      "Automated TB-to-statement mapping with validated balance sheet equation on close day.",
      "Gemini generates management discussion narratives with variance explanations tailored to materiality.",
      "Parallel generation of regulatory filing format and internal management package from same data."
    ]}
  />
);
