import React from "react";
import { UseCaseSlide } from "../../../agent/UseCaseSlide";
import { FlowStep } from "../../../agent/ProcessFlow";
import { SwimlaneFlow } from "../../../agent/SwimlaneFlow";
import { AgentArchitecture, UseCaseGenerationSpec, AgentBehaviorContract} from "../../../../types/architecture";
import { ShieldAlert, Eye, Tag, Brain, MessageSquare } from "lucide-react";

const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "s1", label: "Off-Contract PO", lane: "system", type: "trigger" },
    { id: "a1", label: "Spend Classification", lane: "agent", type: "action" },
    { id: "a2", label: "Root Cause Analysis", lane: "agent", type: "action" },
    { id: "a3", label: "Personalized Nudge", lane: "agent", type: "output" },
  ],
  connections: [["s1", "a1"], ["a1", "a2"], ["a2", "a3"]],
};

const flow: FlowStep[] = [
  { label: "PO Detected", icon: Eye, description: "Non-catalog or off-contract purchase order creation detected in real time.", trigger: "Event-driven", systems: ["SAP S/4HANA", "Coupa"] },
  { label: "Classification", icon: Tag, description: "Off-contract purchase classified by root cause: no catalog item, policy confusion, urgency bypass, or preference.", systems: ["Ariba", "BigQuery"], integration: "ADK" },
  { label: "Nudge Generation", icon: Brain, description: "LLM generates context-aware nudge addressing the specific reason for maverick behavior, not a generic policy violation alert.", systems: ["Vertex AI"] },
  { label: "Nudge Delivered", icon: MessageSquare, description: "Personalized message sent via Slack or email with compliant alternative and one-click redirect option.", output: "Compliance Nudge" },
];

const architecture: AgentArchitecture = {
  connections: [
    { system: "Coupa/Ariba Catalog", description: "Catalog items, contract coverage data, compliant alternative lookup", direction: "read", protocol: "REST API", category: "erp" },
    { system: "SAP S/4HANA", description: "PO creation events, material master, vendor master, spend history", direction: "read", protocol: "RFC/BAPI", category: "erp" },
    { system: "BigQuery", description: "Spend classification models, root cause clustering, maverick spend trending", direction: "bidirectional", protocol: "BigQuery SQL", category: "analytics" },
    { system: "Vertex AI (Gemini)", description: "Context-aware nudge generation addressing specific reasons for maverick behavior", direction: "bidirectional", protocol: "gRPC", category: "ai" },
    { system: "Slack/Email", description: "Personalized nudge delivery with compliant alternative and one-click redirect", direction: "write", protocol: "Webhook/SMTP", category: "collaboration" },
  ],
  pipeline: [
    { label: "Off-Contract Detection", description: "Monitor PO creation events in real time. Compare each PO against contract and catalog coverage to identify non-catalog or off-contract purchases.", systems: ["SAP S/4HANA", "Coupa/Ariba Catalog"], layer: "integration", dataIn: "New PO creation event with vendor/material/price", dataOut: "Off-contract flag with catalog/contract coverage data" },
    { label: "Root Cause Classification", description: "Classify maverick spend by root cause: no catalog item exists, policy confusion, urgency bypass, or deliberate preference. Cluster patterns for weekly trend reporting.", systems: ["BigQuery"], layer: "ml", dataIn: "Off-contract PO details + historical patterns", dataOut: "Root cause classification with trending data" },
    { label: "Personalized Nudge Generation", description: "LLM generates context-aware nudge messages addressing the specific reason for maverick behavior. 'You ordered cartridges from Office Supply Co. at $45/unit — same cartridge available on Coupa catalog from Staples at $28/unit under contract #CM-2024-0892.' vs. 'No catalog option for CNC machining — would you like to request one from your Category Manager?'", systems: ["Vertex AI (Gemini)"], layer: "llm", dataIn: "Root cause + catalog alternatives + user context", dataOut: "Personalized compliance nudge with redirect option" },
    { label: "Nudge Delivery & Tracking", description: "Deliver nudge via Slack or email with one-click redirect to compliant alternative. Track compliance rates and compile weekly maverick spend reports.", systems: ["Slack/Email", "BigQuery"], layer: "integration", dataIn: "Generated nudge message", dataOut: "Delivered nudge with compliance tracking" },
  ],
};


const behaviorContract: AgentBehaviorContract = {
  role: "P2P Operations Manager agent for the Maverick Spend Detector & Nudge workflow",
  primaryObjective: "Real-time detection at PO creation with root cause classification — catalog gap vs. policy confusion vs. deliberate bypass. LLM generates personalized nudges: 'The same cartridge is available on Coupa catalog from Staples at $28/unit under contract #CM-2024-0892.' so the P2P Operations Manager can move the Maverick spend rate KPI.",
  inScope: [
    "Real-time detection at PO creation with root cause classification — catalog gap vs. policy confusion vs. deliberate bypass",
    "LLM generates personalized nudges: 'The same cartridge is available on Coupa catalog from Staples at $28/unit under contract #CM-2024-0892.'",
    "Context-aware response for edge cases: 'No catalog option for CNC machining — would you like to request one from your Category Manager?'",
  ],
  outOfScope: [
    "Contract execution without legal review",
    "Supplier disqualification decisions (category lead retains authority)",
    "Single-source justification overrides above policy threshold",
  ],
  toolIntents: [
    {
      name: "query_coupa_ariba_catalog_requisitions",
      kind: "query",
      sourceSystemId: "coupa_ariba_catalog",
      description: "Retrieve requisitions from Coupa/Ariba Catalog for the Maverick Spend Detector & Nudge workflow.",
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
      name: "query_sap_s_4hana_transactions",
      kind: "query",
      sourceSystemId: "sap_s_4hana",
      description: "Retrieve transactions from SAP S/4HANA for the Maverick Spend Detector & Nudge workflow.",
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
      name: "query_slack_email_messages",
      kind: "query",
      sourceSystemId: "slack_email",
      description: "Retrieve messages from Slack/Email for the Maverick Spend Detector & Nudge workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "messages_records",
        "messages_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "lookup_maverick_spend_detector_nudge_policy_guide",
      kind: "evidence_lookup",
      sourceSystemId: "coupa_ariba_catalog",
      description: "Look up sections of the Maverick Spend Detector & Nudge Procurement Policy Guide to cite in narrative output, escalation rationale, and audit evidence.",
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
      name: "action_coupa_ariba_catalog_generate",
      kind: "action",
      sourceSystemId: "coupa_ariba_catalog",
      description: "Execute the generate step in Coupa/Ariba Catalog after the agent has gathered evidence and validated escalation gates.",
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
      claim: "Maverick spend rate moved from 20-30% toward <5%",
      mustCite: [
        "coupa_ariba_catalog.requisitions",
        "sap_s_4hana.transactions",
      ],
      sourceSystemIds: [
        "coupa_ariba_catalog",
        "sap_s_4hana",
      ],
    },
    {
      claim: "Nudge compliance rate moved from N/A toward 72% redirect to contract",
      mustCite: [
        "coupa_ariba_catalog.requisitions",
        "sap_s_4hana.transactions",
      ],
      sourceSystemIds: [
        "coupa_ariba_catalog",
        "sap_s_4hana",
      ],
    },
  ],
  escalationRules: [
    {
      trigger: "Maverick spend rate regresses past the 20-30% baseline by more than 20%",
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
      trigger: "Proposed generate action lacks supporting evidence from at least two systems",
      action: "refuse",
      rationale: "Single-system evidence is insufficient to authorize external state changes without manual review.",
    },
  ],
  refusalRules: [
    "Never fabricate metric values; only publish numbers derived from Coupa/Ariba Catalog (and other named systems) entities.",
    "Never bypass P2P Operations Manager approval on escalation triggers, even when confidence is high.",
    "Never expose individual personal data (PII) in summaries; aggregate or pseudonymise before output.",
    "Never act on data older than the staleness threshold defined in the runbook without a fresh re-query.",
  ],
  goldenEvals: [
    {
      id: "maverick-spend-detector-nudge-end-to-end",
      prompt: "Run the Maverick Spend Detector & Nudge workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.",
      expectedToolCalls: [
        "query_coupa_ariba_catalog_requisitions",
        "query_sap_s_4hana_transactions",
        "query_slack_email_messages",
        "lookup_maverick_spend_detector_nudge_policy_guide",
        "action_coupa_ariba_catalog_generate",
      ],
      mustReferenceEntities: [
        "requisitions",
        "transactions",
        "messages",
      ],
      mustCiteDocuments: [
        "maverick-spend-detector-nudge-policy-guide",
      ],
      expectedActionOutcome: "Action generate executed against Coupa/Ariba Catalog, with audit-trail entry and P2P Operations Manager notified of outcomes.",
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
    rationale: "Row counts sized for Maverick Spend Detector & Nudge so the agent can demonstrate the workflow against realistic transactional volume without simulating a production warehouse.",
  },
  sourceSystems: [
    {
      id: "coupa_ariba_catalog",
      name: "Coupa/Ariba Catalog",
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
        "query_coupa_ariba_catalog_requisitions",
        "query_coupa_ariba_catalog_purchase_orders",
        "query_coupa_ariba_catalog_invoices",
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
    {
      id: "slack_email",
      name: "Slack/Email",
      owns: [
        "messages",
        "channels",
        "thread_replies",
      ],
      protocol: "Slack API",
      localBacking: [
        "json-api",
      ],
      toolNames: [
        "query_slack_email_messages",
        "query_slack_email_channels",
        "query_slack_email_thread_replies",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
  ],
  entities: [
    {
      name: "requisitions",
      sourceSystemId: "coupa_ariba_catalog",
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
      sourceSystemId: "coupa_ariba_catalog",
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
      sourceSystemId: "coupa_ariba_catalog",
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
    {
      name: "messages",
      sourceSystemId: "slack_email",
      datastore: "json-api",
      rowCount: 60,
      primaryKey: "id",
      columns: [
        {
          name: "id",
          type: "seq",
          required: true,
        },
        {
          name: "channel",
          type: "lorem.words",
          required: true,
        },
        {
          name: "author",
          type: "person.fullName",
          required: true,
        },
        {
          name: "body",
          type: "lorem.sentence",
          required: true,
        },
        {
          name: "sentiment",
          type: "enum",
          values: [
            "positive",
            "neutral",
            "negative",
          ],
          weights: [
            0.4,
            0.4,
            0.2,
          ],
          required: true,
        },
        {
          name: "sent_at",
          type: "date",
          required: true,
        },
      ],
    },
    {
      name: "channels",
      sourceSystemId: "slack_email",
      datastore: "json-api",
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
      name: "thread_replies",
      sourceSystemId: "slack_email",
      datastore: "json-api",
      rowCount: 60,
      primaryKey: "id",
      columns: [
        {
          name: "id",
          type: "seq",
          required: true,
        },
        {
          name: "channel",
          type: "lorem.words",
          required: true,
        },
        {
          name: "author",
          type: "person.fullName",
          required: true,
        },
        {
          name: "body",
          type: "lorem.sentence",
          required: true,
        },
        {
          name: "sentiment",
          type: "enum",
          values: [
            "positive",
            "neutral",
            "negative",
          ],
          weights: [
            0.4,
            0.4,
            0.2,
          ],
          required: true,
        },
        {
          name: "sent_at",
          type: "date",
          required: true,
        },
      ],
    },
  ],
  relationships: [],
  documents: [
    {
      id: "maverick-spend-detector-nudge-policy-guide",
      sourceSystemId: "coupa_ariba_catalog",
      type: "policy",
      title: "Maverick Spend Detector & Nudge Procurement Policy Guide",
      requiredSections: [
        "Sourcing principles",
        "Approval thresholds",
        "Supplier risk requirements",
        "Contract and compliance gates",
        "Exception handling",
      ],
      linkedEntities: [
        "requisitions",
        "purchase_orders",
        "invoices",
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
      id: "coupa_ariba_catalog_generate_api",
      sourceSystemId: "coupa_ariba_catalog",
      method: "POST",
      path: "/api/coupa_ariba_catalog/generate",
      description: "Synchronous endpoint the agent calls to generate in Coupa/Ariba Catalog after evidence gating.",
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
      id: "maverick-spend-detector-nudge-baseline-gap",
      description: "Seed a realistic gap where Maverick spend rate sits between 20-30% and <5%, so the agent can detect, narrate, and recommend remediation.",
      affectedEntities: [
        "requisitions",
        "purchase_orders",
      ],
      discoveryPath: [
        "Inspect Coupa/Ariba Catalog records for the affected entities",
        "Compare against SAP S/4HANA historical baseline",
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
      database: "maverick_spend_detector_nudge",
      schemas: [
        "coupa_ariba_catalog",
        "sap_s_4hana",
        "slack_email",
      ],
    },
    bigquery: {
      dataset: "procurement_maverick_spend_detector_nudge",
      tables: [
        "kpi_summary",
        "evidence_index",
      ],
    },
    cloudStorage: {
      bucketSuffix: "maverick-spend-detector-nudge-evidence",
      prefixes: [
        "documents",
        "audit-trails",
        "exports",
      ],
    },
    apis: {
      serviceName: "maverick-spend-detector-nudge-source-adapters",
      deploymentTarget: "cloud_run",
    },
  },
  validation: {
    smokePrompt: "Run the Maverick Spend Detector & Nudge workflow and cite source-system evidence for every claim.",
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

export const MaverickSpendDetectorNudge = () => (
  <UseCaseSlide
    title="Maverick Spend Detector & Nudge"
    subtitle="A-1506 • Procure-to-Pay"
    icon={ShieldAlert}
    domainId="domain-15"
    layer="Layer 3: Custom ADK"
    persona="P2P Operations Manager"
    systems={["Coupa/Ariba Catalog", "SAP S/4HANA", "Slack/Email"]}
    kpis={[
      { label: "Maverick spend rate", before: "20-30%", after: "<5%" },
      { label: "Nudge compliance rate", before: "N/A", after: "72% redirect to contract" },
      { label: "Savings from compliance", before: "Untracked", after: "$2.4M/year" },
    ]}
    triggerType="event"
    swimlane={swimlane}
    flow={flow}
    architecture={architecture}
    statusQuo={[
      "Off-contract spend detected only in monthly spend reports — weeks after the purchase is complete.",
      "Generic 'policy violation' emails ignored by 80% of recipients.",
      "No distinction between 'no catalog option exists' and 'requester bypassed existing contract.'"
    ]}
    agentification={[
      "Real-time detection at PO creation with root cause classification — catalog gap vs. policy confusion vs. deliberate bypass.",
      "LLM generates personalized nudges: 'The same cartridge is available on Coupa catalog from Staples at $28/unit under contract #CM-2024-0892.'",
      "Context-aware response for edge cases: 'No catalog option for CNC machining — would you like to request one from your Category Manager?'"
    ]}
  />
);
