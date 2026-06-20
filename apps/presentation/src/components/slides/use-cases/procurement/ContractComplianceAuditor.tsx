import React from "react";
import { UseCaseSlide } from "../../../agent/UseCaseSlide";
import { FlowStep } from "../../../agent/ProcessFlow";
import { SwimlaneFlow } from "../../../agent/SwimlaneFlow";
import { AgentArchitecture, AgentBehaviorContract, UseCaseGenerationSpec } from "../../../../types/architecture";
import { ClipboardCheck, Database, Search, Calculator, FileOutput } from "lucide-react";

const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "s1", label: "Monthly Cycle", lane: "system", type: "trigger" },
    { id: "a1", label: "Terms Extraction", lane: "agent", type: "action" },
    { id: "a2", label: "Actuals Matching", lane: "agent", type: "action" },
    { id: "a3", label: "Variance Analysis", lane: "agent", type: "action" },
    { id: "a4", label: "Exception Report", lane: "agent", type: "output" },
  ],
  connections: [["s1", "a1"], ["a1", "a2"], ["a2", "a3"], ["a3", "a4"]],
};

const flow: FlowStep[] = [
  { label: "Terms Pull", icon: Database, description: "Contract terms extracted — pricing schedules, volume commitments, rebate tiers, and penalty triggers.", trigger: "Scheduled", systems: ["Icertis"] },
  { label: "Actuals Match", icon: Search, description: "PO and invoice data from ERP matched against contracted pricing, volumes, and SLA thresholds.", systems: ["SAP S/4HANA", "BigQuery"] },
  { label: "Formula Validation", icon: Calculator, description: "LLM interprets complex pricing structures — index-based adjustments with dead bands, caps, and retrospective rebates.", systems: ["Vertex AI"], integration: "ADK" },
  { label: "Exception Report", icon: FileOutput, description: "Compliance exceptions delivered with financial impact and recommended actions — rebate cliff alerts, pricing overcharges.", output: "Compliance Report" },
];

const architecture: AgentArchitecture = {
  connections: [
    { system: "Icertis", description: "Contract terms — pricing schedules, volume commitments, rebate tiers, penalty triggers", direction: "read", protocol: "REST API", category: "clm" },
    { system: "SAP S/4HANA", description: "PO and invoice actuals, goods receipt data, pricing history", direction: "read", protocol: "REST API", category: "erp" },
    { system: "BigQuery", description: "Compliance analysis, variance calculations, rebate threshold monitoring", direction: "bidirectional", protocol: "BigQuery SQL", category: "analytics" },
    { system: "Vertex AI (Gemini)", description: "Complex pricing formula interpretation, rebate cliff detection, compliance narrative generation", direction: "bidirectional", protocol: "gRPC", category: "ai" },
  ],
  pipeline: [
    { label: "Terms & Actuals Extraction", description: "Pull contract terms (pricing schedules, volume commitments, rebate tiers) from CLM. Extract actual PO/invoice data from ERP. Stage both in BigQuery for compliance matching.", systems: ["Icertis", "SAP S/4HANA", "BigQuery"], layer: "integration", dataIn: "Contract terms + PO/invoice actuals", dataOut: "Paired terms-to-actuals dataset" },
    { label: "Pricing & Volume Compliance Analysis", description: "Pricing compliance analysis comparing contracted price vs. actual invoiced price. Volume commitment tracking against targets. Rebate threshold monitoring and penalty trigger detection using statistical analysis.", systems: ["BigQuery"], layer: "ml", dataIn: "Paired terms-to-actuals dataset", dataOut: "Compliance variance report with threshold alerts" },
    { label: "Formula Interpretation & Advisory", description: "Gemini interprets complex pricing structures — index-based adjustments with dead bands and caps — and validates supplier quarterly price adjustment letters. Identifies rebate cliff opportunities: 'At 92% of volume commitment with 45 days left, purchasing 8% more triggers $180K retrospective rebate.' Generates actionable compliance exception reports.", systems: ["Vertex AI (Gemini)"], layer: "llm", dataIn: "Compliance variances + pricing formulas + volume data", dataOut: "Exception report with financial impact and recommended actions" },
  ],
};

const behaviorContract: AgentBehaviorContract = {
  role: "Procurement contract compliance auditor for GE category management and supplier compliance",
  primaryObjective: "Monthly audit of contract terms against actuals: match pricing schedules and invoices, detect overcharges and rebate cliff opportunities, interpret complex index-based formulas with dead bands and caps, and generate exception reports with citations and financial impact.",
  inScope: [
    "Terms-to-actuals matching: pricing schedules vs. PO/invoice data",
    "Pricing variance analysis: contracted price vs. actual invoiced amounts",
    "Rebate cliff detection: proximity to volume thresholds with days-remaining warnings",
    "Complex pricing formula validation: index-basis, dead bands, caps, retrospective rebates",
    "Compliance exception report generation with financial impact quantification",
  ],
  outOfScope: [
    "Amending or modifying contract terms or pricing schedules",
    "Authorizing vendor termination or payment holds",
    "Making purchasing or sourcing decisions based on audit findings",
    "Negotiating rebate terms or waiving penalty clauses",
  ],
  toolIntents: [
    {
      name: "query_icertis_contracts",
      kind: "query",
      sourceSystemId: "icertis",
      description: "Retrieve contract master records including term start/end dates, vendor IDs, and status.",
      requiredInputs: ["contract_id"],
      produces: ["contract_record", "vendor_id", "effective_date", "term_months"],
      evidenceEmitted: ["source_system_record"],
    },
    {
      name: "query_icertis_pricing_schedules",
      kind: "query",
      sourceSystemId: "icertis",
      description: "Extract pricing schedules from contract: base price, index basis, dead band, cap percentage, SKU references.",
      requiredInputs: ["contract_id"],
      produces: ["pricing_schedule_set"],
      evidenceEmitted: ["source_system_record"],
    },
    {
      name: "query_icertis_rebate_tiers",
      kind: "query",
      sourceSystemId: "icertis",
      description: "Retrieve rebate tier thresholds: volume commitments, rebate percentages, cliff detection.",
      requiredInputs: ["contract_id"],
      produces: ["rebate_tier_set"],
      evidenceEmitted: ["source_system_record"],
    },
    {
      name: "query_sap_s4hana_purchase_orders",
      kind: "query",
      sourceSystemId: "sap_s4hana",
      description: "Query purchase orders: PO ID, vendor, SKU, ordered quantity, agreed price.",
      requiredInputs: ["contract_id"],
      produces: ["po_record_set"],
      evidenceEmitted: ["source_system_record"],
    },
    {
      name: "query_sap_s4hana_invoice_actuals",
      kind: "query",
      sourceSystemId: "sap_s4hana",
      description: "Retrieve invoice records: invoice ID, contract ref, vendor, amount, invoiced date, line-item detail.",
      requiredInputs: ["contract_id"],
      produces: ["invoice_record_set"],
      evidenceEmitted: ["source_system_record"],
    },
    {
      name: "query_bigquery_variance_calculations",
      kind: "query",
      sourceSystemId: "bigquery",
      description: "Run variance analysis: contracted price vs. actual invoice price per SKU, cumulative volumes vs. commitments.",
      requiredInputs: ["contract_id"],
      produces: ["variance_report"],
      evidenceEmitted: ["sql_result"],
    },
    {
      name: "query_bigquery_rebate_threshold_status",
      kind: "query",
      sourceSystemId: "bigquery",
      description: "Check rebate cliff status: current volume % of threshold, days remaining in contract term, proximity alerts.",
      requiredInputs: ["contract_id"],
      produces: ["rebate_threshold_status"],
      evidenceEmitted: ["sql_result"],
    },
    {
      name: "action_email_publish_compliance_report",
      kind: "action",
      sourceSystemId: "icertis",
      description: "Distribute compliance exception report via email to category manager and procurement leadership.",
      requiredInputs: ["report_content", "recipient_list"],
      produces: ["delivery_id", "sent_timestamp"],
      evidenceEmitted: ["api_response"],
    },
    {
      name: "action_servicenow_create_compliance_ticket",
      kind: "action",
      sourceSystemId: "icertis",
      description: "Create ServiceNow compliance ticket for escalation to procurement and legal review.",
      requiredInputs: ["exception_type", "financial_impact", "contract_id"],
      produces: ["ticket_id", "ticket_status"],
      evidenceEmitted: ["api_response"],
    },
    {
      name: "evidence_pricing_formula_policy",
      kind: "evidence_lookup",
      sourceSystemId: "icertis",
      description: "Cite Procurement Contract Compliance Policy for pricing formula validation anchors: index-formula-validation, dead-band-rules, overcharge-tolerance, escalation-thresholds.",
      requiredInputs: ["citation_anchor"],
      produces: ["document_citation"],
      evidenceEmitted: ["document_reference"],
    },
  ],
  evidenceRequirements: [
    {
      claim: "Pricing overcharge detected: invoiced price exceeds contracted price by threshold",
      mustCite: ["pricing_schedules.base_price", "invoice_actuals.amount", "overcharge-tolerance"],
      sourceSystemIds: ["icertis", "sap_s4hana"],
    },
    {
      claim: "Rebate cliff opportunity within 10% of volume threshold with <60 days remaining",
      mustCite: ["rebate_tiers.threshold_amount", "invoice_actuals.amount", "rebate-cliff-rules"],
      sourceSystemIds: ["icertis", "sap_s4hana"],
    },
    {
      claim: "Complex pricing formula interpretation with index basis, dead band, and cap",
      mustCite: ["pricing_schedules.index_basis", "pricing_schedules.dead_band_pct", "pricing_schedules.cap_pct", "index-formula-validation"],
      sourceSystemIds: ["icertis"],
    },
  ],
  escalationRules: [
    {
      trigger: "Pricing overcharge >$50K discovered in monthly audit",
      action: "escalate_to_human",
      handoffTarget: "Contract Manager + Category Lead",
      rationale: "High-value overcharges require immediate senior review and vendor negotiation authority.",
    },
    {
      trigger: "Complex pricing formula with no policy precedent or ambiguous interpretation",
      action: "escalate_to_human",
      handoffTarget: "Procurement Legal + Contract Manager",
      rationale: "Contract interpretation disputes require legal expertise and documented policy decision.",
    },
    {
      trigger: "Rebate cliff with <30 days remaining and volume target reachable with current burn rate",
      action: "escalate_to_human",
      handoffTarget: "Category Lead + Procurement Manager",
      rationale: "Time-sensitive cliff opportunities require urgent procurement action and volume planning.",
    },
    {
      trigger: "Multi-vendor systemic anomaly: same overcharge pattern across >3 contracts",
      action: "escalate_to_human",
      handoffTarget: "CFO + Chief Procurement Officer",
      rationale: "Systemic supplier behavior or data quality issues require enterprise-level review and action.",
    },
  ],
  refusalRules: [
    "Never invent pricing variance numbers; all overcharge claims must cite actual invoice records and contracted pricing schedules.",
    "Never recommend payment holds or invoice rejections; the agent reports exceptions but does not authorize financial actions.",
    "Never reinterpret contract clauses without explicit citation to the Procurement Contract Compliance Policy or legal precedent.",
    "Never assume a rebate cliff is triggered without quantifying the volume % and remaining contract days.",
  ],
  goldenEvals: [
    {
      id: "monthly-compliance-happy-path",
      prompt: "Run monthly compliance audit for Contract-5029 (LME aluminum supplier). Compare pricing schedules against PO and invoice actuals for Q2 2026. Identify pricing overcharges and rebate cliff status.",
      expectedToolCalls: [
        "query_icertis_contracts",
        "query_icertis_pricing_schedules",
        "query_icertis_rebate_tiers",
        "query_sap_s4hana_purchase_orders",
        "query_sap_s4hana_invoice_actuals",
        "query_bigquery_variance_calculations",
        "query_bigquery_rebate_threshold_status",
        "evidence_pricing_formula_policy",
      ],
      mustReferenceEntities: ["contracts", "pricing_schedules", "rebate_tiers", "invoice_actuals", "compliance_exceptions"],
      mustCiteDocuments: ["procurement-contract-compliance-policy"],
      expectedActionOutcome: "Compliance report generated with pricing variance summary, rebate cliff alert, and financial impact; exception records created.",
      forbiddenBehaviors: [
        "do not invent overcharge amounts",
        "do not skip volume threshold proximity check",
        "do not claim rebate cliff without citing threshold and remaining days",
      ],
    },
    {
      id: "rebate-cliff-opportunity-narrative",
      prompt: "Contract-4107 has a rebate tier: 90% volume commitment = $500K rebate. Current volume is at 88% with 45 days remaining in the term. Recommend action.",
      expectedToolCalls: [
        "query_icertis_rebate_tiers",
        "query_bigquery_rebate_threshold_status",
        "evidence_pricing_formula_policy",
      ],
      mustReferenceEntities: ["rebate_tiers", "invoice_actuals"],
      mustCiteDocuments: ["procurement-contract-compliance-policy"],
      expectedActionOutcome: "Escalate to Category Lead with quantified opportunity: 2% volume increase = $500K rebate; timeline urgency; recommended PO actions.",
      forbiddenBehaviors: [
        "do not guarantee a rebate will be triggered",
        "do not recommend purchase commitments",
      ],
    },
    {
      id: "index-formula-validation-with-policy",
      prompt: "Contract-3991 pricing: 'LME aluminum index ± 3% dead band, capped at 6%.' Current index moved 5% this quarter. Validate pricing adjustment against policy.",
      expectedToolCalls: [
        "query_icertis_pricing_schedules",
        "evidence_pricing_formula_policy",
      ],
      mustReferenceEntities: ["pricing_schedules"],
      mustCiteDocuments: ["procurement-contract-compliance-policy"],
      expectedActionOutcome: "Pricing adjustment is valid: index move (5%) exceeds dead band (3%), capped at 6% = 6% adjustment allowed. Cite policy index-formula-validation anchor.",
      forbiddenBehaviors: [
        "do not reinterpret dead band or cap without policy citation",
        "do not approve out-of-policy adjustments",
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
    rationale: "Contract compliance requires sufficient contract portfolio, pricing schedule variants, and invoice history to demonstrate variance detection, rebate cliff identification, and formula interpretation without becoming a large-data demo.",
  },
  sourceSystems: [
    {
      id: "icertis",
      name: "Icertis",
      owns: ["contracts", "pricing_schedules", "rebate_tiers", "contract_terms"],
      protocol: "REST API",
      localBacking: ["json-api", "alloydb"],
      toolNames: ["query_icertis_contracts", "query_icertis_pricing_schedules", "query_icertis_rebate_tiers"],
      mcpToolNames: ["icertis_get_contract", "icertis_list_pricing_schedules", "icertis_list_rebate_tiers"],
      evidence: ["source_system_record"],
    },
    {
      id: "sap_s4hana",
      name: "SAP S/4HANA",
      owns: ["purchase_orders", "invoice_actuals", "po_line_items"],
      protocol: "REST API",
      localBacking: ["json-api", "alloydb"],
      toolNames: ["query_sap_s4hana_purchase_orders", "query_sap_s4hana_invoice_actuals"],
      mcpToolNames: ["sap_s4hana_get_purchase_order", "sap_s4hana_list_invoices"],
      evidence: ["source_system_record"],
    },
    {
      id: "bigquery",
      name: "BigQuery",
      owns: ["variance_calculations", "rebate_threshold_status", "compliance_analytics"],
      protocol: "BigQuery SQL",
      localBacking: ["bigquery"],
      toolNames: ["query_bigquery_variance_calculations", "query_bigquery_rebate_threshold_status"],
      mcpToolNames: ["bigquery_query_variance_by_contract", "bigquery_query_rebate_alerts"],
      evidence: ["sql_result"],
    },
  ],
  entities: [
    {
      name: "contracts",
      sourceSystemId: "icertis",
      datastore: "alloydb",
      rowCount: 40,
      primaryKey: "id",
      columns: [
        { name: "id", type: "seq", required: true },
        { name: "vendor_id", type: "ref", ref: "vendors.id", required: true },
        { name: "status", type: "enum", values: ["draft", "active", "expired", "terminated"], weights: [0.05, 0.8, 0.12, 0.03], required: true },
        { name: "effective_date", type: "date.recent", required: true },
        { name: "term_months", type: "number", min: 12, max: 60, required: true },
        { name: "category", type: "enum", values: ["raw_materials", "mro", "services", "capital"], required: true },
      ],
    },
    {
      name: "pricing_schedules",
      sourceSystemId: "icertis",
      datastore: "alloydb",
      rowCount: 60,
      primaryKey: "id",
      columns: [
        { name: "id", type: "seq", required: true },
        { name: "contract_id", type: "ref", ref: "contracts.id", required: true },
        { name: "sku", type: "string", required: true },
        { name: "base_price", type: "number", min: 10, max: 5000, required: true },
        { name: "index_basis", type: "enum", values: ["fixed", "lme_aluminum", "wti_crude", "inflation_cpi"], required: true },
        { name: "dead_band_pct", type: "number", min: 0, max: 5, required: true },
        { name: "cap_pct", type: "number", min: 0, max: 10, required: true },
      ],
    },
    {
      name: "rebate_tiers",
      sourceSystemId: "icertis",
      datastore: "alloydb",
      rowCount: 40,
      primaryKey: "id",
      columns: [
        { name: "id", type: "seq", required: true },
        { name: "contract_id", type: "ref", ref: "contracts.id", required: true },
        { name: "tier_name", type: "string", required: true },
        { name: "threshold_amount", type: "number", min: 50000, max: 5000000, required: true },
        { name: "rebate_pct", type: "number", min: 1, max: 15, required: true },
      ],
    },
    {
      name: "invoice_actuals",
      sourceSystemId: "sap_s4hana",
      datastore: "alloydb",
      rowCount: 180,
      primaryKey: "id",
      columns: [
        { name: "id", type: "seq", required: true },
        { name: "contract_id", type: "ref", ref: "contracts.id", required: true },
        { name: "vendor_id", type: "ref", ref: "contracts.vendor_id", required: true },
        { name: "amount", type: "number", min: 100, max: 500000, required: true },
        { name: "invoiced_at", type: "date.recent", required: true },
      ],
    },
    {
      name: "compliance_exceptions",
      sourceSystemId: "icertis",
      datastore: "alloydb",
      rowCount: 30,
      primaryKey: "id",
      columns: [
        { name: "id", type: "seq", required: true },
        { name: "contract_id", type: "ref", ref: "contracts.id", required: true },
        { name: "exception_type", type: "enum", values: ["overcharge", "rebate_cliff", "formula_violation", "threshold_miss"], weights: [0.35, 0.35, 0.2, 0.1], required: true },
        { name: "financial_impact", type: "number", min: 1000, max: 500000, required: true },
        { name: "status", type: "enum", values: ["open", "escalated", "resolved"], required: true },
      ],
    },
  ],
  relationships: [
    { from: "pricing_schedules.contract_id", to: "contracts.id", cardinality: "many-to-one", orphanPolicy: "none" },
    { from: "rebate_tiers.contract_id", to: "contracts.id", cardinality: "many-to-one", orphanPolicy: "none" },
    { from: "invoice_actuals.contract_id", to: "contracts.id", cardinality: "many-to-one", orphanPolicy: "none" },
    { from: "invoice_actuals.vendor_id", to: "contracts.vendor_id", cardinality: "many-to-one", orphanPolicy: "none" },
    { from: "compliance_exceptions.contract_id", to: "contracts.id", cardinality: "many-to-one", orphanPolicy: "none" },
  ],
  documents: [
    {
      id: "procurement-contract-compliance-policy",
      sourceSystemId: "icertis",
      type: "policy",
      title: "Procurement Contract Compliance Policy",
      requiredSections: ["Pricing formula interpretation", "Dead band and cap rules", "Rebate threshold monitoring", "Overcharge escalation thresholds"],
      linkedEntities: ["pricing_schedules", "rebate_tiers", "compliance_exceptions"],
      minimumWordCount: 500,
      citationAnchors: ["overcharge-tolerance", "rebate-cliff-rules", "index-formula-validation", "escalation-thresholds"],
    },
    {
      id: "complex-pricing-formula-guide",
      sourceSystemId: "icertis",
      type: "knowledge_base",
      title: "Complex Pricing Formula Interpretation Guide",
      requiredSections: ["Index-based pricing mechanics", "Dead band application", "Cap calculation", "Retrospective rebate logic"],
      linkedEntities: ["pricing_schedules"],
      minimumWordCount: 400,
      citationAnchors: ["index-formula-validation", "dead-band-rules", "cap-mechanics", "rebate-trigger-validation"],
    },
  ],
  apis: [
    {
      systemId: "icertis",
      operation: "publish_compliance_report",
      method: "POST",
      path: "/systems/email/compliance-report-distribution",
      requestSchema: { report_content: "string", recipient_list: "array", contract_id: "string" },
      responseSchema: { delivery_id: "string", sent_timestamp: "string", status: "string" },
      fixture: "mock_data/apis/fixtures/email_compliance_report.json",
      mcpToolName: "action_email_publish_compliance_report",
    },
    {
      systemId: "icertis",
      operation: "create_compliance_ticket",
      method: "POST",
      path: "/systems/servicenow/compliance-tickets",
      requestSchema: { exception_type: "string", financial_impact: "number", contract_id: "string" },
      responseSchema: { ticket_id: "string", ticket_status: "string", priority: "string" },
      fixture: "mock_data/apis/fixtures/servicenow_compliance_ticket.json",
      mcpToolName: "action_servicenow_create_compliance_ticket",
    },
  ],
  anomalies: [
    {
      id: "missed-rebate-cliff",
      description: "Contract volume within 10% of rebate threshold with <60 days remaining in term; opportunity for purchasing action to capture rebate.",
      affectedEntities: ["contracts", "invoice_actuals", "rebate_tiers"],
      discoveryPath: [
        "Query current contract term end date",
        "Calculate days remaining",
        "Aggregate invoice_actuals amount for current period",
        "Compare against rebate_tiers.threshold_amount",
        "Flag if volume >= 90% of threshold AND days_remaining < 60",
      ],
      expectedEvidence: ["rebate_tiers.threshold_amount", "invoice_actuals aggregate", "days_remaining calculation"],
      expectedRecommendation: "Escalate to Category Lead: rebate cliff opportunity with quantified volume gap and timeline; recommend targeted purchasing actions.",
    },
  ],
  datastorePackaging: {
    alloydb: { database: "procurement_contract_compliance", schemas: ["icertis", "sap_s4hana"] },
    bigquery: { dataset: "procurement_compliance_analytics", tables: ["variance_by_contract", "rebate_cliff_alerts", "overcharge_history"] },
    cloudStorage: { bucketSuffix: "procurement-compliance-evidence", prefixes: ["contracts", "exception-reports"] },
    apis: { serviceName: "procurement-compliance-adapters", deploymentTarget: "cloud_run" },
  },
  behaviorContract,
  validation: {
    smokePrompt: "Run monthly compliance audit for Contract-5029. Compare Q2 2026 pricing schedules against PO and invoice actuals. Identify overcharges and rebate cliff status.",
    expectedAnswer: ["cites Icertis pricing schedules", "queries SAP S/4HANA invoices", "runs BigQuery variance analysis", "detects pricing variance or rebate cliff opportunity", "generates compliance report with financial impact", "cites Procurement Contract Compliance Policy"],
    assertions: ["all tool names use canonical system ids", "all contract foreign keys resolve", "at least one document citation included", "variance claim backed by pricing_schedules and invoice_actuals", "rebate claim backed by rebate_tiers and invoice aggregate"],
  },
};

export const ContractComplianceAuditor = () => (
  <UseCaseSlide
    title="Contract Compliance Auditor"
    subtitle="A-1406 • Contract Lifecycle"
    icon={ClipboardCheck}
    domainId="domain-14"
    layer="Layer 4: Full Orchestration"
    persona="Contract Manager"
    systems={["Icertis", "SAP S/4HANA", "BigQuery"]}
    kpis={[
      { label: "Pricing overcharges detected", before: "Spot-checked quarterly", after: "100% monthly" },
      { label: "Rebate revenue recovered", before: "$0 (thresholds missed)", after: "$180K avg/quarter" },
      { label: "Compliance audit time", before: "2 weeks manual", after: "Automated monthly" },
    ]}
    triggerType="scheduled"
    swimlane={swimlane}
    flow={flow}
    architecture={architecture}
    generationSpec={generationSpec}
    statusQuo={[
      "Contract compliance checked manually via quarterly spot audits — pricing overcharges go undetected for months.",
      "Complex pricing formulas (index-based with dead bands and caps) validated by hand in spreadsheets.",
      "Volume commitment thresholds missed because nobody tracks proximity to rebate cliffs in real time."
    ]}
    agentification={[
      "Gemini interprets complex pricing structures — 'LME aluminum index with +/- 3% dead band and 6% cap' — and validates supplier price adjustments.",
      "LLM identifies rebate cliff opportunities: 'At 92% of volume commitment with 45 days left, purchasing 8% more triggers $180K retrospective rebate.'",
      "Cross-references every PO and invoice against contract terms monthly, not just quarterly spot checks, with financial impact quantified."
    ]}
  />
);
