import React from "react";
import { UseCaseSlide } from "../../../agent/UseCaseSlide";
import { FlowStep } from "../../../agent/ProcessFlow";
import { SwimlaneFlow } from "../../../agent/SwimlaneFlow";
import { AgentArchitecture, UseCaseGenerationSpec, AgentBehaviorContract} from "../../../../types/architecture";
import { GitBranch, Database, Cpu, Brain, FileText } from "lucide-react";

const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "s1", label: "Quarterly Review", lane: "system", type: "trigger" },
    { id: "a1", label: "Transaction Pull", lane: "agent", type: "action" },
    { id: "a2", label: "Channel Classification", lane: "agent", type: "action" },
    { id: "a3", label: "Edge Case Analysis", lane: "agent", type: "action" },
    { id: "a4", label: "Migration Plan", lane: "agent", type: "output" },
  ],
  connections: [["s1", "a1"], ["a1", "a2"], ["a2", "a3"], ["a3", "a4"]],
};

const flow: FlowStep[] = [
  { label: "Transaction Data", icon: Database, description: "Spend data pulled by channel — catalog, PO, P-card, spot buy — with frequency, value, and complexity attributes.", trigger: "Quarterly", systems: ["Coupa catalog", "Amazon Business"] },
  { label: "ML Classification", icon: Cpu, description: "Transactions classified by optimal channel based on value, frequency, complexity, and supplier count.", systems: ["BigQuery", "SAP Ariba"], integration: "API" },
  { label: "Edge Case Reasoning", icon: Brain, description: "Gemini analyzes ambiguous cases: is an $8K recurring monthly purchase of custom-labeled packaging catalog-eligible or strategic?", systems: ["Vertex AI"] },
  { label: "Migration Plan", icon: FileText, description: "Narrative migration plan with projected buyer hour savings and compliance impact delivered to procurement ops.", output: "Channel Migration Plan" },
];

const architecture: AgentArchitecture = {
  connections: [
    { system: "Coupa Catalog", description: "Catalog transaction data, item availability, and adoption metrics", direction: "read", protocol: "REST API", category: "erp" },
    { system: "Amazon Business", description: "Marketplace purchase data and pricing benchmarks", direction: "read", protocol: "REST API", category: "erp" },
    { system: "SAP Ariba", description: "Strategic sourcing PO data and contract-linked transactions", direction: "read", protocol: "REST API", category: "erp" },
    { system: "BigQuery", description: "Channel classification models, spend pattern analytics, and migration analysis", direction: "bidirectional", protocol: "BigQuery SQL", category: "analytics" },
    { system: "Vertex AI (Gemini)", description: "Edge case reasoning on channel suitability and migration plan narrative generation", direction: "bidirectional", protocol: "gRPC", category: "ai" },
  ],
  pipeline: [
    { label: "Transaction Data Assembly", description: "Pull transaction data by channel from Coupa catalog, Amazon Business, and Ariba — catalog, PO, P-card, spot buy. Aggregate spend patterns with frequency, value, and complexity attributes.", systems: ["Coupa Catalog", "Amazon Business", "SAP Ariba"], layer: "integration", dataIn: "Transaction data across all procurement channels", dataOut: "Unified spend dataset with channel attribution" },
    { label: "Channel Classification", description: "ML classification of spend suitability by channel — strategic sourcing vs. catalog vs. spot buy vs. P-card — based on value, frequency, complexity, and supplier count. Identify migration candidates.", systems: ["BigQuery ML"], layer: "ml", dataIn: "Unified spend dataset with transaction attributes", dataOut: "Channel recommendations with migration candidate list" },
    { label: "Edge Case Analysis & Migration Plan", description: "Gemini analyzes edge cases where channel assignment is not obvious: is an $8K recurring monthly purchase of custom-labeled packaging catalog-eligible or strategic? Reasons about trade-offs between channel efficiency and category leverage. Generates migration plan narrative with projected savings.", systems: ["Vertex AI (Gemini)"], layer: "llm", dataIn: "Migration candidates + edge cases + channel context", dataOut: "Migration plan with buyer hour savings and compliance impact" },
  ],
};


const behaviorContract: AgentBehaviorContract = {
  role: "Indirect Procurement Lead agent for the Sourcing Channel Optimizer workflow",
  primaryObjective: "Gemini reasons about edge cases: '$8K recurring custom packaging — custom spec makes it supplier-dependent, not catalog-eligible despite recurrence.' LLM analyzes the trade-off between channel efficiency and category leverage, preventing inappropriate channel migration. so the Indirect Procurement Lead can move the Catalog adoption rate KPI.",
  inScope: [
    "Gemini reasons about edge cases: '$8K recurring custom packaging — custom spec makes it supplier-dependent, not catalog-eligible despite recurrence.'",
    "LLM analyzes the trade-off between channel efficiency and category leverage, preventing inappropriate channel migration",
    "Generates migration plan narratives: 'Moving 340 tail-spend transactions to catalog saves 1,200 buyer hours annually while maintaining compliance.'",
  ],
  outOfScope: [
    "Contract execution without legal review",
    "Supplier disqualification decisions (category lead retains authority)",
    "Single-source justification overrides above policy threshold",
  ],
  toolIntents: [
    {
      name: "query_coupa_catalog_catalog_items",
      kind: "query",
      sourceSystemId: "coupa_catalog",
      description: "Retrieve catalog items from Coupa catalog for the Sourcing Channel Optimizer workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "catalog_items_records",
        "catalog_items_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_amazon_business_amazon_business_records",
      kind: "query",
      sourceSystemId: "amazon_business",
      description: "Retrieve amazon business records from Amazon Business for the Sourcing Channel Optimizer workflow.",
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
      name: "query_sap_ariba_suppliers",
      kind: "query",
      sourceSystemId: "sap_ariba",
      description: "Retrieve suppliers from SAP Ariba for the Sourcing Channel Optimizer workflow.",
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
      name: "query_bigquery_analytics_events",
      kind: "query",
      sourceSystemId: "bigquery",
      description: "Retrieve analytics events from BigQuery for the Sourcing Channel Optimizer workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "analytics_events_records",
        "analytics_events_summary",
      ],
      evidenceEmitted: [
        "sql_result",
      ],
    },
    {
      name: "lookup_sourcing_channel_optimizer_policy_guide",
      kind: "evidence_lookup",
      sourceSystemId: "bigquery",
      description: "Look up sections of the Sourcing Channel Optimizer Procurement Policy Guide to cite in narrative output, escalation rationale, and audit evidence.",
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
      name: "action_coupa_catalog_generate",
      kind: "action",
      sourceSystemId: "coupa_catalog",
      description: "Execute the generate step in Coupa catalog after the agent has gathered evidence and validated escalation gates.",
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
      claim: "Catalog adoption rate moved from 35% toward 72%",
      mustCite: [
        "coupa_catalog.catalog_items",
        "amazon_business.amazon_business_records",
      ],
      sourceSystemIds: [
        "coupa_catalog",
        "amazon_business",
      ],
    },
    {
      claim: "Buyer hours saved/year moved from Baseline toward 1,200+ hours",
      mustCite: [
        "coupa_catalog.catalog_items",
        "amazon_business.amazon_business_records",
      ],
      sourceSystemIds: [
        "coupa_catalog",
        "amazon_business",
      ],
    },
  ],
  escalationRules: [
    {
      trigger: "Catalog adoption rate regresses past the 35% baseline by more than 20%",
      action: "escalate_to_human",
      handoffTarget: "Indirect Procurement Lead",
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
    "Never fabricate metric values; only publish numbers derived from Coupa catalog (and other named systems) entities.",
    "Never bypass Indirect Procurement Lead approval on escalation triggers, even when confidence is high.",
    "Never expose individual personal data (PII) in summaries; aggregate or pseudonymise before output.",
    "Never act on data older than the staleness threshold defined in the runbook without a fresh re-query.",
  ],
  goldenEvals: [
    {
      id: "sourcing-channel-optimizer-end-to-end",
      prompt: "Run the Sourcing Channel Optimizer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.",
      expectedToolCalls: [
        "query_coupa_catalog_catalog_items",
        "query_amazon_business_amazon_business_records",
        "query_sap_ariba_suppliers",
        "query_bigquery_analytics_events",
        "lookup_sourcing_channel_optimizer_policy_guide",
        "action_coupa_catalog_generate",
      ],
      mustReferenceEntities: [
        "catalog_items",
        "amazon_business_records",
        "suppliers",
        "analytics_events",
      ],
      mustCiteDocuments: [
        "sourcing-channel-optimizer-policy-guide",
      ],
      expectedActionOutcome: "Action generate executed against Coupa catalog, with audit-trail entry and Indirect Procurement Lead notified of outcomes.",
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
    rationale: "Row counts sized for Sourcing Channel Optimizer so the agent can demonstrate the workflow against realistic transactional volume without simulating a production warehouse.",
  },
  sourceSystems: [
    {
      id: "coupa_catalog",
      name: "Coupa catalog",
      owns: [
        "catalog_items",
        "supplier_offerings",
        "punchout_links",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_coupa_catalog_catalog_items",
        "query_coupa_catalog_supplier_offerings",
        "query_coupa_catalog_punchout_links",
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
      id: "sap_ariba",
      name: "SAP Ariba",
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
        "query_sap_ariba_suppliers",
        "query_sap_ariba_sourcing_events",
        "query_sap_ariba_contracts",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
    {
      id: "bigquery",
      name: "BigQuery",
      owns: [
        "analytics_events",
        "historical_metrics",
        "cached_aggregates",
      ],
      protocol: "BigQuery SQL",
      localBacking: [
        "bigquery",
      ],
      toolNames: [
        "query_bigquery_analytics_events",
        "query_bigquery_historical_metrics",
        "query_bigquery_cached_aggregates",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
  ],
  entities: [
    {
      name: "catalog_items",
      sourceSystemId: "coupa_catalog",
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
          name: "supplier_offering_id",
          type: "ref",
          ref: "supplier_offerings.id",
          required: true,
        },
      ],
    },
    {
      name: "supplier_offerings",
      sourceSystemId: "coupa_catalog",
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
      name: "punchout_links",
      sourceSystemId: "coupa_catalog",
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
      name: "suppliers",
      sourceSystemId: "sap_ariba",
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
      sourceSystemId: "sap_ariba",
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
      sourceSystemId: "sap_ariba",
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
      name: "analytics_events",
      sourceSystemId: "bigquery",
      datastore: "bigquery",
      rowCount: 60,
      primaryKey: "id",
      columns: [
        {
          name: "id",
          type: "seq",
          required: true,
        },
        {
          name: "period",
          type: "enum",
          values: [
            "day",
            "week",
            "month",
            "quarter",
          ],
          required: true,
        },
        {
          name: "metric_name",
          type: "lorem.words",
          required: true,
        },
        {
          name: "value",
          type: "float",
          min: 0,
          max: 100000,
          decimals: 2,
          required: true,
        },
        {
          name: "variance_pct",
          type: "float",
          min: -50,
          max: 50,
          decimals: 2,
          required: true,
        },
        {
          name: "computed_at",
          type: "date",
          required: true,
        },
        {
          name: "historical_metric_id",
          type: "ref",
          ref: "historical_metrics.id",
          required: true,
        },
      ],
    },
    {
      name: "historical_metrics",
      sourceSystemId: "bigquery",
      datastore: "bigquery",
      rowCount: 60,
      primaryKey: "id",
      columns: [
        {
          name: "id",
          type: "seq",
          required: true,
        },
        {
          name: "period",
          type: "enum",
          values: [
            "day",
            "week",
            "month",
            "quarter",
          ],
          required: true,
        },
        {
          name: "metric_name",
          type: "lorem.words",
          required: true,
        },
        {
          name: "value",
          type: "float",
          min: 0,
          max: 100000,
          decimals: 2,
          required: true,
        },
        {
          name: "variance_pct",
          type: "float",
          min: -50,
          max: 50,
          decimals: 2,
          required: true,
        },
        {
          name: "computed_at",
          type: "date",
          required: true,
        },
      ],
    },
    {
      name: "cached_aggregates",
      sourceSystemId: "bigquery",
      datastore: "bigquery",
      rowCount: 60,
      primaryKey: "id",
      columns: [
        {
          name: "id",
          type: "seq",
          required: true,
        },
        {
          name: "period",
          type: "enum",
          values: [
            "day",
            "week",
            "month",
            "quarter",
          ],
          required: true,
        },
        {
          name: "metric_name",
          type: "lorem.words",
          required: true,
        },
        {
          name: "value",
          type: "float",
          min: 0,
          max: 100000,
          decimals: 2,
          required: true,
        },
        {
          name: "variance_pct",
          type: "float",
          min: -50,
          max: 50,
          decimals: 2,
          required: true,
        },
        {
          name: "computed_at",
          type: "date",
          required: true,
        },
      ],
    },
  ],
  relationships: [
    {
      from: "catalog_items.supplier_offering_id",
      to: "supplier_offerings.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
    {
      from: "amazon_business_events.amazon_business_record_id",
      to: "amazon_business_records.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
    {
      from: "sourcing_events.supplier_id",
      to: "suppliers.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
    {
      from: "analytics_events.historical_metric_id",
      to: "historical_metrics.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
  ],
  documents: [
    {
      id: "sourcing-channel-optimizer-policy-guide",
      sourceSystemId: "bigquery",
      type: "policy",
      title: "Sourcing Channel Optimizer Procurement Policy Guide",
      requiredSections: [
        "Sourcing principles",
        "Approval thresholds",
        "Supplier risk requirements",
        "Contract and compliance gates",
        "Exception handling",
      ],
      linkedEntities: [
        "catalog_items",
        "supplier_offerings",
        "punchout_links",
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
      id: "coupa_catalog_generate_api",
      sourceSystemId: "coupa_catalog",
      method: "POST",
      path: "/api/coupa_catalog/generate",
      description: "Synchronous endpoint the agent calls to generate in Coupa catalog after evidence gating.",
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
      id: "sourcing-channel-optimizer-baseline-gap",
      description: "Seed a realistic gap where Catalog adoption rate sits between 35% and 72%, so the agent can detect, narrate, and recommend remediation.",
      affectedEntities: [
        "catalog_items",
        "supplier_offerings",
      ],
      discoveryPath: [
        "Inspect Coupa catalog records for the affected entities",
        "Compare against Amazon Business historical baseline",
        "Generate a citation-backed recommendation",
      ],
      expectedEvidence: [
        "source-system record",
        "historical baseline metric",
        "generated audit trail",
      ],
      expectedRecommendation: "Explain the gap, cite supporting evidence, and propose the next Indirect Procurement Lead action.",
    },
  ],
  datastorePackaging: {
    alloydb: {
      database: "sourcing_channel_optimizer",
      schemas: [
        "coupa_catalog",
        "amazon_business",
        "sap_ariba",
      ],
    },
    bigquery: {
      dataset: "procurement_sourcing_channel_optimizer",
      tables: [
        "kpi_summary",
        "evidence_index",
      ],
    },
    cloudStorage: {
      bucketSuffix: "sourcing-channel-optimizer-evidence",
      prefixes: [
        "documents",
        "audit-trails",
        "exports",
      ],
    },
    apis: {
      serviceName: "sourcing-channel-optimizer-source-adapters",
      deploymentTarget: "cloud_run",
    },
  },
  validation: {
    smokePrompt: "Run the Sourcing Channel Optimizer workflow and cite source-system evidence for every claim.",
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

export const SourcingChannelOptimizer = () => (
  <UseCaseSlide
    title="Sourcing Channel Optimizer"
    subtitle="A-1212 • Strategic Sourcing"
    icon={GitBranch}
    domainId="domain-12"
    layer="Layer 4: Data Agent"
    persona="Indirect Procurement Lead"
    systems={["Coupa catalog", "Amazon Business", "SAP Ariba", "BigQuery"]}
    kpis={[
      { label: "Catalog adoption rate", before: "35%", after: "72%" },
      { label: "Buyer hours saved/year", before: "Baseline", after: "1,200+ hours" },
      { label: "Maverick transactions migrated", before: "Ad hoc", after: "340+ per quarter" },
    ]}
    triggerType="scheduled"
    swimlane={swimlane}
    flow={flow}
    architecture={architecture}
    statusQuo={[
      "Channel assignment is based on buyer habit — items that should be catalog purchases go through full PO cycles, wasting buyer time.",
      "No systematic analysis of which transactions could be moved to lower-touch channels without losing category leverage.",
      "Edge cases pile up in 'exception' queues because rule-based systems cannot reason about channel trade-offs."
    ]}
    agentification={[
      "Gemini reasons about edge cases: '$8K recurring custom packaging — custom spec makes it supplier-dependent, not catalog-eligible despite recurrence.'",
      "LLM analyzes the trade-off between channel efficiency and category leverage, preventing inappropriate channel migration.",
      "Generates migration plan narratives: 'Moving 340 tail-spend transactions to catalog saves 1,200 buyer hours annually while maintaining compliance.'"
    ]}
  />
);
