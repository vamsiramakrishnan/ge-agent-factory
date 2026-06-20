import React from "react";
import { UseCaseSlide } from "../../../agent/UseCaseSlide";
import { FlowStep } from "../../../agent/ProcessFlow";
import { SwimlaneFlow } from "../../../agent/SwimlaneFlow";
import { AgentArchitecture, UseCaseGenerationSpec, AgentBehaviorContract} from "../../../../types/architecture";
import { Clock, Database, TrendingUp, FileText, CheckCircle } from "lucide-react";

const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "s1", label: "90/60/30-Day Alert", lane: "system", type: "trigger" },
    { id: "a1", label: "Performance Pull", lane: "agent", type: "action" },
    { id: "a2", label: "Renewal Brief", lane: "agent", type: "action" },
    { id: "a3", label: "Recommendation", lane: "agent", type: "output" },
    { id: "h1", label: "Manager Decides", lane: "human", type: "hitl" },
  ],
  connections: [["s1", "a1"], ["a1", "a2"], ["a2", "a3"], ["a3", "h1"]],
};

const flow: FlowStep[] = [
  { label: "Expiry Scan", icon: Database, description: "CLM scanned for contracts approaching expiry at 90, 60, and 30-day thresholds.", trigger: "Scheduled", systems: ["Icertis", "Ariba Contracts"] },
  { label: "Performance Compile", icon: TrendingUp, description: "Supplier performance metrics, spend trends, and market pricing benchmarks aggregated.", systems: ["SAP S/4HANA", "BigQuery"] },
  { label: "Renewal Brief", icon: FileText, description: "LLM generates renewal brief with renegotiation recommendations, savings estimates, and auto-renewal trap alerts.", systems: ["Vertex AI"], integration: "ADK" },
  { label: "Manager Decision", icon: CheckCircle, description: "Contract Manager reviews brief and decides: renew, renegotiate, rebid, or terminate.", output: "Renewal Decision" },
];

const architecture: AgentArchitecture = {
  connections: [
    { system: "Icertis", description: "Contract expiry dates, auto-renewal flags, term metadata", direction: "read", protocol: "REST API", category: "clm" },
    { system: "SAP Ariba Contracts", description: "Contract portfolio, renewal history, pricing terms", direction: "read", protocol: "REST API", category: "erp" },
    { system: "SAP S/4HANA", description: "Supplier performance metrics (OTIF, quality), spend trends", direction: "read", protocol: "REST API", category: "erp" },
    { system: "BigQuery", description: "Market pricing benchmarks, historical renewal analysis", direction: "read", protocol: "BigQuery SQL", category: "analytics" },
    { system: "Vertex AI (Gemini)", description: "Renewal brief generation, leverage analysis, auto-renewal trap detection", direction: "bidirectional", protocol: "gRPC", category: "ai" },
  ],
  pipeline: [
    { label: "Expiry Scanning", description: "Track contract expiry dates in CLM. Trigger tiered alerts at 90/60/30-day thresholds. Detect auto-renewal flags and calculate cancellation notice windows.", systems: ["Icertis", "SAP Ariba Contracts"], layer: "integration", dataIn: "Contract portfolio with expiry dates", dataOut: "Expiring contracts with alert tier and auto-renewal flags" },
    { label: "Performance & Market Scoring", description: "Aggregate supplier performance metrics (OTIF, quality PPM) and spend trends from ERP. Benchmark current contract pricing against market rates. Score renewal recommendation based on composite performance.", systems: ["SAP S/4HANA", "BigQuery"], layer: "ml", dataIn: "Supplier KPIs + market pricing data", dataOut: "Renewal recommendation score with performance context" },
    { label: "Renewal Brief Generation", description: "Gemini synthesizes performance data, market conditions, and contract terms into a renewal recommendation: renew, renegotiate, rebid, or terminate. Identifies auto-renewal traps and calculates whether cancellation windows have been missed. Estimates renegotiation leverage from declining performance or market price drops.", systems: ["Vertex AI (Gemini)"], layer: "llm", dataIn: "Performance scores + market benchmarks + contract terms", dataOut: "Renewal brief with recommendation and savings estimate" },
  ],
};


const behaviorContract: AgentBehaviorContract = {
  role: "Contract Manager agent for the Renewal & Expiry Monitor workflow",
  primaryObjective: "Gemini generates renewal briefs synthesizing OTIF trends, market pricing shifts, and contract terms into actionable recommendations. LLM identifies auto-renewal traps and calculates whether cancellation windows have been missed, with alternative options. so the Contract Manager can move the Auto-renewal traps caught KPI.",
  inScope: [
    "Gemini generates renewal briefs synthesizing OTIF trends, market pricing shifts, and contract terms into actionable recommendations",
    "LLM identifies auto-renewal traps and calculates whether cancellation windows have been missed, with alternative options",
    "Proactive alerts at 90/60/30 days with renegotiation leverage analysis — 'supplier OTIF dropped to 88%, market prices down 7%'",
  ],
  outOfScope: [
    "Contract execution without legal review",
    "Supplier disqualification decisions (category lead retains authority)",
    "Single-source justification overrides above policy threshold",
  ],
  toolIntents: [
    {
      name: "query_icertis_contracts",
      kind: "query",
      sourceSystemId: "icertis",
      description: "Retrieve contracts from Icertis for the Renewal & Expiry Monitor workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "contracts_records",
        "contracts_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_sap_ariba_contracts_suppliers",
      kind: "query",
      sourceSystemId: "sap_ariba_contracts",
      description: "Retrieve suppliers from SAP Ariba Contracts for the Renewal & Expiry Monitor workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "suppliers_records",
        "suppliers_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_sap_s_4hana_transactions",
      kind: "query",
      sourceSystemId: "sap_s_4hana",
      description: "Retrieve transactions from SAP S/4HANA for the Renewal & Expiry Monitor workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "transactions_records",
        "transactions_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "lookup_renewal_expiry_monitor_policy_guide",
      kind: "evidence_lookup",
      sourceSystemId: "icertis",
      description: "Look up sections of the Renewal & Expiry Monitor Procurement Policy Guide to cite in narrative output, escalation rationale, and audit evidence.",
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
      name: "action_icertis_recommend",
      kind: "action",
      sourceSystemId: "icertis",
      description: "Execute the recommend step in Icertis after the agent has gathered evidence and validated escalation gates.",
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
      claim: "Auto-renewal traps caught moved from 30% missed toward 100% flagged",
      mustCite: [
        "icertis.contracts",
        "sap_ariba_contracts.suppliers",
      ],
      sourceSystemIds: [
        "icertis",
        "sap_ariba_contracts",
      ],
    },
    {
      claim: "Renewal prep time moved from 2-3 weeks toward 1 day",
      mustCite: [
        "icertis.contracts",
        "sap_ariba_contracts.suppliers",
      ],
      sourceSystemIds: [
        "icertis",
        "sap_ariba_contracts",
      ],
    },
  ],
  escalationRules: [
    {
      trigger: "Auto-renewal traps caught regresses past the 30% missed baseline by more than 20%",
      action: "escalate_to_human",
      handoffTarget: "Contract Manager",
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
    "Never fabricate metric values; only publish numbers derived from Icertis (and other named systems) entities.",
    "Never bypass Contract Manager approval on escalation triggers, even when confidence is high.",
    "Never expose individual personal data (PII) in summaries; aggregate or pseudonymise before output.",
    "Never act on data older than the staleness threshold defined in the runbook without a fresh re-query.",
  ],
  goldenEvals: [
    {
      id: "renewal-expiry-monitor-end-to-end",
      prompt: "Run the Renewal & Expiry Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.",
      expectedToolCalls: [
        "query_icertis_contracts",
        "query_sap_ariba_contracts_suppliers",
        "query_sap_s_4hana_transactions",
        "lookup_renewal_expiry_monitor_policy_guide",
        "action_icertis_recommend",
      ],
      mustReferenceEntities: [
        "contracts",
        "suppliers",
        "transactions",
      ],
      mustCiteDocuments: [
        "renewal-expiry-monitor-policy-guide",
      ],
      expectedActionOutcome: "Action recommend executed against Icertis, with audit-trail entry and Contract Manager notified of outcomes.",
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
    rationale: "Row counts sized for Renewal & Expiry Monitor so the agent can demonstrate the workflow against realistic transactional volume without simulating a production warehouse.",
  },
  sourceSystems: [
    {
      id: "icertis",
      name: "Icertis",
      owns: [
        "contracts",
        "amendments",
        "obligations",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_icertis_contracts",
        "query_icertis_amendments",
        "query_icertis_obligations",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
    {
      id: "sap_ariba_contracts",
      name: "SAP Ariba Contracts",
      owns: [
        "suppliers",
        "sourcing_events",
        "contracts",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_sap_ariba_contracts_suppliers",
        "query_sap_ariba_contracts_sourcing_events",
        "query_sap_ariba_contracts_contracts",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
    {
      id: "sap_s_4hana",
      name: "SAP S/4HANA",
      owns: [
        "transactions",
        "journal_entries",
        "master_data",
      ],
      protocol: "RFC/BAPI",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_sap_s_4hana_transactions",
        "query_sap_s_4hana_journal_entries",
        "query_sap_s_4hana_master_data",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
  ],
  entities: [
    {
      name: "contracts",
      sourceSystemId: "icertis",
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
      name: "amendments",
      sourceSystemId: "icertis",
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
      name: "obligations",
      sourceSystemId: "icertis",
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
      name: "suppliers",
      sourceSystemId: "sap_ariba_contracts",
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
          type: "company.name",
          required: true,
        },
        {
          name: "category",
          type: "enum",
          values: [
            "IT",
            "Consulting",
            "Manufacturing",
            "Logistics",
            "Facilities",
            "Marketing",
          ],
          required: true,
        },
        {
          name: "rating",
          type: "number",
          min: 1,
          max: 5,
          required: true,
        },
        {
          name: "annual_spend",
          type: "number",
          min: 10000,
          max: 5000000,
          required: true,
        },
        {
          name: "risk_score",
          type: "enum",
          values: [
            "low",
            "medium",
            "high",
          ],
          weights: [
            0.5,
            0.35,
            0.15,
          ],
          required: true,
        },
        {
          name: "status",
          type: "enum",
          values: [
            "active",
            "pending_review",
            "terminated",
          ],
          required: true,
        },
        {
          name: "onboarded_on",
          type: "date",
          required: true,
        },
      ],
    },
    {
      name: "sourcing_events",
      sourceSystemId: "sap_ariba_contracts",
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
        {
          name: "supplier_id",
          type: "ref",
          ref: "suppliers.id",
          required: true,
        },
      ],
    },
    {
      name: "transactions",
      sourceSystemId: "sap_s_4hana",
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
      name: "journal_entries",
      sourceSystemId: "sap_s_4hana",
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
      name: "master_data",
      sourceSystemId: "sap_s_4hana",
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
  ],
  relationships: [
    {
      from: "sourcing_events.supplier_id",
      to: "suppliers.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
  ],
  documents: [
    {
      id: "renewal-expiry-monitor-policy-guide",
      sourceSystemId: "icertis",
      type: "policy",
      title: "Renewal & Expiry Monitor Procurement Policy Guide",
      requiredSections: [
        "Sourcing principles",
        "Approval thresholds",
        "Supplier risk requirements",
        "Contract and compliance gates",
        "Exception handling",
      ],
      linkedEntities: [
        "contracts",
        "amendments",
        "obligations",
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
      id: "icertis_recommend_api",
      sourceSystemId: "icertis",
      method: "POST",
      path: "/api/icertis/recommend",
      description: "Synchronous endpoint the agent calls to recommend in Icertis after evidence gating.",
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
      id: "renewal-expiry-monitor-baseline-gap",
      description: "Seed a realistic gap where Auto-renewal traps caught sits between 30% missed and 100% flagged, so the agent can detect, narrate, and recommend remediation.",
      affectedEntities: [
        "contracts",
        "amendments",
      ],
      discoveryPath: [
        "Inspect Icertis records for the affected entities",
        "Compare against SAP Ariba Contracts historical baseline",
        "Generate a citation-backed recommendation",
      ],
      expectedEvidence: [
        "source-system record",
        "historical baseline metric",
        "generated audit trail",
      ],
      expectedRecommendation: "Explain the gap, cite supporting evidence, and propose the next Contract Manager action.",
    },
  ],
  datastorePackaging: {
    alloydb: {
      database: "renewal_expiry_monitor",
      schemas: [
        "icertis",
        "sap_ariba_contracts",
        "sap_s_4hana",
      ],
    },
    bigquery: {
      dataset: "procurement_renewal_expiry_monitor",
      tables: [
        "kpi_summary",
        "evidence_index",
      ],
    },
    cloudStorage: {
      bucketSuffix: "renewal-expiry-monitor-evidence",
      prefixes: [
        "documents",
        "audit-trails",
        "exports",
      ],
    },
    apis: {
      serviceName: "renewal-expiry-monitor-source-adapters",
      deploymentTarget: "cloud_run",
    },
  },
  validation: {
    smokePrompt: "Run the Renewal & Expiry Monitor workflow and cite source-system evidence for every claim.",
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

export const RenewalExpiryMonitor = () => (
  <UseCaseSlide
    title="Renewal & Expiry Monitor"
    subtitle="A-1404 • Contract Lifecycle"
    icon={Clock}
    domainId="domain-14"
    layer="Layer 2: ML & Analytics"
    persona="Contract Manager"
    systems={["Icertis", "SAP Ariba Contracts", "SAP S/4HANA", "Vertex AI"]}
    kpis={[
      { label: "Auto-renewal traps caught", before: "30% missed", after: "100% flagged" },
      { label: "Renewal prep time", before: "2-3 weeks", after: "1 day" },
      { label: "Renegotiation savings captured", before: "Ad-hoc", after: "$340K avg/renewal" },
    ]}
    triggerType="scheduled"
    swimlane={swimlane}
    flow={flow}
    architecture={architecture}
    hitl={{ actor: "Contract Manager", action: "Approve renewal strategy", description: "Contract Manager reviews renewal brief with performance data, market benchmarks, and renegotiation recommendations to decide renewal path." }}
    statusQuo={[
      "Contract renewals discovered reactively — auto-renewal clauses trigger before teams can renegotiate.",
      "Renewal decisions made without synthesized supplier performance data or market pricing context.",
      "No systematic identification of leverage opportunities from declining supplier performance or market price drops."
    ]}
    agentification={[
      "Gemini generates renewal briefs synthesizing OTIF trends, market pricing shifts, and contract terms into actionable recommendations.",
      "LLM identifies auto-renewal traps and calculates whether cancellation windows have been missed, with alternative options.",
      "Proactive alerts at 90/60/30 days with renegotiation leverage analysis — 'supplier OTIF dropped to 88%, market prices down 7%'."
    ]}
  />
);
