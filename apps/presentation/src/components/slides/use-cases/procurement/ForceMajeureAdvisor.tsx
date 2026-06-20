import React from "react";
import { UseCaseSlide } from "../../../agent/UseCaseSlide";
import { FlowStep } from "../../../agent/ProcessFlow";
import { SwimlaneFlow } from "../../../agent/SwimlaneFlow";
import { AgentArchitecture, UseCaseGenerationSpec, AgentBehaviorContract} from "../../../../types/architecture";
import { AlertTriangle, Zap, Search, Scale, CheckCircle } from "lucide-react";

const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "s1", label: "Disruption Event", lane: "system", type: "trigger" },
    { id: "a1", label: "Contract Matching", lane: "agent", type: "action" },
    { id: "a2", label: "Clause Analysis", lane: "agent", type: "action" },
    { id: "a3", label: "Scenario Modeling", lane: "agent", type: "output" },
    { id: "h1", label: "Legal + CPO Decide", lane: "human", type: "hitl" },
  ],
  connections: [["s1", "a1"], ["a1", "a2"], ["a2", "a3"], ["a3", "h1"]],
};

const flow: FlowStep[] = [
  { label: "Event Trigger", icon: Zap, description: "Disruption event detected — port strike, natural disaster, pandemic, semiconductor shortage.", trigger: "Chat / Event", systems: ["Contract Repository"] },
  { label: "Contract Matching", icon: Search, description: "Affected contracts identified from CLM; relevant FM and termination clauses retrieved via RAG.", systems: ["Vertex AI", "Legal Knowledge Base"] },
  { label: "Clause Reasoning", icon: Scale, description: "LLM reasons whether specific event qualifies under each contract's FM provisions — jurisdiction-aware analysis.", systems: ["Vertex AI"], integration: "ADK" },
  { label: "Leadership Decision", icon: CheckCircle, description: "Legal and CPO review analysis with termination cost modeling and recommended negotiation strategies.", output: "FM Advisory" },
];

const architecture: AgentArchitecture = {
  connections: [
    { system: "Contract Repository", description: "Full contract corpus for RAG-based affected contract identification", direction: "read", protocol: "REST API", category: "clm" },
    { system: "Legal Knowledge Base", description: "Force majeure precedents, jurisdiction-specific FM interpretations", direction: "read", protocol: "REST API", category: "clm" },
    { system: "Vertex AI (Gemini)", description: "FM clause qualification reasoning, termination scenario modeling, negotiation strategy generation", direction: "bidirectional", protocol: "gRPC", category: "ai" },
    { system: "BigQuery", description: "Contract-event matching analytics, termination cost modeling data", direction: "read", protocol: "BigQuery SQL", category: "analytics" },
  ],
  pipeline: [
    { label: "Event & Contract Matching", description: "Receive disruption event trigger (port strike, natural disaster, pandemic). Perform RAG over contract repository to identify all contracts affected by the specific event. Retrieve relevant FM and termination clauses.", systems: ["Contract Repository", "BigQuery"], layer: "integration", dataIn: "Disruption event description", dataOut: "Affected contracts with relevant FM/termination clauses" },
    { label: "Termination Cost Modeling", description: "Model termination scenarios for each affected contract — wind-down charges, cure period requirements, documented non-performance thresholds. Calculate financial exposure across the affected portfolio.", systems: ["BigQuery"], layer: "ml", dataIn: "Contract termination terms + financial data", dataOut: "Termination cost scenarios per contract" },
    { label: "FM Qualification & Strategy", description: "Gemini reasons whether specific event qualifies under each contract's FM provisions — jurisdiction-aware analysis distinguishing 'labor disputes at supplier facility' from third-party port strikes. Models termination-for-cause vs. termination-for-convenience trade-offs. Generates recommended negotiation strategies: 'Recommend negotiating voluntary exit with reduced termination fee.'", systems: ["Vertex AI (Gemini)", "Legal Knowledge Base"], layer: "llm", dataIn: "FM clauses + event context + cost scenarios", dataOut: "FM advisory with qualification analysis and negotiation strategy" },
  ],
};


const behaviorContract: AgentBehaviorContract = {
  role: "Legal Procurement Counsel agent for the Force Majeure Advisor workflow",
  primaryObjective: "Gemini performs RAG over contract repository to instantly identify all contracts affected by a specific disruption event. LLM reasons about FM clause specifics: 'FM clause lists labor disputes but specifies at supplier facility — port strike is third-party, likely does not qualify.' so the Legal Procurement Counsel can move the Affected contract identification KPI.",
  inScope: [
    "Gemini performs RAG over contract repository to instantly identify all contracts affected by a specific disruption event",
    "LLM reasons about FM clause specifics: 'FM clause lists labor disputes but specifies at supplier facility — port strike is third-party, likely does not qualify.'",
    "Models termination scenarios with cost estimates: 'Termination-for-convenience costs $2.3M in wind-down — recommend negotiating voluntary exit with reduced fee.'",
  ],
  outOfScope: [
    "Contract execution without legal review",
    "Supplier disqualification decisions (category lead retains authority)",
    "Single-source justification overrides above policy threshold",
  ],
  toolIntents: [
    {
      name: "query_contract_repository_contract_repository_records",
      kind: "query",
      sourceSystemId: "contract_repository",
      description: "Retrieve contract repository records from Contract Repository for the Force Majeure Advisor workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "contract_repository_records_records",
        "contract_repository_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_legal_knowledge_base_legal_knowledge_base_records",
      kind: "query",
      sourceSystemId: "legal_knowledge_base",
      description: "Retrieve legal knowledge base records from Legal Knowledge Base for the Force Majeure Advisor workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "legal_knowledge_base_records_records",
        "legal_knowledge_base_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_procurement_3_procurement_3_records",
      kind: "query",
      sourceSystemId: "procurement_3",
      description: "Retrieve procurement 3 records from PROCUREMENT 3 for the Force Majeure Advisor workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "procurement_3_records_records",
        "procurement_3_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "lookup_force_majeure_advisor_policy_guide",
      kind: "evidence_lookup",
      sourceSystemId: "contract_repository",
      description: "Look up sections of the Force Majeure Advisor Procurement Policy Guide to cite in narrative output, escalation rationale, and audit evidence.",
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
      name: "action_contract_repository_recommend",
      kind: "action",
      sourceSystemId: "contract_repository",
      description: "Execute the recommend step in Contract Repository after the agent has gathered evidence and validated escalation gates.",
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
      claim: "Affected contract identification moved from Days of manual search toward Minutes",
      mustCite: [
        "contract_repository.contract_repository_records",
        "legal_knowledge_base.legal_knowledge_base_records",
      ],
      sourceSystemIds: [
        "contract_repository",
        "legal_knowledge_base",
      ],
    },
    {
      claim: "FM qualification accuracy moved from Inconsistent legal opinions toward Clause-specific analysis",
      mustCite: [
        "contract_repository.contract_repository_records",
        "legal_knowledge_base.legal_knowledge_base_records",
      ],
      sourceSystemIds: [
        "contract_repository",
        "legal_knowledge_base",
      ],
    },
  ],
  escalationRules: [
    {
      trigger: "Affected contract identification regresses past the Days of manual search baseline by more than 20%",
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
    "Never fabricate metric values; only publish numbers derived from Contract Repository (and other named systems) entities.",
    "Never bypass Legal Procurement Counsel approval on escalation triggers, even when confidence is high.",
    "Never expose individual personal data (PII) in summaries; aggregate or pseudonymise before output.",
    "Never act on data older than the staleness threshold defined in the runbook without a fresh re-query.",
  ],
  goldenEvals: [
    {
      id: "force-majeure-advisor-end-to-end",
      prompt: "Run the Force Majeure Advisor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.",
      expectedToolCalls: [
        "query_contract_repository_contract_repository_records",
        "query_legal_knowledge_base_legal_knowledge_base_records",
        "query_procurement_3_procurement_3_records",
        "lookup_force_majeure_advisor_policy_guide",
        "action_contract_repository_recommend",
      ],
      mustReferenceEntities: [
        "contract_repository_records",
        "legal_knowledge_base_records",
        "procurement_3_records",
      ],
      mustCiteDocuments: [
        "force-majeure-advisor-policy-guide",
      ],
      expectedActionOutcome: "Action recommend executed against Contract Repository, with audit-trail entry and Legal Procurement Counsel notified of outcomes.",
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
    rationale: "Row counts sized for Force Majeure Advisor so the agent can demonstrate the workflow against realistic transactional volume without simulating a production warehouse.",
  },
  sourceSystems: [
    {
      id: "contract_repository",
      name: "Contract Repository",
      owns: [
        "contract_repository_records",
        "contract_repository_events",
        "contract_repository_audit_trail",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_contract_repository_contract_repository_records",
        "query_contract_repository_contract_repository_events",
        "query_contract_repository_contract_repository_audit_trail",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
    {
      id: "legal_knowledge_base",
      name: "Legal Knowledge Base",
      owns: [
        "legal_knowledge_base_records",
        "legal_knowledge_base_events",
        "legal_knowledge_base_audit_trail",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_legal_knowledge_base_legal_knowledge_base_records",
        "query_legal_knowledge_base_legal_knowledge_base_events",
        "query_legal_knowledge_base_legal_knowledge_base_audit_trail",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
    {
      id: "procurement_3",
      name: "PROCUREMENT 3",
      owns: [
        "procurement_3_records",
        "procurement_3_events",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_procurement_3_records",
      ],
      evidence: [
        "source_system_record",
      ],
    },
  ],
  entities: [
    {
      name: "contract_repository_records",
      sourceSystemId: "contract_repository",
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
      name: "contract_repository_events",
      sourceSystemId: "contract_repository",
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
          name: "contract_repository_record_id",
          type: "ref",
          ref: "contract_repository_records.id",
          required: true,
        },
      ],
    },
    {
      name: "contract_repository_audit_trail",
      sourceSystemId: "contract_repository",
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
      name: "legal_knowledge_base_records",
      sourceSystemId: "legal_knowledge_base",
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
          name: "title",
          type: "lorem.sentence",
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
            "draft",
            "review",
            "published",
            "archived",
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
      name: "legal_knowledge_base_events",
      sourceSystemId: "legal_knowledge_base",
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
          name: "title",
          type: "lorem.sentence",
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
            "draft",
            "review",
            "published",
            "archived",
          ],
          required: true,
        },
        {
          name: "last_updated",
          type: "date",
          required: true,
        },
        {
          name: "legal_knowledge_base_record_id",
          type: "ref",
          ref: "legal_knowledge_base_records.id",
          required: true,
        },
      ],
    },
    {
      name: "legal_knowledge_base_audit_trail",
      sourceSystemId: "legal_knowledge_base",
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
          name: "title",
          type: "lorem.sentence",
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
            "draft",
            "review",
            "published",
            "archived",
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
      name: "procurement_3_records",
      sourceSystemId: "procurement_3",
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
      name: "procurement_3_events",
      sourceSystemId: "procurement_3",
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
          name: "procurement_3_record_id",
          type: "ref",
          ref: "procurement_3_records.id",
          required: true,
        },
      ],
    },
  ],
  relationships: [
    {
      from: "contract_repository_events.contract_repository_record_id",
      to: "contract_repository_records.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
    {
      from: "legal_knowledge_base_events.legal_knowledge_base_record_id",
      to: "legal_knowledge_base_records.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
    {
      from: "procurement_3_events.procurement_3_record_id",
      to: "procurement_3_records.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
  ],
  documents: [
    {
      id: "force-majeure-advisor-policy-guide",
      sourceSystemId: "contract_repository",
      type: "policy",
      title: "Force Majeure Advisor Procurement Policy Guide",
      requiredSections: [
        "Sourcing principles",
        "Approval thresholds",
        "Supplier risk requirements",
        "Contract and compliance gates",
        "Exception handling",
      ],
      linkedEntities: [
        "contract_repository_records",
        "contract_repository_events",
        "contract_repository_audit_trail",
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
      id: "contract_repository_recommend_api",
      sourceSystemId: "contract_repository",
      method: "POST",
      path: "/api/contract_repository/recommend",
      description: "Synchronous endpoint the agent calls to recommend in Contract Repository after evidence gating.",
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
      id: "force-majeure-advisor-baseline-gap",
      description: "Seed a realistic gap where Affected contract identification sits between Days of manual search and Minutes, so the agent can detect, narrate, and recommend remediation.",
      affectedEntities: [
        "contract_repository_records",
        "contract_repository_events",
      ],
      discoveryPath: [
        "Inspect Contract Repository records for the affected entities",
        "Compare against Legal Knowledge Base historical baseline",
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
      database: "force_majeure_advisor",
      schemas: [
        "contract_repository",
        "legal_knowledge_base",
        "procurement_3",
      ],
    },
    bigquery: {
      dataset: "procurement_force_majeure_advisor",
      tables: [
        "kpi_summary",
        "evidence_index",
      ],
    },
    cloudStorage: {
      bucketSuffix: "force-majeure-advisor-evidence",
      prefixes: [
        "documents",
        "audit-trails",
        "exports",
      ],
    },
    apis: {
      serviceName: "force-majeure-advisor-source-adapters",
      deploymentTarget: "cloud_run",
    },
  },
  validation: {
    smokePrompt: "Run the Force Majeure Advisor workflow and cite source-system evidence for every claim.",
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

export const ForceMajeureAdvisor = () => (
  <UseCaseSlide
    title="Force Majeure Advisor"
    subtitle="A-1409 • Contract Lifecycle"
    icon={AlertTriangle}
    domainId="domain-14"
    layer="Layer 3: Custom ADK"
    persona="Legal Procurement Counsel"
    systems={["Contract Repository", "Legal Knowledge Base", "Vertex AI"]}
    kpis={[
      { label: "Affected contract identification", before: "Days of manual search", after: "Minutes" },
      { label: "FM qualification accuracy", before: "Inconsistent legal opinions", after: "Clause-specific analysis" },
      { label: "Termination cost visibility", before: "Unknown until negotiated", after: "Pre-modeled scenarios" },
    ]}
    triggerType="chat"
    swimlane={swimlane}
    flow={flow}
    architecture={architecture}
    hitl={{ actor: "Legal + CPO", action: "Approve force majeure strategy", description: "Legal and CPO review FM qualification analysis, termination cost scenarios, and recommended negotiation approach for each affected contract." }}
    statusQuo={[
      "Force majeure analysis requires manual review of every affected contract — during a crisis, this takes days or weeks.",
      "Legal opinions on FM qualification are inconsistent — 'labor dispute at supplier facility' vs. 'port strike' treated identically.",
      "Termination costs unknown until late-stage negotiation — no pre-modeled scenarios for decision-makers."
    ]}
    agentification={[
      "Gemini performs RAG over contract repository to instantly identify all contracts affected by a specific disruption event.",
      "LLM reasons about FM clause specifics: 'FM clause lists labor disputes but specifies at supplier facility — port strike is third-party, likely does not qualify.'",
      "Models termination scenarios with cost estimates: 'Termination-for-convenience costs $2.3M in wind-down — recommend negotiating voluntary exit with reduced fee.'"
    ]}
  />
);
