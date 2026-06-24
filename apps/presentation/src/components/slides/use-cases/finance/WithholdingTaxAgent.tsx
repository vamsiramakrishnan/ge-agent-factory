import React from "react";
import { UseCaseSlide } from "../../../agent/UseCaseSlide";
import { FlowStep } from "../../../agent/ProcessFlow";
import { SwimlaneFlow } from "../../../agent/SwimlaneFlow";
import { AgentArchitecture, UseCaseGenerationSpec, AgentBehaviorContract} from "../../../../types/architecture";
import { Percent, Database, Cpu, Brain, CheckCircle } from "lucide-react";

const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "s1", label: "Cross-Border Payment", lane: "system", type: "trigger" },
    { id: "a1", label: "Treaty Lookup", lane: "agent", type: "action" },
    { id: "a2", label: "Rate Determination", lane: "agent", type: "action" },
    { id: "a3", label: "Withholding Applied", lane: "agent", type: "output" },
    { id: "h1", label: "Tax Verifies", lane: "human", type: "hitl" },
  ],
  connections: [["s1", "a1"], ["a1", "a2"], ["a2", "a3"], ["a3", "h1"]],
};

const flow: FlowStep[] = [
  { label: "Payment Trigger", icon: Database, description: "Cross-border payment initiated -- royalty, management fee, dividend, or service payment to foreign entity.", trigger: "Cross-border payment", systems: ["SAP S/4HANA FI"] },
  { label: "Treaty Analysis", icon: Cpu, description: "Applicable treaty identified, statutory and treaty rates compared, threshold tracking for annual limits.", systems: ["BigQuery"], integration: "ADK" },
  { label: "Beneficial Owner Check", icon: Brain, description: "Gemini interprets treaty provisions for complex payments -- verifying beneficial ownership and PE status for treaty rate eligibility.", systems: ["Vertex AI"] },
  { label: "Tax Verification", icon: CheckCircle, description: "Tax analyst verifies withholding application for non-standard payments and approves tax certificate generation.", output: "Withholding Application" },
];

const architecture: AgentArchitecture = {
  connections: [
    { system: "SAP S/4HANA FI", description: "Payment data, vendor master, withholding tax postings, certificate generation", direction: "bidirectional", protocol: "RFC/BAPI", category: "erp" },
    { system: "BigQuery", description: "Treaty rate tables, threshold tracking, annual reporting aggregation", direction: "bidirectional", protocol: "BigQuery SQL", category: "analytics" },
    { system: "Vertex AI (Gemini)", description: "Treaty provision interpretation, beneficial ownership analysis, complex payment classification", direction: "bidirectional", protocol: "gRPC", category: "ai" },
    { system: "Tax Databases", description: "Treaty texts, statutory withholding rates, beneficial ownership guidance", direction: "read", protocol: "REST API", category: "market-data" },
  ],
  pipeline: [
    { label: "Payment Classification", description: "Classify cross-border payment by type -- royalty, interest, dividend, management fee, technical service fee. Identify payer and recipient jurisdictions. Look up applicable treaty.", systems: ["SAP S/4HANA FI"], layer: "integration", dataIn: "Cross-border payment details", dataOut: "Classified payment with treaty identification" },
    { label: "Rate Determination", description: "Compare statutory withholding rate with treaty rate. Track annual thresholds for de minimis exemptions. Calculate withholding amount. Check for prior W-8BEN/E documentation.", systems: ["BigQuery", "Tax Databases"], layer: "ml", dataIn: "Classified payment + treaty rates + threshold status", dataOut: "Determined withholding rate with calculation" },
    { label: "Treaty Provision Interpretation", description: "Gemini interprets complex cases: 'Royalty to UK entity subject to 0% withholding under US-UK treaty Article 12 -- but only if beneficial owner is the UK entity itself, not a PE. Verify beneficial ownership before applying treaty rate.' Handles mixed payments and PE allocations.", systems: ["Vertex AI (Gemini)"], layer: "llm", dataIn: "Payment details + treaty provisions + ownership structure", dataOut: "Validated withholding treatment with treaty citation" },
    { label: "Application & Reporting", description: "Apply determined withholding rate to payment. Generate withholding tax certificates. Accumulate data for annual reporting (1042-S, Form 945).", systems: ["SAP S/4HANA FI", "BigQuery"], layer: "integration", dataIn: "Validated withholding treatment", dataOut: "Applied withholding with certificates and reporting data" },
  ],
};


const behaviorContract: AgentBehaviorContract = {
  role: "Tax Analyst agent for the Withholding Tax Agent workflow",
  primaryObjective: "Automated treaty rate lookup and application ensures optimal withholding on every cross-border payment. Gemini interprets complex treaty provisions -- beneficial ownership, PE status, mixed payments -- reducing errors to near-zero. so the Tax Analyst can move the Withholding accuracy KPI.",
  inScope: [
    "Automated treaty rate lookup and application ensures optimal withholding on every cross-border payment",
    "Gemini interprets complex treaty provisions -- beneficial ownership, PE status, mixed payments -- reducing errors to near-zero",
    "Same-day certificate generation and automated annual reporting eliminate the manual administrative burden",
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
      description: "Retrieve gl entries from SAP S/4HANA FI for the Withholding Tax Agent workflow.",
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
      name: "query_bigquery_analytics_events",
      kind: "query",
      sourceSystemId: "bigquery",
      description: "Retrieve analytics events from BigQuery for the Withholding Tax Agent workflow.",
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
      description: "Retrieve finance 3 records from FINANCE 3 for the Withholding Tax Agent workflow.",
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
      name: "lookup_withholding_tax_agent_controls_playbook",
      kind: "evidence_lookup",
      sourceSystemId: "bigquery",
      description: "Look up sections of the Withholding Tax Agent Controls Playbook to cite in narrative output, escalation rationale, and audit evidence.",
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
      name: "action_sap_s_4hana_fi_provision",
      kind: "action",
      sourceSystemId: "sap_s_4hana_fi",
      description: "Execute the provision step in SAP S/4HANA FI after the agent has gathered evidence and validated escalation gates.",
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
      claim: "Withholding accuracy moved from 90% (manual lookup) toward 99.5% automated",
      mustCite: [
        "sap_s_4hana_fi.gl_entries",
        "bigquery.analytics_events",
      ],
      sourceSystemIds: [
        "sap_s_4hana_fi",
        "bigquery",
      ],
    },
    {
      claim: "Treaty rate utilization moved from Often missed (statutory applied) toward Fully optimized",
      mustCite: [
        "sap_s_4hana_fi.gl_entries",
        "bigquery.analytics_events",
      ],
      sourceSystemIds: [
        "sap_s_4hana_fi",
        "bigquery",
      ],
    },
  ],
  escalationRules: [
    {
      trigger: "Withholding accuracy regresses past the 90% (manual lookup) baseline by more than 20%",
      action: "escalate_to_human",
      handoffTarget: "Tax Analyst",
      rationale: "Significant regressions need human judgment before automated remediation runs against production records.",
    },
    {
      trigger: "Source-system evidence is incomplete or stale (>24h) for any required entity",
      action: "request_more_info",
      rationale: "Recommendations grounded in stale evidence misrepresent current state and undermine audit defensibility.",
    },
    {
      trigger: "Proposed provision action lacks supporting evidence from at least two systems",
      action: "refuse",
      rationale: "Single-system evidence is insufficient to authorize external state changes without manual review.",
    },
  ],
  refusalRules: [
    "Never fabricate metric values; only publish numbers derived from SAP S/4HANA FI (and other named systems) entities.",
    "Never bypass Tax Analyst approval on escalation triggers, even when confidence is high.",
    "Never expose individual personal data (PII) in summaries; aggregate or pseudonymise before output.",
    "Never act on data older than the staleness threshold defined in the runbook without a fresh re-query.",
  ],
  goldenEvals: [
    {
      id: "withholding-tax-agent-end-to-end",
      prompt: "Run the Withholding Tax Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.",
      expectedToolCalls: [
        "query_sap_s_4hana_fi_gl_entries",
        "query_bigquery_analytics_events",
        "query_finance_3_finance_3_records",
        "lookup_withholding_tax_agent_controls_playbook",
        "action_sap_s_4hana_fi_provision",
      ],
      mustReferenceEntities: [
        "gl_entries",
        "analytics_events",
        "finance_3_records",
      ],
      mustCiteDocuments: [
        "withholding-tax-agent-controls-playbook",
      ],
      expectedActionOutcome: "Action provision executed against SAP S/4HANA FI, with audit-trail entry and Tax Analyst notified of outcomes.",
      forbiddenBehaviors: [
        "do not invent KPI numbers",
        "do not skip the evidence_lookup step before any recommendation",
        "do not execute provision without two-system evidence",
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
    rationale: "Row counts sized for Withholding Tax Agent so the agent can demonstrate the workflow against realistic transactional volume without simulating a production warehouse.",
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
      id: "withholding-tax-agent-controls-playbook",
      sourceSystemId: "bigquery",
      type: "policy",
      title: "Withholding Tax Agent Controls Playbook",
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
      id: "sap_s_4hana_fi_provision_api",
      sourceSystemId: "sap_s_4hana_fi",
      method: "POST",
      path: "/api/sap_s_4hana_fi/provision",
      description: "Synchronous endpoint the agent calls to provision in SAP S/4HANA FI after evidence gating.",
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
      id: "withholding-tax-agent-baseline-gap",
      description: "Seed a realistic gap where Withholding accuracy sits between 90% (manual lookup) and 99.5% automated, so the agent can detect, narrate, and recommend remediation.",
      affectedEntities: [
        "gl_entries",
        "subledger_balances",
      ],
      discoveryPath: [
        "Inspect SAP S/4HANA FI records for the affected entities",
        "Compare against BigQuery historical baseline",
        "Generate a citation-backed recommendation",
      ],
      expectedEvidence: [
        "source-system record",
        "historical baseline metric",
        "generated audit trail",
      ],
      expectedRecommendation: "Explain the gap, cite supporting evidence, and propose the next Tax Analyst action.",
    },
  ],
  datastorePackaging: {
    alloydb: {
      database: "withholding_tax_agent",
      schemas: [
        "sap_s_4hana_fi",
        "finance_3",
      ],
    },
    bigquery: {
      dataset: "finance_withholding_tax_agent",
      tables: [
        "kpi_summary",
        "evidence_index",
      ],
    },
    cloudStorage: {
      bucketSuffix: "withholding-tax-agent-evidence",
      prefixes: [
        "documents",
        "audit-trails",
        "exports",
      ],
    },
    apis: {
      serviceName: "withholding-tax-agent-source-adapters",
      deploymentTarget: "cloud_run",
    },
  },
  validation: {
    smokePrompt: "Run the Withholding Tax Agent workflow and cite source-system evidence for every claim.",
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

export const WithholdingTaxAgent = () => (
  <UseCaseSlide
    title="Withholding Tax Agent"
    subtitle="A-2506 - Tax & Compliance"
    icon={Percent}
    domainId="domain-25"
    layer="Layer 2: Agent Designer"
    persona="Tax Analyst"
    systems={["SAP S/4HANA FI", "BigQuery", "Vertex AI"]}
    kpis={[
      { label: "Withholding accuracy", before: "90% (manual lookup)", after: "99.5% automated" },
      { label: "Treaty rate utilization", before: "Often missed (statutory applied)", after: "Fully optimized" },
      { label: "Certificate generation", before: "Manual, 3-5 days", after: "Automated, same day" },
    ]}
    triggerType="event"
    swimlane={swimlane}
    flow={flow}
    architecture={architecture}
    hitl={{ actor: "Tax Analyst", action: "Verify complex withholding", description: "Tax Analyst reviews Gemini's treaty interpretation for non-standard payments involving beneficial ownership questions or PE allocations." }}
    statusQuo={[
      "Withholding rates determined manually by looking up treaty provisions for each cross-border payment.",
      "Treaty rates frequently missed -- statutory rate applied by default, resulting in overpayment and reclaim burden.",
      "Withholding tax certificates generated manually, often delayed 3-5 days after payment."
    ]}
    agentification={[
      "Automated treaty rate lookup and application ensures optimal withholding on every cross-border payment.",
      "Gemini interprets complex treaty provisions -- beneficial ownership, PE status, mixed payments -- reducing errors to near-zero.",
      "Same-day certificate generation and automated annual reporting eliminate the manual administrative burden."
    ]}
  />
);
