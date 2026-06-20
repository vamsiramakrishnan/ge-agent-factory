import React from "react";
import { UseCaseSlide } from "../../../agent/UseCaseSlide";
import { FlowStep } from "../../../agent/ProcessFlow";
import { SwimlaneFlow } from "../../../agent/SwimlaneFlow";
import { AgentArchitecture, UseCaseGenerationSpec, AgentBehaviorContract} from "../../../../types/architecture";
import { FileText, Database, Globe, Scale, CheckCircle } from "lucide-react";

const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "s1", label: "Award Decision", lane: "system", type: "trigger" },
    { id: "a1", label: "Template Selection", lane: "agent", type: "action" },
    { id: "a2", label: "Clause Drafting", lane: "agent", type: "action" },
    { id: "a3", label: "Jurisdiction Adapt", lane: "agent", type: "action" },
    { id: "a4", label: "Contract Draft", lane: "agent", type: "output" },
    { id: "h1", label: "Legal Reviews", lane: "human", type: "hitl" },
  ],
  connections: [["s1", "a1"], ["a1", "a2"], ["a2", "a3"], ["a3", "a4"], ["a4", "h1"]],
};

const flow: FlowStep[] = [
  { label: "Award Ingest", icon: Database, description: "Supplier, pricing, and negotiated terms pulled from sourcing system.", trigger: "Event", systems: ["SAP Ariba Contracts", "Icertis"] },
  { label: "Template & Clause", icon: Globe, description: "Contract template selected by type/risk tier; clause library populated with deal-specific terms.", systems: ["Icertis", "Agiloft"] },
  { label: "Jurisdiction Adapt", icon: Scale, description: "LLM adapts clause language to jurisdiction — UCC vs. BGB warranty provisions, local regulatory requirements.", systems: ["Vertex AI", "DocuSign CLM"], integration: "ADK" },
  { label: "Legal Approval", icon: CheckCircle, description: "Legal counsel validates non-standard clauses, scope descriptions, and termination provisions.", output: "Executed Contract" },
];

const architecture: AgentArchitecture = {
  connections: [
    { system: "Icertis", description: "Contract templates, clause library, deal metadata", direction: "bidirectional", protocol: "REST API", category: "clm" },
    { system: "DocuSign CLM", description: "Document assembly, e-signature routing", direction: "write", protocol: "REST API", category: "clm" },
    { system: "Agiloft", description: "Clause library lookup, template version control", direction: "read", protocol: "REST API", category: "clm" },
    { system: "SAP Ariba Contracts", description: "Award data — supplier, pricing, negotiated terms", direction: "read", protocol: "REST API", category: "erp" },
    { system: "Vertex AI (Gemini)", description: "Clause drafting, jurisdiction adaptation, scope of work generation", direction: "bidirectional", protocol: "gRPC", category: "ai" },
  ],
  pipeline: [
    { label: "Award Data Ingestion", description: "Pull award decision data — supplier details, negotiated pricing, terms, and risk tier — from sourcing system. Select appropriate contract template from CLM based on contract type, value, and jurisdiction.", systems: ["SAP Ariba Contracts", "Icertis"], layer: "integration", dataIn: "Award decision with supplier, pricing, terms", dataOut: "Template + populated header fields" },
    { label: "Template & Risk Classification", description: "Classify contract by type/value/risk tier to select correct template. Predict historical cycle time for this contract profile and flag non-standard deal structures.", systems: ["Icertis", "Agiloft"], layer: "ml", dataIn: "Contract type, value, risk tier", dataOut: "Selected template with risk-tier classification" },
    { label: "Contextual Clause Drafting", description: "Gemini drafts contract sections requiring contextual judgment — scope of work reflecting negotiated deal, performance standards mapped to supplier KPIs, termination provisions calibrated to strategic importance. Adapts clause language to jurisdiction: UCC vs. BGB warranty provisions.", systems: ["Vertex AI (Gemini)"], layer: "llm", dataIn: "Template + award data + jurisdiction context", dataOut: "Review-ready contract draft with flagged trade-offs" },
    { label: "Review Routing & Assembly", description: "Assembled contract document routed to legal counsel for review via CLM workflow. Non-standard clauses highlighted for priority attention.", systems: ["DocuSign CLM", "Icertis"], layer: "integration", dataIn: "Draft contract with flagged sections", dataOut: "Routed contract for legal review" },
  ],
};


const behaviorContract: AgentBehaviorContract = {
  role: "Contract Manager agent for the Contract Authoring Agent workflow",
  primaryObjective: "Gemini drafts contextual scope of work, performance standards mapped to supplier KPIs, and jurisdiction-adapted clauses. LLM reasons about which template fits non-standard deal structures and adapts clause language automatically. so the Contract Manager can move the Draft creation time KPI.",
  inScope: [
    "Gemini drafts contextual scope of work, performance standards mapped to supplier KPIs, and jurisdiction-adapted clauses",
    "LLM reasons about which template fits non-standard deal structures and adapts clause language automatically",
    "Generates review-ready contracts with trade-offs flagged, not boilerplate dumps requiring full legal markup",
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
      description: "Retrieve contracts from Icertis for the Contract Authoring Agent workflow.",
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
      name: "query_docusign_clm_contracts",
      kind: "query",
      sourceSystemId: "docusign_clm",
      description: "Retrieve contracts from DocuSign CLM for the Contract Authoring Agent workflow.",
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
      name: "query_agiloft_agiloft_records",
      kind: "query",
      sourceSystemId: "agiloft",
      description: "Retrieve agiloft records from Agiloft for the Contract Authoring Agent workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "agiloft_records_records",
        "agiloft_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_sap_ariba_contracts_suppliers",
      kind: "query",
      sourceSystemId: "sap_ariba_contracts",
      description: "Retrieve suppliers from SAP Ariba Contracts for the Contract Authoring Agent workflow.",
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
      name: "lookup_contract_authoring_agent_policy_guide",
      kind: "evidence_lookup",
      sourceSystemId: "icertis",
      description: "Look up sections of the Contract Authoring Agent Procurement Policy Guide to cite in narrative output, escalation rationale, and audit evidence.",
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
      name: "action_icertis_generate",
      kind: "action",
      sourceSystemId: "icertis",
      description: "Execute the generate step in Icertis after the agent has gathered evidence and validated escalation gates.",
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
      claim: "Draft creation time moved from 3-5 days toward 2 hours",
      mustCite: [
        "icertis.contracts",
        "docusign_clm.contracts",
      ],
      sourceSystemIds: [
        "icertis",
        "docusign_clm",
      ],
    },
    {
      claim: "Clause accuracy rate moved from 70% first-pass toward 95% first-pass",
      mustCite: [
        "icertis.contracts",
        "docusign_clm.contracts",
      ],
      sourceSystemIds: [
        "icertis",
        "docusign_clm",
      ],
    },
  ],
  escalationRules: [
    {
      trigger: "Draft creation time regresses past the 3-5 days baseline by more than 20%",
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
      trigger: "Proposed generate action lacks supporting evidence from at least two systems",
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
      id: "contract-authoring-agent-end-to-end",
      prompt: "Run the Contract Authoring Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.",
      expectedToolCalls: [
        "query_icertis_contracts",
        "query_docusign_clm_contracts",
        "query_agiloft_agiloft_records",
        "query_sap_ariba_contracts_suppliers",
        "lookup_contract_authoring_agent_policy_guide",
        "action_icertis_generate",
      ],
      mustReferenceEntities: [
        "contracts",
        "contracts",
        "agiloft_records",
        "suppliers",
      ],
      mustCiteDocuments: [
        "contract-authoring-agent-policy-guide",
      ],
      expectedActionOutcome: "Action generate executed against Icertis, with audit-trail entry and Contract Manager notified of outcomes.",
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
    rationale: "Row counts sized for Contract Authoring Agent so the agent can demonstrate the workflow against realistic transactional volume without simulating a production warehouse.",
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
      id: "docusign_clm",
      name: "DocuSign CLM",
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
        "query_docusign_clm_contracts",
        "query_docusign_clm_amendments",
        "query_docusign_clm_obligations",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
    {
      id: "agiloft",
      name: "Agiloft",
      owns: [
        "agiloft_records",
        "agiloft_events",
        "agiloft_audit_trail",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_agiloft_agiloft_records",
        "query_agiloft_agiloft_events",
        "query_agiloft_agiloft_audit_trail",
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
      name: "agiloft_records",
      sourceSystemId: "agiloft",
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
      name: "agiloft_events",
      sourceSystemId: "agiloft",
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
          name: "agiloft_record_id",
          type: "ref",
          ref: "agiloft_records.id",
          required: true,
        },
      ],
    },
    {
      name: "agiloft_audit_trail",
      sourceSystemId: "agiloft",
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
  ],
  relationships: [
    {
      from: "agiloft_events.agiloft_record_id",
      to: "agiloft_records.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
    {
      from: "sourcing_events.supplier_id",
      to: "suppliers.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
  ],
  documents: [
    {
      id: "contract-authoring-agent-policy-guide",
      sourceSystemId: "icertis",
      type: "policy",
      title: "Contract Authoring Agent Procurement Policy Guide",
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
      id: "icertis_generate_api",
      sourceSystemId: "icertis",
      method: "POST",
      path: "/api/icertis/generate",
      description: "Synchronous endpoint the agent calls to generate in Icertis after evidence gating.",
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
      id: "contract-authoring-agent-baseline-gap",
      description: "Seed a realistic gap where Draft creation time sits between 3-5 days and 2 hours, so the agent can detect, narrate, and recommend remediation.",
      affectedEntities: [
        "contracts",
        "amendments",
      ],
      discoveryPath: [
        "Inspect Icertis records for the affected entities",
        "Compare against DocuSign CLM historical baseline",
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
      database: "contract_authoring_agent",
      schemas: [
        "icertis",
        "docusign_clm",
        "agiloft",
        "sap_ariba_contracts",
      ],
    },
    bigquery: {
      dataset: "procurement_contract_authoring_agent",
      tables: [
        "kpi_summary",
        "evidence_index",
      ],
    },
    cloudStorage: {
      bucketSuffix: "contract-authoring-agent-evidence",
      prefixes: [
        "documents",
        "audit-trails",
        "exports",
      ],
    },
    apis: {
      serviceName: "contract-authoring-agent-source-adapters",
      deploymentTarget: "cloud_run",
    },
  },
  validation: {
    smokePrompt: "Run the Contract Authoring Agent workflow and cite source-system evidence for every claim.",
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

export const ContractAuthoringAgent = () => (
  <UseCaseSlide
    title="Contract Authoring Agent"
    subtitle="A-1401 • Contract Lifecycle"
    icon={FileText}
    domainId="domain-14"
    layer="Layer 3: Custom ADK"
    persona="Contract Manager"
    systems={["Icertis", "DocuSign CLM", "Agiloft", "SAP Ariba Contracts", "Vertex AI"]}
    kpis={[
      { label: "Draft creation time", before: "3-5 days", after: "2 hours" },
      { label: "Clause accuracy rate", before: "70% first-pass", after: "95% first-pass" },
      { label: "Jurisdiction errors", before: "8-12% of drafts", after: "<1%" },
    ]}
    triggerType="event"
    swimlane={swimlane}
    flow={flow}
    architecture={architecture}
    hitl={{ actor: "Legal Counsel", action: "Review contract draft", description: "Legal validates non-standard clauses, scope of work descriptions, and termination provisions calibrated to the relationship's strategic importance." }}
    statusQuo={[
      "Contract drafting starts from templates that are manually adapted, missing jurisdiction-specific nuances.",
      "Scope of work sections copy-pasted from previous deals without reflecting negotiated terms.",
      "Non-standard deal structures require days of back-and-forth between legal and procurement."
    ]}
    agentification={[
      "Gemini drafts contextual scope of work, performance standards mapped to supplier KPIs, and jurisdiction-adapted clauses.",
      "LLM reasons about which template fits non-standard deal structures and adapts clause language automatically.",
      "Generates review-ready contracts with trade-offs flagged, not boilerplate dumps requiring full legal markup."
    ]}
  />
);
