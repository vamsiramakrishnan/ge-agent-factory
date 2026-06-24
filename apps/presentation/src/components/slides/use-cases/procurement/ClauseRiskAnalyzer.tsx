import React from "react";
import { UseCaseSlide } from "../../../agent/UseCaseSlide";
import { FlowStep } from "../../../agent/ProcessFlow";
import { SwimlaneFlow } from "../../../agent/SwimlaneFlow";
import { AgentArchitecture, UseCaseGenerationSpec, AgentBehaviorContract} from "../../../../types/architecture";
import { Shield, FileInput, Search, AlertTriangle, CheckCircle } from "lucide-react";

const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "s1", label: "Redline Received", lane: "system", type: "trigger" },
    { id: "a1", label: "Clause Extraction", lane: "agent", type: "action" },
    { id: "a2", label: "Cross-Ref Analysis", lane: "agent", type: "action" },
    { id: "a3", label: "Risk Report", lane: "agent", type: "output" },
    { id: "h1", label: "Counsel Reviews", lane: "human", type: "hitl" },
  ],
  connections: [["s1", "a1"], ["a1", "a2"], ["a2", "a3"], ["a3", "h1"]],
};

const flow: FlowStep[] = [
  { label: "Document Ingest", icon: FileInput, description: "Redlined or counterparty draft received and parsed into clause segments.", trigger: "Event", systems: ["Icertis", "DocuSign CLM"] },
  { label: "Clause Extraction", icon: Search, description: "NLP identifies clause boundaries, classifies sections, and scores deviations against legal playbook.", systems: ["Vertex AI"] },
  { label: "Cross-Ref Risk", icon: AlertTriangle, description: "LLM detects interaction risks — uncapped consequential damages combined with broad indemnification three pages apart.", systems: ["Vertex AI"], integration: "ADK" },
  { label: "Counsel Decision", icon: CheckCircle, description: "Legal counsel reviews risk report with accept/reject recommendations and business impact explanations.", output: "Risk Assessment" },
];

const architecture: AgentArchitecture = {
  connections: [
    { system: "Icertis", description: "Redlined documents, clause library, contract metadata", direction: "read", protocol: "REST API", category: "clm" },
    { system: "DocuSign CLM", description: "Counterparty draft ingestion, document versioning", direction: "read", protocol: "REST API", category: "clm" },
    { system: "Legal Playbook", description: "Standard clause positions, acceptable deviation thresholds", direction: "read", protocol: "REST API", category: "clm" },
    { system: "Vertex AI (Gemini)", description: "Cross-clause interaction analysis, semantic deviation detection, risk narrative generation", direction: "bidirectional", protocol: "gRPC", category: "ai" },
  ],
  pipeline: [
    { label: "Document Ingestion & Parsing", description: "Receive redlined or counterparty draft from CLM. Parse document into clause-level segments with boundary detection and section classification.", systems: ["Icertis", "DocuSign CLM"], layer: "integration", dataIn: "Redlined contract document", dataOut: "Clause-segmented document with section labels" },
    { label: "Deviation Scoring", description: "Score each clause against legal playbook thresholds. Classify deviation severity using historical negotiation outcome data and standard position comparison.", systems: ["Legal Playbook"], layer: "ml", dataIn: "Extracted clauses + playbook standards", dataOut: "Deviation scores with severity classification" },
    { label: "Cross-Clause Risk Reasoning", description: "Gemini detects interaction risks invisible to keyword search — uncapped consequential damages combined with broad indemnification, 180-day termination notice creating lock-in, Force Majeure clauses intentionally excluding pandemics. Explains business impact of each deviation.", systems: ["Vertex AI (Gemini)"], layer: "llm", dataIn: "Clause segments + deviation scores + playbook", dataOut: "Risk report with accept/reject recommendations ranked by business impact" },
  ],
};


const behaviorContract: AgentBehaviorContract = {
  role: "Legal Procurement Counsel agent for the Clause Risk Analyzer workflow",
  primaryObjective: "Gemini understands that uncapped 'consequential damages' combined with broad indemnification creates compounding liability exposure. LLM detects semantic deviations — recognizing that 'commercially reasonable efforts' is a meaningful reduction from 'best efforts'. so the Legal Procurement Counsel can move the Risk detection rate KPI.",
  inScope: [
    "Gemini understands that uncapped 'consequential damages' combined with broad indemnification creates compounding liability exposure",
    "LLM detects semantic deviations — recognizing that 'commercially reasonable efforts' is a meaningful reduction from 'best efforts'",
    "Generates risk reports ranked by business impact, not just clause-level deviations, with recommended negotiation positions",
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
      description: "Retrieve contracts from Icertis for the Clause Risk Analyzer workflow.",
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
      description: "Retrieve contracts from DocuSign CLM for the Clause Risk Analyzer workflow.",
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
      name: "query_legal_playbook_legal_playbook_records",
      kind: "query",
      sourceSystemId: "legal_playbook",
      description: "Retrieve legal playbook records from Legal Playbook for the Clause Risk Analyzer workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "legal_playbook_records_records",
        "legal_playbook_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "lookup_clause_risk_analyzer_policy_guide",
      kind: "evidence_lookup",
      sourceSystemId: "icertis",
      description: "Look up sections of the Clause Risk Analyzer Procurement Policy Guide to cite in narrative output, escalation rationale, and audit evidence.",
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
      claim: "Risk detection rate moved from 60% manual review toward 95% automated",
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
      claim: "Review turnaround moved from 3-5 business days toward 4 hours",
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
      trigger: "Risk detection rate regresses past the 60% manual review baseline by more than 20%",
      action: "escalate_to_human",
      handoffTarget: "Legal Procurement Counsel",
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
    "Never bypass Legal Procurement Counsel approval on escalation triggers, even when confidence is high.",
    "Never expose individual personal data (PII) in summaries; aggregate or pseudonymise before output.",
    "Never act on data older than the staleness threshold defined in the runbook without a fresh re-query.",
  ],
  goldenEvals: [
    {
      id: "clause-risk-analyzer-end-to-end",
      prompt: "Run the Clause Risk Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.",
      expectedToolCalls: [
        "query_icertis_contracts",
        "query_docusign_clm_contracts",
        "query_legal_playbook_legal_playbook_records",
        "lookup_clause_risk_analyzer_policy_guide",
        "action_icertis_recommend",
      ],
      mustReferenceEntities: [
        "contracts",
        "contracts",
        "legal_playbook_records",
      ],
      mustCiteDocuments: [
        "clause-risk-analyzer-policy-guide",
      ],
      expectedActionOutcome: "Action recommend executed against Icertis, with audit-trail entry and Legal Procurement Counsel notified of outcomes.",
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
    rationale: "Row counts sized for Clause Risk Analyzer so the agent can demonstrate the workflow against realistic transactional volume without simulating a production warehouse.",
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
      id: "legal_playbook",
      name: "Legal Playbook",
      owns: [
        "legal_playbook_records",
        "legal_playbook_events",
        "legal_playbook_audit_trail",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_legal_playbook_legal_playbook_records",
        "query_legal_playbook_legal_playbook_events",
        "query_legal_playbook_legal_playbook_audit_trail",
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
      name: "legal_playbook_records",
      sourceSystemId: "legal_playbook",
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
      name: "legal_playbook_events",
      sourceSystemId: "legal_playbook",
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
          name: "legal_playbook_record_id",
          type: "ref",
          ref: "legal_playbook_records.id",
          required: true,
        },
      ],
    },
    {
      name: "legal_playbook_audit_trail",
      sourceSystemId: "legal_playbook",
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
  ],
  relationships: [
    {
      from: "legal_playbook_events.legal_playbook_record_id",
      to: "legal_playbook_records.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
  ],
  documents: [
    {
      id: "clause-risk-analyzer-policy-guide",
      sourceSystemId: "icertis",
      type: "policy",
      title: "Clause Risk Analyzer Procurement Policy Guide",
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
      id: "clause-risk-analyzer-baseline-gap",
      description: "Seed a realistic gap where Risk detection rate sits between 60% manual review and 95% automated, so the agent can detect, narrate, and recommend remediation.",
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
      expectedRecommendation: "Explain the gap, cite supporting evidence, and propose the next Legal Procurement Counsel action.",
    },
  ],
  datastorePackaging: {
    alloydb: {
      database: "clause_risk_analyzer",
      schemas: [
        "icertis",
        "docusign_clm",
        "legal_playbook",
      ],
    },
    bigquery: {
      dataset: "procurement_clause_risk_analyzer",
      tables: [
        "kpi_summary",
        "evidence_index",
      ],
    },
    cloudStorage: {
      bucketSuffix: "clause-risk-analyzer-evidence",
      prefixes: [
        "documents",
        "audit-trails",
        "exports",
      ],
    },
    apis: {
      serviceName: "clause-risk-analyzer-source-adapters",
      deploymentTarget: "cloud_run",
    },
  },
  validation: {
    smokePrompt: "Run the Clause Risk Analyzer workflow and cite source-system evidence for every claim.",
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

export const ClauseRiskAnalyzer = () => (
  <UseCaseSlide
    title="Clause Risk Analyzer"
    subtitle="A-1402 • Contract Lifecycle"
    icon={Shield}
    domainId="domain-14"
    layer="Layer 3: Custom ADK"
    persona="Legal Procurement Counsel"
    systems={["Icertis", "DocuSign CLM", "Legal Playbook", "Vertex AI"]}
    kpis={[
      { label: "Risk detection rate", before: "60% manual review", after: "95% automated" },
      { label: "Review turnaround", before: "3-5 business days", after: "4 hours" },
      { label: "Cross-clause risks caught", before: "Rarely identified", after: "100% flagged" },
    ]}
    triggerType="event"
    swimlane={swimlane}
    flow={flow}
    architecture={architecture}
    hitl={{ actor: "Legal Counsel", action: "Accept or reject clause risks", description: "Counsel reviews flagged clause interactions, assesses business impact of deviations, and decides accept/reject/negotiate positions." }}
    statusQuo={[
      "Legal review relies on individual attorney expertise to spot cross-clause interaction risks.",
      "Playbook deviations identified by keyword search miss semantic meaning — 'commercially reasonable efforts' vs. 'best efforts' not flagged.",
      "180-day termination notice buried in boilerplate goes unnoticed until it creates lock-in."
    ]}
    agentification={[
      "Gemini understands that uncapped 'consequential damages' combined with broad indemnification creates compounding liability exposure.",
      "LLM detects semantic deviations — recognizing that 'commercially reasonable efforts' is a meaningful reduction from 'best efforts'.",
      "Generates risk reports ranked by business impact, not just clause-level deviations, with recommended negotiation positions."
    ]}
  />
);
