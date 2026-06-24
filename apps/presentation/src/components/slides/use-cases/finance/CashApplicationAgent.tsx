import React from "react";
import { UseCaseSlide } from "../../../agent/UseCaseSlide";
import { FlowStep } from "../../../agent/ProcessFlow";
import { SwimlaneFlow } from "../../../agent/SwimlaneFlow";
import { AgentArchitecture, UseCaseGenerationSpec, AgentBehaviorContract} from "../../../../types/architecture";
import { Banknote, Database, Cpu, Brain, CheckCircle } from "lucide-react";

const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "s1", label: "Payment Received", lane: "system", type: "trigger" },
    { id: "a1", label: "Remittance Parse", lane: "agent", type: "action" },
    { id: "a2", label: "Invoice Matching", lane: "agent", type: "action" },
    { id: "a3", label: "Auto-Post", lane: "agent", type: "output" },
    { id: "h1", label: "Review Exceptions", lane: "human", type: "hitl" },
  ],
  connections: [["s1", "a1"], ["a1", "a2"], ["a2", "a3"], ["a3", "h1"]],
};

const flow: FlowStep[] = [
  { label: "Payment Ingest", icon: Database, description: "Bank remittance data ingested from lockbox files and electronic payments.", trigger: "Payment received", systems: ["HighRadius", "SAP S/4HANA FI"] },
  { label: "ML Matching", icon: Cpu, description: "ML matches payments to open invoices using amount, customer, reference patterns with confidence scoring.", systems: ["BigQuery"], integration: "ADK" },
  { label: "Deduction Analysis", icon: Brain, description: "Gemini reads ambiguous remittance advice to validate deductions against customer agreements and resolve short-pays.", systems: ["Vertex AI"] },
  { label: "Exception Review", icon: CheckCircle, description: "AR Specialist reviews unmatched items and validates deductions above threshold.", output: "Applied Cash" },
];

const architecture: AgentArchitecture = {
  connections: [
    { system: "HighRadius", description: "Remittance data, payment matching suggestions, deduction management", direction: "bidirectional", protocol: "REST API", category: "erp" },
    { system: "SAP S/4HANA FI", description: "Open invoice data, customer master, AR sub-ledger posting", direction: "bidirectional", protocol: "RFC/BAPI", category: "erp" },
    { system: "BigQuery", description: "Payment pattern analytics, matching model training data, confidence scoring", direction: "bidirectional", protocol: "BigQuery SQL", category: "analytics" },
    { system: "Vertex AI (Gemini)", description: "Remittance advice interpretation, deduction validation reasoning", direction: "bidirectional", protocol: "gRPC", category: "ai" },
    { system: "Bank Portals", description: "Lockbox files, BAI2 statements, electronic payment confirmations", direction: "read", protocol: "SFTP", category: "market-data" },
  ],
  pipeline: [
    { label: "Payment Ingestion", description: "Ingest remittance data from lockbox files, electronic payments, and wire transfers. Parse BAI2/MT940 formats and extract payer, amount, and reference fields.", systems: ["HighRadius", "SAP S/4HANA FI"], layer: "integration", dataIn: "Raw bank remittance files in varied formats", dataOut: "Structured payment records with extracted references" },
    { label: "ML Invoice Matching", description: "Match payments to open invoices using ML model trained on historical application patterns. Score matches by confidence considering amount, customer, date, and reference patterns. Auto-post above 95% confidence threshold.", systems: ["BigQuery", "HighRadius"], layer: "ml", dataIn: "Payment records + open invoice aging", dataOut: "Matched payments with confidence scores" },
    { label: "Deduction Resolution", description: "Gemini reads ambiguous remittance advice -- 'less 3.5% quality credit per agreement with Jim' -- and cross-references customer agreements to validate deductions. Distinguishes legitimate trade deductions from unauthorized short-pays.", systems: ["Vertex AI (Gemini)"], layer: "llm", dataIn: "Unmatched payments + remittance notes + customer agreements", dataOut: "Resolved deductions with validation reasoning" },
    { label: "Posting & Exception Routing", description: "Post matched and validated payments to AR sub-ledger. Route remaining exceptions to AR specialists with context and suggested resolution.", systems: ["SAP S/4HANA FI", "HighRadius"], layer: "integration", dataIn: "Validated matches and resolved deductions", dataOut: "Posted cash application entries" },
  ],
};


const behaviorContract: AgentBehaviorContract = {
  role: "AR Specialist agent for the Cash Application Agent workflow",
  primaryObjective: "ML model trained on 3 years of application history achieves 95%+ auto-match rate, freeing staff for exception management. Gemini reads remittance notes and cross-references customer agreements to validate deductions without customer calls. so the AR Specialist can move the Auto-match rate KPI.",
  inScope: [
    "ML model trained on 3 years of application history achieves 95%+ auto-match rate, freeing staff for exception management",
    "Gemini reads remittance notes and cross-references customer agreements to validate deductions without customer calls",
    "Real-time application eliminates the 3-day backlog, improving cash visibility for treasury forecasting",
  ],
  outOfScope: [
    "Final sign-off on materially significant journal entries (Controller retains authority)",
    "Restatement of prior-period filings",
    "Tax position changes that require external advisor review",
  ],
  toolIntents: [
    {
      name: "query_highradius_payment_remittances",
      kind: "query",
      sourceSystemId: "highradius",
      description: "Retrieve payment remittances from HighRadius for the Cash Application Agent workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "payment_remittances_records",
        "payment_remittances_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_sap_s_4hana_fi_gl_entries",
      kind: "query",
      sourceSystemId: "sap_s_4hana_fi",
      description: "Retrieve gl entries from SAP S/4HANA FI for the Cash Application Agent workflow.",
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
      description: "Retrieve analytics events from BigQuery for the Cash Application Agent workflow.",
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
      name: "lookup_cash_application_agent_controls_playbook",
      kind: "evidence_lookup",
      sourceSystemId: "bigquery",
      description: "Look up sections of the Cash Application Agent Controls Playbook to cite in narrative output, escalation rationale, and audit evidence.",
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
      name: "action_highradius_match",
      kind: "action",
      sourceSystemId: "highradius",
      description: "Execute the match step in HighRadius after the agent has gathered evidence and validated escalation gates.",
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
      claim: "Auto-match rate moved from 55-65% toward 95%+",
      mustCite: [
        "highradius.payment_remittances",
        "sap_s_4hana_fi.gl_entries",
      ],
      sourceSystemIds: [
        "highradius",
        "sap_s_4hana_fi",
      ],
    },
    {
      claim: "Deduction resolution time moved from 5-7 days toward Same day",
      mustCite: [
        "highradius.payment_remittances",
        "sap_s_4hana_fi.gl_entries",
      ],
      sourceSystemIds: [
        "highradius",
        "sap_s_4hana_fi",
      ],
    },
  ],
  escalationRules: [
    {
      trigger: "Auto-match rate regresses past the 55-65% baseline by more than 20%",
      action: "escalate_to_human",
      handoffTarget: "AR Specialist",
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
    "Never fabricate metric values; only publish numbers derived from HighRadius (and other named systems) entities.",
    "Never bypass AR Specialist approval on escalation triggers, even when confidence is high.",
    "Never expose individual personal data (PII) in summaries; aggregate or pseudonymise before output.",
    "Never act on data older than the staleness threshold defined in the runbook without a fresh re-query.",
  ],
  goldenEvals: [
    {
      id: "cash-application-agent-end-to-end",
      prompt: "Run the Cash Application Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.",
      expectedToolCalls: [
        "query_highradius_payment_remittances",
        "query_sap_s_4hana_fi_gl_entries",
        "query_bigquery_analytics_events",
        "lookup_cash_application_agent_controls_playbook",
        "action_highradius_match",
      ],
      mustReferenceEntities: [
        "payment_remittances",
        "gl_entries",
        "analytics_events",
      ],
      mustCiteDocuments: [
        "cash-application-agent-controls-playbook",
      ],
      expectedActionOutcome: "Action match executed against HighRadius, with audit-trail entry and AR Specialist notified of outcomes.",
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
    rationale: "Row counts sized for Cash Application Agent so the agent can demonstrate the workflow against realistic transactional volume without simulating a production warehouse.",
  },
  sourceSystems: [
    {
      id: "highradius",
      name: "HighRadius",
      owns: [
        "payment_remittances",
        "collections_queues",
        "deduction_cases",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_highradius_payment_remittances",
        "query_highradius_collections_queues",
        "query_highradius_deduction_cases",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
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
  ],
  entities: [
    {
      name: "payment_remittances",
      sourceSystemId: "highradius",
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
          name: "vendor",
          type: "company.name",
          required: true,
        },
        {
          name: "amount",
          type: "float",
          min: 100,
          max: 100000,
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
            "JPY",
          ],
          weights: [
            0.7,
            0.15,
            0.1,
            0.05,
          ],
          required: true,
        },
        {
          name: "status",
          type: "enum",
          values: [
            "draft",
            "pending",
            "approved",
            "paid",
            "rejected",
          ],
          weights: [
            0.1,
            0.3,
            0.3,
            0.2,
            0.1,
          ],
          required: true,
        },
        {
          name: "created_at",
          type: "date",
          required: true,
        },
        {
          name: "due_date",
          type: "date",
          required: true,
        },
      ],
    },
    {
      name: "collections_queues",
      sourceSystemId: "highradius",
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
      name: "deduction_cases",
      sourceSystemId: "highradius",
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
      id: "cash-application-agent-controls-playbook",
      sourceSystemId: "bigquery",
      type: "policy",
      title: "Cash Application Agent Controls Playbook",
      requiredSections: [
        "Workflow scope",
        "Materiality thresholds",
        "Escalation triggers",
        "Audit evidence requirements",
        "Quarter-end variations",
      ],
      linkedEntities: [
        "payment_remittances",
        "collections_queues",
        "deduction_cases",
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
      id: "highradius_match_api",
      sourceSystemId: "highradius",
      method: "POST",
      path: "/api/highradius/match",
      description: "Synchronous endpoint the agent calls to match in HighRadius after evidence gating.",
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
      id: "cash-application-agent-baseline-gap",
      description: "Seed a realistic gap where Auto-match rate sits between 55-65% and 95%+, so the agent can detect, narrate, and recommend remediation.",
      affectedEntities: [
        "payment_remittances",
        "collections_queues",
      ],
      discoveryPath: [
        "Inspect HighRadius records for the affected entities",
        "Compare against SAP S/4HANA FI historical baseline",
        "Generate a citation-backed recommendation",
      ],
      expectedEvidence: [
        "source-system record",
        "historical baseline metric",
        "generated audit trail",
      ],
      expectedRecommendation: "Explain the gap, cite supporting evidence, and propose the next AR Specialist action.",
    },
  ],
  datastorePackaging: {
    alloydb: {
      database: "cash_application_agent",
      schemas: [
        "highradius",
        "sap_s_4hana_fi",
      ],
    },
    bigquery: {
      dataset: "finance_cash_application_agent",
      tables: [
        "kpi_summary",
        "evidence_index",
      ],
    },
    cloudStorage: {
      bucketSuffix: "cash-application-agent-evidence",
      prefixes: [
        "documents",
        "audit-trails",
        "exports",
      ],
    },
    apis: {
      serviceName: "cash-application-agent-source-adapters",
      deploymentTarget: "cloud_run",
    },
  },
  validation: {
    smokePrompt: "Run the Cash Application Agent workflow and cite source-system evidence for every claim.",
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

export const CashApplicationAgent = () => (
  <UseCaseSlide
    title="Cash Application Agent"
    subtitle="A-2301 - AR & Collections"
    icon={Banknote}
    domainId="domain-23"
    layer="Layer 3: Custom ADK"
    persona="AR Specialist"
    systems={["HighRadius", "SAP S/4HANA FI", "BigQuery", "Vertex AI"]}
    kpis={[
      { label: "Auto-match rate", before: "55-65%", after: "95%+" },
      { label: "Deduction resolution time", before: "5-7 days", after: "Same day" },
      { label: "Cash application backlog", before: "3-4 days", after: "< 4 hours" },
    ]}
    triggerType="event"
    swimlane={swimlane}
    flow={flow}
    architecture={architecture}
    hitl={{ actor: "AR Specialist", action: "Review exception items", description: "Specialist reviews unmatched payments and validates deductions above the auto-approval threshold against customer agreements." }}
    statusQuo={[
      "Cash application clerks manually match payments to invoices, spending 60% of time on the 30% that don't auto-match.",
      "Ambiguous remittance advice requires back-and-forth calls with customers to understand deductions.",
      "Short-pays sit unresolved for weeks, inflating DSO and aging reports."
    ]}
    agentification={[
      "ML model trained on 3 years of application history achieves 95%+ auto-match rate, freeing staff for exception management.",
      "Gemini reads remittance notes and cross-references customer agreements to validate deductions without customer calls.",
      "Real-time application eliminates the 3-day backlog, improving cash visibility for treasury forecasting."
    ]}
  />
);
