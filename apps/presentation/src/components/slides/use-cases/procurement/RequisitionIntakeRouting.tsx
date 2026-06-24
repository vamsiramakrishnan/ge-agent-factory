import React from "react";
import { UseCaseSlide } from "../../../agent/UseCaseSlide";
import { FlowStep } from "../../../agent/ProcessFlow";
import { SwimlaneFlow } from "../../../agent/SwimlaneFlow";
import { AgentArchitecture, UseCaseGenerationSpec, AgentBehaviorContract} from "../../../../types/architecture";
import { Inbox, FileText, Brain, Route, CheckCircle } from "lucide-react";

const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "s1", label: "New Requisition", lane: "system", type: "trigger" },
    { id: "a1", label: "NLP Classification", lane: "agent", type: "action" },
    { id: "a2", label: "Intent Resolution", lane: "agent", type: "action" },
    { id: "a3", label: "Smart Routing", lane: "agent", type: "output" },
    { id: "h1", label: "Approver Acts", lane: "human", type: "hitl" },
  ],
  connections: [["s1", "a1"], ["a1", "a2"], ["a2", "a3"], ["a3", "h1"]],
};

const flow: FlowStep[] = [
  { label: "Req Received", icon: FileText, description: "Free-text requisition submitted via SAP ME51N or Coupa portal.", trigger: "Event-driven", systems: ["SAP S/4HANA MM", "Coupa"] },
  { label: "NLP Classify", icon: Brain, description: "Request type, urgency, and compliance flags classified. Duplicates detected via fuzzy matching.", systems: ["Vertex AI", "Oracle"], integration: "ADK" },
  { label: "Intent Resolution", icon: Brain, description: "LLM interprets ambiguous descriptions ('same thing as Chicago project but in blue') and resolves to material/supplier/contract.", systems: ["Vertex AI"] },
  { label: "Routed to Approver", icon: Route, description: "Requisition validated, enriched, and routed through delegation-of-authority matrix.", output: "Enriched Requisition" },
];

const architecture: AgentArchitecture = {
  connections: [
    { system: "SAP S/4HANA MM", description: "Requisition data (ME51N), material master, vendor master, delegation of authority matrix", direction: "bidirectional", protocol: "RFC/BAPI", category: "erp" },
    { system: "Coupa", description: "Requisition portal submissions, catalog items, approval workflow status", direction: "bidirectional", protocol: "REST API", category: "erp" },
    { system: "Oracle ERP", description: "Requisition data from Oracle-based business units", direction: "read", protocol: "REST API", category: "erp" },
    { system: "Vertex AI (Gemini)", description: "NLP classification of request type, intent resolution from free-text descriptions", direction: "bidirectional", protocol: "gRPC", category: "ai" },
    { system: "BigQuery", description: "Historical requisition patterns for duplicate detection and fuzzy matching", direction: "read", protocol: "BigQuery SQL", category: "analytics" },
  ],
  pipeline: [
    { label: "Requisition Ingestion", description: "Receive requisition from SAP ME51N or Coupa portal. Validate field completeness and extract free-text description for downstream NLP processing.", systems: ["SAP S/4HANA MM", "Coupa", "Oracle ERP"], layer: "integration", dataIn: "Raw requisition submission with free-text description", dataOut: "Validated requisition record with extracted fields" },
    { label: "Classification & Duplicate Detection", description: "Classify request type and urgency. Run fuzzy matching against recent requisitions on description, vendor, and amount to detect duplicates and similar requests.", systems: ["BigQuery"], layer: "ml", dataIn: "Validated requisition fields", dataOut: "Request classification, urgency score, duplicate flags" },
    { label: "Intent Resolution & Enrichment", description: "LLM interprets ambiguous free-text descriptions ('need the same thing we ordered last quarter for Chicago but in blue') and resolves to specific material, supplier, and contract. Detects compliance risks — a requisition for 'consulting services' with a named individual flagged as contingent labor.", systems: ["Vertex AI (Gemini)"], layer: "llm", dataIn: "Free-text requisition + historical order context", dataOut: "Enriched requisition with resolved material/supplier/contract" },
    { label: "Smart Routing & Notification", description: "Route enriched requisition through delegation-of-authority matrix to correct approver. Send notifications with SLA tracking.", systems: ["SAP S/4HANA MM", "Coupa"], layer: "integration", dataIn: "Enriched requisition with classification", dataOut: "Routed requisition in approver queue" },
  ],
};


const behaviorContract: AgentBehaviorContract = {
  role: "P2P Operations Manager agent for the Requisition Intake & Smart Routing workflow",
  primaryObjective: "LLM interprets colloquial requisition descriptions and resolves to specific materials, suppliers, and contracts. NLP classification detects compliance risks — 'consulting services' with a named individual flagged as contingent labor. so the P2P Operations Manager can move the Req processing time KPI.",
  inScope: [
    "LLM interprets colloquial requisition descriptions and resolves to specific materials, suppliers, and contracts",
    "NLP classification detects compliance risks — 'consulting services' with a named individual flagged as contingent labor",
    "Smart routing matches against delegation-of-authority matrix with zero manual triage",
  ],
  outOfScope: [
    "Contract execution without legal review",
    "Supplier disqualification decisions (category lead retains authority)",
    "Single-source justification overrides above policy threshold",
  ],
  toolIntents: [
    {
      name: "query_sap_s_4hana_mm_me51n_purchase_orders",
      kind: "query",
      sourceSystemId: "sap_s_4hana_mm_me51n",
      description: "Retrieve purchase orders from SAP S/4HANA MM (ME51N) for the Requisition Intake & Smart Routing workflow.",
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
      description: "Retrieve requisitions from Coupa for the Requisition Intake & Smart Routing workflow.",
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
      name: "query_oracle_oracle_records",
      kind: "query",
      sourceSystemId: "oracle",
      description: "Retrieve oracle records from Oracle for the Requisition Intake & Smart Routing workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "oracle_records_records",
        "oracle_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "lookup_requisition_intake_smart_routing_policy_guide",
      kind: "evidence_lookup",
      sourceSystemId: "sap_s_4hana_mm_me51n",
      description: "Look up sections of the Requisition Intake & Smart Routing Procurement Policy Guide to cite in narrative output, escalation rationale, and audit evidence.",
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
      name: "action_sap_s_4hana_mm_me51n_match",
      kind: "action",
      sourceSystemId: "sap_s_4hana_mm_me51n",
      description: "Execute the match step in SAP S/4HANA MM (ME51N) after the agent has gathered evidence and validated escalation gates.",
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
      claim: "Req processing time moved from 24-48 hours toward <2 hours",
      mustCite: [
        "sap_s_4hana_mm_me51n.purchase_orders",
        "coupa.requisitions",
      ],
      sourceSystemIds: [
        "sap_s_4hana_mm_me51n",
        "coupa",
      ],
    },
    {
      claim: "Routing accuracy moved from 70% first-pass toward 95% first-pass",
      mustCite: [
        "sap_s_4hana_mm_me51n.purchase_orders",
        "coupa.requisitions",
      ],
      sourceSystemIds: [
        "sap_s_4hana_mm_me51n",
        "coupa",
      ],
    },
  ],
  escalationRules: [
    {
      trigger: "Req processing time regresses past the 24-48 hours baseline by more than 20%",
      action: "escalate_to_human",
      handoffTarget: "P2P Operations Manager",
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
    "Never fabricate metric values; only publish numbers derived from SAP S/4HANA MM (ME51N) (and other named systems) entities.",
    "Never bypass P2P Operations Manager approval on escalation triggers, even when confidence is high.",
    "Never expose individual personal data (PII) in summaries; aggregate or pseudonymise before output.",
    "Never act on data older than the staleness threshold defined in the runbook without a fresh re-query.",
  ],
  goldenEvals: [
    {
      id: "requisition-intake-smart-routing-end-to-end",
      prompt: "Run the Requisition Intake & Smart Routing workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.",
      expectedToolCalls: [
        "query_sap_s_4hana_mm_me51n_purchase_orders",
        "query_coupa_requisitions",
        "query_oracle_oracle_records",
        "lookup_requisition_intake_smart_routing_policy_guide",
        "action_sap_s_4hana_mm_me51n_match",
      ],
      mustReferenceEntities: [
        "purchase_orders",
        "requisitions",
        "oracle_records",
      ],
      mustCiteDocuments: [
        "requisition-intake-smart-routing-policy-guide",
      ],
      expectedActionOutcome: "Action match executed against SAP S/4HANA MM (ME51N), with audit-trail entry and P2P Operations Manager notified of outcomes.",
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
    rationale: "Row counts sized for Requisition Intake & Smart Routing so the agent can demonstrate the workflow against realistic transactional volume without simulating a production warehouse.",
  },
  sourceSystems: [
    {
      id: "sap_s_4hana_mm_me51n",
      name: "SAP S/4HANA MM (ME51N)",
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
        "query_sap_s_4hana_mm_me51n_purchase_orders",
        "query_sap_s_4hana_mm_me51n_material_movements",
        "query_sap_s_4hana_mm_me51n_vendors",
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
      id: "oracle",
      name: "Oracle",
      owns: [
        "oracle_records",
        "oracle_events",
        "oracle_audit_trail",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_oracle_oracle_records",
        "query_oracle_oracle_events",
        "query_oracle_oracle_audit_trail",
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
      sourceSystemId: "sap_s_4hana_mm_me51n",
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
      sourceSystemId: "sap_s_4hana_mm_me51n",
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
      sourceSystemId: "sap_s_4hana_mm_me51n",
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
      name: "oracle_records",
      sourceSystemId: "oracle",
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
      name: "oracle_events",
      sourceSystemId: "oracle",
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
          name: "oracle_record_id",
          type: "ref",
          ref: "oracle_records.id",
          required: true,
        },
      ],
    },
    {
      name: "oracle_audit_trail",
      sourceSystemId: "oracle",
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
      from: "oracle_events.oracle_record_id",
      to: "oracle_records.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
  ],
  documents: [
    {
      id: "requisition-intake-smart-routing-policy-guide",
      sourceSystemId: "sap_s_4hana_mm_me51n",
      type: "policy",
      title: "Requisition Intake & Smart Routing Procurement Policy Guide",
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
      id: "sap_s_4hana_mm_me51n_match_api",
      sourceSystemId: "sap_s_4hana_mm_me51n",
      method: "POST",
      path: "/api/sap_s_4hana_mm_me51n/match",
      description: "Synchronous endpoint the agent calls to match in SAP S/4HANA MM (ME51N) after evidence gating.",
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
      id: "requisition-intake-smart-routing-baseline-gap",
      description: "Seed a realistic gap where Req processing time sits between 24-48 hours and <2 hours, so the agent can detect, narrate, and recommend remediation.",
      affectedEntities: [
        "purchase_orders",
        "material_movements",
      ],
      discoveryPath: [
        "Inspect SAP S/4HANA MM (ME51N) records for the affected entities",
        "Compare against Coupa historical baseline",
        "Generate a citation-backed recommendation",
      ],
      expectedEvidence: [
        "source-system record",
        "historical baseline metric",
        "generated audit trail",
      ],
      expectedRecommendation: "Explain the gap, cite supporting evidence, and propose the next P2P Operations Manager action.",
    },
  ],
  datastorePackaging: {
    alloydb: {
      database: "requisition_intake_smart_routing",
      schemas: [
        "sap_s_4hana_mm_me51n",
        "coupa",
        "oracle",
      ],
    },
    bigquery: {
      dataset: "procurement_requisition_intake_smart_routing",
      tables: [
        "kpi_summary",
        "evidence_index",
      ],
    },
    cloudStorage: {
      bucketSuffix: "requisition-intake-smart-routing-evidence",
      prefixes: [
        "documents",
        "audit-trails",
        "exports",
      ],
    },
    apis: {
      serviceName: "requisition-intake-smart-routing-source-adapters",
      deploymentTarget: "cloud_run",
    },
  },
  validation: {
    smokePrompt: "Run the Requisition Intake & Smart Routing workflow and cite source-system evidence for every claim.",
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

export const RequisitionIntakeRouting = () => (
  <UseCaseSlide
    title="Requisition Intake & Smart Routing"
    subtitle="A-1501 • Procure-to-Pay"
    icon={Inbox}
    domainId="domain-15"
    layer="Layer 2: Agent Designer"
    persona="P2P Operations Manager"
    systems={["SAP S/4HANA MM (ME51N)", "Coupa", "Oracle"]}
    kpis={[
      { label: "Req processing time", before: "24-48 hours", after: "<2 hours" },
      { label: "Routing accuracy", before: "70% first-pass", after: "95% first-pass" },
      { label: "Duplicate req rate", before: "8-12%", after: "<2%" },
    ]}
    triggerType="event"
    swimlane={swimlane}
    flow={flow}
    architecture={architecture}
    statusQuo={[
      "Free-text requisitions rejected 30% of the time for incomplete or ambiguous descriptions.",
      "Buyers manually decode requests like 'order more of the blue ones' by calling requesters.",
      "Routing errors send requisitions to wrong approvers, adding 2-3 days to cycle time."
    ]}
    agentification={[
      "LLM interprets colloquial requisition descriptions and resolves to specific materials, suppliers, and contracts.",
      "NLP classification detects compliance risks — 'consulting services' with a named individual flagged as contingent labor.",
      "Smart routing matches against delegation-of-authority matrix with zero manual triage."
    ]}
  />
);
