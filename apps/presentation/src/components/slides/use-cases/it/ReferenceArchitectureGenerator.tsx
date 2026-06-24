import React from "react";
import { UseCaseSlide } from "../../../agent/UseCaseSlide";
import { FlowStep } from "../../../agent/ProcessFlow";
import { SwimlaneFlow } from "../../../agent/SwimlaneFlow";
import { AgentArchitecture, UseCaseGenerationSpec, AgentBehaviorContract} from "../../../../types/architecture";
import { Layout, Search, Database, Brain, FileText } from "lucide-react";

const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "s1", label: "Architect Asks", lane: "human", type: "trigger" },
    { id: "a1", label: "Requirements Parse", lane: "agent", type: "action" },
    { id: "a2", label: "Architecture Draft", lane: "agent", type: "action" },
    { id: "a3", label: "Proposal Ready", lane: "agent", type: "output" },
    { id: "h1", label: "Architect Refines", lane: "human", type: "hitl" },
  ],
  connections: [["s1", "a1"], ["a1", "a2"], ["a2", "a3"], ["a3", "h1"]],
};

const flow: FlowStep[] = [
  { label: "Requirements Capture", icon: Search, description: "Architect describes the system requirements — scale, reliability, security, and technology constraints.", trigger: "Chat", systems: ["Vertex AI"] },
  { label: "Pattern Retrieval", icon: Database, description: "Existing reference architectures, technology standards, and prior implementations retrieved.", systems: ["Confluence", "GitHub", "BigQuery"] },
  { label: "Architecture Generation", icon: Brain, description: "Reference architecture proposed with component selection, cost estimates, and scaling guidance.", systems: ["Vertex AI"] },
  { label: "Refinement", icon: FileText, description: "Architect refines the proposal and publishes as a reusable reference architecture.", output: "Reference Architecture" },
];

const architecture: AgentArchitecture = {
  connections: [
    { system: "Confluence", description: "Existing reference architectures, technology standards, design guidelines", direction: "bidirectional", protocol: "REST API", category: "collaboration" },
    { system: "GitHub", description: "Infrastructure templates, Terraform modules, prior implementations", direction: "read", protocol: "REST API", category: "erp" },
    { system: "LeanIX", description: "Technology radar, approved tech stack, lifecycle status", direction: "read", protocol: "REST API", category: "erp" },
    { system: "BigQuery", description: "Cost benchmarks, performance data from similar deployments", direction: "read", protocol: "BigQuery SQL", category: "analytics" },
    { system: "Vertex AI (Gemini)", description: "Architecture reasoning, cost estimation, component selection", direction: "bidirectional", protocol: "gRPC", category: "ai" },
  ],
  pipeline: [
    { label: "Requirements Understanding", description: "Parse requirements from natural language: target throughput, latency SLAs, availability targets, security requirements, team skill constraints, and budget parameters.", systems: ["Vertex AI (Gemini)"], layer: "llm", dataIn: "Natural language architecture requirements", dataOut: "Structured requirements specification" },
    { label: "Pattern & Precedent Retrieval", description: "Search Confluence for matching reference architectures, GitHub for infrastructure templates, and LeanIX for approved technology stack. Pull cost and performance data from similar deployments.", systems: ["Confluence", "GitHub", "LeanIX", "BigQuery"], layer: "integration", dataIn: "Structured requirements", dataOut: "Relevant patterns + templates + benchmarks" },
    { label: "Architecture Synthesis", description: "Gemini synthesizes a reference architecture from patterns, constraints, and benchmarks. Selects components from the approved tech stack, estimates costs at multiple scale points, and identifies operational requirements.", systems: ["Vertex AI (Gemini)"], layer: "llm", dataIn: "Patterns + constraints + benchmarks", dataOut: "Reference architecture with cost estimates" },
    { label: "Publication", description: "Package the reference architecture with component diagrams, cost projections, infrastructure templates, and operational runbooks. Publish to Confluence for reuse.", systems: ["Confluence"], layer: "integration", dataIn: "Approved reference architecture", dataOut: "Published reusable architecture" },
  ],
};


const behaviorContract: AgentBehaviorContract = {
  role: "Enterprise Architect agent for the Reference Architecture Generator workflow",
  primaryObjective: "Gemini retrieves relevant patterns, templates, and cost benchmarks from prior implementations. LLM reasons about component selection, trade-offs, and scaling characteristics based on real deployment data. so the Enterprise Architect can move the Architecture proposal time KPI.",
  inScope: [
    "Gemini retrieves relevant patterns, templates, and cost benchmarks from prior implementations",
    "LLM reasons about component selection, trade-offs, and scaling characteristics based on real deployment data",
    "Generates reference architectures in 30 minutes with cost estimates validated against similar deployments",
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
      description: "Retrieve pages from Confluence for the Reference Architecture Generator workflow.",
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
      name: "query_github_pull_requests",
      kind: "query",
      sourceSystemId: "github",
      description: "Retrieve pull requests from GitHub for the Reference Architecture Generator workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "pull_requests_records",
        "pull_requests_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_leanix_leanix_records",
      kind: "query",
      sourceSystemId: "leanix",
      description: "Retrieve leanix records from LeanIX for the Reference Architecture Generator workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "leanix_records_records",
        "leanix_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_bigquery_analytics_events",
      kind: "query",
      sourceSystemId: "bigquery",
      description: "Retrieve analytics events from BigQuery for the Reference Architecture Generator workflow.",
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
      name: "lookup_reference_architecture_generator_runbook",
      kind: "evidence_lookup",
      sourceSystemId: "confluence",
      description: "Look up sections of the Reference Architecture Generator Operations Runbook to cite in narrative output, escalation rationale, and audit evidence.",
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
      name: "action_confluence_generate",
      kind: "action",
      sourceSystemId: "confluence",
      description: "Execute the generate step in Confluence after the agent has gathered evidence and validated escalation gates.",
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
      claim: "Architecture proposal time moved from 1-2 weeks toward 30 minutes",
      mustCite: [
        "confluence.pages",
        "github.pull_requests",
      ],
      sourceSystemIds: [
        "confluence",
        "github",
      ],
    },
    {
      claim: "Cost estimation accuracy moved from +/- 50% guesswork toward +/- 15% benchmark-validated",
      mustCite: [
        "confluence.pages",
        "github.pull_requests",
      ],
      sourceSystemIds: [
        "confluence",
        "github",
      ],
    },
  ],
  escalationRules: [
    {
      trigger: "Architecture proposal time regresses past the 1-2 weeks baseline by more than 20%",
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
      trigger: "Proposed generate action lacks supporting evidence from at least two systems",
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
      id: "reference-architecture-generator-end-to-end",
      prompt: "Run the Reference Architecture Generator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.",
      expectedToolCalls: [
        "query_confluence_pages",
        "query_github_pull_requests",
        "query_leanix_leanix_records",
        "query_bigquery_analytics_events",
        "lookup_reference_architecture_generator_runbook",
        "action_confluence_generate",
      ],
      mustReferenceEntities: [
        "pages",
        "pull_requests",
        "leanix_records",
        "analytics_events",
      ],
      mustCiteDocuments: [
        "reference-architecture-generator-runbook",
      ],
      expectedActionOutcome: "Action generate executed against Confluence, with audit-trail entry and Enterprise Architect notified of outcomes.",
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
    rationale: "Row counts sized for Reference Architecture Generator so the agent can demonstrate the workflow against realistic transactional volume without simulating a production warehouse.",
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
      id: "github",
      name: "GitHub",
      owns: [
        "pull_requests",
        "commits",
        "workflow_runs",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_github_pull_requests",
        "query_github_commits",
        "query_github_workflow_runs",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
    {
      id: "leanix",
      name: "LeanIX",
      owns: [
        "leanix_records",
        "leanix_events",
        "leanix_audit_trail",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_leanix_leanix_records",
        "query_leanix_leanix_events",
        "query_leanix_leanix_audit_trail",
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
      name: "pull_requests",
      sourceSystemId: "github",
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
      name: "commits",
      sourceSystemId: "github",
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
      name: "workflow_runs",
      sourceSystemId: "github",
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
          type: "lorem.words",
          required: true,
        },
        {
          name: "status",
          type: "enum",
          values: [
            "pending",
            "running",
            "succeeded",
            "failed",
            "rolled_back",
          ],
          required: true,
        },
        {
          name: "duration_seconds",
          type: "number",
          min: 5,
          max: 7200,
          required: true,
        },
        {
          name: "started_at",
          type: "date",
          required: true,
        },
        {
          name: "environment",
          type: "enum",
          values: [
            "dev",
            "staging",
            "prod",
          ],
          required: true,
        },
      ],
    },
    {
      name: "leanix_records",
      sourceSystemId: "leanix",
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
      name: "leanix_events",
      sourceSystemId: "leanix",
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
          name: "leanix_record_id",
          type: "ref",
          ref: "leanix_records.id",
          required: true,
        },
      ],
    },
    {
      name: "leanix_audit_trail",
      sourceSystemId: "leanix",
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
      from: "leanix_events.leanix_record_id",
      to: "leanix_records.id",
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
      id: "reference-architecture-generator-runbook",
      sourceSystemId: "bigquery",
      type: "runbook",
      title: "Reference Architecture Generator Operations Runbook",
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
      id: "confluence_generate_api",
      sourceSystemId: "confluence",
      method: "POST",
      path: "/api/confluence/generate",
      description: "Synchronous endpoint the agent calls to generate in Confluence after evidence gating.",
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
      id: "reference-architecture-generator-baseline-gap",
      description: "Seed a realistic gap where Architecture proposal time sits between 1-2 weeks and 30 minutes, so the agent can detect, narrate, and recommend remediation.",
      affectedEntities: [
        "pages",
        "comments",
      ],
      discoveryPath: [
        "Inspect Confluence records for the affected entities",
        "Compare against GitHub historical baseline",
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
      database: "reference_architecture_generator",
      schemas: [
        "confluence",
        "github",
        "leanix",
      ],
    },
    bigquery: {
      dataset: "it_reference_architecture_generator",
      tables: [
        "kpi_summary",
        "evidence_index",
      ],
    },
    cloudStorage: {
      bucketSuffix: "reference-architecture-generator-evidence",
      prefixes: [
        "documents",
        "audit-trails",
        "exports",
      ],
    },
    apis: {
      serviceName: "reference-architecture-generator-source-adapters",
      deploymentTarget: "cloud_run",
    },
  },
  validation: {
    smokePrompt: "Run the Reference Architecture Generator workflow and cite source-system evidence for every claim.",
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

export const ReferenceArchitectureGenerator = () => (
  <UseCaseSlide
    title="Reference Architecture Generator"
    subtitle="A-4407 • Enterprise Architecture"
    icon={Layout}
    domainId="domain-44"
    layer="Layer 1: OOTB"
    persona="Enterprise Architect"
    systems={["Confluence", "GitHub", "LeanIX", "BigQuery", "Vertex AI"]}
    kpis={[
      { label: "Architecture proposal time", before: "1-2 weeks", after: "30 minutes" },
      { label: "Cost estimation accuracy", before: "+/- 50% guesswork", after: "+/- 15% benchmark-validated" },
      { label: "Pattern reuse rate", before: "30%", after: "75%" },
    ]}
    triggerType="chat"
    swimlane={swimlane}
    flow={flow}
    architecture={architecture}
    statusQuo={[
      "Reference architectures created from scratch for each project, ignoring existing patterns and templates.",
      "Cost estimates based on guesswork rather than data from similar prior deployments.",
      "Architecture proposals take 1-2 weeks, delaying project kickoffs and causing teams to build without guidance."
    ]}
    agentification={[
      "Gemini retrieves relevant patterns, templates, and cost benchmarks from prior implementations.",
      "LLM reasons about component selection, trade-offs, and scaling characteristics based on real deployment data.",
      "Generates reference architectures in 30 minutes with cost estimates validated against similar deployments."
    ]}
  />
);
