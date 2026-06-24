import React from "react";
import { UseCaseSlide } from "../../../agent/UseCaseSlide";
import { FlowStep } from "../../../agent/ProcessFlow";
import { SwimlaneFlow } from "../../../agent/SwimlaneFlow";
import { AgentArchitecture, UseCaseGenerationSpec, AgentBehaviorContract} from "../../../../types/architecture";
import { Layers, Search, Brain, ListChecks, Database } from "lucide-react";

const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "s1", label: "Feature Query", lane: "system", type: "trigger" },
    { id: "a1", label: "Catalog Search", lane: "agent", type: "action" },
    { id: "a2", label: "Reuse Analysis", lane: "agent", type: "action" },
    { id: "a3", label: "Feature Recommendations", lane: "agent", type: "output" },
    { id: "h1", label: "Engineer Selects", lane: "human", type: "hitl" },
  ],
  connections: [["s1", "a1"], ["a1", "a2"], ["a2", "a3"], ["a3", "h1"]],
};

const flow: FlowStep[] = [
  { label: "Feature Query", icon: Search, description: "Data scientist queries feature store for reusable features by model use case.", trigger: "Weekly + Chat", systems: ["Vertex AI Feature Store"] },
  { label: "Catalog Analysis", icon: Layers, description: "Feature usage, freshness, and redundancy analyzed across all models.", systems: ["BigQuery"], integration: "ADK" },
  { label: "Reuse Guidance", icon: Brain, description: "LLM recommends feature reuse opportunities and identifies redundant feature definitions.", systems: ["Vertex AI"] },
  { label: "Engineer Selection", icon: ListChecks, description: "ML Engineer selects recommended features and integrates into their model pipeline.", output: "Feature Set" },
];

const architecture: AgentArchitecture = {
  connections: [
    { system: "Vertex AI Feature Store", description: "Feature definitions, serving config, freshness metadata", direction: "bidirectional", protocol: "gRPC", category: "ai" },
    { system: "BigQuery", description: "Feature usage analytics, freshness tracking, redundancy analysis", direction: "bidirectional", protocol: "BigQuery SQL", category: "analytics" },
    { system: "Vertex AI (Gemini)", description: "Feature reuse recommendations, redundancy detection", direction: "bidirectional", protocol: "gRPC", category: "ai" },
  ],
  pipeline: [
    { label: "Feature Catalog Indexing", description: "Index all features in the feature store with metadata: definition, source, freshness SLA, owning team, and consuming models. Track feature lineage from raw data to serving.", systems: ["Vertex AI Feature Store"], layer: "integration", dataIn: "Feature definitions + metadata", dataOut: "Searchable feature catalog with lineage" },
    { label: "Usage & Freshness Analysis", description: "Analyze feature usage patterns across models. Identify stale features (unused >90 days), freshness SLA violations, and redundant definitions (same computation, different names).", systems: ["BigQuery"], layer: "ml", dataIn: "Feature catalog + model consumption data", dataOut: "Feature health metrics + redundancy report" },
    { label: "Reuse Recommendation", description: "Gemini guides data scientists to existing features for their use case — 'the churn model already has 23 customer features you can reuse.' Identifies opportunities to standardize redundant feature definitions.", systems: ["Vertex AI (Gemini)"], layer: "llm", dataIn: "User query + feature catalog + usage patterns", dataOut: "Recommended features with reuse guidance" },
    { label: "Lifecycle Management", description: "Track feature lifecycle — creation, adoption, staleness, deprecation. Manage access requests and coordinate feature retirement when no models consume a feature.", systems: ["Vertex AI Feature Store", "BigQuery"], layer: "integration", dataIn: "Feature health data", dataOut: "Lifecycle actions + access grants" },
  ],
};


const behaviorContract: AgentBehaviorContract = {
  role: "Data Platform Lead agent for the Feature Store Manager workflow",
  primaryObjective: "Gemini recommends reusable features when data scientists describe their model use case. LLM detects redundant feature definitions across teams and recommends consolidation. so the Data Platform Lead can move the Feature reuse rate KPI.",
  inScope: [
    "Gemini recommends reusable features when data scientists describe their model use case",
    "LLM detects redundant feature definitions across teams and recommends consolidation",
    "Automated lifecycle management tracks freshness, usage, and retirement for every feature",
  ],
  outOfScope: [
    "Production deployments outside an approved change window",
    "Irreversible destructive actions on shared infrastructure (DROP, force-delete, key rotation)",
    "Security incident attribution requiring forensics",
  ],
  toolIntents: [
    {
      name: "query_bigquery_analytics_events",
      kind: "query",
      sourceSystemId: "bigquery",
      description: "Retrieve analytics events from BigQuery for the Feature Store Manager workflow.",
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
      name: "query_it_2_it_2_records",
      kind: "query",
      sourceSystemId: "it_2",
      description: "Retrieve it 2 records from IT 2 for the Feature Store Manager workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "it_2_records_records",
        "it_2_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_it_3_it_3_records",
      kind: "query",
      sourceSystemId: "it_3",
      description: "Retrieve it 3 records from IT 3 for the Feature Store Manager workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "it_3_records_records",
        "it_3_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "lookup_feature_store_manager_runbook",
      kind: "evidence_lookup",
      sourceSystemId: "bigquery",
      description: "Look up sections of the Feature Store Manager Operations Runbook to cite in narrative output, escalation rationale, and audit evidence.",
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
      name: "action_it_2_recommend",
      kind: "action",
      sourceSystemId: "it_2",
      description: "Execute the recommend step in IT 2 after the agent has gathered evidence and validated escalation gates.",
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
      claim: "Feature reuse rate moved from 15% reused across models toward 60% with recommendations",
      mustCite: [
        "bigquery.analytics_events",
        "it_2.it_2_records",
      ],
      sourceSystemIds: [
        "bigquery",
        "it_2",
      ],
    },
    {
      claim: "Redundant features moved from Unknown count toward Identified and consolidated",
      mustCite: [
        "bigquery.analytics_events",
        "it_2.it_2_records",
      ],
      sourceSystemIds: [
        "bigquery",
        "it_2",
      ],
    },
  ],
  escalationRules: [
    {
      trigger: "Feature reuse rate regresses past the 15% reused across models baseline by more than 20%",
      action: "escalate_to_human",
      handoffTarget: "Data Platform Lead",
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
    "Never fabricate metric values; only publish numbers derived from BigQuery (and other named systems) entities.",
    "Never bypass Data Platform Lead approval on escalation triggers, even when confidence is high.",
    "Never expose individual personal data (PII) in summaries; aggregate or pseudonymise before output.",
    "Never act on data older than the staleness threshold defined in the runbook without a fresh re-query.",
  ],
  goldenEvals: [
    {
      id: "feature-store-manager-end-to-end",
      prompt: "Run the Feature Store Manager workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.",
      expectedToolCalls: [
        "query_bigquery_analytics_events",
        "query_it_2_it_2_records",
        "query_it_3_it_3_records",
        "lookup_feature_store_manager_runbook",
        "action_it_2_recommend",
      ],
      mustReferenceEntities: [
        "analytics_events",
        "it_2_records",
        "it_3_records",
      ],
      mustCiteDocuments: [
        "feature-store-manager-runbook",
      ],
      expectedActionOutcome: "Action recommend executed against IT 2, with audit-trail entry and Data Platform Lead notified of outcomes.",
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
    rationale: "Row counts sized for Feature Store Manager so the agent can demonstrate the workflow against realistic transactional volume without simulating a production warehouse.",
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
      id: "it_2",
      name: "IT 2",
      owns: [
        "it_2_records",
        "it_2_events",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_it_2_records",
      ],
      evidence: [
        "source_system_record",
      ],
    },
    {
      id: "it_3",
      name: "IT 3",
      owns: [
        "it_3_records",
        "it_3_events",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_it_3_records",
      ],
      evidence: [
        "source_system_record",
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
      name: "it_2_records",
      sourceSystemId: "it_2",
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
      name: "it_2_events",
      sourceSystemId: "it_2",
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
          name: "it_2_record_id",
          type: "ref",
          ref: "it_2_records.id",
          required: true,
        },
      ],
    },
    {
      name: "it_3_records",
      sourceSystemId: "it_3",
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
      name: "it_3_events",
      sourceSystemId: "it_3",
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
          name: "it_3_record_id",
          type: "ref",
          ref: "it_3_records.id",
          required: true,
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
      from: "it_2_events.it_2_record_id",
      to: "it_2_records.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
    {
      from: "it_3_events.it_3_record_id",
      to: "it_3_records.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
  ],
  documents: [
    {
      id: "feature-store-manager-runbook",
      sourceSystemId: "bigquery",
      type: "runbook",
      title: "Feature Store Manager Operations Runbook",
      requiredSections: [
        "Detection signals",
        "Triage procedures",
        "Remediation actions",
        "Rollback criteria",
        "Post-incident review",
      ],
      linkedEntities: [
        "analytics_events",
        "historical_metrics",
        "cached_aggregates",
      ],
      minimumWordCount: 500,
      citationAnchors: [
        "detection",
        "triage",
        "remediation",
        "rollback",
      ],
    },
  ],
  apis: [
    {
      id: "it_2_recommend_api",
      sourceSystemId: "it_2",
      method: "POST",
      path: "/api/it_2/recommend",
      description: "Synchronous endpoint the agent calls to recommend in IT 2 after evidence gating.",
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
      id: "feature-store-manager-baseline-gap",
      description: "Seed a realistic gap where Feature reuse rate sits between 15% reused across models and 60% with recommendations, so the agent can detect, narrate, and recommend remediation.",
      affectedEntities: [
        "analytics_events",
        "historical_metrics",
      ],
      discoveryPath: [
        "Inspect BigQuery records for the affected entities",
        "Compare against IT 2 historical baseline",
        "Generate a citation-backed recommendation",
      ],
      expectedEvidence: [
        "source-system record",
        "historical baseline metric",
        "generated audit trail",
      ],
      expectedRecommendation: "Explain the gap, cite supporting evidence, and propose the next Data Platform Lead action.",
    },
  ],
  datastorePackaging: {
    alloydb: {
      database: "feature_store_manager",
      schemas: [
        "it_2",
        "it_3",
      ],
    },
    bigquery: {
      dataset: "it_feature_store_manager",
      tables: [
        "kpi_summary",
        "evidence_index",
      ],
    },
    cloudStorage: {
      bucketSuffix: "feature-store-manager-evidence",
      prefixes: [
        "documents",
        "audit-trails",
        "exports",
      ],
    },
    apis: {
      serviceName: "feature-store-manager-source-adapters",
      deploymentTarget: "cloud_run",
    },
  },
  validation: {
    smokePrompt: "Run the Feature Store Manager workflow and cite source-system evidence for every claim.",
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

export const FeatureStoreManager = () => (
  <UseCaseSlide
    title="Feature Store Manager"
    subtitle="IT6-04 • Data & AI Platform"
    icon={Database}
    domainId="domain-43"
    layer="Layer 3: Custom ADK"
    persona="Data Platform Lead"
    systems={["Vertex AI Feature Store", "BigQuery", "Vertex AI"]}
    kpis={[
      { label: "Feature reuse rate", before: "15% reused across models", after: "60% with recommendations" },
      { label: "Redundant features", before: "Unknown count", after: "Identified and consolidated" },
      { label: "Feature discovery time", before: "Days of asking around", after: "Minutes via search" },
    ]}
    triggerType="scheduled"
    swimlane={swimlane}
    flow={flow}
    architecture={architecture}
    hitl={{ actor: "ML Engineer", action: "Select features for model", description: "Engineer reviews recommended features, validates fitness for their use case, and integrates into their model training pipeline." }}
    statusQuo={[
      "Data scientists recreate features from scratch because they don't know what already exists.",
      "Feature definitions duplicated across teams with inconsistent computation logic.",
      "Feature freshness and staleness not monitored, leading to models using stale data.",
    ]}
    agentification={[
      "Gemini recommends reusable features when data scientists describe their model use case.",
      "LLM detects redundant feature definitions across teams and recommends consolidation.",
      "Automated lifecycle management tracks freshness, usage, and retirement for every feature.",
    ]}
  />
);
