import React from "react";
import { UseCaseSlide } from "../../../agent/UseCaseSlide";
import { FlowStep } from "../../../agent/ProcessFlow";
import { SwimlaneFlow } from "../../../agent/SwimlaneFlow";
import { AgentArchitecture, UseCaseGenerationSpec, AgentBehaviorContract} from "../../../../types/architecture";
import { FileOutput, CheckCircle, Link, Brain, Send } from "lucide-react";

const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "s1", label: "Req Approved", lane: "system", type: "trigger" },
    { id: "a1", label: "Contract Matching", lane: "agent", type: "action" },
    { id: "a2", label: "PO Generation", lane: "agent", type: "action" },
    { id: "a3", label: "Supplier Transmit", lane: "agent", type: "output" },
  ],
  connections: [["s1", "a1"], ["a1", "a2"], ["a2", "a3"]],
};

const flow: FlowStep[] = [
  { label: "Req Approved", icon: CheckCircle, description: "Approved requisition received with validated material, quantity, and delivery details.", trigger: "Event-driven", systems: ["SAP S/4HANA MM"] },
  { label: "Contract Match", icon: Link, description: "Requisition mapped to correct contract with best price, nearest warehouse, and available capacity.", systems: ["Coupa", "Ariba"], integration: "ADK" },
  { label: "SOW Interpretation", icon: Brain, description: "For non-standard requests, LLM maps to the correct SOW under staffing MSA with proper billing rate and work location.", systems: ["Vertex AI"] },
  { label: "PO Transmitted", icon: Send, description: "Purchase order generated in ERP and transmitted to supplier via EDI, portal, or email.", output: "Purchase Order" },
];

const architecture: AgentArchitecture = {
  connections: [
    { system: "SAP S/4HANA MM", description: "PO creation (ME21N), material master, pricing conditions, contract reference", direction: "bidirectional", protocol: "RFC/BAPI", category: "erp" },
    { system: "Coupa", description: "Approved requisitions, catalog items, contract matching rules", direction: "read", protocol: "REST API", category: "erp" },
    { system: "SAP Ariba", description: "Contract pricing, supplier portal for PO transmission and acknowledgment", direction: "bidirectional", protocol: "REST API", category: "erp" },
    { system: "Vertex AI (Gemini)", description: "SOW interpretation for non-standard service requests, contract-to-requisition mapping for ambiguous cases", direction: "bidirectional", protocol: "gRPC", category: "ai" },
    { system: "EDI/Supplier Portal", description: "PO transmission to suppliers via EDI, cXML, or email; acknowledgment tracking", direction: "write", protocol: "EDI/cXML", category: "collaboration" },
  ],
  pipeline: [
    { label: "Requisition-to-Contract Matching", description: "Map approved requisition to the correct contract considering best price, nearest warehouse, and available capacity. For multiple eligible contracts, ML scoring selects the optimal match.", systems: ["SAP S/4HANA MM", "Coupa", "SAP Ariba"], layer: "integration", dataIn: "Approved requisition with material/service details", dataOut: "Matched contract with pricing and delivery terms" },
    { label: "Contract Scoring & Price Validation", description: "When multiple contracts could apply, score options on price, warehouse proximity, and capacity. Validate PO price against master agreement tolerances to prevent pricing errors.", systems: ["SAP Ariba", "Coupa"], layer: "ml", dataIn: "Candidate contracts for requisition", dataOut: "Optimal contract selection with validated pricing" },
    { label: "Non-Standard Request Interpretation", description: "For requests that don't map cleanly to catalog items — such as 'engineering support, 3 months, 2 FTEs, on-site at Building 7' — LLM interprets and maps to the correct SOW under the staffing MSA with the right billing rate and work location code.", systems: ["Vertex AI (Gemini)"], layer: "llm", dataIn: "Free-text service requisition + MSA/SOW library", dataOut: "Resolved SOW reference with billing rate and location" },
    { label: "PO Generation & Transmission", description: "Generate PO in ERP with proper pricing, terms, and contract reference. Transmit to supplier via EDI, portal, or email. Confirm supplier acknowledgment.", systems: ["SAP S/4HANA MM", "EDI/Supplier Portal"], layer: "integration", dataIn: "Validated contract match + requisition details", dataOut: "Transmitted purchase order with acknowledgment" },
  ],
};


const behaviorContract: AgentBehaviorContract = {
  role: "Buyer agent for the Purchase Order Auto-Generation workflow",
  primaryObjective: "Integration layer auto-matches requisitions to contracts with best price, nearest warehouse, and available capacity. LLM interprets non-standard requests ('engineering support — 3 months, 2 FTEs, on-site') and maps to correct SOW and billing rates. so the Buyer can move the Touchless PO rate KPI.",
  inScope: [
    "Integration layer auto-matches requisitions to contracts with best price, nearest warehouse, and available capacity",
    "LLM interprets non-standard requests ('engineering support — 3 months, 2 FTEs, on-site') and maps to correct SOW and billing rates",
    "Straight-through processing for catalog and contract POs with zero buyer intervention",
  ],
  outOfScope: [
    "Contract execution without legal review",
    "Supplier disqualification decisions (category lead retains authority)",
    "Single-source justification overrides above policy threshold",
  ],
  toolIntents: [
    {
      name: "query_sap_s_4hana_mm_me21n_purchase_orders",
      kind: "query",
      sourceSystemId: "sap_s_4hana_mm_me21n",
      description: "Retrieve purchase orders from SAP S/4HANA MM (ME21N) for the Purchase Order Auto-Generation workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "purchase_orders_records",
        "purchase_orders_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_coupa_requisitions",
      kind: "query",
      sourceSystemId: "coupa",
      description: "Retrieve requisitions from Coupa for the Purchase Order Auto-Generation workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "requisitions_records",
        "requisitions_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_ariba_ariba_records",
      kind: "query",
      sourceSystemId: "ariba",
      description: "Retrieve ariba records from Ariba for the Purchase Order Auto-Generation workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "ariba_records_records",
        "ariba_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "lookup_purchase_order_auto_generation_policy_guide",
      kind: "evidence_lookup",
      sourceSystemId: "sap_s_4hana_mm_me21n",
      description: "Look up sections of the Purchase Order Auto-Generation Procurement Policy Guide to cite in narrative output, escalation rationale, and audit evidence.",
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
      name: "action_sap_s_4hana_mm_me21n_match",
      kind: "action",
      sourceSystemId: "sap_s_4hana_mm_me21n",
      description: "Execute the match step in SAP S/4HANA MM (ME21N) after the agent has gathered evidence and validated escalation gates.",
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
      claim: "Touchless PO rate moved from 15-20% toward 85%",
      mustCite: [
        "sap_s_4hana_mm_me21n.purchase_orders",
        "coupa.requisitions",
      ],
      sourceSystemIds: [
        "sap_s_4hana_mm_me21n",
        "coupa",
      ],
    },
    {
      claim: "PO cycle time moved from 4-8 hours toward <15 minutes",
      mustCite: [
        "sap_s_4hana_mm_me21n.purchase_orders",
        "coupa.requisitions",
      ],
      sourceSystemIds: [
        "sap_s_4hana_mm_me21n",
        "coupa",
      ],
    },
  ],
  escalationRules: [
    {
      trigger: "Touchless PO rate regresses past the 15-20% baseline by more than 20%",
      action: "escalate_to_human",
      handoffTarget: "Buyer",
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
    "Never fabricate metric values; only publish numbers derived from SAP S/4HANA MM (ME21N) (and other named systems) entities.",
    "Never bypass Buyer approval on escalation triggers, even when confidence is high.",
    "Never expose individual personal data (PII) in summaries; aggregate or pseudonymise before output.",
    "Never act on data older than the staleness threshold defined in the runbook without a fresh re-query.",
  ],
  goldenEvals: [
    {
      id: "purchase-order-auto-generation-end-to-end",
      prompt: "Run the Purchase Order Auto-Generation workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.",
      expectedToolCalls: [
        "query_sap_s_4hana_mm_me21n_purchase_orders",
        "query_coupa_requisitions",
        "query_ariba_ariba_records",
        "lookup_purchase_order_auto_generation_policy_guide",
        "action_sap_s_4hana_mm_me21n_match",
      ],
      mustReferenceEntities: [
        "purchase_orders",
        "requisitions",
        "ariba_records",
      ],
      mustCiteDocuments: [
        "purchase-order-auto-generation-policy-guide",
      ],
      expectedActionOutcome: "Action match executed against SAP S/4HANA MM (ME21N), with audit-trail entry and Buyer notified of outcomes.",
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
    rationale: "Row counts sized for Purchase Order Auto-Generation so the agent can demonstrate the workflow against realistic transactional volume without simulating a production warehouse.",
  },
  sourceSystems: [
    {
      id: "sap_s_4hana_mm_me21n",
      name: "SAP S/4HANA MM (ME21N)",
      owns: [
        "purchase_orders",
        "material_movements",
        "vendors",
      ],
      protocol: "RFC/BAPI",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_sap_s_4hana_mm_me21n_purchase_orders",
        "query_sap_s_4hana_mm_me21n_material_movements",
        "query_sap_s_4hana_mm_me21n_vendors",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
    {
      id: "coupa",
      name: "Coupa",
      owns: [
        "requisitions",
        "purchase_orders",
        "invoices",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_coupa_requisitions",
        "query_coupa_purchase_orders",
        "query_coupa_invoices",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
    {
      id: "ariba",
      name: "Ariba",
      owns: [
        "ariba_records",
        "ariba_events",
        "ariba_audit_trail",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_ariba_ariba_records",
        "query_ariba_ariba_events",
        "query_ariba_ariba_audit_trail",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
  ],
  entities: [
    {
      name: "purchase_orders",
      sourceSystemId: "sap_s_4hana_mm_me21n",
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
      name: "material_movements",
      sourceSystemId: "sap_s_4hana_mm_me21n",
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
      name: "vendors",
      sourceSystemId: "sap_s_4hana_mm_me21n",
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
      name: "requisitions",
      sourceSystemId: "coupa",
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
      name: "invoices",
      sourceSystemId: "coupa",
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
      name: "ariba_records",
      sourceSystemId: "ariba",
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
      name: "ariba_events",
      sourceSystemId: "ariba",
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
          name: "ariba_record_id",
          type: "ref",
          ref: "ariba_records.id",
          required: true,
        },
      ],
    },
    {
      name: "ariba_audit_trail",
      sourceSystemId: "ariba",
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
  ],
  relationships: [
    {
      from: "ariba_events.ariba_record_id",
      to: "ariba_records.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
  ],
  documents: [
    {
      id: "purchase-order-auto-generation-policy-guide",
      sourceSystemId: "sap_s_4hana_mm_me21n",
      type: "policy",
      title: "Purchase Order Auto-Generation Procurement Policy Guide",
      requiredSections: [
        "Sourcing principles",
        "Approval thresholds",
        "Supplier risk requirements",
        "Contract and compliance gates",
        "Exception handling",
      ],
      linkedEntities: [
        "purchase_orders",
        "material_movements",
        "vendors",
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
      id: "sap_s_4hana_mm_me21n_match_api",
      sourceSystemId: "sap_s_4hana_mm_me21n",
      method: "POST",
      path: "/api/sap_s_4hana_mm_me21n/match",
      description: "Synchronous endpoint the agent calls to match in SAP S/4HANA MM (ME21N) after evidence gating.",
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
      id: "purchase-order-auto-generation-baseline-gap",
      description: "Seed a realistic gap where Touchless PO rate sits between 15-20% and 85%, so the agent can detect, narrate, and recommend remediation.",
      affectedEntities: [
        "purchase_orders",
        "material_movements",
      ],
      discoveryPath: [
        "Inspect SAP S/4HANA MM (ME21N) records for the affected entities",
        "Compare against Coupa historical baseline",
        "Generate a citation-backed recommendation",
      ],
      expectedEvidence: [
        "source-system record",
        "historical baseline metric",
        "generated audit trail",
      ],
      expectedRecommendation: "Explain the gap, cite supporting evidence, and propose the next Buyer action.",
    },
  ],
  datastorePackaging: {
    alloydb: {
      database: "purchase_order_auto_generation",
      schemas: [
        "sap_s_4hana_mm_me21n",
        "coupa",
        "ariba",
      ],
    },
    bigquery: {
      dataset: "procurement_purchase_order_auto_generation",
      tables: [
        "kpi_summary",
        "evidence_index",
      ],
    },
    cloudStorage: {
      bucketSuffix: "purchase-order-auto-generation-evidence",
      prefixes: [
        "documents",
        "audit-trails",
        "exports",
      ],
    },
    apis: {
      serviceName: "purchase-order-auto-generation-source-adapters",
      deploymentTarget: "cloud_run",
    },
  },
  validation: {
    smokePrompt: "Run the Purchase Order Auto-Generation workflow and cite source-system evidence for every claim.",
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

export const PurchaseOrderAutoGeneration = () => (
  <UseCaseSlide
    title="Purchase Order Auto-Generation"
    subtitle="A-1502 • Procure-to-Pay"
    icon={FileOutput}
    domainId="domain-15"
    layer="Layer 2: Agent Designer"
    persona="Buyer"
    systems={["SAP S/4HANA MM (ME21N)", "Coupa", "Ariba"]}
    kpis={[
      { label: "Touchless PO rate", before: "15-20%", after: "85%" },
      { label: "PO cycle time", before: "4-8 hours", after: "<15 minutes" },
      { label: "Contract leakage", before: "18% off-contract", after: "<3% off-contract" },
    ]}
    triggerType="event"
    swimlane={swimlane}
    flow={flow}
    architecture={architecture}
    statusQuo={[
      "Buyers manually look up contracts, verify pricing, and key PO data into SAP for each requisition.",
      "Non-standard service requests sit in buyer queues for days awaiting SOW interpretation.",
      "Contract-to-PO mapping errors cause pricing mismatches caught only at invoice stage."
    ]}
    agentification={[
      "Integration layer auto-matches requisitions to contracts with best price, nearest warehouse, and available capacity.",
      "LLM interprets non-standard requests ('engineering support — 3 months, 2 FTEs, on-site') and maps to correct SOW and billing rates.",
      "Straight-through processing for catalog and contract POs with zero buyer intervention."
    ]}
  />
);
