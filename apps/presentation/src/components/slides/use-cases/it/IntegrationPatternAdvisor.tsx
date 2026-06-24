import React from "react";
import { UseCaseSlide } from "../../../agent/UseCaseSlide";
import { FlowStep } from "../../../agent/ProcessFlow";
import { SwimlaneFlow } from "../../../agent/SwimlaneFlow";
import { AgentArchitecture, UseCaseGenerationSpec, AgentBehaviorContract} from "../../../../types/architecture";
import { Plug, Search, Database, Brain, FileText } from "lucide-react";

const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "s1", label: "Dev Asks", lane: "human", type: "trigger" },
    { id: "a1", label: "Pattern Lookup", lane: "agent", type: "action" },
    { id: "a2", label: "Fit Analysis", lane: "agent", type: "action" },
    { id: "a3", label: "Recommendation", lane: "agent", type: "output" },
    { id: "h1", label: "Dev Implements", lane: "human", type: "hitl" },
  ],
  connections: [["s1", "a1"], ["a1", "a2"], ["a2", "a3"], ["a3", "h1"]],
};

const flow: FlowStep[] = [
  { label: "Requirements Capture", icon: Search, description: "Developer describes the integration need — systems, volume, latency, and reliability requirements.", trigger: "Chat", systems: ["Slack", "Vertex AI"] },
  { label: "Pattern Matching", icon: Database, description: "Searches integration catalog for patterns matching the volume, latency, and reliability profile.", systems: ["Confluence", "BigQuery"] },
  { label: "Recommendation", icon: Brain, description: "Recommends the best-fit pattern with reference implementation and trade-off analysis.", systems: ["Vertex AI"] },
  { label: "Implementation Guide", icon: FileText, description: "Delivers pattern documentation with code examples from prior successful implementations.", output: "Integration Recommendation" },
];

const architecture: AgentArchitecture = {
  connections: [
    { system: "Confluence", description: "Integration pattern catalog, reference architectures, design guidelines", direction: "read", protocol: "REST API", category: "collaboration" },
    { system: "Apigee", description: "API gateway catalog, existing integration endpoints", direction: "read", protocol: "REST API", category: "erp" },
    { system: "Pub/Sub", description: "Event-driven integration topology, topic catalog", direction: "read", protocol: "REST API", category: "erp" },
    { system: "BigQuery", description: "Integration performance benchmarks, pattern usage analytics", direction: "read", protocol: "BigQuery SQL", category: "analytics" },
    { system: "Vertex AI (Gemini)", description: "Pattern recommendation reasoning, trade-off analysis", direction: "bidirectional", protocol: "gRPC", category: "ai" },
  ],
  pipeline: [
    { label: "Requirements Understanding", description: "Parse the developer's integration requirements — source and target systems, expected volume, latency SLA, reliability requirements, and data sensitivity classification.", systems: ["Vertex AI (Gemini)"], layer: "llm", dataIn: "Developer's natural language requirements", dataOut: "Structured integration requirements" },
    { label: "Pattern Retrieval", description: "Search the integration pattern catalog in Confluence, check Apigee for existing endpoints, and review Pub/Sub topology for event-driven options. Pull performance benchmarks from BigQuery.", systems: ["Confluence", "Apigee", "Pub/Sub", "BigQuery"], layer: "integration", dataIn: "Structured requirements", dataOut: "Candidate patterns with benchmarks" },
    { label: "Trade-off Analysis", description: "Gemini evaluates candidate patterns against requirements, considering operational complexity, cost, team expertise, and existing infrastructure. Provides recommendation with clear trade-offs.", systems: ["Vertex AI (Gemini)"], layer: "llm", dataIn: "Candidate patterns + requirements + context", dataOut: "Recommended pattern with trade-off rationale" },
    { label: "Guidance Delivery", description: "Package recommendation with reference implementation code from prior successful integrations, infrastructure requirements, and monitoring setup guidance.", systems: ["Confluence", "GitHub"], layer: "integration", dataIn: "Selected pattern + reference code", dataOut: "Implementation guide with code examples" },
  ],
};


const behaviorContract: AgentBehaviorContract = {
  role: "Enterprise Architect agent for the Integration Pattern Advisor workflow",
  primaryObjective: "Gemini understands integration requirements in natural language and matches against the full pattern catalog. LLM reasons about trade-offs between patterns — considering volume, latency, team expertise, and existing infrastructure. so the Enterprise Architect can move the Pattern selection time KPI.",
  inScope: [
    "Gemini understands integration requirements in natural language and matches against the full pattern catalog",
    "LLM reasons about trade-offs between patterns — considering volume, latency, team expertise, and existing infrastructure",
    "Delivers actionable recommendations with reference code from prior successful implementations",
  ],
  outOfScope: [
    "Production deployments outside an approved change window",
    "Irreversible destructive actions on shared infrastructure (DROP, force-delete, key rotation)",
    "Security incident attribution requiring forensics",
  ],
  toolIntents: [
    {
      name: "query_confluence_pages",
      kind: "query",
      sourceSystemId: "confluence",
      description: "Retrieve pages from Confluence for the Integration Pattern Advisor workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "pages_records",
        "pages_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_apigee_apigee_records",
      kind: "query",
      sourceSystemId: "apigee",
      description: "Retrieve apigee records from Apigee for the Integration Pattern Advisor workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "apigee_records_records",
        "apigee_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_pub_sub_pub_sub_records",
      kind: "query",
      sourceSystemId: "pub_sub",
      description: "Retrieve pub sub records from Pub/Sub for the Integration Pattern Advisor workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "pub_sub_records_records",
        "pub_sub_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_bigquery_analytics_events",
      kind: "query",
      sourceSystemId: "bigquery",
      description: "Retrieve analytics events from BigQuery for the Integration Pattern Advisor workflow.",
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
      name: "lookup_integration_pattern_advisor_runbook",
      kind: "evidence_lookup",
      sourceSystemId: "confluence",
      description: "Look up sections of the Integration Pattern Advisor Operations Runbook to cite in narrative output, escalation rationale, and audit evidence.",
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
      name: "action_confluence_recommend",
      kind: "action",
      sourceSystemId: "confluence",
      description: "Execute the recommend step in Confluence after the agent has gathered evidence and validated escalation gates.",
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
      claim: "Pattern selection time moved from 2-3 days research toward 5 minutes",
      mustCite: [
        "confluence.pages",
        "apigee.apigee_records",
      ],
      sourceSystemIds: [
        "confluence",
        "apigee",
      ],
    },
    {
      claim: "Standards compliance moved from 60% use approved patterns toward 90%+",
      mustCite: [
        "confluence.pages",
        "apigee.apigee_records",
      ],
      sourceSystemIds: [
        "confluence",
        "apigee",
      ],
    },
  ],
  escalationRules: [
    {
      trigger: "Pattern selection time regresses past the 2-3 days research baseline by more than 20%",
      action: "escalate_to_human",
      handoffTarget: "Enterprise Architect",
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
    "Never fabricate metric values; only publish numbers derived from Confluence (and other named systems) entities.",
    "Never bypass Enterprise Architect approval on escalation triggers, even when confidence is high.",
    "Never expose individual personal data (PII) in summaries; aggregate or pseudonymise before output.",
    "Never act on data older than the staleness threshold defined in the runbook without a fresh re-query.",
  ],
  goldenEvals: [
    {
      id: "integration-pattern-advisor-end-to-end",
      prompt: "Run the Integration Pattern Advisor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.",
      expectedToolCalls: [
        "query_confluence_pages",
        "query_apigee_apigee_records",
        "query_pub_sub_pub_sub_records",
        "query_bigquery_analytics_events",
        "lookup_integration_pattern_advisor_runbook",
        "action_confluence_recommend",
      ],
      mustReferenceEntities: [
        "pages",
        "apigee_records",
        "pub_sub_records",
        "analytics_events",
      ],
      mustCiteDocuments: [
        "integration-pattern-advisor-runbook",
      ],
      expectedActionOutcome: "Action recommend executed against Confluence, with audit-trail entry and Enterprise Architect notified of outcomes.",
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
    rationale: "Row counts sized for Integration Pattern Advisor so the agent can demonstrate the workflow against realistic transactional volume without simulating a production warehouse.",
  },
  sourceSystems: [
    {
      id: "confluence",
      name: "Confluence",
      owns: [
        "pages",
        "comments",
        "space_permissions",
      ],
      protocol: "REST API",
      localBacking: [
        "cloud-storage",
      ],
      toolNames: [
        "query_confluence_pages",
        "query_confluence_comments",
        "query_confluence_space_permissions",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
    {
      id: "apigee",
      name: "Apigee",
      owns: [
        "apigee_records",
        "apigee_events",
        "apigee_audit_trail",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_apigee_apigee_records",
        "query_apigee_apigee_events",
        "query_apigee_apigee_audit_trail",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
    {
      id: "pub_sub",
      name: "Pub/Sub",
      owns: [
        "pub_sub_records",
        "pub_sub_events",
        "pub_sub_audit_trail",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_pub_sub_pub_sub_records",
        "query_pub_sub_pub_sub_events",
        "query_pub_sub_pub_sub_audit_trail",
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
      name: "pages",
      sourceSystemId: "confluence",
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
      name: "comments",
      sourceSystemId: "confluence",
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
      name: "space_permissions",
      sourceSystemId: "confluence",
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
      name: "apigee_records",
      sourceSystemId: "apigee",
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
      name: "apigee_events",
      sourceSystemId: "apigee",
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
          name: "apigee_record_id",
          type: "ref",
          ref: "apigee_records.id",
          required: true,
        },
      ],
    },
    {
      name: "apigee_audit_trail",
      sourceSystemId: "apigee",
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
      name: "pub_sub_records",
      sourceSystemId: "pub_sub",
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
      name: "pub_sub_events",
      sourceSystemId: "pub_sub",
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
          name: "pub_sub_record_id",
          type: "ref",
          ref: "pub_sub_records.id",
          required: true,
        },
      ],
    },
    {
      name: "pub_sub_audit_trail",
      sourceSystemId: "pub_sub",
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
      from: "apigee_events.apigee_record_id",
      to: "apigee_records.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
    {
      from: "pub_sub_events.pub_sub_record_id",
      to: "pub_sub_records.id",
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
      id: "integration-pattern-advisor-runbook",
      sourceSystemId: "bigquery",
      type: "runbook",
      title: "Integration Pattern Advisor Operations Runbook",
      requiredSections: [
        "Detection signals",
        "Triage procedures",
        "Remediation actions",
        "Rollback criteria",
        "Post-incident review",
      ],
      linkedEntities: [
        "pages",
        "comments",
        "space_permissions",
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
      id: "confluence_recommend_api",
      sourceSystemId: "confluence",
      method: "POST",
      path: "/api/confluence/recommend",
      description: "Synchronous endpoint the agent calls to recommend in Confluence after evidence gating.",
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
      id: "integration-pattern-advisor-baseline-gap",
      description: "Seed a realistic gap where Pattern selection time sits between 2-3 days research and 5 minutes, so the agent can detect, narrate, and recommend remediation.",
      affectedEntities: [
        "pages",
        "comments",
      ],
      discoveryPath: [
        "Inspect Confluence records for the affected entities",
        "Compare against Apigee historical baseline",
        "Generate a citation-backed recommendation",
      ],
      expectedEvidence: [
        "source-system record",
        "historical baseline metric",
        "generated audit trail",
      ],
      expectedRecommendation: "Explain the gap, cite supporting evidence, and propose the next Enterprise Architect action.",
    },
  ],
  datastorePackaging: {
    alloydb: {
      database: "integration_pattern_advisor",
      schemas: [
        "confluence",
        "apigee",
        "pub_sub",
      ],
    },
    bigquery: {
      dataset: "it_integration_pattern_advisor",
      tables: [
        "kpi_summary",
        "evidence_index",
      ],
    },
    cloudStorage: {
      bucketSuffix: "integration-pattern-advisor-evidence",
      prefixes: [
        "documents",
        "audit-trails",
        "exports",
      ],
    },
    apis: {
      serviceName: "integration-pattern-advisor-source-adapters",
      deploymentTarget: "cloud_run",
    },
  },
  validation: {
    smokePrompt: "Run the Integration Pattern Advisor workflow and cite source-system evidence for every claim.",
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

export const IntegrationPatternAdvisor = () => (
  <UseCaseSlide
    title="Integration Pattern Advisor"
    subtitle="A-4405 • Enterprise Architecture"
    icon={Plug}
    domainId="domain-44"
    layer="Layer 1: OOTB"
    persona="Enterprise Architect"
    systems={["Confluence", "Apigee", "Pub/Sub", "BigQuery", "Vertex AI"]}
    kpis={[
      { label: "Pattern selection time", before: "2-3 days research", after: "5 minutes" },
      { label: "Standards compliance", before: "60% use approved patterns", after: "90%+" },
      { label: "Integration failures", before: "15% wrong pattern chosen", after: "< 3%" },
    ]}
    triggerType="chat"
    swimlane={swimlane}
    flow={flow}
    architecture={architecture}
    statusQuo={[
      "Developers choose integration patterns based on personal preference or copy-paste from the last project.",
      "Integration guidelines buried in long Confluence pages that nobody reads — violations found only in architecture review.",
      "Wrong pattern choices cause production issues: synchronous calls where async is needed, batch where real-time is required."
    ]}
    agentification={[
      "Gemini understands integration requirements in natural language and matches against the full pattern catalog.",
      "LLM reasons about trade-offs between patterns — considering volume, latency, team expertise, and existing infrastructure.",
      "Delivers actionable recommendations with reference code from prior successful implementations."
    ]}
  />
);
