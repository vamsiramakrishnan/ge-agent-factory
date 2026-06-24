import React from "react";
import { UseCaseSlide } from "../../../agent/UseCaseSlide";
import { FlowStep } from "../../../agent/ProcessFlow";
import { SwimlaneFlow } from "../../../agent/SwimlaneFlow";
import { AgentArchitecture, UseCaseGenerationSpec, AgentBehaviorContract} from "../../../../types/architecture";
import { Calculator, Database, Cpu, Brain, UserCheck } from "lucide-react";

const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "s1", label: "Quarterly Close", lane: "system", type: "trigger" },
    { id: "a1", label: "Income Extraction", lane: "agent", type: "action" },
    { id: "a2", label: "Provision Calculation", lane: "agent", type: "action" },
    { id: "a3", label: "UTP Assessment", lane: "agent", type: "output" },
    { id: "h1", label: "Tax Director Approves", lane: "human", type: "hitl" },
  ],
  connections: [["s1", "a1"], ["a1", "a2"], ["a2", "a3"], ["a3", "h1"]],
};

const flow: FlowStep[] = [
  { label: "Income Data Pull", icon: Database, description: "Pre-tax income extracted by jurisdiction from GL with permanent and temporary differences classified.", trigger: "Quarterly close", systems: ["SAP S/4HANA FI", "Longview/OneSource"] },
  { label: "Provision Engine", icon: Cpu, description: "Multi-jurisdiction tax rate application, deferred tax asset/liability calculation, and ASC 740 workpaper generation.", systems: ["BigQuery"], integration: "ADK" },
  { label: "UTP Interpretation", icon: Brain, description: "Gemini interprets uncertain tax positions -- assessing probability of R&D credits, aggressive deductions, and cross-border structures.", systems: ["Vertex AI"] },
  { label: "Director Approval", icon: UserCheck, description: "Tax Director reviews provision, validates uncertain positions, and approves ASC 740 workpapers for Controller.", output: "Tax Provision" },
];

const architecture: AgentArchitecture = {
  connections: [
    { system: "SAP S/4HANA FI", description: "Pre-tax income by entity, GL trial balance, permanent/temporary differences", direction: "read", protocol: "RFC/BAPI", category: "erp" },
    { system: "Longview/OneSource", description: "Tax provision calculations, rate tables, ASC 740 workpapers", direction: "bidirectional", protocol: "REST API", category: "erp" },
    { system: "BigQuery", description: "Multi-jurisdiction analytics, DTA/DTL tracking, ETR analysis", direction: "bidirectional", protocol: "BigQuery SQL", category: "analytics" },
    { system: "Vertex AI (Gemini)", description: "Uncertain tax position analysis, probability assessment, provision narrative generation", direction: "bidirectional", protocol: "gRPC", category: "ai" },
  ],
  pipeline: [
    { label: "Jurisdictional Income Extraction", description: "Extract pre-tax income by entity and jurisdiction. Classify permanent differences (meals, fines) and temporary differences (depreciation, accruals). Map to applicable tax rates by jurisdiction.", systems: ["SAP S/4HANA FI", "Longview/OneSource"], layer: "integration", dataIn: "GL trial balance by entity", dataOut: "Jurisdictional income with classified differences" },
    { label: "Provision Calculation", description: "Calculate current and deferred tax provisions across all jurisdictions. Compute DTA/DTL movements, valuation allowance assessments, and rate reconciliation. Generate ASC 740 workpapers.", systems: ["BigQuery", "Longview/OneSource"], layer: "ml", dataIn: "Classified income + tax rates by jurisdiction", dataOut: "Tax provision with ASC 740 workpapers" },
    { label: "Uncertain Tax Position Analysis", description: "Gemini assesses UTPs: 'R&D credit is $2.4M but $800K relates to uncertain product line -- book at 75% probability ($600K) per ASC 740-10. Disclose the uncertain position.' Generates probability-weighted provision adjustments.", systems: ["Vertex AI (Gemini)"], layer: "llm", dataIn: "Provision calculations + tax position details", dataOut: "UTP-adjusted provision with probability assessments" },
    { label: "Approval & Reporting", description: "Present complete provision to Tax Director with workpapers, UTP disclosure drafts, and ETR walk. Route approved provision to Controller for financial statement inclusion.", systems: ["Longview/OneSource"], layer: "integration", dataIn: "Complete tax provision package", dataOut: "Approved provision with disclosures" },
  ],
};


const behaviorContract: AgentBehaviorContract = {
  role: "Tax Director agent for the Tax Provision Calculator workflow",
  primaryObjective: "Automated multi-jurisdiction provision calculation reduces cycle from 3-4 weeks to 3-5 days with ASC 740 workpapers. Gemini assesses uncertain tax positions with probability analysis and generates documented rationale citing specific guidance. so the Tax Director can move the Provision cycle time KPI.",
  inScope: [
    "Automated multi-jurisdiction provision calculation reduces cycle from 3-4 weeks to 3-5 days with ASC 740 workpapers",
    "Gemini assesses uncertain tax positions with probability analysis and generates documented rationale citing specific guidance",
    "Continuous ETR monitoring through the quarter eliminates late-breaking surprises, improving forecast accuracy to +/- 50bps",
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
      description: "Retrieve gl entries from SAP S/4HANA FI for the Tax Provision Calculator workflow.",
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
      name: "query_longview_onesource_longview_onesource_records",
      kind: "query",
      sourceSystemId: "longview_onesource",
      description: "Retrieve longview onesource records from Longview/OneSource for the Tax Provision Calculator workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "longview_onesource_records_records",
        "longview_onesource_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_bigquery_analytics_events",
      kind: "query",
      sourceSystemId: "bigquery",
      description: "Retrieve analytics events from BigQuery for the Tax Provision Calculator workflow.",
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
      name: "lookup_tax_provision_calculator_controls_playbook",
      kind: "evidence_lookup",
      sourceSystemId: "bigquery",
      description: "Look up sections of the Tax Provision Calculator Controls Playbook to cite in narrative output, escalation rationale, and audit evidence.",
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
      claim: "Provision cycle time moved from 3-4 weeks toward 3-5 days",
      mustCite: [
        "sap_s_4hana_fi.gl_entries",
        "longview_onesource.longview_onesource_records",
      ],
      sourceSystemIds: [
        "sap_s_4hana_fi",
        "longview_onesource",
      ],
    },
    {
      claim: "ETR forecast accuracy moved from +/- 300bps toward +/- 50bps",
      mustCite: [
        "sap_s_4hana_fi.gl_entries",
        "longview_onesource.longview_onesource_records",
      ],
      sourceSystemIds: [
        "sap_s_4hana_fi",
        "longview_onesource",
      ],
    },
  ],
  escalationRules: [
    {
      trigger: "Provision cycle time regresses past the 3-4 weeks baseline by more than 20%",
      action: "escalate_to_human",
      handoffTarget: "Tax Director",
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
    "Never bypass Tax Director approval on escalation triggers, even when confidence is high.",
    "Never expose individual personal data (PII) in summaries; aggregate or pseudonymise before output.",
    "Never act on data older than the staleness threshold defined in the runbook without a fresh re-query.",
  ],
  goldenEvals: [
    {
      id: "tax-provision-calculator-end-to-end",
      prompt: "Run the Tax Provision Calculator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.",
      expectedToolCalls: [
        "query_sap_s_4hana_fi_gl_entries",
        "query_longview_onesource_longview_onesource_records",
        "query_bigquery_analytics_events",
        "lookup_tax_provision_calculator_controls_playbook",
        "action_sap_s_4hana_fi_generate",
      ],
      mustReferenceEntities: [
        "gl_entries",
        "longview_onesource_records",
        "analytics_events",
      ],
      mustCiteDocuments: [
        "tax-provision-calculator-controls-playbook",
      ],
      expectedActionOutcome: "Action generate executed against SAP S/4HANA FI, with audit-trail entry and Tax Director notified of outcomes.",
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
    rationale: "Row counts sized for Tax Provision Calculator so the agent can demonstrate the workflow against realistic transactional volume without simulating a production warehouse.",
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
      id: "longview_onesource",
      name: "Longview/OneSource",
      owns: [
        "longview_onesource_records",
        "longview_onesource_events",
        "longview_onesource_audit_trail",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_longview_onesource_longview_onesource_records",
        "query_longview_onesource_longview_onesource_events",
        "query_longview_onesource_longview_onesource_audit_trail",
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
      name: "longview_onesource_records",
      sourceSystemId: "longview_onesource",
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
      name: "longview_onesource_events",
      sourceSystemId: "longview_onesource",
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
          name: "longview_onesource_record_id",
          type: "ref",
          ref: "longview_onesource_records.id",
          required: true,
        },
      ],
    },
    {
      name: "longview_onesource_audit_trail",
      sourceSystemId: "longview_onesource",
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
      from: "longview_onesource_events.longview_onesource_record_id",
      to: "longview_onesource_records.id",
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
      id: "tax-provision-calculator-controls-playbook",
      sourceSystemId: "bigquery",
      type: "policy",
      title: "Tax Provision Calculator Controls Playbook",
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
      id: "tax-provision-calculator-baseline-gap",
      description: "Seed a realistic gap where Provision cycle time sits between 3-4 weeks and 3-5 days, so the agent can detect, narrate, and recommend remediation.",
      affectedEntities: [
        "gl_entries",
        "subledger_balances",
      ],
      discoveryPath: [
        "Inspect SAP S/4HANA FI records for the affected entities",
        "Compare against Longview/OneSource historical baseline",
        "Generate a citation-backed recommendation",
      ],
      expectedEvidence: [
        "source-system record",
        "historical baseline metric",
        "generated audit trail",
      ],
      expectedRecommendation: "Explain the gap, cite supporting evidence, and propose the next Tax Director action.",
    },
  ],
  datastorePackaging: {
    alloydb: {
      database: "tax_provision_calculator",
      schemas: [
        "sap_s_4hana_fi",
        "longview_onesource",
      ],
    },
    bigquery: {
      dataset: "finance_tax_provision_calculator",
      tables: [
        "kpi_summary",
        "evidence_index",
      ],
    },
    cloudStorage: {
      bucketSuffix: "tax-provision-calculator-evidence",
      prefixes: [
        "documents",
        "audit-trails",
        "exports",
      ],
    },
    apis: {
      serviceName: "tax-provision-calculator-source-adapters",
      deploymentTarget: "cloud_run",
    },
  },
  validation: {
    smokePrompt: "Run the Tax Provision Calculator workflow and cite source-system evidence for every claim.",
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

export const TaxProvisionCalculator = () => (
  <UseCaseSlide
    title="Tax Provision Calculator"
    subtitle="A-2501 - Tax & Compliance"
    icon={Calculator}
    domainId="domain-25"
    layer="Layer 3: Custom ADK"
    persona="Tax Director"
    systems={["SAP S/4HANA FI", "Longview/OneSource", "BigQuery", "Vertex AI"]}
    kpis={[
      { label: "Provision cycle time", before: "3-4 weeks", after: "3-5 days" },
      { label: "ETR forecast accuracy", before: "+/- 300bps", after: "+/- 50bps" },
      { label: "UTP documentation", before: "Manual memos", after: "Auto-generated with citations" },
    ]}
    triggerType="scheduled"
    swimlane={swimlane}
    flow={flow}
    architecture={architecture}
    hitl={{ actor: "Tax Director", action: "Approve provision and UTPs", description: "Tax Director reviews multi-jurisdiction provision, validates uncertain tax position probability assessments, and approves ASC 740 workpapers." }}
    statusQuo={[
      "Tax provision takes 3-4 weeks with manual data gathering from 15+ jurisdictions and Excel-based calculations.",
      "Uncertain tax positions assessed subjectively with limited documentation of probability analysis.",
      "ETR forecasting inaccurate due to late-breaking adjustments discovered during the close."
    ]}
    agentification={[
      "Automated multi-jurisdiction provision calculation reduces cycle from 3-4 weeks to 3-5 days with ASC 740 workpapers.",
      "Gemini assesses uncertain tax positions with probability analysis and generates documented rationale citing specific guidance.",
      "Continuous ETR monitoring through the quarter eliminates late-breaking surprises, improving forecast accuracy to +/- 50bps."
    ]}
  />
);
