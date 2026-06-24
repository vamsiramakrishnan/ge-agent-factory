import React from "react";
import { UseCaseSlide } from "../../../agent/UseCaseSlide";
import { FlowStep } from "../../../agent/ProcessFlow";
import { SwimlaneFlow } from "../../../agent/SwimlaneFlow";
import { AgentArchitecture, UseCaseGenerationSpec, AgentBehaviorContract} from "../../../../types/architecture";
import { Map, Database, Brain, GitBranch, CheckCircle } from "lucide-react";

const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "s1", label: "Quarterly Planning", lane: "system", type: "trigger" },
    { id: "a1", label: "Input Aggregation", lane: "agent", type: "action" },
    { id: "a2", label: "Sequencing Logic", lane: "agent", type: "action" },
    { id: "a3", label: "Roadmap Draft", lane: "agent", type: "output" },
    { id: "h1", label: "Director Reviews", lane: "human", type: "hitl" },
  ],
  connections: [["s1", "a1"], ["a1", "a2"], ["a2", "a3"], ["a3", "h1"]],
};

const flow: FlowStep[] = [
  { label: "Strategy Ingest", icon: Database, description: "Category strategy docs, savings pipeline, in-flight initiatives, and market intelligence aggregated.", trigger: "Quarterly", systems: ["Strategy docs", "BigQuery"] },
  { label: "Initiative Sequencing", icon: GitBranch, description: "Savings pipeline projection, resource loading analysis, and dependency mapping across initiatives.", systems: ["BigQuery"], integration: "ADK" },
  { label: "Roadmap Narrative", icon: Brain, description: "Gemini synthesizes strategy into phased roadmap: 'Consolidate supply base before renegotiating — volume leverage from 5 to 2 suppliers increases power by 12%.'", systems: ["Vertex AI"] },
  { label: "Director Approval", icon: CheckCircle, description: "Category Director validates phasing, dependencies, and resource commitments before stakeholder distribution.", output: "Category Roadmap" },
];

const architecture: AgentArchitecture = {
  connections: [
    { system: "Category Strategy Docs", description: "Approved category strategy documents with savings levers and risk assessments", direction: "read", protocol: "RAG Pipeline", category: "collaboration" },
    { system: "Savings Pipeline", description: "In-flight savings initiatives with status, targets, and realization data", direction: "read", protocol: "REST API", category: "analytics" },
    { system: "BigQuery", description: "Initiative timeline analysis, resource loading models, and pipeline projections", direction: "bidirectional", protocol: "BigQuery SQL", category: "analytics" },
    { system: "Market Intel Feeds", description: "Market dynamics that affect initiative timing and sequencing", direction: "read", protocol: "REST API", category: "market-data" },
    { system: "Vertex AI (Gemini)", description: "Sequencing reasoning, dependency analysis, and roadmap narrative generation", direction: "bidirectional", protocol: "gRPC", category: "ai" },
  ],
  pipeline: [
    { label: "Input Aggregation", description: "Aggregate inputs from category strategy documents, savings pipeline data, in-flight initiative status, and market intelligence feeds. Build unified view of category state and strategic context.", systems: ["Category Strategy Docs", "Savings Pipeline", "Market Intel Feeds"], layer: "integration", dataIn: "Strategy docs + pipeline data + market feeds", dataOut: "Unified category context with initiative inventory" },
    { label: "Pipeline Projection & Resource Analysis", description: "Savings pipeline projection with timeline modeling. Initiative sequencing based on dependencies and resource constraints. Resource loading analysis to identify capacity bottlenecks.", systems: ["BigQuery ML"], layer: "ml", dataIn: "Initiative inventory with resource requirements", dataOut: "Sequenced initiative timeline with resource heat map" },
    { label: "Roadmap Narrative Generation", description: "Gemini synthesizes strategy, initiatives, market dynamics, and stakeholder feedback into a phased roadmap narrative. Reasons about sequencing: 'Consolidate supply base before renegotiating — volume leverage from 5 to 2 suppliers increases power by 12%.' Identifies dependencies and risks in prose.", systems: ["Vertex AI (Gemini)"], layer: "llm", dataIn: "Sequenced timeline + market context + strategy objectives", dataOut: "Phased roadmap narrative with dependency analysis" },
  ],
};


const behaviorContract: AgentBehaviorContract = {
  role: "Category Director agent for the Category Roadmap Planner workflow",
  primaryObjective: "Gemini reasons about sequencing: 'Consolidate the supply base before renegotiating — the volume leverage from 5 to 2 suppliers adds 12% negotiation power.' LLM identifies dependencies and risks in narrative form that a Category Director can present to leadership — not just a Gantt chart. so the Category Director can move the Roadmap creation time KPI.",
  inScope: [
    "Gemini reasons about sequencing: 'Consolidate the supply base before renegotiating — the volume leverage from 5 to 2 suppliers adds 12% negotiation power.'",
    "LLM identifies dependencies and risks in narrative form that a Category Director can present to leadership — not just a Gantt chart",
    "Connects savings pipeline forecasts to initiative milestones, flagging where timing misalignment creates realization risk",
  ],
  outOfScope: [
    "Contract execution without legal review",
    "Supplier disqualification decisions (category lead retains authority)",
    "Single-source justification overrides above policy threshold",
  ],
  toolIntents: [
    {
      name: "query_category_strategy_docs_category_strategy_docs_records",
      kind: "query",
      sourceSystemId: "category_strategy_docs",
      description: "Retrieve category strategy docs records from Category strategy docs for the Category Roadmap Planner workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "category_strategy_docs_records_records",
        "category_strategy_docs_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_savings_pipeline_savings_pipeline_records",
      kind: "query",
      sourceSystemId: "savings_pipeline",
      description: "Retrieve savings pipeline records from Savings pipeline for the Category Roadmap Planner workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "savings_pipeline_records_records",
        "savings_pipeline_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_bigquery_analytics_events",
      kind: "query",
      sourceSystemId: "bigquery",
      description: "Retrieve analytics events from BigQuery for the Category Roadmap Planner workflow.",
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
      name: "lookup_category_roadmap_planner_policy_guide",
      kind: "evidence_lookup",
      sourceSystemId: "bigquery",
      description: "Look up sections of the Category Roadmap Planner Procurement Policy Guide to cite in narrative output, escalation rationale, and audit evidence.",
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
      name: "action_category_strategy_docs_create",
      kind: "action",
      sourceSystemId: "category_strategy_docs",
      description: "Execute the create step in Category strategy docs after the agent has gathered evidence and validated escalation gates.",
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
      claim: "Roadmap creation time moved from 3-4 weeks toward 3 days",
      mustCite: [
        "category_strategy_docs.category_strategy_docs_records",
        "savings_pipeline.savings_pipeline_records",
      ],
      sourceSystemIds: [
        "category_strategy_docs",
        "savings_pipeline",
      ],
    },
    {
      claim: "Initiative dependencies mapped moved from Informal toward Systematically tracked",
      mustCite: [
        "category_strategy_docs.category_strategy_docs_records",
        "savings_pipeline.savings_pipeline_records",
      ],
      sourceSystemIds: [
        "category_strategy_docs",
        "savings_pipeline",
      ],
    },
  ],
  escalationRules: [
    {
      trigger: "Roadmap creation time regresses past the 3-4 weeks baseline by more than 20%",
      action: "escalate_to_human",
      handoffTarget: "Category Director",
      rationale: "Significant regressions need human judgment before automated remediation runs against production records.",
    },
    {
      trigger: "Source-system evidence is incomplete or stale (>24h) for any required entity",
      action: "request_more_info",
      rationale: "Recommendations grounded in stale evidence misrepresent current state and undermine audit defensibility.",
    },
    {
      trigger: "Proposed create action lacks supporting evidence from at least two systems",
      action: "refuse",
      rationale: "Single-system evidence is insufficient to authorize external state changes without manual review.",
    },
  ],
  refusalRules: [
    "Never fabricate metric values; only publish numbers derived from Category strategy docs (and other named systems) entities.",
    "Never bypass Category Director approval on escalation triggers, even when confidence is high.",
    "Never expose individual personal data (PII) in summaries; aggregate or pseudonymise before output.",
    "Never act on data older than the staleness threshold defined in the runbook without a fresh re-query.",
  ],
  goldenEvals: [
    {
      id: "category-roadmap-planner-end-to-end",
      prompt: "Run the Category Roadmap Planner workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.",
      expectedToolCalls: [
        "query_category_strategy_docs_category_strategy_docs_records",
        "query_savings_pipeline_savings_pipeline_records",
        "query_bigquery_analytics_events",
        "lookup_category_roadmap_planner_policy_guide",
        "action_category_strategy_docs_create",
      ],
      mustReferenceEntities: [
        "category_strategy_docs_records",
        "savings_pipeline_records",
        "analytics_events",
      ],
      mustCiteDocuments: [
        "category-roadmap-planner-policy-guide",
      ],
      expectedActionOutcome: "Action create executed against Category strategy docs, with audit-trail entry and Category Director notified of outcomes.",
      forbiddenBehaviors: [
        "do not invent KPI numbers",
        "do not skip the evidence_lookup step before any recommendation",
        "do not execute create without two-system evidence",
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
    rationale: "Row counts sized for Category Roadmap Planner so the agent can demonstrate the workflow against realistic transactional volume without simulating a production warehouse.",
  },
  sourceSystems: [
    {
      id: "category_strategy_docs",
      name: "Category strategy docs",
      owns: [
        "category_strategy_docs_records",
        "category_strategy_docs_events",
        "category_strategy_docs_audit_trail",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_category_strategy_docs_category_strategy_docs_records",
        "query_category_strategy_docs_category_strategy_docs_events",
        "query_category_strategy_docs_category_strategy_docs_audit_trail",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
    {
      id: "savings_pipeline",
      name: "Savings pipeline",
      owns: [
        "savings_pipeline_records",
        "savings_pipeline_events",
        "savings_pipeline_audit_trail",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_savings_pipeline_savings_pipeline_records",
        "query_savings_pipeline_savings_pipeline_events",
        "query_savings_pipeline_savings_pipeline_audit_trail",
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
      name: "category_strategy_docs_records",
      sourceSystemId: "category_strategy_docs",
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
      name: "category_strategy_docs_events",
      sourceSystemId: "category_strategy_docs",
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
          name: "category_strategy_docs_record_id",
          type: "ref",
          ref: "category_strategy_docs_records.id",
          required: true,
        },
      ],
    },
    {
      name: "category_strategy_docs_audit_trail",
      sourceSystemId: "category_strategy_docs",
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
      name: "savings_pipeline_records",
      sourceSystemId: "savings_pipeline",
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
      name: "savings_pipeline_events",
      sourceSystemId: "savings_pipeline",
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
          name: "savings_pipeline_record_id",
          type: "ref",
          ref: "savings_pipeline_records.id",
          required: true,
        },
      ],
    },
    {
      name: "savings_pipeline_audit_trail",
      sourceSystemId: "savings_pipeline",
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
      from: "category_strategy_docs_events.category_strategy_docs_record_id",
      to: "category_strategy_docs_records.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
    {
      from: "savings_pipeline_events.savings_pipeline_record_id",
      to: "savings_pipeline_records.id",
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
      id: "category-roadmap-planner-policy-guide",
      sourceSystemId: "bigquery",
      type: "policy",
      title: "Category Roadmap Planner Procurement Policy Guide",
      requiredSections: [
        "Sourcing principles",
        "Approval thresholds",
        "Supplier risk requirements",
        "Contract and compliance gates",
        "Exception handling",
      ],
      linkedEntities: [
        "category_strategy_docs_records",
        "category_strategy_docs_events",
        "category_strategy_docs_audit_trail",
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
      id: "category_strategy_docs_create_api",
      sourceSystemId: "category_strategy_docs",
      method: "POST",
      path: "/api/category_strategy_docs/create",
      description: "Synchronous endpoint the agent calls to create in Category strategy docs after evidence gating.",
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
      id: "category-roadmap-planner-baseline-gap",
      description: "Seed a realistic gap where Roadmap creation time sits between 3-4 weeks and 3 days, so the agent can detect, narrate, and recommend remediation.",
      affectedEntities: [
        "category_strategy_docs_records",
        "category_strategy_docs_events",
      ],
      discoveryPath: [
        "Inspect Category strategy docs records for the affected entities",
        "Compare against Savings pipeline historical baseline",
        "Generate a citation-backed recommendation",
      ],
      expectedEvidence: [
        "source-system record",
        "historical baseline metric",
        "generated audit trail",
      ],
      expectedRecommendation: "Explain the gap, cite supporting evidence, and propose the next Category Director action.",
    },
  ],
  datastorePackaging: {
    alloydb: {
      database: "category_roadmap_planner",
      schemas: [
        "category_strategy_docs",
        "savings_pipeline",
      ],
    },
    bigquery: {
      dataset: "procurement_category_roadmap_planner",
      tables: [
        "kpi_summary",
        "evidence_index",
      ],
    },
    cloudStorage: {
      bucketSuffix: "category-roadmap-planner-evidence",
      prefixes: [
        "documents",
        "audit-trails",
        "exports",
      ],
    },
    apis: {
      serviceName: "category-roadmap-planner-source-adapters",
      deploymentTarget: "cloud_run",
    },
  },
  validation: {
    smokePrompt: "Run the Category Roadmap Planner workflow and cite source-system evidence for every claim.",
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

export const CategoryRoadmapPlanner = () => (
  <UseCaseSlide
    title="Category Roadmap Planner"
    subtitle="A-1210 • Strategic Sourcing"
    icon={Map}
    domainId="domain-12"
    layer="Layer 3: Custom ADK"
    persona="Category Director"
    systems={["Category strategy docs", "Savings pipeline", "BigQuery", "Vertex AI"]}
    kpis={[
      { label: "Roadmap creation time", before: "3-4 weeks", after: "3 days" },
      { label: "Initiative dependencies mapped", before: "Informal", after: "Systematically tracked" },
      { label: "Savings pipeline accuracy", before: "50-60% realized", after: "80%+ realized" },
    ]}
    triggerType="scheduled"
    swimlane={swimlane}
    flow={flow}
    architecture={architecture}
    hitl={{ actor: "Category Director", action: "Approve roadmap", description: "Category Director validates initiative phasing, resource requirements, dependency analysis, and savings projections before presenting to leadership." }}
    statusQuo={[
      "Category roadmaps are Gantt charts in PowerPoint that disconnect from the strategy document within weeks of creation.",
      "Initiative sequencing is based on calendar convenience, not strategic dependencies or leverage optimization.",
      "No systematic connection between savings pipeline projections and actual initiative timing or resource availability."
    ]}
    agentification={[
      "Gemini reasons about sequencing: 'Consolidate the supply base before renegotiating — the volume leverage from 5 to 2 suppliers adds 12% negotiation power.'",
      "LLM identifies dependencies and risks in narrative form that a Category Director can present to leadership — not just a Gantt chart.",
      "Connects savings pipeline forecasts to initiative milestones, flagging where timing misalignment creates realization risk."
    ]}
  />
);
