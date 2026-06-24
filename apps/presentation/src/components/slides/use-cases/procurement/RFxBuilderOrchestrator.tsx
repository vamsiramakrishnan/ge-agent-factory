import React from "react";
import { UseCaseSlide } from "../../../agent/UseCaseSlide";
import { FlowStep } from "../../../agent/ProcessFlow";
import { SwimlaneFlow } from "../../../agent/SwimlaneFlow";
import { AgentArchitecture, UseCaseGenerationSpec, AgentBehaviorContract} from "../../../../types/architecture";
import { FileSpreadsheet, FileText, Brain, Users, CheckCircle } from "lucide-react";

const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "s1", label: "Sourcing Event", lane: "system", type: "trigger" },
    { id: "a1", label: "Requirements Parse", lane: "agent", type: "action" },
    { id: "a2", label: "RFP Generation", lane: "agent", type: "action" },
    { id: "a3", label: "Lifecycle Mgmt", lane: "agent", type: "action" },
    { id: "h1", label: "Sourcing Lead Approves", lane: "human", type: "hitl" },
    { id: "s2", label: "Distributed to Bidders", lane: "system", type: "output" },
  ],
  connections: [["s1", "a1"], ["a1", "a2"], ["a2", "h1"], ["h1", "a3"], ["a3", "s2"]],
};

const flow: FlowStep[] = [
  { label: "Requirements Ingest", icon: FileText, description: "Business requirements document parsed and converted into structured evaluation criteria.", trigger: "Sourcing initiation", systems: ["SAP Ariba Sourcing", "Jaggaer"] },
  { label: "RFP Drafting", icon: Brain, description: "Gemini drafts tailored RFP with category-specific criteria, understanding that 'extreme temperature' means different things for aerospace vs. food processing.", systems: ["Vertex AI"], integration: "ADK" },
  { label: "Sourcing Lead Review", icon: Users, description: "Sourcing Lead validates evaluation criteria, supplier shortlist, and RFP language before distribution.", systems: ["Coupa Sourcing"] },
  { label: "Event Orchestration", icon: FileSpreadsheet, description: "Multi-agent lifecycle management: deadline tracking, Q&A routing, bid collection, and supplier follow-up.", systems: ["Ariba", "Coupa"] },
  { label: "Completion", icon: CheckCircle, description: "All bids collected, normalized, and queued for evaluation agent.", output: "Complete Bid Package" },
];

const architecture: AgentArchitecture = {
  connections: [
    { system: "SAP Ariba Sourcing", description: "RFx templates, supplier shortlists, and bid submission management", direction: "bidirectional", protocol: "REST API", category: "erp" },
    { system: "Jaggaer", description: "Alternative sourcing platform for complex sourcing events", direction: "bidirectional", protocol: "REST API", category: "erp" },
    { system: "Coupa Sourcing", description: "Sourcing event lifecycle management and supplier portal", direction: "bidirectional", protocol: "REST API", category: "erp" },
    { system: "Vertex AI (Gemini)", description: "Requirements parsing, RFP drafting, and clarification question generation", direction: "bidirectional", protocol: "gRPC", category: "ai" },
    { system: "Email / Supplier Portal", description: "RFP distribution, Q&A routing, and bid collection from suppliers", direction: "bidirectional", protocol: "SMTP/REST", category: "collaboration" },
  ],
  pipeline: [
    { label: "Requirements Ingestion", description: "Parse business requirements document from the sourcing team. Pull RFx template from library. Populate header fields from requisition data in Ariba/Coupa/Jaggaer.", systems: ["SAP Ariba Sourcing", "Jaggaer", "Coupa Sourcing"], layer: "integration", dataIn: "Business requirements document + requisition data", dataOut: "Structured requirements + populated RFx template" },
    { label: "Shortlist & Response Prediction", description: "Historical bid response rate prediction for candidate suppliers. Supplier shortlist scoring based on past performance, category fit, and capacity. Lot optimization for multi-lot events.", systems: ["BigQuery ML"], layer: "ml", dataIn: "Supplier performance history + category requirements", dataOut: "Ranked supplier shortlist with response probability scores" },
    { label: "RFP Drafting & Q&A", description: "Gemini reads the requirements document and drafts tailored evaluation criteria — understanding that 'extreme temperature environments' means different things for aerospace vs. food processing. Generates contextual clarification questions when supplier responses are ambiguous.", systems: ["Vertex AI (Gemini)"], layer: "llm", dataIn: "Structured requirements + category context", dataOut: "Complete RFP with tailored criteria and clarification Qs" },
    { label: "Event Orchestration & Distribution", description: "Distribute approved RFP via Ariba/Coupa sourcing portal. Track deadlines and send reminders. Manage Q&A routing between suppliers and sourcing team. Collect and normalize bid responses.", systems: ["SAP Ariba Sourcing", "Coupa Sourcing", "Email"], layer: "integration", dataIn: "Approved RFP + supplier shortlist", dataOut: "Complete bid package with normalized responses" },
  ],
};


const behaviorContract: AgentBehaviorContract = {
  role: "Strategic Sourcing Lead agent for the RFx Builder & Orchestrator workflow",
  primaryObjective: "Gemini reads a 15-page requirements document and drafts tailored evaluation criteria — adapting language to category complexity. LLM generates contextual clarification questions when supplier responses are ambiguous about uptime, SLAs, or capacity commitments. so the Strategic Sourcing Lead can move the RFP creation time KPI.",
  inScope: [
    "Gemini reads a 15-page requirements document and drafts tailored evaluation criteria — adapting language to category complexity",
    "LLM generates contextual clarification questions when supplier responses are ambiguous about uptime, SLAs, or capacity commitments",
    "Multi-agent orchestration automates deadline tracking, Q&A routing, and bid normalization across the full event lifecycle",
  ],
  outOfScope: [
    "Contract execution without legal review",
    "Supplier disqualification decisions (category lead retains authority)",
    "Single-source justification overrides above policy threshold",
  ],
  toolIntents: [
    {
      name: "query_sap_ariba_sourcing_suppliers",
      kind: "query",
      sourceSystemId: "sap_ariba_sourcing",
      description: "Retrieve suppliers from SAP Ariba Sourcing for the RFx Builder & Orchestrator workflow.",
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
      name: "query_jaggaer_supplier_profiles",
      kind: "query",
      sourceSystemId: "jaggaer",
      description: "Retrieve supplier profiles from Jaggaer for the RFx Builder & Orchestrator workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "supplier_profiles_records",
        "supplier_profiles_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_coupa_sourcing_requisitions",
      kind: "query",
      sourceSystemId: "coupa_sourcing",
      description: "Retrieve requisitions from Coupa Sourcing for the RFx Builder & Orchestrator workflow.",
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
      name: "lookup_rfx_builder_orchestrator_policy_guide",
      kind: "evidence_lookup",
      sourceSystemId: "sap_ariba_sourcing",
      description: "Look up sections of the RFx Builder & Orchestrator Procurement Policy Guide to cite in narrative output, escalation rationale, and audit evidence.",
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
      name: "action_sap_ariba_sourcing_generate",
      kind: "action",
      sourceSystemId: "sap_ariba_sourcing",
      description: "Execute the generate step in SAP Ariba Sourcing after the agent has gathered evidence and validated escalation gates.",
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
      claim: "RFP creation time moved from 2-3 weeks toward 2 days",
      mustCite: [
        "sap_ariba_sourcing.suppliers",
        "jaggaer.supplier_profiles",
      ],
      sourceSystemIds: [
        "sap_ariba_sourcing",
        "jaggaer",
      ],
    },
    {
      claim: "Supplier Q&A turnaround moved from 3-5 days toward Same day",
      mustCite: [
        "sap_ariba_sourcing.suppliers",
        "jaggaer.supplier_profiles",
      ],
      sourceSystemIds: [
        "sap_ariba_sourcing",
        "jaggaer",
      ],
    },
  ],
  escalationRules: [
    {
      trigger: "RFP creation time regresses past the 2-3 weeks baseline by more than 20%",
      action: "escalate_to_human",
      handoffTarget: "Strategic Sourcing Lead",
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
    "Never fabricate metric values; only publish numbers derived from SAP Ariba Sourcing (and other named systems) entities.",
    "Never bypass Strategic Sourcing Lead approval on escalation triggers, even when confidence is high.",
    "Never expose individual personal data (PII) in summaries; aggregate or pseudonymise before output.",
    "Never act on data older than the staleness threshold defined in the runbook without a fresh re-query.",
  ],
  goldenEvals: [
    {
      id: "rfx-builder-orchestrator-end-to-end",
      prompt: "Run the RFx Builder & Orchestrator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.",
      expectedToolCalls: [
        "query_sap_ariba_sourcing_suppliers",
        "query_jaggaer_supplier_profiles",
        "query_coupa_sourcing_requisitions",
        "lookup_rfx_builder_orchestrator_policy_guide",
        "action_sap_ariba_sourcing_generate",
      ],
      mustReferenceEntities: [
        "suppliers",
        "supplier_profiles",
        "requisitions",
      ],
      mustCiteDocuments: [
        "rfx-builder-orchestrator-policy-guide",
      ],
      expectedActionOutcome: "Action generate executed against SAP Ariba Sourcing, with audit-trail entry and Strategic Sourcing Lead notified of outcomes.",
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
    rationale: "Row counts sized for RFx Builder & Orchestrator so the agent can demonstrate the workflow against realistic transactional volume without simulating a production warehouse.",
  },
  sourceSystems: [
    {
      id: "sap_ariba_sourcing",
      name: "SAP Ariba Sourcing",
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
        "query_sap_ariba_sourcing_suppliers",
        "query_sap_ariba_sourcing_sourcing_events",
        "query_sap_ariba_sourcing_contracts",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
    {
      id: "jaggaer",
      name: "Jaggaer",
      owns: [
        "supplier_profiles",
        "sourcing_events",
        "scorecards",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_jaggaer_supplier_profiles",
        "query_jaggaer_sourcing_events",
        "query_jaggaer_scorecards",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
    {
      id: "coupa_sourcing",
      name: "Coupa Sourcing",
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
        "query_coupa_sourcing_requisitions",
        "query_coupa_sourcing_purchase_orders",
        "query_coupa_sourcing_invoices",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
  ],
  entities: [
    {
      name: "suppliers",
      sourceSystemId: "sap_ariba_sourcing",
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
      sourceSystemId: "sap_ariba_sourcing",
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
      name: "contracts",
      sourceSystemId: "sap_ariba_sourcing",
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
      name: "supplier_profiles",
      sourceSystemId: "jaggaer",
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
      name: "scorecards",
      sourceSystemId: "jaggaer",
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
      name: "requisitions",
      sourceSystemId: "coupa_sourcing",
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
      name: "purchase_orders",
      sourceSystemId: "coupa_sourcing",
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
      sourceSystemId: "coupa_sourcing",
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
      id: "rfx-builder-orchestrator-policy-guide",
      sourceSystemId: "sap_ariba_sourcing",
      type: "policy",
      title: "RFx Builder & Orchestrator Procurement Policy Guide",
      requiredSections: [
        "Sourcing principles",
        "Approval thresholds",
        "Supplier risk requirements",
        "Contract and compliance gates",
        "Exception handling",
      ],
      linkedEntities: [
        "suppliers",
        "sourcing_events",
        "contracts",
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
      id: "sap_ariba_sourcing_generate_api",
      sourceSystemId: "sap_ariba_sourcing",
      method: "POST",
      path: "/api/sap_ariba_sourcing/generate",
      description: "Synchronous endpoint the agent calls to generate in SAP Ariba Sourcing after evidence gating.",
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
      id: "rfx-builder-orchestrator-baseline-gap",
      description: "Seed a realistic gap where RFP creation time sits between 2-3 weeks and 2 days, so the agent can detect, narrate, and recommend remediation.",
      affectedEntities: [
        "suppliers",
        "sourcing_events",
      ],
      discoveryPath: [
        "Inspect SAP Ariba Sourcing records for the affected entities",
        "Compare against Jaggaer historical baseline",
        "Generate a citation-backed recommendation",
      ],
      expectedEvidence: [
        "source-system record",
        "historical baseline metric",
        "generated audit trail",
      ],
      expectedRecommendation: "Explain the gap, cite supporting evidence, and propose the next Strategic Sourcing Lead action.",
    },
  ],
  datastorePackaging: {
    alloydb: {
      database: "rfx_builder_orchestrator",
      schemas: [
        "sap_ariba_sourcing",
        "jaggaer",
        "coupa_sourcing",
      ],
    },
    bigquery: {
      dataset: "procurement_rfx_builder_orchestrator",
      tables: [
        "kpi_summary",
        "evidence_index",
      ],
    },
    cloudStorage: {
      bucketSuffix: "rfx-builder-orchestrator-evidence",
      prefixes: [
        "documents",
        "audit-trails",
        "exports",
      ],
    },
    apis: {
      serviceName: "rfx-builder-orchestrator-source-adapters",
      deploymentTarget: "cloud_run",
    },
  },
  validation: {
    smokePrompt: "Run the RFx Builder & Orchestrator workflow and cite source-system evidence for every claim.",
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

export const RFxBuilderOrchestrator = () => (
  <UseCaseSlide
    title="RFx Builder & Orchestrator"
    subtitle="A-1204 • Strategic Sourcing"
    icon={FileSpreadsheet}
    domainId="domain-12"
    layer="Layer 3: Custom ADK"
    persona="Strategic Sourcing Lead"
    systems={["SAP Ariba Sourcing", "Jaggaer", "Coupa Sourcing", "Vertex AI"]}
    kpis={[
      { label: "RFP creation time", before: "2-3 weeks", after: "2 days" },
      { label: "Supplier Q&A turnaround", before: "3-5 days", after: "Same day" },
      { label: "Bid response rate", before: "60%", after: "85%" },
    ]}
    triggerType="event"
    swimlane={swimlane}
    flow={flow}
    architecture={architecture}
    hitl={{ actor: "Sourcing Lead", action: "Approve RFx package", description: "Sourcing Lead reviews evaluation criteria, supplier shortlist, and RFP language before distribution to bidders." }}
    statusQuo={[
      "RFPs drafted from scratch or copy-pasted from prior events with stale requirements and irrelevant evaluation criteria.",
      "Supplier Q&A managed via email chains that lose context and create inconsistent responses across bidders.",
      "Sourcing leads spend 40% of their time on event administration rather than strategic supplier engagement."
    ]}
    agentification={[
      "Gemini reads a 15-page requirements document and drafts tailored evaluation criteria — adapting language to category complexity.",
      "LLM generates contextual clarification questions when supplier responses are ambiguous about uptime, SLAs, or capacity commitments.",
      "Multi-agent orchestration automates deadline tracking, Q&A routing, and bid normalization across the full event lifecycle."
    ]}
  />
);
