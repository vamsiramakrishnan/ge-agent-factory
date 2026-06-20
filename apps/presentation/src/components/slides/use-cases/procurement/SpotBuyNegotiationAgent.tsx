import React from "react";
import { UseCaseSlide } from "../../../agent/UseCaseSlide";
import { FlowStep } from "../../../agent/ProcessFlow";
import { SwimlaneFlow } from "../../../agent/SwimlaneFlow";
import { AgentArchitecture, UseCaseGenerationSpec, AgentBehaviorContract} from "../../../../types/architecture";
import { Handshake, ShoppingCart, BarChart3, Mail, CheckCircle } from "lucide-react";

const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "s1", label: "Spot Buy Request", lane: "system", type: "trigger" },
    { id: "a1", label: "Price Benchmark", lane: "agent", type: "action" },
    { id: "a2", label: "Draft Quote Req", lane: "agent", type: "action" },
    { id: "a3", label: "Email Negotiate", lane: "agent", type: "action" },
    { id: "h1", label: "Buyer Approves", lane: "human", type: "hitl" },
  ],
  connections: [["s1", "a1"], ["a1", "a2"], ["a2", "a3"], ["a3", "h1"]],
};

const flow: FlowStep[] = [
  { label: "Spot Request", icon: ShoppingCart, description: "One-off purchase request received outside existing contracts.", trigger: "On request", systems: ["Coupa"] },
  { label: "Price Benchmark", icon: BarChart3, description: "Real-time price comparison across multiple marketplaces and historical purchase data.", systems: ["Amazon Business", "Supplier marketplaces"], integration: "Custom ADK" },
  { label: "Quote Drafting", icon: Mail, description: "LLM drafts contextual quote requests with specs, quantities, and delivery requirements.", systems: ["Email API", "Vertex AI"] },
  { label: "Buyer Review", icon: CheckCircle, description: "Buyer reviews negotiated quotes, selects supplier, and authorizes PO creation.", output: "Negotiated PO" },
];

const architecture: AgentArchitecture = {
  connections: [
    { system: "Coupa", description: "Spot buy request intake, PO creation, purchase history", direction: "bidirectional", protocol: "REST API", category: "erp" },
    { system: "Amazon Business", description: "Real-time product pricing, availability, and delivery estimates", direction: "read", protocol: "REST API", category: "erp" },
    { system: "Supplier Marketplaces", description: "Multi-marketplace pricing queries for competitive benchmarking", direction: "read", protocol: "REST API", category: "market-data" },
    { system: "Email API", description: "Quote request drafting and negotiation correspondence with suppliers", direction: "write", protocol: "SMTP/API", category: "collaboration" },
    { system: "Vertex AI (Gemini)", description: "Contextual quote drafting, negotiation response generation", direction: "bidirectional", protocol: "gRPC", category: "ai" },
    { system: "BigQuery", description: "Historical purchase prices for benchmarking and leverage analysis", direction: "read", protocol: "BigQuery SQL", category: "analytics" },
  ],
  pipeline: [
    { label: "Price Benchmarking", description: "Query multiple marketplaces and supplier portals simultaneously for real-time pricing. Cross-reference with historical purchase data to establish competitive price ranges and detect outlier quotes.", systems: ["Amazon Business", "Supplier Marketplaces", "BigQuery"], layer: "integration", dataIn: "Spot buy specification and quantity", dataOut: "Price benchmark range with supplier options" },
    { label: "Quote & Negotiation", description: "Gemini drafts contextual quote requests with sufficient specification detail for accurate supplier pricing. Evaluates quote responses including caveats and conditions, then generates negotiation emails when quotes exceed benchmark range.", systems: ["Vertex AI (Gemini)", "Email API"], layer: "llm", dataIn: "Benchmark range + supplier responses", dataOut: "Negotiated quote with price comparison" },
    { label: "PO Execution", description: "Selected supplier quote converted to purchase order in Coupa. Full audit trail of benchmark, quotes received, and negotiation history preserved for compliance.", systems: ["Coupa"], layer: "integration", dataIn: "Approved negotiated quote", dataOut: "Executed purchase order" },
  ],
};


const behaviorContract: AgentBehaviorContract = {
  role: "Buyer agent for the Spot Buy Negotiation Agent workflow",
  primaryObjective: "Agent queries multiple marketplaces simultaneously and benchmarks against historical purchase data to establish competitive price ranges. LLM drafts contextual quote requests — 'We need 50 custom gaskets per attached drawing, material Viton 75A, delivery within 2 weeks to Houston' — giving suppliers enough context to price accurately. so the Buyer can move the Spot buy cycle time KPI.",
  inScope: [
    "Agent queries multiple marketplaces simultaneously and benchmarks against historical purchase data to establish competitive price ranges",
    "LLM drafts contextual quote requests — 'We need 50 custom gaskets per attached drawing, material Viton 75A, delivery within 2 weeks to Houston' — giving suppliers enough context to price accurately",
    "Negotiates via email when quotes exceed benchmark: 'Your quote of $X is 15% above competitive range — can you match $Y given our ongoing relationship?'",
  ],
  outOfScope: [
    "Contract execution without legal review",
    "Supplier disqualification decisions (category lead retains authority)",
    "Single-source justification overrides above policy threshold",
  ],
  toolIntents: [
    {
      name: "query_coupa_requisitions",
      kind: "query",
      sourceSystemId: "coupa",
      description: "Retrieve requisitions from Coupa for the Spot Buy Negotiation Agent workflow.",
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
      name: "query_amazon_business_amazon_business_records",
      kind: "query",
      sourceSystemId: "amazon_business",
      description: "Retrieve amazon business records from Amazon Business for the Spot Buy Negotiation Agent workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "amazon_business_records_records",
        "amazon_business_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_supplier_marketplaces_supplier_marketplaces_records",
      kind: "query",
      sourceSystemId: "supplier_marketplaces",
      description: "Retrieve supplier marketplaces records from Supplier marketplaces for the Spot Buy Negotiation Agent workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "supplier_marketplaces_records_records",
        "supplier_marketplaces_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_email_api_email_api_records",
      kind: "query",
      sourceSystemId: "email_api",
      description: "Retrieve email api records from Email API for the Spot Buy Negotiation Agent workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "email_api_records_records",
        "email_api_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "lookup_spot_buy_negotiation_agent_policy_guide",
      kind: "evidence_lookup",
      sourceSystemId: "coupa",
      description: "Look up sections of the Spot Buy Negotiation Agent Procurement Policy Guide to cite in narrative output, escalation rationale, and audit evidence.",
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
      name: "action_coupa_draft",
      kind: "action",
      sourceSystemId: "coupa",
      description: "Execute the draft step in Coupa after the agent has gathered evidence and validated escalation gates.",
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
      claim: "Spot buy cycle time moved from 3-5 days toward 4 hours",
      mustCite: [
        "coupa.requisitions",
        "amazon_business.amazon_business_records",
      ],
      sourceSystemIds: [
        "coupa",
        "amazon_business",
      ],
    },
    {
      claim: "Price improvement moved from First quote accepted toward 8-15% negotiated",
      mustCite: [
        "coupa.requisitions",
        "amazon_business.amazon_business_records",
      ],
      sourceSystemIds: [
        "coupa",
        "amazon_business",
      ],
    },
  ],
  escalationRules: [
    {
      trigger: "Spot buy cycle time regresses past the 3-5 days baseline by more than 20%",
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
      trigger: "Proposed draft action lacks supporting evidence from at least two systems",
      action: "refuse",
      rationale: "Single-system evidence is insufficient to authorize external state changes without manual review.",
    },
  ],
  refusalRules: [
    "Never fabricate metric values; only publish numbers derived from Coupa (and other named systems) entities.",
    "Never bypass Buyer approval on escalation triggers, even when confidence is high.",
    "Never expose individual personal data (PII) in summaries; aggregate or pseudonymise before output.",
    "Never act on data older than the staleness threshold defined in the runbook without a fresh re-query.",
  ],
  goldenEvals: [
    {
      id: "spot-buy-negotiation-agent-end-to-end",
      prompt: "Run the Spot Buy Negotiation Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.",
      expectedToolCalls: [
        "query_coupa_requisitions",
        "query_amazon_business_amazon_business_records",
        "query_supplier_marketplaces_supplier_marketplaces_records",
        "query_email_api_email_api_records",
        "lookup_spot_buy_negotiation_agent_policy_guide",
        "action_coupa_draft",
      ],
      mustReferenceEntities: [
        "requisitions",
        "amazon_business_records",
        "supplier_marketplaces_records",
        "email_api_records",
      ],
      mustCiteDocuments: [
        "spot-buy-negotiation-agent-policy-guide",
      ],
      expectedActionOutcome: "Action draft executed against Coupa, with audit-trail entry and Buyer notified of outcomes.",
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
    rationale: "Row counts sized for Spot Buy Negotiation Agent so the agent can demonstrate the workflow against realistic transactional volume without simulating a production warehouse.",
  },
  sourceSystems: [
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
      id: "amazon_business",
      name: "Amazon Business",
      owns: [
        "amazon_business_records",
        "amazon_business_events",
        "amazon_business_audit_trail",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_amazon_business_amazon_business_records",
        "query_amazon_business_amazon_business_events",
        "query_amazon_business_amazon_business_audit_trail",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
    {
      id: "supplier_marketplaces",
      name: "Supplier marketplaces",
      owns: [
        "supplier_marketplaces_records",
        "supplier_marketplaces_events",
        "supplier_marketplaces_audit_trail",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_supplier_marketplaces_supplier_marketplaces_records",
        "query_supplier_marketplaces_supplier_marketplaces_events",
        "query_supplier_marketplaces_supplier_marketplaces_audit_trail",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
    {
      id: "email_api",
      name: "Email API",
      owns: [
        "email_api_records",
        "email_api_events",
        "email_api_audit_trail",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_email_api_email_api_records",
        "query_email_api_email_api_events",
        "query_email_api_email_api_audit_trail",
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
      name: "purchase_orders",
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
      name: "amazon_business_records",
      sourceSystemId: "amazon_business",
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
      name: "amazon_business_events",
      sourceSystemId: "amazon_business",
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
          name: "amazon_business_record_id",
          type: "ref",
          ref: "amazon_business_records.id",
          required: true,
        },
      ],
    },
    {
      name: "amazon_business_audit_trail",
      sourceSystemId: "amazon_business",
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
      name: "supplier_marketplaces_records",
      sourceSystemId: "supplier_marketplaces",
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
      name: "supplier_marketplaces_events",
      sourceSystemId: "supplier_marketplaces",
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
          name: "supplier_marketplaces_record_id",
          type: "ref",
          ref: "supplier_marketplaces_records.id",
          required: true,
        },
      ],
    },
    {
      name: "supplier_marketplaces_audit_trail",
      sourceSystemId: "supplier_marketplaces",
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
      name: "email_api_records",
      sourceSystemId: "email_api",
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
      name: "email_api_events",
      sourceSystemId: "email_api",
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
          name: "email_api_record_id",
          type: "ref",
          ref: "email_api_records.id",
          required: true,
        },
      ],
    },
    {
      name: "email_api_audit_trail",
      sourceSystemId: "email_api",
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
      from: "amazon_business_events.amazon_business_record_id",
      to: "amazon_business_records.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
    {
      from: "supplier_marketplaces_events.supplier_marketplaces_record_id",
      to: "supplier_marketplaces_records.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
    {
      from: "email_api_events.email_api_record_id",
      to: "email_api_records.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
  ],
  documents: [
    {
      id: "spot-buy-negotiation-agent-policy-guide",
      sourceSystemId: "coupa",
      type: "policy",
      title: "Spot Buy Negotiation Agent Procurement Policy Guide",
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
      id: "coupa_draft_api",
      sourceSystemId: "coupa",
      method: "POST",
      path: "/api/coupa/draft",
      description: "Synchronous endpoint the agent calls to draft in Coupa after evidence gating.",
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
      id: "spot-buy-negotiation-agent-baseline-gap",
      description: "Seed a realistic gap where Spot buy cycle time sits between 3-5 days and 4 hours, so the agent can detect, narrate, and recommend remediation.",
      affectedEntities: [
        "requisitions",
        "purchase_orders",
      ],
      discoveryPath: [
        "Inspect Coupa records for the affected entities",
        "Compare against Amazon Business historical baseline",
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
      database: "spot_buy_negotiation_agent",
      schemas: [
        "coupa",
        "amazon_business",
        "supplier_marketplaces",
        "email_api",
      ],
    },
    bigquery: {
      dataset: "procurement_spot_buy_negotiation_agent",
      tables: [
        "kpi_summary",
        "evidence_index",
      ],
    },
    cloudStorage: {
      bucketSuffix: "spot-buy-negotiation-agent-evidence",
      prefixes: [
        "documents",
        "audit-trails",
        "exports",
      ],
    },
    apis: {
      serviceName: "spot-buy-negotiation-agent-source-adapters",
      deploymentTarget: "cloud_run",
    },
  },
  validation: {
    smokePrompt: "Run the Spot Buy Negotiation Agent workflow and cite source-system evidence for every claim.",
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

export const SpotBuyNegotiationAgent = () => (
  <UseCaseSlide
    title="Spot Buy Negotiation Agent"
    subtitle="A-1803 • Indirect & Tail Spend"
    icon={Handshake}
    domainId="domain-18"
    layer="Layer 3: Custom ADK"
    persona="Buyer"
    systems={["Coupa", "Amazon Business", "Supplier marketplaces", "Email API"]}
    kpis={[
      { label: "Spot buy cycle time", before: "3-5 days", after: "4 hours" },
      { label: "Price improvement", before: "First quote accepted", after: "8-15% negotiated" },
      { label: "Buyer time per spot buy", before: "2-3 hours", after: "15 min review" },
    ]}
    triggerType="event"
    swimlane={swimlane}
    flow={flow}
    architecture={architecture}
    hitl={{ actor: "Buyer", action: "Approve negotiated spot buy", description: "Buyer reviews price comparisons and negotiated quotes above threshold before authorizing purchase order." }}
    statusQuo={[
      "Spot buys are handled ad-hoc — buyers spend hours calling suppliers and comparing quotes manually for one-off purchases.",
      "No price benchmarking for non-contract items; first reasonable quote is typically accepted without negotiation.",
      "Quote requests are generic templates that lack the context suppliers need to price accurately, leading to inflated quotes."
    ]}
    agentification={[
      "Agent queries multiple marketplaces simultaneously and benchmarks against historical purchase data to establish competitive price ranges.",
      "LLM drafts contextual quote requests — 'We need 50 custom gaskets per attached drawing, material Viton 75A, delivery within 2 weeks to Houston' — giving suppliers enough context to price accurately.",
      "Negotiates via email when quotes exceed benchmark: 'Your quote of $X is 15% above competitive range — can you match $Y given our ongoing relationship?'"
    ]}
  />
);
