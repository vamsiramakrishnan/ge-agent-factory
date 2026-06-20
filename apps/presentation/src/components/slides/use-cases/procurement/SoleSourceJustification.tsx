import React from "react";
import { UseCaseSlide } from "../../../agent/UseCaseSlide";
import { FlowStep } from "../../../agent/ProcessFlow";
import { SwimlaneFlow } from "../../../agent/SwimlaneFlow";
import { AgentArchitecture, UseCaseGenerationSpec, AgentBehaviorContract} from "../../../../types/architecture";
import { ShieldAlert, FileText, Search, Brain, CheckCircle } from "lucide-react";

const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "s1", label: "Sole Source Request", lane: "system", type: "trigger" },
    { id: "a1", label: "Market Scan", lane: "agent", type: "action" },
    { id: "a2", label: "Justification Draft", lane: "agent", type: "action" },
    { id: "a3", label: "Challenge Check", lane: "agent", type: "action" },
    { id: "h1", label: "CPO + Compliance", lane: "human", type: "hitl" },
  ],
  connections: [["s1", "a1"], ["a1", "a2"], ["a2", "a3"], ["a3", "h1"]],
};

const flow: FlowStep[] = [
  { label: "Request Intake", icon: FileText, description: "Sole source request received with stated rationale — proprietary tech, regulatory certification, or qualification cost.", trigger: "Sole source request", systems: ["Policy docs"] },
  { label: "Alternative Scan", icon: Search, description: "Supplier databases queried for matching capabilities to validate or challenge the sole-source claim.", systems: ["Supplier databases", "ThomasNet"], integration: "API" },
  { label: "Justification Draft", icon: Brain, description: "Gemini drafts audit-ready memo reasoning through why — not just stating 'no alternatives exist' but explaining proprietary lock-in or certification barriers.", systems: ["Vertex AI"] },
  { label: "CPO Approval", icon: CheckCircle, description: "CPO and Compliance review justification, market scan results, and challenge findings before approval.", output: "Approved Justification" },
];

const architecture: AgentArchitecture = {
  connections: [
    { system: "Policy Documents", description: "Procurement policy requirements for sole-source justification thresholds and criteria", direction: "read", protocol: "RAG Pipeline", category: "collaboration" },
    { system: "Supplier Databases", description: "Capability search across registered and market suppliers", direction: "read", protocol: "REST API", category: "market-data" },
    { system: "ThomasNet", description: "Industrial supplier directory for alternative capability discovery", direction: "read", protocol: "REST API", category: "market-data" },
    { system: "Vertex AI (Gemini)", description: "Justification drafting, claim cross-checking, and challenge reasoning", direction: "bidirectional", protocol: "gRPC", category: "ai" },
  ],
  pipeline: [
    { label: "Request Intake & Policy Check", description: "Receive sole-source request with stated rationale. Pull policy requirements for justification — proprietary technology, regulatory certification, or qualification cost thresholds.", systems: ["Policy Documents"], layer: "integration", dataIn: "Sole-source request with requester's rationale", dataOut: "Policy criteria checklist with required evidence" },
    { label: "Market Alternative Scan", description: "Query supplier databases and ThomasNet for matching capabilities. Assess market competition to validate or challenge the sole-source claim. Score alternative suppliers on capability fit.", systems: ["Supplier Databases", "ThomasNet"], layer: "ml", dataIn: "Required capabilities from sole-source request", dataOut: "Alternative supplier list with capability match scores" },
    { label: "Justification Drafting & Challenge", description: "Gemini drafts audit-ready justification memo reasoning through why no alternatives exist — not just stating it. Cross-checks claims against market scan data. If 4 suppliers have the capability, challenges the sole-source assertion before it reaches the CPO.", systems: ["Vertex AI (Gemini)"], layer: "llm", dataIn: "Market scan results + policy criteria + requester rationale", dataOut: "Audit-ready justification memo or challenge finding" },
  ],
};


const behaviorContract: AgentBehaviorContract = {
  role: "CPO agent for the Sole/Single Source Justification Drafter workflow",
  primaryObjective: "Gemini drafts justifications that meet audit requirements — reasoning through proprietary lock-in, qualification timelines, and regulatory barriers. LLM cross-checks claims against market data: if 4 suppliers have the capability, the agent challenges the sole-source assertion before it reaches the CPO. so the CPO can move the Justification draft time KPI.",
  inScope: [
    "Gemini drafts justifications that meet audit requirements — reasoning through proprietary lock-in, qualification timelines, and regulatory barriers",
    "LLM cross-checks claims against market data: if 4 suppliers have the capability, the agent challenges the sole-source assertion before it reaches the CPO",
    "Prevents rubber-stamping by surfacing alternatives the requester may not have considered or deliberately omitted",
  ],
  outOfScope: [
    "Contract execution without legal review",
    "Supplier disqualification decisions (category lead retains authority)",
    "Single-source justification overrides above policy threshold",
  ],
  toolIntents: [
    {
      name: "query_policy_docs_policy_docs_records",
      kind: "query",
      sourceSystemId: "policy_docs",
      description: "Retrieve policy docs records from Policy docs for the Sole/Single Source Justification Drafter workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "policy_docs_records_records",
        "policy_docs_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_supplier_databases_supplier_databases_records",
      kind: "query",
      sourceSystemId: "supplier_databases",
      description: "Retrieve supplier databases records from Supplier databases for the Sole/Single Source Justification Drafter workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "supplier_databases_records_records",
        "supplier_databases_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_market_research_market_research_records",
      kind: "query",
      sourceSystemId: "market_research",
      description: "Retrieve market research records from Market research for the Sole/Single Source Justification Drafter workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "market_research_records_records",
        "market_research_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "lookup_sole_single_source_justification_drafter_policy_guide",
      kind: "evidence_lookup",
      sourceSystemId: "policy_docs",
      description: "Look up sections of the Sole/Single Source Justification Drafter Procurement Policy Guide to cite in narrative output, escalation rationale, and audit evidence.",
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
      name: "action_policy_docs_draft",
      kind: "action",
      sourceSystemId: "policy_docs",
      description: "Execute the draft step in Policy docs after the agent has gathered evidence and validated escalation gates.",
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
      claim: "Justification draft time moved from 2-3 days toward 2 hours",
      mustCite: [
        "policy_docs.policy_docs_records",
        "supplier_databases.supplier_databases_records",
      ],
      sourceSystemIds: [
        "policy_docs",
        "supplier_databases",
      ],
    },
    {
      claim: "Audit finding rate moved from 15% of justifications toward <3%",
      mustCite: [
        "policy_docs.policy_docs_records",
        "supplier_databases.supplier_databases_records",
      ],
      sourceSystemIds: [
        "policy_docs",
        "supplier_databases",
      ],
    },
  ],
  escalationRules: [
    {
      trigger: "Justification draft time regresses past the 2-3 days baseline by more than 20%",
      action: "escalate_to_human",
      handoffTarget: "CPO",
      rationale: "Significant regressions need human judgment before automated remediation runs against production records.",
    },
    {
      trigger: "Source-system evidence is incomplete or stale (>24h) for any required entity",
      action: "request_more_info",
      rationale: "Recommendations grounded in stale evidence misrepresent current state and undermine audit defensibility.",
    },
    {
      trigger: "Proposed draft action lacks supporting evidence from at least two systems",
      action: "refuse",
      rationale: "Single-system evidence is insufficient to authorize external state changes without manual review.",
    },
  ],
  refusalRules: [
    "Never fabricate metric values; only publish numbers derived from Policy docs (and other named systems) entities.",
    "Never bypass CPO approval on escalation triggers, even when confidence is high.",
    "Never expose individual personal data (PII) in summaries; aggregate or pseudonymise before output.",
    "Never act on data older than the staleness threshold defined in the runbook without a fresh re-query.",
  ],
  goldenEvals: [
    {
      id: "sole-single-source-justification-drafter-end-to-end",
      prompt: "Run the Sole/Single Source Justification Drafter workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.",
      expectedToolCalls: [
        "query_policy_docs_policy_docs_records",
        "query_supplier_databases_supplier_databases_records",
        "query_market_research_market_research_records",
        "lookup_sole_single_source_justification_drafter_policy_guide",
        "action_policy_docs_draft",
      ],
      mustReferenceEntities: [
        "policy_docs_records",
        "supplier_databases_records",
        "market_research_records",
      ],
      mustCiteDocuments: [
        "sole-single-source-justification-drafter-policy-guide",
      ],
      expectedActionOutcome: "Action draft executed against Policy docs, with audit-trail entry and CPO notified of outcomes.",
      forbiddenBehaviors: [
        "do not invent KPI numbers",
        "do not skip the evidence_lookup step before any recommendation",
        "do not execute draft without two-system evidence",
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
    rationale: "Row counts sized for Sole/Single Source Justification Drafter so the agent can demonstrate the workflow against realistic transactional volume without simulating a production warehouse.",
  },
  sourceSystems: [
    {
      id: "policy_docs",
      name: "Policy docs",
      owns: [
        "policy_docs_records",
        "policy_docs_events",
        "policy_docs_audit_trail",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_policy_docs_policy_docs_records",
        "query_policy_docs_policy_docs_events",
        "query_policy_docs_policy_docs_audit_trail",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
    {
      id: "supplier_databases",
      name: "Supplier databases",
      owns: [
        "supplier_databases_records",
        "supplier_databases_events",
        "supplier_databases_audit_trail",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_supplier_databases_supplier_databases_records",
        "query_supplier_databases_supplier_databases_events",
        "query_supplier_databases_supplier_databases_audit_trail",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
    {
      id: "market_research",
      name: "Market research",
      owns: [
        "market_research_records",
        "market_research_events",
        "market_research_audit_trail",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_market_research_market_research_records",
        "query_market_research_market_research_events",
        "query_market_research_market_research_audit_trail",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
  ],
  entities: [
    {
      name: "policy_docs_records",
      sourceSystemId: "policy_docs",
      datastore: "alloydb",
      rowCount: 30,
      primaryKey: "id",
      columns: [
        {
          name: "id",
          type: "seq",
          required: true,
        },
        {
          name: "name",
          type: "lorem.sentence",
          required: true,
        },
        {
          name: "category",
          type: "enum",
          values: [
            "compliance",
            "operational",
            "financial",
            "security",
          ],
          required: true,
        },
        {
          name: "owner",
          type: "person.fullName",
          required: true,
        },
        {
          name: "status",
          type: "enum",
          values: [
            "active",
            "draft",
            "retired",
          ],
          required: true,
        },
        {
          name: "last_updated",
          type: "date",
          required: true,
        },
      ],
    },
    {
      name: "policy_docs_events",
      sourceSystemId: "policy_docs",
      datastore: "alloydb",
      rowCount: 30,
      primaryKey: "id",
      columns: [
        {
          name: "id",
          type: "seq",
          required: true,
        },
        {
          name: "name",
          type: "lorem.sentence",
          required: true,
        },
        {
          name: "category",
          type: "enum",
          values: [
            "compliance",
            "operational",
            "financial",
            "security",
          ],
          required: true,
        },
        {
          name: "owner",
          type: "person.fullName",
          required: true,
        },
        {
          name: "status",
          type: "enum",
          values: [
            "active",
            "draft",
            "retired",
          ],
          required: true,
        },
        {
          name: "last_updated",
          type: "date",
          required: true,
        },
        {
          name: "policy_docs_record_id",
          type: "ref",
          ref: "policy_docs_records.id",
          required: true,
        },
      ],
    },
    {
      name: "policy_docs_audit_trail",
      sourceSystemId: "policy_docs",
      datastore: "alloydb",
      rowCount: 30,
      primaryKey: "id",
      columns: [
        {
          name: "id",
          type: "seq",
          required: true,
        },
        {
          name: "name",
          type: "lorem.sentence",
          required: true,
        },
        {
          name: "category",
          type: "enum",
          values: [
            "compliance",
            "operational",
            "financial",
            "security",
          ],
          required: true,
        },
        {
          name: "owner",
          type: "person.fullName",
          required: true,
        },
        {
          name: "status",
          type: "enum",
          values: [
            "active",
            "draft",
            "retired",
          ],
          required: true,
        },
        {
          name: "last_updated",
          type: "date",
          required: true,
        },
      ],
    },
    {
      name: "supplier_databases_records",
      sourceSystemId: "supplier_databases",
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
      name: "supplier_databases_events",
      sourceSystemId: "supplier_databases",
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
        {
          name: "supplier_databases_record_id",
          type: "ref",
          ref: "supplier_databases_records.id",
          required: true,
        },
      ],
    },
    {
      name: "supplier_databases_audit_trail",
      sourceSystemId: "supplier_databases",
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
      name: "market_research_records",
      sourceSystemId: "market_research",
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
      name: "market_research_events",
      sourceSystemId: "market_research",
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
          name: "market_research_record_id",
          type: "ref",
          ref: "market_research_records.id",
          required: true,
        },
      ],
    },
    {
      name: "market_research_audit_trail",
      sourceSystemId: "market_research",
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
      from: "policy_docs_events.policy_docs_record_id",
      to: "policy_docs_records.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
    {
      from: "supplier_databases_events.supplier_databases_record_id",
      to: "supplier_databases_records.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
    {
      from: "market_research_events.market_research_record_id",
      to: "market_research_records.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
  ],
  documents: [
    {
      id: "sole-single-source-justification-drafter-policy-guide",
      sourceSystemId: "policy_docs",
      type: "policy",
      title: "Sole/Single Source Justification Drafter Procurement Policy Guide",
      requiredSections: [
        "Sourcing principles",
        "Approval thresholds",
        "Supplier risk requirements",
        "Contract and compliance gates",
        "Exception handling",
      ],
      linkedEntities: [
        "policy_docs_records",
        "policy_docs_events",
        "policy_docs_audit_trail",
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
      id: "policy_docs_draft_api",
      sourceSystemId: "policy_docs",
      method: "POST",
      path: "/api/policy_docs/draft",
      description: "Synchronous endpoint the agent calls to draft in Policy docs after evidence gating.",
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
      id: "sole-single-source-justification-drafter-baseline-gap",
      description: "Seed a realistic gap where Justification draft time sits between 2-3 days and 2 hours, so the agent can detect, narrate, and recommend remediation.",
      affectedEntities: [
        "policy_docs_records",
        "policy_docs_events",
      ],
      discoveryPath: [
        "Inspect Policy docs records for the affected entities",
        "Compare against Supplier databases historical baseline",
        "Generate a citation-backed recommendation",
      ],
      expectedEvidence: [
        "source-system record",
        "historical baseline metric",
        "generated audit trail",
      ],
      expectedRecommendation: "Explain the gap, cite supporting evidence, and propose the next CPO action.",
    },
  ],
  datastorePackaging: {
    alloydb: {
      database: "sole_single_source_justification_drafter",
      schemas: [
        "policy_docs",
        "supplier_databases",
        "market_research",
      ],
    },
    bigquery: {
      dataset: "procurement_sole_single_source_justification_drafter",
      tables: [
        "kpi_summary",
        "evidence_index",
      ],
    },
    cloudStorage: {
      bucketSuffix: "sole-single-source-justification-drafter-evidence",
      prefixes: [
        "documents",
        "audit-trails",
        "exports",
      ],
    },
    apis: {
      serviceName: "sole-single-source-justification-drafter-source-adapters",
      deploymentTarget: "cloud_run",
    },
  },
  validation: {
    smokePrompt: "Run the Sole/Single Source Justification Drafter workflow and cite source-system evidence for every claim.",
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

export const SoleSourceJustification = () => (
  <UseCaseSlide
    title="Sole/Single Source Justification Drafter"
    subtitle="A-1209 • Strategic Sourcing"
    icon={ShieldAlert}
    domainId="domain-12"
    layer="Layer 1: OOTB"
    persona="CPO"
    systems={["Policy docs", "Supplier databases", "Market research", "Vertex AI"]}
    kpis={[
      { label: "Justification draft time", before: "2-3 days", after: "2 hours" },
      { label: "Audit finding rate", before: "15% of justifications", after: "<3%" },
      { label: "False sole-source claims caught", before: "Rarely challenged", after: "28% redirected to competitive bid" },
    ]}
    triggerType="event"
    swimlane={swimlane}
    flow={flow}
    architecture={architecture}
    hitl={{ actor: "CPO + Compliance", action: "Approve sole source justification", description: "CPO and Compliance Officer review the justification memo, market scan evidence, and challenge results before granting sole-source approval." }}
    statusQuo={[
      "Sole-source justifications are rubber-stamped narratives that state 'no alternatives exist' without evidence or market validation.",
      "Requesters know the right words to use ('proprietary technology') without genuine analysis of whether alternatives exist.",
      "Audit findings on sole-source approvals are a recurring compliance risk with limited preventive controls."
    ]}
    agentification={[
      "Gemini drafts justifications that meet audit requirements — reasoning through proprietary lock-in, qualification timelines, and regulatory barriers.",
      "LLM cross-checks claims against market data: if 4 suppliers have the capability, the agent challenges the sole-source assertion before it reaches the CPO.",
      "Prevents rubber-stamping by surfacing alternatives the requester may not have considered or deliberately omitted."
    ]}
  />
);
