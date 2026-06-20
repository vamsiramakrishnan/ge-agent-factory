import React from "react";
import { UseCaseSlide } from "../../../agent/UseCaseSlide";
import { FlowStep } from "../../../agent/ProcessFlow";
import { SwimlaneFlow } from "../../../agent/SwimlaneFlow";
import { AgentArchitecture, UseCaseGenerationSpec, AgentBehaviorContract} from "../../../../types/architecture";
import { Calculator, FileText, Cpu, Brain, CheckCircle } from "lucide-react";

const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "s1", label: "Pre-Negotiation", lane: "system", type: "trigger" },
    { id: "a1", label: "BOM Cost Build", lane: "agent", type: "action" },
    { id: "a2", label: "Spec Interpretation", lane: "agent", type: "action" },
    { id: "a3", label: "Gap Analysis", lane: "agent", type: "output" },
    { id: "h1", label: "Category Mgr Reviews", lane: "human", type: "hitl" },
  ],
  connections: [["s1", "a1"], ["a1", "a2"], ["a2", "a3"], ["a3", "h1"]],
};

const flow: FlowStep[] = [
  { label: "Cost Data Pull", icon: FileText, description: "BOM, routing, commodity indices, and labor rate benchmarks assembled from ERP and market feeds.", trigger: "Pre-negotiation", systems: ["SAP S/4HANA", "Commodity feeds"] },
  { label: "Parametric Regression", icon: Cpu, description: "Historical cost drivers modeled with confidence ranges — raw materials, labor, energy, freight.", systems: ["BigQuery", "Vertex AI"], integration: "ADK" },
  { label: "Spec Interpretation", icon: Brain, description: "Gemini reads engineering specs to map manufacturing processes to cost drivers and assess supplier premium justification.", systems: ["Vertex AI"] },
  { label: "Category Mgr Review", icon: CheckCircle, description: "Category Manager validates should-cost breakdown and gap narrative before supplier negotiation.", output: "Should-Cost Model" },
];

const architecture: AgentArchitecture = {
  connections: [
    { system: "SAP S/4HANA", description: "BOM structures, routing data, and historical cost breakdowns", direction: "read", protocol: "RFC/BAPI", category: "erp" },
    { system: "Commodity Price Feeds", description: "Current metal, polymer, energy, and freight indices", direction: "read", protocol: "REST API", category: "market-data" },
    { system: "Industry Benchmarks", description: "Labor rate benchmarks by geography and manufacturing process", direction: "read", protocol: "REST API", category: "market-data" },
    { system: "BigQuery", description: "Historical cost driver regression models and parametric analysis", direction: "bidirectional", protocol: "BigQuery SQL", category: "analytics" },
    { system: "Vertex AI (Gemini)", description: "Spec interpretation, cost driver mapping, and gap narrative generation", direction: "bidirectional", protocol: "gRPC", category: "ai" },
  ],
  pipeline: [
    { label: "Cost Data Assembly", description: "Pull BOM and routing data from SAP S/4HANA. Fetch current commodity indices from price feeds. Retrieve labor rate benchmarks by geography and process type.", systems: ["SAP S/4HANA", "Commodity Price Feeds", "Industry Benchmarks"], layer: "integration", dataIn: "BOM/routing from ERP + commodity indices + labor benchmarks", dataOut: "Unified cost input dataset by component and driver" },
    { label: "Parametric Cost Regression", description: "Historical cost driver regression on raw material indices, labor rates, energy, and freight. Clean-sheet cost buildup with confidence ranges. Monte Carlo simulation on cost scenarios.", systems: ["BigQuery ML"], layer: "ml", dataIn: "Historical costs and current market rates", dataOut: "Should-cost model with confidence ranges per component" },
    { label: "Spec Interpretation & Gap Narrative", description: "Gemini interprets engineering specifications to understand manufacturing processes and map them to cost drivers. When a supplier quote exceeds the should-cost, reasons about plausible explanations — capability premium vs. cost structure inefficiency. Generates negotiation-ready breakdown.", systems: ["Vertex AI (Gemini)"], layer: "llm", dataIn: "Engineering specs + should-cost model + supplier quote", dataOut: "Negotiation-ready should-cost breakdown with gap narrative" },
  ],
};


const behaviorContract: AgentBehaviorContract = {
  role: "Category Manager agent for the Should-Cost Modeler workflow",
  primaryObjective: "Gemini interprets engineering specs like 'investment casting with post-machining to 0.05mm tolerance' and maps them to specific cost drivers. LLM reasons about supplier premium justification — is it a capability premium or an inefficient cost structure? so the Category Manager can move the Model build time KPI.",
  inScope: [
    "Gemini interprets engineering specs like 'investment casting with post-machining to 0.05mm tolerance' and maps them to specific cost drivers",
    "LLM reasons about supplier premium justification — is it a capability premium or an inefficient cost structure?",
    "Generates negotiation-ready breakdowns that explain the gap in terms the supplier cannot dismiss",
  ],
  outOfScope: [
    "Contract execution without legal review",
    "Supplier disqualification decisions (category lead retains authority)",
    "Single-source justification overrides above policy threshold",
  ],
  toolIntents: [
    {
      name: "query_sap_s_4hana_bom_routing_sap_s_4hana_bom_routing_records",
      kind: "query",
      sourceSystemId: "sap_s_4hana_bom_routing",
      description: "Retrieve sap s 4hana bom routing records from SAP S/4HANA (BOM/routing) for the Should-Cost Modeler workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "sap_s_4hana_bom_routing_records_records",
        "sap_s_4hana_bom_routing_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_commodity_price_feeds_commodity_price_feeds_records",
      kind: "query",
      sourceSystemId: "commodity_price_feeds",
      description: "Retrieve commodity price feeds records from Commodity price feeds for the Should-Cost Modeler workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "commodity_price_feeds_records_records",
        "commodity_price_feeds_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_industry_benchmarks_industry_benchmarks_records",
      kind: "query",
      sourceSystemId: "industry_benchmarks",
      description: "Retrieve industry benchmarks records from Industry benchmarks for the Should-Cost Modeler workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "industry_benchmarks_records_records",
        "industry_benchmarks_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "lookup_should_cost_modeler_policy_guide",
      kind: "evidence_lookup",
      sourceSystemId: "sap_s_4hana_bom_routing",
      description: "Look up sections of the Should-Cost Modeler Procurement Policy Guide to cite in narrative output, escalation rationale, and audit evidence.",
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
      name: "action_sap_s_4hana_bom_routing_generate",
      kind: "action",
      sourceSystemId: "sap_s_4hana_bom_routing",
      description: "Execute the generate step in SAP S/4HANA (BOM/routing) after the agent has gathered evidence and validated escalation gates.",
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
      claim: "Model build time moved from 2-3 weeks toward 4 hours",
      mustCite: [
        "sap_s_4hana_bom_routing.sap_s_4hana_bom_routing_records",
        "commodity_price_feeds.commodity_price_feeds_records",
      ],
      sourceSystemIds: [
        "sap_s_4hana_bom_routing",
        "commodity_price_feeds",
      ],
    },
    {
      claim: "Cost driver coverage moved from Top 3 drivers toward 12+ drivers modeled",
      mustCite: [
        "sap_s_4hana_bom_routing.sap_s_4hana_bom_routing_records",
        "commodity_price_feeds.commodity_price_feeds_records",
      ],
      sourceSystemIds: [
        "sap_s_4hana_bom_routing",
        "commodity_price_feeds",
      ],
    },
  ],
  escalationRules: [
    {
      trigger: "Model build time regresses past the 2-3 weeks baseline by more than 20%",
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
    "Never fabricate metric values; only publish numbers derived from SAP S/4HANA (BOM/routing) (and other named systems) entities.",
    "Never bypass Category Manager approval on escalation triggers, even when confidence is high.",
    "Never expose individual personal data (PII) in summaries; aggregate or pseudonymise before output.",
    "Never act on data older than the staleness threshold defined in the runbook without a fresh re-query.",
  ],
  goldenEvals: [
    {
      id: "should-cost-modeler-end-to-end",
      prompt: "Run the Should-Cost Modeler workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.",
      expectedToolCalls: [
        "query_sap_s_4hana_bom_routing_sap_s_4hana_bom_routing_records",
        "query_commodity_price_feeds_commodity_price_feeds_records",
        "query_industry_benchmarks_industry_benchmarks_records",
        "lookup_should_cost_modeler_policy_guide",
        "action_sap_s_4hana_bom_routing_generate",
      ],
      mustReferenceEntities: [
        "sap_s_4hana_bom_routing_records",
        "commodity_price_feeds_records",
        "industry_benchmarks_records",
      ],
      mustCiteDocuments: [
        "should-cost-modeler-policy-guide",
      ],
      expectedActionOutcome: "Action generate executed against SAP S/4HANA (BOM/routing), with audit-trail entry and Category Manager notified of outcomes.",
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
    rationale: "Row counts sized for Should-Cost Modeler so the agent can demonstrate the workflow against realistic transactional volume without simulating a production warehouse.",
  },
  sourceSystems: [
    {
      id: "sap_s_4hana_bom_routing",
      name: "SAP S/4HANA (BOM/routing)",
      owns: [
        "sap_s_4hana_bom_routing_records",
        "sap_s_4hana_bom_routing_events",
        "sap_s_4hana_bom_routing_audit_trail",
      ],
      protocol: "RFC/BAPI",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_sap_s_4hana_bom_routing_sap_s_4hana_bom_routing_records",
        "query_sap_s_4hana_bom_routing_sap_s_4hana_bom_routing_events",
        "query_sap_s_4hana_bom_routing_sap_s_4hana_bom_routing_audit_trail",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
    {
      id: "commodity_price_feeds",
      name: "Commodity price feeds",
      owns: [
        "commodity_price_feeds_records",
        "commodity_price_feeds_events",
        "commodity_price_feeds_audit_trail",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_commodity_price_feeds_commodity_price_feeds_records",
        "query_commodity_price_feeds_commodity_price_feeds_events",
        "query_commodity_price_feeds_commodity_price_feeds_audit_trail",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
    {
      id: "industry_benchmarks",
      name: "Industry benchmarks",
      owns: [
        "industry_benchmarks_records",
        "industry_benchmarks_events",
        "industry_benchmarks_audit_trail",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_industry_benchmarks_industry_benchmarks_records",
        "query_industry_benchmarks_industry_benchmarks_events",
        "query_industry_benchmarks_industry_benchmarks_audit_trail",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
  ],
  entities: [
    {
      name: "sap_s_4hana_bom_routing_records",
      sourceSystemId: "sap_s_4hana_bom_routing",
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
      name: "sap_s_4hana_bom_routing_events",
      sourceSystemId: "sap_s_4hana_bom_routing",
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
          name: "sap_s_4hana_bom_routing_record_id",
          type: "ref",
          ref: "sap_s_4hana_bom_routing_records.id",
          required: true,
        },
      ],
    },
    {
      name: "sap_s_4hana_bom_routing_audit_trail",
      sourceSystemId: "sap_s_4hana_bom_routing",
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
      name: "commodity_price_feeds_records",
      sourceSystemId: "commodity_price_feeds",
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
      name: "commodity_price_feeds_events",
      sourceSystemId: "commodity_price_feeds",
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
          name: "commodity_price_feeds_record_id",
          type: "ref",
          ref: "commodity_price_feeds_records.id",
          required: true,
        },
      ],
    },
    {
      name: "commodity_price_feeds_audit_trail",
      sourceSystemId: "commodity_price_feeds",
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
      name: "industry_benchmarks_records",
      sourceSystemId: "industry_benchmarks",
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
      name: "industry_benchmarks_events",
      sourceSystemId: "industry_benchmarks",
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
          name: "industry_benchmarks_record_id",
          type: "ref",
          ref: "industry_benchmarks_records.id",
          required: true,
        },
      ],
    },
    {
      name: "industry_benchmarks_audit_trail",
      sourceSystemId: "industry_benchmarks",
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
      from: "sap_s_4hana_bom_routing_events.sap_s_4hana_bom_routing_record_id",
      to: "sap_s_4hana_bom_routing_records.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
    {
      from: "commodity_price_feeds_events.commodity_price_feeds_record_id",
      to: "commodity_price_feeds_records.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
    {
      from: "industry_benchmarks_events.industry_benchmarks_record_id",
      to: "industry_benchmarks_records.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
  ],
  documents: [
    {
      id: "should-cost-modeler-policy-guide",
      sourceSystemId: "sap_s_4hana_bom_routing",
      type: "policy",
      title: "Should-Cost Modeler Procurement Policy Guide",
      requiredSections: [
        "Sourcing principles",
        "Approval thresholds",
        "Supplier risk requirements",
        "Contract and compliance gates",
        "Exception handling",
      ],
      linkedEntities: [
        "sap_s_4hana_bom_routing_records",
        "sap_s_4hana_bom_routing_events",
        "sap_s_4hana_bom_routing_audit_trail",
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
      id: "sap_s_4hana_bom_routing_generate_api",
      sourceSystemId: "sap_s_4hana_bom_routing",
      method: "POST",
      path: "/api/sap_s_4hana_bom_routing/generate",
      description: "Synchronous endpoint the agent calls to generate in SAP S/4HANA (BOM/routing) after evidence gating.",
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
      id: "should-cost-modeler-baseline-gap",
      description: "Seed a realistic gap where Model build time sits between 2-3 weeks and 4 hours, so the agent can detect, narrate, and recommend remediation.",
      affectedEntities: [
        "sap_s_4hana_bom_routing_records",
        "sap_s_4hana_bom_routing_events",
      ],
      discoveryPath: [
        "Inspect SAP S/4HANA (BOM/routing) records for the affected entities",
        "Compare against Commodity price feeds historical baseline",
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
      database: "should_cost_modeler",
      schemas: [
        "sap_s_4hana_bom_routing",
        "commodity_price_feeds",
        "industry_benchmarks",
      ],
    },
    bigquery: {
      dataset: "procurement_should_cost_modeler",
      tables: [
        "kpi_summary",
        "evidence_index",
      ],
    },
    cloudStorage: {
      bucketSuffix: "should-cost-modeler-evidence",
      prefixes: [
        "documents",
        "audit-trails",
        "exports",
      ],
    },
    apis: {
      serviceName: "should-cost-modeler-source-adapters",
      deploymentTarget: "cloud_run",
    },
  },
  validation: {
    smokePrompt: "Run the Should-Cost Modeler workflow and cite source-system evidence for every claim.",
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

export const ShouldCostModeler = () => (
  <UseCaseSlide
    title="Should-Cost Modeler"
    subtitle="A-1203 • Strategic Sourcing"
    icon={Calculator}
    domainId="domain-12"
    layer="Layer 3: Custom ADK"
    persona="Category Manager"
    systems={["SAP S/4HANA (BOM/routing)", "Commodity price feeds", "Industry benchmarks", "Vertex AI"]}
    kpis={[
      { label: "Model build time", before: "2-3 weeks", after: "4 hours" },
      { label: "Cost driver coverage", before: "Top 3 drivers", after: "12+ drivers modeled" },
      { label: "Negotiation savings lift", before: "Baseline", after: "+4-7% incremental" },
    ]}
    triggerType="event"
    swimlane={swimlane}
    flow={flow}
    architecture={architecture}
    hitl={{ actor: "Category Manager", action: "Review should-cost model", description: "Category Manager validates cost breakdown assumptions, gap analysis narrative, and negotiation positioning before supplier engagement." }}
    statusQuo={[
      "Should-cost models built in Excel by category managers who manually research commodity prices and labor rates.",
      "Engineering specs are interpreted informally — procurement rarely understands manufacturing process cost implications.",
      "When a supplier quote exceeds the model by 30%, the team lacks data to explain why or push back credibly."
    ]}
    agentification={[
      "Gemini interprets engineering specs like 'investment casting with post-machining to 0.05mm tolerance' and maps them to specific cost drivers.",
      "LLM reasons about supplier premium justification — is it a capability premium or an inefficient cost structure?",
      "Generates negotiation-ready breakdowns that explain the gap in terms the supplier cannot dismiss."
    ]}
  />
);
