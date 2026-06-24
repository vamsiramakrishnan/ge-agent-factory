import React from "react";
import { UseCaseSlide } from "../../../agent/UseCaseSlide";
import { FlowStep } from "../../../agent/ProcessFlow";
import { SwimlaneFlow } from "../../../agent/SwimlaneFlow";
import { AgentArchitecture, UseCaseGenerationSpec, AgentBehaviorContract} from "../../../../types/architecture";
import { GitMerge, Database, Network, Brain, FileText, CheckCircle } from "lucide-react";

const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "s1", label: "Annual Category Review", lane: "system", type: "trigger" },
    { id: "a1", label: "Overlap Detection", lane: "agent", type: "action" },
    { id: "a2", label: "Consolidation Modeling", lane: "agent", type: "action" },
    { id: "a3", label: "Feasibility Analysis", lane: "agent", type: "action" },
    { id: "a4", label: "Business Case", lane: "agent", type: "output" },
    { id: "h1", label: "Category Mgr Review", lane: "human", type: "hitl" },
  ],
  connections: [["s1", "a1"], ["a1", "a2"], ["a2", "a3"], ["a3", "a4"], ["a4", "h1"]],
};

const flow: FlowStep[] = [
  { label: "Supplier Mapping", icon: Database, description: "Vendor master, spend data, and contract coverage cross-referenced to identify overlap.", trigger: "Annual", systems: ["BigQuery"] },
  { label: "Graph Analytics", icon: Network, description: "Supplier-category-BU-geography relationship graph analyzed for consolidation clusters.", systems: ["BigQuery", "Vertex AI"], integration: "ADK" },
  { label: "Feasibility Reasoning", icon: Brain, description: "LLM evaluates contractual constraints, ITAR requirements, and stakeholder considerations.", systems: ["Vertex AI"] },
  { label: "Category Mgr Decision", icon: CheckCircle, description: "Category Manager reviews consolidation business case with projected savings and implementation risks.", output: "Consolidation Plan" },
];

const architecture: AgentArchitecture = {
  connections: [
    { system: "BigQuery", description: "Spend data, supplier-category-BU-geography relationship graph", direction: "bidirectional", protocol: "BigQuery SQL", category: "analytics" },
    { system: "SAP S/4HANA", description: "Vendor master records, material-supplier assignments", direction: "read", protocol: "RFC/BAPI", category: "erp" },
    { system: "Contract System", description: "Contract coverage, exclusivity clauses, term expiry dates", direction: "read", protocol: "REST API", category: "clm" },
    { system: "Vertex AI (Gemini)", description: "Feasibility reasoning, contractual constraint interpretation, business case narrative", direction: "bidirectional", protocol: "gRPC", category: "ai" },
  ],
  pipeline: [
    { label: "Supplier Overlap Mapping", description: "Pull vendor master and spend data. Cross-reference with contract coverage. Build supplier-category-BU-geography relationship graph in BigQuery to identify where multiple suppliers serve the same need.", systems: ["BigQuery", "SAP S/4HANA", "Contract System"], layer: "integration", dataIn: "Vendor master + spend data + contract data", dataOut: "Supplier relationship graph with overlap clusters" },
    { label: "Consolidation Scenario Modeling", description: "Graph analytics to identify consolidation clusters. Cost/risk simulation of consolidation scenarios. Volume leverage modeling to project savings with confidence intervals from reducing 5 suppliers to 2.", systems: ["BigQuery"], layer: "ml", dataIn: "Supplier relationship graph + spend volumes", dataOut: "Consolidation scenarios with savings projections" },
    { label: "Feasibility Reasoning & Business Case", description: "LLM reasons about consolidation feasibility beyond numbers — 'Plant A supplier has ITAR certification for defense contracts, cannot consolidate to cheaper supplier.' Interprets contractual exclusivity clauses, geographic risk, and stakeholder resistance. Generates business case narrative.", systems: ["Vertex AI (Gemini)"], layer: "llm", dataIn: "Consolidation scenarios + contract terms + constraint data", dataOut: "Consolidation business case with savings, risks, and constraints" },
  ],
};


const behaviorContract: AgentBehaviorContract = {
  role: "Category Manager agent for the Supplier Consolidation Analyzer workflow",
  primaryObjective: "Graph analytics maps supplier-category-BU-geography relationships to surface consolidation clusters automatically. LLM reasons beyond numbers — 'Plant A's supplier has ITAR certification for defense contracts; cannot consolidate to the cheaper supplier.' so the Category Manager can move the Consolidation analysis time KPI.",
  inScope: [
    "Graph analytics maps supplier-category-BU-geography relationships to surface consolidation clusters automatically",
    "LLM reasons beyond numbers — 'Plant A's supplier has ITAR certification for defense contracts; cannot consolidate to the cheaper supplier.'",
    "Generates consolidation business case with projected savings, implementation risks, and contractual constraint analysis",
  ],
  outOfScope: [
    "Contract execution without legal review",
    "Supplier disqualification decisions (category lead retains authority)",
    "Single-source justification overrides above policy threshold",
  ],
  toolIntents: [
    {
      name: "query_bigquery_analytics_events",
      kind: "query",
      sourceSystemId: "bigquery",
      description: "Retrieve analytics events from BigQuery for the Supplier Consolidation Analyzer workflow.",
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
      name: "query_vendor_master_vendor_master_records",
      kind: "query",
      sourceSystemId: "vendor_master",
      description: "Retrieve vendor master records from Vendor Master for the Supplier Consolidation Analyzer workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "vendor_master_records_records",
        "vendor_master_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_contract_data_contract_data_records",
      kind: "query",
      sourceSystemId: "contract_data",
      description: "Retrieve contract data records from Contract Data for the Supplier Consolidation Analyzer workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "contract_data_records_records",
        "contract_data_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "lookup_supplier_consolidation_analyzer_policy_guide",
      kind: "evidence_lookup",
      sourceSystemId: "bigquery",
      description: "Look up sections of the Supplier Consolidation Analyzer Procurement Policy Guide to cite in narrative output, escalation rationale, and audit evidence.",
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
      name: "action_vendor_master_generate",
      kind: "action",
      sourceSystemId: "vendor_master",
      description: "Execute the generate step in Vendor Master after the agent has gathered evidence and validated escalation gates.",
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
      claim: "Consolidation analysis time moved from 4-6 weeks toward 3 days",
      mustCite: [
        "bigquery.analytics_events",
        "vendor_master.vendor_master_records",
      ],
      sourceSystemIds: [
        "bigquery",
        "vendor_master",
      ],
    },
    {
      claim: "Savings from consolidation moved from Estimated in ranges toward Modeled with confidence intervals",
      mustCite: [
        "bigquery.analytics_events",
        "vendor_master.vendor_master_records",
      ],
      sourceSystemIds: [
        "bigquery",
        "vendor_master",
      ],
    },
  ],
  escalationRules: [
    {
      trigger: "Consolidation analysis time regresses past the 4-6 weeks baseline by more than 20%",
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
    "Never fabricate metric values; only publish numbers derived from BigQuery (and other named systems) entities.",
    "Never bypass Category Manager approval on escalation triggers, even when confidence is high.",
    "Never expose individual personal data (PII) in summaries; aggregate or pseudonymise before output.",
    "Never act on data older than the staleness threshold defined in the runbook without a fresh re-query.",
  ],
  goldenEvals: [
    {
      id: "supplier-consolidation-analyzer-end-to-end",
      prompt: "Run the Supplier Consolidation Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.",
      expectedToolCalls: [
        "query_bigquery_analytics_events",
        "query_vendor_master_vendor_master_records",
        "query_contract_data_contract_data_records",
        "lookup_supplier_consolidation_analyzer_policy_guide",
        "action_vendor_master_generate",
      ],
      mustReferenceEntities: [
        "analytics_events",
        "vendor_master_records",
        "contract_data_records",
      ],
      mustCiteDocuments: [
        "supplier-consolidation-analyzer-policy-guide",
      ],
      expectedActionOutcome: "Action generate executed against Vendor Master, with audit-trail entry and Category Manager notified of outcomes.",
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
    rationale: "Row counts sized for Supplier Consolidation Analyzer so the agent can demonstrate the workflow against realistic transactional volume without simulating a production warehouse.",
  },
  sourceSystems: [
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
    {
      id: "vendor_master",
      name: "Vendor Master",
      owns: [
        "vendor_master_records",
        "vendor_master_events",
        "vendor_master_audit_trail",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_vendor_master_vendor_master_records",
        "query_vendor_master_vendor_master_events",
        "query_vendor_master_vendor_master_audit_trail",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
    {
      id: "contract_data",
      name: "Contract Data",
      owns: [
        "contract_data_records",
        "contract_data_events",
        "contract_data_audit_trail",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_contract_data_contract_data_records",
        "query_contract_data_contract_data_events",
        "query_contract_data_contract_data_audit_trail",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
  ],
  entities: [
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
    {
      name: "vendor_master_records",
      sourceSystemId: "vendor_master",
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
      name: "vendor_master_events",
      sourceSystemId: "vendor_master",
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
          name: "vendor_master_record_id",
          type: "ref",
          ref: "vendor_master_records.id",
          required: true,
        },
      ],
    },
    {
      name: "vendor_master_audit_trail",
      sourceSystemId: "vendor_master",
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
      name: "contract_data_records",
      sourceSystemId: "contract_data",
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
      name: "contract_data_events",
      sourceSystemId: "contract_data",
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
          name: "contract_data_record_id",
          type: "ref",
          ref: "contract_data_records.id",
          required: true,
        },
      ],
    },
    {
      name: "contract_data_audit_trail",
      sourceSystemId: "contract_data",
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
  ],
  relationships: [
    {
      from: "analytics_events.historical_metric_id",
      to: "historical_metrics.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
    {
      from: "vendor_master_events.vendor_master_record_id",
      to: "vendor_master_records.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
    {
      from: "contract_data_events.contract_data_record_id",
      to: "contract_data_records.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
  ],
  documents: [
    {
      id: "supplier-consolidation-analyzer-policy-guide",
      sourceSystemId: "bigquery",
      type: "policy",
      title: "Supplier Consolidation Analyzer Procurement Policy Guide",
      requiredSections: [
        "Sourcing principles",
        "Approval thresholds",
        "Supplier risk requirements",
        "Contract and compliance gates",
        "Exception handling",
      ],
      linkedEntities: [
        "analytics_events",
        "historical_metrics",
        "cached_aggregates",
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
      id: "vendor_master_generate_api",
      sourceSystemId: "vendor_master",
      method: "POST",
      path: "/api/vendor_master/generate",
      description: "Synchronous endpoint the agent calls to generate in Vendor Master after evidence gating.",
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
      id: "supplier-consolidation-analyzer-baseline-gap",
      description: "Seed a realistic gap where Consolidation analysis time sits between 4-6 weeks and 3 days, so the agent can detect, narrate, and recommend remediation.",
      affectedEntities: [
        "analytics_events",
        "historical_metrics",
      ],
      discoveryPath: [
        "Inspect BigQuery records for the affected entities",
        "Compare against Vendor Master historical baseline",
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
      database: "supplier_consolidation_analyzer",
      schemas: [
        "vendor_master",
        "contract_data",
      ],
    },
    bigquery: {
      dataset: "procurement_supplier_consolidation_analyzer",
      tables: [
        "kpi_summary",
        "evidence_index",
      ],
    },
    cloudStorage: {
      bucketSuffix: "supplier-consolidation-analyzer-evidence",
      prefixes: [
        "documents",
        "audit-trails",
        "exports",
      ],
    },
    apis: {
      serviceName: "supplier-consolidation-analyzer-source-adapters",
      deploymentTarget: "cloud_run",
    },
  },
  validation: {
    smokePrompt: "Run the Supplier Consolidation Analyzer workflow and cite source-system evidence for every claim.",
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

export const SupplierConsolidationAnalyzer = () => (
  <UseCaseSlide
    title="Supplier Consolidation Analyzer"
    subtitle="A-1307 • Supplier Discovery"
    icon={GitMerge}
    domainId="domain-13"
    layer="Layer 4: Data Agent"
    persona="Category Manager"
    systems={["BigQuery", "Vendor Master", "Contract Data", "Vertex AI"]}
    kpis={[
      { label: "Consolidation analysis time", before: "4-6 weeks", after: "3 days" },
      { label: "Savings from consolidation", before: "Estimated in ranges", after: "Modeled with confidence intervals" },
      { label: "Constraint identification", before: "Discovered during execution", after: "Pre-identified in analysis" },
    ]}
    triggerType="scheduled"
    swimlane={swimlane}
    flow={flow}
    architecture={architecture}
    hitl={{ actor: "Category Manager", action: "Approve consolidation plan", description: "Category Manager reviews consolidation scenarios including volume leverage projections, contractual constraints, and stakeholder impact before committing to execution." }}
    statusQuo={[
      "Consolidation opportunities identified ad-hoc when contracts renew, not through systematic analysis.",
      "Volume leverage potential estimated without considering contractual exclusivity clauses or ITAR restrictions.",
      "Stakeholder resistance to supplier changes discovered only during implementation, derailing savings."
    ]}
    agentification={[
      "Graph analytics maps supplier-category-BU-geography relationships to surface consolidation clusters automatically.",
      "LLM reasons beyond numbers — 'Plant A's supplier has ITAR certification for defense contracts; cannot consolidate to the cheaper supplier.'",
      "Generates consolidation business case with projected savings, implementation risks, and contractual constraint analysis."
    ]}
  />
);
