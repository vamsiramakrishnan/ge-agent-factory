import React from "react";
import { UseCaseSlide } from "../../../agent/UseCaseSlide";
import { FlowStep } from "../../../agent/ProcessFlow";
import { SwimlaneFlow } from "../../../agent/SwimlaneFlow";
import { AgentArchitecture, UseCaseGenerationSpec, AgentBehaviorContract} from "../../../../types/architecture";
import { Handshake, Database, TrendingUp, Brain, FileText } from "lucide-react";

const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "s1", label: "Pre-Negotiation", lane: "system", type: "trigger" },
    { id: "a1", label: "History Retrieval", lane: "agent", type: "action" },
    { id: "a2", label: "BATNA Analysis", lane: "agent", type: "action" },
    { id: "a3", label: "Playbook Draft", lane: "agent", type: "action" },
    { id: "a4", label: "Trade-off Matrix", lane: "agent", type: "output" },
  ],
  connections: [["s1", "a1"], ["a1", "a2"], ["a2", "a3"], ["a3", "a4"]],
};

const flow: FlowStep[] = [
  { label: "Contract History", icon: Database, description: "Past contract terms, pricing history, and concession patterns retrieved via RAG from CLM system.", trigger: "Pre-negotiation", systems: ["Icertis", "DocuSign CLM"] },
  { label: "Market Context", icon: TrendingUp, description: "Current market benchmarks, supplier financial performance, and capacity utilization assembled.", systems: ["Market intel", "D&B"], integration: "API" },
  { label: "BATNA Reasoning", icon: Brain, description: "Gemini assesses leverage: '2 qualified alternates, 70% capacity utilization, contract expires in 60 days — strong BATNA.'", systems: ["Vertex AI"] },
  { label: "Playbook Delivery", icon: FileText, description: "Negotiation playbook with trade-off matrices and counter-offer scenarios delivered to negotiation team.", output: "Negotiation Playbook" },
];

const architecture: AgentArchitecture = {
  connections: [
    { system: "Icertis", description: "Contract history, pricing terms, and amendment records", direction: "read", protocol: "REST API", category: "clm" },
    { system: "DocuSign CLM", description: "Past negotiation redlines and concession tracking", direction: "read", protocol: "REST API", category: "clm" },
    { system: "BigQuery", description: "Spend data, price trend analysis, ZOPA estimation models", direction: "read", protocol: "BigQuery SQL", category: "analytics" },
    { system: "Market Intel Feeds", description: "Current market benchmarks and supplier financial performance", direction: "read", protocol: "REST API", category: "market-data" },
    { system: "Vertex AI (Gemini)", description: "BATNA reasoning, playbook synthesis, trade-off matrix generation", direction: "bidirectional", protocol: "gRPC", category: "ai" },
  ],
  pipeline: [
    { label: "Contract & Market Assembly", description: "Retrieve past contract terms, pricing history, and concession patterns from Icertis and DocuSign CLM. Pull current market benchmarks and supplier financial performance data. Compile supplier performance scorecards.", systems: ["Icertis", "DocuSign CLM", "Market Intel Feeds"], layer: "integration", dataIn: "Contract history + market benchmarks + supplier performance", dataOut: "Unified negotiation context dataset" },
    { label: "Price & Concession Analysis", description: "Price trend analysis across contract periods. Concession pattern tracking from historical negotiations. ZOPA estimation based on market rates and supplier cost structure indicators.", systems: ["BigQuery ML"], layer: "ml", dataIn: "Historical pricing and concession data", dataOut: "ZOPA estimate, price trends, concession patterns" },
    { label: "Playbook Synthesis", description: "Gemini synthesizes 5 years of contract history, prior negotiation rounds, market conditions, and supplier financials into a structured playbook. Reasons about BATNA strength and drafts trade-off matrices with counter-offer scenarios.", systems: ["Vertex AI (Gemini)"], layer: "llm", dataIn: "Negotiation context + ZOPA + concession patterns", dataOut: "Negotiation playbook with BATNA assessment and trade-offs" },
  ],
};


const behaviorContract: AgentBehaviorContract = {
  role: "Category Manager agent for the Negotiation Prep Agent workflow",
  primaryObjective: "Gemini synthesizes 5 years of contract history, 3 prior negotiation rounds, and current market conditions into a structured playbook. LLM reasons about leverage dynamics: 'Supplier capacity at 70%, 2 qualified alternates, contract expiring in 60 days — strong position.' so the Category Manager can move the Prep time per negotiation KPI.",
  inScope: [
    "Gemini synthesizes 5 years of contract history, 3 prior negotiation rounds, and current market conditions into a structured playbook",
    "LLM reasons about leverage dynamics: 'Supplier capacity at 70%, 2 qualified alternates, contract expiring in 60 days — strong position.'",
    "Generates trade-off matrices: 'If supplier resists price reduction, counter with extended payment terms — low cost to them, high value to us.'",
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
      description: "Retrieve contracts from Icertis for the Negotiation Prep Agent workflow.",
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
      description: "Retrieve contracts from DocuSign CLM for the Negotiation Prep Agent workflow.",
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
      name: "query_spend_data_spend_data_records",
      kind: "query",
      sourceSystemId: "spend_data",
      description: "Retrieve spend data records from Spend data for the Negotiation Prep Agent workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "spend_data_records_records",
        "spend_data_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_market_intel_market_intel_records",
      kind: "query",
      sourceSystemId: "market_intel",
      description: "Retrieve market intel records from Market intel for the Negotiation Prep Agent workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "market_intel_records_records",
        "market_intel_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "lookup_negotiation_prep_agent_policy_guide",
      kind: "evidence_lookup",
      sourceSystemId: "icertis",
      description: "Look up sections of the Negotiation Prep Agent Procurement Policy Guide to cite in narrative output, escalation rationale, and audit evidence.",
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
      claim: "Prep time per negotiation moved from 3-5 days toward 4 hours",
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
      claim: "Historical rounds analyzed moved from Last round only toward All 5 years",
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
      trigger: "Prep time per negotiation regresses past the 3-5 days baseline by more than 20%",
      action: "escalate_to_human",
      handoffTarget: "Category Manager",
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
    "Never bypass Category Manager approval on escalation triggers, even when confidence is high.",
    "Never expose individual personal data (PII) in summaries; aggregate or pseudonymise before output.",
    "Never act on data older than the staleness threshold defined in the runbook without a fresh re-query.",
  ],
  goldenEvals: [
    {
      id: "negotiation-prep-agent-end-to-end",
      prompt: "Run the Negotiation Prep Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.",
      expectedToolCalls: [
        "query_icertis_contracts",
        "query_docusign_clm_contracts",
        "query_spend_data_spend_data_records",
        "query_market_intel_market_intel_records",
        "lookup_negotiation_prep_agent_policy_guide",
        "action_icertis_generate",
      ],
      mustReferenceEntities: [
        "contracts",
        "contracts",
        "spend_data_records",
        "market_intel_records",
      ],
      mustCiteDocuments: [
        "negotiation-prep-agent-policy-guide",
      ],
      expectedActionOutcome: "Action generate executed against Icertis, with audit-trail entry and Category Manager notified of outcomes.",
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
    rationale: "Row counts sized for Negotiation Prep Agent so the agent can demonstrate the workflow against realistic transactional volume without simulating a production warehouse.",
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
      id: "spend_data",
      name: "Spend data",
      owns: [
        "spend_data_records",
        "spend_data_events",
        "spend_data_audit_trail",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_spend_data_spend_data_records",
        "query_spend_data_spend_data_events",
        "query_spend_data_spend_data_audit_trail",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
    {
      id: "market_intel",
      name: "Market intel",
      owns: [
        "market_intel_records",
        "market_intel_events",
        "market_intel_audit_trail",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_market_intel_market_intel_records",
        "query_market_intel_market_intel_events",
        "query_market_intel_market_intel_audit_trail",
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
      name: "spend_data_records",
      sourceSystemId: "spend_data",
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
      name: "spend_data_events",
      sourceSystemId: "spend_data",
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
          name: "spend_data_record_id",
          type: "ref",
          ref: "spend_data_records.id",
          required: true,
        },
      ],
    },
    {
      name: "spend_data_audit_trail",
      sourceSystemId: "spend_data",
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
      name: "market_intel_records",
      sourceSystemId: "market_intel",
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
      name: "market_intel_events",
      sourceSystemId: "market_intel",
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
          name: "market_intel_record_id",
          type: "ref",
          ref: "market_intel_records.id",
          required: true,
        },
      ],
    },
    {
      name: "market_intel_audit_trail",
      sourceSystemId: "market_intel",
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
      from: "spend_data_events.spend_data_record_id",
      to: "spend_data_records.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
    {
      from: "market_intel_events.market_intel_record_id",
      to: "market_intel_records.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
  ],
  documents: [
    {
      id: "negotiation-prep-agent-policy-guide",
      sourceSystemId: "icertis",
      type: "policy",
      title: "Negotiation Prep Agent Procurement Policy Guide",
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
      id: "negotiation-prep-agent-baseline-gap",
      description: "Seed a realistic gap where Prep time per negotiation sits between 3-5 days and 4 hours, so the agent can detect, narrate, and recommend remediation.",
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
      expectedRecommendation: "Explain the gap, cite supporting evidence, and propose the next Category Manager action.",
    },
  ],
  datastorePackaging: {
    alloydb: {
      database: "negotiation_prep_agent",
      schemas: [
        "icertis",
        "docusign_clm",
        "spend_data",
        "market_intel",
      ],
    },
    bigquery: {
      dataset: "procurement_negotiation_prep_agent",
      tables: [
        "kpi_summary",
        "evidence_index",
      ],
    },
    cloudStorage: {
      bucketSuffix: "negotiation-prep-agent-evidence",
      prefixes: [
        "documents",
        "audit-trails",
        "exports",
      ],
    },
    apis: {
      serviceName: "negotiation-prep-agent-source-adapters",
      deploymentTarget: "cloud_run",
    },
  },
  validation: {
    smokePrompt: "Run the Negotiation Prep Agent workflow and cite source-system evidence for every claim.",
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

export const NegotiationPrepAgent = () => (
  <UseCaseSlide
    title="Negotiation Prep Agent"
    subtitle="A-1207 • Strategic Sourcing"
    icon={Handshake}
    domainId="domain-12"
    layer="Layer 3: Custom ADK"
    persona="Category Manager"
    systems={["Icertis", "DocuSign CLM", "Spend data", "Market intel", "Vertex AI"]}
    kpis={[
      { label: "Prep time per negotiation", before: "3-5 days", after: "4 hours" },
      { label: "Historical rounds analyzed", before: "Last round only", after: "All 5 years" },
      { label: "Negotiated savings improvement", before: "Baseline", after: "+3-5% incremental" },
    ]}
    triggerType="event"
    swimlane={swimlane}
    flow={flow}
    architecture={architecture}
    statusQuo={[
      "Negotiation prep involves manually searching CLM for prior contracts and reconstructing pricing history from scattered emails.",
      "BATNA assessment is informal — negotiators often overestimate or underestimate their leverage based on incomplete information.",
      "Trade-off strategies are developed ad hoc during negotiations rather than systematically planned beforehand."
    ]}
    agentification={[
      "Gemini synthesizes 5 years of contract history, 3 prior negotiation rounds, and current market conditions into a structured playbook.",
      "LLM reasons about leverage dynamics: 'Supplier capacity at 70%, 2 qualified alternates, contract expiring in 60 days — strong position.'",
      "Generates trade-off matrices: 'If supplier resists price reduction, counter with extended payment terms — low cost to them, high value to us.'"
    ]}
  />
);
