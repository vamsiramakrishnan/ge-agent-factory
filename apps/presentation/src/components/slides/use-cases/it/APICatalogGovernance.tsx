import React from "react";
import { UseCaseSlide } from "../../../agent/UseCaseSlide";
import { FlowStep } from "../../../agent/ProcessFlow";
import { SwimlaneFlow } from "../../../agent/SwimlaneFlow";
import { AgentArchitecture, UseCaseGenerationSpec, AgentBehaviorContract} from "../../../../types/architecture";
import { Globe, Database, FileText, AlertTriangle, CheckCircle } from "lucide-react";

const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "s1", label: "API Registered", lane: "system", type: "trigger" },
    { id: "a1", label: "Spec Analysis", lane: "agent", type: "action" },
    { id: "a2", label: "Compliance Check", lane: "agent", type: "action" },
    { id: "a3", label: "Catalog Updated", lane: "agent", type: "output" },
    { id: "h1", label: "Architect Reviews", lane: "human", type: "hitl" },
  ],
  connections: [["s1", "a1"], ["a1", "a2"], ["a2", "a3"], ["a3", "h1"]],
};

const flow: FlowStep[] = [
  { label: "API Ingestion", icon: Globe, description: "New API spec detected via webhook or weekly catalog scan across all services.", trigger: "Event / Weekly", systems: ["Apigee", "GitHub"] },
  { label: "Standards Check", icon: FileText, description: "Validates naming conventions, versioning, authentication, and design guidelines.", systems: ["Ardoq", "BigQuery"], integration: "ADK" },
  { label: "Usage & Impact", icon: Database, description: "Tracks consumer dependencies, usage patterns, and deprecation timelines.", systems: ["BigQuery", "Vertex AI"] },
  { label: "Governance Report", icon: CheckCircle, description: "Enterprise Architect reviews violations and approves remediation plans.", output: "API Governance Report" },
];

const architecture: AgentArchitecture = {
  connections: [
    { system: "Apigee", description: "API gateway catalog, traffic metrics, policy enforcement", direction: "bidirectional", protocol: "REST API", category: "erp" },
    { system: "GitHub", description: "OpenAPI specs, API code repositories, PR webhooks", direction: "read", protocol: "REST API", category: "erp" },
    { system: "Ardoq", description: "Architecture model, API-to-system mapping, standards", direction: "read", protocol: "REST API", category: "erp" },
    { system: "BigQuery", description: "API usage analytics, consumer dependency graph, compliance scores", direction: "bidirectional", protocol: "BigQuery SQL", category: "analytics" },
    { system: "Vertex AI (Gemini)", description: "API design review, naming convention analysis", direction: "bidirectional", protocol: "gRPC", category: "ai" },
  ],
  pipeline: [
    { label: "API Discovery", description: "Scan Apigee gateway and GitHub repos for new or modified OpenAPI specifications. Cross-reference with the architecture model in Ardoq.", systems: ["Apigee", "GitHub", "Ardoq"], layer: "integration", dataIn: "API registration event or weekly scan trigger", dataOut: "API inventory with spec details" },
    { label: "Compliance Analysis", description: "Check each API against enterprise design standards: naming conventions, versioning policy, authentication requirements, pagination patterns, and error response formats.", systems: ["BigQuery"], layer: "ml", dataIn: "API specs + enterprise standards", dataOut: "Compliance score + violation list" },
    { label: "Design Review", description: "Gemini reviews API design beyond mechanical checks — assessing resource naming clarity, nesting depth, backward compatibility, and consistency with related APIs.", systems: ["Vertex AI (Gemini)"], layer: "llm", dataIn: "API spec + related APIs + standards", dataOut: "Design review with specific recommendations" },
    { label: "Catalog Update", description: "Update API catalog with compliance status, consumer dependency map, and deprecation schedule. Notify API owners of violations.", systems: ["Apigee", "Ardoq"], layer: "integration", dataIn: "Reviewed API with compliance status", dataOut: "Updated catalog entry + owner notifications" },
  ],
};


const behaviorContract: AgentBehaviorContract = {
  role: "Enterprise Architect agent for the API Catalog & Governance workflow",
  primaryObjective: "Gemini reviews API designs for clarity, consistency, and backward compatibility — beyond mechanical linting. Automated compliance scanning catches violations at registration time, not after production deployment. so the Enterprise Architect can move the API compliance rate KPI.",
  inScope: [
    "Gemini reviews API designs for clarity, consistency, and backward compatibility — beyond mechanical linting",
    "Automated compliance scanning catches violations at registration time, not after production deployment",
    "Consumer dependency mapping makes deprecation safe with clear impact analysis before any change",
  ],
  outOfScope: [
    "Production deployments outside an approved change window",
    "Irreversible destructive actions on shared infrastructure (DROP, force-delete, key rotation)",
    "Security incident attribution requiring forensics",
  ],
  toolIntents: [
    {
      name: "query_apigee_apigee_records",
      kind: "query",
      sourceSystemId: "apigee",
      description: "Retrieve apigee records from Apigee for the API Catalog & Governance workflow.",
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
      name: "query_github_pull_requests",
      kind: "query",
      sourceSystemId: "github",
      description: "Retrieve pull requests from GitHub for the API Catalog & Governance workflow.",
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
      name: "query_ardoq_ardoq_records",
      kind: "query",
      sourceSystemId: "ardoq",
      description: "Retrieve ardoq records from Ardoq for the API Catalog & Governance workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "ardoq_records_records",
        "ardoq_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_bigquery_analytics_events",
      kind: "query",
      sourceSystemId: "bigquery",
      description: "Retrieve analytics events from BigQuery for the API Catalog & Governance workflow.",
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
      name: "lookup_api_catalog_governance_runbook",
      kind: "evidence_lookup",
      sourceSystemId: "bigquery",
      description: "Look up sections of the API Catalog & Governance Operations Runbook to cite in narrative output, escalation rationale, and audit evidence.",
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
      name: "action_apigee_deploy",
      kind: "action",
      sourceSystemId: "apigee",
      description: "Execute the deploy step in Apigee after the agent has gathered evidence and validated escalation gates.",
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
      claim: "API compliance rate moved from 62% toward 94%",
      mustCite: [
        "apigee.apigee_records",
        "github.pull_requests",
      ],
      sourceSystemIds: [
        "apigee",
        "github",
      ],
    },
    {
      claim: "Design review turnaround moved from 5 business days toward < 1 hour",
      mustCite: [
        "apigee.apigee_records",
        "github.pull_requests",
      ],
      sourceSystemIds: [
        "apigee",
        "github",
      ],
    },
  ],
  escalationRules: [
    {
      trigger: "API compliance rate regresses past the 62% baseline by more than 20%",
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
      trigger: "Proposed deploy action lacks supporting evidence from at least two systems",
      action: "refuse",
      rationale: "Single-system evidence is insufficient to authorize external state changes without manual review.",
    },
  ],
  refusalRules: [
    "Never fabricate metric values; only publish numbers derived from Apigee (and other named systems) entities.",
    "Never bypass Enterprise Architect approval on escalation triggers, even when confidence is high.",
    "Never expose individual personal data (PII) in summaries; aggregate or pseudonymise before output.",
    "Never act on data older than the staleness threshold defined in the runbook without a fresh re-query.",
  ],
  goldenEvals: [
    {
      id: "api-catalog-governance-end-to-end",
      prompt: "Run the API Catalog & Governance workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.",
      expectedToolCalls: [
        "query_apigee_apigee_records",
        "query_github_pull_requests",
        "query_ardoq_ardoq_records",
        "query_bigquery_analytics_events",
        "lookup_api_catalog_governance_runbook",
        "action_apigee_deploy",
      ],
      mustReferenceEntities: [
        "apigee_records",
        "pull_requests",
        "ardoq_records",
        "analytics_events",
      ],
      mustCiteDocuments: [
        "api-catalog-governance-runbook",
      ],
      expectedActionOutcome: "Action deploy executed against Apigee, with audit-trail entry and Enterprise Architect notified of outcomes.",
      forbiddenBehaviors: [
        "do not invent KPI numbers",
        "do not skip the evidence_lookup step before any recommendation",
        "do not execute deploy without two-system evidence",
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
    rationale: "Row counts sized for API Catalog & Governance so the agent can demonstrate the workflow against realistic transactional volume without simulating a production warehouse.",
  },
  sourceSystems: [
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
      id: "ardoq",
      name: "Ardoq",
      owns: [
        "ardoq_records",
        "ardoq_events",
        "ardoq_audit_trail",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_ardoq_ardoq_records",
        "query_ardoq_ardoq_events",
        "query_ardoq_ardoq_audit_trail",
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
      name: "ardoq_records",
      sourceSystemId: "ardoq",
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
      name: "ardoq_events",
      sourceSystemId: "ardoq",
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
          name: "ardoq_record_id",
          type: "ref",
          ref: "ardoq_records.id",
          required: true,
        },
      ],
    },
    {
      name: "ardoq_audit_trail",
      sourceSystemId: "ardoq",
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
      from: "ardoq_events.ardoq_record_id",
      to: "ardoq_records.id",
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
      id: "api-catalog-governance-runbook",
      sourceSystemId: "bigquery",
      type: "runbook",
      title: "API Catalog & Governance Operations Runbook",
      requiredSections: [
        "Detection signals",
        "Triage procedures",
        "Remediation actions",
        "Rollback criteria",
        "Post-incident review",
      ],
      linkedEntities: [
        "apigee_records",
        "apigee_events",
        "apigee_audit_trail",
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
      id: "apigee_deploy_api",
      sourceSystemId: "apigee",
      method: "POST",
      path: "/api/apigee/deploy",
      description: "Synchronous endpoint the agent calls to deploy in Apigee after evidence gating.",
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
      id: "api-catalog-governance-baseline-gap",
      description: "Seed a realistic gap where API compliance rate sits between 62% and 94%, so the agent can detect, narrate, and recommend remediation.",
      affectedEntities: [
        "apigee_records",
        "apigee_events",
      ],
      discoveryPath: [
        "Inspect Apigee records for the affected entities",
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
      database: "api_catalog_governance",
      schemas: [
        "apigee",
        "github",
        "ardoq",
      ],
    },
    bigquery: {
      dataset: "it_api_catalog_governance",
      tables: [
        "kpi_summary",
        "evidence_index",
      ],
    },
    cloudStorage: {
      bucketSuffix: "api-catalog-governance-evidence",
      prefixes: [
        "documents",
        "audit-trails",
        "exports",
      ],
    },
    apis: {
      serviceName: "api-catalog-governance-source-adapters",
      deploymentTarget: "cloud_run",
    },
  },
  validation: {
    smokePrompt: "Run the API Catalog & Governance workflow and cite source-system evidence for every claim.",
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

export const APICatalogGovernance = () => (
  <UseCaseSlide
    title="API Catalog & Governance"
    subtitle="A-4402 • Enterprise Architecture"
    icon={Globe}
    domainId="domain-44"
    layer="Layer 2: Agent Designer"
    persona="Enterprise Architect"
    systems={["Apigee", "GitHub", "Ardoq", "BigQuery", "Vertex AI"]}
    kpis={[
      { label: "API compliance rate", before: "62%", after: "94%" },
      { label: "Design review turnaround", before: "5 business days", after: "< 1 hour" },
      { label: "Undocumented APIs", before: "35% of catalog", after: "< 5%" },
    ]}
    triggerType="event"
    swimlane={swimlane}
    flow={flow}
    architecture={architecture}
    statusQuo={[
      "API catalog maintained manually in spreadsheets with outdated entries and missing documentation.",
      "Design reviews take days and only catch mechanical issues — naming and versioning violations ship to production.",
      "Consumer dependency tracking is nonexistent, making deprecation risky and breaking changes common."
    ]}
    agentification={[
      "Gemini reviews API designs for clarity, consistency, and backward compatibility — beyond mechanical linting.",
      "Automated compliance scanning catches violations at registration time, not after production deployment.",
      "Consumer dependency mapping makes deprecation safe with clear impact analysis before any change."
    ]}
  />
);
