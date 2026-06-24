import React from "react";
import { UseCaseSlide } from "../../../agent/UseCaseSlide";
import { FlowStep } from "../../../agent/ProcessFlow";
import { SwimlaneFlow } from "../../../agent/SwimlaneFlow";
import { AgentArchitecture, UseCaseGenerationSpec, AgentBehaviorContract} from "../../../../types/architecture";
import { Receipt, Database, Cpu, Brain, CheckCircle } from "lucide-react";

const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "s1", label: "Invoice Generated", lane: "system", type: "trigger" },
    { id: "a1", label: "Jurisdiction Lookup", lane: "agent", type: "action" },
    { id: "a2", label: "Tax Calculation", lane: "agent", type: "action" },
    { id: "a3", label: "Edge Case Resolution", lane: "agent", type: "output" },
    { id: "h1", label: "Tax Reviews Exceptions", lane: "human", type: "hitl" },
  ],
  connections: [["s1", "a1"], ["a1", "a2"], ["a2", "a3"], ["a3", "h1"]],
};

const flow: FlowStep[] = [
  { label: "Transaction Capture", icon: Database, description: "Invoice details captured with ship-to/bill-to addresses and product classification for tax determination.", trigger: "Invoice generated", systems: ["SAP S/4HANA SD"] },
  { label: "Tax Engine", icon: Cpu, description: "Avalara/Vertex determines jurisdiction, applies rates, validates exemption certificates, and calculates tax.", systems: ["Avalara", "Vertex Tax"], integration: "ADK" },
  { label: "Edge Case Handling", icon: Brain, description: "Gemini resolves ambiguous taxability -- SaaS vs. tangible goods, manufacturing exemptions, bundled services.", systems: ["Vertex AI"] },
  { label: "Exception Review", icon: CheckCircle, description: "Tax analyst reviews flagged transactions where product classification or exemption is uncertain.", output: "Tax-Applied Invoice" },
];

const architecture: AgentArchitecture = {
  connections: [
    { system: "Avalara", description: "Tax rate lookup, jurisdiction determination, exemption management, return filing", direction: "bidirectional", protocol: "REST API", category: "erp" },
    { system: "Vertex Tax", description: "Tax calculation engine, product taxability rules, rate tables", direction: "bidirectional", protocol: "REST API", category: "erp" },
    { system: "SAP S/4HANA SD", description: "Sales orders, invoices, customer master, ship-to addresses", direction: "bidirectional", protocol: "RFC/BAPI", category: "erp" },
    { system: "BigQuery", description: "Nexus analysis, exemption tracking, audit trail analytics", direction: "bidirectional", protocol: "BigQuery SQL", category: "analytics" },
    { system: "Vertex AI (Gemini)", description: "Taxability interpretation for edge cases, exemption validation reasoning", direction: "bidirectional", protocol: "gRPC", category: "ai" },
  ],
  pipeline: [
    { label: "Transaction Classification", description: "Capture invoice details including product codes, service descriptions, ship-to/bill-to addresses. Classify product/service type for tax determination. Identify applicable nexus.", systems: ["SAP S/4HANA SD"], layer: "integration", dataIn: "Sales order / invoice data", dataOut: "Classified transaction with jurisdiction mapping" },
    { label: "Tax Calculation & Exemptions", description: "Determine applicable tax rates by jurisdiction. Validate exemption certificates against customer records. Calculate tax at state, county, and city levels. Monitor nexus thresholds for new jurisdiction obligations.", systems: ["Avalara", "Vertex Tax", "BigQuery"], layer: "ml", dataIn: "Classified transaction + exemption certificates", dataOut: "Calculated tax with exemption validation" },
    { label: "Edge Case Resolution", description: "Gemini handles ambiguous taxability: 'Customer claims manufacturing exemption in Texas but product is electronically-delivered software -- Texas treats SaaS differently from manufactured goods. Apply 6.25% state tax.' Resolves classification disputes.", systems: ["Vertex AI (Gemini)"], layer: "llm", dataIn: "Flagged transactions + product descriptions + state tax rules", dataOut: "Resolved tax treatment with regulatory citation" },
    { label: "Filing & Compliance", description: "Aggregate calculated taxes by jurisdiction. Prepare and file returns. Maintain audit trail with full calculation lineage.", systems: ["Avalara", "BigQuery"], layer: "integration", dataIn: "All tax calculations for period", dataOut: "Filed returns with audit documentation" },
  ],
};


const behaviorContract: AgentBehaviorContract = {
  role: "Tax Analyst agent for the Sales & Use Tax Automation workflow",
  primaryObjective: "Tax engine handles 99%+ of transactions automatically; Gemini resolves the remaining ambiguous edge cases. LLM interprets state-specific rules for SaaS taxability, manufacturing exemptions, and bundled service treatment. so the Tax Analyst can move the Tax calculation accuracy KPI.",
  inScope: [
    "Tax engine handles 99%+ of transactions automatically; Gemini resolves the remaining ambiguous edge cases",
    "LLM interprets state-specific rules for SaaS taxability, manufacturing exemptions, and bundled service treatment",
    "Audit risk reduced by 90% through consistent, documented tax determinations with full calculation lineage",
  ],
  outOfScope: [
    "Final sign-off on materially significant journal entries (Controller retains authority)",
    "Restatement of prior-period filings",
    "Tax position changes that require external advisor review",
  ],
  toolIntents: [
    {
      name: "query_avalara_avalara_records",
      kind: "query",
      sourceSystemId: "avalara",
      description: "Retrieve avalara records from Avalara for the Sales & Use Tax Automation workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "avalara_records_records",
        "avalara_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_vertex_tax_vertex_tax_records",
      kind: "query",
      sourceSystemId: "vertex_tax",
      description: "Retrieve vertex tax records from Vertex Tax for the Sales & Use Tax Automation workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "vertex_tax_records_records",
        "vertex_tax_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_sap_s_4hana_sd_sales_orders",
      kind: "query",
      sourceSystemId: "sap_s_4hana_sd",
      description: "Retrieve sales orders from SAP S/4HANA SD for the Sales & Use Tax Automation workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "sales_orders_records",
        "sales_orders_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_bigquery_analytics_events",
      kind: "query",
      sourceSystemId: "bigquery",
      description: "Retrieve analytics events from BigQuery for the Sales & Use Tax Automation workflow.",
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
      name: "lookup_sales_use_tax_automation_controls_playbook",
      kind: "evidence_lookup",
      sourceSystemId: "bigquery",
      description: "Look up sections of the Sales & Use Tax Automation Controls Playbook to cite in narrative output, escalation rationale, and audit evidence.",
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
      claim: "Tax calculation accuracy moved from 94% toward 99.8%",
      mustCite: [
        "avalara.avalara_records",
        "vertex_tax.vertex_tax_records",
      ],
      sourceSystemIds: [
        "avalara",
        "vertex_tax",
      ],
    },
    {
      claim: "Manual tax determinations moved from 200/month toward 10/month (edge cases)",
      mustCite: [
        "avalara.avalara_records",
        "vertex_tax.vertex_tax_records",
      ],
      sourceSystemIds: [
        "avalara",
        "vertex_tax",
      ],
    },
  ],
  escalationRules: [
    {
      trigger: "Tax calculation accuracy regresses past the 94% baseline by more than 20%",
      action: "escalate_to_human",
      handoffTarget: "Tax Analyst",
      rationale: "Significant regressions need human judgment before automated remediation runs against production records.",
    },
    {
      trigger: "Source-system evidence is incomplete or stale (>24h) for any required entity",
      action: "request_more_info",
      rationale: "Recommendations grounded in stale evidence misrepresent current state and undermine audit defensibility.",
    },
  ],
  refusalRules: [
    "Never fabricate metric values; only publish numbers derived from Avalara (and other named systems) entities.",
    "Never bypass Tax Analyst approval on escalation triggers, even when confidence is high.",
    "Never expose individual personal data (PII) in summaries; aggregate or pseudonymise before output.",
    "Never act on data older than the staleness threshold defined in the runbook without a fresh re-query.",
  ],
  goldenEvals: [
    {
      id: "sales-use-tax-automation-end-to-end",
      prompt: "Run the Sales & Use Tax Automation workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.",
      expectedToolCalls: [
        "query_avalara_avalara_records",
        "query_vertex_tax_vertex_tax_records",
        "query_sap_s_4hana_sd_sales_orders",
        "query_bigquery_analytics_events",
        "lookup_sales_use_tax_automation_controls_playbook",
      ],
      mustReferenceEntities: [
        "avalara_records",
        "vertex_tax_records",
        "sales_orders",
        "analytics_events",
      ],
      mustCiteDocuments: [
        "sales-use-tax-automation-controls-playbook",
      ],
      expectedActionOutcome: "Tax Analyst receives a fully-cited recommendation; no external state change without explicit approval.",
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
    rationale: "Row counts sized for Sales & Use Tax Automation so the agent can demonstrate the workflow against realistic transactional volume without simulating a production warehouse.",
  },
  sourceSystems: [
    {
      id: "avalara",
      name: "Avalara",
      owns: [
        "avalara_records",
        "avalara_events",
        "avalara_audit_trail",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_avalara_avalara_records",
        "query_avalara_avalara_events",
        "query_avalara_avalara_audit_trail",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
    {
      id: "vertex_tax",
      name: "Vertex Tax",
      owns: [
        "vertex_tax_records",
        "vertex_tax_events",
        "vertex_tax_audit_trail",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_vertex_tax_vertex_tax_records",
        "query_vertex_tax_vertex_tax_events",
        "query_vertex_tax_vertex_tax_audit_trail",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
    {
      id: "sap_s_4hana_sd",
      name: "SAP S/4HANA SD",
      owns: [
        "sales_orders",
        "contracts",
        "billing_documents",
      ],
      protocol: "RFC/BAPI",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_sap_s_4hana_sd_sales_orders",
        "query_sap_s_4hana_sd_contracts",
        "query_sap_s_4hana_sd_billing_documents",
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
      name: "avalara_records",
      sourceSystemId: "avalara",
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
      name: "avalara_events",
      sourceSystemId: "avalara",
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
          name: "avalara_record_id",
          type: "ref",
          ref: "avalara_records.id",
          required: true,
        },
      ],
    },
    {
      name: "avalara_audit_trail",
      sourceSystemId: "avalara",
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
      name: "vertex_tax_records",
      sourceSystemId: "vertex_tax",
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
      name: "vertex_tax_events",
      sourceSystemId: "vertex_tax",
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
          name: "vertex_tax_record_id",
          type: "ref",
          ref: "vertex_tax_records.id",
          required: true,
        },
      ],
    },
    {
      name: "vertex_tax_audit_trail",
      sourceSystemId: "vertex_tax",
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
      name: "sales_orders",
      sourceSystemId: "sap_s_4hana_sd",
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
      name: "contracts",
      sourceSystemId: "sap_s_4hana_sd",
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
          name: "counterparty",
          type: "company.name",
          required: true,
        },
        {
          name: "value",
          type: "number",
          min: 10000,
          max: 5000000,
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
          name: "start_date",
          type: "date",
          required: true,
        },
        {
          name: "end_date",
          type: "date",
          required: true,
        },
        {
          name: "status",
          type: "enum",
          values: [
            "draft",
            "negotiating",
            "active",
            "expired",
            "terminated",
          ],
          required: true,
        },
        {
          name: "auto_renew",
          type: "boolean",
          trueRate: 0.4,
        },
      ],
    },
    {
      name: "billing_documents",
      sourceSystemId: "sap_s_4hana_sd",
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
      from: "avalara_events.avalara_record_id",
      to: "avalara_records.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
    {
      from: "vertex_tax_events.vertex_tax_record_id",
      to: "vertex_tax_records.id",
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
      id: "sales-use-tax-automation-controls-playbook",
      sourceSystemId: "bigquery",
      type: "policy",
      title: "Sales & Use Tax Automation Controls Playbook",
      requiredSections: [
        "Workflow scope",
        "Materiality thresholds",
        "Escalation triggers",
        "Audit evidence requirements",
        "Quarter-end variations",
      ],
      linkedEntities: [
        "avalara_records",
        "avalara_events",
        "avalara_audit_trail",
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
      id: "sales-use-tax-automation-baseline-gap",
      description: "Seed a realistic gap where Tax calculation accuracy sits between 94% and 99.8%, so the agent can detect, narrate, and recommend remediation.",
      affectedEntities: [
        "avalara_records",
        "avalara_events",
      ],
      discoveryPath: [
        "Inspect Avalara records for the affected entities",
        "Compare against Vertex Tax historical baseline",
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
      database: "sales_use_tax_automation",
      schemas: [
        "avalara",
        "vertex_tax",
        "sap_s_4hana_sd",
      ],
    },
    bigquery: {
      dataset: "finance_sales_use_tax_automation",
      tables: [
        "kpi_summary",
        "evidence_index",
      ],
    },
    cloudStorage: {
      bucketSuffix: "sales-use-tax-automation-evidence",
      prefixes: [
        "documents",
        "audit-trails",
        "exports",
      ],
    },
    apis: {
      serviceName: "sales-use-tax-automation-source-adapters",
      deploymentTarget: "cloud_run",
    },
  },
  validation: {
    smokePrompt: "Run the Sales & Use Tax Automation workflow and cite source-system evidence for every claim.",
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

export const SalesUseTaxAutomation = () => (
  <UseCaseSlide
    title="Sales & Use Tax Automation"
    subtitle="A-2503 - Tax & Compliance"
    icon={Receipt}
    domainId="domain-25"
    layer="Layer 2: Agent Designer"
    persona="Tax Analyst"
    systems={["Avalara", "Vertex Tax", "SAP S/4HANA SD", "BigQuery", "Vertex AI"]}
    kpis={[
      { label: "Tax calculation accuracy", before: "94%", after: "99.8%" },
      { label: "Manual tax determinations", before: "200/month", after: "10/month (edge cases)" },
      { label: "Audit assessment risk", before: "$500K+ exposure", after: "< $50K" },
    ]}
    triggerType="event"
    swimlane={swimlane}
    flow={flow}
    architecture={architecture}
    hitl={{ actor: "Tax Analyst", action: "Review edge case determinations", description: "Tax Analyst reviews Gemini's taxability interpretation for ambiguous product classifications and exemption edge cases." }}
    statusQuo={[
      "Tax analysts manually determine taxability for 200+ transactions monthly where product classification is ambiguous.",
      "SaaS vs. tangible goods, bundled services, and manufacturing exemptions require state-by-state rule knowledge.",
      "Incorrect determinations discovered in audits lead to $500K+ assessments with penalties and interest."
    ]}
    agentification={[
      "Tax engine handles 99%+ of transactions automatically; Gemini resolves the remaining ambiguous edge cases.",
      "LLM interprets state-specific rules for SaaS taxability, manufacturing exemptions, and bundled service treatment.",
      "Audit risk reduced by 90% through consistent, documented tax determinations with full calculation lineage."
    ]}
  />
);
